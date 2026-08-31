import {
    ApiAvailableCommentariesSchema,
    ApiAvailableDatasetsSchema,
    ApiAvailableTranslationsSchema,
    ApiCommentaryBookChapterSchema,
    ApiCommentaryBooksSchema,
    ApiDatasetBookChapterSchema,
    ApiDatasetBooksSchema,
    ApiDatasetEntityBookChapterSchema,
    ApiDatasetEventSchema,
    ApiDatasetEventsSchema,
    ApiDatasetPeopleGroupSchema,
    ApiDatasetPeopleGroupsSchema,
    ApiDatasetPeopleSchema,
    ApiDatasetPersonSchema,
    ApiDatasetPlaceSchema,
    ApiDatasetPlacesSchema,
    ApiSimpleCommentaryBookChapterSchema,
    ApiSimpleTranslationBookChapterSchema,
    ApiSimpleTranslationBookChapterWordsSchema,
    ApiSimpleTranslationCompleteSchema,
    ApiTranslationBookChapterAudioTimingsSchema,
    ApiTranslationBookChapterSchema,
    ApiTranslationBookChapterWordsSchema,
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

const person = z.string().meta({
    description:
        'The ID of the person to get the information for. For example, "paul_2479" for the apostle Paul.',
});

const place = z.string().meta({
    description:
        'The ID of the place to get the information for. For example, "jerusalem_636" for Jerusalem.',
});

const event = z.string().meta({
    description:
        'The ID of the event to get the information for. For example, "saul-is-converted_326" for the conversion of Saul.',
});

const group = z.string().meta({
    description:
        'The ID of the people group to get the information for. For example, "tribe-of-benjamin" for the tribe of Benjamin.',
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
            '/api/{translation}/{book}/{chapter}.words.json': {
                get: {
                    operationId: 'getTranslationBookChapterWords',
                    description:
                        "Get the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific translation.",
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
                                    schema: ApiTranslationBookChapterWordsSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified translation, book, or chapter was not found, or the chapter does not have any word-level annotations.',
                        },
                    },
                },
            },
            '/api/{translation}/{book}/{chapter}.words.simple.json': {
                get: {
                    operationId: 'getSimpleTranslationBookChapterWords',
                    description:
                        "Get the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific translation, with their offsets remapped onto the text of each simplified verse. Use this with the simplified chapter format, since the offsets in the regular annotations are anchored to a verse's content array.",
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
                                    schema: ApiSimpleTranslationBookChapterWordsSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified translation, book, or chapter was not found, or the chapter does not have any word-level annotations.',
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
            '/api/{translation}/complete.simple.json': {
                get: {
                    operationId: 'getSimpleTranslationComplete',
                    description:
                        'Get the complete content of a specific translation, using the simplified format. In the simplified format, the content of each verse is a single string instead of a list of formatted content, and the footnotes are available on the verse that they occur in, along with the offset that they occur at.',
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
                                    schema: ApiSimpleTranslationCompleteSchema,
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
                        'Get the content of a specific chapter of a specific book for a specific dataset. For cross reference datasets, this is the list of cross references for each verse in the chapter. For entity datasets (such as "theographic"), this is the people, places, and events that appear in the chapter.',
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
                                    schema: z.union([
                                        ApiDatasetBookChapterSchema,
                                        ApiDatasetEntityBookChapterSchema,
                                    ]),
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
            '/api/d/{dataset}/people.json': {
                get: {
                    operationId: 'getDatasetPeople',
                    description:
                        'Get the list of people that are available for a specific dataset.',
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
                                    schema: ApiDatasetPeopleSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                "404 Not Found - The specified dataset was not found or doesn't contain people.",
                        },
                    },
                },
            },
            '/api/d/{dataset}/people/{person}.json': {
                get: {
                    operationId: 'getDatasetPerson',
                    description:
                        'Get the information about a specific person for a specific dataset. Includes the Bible references that mention the person and their relationships to other people, places, events, and people groups.',
                    requestParams: {
                        path: z.object({
                            dataset,
                            person,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetPersonSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified dataset or person was not found.',
                        },
                    },
                },
            },
            '/api/d/{dataset}/places.json': {
                get: {
                    operationId: 'getDatasetPlaces',
                    description:
                        'Get the list of places that are available for a specific dataset.',
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
                                    schema: ApiDatasetPlacesSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                "404 Not Found - The specified dataset was not found or doesn't contain places.",
                        },
                    },
                },
            },
            '/api/d/{dataset}/places/{place}.json': {
                get: {
                    operationId: 'getDatasetPlace',
                    description:
                        'Get the information about a specific place for a specific dataset. Includes the Bible references that mention the place and its related people and events.',
                    requestParams: {
                        path: z.object({
                            dataset,
                            place,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetPlaceSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified dataset or place was not found.',
                        },
                    },
                },
            },
            '/api/d/{dataset}/events.json': {
                get: {
                    operationId: 'getDatasetEvents',
                    description:
                        'Get the list of events that are available for a specific dataset.',
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
                                    schema: ApiDatasetEventsSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                "404 Not Found - The specified dataset was not found or doesn't contain events.",
                        },
                    },
                },
            },
            '/api/d/{dataset}/events/{event}.json': {
                get: {
                    operationId: 'getDatasetEvent',
                    description:
                        'Get the information about a specific event for a specific dataset. Includes the Bible references that describe the event and its related people, places, and people groups.',
                    requestParams: {
                        path: z.object({
                            dataset,
                            event,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetEventSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified dataset or event was not found.',
                        },
                    },
                },
            },
            '/api/d/{dataset}/groups.json': {
                get: {
                    operationId: 'getDatasetPeopleGroups',
                    description:
                        'Get the list of people groups that are available for a specific dataset.',
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
                                    schema: ApiDatasetPeopleGroupsSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                "404 Not Found - The specified dataset was not found or doesn't contain people groups.",
                        },
                    },
                },
            },
            '/api/d/{dataset}/groups/{group}.json': {
                get: {
                    operationId: 'getDatasetPeopleGroup',
                    description:
                        'Get the information about a specific people group for a specific dataset. Includes the members of the group and the events that the group participated in.',
                    requestParams: {
                        path: z.object({
                            dataset,
                            group,
                        }),
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetPeopleGroupSchema,
                                },
                            },
                        },
                        '404': {
                            description:
                                '404 Not Found - The specified dataset or people group was not found.',
                        },
                    },
                },
            },
        },
    });
}
