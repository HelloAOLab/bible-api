// The verse of the day, picked from the Free Use Bible API's verse-of-the-day dataset.
// Only web-standard APIs are used here so this module runs unchanged on Node.js and Cloudflare Workers.
//
// The pick follows the same convention as the free-use-bible-api client's pickVerseOfTheDay(),
// @helloao/tools' getVerseOfTheDay() and the Kotlin SDK, so they all pick the same verse on the same day.
// It is copied here because this package is installed and deployed on its own.
// See https://bible.helloao.org/docs/reference/datasets/#picking-a-verse-of-the-day
import {
    chapterUrl,
    fetchSimpleChapterJson,
    makeResultId,
    passageTitle,
    seedBibleUrl,
} from './bible.js';

/**
 * A verse (or short passage) in the verse-of-the-day dataset.
 */
export interface VerseOfTheDayEntry {
    book: string;
    chapter: number;
    verse: number;
    endVerse?: number;
    categories: string[];
}

/**
 * The ID of the dataset that the verse of the day is picked from.
 */
export const VERSE_OF_THE_DAY_DATASET = 'verse-of-the-day';

/**
 * Picks the verse of the day for the given date from the given list of verses.
 *
 * 1. Each verse gets a sort key: the 32-bit FNV-1a hash of the UTF-8 bytes of `"{seed}|{year}|{book} {chapter}:{verse}"`
 *    (e.g. `"|2026|JHN 3:16"`), passed through the MurmurHash3 `fmix32` finalizer.
 * 2. The verses are sorted by their key (as an unsigned number), then by the key's string if two keys are equal.
 * 3. The verse at position `day mod n` is picked, where `day` is the day of the year of the date (0 for January 1st)
 *    and `n` is the number of verses.
 *
 * @param verses The verses to pick from.
 * @param date The date, as a `YYYY-MM-DD` string.
 * @param seed The seed that the order is derived from. Defaults to "" (the standard order).
 * @param category Only pick from the verses in this category.
 */
export function pickVerseOfTheDay<T extends VerseOfTheDayEntry>(
    verses: readonly T[],
    date: string,
    seed: string = '',
    category?: string
): T | null {
    const candidates = category
        ? verses.filter((v) => v.categories.includes(category))
        : verses;
    if (candidates.length <= 0) {
        return null;
    }

    const { year, dayOfYear } = getYearAndDayOfYear(date);
    const sorted = candidates
        .map((verse) => {
            const key = `${seed}|${year}|${verse.book} ${verse.chapter}:${verse.verse}`;
            return { verse, key, hash: hashVerseOfTheDayKey(key) };
        })
        .sort((a, b) =>
            a.hash !== b.hash
                ? a.hash - b.hash
                : a.key < b.key
                  ? -1
                  : a.key > b.key
                    ? 1
                    : 0
        );

    const index = dayOfYear % sorted.length;
    return sorted[index].verse;
}

/**
 * Gets the number of days from 1970-01-01 to the given date.
 * @param date A `YYYY-MM-DD` string.
 */
export function getDayNumber(date: string): number {
    const { year, month, day } = parseDate(date);
    return daysSinceEpoch(year, month, day);
}

/**
 * Gets the year of the given date and its day of the year (0 for January 1st).
 * @param date A `YYYY-MM-DD` string.
 */
export function getYearAndDayOfYear(date: string): {
    year: number;
    dayOfYear: number;
} {
    const { year, month, day } = parseDate(date);
    return {
        year,
        dayOfYear:
            daysSinceEpoch(year, month, day) - daysSinceEpoch(year, 1, 1),
    };
}

function parseDate(date: string): {
    year: number;
    month: number;
    day: number;
} {
    const match = /^(-?\d{4,})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) {
        throw new Error(`Invalid date "${date}". Use the YYYY-MM-DD format.`);
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const utc = new Date(0);
    utc.setUTCFullYear(year, month - 1, day);
    if (
        utc.getUTCFullYear() !== year ||
        utc.getUTCMonth() !== month - 1 ||
        utc.getUTCDate() !== day
    ) {
        throw new Error(`Invalid date "${date}".`);
    }
    return { year, month, day };
}

function daysSinceEpoch(year: number, month: number, day: number): number {
    const utc = new Date(0);
    utc.setUTCFullYear(year, month - 1, day);
    return Math.round(utc.getTime() / 86_400_000);
}

/**
 * Gets the sort key of the given string: its 32-bit FNV-1a hash (of the UTF-8 bytes),
 * passed through the MurmurHash3 fmix32 finalizer. Returns an unsigned 32-bit number.
 */
