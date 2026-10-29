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

    /**
     * The first year that the verse can be the verse of the day. Unset if the verse has always been in the list.
     */
    addedIn?: number | null;

    /**
     * The first year that the verse can no longer be the verse of the day. Unset if the verse hasn't been removed.
     */
    removedIn?: number | null;
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
     * Only pick from the verses in this category (including a holiday's category), on any day.
     * The category has fewer verses than there are days in a year, so its verses repeat sooner.
     */
    category?: string;

    /**
     * The holidays that have their own verses: the `holidays` from `/api/d/verse-of-the-day/verses.json`.
     * Without them, holiday verses are picked like any other verse.
     */
    holidays?: readonly VerseOfTheDayHoliday[] | null;
}

/**
 * Picks the verse of the day for the given date from the given list of verses.
 *
 * The pick follows a fixed convention, so every implementation picks the same verse on the same day:
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
    const holidays = options.holidays ?? [];
    const { year, month, day, dayOfYear } = getDateParts(date);
    const inUse = verses.filter((v) => isVerseOfTheDayInUse(v, year));

    let candidates: T[];
    if (options.category) {
        candidates = inUse.filter(
            (v) => !!v.categories?.includes(options.category!)
        );
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
function getDateParts(date: Date | string): {
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
