import { z } from 'zod';
import { BookIdSchema, VerseRef, VerseRefSchema } from '../utils.js';

/**
 * Defines an interface that contains information about a input file.
 */
export type InputFile = InputTranslationFile | InputCommentaryFile;

export interface InputFileBase {
    name?: string;
    content: string;
    sha256?: string;
}

export type InputFileMetadata =
    | InputTranslationMetadata
    | InputCommentaryMetadata;

export interface InputTranslationFile extends InputFileBase {
    fileType: 'usfm' | 'usx' | 'json' | 'lockman';
    metadata: InputTranslationMetadata;
}

export interface InputCommentaryFile extends InputFileBase {
    fileType: 'commentary/csv' | 'commentary/tyndale-xml';
    metadata: InputCommentaryMetadata;
}

export type OutputFileContent = object | ReadableStream;

/**
 * Defines an interface that contains information about a output file.
 */
export interface OutputFile {
    /**
     * The path that the file should be stored at.
     */
    path: string;

    /**
     * The content of the file.
     */
    content: OutputFileContent | (() => Promise<OutputFileContent>);

    /**
     * Whether the file can be merged with files of the same name but from other datasets.
     */
    mergable?: boolean;
}

export interface MetadataBase {
    /**
     * The name of the translation.
     */
    name: string;

    /**
     * The english name of the translation.
     */
    englishName: string;

    /**
     * The website for the translation.
     */
    website: string;

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: string;

    /**
     * The notice that should be displayed when displaying content from the translation.
     */
    licenseNotice?: string | null;

    /**
     * The ISO 639 letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the text is written in.
     */
    direction: 'ltr' | 'rtl';
}

/**
 * The metadata for a translation that is input into the generator.
 */
export interface InputTranslationMetadata extends MetadataBase {
    /**
     * The ID of the translation.
     */
    id: string;

    /**
     * The short name for the translation.
     */
    shortName: string;
}

/**
 * The metadata for a translation that is input into the generator.
 */
export interface InputCommentaryMetadata extends MetadataBase {
    /**
     * The ID of the commentary.
     */
    id: string;
}

/**
 * Defines a Zod schema for information about a translation.
 */
export const TranslationSchema = z.object({
    /**
     * The ID of the translation.
     */
    id: z.string().meta({
        description: 'The ID of the translation.',
    }),

    /**
     * The name of the translation.
     */
    name: z.string().meta({
        description: 'The name of the translation.',
    }),

    /**
     * The website for the translation.
     */
    website: z.string().meta({
        description: 'The website for the translation.',
    }),

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: z.string().meta({
        description:
            'The URL that the license for the translation can be found.',
    }),

    /**
     * The API-added notes for the license.
     */
    licenseNotes: z.string().nullable().optional().meta({
        description: 'The API-added notes for the license.',
    }),

    /**
     * The notice that should be displayed when displaying content from the translation.
     */
    licenseNotice: z.string().nullable().optional().meta({
        description:
            'The notice that should be displayed when displaying content from the translation.',
    }),

    /**
     * The short name for the translation.
     */
    shortName: z.string().optional().meta({
        description: 'The short name for the translation.',
    }),

    /**
     * The English name for the translation.
     */
    englishName: z.string().meta({
        description: 'The English name for the translation.',
    }),

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    language: z.string().meta({
        description:
            'The ISO 639 3-letter language tag that the translation is primarily in.',
    }),

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: z.enum(['ltr', 'rtl']).meta({
        description:
            'The direction that the language is written in. `ltr` indicates that the text is written from the left side of the page to the right. `rtl` indicates that the text is written from the right side of the page to the left.',
    }),
});

export type Translation = z.infer<typeof TranslationSchema>;

/**
 * Defines a Zod schema for information about a commentary.
 */
export const CommentarySchema = z.object({
    /**
     * The ID of the commentary.
     */
    id: z.string().meta({
        description: 'The ID of the commentary.',
    }),

    /**
     * The name of the commentary.
     */
    name: z.string().meta({
        description: 'The name of the commentary.',
    }),

    /**
     * The website for the commentary.
     */
    website: z.string().meta({
        description: 'The website for the commentary.',
    }),

    /**
     * The URL that the license for the commentary can be found.
     */
    licenseUrl: z.string().meta({
        description:
            'The URL that the license for the commentary can be found.',
    }),

    /**
     * The API-added notes for the license.
     */
    licenseNotes: z.string().nullable().optional().meta({
        description: 'The API-added notes for the license.',
    }),

    /**
     * The english name for the commentary.
     */
    englishName: z.string().meta({
        description: 'The English name for the commentary.',
    }),

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    language: z.string().meta({
        description:
            'The ISO 639 3-letter language tag that the translation is primarily in.',
    }),

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: z.enum(['ltr', 'rtl']).meta({
        description:
            'The direction that the language is written in. `ltr` indicates that the text is written from the left side of the page to the right. `rtl` indicates that the text is written from the right side of the page to the left.',
    }),
});

export type Commentary = z.infer<typeof CommentarySchema>;

export const DatasetSchema = z.object({
    /**
     * The ID of the dataset.
     */
    id: z.string().meta({
        description: 'The ID of the dataset.',
    }),

    /**
     * The name of the dataset.
     */
    name: z.string().meta({
        description: 'The name of the dataset.',
    }),

    /**
     * The website for the dataset.
     */
    website: z.string().meta({
        description: 'The website for the dataset.',
    }),

    /**
     * The URL that the license for the dataset can be found.
     */
    licenseUrl: z.string().meta({
        description: 'The URL that the license for the dataset can be found.',
    }),

    /**
     * The API-added notes for the license.
     */
    licenseNotes: z.string().nullable().optional().meta({
        description: 'The API-added notes for the license.',
    }),

    /**
     * The English name for the dataset.
     */
    englishName: z.string().meta({
        description: 'The English name for the dataset.',
    }),

    /**
     * The ISO 639 3-letter language tag that the dataset is primarily in.
     */
    language: z.string().meta({
        description:
            'The ISO 639 3-letter language tag that the dataset is primarily in.',
    }),

    /**
     * The direction that the language is written in.
     */
    textDirection: z.enum(['ltr', 'rtl']).meta({
        description: 'The direction that the language is written in.',
    }),
});

