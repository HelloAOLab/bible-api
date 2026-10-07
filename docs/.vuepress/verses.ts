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

/** Which verses the home page quotes. */
export const HOME_VERSES = {
    freelyGive: { book: 'MAT', chapter: 10, verse: 8 },
    stewards: { book: '1PE', chapter: 4, verse: 10 },
} as const;

export type HomeVerse = keyof typeof HOME_VERSES;

export interface VerseText {
    /** The text of the verse, without quotation marks. */
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
