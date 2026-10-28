/**
 * A verse (or short passage) that can be picked as the verse of the day.
 */
export interface VerseOfTheDayCandidate {
    /**
     * The USFM ID of the book. e.g. "JHN"
     */
    book: string;

    /**
     * The chapter number.
     */
    chapter: number;

    /**
     * The verse number (the first verse of the passage).
     */
    verse: number;

    /**
     * The categories that the verse belongs to.
     */
    categories?: string[];
}

/**
 * The options for picking the verse of the day.
 */
export interface PickVerseOfTheDayOptions {
    /**
     * The seed that the order of the verses is derived from.
     * Different seeds give different (but equally valid) orders, so apps that want their own
     * verse of the day can pick a seed of their own. Defaults to "" (the standard order).
     */
    seed?: string;

    /**
     * Only pick from the verses in this category.
     * The category has fewer verses than there are days in a year, so its verses repeat sooner.
     */
    category?: string;
}

/**
 * Picks the verse of the day for the given date from the given list of verses.
 *
 * The pick follows a fixed convention, so every implementation picks the same verse on the same day:
 *
 * 1. Each verse gets a sort key: the 32-bit FNV-1a hash of the UTF-8 bytes of `"{seed}|{year}|{book} {chapter}:{verse}"`
 *    (e.g. `"|2026|JHN 3:16"`), passed through the MurmurHash3 `fmix32` finalizer.
 * 2. The verses are sorted by their key (as an unsigned number), then by the key's string if two keys are equal.
 * 3. The verse at position `day mod n` is picked, where `day` is the day of the year of the date (0 for January 1st)
 *    and `n` is the number of verses.
 *
 * Each year has its own order, so with 366 or more verses a verse never repeats within a calendar year
 * (but can appear on December 31st and again on January 1st), and the order isn't repeated from one year to the next.
 * The order only depends on each verse's own reference, so it doesn't depend on the order of the list.
 *
 * @param verses The verses to pick from. For example, the `verses` from `/api/d/verse-of-the-day/verses.json`.
 * @param date The date to pick the verse for: a `YYYY-MM-DD` string, or a `Date` (its local calendar date is used). Defaults to today.
 * @param options The options.
 * @returns The verse of the day, or null if there are no verses to pick from.
 */
export function pickVerseOfTheDay<T extends VerseOfTheDayCandidate>(
    verses: readonly T[],
    date: Date | string = new Date(),
    options: PickVerseOfTheDayOptions = {}
): T | null {
    const seed = options.seed ?? '';
    const candidates = options.category
        ? verses.filter((v) => v.categories?.includes(options.category!))
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
 * @param date A `YYYY-MM-DD` string, or a `Date` (its local calendar date is used).
 */
export function getDayNumber(date: Date | string): number {
    const { year, month, day } = parseDate(date);
    return daysSinceEpoch(year, month, day);
}

/**
 * Gets the year of the given date and its day of the year (0 for January 1st).
 * @param date A `YYYY-MM-DD` string, or a `Date` (its local calendar date is used).
 */
export function getYearAndDayOfYear(date: Date | string): {
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

function parseDate(date: Date | string): {
    year: number;
    month: number;
    day: number;
} {
    if (typeof date !== 'string') {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
        };
    }
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