export type Dataset = z.infer<typeof DatasetSchema>;

/**
 * Defines a Zod schema for information about a book.
 */
export const TranslationBookSchema = z
    .object({
        /**
         * The ID of the book. Should match the USFM book ID.
         */
        id: BookIdSchema,

        /**
         * The name that the translation provided for the book.
         */
        name: z.string().meta({
            description: 'The name that the translation provided for the book.',
        }),

        /**
         * The common name for the book.
         */
        commonName: z.string().meta({
            description: 'The common name for the book.',
        }),

        /**
         * The title of the book.
         * This is usually a more descriptive version of the book name.
         * If not available, then one was not provided by the translation.
         */
        title: z.string().nullable().meta({
            description:
                'The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.',
        }),

        /**
         * The numerical order of the book in the translation.
         */
        order: z.number().meta({
            description: 'The numerical order of the book in the translation.',
        }),

        /**
         * Whether the book is an apocryphal book.
         */
        isApocryphal: z.boolean().optional().meta({
            description: 'Whether the book is an apocryphal book.',
        }),
    })
    .meta({
        id: 'TranslationBook',
        description: 'Defines the schema for information about a book.',
    });

export type TranslationBook = z.infer<typeof TranslationBookSchema>;

/**
 * Defines a Zod schema for information about a book in a commentary.
 */
export const CommentaryBookSchema = z
    .object({
        /**
         * The ID of the book. Should match the USFM book ID.
         */
        id: BookIdSchema,

        /**
         * The name that the commentary provided for the book.
         */
        name: z.string().meta({
            description: 'The name that the commentary provided for the book.',
        }),

        /**
         * The common name for the book.
         */
        commonName: z.string().meta({
            description: 'The common name for the book.',
        }),

        /**
         * The commentary's introduction for the book.
         */
        introduction: z
            .string()
            .nullable()
            .transform((x) => x ?? undefined)
            .optional()
            .pipe(z.string().optional())
            .meta({
                description:
                    "The commentary's introduction for the book. Undefined if the commentary didn't provide an introduction for the book.",
            }),

        /**
         * The summary of the commentary's introduction for the book.
         */
        introductionSummary: z
            .string()
            .nullable()
            .transform((x) => x ?? undefined)
            .optional()
            .pipe(z.string().optional())
            .meta({
                description:
                    "The summary of the commentary's introduction for the book. Undefined if the commentary didn't provide a summary for the book.",
            }),

        /**
         * The order of the book in the Bible.
         */
        order: z.number().meta({
            description: 'The order of the book in the Bible.',
        }),
    })
    .meta({
        id: 'CommentaryBook',
        description:
            'Defines the schema for information about a book in a commentary.',
    });

export type CommentaryBook = z.infer<typeof CommentaryBookSchema>;

/**
 * Defines a Zod schema for information about a dataset book.
 */
export const DatasetBookSchema = z
    .object({
        /**
         * The ID of the book. Should match the USFM book ID.
         */
        id: BookIdSchema,

        /**
         * The order of the book in the Bible.
         */
        order: z.number().meta({
            description: 'The order of the book in the Bible.',
        }),
    })
    .meta({
        id: 'DatasetBook',
        description:
            'Defines the schema for information about a book in a dataset.',
    });

export type DatasetBook = z.infer<typeof DatasetBookSchema>;

/**
 * Defines a Zod schema for information about a chapter in a dataset.
 */
export const DatasetBookChapterSchema = z
    .object({
        /**
         * The data for the chapter.
         */
        chapter: z
            .lazy(() => DatasetChapterDataSchema)
            .meta({
                description: 'The data for the chapter.',
            }),
    })
    .meta({
        id: 'DatasetBookChapter',
        description:
            'Defines the schema for information about a chapter in a dataset.',
    });

export type DatasetBookChapter = z.infer<typeof DatasetBookChapterSchema>;

export const DatasetChapterDataSchema = z
    .object({
        /**
         * The number of the chapter.
         */
        number: z.number().meta({
            description: 'The number of the chapter.',
        }),

        /**
         * The content of the chapter.
         */
        content: z.array(z.lazy(() => DatasetChapterVerseContentSchema)).meta({
            description: 'The content of the chapter.',
        }),
    })
    .meta({
        id: 'DatasetChapterData',
        description:
            'Defines the schema for information about a chapter in a dataset.',
    });

export type DatasetChapterData = z.infer<typeof DatasetChapterDataSchema>;

/**
 * Defines a Zod schema for information about a verse in a dataset chapter.
 */
export const DatasetChapterVerseContentSchema = z
    .object({
        /**
         * The number of the verse.
         */
        verse: z.number().meta({
            description: 'The number of the verse.',
        }),

        /**
         * The list of references for the verse.
         */
        references: z.array(z.lazy(() => ScoredVerseRefSchema)).meta({
            description: 'The list of references for the verse.',
        }),
    })
    .meta({
        id: 'DatasetChapterVerseContent',
        description:
            'Defines the schema for information about a verse in a dataset chapter.',
    });

export type DatasetChapterVerseContent = z.infer<
    typeof DatasetChapterVerseContentSchema
>;

/**
 * Defines an interface that contains information about a verse reference that has an arbitrary score attached to it.
 */
export const ScoredVerseRefSchema = VerseRefSchema.extend({
    score: z.number().meta({
        description:
            'The score for the verse reference. The meaning of the score is arbitrary and is determined by the dataset.',
    }),
}).meta({
    id: 'ScoredVerseRef',
    description:
        'Defines the schema for information about a verse reference that has an arbitrary score attached to it.',
});

export type ScoredVerseRef = z.infer<typeof ScoredVerseRefSchema>;

/**
 * Defines a Zod schema for a reference to another entity (person, place, event, or people group) in a dataset.
 */
