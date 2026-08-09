import {
    ChapterData,
    ChapterFootnote,
    ChapterHebrewSubtitle,
    ChapterVerse,
    CommentaryChapterData,
    SimpleChapterContent,
    SimpleChapterData,
    SimpleChapterHebrewSubtitle,
    SimpleChapterVerse,
    SimpleCommentaryChapterData,
    SimpleInlineHeading,
    SimplePoemRange,
    SimpleTextRange,
    SimpleVerseFootnote,
} from './common-types.js';

/**
 * The types of content that can be contained in a verse or Hebrew Subtitle.
 */
type VerseContent =
    | ChapterVerse['content'][number]
    | ChapterHebrewSubtitle['content'][number];

/**
 * The result of flattening the content of a verse into a single string.
 */
export interface SimplifiedVerseContent {
    /**
     * The text of the verse.
     */
    text: string;

    /**
     * The footnotes that occur in the verse.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * The headings that occur in the middle of the verse.
     */
    headings: SimpleInlineHeading[];

    /**
     * The ranges of text that represent the Words of Jesus.
     */
    wordsOfJesus: SimpleTextRange[];

    /**
     * The ranges of text that represent lines of poetry.
     */
    poem: SimplePoemRange[];
}

/**
 * Flattens the content of a verse into a single string, recording the positions of the
 * footnotes, headings, and formatting that occur in it.
 *
 * The rules used to build the text are:
 * - Strings and formatted text are appended as-is. The source data already contains the
 *   spacing that is needed between them.
 * - Lines of poetry and line breaks start a new line.
 * - Footnote and heading markers are replaced with a single space when one is needed to
 *   keep the surrounding words apart.
 *
 * All of the recorded offsets are measured in UTF-16 code units, which is what
 * `String.prototype.slice()` and `String.prototype.length` use.
 *
 * @param content The content of the verse.
 * @param footnotes The footnotes for the chapter, keyed by note ID.
 * @param usedFootnotes A set that the IDs of the referenced footnotes are added to.
 */
export function simplifyVerseContent(
    content: readonly VerseContent[],
    footnotes: Map<number, ChapterFootnote> = new Map(),
    usedFootnotes: Set<number> = new Set()
): SimplifiedVerseContent {
    let text = '';
    const verseFootnotes: SimpleVerseFootnote[] = [];
    const headings: SimpleInlineHeading[] = [];
    const wordsOfJesus: SimpleTextRange[] = [];
    const poem: SimplePoemRange[] = [];

    /**
     * Removes the given number of characters from the end of the text and moves any
     * offsets that pointed into the removed region back to the new end of the text.
     */
    const truncateTo = (length: number) => {
        if (length >= text.length) {
            return;
        }
        text = text.slice(0, length);
        for (let footnote of verseFootnotes) {
            footnote.offset = Math.min(footnote.offset, length);
        }
        for (let heading of headings) {
            heading.offset = Math.min(heading.offset, length);
        }
        for (let range of [...wordsOfJesus, ...poem]) {
            range.start = Math.min(range.start, length);
            range.end = Math.min(range.end, length);
        }
    };

    /**
     * Starts a new line, first removing any spaces that were left at the end of the
     * current one.
     */
    const startNewLine = () => {
        truncateTo(text.replace(/[^\S\n]+$/, '').length);
        text += '\n';
    };

    /**
     * Determines whether a space needs to be inserted in place of a marker in order to
     * keep the text that surrounds it apart.
     */
    const needsSeparator = (next: VerseContent | undefined) => {
        if (text.length <= 0 || /\s$/.test(text) || !next) {
            return false;
        }
        if (typeof next === 'string') {
            return next.length > 0 && !/^\s/.test(next);
        }
        if ('text' in next) {
            // Poem lines always start a new line, so they never need a separator.
            return (
                typeof next.poem !== 'number' &&
                next.text.length > 0 &&
                !/^\s/.test(next.text)
            );
        }
        // Line breaks start their own line, and consecutive markers only ever need
        // a single separator between them.
        return false;
    };

    for (let i = 0; i < content.length; i++) {
        const part = content[i];

        if (typeof part === 'string') {
            text += part;
            continue;
        }

        if ('text' in part) {
            if (
                typeof part.poem === 'number' &&
                text.length > 0 &&
                !text.endsWith('\n')
            ) {
                startNewLine();
            }

            const start = text.length;
            text += part.text;
            const end = text.length;

            if (end > start) {
                if (part.wordsOfJesus) {
                    wordsOfJesus.push({ start, end });
                }
                if (typeof part.poem === 'number') {
                    poem.push({ start, end, level: part.poem });
                }
            }
        } else if ('lineBreak' in part) {
            if (text.length > 0 && !text.endsWith('\n')) {
                startNewLine();
            }
        } else if ('noteId' in part) {
            const footnote = footnotes.get(part.noteId);
            if (footnote) {
                usedFootnotes.add(part.noteId);
                verseFootnotes.push({
                    noteId: footnote.noteId,
                    offset: text.length,
                    text: footnote.text,
                    caller: footnote.caller,
                });
            }
            if (needsSeparator(content[i + 1])) {
                text += ' ';
            }
        } else if ('heading' in part) {
            headings.push({
                offset: text.length,
                text: part.heading,
            });
            if (needsSeparator(content[i + 1])) {
                text += ' ';
            }
        }
    }

    // Trim the whitespace that line breaks and separators can leave behind.
    truncateTo(text.replace(/\s+$/, '').length);

    const leading = text.length - text.replace(/^\s+/, '').length;
    if (leading > 0) {
        text = text.slice(leading);
        for (let footnote of verseFootnotes) {
            footnote.offset = Math.max(0, footnote.offset - leading);
        }
        for (let heading of headings) {
            heading.offset = Math.max(0, heading.offset - leading);
        }
        for (let range of [...wordsOfJesus, ...poem]) {
            range.start = Math.max(0, range.start - leading);
            range.end = Math.max(0, range.end - leading);
        }
    }

    return {
        text,
        footnotes: verseFootnotes,
        headings,
        wordsOfJesus: mergeAdjacentRanges(wordsOfJesus, text),
        poem: poem.filter((range) => range.start < range.end),
    };
}

