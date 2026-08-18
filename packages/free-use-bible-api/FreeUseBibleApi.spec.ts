import { FreeUseBibleApi, VerseReference } from './FreeUseBibleApi.js';
import type {
    ApiCommentaryBook,
    ApiCommentaryBookChapter,
    ApiDatasetBook,
    ApiDatasetBookChapter,
    ApiSimpleCommentaryBookChapter,
    ApiSimpleTranslationBookChapter,
    ApiSimpleTranslationBookChapterWords,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBookChapterWords,
    ChapterVerse,
    SimpleChapterVerse,
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
            'https://bible.helloao.org/api/c/matthew_henry/GEN/1.json'
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

    const getChapterVerseTextBook: ApiTranslationBook = {
        id: 'GEN',
        name: 'Genesis',
        commonName: 'Genesis',
        title: null,
        order: 1,
        numberOfChapters: 50,
        totalNumberOfVerses: 1533,
        firstChapterApiLink: 'https://bible.helloao.org/api/BSB/GEN/1.json',
        firstChapterReference: {
            translationId: 'BSB',
            book: 'GEN',
            chapter: 1,
        },
        lastChapterApiLink: 'https://bible.helloao.org/api/BSB/GEN/50.json',
        lastChapterReference: {
            translationId: 'BSB',
            book: 'GEN',
            chapter: 50,
        },
        firstChapterNumber: 1,
        lastChapterNumber: 50,
    };

    it('getChapterVerseText includes verse numbers by default', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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
            'Genesis 1\n[1] In the beginning [2] And the earth was formless'
        );
    });

    it('getChapterVerseText omits verse numbers when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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
        expect(text).toBe('Genesis 1\nThen God said');
    });

    it('getChapterVerseText ignores non-verse chapter content', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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
        expect(text).toBe('Genesis 1\n[1] In the beginning');
    });

    it('getChapterVerseText keeps per-verse formatting from getVerseText', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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
        expect(text).toBe('Genesis 1\n[1] Prelude\n\tPoem line one\nEnd');
    });

    it('getChapterVerseText renders line_break objects', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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
        expect(text).toBe('Genesis 1\n[1] First line\n[2] Second line');
    });

    it('getChapterVerseText omits reference when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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

        const text = api.getChapterVerseText(chapter, { omitReference: true });
        expect(text).toBe('[1] First line\n[2] Second line');
    });

    it('getChapterVerseText omits both reference and verse numbers when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
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

        const text = api.getChapterVerseText(chapter, {
            omitReference: true,
            omitVerseNumbers: true,
        });
        expect(text).toBe('First line\nSecond line');
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

    // In the beginning was the Word
    // 0  3   7             21  25
    const wordsVerse = {
        type: 'verse',
        number: 1,
        content: ['In the beginning was the Word'],
    } as ChapterVerse;

    const wordsPayload = {
        translationId: 'engwebp',
        bookId: 'JHN',
        chapterNumber: 1,
        verses: {
            '1': [
                { contentIndex: 0, start: 0, end: 2, strongs: ['G1722'] },
                { contentIndex: 0, start: 3, end: 6, strongs: ['G1722'] },
                { contentIndex: 0, start: 7, end: 16, strongs: ['G0746'] },
            ],
        },
    } as unknown as ApiTranslationBookChapterWords;

    it('requests the words for a chapter', async () => {
        fetchMock.mockResolvedValue(jsonResponse(wordsPayload));

        const api = new FreeUseBibleApi();
        const result = await api.getTranslationBookChapterWords(
            'engwebp',
            'JHN',
            1
        );

        expect(result).toEqual(wordsPayload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/engwebp/JHN/1.words.json'
        );
    });

    it('builds encoded words URLs and supports endpoint override per call', async () => {
        fetchMock.mockResolvedValue(jsonResponse(wordsPayload));

        const api = new FreeUseBibleApi();
        await api.getTranslationBookChapterWords(
            'My Translation',
            'GEN/Intro',
            '1',
            'https://example.com/base/'
        );

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.com/base/api/My%20Translation/GEN%2FIntro/1.words.json'
        );
    });

    it('gets the words for a chapter by following its words link', async () => {
        fetchMock.mockResolvedValue(jsonResponse(wordsPayload));

        const api = new FreeUseBibleApi();
        const chapter = {
            thisChapterWordsLink:
                'https://bible.helloao.org/api/engwebp/JHN/1.words.json',
        } as ApiTranslationBookChapter;

        const words = await api.getChapterWords(chapter);

        expect(words).toEqual(wordsPayload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/engwebp/JHN/1.words.json'
        );
    });

    it('returns null words for chapters that have no annotations', async () => {
        const api = new FreeUseBibleApi();
        const chapter = {} as ApiTranslationBookChapter;

        await expect(api.getChapterWords(chapter)).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('getWordText slices the annotated word out of a string', () => {
        const api = new FreeUseBibleApi();

        expect(
            api.getWordText(wordsVerse, {
                contentIndex: 0,
                start: 7,
                end: 16,
            })
        ).toBe('beginning');
    });

    it('getWordText slices the annotated word out of formatted text', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 38,
            content: [
                'Jesus said,',
                { text: '“What are you looking for?”', wordsOfJesus: true },
            ],
        } as ChapterVerse;

        expect(
            api.getWordText(verse, { contentIndex: 1, start: 1, end: 5 })
        ).toBe('What');
    });

    it('getWordText returns an empty string for content that has no text', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 1,
            content: [{ noteId: 2 }, { lineBreak: true }],
        } as ChapterVerse;

        expect(
            api.getWordText(verse, { contentIndex: 0, start: 0, end: 2 })
        ).toBe('');
        expect(
            api.getWordText(verse, { contentIndex: 1, start: 0, end: 2 })
        ).toBe('');
        expect(
            api.getWordText(verse, { contentIndex: 5, start: 0, end: 2 })
        ).toBe('');
    });

    it('getVerseWords pairs each annotation with its text', () => {
        const api = new FreeUseBibleApi();

        expect(api.getVerseWords(wordsVerse, wordsPayload)).toEqual([
            {
                contentIndex: 0,
                start: 0,
                end: 2,
                strongs: ['G1722'],
                text: 'In',
            },
            {
                contentIndex: 0,
                start: 3,
                end: 6,
                strongs: ['G1722'],
                text: 'the',
            },
            {
                contentIndex: 0,
                start: 7,
                end: 16,
                strongs: ['G0746'],
                text: 'beginning',
            },
        ]);
    });

    it('getVerseWords returns an empty list for verses with no annotations', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 2,
            content: ['The same was in the beginning with God.'],
        } as ChapterVerse;

        expect(api.getVerseWords(verse, wordsPayload)).toEqual([]);
    });

    it('requests a simplified translation chapter from the default endpoint', async () => {
        const payload = { chapter: { number: 1 } };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        const result = await api.getSimpleTranslationBookChapter(
            'BSB',
            'GEN',
            1
        );

        expect(result).toEqual(payload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/BSB/GEN/1.simple.json'
        );
    });

    it('builds encoded simplified chapter URLs and supports endpoint override per call', async () => {
        const payload = { chapter: { number: 1 } };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        await api.getSimpleTranslationBookChapter(
            'My Translation',
            'GEN/Intro',
            '1',
            'https://example.com/base/'
        );

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.com/base/api/My%20Translation/GEN%2FIntro/1.simple.json'
        );
    });

    it('requests the simplified words for a chapter', async () => {
        const payload = { verses: {} };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        const result = await api.getSimpleTranslationBookChapterWords(
            'engwebp',
            'JHN',
            1
        );

        expect(result).toEqual(payload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/engwebp/JHN/1.words.simple.json'
        );
    });

    it('gets a simplified commentary chapter using the dedicated method', async () => {
        const payload = { chapter: { number: 1 } };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        const result = await api.getSimpleCommentaryBookChapter(
            'matthew_henry',
            'GEN',
            1
        );

        expect(result).toEqual(payload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/c/matthew_henry/GEN/1.simple.json'
        );
    });

    it('does not cache simplified complete translation responses', async () => {
        fetchMock
            .mockResolvedValueOnce(jsonResponse({ books: [] }))
            .mockResolvedValueOnce(jsonResponse({ books: [] }));

        const api = new FreeUseBibleApi();
        await api.getSimpleCompleteTranslation('BSB');
        await api.getSimpleCompleteTranslation('BSB');

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            'https://bible.helloao.org/api/BSB/complete.simple.json'
        );
    });

    it('gets the simplified version of a translation chapter by following its link', async () => {
        const simplePayload = { chapter: { number: 1 } };
        fetchMock.mockResolvedValue(jsonResponse(simplePayload));

        const api = new FreeUseBibleApi();
        const chapter = {
            simpleChapterApiLink:
                'https://bible.helloao.org/api/BSB/GEN/1.simple.json',
        } as ApiTranslationBookChapter;

        const simple = await api.getSimpleChapter(chapter);

        expect(simple).toEqual(simplePayload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/BSB/GEN/1.simple.json'
        );
    });

    it('gets the simplified version of a commentary chapter by following its link', async () => {
        const simplePayload = { chapter: { number: 1 } };
        fetchMock.mockResolvedValue(jsonResponse(simplePayload));

        const api = new FreeUseBibleApi();
        const chapter = {
            simpleChapterApiLink:
                'https://bible.helloao.org/api/c/matthew_henry/GEN/1.simple.json',
        } as ApiCommentaryBookChapter;

        const simple = await api.getSimpleChapter(chapter);

        expect(simple).toEqual(simplePayload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/c/matthew_henry/GEN/1.simple.json'
        );
    });

    it('returns null for the simplified chapter when the link is missing', async () => {
        const api = new FreeUseBibleApi();
        const chapter = {} as ApiTranslationBookChapter;

        await expect(api.getSimpleChapter(chapter)).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('gets the words for a simplified chapter by following its words link', async () => {
        const payload = { verses: {} };
        fetchMock.mockResolvedValue(jsonResponse(payload));

        const api = new FreeUseBibleApi();
        const chapter = {
            thisChapterWordsLink:
                'https://bible.helloao.org/api/engwebp/JHN/1.words.simple.json',
        } as ApiSimpleTranslationBookChapter;

        const words = await api.getSimpleChapterWords(chapter);

        expect(words).toEqual(payload);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://bible.helloao.org/api/engwebp/JHN/1.words.simple.json'
        );
    });

    it('returns null simplified words for chapters that have no annotations', async () => {
        const api = new FreeUseBibleApi();
        const chapter = {} as ApiSimpleTranslationBookChapter;

        await expect(api.getSimpleChapterWords(chapter)).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('gets next and previous chapters when given simplified chapters', async () => {
        const nextPayload = { chapter: { number: 2 } };
        const prevPayload = { chapter: { number: 1 } };
        fetchMock
            .mockResolvedValueOnce(jsonResponse(nextPayload))
            .mockResolvedValueOnce(jsonResponse(prevPayload));

        const api = new FreeUseBibleApi();
        const translationChapter = {
            nextChapterApiLink:
                'https://bible.helloao.org/api/BSB/GEN/2.simple.json',
            previousChapterApiLink:
                'https://bible.helloao.org/api/BSB/GEN/1.simple.json',
        } as ApiSimpleTranslationBookChapter;

        const next = await api.getNextChapter(translationChapter);
        const previous = await api.getPreviousChapter(translationChapter);

        expect(next).toEqual(nextPayload);
        expect(previous).toEqual(prevPayload);

        const commentaryChapter = {
            nextChapterApiLink: null,
            previousChapterApiLink: null,
        } as ApiSimpleCommentaryBookChapter;

        await expect(api.getNextChapter(commentaryChapter)).resolves.toBeNull();
        await expect(
            api.getPreviousChapter(commentaryChapter)
        ).resolves.toBeNull();
    });

    const simpleWordsVerse = {
        type: 'verse',
        number: 1,
        text: 'In the beginning was the Word',
        footnotes: [],
    } as SimpleChapterVerse;

    const simpleWordsPayload = {
        translationId: 'engwebp',
        bookId: 'JHN',
        chapterNumber: 1,
        verses: {
            '1': [
                { start: 0, end: 2, strongs: ['G1722'] },
                { start: 7, end: 16, strongs: ['G0746'] },
            ],
        },
    } as unknown as ApiSimpleTranslationBookChapterWords;

    it('getSimpleWordText slices the annotated word out of the verse text', () => {
        const api = new FreeUseBibleApi();

        expect(
            api.getSimpleWordText(simpleWordsVerse, { start: 7, end: 16 })
        ).toBe('beginning');
    });

    it('getSimpleVerseWords pairs each annotation with its text', () => {
        const api = new FreeUseBibleApi();

        expect(
            api.getSimpleVerseWords(simpleWordsVerse, simpleWordsPayload)
        ).toEqual([
            { start: 0, end: 2, strongs: ['G1722'], text: 'In' },
            { start: 7, end: 16, strongs: ['G0746'], text: 'beginning' },
        ]);
    });

    it('getSimpleVerseWords returns an empty list for verses with no annotations', () => {
        const api = new FreeUseBibleApi();
        const verse = {
            type: 'verse',
            number: 2,
            text: 'The same was in the beginning with God.',
            footnotes: [],
        } as SimpleChapterVerse;

        expect(api.getSimpleVerseWords(verse, simpleWordsPayload)).toEqual([]);
    });

    it('getSimpleChapterVerseText includes verse numbers by default', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        text: 'In the beginning',
                    },
                    {
                        type: 'verse',
                        number: 2,
                        text: 'And the earth was formless',
                    },
                ],
            },
        } as ApiSimpleTranslationBookChapter;

        const text = api.getSimpleChapterVerseText(chapter);
        expect(text).toBe(
            'Genesis 1\n[1] In the beginning [2] And the earth was formless'
        );
    });

    it('getSimpleChapterVerseText omits verse numbers when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
                content: [
                    {
                        type: 'verse',
                        number: 3,
                        text: 'Then God said',
                    },
                ],
            },
        } as ApiSimpleTranslationBookChapter;

        const text = api.getSimpleChapterVerseText(chapter, {
            omitVerseNumbers: true,
        });
        expect(text).toBe('Genesis 1\nThen God said');
    });

    it('getSimpleChapterVerseText ignores non-verse chapter content', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
                content: [
                    {
                        type: 'heading',
                        text: 'The Creation',
                    },
                    {
                        type: 'line_break',
                    },
                    {
                        type: 'verse',
                        number: 1,
                        text: 'In the beginning',
                    },
                ],
            },
        } as ApiSimpleTranslationBookChapter;

        const text = api.getSimpleChapterVerseText(chapter);
        expect(text).toBe('Genesis 1\n[1] In the beginning');
    });

    it('getSimpleChapterVerseText renders line_break objects', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        text: 'First line',
                    },
                    {
                        type: 'line_break',
                    },
                    {
                        type: 'verse',
                        number: 2,
                        text: 'Second line',
                    },
                ],
            },
        } as ApiSimpleTranslationBookChapter;

        const text = api.getSimpleChapterVerseText(chapter);
        expect(text).toBe('Genesis 1\n[1] First line\n[2] Second line');
    });

    it('getSimpleChapterVerseText omits reference when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        text: 'First line',
                    },
                    {
                        type: 'line_break',
                    },
                    {
                        type: 'verse',
                        number: 2,
                        text: 'Second line',
                    },
                ],
            },
        } as ApiSimpleTranslationBookChapter;

        const text = api.getSimpleChapterVerseText(chapter, {
            omitReference: true,
        });
        expect(text).toBe('[1] First line\n[2] Second line');
    });

    it('getSimpleChapterVerseText omits both reference and verse numbers when requested', () => {
        const api = new FreeUseBibleApi();
        const chapter = {
            book: getChapterVerseTextBook,
            chapter: {
                number: 1,
                content: [
                    {
                        type: 'verse',
                        number: 1,
                        text: 'First line',
                    },
                    {
                        type: 'line_break',
                    },
                    {
                        type: 'verse',
                        number: 2,
                        text: 'Second line',
                    },
                ],
            },
        } as ApiSimpleTranslationBookChapter;

        const text = api.getSimpleChapterVerseText(chapter, {
            omitReference: true,
            omitVerseNumbers: true,
        });
        expect(text).toBe('First line\nSecond line');
    });
});
