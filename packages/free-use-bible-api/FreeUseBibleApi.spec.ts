import { FreeUseBibleApi, VerseReference } from './FreeUseBibleApi.js';
import type {
    ApiCommentaryBook,
    ApiCommentaryBookChapter,
    ApiDatasetBook,
    ApiDatasetBookChapter,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ChapterVerse,
} from './types.gen.js';

describe('FreeUseBibleApi', () => {
    let fetchMock: jest.Mock;

    beforeEach(() => {
        fetchMock = jest.fn();
        global.fetch = fetchMock as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    function jsonResponse(data: unknown, status = 200, statusText = 'OK') {
        return {
            status,
            statusText,
            json: jest.fn().mockResolvedValue(data),
        } as unknown as Response;
    }

    it('requests available translations from the default endpoint', async () => {
        const payload = { translations: [{ id: 'BSB' }] };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        const result = await api.getAvailableTranslations();

        expect(result).toEqual(payload);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/available_translations.json'
        );
    });

    it('builds encoded chapter URLs and supports endpoint override per call', async () => {
        const payload = { chapter: { number: 1 } };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        await api.getTranslationBookChapter(
            'My Translation',
            'GEN/Intro',
            '1',
            'https://example.com/base/'
        );

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.com/base/api/My%20Translation/GEN%2FIntro/1.json'
        );
    });

    it('caches repeated requests by default', async () => {
        const payload = { translations: [{ id: 'KJV' }] };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        const [first, second] = await Promise.all([
            api.getAvailableTranslations(),
            api.getAvailableTranslations(),
        ]);

        expect(first).toEqual(payload);
        expect(second).toEqual(payload);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('disables cache when useCache is false', async () => {
        fetchMock
            .mockResolvedValueOnce(
                jsonResponse({ translations: [{ id: 'A' }] })
            )
            .mockResolvedValueOnce(
                jsonResponse({ translations: [{ id: 'B' }] })
            );

        const api = new FreeUseBibleApi({ useCache: false });
        await api.getAvailableTranslations();
        await api.getAvailableTranslations();

        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('does not cache complete translation responses', async () => {
        fetchMock
            .mockResolvedValueOnce(jsonResponse({ books: [] }))
            .mockResolvedValueOnce(jsonResponse({ books: [] }));

        const api = new FreeUseBibleApi();
        await api.getCompleteTranslation('BSB');
        await api.getCompleteTranslation('BSB');

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            'https://bible.helloao.org/api/BSB/complete.json'
        );
    });

    it('throws on non-2xx responses and retries after a failure', async () => {
        fetchMock
            .mockResolvedValueOnce(
                jsonResponse({ message: 'fail' }, 500, 'Server Error')
            )
            .mockResolvedValueOnce(
                jsonResponse({ translations: [{ id: 'OK' }] })
            );

        const api = new FreeUseBibleApi();

        await expect(api.getAvailableTranslations()).rejects.toThrow(
            'Failed request to https://bible.helloao.org/api/available_translations.json. Status: 500 Server Error'
        );

        const retry = await api.getAvailableTranslations();
        expect(retry.translations[0].id).toBe('OK');
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('gets next and previous chapters when links are present', async () => {
        const nextPayload = { chapter: { number: 2 } };
        const prevPayload = { chapter: { number: 1 } };
        fetchMock
            .mockResolvedValueOnce(jsonResponse(nextPayload))
            .mockResolvedValueOnce(jsonResponse(prevPayload));

        const api = new FreeUseBibleApi();
        const chapter = {
            nextChapterApiLink: 'https://bible.helloao.org/api/BSB/GEN/2.json',
            previousChapterApiLink:
                'https://bible.helloao.org/api/BSB/GEN/1.json',
        } as ApiTranslationBookChapter;

        const next = await api.getNextChapter(chapter);
        const prev = await api.getPreviousChapter(chapter);

        expect(next).toEqual(nextPayload);
        expect(prev).toEqual(prevPayload);
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            'https://bible.helloao.org/api/BSB/GEN/2.json'
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            'https://bible.helloao.org/api/BSB/GEN/1.json'
        );
    });

    it('returns null for next/previous chapter when links are missing', async () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            nextChapterApiLink: null,
            previousChapterApiLink: null,
        } as ApiDatasetBookChapter;

        await expect(api.getNextChapter(chapter)).resolves.toBeNull();
        await expect(api.getPreviousChapter(chapter)).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('gets first and last chapter for translation books', async () => {
        const firstPayload = { chapter: { number: 1 } };
        const lastPayload = { chapter: { number: 50 } };
        fetchMock
            .mockResolvedValueOnce(jsonResponse(firstPayload))
            .mockResolvedValueOnce(jsonResponse(lastPayload));

        const api = new FreeUseBibleApi();
        const book = {
            firstChapterApiLink: 'https://bible.helloao.org/api/BSB/GEN/1.json',
            lastChapterApiLink: 'https://bible.helloao.org/api/BSB/GEN/50.json',
        } as ApiTranslationBook;

        const first = await api.getFirstChapter(book);
        const last = await api.getLastChapter(book);

        expect(first).toEqual(firstPayload);
        expect(last).toEqual(lastPayload);
    });

    it('returns null first/last chapter for commentary books with no chapters', async () => {
        const api = new FreeUseBibleApi();
        const book = {
            firstChapterApiLink: null,
            lastChapterApiLink: null,
        } as ApiCommentaryBook;

        await expect(api.getFirstChapter(book)).resolves.toBeNull();
        await expect(api.getLastChapter(book)).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('gets first and last chapter for dataset books', async () => {
        const firstPayload = { chapter: { number: 1 } };
        const lastPayload = { chapter: { number: 10 } };
        fetchMock
            .mockResolvedValueOnce(jsonResponse(firstPayload))
            .mockResolvedValueOnce(jsonResponse(lastPayload));

        const api = new FreeUseBibleApi();
        const book = {
            firstChapterApiLink:
                'https://bible.helloao.org/api/d/cross_refs/JHN/1.json',
            lastChapterApiLink:
                'https://bible.helloao.org/api/d/cross_refs/JHN/10.json',
        } as ApiDatasetBook;

        const first = await api.getFirstChapter(book);
        const last = await api.getLastChapter(book);

        expect(first).toEqual(firstPayload);
        expect(last).toEqual(lastPayload);
    });

    it('gets a commentary chapter and dataset chapter using dedicated methods', async () => {
        const commentaryPayload = { chapter: { number: 1 } };
        const datasetPayload = { chapter: { number: 3 } };
        fetchMock
            .mockResolvedValueOnce(jsonResponse(commentaryPayload))
            .mockResolvedValueOnce(jsonResponse(datasetPayload));

        const api = new FreeUseBibleApi();

        const commentary = await api.getCommentaryBookChapter(
            'matthew_henry',
            'GEN',
            1
        );
        const dataset = await api.getDatasetBookChapter('cross_refs', 'JHN', 3);

        expect(commentary).toEqual(
            commentaryPayload as ApiCommentaryBookChapter
        );
        expect(dataset).toEqual(datasetPayload as ApiDatasetBookChapter);
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            'https://bible.helloao.org/api/matthew_henry/GEN/1.json'
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            'https://bible.helloao.org/api/d/cross_refs/JHN/3.json'
        );
    });

    it('getVerseText concatenates string parts', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 1,
            content: ['In ', 'the ', 'beginning'],
        } as ChapterVerse;

        const text = api.getVerseText(verse);
        expect(text).toBe('In the beginning');
    });

    it('getVerseText supports formatted text parts', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 1,
            content: ['Hello ', { text: 'world', wordsOfJesus: true }, '!'],
        } as ChapterVerse;

        const text = api.getVerseText(verse);
        expect(text).toBe('Hello world!');
    });

    it('getVerseText adds new lines for line breaks', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 1,
            content: ['Line 1', { lineBreak: true }, 'Line 2'],
        } as ChapterVerse;

        const text = api.getVerseText(verse);
        expect(text).toBe('Line 1\nLine 2');
    });

    it('getVerseText renders poem formatted text on separate indented lines', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 1,
            content: [
                'Prelude',
                { text: 'Poem line one', poem: 1 },
                { text: 'Poem line two', poem: 2 },
            ],
        } as ChapterVerse;

        const text = api.getVerseText(verse);
        expect(text).toBe('Prelude\n\tPoem line one\n\t\tPoem line two');
    });

    it('getVerseText renders proper spacing between notes', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 1,
            content: [
                'And God said, “Let there be an expanse',
                {
                    noteId: 2,
                },
                'between the waters, to separate the waters from the waters.”',
            ],
        } as ChapterVerse;

        const text = api.getVerseText(verse);
        expect(text).toBe(
            'And God said, “Let there be an expanse between the waters, to separate the waters from the waters.”'
        );
    });

    it('getChapterVerseText includes verse numbers by default', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            chapter: {
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        content: ['In the beginning'],
                    },
                    {
                        type: 'verse',
                        number: 2,
                        content: ['And the earth was formless'],
                    },
                ],
            },
        } as ApiTranslationBookChapter;

        const text = api.getChapterVerseText(chapter);
        expect(text).toBe(
            '[1] In the beginning [2] And the earth was formless'
        );
    });

    it('getChapterVerseText omits verse numbers when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            chapter: {
                content: [
                    {
                        type: 'verse',
                        number: 3,
                        content: ['Then God said'],
                    },
                ],
            },
        } as ApiTranslationBookChapter;

        const text = api.getChapterVerseText(chapter, {
            omitVerseNumbers: true,
        });
        expect(text).toBe('Then God said');
    });

    it('getChapterVerseText ignores non-verse chapter content', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            chapter: {
                content: [
                    {
                        type: 'heading',
                        content: ['The Creation'],
                    },
                    {
                        type: 'line_break',
                    },
                    {
                        type: 'verse',
                        number: 1,
                        content: ['In the beginning'],
                    },
                ],
            },
        } as ApiTranslationBookChapter;

        const text = api.getChapterVerseText(chapter);
        expect(text).toBe('[1] In the beginning');
    });

    it('getChapterVerseText keeps per-verse formatting from getVerseText', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            chapter: {
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        content: [
                            'Prelude',
                            { text: 'Poem line one', poem: 1 },
                            { lineBreak: true },
                            'End',
                        ],
                    },
                ],
            },
        } as ApiTranslationBookChapter;

        const text = api.getChapterVerseText(chapter);
        expect(text).toBe('[1] Prelude\n\tPoem line one\nEnd');
    });

    it('getChapterVerseText renders line_break objects', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            chapter: {
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        content: ['First line'],
                    },
                    {
                        type: 'line_break',
                    },
                    {
                        type: 'verse',
                        number: 2,
                        content: ['Second line'],
                    },
                ],
            },
        } as ApiTranslationBookChapter;

        const text = api.getChapterVerseText(chapter);
        expect(text).toBe('[1] First line\n[2] Second line');
    });

    const formatReferenceBook = {
        id: 'GEN',
        name: 'Genesis',
        commonName: 'Genesis',
        title: null,
        order: 1,
        numberOfChapters: 50,
        totalNumberOfVerses: 1533,
    } as ApiTranslationBook;

    const formatReferenceTestCases: [string, VerseReference, string][] = [
        [
            'formats a simple verse reference',
            {
                chapter: 1,
                verse: 1,
            },
            'Genesis 1:1',
        ],
        [
            'formats a verse reference with an end verse',
            {
                chapter: 1,
                verse: 3,
                endVerse: 5,
            },
            'Genesis 1:3-5',
        ],
        [
            'formats a verse reference with only a chapter',
            {
                chapter: 2,
            },
            'Genesis 2',
        ],
        [
            'formats a verse reference with a chapter range',
            {
                chapter: 2,
                endChapter: 3,
            },
            'Genesis 2-3',
        ],
        [
            'prefers endChapter over endVerse when both are present',
            {
                chapter: 2,
                endChapter: 3,
                verse: 6,
                endVerse: 5,
            },
            'Genesis 2-3',
        ],
    ];

    it('formatReference should format a verse reference correctly', () => {
        const api = new FreeUseBibleApi();

        const reference: VerseReference = {
            chapter: 1,
            verse: 3,
            endVerse: 5,
        };

        const formatted = api.formatReference(formatReferenceBook, reference);
        expect(formatted).toBe('Genesis 1:3-5');
    });

    it.each(formatReferenceTestCases)(
        'formatReference %s',
        (_description, reference, expected) => {
            const api = new FreeUseBibleApi();
            const formatted = api.formatReference(
                formatReferenceBook,
                reference
            );
            expect(formatted).toBe(expected);
        }
    );
});