export const DatasetEntityRefSchema = z
    .object({
        /**
         * The ID of the entity that is being referenced.
         */
        id: z.string().meta({
            description: 'The ID of the entity that is being referenced.',
        }),

        /**
         * The name of the entity that is being referenced.
         */
        name: z.string().optional().meta({
            description: 'The name of the entity that is being referenced.',
        }),

        /**
         * The API link for the entity that is being referenced.
         * Only present in API responses.
         */
        apiLink: z.string().optional().meta({
            description:
                'The API link for the entity that is being referenced. Relative to the API origin. Only present in API responses.',
        }),
    })
    .meta({
        id: 'DatasetEntityRef',
        description:
            'Defines the schema for a reference to another entity (person, place, event, or people group) in a dataset.',
    });

export type DatasetEntityRef = z.infer<typeof DatasetEntityRefSchema>;

/**
 * Defines a Zod schema for information about a person in a dataset.
 */
export const DatasetPersonSchema = z
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
         * Other names that the person is called by.
         */
        alsoCalled: z.array(z.string()).optional().meta({
            description: 'Other names that the person is called by.',
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
         * The description of the person.
         * Each string is a paragraph.
         */
        description: z.array(z.string()).optional().meta({
            description:
                'The description of the person. Each string is a paragraph.',
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
         * The earliest year that the person is mentioned in.
         * Negative numbers are years BC. Positive numbers are years AD.
         */
        minYear: z.number().optional().meta({
            description:
                'The earliest year that the person is mentioned in. Negative numbers are years BC. Positive numbers are years AD.',
        }),

        /**
         * The latest year that the person is mentioned in.
         * Negative numbers are years BC. Positive numbers are years AD.
         */
        maxYear: z.number().optional().meta({
            description:
                'The latest year that the person is mentioned in. Negative numbers are years BC. Positive numbers are years AD.',
        }),

        /**
         * The place that the person was born in.
         */
        birthPlace: DatasetEntityRefSchema.optional().meta({
            description: 'The place that the person was born in.',
        }),

        /**
         * The place that the person died in.
         */
        deathPlace: DatasetEntityRefSchema.optional().meta({
            description: 'The place that the person died in.',
        }),

        /**
         * The father(s) of the person.
         */
        father: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The father(s) of the person.',
        }),

        /**
         * The mother(s) of the person.
         */
        mother: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The mother(s) of the person.',
        }),

        /**
         * The partners (spouses) of the person.
         */
        partners: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The partners (spouses) of the person.',
        }),

        /**
         * The children of the person.
         */
        children: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The children of the person.',
        }),

        /**
         * The siblings of the person.
         */
        siblings: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The siblings of the person.',
        }),

        /**
         * The half-siblings of the person that share the same mother.
         */
        halfSiblingsSameMother: z
            .array(DatasetEntityRefSchema)
            .optional()
            .meta({
                description:
                    'The half-siblings of the person that share the same mother.',
            }),

        /**
         * The half-siblings of the person that share the same father.
         */
        halfSiblingsSameFather: z
            .array(DatasetEntityRefSchema)
            .optional()
            .meta({
                description:
                    'The half-siblings of the person that share the same father.',
            }),

        /**
         * The people groups that the person is a member of.
         */
        memberOf: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people groups that the person is a member of.',
        }),

        /**
         * The events that the person participated in.
         */
        events: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The events that the person participated in.',
        }),

        /**
         * The list of Bible references that mention the person.
         * Sorted by book order, chapter, and verse.
         * Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
         */
        references: z.array(VerseRefSchema).meta({
            description:
                'The list of Bible references that mention the person. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.',
        }),
    })
    .meta({
        id: 'DatasetPerson',
        description:
            'Defines the schema for information about a person in a dataset.',
    });

export type DatasetPerson = z.infer<typeof DatasetPersonSchema>;

/**
 * Defines a Zod schema for information about a place in a dataset.
 */
export const DatasetPlaceSchema = z
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
         * The name of the place as it appears in the King James Version.
         */
        kjvName: z.string().optional().meta({
            description:
                'The name of the place as it appears in the King James Version.',
        }),

        /**
         * The name of the place as it appears in the English Standard Version.
         */
        esvName: z.string().optional().meta({
            description:
                'The name of the place as it appears in the English Standard Version.',
        }),

        /**
         * Other names that the place is called by.
         */
        aliases: z.array(z.string()).optional().meta({
            description: 'Other names that the place is called by.',
        }),

        /**
         * The type of geographical feature that the place is.
         * For example, "City", "Region", "Mountain", "Water", etc.
         */
        featureType: z.string().optional().meta({
            description:
                'The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.',
        }),

        /**
         * The sub-type of geographical feature that the place is.
         */
        featureSubType: z.string().optional().meta({
            description:
                'The sub-type of geographical feature that the place is.',
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
         * How precise the latitude and longitude of the place are.
         */
        precision: z.string().optional().meta({
            description:
                'How precise the latitude and longitude of the place are.',
        }),

        /**
         * The description of the place.
         * Each string is a paragraph.
         */
        description: z.array(z.string()).optional().meta({
            description:
                'The description of the place. Each string is a paragraph.',
        }),

        /**
         * The comment on the place from the dataset authors.
         */
        comment: z.string().optional().meta({
            description: 'The comment on the place from the dataset authors.',
        }),

        /**
         * The root place for this place.
         * For example, the root place of "Sea of Galilee" and "Sea of Tiberias" is the same body of water.
         */
        rootPlace: DatasetEntityRefSchema.optional().meta({
            description:
                'The root place for this place. Different names for the same geographical location share the same root place.',
        }),

        /**
         * The place that this place is a duplicate of.
         */
        duplicateOf: DatasetEntityRefSchema.optional().meta({
            description: 'The place that this place is a duplicate of.',
        }),

        /**
         * The people that have been at the place.
         */
        people: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people that have been at the place.',
        }),

        /**
         * The people that were born at the place.
         */
        peopleBorn: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people that were born at the place.',
        }),

        /**
         * The people that died at the place.
         */
        peopleDied: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people that died at the place.',
        }),

        /**
         * The events that happened at the place.
         */
        events: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The events that happened at the place.',
        }),

        /**
         * The list of Bible references that mention the place.
         * Sorted by book order, chapter, and verse.
         * Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
         */
        references: z.array(VerseRefSchema).meta({
            description:
                'The list of Bible references that mention the place. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.',
        }),
    })
    .meta({
        id: 'DatasetPlace',
        description:
            'Defines the schema for information about a place in a dataset.',
    });

