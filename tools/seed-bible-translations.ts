/**
 * Picks the Bible translation to quote for a UI language, the same way the
 * Seed Bible app picks its default translation.
 *
 * Ported from HelloAOLab/seed-bible at eecc7e8:
 * - packages/seed-bible/seed-bible/managers/BibleReadingManager.tsx
 *   (`DEFAULT_TRANSLATIONS_BY_LANGUAGE`, `UI_TO_BIBLE_LANGUAGE_CODES`,
 *   `bibleLanguageCodesForUi`, `findAvailableTranslationForUiLanguage` and
 *   `resolveNearestBibleTranslation`)
 * - packages/seed-bible/seed-bible/i18n/languageMeta.ts (the `fallback` of
 *   each entry in `LANG_META`)
 *
 * Keep the tables in sync with those files when they change.
 */

export interface TranslationWithLanguage {
    id: string;
    language: string;
}

/** The parts of an `available_translations.json` entry this needs. */
export interface CatalogTranslation {
    id: string;
    language: string;
}

export const DEFAULT_TRANSLATIONS_BY_LANGUAGE = new Map<
    string,
    TranslationWithLanguage
>([
    ['am', { id: 'amh_amh', language: 'amh' }], // Amharic NT | መጽሐፍ ቅዱስ
    ['ar', { id: 'ARBNAV', language: 'arb' }], // New Arabic Version (Book of Life) | كتاب الحياة
    ['bn', { id: 'ben_ocv', language: 'ben' }], // Open Bengali Contemporary Version Bible | Biblica® মুক্তভাবে বাংলা সমকালীন সংস্করণের
    ['en', { id: 'AAB', language: 'eng' }], // AAB | Ancients Accessible Bible
    ['es', { id: 'spa_onbv', language: 'spa' }], // Spanish ONBV | Biblica® Open Nueva Biblia Viva 2008
    ['fa', { id: 'pes_opcb', language: 'pes' }], // Open Persian Contemporary Bible | Biblica® Open Persian Contemporary Bible 2022
    ['fr', { id: 'fra_ncl', language: 'fra' }], // French néo-Crampon Libre | Sainte Bible néo-Crampon Libre
    ['hi', { id: 'hin_cvb', language: 'hin' }], // Hindi Contemporary Version Bible | Biblica® हिंदी समकालीन संस्करण-स्वतंत्र उपलब्धि
    ['ind', { id: 'ind_ayt', language: 'ind' }], // Indonesian AYT Bible | Alkitab Yang Terbuka
    ['ja', { id: 'jpn_loc', language: 'jpn' }], // New Japanese NT | 新改訳新約聖書(1965年版)
    ['ko', { id: 'kor_old', language: 'kor' }], // Korean Bible 1910 | 한국어 성경
    // ['mn', { id: '', language: 'fra' }], // We don't have anything for Mongolian
    ['ne', { id: 'npi_ncb', language: 'npi' }], // Nepali Contemporary Bible | Biblica® नेपाली समकालीन सर्वसुलभ संस्करण
    // ['ps', { id: 'kor_old', language: 'kor' }], // We don't have anything for Pashto
    ['pt', { id: 'por_onbv', language: 'por' }], // Portuguese ONBV | Biblica® Open Nova Bíblia Viva 2007
    ['ru', { id: 'rus_syn', language: 'rus' }], // Russian Synodal Bible | Синодальный перевод
    ['sw', { id: 'swh_onmm', language: 'swh' }], // Swahili ONMM | Biblica® Toleo Wazi Neno: Maandiko Matakatifu
    // ['ti', { id: '', language: 'ti' }], // We don't have anything for Tigrinya
    ['tr', { id: 'tur_ytc', language: 'tur' }], // Turkish TVR Bible | Kutsal Kitap Yeni Çeviri
    ['ug', { id: 'uig_ara', language: 'uig' }], // Uyghur Bible (arabic script) | مۇقېددېس كالام (يەنگى يېزىق)
    ['uk', { id: 'ukr_ufb', language: 'ukr' }], // Ukrainian Freedom Bible | Біблія свободи
    ['ur', { id: 'urd_oucv', language: 'urd' }], // Urdu: Biblica® آزادانہ اردو ہم عصر ترجمہ (Bible) | Biblica® آزادانہ اردو ہم عصر ترجمہ
    ['vi', { id: 'vie_vcb', language: 'vie' }], // Vietnamese Contemporary Bible | Biblica® Thiên Ban Kinh Thánh Hiện Đại™
    ['zh', { id: 'cmn_cbt', language: 'cmn' }], // Chinese, Mandarin: Biblica® 聖經,當代譯本開放資源 (Bible) | Biblica® 聖經，當代譯本開放資源
]);

