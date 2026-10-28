import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import {
    generateVerseOfTheDayDataset,
    getDayNumber,
    getResurrectionSunday,
    getVerseOfTheDayHolidayDates,
    VERSE_OF_THE_DAY_HOLIDAY_IDS,
    VERSE_OF_THE_DAY_HOLIDAY_YEARS,
    VERSE_OF_THE_DAY_HOLIDAYS,
    isVerseOfTheDayInUse,
    getVerseOfTheDay,
    hashVerseOfTheDayKey,
    VERSES_OF_THE_DAY,
    VERSE_OF_THE_DAY_CATEGORIES,
    VERSE_OF_THE_DAY_CATEGORY_DESCRIPTIONS,
    VerseOfTheDay,
} from './verse-of-the-day.js';
import { bookOrderMap } from './book-order.js';
import { generateApiForDataset, generateFilesForApi } from './api.js';
import { DatasetOutput } from './dataset.js';
import { pickVerseOfTheDay } from '../../free-use-bible-api/verseOfTheDay.js';

const HOLIDAY_IDS: readonly string[] = VERSE_OF_THE_DAY_HOLIDAY_IDS;
const isHolidayVerse = (v: VerseOfTheDay) =>
    v.categories.some((c) => HOLIDAY_IDS.includes(c));

const BSB_DIR = path.resolve(__dirname, '../../../bible/bsb');

/**
 * Reads the number of the last verse in each chapter of the BSB book with the given ID.
 */
function readLastVerseNumbers(bookId: string): Map<number, number> {
    const file = readdirSync(BSB_DIR).find((f) =>
        f.endsWith(`${bookId}BSB.usfm`)
    );
    if (!file) {
        throw new Error(`Could not find the BSB file for ${bookId}`);
    }
    const usfm = readFileSync(path.join(BSB_DIR, file), 'utf-8');
    const lastVerses = new Map<number, number>();
    let chapter = 0;
    for (let match of usfm.matchAll(/\\([cv]) (\d+)/g)) {
        const num = parseInt(match[2]);
        if (match[1] === 'c') {
            chapter = num;
            // Some BSB psalms omit the \v 1 marker, so every chapter has at least one verse.
            lastVerses.set(chapter, 1);
        } else {
            lastVerses.set(chapter, Math.max(lastVerses.get(chapter)!, num));
        }
    }
    return lastVerses;
}

function formatRef(v: VerseOfTheDay): string {
    return `${v.book} ${v.chapter}:${v.verse}${v.endVerse ? `-${v.endVerse}` : ''}`;
}

