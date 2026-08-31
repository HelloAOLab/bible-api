import { z } from 'zod';
import {
    ChapterContent,
    ChapterData,
    ChapterFootnote,
    Commentary,
    CommentaryBook,
    CommentaryBookChapterSchema,
    CommentaryBookSchema,
    CommentaryBookChapter,
    CommentaryProfile,
    CommentaryProfileSchema,
    Dataset,
    DatasetBook,
    DatasetBookChapterSchema,
    DatasetBookSchema,
    DatasetBookChapter,
    DatasetEntityRef,
    DatasetEntityType,
    DatasetEvent,
    DatasetEventSchema,
    DatasetPeopleGroup,
    DatasetPeopleGroupSchema,
    DatasetPerson,
    DatasetPersonSchema,
    DatasetPlace,
    DatasetPlaceSchema,
    OutputFile,
    DatasetSchema,
    TranslationSchema,
    Translation,
    TranslationBook,
    TranslationBookSchema,
    TranslationBookChapter,
    TranslationBookChapterSchema,
    TranslationBookChapterAudioLinks,
    TranslationBookChapterAudioTimings,
    TranslationBookChapterWords,
    ChapterWordSchema,
    CommentarySchema,
    SimpleChapterDataSchema,
    SimpleChapterWordSchema,
    SimpleCommentaryChapterDataSchema,
    SimpleTranslationBookChapterSchema,
} from './common-types.js';
import { DatasetOutput } from './dataset.js';
import {
    SimplifiedChapter,
    simplifyChapter,
    simplifyCommentaryChapter,
} from './simple.js';
import { BookId, BookIdSchema, VerseRef } from '../utils.js';
import { bookOrderMap } from './book-order.js';

/**
 * Defines the output of the API generation.
 */
export interface ApiOutput {
    /**
     * The list of available translations.
     * This maps to the /api/available-translations.json endpoint.
     */
    availableTranslations: ApiAvailableTranslations;

    /**
     * The list of books for each translation.
     * This maps to the /api/:translationId/books.json endpoint.
     */
    translationBooks: ApiTranslationBooks[];

    /**
     * The list of chapters for each book.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.json
     * - /api/:translationId/:bookCommonName/:chapterNumber.json
     */
    translationBookChapters: ApiTranslationBookChapter[];

    /**
     * The list of chapters for each book, in the simplified format.
     * Omitted unless simplified chapter generation is enabled.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.simple.json
     * - /api/:translationId/:bookCommonName/:chapterNumber.simple.json
     */
    simpleTranslationBookChapters?: ApiSimpleTranslationBookChapter[];

    /**
     * The list of word-level annotations for chapters, in the simplified format.
     * Omitted unless simplified chapter generation is enabled.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.words.simple.json
     */
    simpleTranslationBookChapterWords?: ApiSimpleTranslationBookChapterWords[];

    /**
     * The list of audio files.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.:reader.mp3
     */
    translationBookChapterAudio: ApiTranslationBookChapterAudio[];

    /**
     * The list of audio timings.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.:reader.audioTimings.json
     */
    translationBookChapterAudioTimings: ApiTranslationBookChapterAudioTimings[];

    /**
     * The list of word-level annotations for chapters.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.words.json
     */
    translationBookChapterWords: ApiTranslationBookChapterWords[];

    /**
     * The list of available commentaries.
     * This maps to the /api/available-commentaries.json endpoint.
     */
    availableCommentaries: ApiAvailableCommentaries;

    /**
     * The list of books for each commentary.
     * This maps to the /api/c/:commentaryId/books.json endpoint.
     */
    commentaryBooks: ApiCommentaryBooks[];

    /**
     * The list of profiles for each commentary.
     * This maps to the /api/c/:commentaryId/profiles.json endpoint.
     */
    commentaryProfiles: ApiCommentaryProfiles[];

    /**
     * The list of chapters for each commentary book.
     * This maps to the following endpoint:
     * - /api/c/:commentaryId/:bookId/:chapterNumber.json
     */
    commentaryBookChapters: ApiCommentaryBookChapter[];

    /**
     * The list of chapters for each commentary book, in the simplified format.
     * Omitted unless simplified chapter generation is enabled.
     * This maps to the following endpoint:
     * - /api/c/:commentaryId/:bookId/:chapterNumber.simple.json
     */
    simpleCommentaryBookChapters?: ApiSimpleCommentaryBookChapter[];

    /**
     * The list of individual profiles for each commentary.
     * This maps to the following endpoint:
     * - /api/c/:commentaryId/profiles/:profileId.json
     */
    commentaryProfileContents: ApiCommentaryProfileContent[];

    /**
     * The list of available datasets.
     * This maps to the /api/available-datasets.json endpoint.
     */
    availableDatasets?: ApiAvailableDatasets;

    /**
     * The list of books for each dataset.
     * This maps to the /api/d/:datasetId/books.json endpoint.
     */
    datasetBooks?: ApiDatasetBooks[];

    /**
     * The list of chapters for each dataset book.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/:bookId/:chapterNumber.json
     */
    datasetBookChapters?: ApiDatasetBookChapter[];

    /**
     * The list of chapters that contain entity data for each dataset book.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/:bookId/:chapterNumber.json
     */
    datasetEntityBookChapters?: ApiDatasetEntityBookChapter[];

    /**
     * The list of people for each dataset.
     * This maps to the /api/d/:datasetId/people.json endpoint.
     */
    datasetPeople?: ApiDatasetPeople[];

    /**
     * The list of individual people for each dataset.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/people/:personId.json
     */
    datasetPeopleContents?: ApiDatasetPerson[];

    /**
     * The list of places for each dataset.
     * This maps to the /api/d/:datasetId/places.json endpoint.
     */
    datasetPlaces?: ApiDatasetPlaces[];

    /**
     * The list of individual places for each dataset.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/places/:placeId.json
     */
    datasetPlaceContents?: ApiDatasetPlace[];

    /**
     * The list of events for each dataset.
     * This maps to the /api/d/:datasetId/events.json endpoint.
     */
    datasetEvents?: ApiDatasetEvents[];

    /**
     * The list of individual events for each dataset.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/events/:eventId.json
     */
    datasetEventContents?: ApiDatasetEvent[];

    /**
     * The list of people groups for each dataset.
     * This maps to the /api/d/:datasetId/groups.json endpoint.
     */
    datasetPeopleGroups?: ApiDatasetPeopleGroups[];

    /**
     * The list of individual people groups for each dataset.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/groups/:groupId.json
     */
    datasetPeopleGroupContents?: ApiDatasetPeopleGroup[];

    /**
     * The complete translation data for each translation.
     * This maps to the /api/:translationId/complete.json endpoint.
     */
    translationComplete: ApiTranslationComplete[];

    /**
     * The complete translation data for each translation, in the simplified format.
     * This maps to the /api/:translationId/complete.simple.json endpoint.
     */
    simpleTranslationComplete: ApiSimpleTranslationComplete[];

    /**
     * The path prefix that the API should use.
     */
    pathPrefix: string;
}

/**
 * The list of available translations.
 * Maps to the /api/available-translations.json endpoint.
 */
export const ApiAvailableTranslationsSchema = z
    .object({
        /**
         * The list of translations.
         */
        translations: z.array(z.lazy(() => ApiTranslationSchema)).meta({
            description:
                'The list of translations that are available in the API.',
        }),
    })
    .meta({
        id: 'ApiAvailableTranslations',
        description:
            'The list of available translations. Maps to the /api/available-translations.json endpoint.',
    });

export type ApiAvailableTranslations = z.infer<
    typeof ApiAvailableTranslationsSchema
>;

/**
 * The list of available commentaries.
 * Maps to the /api/available-commentaries.json endpoint.
 */
export const ApiAvailableCommentariesSchema = z
    .object({
        /**
         * The list of commentaries.
         */
        commentaries: z.array(z.lazy(() => ApiCommentarySchema)).meta({
            description:
                'The list of commentaries that are available in the API.',
        }),
    })
    .meta({
        id: 'ApiAvailableCommentaries',
        description:
            'The list of available commentaries. Maps to the /api/available-commentaries.json endpoint.',
    });

export type ApiAvailableCommentaries = z.infer<
    typeof ApiAvailableCommentariesSchema
>;

/**
 * The list of available datasets.
 * Maps to the /api/available-datasets.json endpoint.
 */
export const ApiAvailableDatasetsSchema = z
    .object({
        datasets: z.array(z.lazy(() => ApiDatasetSchema)).meta({
            description: 'The list of datasets that are available in the API.',
        }),
    })
    .meta({
        id: 'ApiAvailableDatasets',
        description:
            'The list of available datasets. Maps to the /api/available-datasets.json endpoint.',
    });

export type ApiAvailableDatasets = z.infer<typeof ApiAvailableDatasetsSchema>;

/**
 * Defines a dataset that is used in the API.
 */
export const ApiDatasetSchema = DatasetSchema.extend({
    /**
     * The API link for the list of books for this dataset.
     */
    listOfBooksApiLink: z.string().meta({
        description:
            'The API link for the list of books for this dataset. Relative to the API origin.',
    }),

    /**
     * The available list of formats.
     */
    availableFormats: z.array(z.literal('json')),

    /**
     * The number of books that are contained in this dataset.
     */
    numberOfBooks: z.number().meta({
        description: 'The number of books that are contained in this dataset.',
    }),

    /**
     * The total number of chapters that are contained in this dataset.
     */
    totalNumberOfChapters: z.number().meta({
        description:
            'The total number of chapters that are contained in this dataset.',
    }),

    /**
     * The total number of verses that are contained in this dataset.
     */
    totalNumberOfVerses: z.number().meta({
        description:
            'The total number of verses that are contained in this dataset.',
    }),

    /**
     * The total number of references that are contained in this dataset.
     */
    totalNumberOfReferences: z.number().meta({
        description:
            'The total number of references that are contained in this dataset.',
    }),

    /**
     * Gets the name of the language that the commentary is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName: z.string().optional().meta({
        description:
            'Gets the name of the language that the dataset is in. Null or undefined if the name of the language is not known.',
    }),

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName: z.string().optional().meta({
        description:
            "Gets the name of the language in English. Null or undefined if the language doesn't have an english name.",
    }),

    /**
     * The API link for the list of people for this dataset.
     * Omitted if the dataset doesn't contain people.
     */
    listOfPeopleApiLink: z.string().optional().meta({
        description:
            "The API link for the list of people for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain people.",
    }),

    /**
     * The API link for the list of places for this dataset.
     * Omitted if the dataset doesn't contain places.
     */
    listOfPlacesApiLink: z.string().optional().meta({
        description:
            "The API link for the list of places for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain places.",
    }),

    /**
     * The API link for the list of events for this dataset.
     * Omitted if the dataset doesn't contain events.
     */
    listOfEventsApiLink: z.string().optional().meta({
        description:
            "The API link for the list of events for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain events.",
    }),

    /**
     * The API link for the list of people groups for this dataset.
     * Omitted if the dataset doesn't contain people groups.
     */
    listOfPeopleGroupsApiLink: z.string().optional().meta({
        description:
            "The API link for the list of people groups for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain people groups.",
    }),

    /**
     * The total number of people that are contained in this dataset.
     * Omitted if the dataset doesn't contain people.
     */
    totalNumberOfPeople: z.number().optional().meta({
        description:
            "The total number of people that are contained in this dataset. Omitted if the dataset doesn't contain people.",
    }),

    /**
     * The total number of places that are contained in this dataset.
     * Omitted if the dataset doesn't contain places.
     */
    totalNumberOfPlaces: z.number().optional().meta({
        description:
            "The total number of places that are contained in this dataset. Omitted if the dataset doesn't contain places.",
    }),

    /**
     * The total number of events that are contained in this dataset.
     * Omitted if the dataset doesn't contain events.
     */
    totalNumberOfEvents: z.number().optional().meta({
        description:
            "The total number of events that are contained in this dataset. Omitted if the dataset doesn't contain events.",
    }),

    /**
     * The total number of people groups that are contained in this dataset.
     * Omitted if the dataset doesn't contain people groups.
     */
    totalNumberOfPeopleGroups: z.number().optional().meta({
        description:
            "The total number of people groups that are contained in this dataset. Omitted if the dataset doesn't contain people groups.",
    }),
}).meta({
    id: 'ApiDataset',
    description: 'Defines a dataset that is used in the API.',
});

export type ApiDataset = z.infer<typeof ApiDatasetSchema>;

/**
 * Defines a translation that is used in the API.
 */
export const ApiTranslationSchema = TranslationSchema.extend({
    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: z.string().meta({
        description:
            'The API link for the list of books for this translation. Relative to the API origin.',
    }),

    /**
     * The available list of formats.
     */
    availableFormats: z.array(z.enum(['json', 'usfm'])),

    /**
     * The number of books that are contained in this translation.
     *
     * Complete translations should have the same number of books as the Bible (66).
     */
    numberOfBooks: z.number().meta({
        description:
            'The number of books that are contained in this translation. Complete translations should have the same number of books as the Bible (66).',
    }),

    /**
     * The total number of chapters that are contained in this translation.
     *
     * Complete translations should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: z.number().meta({
        description:
            'The total number of chapters that are contained in this translation. Complete translations should have the same number of chapters as the Bible (1,189).',
    }),

    /**
     * The total number of verses that are contained in this translation.
     *
     * Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: z.number().meta({
        description:
            'The total number of verses that are contained in this translation. Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).',
    }),

    /**
     * The total number of apocryphal books that are contained in this translation.
     */
    numberOfApocryphalBooks: z.number().optional().meta({
        description:
            'The total number of apocryphal books that are contained in this translation.',
    }),

    /**
     * The total number of apocryphal chapters that are contained in this translation.
     */
    totalNumberOfApocryphalChapters: z.number().optional().meta({
        description:
            'The total number of apocryphal chapters that are contained in this translation.',
    }),

    /**
     * The total number of apocryphal verses that are contained in this translation.
     */
    totalNumberOfApocryphalVerses: z.number().optional().meta({
        description:
            'The total number of apocryphal verses that are contained in this translation.',
    }),

    /**
     * Gets the name of the language that the translation is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName: z.string().optional().meta({
        description:
            'Gets the name of the language that the translation is in. Null or undefined if the name of the language is not known.',
    }),

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName: z.string().optional().meta({
        description:
            "Gets the name of the language in English. Null or undefined if the language doesn't have an english name.",
    }),

    /**
     * The API link for downloading the complete translation as a single JSON file.
     *
     * Undefined if complete translation files are not available.
     */
    completeTranslationApiLink: z.string().optional().meta({
        description:
            'The API link for downloading the complete translation as a single JSON file. Relative to the API origin. Undefined if complete translation files are not available.',
    }),

    /**
     * The API link for downloading the complete translation as a single JSON file,
     * using the simplified chapter format.
     *
     * Undefined if complete translation files are not available.
     */
    simpleCompleteTranslationApiLink: z.string().optional().meta({
        description:
            'The API link for downloading the complete translation as a single JSON file, using the simplified chapter format. Relative to the API origin. Undefined if complete translation files are not available.',
    }),
}).meta({
    id: 'ApiTranslation',
    description: 'Defines a translation that is used in the API.',
});

export type ApiTranslation = z.infer<typeof ApiTranslationSchema>;

/**
 * Defines the complete translation download data.
 * Maps to the /api/:translationId/complete.json endpoint.
 */
export const ApiTranslationCompleteSchema = z
    .object({
        /**
         * The translation metadata.
         */
        translation: z
            .lazy(() => ApiTranslationSchema)
            .meta({
                description: 'The translation metadata.',
            }),

        /**
         * The complete list of books with all their chapters.
         */
        books: z.array(z.lazy(() => ApiTranslationCompleteBookSchema)).meta({
            description: 'The complete list of books with all their chapters.',
        }),
    })
    .meta({
        id: 'ApiTranslationComplete',
        description:
            'Defines the complete translation download data. Maps to the /api/:translationId/complete.json endpoint.',
    });

export type ApiTranslationComplete = z.infer<
    typeof ApiTranslationCompleteSchema
>;

