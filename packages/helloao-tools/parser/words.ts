import { Chapter, ChapterWord } from './types.js';

/**
 * The annotations that a source associated with a word, without any information
 * about where the word is located.
 */
export type WordAnnotations = Omit<
    ChapterWord,
    'contentIndex' | 'start' | 'end'
>;

/**
 * Defines an interface that represents a range of characters within a single
 * piece of text, along with the annotations that apply to it.
 */
export interface WordRange {
    /**
     * The index of the first character of the word.
     */
    start: number;

    /**
     * The index after the last character of the word.
     */
    end: number;

    /**
     * The annotations that apply to the word.
     */
    annotations: WordAnnotations;
}

/**
 * Defines an interface that pairs a piece of verse content with the word
 * annotations that apply to it, so that the annotations can be passed along
 * with the content while it is being parsed.
 *
 * The ranges are relative to the text of the content, and are never included in
 * the final parse tree.
 */
export interface AnnotatedContent<T> {
    /**
     * The content that the annotations apply to.
     */
    annotatedContent: T;

    /**
     * The ranges of the content that are annotated.
     */
    words: WordRange[];
}

/**
 * Determines whether the given value is content that has word annotations
 * attached to it.
 * @param value The value to test.
 */
export function isAnnotatedContent(
    value: unknown
): value is AnnotatedContent<unknown> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'annotatedContent' in value
    );
}

const WHITESPACE = /\s/;

/**
 * The attributes that a word's occurrence number can be stored in.
 * The misspelled variants are common in real-world files.
 */
const OCCURRENCE_ATTRIBUTES = ['x-occurrence', 'x-occurence'];
const OCCURRENCES_ATTRIBUTES = ['x-occurrences', 'x-occurences'];

/**
 * Reads the word annotations that are attached to the given element.
 * Returns null if the element doesn't have any recognized annotations.
 * @param element The element to read the annotations from.
 */
export function readWordAnnotations(element: Element): WordAnnotations | null {
    const annotations: WordAnnotations = {};
    let hasAnnotations = false;

    const strong = element.getAttribute('strong');
    if (strong) {
        const strongs = strong
            .split(',')
            .map((s) => s.trim())
            .filter((s) => !!s);

        if (strongs.length > 0) {
            annotations.strongs = strongs;
            hasAnnotations = true;
        }
    }

    const lemma = element.getAttribute('lemma');
    if (lemma) {
        annotations.lemma = lemma;
        hasAnnotations = true;
    }

    const morph = element.getAttribute('x-morph');
    if (morph) {
        annotations.morph = morph;
        hasAnnotations = true;
    }

    const srcloc = element.getAttribute('srcloc');
    if (srcloc) {
        annotations.srcloc = srcloc;
        hasAnnotations = true;
    }

    const occurrence = parseCount(
        firstAttribute(element, OCCURRENCE_ATTRIBUTES)
    );
    if (occurrence !== null) {
        annotations.occurrence = occurrence;
        hasAnnotations = true;
    }

    const occurrences = parseCount(
        firstAttribute(element, OCCURRENCES_ATTRIBUTES)
    );
    if (occurrences !== null) {
        annotations.occurrences = occurrences;
        hasAnnotations = true;
    }

    return hasAnnotations ? annotations : null;
}

function firstAttribute(element: Element, names: string[]): string | null {
    for (let name of names) {
        const value = element.getAttribute(name);
        if (value) {
            return value;
        }
    }
    return null;
}

function parseCount(value: string | null): number | null {
    if (!value) {
        return null;
    }
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Shrinks the given range so that it doesn't include any leading or trailing
 * whitespace. Returns null if the range only contains whitespace.
 * @param text The text that the range is in.
 * @param start The index of the first character of the range.
 * @param end The index after the last character of the range.
 */
export function trimWordRange(
    text: string,
    start: number,
    end: number
): { start: number; end: number } | null {
    let s = Math.max(0, start);
    let e = Math.min(text.length, end);

    while (s < e && WHITESPACE.test(text[s])) {
        s++;
    }
    while (e > s && WHITESPACE.test(text[e - 1])) {
        e--;
    }

    return e > s ? { start: s, end: e } : null;
}

/**
 * Collapses the whitespace in the given text in the same manner that the
 * parsers normalize text (each run of whitespace becomes a single space, and the
 * result is trimmed), and returns a map from the indexes in the given text to
 * the indexes in the returned text.
 *
 * The map contains an entry for every index in the given text, plus one for the
 * index just past the end of it, so that both ends of a range can be mapped.
 * @param text The text to collapse.
 */
export function collapseWhitespaceMap(text: string): {
    text: string;
    map: number[];
} {
    const map = new Array<number>(text.length + 1);
    let collapsed = '';
    let i = 0;

    while (i < text.length) {
        if (WHITESPACE.test(text[i])) {
            // Every character of a whitespace run maps to the single space that
            // the run collapses into.
            const position = collapsed.length;
            while (i < text.length && WHITESPACE.test(text[i])) {
                map[i] = position;
                i++;
            }
            collapsed += ' ';
        } else {
            map[i] = collapsed.length;
            collapsed += text[i];
            i++;
        }
    }
    map[text.length] = collapsed.length;

    // Trimming can only remove the single space that a leading or trailing
    // whitespace run was collapsed into, so the whole map shifts by the number
    // of characters that were removed from the front.
    const trimmed = collapsed.trim();
    const offset = collapsed.length - collapsed.trimStart().length;

    for (let j = 0; j < map.length; j++) {
        map[j] = Math.min(Math.max(map[j] - offset, 0), trimmed.length);
    }

    return {
        text: trimmed,
        map,
    };
}

/**
 * Moves the words that apply to the given content item to the indexes that they
 * have after the item's text was collapsed with collapseWhitespaceMap().
 * Words that no longer cover any characters are removed.
 * @param words The words to remap.
 * @param contentIndex The index of the content item that was collapsed.
 * @param map The index map that collapseWhitespaceMap() returned.
 */
export function remapChapterWords(
    words: ChapterWord[],
    contentIndex: number,
    map: number[]
): void {
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.contentIndex !== contentIndex) {
            continue;
        }

        const start = map[Math.min(word.start, map.length - 1)];
        const end = map[Math.min(word.end, map.length - 1)];

        if (end > start) {
            word.start = start;
            word.end = end;
        } else {
            words.splice(i, 1);
            i--;
        }
    }
}

/**
 * Removes the words that apply to the given content item, and moves the words
 * that apply to later items back by one to account for the item being removed.
 * @param words The words to update.
 * @param contentIndex The index of the content item that was removed.
 */
export function removeChapterWordsForContent(
    words: ChapterWord[],
    contentIndex: number
): void {
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.contentIndex === contentIndex) {
            words.splice(i, 1);
            i--;
        } else if (word.contentIndex > contentIndex) {
            word.contentIndex--;
        }
    }
}

/**
 * Adds the given words to the chapter for the given verse number.
 * Does nothing if there are no words.
 * @param chapter The chapter to add the words to.
 * @param verseNumber The number of the verse that the words are in.
 * @param words The words to add.
 */
export function addChapterWords(
    chapter: Chapter,
    verseNumber: number,
    words: ChapterWord[]
): void {
    if (words.length === 0) {
        return;
    }

    if (!chapter.words) {
        chapter.words = {};
    }

    const key = verseNumber.toString();
    const existing = chapter.words[key];

    if (existing) {
        existing.push(...words);
    } else {
        chapter.words[key] = words;
    }
}
