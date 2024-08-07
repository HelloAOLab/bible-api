import {  isEmptyOrWhitespace, parseVerseReference } from "./utils";


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
        ['JHN 1:50', { book: 'JHN', chapter: 1, verse: 50 }] as const,
    ];

    it.each(cases)('should parse %s', (input, expected) => {
        expect(parseVerseReference(input)).toEqual(expected);
    });

    const verseCases = [
        ['GEN 1:1 In the beginning, God created the Heavens and the Earth.', 
            { book: 'GEN', chapter: 1, verse: 1, content: 'In the beginning, God created the Heavens and the Earth.' }] as const,
        ['EXO 1:1 These are the names of the sons of Israel who came to Egypt with Jacob, each with his household:', 
            { book: 'EXO', chapter: 1, verse: 1, content: 'These are the names of the sons of Israel who came to Egypt with Jacob, each with his household:' }] as const,
        ['PSA 110:1 The Lord says to my Lord: \n“Sit at my right hand, \nuntil I make your enemies your footstool.”', { 
            book: 'PSA', chapter: 110, verse: 1, content: 'The Lord says to my Lord: \n“Sit at my right hand, \nuntil I make your enemies your footstool.”' }] as const,
        ['JHN 1:50 Jesus answered him, “Because I said to you, ‘I saw you under the fig tree,’ do you believe? You will see greater things than these.”', 
            { book: 'JHN', chapter: 1, verse: 50, content: 'Jesus answered him, “Because I said to you, ‘I saw you under the fig tree,’ do you believe? You will see greater things than these.”' }] as const,
    ];

    it.each(verseCases)('should parse the reference from %s', (input, expected) => {
        expect(parseVerseReference(input)).toEqual(expected);
    });
});