describe('VERSES_OF_THE_DAY', () => {
    it('should only use whole years for addedIn and removedIn', () => {
        for (let v of VERSES_OF_THE_DAY) {
            for (let year of [v.addedIn, v.removedIn]) {
                if (year !== undefined) {
                    expect(Number.isInteger(year)).toBe(true);
                }
            }
            if (v.addedIn !== undefined && v.removedIn !== undefined) {
                expect(v.addedIn).toBeLessThan(v.removedIn);
            }
        }
    });

    it('should have enough verses in use for a different verse every day of every year', () => {
        // The verses in use only change in the years that verses are added or removed in.
        const years = new Set([2026]);
        for (let v of VERSES_OF_THE_DAY) {
            if (v.addedIn !== undefined) years.add(v.addedIn);
            if (v.removedIn !== undefined) years.add(v.removedIn);
        }
        for (let year of years) {
            const inUse = VERSES_OF_THE_DAY.filter(
                (v) => isVerseOfTheDayInUse(v, year) && !isHolidayVerse(v)
            ).length;
            expect([year, inUse >= 366]).toEqual([year, true]);
        }
    });

    // Changing which verses are in use in a year changes that whole year's schedule.
    // These fingerprints make sure that the schedules of years that people have already seen don't change.
    // Add new verses with `addedIn` (and remove verses with `removedIn`) set to a year that hasn't started yet.
    // When a year starts, add its fingerprint here.
    it.each([[2026, 2436637312]])(
        'should not change the verse of the day schedule of %d',
        (year, fingerprint) => {
            const picks: string[] = [];
            for (let i = 0; i < 365; i++) {
                const date = new Date(Date.UTC(year, 0, 1 + i))
                    .toISOString()
                    .slice(0, 10);
                const v = getVerseOfTheDay(date)!;
                picks.push(`${v.book} ${v.chapter}:${v.verse}`);
            }
            expect(hashVerseOfTheDayKey(picks.join(','))).toBe(fingerprint);
        }
    );

    it('should only reference verses that exist in the BSB', () => {
        const books = new Map<string, Map<number, number>>();
        const missing: string[] = [];
        for (let v of VERSES_OF_THE_DAY) {
            let lastVerses = books.get(v.book);
            if (!lastVerses) {
                lastVerses = readLastVerseNumbers(v.book);
                books.set(v.book, lastVerses);
            }
            const lastVerse = lastVerses.get(v.chapter);
            if (!lastVerse || (v.endVerse ?? v.verse) > lastVerse) {
                missing.push(formatRef(v));
            }
        }
        expect(missing).toEqual([]);
    });

    it('should only use valid book IDs', () => {
        for (let v of VERSES_OF_THE_DAY) {
            expect(bookOrderMap.has(v.book)).toBe(true);
        }
    });

    it('should only contain short passages', () => {
        for (let v of VERSES_OF_THE_DAY) {
            expect(v.verse).toBeGreaterThanOrEqual(1);
            if (v.endVerse !== undefined) {
                expect(v.endVerse).toBeGreaterThan(v.verse);
                expect(v.endVerse - v.verse).toBeLessThanOrEqual(2);
            }
        }
    });

    it('should give every verse one to three distinct, known categories', () => {
        for (let v of VERSES_OF_THE_DAY) {
            expect(v.categories.length).toBeGreaterThanOrEqual(1);
            expect(v.categories.length).toBeLessThanOrEqual(3);
            expect(new Set(v.categories).size).toBe(v.categories.length);
            for (let c of v.categories) {
                expect([
                    ...VERSE_OF_THE_DAY_CATEGORIES,
                    ...VERSE_OF_THE_DAY_HOLIDAY_IDS,
                ]).toContain(c);
            }
        }
    });

    it('should only give holiday verses holiday categories', () => {
        for (let v of VERSES_OF_THE_DAY.filter(isHolidayVerse)) {
            for (let c of v.categories) {
                expect([formatRef(v), HOLIDAY_IDS.includes(c)]).toEqual([
                    formatRef(v),
                    true,
                ]);
            }
        }
    });

    it('should have at least 5 verses for every holiday', () => {
        for (let id of VERSE_OF_THE_DAY_HOLIDAY_IDS) {
            const count = VERSES_OF_THE_DAY.filter((v) =>
                (v.categories as string[]).includes(id)
            ).length;
            expect([id, count >= 5]).toEqual([id, true]);
        }
    });

    it('should have at least 8 verses in every category', () => {
        for (let c of VERSE_OF_THE_DAY_CATEGORIES) {
            const count = VERSES_OF_THE_DAY.filter((v) =>
                v.categories.includes(c)
            ).length;
            expect([c, count >= 8]).toEqual([c, true]);
        }
    });

    it('should describe every category', () => {
        expect(
            Object.keys(VERSE_OF_THE_DAY_CATEGORY_DESCRIPTIONS).sort()
        ).toEqual([...VERSE_OF_THE_DAY_CATEGORIES].sort());
    });

    it('should be sorted in canonical order without overlapping passages', () => {
        for (let i = 1; i < VERSES_OF_THE_DAY.length; i++) {
            const prev = VERSES_OF_THE_DAY[i - 1];
            const next = VERSES_OF_THE_DAY[i];
            const prevKey = [
                bookOrderMap.get(prev.book)!,
                prev.chapter,
                prev.endVerse ?? prev.verse,
            ];
            const nextKey = [
                bookOrderMap.get(next.book)!,
                next.chapter,
                next.verse,
            ];
            const isAfter =
                nextKey[0] > prevKey[0] ||
                (nextKey[0] === prevKey[0] &&
                    (nextKey[1] > prevKey[1] ||
                        (nextKey[1] === prevKey[1] &&
                            nextKey[2] > prevKey[2])));
            expect([formatRef(prev), formatRef(next), isAfter]).toEqual([
                formatRef(prev),
                formatRef(next),
                true,
            ]);
        }
    });
});

