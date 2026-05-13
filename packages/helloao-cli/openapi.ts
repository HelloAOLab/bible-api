import {
    ApiAvailableCommentariesSchema,
    ApiAvailableDatasetsSchema,
    ApiAvailableTranslationsSchema,
    ApiCommentaryBookChapterSchema,
    ApiCommentaryBooksSchema,
    ApiDatasetBookChapterSchema,
    ApiDatasetBooksSchema,
    ApiTranslationBookChapterSchema,
    ApiTranslationBooksSchema,
    ApiTranslationCompleteBookSchema,
    ApiTranslationCompleteSchema,
} from "@helloao/tools/generation/api.js";
import { createDocument, ZodOpenApiObject } from "zod-openapi";
import { z } from "zod";
import { BookIdSchema } from "@helloao/tools/utils.js";

const translation = z.string().meta({
    description: 'The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.'
});

const commentary = z.string().meta({
    description: 'The commentary ID of the commentary to get the books or chapter content for.'
});

const dataset = z.string().meta({
    description: 'The dataset ID of the dataset to get the books or chapter content for.'
});

const book = BookIdSchema;

const chapter = z.number().positive().meta({
    description: 'The chapter number to get the content for. This should be a positive integer.'
});

export function createFreeUseBibleApiOpenApiDocument(): any {
    return createDocument({
        openapi: "3.1.0",
        info: {
            title: "Free Use Bible API",
            version: "1.0.0",
            description: "An API for accessing over 1000 different Bible translations.",
            contact: {
                name: "HelloAO",
                url: "https://bible.helloao.org",
                email: "hello@helloao.org",
            },
        },
        paths: {
            "/api/available_translations.json": {
                
                description: "Get the list of available Bible translations.",
                get: {
                    operationId: "getAvailableTranslations",
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiAvailableTranslationsSchema
                                }
                            }
                        }
                    }
                }
            },
            "/api/{translation}/books.json": {
                description: "Get the list of books available for a specific translation.",
                get: {
                    operationId: "getTranslationBooks",
                    requestParams: {
                        path: z.object({
                            translation: translation
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiTranslationBooksSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified translation was not found.',
                        }
                    }
                }
            },
            "/api/{translation}/{book}/{chapter}.json": {
                description: "Get the content of a specific chapter of a specific book for a specific translation.",
                get: {
                    operationId: "getTranslationBookChapter",
                    requestParams: {
                        path: z.object({
                            translation,
                            book,
                            chapter,
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiTranslationBookChapterSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified translation, book, or chapter was not found.',
                        }
                    }
                }
            },
            "/api/{translation}/complete.json": {
                description: "Get the complete content of a specific translation.",
                get: {
                    operationId: "getTranslationComplete",
                    requestParams: {
                        path: z.object({
                            translation,
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiTranslationCompleteSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified translation was not found, or complete translations are not available.',
                        }
                    }
                }
            },
            "/api/available_commentaries.json": {
                description: "Get the list of available commentaries.",
                get: {
                    operationId: "getAvailableCommentaries",
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiAvailableCommentariesSchema
                                }
                            }
                        }
                    }
                }
            },
            "/api/c/{commentary}/books.json": {
                description: "Get the list of books available for a specific commentary.",
                get: {
                    operationId: "getCommentaryBooks",
                    requestParams: {
                        path: z.object({
                            commentary,
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiCommentaryBooksSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified commentary was not found.',
                        }
                    }
                }
            },
            "/api/c/{commentary}/{book}/{chapter}.json": {
                description: "Get the content of a specific chapter of a specific book for a specific commentary.",
                get: {
                    operationId: "getCommentaryBookChapter",
                    requestParams: {
                        path: z.object({
                            commentary,
                            book,
                            chapter,
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiCommentaryBookChapterSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified commentary, book, or chapter was not found.',
                        }
                    }
                }
            },
            "/api/available_datasets.json": {
                description: "Get the list of available datasets.",
                get: {
                    operationId: "getAvailableDatasets",
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiAvailableDatasetsSchema
                                }
                            }
                        }
                    }
                }
            },
            "/api/d/{dataset}/books.json": {
                description: "Get the list of books available for a specific dataset.",
                get: {
                    operationId: "getDatasetBooks",
                    requestParams: {
                        path: z.object({
                            dataset,
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetBooksSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified dataset was not found.',
                        }
                    }
                }
            },
            "/api/d/{dataset}/{book}/{chapter}.json": {
                description: "Get the content of a specific chapter of a specific book for a specific dataset.",
                get: {
                    operationId: "getDatasetBookChapter",
                    requestParams: {
                        path: z.object({
                            dataset,
                            book,
                            chapter,
                        })
                    },
                    responses: {
                        '200': {
                            description: '200 OK',
                            content: {
                                'application/json': {
                                    schema: ApiDatasetBookChapterSchema
                                }
                            }
                        },
                        '404': {
                            description: '404 Not Found - The specified dataset, book, or chapter was not found.',
                        }
                    }
                }
            },
        }
    });
}