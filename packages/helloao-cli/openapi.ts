import {
    ApiAvailableCommentariesSchema,
    ApiAvailableDatasetsSchema,
    ApiAvailableTranslationsSchema,
    ApiCommentaryBookChapterSchema,
    ApiCommentaryBooksSchema,
    ApiDatasetBookChapterSchema,
    ApiDatasetBooksSchema,
    ApiSimpleCommentaryBookChapterSchema,
    ApiSimpleTranslationBookChapterSchema,
    ApiTranslationBookChapterAudioTimingsSchema,
    ApiTranslationBookChapterSchema,
    ApiTranslationBooksSchema,
    ApiTranslationCompleteBookSchema,
    ApiTranslationCompleteSchema,
} from '@helloao/tools/generation/api.js';
import { createDocument, ZodOpenApiObject } from 'zod-openapi';
import { z } from 'zod';
import { BookIdSchema } from '@helloao/tools/utils.js';

const translation = z.string().meta({
    description:
        'The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.',
});

const commentary = z.string().meta({
    description:
        'The commentary ID of the commentary to get the books or chapter content for.',
});

const dataset = z.string().meta({
    description:
        'The dataset ID of the dataset to get the books or chapter content for.',
});

const book = BookIdSchema;

const chapter = z.number().positive().meta({
    description:
        'The chapter number to get the content for. This should be a positive integer.',
});

const reader = z.string().meta({
    description:
        'The ID of the reader to get the audio timings for. For example, "hays" for the Hays reading of the Berean Standard Bible.',
});

