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
    /** The first year that the verse can be the verse of the day. */
    addedIn?: number;
    /** The first year that the verse can no longer be the verse of the day. */
    removedIn?: number;
}

/**
 * A holiday that has its own verses of the day (from the `holidays` of `/api/d/verse-of-the-day/verses.json`).
 * It either falls on the same `month` and `day` every year, or lists its `dates`.
 */
export interface VerseOfTheDayHoliday {
    /**
     * The ID of the holiday's category. e.g. "christmas"
     */
    id: string;

    /**
     * The month of a holiday that falls on the same date every year (1 for January).
     */
    month?: number | null;

    /**
     * The day of the month of a holiday that falls on the same date every year.
     */
    day?: number | null;

    /**
     * The dates (YYYY-MM-DD) of a holiday whose date changes every year.
     */
    dates?: readonly string[] | null;
}

/**
 * The ID of the dataset that the verse of the day is picked from.
 */
export const VERSE_OF_THE_DAY_DATASET = 'verse-of-the-day';

/**
 * Picks the verse of the day for the given date from the given list of verses.
 *
 * 1. Only the verses that are in use in the year of the date are picked from: those whose `addedIn` year is
 *    unset or at most the year, and whose `removedIn` year is unset or after the year.
 * 2. If a category is given, the verses in that category are picked from by the day of the year (as in 4).
 * 3. Otherwise, if the date is a holiday (a holiday with the date's month and day, or with the date in its `dates`),
 *    the holiday's verses are picked from: sorted as in 4, but with the holiday's ID in place of the year
 *    (`"{seed}|{holiday}|{book} {chapter}:{verse}"`), at position `(year * k + i) mod n`, where `k` is the number
 *    of days the holiday is observed in the year and `i` is the number of those days before the date. A holiday
 *    goes through its verses one year (and day) at a time.
 * 4. Otherwise, the verses that aren't for a holiday are picked from. Each one gets a sort key: the 32-bit FNV-1a hash
 *    of the UTF-8 bytes of `"{seed}|{year}|{book} {chapter}:{verse}"` (e.g. `"|2026|JHN 3:16"`), passed through
 *    the MurmurHash3 `fmix32` finalizer. They are sorted by their key (as an unsigned number), then by the key's
 *    string if two keys are equal, and the verse at position `day mod n` is picked, where `day` is the day of the
 *    year of the date (0 for January 1st) and `n` is the number of verses.
 *
 * See https://bible.helloao.org/docs/reference/datasets/verse-of-the-day-convention.html for the full convention.
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
    category?: string,
    holidays: readonly VerseOfTheDayHoliday[] = []
): T | null {
    const { year, month, day, dayOfYear } = getDateParts(date);
    const inUse = verses.filter((v) => isVerseOfTheDayInUse(v, year));

    let candidates: T[];
    if (category) {
        candidates = inUse.filter((v) => !!v.categories?.includes(category!));
    } else {
        const holiday = findHoliday(holidays, year, month, day);
        if (holiday) {
            const holidayVerses = inUse.filter(
                (v) => !!v.categories?.includes(holiday.id)
            );
            if (holidayVerses.length > 0) {
                const sorted = sortByKey(
                    holidayVerses,
                    `${seed}|${holiday.id}`
                );
                const position = getHolidayPosition(holiday, year, month, day);
                return sorted[mod(position, sorted.length)];
            }
        }
        const holidayIds = new Set(holidays.map((h) => h.id));
        candidates = inUse.filter(
            (v) => !v.categories?.some((c) => holidayIds.has(c))
        );
    }
    if (candidates.length <= 0) {
        return null;
    }

    const sorted = sortByKey(candidates, `${seed}|${year}`);
    return sorted[dayOfYear % sorted.length];
}

/**
 * Determines whether the given verse can be the verse of the day in the given year:
 * its `addedIn` year is unset or at most the year, and its `removedIn` year is unset or after the year.
 */
export function isVerseOfTheDayInUse(
    verse: { addedIn?: number | null; removedIn?: number | null },
    year: number
): boolean {
    return (
        (verse.addedIn == null || verse.addedIn <= year) &&
        (verse.removedIn == null || year < verse.removedIn)
    );
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

/**
 * Gets the position of the given date in the holiday's verses: `year * k + i`, where `k` is the number of days
 * that the holiday is observed in the year and `i` is the number of those days that come before the date.
 * For a holiday that is observed on one day a year, this is just the year.
 */
function getHolidayPosition(
    holiday: VerseOfTheDayHoliday,
    year: number,
    month: number,
    day: number
): number {
    if (!holiday.dates) {
        return year;
    }
    const date = formatDate(year, month, day);
    const datesInYear = holiday.dates.filter((d) =>
        d.startsWith(date.slice(0, -5))
    );
    return (
        year * datesInYear.length + datesInYear.filter((d) => d < date).length
    );
}

function formatDate(year: number, month: number, day: number): string {
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Finds the first holiday that falls on the given date.
 */
function findHoliday<H extends VerseOfTheDayHoliday>(
    holidays: readonly H[],
    year: number,
    month: number,
    day: number
): H | undefined {
    const date = formatDate(year, month, day);
    return holidays.find(
        (h) => (h.month === month && h.day === day) || !!h.dates?.includes(date)
    );
}

/**
 * Sorts the given verses by the hashes of their keys, `"{prefix}|{book} {chapter}:{verse}"`.
 */
function sortByKey<T extends { book: string; chapter: number; verse: number }>(
    verses: readonly T[],
    prefix: string
): T[] {
    return verses
        .map((verse) => {
            const key = `${prefix}|${verse.book} ${verse.chapter}:${verse.verse}`;
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
        )
        .map((x) => x.verse);
}

function mod(value: number, n: number): number {
    return ((value % n) + n) % n;
}

/**
 * Gets the year, month, day, and day of the year (0 for January 1st) of the given date.
 */
function getDateParts(date: string): {
    year: number;
    month: number;
    day: number;
    dayOfYear: number;
} {
    const { year, month, day } = parseDate(date);
    return {
        year,
        month,
        day,
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
/**
 * The verses and holidays of the verse-of-the-day dataset.
 */
export interface VerseOfTheDayList {
    verses: VerseOfTheDayEntry[];
    holidays: (VerseOfTheDayHoliday & { name?: string })[];
}

const versesCache = new Map<string, Promise<VerseOfTheDayList>>();

/**
 * Fetches the verses and holidays of the verse-of-the-day dataset.
 */
export function fetchVerseOfTheDayList(
    apiBase: string
): Promise<VerseOfTheDayList> {
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
            return { verses: data.verses ?? [], holidays: data.holidays ?? [] };
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

    const { verses, holidays } = await fetchVerseOfTheDayList(apiBase);
    const entry = pickVerseOfTheDay(
        verses,
        date,
        options.seed ?? '',
        options.category,
        holidays
    );
    if (!entry) {
        const categories = [
            ...new Set(verses.flatMap((v) => v.categories)),
        ].sort();
        throw new Error(
            `Unknown category "${options.category}". Use one of: ${categories.join(', ')}.`
        );
    }

    // Holiday verses are only picked on their holiday (or when their category is asked for).
    const holiday = holidays.find((h) => entry.categories.includes(h.id));
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
        ...(holiday ? { holiday: holiday.name ?? holiday.id } : {}),
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
