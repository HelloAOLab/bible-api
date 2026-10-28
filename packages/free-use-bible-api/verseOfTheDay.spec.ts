import {
    getDayNumber,
    hashVerseOfTheDayKey,
    pickVerseOfTheDay,
    VerseOfTheDayCandidate,
} from './verseOfTheDay.js';

// 400 different verses: more than there are days in a year.
const verses: VerseOfTheDayCandidate[] = Array.from(
    { length: 400 },
    (_, i) => ({
        book: 'PSA',
        chapter: Math.floor(i / 10) + 1,
        verse: (i % 10) + 1,
        categories: i % 2 === 0 ? ['hope'] : ['peace'],
    })
);

const ref = (v: VerseOfTheDayCandidate | null) =>
    v ? `${v.book} ${v.chapter}:${v.verse}` : null;

function addDays(date: string, days: number): string {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

describe('hashVerseOfTheDayKey()', () => {
    // The same values are checked by @helloao/tools and the Kotlin SDK.
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

    it('should use the local calendar date of a Date', () => {
        expect(getDayNumber(new Date(2926, 0, 1, 0, 0, 1))).toBe(349172);
        expect(getDayNumber(new Date(2926, 0, 1, 23, 59, 59))).toBe(349172);
    });

    it('should reject invalid dates', () => {
        expect(() => getDayNumber('2926-1-1')).toThrow();
        expect(() => getDayNumber('2926-02-29')).toThrow();
        expect(() => getDayNumber('not a date')).toThrow();
    });
});

describe('pickVerseOfTheDay()', () => {
    it('should pick the same verse for the same day', () => {
        expect(pickVerseOfTheDay(verses, '2926-01-01')).toBe(
            pickVerseOfTheDay(verses, '2926-01-01')
        );
        expect(pickVerseOfTheDay(verses, new Date(2926, 0, 1, 18))).toBe(
            pickVerseOfTheDay(verses, '2926-01-01')
        );
    });

    it('should pick the verse at the day of the year in the order of the hashes for that year', () => {
        const order = (year: number) =>
            [...verses].sort(
                (a, b) =>
                    hashVerseOfTheDayKey(`|${year}|${ref(a)}`) -
                    hashVerseOfTheDayKey(`|${year}|${ref(b)}`)
            );
        expect(pickVerseOfTheDay(verses, '2926-01-01')).toBe(order(2926)[0]);
        expect(pickVerseOfTheDay(verses, '2926-01-02')).toBe(order(2926)[1]);
        expect(pickVerseOfTheDay(verses, '2926-12-31')).toBe(order(2926)[364]);
        expect(pickVerseOfTheDay(verses, '2924-12-31')).toBe(order(2924)[365]);
        expect(pickVerseOfTheDay(verses, '1969-12-31')).toBe(order(1969)[364]);
    });

    it.each(['', 'my-app'])(
        'should not repeat a verse within a calendar year (seed %j)',
        (seed) => {
            for (let year of [2924, 2925, 2100, 2400]) {
                const isLeap =
                    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
                const days = isLeap ? 366 : 365;
                const picks = new Set<string | null>();
                for (let i = 0; i < days; i++) {
                    picks.add(
                        ref(
                            pickVerseOfTheDay(
                                verses,
                                addDays(`${year}-01-01`, i),
                                { seed }
                            )
                        )
                    );
                }
                expect([year, picks.size]).toEqual([year, days]);
            }
        }
    );

    it('should use a different order every year', () => {
        const days = Array.from({ length: 365 }, (_, i) => i);
        const first = days.map((i) =>
            pickVerseOfTheDay(verses, addDays('2925-01-01', i))
        );
        const second = days.map((i) =>
            pickVerseOfTheDay(verses, addDays('2926-01-01', i))
        );
        expect(days.filter((i) => first[i] === second[i]).length).toBeLessThan(
            10
        );
    });

    it('should use a different order for a different seed', () => {
        const days = Array.from({ length: 30 }, (_, i) =>
            addDays('2926-01-01', i)
        );
        const standard = days.map((d) => ref(pickVerseOfTheDay(verses, d)));
        const seeded = days.map((d) =>
            ref(pickVerseOfTheDay(verses, d, { seed: 'my-app' }))
        );
        expect(seeded).not.toEqual(standard);
    });

    it('should not depend on the order of the list', () => {
        const reversed = [...verses].reverse();
        for (let i = 0; i < 30; i++) {
            const date = addDays('2926-01-01', i);
            expect(pickVerseOfTheDay(reversed, date)).toBe(
                pickVerseOfTheDay(verses, date)
            );
        }
    });

    it('should only pick verses from the given category', () => {
        for (let i = 0; i < 30; i++) {
            const verse = pickVerseOfTheDay(verses, addDays('2926-01-01', i), {
                category: 'hope',
            });
            expect(verse?.categories).toContain('hope');
        }
    });

    it('should return null when there are no verses to pick from', () => {
        expect(pickVerseOfTheDay([], '2926-01-01')).toBeNull();
        expect(
            pickVerseOfTheDay(verses, '2926-01-01', { category: 'joy' })
        ).toBeNull();
    });
});
