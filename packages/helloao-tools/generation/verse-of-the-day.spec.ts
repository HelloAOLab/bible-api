import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import {
    getVerseOfTheDay,
    VERSES_OF_THE_DAY,
    VERSE_OF_THE_DAY_CATEGORIES,
    VERSE_OF_THE_DAY_CATEGORY_DESCRIPTIONS,
    VerseOfTheDay,
} from './verse-of-the-day.js';
import { bookOrderMap } from './book-order.js';

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
                expect(VERSE_OF_THE_DAY_CATEGORIES).toContain(c);
            }
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
    it('should return the same verse for the whole UTC day', () => {
        const morning = getVerseOfTheDay(new Date('2026-10-27T00:00:00Z'));
        const night = getVerseOfTheDay(new Date('2026-10-27T23:59:59Z'));
        expect(morning).not.toBeNull();
        expect(night).toBe(morning);
    });

    it('should return consecutive verses on consecutive days', () => {
        const today = getVerseOfTheDay(new Date('2026-10-27T12:00:00Z'))!;
        const tomorrow = getVerseOfTheDay(new Date('2026-10-28T12:00:00Z'))!;
        const index = VERSES_OF_THE_DAY.indexOf(today);
        expect(VERSES_OF_THE_DAY.indexOf(tomorrow)).toBe(
            (index + 1) % VERSES_OF_THE_DAY.length
        );
    });

    it('should only pick verses from the given category', () => {
        let date = new Date('2026-01-01T00:00:00Z');
        for (let i = 0; i < 30; i++) {
            const verse = getVerseOfTheDay(date, 'peace');
            expect(verse?.categories).toContain('peace');
            date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        }
    });

    it('should work for dates before 1970', () => {
        const verse = getVerseOfTheDay(new Date('1900-01-01T00:00:00Z'));
        expect(VERSES_OF_THE_DAY).toContain(verse);
    });

    it('should return null when there are no verses', () => {
        expect(getVerseOfTheDay(new Date(), undefined, [])).toBeNull();
    });
});
