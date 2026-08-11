import { VerseRef } from '../utils.js';

/**
 * The parse tree that is gathered.
 */
export interface ParseTree {
    type: 'root';

    /**
     * The ID of the parse tree.
     */
    id?: string;

    /**
     * The header that was associated with the tree.
     */
    header?: string;

    /**
     * The major title that was associated with the tree.
     */
    title?: string;

    /**
     * The list of chapters for the tree.
     */
    content: (Heading | Chapter)[];

    /**
     * The list of messages that were generated during parsing.
     */
    parseMessages?: ParseMessage[];
}

export interface ParseMessage {
    type: 'warning' | 'error';
    message: string;
}

export interface Heading {
    type: 'heading';
    content: string[];
}

export type ChapterContent = Heading | Verse | HebrewSubtitle | LineBreak;

export type VerseContent = string | FootnoteReference | Text;

/**
 * Defines an interface that represents a chapter.
 */
export interface Chapter {
    type: 'chapter';
    number: number;

    /**
     * The contents of the chapter.
     */
    content: ChapterContent[];

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: Footnote[];

    /**
     * The word-level annotations for the chapter's verses.
     * Undefined if the source didn't contain any word-level annotations.
     */
    words?: ChapterWords;
}

/**
 * Defines the word-level annotations for a chapter, keyed by verse number.
 */
export type ChapterWords = {
    [verseNumber: string]: ChapterWord[];
};

/**
 * Defines an interface that represents the annotations that a source associated
 * with a specific range of characters in a verse.
 *
 * The range is anchored to a single item of the verse's content array, so that
 * consumers can highlight the exact characters that an annotation applies to.
 */
export interface ChapterWord {
    /**
     * The index of the item in the verse's content array that the annotation applies to.
     */
    contentIndex: number;

    /**
     * The index of the first character of the annotated word in the content item's text.
     */
    start: number;

    /**
     * The index after the last character of the annotated word in the content item's text.
     * That is, `text.slice(start, end)` is the annotated word.
     */
    end: number;

    /**
     * The Strong's number(s) for the word.
     * Undefined if the source only provided other annotations for the word.
     */
    strongs?: string[];

    /**
     * The dictionary (citation) form of the word.
     * Taken from the `lemma` attribute.
     */
    lemma?: string;

    /**
     * The morphology parse code for the word.
     * Taken from the `x-morph` attribute.
     */
    morph?: string;

    /**
     * The pointer to the word in the source text, in the `<sourceName>:<location>` format.
     * Taken from the `srcloc` attribute.
     */
    srcloc?: string;

    /**
     * Which occurrence of the source word this word is. 1-based.
     * Taken from the `x-occurrence` attribute.
     */
    occurrence?: number;

    /**
     * The total number of times that the source word occurs.
     * Taken from the `x-occurrences` attribute.
     */
    occurrences?: number;
}

/**
 * Defines an interface that represents a hebrew subtitle.
 */
export interface HebrewSubtitle {
    type: 'hebrew_subtitle';

    /**
     * The contents of the subtitle.
     */
    content: (string | Text | FootnoteReference)[];
}

/**
 * Defines an interface that represents a verse.
 */
export interface Verse {
    type: 'verse';

    number: number;

    /**
     * The contents of the verse.
     */
    content: (
        | string
        | Text
        | InlineHeading
        | InlineLineBreak
        | FootnoteReference
    )[];
}

/**
 * Defines an interface that represents text that has some markup attributes applied to it.
 */
export interface Text {
    /**
     * The text that is contained.
     */
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     */
    poem?: number;

    /**
     * Whether the text contains the words of Jesus.
     */
    wordsOfJesus?: boolean;

    /**
     * Whether the text is descriptive.
     *
     * This is only used for "hebrew subtitles" that are included inside the verse markers.
     */
    descriptive?: boolean;

    /**
     * Whether the text should be displayed in italics.
     */
    italics?: boolean;
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

export interface FootnoteReference {
    /**
     * The ID of the note that is referenced.
     */
    noteId: number;
}

export interface Footnote {
    noteId: number;

    /**
     * The text of the footnote.
     */
    text: string;

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

    /**
     * The verse reference for the footnote.
     */
    reference?: {
        chapter: number;
        verse: number;
    };
}

export interface LineBreak {
    type: 'line_break';
}

/**
 * The parse tree that is gathered.
 */
export interface CommentaryParseTree {
    type: 'commentary/root';

    /**
     * The books that are contained in the commentary.
     */
    books: CommentaryBookNode[];

    /**
     * The profiles that are contained in the commentary.
     */
    profiles?: CommentaryProfileNode[];
}

export interface CommentaryBookNode {
    type: 'book';
    book: string;
    introduction: string | null;
    introductionSummary?: string | null;
    chapters: CommentaryChapterNode[];
}

export interface CommentaryProfileNode {
    /**
     * The ID of the profile.
     * Used to identify the profile within a commentary.
     */
    id: string;

    /**
     * The subject(s) of the profile.
     */
    subject: string;

    /**
     * The Bible reference that the profile is associated with.
     */
    reference: VerseRef | null;

    /**
     * The content of the profile.
     */
    content: string[];
}

export interface CommentaryChapterNode {
    type: 'chapter';
    number: number;
    introduction: string | null;
    verses: CommentaryVerseNode[];
}

export interface CommentaryVerseNode {
    type: 'verse';
    number: number;
    content: string[];
}
