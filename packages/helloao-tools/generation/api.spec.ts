import {
    generateApiForDataset,
    generateFilesForApi,
    replaceSpacesWithUnderscores,
} from './api';
import Genesis from '../../../bible/bsb/01GENBSB.usfm';
import Exodus from '../../../bible/bsb/02EXOBSB.usfm';
import _1Chronicles from '../../../bible/bsb/131CHBSB.usfm';
import { generateDataset } from './dataset';
import {
    InputFile,
    InputTranslationMetadata,
    OutputFile,
} from './common-types';
import { DOMParser, Element, Node } from 'linkedom';

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

describe('generateApiForDataset()', () => {
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

        let inputFiles = [
            {
                fileType: 'usfm',
                metadata: {
                    translation: translation1,
                },
                content: firstXLines(Genesis, 13),
            },
            {
                fileType: 'usfm',
                metadata: {
                    translation: translation1,
                },
                content: firstXLines(Exodus, 14),
            },
        ] as InputFile[];

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
            languageName: 'English',
            languageEnglishName: 'English',
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
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
                        firstChapterApiLink: '/api/bsb/GEN/1.json',
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
                        firstChapterApiLink: '/api/bsb/EXO/1.json',
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
                    firstChapterApiLink: '/api/bsb/GEN/1.json',
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
                    firstChapterApiLink: '/api/bsb/EXO/1.json',
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

        let inputFiles = [
            {
                fileType: 'usfm',
                metadata: {
                    translation: translation1,
                },
                content: firstXLines(Genesis, 13),
            },
            {
                fileType: 'usfm',
                metadata: {
                    translation: translation1,
                },
                content: firstXLines(Exodus, 14),
            },
        ] as InputFile[];

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
            languageName: 'English',
            languageEnglishName: 'English',
        };

        expect(tree).toEqual({
            '/hello/api/available_translations.json': {
                translations: [expectedTranslation],
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

        let inputFiles = [
            {
                fileType: 'usfm',
                metadata: {
                    translation: translation1,
                },
                content: firstXLines(_1Chronicles, 11),
            },
        ] as InputFile[];

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
            languageName: 'English',
            languageEnglishName: 'English',
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
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

        let inputFiles = [
            {
                fileType: 'usfm',
                metadata: {
                    translation: translation1,
                },
                content: firstXLines(_1Chronicles, 11),
            },
        ] as InputFile[];

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
            languageName: 'español',
            languageEnglishName: 'Spanish',
        };

        expect(tree).toEqual({
            '/api/available_translations.json': {
                translations: [expectedTranslation],
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
