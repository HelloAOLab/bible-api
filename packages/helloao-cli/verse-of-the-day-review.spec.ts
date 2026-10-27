import { DOMParser, Element, Node } from 'linkedom';
import { generateDataset } from '@helloao/tools/generation/dataset.js';
import {
    createReviewRows,
    formatReviewRows,
    getVerseTexts,
    VerseOfTheDayReviewRow,
    wrapText,
} from './verse-of-the-day-review.js';

describe('getVerseTexts()', () => {
    it('should get the plain text of every verse without footnotes', () => {
        globalThis.DOMParser = DOMParser as any;
        globalThis.Element = Element as any;
        globalThis.Node = Node as any;

        const output = generateDataset(
            [
                {
                    fileType: 'usfm',
                    name: 'pro.usfm',
                    content:
                        '\\id PRO\n\\c 3\n\\s1 Trust in the LORD\n\\q1\n\\v 5 Trust in the LORD with all your heart,\n\\q2 and lean not on your own understanding;\\f + \\fr 3:5 \\ft A note\\f*\n\\q1\n\\v 6 in all your ways acknowledge Him,\n\\q2 and He will make your paths straight.',
                    metadata: {
                        id: 'test',
                        name: 'Test',
                        englishName: 'Test',
                        shortName: 'TEST',
                        language: 'eng',
                        direction: 'ltr',
                        website: '',
                        licenseUrl: '',
                    },
                },
            ],
            new DOMParser() as any
        );

        const texts = getVerseTexts(output);

        expect(texts.get('PRO 3:5')).toBe(
            'Trust in the LORD with all your heart, and lean not on your own understanding;'
        );
        expect(texts.get('PRO 3:6')).toBe(
            'in all your ways acknowledge Him, and He will make your paths straight.'
        );
    });
});

describe('createReviewRows()', () => {
    const texts = new Map([
        ['PRO 3:5', 'Trust in the LORD with all your heart,'],
        ['PRO 3:6', 'in all your ways acknowledge Him,'],
        ['JHN 3:16', 'For God so loved the world'],
    ]);

    it('should join the verses of a passage and use English book names', () => {
        const rows = createReviewRows(
            [
                {
                    book: 'PRO',
                    chapter: 3,
                    verse: 5,
                    endVerse: 6,
                    categories: ['faith', 'guidance'],
                },
                { book: 'JHN', chapter: 3, verse: 16, categories: ['love'] },
            ],
            texts
        );

        expect(rows).toEqual([
            {
                number: 1,
                reference: 'Proverbs 3:5-6',
                categories: ['faith', 'guidance'],
                text: 'Trust in the LORD with all your heart, in all your ways acknowledge Him,',
            },
            {
                number: 2,
                reference: 'John 3:16',
                categories: ['love'],
                text: 'For God so loved the world',
            },
        ]);
    });

    it('should not have text for verses that are missing from the translation', () => {
        const rows = createReviewRows(
            [
                {
                    book: 'PRO',
                    chapter: 3,
                    verse: 6,
                    endVerse: 7,
                    categories: ['wisdom'],
                },
            ],
            texts
        );

        expect(rows[0].text).toBeNull();
    });
});

describe('formatReviewRows()', () => {
    const rows: VerseOfTheDayReviewRow[] = [
        {
            number: 1,
            reference: 'John 3:16',
            categories: ['love', 'salvation'],
            text: 'For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.',
        },
        {
            number: 2,
            reference: 'Psalms 107:1',
            categories: ['gratitude'],
            text: null,
        },
    ];

    it('should print an aligned table with wrapped text', () => {
        expect(formatReviewRows(rows, 'table', 80)).toBe(
            [
                '#  Reference     Categories       Text',
                '-  ------------  ---------------  ----------------------------------------------',
                '1  John 3:16     love, salvation  For God so loved the world that He gave His',
                '                                  one and only Son, that everyone who believes',
                '                                  in Him shall not perish but have eternal life.',
                '2  Psalms 107:1  gratitude        [not found in the translation]',
            ].join('\n')
        );
    });

    it('should print a markdown table and escape pipes', () => {
        const output = formatReviewRows(
            [{ ...rows[0], text: 'a | b' }],
            'markdown'
        );
        expect(output).toBe(
            [
                '| # | Reference | Categories | Text |',
                '| --- | --- | --- | --- |',
                '| 1 | John 3:16 | love, salvation | a \\| b |',
            ].join('\n')
        );
    });

    it('should print CSV and quote fields that need it', () => {
        const output = formatReviewRows(
            [{ ...rows[0], text: 'He said, "Come!"' }],
            'csv'
        );
        expect(output).toBe(
            [
                '#,Reference,Categories,Text',
                '1,John 3:16,"love, salvation","He said, ""Come!"""',
            ].join('\n')
        );
    });
});

describe('wrapText()', () => {
    it('should wrap at word boundaries', () => {
        expect(wrapText('one two three four', 9)).toEqual([
            'one two',
            'three',
            'four',
        ]);
    });

    it('should put words that are too long on their own line', () => {
        expect(wrapText('a verylongword b', 5)).toEqual([
            'a',
            'verylongword',
            'b',
        ]);
    });
});
