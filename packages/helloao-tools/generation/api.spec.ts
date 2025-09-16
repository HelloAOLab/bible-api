import {
    generateApiForDataset,
    generateFilesForApi,
    replaceSpacesWithUnderscores,
} from './api.js';
import Genesis from '../../../bible/bsb/01GENBSB.usfm';
import Exodus from '../../../bible/bsb/02EXOBSB.usfm';
import _1Chronicles from '../../../bible/bsb/131CHBSB.usfm';
import { generateDataset } from './dataset.js';
import {
    InputCommentaryMetadata,
    InputFile,
    InputTranslationMetadata,
    OutputFile,
} from './common-types.js';
import { DOMParser, Element, Node } from 'linkedom';
import { unparse } from 'papaparse';

describe('replaceSpacesWithUnderscores()', () => {
    const cases = [
        ['Hello World', 'Hello_World'],
        ['Hello World 2', 'Hello_World_2'],
    ];

    it.each(cases)(
        'should replace spaces with underscores',
        (input, expected) => {
            expect(replaceSpacesWithUnderscores(input)).toBe(expected);
        }
    );
});

describe('generateApiForDataset', () => {
    beforeEach(() => {
        globalThis.DOMParser = DOMParser as any; // window.DOMParser as any;
        globalThis.Element = Element as any; // window.Element;
        globalThis.Node = Node as any; // window.Node;
    });

    it('should output a file tree', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(Genesis, 13),
            },
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(Exodus, 14),
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 2,
            totalNumberOfChapters: 2,
            totalNumberOfVerses: 4,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: 'GEN',
                        name: 'Genesis',
                        commonName: 'Genesis',
                        title: 'Genesis',
                        order: 1,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        firstChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/GEN/1.json',
                        lastChapterNumber: 1,
                        lastChapterApiLink: '/api/bsb/GEN/1.json',
                    },
                    {
                        id: 'EXO',
                        name: 'Exodus',
                        commonName: 'Exodus',
                        title: 'Exodus',
                        order: 2,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        firstChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/EXO/1.json',
                        lastChapterNumber: 1,
                        lastChapterApiLink: '/api/bsb/EXO/1.json',
                    },
                ],
            },
            '/api/bsb/GEN/1.json': {
                translation: expectedTranslation,
                book: {
                    id: 'GEN',
                    name: 'Genesis',
                    commonName: 'Genesis',
                    title: 'Genesis',
                    order: 1,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    firstChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/GEN/1.json',
                    lastChapterNumber: 1,
                    lastChapterApiLink: '/api/bsb/GEN/1.json',
                },
                thisChapterLink: '/api/bsb/GEN/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: '/api/bsb/EXO/1.json',
                nextChapterAudioLinks: {},
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 2,
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
                            content: [
                                'In the beginning God created the heavens and the earth.',
                            ],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
            '/api/bsb/EXO/1.json': {
                translation: expectedTranslation,
                book: {
                    id: 'EXO',
                    name: 'Exodus',
                    commonName: 'Exodus',
                    title: 'Exodus',
                    order: 2,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    firstChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/EXO/1.json',
                    lastChapterNumber: 1,
                    lastChapterApiLink: '/api/bsb/EXO/1.json',
                },
                thisChapterLink: '/api/bsb/EXO/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: '/api/bsb/GEN/1.json',
                previousChapterAudioLinks: {},
                numberOfVerses: 2,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'heading',
                            content: ['The Israelites Multiply in Egypt'],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:',
                            ],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: ['Reuben, Simeon, Levi, and Judah;'],
                        },
                    ],
                    footnotes: [],
                },
            },
        });
    });

    it('should support books that start on a different chapter than 1', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usx',
                metadata: translation1,
                content: `
            <usx version="3.0">
                    <book code="GEN" style="id">- Berean Study Bible</book>
                    <para style="h">Genesis</para>
                    <para style="toc2">Genesis</para>
                    <para style="toc1">Genesis</para>
                    <para style="mt1">Genesis</para>
                    <chapter number="5" style="c" sid="GEN 5"/>
                    <para style="s1">The Creation</para>
                    <para style="r">(John 1:1–5; Hebrews 11:1–3)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 5:1"/>
                        <char style="w" strong="H8064">In</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H7225">beginning</char>
                        <char style="w" strong="H8064">God</char>
                        <char style="w" strong="H1254">created</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H1254">the</char>
                        <char style="w" strong="H8064">earth</char>.
                        <verse eid="GEN 5:1"/>
                    </para>
                    <chapter eid="GEN 5"/>
                    <para style="s2">The Second Section</para>
                    <chapter number="6" sid="GEN 6"/>
                    <para style="s1">The Seventh Day</para>
                    <para style="r">(Exodus 16:22–30; Hebrews 4:1–11)</para>
                    <para style="m">
                        <verse number="1" style="v" sid="GEN 6:1"/>
                        <char style="w" strong="H3541">Thus</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">heavens</char>
                        <char style="w" strong="H8064">and</char>
                        <char style="w" strong="H3605">the</char>
                        <char style="w" strong="H8064">earth</char>
                        <char style="w" strong="H8064">were</char>
                        <char style="w" strong="H3615">completed</char>
                        <char style="w" strong="H6635">in</char>
                        <char style="w" strong="H3605">all</char>
                        <char style="w" strong="H3605">their</char>
                        <char style="w" strong="H6635">vast</char>
                        <char style="w" strong="H6635">array</char>.
                        <verse eid="GEN 6:1"/>
                    </para>
                </usx>`,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 2,
            totalNumberOfVerses: 2,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: 'GEN',
                        name: 'Genesis',
                        commonName: 'Genesis',
                        title: 'Genesis',
                        order: 1,
                        numberOfChapters: 2,
                        totalNumberOfVerses: 2,
                        firstChapterNumber: 5,
                        lastChapterNumber: 6,
                        firstChapterApiLink: '/api/bsb/GEN/5.json',
                        lastChapterApiLink: '/api/bsb/GEN/6.json',
                    },
                ],
            },
            '/api/bsb/GEN/5.json': {
                translation: expectedTranslation,
                book: {
                    id: 'GEN',
                    name: 'Genesis',
                    commonName: 'Genesis',
                    title: 'Genesis',
                    order: 1,
                    numberOfChapters: 2,
                    totalNumberOfVerses: 2,
                    firstChapterNumber: 5,
                    firstChapterApiLink: '/api/bsb/GEN/5.json',
                    lastChapterNumber: 6,
                    lastChapterApiLink: '/api/bsb/GEN/6.json',
                },
                thisChapterLink: '/api/bsb/GEN/5.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: '/api/bsb/GEN/6.json',
                nextChapterAudioLinks: {},
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 1,
                chapter: {
                    number: 5,
                    content: [
                        {
                            type: 'heading',
                            content: ['The Creation'],
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'In the beginning God created the heavens and the earth.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
            '/api/bsb/GEN/6.json': {
                translation: expectedTranslation,
                book: {
                    id: 'GEN',
                    name: 'Genesis',
                    commonName: 'Genesis',
                    title: 'Genesis',
                    order: 1,
                    numberOfChapters: 2,
                    totalNumberOfVerses: 2,
                    firstChapterNumber: 5,
                    lastChapterNumber: 6,
                    firstChapterApiLink: '/api/bsb/GEN/5.json',
                    lastChapterApiLink: '/api/bsb/GEN/6.json',
                },
                thisChapterLink: '/api/bsb/GEN/6.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: '/api/bsb/GEN/5.json',
                previousChapterAudioLinks: {},
                numberOfVerses: 1,
                chapter: {
                    number: 6,
                    content: [
                        {
                            type: 'heading',
                            content: ['The Seventh Day'],
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'Thus the heavens and the earth were completed in all their vast array.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should use the given path prefix', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(Genesis, 13),
            },
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(Exodus, 14),
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset, {
            pathPrefix: '/hello',
        });
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
            availableFormats: ['json'],
            listOfBooksApiLink: '/hello/api/bsb/books.json',
            numberOfBooks: 2,
            totalNumberOfChapters: 2,
            totalNumberOfVerses: 4,
        };

        expect(tree).toEqual({
            '/hello/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/hello/api/available_commentaries.json': {
                commentaries: [],
            },
            '/hello/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: 'GEN',
                        name: 'Genesis',
                        commonName: 'Genesis',
                        title: 'Genesis',
                        order: 1,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/hello/api/bsb/GEN/1.json',
                        lastChapterApiLink: '/hello/api/bsb/GEN/1.json',
                    },
                    {
                        id: 'EXO',
                        name: 'Exodus',
                        commonName: 'Exodus',
                        title: 'Exodus',
                        order: 2,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/hello/api/bsb/EXO/1.json',
                        lastChapterApiLink: '/hello/api/bsb/EXO/1.json',
                    },
                ],
            },
            '/hello/api/bsb/GEN/1.json': {
                translation: expectedTranslation,
                book: {
                    id: 'GEN',
                    name: 'Genesis',
                    commonName: 'Genesis',
                    title: 'Genesis',
                    order: 1,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/hello/api/bsb/GEN/1.json',
                    lastChapterApiLink: '/hello/api/bsb/GEN/1.json',
                },
                thisChapterLink: '/hello/api/bsb/GEN/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: '/hello/api/bsb/EXO/1.json',
                nextChapterAudioLinks: {},
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 2,
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
                            content: [
                                'In the beginning God created the heavens and the earth.',
                            ],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
            '/hello/api/bsb/EXO/1.json': {
                translation: expectedTranslation,
                book: {
                    id: 'EXO',
                    name: 'Exodus',
                    commonName: 'Exodus',
                    title: 'Exodus',
                    order: 2,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/hello/api/bsb/EXO/1.json',
                    lastChapterApiLink: '/hello/api/bsb/EXO/1.json',
                },
                thisChapterLink: '/hello/api/bsb/EXO/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: '/hello/api/bsb/GEN/1.json',
                previousChapterAudioLinks: {},
                numberOfVerses: 2,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'heading',
                            content: ['The Israelites Multiply in Egypt'],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:',
                            ],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: ['Reuben, Simeon, Levi, and Judah;'],
                        },
                    ],
                    footnotes: [],
                },
            },
        });
    });

    it('should use underscores for spaces in the book name', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(_1Chronicles, 11),
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset, {
            useCommonName: true,
        });
        const files = generateFilesForApi(generated);
        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 1,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: '1CH',
                        name: '1 Chronicles',
                        commonName: '1 Chronicles',
                        title: '1 Chronicles',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        order: 13,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                        lastChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                    },
                ],
            },
            '/api/bsb/1_Chronicles/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '1CH',
                    name: '1 Chronicles',
                    commonName: '1 Chronicles',
                    title: '1 Chronicles',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    order: 13,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                    lastChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                },
                thisChapterLink: '/api/bsb/1_Chronicles/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'heading',
                            content: ['From Adam to Abraham'],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: ['Adam, Seth, Enosh,'],
                        },
                    ],
                    footnotes: [],
                },
            },
        });
    });

    it('produce the correct names for languages', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'spa',
            direction: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(_1Chronicles, 11),
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset, {
            useCommonName: true,
        });
        const files = generateFilesForApi(generated);
        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'spa',
            textDirection: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 1,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: '1CH',
                        name: '1 Chronicles',
                        commonName: '1 Chronicles',
                        title: '1 Chronicles',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        order: 13,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                        lastChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                    },
                ],
            },
            '/api/bsb/1_Chronicles/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '1CH',
                    name: '1 Chronicles',
                    commonName: '1 Chronicles',
                    title: '1 Chronicles',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    order: 13,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                    lastChapterApiLink: '/api/bsb/1_Chronicles/1.json',
                },
                thisChapterLink: '/api/bsb/1_Chronicles/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'heading',
                            content: ['From Adam to Abraham'],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: ['Adam, Seth, Enosh,'],
                        },
                    ],
                    footnotes: [],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('use the given book ID map', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'spa',
            direction: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usfm',
                metadata: translation1,
                content: firstXLines(_1Chronicles, 11),
            },
        ];

        const dataset = generateDataset(
            inputFiles,
            new DOMParser() as any,
            new Map([
                [
                    '1CH',
                    {
                        commonName: 'test book name',
                    },
                ],
            ])
        );
        const generated = generateApiForDataset(dataset, {
            useCommonName: false,
        });
        const files = generateFilesForApi(generated);
        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Berean Standard Bible',
            englishName: 'Berean Standard Bible',
            shortName: 'BSB',
            language: 'spa',
            textDirection: 'ltr',
            licenseUrl: 'https://berean.bible/terms.htm',
            website: 'https://berean.bible',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 1,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: '1CH',
                        name: '1 Chronicles',
                        commonName: 'test book name',
                        title: '1 Chronicles',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        order: 13,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/1CH/1.json',
                        lastChapterApiLink: '/api/bsb/1CH/1.json',
                    },
                ],
            },
            '/api/bsb/1CH/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '1CH',
                    name: '1 Chronicles',
                    commonName: 'test book name',
                    title: '1 Chronicles',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    order: 13,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/1CH/1.json',
                    lastChapterApiLink: '/api/bsb/1CH/1.json',
                },
                thisChapterLink: '/api/bsb/1CH/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'heading',
                            content: ['From Adam to Abraham'],
                        },
                        {
                            type: 'line_break',
                        },
                        {
                            type: 'verse',
                            number: 1,
                            content: ['Adam, Seth, Enosh,'],
                        },
                    ],
                    footnotes: [],
                },
            },
        });
    });

    it('should support commentary files', () => {
        let comment1: InputCommentaryMetadata = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'commentary/csv',
                content: unparse([
                    {
                        book: 'Genesis',
                        chapter: '',
                        verse: 'Book Introduction',
                        commentaries: 'Genesis Book Intro',
                    },
                    {
                        book: '',
                        chapter: '1',
                        verse: 'Chapter Introduction',
                        commentaries: 'Chapter introduction',
                    },
                    {
                        book: '',
                        chapter: '',
                        verse: 'Genesis 1:1',
                        commentaries: 'This is the commentary for Genesis 1:1.',
                    },
                ]),
                metadata: comment1,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedCommentary = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/c/comment/books.json',
            listOfProfilesApiLink: '/api/c/comment/profiles.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 1,
            totalNumberOfProfiles: 0,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [],
            },
            '/api/available_commentaries.json': {
                commentaries: [expectedCommentary],
            },
            '/api/c/comment/books.json': {
                commentary: expectedCommentary,
                books: [
                    {
                        id: 'GEN',
                        order: 1,
                        name: 'Genesis',
                        commonName: 'Genesis',
                        introduction: 'Genesis Book Intro',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/c/comment/GEN/1.json',
                        lastChapterApiLink: '/api/c/comment/GEN/1.json',
                    },
                ],
            },
            '/api/c/comment/profiles.json': {
                commentary: expectedCommentary,
                profiles: [],
            },
            '/api/c/comment/GEN/1.json': {
                commentary: expectedCommentary,
                book: {
                    id: 'GEN',
                    order: 1,
                    name: 'Genesis',
                    commonName: 'Genesis',
                    introduction: 'Genesis Book Intro',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/c/comment/GEN/1.json',
                    lastChapterApiLink: '/api/c/comment/GEN/1.json',
                },
                thisChapterLink: '/api/c/comment/GEN/1.json',
                // thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                previousChapterApiLink: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    introduction: 'Chapter introduction',
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'This is the commentary for Genesis 1:1.',
                            ],
                        },
                    ],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should support commentary books that have no chapters', () => {
        let comment1: InputCommentaryMetadata = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'commentary/csv',
                content: unparse([
                    {
                        book: 'Genesis',
                        chapter: '',
                        verse: 'Book Introduction',
                        commentaries: 'Genesis Book Intro',
                    },
                ]),
                metadata: comment1,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedCommentary = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/c/comment/books.json',
            listOfProfilesApiLink: '/api/c/comment/profiles.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            totalNumberOfProfiles: 0,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [],
            },
            '/api/available_commentaries.json': {
                commentaries: [expectedCommentary],
            },
            '/api/c/comment/books.json': {
                commentary: expectedCommentary,
                books: [
                    {
                        id: 'GEN',
                        order: 1,
                        name: 'Genesis',
                        commonName: 'Genesis',
                        introduction: 'Genesis Book Intro',
                        numberOfChapters: 0,
                        totalNumberOfVerses: 0,
                        firstChapterNumber: null,
                        lastChapterNumber: null,
                        firstChapterApiLink: null,
                        lastChapterApiLink: null,
                    },
                ],
            },
            '/api/c/comment/profiles.json': {
                commentary: expectedCommentary,
                profiles: [],
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should be able to merge commentary files', () => {
        let comment1: InputCommentaryMetadata = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'commentary/csv',
                content: unparse([
                    {
                        book: 'Exodus',
                        chapter: '',
                        verse: 'Book Introduction',
                        commentaries: 'Exodus Book Intro',
                    },
                    {
                        book: '',
                        chapter: '1',
                        verse: 'Chapter Introduction',
                        commentaries: 'Chapter introduction',
                    },
                    {
                        book: '',
                        chapter: '',
                        verse: 'Exodus 1:1',
                        commentaries: 'This is the commentary for Exodus 1:1.',
                    },
                ]),
                metadata: comment1,
            },
            {
                fileType: 'commentary/csv',
                content: unparse([
                    {
                        book: 'Genesis',
                        chapter: '',
                        verse: 'Book Introduction',
                        commentaries: 'Genesis Book Intro',
                    },
                    {
                        book: '',
                        chapter: '1',
                        verse: 'Chapter Introduction',
                        commentaries: 'Chapter introduction',
                    },
                    {
                        book: '',
                        chapter: '',
                        verse: 'Genesis 1:1',
                        commentaries: 'This is the commentary for Genesis 1:1.',
                    },
                ]),
                metadata: comment1,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedCommentary = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/c/comment/books.json',
            listOfProfilesApiLink: '/api/c/comment/profiles.json',
            numberOfBooks: 2,
            totalNumberOfChapters: 2,
            totalNumberOfVerses: 2,
            totalNumberOfProfiles: 0,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [],
            },
            '/api/available_commentaries.json': {
                commentaries: [expectedCommentary],
            },
            '/api/c/comment/books.json': {
                commentary: expectedCommentary,
                books: [
                    {
                        id: 'GEN',
                        order: 1,
                        name: 'Genesis',
                        commonName: 'Genesis',
                        introduction: 'Genesis Book Intro',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/c/comment/GEN/1.json',
                        lastChapterApiLink: '/api/c/comment/GEN/1.json',
                    },
                    {
                        id: 'EXO',
                        order: 2,
                        name: 'Exodus',
                        commonName: 'Exodus',
                        introduction: 'Exodus Book Intro',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/c/comment/EXO/1.json',
                        lastChapterApiLink: '/api/c/comment/EXO/1.json',
                    },
                ],
            },
            '/api/c/comment/profiles.json': {
                commentary: expectedCommentary,
                profiles: [],
            },
            '/api/c/comment/GEN/1.json': {
                commentary: expectedCommentary,
                book: {
                    id: 'GEN',
                    order: 1,
                    name: 'Genesis',
                    commonName: 'Genesis',
                    introduction: 'Genesis Book Intro',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/c/comment/GEN/1.json',
                    lastChapterApiLink: '/api/c/comment/GEN/1.json',
                },
                thisChapterLink: '/api/c/comment/GEN/1.json',
                // thisChapterAudioLinks: {},
                nextChapterApiLink: '/api/c/comment/EXO/1.json',
                previousChapterApiLink: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    introduction: 'Chapter introduction',
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'This is the commentary for Genesis 1:1.',
                            ],
                        },
                    ],
                },
            },
            '/api/c/comment/EXO/1.json': {
                commentary: expectedCommentary,
                book: {
                    id: 'EXO',
                    order: 2,
                    name: 'Exodus',
                    commonName: 'Exodus',
                    introduction: 'Exodus Book Intro',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/c/comment/EXO/1.json',
                    lastChapterApiLink: '/api/c/comment/EXO/1.json',
                },
                thisChapterLink: '/api/c/comment/EXO/1.json',
                // thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                previousChapterApiLink: '/api/c/comment/GEN/1.json',
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    introduction: 'Chapter introduction',
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: ['This is the commentary for Exodus 1:1.'],
                        },
                    ],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should support tyndale files', () => {
        let comment1: InputCommentaryMetadata = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'commentary/tyndale-xml',
                content: [
                    `<items release="1.25">`,
                    `<item name="Gen.1.1-2.3" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>Gen.1.1-2.3</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=Gen.1.1-2.3">1:1–2:3</a></span> These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach</p>`,
                    `</body>`,
                    `</item>`,
                    `</items>`,
                ].join('\n'),
                metadata: comment1,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedCommentary = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/c/comment/books.json',
            listOfProfilesApiLink: '/api/c/comment/profiles.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 1,
            totalNumberOfProfiles: 0,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [],
            },
            '/api/available_commentaries.json': {
                commentaries: [expectedCommentary],
            },
            '/api/c/comment/books.json': {
                commentary: expectedCommentary,
                books: [
                    {
                        id: 'GEN',
                        order: 1,
                        name: 'Genesis',
                        commonName: 'Genesis',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/c/comment/GEN/1.json',
                        lastChapterApiLink: '/api/c/comment/GEN/1.json',
                    },
                ],
            },
            '/api/c/comment/profiles.json': {
                commentary: expectedCommentary,
                profiles: [],
            },
            '/api/c/comment/GEN/1.json': {
                commentary: expectedCommentary,
                book: {
                    id: 'GEN',
                    order: 1,
                    name: 'Genesis',
                    commonName: 'Genesis',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/c/comment/GEN/1.json',
                    lastChapterApiLink: '/api/c/comment/GEN/1.json',
                },
                thisChapterLink: '/api/c/comment/GEN/1.json',
                nextChapterApiLink: null,
                previousChapterApiLink: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                '1:1–2:3 These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach',
                            ],
                        },
                    ],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should support book summary introductions files', () => {
        let comment1: InputCommentaryMetadata = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'commentary/tyndale-xml',
                content: [
                    `<items release="1.25">`,
                    `<item name="Gen.1.1-2.3" typename="StudyNote" product="TyndaleOpenStudyNotes">`,
                    `<refs>Gen.1.1-2.3</refs>`,
                    `<body>`,
                    `<p class="sn-text"><span class="sn-ref"><a href="?bref=Gen.1.1-2.3">1:1–2:3</a></span> These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach</p>`,
                    `</body>`,
                    `</item>`,
                    `<item name="GenIntro" typename="BookIntroSummary" product="TyndaleOpenStudyNotes">`,
                    `<title>Genesis</title>`,
                    `<refs>Gen.1.1-50.26</refs>`,
                    `<body>`,
                    `<p class="intro-overview">Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.</p>`,
                    `</body>`,
                    `</item>`,
                    `</items>`,
                ].join('\n'),
                metadata: comment1,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedCommentary = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/c/comment/books.json',
            listOfProfilesApiLink: '/api/c/comment/profiles.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 1,
            totalNumberOfProfiles: 0,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [],
            },
            '/api/available_commentaries.json': {
                commentaries: [expectedCommentary],
            },
            '/api/c/comment/books.json': {
                commentary: expectedCommentary,
                books: [
                    {
                        id: 'GEN',
                        order: 1,
                        name: 'Genesis',
                        commonName: 'Genesis',
                        introductionSummary:
                            'Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 1,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/c/comment/GEN/1.json',
                        lastChapterApiLink: '/api/c/comment/GEN/1.json',
                    },
                ],
            },
            '/api/c/comment/profiles.json': {
                commentary: expectedCommentary,
                profiles: [],
            },
            '/api/c/comment/GEN/1.json': {
                commentary: expectedCommentary,
                book: {
                    id: 'GEN',
                    order: 1,
                    name: 'Genesis',
                    commonName: 'Genesis',
                    introductionSummary:
                        'Genesis is the book of beginnings—of the universe and of humanity, of sin and its catastrophic effects, and of God’s plan to restore blessing to the world through his chosen people. God began his plan when he called Abraham and made a covenant with him. Genesis traces God’s promised blessings from.',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 1,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/c/comment/GEN/1.json',
                    lastChapterApiLink: '/api/c/comment/GEN/1.json',
                },
                thisChapterLink: '/api/c/comment/GEN/1.json',
                nextChapterApiLink: null,
                previousChapterApiLink: null,
                numberOfVerses: 1,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                '1:1–2:3 These verses introduce the Pentateuch (Genesis—Deuteronomy) and teach',
                            ],
                        },
                    ],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should support profiles', () => {
        let comment1: InputCommentaryMetadata = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'commentary/tyndale-xml',
                content: [
                    `<items release="1.25">`,
                    `<item name="AdamAndEve" typename="Profile" product="TyndaleOpenStudyNotes">`,
                    `<title>Adam and Eve</title>`,
                    `<refs>Gen.1.7-4.2</refs>`,
                    `<body>`,
                    `<p class="profile-title">Adam and Eve</p>`,
                    `<p class="profile-body-fl">Adam was the first man, the father of the human race.</p>`,
                    `</body>`,
                    `</item>`,
                    `</items>`,
                ].join('\n'),
                metadata: comment1,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedCommentary = {
            id: 'comment',
            name: 'Commentary',
            englishName: 'Commentary',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/c/comment/books.json',
            listOfProfilesApiLink: '/api/c/comment/profiles.json',
            numberOfBooks: 0,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            totalNumberOfProfiles: 1,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [],
            },
            '/api/available_commentaries.json': {
                commentaries: [expectedCommentary],
            },
            '/api/c/comment/books.json': {
                commentary: expectedCommentary,
                books: [],
            },
            '/api/c/comment/profiles.json': {
                commentary: expectedCommentary,
                profiles: [
                    {
                        id: 'adam-and-eve',
                        subject: 'Adam and Eve',
                        reference: {
                            book: 'GEN',
                            chapter: 1,
                            verse: 7,
                            endChapter: 4,
                            endVerse: 2,
                        },
                        thisProfileLink:
                            '/api/c/comment/profiles/adam-and-eve.json',
                        referenceChapterLink: '/api/c/comment/GEN/1.json',
                    },
                ],
            },
            '/api/c/comment/profiles/adam-and-eve.json': {
                commentary: expectedCommentary,
                profile: {
                    id: 'adam-and-eve',
                    subject: 'Adam and Eve',
                    reference: {
                        book: 'GEN',
                        chapter: 1,
                        verse: 7,
                        endChapter: 4,
                        endVerse: 2,
                    },
                    thisProfileLink:
                        '/api/c/comment/profiles/adam-and-eve.json',
                    referenceChapterLink: '/api/c/comment/GEN/1.json',
                },
                content: [
                    [
                        'Adam and Eve',
                        '',
                        'Adam was the first man, the father of the human race.',
                    ].join('\n'),
                ],
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('should support apocryphal books', () => {
        let translation1: InputTranslationMetadata = {
            id: 'test',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'TT',
            language: 'eng',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usx',
                metadata: translation1,
                content: `<usx version="3.0"><book code="2MA" style="id">A12-2MA-kjv.sfm The King James Version of the Holy Bible Wednesday, October 14, 2009</book>
  <para style="h">2 Maccabees</para>
  <para style="toc1">The Second Book of the Maccabees</para>
  <para style="toc2">2 Maccabees</para>
  <para style="toc3">2Ma</para>
  <para style="mt1">The Second Book of the Maccabees</para>
  <chapter number="1" style="c" sid="2MA 1"/>
  <para style="p"><verse number="1" style="v" sid="2MA 1:1"/>The brethren, the Jews that be at Jerusalem and in the land of Judea, wish unto the brethren, the Jews that are throughout Egypt health and peace:<verse eid="2MA 1:1"/></para>
  <para style="p"><verse number="2" style="v" sid="2MA 1:2"/>God be gracious unto you, and remember his covenant that he made with Abraham, Isaac, and Jacob, his faithful servants;<verse eid="2MA 1:2"/></para>
  <para style="p"><verse number="3" style="v" sid="2MA 1:3"/>And give you all an heart to serve him, and to do his will, with a good courage and a willing mind;<verse eid="2MA 1:3"/></para>
  <para style="p"><verse number="4" style="v" sid="2MA 1:4"/>And open your hearts in his law and commandments, and send you peace,<verse eid="2MA 1:4"/></para>
  <para style="p"><verse number="5" style="v" sid="2MA 1:5"/>And hear your prayers, and be at one with you, and never forsake you in time of trouble.<verse eid="2MA 1:5"/></para>
 </usx>`,
            },
            {
                fileType: 'usx',
                metadata: translation1,
                content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<usx version="3.0"><book code="BEL" style="id">A10-BEL-kjv.sfm The King James Version of the Holy Bible Wednesday, October 14, 2009</book>
  <para style="h">Bel</para>
  <para style="toc1">The History of the Destruction of Bel and the Dragon</para>
  <para style="toc2">Bel and the Dragon</para>
  <para style="toc3">Bel</para>
  <para style="mt1">The Book of Bel and the Dragon [in Daniel]</para>
  <para style="is1">The History of the Destruction of Bel and the Dragon, Cut off from the end of Daniel.</para>
  <chapter number="1" style="c" sid="BEL 1"/>
  <para style="p"><verse number="1" style="v" sid="BEL 1:1"/>And king Astyages was gathered to his fathers, and Cyrus of Persia received his kingdom.<verse eid="BEL 1:1"/></para>
  <para style="p"><verse number="2" style="v" sid="BEL 1:2"/>And Daniel conversed with the king, and was honoured above all his friends.<verse eid="BEL 1:2"/></para>
  <para style="p"><verse number="3" style="v" sid="BEL 1:3"/>Now the Babylons had an idol, called Bel, and there were spent upon him every day twelve great measures of fine flour, and forty sheep, and six vessels of wine.<verse eid="BEL 1:3"/></para>
</usx>`,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset);
        const files = generateFilesForApi(generated);

        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'test',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'TT',
            language: 'eng',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/test/books.json',
            numberOfBooks: 0,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            numberOfApocryphalBooks: 2,
            totalNumberOfApocryphalChapters: 2,
            totalNumberOfApocryphalVerses: 8,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/test/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: 'BEL',
                        name: 'Bel',
                        commonName: 'Bel',
                        title: 'The Book of Bel and the Dragon [in Daniel]',
                        order: 76,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 3,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/test/BEL/1.json',
                        lastChapterApiLink: '/api/test/BEL/1.json',
                        isApocryphal: true,
                    },
                    {
                        id: '2MA',
                        name: '2 Maccabees',
                        commonName: '2 Maccabees',
                        title: 'The Second Book of the Maccabees',
                        order: 78,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 5,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/test/2MA/1.json',
                        lastChapterApiLink: '/api/test/2MA/1.json',
                        isApocryphal: true,
                    },
                ],
            },
            '/api/test/BEL/1.json': {
                translation: expectedTranslation,
                book: {
                    id: 'BEL',
                    name: 'Bel',
                    commonName: 'Bel',
                    title: 'The Book of Bel and the Dragon [in Daniel]',
                    order: 76,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 3,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/test/BEL/1.json',
                    lastChapterApiLink: '/api/test/BEL/1.json',
                    isApocryphal: true,
                },
                thisChapterLink: '/api/test/BEL/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: '/api/test/2MA/1.json',
                nextChapterAudioLinks: {},
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 3,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'And king Astyages was gathered to his fathers, and Cyrus of Persia received his kingdom.',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'And Daniel conversed with the king, and was honoured above all his friends.',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 3,
                            content: [
                                'Now the Babylons had an idol, called Bel, and there were spent upon him every day twelve great measures of fine flour, and forty sheep, and six vessels of wine.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
            '/api/test/2MA/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '2MA',
                    name: '2 Maccabees',
                    commonName: '2 Maccabees',
                    title: 'The Second Book of the Maccabees',
                    order: 78,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 5,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/test/2MA/1.json',
                    lastChapterApiLink: '/api/test/2MA/1.json',
                    isApocryphal: true,
                },
                thisChapterLink: '/api/test/2MA/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: '/api/test/BEL/1.json',
                previousChapterAudioLinks: {},
                numberOfVerses: 5,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'The brethren, the Jews that be at Jerusalem and in the land of Judea, wish unto the brethren, the Jews that are throughout Egypt health and peace:',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'God be gracious unto you, and remember his covenant that he made with Abraham, Isaac, and Jacob, his faithful servants;',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 3,
                            content: [
                                'And give you all an heart to serve him, and to do his will, with a good courage and a willing mind;',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 4,
                            content: [
                                'And open your hearts in his law and commandments, and send you peace,',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 5,
                            content: [
                                'And hear your prayers, and be at one with you, and never forsake you in time of trouble.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('use the native names instead of english for the common name', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'BSB',
            language: 'spa',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usx',
                metadata: translation1,
                content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<usx version="3.0"><book code="1CO" style="id">- Ambulas (Maprik) NT [abtM] -Papua New Guinea 1983 (DBL 2014 bd)</book>
  <para style="h">1 Korinba</para>
  <para style="toc1">Korinba rakwa du taakwak&#233; Pol taale kavin ny&#233;ga</para>
  <para style="toc2">1 Korinba</para>
  <para style="toc3">1 Ko</para>
  <para style="mt1">Korinba rakwa du taakwak&#233; Pol taale kavin ny&#233;ga</para>
  <chapter number="1" style="c" sid="1CO 1"/>
  <para style="p"><verse number="1" style="v" sid="1CO 1:1"/>Got wunat wad&#233;k wun&#233; Pol Krais Jisasna kudi kure yaakwa du wun&#233; ro. Rate gunat wun&#233; wakweyo ny&#233;gaba. Sostenis wawo Krais Jisasna j&#233;baaba d&#233;bu yaalak. Yaale wun&#233; wale rate an&#233; k&#233;ni ny&#233;ga kaviyu gun&#233;k&#233;.<verse eid="1CO 1:1"/> <verse number="2" style="v" sid="1CO 1:2"/>Gun&#233; Korinba rate Gotna kudi mit&#233;k v&#233;knwukwa du taakwak&#233; an&#233; k&#233;ni ny&#233;ga kaviyu.</para>
 </usx>`,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset, {
            useCommonName: false,
        });
        const files = generateFilesForApi(generated);
        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'BSB',
            language: 'spa',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 2,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: '1CO',
                        name: '1 Korinba',
                        commonName: '1 Korinba',
                        title: 'Korinba rakwa du taakwaké Pol taale kavin nyéga',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        order: 46,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/1CO/1.json',
                        lastChapterApiLink: '/api/bsb/1CO/1.json',
                    },
                ],
            },
            '/api/bsb/1CO/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '1CO',
                    name: '1 Korinba',
                    commonName: '1 Korinba',
                    title: 'Korinba rakwa du taakwaké Pol taale kavin nyéga',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    order: 46,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/1CO/1.json',
                    lastChapterApiLink: '/api/bsb/1CO/1.json',
                },
                thisChapterLink: '/api/bsb/1CO/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 2,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'Got wunat wadék wuné Pol Krais Jisasna kudi kure yaakwa du wuné ro. Rate gunat wuné wakweyo nyégaba. Sostenis wawo Krais Jisasna jébaaba débu yaalak. Yaale wuné wale rate ané kéni nyéga kaviyu gunéké.',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'Guné Korinba rate Gotna kudi miték véknwukwa du taakwaké ané kéni nyéga kaviyu.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('use the english names for languages that dont have predefined common names and also dont include titles', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'BSB',
            language: 'spa',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usx',
                metadata: translation1,
                content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<usx version="3.0"><book code="1CO" style="id">- Ambulas (Maprik) NT [abtM] -Papua New Guinea 1983 (DBL 2014 bd)</book>
  <chapter number="1" style="c" sid="1CO 1"/>
  <para style="p"><verse number="1" style="v" sid="1CO 1:1"/>Got wunat wad&#233;k wun&#233; Pol Krais Jisasna kudi kure yaakwa du wun&#233; ro. Rate gunat wun&#233; wakweyo ny&#233;gaba. Sostenis wawo Krais Jisasna j&#233;baaba d&#233;bu yaalak. Yaale wun&#233; wale rate an&#233; k&#233;ni ny&#233;ga kaviyu gun&#233;k&#233;.<verse eid="1CO 1:1"/> <verse number="2" style="v" sid="1CO 1:2"/>Gun&#233; Korinba rate Gotna kudi mit&#233;k v&#233;knwukwa du taakwak&#233; an&#233; k&#233;ni ny&#233;ga kaviyu.</para>
 </usx>`,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset, {
            useCommonName: false,
        });
        const files = generateFilesForApi(generated);
        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'BSB',
            language: 'spa',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 2,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: '1CO',
                        name: '1 Corinthians',
                        commonName: '1 Corinthians',
                        title: null,
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        order: 46,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/1CO/1.json',
                        lastChapterApiLink: '/api/bsb/1CO/1.json',
                    },
                ],
            },
            '/api/bsb/1CO/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '1CO',
                    name: '1 Corinthians',
                    commonName: '1 Corinthians',
                    title: null,
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    order: 46,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/1CO/1.json',
                    lastChapterApiLink: '/api/bsb/1CO/1.json',
                },
                thisChapterLink: '/api/bsb/1CO/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 2,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'Got wunat wadék wuné Pol Krais Jisasna kudi kure yaakwa du wuné ro. Rate gunat wuné wakweyo nyégaba. Sostenis wawo Krais Jisasna jébaaba débu yaalak. Yaale wuné wale rate ané kéni nyéga kaviyu gunéké.',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'Guné Korinba rate Gotna kudi miték véknwukwa du taakwaké ané kéni nyéga kaviyu.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });

    it('use the native names instead of english for the common name for multiple languages', () => {
        let translation1: InputTranslationMetadata = {
            id: 'bsb',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'BSB',
            language: 'spa',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let translation2: InputTranslationMetadata = {
            id: 'test',
            name: 'Test Translation 2',
            englishName: 'Test Translation 2',
            shortName: 'TEST',
            language: 'hin',
            direction: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
        };

        let inputFiles: InputFile[] = [
            {
                fileType: 'usx',
                metadata: translation1,
                content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<usx version="3.0"><book code="1CO" style="id">- Ambulas (Maprik) NT [abtM] -Papua New Guinea 1983 (DBL 2014 bd)</book>
  <para style="h">1 Korinba</para>
  <para style="toc1">Korinba rakwa du taakwak&#233; Pol taale kavin ny&#233;ga</para>
  <para style="toc2">1 Korinba</para>
  <para style="toc3">1 Ko</para>
  <para style="mt1">Korinba rakwa du taakwak&#233; Pol taale kavin ny&#233;ga</para>
  <chapter number="1" style="c" sid="1CO 1"/>
  <para style="p"><verse number="1" style="v" sid="1CO 1:1"/>Got wunat wad&#233;k wun&#233; Pol Krais Jisasna kudi kure yaakwa du wun&#233; ro. Rate gunat wun&#233; wakweyo ny&#233;gaba. Sostenis wawo Krais Jisasna j&#233;baaba d&#233;bu yaalak. Yaale wun&#233; wale rate an&#233; k&#233;ni ny&#233;ga kaviyu gun&#233;k&#233;.<verse eid="1CO 1:1"/> <verse number="2" style="v" sid="1CO 1:2"/>Gun&#233; Korinba rate Gotna kudi mit&#233;k v&#233;knwukwa du taakwak&#233; an&#233; k&#233;ni ny&#233;ga kaviyu.</para>
 </usx>`,
            },
            {
                fileType: 'usx',
                metadata: translation2,
                content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<usx version="3.0"><book code="1CO" style="id">- Ambulas (Maprik) NT [abtM] -Papua New Guinea 1983 (DBL 2014 bd)</book>
  <para style="h">1 Korinba</para>
  <para style="toc1">Korinba rakwa du taakwak&#233; Pol taale kavin ny&#233;ga</para>
  <para style="toc2">1 Korinba</para>
  <para style="toc3">1 Ko</para>
  <para style="mt1">Korinba rakwa du taakwak&#233; Pol taale kavin ny&#233;ga</para>
  <chapter number="1" style="c" sid="1CO 1"/>
  <para style="p"><verse number="1" style="v" sid="1CO 1:1"/>Got wunat wad&#233;k wun&#233; Pol Krais Jisasna kudi kure yaakwa du wun&#233; ro. Rate gunat wun&#233; wakweyo ny&#233;gaba. Sostenis wawo Krais Jisasna j&#233;baaba d&#233;bu yaalak. Yaale wun&#233; wale rate an&#233; k&#233;ni ny&#233;ga kaviyu gun&#233;k&#233;.<verse eid="1CO 1:1"/> <verse number="2" style="v" sid="1CO 1:2"/>Gun&#233; Korinba rate Gotna kudi mit&#233;k v&#233;knwukwa du taakwak&#233; an&#233; k&#233;ni ny&#233;ga kaviyu.</para>
 </usx>`,
            },
        ];

        const dataset = generateDataset(inputFiles, new DOMParser() as any);
        const generated = generateApiForDataset(dataset, {
            useCommonName: false,
        });
        const files = generateFilesForApi(generated);
        const tree = fileTree(files);

        const expectedTranslation = {
            id: 'bsb',
            name: 'Test Translation',
            englishName: 'Test Translation',
            shortName: 'BSB',
            language: 'spa',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/bsb/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 2,
        };

        const expectedTranslation2 = {
            id: 'test',
            name: 'Test Translation 2',
            englishName: 'Test Translation 2',
            shortName: 'TEST',
            language: 'hin',
            textDirection: 'ltr',
            licenseUrl: 'https://example.com/terms.htm',
            website: 'https://example.com',
            availableFormats: ['json'],
            listOfBooksApiLink: '/api/test/books.json',
            numberOfBooks: 1,
            totalNumberOfChapters: 1,
            totalNumberOfVerses: 2,
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation, expectedTranslation2],
            },
            '/api/available_commentaries.json': {
                commentaries: [],
            },
            '/api/bsb/books.json': {
                translation: expectedTranslation,
                books: [
                    {
                        id: '1CO',
                        name: '1 Korinba',
                        commonName: '1 Korinba',
                        title: 'Korinba rakwa du taakwaké Pol taale kavin nyéga',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        order: 46,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/bsb/1CO/1.json',
                        lastChapterApiLink: '/api/bsb/1CO/1.json',
                    },
                ],
            },
            '/api/test/books.json': {
                translation: expectedTranslation2,
                books: [
                    {
                        id: '1CO',
                        name: '1 Korinba',
                        commonName: '1 Korinba',
                        title: 'Korinba rakwa du taakwaké Pol taale kavin nyéga',
                        numberOfChapters: 1,
                        totalNumberOfVerses: 2,
                        order: 46,
                        firstChapterNumber: 1,
                        lastChapterNumber: 1,
                        firstChapterApiLink: '/api/test/1CO/1.json',
                        lastChapterApiLink: '/api/test/1CO/1.json',
                    },
                ],
            },
            '/api/bsb/1CO/1.json': {
                translation: expectedTranslation,
                book: {
                    id: '1CO',
                    name: '1 Korinba',
                    commonName: '1 Korinba',
                    title: 'Korinba rakwa du taakwaké Pol taale kavin nyéga',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    order: 46,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/bsb/1CO/1.json',
                    lastChapterApiLink: '/api/bsb/1CO/1.json',
                },
                thisChapterLink: '/api/bsb/1CO/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 2,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'Got wunat wadék wuné Pol Krais Jisasna kudi kure yaakwa du wuné ro. Rate gunat wuné wakweyo nyégaba. Sostenis wawo Krais Jisasna jébaaba débu yaalak. Yaale wuné wale rate ané kéni nyéga kaviyu gunéké.',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'Guné Korinba rate Gotna kudi miték véknwukwa du taakwaké ané kéni nyéga kaviyu.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
            '/api/test/1CO/1.json': {
                translation: expectedTranslation2,
                book: {
                    id: '1CO',
                    name: '1 Korinba',
                    commonName: '1 Korinba',
                    title: 'Korinba rakwa du taakwaké Pol taale kavin nyéga',
                    numberOfChapters: 1,
                    totalNumberOfVerses: 2,
                    order: 46,
                    firstChapterNumber: 1,
                    lastChapterNumber: 1,
                    firstChapterApiLink: '/api/test/1CO/1.json',
                    lastChapterApiLink: '/api/test/1CO/1.json',
                },
                thisChapterLink: '/api/test/1CO/1.json',
                thisChapterAudioLinks: {},
                nextChapterApiLink: null,
                nextChapterAudioLinks: null,
                previousChapterApiLink: null,
                previousChapterAudioLinks: null,
                numberOfVerses: 2,
                chapter: {
                    number: 1,
                    content: [
                        {
                            type: 'verse',
                            number: 1,
                            content: [
                                'Got wunat wadék wuné Pol Krais Jisasna kudi kure yaakwa du wuné ro. Rate gunat wuné wakweyo nyégaba. Sostenis wawo Krais Jisasna jébaaba débu yaalak. Yaale wuné wale rate ané kéni nyéga kaviyu gunéké.',
                            ],
                        },
                        {
                            type: 'verse',
                            number: 2,
                            content: [
                                'Guné Korinba rate Gotna kudi miték véknwukwa du taakwaké ané kéni nyéga kaviyu.',
                            ],
                        },
                    ],
                    footnotes: [],
                },
            },
        });

        // expect(availableTranslations).toEqual({
        //     translations: [
        //         expectedTranslation
        //     ]
        // });
    });
});

function firstXLines(content: string, x: number) {
    const lines = content.split('\n');
    return lines.slice(0, x).join('\n');
}

function fileTree(outputFiles: OutputFile[]): any {
    let result: any = {};

    for (let file of outputFiles) {
        result[file.path] = file.content;
    }

    return result;
}
