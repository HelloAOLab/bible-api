import {
    fetchVerseOfTheDayList,
    getDayNumber,
    getVerseOfTheDay,
    hashVerseOfTheDayKey,
    pickVerseOfTheDay,
} from './verse-of-the-day.js';
import { pickVerseOfTheDay as clientPickVerseOfTheDay } from '../../free-use-bible-api/verseOfTheDay.js';
import { VERSES_OF_THE_DAY } from '../../helloao-tools/generation/verse-of-the-day.js';

describe('hashVerseOfTheDayKey()', () => {
    // The same values are checked by the free-use-bible-api client, @helloao/tools, and the Kotlin SDK.
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

    it('should reject invalid dates', () => {
        expect(() => getDayNumber('2926-1-1')).toThrow();
        expect(() => getDayNumber('2926-02-29')).toThrow();
    });
});

describe('pickVerseOfTheDay()', () => {
    it('should pick the same verses as the free-use-bible-api client', () => {
        for (let i = 0; i < 400; i++) {
            const date = new Date(Date.UTC(2926, 0, 1 + i))
                .toISOString()
                .slice(0, 10);
            expect(pickVerseOfTheDay(VERSES_OF_THE_DAY, date)).toBe(
                clientPickVerseOfTheDay(VERSES_OF_THE_DAY, date)
            );
            expect(
                pickVerseOfTheDay(VERSES_OF_THE_DAY, date, 'my-app', 'hope')
            ).toBe(
                clientPickVerseOfTheDay(VERSES_OF_THE_DAY, date, {
                    seed: 'my-app',
                    category: 'hope',
                })
            );
        }
    });
});

describe('getVerseOfTheDay()', () => {
    const verses = [
        { book: 'PRO', chapter: 17, verse: 22, categories: ['joy'] },
        {
            book: 'PRO',
            chapter: 3,
            verse: 5,
            endVerse: 6,
            categories: ['faith', 'guidance'],
        },
        { book: 'PSA', chapter: 107, verse: 1, categories: ['gratitude'] },
    ];

    const chapters: Record<string, any[]> = {
        'PRO/17': [
            { type: 'heading', content: ['A Joyful Heart'] },
            {
                type: 'verse',
                number: 22,
                text: 'A joyful heart is good medicine,\nbut a broken spirit dries up the bones.',
            },
        ],
        'PRO/3': [
            {
                type: 'verse',
                number: 5,
                text: 'Trust in the LORD with all your heart,',
            },
            {
                type: 'verse',
                number: 6,
                text: 'in all your ways acknowledge Him,',
            },
            { type: 'verse', number: 7, text: 'Be not wise in your own eyes;' },
        ],
        // Verse 1 is missing, like in the BSB source.
        'PSA/107': [
            {
                type: 'verse',
                number: 2,
                text: 'Let the redeemed of the LORD say so,',
            },
        ],
    };

    let fetchMock: jest.Mock;
    let apiBase: string;
    let testNumber = 0;

    beforeEach(() => {
        // A different API base for each test, so the cached verse list doesn't leak between tests.
        apiBase = `https://example.com/api${testNumber++}`;
        fetchMock = jest.fn(async (url: string) => {
            if (url === `${apiBase}/d/verse-of-the-day/verses.json`) {
                return new Response(JSON.stringify({ verses }));
            }
            const m = /\/BSB\/([A-Z0-9]+)\/(\d+)\.simple\.json$/.exec(url);
            const content = m && chapters[`${m[1]}/${m[2]}`];
            return content
                ? new Response(JSON.stringify({ chapter: { content } }))
                : new Response('Not found', { status: 404 });
        });
        global.fetch = fetchMock as any;
    });

    function dateFor(entry: (typeof verses)[number], seed = '') {
        for (let i = 0; i < 100; i++) {
            const date = new Date(Date.UTC(2926, 0, 1 + i))
                .toISOString()
                .slice(0, 10);
            if (pickVerseOfTheDay(verses, date, seed) === entry) {
                return date;
            }
        }
        throw new Error('No date picks the entry');
    }

    it('should get a single verse with its text and categories', async () => {
        const date = dateFor(verses[0]);
        const result = await getVerseOfTheDay(apiBase, { date });

        expect(result).toEqual({
            date,
            id: 'BSB:PRO:17:22',
            title: 'PRO 17:22 (BSB)',
            text: 'A joyful heart is good medicine, but a broken spirit dries up the bones.',
            categories: ['joy'],
            url: `${apiBase}/BSB/PRO/17.json`,
            seedBibleUrl: 'https://seedbible.org/BSB/PRO/17',
            metadata: {
                translation: 'BSB',
                book: 'PRO',
                chapter: 17,
                verses: '22',
            },
        });
    });

    it('should number the verses of a passage', async () => {
        const result = await getVerseOfTheDay(apiBase, {
            date: dateFor(verses[1]),
        });

        expect(result.title).toBe('PRO 3:5-6 (BSB)');
        expect(result.text).toBe(
            '5. Trust in the LORD with all your heart,\n6. in all your ways acknowledge Him,'
        );
    });

    it('should explain when the verse is missing from the translation', async () => {
        const result = await getVerseOfTheDay(apiBase, {
            date: dateFor(verses[2]),
        });

        expect(result.title).toBe('PSA 107:1 (BSB)');
        expect(result.text).toBeNull();
        expect(result.note).toContain(
            'PSA 107:1 is missing from the BSB translation'
        );
    });

    it('should only pick verses from the given category', async () => {
        const result = await getVerseOfTheDay(apiBase, {
            date: '2926-01-01',
            category: 'faith',
        });
        expect(result.title).toBe('PRO 3:5-6 (BSB)');
        expect(result.metadata.category).toBe('faith');
    });

    it('should list the categories when the category is unknown', async () => {
        await expect(
            getVerseOfTheDay(apiBase, { date: '2926-01-01', category: 'nope' })
        ).rejects.toThrow(
            'Unknown category "nope". Use one of: faith, gratitude, guidance, joy.'
        );
    });

    it('should reject an invalid date without downloading anything', async () => {
        await expect(
            getVerseOfTheDay(apiBase, { date: '2926-02-30' })
        ).rejects.toThrow('Invalid date');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should download the verse list once', async () => {
        await getVerseOfTheDay(apiBase, { date: '2926-01-01' });
        await getVerseOfTheDay(apiBase, { date: '2926-01-02' });
        const listRequests = fetchMock.mock.calls.filter(([url]) =>
            url.endsWith('/verses.json')
        );
        expect(listRequests).toHaveLength(1);
    });

    it('should try again after the verse list fails to download', async () => {
        fetchMock.mockImplementationOnce(
            async () => new Response('Not found', { status: 404 })
        );
        await expect(fetchVerseOfTheDayList(apiBase)).rejects.toThrow(
            'The verse of the day list is not available'
        );
        await expect(fetchVerseOfTheDayList(apiBase)).resolves.toEqual(verses);
    });
});