export function createFreeUseBibleApiOpenApiDocument(): any {
    return createDocument({
        openapi: '3.1.0',
        info: {
            title: 'Free Use Bible API',
            version: '1.0.0',
            description:
                'An API for accessing over 1000 different Bible translations.',
            contact: {
                name: 'HelloAO',
                url: 'https://bible.helloao.org',
                email: 'hello@helloao.org',
            },
        },
        servers: [
            {
                url: 'https://bible.helloao.org',
                description: 'Free Use Bible API production server',
            },
        ],
        paths: {
            '/api/available_translations.json': {
                get: {
                    operationId: 'getAvailableTranslations',
                    description:
                        'Get the list of available Bible translations.',
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiAvailableTranslationsSchema,
                                },
                            },
                        },
                    },
                },
            },
            '/api/{translation}/books.json': {
                get: {
                    operationId: 'getTranslationBooks',
                    description:
                        'Get the list of books available for a specific translation.',
                    requestParams: {
                        path: z.object({
                            translation: translation,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiTranslationBooksSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified translation was not found.',
                        },
                    },
                },
            },
            '/api/{translation}/{book}/{chapter}.json': {
                get: {
                    operationId: 'getTranslationBookChapter',
                    description:
                        'Get the content of a specific chapter of a specific book for a specific translation.',
                    requestParams: {
                        path: z.object({
                            translation,
                            book,
                            chapter,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiTranslationBookChapterSchema,
                                },
                            },
                            links: {
                                nextChapter: {
                                    operationId: 'getTranslationBookChapter',
                                    description:
                                        'Gets the chapter that follows the current chapter in the translation.',
                                    parameters: {
                                        translation:
                                            '$response.body#/nextChapterReference/translationId',
                                        book: '$response.body#/nextChapterReference/book',
                                        chapter:
                                            '$response.body#/nextChapterReference/chapter',
                                    },
                                },
                                previousChapter: {
                                    operationId: 'getTranslationBookChapter',
                                    description:
                                        'Gets the chapter that precedes the current chapter in the translation.',
                                    parameters: {
                                        translation:
                                            '$response.body#/previousChapterReference/translationId',
                                        book: '$response.body#/previousChapterReference/book',
                                        chapter:
                                            '$response.body#/previousChapterReference/chapter',
                                    },
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified translation, book, or chapter was not found.',
                        },
                    },
                },
            },
            '/api/{translation}/{book}/{chapter}.simple.json': {
                get: {
                    operationId: 'getSimpleTranslationBookChapter',
                    description:
                        'Get the content of a specific chapter of a specific book for a specific translation, using the simplified format. In the simplified format, the content of each verse is a single string instead of a list of formatted content, and the footnotes are available on the verse that they occur in, along with the offset that they occur at.',
                    requestParams: {
                        path: z.object({
                            translation,
                            book,
                            chapter,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiSimpleTranslationBookChapterSchema,
                                },
                            },
                            links: {
                                nextChapter: {
                                    operationId:
                                        'getSimpleTranslationBookChapter',
                                    description:
                                        'Gets the chapter that follows the current chapter in the translation.',
                                    parameters: {
                                        translation:
                                            '$response.body#/nextChapterReference/translationId',
                                        book: '$response.body#/nextChapterReference/book',
                                        chapter:
                                            '$response.body#/nextChapterReference/chapter',
                                    },
                                },
                                previousChapter: {
                                    operationId:
                                        'getSimpleTranslationBookChapter',
                                    description:
                                        'Gets the chapter that precedes the current chapter in the translation.',
                                    parameters: {
                                        translation:
                                            '$response.body#/previousChapterReference/translationId',
                                        book: '$response.body#/previousChapterReference/book',
                                        chapter:
                                            '$response.body#/previousChapterReference/chapter',
                                    },
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified translation, book, or chapter was not found.',
                        },
                    },
                },
            },
            '/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json':
                {
                    get: {
                        operationId: 'getTranslationBookChapterAudioTimings',
                        description:
                            'Get the audio timings (per-verse start times, in seconds) for a specific chapter of a specific book for a specific translation and reader.',
                        requestParams: {
                            path: z.object({
                                translation,
                                book,
                                chapter,
                                reader,
                            }),
                        },
                        responses: {
                            '200': {
                                description: '200 OK',
                                content: {
                                    'application/json': {
                                        schema: ApiTranslationBookChapterAudioTimingsSchema,
                                    },
                                },
                            },
                            '404': {
                                description:
                                    '404 Not Found - The specified translation, book, chapter, or reader was not found.',
                            },
                        },
                    },
                },
            '/api/{translation}/complete.json': {
                get: {
                    operationId: 'getTranslationComplete',
                    description:
                        'Get the complete content of a specific translation.',
                    requestParams: {
                        path: z.object({
                            translation,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiTranslationCompleteSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified translation was not found, or complete translations are not available.',
                        },
                    },
                },
            },
            '/api/available_commentaries.json': {
                get: {
                    operationId: 'getAvailableCommentaries',
                    description: 'Get the list of available commentaries.',
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiAvailableCommentariesSchema,
                                },
                            },
                        },
                    },
                },
            },
            '/api/c/{commentary}/books.json': {
                get: {
                    operationId: 'getCommentaryBooks',
                    description:
                        'Get the list of books available for a specific commentary.',
                    requestParams: {
                        path: z.object({
                            commentary,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiCommentaryBooksSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified commentary was not found.',
                        },
                    },
                },
            },
            '/api/c/{commentary}/{book}/{chapter}.json': {
                get: {
                    operationId: 'getCommentaryBookChapter',
                    description:
                        'Get the content of a specific chapter of a specific book for a specific commentary.',
                    requestParams: {
                        path: z.object({
                            commentary,
                            book,
                            chapter,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiCommentaryBookChapterSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified commentary, book, or chapter was not found.',
                        },
                    },
                },
            },
            '/api/c/{commentary}/{book}/{chapter}.simple.json': {
                get: {
                    operationId: 'getSimpleCommentaryBookChapter',
                    description:
                        'Get the content of a specific chapter of a specific book for a specific commentary, using the simplified format. In the simplified format, the content of each verse is a single string instead of a list of formatted content.',
                    requestParams: {
                        path: z.object({
                            commentary,
                            book,
                            chapter,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiSimpleCommentaryBookChapterSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified commentary, book, or chapter was not found.',
                        },
                    },
                },
            },
            '/api/available_datasets.json': {
                get: {
                    operationId: 'getAvailableDatasets',
                    description: 'Get the list of available datasets.',
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiAvailableDatasetsSchema,
                                },
                            },
                        },
                    },
                },
            },
            '/api/d/{dataset}/books.json': {
                get: {
                    operationId: 'getDatasetBooks',
                    description:
                        'Get the list of books available for a specific dataset.',
                    requestParams: {
                        path: z.object({
                            dataset,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetBooksSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified dataset was not found.',
                        },
                    },
                },
            },
            '/api/d/{dataset}/{book}/{chapter}.json': {
                get: {
                    operationId: 'getDatasetBookChapter',
                    description:
                        'Get the content of a specific chapter of a specific book for a specific dataset.',
                    requestParams: {
                        path: z.object({
                            dataset,
                            book,
                            chapter,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetBookChapterSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified dataset, book, or chapter was not found.',
                        },
                    },
                },
            },
        },
    });
}