export type DatasetPlace = z.infer<typeof DatasetPlaceSchema>;

/**
 * Defines a Zod schema for information about an event in a dataset.
 */
export const DatasetEventSchema = z
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
         * Negative numbers are years BC. Positive numbers are years AD.
         * More specific dates use the `YYYY-MM-DD` format.
         */
        startDate: z.string().optional().meta({
            description:
                'The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.',
        }),

        /**
         * The duration of the event.
         * For example, "1D" is one day and "40Y" is fourty years.
         */
        duration: z.string().optional().meta({
            description:
                'The duration of the event. For example, "1D" is one day and "40Y" is fourty years.',
        }),

        /**
         * The people that participated in the event.
         */
        participants: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people that participated in the event.',
        }),

        /**
         * The places that the event happened at.
         */
        locations: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The places that the event happened at.',
        }),

        /**
         * The people groups that participated in the event.
         */
        groups: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people groups that participated in the event.',
        }),

        /**
         * The event that this event is a part of.
         */
        partOf: DatasetEntityRefSchema.optional().meta({
            description: 'The event that this event is a part of.',
        }),

        /**
         * The event that happened before this event.
         */
        predecessor: DatasetEntityRefSchema.optional().meta({
            description: 'The event that happened before this event.',
        }),

        /**
         * The list of Bible references that describe the event.
         * Sorted by book order, chapter, and verse.
         * Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
         */
        references: z.array(VerseRefSchema).meta({
            description:
                'The list of Bible references that describe the event. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.',
        }),
    })
    .meta({
        id: 'DatasetEvent',
        description:
            'Defines the schema for information about an event in a dataset.',
    });

export type DatasetEvent = z.infer<typeof DatasetEventSchema>;

/**
 * Defines a Zod schema for information about a people group in a dataset.
 */
export const DatasetPeopleGroupSchema = z
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
         * The people that are members of the people group.
         */
        members: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The people that are members of the people group.',
        }),

        /**
         * The events that the people group participated in.
         */
        events: z.array(DatasetEntityRefSchema).optional().meta({
            description: 'The events that the people group participated in.',
        }),

        /**
         * The list of Bible references that mention the people group.
         * Sorted by book order, chapter, and verse.
         * Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
         */
        references: z.array(VerseRefSchema).meta({
            description:
                'The list of Bible references that mention the people group. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.',
        }),
    })
    .meta({
        id: 'DatasetPeopleGroup',
        description:
            'Defines the schema for information about a people group in a dataset.',
    });

export type DatasetPeopleGroup = z.infer<typeof DatasetPeopleGroupSchema>;

/**
 * Defines a Zod schema for information about a profile in a commentary.
 */
export const CommentaryProfileSchema = z.object({
    /**
     * The ID of the profile.
     */
    id: z.string().meta({
        description: 'The ID of the profile.',
    }),

    /**
     * The subject of the profile.
     */
    subject: z.string().meta({
        description: 'The subject of the profile.',
    }),

    /**
     * The Bible reference that the profile is associated with.
     */
    reference: VerseRefSchema.nullable().meta({
        description:
            "The Bible reference that the profile is associated with. Null if the profile isn't associated with a specific Bible reference.",
    }),
});

export type CommentaryProfile = z.infer<typeof CommentaryProfileSchema>;

/**
 * Defines a Zod schema for information about a book chapter.
 */
export const TranslationBookChapterSchema = z
    .object({
        /**
         * The information for the chapter.
         */
        chapter: z
            .lazy(() => ChapterDataSchema)
            .meta({
                description: 'The information for the chapter.',
            }),

        /**
         * The links to different audio versions for the chapter.
         */
        thisChapterAudioLinks: z
            .lazy(() => TranslationBookChapterAudioLinksSchema)
            .meta({
                description:
                    'The links to different audio versions for the chapter.',
            }),

        /**
         * The audio timings (per-verse start times, in seconds) for different audio versions for the chapter.
         */
        thisChapterAudioTimings: z
            .lazy(() => TranslationBookChapterAudioTimingsSchema)
            .meta({
                description:
                    'The audio timings (per-verse start times, in seconds) for different audio versions for the chapter.',
            }),

        /**
         * The word-level annotations for the chapter's verses.
         * Omitted if the translation doesn't have any word-level annotations for the chapter.
         */
        thisChapterWords: z
            .lazy(() => TranslationBookChapterWordsSchema)
            .optional()
            .meta({
                description:
                    "The word-level annotations (Strong's numbers and related source data) for the chapter's verses. Omitted if the translation doesn't have any word-level annotations for the chapter.",
            }),
    })
    .meta({
        id: 'TranslationBookChapter',
        description: 'Defines the schema for information about a book chapter.',
    });

export type TranslationBookChapter = z.infer<
    typeof TranslationBookChapterSchema
>;

/**
 * Defines a Zod schema for information about a book chapter in a commentary.
 */
export const CommentaryBookChapterSchema = z
    .object({
        /**
         * The information for the chapter.
         */
        chapter: z
            .lazy(() => CommentaryChapterDataSchema)
            .meta({
                description: 'The information for the chapter.',
            }),
    })
    .meta({
        id: 'CommentaryBookChapter',
        description:
            'Defines the schema for information about a book chapter in a commentary.',
    });

export type CommentaryBookChapter = z.infer<typeof CommentaryBookChapterSchema>;

/**
 * Defines a Zod schema for the audio links for a book chapter.
 */
export const TranslationBookChapterAudioLinksSchema = z
    .record(z.string(), z.string())
    .meta({
        id: 'TranslationBookChapterAudioLinks',
        description:
            'Defines the schema for the audio links for a book chapter.',
    });

export type TranslationBookChapterAudioLinks = z.infer<
    typeof TranslationBookChapterAudioLinksSchema
>;

/**
 * Defines a Zod schema for the audio timings for a book chapter.
 * Maps a reader ID to the list of times (in seconds) that each verse starts, in verse order.
 */