const FALLBACK_TRANSLATION: TranslationWithLanguage = {
    id: 'AAB',
    language: 'eng',
};

/**
 * UI locale → ISO 639-3 codes used by the Bible API `translation.language`.
 * Includes aliases so we can match the nearest available text even when the
 * preferred hardcoded ID is missing from the loaded catalog.
 */
export const UI_TO_BIBLE_LANGUAGE_CODES: Record<string, string[]> = {
    am: ['amh'],
    ar: ['arb', 'ara'],
    bn: ['ben'],
    en: ['eng'],
    es: ['spa'],
    fa: ['pes', 'fas'],
    fr: ['fra'],
    he: ['heb'],
    hi: ['hin'],
    ind: ['ind'],
    iw: ['heb'],
    ja: ['jpn'],
    ko: ['kor'],
    ne: ['npi', 'nep'],
    pt: ['por'],
    ru: ['rus'],
    sw: ['swh', 'swa'],
    tr: ['tur'],
    ug: ['uig'],
    uk: ['ukr'],
    ur: ['urd'],
    vi: ['vie'],
    zh: ['cmn', 'zho'],
    de: ['deu', 'ger'],
    it: ['ita'],
    nl: ['nld', 'dut'],
    pl: ['pol'],
    sv: ['swe'],
    th: ['tha'],
    ta: ['tam'],
    te: ['tel'],
    gu: ['guj'],
    ml: ['mal'],
    mr: ['mar'],
    kn: ['kan'],
    pa: ['pan'],
    ms: ['zlm', 'msa', 'may'],
    fil: ['tgl', 'fil'],
    tl: ['tgl', 'fil'],
    ca: ['cat'],
    ro: ['ron', 'rum'],
    cs: ['ces', 'cze'],
    sk: ['slk', 'slo'],
    el: ['ell', 'gre'],
    hu: ['hun'],
    fi: ['fin'],
    da: ['dan'],
    no: ['nor', 'nob'],
    nb: ['nob', 'nor'],
    is: ['isl', 'ice'],
    af: ['afr'],
    zu: ['zul'],
    my: ['mya', 'bur'],
    km: ['khm'],
    lo: ['lao'],
    mn: ['mon', 'khk'],
};

/** UI language to use for the default Bible translation when none exists for a language. */
export const UI_LANGUAGE_FALLBACKS: Record<string, string> = {
    af: 'en',
    az: 'tr',
    be: 'ru',
    bg: 'ru',
    bs: 'ru',
    ca: 'es',
    cs: 'en',
    cy: 'en',
    da: 'en',
    de: 'en',
    el: 'en',
    et: 'ru',
    fi: 'en',
    fil: 'en',
    fy: 'en',
    gl: 'pt',
    gn: 'es',
    gu: 'hi',
    he: 'en',
    hr: 'ru',
    hu: 'en',
    is: 'en',
    it: 'es',
    iw: 'he',
    ka: 'ru',
    km: 'en',
    kn: 'hi',
    ky: 'ru',
    ln: 'fr',
    lo: 'en',
    lt: 'ru',
    lv: 'ru',
    mk: 'ru',
    mn: 'ru',
    ml: 'hi',
    mr: 'hi',
    ms: 'ind',
    my: 'en',
    nb: 'en',
    nl: 'en',
    no: 'en',
    pa: 'hi',
    pl: 'en',
    ps: 'fa',
    ro: 'fr',
    sk: 'en',
    sl: 'ru',
    sq: 'fr',
    sv: 'en',
    ta: 'hi',
    te: 'hi',
    th: 'en',
    ti: 'am',
    tl: 'en',
    uz: 'tr',
    zu: 'en',
};

