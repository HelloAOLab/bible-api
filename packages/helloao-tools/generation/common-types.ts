import { VerseRef } from '../utils.js';

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
    fileType: 'usfm' | 'usx' | 'json';
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
 * Defines an interface that contains information about a translation.
 */
export interface Translation {
    /**
     * The ID of the translation.
     */
    id: string;

    /**
     * The name of the translation.
     */
    name: string;

    /**
     * The website for the translation.
     */
    website: string;

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: string;

    /**
     * The API-added notes for the license.
     */
    licenseNotes?: string | null;

    /**
     * The short name for the translation.
     */
    shortName?: string;

    /**
     * The English name for the translation.
     */
    englishName: string;

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';
}

/**
 * Defines an interface that contains information about a commentary.
 */
export interface Commentary {
    /**
     * The ID of the commentary.
     */
    id: string;

    /**
     * The name of the commentary.
     */
    name: string;

    /**
     * The website for the commentary.
     */
    website: string;

    /**
     * The URL that the license for the commentary can be found.
     */
    licenseUrl: string;

    /**
     * The API-added notes for the license.
     */
    licenseNotes?: string | null;

    /**
     * The english name for the commentary.
     */
    englishName: string;

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';
}

/**
 * Defines an interface that contains information about a book.
 */
export interface TranslationBook {
    /**
     * The ID of the book. Should match the USFM book ID.
     */
    id: string;

    /**
     * The name that the translation provided for the book.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The title of the book.
     * This is usually a more descriptive version of the book name.
     * If not available, then one was not provided by the translation.
     */
    title: string | null;

    /**
     * The numerical order of the book in the translation.
     */
    order: number;
}

/**
 * Defines an interface that contains information about a book in a commentary.
 */
export interface CommentaryBook {
    /**
     * The ID of the book. Should match the USFM book ID.
     */
    id: string;

    /**
     * The name that the commentary provided for the book.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The commentary's introduction for the book.
     */
    introduction?: string;

    /**
     * The summary of the commentary's introduction for the book.
     */
    introductionSummary?: string;

    /**
     * The order of the book in the Bible.
     */
    order: number;
}

/**
 * Defines an interface that contains information about a profile in a commentary.
 */
export interface CommentaryProfile {
    /**
     * The ID of the profile.
     */
    id: string;

    /**
     * The subject of the profile.
     */
    subject: string;

    /**
     * The Bible reference that the profile is associated with.
     */
    reference: VerseRef | null;
}

/**
 * Defines an interface that contains information about a book chapter.
 */
export interface TranslationBookChapter {
    /**
     * The information for the chapter.
     */
    chapter: ChapterData;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;
}

/**
 * Defines an interface that contains information about a book chapter in a commentary.
 */
export interface CommentaryBookChapter {
    /**
     * The information for the chapter.
     */
    chapter: CommentaryChapterData;
}

/**
 * Defines an interface that contains the audio links for a book chapter.
 */
export interface TranslationBookChapterAudioLinks {
    /**
     * The reader for the chapter and the URL link to the audio file.
     */
    [reader: string]: string;
}

/**
 * Defines an interface that represents data in a chapter.
 */
export interface ChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The content of the chapter.
     */
    content: ChapterContent[];

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Defines an interface that represents data in a chapter in a commentary.
 */
export interface CommentaryChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The introduction that the commentary provided to the chapter.
     * Not all commentaries provide an introduction to a chapter.
     */
    introduction?: string;

    /**
     * The content of the chapter.
     */
    content: ChapterVerse[];
}

/**
 * A union type that represents a single piece of chapter content.
 * A piece of chapter content can be one of the following things:
 * - A heading.
 * - A line break.
 * - A verse.
 * - A Hebrew Subtitle.
 */
export type ChapterContent =
    | ChapterHeading
    | ChapterLineBreak
    | ChapterVerse
    | ChapterHebrewSubtitle;

/**
 * A heading in a chapter.
 */
export interface ChapterHeading {
    /**
     * Indicates that the content represents a heading.
     */
    type: 'heading';

    /**
     * The content for the heading.
     * If multiple strings are included in the array, they should be concatenated with a space.
     */
    content: string[];
}

/**
 * A line break in a chapter.
 */
export interface ChapterLineBreak {
    /**
     * Indicates that the content represents a line break.
     */
    type: 'line_break';
}

/**
 * A Hebrew Subtitle in a chapter.
 * These are often used included as informational content that appeared in the original manuscripts.
 * For example, Psalms 49 has the Hebrew Subtitle "To the choirmaster. A Psalm of the Sons of Korah."
 */
export interface ChapterHebrewSubtitle {
    /**
     * Indicates that the content represents a Hebrew Subtitle.
     */
    type: 'hebrew_subtitle';

    /**
     * The list of content that is contained in the subtitle.
     * Each element in the list could be a string, formatted text, or a footnote reference.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * A verse in a chapter.
 */
export interface ChapterVerse {
    /**
     * Indicates that the content is a verse.
     */
    type: 'verse';

    /**
     * The number of the verse.
     */
    number: number;

    /**
     * The list of content for the verse.
     * Each element in the list could be a string, formatted text, or a footnote reference.
     */
    content: (
        | string
        | FormattedText
        | InlineHeading
        | InlineLineBreak
        | VerseFootnoteReference
    )[];
}

/**
 * Formatted text. That is, text that is formated in a particular manner.
 */
export interface FormattedText {
    /**
     * The text that is formatted.
     */
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     *
     * Common in Psalms.
     */
    poem?: number;

    /**
     * Whether the text represents the Words of Jesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Defines an interface that represents a heading that is embedded in a verse.
 */
export interface InlineHeading {
    /**
     * The text of the heading.
     */
    heading: string;
}

/**
 * Defines an interface that represents a line break that is embedded in a verse.
 */
export interface InlineLineBreak {
    lineBreak: true;
}

/**
 * A footnote reference in a verse or a Hebrew Subtitle.
 */
export interface VerseFootnoteReference {
    /**
     * The ID of the note.
     */
    noteId: number;
}

/**
 * Information about a footnote.
 */
export interface ChapterFootnote {
    /**
     * The ID of the note that is referenced.
     */
    noteId: number;

    /**
     * The text of the footnote.
     */
    text: string;

    /**
     * The verse reference for the footnote.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

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
    caller: '+' | string | null;
}