export const TranslationBookChapterAudioTimingsSchema = z
    .record(z.string(), z.array(z.number()))
    .meta({
        id: 'TranslationBookChapterAudioTimings',
        description:
            'Defines the schema for the audio timings for a book chapter. Maps a reader ID to the list of times (in seconds) that each verse starts, in verse order.',
    });

export type TranslationBookChapterAudioTimings = z.infer<
    typeof TranslationBookChapterAudioTimingsSchema
>;

/**
 * Defines a Zod schema for a word-level annotation in a chapter.
 *
 * The annotation is anchored to a range of characters in a single item of a
 * verse's content, so that consumers can highlight exactly the characters that
 * it applies to.
 */
export const ChapterWordSchema = z
    .object({
        /**
         * The index of the item in the verse's content array that the annotation applies to.
         */
        contentIndex: z.number().meta({
            description:
                "The index of the item in the verse's content array that the annotation applies to.",
        }),

        /**
         * The index of the first character of the annotated word.
         */
        start: z.number().meta({
            description:
                "The index of the first character of the annotated word in the content item's text.",
        }),

        /**
         * The index after the last character of the annotated word.
         */
        end: z.number().meta({
            description:
                "The index after the last character of the annotated word in the content item's text. That is, text.slice(start, end) is the annotated word.",
        }),

        /**
         * The Strong's number(s) for the word.
         */
        strongs: z.array(z.string()).optional().meta({
            description:
                "The Strong's number(s) for the word. Omitted if the translation only provided other annotations for the word.",
        }),

        /**
         * The dictionary (citation) form of the word.
         */
        lemma: z.string().optional().meta({
            description:
                'The dictionary (citation) form of the word. Omitted if the translation did not provide one.',
        }),

        /**
         * The morphology parse code for the word.
         */
        morph: z.string().optional().meta({
            description:
                'The morphology parse code for the word. Omitted if the translation did not provide one.',
        }),

        /**
         * The pointer to the word in the source text.
         */
        srcloc: z.string().optional().meta({
            description:
                'The pointer to the word in the source text, in the <sourceName>:<location> format. Omitted if the translation did not provide one.',
        }),

        /**
         * Which occurrence of the source word this word is.
         */
        occurrence: z.number().optional().meta({
            description:
                'Which occurrence of the source word this word is. 1-based. Omitted if the translation did not provide one.',
        }),

        /**
         * The total number of times that the source word occurs.
         */
        occurrences: z.number().optional().meta({
            description:
                'The total number of times that the source word occurs. Omitted if the translation did not provide one.',
        }),
    })
    .meta({
        id: 'ChapterWord',
        description:
            "Defines the schema for a word-level annotation in a chapter. The annotation is anchored to a range of characters in a single item of a verse's content.",
    });

export type ChapterWord = z.infer<typeof ChapterWordSchema>;

/**
 * Defines a Zod schema for the word-level annotations for a book chapter.
 * Maps a verse number to the list of annotated words in the verse, in order.
 */
export const TranslationBookChapterWordsSchema = z
    .record(z.string(), z.array(z.lazy(() => ChapterWordSchema)))
    .meta({
        id: 'TranslationBookChapterWords',
        description:
            'Defines the schema for the word-level annotations for a book chapter. Maps a verse number to the list of annotated words in the verse, in order.',
    });

export type TranslationBookChapterWords = z.infer<
    typeof TranslationBookChapterWordsSchema
>;

/**
 * Defines a Zod schema for information about data in a chapter.
 */
export const ChapterDataSchema = z.object({
    /**
     * The number of the chapter.
     */
    number: z.number().meta({
        description: 'The number of the chapter.',
    }),

    /**
     * The content of the chapter.
     */
    content: z.array(z.lazy(() => ChapterContentSchema)).meta({
        description: 'The content of the chapter.',
    }),

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: z.array(z.lazy(() => ChapterFootnoteSchema)).meta({
        description: 'The list of footnotes for the chapter.',
    }),
});

export type ChapterData = z.infer<typeof ChapterDataSchema>;

/**
 * Defines a Zod schema for information about data in a chapter in a commentary.
 */
export const CommentaryChapterDataSchema = z.object({
    /**
     * The number of the chapter.
     */
    number: z.number().meta({
        description: 'The number of the chapter.',
    }),

    /**
     * The introduction that the commentary provided to the chapter.
     * Not all commentaries provide an introduction to a chapter.
     */
    introduction: z.string().optional().meta({
        description:
            'The introduction that the commentary provided to the chapter. Not all commentaries provide an introduction to a chapter.',
    }),

    /**
     * The content of the chapter.
     */
    content: z.array(z.lazy(() => ChapterVerseSchema)).meta({
        description: 'The content of the chapter.',
    }),
});

export type CommentaryChapterData = z.infer<typeof CommentaryChapterDataSchema>;

/**
 * A Zod schema for a heading in a chapter.
 */
export const ChapterHeadingSchema = z
    .object({
        /**
         * Indicates that the content represents a heading.
         */
        type: z.literal('heading'),

        /**
         * The content for the heading.
         * If multiple strings are included in the array, they should be concatenated with a space.
         */
        content: z.array(z.string()).meta({
            description:
                'The content for the heading. If multiple strings are included in the array, they should be concatenated with a space.',
        }),
    })
    .meta({
        id: 'ChapterHeading',
        description: 'Defines the schema for a heading in a chapter.',
    });

export type ChapterHeading = z.infer<typeof ChapterHeadingSchema>;

/**
 * A Zod schema for a line break in a chapter.
 */
export const ChapterLineBreakSchema = z
    .object({
        /**
         * Indicates that the content represents a line break.
         */
        type: z.literal('line_break'),
    })
    .meta({
        id: 'ChapterLineBreak',
        description: 'Defines the schema for a line break in a chapter.',
    });

export type ChapterLineBreak = z.infer<typeof ChapterLineBreakSchema>;

/**
 * A Zod schema for a Hebrew Subtitle in a chapter.
 * These are often used included as informational content that appeared in the original manuscripts.
 * For example, Psalms 49 has the Hebrew Subtitle "To the choirmaster. A Psalm of the Sons of Korah."
 */