/**
 * A chapter in the complete translation download.
 */
// Word annotations are published as separate files, and are linked to by
// thisChapterWordsLink instead of being included inline, same as the regular
// per-chapter endpoint.
export const TranslationCompleteChapterSchema =
    TranslationBookChapterSchema.omit({ thisChapterWords: true })
        .extend({
            /**
             * The number of verses that the chapter contains.
             */
            numberOfVerses: z.number().meta({
                description: 'The number of verses that the chapter contains.',
            }),

            /**
             * The link to the word-level annotations for the chapter.
             * Omitted if the chapter doesn't have any word-level annotations.
             */
            thisChapterWordsLink: z.string().optional().meta({
                description:
                    "The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.",
            }),
        })
        .meta({
            id: 'TranslationCompleteChapter',
            description: 'A chapter in the complete translation download.',
        });

export type TranslationCompleteChapter = z.infer<
    typeof TranslationCompleteChapterSchema
>;

/**
 * A chapter in the complete translation download, using the simplified chapter format.
 */
export const SimpleTranslationCompleteChapterSchema =
    SimpleTranslationBookChapterSchema.omit({ thisChapterWords: true })
        .extend({
            /**
             * The number of verses that the chapter contains.
             */
            numberOfVerses: z.number().meta({
                description: 'The number of verses that the chapter contains.',
            }),

            /**
             * The link to the word-level annotations for the chapter.
             * Omitted if the chapter doesn't have any word-level annotations.
             */
            thisChapterWordsLink: z.string().optional().meta({
                description:
                    "The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.",
            }),
        })
        .meta({
            id: 'SimpleTranslationCompleteChapter',
            description:
                'A chapter in the complete translation download, using the simplified chapter format.',
        });

export type SimpleTranslationCompleteChapter = z.infer<
    typeof SimpleTranslationCompleteChapterSchema
>;

/**
 * A book in the complete translation download.
 */
export const ApiTranslationCompleteBookSchema = TranslationBookSchema.extend({
    /**
     * The number of chapters in the book.
     */
    numberOfChapters: z.number().meta({
        description: 'The number of chapters in the book.',
    }),

    /**
     * The total number of verses in the book.
     */
    totalNumberOfVerses: z.number().meta({
        description: 'The total number of verses in the book.',
    }),

    /**
     * The complete list of chapters with all content.
     */
    chapters: z.array(TranslationCompleteChapterSchema).meta({
        description: 'The complete list of chapters with all content.',
    }),
}).meta({
    id: 'ApiTranslationCompleteBook',
    description: 'A book in the complete translation download.',
});

export type ApiTranslationCompleteBook = z.infer<
    typeof ApiTranslationCompleteBookSchema
>;

/**
 * Defines the complete translation download data, using the simplified chapter format.
 * Maps to the /api/:translationId/complete.simple.json endpoint.
 */
export const ApiSimpleTranslationCompleteSchema = z
    .object({
        /**
         * The translation metadata.
         */
        translation: z
            .lazy(() => ApiTranslationSchema)
            .meta({
                description: 'The translation metadata.',
            }),

        /**
         * The complete list of books with all their chapters.
         */
        books: z
            .array(z.lazy(() => ApiSimpleTranslationCompleteBookSchema))
            .meta({
                description:
                    'The complete list of books with all their chapters.',
            }),
    })
    .meta({
        id: 'ApiSimpleTranslationComplete',
        description:
            'Defines the complete translation download data, using the simplified chapter format. Maps to the /api/:translationId/complete.simple.json endpoint.',
    });

export type ApiSimpleTranslationComplete = z.infer<
    typeof ApiSimpleTranslationCompleteSchema
>;

/**
 * A book in the complete translation download, using the simplified chapter format.
 */
export const ApiSimpleTranslationCompleteBookSchema =
    ApiTranslationCompleteBookSchema.extend({
        /**
         * The complete list of chapters with all content.
         */
        chapters: z.array(SimpleTranslationCompleteChapterSchema).meta({
            description: 'The complete list of chapters with all content.',
        }),
    }).meta({
        id: 'ApiSimpleTranslationCompleteBook',
        description:
            'A book in the complete translation download, using the simplified chapter format.',
    });

export type ApiSimpleTranslationCompleteBook = z.infer<
    typeof ApiSimpleTranslationCompleteBookSchema
>;

/**
 * Defines a commentary that is used in the API.
 */
