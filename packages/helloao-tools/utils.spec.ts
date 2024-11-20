import { getBookId, isEmptyOrWhitespace, parseVerseReference } from './utils';

describe('isEmptyOrWhitespace()', () => {
    const cases = [
        ['emtpy', true, ''] as const,
        ['null', true, null] as const,
        ['undef', true, undefined] as const,
        ['space', true, ' '] as const,
        ['tab', true, '\t'] as const,
        ['letters', false, 'abc'] as const,
        ['newline', true, '\n'] as const,
    ] as const;

    it.each(cases)('should return %s for %s', (_desc, expected, input) => {
        expect(isEmptyOrWhitespace(input)).toBe(expected);
    });
});

describe('parseVerseReference()', () => {
    const cases = [
        ['GEN 1:1', { book: 'GEN', chapter: 1, verse: 1 }] as const,
        ['EXO 1:1', { book: 'EXO', chapter: 1, verse: 1 }] as const,
        ['PSA 110:1', { book: 'PSA', chapter: 110, verse: 1 }] as const,
        ['psalms 110:1', { book: 'PSA', chapter: 110, verse: 1 }] as const,
        ['JHN 1:50', { book: 'JHN', chapter: 1, verse: 50 }] as const,
        ['John 1:50', { book: 'JHN', chapter: 1, verse: 50 }] as const,

        ['1CO 1:2', { book: '1CO', chapter: 1, verse: 2 }] as const,
        ['1 Corinthians 1:2', { book: '1CO', chapter: 1, verse: 2 }] as const,

        [
            'Gen.1.1-2.3',
            { book: 'GEN', chapter: 1, verse: 1, endChapter: 2, endVerse: 3 },
        ] as const,
        ['Obad.1.11', { book: 'OBA', chapter: 1, verse: 11 }] as const,
        [
            'Hab.3.8-15',
            { book: 'HAB', chapter: 3, verse: 8, endVerse: 15 },
        ] as const,
        ['2Sam.15.8', { book: '2SA', chapter: 15, verse: 8 }] as const,
        [
            '1Kgs.1.31-32',
            { book: '1KI', chapter: 1, verse: 31, endVerse: 32 },
        ] as const,
    ];

    it.each(cases)('should parse %s', (input, expected) => {
        expect(parseVerseReference(input)).toEqual(expected);
    });

    const verseCases = [
        [
            'GEN 1:1 In the beginning, God created the Heavens and the Earth.',
            {
                book: 'GEN',
                chapter: 1,
                verse: 1,
                content:
                    'In the beginning, God created the Heavens and the Earth.',
            },
        ] as const,
        [
            'EXO 1:1 These are the names of the sons of Israel who came to Egypt with Jacob, each with his household:',
            {
                book: 'EXO',
                chapter: 1,
                verse: 1,
                content:
                    'These are the names of the sons of Israel who came to Egypt with Jacob, each with his household:',
            },
        ] as const,
        [
            'PSA 110:1 The Lord says to my Lord: \n“Sit at my right hand, \nuntil I make your enemies your footstool.”',
            {
                book: 'PSA',
                chapter: 110,
                verse: 1,
                content:
                    'The Lord says to my Lord: \n“Sit at my right hand, \nuntil I make your enemies your footstool.”',
            },
        ] as const,
        [
            'JHN 1:50 Jesus answered him, “Because I said to you, ‘I saw you under the fig tree,’ do you believe? You will see greater things than these.”',
            {
                book: 'JHN',
                chapter: 1,
                verse: 50,
                content:
                    'Jesus answered him, “Because I said to you, ‘I saw you under the fig tree,’ do you believe? You will see greater things than these.”',
            },
        ] as const,
    ];

    it.each(verseCases)(
        'should parse the reference from %s',
        (input, expected) => {
            expect(parseVerseReference(input)).toEqual(expected);
        }
    );
});

describe('getBookId()', () => {
    it('should return the book ID', () => {
        expect(getBookId('GEN')).toBe('GEN');
        expect(getBookId('EXO')).toBe('EXO');

        expect(getBookId('PSA')).toBe('PSA');
        expect(getBookId('Psalms')).toBe('PSA');

        expect(getBookId('JHN')).toBe('JHN');
        expect(getBookId('John')).toBe('JHN');

        expect(getBookId('1CH')).toBe('1CH');
        expect(getBookId('1 chronicles')).toBe('1CH');
        expect(getBookId('1 chron')).toBe('1CH');
        expect(getBookId('1Kgs')).toBe('1KI');
        expect(getBookId('2Kgs')).toBe('2KI');
        expect(getBookId('1Chr')).toBe('1CH');
        expect(getBookId('2Chr')).toBe('2CH');

        expect(getBookId('Pr')).toBe('PRO');
        expect(getBookId('Ps')).toBe('PSA');
        expect(getBookId('Song')).toBe('SNG');
        expect(getBookId('Eccl')).toBe('ECC');
        expect(getBookId('1Pet')).toBe('1PE');
        expect(getBookId('2Pet')).toBe('2PE');
        expect(getBookId('1Jn')).toBe('1JN');
        expect(getBookId('2Jn')).toBe('2JN');
        expect(getBookId('3Jn')).toBe('3JN');
    });
});