export const ChapterHebrewSubtitleSchema = z
    .object({
        /**
         * Indicates that the content represents a Hebrew Subtitle.
         */
        type: z.literal('hebrew_subtitle'),

        /**
         * The list of content that is contained in the subtitle.
         * Each element in the list could be a string, formatted text, or a footnote reference.
         */
        content: z
            .array(
                z.union([
                    z.string(),
                    z.lazy(() => FormattedTextSchema),
                    z.lazy(() => VerseFootnoteReferenceSchema),
                ])
            )
            .meta({
                description:
                    'The content that is contained in the subtitle. Each element in the list could be a string, formatted text, or a footnote reference.',
            }),
    })
    .meta({
        id: 'ChapterHebrewSubtitle',
        description: 'Defines the schema for a Hebrew Subtitle in a chapter.',
    });

export type ChapterHebrewSubtitle = z.infer<typeof ChapterHebrewSubtitleSchema>;

/**
 * A Zod schema for a verse in a chapter.
 */
export const ChapterVerseSchema = z
    .object({
        /**
         * Indicates that the content is a verse.
         */
        type: z.literal('verse'),

        /**
         * The number of the verse.
         */
        number: z.number().meta({
            description: 'The number of the verse.',
        }),

        /**
         * The list of content for the verse.
         * Each element in the list could be a string, formatted text, or a footnote reference.
         */
        content: z
            .array(
                z.union([
                    z.string(),
                    z.lazy(() => FormattedTextSchema),
                    z.lazy(() => InlineHeadingSchema),
                    z.lazy(() => InlineLineBreakSchema),
                    z.lazy(() => VerseFootnoteReferenceSchema),
                ])
            )
            .meta({
                description:
                    'The list of content for the verse. Each element in the list could be a string, formatted text, or a footnote reference.',
            }),
    })
    .meta({
        id: 'ChapterVerse',
        description: 'Defines the schema for a verse in a chapter.',
    });

export type ChapterVerse = z.infer<typeof ChapterVerseSchema>;

/**
 * A union type that represents a single piece of chapter content.
 * A piece of chapter content can be one of the following things:
 * - A heading.
 * - A line break.
 * - A verse.
 * - A Hebrew Subtitle.
 */
export const ChapterContentSchema = z
    .discriminatedUnion('type', [
        ChapterHeadingSchema,
        ChapterLineBreakSchema,
        ChapterVerseSchema,
        ChapterHebrewSubtitleSchema,
    ])
    .meta({
        id: 'ChapterContent',
        description:
            'Defines a union type that represents a single piece of chapter content. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.',
    });

/**
 * A union type that represents a single piece of chapter content.
 * A piece of chapter content can be one of the following things:
 * - A heading.
 * - A line break.
 * - A verse.
 * - A Hebrew Subtitle.
 */
export type ChapterContent = z.infer<typeof ChapterContentSchema>;

/**
 * A Zod schema for formatted text. That is, text that is formatted in a particular manner.
 */
export const FormattedTextSchema = z
    .object({
        /**
         * The text that is formatted.
         */
        text: z.string().meta({
            description: 'The text that is formatted.',
        }),

        /**
         * Whether the text represents a poem.
         * The number indicates the level of indent.
         *
         * Common in Psalms.
         */
        poem: z.number().optional().meta({
            description:
                'Whether the text represents a poem. The number indicates the level of indent. Common in Psalms.',
        }),

        /**
         * Whether the text represents the Words of Jesus.
         */
        wordsOfJesus: z.boolean().optional().meta({
            description: 'Whether the text represents the Words of Jesus.',
        }),
    })
    .meta({
        id: 'FormattedText',
        description:
            'Defines the schema for formatted text. That is, text that is formatted in a particular manner.',
    });

export type FormattedText = z.infer<typeof FormattedTextSchema>;

/**
 * A Zod schema for a heading that is embedded in a verse.
 */
export const InlineHeadingSchema = z
    .object({
        /**
         * The text of the heading.
         */
        heading: z.string().meta({
            description: 'The text of the heading.',
        }),
    })
    .meta({
        id: 'InlineHeading',
        description:
            'Defines the schema for a heading that is embedded in a verse.',
    });

export type InlineHeading = z.infer<typeof InlineHeadingSchema>;

/**
 * A Zod schema for a line break that is embedded in a verse.
 */
export const InlineLineBreakSchema = z
    .object({
        lineBreak: z.literal(true),
    })
    .meta({
        id: 'InlineLineBreak',
        description:
            'Defines the schema for a line break that is embedded in a verse.',
    });

export type InlineLineBreak = z.infer<typeof InlineLineBreakSchema>;

/**
 * A Zod schema for a footnote reference in a verse or a Hebrew Subtitle.
 */
export const VerseFootnoteReferenceSchema = z
    .object({
        /**
         * The ID of the note.
         */
        noteId: z.number().meta({
            description: 'The ID of the note.',
        }),
    })
    .meta({
        id: 'VerseFootnoteReference',
        description:
            'Defines the schema for a footnote reference in a verse or a Hebrew Subtitle.',
    });

export type VerseFootnoteReference = z.infer<
    typeof VerseFootnoteReferenceSchema
>;

/**
 * A Zod schema for information about a footnote.
 */
export const ChapterFootnoteSchema = z
    .object({
        /**
         * The ID of the note that is referenced.
         */
        noteId: z.number().meta({
            description: 'The ID of the note that is referenced.',
        }),

        /**
         * The text of the footnote.
         */
        text: z.string().meta({
            description: 'The text of the footnote.',
        }),

        /**
         * The verse reference for the footnote.
         */
        reference: z
            .object({
                chapter: z.number(),
                verse: z.number(),
            })
            .optional()
            .meta({
                description:
                    "The verse reference for the footnote. Undefined if the footnote isn't associated with a specific verse.",
            }),

        /**
         * The caller that should be used for the footnote.
         * For footnotes, a "caller" is the character that is used in the text to reference to footnote.
         *
         * For example, in the text:
         * Hello (a) World
         *
         * ----
         * (a) This is a footnote.
         *
         * The "(a)" is the caller.
         *
         * If "+", then the caller should be autogenerated.
         * If null, then the caller should be empty.
         * If a string, then the caller should be that string.
         */
        caller: z.union([z.literal('+'), z.string(), z.null()]).meta({
            description:
                'The caller that should be used for the footnote. For footnotes, a "caller" is the character that is used in the text to reference to footnote. For example, in the text: Hello (a) World ---- (a) This is a footnote. The "(a)" is the caller. If "+", then the caller should be autogenerated. If null, then the caller should be empty. If a string, then the caller should be that string.',
        }),
    })
    .meta({
        id: 'ChapterFootnote',
        description: 'Defines the schema for information about a footnote.',
    });