export const ApiCommentarySchema = CommentarySchema.extend({
    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: z.string().meta({
        description:
            'The API link for the list of books for this commentary. Relative to the API origin.',
    }),

    /**
     * The API link for the list of available profiles for this commentary.
     */
    listOfProfilesApiLink: z.string().meta({
        description:
            'The API link for the list of profiles for this commentary. Relative to the API origin.',
    }),

    /**
     * The available list of formats.
     */
    availableFormats: z.array(z.enum(['json', 'usfm'])),

    /**
     * The number of books that are contained in this commentary.
     *
     * Complete commentaries should have the same number of books as the Bible (66).
     */
    numberOfBooks: z.number().meta({
        description:
            'The number of books that are contained in this commentary. Complete commentaries should have the same number of books as the Bible (66).',
    }),

    /**
     * The total number of chapters that are contained in this translation.
     *
     * Complete commentaries should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: z.number().meta({
        description:
            'The total number of chapters that are contained in this commentary. Complete commentaries should have the same number of chapters as the Bible (1,189).',
    }),

    /**
     * The total number of verses that are contained in this commentary.
     *
     * Complete commentaries should have the same number of verses as the Bible (around 31,102 - some commentaries exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: z.number().meta({
        description:
            'The total number of verses that are contained in this commentary. Complete commentaries should have the same number of verses as the Bible (around 31,102 - some commentaries exclude verses based on the aparent likelyhood of existing in the original source texts).',
    }),

    /**
     * The total number of profiles that are contained in this commentary.
     *
     * Profiles are used to provide additional information about people and people groups that are mentioned in the Bible.
     */
    totalNumberOfProfiles: z.number().meta({
        description:
            'The total number of profiles that are contained in this commentary. Profiles are used to provide additional information about people and people groups that are mentioned in the Bible.',
    }),

    /**
     * Gets the name of the language that the commentary is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName: z.string().optional().meta({
        description:
            'Gets the name of the language that the commentary is in. Null or undefined if the name of the language is not known.',
    }),

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName: z.string().optional().meta({
        description:
            "Gets the name of the language in English. Null or undefined if the language doesn't have an english name.",
    }),
}).meta({
    id: 'ApiCommentary',
    description: 'Defines a commentary that is used in the API.',
});

export type ApiCommentary = z.infer<typeof ApiCommentarySchema>;

/**
 * Defines an interface that contains information about the books that are available for a translation.
 */
export const ApiTranslationBooksSchema = z
    .object({
        /**
         * The translation information for the books.
         */
        translation: z
            .lazy(() => ApiTranslationSchema)
            .meta({
                description: 'The translation information for the books.',
            }),

        /**
         * The list of books that are available for the translation.
         */
        books: z.array(z.lazy(() => ApiTranslationBookSchema)).meta({
            description:
                'The list of books that are available for the translation.',
        }),
    })
    .meta({
        id: 'ApiTranslationBooks',
        description:
            'Defines an interface that contains information about the books that are available for a translation.',
    });

export type ApiTranslationBooks = z.infer<typeof ApiTranslationBooksSchema>;

/**
 * Defines an interface that contains information about the books that are available for a commentary.
 */
export const ApiCommentaryBooksSchema = z
    .object({
        /**
         * The commentary information for the books.
         */
        commentary: z
            .lazy(() => ApiCommentarySchema)
            .meta({
                description: 'The commentary information for the books.',
            }),

        /**
         * The list of books that are available for the commentary.
         */
        books: z.array(z.lazy(() => ApiCommentaryBookSchema)).meta({
            description:
                'The list of books that are available for the commentary.',
        }),
    })
    .meta({
        id: 'ApiCommentaryBooks',
        description:
            'Defines an interface that contains information about the books that are available for a commentary.',
    });

export type ApiCommentaryBooks = z.infer<typeof ApiCommentaryBooksSchema>;

/**
 * Defines an interface that contains information about the books that are available for a dataset.
 */
export const ApiDatasetBooksSchema = z
    .object({
        /**
         * The dataset information for the books.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the books.',
            }),

        /**
         * The list of books that are available for the dataset.
         */
        books: z.array(z.lazy(() => ApiDatasetBookSchema)).meta({
            description:
                'The list of books that are available for the dataset.',
        }),
    })
    .meta({
        id: 'ApiDatasetBooks',
        description:
            'Defines an interface that contains information about the books that are available for a dataset.',
    });

export type ApiDatasetBooks = z.infer<typeof ApiDatasetBooksSchema>;

/**
 * Defines a Zod schema for a summary of a person in a dataset.
 */
export const ApiDatasetPersonSummarySchema = z
    .object({
        /**
         * The ID of the person.
         */
        id: z.string().meta({
            description: 'The ID of the person.',
        }),

        /**
         * The name of the person.
         */
        name: z.string().meta({
            description: 'The name of the person.',
        }),

        /**
         * Whether the name of the person is a proper name.
         */
        isProperName: z.boolean().optional().meta({
            description: 'Whether the name of the person is a proper name.',
        }),

        /**
         * The gender of the person.
         */
        gender: z.string().optional().meta({
            description: 'The gender of the person.',
        }),

        /**
         * The number of Bible references that mention the person.
         */
        numberOfReferences: z.number().meta({
            description:
                'The number of Bible references that mention the person.',
        }),

        /**
         * The API link for the person.
         */
        thisPersonApiLink: z.string().meta({
            description:
                'The API link for the person. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetPersonSummary',
        description: 'Defines a summary of a person in a dataset.',
    });

export type ApiDatasetPersonSummary = z.infer<
    typeof ApiDatasetPersonSummarySchema
>;

/**
 * Defines a Zod schema for the list of people in a dataset.
 * Maps to the /api/d/:datasetId/people.json endpoint.
 */
export const ApiDatasetPeopleSchema = z
    .object({
        /**
         * The dataset information for the people.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the people.',
            }),

        /**
         * The list of people that are available for the dataset.
         */
        people: z.array(ApiDatasetPersonSummarySchema).meta({
            description:
                'The list of people that are available for the dataset.',
        }),
    })
    .meta({
        id: 'ApiDatasetPeople',
        description:
            'The list of people in a dataset. Maps to the /api/d/:datasetId/people.json endpoint.',
    });

export type ApiDatasetPeople = z.infer<typeof ApiDatasetPeopleSchema>;

/**
 * Defines a Zod schema for the information about a person in a dataset.
 * Maps to the /api/d/:datasetId/people/:personId.json endpoint.
 */
export const ApiDatasetPersonSchema = z
    .object({
        /**
         * The dataset information for the person.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the person.',
            }),

        /**
         * The information about the person.
         */
        person: DatasetPersonSchema.meta({
            description: 'The information about the person.',
        }),

        /**
         * The API link for this person.
         */
        thisPersonApiLink: z.string().meta({
            description:
                'The API link for this person. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetPerson',
        description:
            'The information about a person in a dataset. Maps to the /api/d/:datasetId/people/:personId.json endpoint.',
    });

export type ApiDatasetPerson = z.infer<typeof ApiDatasetPersonSchema>;

/**
 * Defines a Zod schema for a summary of a place in a dataset.
 */
export const ApiDatasetPlaceSummarySchema = z
    .object({
        /**
         * The ID of the place.
         */
        id: z.string().meta({
            description: 'The ID of the place.',
        }),

        /**
         * The name of the place.
         */
        name: z.string().meta({
            description: 'The name of the place.',
        }),

        /**
         * The type of geographical feature that the place is.
         */
        featureType: z.string().optional().meta({
            description:
                'The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.',
        }),

        /**
         * The latitude of the place.
         */
        latitude: z.number().optional().meta({
            description: 'The latitude of the place.',
        }),

        /**
         * The longitude of the place.
         */
        longitude: z.number().optional().meta({
            description: 'The longitude of the place.',
        }),

        /**
         * The number of Bible references that mention the place.
         */
        numberOfReferences: z.number().meta({
            description:
                'The number of Bible references that mention the place.',
        }),

        /**
         * The API link for the place.
         */
        thisPlaceApiLink: z.string().meta({
            description:
                'The API link for the place. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetPlaceSummary',
        description: 'Defines a summary of a place in a dataset.',
    });

export type ApiDatasetPlaceSummary = z.infer<
    typeof ApiDatasetPlaceSummarySchema
>;

/**
 * Defines a Zod schema for the list of places in a dataset.
 * Maps to the /api/d/:datasetId/places.json endpoint.
 */
export const ApiDatasetPlacesSchema = z
    .object({
        /**
         * The dataset information for the places.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the places.',
            }),

        /**
         * The list of places that are available for the dataset.
         */
        places: z.array(ApiDatasetPlaceSummarySchema).meta({
            description:
                'The list of places that are available for the dataset.',
        }),
    })
    .meta({
        id: 'ApiDatasetPlaces',
        description:
            'The list of places in a dataset. Maps to the /api/d/:datasetId/places.json endpoint.',
    });

export type ApiDatasetPlaces = z.infer<typeof ApiDatasetPlacesSchema>;

/**
 * Defines a Zod schema for the information about a place in a dataset.
 * Maps to the /api/d/:datasetId/places/:placeId.json endpoint.
 */
export const ApiDatasetPlaceSchema = z
    .object({
        /**
         * The dataset information for the place.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the place.',
            }),

        /**
         * The information about the place.
         */
        place: DatasetPlaceSchema.meta({
            description: 'The information about the place.',
        }),

        /**
         * The API link for this place.
         */
        thisPlaceApiLink: z.string().meta({
            description:
                'The API link for this place. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetPlace',
        description:
            'The information about a place in a dataset. Maps to the /api/d/:datasetId/places/:placeId.json endpoint.',
    });

export type ApiDatasetPlace = z.infer<typeof ApiDatasetPlaceSchema>;

/**
 * Defines a Zod schema for a summary of an event in a dataset.
 */
export const ApiDatasetEventSummarySchema = z
    .object({
        /**
         * The ID of the event.
         */
        id: z.string().meta({
            description: 'The ID of the event.',
        }),

        /**
         * The name of the event.
         */
        name: z.string().meta({
            description: 'The name of the event.',
        }),

        /**
         * The date that the event started at.
         */
        startDate: z.string().optional().meta({
            description:
                'The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.',
        }),

        /**
         * The number of Bible references that describe the event.
         */
        numberOfReferences: z.number().meta({
            description:
                'The number of Bible references that describe the event.',
        }),

        /**
         * The API link for the event.
         */
        thisEventApiLink: z.string().meta({
            description:
                'The API link for the event. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetEventSummary',
        description: 'Defines a summary of an event in a dataset.',
    });

export type ApiDatasetEventSummary = z.infer<
    typeof ApiDatasetEventSummarySchema
>;

/**
 * Defines a Zod schema for the list of events in a dataset.
 * Maps to the /api/d/:datasetId/events.json endpoint.
 */
export const ApiDatasetEventsSchema = z
    .object({
        /**
         * The dataset information for the events.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the events.',
            }),

        /**
         * The list of events that are available for the dataset.
         */
        events: z.array(ApiDatasetEventSummarySchema).meta({
            description:
                'The list of events that are available for the dataset.',
        }),
    })
    .meta({
        id: 'ApiDatasetEvents',
        description:
            'The list of events in a dataset. Maps to the /api/d/:datasetId/events.json endpoint.',
    });

export type ApiDatasetEvents = z.infer<typeof ApiDatasetEventsSchema>;

/**
 * Defines a Zod schema for the information about an event in a dataset.
 * Maps to the /api/d/:datasetId/events/:eventId.json endpoint.
 */
export const ApiDatasetEventSchema = z
    .object({
        /**
         * The dataset information for the event.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the event.',
            }),

        /**
         * The information about the event.
         */
        event: DatasetEventSchema.meta({
            description: 'The information about the event.',
        }),

        /**
         * The API link for this event.
         */
        thisEventApiLink: z.string().meta({
            description:
                'The API link for this event. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetEvent',
        description:
            'The information about an event in a dataset. Maps to the /api/d/:datasetId/events/:eventId.json endpoint.',
    });

export type ApiDatasetEvent = z.infer<typeof ApiDatasetEventSchema>;

/**
 * Defines a Zod schema for a summary of a people group in a dataset.
 */
export const ApiDatasetPeopleGroupSummarySchema = z
    .object({
        /**
         * The ID of the people group.
         */
        id: z.string().meta({
            description: 'The ID of the people group.',
        }),

        /**
         * The name of the people group.
         */
        name: z.string().meta({
            description: 'The name of the people group.',
        }),

        /**
         * The number of people that are members of the people group.
         */
        numberOfMembers: z.number().meta({
            description:
                'The number of people that are members of the people group.',
        }),

        /**
         * The API link for the people group.
         */
        thisPeopleGroupApiLink: z.string().meta({
            description:
                'The API link for the people group. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetPeopleGroupSummary',
        description: 'Defines a summary of a people group in a dataset.',
    });

export type ApiDatasetPeopleGroupSummary = z.infer<
    typeof ApiDatasetPeopleGroupSummarySchema
>;

/**
 * Defines a Zod schema for the list of people groups in a dataset.
 * Maps to the /api/d/:datasetId/groups.json endpoint.
 */
export const ApiDatasetPeopleGroupsSchema = z
    .object({
        /**
         * The dataset information for the people groups.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the people groups.',
            }),

        /**
         * The list of people groups that are available for the dataset.
         */
        groups: z.array(ApiDatasetPeopleGroupSummarySchema).meta({
            description:
                'The list of people groups that are available for the dataset.',
        }),
    })
    .meta({
        id: 'ApiDatasetPeopleGroups',
        description:
            'The list of people groups in a dataset. Maps to the /api/d/:datasetId/groups.json endpoint.',
    });

export type ApiDatasetPeopleGroups = z.infer<
    typeof ApiDatasetPeopleGroupsSchema
>;

/**
 * Defines a Zod schema for the information about a people group in a dataset.
 * Maps to the /api/d/:datasetId/groups/:groupId.json endpoint.
 */
export const ApiDatasetPeopleGroupSchema = z
    .object({
        /**
         * The dataset information for the people group.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the people group.',
            }),

        /**
         * The information about the people group.
         */
        group: DatasetPeopleGroupSchema.meta({
            description: 'The information about the people group.',
        }),

        /**
         * The API link for this people group.
         */
        thisPeopleGroupApiLink: z.string().meta({
            description:
                'The API link for this people group. Relative to the API origin.',
        }),
    })
    .meta({
        id: 'ApiDatasetPeopleGroup',
        description:
            'The information about a people group in a dataset. Maps to the /api/d/:datasetId/groups/:groupId.json endpoint.',
    });

export type ApiDatasetPeopleGroup = z.infer<typeof ApiDatasetPeopleGroupSchema>;

/**
 * Defines a Zod schema for a person that appears in a chapter of a dataset.
 */
export const ApiDatasetChapterPersonSchema = z
    .object({
        /**
         * The ID of the person.
         */
        id: z.string().meta({
            description: 'The ID of the person.',
        }),

        /**
         * The name of the person.
         */
        name: z.string().meta({
            description: 'The name of the person.',
        }),

        /**
         * Whether the name of the person is a proper name.
         */
        isProperName: z.boolean().optional().meta({
            description: 'Whether the name of the person is a proper name.',
        }),

        /**
         * The gender of the person.
         */
        gender: z.string().optional().meta({
            description: 'The gender of the person.',
        }),

        /**
         * The year that the person was born.
         * Negative numbers are years BC. Positive numbers are years AD.
         */
        birthYear: z.number().optional().meta({
            description:
                'The year that the person was born. Negative numbers are years BC. Positive numbers are years AD.',
        }),

        /**
         * The year that the person died.
         * Negative numbers are years BC. Positive numbers are years AD.
         */
        deathYear: z.number().optional().meta({
            description:
                'The year that the person died. Negative numbers are years BC. Positive numbers are years AD.',
        }),

        /**
         * The API link for the person.
         */
        apiLink: z.string().meta({
            description:
                'The API link for the person. Relative to the API origin.',
        }),

        /**
         * The numbers of the verses in the chapter that mention the person.
         * Sorted in ascending order.
         */
        verses: z.array(z.number()).meta({
            description:
                'The numbers of the verses in the chapter that mention the person. Sorted in ascending order.',
        }),
    })
    .meta({
        id: 'ApiDatasetChapterPerson',
        description: 'Defines a person that appears in a chapter of a dataset.',
    });

export type ApiDatasetChapterPerson = z.infer<
    typeof ApiDatasetChapterPersonSchema
>;

/**
 * Defines a Zod schema for a place that appears in a chapter of a dataset.
 */
export const ApiDatasetChapterPlaceSchema = z
    .object({
        /**
         * The ID of the place.
         */
        id: z.string().meta({
            description: 'The ID of the place.',
        }),

        /**
         * The name of the place.
         */
        name: z.string().meta({
            description: 'The name of the place.',
        }),

        /**
         * The type of geographical feature that the place is.
         */
        featureType: z.string().optional().meta({
            description:
                'The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.',
        }),

        /**
         * The latitude of the place.
         */
        latitude: z.number().optional().meta({
            description: 'The latitude of the place.',
        }),

        /**
         * The longitude of the place.
         */
        longitude: z.number().optional().meta({
            description: 'The longitude of the place.',
        }),

        /**
         * The API link for the place.
         */
        apiLink: z.string().meta({
            description:
                'The API link for the place. Relative to the API origin.',
        }),

        /**
         * The numbers of the verses in the chapter that mention the place.
         * Sorted in ascending order.
         */
        verses: z.array(z.number()).meta({
            description:
                'The numbers of the verses in the chapter that mention the place. Sorted in ascending order.',
        }),
    })
    .meta({
        id: 'ApiDatasetChapterPlace',
        description: 'Defines a place that appears in a chapter of a dataset.',
    });

export type ApiDatasetChapterPlace = z.infer<
    typeof ApiDatasetChapterPlaceSchema
>;

/**
 * Defines a Zod schema for an event that appears in a chapter of a dataset.
 */
export const ApiDatasetChapterEventSchema = z
    .object({
        /**
         * The ID of the event.
         */
        id: z.string().meta({
            description: 'The ID of the event.',
        }),

        /**
         * The name of the event.
         */
        name: z.string().meta({
            description: 'The name of the event.',
        }),

        /**
         * The date that the event started at.
         */
        startDate: z.string().optional().meta({
            description:
                'The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.',
        }),

        /**
         * The API link for the event.
         */
        apiLink: z.string().meta({
            description:
                'The API link for the event. Relative to the API origin.',
        }),

        /**
         * The numbers of the verses in the chapter that describe the event.
         * Sorted in ascending order.
         */
        verses: z.array(z.number()).meta({
            description:
                'The numbers of the verses in the chapter that describe the event. Sorted in ascending order.',
        }),
    })
    .meta({
        id: 'ApiDatasetChapterEvent',
        description: 'Defines an event that appears in a chapter of a dataset.',
    });

export type ApiDatasetChapterEvent = z.infer<
    typeof ApiDatasetChapterEventSchema
>;

/**
 * Defines a Zod schema for the entity data for a chapter in a dataset.
 */
export const ApiDatasetEntityChapterDataSchema = z
    .object({
        /**
         * The number of the chapter.
         */
        number: z.number().meta({
            description: 'The number of the chapter.',
        }),

        /**
         * The people that appear in the chapter.
         * Sorted by the first verse that they appear in.
         */
        people: z.array(ApiDatasetChapterPersonSchema).meta({
            description:
                'The people that appear in the chapter. Sorted by the first verse that they appear in.',
        }),

        /**
         * The places that appear in the chapter.
         * Sorted by the first verse that they appear in.
         */
        places: z.array(ApiDatasetChapterPlaceSchema).meta({
            description:
                'The places that appear in the chapter. Sorted by the first verse that they appear in.',
        }),

        /**
         * The events that appear in the chapter.
         * Sorted by the first verse that they appear in.
         */
        events: z.array(ApiDatasetChapterEventSchema).meta({
            description:
                'The events that appear in the chapter. Sorted by the first verse that they appear in.',
        }),
    })
    .meta({
        id: 'ApiDatasetEntityChapterData',
        description:
            'Defines the entity data for a chapter in a dataset. Contains the people, places, and events that appear in the chapter.',
    });

export type ApiDatasetEntityChapterData = z.infer<
    typeof ApiDatasetEntityChapterDataSchema
>;

/**
 * Defines a Zod schema for the entities that appear in a chapter of a book for a dataset.
 * Maps to the /api/d/:datasetId/:bookId/:chapterNumber.json endpoint for datasets that contain entities.
 */
export const ApiDatasetEntityBookChapterSchema = z
    .object({
        /**
         * The dataset information for the book chapter.
         */
        dataset: z
            .lazy(() => ApiDatasetSchema)
            .meta({
                description: 'The dataset information for the book chapter.',
            }),

        /**
         * The book information for the book chapter.
         */
        book: z
            .lazy(() => ApiDatasetBookSchema)
            .meta({
                description: 'The book information for the book chapter.',
            }),

        /**
         * The entity data for the chapter.
         */
        chapter: ApiDatasetEntityChapterDataSchema.meta({
            description: 'The entity data for the chapter.',
        }),

        /**
         * The link to this chapter.
         */
        thisChapterLink: z.string().meta({
            description:
                'The link to this chapter. Relative to the API origin.',
        }),

        /**
         * The reference for this chapter.
         */
        thisChapterReference: z
            .lazy(() => DatasetChapterReferenceSchema)
            .meta({
                description: 'The reference for this chapter.',
            }),

        /**
         * The link to the next chapter.
         * Null if this is the last chapter in the dataset.
         */
        nextChapterApiLink: z.string().nullable().meta({
            description:
                'The link to the next chapter. Relative to the API origin. Null if this is the last chapter in the dataset.',
        }),

        /**
         * The reference for the next chapter.
         * Null if this is the last chapter in the dataset.
         */
        nextChapterReference: z
            .lazy(() => DatasetChapterReferenceSchema)
            .nullable()
            .meta({
                description:
                    'The reference for the next chapter. Null if this is the last chapter in the dataset.',
            }),

        /**
         * The link to the previous chapter.
         * Null if this is the first chapter in the dataset.
         */
        previousChapterApiLink: z.string().nullable().meta({
            description:
                'The link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the dataset.',
        }),

        /**
         * The reference for the previous chapter.
         * Null if this is the first chapter in the dataset.
         */
        previousChapterReference: z
            .lazy(() => DatasetChapterReferenceSchema)
            .nullable()
            .meta({
                description:
                    'The reference for the previous chapter. Null if this is the first chapter in the dataset.',
            }),

        /**
         * The number of people that appear in the chapter.
         */
        numberOfPeople: z.number().meta({
            description: 'The number of people that appear in the chapter.',
        }),

        /**
         * The number of places that appear in the chapter.
         */
        numberOfPlaces: z.number().meta({
            description: 'The number of places that appear in the chapter.',
        }),

        /**
         * The number of events that appear in the chapter.
         */
        numberOfEvents: z.number().meta({
            description: 'The number of events that appear in the chapter.',
        }),
    })
    .meta({
        id: 'ApiDatasetEntityBookChapter',
        description:
            'The entities (people, places, and events) that appear in a chapter of a book for a dataset. Maps to the /api/d/:datasetId/:bookId/:chapterNumber.json endpoint for datasets that contain entities.',
    });

export type ApiDatasetEntityBookChapter = z.infer<
    typeof ApiDatasetEntityBookChapterSchema
>;

/**
 * Defines an interface that contains information about the profiles that are available for a commentary.
 */
export const ApiCommentaryProfilesSchema = z
    .object({
        /**
         * The commentary information for the books.
         */
        commentary: z
            .lazy(() => ApiCommentarySchema)
            .meta({
                description: 'The commentary information for the profiles.',
            }),

        /**
         * The list of profiles that are available for the commentary.
         */
        profiles: z.array(z.lazy(() => ApiCommentaryProfileSchema)).meta({
            description:
                'The list of profiles that are available for the commentary.',
        }),
    })
    .meta({
        id: 'ApiCommentaryProfiles',
        description:
            'Defines an interface that contains information about the profiles that are available for a commentary.',
    });

export type ApiCommentaryProfiles = z.infer<typeof ApiCommentaryProfilesSchema>;

/**
 * Defines an interface that contains information about a profile.
 */
export const ApiCommentaryProfileSchema = CommentaryProfileSchema.extend({
    /**
     * The link to this profile.
     */
    thisProfileLink: z.string().meta({
        description:
            'The API link for this profile. Relative to the API origin.',
    }),

    /**
     * The link to the chapter that this profile references in the commentary.
     */
    referenceChapterLink: z.string().nullable().meta({
        description:
            "The API link to the chapter that this profile references in the commentary. Relative to the API origin. Null if the profile doesn't reference a specific chapter.",
    }),
}).meta({
    id: 'ApiCommentaryProfile',
    description:
        'Defines an interface that contains information about a profile.',
});

export type ApiCommentaryProfile = z.infer<typeof ApiCommentaryProfileSchema>;

export const TranslationChapterReferenceSchema = z
    .object({
        translationId: z.string().meta({
            description:
                'The ID of the translation that the chapter reference is for.',
        }),

        book: BookIdSchema,

        chapter: z.int().positive().meta({
            description: 'The chapter number of the chapter reference.',
        }),
    })
    .meta({
        id: 'TranslationChapterReference',
        description: 'Defines a reference to a chapter in a translation.',
    });

export type TranslationChapterReference = z.infer<
    typeof TranslationChapterReferenceSchema
>;

export const CommentaryChapterReferenceSchema = z
    .object({
        commentaryId: z.string().meta({
            description:
                'The ID of the commentary that the chapter reference is for.',
        }),

        book: BookIdSchema,

        chapter: z.int().positive().meta({
            description: 'The chapter number of the chapter reference.',
        }),
    })
    .meta({
        id: 'CommentaryChapterReference',
        description: 'Defines a reference to a chapter in a commentary.',
    });

export type CommentaryChapterReference = z.infer<
    typeof CommentaryChapterReferenceSchema
>;

export const DatasetChapterReferenceSchema = z
    .object({
        datasetId: z.string().meta({
            description:
                'The ID of the dataset that the chapter reference is for.',
        }),

        book: BookIdSchema,

        chapter: z.int().positive().meta({
            description: 'The chapter number of the chapter reference.',
        }),
    })
    .meta({
        id: 'DatasetChapterReference',
        description: 'Defines a reference to a chapter in a dataset.',
    });

export type DatasetChapterReference = z.infer<
    typeof DatasetChapterReferenceSchema
>;

/**
 * Defines a translation book that is used in the API.
 */
export const ApiTranslationBookSchema = TranslationBookSchema.extend({
    /**
     * The number of the first chapter in the book.
     */
    firstChapterNumber: z.number().meta({
        description: 'The number of the first chapter in the book.',
    }),

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: z.string().meta({
        description: 'The link to the first chapter of the book.',
    }),

    /**
     * The reference for the first chapter in the book.
     */
    firstChapterReference: TranslationChapterReferenceSchema,

    /**
     * The number of the last chapter in the book.
     */
    lastChapterNumber: z.number().meta({
        description: 'The number of the last chapter in the book.',
    }),

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: z.string().meta({
        description: 'The link to the last chapter of the book.',
    }),

    /**
     * The reference for the last chapter in the book.
     */
    lastChapterReference: TranslationChapterReferenceSchema,

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: z.number().meta({
        description: 'The number of chapters that the book contains.',
    }),

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: z.number().meta({
        description: 'The number of verses that the book contains.',
    }),
}).meta({
    id: 'ApiTranslationBook',
    description:
        'Defines a schema that contains information about a translation book.',
});

export type ApiTranslationBook = z.infer<typeof ApiTranslationBookSchema>;

/**
 * Defines a commentary book that is used in the API.
 */
export const ApiCommentaryBookSchema = CommentaryBookSchema.extend({
    /**
     * The number of the first chapter in the book.
     *
     * Null if the comentary book has no chapters.
     */
    firstChapterNumber: z.number().nullable().meta({
        description:
            'The number of the first chapter in the book. Null if the comentary book has no chapters.',
    }),

    /**
     * The link to the first chapter of the book.
     *
     * Null if the comentary book has no chapters.
     */
    firstChapterApiLink: z.string().nullable().meta({
        description:
            'The link to the first chapter of the book. Null if the comentary book has no chapters.',
    }),

    /**
     * The reference for the first chapter in the book.
     */
    firstChapterReference: CommentaryChapterReferenceSchema.nullable().meta({
        description:
            'The reference for the first chapter in the book. Null if the comentary book has no chapters.',
    }),

    /**
     * The number of the last chapter in the book.
     *
     * Null if the comentary book has no chapters.
     */
    lastChapterNumber: z.number().nullable().meta({
        description:
            'The number of the last chapter in the book. Null if the comentary book has no chapters.',
    }),

    /**
     * The link to the last chapter of the book.
     *
     * Null if the comentary book has no chapters.
     */
    lastChapterApiLink: z.string().nullable().meta({
        description:
            'The link to the last chapter of the book. Null if the comentary book has no chapters.',
    }),

    /**
     * The reference for the last chapter in the book.
     */
    lastChapterReference: CommentaryChapterReferenceSchema.nullable().meta({
        description:
            'The reference for the last chapter in the book. Null if the comentary book has no chapters.',
    }),

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: z.number().meta({
        description: 'The number of chapters that the book contains.',
    }),

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: z.number().meta({
        description: 'The number of verses that the book contains.',
    }),
}).meta({
    id: 'ApiCommentaryBook',
    description:
        'Defines a schema that contains information about a commentary book.',
});

export type ApiCommentaryBook = z.infer<typeof ApiCommentaryBookSchema>;

/**
 * Defines an interface that contains information about a book in a dataset.
 */
export const ApiDatasetBookSchema = DatasetBookSchema.extend({
    /**
     * The number of the first chapter in the book.
     */
    firstChapterNumber: z.number().meta({
        description: 'The number of the first chapter in the book.',
    }),

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: z.string().meta({
        description: 'The link to the first chapter of the book.',
    }),

    /**
     * The reference for the first chapter in the book.
     */
    firstChapterReference: DatasetChapterReferenceSchema,

    /**
     * The number of the last chapter in the book.
     */
    lastChapterNumber: z.number().meta({
        description: 'The number of the last chapter in the book.',
    }),

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: z.string().meta({
        description: 'The link to the last chapter of the book.',
    }),

    /**
     * The reference for the last chapter in the book.
     */
    lastChapterReference: DatasetChapterReferenceSchema,

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: z.number().meta({
        description: 'The number of chapters that the book contains.',
    }),

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: z.number().meta({
        description: 'The number of verses that the book contains.',
    }),

    /**
     * The number of references that the book contains.
     */
    totalNumberOfReferences: z.number().meta({
        description: 'The number of references that the book contains.',
    }),
}).meta({
    id: 'ApiDatasetBook',
    description:
        'Defines a schema that contains information about a book in a dataset.',
});

export type ApiDatasetBook = z.infer<typeof ApiDatasetBookSchema>;

/**
 * Defines an interface that contains information about a book chapter.
 */
// The word annotations are published as a separate file, and are linked to by
// thisChapterWordsLink instead of being included inline.
const ApiTranslationBookChapterBaseSchema = TranslationBookChapterSchema.omit({
    thisChapterWords: true,
});

export const ApiTranslationBookChapterSchema =
    ApiTranslationBookChapterBaseSchema.extend({
        /**
         * The translation information for the book chapter.
         */
        translation: z
            .lazy(() => ApiTranslationSchema)
            .meta({
                description:
                    'The translation information for the book chapter.',
            }),

        /**
         * The book information for the book chapter.
         */
        book: z
            .lazy(() => ApiTranslationBookSchema)
            .meta({
                description: 'The book information for the book chapter.',
            }),

        /**
         * The link to this chapter.
         */
        thisChapterLink: z.string().meta({
            description:
                'The API link for this chapter. Relative to the API origin.',
        }),

        /**
         * The reference for this chapter.
         */
        thisChapterReference: TranslationChapterReferenceSchema,

        /**
         * The link to the next chapter.
         * Null if this is the last chapter in the translation.
         */
        nextChapterApiLink: z.string().nullable().meta({
            description:
                'The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.',
        }),

        /**
         * The reference for the next chapter.
         * Null if this is the last chapter in the translation.
         */
        nextChapterReference: TranslationChapterReferenceSchema.nullable().meta(
            {
                description:
                    'The reference for the next chapter. Null if this is the last chapter in the translation.',
            }
        ),

        /**
         * The links to the audio versions for the next chapter.
         * Null if this is the last chapter in the translation.
         */
        nextChapterAudioLinks: z
            .record(z.string(), z.string())
            .nullable()
            .meta({
                description:
                    'The links to the audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.',
            }),

        /**
         * The links to the audio timings for different audio versions for the chapter.
         */
        thisChapterAudioTimings: z
            .record(z.string(), z.string())
            .meta({
                description:
                    'The links to the audio timings for different audio versions for the chapter. Relative to the API origin.',
            }),

        /**
         * The links to the audio timings for different audio versions for the next chapter.
         * Null if this is the last chapter in the translation.
         */
        nextChapterAudioTimings: z
            .record(z.string(), z.string())
            .nullable()
            .meta({
                description:
                    'The links to the audio timings for different audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.',
            }),

        /**
         * The links to the audio timings for different audio versions for the previous chapter.
         * Null if this is the first chapter in the translation.
         */
        previousChapterAudioTimings: z
            .record(z.string(), z.string())
            .nullable()
            .meta({
                description:
                    'The links to the audio timings for different audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.',
            }),

        /**
         * The link to the previous chapter.
         * Null if this is the first chapter in the translation.
         */
        previousChapterApiLink: z.string().nullable().meta({
            description:
                'The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.',
        }),

        /**
         * The reference for the previous chapter.
         * Null if this is the first chapter in the translation.
         */
        previousChapterReference:
            TranslationChapterReferenceSchema.nullable().meta({
                description:
                    'The reference for the previous chapter. Null if this is the first chapter in the translation.',
            }),

        /**
         * The links to the audio versions for the previous chapter.
         * Null if this is the first chapter in the translation.
         */
        previousChapterAudioLinks: z
            .record(z.string(), z.string())
            .nullable()
            .meta({
                description:
                    'The links to the audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.',
            }),

        /**
         * The link to the word-level annotations for the chapter.
         * Omitted if the chapter doesn't have any word-level annotations.
         */
        thisChapterWordsLink: z.string().optional().meta({
            description:
                "The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.",
        }),

        /**
         * The link to the word-level annotations for the next chapter.
         * Omitted if this is the last chapter in the translation, or if the next
         * chapter doesn't have any word-level annotations.
         */
        nextChapterWordsLink: z.string().optional().meta({
            description:
                "The link to the word-level annotations for the next chapter. Relative to the API origin. Omitted if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.",
        }),

        /**
         * The link to the word-level annotations for the previous chapter.
         * Omitted if this is the first chapter in the translation, or if the
         * previous chapter doesn't have any word-level annotations.
         */
        previousChapterWordsLink: z.string().optional().meta({
            description:
                "The link to the word-level annotations for the previous chapter. Relative to the API origin. Omitted if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.",
        }),

        /**
         * The number of verses that the chapter contains.
         */
        numberOfVerses: z.number().meta({
            description: 'The number of verses that the chapter contains.',
        }),

        /**
         * The link to the simplified version of this chapter.
         * Omitted if simplified chapters were not generated.
         */
        simpleChapterApiLink: z.string().optional().meta({
            description:
                'The API link to the simplified version of this chapter. Relative to the API origin. Omitted if simplified chapters are not available.',
        }),
    }).meta({
        id: 'ApiTranslationBookChapter',
        description:
            'Defines an interface that contains information about a book chapter in a translation.',
    });

export type ApiTranslationBookChapter = z.infer<
    typeof ApiTranslationBookChapterSchema
>;

/**
 * Defines an interface that contains information about a book chapter in a translation,
 * using the simplified chapter format.
 */
export const ApiSimpleTranslationBookChapterSchema =
    ApiTranslationBookChapterSchema.omit({
        chapter: true,
        simpleChapterApiLink: true,
    })
        .extend({
            /**
             * The simplified information for the chapter.
             */
            chapter: z
                .lazy(() => SimpleChapterDataSchema)
                .meta({
                    description:
                        'The simplified information for the chapter. Each verse contains a single text string, and the footnotes and formatting are represented by offsets into that string.',
                }),

            /**
             * The link to the regular version of this chapter.
             */
            fullChapterApiLink: z.string().meta({
                description:
                    'The API link to the regular (non-simplified) version of this chapter. Relative to the API origin.',
            }),
        })
        .meta({
            id: 'ApiSimpleTranslationBookChapter',
            description:
                'Defines an interface that contains information about a book chapter in a translation, using the simplified chapter format.',
        });

export type ApiSimpleTranslationBookChapter = z.infer<
    typeof ApiSimpleTranslationBookChapterSchema
>;

/**
 * Defines an interface that contains information about a book chapter.
 */
export const ApiCommentaryBookChapterSchema =
    CommentaryBookChapterSchema.extend({
        /**
         * The commentary information for the book chapter.
         */
        commentary: z
            .lazy(() => ApiCommentarySchema)
            .meta({
                description: 'The commentary information for the book chapter.',
            }),

        /**
         * The book information for the book chapter.
         */
        book: z
            .lazy(() => ApiCommentaryBookSchema)
            .meta({
                description: 'The book information for the book chapter.',
            }),

        /**
         * The link to this chapter.
         */
        thisChapterLink: z.string().meta({
            description:
                'The API link for this chapter. Relative to the API origin.',
        }),

        thisChapterReference: CommentaryChapterReferenceSchema,

        /**
         * The link to the next chapter.
         * Null if this is the last chapter in the translation.
         */
        nextChapterApiLink: z.string().nullable().meta({
            description:
                'The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the commentary.',
        }),

        nextChapterReference: CommentaryChapterReferenceSchema.nullable().meta({
            description:
                'The reference for the next chapter. Null if this is the last chapter in the commentary.',
        }),

        /**
         * The link to the previous chapter.
         * Null if this is the first chapter in the translation.
         */
        previousChapterApiLink: z.string().nullable().meta({
            description:
                'The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the commentary.',
        }),

        previousChapterReference:
            CommentaryChapterReferenceSchema.nullable().meta({
                description:
                    'The reference for the previous chapter. Null if this is the first chapter in the commentary.',
            }),

        /**
         * The number of verses that the chapter contains.
         */
        numberOfVerses: z.number().meta({
            description: 'The number of verses that the chapter contains.',
        }),

        /**
         * The link to the simplified version of this chapter.
         * Omitted if simplified chapters were not generated.
         */
        simpleChapterApiLink: z.string().optional().meta({
            description:
                'The API link to the simplified version of this chapter. Relative to the API origin. Omitted if simplified chapters are not available.',
        }),
    }).meta({
        id: 'ApiCommentaryBookChapter',
        description:
            'Defines a schema that contains information about a book chapter in a commentary.',
    });

export type ApiCommentaryBookChapter = z.infer<
    typeof ApiCommentaryBookChapterSchema
>;

/**
 * Defines a schema that contains information about a book chapter in a commentary,
 * using the simplified chapter format.
 */
export const ApiSimpleCommentaryBookChapterSchema =
    ApiCommentaryBookChapterSchema.omit({
        chapter: true,
        simpleChapterApiLink: true,
    })
        .extend({
            /**
             * The simplified information for the chapter.
             */
            chapter: z
                .lazy(() => SimpleCommentaryChapterDataSchema)
                .meta({
                    description:
                        'The simplified information for the chapter. Each verse contains a single text string, and the footnotes and formatting are represented by offsets into that string.',
                }),

            /**
             * The link to the regular version of this chapter.
             */
            fullChapterApiLink: z.string().meta({
                description:
                    'The API link to the regular (non-simplified) version of this chapter. Relative to the API origin.',
            }),
        })
        .meta({
            id: 'ApiSimpleCommentaryBookChapter',
            description:
                'Defines a schema that contains information about a book chapter in a commentary, using the simplified chapter format.',
        });

export type ApiSimpleCommentaryBookChapter = z.infer<
    typeof ApiSimpleCommentaryBookChapterSchema
>;

/**
 * Defines an interface that contains information about a book chapter.
 */
export const ApiDatasetBookChapterSchema = DatasetBookChapterSchema.extend({
    /**
     * The dataset information for the book chapter.
     */
    dataset: z
        .lazy(() => ApiDatasetSchema)
        .meta({
            description: 'The dataset information for the book chapter.',
        }),

    /**
     * The book information for the book chapter.
     */
    book: z
        .lazy(() => ApiDatasetBookSchema)
        .meta({
            description: 'The book information for the book chapter.',
        }),

    /**
     * The link to this chapter.
     */
    thisChapterLink: z.string().meta({
        description:
            'The API link for this chapter. Relative to the API origin.',
    }),

    thisChapterReference: DatasetChapterReferenceSchema,

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterApiLink: z.string().nullable().meta({
        description:
            'The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the dataset.',
    }),

    nextChapterReference: DatasetChapterReferenceSchema.nullable().meta({
        description:
            'The reference for the next chapter. Null if this is the last chapter in the dataset.',
    }),

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: z.string().nullable().meta({
        description:
            'The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the dataset.',
    }),

    previousChapterReference: DatasetChapterReferenceSchema.nullable().meta({
        description:
            'The reference for the previous chapter. Null if this is the first chapter in the dataset.',
    }),

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: z.number().meta({
        description: 'The number of verses that the chapter contains.',
    }),

    /**
     * The number of references that the chapter contains.
     */
    numberOfReferences: z.number().meta({
        description: 'The number of references that the chapter contains.',
    }),
}).meta({
    id: 'ApiDatasetBookChapter',
    description:
        'Defines a schema that contains information about a book chapter in a dataset.',
});

export type ApiDatasetBookChapter = z.infer<typeof ApiDatasetBookChapterSchema>;

export const ApiTranslationBookChapterAudioSchema = z.object({
    /**
     * The chapter that the audio is for.
     */
    chapter: z
        .lazy(() => ApiTranslationBookChapterSchema)
        .meta({
            description: 'The chapter that the audio is for.',
        }),

    /**
     * The link that the audio should be placed at.
     */
    link: z.string().meta({
        description:
            'The link that the audio should be placed at. Relative to the API origin.',
    }),

    /**
     * The original URL of the audio.
     */
    originalUrl: z.string().meta({
        description: 'The original URL of the audio.',
    }),
});

export type ApiTranslationBookChapterAudio = z.infer<
    typeof ApiTranslationBookChapterAudioSchema
>;

export const ApiTranslationBookChapterAudioTimingsSchema = z.object({
    /**
     * The ID of the translation.
     */
    translationId: z.string().meta({
        description: 'The ID of the translation.',
    }),

    /**
     * The ID of the book.
     */
    bookId: z.string().meta({
        description: 'The ID of the book.',
    }),

    /**
     * The number of the chapter.
     */
    chapterNumber: z.number().meta({
        description: 'The number of the chapter.',
    }),

    /**
     * The reader for the chapter.
     */
    reader: z.string().meta({
        description: 'The reader for the chapter.',
    }),

    /**
     * The link to the audio for these timings.
     */
    audioLink: z.string().meta({
        description: 'The link to the audio for these timings.',
    }),

    /**
     * The link to the information for this chapter.
     */
    thisChapterLink: z.string().meta({
        description: 'The link to the information for this chapter.',
    }),

    /**
     * The link to the information for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterLink: z.string().nullable().meta({
        description:
            'The link to the information for the next chapter. Null if this is the last chapter in the translation.',
    }),

    /**
     * The link to the information for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterLink: z.string().nullable().meta({
        description:
            'The link to the information for the previous chapter. Null if this is the first chapter in the translation.',
    }),

    /**
     * The link to this audio timings file.
     */
    thisChapterAudioTimingsLink: z.string().meta({
        description: 'The link to this audio timings file.',
    }),

    /**
     * The link to the timings for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterAudioTimingsLink: z.string().nullable().meta({
        description:
            'The link to the timings for the next chapter. Null if this is the last chapter in the translation.',
    }),

    /**
     * The link to the timings for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterAudioTimingsLink: z.string().nullable().meta({
        description:
            'The link to the timings for the previous chapter. Null if this is the first chapter in the translation.',
    }),

    /**
     * The times in seconds at which each verse starts, in order.
     */
    verses: z.array(z.number()).meta({
        description:
            'The times in seconds at which each verse starts, in order. The first number (index 0) is the time in the recording at which the first verse starts.',
    }),
}).meta({
    id: 'ApiTranslationBookChapterAudioTimings',
    description:
        'Defines an interface that contains the audio timings for a book chapter, for a specific reader.',
});

export type ApiTranslationBookChapterAudioTimings = z.infer<
    typeof ApiTranslationBookChapterAudioTimingsSchema
>;

export const ApiTranslationBookChapterWordsSchema = z.object({
    /**
     * The ID of the translation.
     */
    translationId: z.string().meta({
        description: 'The ID of the translation.',
    }),

    /**
     * The ID of the book.
     */
    bookId: z.string().meta({
        description: 'The ID of the book.',
    }),

    /**
     * The number of the chapter.
     */
    chapterNumber: z.number().meta({
        description: 'The number of the chapter.',
    }),

    /**
     * The link to the information for this chapter.
     */
    thisChapterLink: z.string().meta({
        description: 'The link to the information for this chapter.',
    }),

    /**
     * The link to the information for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterLink: z.string().nullable().meta({
        description:
            'The link to the information for the next chapter. Null if this is the last chapter in the translation.',
    }),

    /**
     * The link to the information for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterLink: z.string().nullable().meta({
        description:
            'The link to the information for the previous chapter. Null if this is the first chapter in the translation.',
    }),

    /**
     * The link to this words file.
     */
    thisChapterWordsLink: z.string().meta({
        description: 'The link to this words file.',
    }),

    /**
     * The link to the words for the next chapter.
     * Null if this is the last chapter in the translation, or if the next chapter
     * doesn't have any word-level annotations.
     */
    nextChapterWordsLink: z.string().nullable().meta({
        description:
            "The link to the words for the next chapter. Null if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.",
    }),

    /**
     * The link to the words for the previous chapter.
     * Null if this is the first chapter in the translation, or if the previous
     * chapter doesn't have any word-level annotations.
     */
    previousChapterWordsLink: z.string().nullable().meta({
        description:
            "The link to the words for the previous chapter. Null if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.",
    }),

    /**
     * The annotated words for each verse in the chapter.
     */
    verses: z.record(z.string(), z.array(z.lazy(() => ChapterWordSchema))).meta({
        description:
            'The annotated words for each verse in the chapter, keyed by verse number. Each list is in the order that the words occur in the verse.',
    }),
}).meta({
    id: 'ApiTranslationBookChapterWords',
    description:
        'Defines an interface that contains the word-level annotations for a book chapter.',
});

/**
 * Defines an interface that contains the word-level annotations for a book chapter,
 * with their offsets remapped onto the text of each simplified verse.
 */
export const ApiSimpleTranslationBookChapterWordsSchema =
    ApiTranslationBookChapterWordsSchema.extend({
        /**
         * The annotated words for each verse in the chapter.
         */
        verses: z
            .record(z.string(), z.array(z.lazy(() => SimpleChapterWordSchema)))
            .meta({
                description:
                    'The annotated words for each verse in the chapter, keyed by verse number. Each list is in the order that the words occur in the verse. The offsets are into the text of the simplified verse.',
            }),
    }).meta({
        id: 'ApiSimpleTranslationBookChapterWords',
        description:
            'Defines an interface that contains the word-level annotations for a book chapter, with their offsets remapped onto the text of each simplified verse.',
    });

export type ApiSimpleTranslationBookChapterWords = z.infer<
    typeof ApiSimpleTranslationBookChapterWordsSchema
>;

export type ApiTranslationBookChapterWords = z.infer<
    typeof ApiTranslationBookChapterWordsSchema
>;

export const ApiCommentaryProfileContentSchema = z.object({
    /**
     * The commentary information for the profile.
     */
    commentary: z
        .lazy(() => ApiCommentarySchema)
        .meta({
            description: 'The commentary information for the profile.',
        }),

    /**
     * The information about the profile.
     */
    profile: z
        .lazy(() => ApiCommentaryProfileSchema)
        .meta({
            description: 'The information about the profile.',
        }),

    /**
     * The content of the profile.
     */
    content: z.array(z.string()).meta({
        description:
            'The content of the profile. This is an array of strings, where each string is a paragraph of the profile content.',
    }),
});

export type ApiCommentaryProfileContent = z.infer<
    typeof ApiCommentaryProfileContentSchema
>;

/**
 * The options for generating the API.
 */
export interface GenerateApiOptions {
    /**
     * Whether to use the common name for the book chapter API link. If false, then book IDs are used.
     * Audio URLs will always use the book ID.
     * Defaults to false.
     */
    useCommonName?: boolean;

    /**
     * Whether to replace the audio URLs in the dataset with ones that are hosted locally.
     * If true, then the audio URLs in the dataset will be replaced with ones that reference files hosted by the API itself.
     * If false, then the audio URLs in the dataset will be left as is.
     * Defaults to false.
     */
    generateAudioFiles?: boolean;

    /**
     * Gets the english name of the given language.
     * If not provided, then the english name for the language will be unknown and omitted.
     * @param language The language to get the english name for.
     */
    getEnglishName?: (language: string) => string | null | undefined;

    /**
     * Gets the native name of the given language.
     * If not provided, then the native name for the language will be unknown and omitted.
     * @param language The language to get the native name for.
     */
    getNativeName?: (language: string) => string | null | undefined;

    /**
     * The prefix that should be added to paths that are generated.
     */
    pathPrefix?: string;

    /**
     * Whether to generate complete translation files for each translation.
     */
    generateCompleteTranslationFiles?: boolean;

    /**
     * Whether to generate simplified chapter files for each translation and commentary chapter.
     * In the simplified format, the content of each verse is a single string instead of a list of
     * formatted content, and the footnotes are available on the verses that they occur in.
     * Defaults to false.
     */
    generateSimpleChapterFiles?: boolean;
}

/**
 * Generates the API output for the given dataset.
 * @param dataset The dataset to generate the API for.
 * @param options The options for generating the API.
 */
export function generateApiForDataset(
    dataset: DatasetOutput,
    options: GenerateApiOptions = {}
): ApiOutput {
    const { useCommonName, pathPrefix } = options;
    const apiPathPrefix = pathPrefix ? pathPrefix : '';
    const generateSimpleChapterFiles = !!options.generateSimpleChapterFiles;
    let api: ApiOutput = {
        availableTranslations: {
            translations: [],
        },
        translationBooks: [],
        translationBookChapters: [],
        translationBookChapterAudio: [],
        translationBookChapterAudioTimings: [],
        translationBookChapterWords: [],
        translationComplete: [],
        simpleTranslationComplete: [],
        availableCommentaries: {
            commentaries: [],
        },
        commentaryBookChapters: [],
        commentaryBooks: [],
        commentaryProfiles: [],
        commentaryProfileContents: [],
        pathPrefix: apiPathPrefix,
    };

    if (generateSimpleChapterFiles) {
        api.simpleTranslationBookChapters = [];
        api.simpleCommentaryBookChapters = [];
    }

    // The simplified chapter-words files are also needed by the complete
    // translation files, which link to them instead of embedding the words
    // directly. Generate them whenever either feature needs them, so the
    // links in complete.simple.json always resolve even if per-chapter
    // simplified files aren't being generated.
    if (
        generateSimpleChapterFiles ||
        options.generateCompleteTranslationFiles
    ) {
        api.simpleTranslationBookChapterWords = [];
    }

    const getNativeName = options.getNativeName;
    const getEnglishName = options.getEnglishName;

    for (let { books, ...translation } of dataset.translations) {
        let numberOfBooks = 0;
        let numberOfApocryphalBooks = 0;

        for (let book of books) {
            if (book.isApocryphal) {
                numberOfApocryphalBooks++;
            } else {
                numberOfBooks++;
            }
        }

        const apiTranslation: ApiTranslation = {
            ...translation,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfBooksApiLink(
                translation.id,
                apiPathPrefix
            ),
            completeTranslationApiLink: options.generateCompleteTranslationFiles
                ? completeTranslationApiLink(translation.id, apiPathPrefix)
                : undefined,
            simpleCompleteTranslationApiLink:
                options.generateCompleteTranslationFiles
                    ? completeTranslationApiLink(
                          translation.id,
                          apiPathPrefix,
                          SIMPLE_JSON_EXTENSION
                      )
                    : undefined,
            numberOfBooks,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            languageName: getNativeName
                ? (getNativeName(translation.language) ?? undefined)
                : undefined,
            languageEnglishName: getEnglishName
                ? (getEnglishName(translation.language) ?? undefined)
                : undefined,
        };

        if (numberOfApocryphalBooks > 0) {
            apiTranslation.numberOfApocryphalBooks = numberOfApocryphalBooks;
        }

        const translationBooks: ApiTranslationBooks = {
            translation: apiTranslation,
            books: [],
        };

        let translationChapters: ApiTranslationBookChapter[] = [];
        let pendingAudioTimings: {
            reader: string;
            verses: number[];
            apiBookChapter: ApiTranslationBookChapter;
        }[] = [];
        let rawAudioTimingsByChapter = new Map<
            ApiTranslationBookChapter,
            TranslationBookChapterAudioTimings
        >();
        let rawWordsByChapter = new Map<
            ApiTranslationBookChapter,
            TranslationBookChapterWords
        >();

        for (let { chapters, ...book } of books) {
            const firstChapterNumber = chapters[0]?.chapter.number;
            const lastChapterNumber =
                chapters[chapters.length - 1]?.chapter.number;
            const apiBook: ApiTranslationBook = {
                ...book,
                firstChapterNumber,
                firstChapterApiLink: bookChapterApiLink(
                    translation.id,
                    getBookLink(book),
                    firstChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                firstChapterReference: {
                    translationId: translation.id,
                    book: book.id,
                    chapter: firstChapterNumber,
                },
                lastChapterNumber,
                lastChapterApiLink: bookChapterApiLink(
                    translation.id,
                    getBookLink(book),
                    lastChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                lastChapterReference: {
                    translationId: translation.id,
                    book: book.id,
                    chapter: lastChapterNumber,
                },
                numberOfChapters: chapters.length,
                totalNumberOfVerses: 0,
            };

            for (let {
                chapter,
                thisChapterAudioLinks,
                thisChapterAudioTimings,
                thisChapterWords,
            } of chapters) {
                const audio: TranslationBookChapterAudioLinks = {};
                const audioTimings: Record<string, string> = {};
                const apiBookChapter: ApiTranslationBookChapter = {
                    translation: apiTranslation,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookChapterApiLink(
                        translation.id,
                        getBookLink(book),
                        chapter.number,
                        'json',
                        apiPathPrefix
                    ),
                    thisChapterReference: {
                        translationId: translation.id,
                        book: book.id,
                        chapter: chapter.number,
                    },
                    thisChapterAudioLinks: audio,
                    nextChapterApiLink: null,
                    nextChapterReference: null,
                    nextChapterAudioLinks: null,
                    previousChapterApiLink: null,
                    previousChapterReference: null,
                    previousChapterAudioLinks: null,
                    thisChapterAudioTimings: audioTimings,
                    nextChapterAudioTimings: null,
                    previousChapterAudioTimings: null,
                    numberOfVerses: 0,
                    simpleChapterApiLink: generateSimpleChapterFiles
                        ? bookChapterApiLink(
                              translation.id,
                              getBookLink(book),
                              chapter.number,
                              SIMPLE_JSON_EXTENSION,
                              apiPathPrefix
                          )
                        : undefined,
                };

                for (let reader in thisChapterAudioLinks) {
                    if (options.generateAudioFiles) {
                        const apiAudio: ApiTranslationBookChapterAudio = {
                            chapter: apiBookChapter,
                            link: bookChapterAudioApiLink(
                                translation.id,
                                getBookLink(book),
                                chapter.number,
                                reader,
                                apiPathPrefix
                            ),
                            originalUrl: thisChapterAudioLinks[reader],
                        };
                        audio[reader] = apiAudio.link;
                        api.translationBookChapterAudio.push(apiAudio);
                    } else {
                        audio[reader] = thisChapterAudioLinks[reader];
                    }
                }

                rawAudioTimingsByChapter.set(
                    apiBookChapter,
                    thisChapterAudioTimings
                );

                if (thisChapterWords) {
                    apiBookChapter.thisChapterWordsLink =
                        bookChapterWordsApiLink(
                            translation.id,
                            getBookLink(book),
                            chapter.number,
                            apiPathPrefix
                        );
                    rawWordsByChapter.set(apiBookChapter, thisChapterWords);
                }

                for (let reader in thisChapterAudioTimings) {
                    const verses = thisChapterAudioTimings[reader];
                    audioTimings[reader] = bookChapterAudioTimingsApiLink(
                        translation.id,
                        getBookLink(book),
                        chapter.number,
                        reader,
                        apiPathPrefix
                    );
                    pendingAudioTimings.push({
                        reader,
                        verses,
                        apiBookChapter,
                    });
                }

                for (let c of chapter.content) {
                    if (c.type === 'verse') {
                        apiBookChapter.numberOfVerses++;
                    }
                }

                apiBook.totalNumberOfVerses += apiBookChapter.numberOfVerses;

                translationChapters.push(apiBookChapter);
                api.translationBookChapters.push(apiBookChapter);
            }

            translationBooks.books.push(apiBook);

            if (apiBook.isApocryphal) {
                if (!apiTranslation.totalNumberOfApocryphalChapters) {
                    apiTranslation.totalNumberOfApocryphalChapters = 0;
                }
                if (!apiTranslation.totalNumberOfApocryphalVerses) {
                    apiTranslation.totalNumberOfApocryphalVerses = 0;
                }
                apiTranslation.totalNumberOfApocryphalChapters +=
                    apiBook.numberOfChapters;
                apiTranslation.totalNumberOfApocryphalVerses +=
                    apiBook.totalNumberOfVerses;
            } else {
                apiTranslation.totalNumberOfChapters +=
                    apiBook.numberOfChapters;
                apiTranslation.totalNumberOfVerses +=
                    apiBook.totalNumberOfVerses;
            }
        }

        for (let i = 0; i < translationChapters.length; i++) {
            const currentChapter = translationChapters[i];
            if (i > 0) {
                const previousChapter = translationChapters[i - 1];
                currentChapter.previousChapterApiLink = bookChapterApiLink(
                    translation.id,
                    getBookLink(previousChapter.book),
                    previousChapter.chapter.number,
                    'json',
                    apiPathPrefix
                );
                currentChapter.previousChapterReference = {
                    translationId: translation.id,
                    book: previousChapter.book.id,
                    chapter: previousChapter.chapter.number,
                };
                currentChapter.previousChapterAudioLinks =
                    previousChapter.thisChapterAudioLinks;
                currentChapter.previousChapterAudioTimings =
                    previousChapter.thisChapterAudioTimings;

                if (previousChapter.thisChapterWordsLink) {
                    currentChapter.previousChapterWordsLink =
                        previousChapter.thisChapterWordsLink;
                }
            }

            if (i < translationChapters.length - 1) {
                const nextChapter = translationChapters[i + 1];
                currentChapter.nextChapterApiLink = bookChapterApiLink(
                    translation.id,
                    getBookLink(nextChapter.book),
                    nextChapter.chapter.number,
                    'json',
                    apiPathPrefix
                );
                currentChapter.nextChapterReference = {
                    translationId: translation.id,
                    book: nextChapter.book.id,
                    chapter: nextChapter.chapter.number,
                };
                currentChapter.nextChapterAudioLinks =
                    nextChapter.thisChapterAudioLinks;
                currentChapter.nextChapterAudioTimings =
                    nextChapter.thisChapterAudioTimings;

                if (nextChapter.thisChapterWordsLink) {
                    currentChapter.nextChapterWordsLink =
                        nextChapter.thisChapterWordsLink;
                }
            }
        }

        // The simplified chapters are shared between the per-chapter files and the
        // complete translation file, which are controlled by separate options.
        // Simplifying each chapter once means enabling both options doesn't do the
        // work twice or keep two copies of the result in memory.
        const simplifiedChapters = new Map<
            ApiTranslationBookChapter,
            SimplifiedChapter
        >();
        if (
            generateSimpleChapterFiles ||
            options.generateCompleteTranslationFiles
        ) {
            for (let chapter of translationChapters) {
                simplifiedChapters.set(
                    chapter,
                    simplifyChapter(
                        chapter.chapter,
                        rawWordsByChapter.get(chapter)
                    )
                );
            }
        }

        const simpleChapterLink = (chapter: ApiTranslationBookChapter) =>
            bookChapterApiLink(
                translation.id,
                getBookLink(chapter.book),
                chapter.chapter.number,
                SIMPLE_JSON_EXTENSION,
                apiPathPrefix
            );

        // The words for a simplified chapter are only published when the chapter
        // itself is, since their offsets are anchored to the simplified text.
        const simpleWordsLink = (chapter: ApiTranslationBookChapter) =>
            hasSimpleWords(chapter)
                ? bookChapterWordsApiLink(
                      translation.id,
                      getBookLink(chapter.book),
                      chapter.chapter.number,
                      apiPathPrefix,
                      SIMPLE_JSON_EXTENSION
                  )
                : undefined;

        function hasSimpleWords(chapter: ApiTranslationBookChapter) {
            const words = simplifiedChapters.get(chapter)?.words;
            return !!words && Object.keys(words).length > 0;
        }

        if (
            api.simpleTranslationBookChapters ||
            api.simpleTranslationBookChapterWords
        ) {
            for (let i = 0; i < translationChapters.length; i++) {
                const currentChapter = translationChapters[i];
                const previousChapter = translationChapters[i - 1];
                const nextChapter = translationChapters[i + 1];
                const simplified = simplifiedChapters.get(currentChapter)!;

                // Per-chapter simplified files aren't necessarily being
                // generated (e.g. when only the complete translation file
                // needs the simplified words), so `simpleChapter` may be
                // undefined below.
                let simpleChapter: ApiSimpleTranslationBookChapter | undefined;
                if (api.simpleTranslationBookChapters) {
                    const {
                        chapter,
                        simpleChapterApiLink,
                        thisChapterWordsLink,
                        nextChapterWordsLink,
                        previousChapterWordsLink,
                        ...rest
                    } = currentChapter;

                    simpleChapter = {
                        ...rest,
                        chapter: simplified.chapter,
                        thisChapterLink: simpleChapterLink(currentChapter),
                        fullChapterApiLink: rest.thisChapterLink,
                        previousChapterApiLink: previousChapter
                            ? simpleChapterLink(previousChapter)
                            : null,
                        nextChapterApiLink: nextChapter
                            ? simpleChapterLink(nextChapter)
                            : null,
                    };
                }

                const thisWordsLink = simpleWordsLink(currentChapter);
                if (thisWordsLink) {
                    if (simpleChapter) {
                        simpleChapter.thisChapterWordsLink = thisWordsLink;
                    }

                    // When per-chapter simplified files aren't generated,
                    // there's no simple chapter link to point to, so fall
                    // back to the regular chapter's links.
                    api.simpleTranslationBookChapterWords?.push({
                        translationId: translation.id,
                        bookId: currentChapter.book.id,
                        chapterNumber: currentChapter.chapter.number,
                        thisChapterLink:
                            simpleChapter?.thisChapterLink ??
                            currentChapter.thisChapterLink,
                        nextChapterLink:
                            simpleChapter?.nextChapterApiLink ??
                            currentChapter.nextChapterApiLink,
                        previousChapterLink:
                            simpleChapter?.previousChapterApiLink ??
                            currentChapter.previousChapterApiLink,
                        thisChapterWordsLink: thisWordsLink,
                        nextChapterWordsLink: nextChapter
                            ? (simpleWordsLink(nextChapter) ?? null)
                            : null,
                        previousChapterWordsLink: previousChapter
                            ? (simpleWordsLink(previousChapter) ?? null)
                            : null,
                        verses: simplified.words,
                    });
                }

                if (simpleChapter) {
                    const nextWordsLink = nextChapter
                        ? simpleWordsLink(nextChapter)
                        : undefined;
                    if (nextWordsLink) {
                        simpleChapter.nextChapterWordsLink = nextWordsLink;
                    }

                    const previousWordsLink = previousChapter
                        ? simpleWordsLink(previousChapter)
                        : undefined;
                    if (previousWordsLink) {
                        simpleChapter.previousChapterWordsLink =
                            previousWordsLink;
                    }

                    api.simpleTranslationBookChapters!.push(simpleChapter);
                }
            }
        }

        for (let { reader, verses, apiBookChapter } of pendingAudioTimings) {
            api.translationBookChapterAudioTimings.push({
                translationId: translation.id,
                bookId: apiBookChapter.book.id,
                chapterNumber: apiBookChapter.chapter.number,
                reader,
                audioLink:
                    apiBookChapter.thisChapterAudioLinks[reader] ?? '',
                thisChapterLink: apiBookChapter.thisChapterLink,
                nextChapterLink: apiBookChapter.nextChapterApiLink,
                previousChapterLink: apiBookChapter.previousChapterApiLink,
                thisChapterAudioTimingsLink:
                    apiBookChapter.thisChapterAudioTimings[reader],
                nextChapterAudioTimingsLink:
                    apiBookChapter.nextChapterAudioTimings?.[reader] ?? null,
                previousChapterAudioTimingsLink:
                    apiBookChapter.previousChapterAudioTimings?.[reader] ??
                    null,
                verses,
            });
        }

        for (let apiBookChapter of translationChapters) {
            const words = rawWordsByChapter.get(apiBookChapter);
            if (!words || !apiBookChapter.thisChapterWordsLink) {
                continue;
            }

            api.translationBookChapterWords.push({
                translationId: translation.id,
                bookId: apiBookChapter.book.id,
                chapterNumber: apiBookChapter.chapter.number,
                thisChapterLink: apiBookChapter.thisChapterLink,
                nextChapterLink: apiBookChapter.nextChapterApiLink,
                previousChapterLink: apiBookChapter.previousChapterApiLink,
                thisChapterWordsLink: apiBookChapter.thisChapterWordsLink,
                nextChapterWordsLink:
                    apiBookChapter.nextChapterWordsLink ?? null,
                previousChapterWordsLink:
                    apiBookChapter.previousChapterWordsLink ?? null,
                verses: words,
            });
        }

        api.availableTranslations.translations.push(apiTranslation);
        api.translationBooks.push(translationBooks);

        if (options.generateCompleteTranslationFiles) {
            // Build the complete translation data for download.
            // The regular and simplified files only differ by the content of each
            // chapter, so they share the book grouping and the per-chapter metadata.
            const completeBooks = translationBooks.books.map((book) => ({
                book,
                chapters: translationChapters.filter(
                    (ch) => ch.book.id === book.id
                ),
            }));

            const completeBook = <T>(
                book: ApiTranslationBook,
                chapters: T[]
            ) => ({
                id: book.id,
                name: book.name,
                commonName: book.commonName,
                title: book.title,
                order: book.order,
                numberOfChapters: book.numberOfChapters,
                totalNumberOfVerses: book.totalNumberOfVerses,
                isApocryphal: book.isApocryphal,
                chapters,
            });

            const completeChapter = (chapter: ApiTranslationBookChapter) => ({
                numberOfVerses: chapter.numberOfVerses,
                thisChapterAudioLinks: chapter.thisChapterAudioLinks,
                // The complete files contain the raw audio timings rather than links
                // to them, since the point is to have everything in one file.
                thisChapterAudioTimings:
                    rawAudioTimingsByChapter.get(chapter) ?? {},
            });

            const completeTranslation: ApiTranslationComplete = {
                translation: apiTranslation,
                books: completeBooks.map(({ book, chapters }) =>
                    completeBook(
                        book,
                        chapters.map((ch) => ({
                            ...completeChapter(ch),
                            // The complete files link to the word annotations
                            // rather than embedding them, same as the regular
                            // per-chapter endpoint.
                            ...(ch.thisChapterWordsLink
                                ? {
                                      thisChapterWordsLink:
                                          ch.thisChapterWordsLink,
                                  }
                                : {}),
                            chapter: ch.chapter,
                        }))
                    )
                ),
            };
            api.translationComplete.push(completeTranslation);

            const simpleCompleteTranslation: ApiSimpleTranslationComplete = {
                translation: apiTranslation,
                books: completeBooks.map(({ book, chapters }) =>
                    completeBook(
                        book,
                        chapters.map((ch) => {
                            const simplified = simplifiedChapters.get(ch)!;
                            const wordsLink = simpleWordsLink(ch);
                            return {
                                ...completeChapter(ch),
                                ...(wordsLink
                                    ? { thisChapterWordsLink: wordsLink }
                                    : {}),
                                chapter: simplified.chapter,
                            };
                        })
                    )
                ),
            };
            api.simpleTranslationComplete.push(simpleCompleteTranslation);
        }
    }

    for (let { books, profiles, ...commentary } of dataset.commentaries) {
        const apiCommentary: ApiCommentary = {
            ...commentary,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfCommentaryBooksApiLink(
                commentary.id,
                apiPathPrefix
            ),
            listOfProfilesApiLink: profilesCommentaryApiLink(
                commentary.id,
                'json',
                apiPathPrefix
            ),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            totalNumberOfProfiles: 0,
            languageName: getNativeName
                ? (getNativeName(commentary.language) ?? undefined)
                : undefined,
            languageEnglishName: getEnglishName
                ? (getEnglishName(commentary.language) ?? undefined)
                : undefined,
        };

        const commentaryBooks: ApiCommentaryBooks = {
            commentary: apiCommentary,
            books: [],
        };

        const commentaryProfiles: ApiCommentaryProfiles = {
            commentary: apiCommentary,
            profiles: [],
        };

        let commentaryChapters: ApiCommentaryBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const firstChapterNumber = chapters[0]?.chapter.number ?? null;
            const lastChapterNumber =
                chapters[chapters.length - 1]?.chapter.number ?? null;
            const apiBook: ApiCommentaryBook = {
                ...book,
                firstChapterNumber,
                firstChapterApiLink: firstChapterNumber
                    ? bookCommentaryChapterApiLink(
                          commentary.id,
                          getBookLink(book),
                          firstChapterNumber,
                          'json',
                          apiPathPrefix
                      )
                    : null,
                firstChapterReference: firstChapterNumber
                    ? {
                          commentaryId: commentary.id,
                          book: book.id,
                          chapter: firstChapterNumber,
                      }
                    : null,
                lastChapterNumber,
                lastChapterApiLink: lastChapterNumber
                    ? bookCommentaryChapterApiLink(
                          commentary.id,
                          getBookLink(book),
                          lastChapterNumber,
                          'json',
                          apiPathPrefix
                      )
                    : null,
                lastChapterReference: lastChapterNumber
                    ? {
                          commentaryId: commentary.id,
                          book: book.id,
                          chapter: lastChapterNumber,
                      }
                    : null,
                numberOfChapters: chapters.length,
                totalNumberOfVerses: 0,
            };

            for (let { chapter } of chapters) {
                const apiBookChapter: ApiCommentaryBookChapter = {
                    commentary: apiCommentary,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookCommentaryChapterApiLink(
                        commentary.id,
                        getBookLink(book),
                        chapter.number,
                        'json',
                        apiPathPrefix
                    ),
                    thisChapterReference: {
                        commentaryId: commentary.id,
                        book: book.id,
                        chapter: chapter.number,
                    },
                    nextChapterApiLink: null,
                    nextChapterReference: null,
                    previousChapterApiLink: null,
                    previousChapterReference: null,
                    numberOfVerses: 0,
                    simpleChapterApiLink: generateSimpleChapterFiles
                        ? bookCommentaryChapterApiLink(
                              commentary.id,
                              getBookLink(book),
                              chapter.number,
                              SIMPLE_JSON_EXTENSION,
                              apiPathPrefix
                          )
                        : undefined,
                };

                for (let c of chapter.content) {
                    if (c.type === 'verse') {
                        apiBookChapter.numberOfVerses++;
                    }
                }

                apiBook.totalNumberOfVerses += apiBookChapter.numberOfVerses;

                commentaryChapters.push(apiBookChapter);
                api.commentaryBookChapters.push(apiBookChapter);
            }

            commentaryBooks.books.push(apiBook);

            apiCommentary.totalNumberOfChapters += apiBook.numberOfChapters;
            apiCommentary.totalNumberOfVerses += apiBook.totalNumberOfVerses;
        }

        if (profiles) {
            for (let profile of profiles) {
                const apiProfile: ApiCommentaryProfile = {
                    id: profile.id,
                    reference: profile.reference,
                    subject: profile.subject,
                    thisProfileLink: profileCommentaryApiLink(
                        commentary.id,
                        profile.id,
                        'json',
                        apiPathPrefix
                    ),
                    referenceChapterLink: profile.reference
                        ? bookCommentaryChapterApiLink(
                              commentary.id,
                              profile.reference.book,
                              profile.reference.chapter,
                              'json',
                              apiPathPrefix
                          )
                        : null,
                };

                const apiProfileContent: ApiCommentaryProfileContent = {
                    commentary: apiCommentary,
                    profile: apiProfile,
                    content: profile.content,
                };

                apiCommentary.totalNumberOfProfiles += 1;
                commentaryProfiles.profiles.push(apiProfile);
                api.commentaryProfileContents.push(apiProfileContent);
            }
        }

        for (let i = 0; i < commentaryChapters.length; i++) {
            if (i > 0) {
                commentaryChapters[i].previousChapterApiLink =
                    bookCommentaryChapterApiLink(
                        commentary.id,
                        getBookLink(commentaryChapters[i - 1].book),
                        commentaryChapters[i - 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                commentaryChapters[i].previousChapterReference = {
                    commentaryId: commentary.id,
                    book: commentaryChapters[i - 1].book.id,
                    chapter: commentaryChapters[i - 1].chapter.number,
                };
                // commentaryChapters[i].previousChapterAudioLinks =
                //     commentaryChapters[i - 1].thisChapterAudioLinks;
            }

            if (i < commentaryChapters.length - 1) {
                commentaryChapters[i].nextChapterApiLink =
                    bookCommentaryChapterApiLink(
                        commentary.id,
                        getBookLink(commentaryChapters[i + 1].book),
                        commentaryChapters[i + 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                commentaryChapters[i].nextChapterReference = {
                    commentaryId: commentary.id,
                    book: commentaryChapters[i + 1].book.id,
                    chapter: commentaryChapters[i + 1].chapter.number,
                };
                // commentaryChapters[i].nextChapterAudioLinks =
                //     commentaryChapters[i + 1].thisChapterAudioLinks;
            }
        }

        if (api.simpleCommentaryBookChapters) {
            const simpleChapterLink = (chapter: ApiCommentaryBookChapter) =>
                bookCommentaryChapterApiLink(
                    commentary.id,
                    getBookLink(chapter.book),
                    chapter.chapter.number,
                    SIMPLE_JSON_EXTENSION,
                    apiPathPrefix
                );

            for (let i = 0; i < commentaryChapters.length; i++) {
                const { chapter, simpleChapterApiLink, ...currentChapter } =
                    commentaryChapters[i];
                const previousChapter = commentaryChapters[i - 1];
                const nextChapter = commentaryChapters[i + 1];

                api.simpleCommentaryBookChapters.push({
                    ...currentChapter,
                    chapter: simplifyCommentaryChapter(chapter),
                    thisChapterLink: simpleChapterLink(commentaryChapters[i]),
                    fullChapterApiLink: currentChapter.thisChapterLink,
                    previousChapterApiLink: previousChapter
                        ? simpleChapterLink(previousChapter)
                        : null,
                    nextChapterApiLink: nextChapter
                        ? simpleChapterLink(nextChapter)
                        : null,
                });
            }
        }

        api.availableCommentaries.commentaries.push(apiCommentary);
        api.commentaryBooks.push(commentaryBooks);
        api.commentaryProfiles.push(commentaryProfiles);
    }

    for (let {
        books,
        people,
        places,
        events,
        peopleGroups,
        ...datasetInfo
    } of dataset.datasets ?? []) {
        const apiDataset: ApiDataset = {
            ...datasetInfo,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfDatasetBooksApiLink(
                datasetInfo.id,
                apiPathPrefix
            ),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            totalNumberOfReferences: 0,
            languageName: getNativeName
                ? (getNativeName(datasetInfo.language) ?? undefined)
                : undefined,
            languageEnglishName: getEnglishName
                ? (getEnglishName(datasetInfo.language) ?? undefined)
                : undefined,
        };

        const datasetBooks: ApiDatasetBooks = {
            dataset: apiDataset,
            books: [],
        };

        let datasetChapters: ApiDatasetBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const firstChapterNumber = chapters[0]?.chapter.number ?? null;
            const lastChapterNumber =
                chapters[chapters.length - 1]?.chapter.number ?? null;
            const apiBook: ApiDatasetBook = {
                ...book,
                firstChapterNumber,
                firstChapterApiLink: bookDatasetChapterApiLink(
                    datasetInfo.id,
                    book.id,
                    firstChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                firstChapterReference: {
                    datasetId: datasetInfo.id,
                    book: book.id,
                    chapter: firstChapterNumber,
                },
                lastChapterNumber,
                lastChapterApiLink: bookDatasetChapterApiLink(
                    datasetInfo.id,
                    book.id,
                    lastChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                lastChapterReference: {
                    datasetId: datasetInfo.id,
                    book: book.id,
                    chapter: lastChapterNumber,
                },
                numberOfChapters: chapters.length,
                totalNumberOfVerses: 0,
                totalNumberOfReferences: 0,
            };

            for (let { chapter } of chapters) {
                const apiBookChapter: ApiDatasetBookChapter = {
                    dataset: apiDataset,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookDatasetChapterApiLink(
                        datasetInfo.id,
                        book.id,
                        chapter.number,
                        'json',
                        apiPathPrefix
                    ),
                    thisChapterReference: {
                        datasetId: datasetInfo.id,
                        book: book.id,
                        chapter: chapter.number,
                    },
                    nextChapterApiLink: null,
                    nextChapterReference: null,
                    previousChapterApiLink: null,
                    previousChapterReference: null,
                    numberOfVerses: chapter.content.length,
                    numberOfReferences: 0,
                };

                // apiBookChapter.numberOfVerses += ;
                for (let verse of chapter.content) {
                    apiBookChapter.numberOfReferences +=
                        verse.references.length;
                }

                apiBook.totalNumberOfVerses += apiBookChapter.numberOfVerses;
                apiBook.totalNumberOfReferences +=
                    apiBookChapter.numberOfReferences;

                datasetChapters.push(apiBookChapter);
                if (!api.datasetBookChapters) {
                    api.datasetBookChapters = [];
                }
                api.datasetBookChapters.push(apiBookChapter);
            }

            datasetBooks.books.push(apiBook);

            apiDataset.totalNumberOfChapters += apiBook.numberOfChapters;
            apiDataset.totalNumberOfVerses += apiBook.totalNumberOfVerses;
            apiDataset.totalNumberOfReferences +=
                apiBook.totalNumberOfReferences;
        }

        for (let i = 0; i < datasetChapters.length; i++) {
            if (i > 0) {
                datasetChapters[i].previousChapterApiLink =
                    bookDatasetChapterApiLink(
                        datasetInfo.id,
                        datasetChapters[i - 1].book.id,
                        datasetChapters[i - 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                datasetChapters[i].previousChapterReference = {
                    datasetId: datasetInfo.id,
                    book: datasetChapters[i - 1].book.id,
                    chapter: datasetChapters[i - 1].chapter.number,
                };
            }

            if (i < datasetChapters.length - 1) {
                datasetChapters[i].nextChapterApiLink =
                    bookDatasetChapterApiLink(
                        datasetInfo.id,
                        datasetChapters[i + 1].book.id,
                        datasetChapters[i + 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                datasetChapters[i].nextChapterReference = {
                    datasetId: datasetInfo.id,
                    book: datasetChapters[i + 1].book.id,
                    chapter: datasetChapters[i + 1].chapter.number,
                };
            }
        }

        const linkEntityRef = (
            collection: DatasetEntityCollection,
            ref: DatasetEntityRef | undefined
        ): DatasetEntityRef | undefined =>
            ref
                ? {
                      ...ref,
                      type: collection,
                      apiLink: datasetEntityApiLink(
                          datasetInfo.id,
                          collection,
                          ref.id,
                          'json',
                          apiPathPrefix
                      ),
                  }
                : undefined;

        const linkEntityRefs = (
            collection: DatasetEntityCollection,
            refs: DatasetEntityRef[] | undefined
        ): DatasetEntityRef[] | undefined =>
            refs?.map((ref) => linkEntityRef(collection, ref)!);

        if (people) {
            const datasetPeople: ApiDatasetPeople = {
                dataset: apiDataset,
                people: [],
            };

            for (let person of people) {
                const thisPersonApiLink = datasetEntityApiLink(
                    datasetInfo.id,
                    'people',
                    person.id,
                    'json',
                    apiPathPrefix
                );

                datasetPeople.people.push({
                    id: person.id,
                    name: person.name,
                    isProperName: person.isProperName,
                    gender: person.gender,
                    numberOfReferences: person.references.length,
                    thisPersonApiLink,
                });

                const apiPerson: ApiDatasetPerson = {
                    dataset: apiDataset,
                    person: {
                        ...person,
                        birthPlace: linkEntityRef('places', person.birthPlace),
                        deathPlace: linkEntityRef('places', person.deathPlace),
                        father: linkEntityRefs('people', person.father),
                        mother: linkEntityRefs('people', person.mother),
                        partners: linkEntityRefs('people', person.partners),
                        children: linkEntityRefs('people', person.children),
                        siblings: linkEntityRefs('people', person.siblings),
                        halfSiblingsSameMother: linkEntityRefs(
                            'people',
                            person.halfSiblingsSameMother
                        ),
                        halfSiblingsSameFather: linkEntityRefs(
                            'people',
                            person.halfSiblingsSameFather
                        ),
                        memberOf: linkEntityRefs('groups', person.memberOf),
                        events: linkEntityRefs('events', person.events),
                    },
                    thisPersonApiLink,
                };

                if (!api.datasetPeopleContents) {
                    api.datasetPeopleContents = [];
                }
                api.datasetPeopleContents.push(apiPerson);
            }

            apiDataset.listOfPeopleApiLink = listOfDatasetEntitiesApiLink(
                datasetInfo.id,
                'people',
                'json',
                apiPathPrefix
            );
            apiDataset.totalNumberOfPeople = people.length;
            if (!api.datasetPeople) {
                api.datasetPeople = [];
            }
            api.datasetPeople.push(datasetPeople);
        }

        if (places) {
            const datasetPlaces: ApiDatasetPlaces = {
                dataset: apiDataset,
                places: [],
            };

            for (let place of places) {
                const thisPlaceApiLink = datasetEntityApiLink(
                    datasetInfo.id,
                    'places',
                    place.id,
                    'json',
                    apiPathPrefix
                );

                datasetPlaces.places.push({
                    id: place.id,
                    name: place.name,
                    featureType: place.featureType,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    numberOfReferences: place.references.length,
                    thisPlaceApiLink,
                });

                const apiPlace: ApiDatasetPlace = {
                    dataset: apiDataset,
                    place: {
                        ...place,
                        rootPlace: linkEntityRef('places', place.rootPlace),
                        duplicateOf: linkEntityRef('places', place.duplicateOf),
                        people: linkEntityRefs('people', place.people),
                        peopleBorn: linkEntityRefs('people', place.peopleBorn),
                        peopleDied: linkEntityRefs('people', place.peopleDied),
                        events: linkEntityRefs('events', place.events),
                    },
                    thisPlaceApiLink,
                };

                if (!api.datasetPlaceContents) {
                    api.datasetPlaceContents = [];
                }
                api.datasetPlaceContents.push(apiPlace);
            }

            apiDataset.listOfPlacesApiLink = listOfDatasetEntitiesApiLink(
                datasetInfo.id,
                'places',
                'json',
                apiPathPrefix
            );
            apiDataset.totalNumberOfPlaces = places.length;
            if (!api.datasetPlaces) {
                api.datasetPlaces = [];
            }
            api.datasetPlaces.push(datasetPlaces);
        }

        if (events) {
            const datasetEvents: ApiDatasetEvents = {
                dataset: apiDataset,
                events: [],
            };

            for (let event of events) {
                const thisEventApiLink = datasetEntityApiLink(
                    datasetInfo.id,
                    'events',
                    event.id,
                    'json',
                    apiPathPrefix
                );

                datasetEvents.events.push({
                    id: event.id,
                    name: event.name,
                    startDate: event.startDate,
                    numberOfReferences: event.references.length,
                    thisEventApiLink,
                });

                const apiEvent: ApiDatasetEvent = {
                    dataset: apiDataset,
                    event: {
                        ...event,
                        participants: linkEntityRefs(
                            'people',
                            event.participants
                        ),
                        locations: linkEntityRefs('places', event.locations),
                        groups: linkEntityRefs('groups', event.groups),
                        partOf: linkEntityRef('events', event.partOf),
                        predecessor: linkEntityRef('events', event.predecessor),
                    },
                    thisEventApiLink,
                };

                if (!api.datasetEventContents) {
                    api.datasetEventContents = [];
                }
                api.datasetEventContents.push(apiEvent);
            }

            apiDataset.listOfEventsApiLink = listOfDatasetEntitiesApiLink(
                datasetInfo.id,
                'events',
                'json',
                apiPathPrefix
            );
            apiDataset.totalNumberOfEvents = events.length;
            if (!api.datasetEvents) {
                api.datasetEvents = [];
            }
            api.datasetEvents.push(datasetEvents);
        }

        if (peopleGroups) {
            const datasetPeopleGroups: ApiDatasetPeopleGroups = {
                dataset: apiDataset,
                groups: [],
            };

            for (let group of peopleGroups) {
                const thisPeopleGroupApiLink = datasetEntityApiLink(
                    datasetInfo.id,
                    'groups',
                    group.id,
                    'json',
                    apiPathPrefix
                );

                datasetPeopleGroups.groups.push({
                    id: group.id,
                    name: group.name,
                    numberOfMembers: group.members?.length ?? 0,
                    thisPeopleGroupApiLink,
                });

                const apiGroup: ApiDatasetPeopleGroup = {
                    dataset: apiDataset,
                    group: {
                        ...group,
                        members: linkEntityRefs('people', group.members),
                        events: linkEntityRefs('events', group.events),
                    },
                    thisPeopleGroupApiLink,
                };

                if (!api.datasetPeopleGroupContents) {
                    api.datasetPeopleGroupContents = [];
                }
                api.datasetPeopleGroupContents.push(apiGroup);
            }

            apiDataset.listOfPeopleGroupsApiLink = listOfDatasetEntitiesApiLink(
                datasetInfo.id,
                'groups',
                'json',
                apiPathPrefix
            );
            apiDataset.totalNumberOfPeopleGroups = peopleGroups.length;
            if (!api.datasetPeopleGroups) {
                api.datasetPeopleGroups = [];
            }
            api.datasetPeopleGroups.push(datasetPeopleGroups);
        }

        // Generate chapter-aligned entity data for datasets that contain
        // entities but no chapter books of their own. Each chapter file
        // contains the people, places, and events that appear in that
        // chapter, derived from the entities' Bible references.
        if (books.length <= 0 && (people || places || events)) {
            interface ChapterEntities {
                people: Map<string, ApiDatasetChapterPerson>;
                places: Map<string, ApiDatasetChapterPlace>;
                events: Map<string, ApiDatasetChapterEvent>;
            }

            // bookId -> chapterNumber -> entities
            const chapterMap = new Map<BookId, Map<number, ChapterEntities>>();

            function addEntityVerses<
                T extends { verses: number[] },
                K extends 'people' | 'places' | 'events',
            >(
                collection: K,
                references: VerseRef[],
                createEntry: () => Omit<T, 'verses'>
            ) {
                for (let reference of references) {
                    let bookChapters = chapterMap.get(reference.book);
                    if (!bookChapters) {
                        bookChapters = new Map();
                        chapterMap.set(reference.book, bookChapters);
                    }
                    let chapterEntities = bookChapters.get(reference.chapter);
                    if (!chapterEntities) {
                        chapterEntities = {
                            people: new Map(),
                            places: new Map(),
                            events: new Map(),
                        };
                        bookChapters.set(reference.chapter, chapterEntities);
                    }

                    const entry = createEntry() as T;
                    const entities = chapterEntities[
                        collection
                    ] as unknown as Map<string, T>;
                    let existing = entities.get((entry as any).id);
                    if (!existing) {
                        existing = { ...entry, verses: [] } as T;
                        entities.set((entry as any).id, existing);
                    }
                    const endVerse = reference.endVerse ?? reference.verse;
                    for (
                        let verse = reference.verse;
                        verse <= endVerse;
                        verse++
                    ) {
                        existing.verses.push(verse);
                    }
                }
            }

            for (let person of people ?? []) {
                addEntityVerses<ApiDatasetChapterPerson, 'people'>(
                    'people',
                    person.references,
                    () => ({
                        id: person.id,
                        name: person.name,
                        isProperName: person.isProperName,
                        gender: person.gender,
                        birthYear: person.birthYear,
                        deathYear: person.deathYear,
                        apiLink: datasetEntityApiLink(
                            datasetInfo.id,
                            'people',
                            person.id,
                            'json',
                            apiPathPrefix
                        ),
                    })
                );
            }

            for (let place of places ?? []) {
                addEntityVerses<ApiDatasetChapterPlace, 'places'>(
                    'places',
                    place.references,
                    () => ({
                        id: place.id,
                        name: place.name,
                        featureType: place.featureType,
                        latitude: place.latitude,
                        longitude: place.longitude,
                        apiLink: datasetEntityApiLink(
                            datasetInfo.id,
                            'places',
                            place.id,
                            'json',
                            apiPathPrefix
                        ),
                    })
                );
            }

            for (let event of events ?? []) {
                addEntityVerses<ApiDatasetChapterEvent, 'events'>(
                    'events',
                    event.references,
                    () => ({
                        id: event.id,
                        name: event.name,
                        startDate: event.startDate,
                        apiLink: datasetEntityApiLink(
                            datasetInfo.id,
                            'events',
                            event.id,
                            'json',
                            apiPathPrefix
                        ),
                    })
                );
            }

            const sortedBooks = [...chapterMap.keys()].sort(
                (a, b) =>
                    (bookOrderMap.get(a) ?? 9999) -
                    (bookOrderMap.get(b) ?? 9999)
            );

            function sortEntities<T extends { id: string; verses: number[] }>(
                entities: Map<string, T>
            ): T[] {
                const list = [...entities.values()];
                for (let entity of list) {
                    entity.verses.sort((a, b) => a - b);
                }
                return list.sort(
                    (a, b) =>
                        a.verses[0] - b.verses[0] || a.id.localeCompare(b.id)
                );
            }

            const entityChapters: ApiDatasetEntityBookChapter[] = [];

            for (let bookId of sortedBooks) {
                const bookChapters = chapterMap.get(bookId)!;
                const chapterNumbers = [...bookChapters.keys()].sort(
                    (a, b) => a - b
                );
                const firstChapterNumber = chapterNumbers[0];
                const lastChapterNumber =
                    chapterNumbers[chapterNumbers.length - 1];

                const apiBook: ApiDatasetBook = {
                    id: bookId,
                    order: bookOrderMap.get(bookId) ?? 9999,
                    firstChapterNumber,
                    firstChapterApiLink: bookDatasetChapterApiLink(
                        datasetInfo.id,
                        bookId,
                        firstChapterNumber,
                        'json',
                        apiPathPrefix
                    ),
                    firstChapterReference: {
                        datasetId: datasetInfo.id,
                        book: bookId,
                        chapter: firstChapterNumber,
                    },
                    lastChapterNumber,
                    lastChapterApiLink: bookDatasetChapterApiLink(
                        datasetInfo.id,
                        bookId,
                        lastChapterNumber,
                        'json',
                        apiPathPrefix
                    ),
                    lastChapterReference: {
                        datasetId: datasetInfo.id,
                        book: bookId,
                        chapter: lastChapterNumber,
                    },
                    numberOfChapters: chapterNumbers.length,
                    totalNumberOfVerses: 0,
                    totalNumberOfReferences: 0,
                };

                for (let chapterNumber of chapterNumbers) {
                    const chapterEntities = bookChapters.get(chapterNumber)!;
                    const chapterPeople = sortEntities(chapterEntities.people);
                    const chapterPlaces = sortEntities(chapterEntities.places);
                    const chapterEvents = sortEntities(chapterEntities.events);

                    const distinctVerses = new Set<number>();
                    let numberOfReferences = 0;
                    for (let list of [
                        chapterPeople,
                        chapterPlaces,
                        chapterEvents,
                    ]) {
                        for (let entity of list as {
                            verses: number[];
                        }[]) {
                            numberOfReferences += entity.verses.length;
                            for (let verse of entity.verses) {
                                distinctVerses.add(verse);
                            }
                        }
                    }

                    apiBook.totalNumberOfVerses += distinctVerses.size;
                    apiBook.totalNumberOfReferences += numberOfReferences;

                    const apiChapter: ApiDatasetEntityBookChapter = {
                        dataset: apiDataset,
                        book: apiBook,
                        chapter: {
                            number: chapterNumber,
                            people: chapterPeople,
                            places: chapterPlaces,
                            events: chapterEvents,
                        },
                        thisChapterLink: bookDatasetChapterApiLink(
                            datasetInfo.id,
                            bookId,
                            chapterNumber,
                            'json',
                            apiPathPrefix
                        ),
                        thisChapterReference: {
                            datasetId: datasetInfo.id,
                            book: bookId,
                            chapter: chapterNumber,
                        },
                        nextChapterApiLink: null,
                        nextChapterReference: null,
                        previousChapterApiLink: null,
                        previousChapterReference: null,
                        numberOfPeople: chapterPeople.length,
                        numberOfPlaces: chapterPlaces.length,
                        numberOfEvents: chapterEvents.length,
                    };

                    entityChapters.push(apiChapter);
                }

                datasetBooks.books.push(apiBook);

                apiDataset.totalNumberOfChapters += apiBook.numberOfChapters;
                apiDataset.totalNumberOfVerses += apiBook.totalNumberOfVerses;
                apiDataset.totalNumberOfReferences +=
                    apiBook.totalNumberOfReferences;
            }

            apiDataset.numberOfBooks = datasetBooks.books.length;

            for (let i = 0; i < entityChapters.length; i++) {
                if (i > 0) {
                    entityChapters[i].previousChapterApiLink =
                        entityChapters[i - 1].thisChapterLink;
                    entityChapters[i].previousChapterReference =
                        entityChapters[i - 1].thisChapterReference;
                }
                if (i < entityChapters.length - 1) {
                    entityChapters[i].nextChapterApiLink =
                        entityChapters[i + 1].thisChapterLink;
                    entityChapters[i].nextChapterReference =
                        entityChapters[i + 1].thisChapterReference;
                }
            }

            if (entityChapters.length > 0) {
                if (!api.datasetEntityBookChapters) {
                    api.datasetEntityBookChapters = [];
                }
                api.datasetEntityBookChapters.push(...entityChapters);
            }
        }

        if (!api.availableDatasets) {
            api.availableDatasets = {
                datasets: [],
            };
        }
        api.availableDatasets.datasets.push(apiDataset);
        if (!api.datasetBooks) {
            api.datasetBooks = [];
        }
        api.datasetBooks.push(datasetBooks);
    }

    return api;

    function getBookLink(book: TranslationBook | CommentaryBook): string {
        return useCommonName ? book.commonName : book.id;
    }
}

/**
 * Generates the output files for the given API.
 * @param api The API that the files should be generated for.
 */
export function generateFilesForApi(api: ApiOutput): OutputFile[] {
    let files: OutputFile[] = [];

    files.push(
        jsonFile(
            `${api.pathPrefix}/api/available_translations.json`,
            api.availableTranslations,
            true
        )
    );
    for (let translationBooks of api.translationBooks) {
        files.push(
            jsonFile(
                translationBooks.translation.listOfBooksApiLink,
                translationBooks
            )
        );
    }

    for (let bookChapter of api.translationBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    for (let bookChapter of api.simpleTranslationBookChapters ?? []) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    for (let audio of api.translationBookChapterAudio) {
        files.push(downloadedFile(audio.link, audio.originalUrl));
    }

    for (let timings of api.translationBookChapterAudioTimings) {
        files.push(jsonFile(timings.thisChapterAudioTimingsLink, timings));
    }

    for (let words of api.translationBookChapterWords) {
        files.push(jsonFile(words.thisChapterWordsLink, words));
    }

    for (let words of api.simpleTranslationBookChapterWords ?? []) {
        files.push(jsonFile(words.thisChapterWordsLink, words));
    }

    // Generate complete translation download files
    for (let complete of api.translationComplete) {
        if (complete.translation.completeTranslationApiLink) {
            files.push(
                jsonFile(
                    complete.translation.completeTranslationApiLink,
                    complete
                )
            );
        }
    }

    for (let complete of api.simpleTranslationComplete) {
        if (complete.translation.simpleCompleteTranslationApiLink) {
            files.push(
                jsonFile(
                    complete.translation.simpleCompleteTranslationApiLink,
                    complete
                )
            );
        }
    }

    files.push(
        jsonFile(
            `${api.pathPrefix}/api/available_commentaries.json`,
            api.availableCommentaries,
            true
        )
    );
    for (let commentaryBooks of api.commentaryBooks) {
        files.push(
            jsonFile(
                commentaryBooks.commentary.listOfBooksApiLink,
                commentaryBooks
            )
        );
    }

    for (let commentaryProfiles of api.commentaryProfiles) {
        files.push(
            jsonFile(
                commentaryProfiles.commentary.listOfProfilesApiLink,
                commentaryProfiles
            )
        );
    }

    for (let profileContent of api.commentaryProfileContents) {
        files.push(
            jsonFile(profileContent.profile.thisProfileLink, profileContent)
        );
    }

    for (let bookChapter of api.commentaryBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    for (let bookChapter of api.simpleCommentaryBookChapters ?? []) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    if (api.availableDatasets) {
        files.push(
            jsonFile(
                `${api.pathPrefix}/api/available_datasets.json`,
                api.availableDatasets,
                true
            )
        );
    }

    if (api.datasetBooks) {
        for (let datasetBook of api.datasetBooks) {
            files.push(
                jsonFile(datasetBook.dataset.listOfBooksApiLink, datasetBook)
            );
        }
    }

    if (api.datasetBookChapters) {
        for (let datasetBookChapter of api.datasetBookChapters) {
            files.push(
                jsonFile(datasetBookChapter.thisChapterLink, datasetBookChapter)
            );
        }
    }

    for (let entityChapter of api.datasetEntityBookChapters ?? []) {
        files.push(jsonFile(entityChapter.thisChapterLink, entityChapter));
    }

    for (let datasetPeople of api.datasetPeople ?? []) {
        files.push(
            jsonFile(datasetPeople.dataset.listOfPeopleApiLink!, datasetPeople)
        );
    }

    for (let person of api.datasetPeopleContents ?? []) {
        files.push(jsonFile(person.thisPersonApiLink, person));
    }

    for (let datasetPlaces of api.datasetPlaces ?? []) {
        files.push(
            jsonFile(datasetPlaces.dataset.listOfPlacesApiLink!, datasetPlaces)
        );
    }

    for (let place of api.datasetPlaceContents ?? []) {
        files.push(jsonFile(place.thisPlaceApiLink, place));
    }

    for (let datasetEvents of api.datasetEvents ?? []) {
        files.push(
            jsonFile(datasetEvents.dataset.listOfEventsApiLink!, datasetEvents)
        );
    }

    for (let event of api.datasetEventContents ?? []) {
        files.push(jsonFile(event.thisEventApiLink, event));
    }

    for (let datasetPeopleGroups of api.datasetPeopleGroups ?? []) {
        files.push(
            jsonFile(
                datasetPeopleGroups.dataset.listOfPeopleGroupsApiLink!,
                datasetPeopleGroups
            )
        );
    }

    for (let group of api.datasetPeopleGroupContents ?? []) {
        files.push(jsonFile(group.thisPeopleGroupApiLink, group));
    }

    // for (let audio of api.translationBookChapterAudio) {
    //     files.push(downloadedFile(audio.link, audio.originalUrl));
    // }

    return files;
}

/**
 * Generates the output files for the given datasets.
 * @param datasets The datasets to generate the output files for.
 * @param options The options for generating the API files.
 */
export async function* generateOutputFilesFromDatasets(
    datasets: AsyncIterable<DatasetOutput>,
    options?: GenerateApiOptions
): AsyncGenerator<OutputFile[]> {
    for await (let dataset of datasets) {
        const api = generateApiForDataset(dataset, options);
        const files = generateFilesForApi(api);

        yield files;
    }
}

/**
 * Gets the API Link for the list of books endpoint for a translation.
 * @param translationId The ID of the translation.
 * @returns
 */
export function listOfBooksApiLink(
    translationId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/${translationId}/books.json`;
}

/**
 * Gets the API Link for the complete translation download endpoint.
 * @param translationId The ID of the translation.
 * @param prefix The path prefix.
 * @param extension The extension of the file. Use SIMPLE_JSON_EXTENSION for the simplified format.
 * @returns
 */
export function completeTranslationApiLink(
    translationId: string,
    prefix: string = '',
    extension: string = 'json'
): string {
    return `${prefix}/api/${translationId}/complete.${extension}`;
}

/**
 * Gets the API Link for the list of books endpoint for a commentary.
 * @param commentaryId The ID of the commentary.
 * @returns
 */
export function listOfCommentaryBooksApiLink(
    commentaryId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/c/${commentaryId}/books.json`;
}

/**
 * Gets the API Link for the list of books endpoint for a dataset.
 * @param datasetId The ID of the dataset.
 * @returns
 */
export function listOfDatasetBooksApiLink(
    datasetId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/d/${datasetId}/books.json`;
}

/**
 * The collections of entities that a dataset can contain.
 */
export type DatasetEntityCollection = DatasetEntityType;

/**
 * Gets the API Link for the list of entities in a collection for a dataset.
 * @param datasetId The ID of the dataset.
 * @param collection The collection of entities.
 * @param extension The extension of the file.
 * @param prefix The prefix for the API links.
 */
export function listOfDatasetEntitiesApiLink(
    datasetId: string,
    collection: DatasetEntityCollection,
    extension: string = 'json',
    prefix: string = ''
): string {
    return `${prefix}/api/d/${datasetId}/${collection}.${extension}`;
}

/**
 * Gets the API Link for an entity in a collection for a dataset.
 * @param datasetId The ID of the dataset.
 * @param collection The collection of entities.
 * @param entityId The ID of the entity.
 * @param extension The extension of the file.
 * @param prefix The prefix for the API links.
 */
export function datasetEntityApiLink(
    datasetId: string,
    collection: DatasetEntityCollection,
    entityId: string,
    extension: string = 'json',
    prefix: string = ''
): string {
    return `${prefix}/api/d/${datasetId}/${collection}/${replaceSpacesWithUnderscores(
        entityId
    )}.${extension}`;
}

/**
 * The file extension that is used for chapters that are in the simplified format.
 */
export const SIMPLE_JSON_EXTENSION = 'simple.json';

/**
 * Getes the API link for a book chapter.
 * @param translationId The ID of the translation.
 * @param commonName The name of the book.
 * @param chapterNumber The number of the book.
 * @param extension The extension of the file.
 */
export function bookChapterApiLink(
    translationId: string,
    commonName: string,
    chapterNumber: number,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/${translationId}/${replaceSpacesWithUnderscores(
        commonName
    )}/${chapterNumber}.${extension}`;
}

/**
 * Getes the API link for a book chapter.
 * @param translationId The ID of the translation.
 * @param commonName The name of the book.
 * @param chapterNumber The number of the book.
 * @param extension The extension of the file.
 */
export function bookCommentaryChapterApiLink(
    translationId: string,
    commonName: string,
    chapterNumber: number,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/c/${translationId}/${replaceSpacesWithUnderscores(
        commonName
    )}/${chapterNumber}.${extension}`;
}

export function bookChapterAudioApiLink(
    translationId: string,
    bookId: string,
    chapterNumber: number,
    reader: string,
    prefix: string = ''
) {
    return `${prefix}/api/${translationId}/${replaceSpacesWithUnderscores(
        bookId
    )}/${chapterNumber}.${reader}.mp3`;
}

export function bookChapterAudioTimingsApiLink(
    translationId: string,
    bookId: string,
    chapterNumber: number,
    reader: string,
    prefix: string = ''
) {
    return `${prefix}/api/${translationId}/${replaceSpacesWithUnderscores(
        bookId
    )}/${chapterNumber}.${reader}.audioTimings.json`;
}

/**
 * Gets the API link for the word-level annotations of a book chapter.
 * @param translationId The ID of the translation.
 * @param bookId The ID of the book.
 * @param chapterNumber The number of the chapter.
 * @param prefix The prefix that should be added to the link.
 * @param extension The extension of the file. Use SIMPLE_JSON_EXTENSION for the simplified format.
 */
export function bookChapterWordsApiLink(
    translationId: string,
    bookId: string,
    chapterNumber: number,
    prefix: string = '',
    extension: string = 'json'
) {
    return `${prefix}/api/${translationId}/${replaceSpacesWithUnderscores(
        bookId
    )}/${chapterNumber}.words.${extension}`;
}

/**
 * Getes the API link for a book chapter.
 * @param translationId The ID of the translation.
 * @param commonName The name of the book.
 * @param chapterNumber The number of the book.
 * @param extension The extension of the file.
 */
export function bookDatasetChapterApiLink(
    translationId: string,
    commonName: string,
    chapterNumber: number,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/d/${translationId}/${replaceSpacesWithUnderscores(
        commonName
    )}/${chapterNumber}.${extension}`;
}

/**
 * Gets the API link for a profile.
 * @param translationId The ID of the translation.
 * @param profileId The ID of the profile.
 * @param extension The extension of the file.
 */
export function profilesCommentaryApiLink(
    translationId: string,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/c/${translationId}/profiles.${extension}`;
}

/**
 * Gets the API link for a profile.
 * @param translationId The ID of the translation.
 * @param profileId The ID of the profile.
 * @param extension The extension of the file.
 */
export function profileCommentaryApiLink(
    translationId: string,
    profileId: string,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/c/${translationId}/profiles/${replaceSpacesWithUnderscores(
        profileId
    )}.${extension}`;
}

export function jsonFile(
    path: string,
    content: any,
    mergable?: boolean
): OutputFile {
    return {
        path,
        content,
        mergable,
    };
}

export function downloadedFile(path: string, url: string): OutputFile {
    return {
        path,
        content: () => fetch(url).then((response) => response.body),
    };
}

export function replaceSpacesWithUnderscores(str: string): string {
    return str.replace(/[<>:"/\\|?*\s]/g, '_');
}
