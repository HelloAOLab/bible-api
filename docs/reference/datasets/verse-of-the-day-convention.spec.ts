import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    getYearAndDayOfYear,
    hashVerseOfTheDayKey,
    pickVerseOfTheDay,
    VerseOfTheDayCandidate,
} from '../../../packages/free-use-bible-api/verseOfTheDay.js';
import {
    getVerseOfTheDay,
    VERSE_OF_THE_DAY_HOLIDAY_IDS,
    VERSE_OF_THE_DAY_HOLIDAYS,
} from '../../../packages/helloao-tools/generation/verse-of-the-day.js';
import { pickVerseOfTheDay as mcpPickVerseOfTheDay } from '../../../packages/seed-bible-mcp/src/verse-of-the-day.js';

// Checks the test values on the Verse of the Day Convention page against the implementations,
// so that the page and the code can't drift apart.
const page = readFileSync(
    path.join(__dirname, 'verse-of-the-day-convention.md'),
    'utf8'
);

/**
 * Gets the rows of the first table after the given heading, as arrays of cell texts.
 */
function tableAfter(heading: string): string[][] {
    const start = page.indexOf(heading);
    expect(start).toBeGreaterThanOrEqual(0);
    const lines = page.slice(start).split('\n');
    const first = lines.findIndex((line) => line.startsWith('|'));
    const rows: string[][] = [];
    for (let line of lines.slice(first + 2)) {
        if (!line.startsWith('|')) {
            break;
        }
        rows.push(
            line
                .slice(1, -1)
                .split(/(?<!\\)\|/)
                .map((cell) => cell.trim().replace(/\\\|/g, '|'))
        );
    }
    return rows;
}

const code = (cell: string) => cell.replace(/^`|`$/g, '');

const ref = (v: (VerseOfTheDayCandidate & { endVerse?: number }) | null) =>
    v
        ? `${v.book} ${v.chapter}:${v.verse}${v.endVerse ? `-${v.endVerse}` : ''}`
        : 'No verse of the day';

describe('Verse of the Day Convention page', () => {
    it.each(tableAfter('### Hashes'))(
        'should list the sort key of %s',
        (key, hash, hex) => {
            const value = hashVerseOfTheDayKey(JSON.parse(code(key)));
            expect(String(value)).toBe(hash);
            expect(`0x${value.toString(16).padStart(8, '0')}`).toBe(code(hex));
        }
    );

    it.each(tableAfter('### Days of the Year'))(
        'should list the day of the year of %s',
        (date, year, day) => {
            expect(getYearAndDayOfYear(date)).toEqual({
                year: Number(year),
                dayOfYear: Number(day),
            });
        }
    );

    const [smallList, smallHolidays] = [
        ...page
            .slice(page.indexOf('### Picks From a Small List'))
            .matchAll(/```json\n([\s\S]*?)\n```/g),
    ]
        .slice(0, 2)
        .map((m) => JSON.parse(m[1]));
    const holidayIds = smallHolidays.map((h: any) => h.id);

    const sortedKeys = (verses: any[], prefix: string) =>
        verses
            .map((v) => `${prefix}|${v.book} ${v.chapter}:${v.verse}`)
            .sort((a, b) => hashVerseOfTheDayKey(a) - hashVerseOfTheDayKey(b));
    const keyRows = (keys: string[]) =>
        keys.map((key, i) => [
            String(i),
            key,
            String(hashVerseOfTheDayKey(key)),
        ]);
    const inUse = (year: number) =>
        smallList.filter(
            (v: any) => !(v.addedIn > year) && !(v.removedIn <= year)
        );

    it('should list the sorted keys of the worked example', () => {
        const rows = tableAfter('Sorted by their sort keys');
        const ordinary = inUse(2026).filter(
            (v: any) =>
                !v.categories.some((c: string) => holidayIds.includes(c))
        );
        expect(
            rows.map(([position, key, hash]) => [position, code(key), hash])
        ).toEqual(keyRows(sortedKeys(ordinary, '|2026')));
    });

    it('should list the sorted keys of the holiday example', () => {
        const rows = tableAfter('In 2027 there are three');
        const christmas = inUse(2027).filter((v: any) =>
            v.categories.includes('christmas')
        );
        expect(
            rows.map(([position, key, hash]) => [position, code(key), hash])
        ).toEqual(keyRows(sortedKeys(christmas, '|christmas')));
    });

    it('should list the sorted keys of the holiday that lasts several days', () => {
        const rows = tableAfter('Its four verses, sorted');
        const post = inUse(2026).filter((v: any) =>
            v.categories.includes('post-resurrection-sunday')
        );
        expect(
            rows.map(([position, key, hash]) => [position, code(key), hash])
        ).toEqual(keyRows(sortedKeys(post, '|post-resurrection-sunday')));
    });

    it.each(tableAfter('the next verse is Romans 6:9'))(
        'should list the verse of the day for %s (seed %s, category %s)',
        (date, seed, category, expected) => {
            const options = {
                seed: code(seed),
                category: code(category) || undefined,
            };
            expect(
                ref(
                    pickVerseOfTheDay(smallList, date, {
                        ...options,
                        holidays: smallHolidays,
                    })
                )
            ).toBe(expected);
            expect(
                ref(
                    mcpPickVerseOfTheDay(
                        smallList,
                        date,
                        options.seed,
                        options.category,
                        smallHolidays
                    )
                )
            ).toBe(expected);
            expect(
                ref(
                    getVerseOfTheDay(date, {
                        ...options,
                        verses: smallList,
                        holidays: smallHolidays,
                    } as any)
                )
            ).toBe(expected);
        }
    );

    it.each(tableAfter('### Picks From the Dataset'))(
        'should list the verse of the day from the dataset for %s',
        (date, holiday, expected) => {
            const verse = getVerseOfTheDay(date)!;
            expect(ref(verse)).toBe(expected);
            const holidayName = VERSE_OF_THE_DAY_HOLIDAY_IDS.filter((id) =>
                (verse.categories as string[]).includes(id)
            ).map((id) => VERSE_OF_THE_DAY_HOLIDAYS[id].name);
            expect(holidayName).toEqual(holiday ? [holiday] : []);
        }
    );
});