export type ChapterFootnote = z.infer<typeof ChapterFootnoteSchema>;

/**
 * A Zod schema for a range of text inside a simplified verse.
 *
 * Ranges are expressed as offsets into the `text` property of the verse that contains them.
 * Offsets are measured in UTF-16 code units, which is what JavaScript's `String.prototype.length`,
 * `String.prototype.slice()`, and `String.prototype.substring()` use.
 */
export const SimpleTextRangeSchema = z
    .object({
        /**
         * The index of the first character in the range.
         */
        start: z.number().meta({
            description:
                'The index of the first character of the range in the verse text. Measured in UTF-16 code units.',
        }),

        /**
         * The index after the last character in the range.
         */
        end: z.number().meta({
            description:
                'The index after the last character of the range in the verse text. Measured in UTF-16 code units.',
        }),
    })
    .meta({
        id: 'SimpleTextRange',
        description:
            'Defines the schema for a range of text inside a simplified verse. Ranges are expressed as offsets into the text of the verse that contains them, measured in UTF-16 code units.',
    });

export type SimpleTextRange = z.infer<typeof SimpleTextRangeSchema>;

/**
 * A Zod schema for a range of text inside a simplified verse that represents a line of poetry.
 */
export const SimplePoemRangeSchema = SimpleTextRangeSchema.extend({
    /**
     * The level of indent that the poem line should be displayed with.
     */
    level: z.number().meta({
        description:
            'The level of indent that the line of poetry should be displayed with.',
    }),
}).meta({
    id: 'SimplePoemRange',
    description:
        'Defines the schema for a range of text inside a simplified verse that represents a line of poetry.',
});

export type SimplePoemRange = z.infer<typeof SimplePoemRangeSchema>;

/**
 * A Zod schema for a footnote in a simplified verse.
 */
export const SimpleVerseFootnoteSchema = z
    .object({
        /**
         * The ID of the note.
         */
        noteId: z.number().meta({
            description: 'The ID of the note.',
        }),

        /**
         * The index in the verse text that the footnote caller should be inserted at.
         */
        offset: z.number().meta({
            description:
                'The index in the verse text that the footnote caller should be inserted at. Measured in UTF-16 code units.',
        }),

        /**
         * The text of the footnote.
         */
        text: z.string().meta({
            description: 'The text of the footnote.',
        }),

        /**
         * The caller that should be used for the footnote.
         * See ChapterFootnote for more information.
         */
        caller: z.union([z.literal('+'), z.string(), z.null()]).meta({
            description:
                'The caller that should be used for the footnote. If "+", then the caller should be autogenerated. If null, then the caller should be empty. If a string, then the caller should be that string.',
        }),
    })
    .meta({
        id: 'SimpleVerseFootnote',
        description:
            'Defines the schema for a footnote in a simplified verse. Unlike the footnotes in the regular chapter format, simplified footnotes include the position that they occur at in the verse text.',
    });

export type SimpleVerseFootnote = z.infer<typeof SimpleVerseFootnoteSchema>;

/**
 * A Zod schema for a heading that is embedded in a simplified verse.
 */
export const SimpleInlineHeadingSchema = z
    .object({
        /**
         * The index in the verse text that the heading occurs at.
         */
        offset: z.number().meta({
            description:
                'The index in the verse text that the heading occurs at. Measured in UTF-16 code units.',
        }),

        /**
         * The text of the heading.
         */
        text: z.string().meta({
            description: 'The text of the heading.',
        }),
    })
    .meta({
        id: 'SimpleInlineHeading',
        description:
            'Defines the schema for a heading that is embedded in a simplified verse.',
    });

export type SimpleInlineHeading = z.infer<typeof SimpleInlineHeadingSchema>;

/**
 * A Zod schema for a verse in a simplified chapter.
 */
export const SimpleChapterVerseSchema = z
    .object({
        /**
         * Indicates that the content is a verse.
         */
        type: z.literal('verse'),

        /**
         * The number of the verse.
         */
        number: z.number().meta({
            description: 'The number of the verse.',
        }),

        /**
         * The text of the verse.
         */
        text: z.string().meta({
            description:
                'The text of the verse. Lines of poetry and line breaks are separated by newline (\\n) characters.',
        }),

        /**
         * The footnotes that occur in the verse.
         */
        footnotes: z.array(SimpleVerseFootnoteSchema).meta({
            description: 'The footnotes that occur in the verse.',
        }),

        /**
         * The headings that occur in the verse.
         */
        headings: z.array(SimpleInlineHeadingSchema).optional().meta({
            description:
                'The headings that occur in the middle of the verse. Omitted if the verse contains no inline headings.',
        }),

        /**
         * The ranges of text that represent the Words of Jesus.
         */
        wordsOfJesus: z.array(SimpleTextRangeSchema).optional().meta({
            description:
                'The ranges of the verse text that represent the Words of Jesus. Omitted if the verse contains none.',
        }),

        /**
         * The ranges of text that represent lines of poetry.
         */
        poem: z.array(SimplePoemRangeSchema).optional().meta({
            description:
                'The ranges of the verse text that represent lines of poetry. Omitted if the verse contains none.',
        }),
    })
    .meta({
        id: 'SimpleChapterVerse',
        description: 'Defines the schema for a verse in a simplified chapter.',
    });

export type SimpleChapterVerse = z.infer<typeof SimpleChapterVerseSchema>;

/**
 * A Zod schema for a Hebrew Subtitle in a simplified chapter.
 */
