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
