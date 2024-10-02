import { capitalize, KNOWN_AUDIO_TRANSLATIONS } from './audio.js';

describe('capitalize()', () => {
    const cases = [
        ['empty', '', ''],
        ['single letter', 'a', 'A'],
        ['number', '1abc', '1Abc'],
        ['word', 'word', 'Word'],
        ['lowercase rest', 'WORD', 'Word'],
        ['sentence', 'this is a sentence', 'This is a sentence'],
    ];

    it.each(cases)('should capitalize %s', (_desc, input, expected) => {
        expect(capitalize(input)).toBe(expected);
    });
});

describe('KNOWN_AUDIO_TRANSLATIONS', () => {
    const cases = [
        // Gilbert
        [
            'BSB',
            'gilbert',
            'GEN',
            1,
            'https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3',
        ] as const,
        [
            'BSB',
            'gilbert',
            '1SA',
            5,
            'https://openbible.com/audio/gilbert/BSB_09_1Sa_005_G.mp3',
        ] as const,
        [
            'BSB',
            'gilbert',
            'PSA',
            110,
            'https://openbible.com/audio/gilbert/BSB_19_Psa_110_G.mp3',
        ] as const,

        // Hays
        [
            'BSB',
            'hays',
            'GEN',
            1,
            'https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3',
        ] as const,
        [
            'BSB',
            'hays',
            '1SA',
            5,
            'https://openbible.com/audio/hays/BSB_09_1Sa_005_H.mp3',
        ] as const,
        [
            'BSB',
            'hays',
            'PSA',
            110,
            'https://openbible.com/audio/hays/BSB_19_Psa_110_H.mp3',
        ] as const,

        // Souer
        [
            'BSB',
            'souer',
            'GEN',
            1,
            'https://openbible.com/audio/souer/BSB_01_Gen_001.mp3',
        ] as const,
        [
            'BSB',
            'souer',
            '1SA',
            5,
            'https://openbible.com/audio/souer/BSB_09_1Sa_005.mp3',
        ] as const,
        [
            'BSB',
            'souer',
            'PSA',
            110,
            'https://openbible.com/audio/souer/BSB_19_Psa_110.mp3',
        ] as const,
    ];

    it.each(cases)(
        'should generate the correct URL for %s %s %s',
        (translationId, reader, bookId, chapter, expected) => {
            const generator =
                KNOWN_AUDIO_TRANSLATIONS.get(translationId)!.get(reader)!;
            expect(generator(bookId, chapter)).toBe(expected);
        }
    );
});
