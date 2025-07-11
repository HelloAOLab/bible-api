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