/** Bible-API language codes that correspond to a UI locale (e.g. "en" → "eng"). */
export function bibleLanguageCodesForUi(uiLanguage: string): string[] {
    const mapped = UI_TO_BIBLE_LANGUAGE_CODES[uiLanguage];
    if (mapped?.length) {
        return mapped;
    }
    const preferred =
        DEFAULT_TRANSLATIONS_BY_LANGUAGE.get(uiLanguage)?.language;
    return preferred ? [preferred] : [];
}

function findAvailableTranslationForUiLanguage(
    uiLanguage: string,
    availableTranslations: readonly CatalogTranslation[] | null | undefined
): TranslationWithLanguage | null {
    if (!availableTranslations?.length) {
        return null;
    }

    const preferred = DEFAULT_TRANSLATIONS_BY_LANGUAGE.get(uiLanguage);
    if (preferred) {
        const byId = availableTranslations.find((t) => t.id === preferred.id);
        if (byId) {
            return { id: byId.id, language: byId.language };
        }
    }

    const codes = new Set(
        bibleLanguageCodesForUi(uiLanguage).map((code) => code.toLowerCase())
    );
    if (codes.size === 0) {
        return null;
    }

    const byLanguage = availableTranslations.find((t) =>
        codes.has(t.language.toLowerCase())
    );
    if (!byLanguage) {
        return null;
    }

    return { id: byLanguage.id, language: byLanguage.language };
}

export type NearestBibleTranslation = {
    translation: TranslationWithLanguage;
    /** UI language whose default we resolved to (same as requested when direct). */
    resolvedUiLanguage: string;
    /** True when we had to use a fallback language (or English) instead of a direct match. */
    usedFallback: boolean;
};

/**
 * Picks the nearest Bible translation for a UI language:
 * 1. Hardcoded preferred default for that UI language
 * 2. If a catalog is available, prefer that preferred ID when present, otherwise
 *    any translation in a matching Bible-API language code (e.g. German → deu)
 * 3. Walk the language's fallback the same way (e.g. Gujarati → Hindi)
 * 4. English (`AAB`) as last resort
 */
export function resolveNearestBibleTranslation(
    language: string,
    availableTranslations?: readonly CatalogTranslation[] | null,
    visited: Set<string> = new Set()
): NearestBibleTranslation {
    if (visited.has(language)) {
        return {
            translation: FALLBACK_TRANSLATION,
            resolvedUiLanguage: 'en',
            usedFallback: true,
        };
    }
    visited.add(language);

    const preferred = DEFAULT_TRANSLATIONS_BY_LANGUAGE.get(language);
    if (preferred) {
        if (availableTranslations?.length) {
            const fromCatalog = findAvailableTranslationForUiLanguage(
                language,
                availableTranslations
            );
            return {
                translation: fromCatalog ?? preferred,
                resolvedUiLanguage: language,
                usedFallback: false,
            };
        }
        return {
            translation: preferred,
            resolvedUiLanguage: language,
            usedFallback: false,
        };
    }

    if (availableTranslations?.length) {
        const fromCatalog = findAvailableTranslationForUiLanguage(
            language,
            availableTranslations
        );
        if (fromCatalog) {
            return {
                translation: fromCatalog,
                resolvedUiLanguage: language,
                usedFallback: false,
            };
        }
    }

    const fallbackLanguage = UI_LANGUAGE_FALLBACKS[language];
    if (fallbackLanguage) {
        const resolved = resolveNearestBibleTranslation(
            fallbackLanguage,
            availableTranslations,
            visited
        );
        return {
            ...resolved,
            usedFallback: true,
        };
    }

    return {
        translation: FALLBACK_TRANSLATION,
        resolvedUiLanguage: 'en',
        usedFallback: true,
    };
}