export const SimpleChapterHebrewSubtitleSchema = SimpleChapterVerseSchema.omit({
    type: true,
    number: true,
})
    .extend({
        /**
         * Indicates that the content represents a Hebrew Subtitle.
         */
        type: z.literal('hebrew_subtitle'),
    })
    .meta({
        id: 'SimpleChapterHebrewSubtitle',
        description:
            'Defines the schema for a Hebrew Subtitle in a simplified chapter.',
    });

export type SimpleChapterHebrewSubtitle = z.infer<
    typeof SimpleChapterHebrewSubtitleSchema
>;

/**
 * A Zod schema for a heading in a simplified chapter.
 */
export const SimpleChapterHeadingSchema = z
    .object({
        /**
         * Indicates that the content represents a heading.
         */
        type: z.literal('heading'),

        /**
         * The text of the heading.
         */
        text: z.string().meta({
            description: 'The text of the heading.',
        }),
    })
    .meta({
        id: 'SimpleChapterHeading',
        description:
            'Defines the schema for a heading in a simplified chapter.',
    });

export type SimpleChapterHeading = z.infer<typeof SimpleChapterHeadingSchema>;

/**
 * A union type that represents a single piece of content in a simplified chapter.
 * A piece of chapter content can be one of the following things:
 * - A heading.
 * - A line break.
 * - A verse.
 * - A Hebrew Subtitle.
 */
export const SimpleChapterContentSchema = z
    .discriminatedUnion('type', [
        SimpleChapterHeadingSchema,
        ChapterLineBreakSchema,
        SimpleChapterVerseSchema,
        SimpleChapterHebrewSubtitleSchema,
    ])
    .meta({
        id: 'SimpleChapterContent',
        description:
            'Defines a union type that represents a single piece of content in a simplified chapter. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.',
    });

export type SimpleChapterContent = z.infer<typeof SimpleChapterContentSchema>;

/**
 * A Zod schema for the data in a simplified chapter.
 */
export const SimpleChapterDataSchema = z
    .object({
        /**
         * The number of the chapter.
         */
        number: z.number().meta({
            description: 'The number of the chapter.',
        }),

        /**
         * The content of the chapter.
         */
        content: z.array(SimpleChapterContentSchema).meta({
            description: 'The content of the chapter.',
        }),

        /**
         * The footnotes that could not be associated with a verse.
         */
        footnotes: z.array(ChapterFootnoteSchema).meta({
            description:
                'The list of footnotes that could not be associated with a verse. Footnotes that belong to a verse are included on the verse itself, so this list is usually empty.',
        }),
    })
    .meta({
        id: 'SimpleChapterData',
        description:
            'Defines the schema for the data in a simplified chapter. Unlike the regular chapter format, each verse contains a single text string and the footnotes/formatting are represented by offsets into that string.',
    });

export type SimpleChapterData = z.infer<typeof SimpleChapterDataSchema>;

/**
 * A Zod schema for the data in a simplified commentary chapter.
 */
export const SimpleCommentaryChapterDataSchema = z
    .object({
        /**
         * The number of the chapter.
         */
        number: z.number().meta({
            description: 'The number of the chapter.',
        }),

        /**
         * The introduction that the commentary provided to the chapter.
         */
        introduction: z.string().optional().meta({
            description:
                'The introduction that the commentary provided to the chapter. Not all commentaries provide an introduction to a chapter.',
        }),

        /**
         * The content of the chapter.
         */
        content: z.array(SimpleChapterVerseSchema).meta({
            description: 'The content of the chapter.',
        }),
    })
    .meta({
        id: 'SimpleCommentaryChapterData',
        description:
            'Defines the schema for the data in a simplified commentary chapter.',
    });

export type SimpleCommentaryChapterData = z.infer<
    typeof SimpleCommentaryChapterDataSchema
>;

/**
 * Defines a Zod schema for information about a book chapter, using the simplified
 * chapter format.
 */
export const SimpleTranslationBookChapterSchema =
    TranslationBookChapterSchema.extend({
        /**
         * The simplified information for the chapter.
         */
        chapter: z
            .lazy(() => SimpleChapterDataSchema)
            .meta({
                description: 'The simplified information for the chapter.',
            }),

        /**
         * The word-level annotations for the chapter's verses, using the simplified format.
         */
        thisChapterWords: z
            .lazy(() => SimpleTranslationBookChapterWordsSchema)
            .optional()
            .meta({
                description:
                    "The word-level annotations (Strong's numbers and related source data) for the chapter's verses, with their offsets remapped onto the simplified verse text. Omitted if the translation doesn't have any word-level annotations for the chapter.",
            }),
    }).meta({
        id: 'SimpleTranslationBookChapter',
        description:
            'Defines the schema for information about a book chapter, using the simplified chapter format.',
    });

export type SimpleTranslationBookChapter = z.infer<
    typeof SimpleTranslationBookChapterSchema
>;

/**
 * A Zod schema for a word-level annotation in a simplified chapter.
 *
 * Unlike the regular annotations, these are anchored to a range of characters in the
 * text of a verse, since the simplified format replaces the verse's content array with
 * a single string.
 */
export const SimpleChapterWordSchema = ChapterWordSchema.omit({
    contentIndex: true,
}).meta({
    id: 'SimpleChapterWord',
    description:
        "Defines the schema for a word-level annotation in a simplified chapter. The annotation is anchored to a range of characters in the verse's text.",
});

export type SimpleChapterWord = z.infer<typeof SimpleChapterWordSchema>;

/**
 * Defines a Zod schema for the word-level annotations for a book chapter, using the
 * simplified format.
 * Maps a verse number to the list of annotated words in the verse, in order.
 */
export const SimpleTranslationBookChapterWordsSchema = z
    .record(z.string(), z.array(z.lazy(() => SimpleChapterWordSchema)))
    .meta({
        id: 'SimpleTranslationBookChapterWords',
        description:
            'Defines the schema for the word-level annotations for a book chapter, using the simplified format. Maps a verse number to the list of annotated words in the verse, in order.',
    });

export type SimpleTranslationBookChapterWords = z.infer<
    typeof SimpleTranslationBookChapterWordsSchema
>;
