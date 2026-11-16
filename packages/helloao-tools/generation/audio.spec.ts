import {
    capitalize,
    KNOWN_AUDIO_TRANSLATIONS,
    WORDPROJECT_AUDIO,
} from './audio.js';

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

        // Chinese Union Version translations share the CUV audio
        ...['cmn_cuv', 'cmn_cuvmps', 'cmn_cuvmpt', 'cmn_cu1'].map(
            (translationId) =>
                [
                    translationId,
                    'mandarin',
                    'JHN',
                    3,
                    'https://audio.bible.helloao.org/api/cmn_cuv/JHN/3/audio/mandarin.mp3',
                ] as const
        ),

        // Wordproject audio
        ...WORDPROJECT_AUDIO.map(
            ({ translationId, reader, file, audioTranslationId }) =>
                [
                    translationId,
                    reader,
                    'JHN',
                    3,
                    `https://audio.bible.helloao.org/api/${audioTranslationId ?? translationId}/JHN/3/audio/${file}.mp3`,
                ] as const
        ),
        [
            'HINIRV',
            'wordproject',
            'GEN',
            1,
            'https://audio.bible.helloao.org/api/HINIRV/GEN/1/audio/wordproject.mp3',
        ] as const,
        ...['cmn_cuv', 'cmn_cuvmps', 'cmn_cuvmpt', 'cmn_cu1'].flatMap(
            (translationId) => [
                [
                    translationId,
                    'wordproject_mandarin',
                    'JHN',
                    3,
                    'https://audio.bible.helloao.org/api/cmn_cuv/JHN/3/audio/wordproject.mp3',
                ] as const,
                [
                    translationId,
                    'wordproject_cantonese',
                    'JHN',
                    3,
                    'https://audio.bible.helloao.org/api/cmn_cuv/JHN/3/audio/wordproject_cantonese.mp3',
                ] as const,
            ]
        ),
    ];

    it.each(cases)(
        'should generate the correct URL for %s %s %s',
        (translationId, reader, bookId, chapter, expected) => {
            const generator =
                KNOWN_AUDIO_TRANSLATIONS.get(translationId)!.get(reader)!;
            expect(generator(bookId, chapter)).toBe(expected);
        }
    );

    it('should keep the existing readers for translations that also have Wordproject audio', () => {
        expect([...KNOWN_AUDIO_TRANSLATIONS.get('BSB')!.keys()]).toEqual([
            'hays',
            'souer',
            'david',
        ]);
        for (const translationId of [
            'cmn_cuv',
            'cmn_cuvmps',
            'cmn_cuvmpt',
            'cmn_cu1',
        ]) {
            expect([
                ...KNOWN_AUDIO_TRANSLATIONS.get(translationId)!.keys(),
            ]).toEqual([
                'mandarin',
                'wordproject_mandarin',
                'wordproject_cantonese',
            ]);
        }
    });
});
