
/**
 * Normalizes the given language code into a ISO 639 code.
 * @param language The language code to normalize.
 */
export function normalizeLanguage(language: string): string {
    return language;
}

/**
 * The map of translation IDs from fetch.bible to their translation ID in the API.
 */
const TRANSLATION_ID_MAP: Map<string, string> = new Map([
    ['eng_bsb', 'BSB'],
    ['arb_nav', 'ARBNAV'],
    ['eng_webp', 'ENGWEBP'],
    ['hin_irv', 'HINIRV'],
    ['hbo_mas', 'HBOMAS'],
]);

/**
 * Gets the ID of the translation.
 * @param translation The translation to get the ID for.
 */
export function getTranslationId(translationId: string): string {
    return TRANSLATION_ID_MAP.get(translationId) ?? translationId;
}

export function isEmptyOrWhitespace(str: string | null | undefined): boolean {
    return !str || /^\s*$/.test(str);
}

export function getFirstNonEmpty<T extends string>(...values: T[]): T {
    for (let value of values) {
        if (!isEmptyOrWhitespace(value)) {
            return value;
        }
    }

    throw new Error('All values are empty or whitespace!');
}

export interface VerseRef {
    book: string;
    chapter: number;
    verse: number;

    /**
     * The rest of the content of the verse.
     */
    content?: string;
}

/**
 * Parses the given verse reference.
 * Formatted like "GEN 1:1".
 * 
 * @param text The reference to parse.
 */
export function parseVerseReference(text: string): VerseRef | null {
    const match = text.match(/^\s*([A-Z]+)\s+(\d+):(\d+)/);

    if (!match) {
        return null;
    }

    const [reference, book, chapterStr, verseStr] = match;

    const chapter = parseInt(chapterStr);
    const verse = parseInt(verseStr);

    if (isNaN(chapter) || isNaN(verse)) {
        return null;
    }

    if (reference.length !== text.length) {
        return {
            book,
            chapter,
            verse,
            content: text.substring(reference.length).trim(),
        };
    }

    return {
        book,
        chapter,
        verse,
    };
}