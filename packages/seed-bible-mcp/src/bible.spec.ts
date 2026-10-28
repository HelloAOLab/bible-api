import { filterTranslations, TranslationSummary } from './bible';

function translation(
    id: string,
    language: string,
    languageEnglishName: string,
    overrides: Partial<TranslationSummary> = {}
): TranslationSummary {
    return {
        id,
        name: id,
        englishName: id,
        shortName: id,
        language,
        languageName: languageEnglishName,
        languageEnglishName,
        textDirection: 'ltr',
        numberOfBooks: 66,
        ...overrides,
    };
}

const translations: TranslationSummary[] = [
    translation('BSB', 'eng', 'English', {
        name: 'Berean Standard Bible',
        englishName: 'Berean Standard Bible',
    }),
    translation('ENGWEBP', 'eng', 'English', {
        name: 'World English Bible',
        englishName: 'World English Bible',
        shortName: 'WEB',
    }),
    translation('BSBX', 'eng', 'English'),
    translation('ben_irv', 'ben', 'Bengali', {
        languageName: 'বাংলা',
    }),
    translation('ang_wsc', 'ang', 'Old English', {
        languageName: 'Englisc',
    }),
    translation('spa_rv1909', 'spa', 'Spanish', {
        name: 'Reina Valera 1909',
        englishName: 'Reina Valera 1909',
        shortName: 'RV1909',
        languageName: 'Español',
    }),
    translation('spa_rvr', 'spa', 'Spanish', {
        name: 'Reina Valera Revisada',
        englishName: 'Reina Valera Revised',
        shortName: 'RVR',
        languageName: 'Español',
    }),
];

function ids(filter: { language?: string; name?: string }): string[] {
    return filterTranslations(translations, filter).map((t) => t.id);
}

describe('filterTranslations()', () => {
    it('should return all translations when no filter is given', () => {
        expect(ids({})).toEqual(translations.map((t) => t.id));
    });

    it('should ignore blank filters', () => {
        expect(ids({ language: '  ', name: '' })).toEqual(
            translations.map((t) => t.id)
        );
    });

    describe('language', () => {
        const cases = [
            // Exact matches only return exact matches
            ['eng', ['BSB', 'ENGWEBP', 'BSBX']] as const,
            ['ENG', ['BSB', 'ENGWEBP', 'BSBX']] as const,
            ['English', ['BSB', 'ENGWEBP', 'BSBX']] as const,
            ['english', ['BSB', 'ENGWEBP', 'BSBX']] as const,
            [' English ', ['BSB', 'ENGWEBP', 'BSBX']] as const,
            ['Old English', ['ang_wsc']] as const,
            ['Español', ['spa_rv1909', 'spa_rvr']] as const,
            // Partial matches are returned when there are no exact matches
            ['Engli', ['BSB', 'ENGWEBP', 'BSBX', 'ang_wsc']] as const,
            ['Beng', ['ben_irv']] as const,
            ['Span', ['spa_rv1909', 'spa_rvr']] as const,
            ['spañ', ['spa_rv1909', 'spa_rvr']] as const,
            // Nothing matches
            ['French', []] as const,
        ] as const;

        it.each(cases)(
            'should return translations for %j',
            (language, expected) => {
                expect(ids({ language })).toEqual(expected);
            }
        );
    });

    describe('name', () => {
        const cases = [
            // Exact matches only return exact matches
            ['BSB', ['BSB']] as const,
            ['bsb', ['BSB']] as const,
            ['WEB', ['ENGWEBP']] as const,
            ['Reina Valera 1909', ['spa_rv1909']] as const,
            ['spa_rvr', ['spa_rvr']] as const,
            // Partial matches are returned when there are no exact matches
            ['BS', ['BSB', 'BSBX']] as const,
            ['Reina', ['spa_rv1909', 'spa_rvr']] as const,
            ['World English', ['ENGWEBP']] as const,
            // Nothing matches
            ['King James', []] as const,
        ] as const;

        it.each(cases)(
            'should return translations for %j',
            (name, expected) => {
                expect(ids({ name })).toEqual(expected);
            }
        );
    });

    describe('language and name', () => {
        it('should apply both filters', () => {
            expect(ids({ language: 'spa', name: 'Revised' })).toEqual([
                'spa_rvr',
            ]);
        });

        it('should prefer exact matches for each filter independently', () => {
            // "eng" matches exactly, so Bengali and Old English are excluded.
            // "BS" only matches partially, so both BSB and BSBX are returned.
            expect(ids({ language: 'eng', name: 'BS' })).toEqual([
                'BSB',
                'BSBX',
            ]);
        });

        it('should apply the name filter to the language matches', () => {
            // BSB is an exact name match, but not in Spanish
            expect(ids({ language: 'spa', name: 'BSB' })).toEqual([]);
        });
    });
});