export function hashVerseOfTheDayKey(key: string): number {
    let hash = 0x811c9dc5;
    for (let byte of new TextEncoder().encode(key)) {
        hash ^= byte;
        hash = Math.imul(hash, 0x01000193);
    }
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
    return hash >>> 0;
}

/**
 * Gets today's date in UTC, as a `YYYY-MM-DD` string.
 */
export function todayUtc(): string {
    return new Date().toISOString().slice(0, 10);
}

// Module-level cache. On Workers this lives for the lifetime of the isolate.
const versesCache = new Map<string, Promise<VerseOfTheDayEntry[]>>();

/**
 * Fetches the verses of the verse-of-the-day dataset.
 */
export function fetchVerseOfTheDayList(
    apiBase: string
): Promise<VerseOfTheDayEntry[]> {
    let cached = versesCache.get(apiBase);
    if (!cached) {
        cached = (async () => {
            const res = await fetch(
                `${apiBase}/d/${VERSE_OF_THE_DAY_DATASET}/verses.json`
            );
            if (!res.ok) {
                throw new Error(
                    `The verse of the day list is not available (verses.json request failed: ${res.status}).`
                );
            }
            const data: any = await res.json();
            return data.verses ?? [];
        })();
        // Don't keep failed requests, so a later call can try again.
        cached.catch(() => versesCache.delete(apiBase));
        versesCache.set(apiBase, cached);
    }
    return cached;
}

/**
 * The options for {@link getVerseOfTheDay}.
 */
export interface GetVerseOfTheDayOptions {
    /** The date, as a `YYYY-MM-DD` string. Defaults to today in UTC. */
    date?: string;
    /** The API translation id to get the text from. Defaults to BSB. */
    translation?: string;
    /** The seed that the order is derived from. Defaults to "" (the standard order). */
    seed?: string;
    /** Only pick from the verses in this category. */
    category?: string;
}

/**
 * Gets the verse of the day for the given date, with its text in the given translation.
 * Throws an error with a message for the user if the date or category is invalid.
 */
export async function getVerseOfTheDay(
    apiBase: string,
    options: GetVerseOfTheDayOptions = {}
) {
    const date = options.date ?? todayUtc();
    const translation = options.translation ?? 'BSB';
    getDayNumber(date); // Validates the date before anything is downloaded.

    const verses = await fetchVerseOfTheDayList(apiBase);
    const entry = pickVerseOfTheDay(
        verses,
        date,
        options.seed ?? '',
        options.category
    );
    if (!entry) {
        const categories = [
            ...new Set(verses.flatMap((v) => v.categories)),
        ].sort();
        throw new Error(
            `Unknown category "${options.category}". Use one of: ${categories.join(', ')}.`
        );
    }

    const { book, chapter, verse, endVerse } = entry;
    const verseRange = endVerse ? `${verse}-${endVerse}` : `${verse}`;
    const chapterJson = await fetchSimpleChapterJson(
        apiBase,
        translation,
        book,
        chapter
    );

    // Join the text of each verse, keeping the order of the chapter.
    // A verse can be split into several items (e.g. around a heading).
    const texts = new Map<number, string[]>();
    for (const item of chapterJson?.chapter?.content ?? []) {
        if (
            item?.type === 'verse' &&
            item.number >= verse &&
            item.number <= (endVerse ?? verse)
        ) {
            const parts = texts.get(item.number) ?? [];
            parts.push((item.text ?? '').trim());
            texts.set(item.number, parts);
        }
    }
    const numbers = Array.from(
        { length: (endVerse ?? verse) - verse + 1 },
        (_, i) => verse + i
    );
    const missing = numbers.filter((n) => !texts.has(n));
    const text =
        missing.length > 0
            ? null
            : numbers
                  .map((n) => {
                      const t = texts.get(n)!.join(' ').replace(/\s+/g, ' ');
                      return endVerse ? `${n}. ${t}` : t;
                  })
                  .join('\n');

    return {
        date,
        id: makeResultId(translation, book, chapter, verseRange),
        title: passageTitle(translation, book, chapter, verseRange),
        text,
        ...(text === null
            ? {
                  note: `${book} ${chapter}:${missing.join(', ')} is missing from the ${translation} translation, so the text isn't available. Try another translation.`,
              }
            : {}),
        categories: entry.categories,
        url: chapterUrl(apiBase, translation, book, chapter),
        seedBibleUrl: seedBibleUrl(translation, book, chapter),
        metadata: {
            translation,
            book,
            chapter,
            verses: verseRange,
            ...(options.seed ? { seed: options.seed } : {}),
            ...(options.category ? { category: options.category } : {}),
        },
    };
}
