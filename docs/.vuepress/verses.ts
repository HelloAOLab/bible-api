/**
 * The Bible verses quoted on the home page, for each language.
 *
 * These are never machine-translated: Scripture should be quoted from a real
 * translation. For each language, take the text from a translation in the
 * Free Use Bible API, e.g.
 *
 *     https://bible.helloao.org/api/<translationId>/<book>/<chapter>.json
 *
 * and fill in `text` (the verse), `bookName` (the translation's name for the
 * book), `translationAbbreviation` (shown next to the reference) and
 * `translationId` (the API's ID for the translation, also used for the link
 * to Seed Bible).
 *
 * Languages are keyed by the same code as their docs directory (`es`,
 * `zh-CN`), with `en` for English. A language or verse that is not listed
 * falls back to English.
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
}

export const VERSES: Record<string, Partial<Record<HomeVerse, VerseText>>> = {
    en: {
        freelyGive: {
            text: 'Freely you have received; freely give.',
            bookName: 'Matthew',
            translationAbbreviation: 'AAB',
            translationId: 'AAB',
        },
        stewards: {
            text: 'As good stewards of the manifold grace of God, each of you should use whatever gift he has received to serve one another.',
            bookName: '1 Peter',
            translationAbbreviation: 'AAB',
            translationId: 'AAB',
        },
    },
    // es: {
    //     freelyGive: {
    //         text: '…',
    //         bookName: 'Mateo',
    //         translationAbbreviation: '…',
    //         translationId: '…',
    //     },
    //     stewards: { … },
    // },
};
