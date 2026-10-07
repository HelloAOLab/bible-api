// Runtime-agnostic helpers for talking to the Free Use Bible API.
// Only web-standard APIs (fetch, etc.) are used here so this module runs
// unchanged on Node.js and Cloudflare Workers.

export const DEFAULT_BIBLE_API_BASE = 'https://bible.helloao.org/api';

// Map user-friendly mentions to API translation IDs
const TRANSLATION_ALIASES: Record<string, string> = {
    BSB: 'BSB',
    WEB: 'ENGWEBP',
    ENGWEBP: 'ENGWEBP',
    WLC: 'heb_wlc',
    HEB_WLC: 'heb_wlc',
    HEBREW: 'heb_wlc',
    SBL: 'grc_sbl',
    GRC_SBL: 'grc_sbl',
    GREEK: 'grc_sbl',
};

// Very simple reference parser:
// Matches: "Genesis 1", "Genesis 1:1-3", "Gen 1:1", "JHN 3:16", "1 John 1:1", etc.
const REF_RE =
    /(?<book>(?:[1-3]\s*)?[A-Za-z]+)\s+(?<chapter>\d+)(?::(?<verses>\d+(?:-\d+)?))?/i;

function norm(s: string): string {
    return s.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Module-level cache. On Workers this lives for the lifetime of the isolate.
const booksCache = new Map<string, Record<string, string>>();

/**
 * Build a map from various book name forms -> 3-letter book id (GEN, EXO, JHN, etc.).
 * Uses the API's books.json endpoint.
 */
async function getBooksMap(
    apiBase: string,
    translation: string
): Promise<Record<string, string>> {
    const cacheKey = `${apiBase}|${translation}`;
    const cached = booksCache.get(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${apiBase}/${translation}/books.json`);
    if (!res.ok) throw new Error(`books.json request failed: ${res.status}`);
    const data: any = await res.json();

    const m: Record<string, string> = {};
    for (const b of data.books ?? []) {
        const bookId = b.id;
        if (!bookId) continue;
        for (const key of [b.id, b.name, b.commonName, b.title]) {
            if (key) m[norm(key)] = bookId;
        }
    }

    booksCache.set(cacheKey, m);
    return m;
}

export interface TranslationSummary {
    id: string;
    name: string;
    englishName: string;
    shortName?: string;
    language: string;
    languageName?: string;
    languageEnglishName?: string;
    textDirection: string;
    numberOfBooks: number;
}

const translationsCache = new Map<string, TranslationSummary[]>();

/**
 * Fetches the list of translations from the API's available_translations.json endpoint.
 */
export async function getAvailableTranslations(
    apiBase: string
): Promise<TranslationSummary[]> {
    const cached = translationsCache.get(apiBase);
    if (cached) return cached;

    const res = await fetch(`${apiBase}/available_translations.json`);
    if (!res.ok) {
        throw new Error(
            `available_translations.json request failed: ${res.status}`
        );
    }
    const data: any = await res.json();

    const translations: TranslationSummary[] = (data.translations ?? []).map(
        (t: any) => ({
            id: t.id,
            name: t.name,
            englishName: t.englishName,
            shortName: t.shortName,
            language: t.language,
            languageName: t.languageName,
            languageEnglishName: t.languageEnglishName,
            textDirection: t.textDirection,
            numberOfBooks: t.numberOfBooks,
        })
    );

    translationsCache.set(apiBase, translations);
    return translations;
}

function includesIgnoreCase(
    values: (string | undefined)[],
    search: string
): boolean {
    const s = search.toLowerCase();
    return values.some((v) => !!v && v.toLowerCase().includes(s));
}

/**
 * Filters translations by language and/or name.
 *
 * - `language` matches the ISO 639 language code exactly, or any part of the
 *   language's native or English name (e.g. "spa", "Spanish", "Español").
 * - `name` matches any part of the translation's id, name, English name, or short name.
 */
export function filterTranslations(
    translations: TranslationSummary[],
    filter: { language?: string; name?: string }
): TranslationSummary[] {
    const language = filter.language?.trim();
    const name = filter.name?.trim();
    return translations.filter((t) => {
        if (
            language &&
            t.language?.toLowerCase() !== language.toLowerCase() &&
            !includesIgnoreCase(
                [t.languageName, t.languageEnglishName],
                language
            )
        ) {
            return false;
        }
        if (
            name &&
            !includesIgnoreCase(
                [t.id, t.name, t.englishName, t.shortName],
                name
            )
        ) {
            return false;
        }
        return true;
    });
}

function chooseTranslation(query: string): string {
    const uq = query.toUpperCase();
    for (const [alias, tid] of Object.entries(TRANSLATION_ALIASES)) {
        if (uq.includes(alias)) return tid;
    }
    // Default for unspecified requests
    return 'BSB';
}

export type Ref = [string, string, number, string | null];

export function makeResultId(
    translation: string,
    book: string,
    chapter: number,
    verses: string | null
): string {
    // Keep it simple and parseable
    return `${translation}:${book}:${chapter}:${verses ?? ''}`;
}

export function parseResultId(resultId: string): Ref {
    const parts = [...resultId.split(/:/, 4), '', '', '', ''].slice(0, 4);
    const [t, b, c, v] = parts;
    return [t, b, parseInt(c, 10), v || null];
}

export function chapterUrl(
    apiBase: string,
    translation: string,
    book: string,
    chapter: number
): string {
    return `${apiBase}/${translation}/${book}/${chapter}.json`;
}

export function passageTitle(
    translation: string,
    book: string,
    chapter: number,
    verses: string | null
): string {
    return `${book} ${chapter}${verses ? ':' + verses : ''} (${translation})`;
}

export async function parseQueryToRef(
    apiBase: string,
    query: string
): Promise<Ref | null> {
    const m = REF_RE.exec(query);
    if (!m || !m.groups) return null;

    const translation = chooseTranslation(query);
    const bookRaw = m.groups.book.trim();
    const chapter = parseInt(m.groups.chapter, 10);
    const verses = m.groups.verses ?? null;

    // If user already provided a 3-letter ID (GEN/JHN/etc.), accept it.
    if (/^[A-Za-z]{3}$/.test(bookRaw)) {
        return [translation, bookRaw.toUpperCase(), chapter, verses];
    }

    // Otherwise map from book name -> id using API book metadata.
    // Using BSB book list is generally fine because IDs are standard across translations.
    const booksMap = await getBooksMap(apiBase, 'BSB');
    const bookId = booksMap[norm(bookRaw)];
    if (!bookId) return null;

    return [translation, bookId, chapter, verses];
}

export function simpleChapterUrl(
    apiBase: string,
    translation: string,
    book: string,
    chapter: number
): string {
    return `${apiBase}/${translation}/${book}/${chapter}.simple.json`;
}

/**
 * Fetches a chapter in the simplified format, where each verse's content is
 * already flattened into a single `text` string.
 */
export async function fetchSimpleChapterJson(
    apiBase: string,
    translation: string,
    book: string,
    chapter: number
): Promise<any> {
    const res = await fetch(
        simpleChapterUrl(apiBase, translation, book, chapter)
    );
    if (!res.ok) throw new Error(`chapter request failed: ${res.status}`);
    return res.json();
}

export function extractVerses(
    simpleChapterJson: any,
    verseRange: string | null
): string {
    const content: any[] = simpleChapterJson?.chapter?.content ?? [];
    let start: number | null = null;
    let end: number | null = null;
    if (verseRange) {
        if (verseRange.includes('-')) {
            const [a, b] = verseRange.split('-', 2);
            start = parseInt(a, 10);
            end = parseInt(b, 10);
        } else {
            start = end = parseInt(verseRange, 10);
        }
    }

    const lines: string[] = [];
    for (const item of content) {
        if (!item || typeof item !== 'object') continue;
        if (item.type !== 'verse') continue;
        const num = item.number;
        if (typeof num !== 'number' || !Number.isInteger(num)) continue;
        if (start !== null && (num < start || num > (end as number))) continue;

        lines.push(`${num}. ${(item.text ?? '').trim()}`);
    }

    return lines.join('\n').trim();
}
