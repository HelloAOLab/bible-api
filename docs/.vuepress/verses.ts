/**
 * The Bible verses quoted on the home page.
 *
 * These are never machine-translated: Scripture is quoted from a real
 * translation in the Free Use Bible API. The English verses are in
 * `verses.json` next to this file, and each translated language's in
 * `docs/<language>/verses.json`. A language or verse that has none falls back
 * to English.
 *
 * `pnpm fill:docs-verses` fills in missing verses from the API, choosing a
 * translation for each language the way the Seed Bible app does (see
 * tools/fill-docs-verses.ts). Entries already in a file are left alone, so
 * they can be edited by hand.
 */

/** A verse, or with `endVerse` a passage from `verse` through `endVerse`. */
export interface VerseRef {
    book: string;
    chapter: number;
    verse: number;
    endVerse?: number;
}

/** Which verses the home page quotes. */
export const HOME_VERSES = {
    freelyGive: { book: 'MAT', chapter: 10, verse: 8 },
    charge: { book: '1TH', chapter: 5, verse: 27 },
    hinder: { book: '1CO', chapter: 9, verse: 12 },
    glory: { book: 'PSA', chapter: 115, verse: 1 },
    worry: { book: 'MAT', chapter: 6, verse: 25, endVerse: 34 },
} as const satisfies Record<string, VerseRef>;

export type HomeVerse = keyof typeof HOME_VERSES;

export interface VerseText {
    /**
     * The text of the verse, without quotation marks. `**…**` marks words to
     * emphasize, for text edited by hand.
     */
    text: string;
    /** The translation's name for the book, e.g. "Matthew". */
    bookName: string;
    /** The translation's short name, e.g. "AAB". */
    translationAbbreviation: string;
    /** The translation's ID in the Free Use Bible API, e.g. "AAB". */
    translationId: string;
    /**
     * The language of the text, when it is not the language of the page it
     * is shown on (a language with no Bible translation of its own can quote
     * one in a related language).
     */
    language?: string;
}

/** The verses for one language. */
export type Verses = Partial<Record<HomeVerse, VerseText>>;
