import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import {
    generateVerseOfTheDayDataset,
    getVerseOfTheDay,
    VERSES_OF_THE_DAY,
    VERSE_OF_THE_DAY_CATEGORIES,
    VERSE_OF_THE_DAY_CATEGORY_DESCRIPTIONS,
    VerseOfTheDay,
} from './verse-of-the-day.js';
import { bookOrderMap } from './book-order.js';
import { generateApiForDataset, generateFilesForApi } from './api.js';
import { DatasetOutput } from './dataset.js';

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
    it('should have enough verses for a different verse every day of a leap year', () => {
        expect(VERSES_OF_THE_DAY.length).toBeGreaterThanOrEqual(366);
    });

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
        ]);
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
