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
        // Hays
        [
            'BSB',
            'hays',
            'GEN',
            1,
            'https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3',
        ] as const,
        [
            'BSB',
            'hays',
            '1SA',
            5,
            'https://audio.bible.helloao.org/api/BSB/1SA/5/audio/hays.mp3',
        ] as const,
        [
            'BSB',
            'hays',
            'PSA',
            110,
            'https://audio.bible.helloao.org/api/BSB/PSA/110/audio/hays.mp3',
        ] as const,

        // Souer
        [
            'BSB',
            'souer',
            'GEN',
            1,
            'https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3',
        ] as const,
        [
            'BSB',
            'souer',
            '1SA',
            5,
            'https://audio.bible.helloao.org/api/BSB/1SA/5/audio/souer.mp3',
        ] as const,
        [
            'BSB',
            'souer',
            'PSA',
            110,
            'https://audio.bible.helloao.org/api/BSB/PSA/110/audio/souer.mp3',
        ] as const,

        // David
        [
            'BSB',
            'david',
            'GEN',
            1,
            'https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3',
        ] as const,
        [
            'BSB',
            'david',
            '1SA',
            5,
            'https://audio.bible.helloao.org/api/BSB/1SA/5/audio/david.mp3',
        ] as const,
        [
            'BSB',
            'david',
            'PSA',
            110,
            'https://audio.bible.helloao.org/api/BSB/PSA/110/audio/david.mp3',
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
