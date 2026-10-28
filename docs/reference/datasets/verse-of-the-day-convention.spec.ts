import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    getYearAndDayOfYear,
    hashVerseOfTheDayKey,
    pickVerseOfTheDay,
    VerseOfTheDayCandidate,
} from '../../../packages/free-use-bible-api/verseOfTheDay.js';
import { getVerseOfTheDay } from '../../../packages/helloao-tools/generation/verse-of-the-day.js';
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

    const smallList = JSON.parse(
        /### Picks From a Small List[\s\S]*?```json\n([\s\S]*?)\n```/.exec(
            page
        )![1]
    );

    it('should list the sorted keys of the worked example', () => {
        const rows = tableAfter('Sorted by their sort keys');
        const sorted = smallList
            .filter((v: any) => !(v.addedIn > 2026) && !(v.removedIn <= 2026))
            .map((v: any) => `|2026|${v.book} ${v.chapter}:${v.verse}`)
            .sort(
                (a: string, b: string) =>
                    hashVerseOfTheDayKey(a) - hashVerseOfTheDayKey(b)
            );
        expect(
            rows.map(([position, key, hash]) => [position, code(key), hash])
        ).toEqual(
            sorted.map((key: string, i: number) => [
                String(i),
                key,
                String(hashVerseOfTheDayKey(key)),
            ])
        );
    });

    it.each(tableAfter('March 15th is day 73'))(
        'should list the verse of the day for %s (seed %s, category %s)',
        (date, seed, category, expected) => {
            const options = {
                seed: code(seed),
                category: code(category) || undefined,
            };
            expect(ref(pickVerseOfTheDay(smallList, date, options))).toBe(
                expected
            );
            expect(
                ref(
                    mcpPickVerseOfTheDay(
                        smallList,
                        date,
                        options.seed,
                        options.category
                    )
                )
            ).toBe(expected);
            expect(
                ref(
                    getVerseOfTheDay(date, {
                        ...options,
                        verses: smallList,
                    } as any)
                )
            ).toBe(expected);
        }
    );

    it.each(tableAfter('### Picks From the Dataset'))(
        'should list the verse of the day from the dataset for %s',
        (date, expected) => {
            expect(ref(getVerseOfTheDay(date))).toBe(expected);
        }
    );
});