/**
 * Merges the ranges that are only separated by whitespace into single ranges.
 * @param ranges The ranges to merge. Must be sorted by their start offset.
 * @param text The text that the ranges point into.
 */
function mergeAdjacentRanges(
    ranges: SimpleTextRange[],
    text: string
): SimpleTextRange[] {
    const merged: SimpleTextRange[] = [];
    for (let range of ranges) {
        if (range.start >= range.end) {
            continue;
        }
        const previous = merged[merged.length - 1];
        if (
            previous &&
            range.start >= previous.end &&
            !/\S/.test(text.slice(previous.end, range.start))
        ) {
            previous.end = range.end;
        } else {
            merged.push(range);
        }
    }
    return merged;
}

/**
 * Converts the given verse into its simplified representation.
 * @param verse The verse to convert.
 * @param footnotes The footnotes for the chapter, keyed by note ID.
 * @param usedFootnotes A set that the IDs of the referenced footnotes are added to.
 */
export function simplifyVerse(
    verse: ChapterVerse,
    footnotes?: Map<number, ChapterFootnote>,
    usedFootnotes?: Set<number>
): SimpleChapterVerse {
    const simplified = simplifyVerseContent(
        verse.content,
        footnotes,
        usedFootnotes
    );

    return {
        type: 'verse',
        number: verse.number,
        ...omitEmptyProperties(simplified),
    };
}

/**
 * Converts the given Hebrew Subtitle into its simplified representation.
 * @param subtitle The subtitle to convert.
 * @param footnotes The footnotes for the chapter, keyed by note ID.
 * @param usedFootnotes A set that the IDs of the referenced footnotes are added to.
 */
export function simplifyHebrewSubtitle(
    subtitle: ChapterHebrewSubtitle,
    footnotes?: Map<number, ChapterFootnote>,
    usedFootnotes?: Set<number>
): SimpleChapterHebrewSubtitle {
    const simplified = simplifyVerseContent(
        subtitle.content,
        footnotes,
        usedFootnotes
    );

    return {
        type: 'hebrew_subtitle',
        ...omitEmptyProperties(simplified),
    };
}

/**
 * Omits the optional properties of the given simplified content when they are empty.
 * @param content The content to omit the empty properties from.
 */
function omitEmptyProperties(content: SimplifiedVerseContent) {
    return {
        text: content.text,
        footnotes: content.footnotes,
        ...(content.headings.length > 0 ? { headings: content.headings } : {}),
        ...(content.wordsOfJesus.length > 0
            ? { wordsOfJesus: content.wordsOfJesus }
            : {}),
        ...(content.poem.length > 0 ? { poem: content.poem } : {}),
    };
}

/**
 * Converts the given chapter into the simplified chapter format.
 *
 * In the simplified format, the content of each verse is a single string instead of a list
 * of formatted content, and the footnotes are available on the verse that they occur in,
 * along with the offset that they occur at.
 *
 * @param chapter The chapter to convert.
 */
export function simplifyChapter(chapter: ChapterData): SimpleChapterData {
    const footnotes = new Map<number, ChapterFootnote>();
    for (let footnote of chapter.footnotes) {
        footnotes.set(footnote.noteId, footnote);
    }

    const usedFootnotes = new Set<number>();
    const content: SimpleChapterContent[] = [];
    const versesByNumber = new Map<number, SimpleChapterVerse>();

    for (let c of chapter.content) {
        if (c.type === 'verse') {
            const verse = simplifyVerse(c, footnotes, usedFootnotes);
            versesByNumber.set(verse.number, verse);
            content.push(verse);
        } else if (c.type === 'hebrew_subtitle') {
            content.push(simplifyHebrewSubtitle(c, footnotes, usedFootnotes));
        } else if (c.type === 'heading') {
            content.push({
                type: 'heading',
                text: c.content.join(' '),
            });
        } else if (c.type === 'line_break') {
            content.push({
                type: 'line_break',
            });
        }
    }

    // Footnotes that aren't referenced by any verse content, but that do reference a
    // verse, get attached to the end of that verse.
    const unreferencedFootnotes: ChapterFootnote[] = [];
    for (let footnote of chapter.footnotes) {
        if (usedFootnotes.has(footnote.noteId)) {
            continue;
        }

        const verse = footnote.reference
            ? versesByNumber.get(footnote.reference.verse)
            : undefined;

        if (verse) {
            verse.footnotes.push({
                noteId: footnote.noteId,
                offset: verse.text.length,
                text: footnote.text,
                caller: footnote.caller,
            });
        } else {
            unreferencedFootnotes.push(footnote);
        }
    }

    return {
        number: chapter.number,
        content,
        footnotes: unreferencedFootnotes,
    };
}

/**
 * Converts the given commentary chapter into the simplified chapter format.
 * @param chapter The chapter to convert.
 */
export function simplifyCommentaryChapter(
    chapter: CommentaryChapterData
): SimpleCommentaryChapterData {
    return {
        number: chapter.number,
        ...(chapter.introduction !== undefined
            ? { introduction: chapter.introduction }
            : {}),
        content: chapter.content.map((verse) => simplifyVerse(verse)),
    };
}