describe('getVerseOfTheDay()', () => {
    const ref = (v: VerseOfTheDay | null) =>
        v ? `${v.book} ${v.chapter}:${v.verse}` : null;

    function addDays(date: string, days: number): string {
        const d = new Date(`${date}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() + days);
        return d.toISOString().slice(0, 10);
    }

    // These pin the convention. If the list of verses changes, the verse for a day changes too.
    it('should pick the conventional verse for a date', () => {
        expect(ref(getVerseOfTheDay('2926-01-01'))).toBe('EZR 7:10');
        expect(ref(getVerseOfTheDay('2926-01-02'))).toBe('PSA 33:22');
        expect(ref(getVerseOfTheDay('2926-01-01', { seed: 'my-app' }))).toBe(
            'PRO 4:23'
        );
        expect(ref(getVerseOfTheDay('2026-12-31'))).toBe('EZK 36:26');
        expect(ref(getVerseOfTheDay('2027-01-01'))).toBe('JAS 2:17');
    });

    it('should pick the same verse for the same day', () => {
        expect(getVerseOfTheDay('2026-10-27')).toBe(
            getVerseOfTheDay('2026-10-27')
        );
        expect(getVerseOfTheDay(new Date(2026, 9, 27, 0, 0, 1))).toBe(
            getVerseOfTheDay('2026-10-27')
        );
        expect(getVerseOfTheDay(new Date(2026, 9, 27, 23, 59, 59))).toBe(
            getVerseOfTheDay('2026-10-27')
        );
    });

    it.each(['', 'my-app'])(
        'should not repeat a verse within a year (seed %j)',
        (seed) => {
            for (let year of [2024, 2025, 2100, 2400, 2926]) {
                const isLeap =
                    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
                const days = isLeap ? 366 : 365;
                const picks = new Set<string | null>();
                for (let i = 0; i < days; i++) {
                    picks.add(
                        ref(
                            getVerseOfTheDay(addDays(`${year}-01-01`, i), {
                                seed,
                            })
                        )
                    );
                }
                expect([year, picks.size]).toEqual([year, days]);
            }
        }
    );

    it('should use a different order every year', () => {
        const days = Array.from({ length: 365 }, (_, i) => i);
        const year2026 = days.map((i) =>
            getVerseOfTheDay(addDays('2026-01-01', i))
        );
        const year2027 = days.map((i) =>
            getVerseOfTheDay(addDays('2027-01-01', i))
        );
        const sameDay = days.filter((i) => year2026[i] === year2027[i]);
        // A verse can land on the same day by chance, but the orders shouldn't line up.
        expect(sameDay.length).toBeLessThan(10);
    });

    it('should pick by the day of the year', () => {
        const sorted = VERSES_OF_THE_DAY.filter((v) => !isHolidayVerse(v)).sort(
            (a, b) =>
                hashVerseOfTheDayKey(`|2026|${ref(a)}`) -
                hashVerseOfTheDayKey(`|2026|${ref(b)}`)
        );
        expect(getVerseOfTheDay('2026-01-01')).toBe(sorted[0]);
        expect(getVerseOfTheDay('2026-01-02')).toBe(sorted[1]);
        expect(getVerseOfTheDay('2026-12-31')).toBe(sorted[364]);
    });

    it('should not change earlier years when a verse is added', () => {
        const added: VerseOfTheDay = {
            book: 'NUM',
            chapter: 6,
            verse: 27,
            categories: ['hope'],
            addedIn: 2028,
        };
        const verses = [...VERSES_OF_THE_DAY, added];
        for (let i = 0; i < 365 * 2; i++) {
            const date = addDays('2026-01-01', i);
            expect(getVerseOfTheDay(date, { verses })).toBe(
                getVerseOfTheDay(date)
            );
        }
        // A year uses 365 or 366 of the verses, so the new verse doesn't appear in every year.
        const firstYearPicked = [2028, 2029, 2030, 2031, 2032].find((year) =>
            Array.from({ length: 365 }, (_, i) =>
                getVerseOfTheDay(addDays(`${year}-01-01`, i), { verses })
            ).includes(added)
        );
        expect(firstYearPicked).toBeDefined();
    });

    it('should not change earlier years when a verse is removed', () => {
        const removed = VERSES_OF_THE_DAY[10];
        const verses = VERSES_OF_THE_DAY.map((v) =>
            v === removed ? { ...v, removedIn: 2028 } : v
        );
        for (let i = 0; i < 365 * 2; i++) {
            const date = addDays('2026-01-01', i);
            expect(ref(getVerseOfTheDay(date, { verses }))).toBe(
                ref(getVerseOfTheDay(date))
            );
        }
        for (let i = 0; i < 366; i++) {
            expect(
                ref(getVerseOfTheDay(addDays('2028-01-01', i), { verses }))
            ).not.toBe(ref(removed));
        }
    });

    it('should only pick verses that are in use in the year', () => {
        const verses: VerseOfTheDay[] = [
            {
                book: 'JHN',
                chapter: 3,
                verse: 16,
                categories: ['love'],
                addedIn: 2027,
            },
            {
                book: 'ROM',
                chapter: 8,
                verse: 28,
                categories: ['hope'],
                removedIn: 2027,
            },
        ];
        expect(ref(getVerseOfTheDay('2026-06-01', { verses }))).toBe(
            'ROM 8:28'
        );
        expect(ref(getVerseOfTheDay('2027-06-01', { verses }))).toBe(
            'JHN 3:16'
        );
        expect(
            getVerseOfTheDay('2027-06-01', { verses, category: 'hope' })
        ).toBeNull();
    });

    it('should not depend on the order of the list', () => {
        const reversed = [...VERSES_OF_THE_DAY].reverse();
        for (let i = 0; i < 30; i++) {
            const date = addDays('2026-01-01', i);
            expect(getVerseOfTheDay(date, { verses: reversed })).toBe(
                getVerseOfTheDay(date)
            );
        }
    });

    it('should pick the same verses as the free-use-bible-api client', () => {
        const changed = VERSES_OF_THE_DAY.map((v, i) =>
            i % 7 === 0
                ? { ...v, addedIn: 2027 }
                : i % 11 === 0
                  ? { ...v, removedIn: 2027 }
                  : v
        );
        const holidays = getVerseOfTheDayHolidayDates();
        for (let i = 0; i < 100; i++) {
            const date = addDays('2026-01-01', i * 7);
            expect(pickVerseOfTheDay(changed, date, { holidays })).toBe(
                getVerseOfTheDay(date, { verses: changed })
            );
        }
        // Every day of a year, including the holidays.
        for (let i = 0; i < 365; i++) {
            const date = addDays('2026-01-01', i);
            expect(
                pickVerseOfTheDay(VERSES_OF_THE_DAY, date, { holidays })
            ).toBe(getVerseOfTheDay(date));
            expect(
                pickVerseOfTheDay(VERSES_OF_THE_DAY, date, {
                    seed: 'x',
                    holidays,
                })
            ).toBe(getVerseOfTheDay(date, { seed: 'x' }));
        }
    });

    it('should only pick verses from the given category', () => {
        for (let i = 0; i < 30; i++) {
            const verse = getVerseOfTheDay(addDays('2026-01-01', i), {
                category: 'peace',
            });
            expect(verse?.categories).toContain('peace');
        }
    });

    it('should work for dates before 1970 and far in the future', () => {
        expect(VERSES_OF_THE_DAY).toContain(getVerseOfTheDay('1900-01-01'));
        expect(VERSES_OF_THE_DAY).toContain(getVerseOfTheDay('9999-12-31'));
    });

    it('should reject invalid dates', () => {
        expect(() => getVerseOfTheDay('2026-1-1')).toThrow();
        expect(() => getVerseOfTheDay('2026-02-30')).toThrow();
    });

    it('should return null when there are no verses', () => {
        expect(getVerseOfTheDay(new Date(), { verses: [] })).toBeNull();
    });
});

describe('holidays', () => {
    const ref = (v: VerseOfTheDay | null) =>
        v ? `${v.book} ${v.chapter}:${v.verse}` : null;
    const versesFor = (id: string) =>
        VERSES_OF_THE_DAY.filter((v) =>
            (v.categories as string[]).includes(id)
        );

    it('should compute Resurrection Sunday in the Gregorian calendar', () => {
        const known: [number, string][] = [
            [1818, '03-22'],
            [2000, '04-23'],
            [2008, '03-23'],
            [2011, '04-24'],
            [2024, '03-31'],
            [2025, '04-20'],
            [2026, '04-05'],
            [2027, '03-28'],
            [2035, '03-25'],
            [2038, '04-25'],
            [2285, '03-22'],
        ];
        for (let [year, date] of known) {
            const { month, day } = getResurrectionSunday(year);
            expect([
                year,
                `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            ]).toEqual([year, date]);
        }
    });

    it('should precompute the dates of the holidays that move', () => {
        const dates = new Map(
            getVerseOfTheDayHolidayDates().map((h) => [h.id, h])
        );
        expect(dates.get('christmas')).toEqual({
            id: 'christmas',
            month: 12,
            day: 25,
        });
        const year2026 = (id: string) => dates.get(id)!.dates![0];
        expect(year2026('ash-wednesday')).toBe('2026-02-18');
        expect(year2026('palm-sunday')).toBe('2026-03-29');
        expect(year2026('maundy-thursday')).toBe('2026-04-02');
        expect(year2026('good-friday')).toBe('2026-04-03');
        expect(year2026('resurrection-sunday')).toBe('2026-04-05');
        expect(year2026('ascension-day')).toBe('2026-05-14');
        expect(year2026('pentecost')).toBe('2026-05-24');
        expect(year2026('advent-sunday')).toBe('2026-11-29');
        expect(dates.get('advent-sunday')!.dates![2]).toBe('2028-12-03');
        for (let h of dates.values()) {
            if (h.dates) {
                expect(h.dates).toHaveLength(
                    VERSE_OF_THE_DAY_HOLIDAY_YEARS.last -
                        VERSE_OF_THE_DAY_HOLIDAY_YEARS.first +
                        1
                );
                expect(h.dates.at(-1)!.startsWith('2125-')).toBe(true);
            }
        }
    });

    it('should never have two holidays on the same date', () => {
        const seen = new Map<string, string>();
        for (let year = 2026; year <= 2125; year++) {
            for (let h of getVerseOfTheDayHolidayDates()) {
                const dates = h.month
                    ? [
                          `${year}-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
                      ]
                    : h.dates!.filter((d) => d.startsWith(`${year}-`));
                for (let date of dates) {
                    expect([date, seen.get(date)]).toEqual([date, undefined]);
                    seen.set(date, h.id);
                }
            }
        }
    });

    it('should pick a verse for the holiday on the holiday', () => {
        expect(versesFor('christmas')).toContain(
            getVerseOfTheDay('2026-12-25')
        );
        expect(versesFor('christmas-eve')).toContain(
            getVerseOfTheDay('2026-12-24')
        );
        expect(versesFor('good-friday')).toContain(
            getVerseOfTheDay('2026-04-03')
        );
        expect(versesFor('resurrection-sunday')).toContain(
            getVerseOfTheDay('2026-04-05')
        );
        expect(versesFor('resurrection-sunday')).toContain(
            getVerseOfTheDay('2027-03-28')
        );
        expect(versesFor('all-hallows-eve')).toContain(
            getVerseOfTheDay('2026-10-31')
        );
        expect(versesFor('advent-sunday')).toContain(
            getVerseOfTheDay('2026-11-29')
        );
    });

    it("should go through all of a holiday's verses before repeating one", () => {
        const n = versesFor('christmas').length;
        const picks = Array.from({ length: n * 2 }, (_, i) =>
            ref(getVerseOfTheDay(`${2026 + i}-12-25`))
        );
        expect(new Set(picks.slice(0, n)).size).toBe(n);
        expect(picks.slice(n)).toEqual(picks.slice(0, n));
    });

    it('should not pick holiday verses on other days', () => {
        const holidayVerses = new Set(
            VERSES_OF_THE_DAY.filter((v) =>
                v.categories.some((c) =>
                    (
                        VERSE_OF_THE_DAY_HOLIDAY_IDS as readonly string[]
                    ).includes(c)
                )
            )
        );
        const holidayDates = new Set(
            getVerseOfTheDayHolidayDates().flatMap((h) =>
                h.month
                    ? [
                          `2026-${String(h.month).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
                      ]
                    : [...h.dates!]
            )
        );
        for (let i = 0; i < 365; i++) {
            const date = new Date(Date.UTC(2026, 0, 1 + i))
                .toISOString()
                .slice(0, 10);
            const verse = getVerseOfTheDay(date)!;
            expect([date, holidayVerses.has(verse)]).toEqual([
                date,
                holidayDates.has(date),
            ]);
        }
    });

    it('should not observe holidays that move outside of the precomputed years', () => {
        const { month, day } = getResurrectionSunday(2200);
        const date = `2200-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        expect(versesFor('resurrection-sunday')).not.toContain(
            getVerseOfTheDay(date)
        );
        // Holidays on the same date every year are always observed.
        expect(versesFor('christmas')).toContain(
            getVerseOfTheDay('2200-12-25')
        );
    });

    it('should pick from a category instead of the holiday when a category is given', () => {
        expect(
            getVerseOfTheDay('2026-12-25', { category: 'hope' })!.categories
        ).toContain('hope');
        expect(versesFor('christmas')).toContain(
            getVerseOfTheDay('2026-07-01', { category: 'christmas' })
        );
    });

    it('should describe every holiday', () => {
        for (let id of VERSE_OF_THE_DAY_HOLIDAY_IDS) {
            expect(VERSE_OF_THE_DAY_HOLIDAYS[id].name).toBeTruthy();
            expect(VERSE_OF_THE_DAY_HOLIDAYS[id].description).toBeTruthy();
        }
    });
});

describe('hashVerseOfTheDayKey()', () => {
    // The same values are checked by the free-use-bible-api client and the Kotlin SDK.
    it.each([
        ['', 2872998923],
        ['a', 444641715],
        ['|JHN 3:16', 3773609941],
        ['my-app|PSA 23:1', 3194902081],
        ['é|GEN 1:1', 3708505705],
    ])('should hash %j to %d', (key, hash) => {
        expect(hashVerseOfTheDayKey(key)).toBe(hash);
    });
});

describe('getDayNumber()', () => {
    it.each([
        ['1970-01-01', 0],
        ['1969-12-31', -1],
        ['2026-10-27', 20753],
        ['2926-01-01', 349172],
        ['0001-01-01', -719162],
    ])('should count the days from 1970-01-01 to %s', (date, day) => {
        expect(getDayNumber(date)).toBe(day);
    });
});

describe('generateVerseOfTheDayDataset()', () => {
    const verses: VerseOfTheDay[] = [
        { book: 'JHN', chapter: 3, verse: 17, categories: ['salvation'] },
        {
            book: 'JHN',
            chapter: 3,
            verse: 16,
            categories: ['love', 'salvation'],
        },
        {
            book: 'PRO',
            chapter: 3,
            verse: 5,
            endVerse: 6,
            categories: ['faith', 'guidance', 'wisdom'],
        },
    ];

    it('should group the verses into books and chapters in canonical order', () => {
        const dataset = generateVerseOfTheDayDataset(verses);

        expect(dataset.id).toBe('verse-of-the-day');
        expect(dataset.books.map((b) => [b.id, b.order])).toEqual([
            ['PRO', 20],
            ['JHN', 43],
        ]);
        expect(dataset.books[0].chapters).toEqual([
            {
                chapter: {
                    number: 3,
                    content: [
                        {
                            verse: 5,
                            endVerse: 6,
                            categories: ['faith', 'guidance', 'wisdom'],
                        },
                    ],
                },
            },
        ]);
        expect(dataset.books[1].chapters[0].chapter.content).toEqual([
            { verse: 16, categories: ['love', 'salvation'] },
            { verse: 17, categories: ['salvation'] },
        ]);
    });

    it('should include the years that verses were added and removed in', () => {
        const dataset = generateVerseOfTheDayDataset([
            {
                book: 'JHN',
                chapter: 3,
                verse: 16,
                categories: ['love'],
                addedIn: 2027,
                removedIn: 2030,
            },
        ]);

        expect(dataset.books[0].chapters[0].chapter.content).toEqual([
            {
                verse: 16,
                categories: ['love'],
                addedIn: 2027,
                removedIn: 2030,
            },
        ]);
        expect(dataset.categories![0].verses).toEqual([
            {
                book: 'JHN',
                chapter: 3,
                verse: 16,
                addedIn: 2027,
                removedIn: 2030,
            },
        ]);

        const api = generateApiForDataset({
            translations: [],
            commentaries: [],
            datasets: [dataset],
        });
        expect(api.datasetVerses![0].verses).toEqual([
            {
                book: 'JHN',
                chapter: 3,
                verse: 16,
                categories: ['love'],
                addedIn: 2027,
                removedIn: 2030,
            },
        ]);
    });

    it('should only include the categories that have verses', () => {
        const dataset = generateVerseOfTheDayDataset(verses);

        expect(dataset.categories!.map((c) => c.id)).toEqual([
            'faith',
            'guidance',
            'love',
            'salvation',
            'wisdom',
        ]);
        expect(dataset.categories!.find((c) => c.id === 'salvation')).toEqual({
            id: 'salvation',
            name: 'Salvation',
            description: 'Redemption, grace, and new life in Christ.',
            verses: [
                { book: 'JHN', chapter: 3, verse: 16 },
                { book: 'JHN', chapter: 3, verse: 17 },
            ],
        });
        expect(
            dataset.categories!.find((c) => c.id === 'faith')!.verses
        ).toEqual([{ book: 'PRO', chapter: 3, verse: 5, endVerse: 6 }]);
    });

    it('should include every curated verse and category by default', () => {
        const dataset = generateVerseOfTheDayDataset();

        const count = dataset.books
            .flatMap((b) => b.chapters)
            .reduce((n, c) => n + c.chapter.content.length, 0);
        expect(count).toBe(VERSES_OF_THE_DAY.length);
        expect(dataset.categories!.map((c) => c.id)).toEqual([
            ...VERSE_OF_THE_DAY_CATEGORIES,
            ...VERSE_OF_THE_DAY_HOLIDAY_IDS,
        ]);
        const christmas = dataset.categories!.find(
            (c) => c.id === 'christmas'
        )!;
        expect(christmas.name).toBe('Christmas');
        expect(christmas.holiday).toEqual({ month: 12, day: 25 });
        const goodFriday = dataset.categories!.find(
            (c) => c.id === 'good-friday'
        )!;
        expect(goodFriday.holiday!.dates).toHaveLength(100);
        expect(goodFriday.holiday!.dates![0]).toBe('2026-04-03');
    });

    it('should list the holidays and their dates in verses.json', () => {
        const api = generateApiForDataset({
            translations: [],
            commentaries: [],
            datasets: [generateVerseOfTheDayDataset()],
        });
        const holidays = api.datasetVerses![0].holidays!;
        expect(holidays.map((h) => h.id)).toEqual([
            ...VERSE_OF_THE_DAY_HOLIDAY_IDS,
        ]);
        expect(holidays.find((h) => h.id === 'christmas')).toEqual({
            id: 'christmas',
            name: 'Christmas',
            month: 12,
            day: 25,
        });
        expect(
            holidays
                .find((h) => h.id === 'resurrection-sunday')!
                .dates!.slice(0, 3)
        ).toEqual(['2026-04-05', '2027-03-28', '2028-04-16']);
        expect(
            api.datasetCategories![0].categories.find(
                (c) => c.id === 'christmas'
            )?.holiday
        ).toEqual({ month: 12, day: 25 });
    });

    describe('generateApiForDataset()', () => {
        function createDatasetOutput(): DatasetOutput {
            return {
                translations: [],
                commentaries: [],
                datasets: [generateVerseOfTheDayDataset(verses)],
            };
        }

        it('should list the dataset in available datasets with a categories link', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.availableDatasets?.datasets).toMatchObject([
                {
                    id: 'verse-of-the-day',
                    listOfBooksApiLink: '/api/d/verse-of-the-day/books.json',
                    numberOfBooks: 2,
                    totalNumberOfChapters: 2,
                    totalNumberOfVerses: 3,
                    totalNumberOfReferences: 0,
                    listOfCategoriesApiLink:
                        '/api/d/verse-of-the-day/categories.json',
                    totalNumberOfCategories: 5,
                },
            ]);
            expect(
                api.availableDatasets!.datasets[0].totalNumberOfWords
            ).toBeUndefined();
        });

        it('should generate the category list and contents', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.datasetCategories).toHaveLength(1);
            expect(api.datasetCategories![0].categories).toContainEqual({
                id: 'salvation',
                name: 'Salvation',
                description: 'Redemption, grace, and new life in Christ.',
                numberOfVerses: 2,
                apiLink: '/api/d/verse-of-the-day/categories/salvation.json',
            });

            const salvation = api.datasetCategoryContents!.find(
                (c) => c.category.id === 'salvation'
            )!;
            expect(salvation.thisCategoryApiLink).toBe(
                '/api/d/verse-of-the-day/categories/salvation.json'
            );
            expect(salvation.category.verses).toHaveLength(2);
        });

        it('should list every verse with its categories in canonical order', () => {
            const api = generateApiForDataset(createDatasetOutput());

            expect(api.availableDatasets!.datasets[0].listOfVersesApiLink).toBe(
                '/api/d/verse-of-the-day/verses.json'
            );
            expect(api.datasetVerses).toHaveLength(1);
            expect(api.datasetVerses![0].dataset.id).toBe('verse-of-the-day');
            expect(api.datasetVerses![0].verses).toEqual([
                {
                    book: 'PRO',
                    chapter: 3,
                    verse: 5,
                    endVerse: 6,
                    categories: ['faith', 'guidance', 'wisdom'],
                },
                {
                    book: 'JHN',
                    chapter: 3,
                    verse: 16,
                    categories: ['love', 'salvation'],
                },
                {
                    book: 'JHN',
                    chapter: 3,
                    verse: 17,
                    categories: ['salvation'],
                },
            ]);
        });

        it('should not list the verses of datasets without categories', () => {
            const api = generateApiForDataset({
                translations: [],
                commentaries: [],
                datasets: [
                    {
                        ...generateVerseOfTheDayDataset([]),
                        id: 'cross-refs',
                        books: [
                            {
                                id: 'GEN',
                                order: 1,
                                chapters: [
                                    {
                                        chapter: {
                                            number: 1,
                                            content: [
                                                { verse: 1, references: [] },
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            expect(api.datasetVerses).toBeUndefined();
            expect(
                api.availableDatasets!.datasets[0].listOfVersesApiLink
            ).toBeUndefined();
        });

        it('should generate files for the category and chapter endpoints', () => {
            const api = generateApiForDataset(createDatasetOutput());
            const files = generateFilesForApi(api);

            const paths = files.map((f) => f.path);
            expect(paths).toContain('/api/available_datasets.json');
            expect(paths).toContain('/api/d/verse-of-the-day/books.json');
            expect(paths).toContain('/api/d/verse-of-the-day/categories.json');
            expect(paths).toContain('/api/d/verse-of-the-day/verses.json');
            expect(paths).toContain(
                '/api/d/verse-of-the-day/categories/salvation.json'
            );
            expect(paths).toContain('/api/d/verse-of-the-day/PRO/3.json');
            expect(paths).toContain('/api/d/verse-of-the-day/JHN/3.json');

            const chapter = api.datasetBookChapters!.find(
                (c) => c.book.id === 'JHN'
            )!;
            expect(chapter.numberOfVerses).toBe(2);
            expect(chapter.previousChapterApiLink).toBe(
                '/api/d/verse-of-the-day/PRO/3.json'
            );
        });
    });
});
