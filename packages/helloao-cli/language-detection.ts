/**
 * Language detection module for Bible translations.
 * Detects ISO 639-3 language codes from translation names.
 */

/**
 * Language pattern definitions.
 * Each entry is [RegExp pattern, ISO 639-3 code, text direction]
 */
const LANGUAGE_PATTERNS: [RegExp, string, 'ltr' | 'rtl'][] = [
    // Major European languages
    [/\benglish\b|\bkjv\b|\bniv\b|\besv\b|\bnasb\b|\bnkjv\b|\basv\b|\bweb\b|\bnet\b/i, 'eng', 'ltr'],
    [/\bromanian\b|\bromân|\bcornilescu\b|\bvdc\b/i, 'ron', 'ltr'],
    [/\bspanish\b|\bespa[nñ]ol\b|\breina.?valera\b|\brvr\b|\bnvi\b/i, 'spa', 'ltr'],
    [/\bfrench\b|\bfran[cç]ais\b|\blouis.?segond\b|\bsegond\b/i, 'fra', 'ltr'],
    [/\bgerman\b|\bdeutsch\b|\bluther\b|\bschlachter\b|\belberfelder\b/i, 'deu', 'ltr'],
    [/\bportuguese\b|\bportugu[eê]s\b|\balmeida\b|\bnvi.?pt\b/i, 'por', 'ltr'],
    [/\bitalian\b|\bitaliano\b|\bdiodati\b|\briveduta\b/i, 'ita', 'ltr'],
    [/\bdutch\b|\bnederlands\b|\bstatenvertaling\b|\bnbv\b/i, 'nld', 'ltr'],
    [/\bpolish\b|\bpolski\b|\bwarszawska\b|\bgda[nń]ska\b/i, 'pol', 'ltr'],
    [/\bczech\b|\b[čc]e[sš]k[áy]\b|\bkralick[áa]\b/i, 'ces', 'ltr'],
    [/\bslovak\b|\bslovensk[áy]\b/i, 'slk', 'ltr'],
    [/\bhungarian\b|\bmagyar\b|\bk[áa]roli\b/i, 'hun', 'ltr'],
    [/\bromanian\b|\bromân\b|\bcornilescu\b/i, 'ron', 'ltr'],
    [/\bbulgarian\b|\bбългарск/i, 'bul', 'ltr'],
    [/\bserbian\b|\bсрпски\b|\bsrpski\b/i, 'srp', 'ltr'],
    [/\bcroatian\b|\bhrvatski\b/i, 'hrv', 'ltr'],
    [/\bslovenian\b|\bslovenski\b/i, 'slv', 'ltr'],
    [/\bukrainian\b|\bукраїнськ/i, 'ukr', 'ltr'],
    [/\brussian\b|\bрусск|\bsynodal\b|\bрусский\b/i, 'rus', 'ltr'],
    [/\bbelarusian\b|\bбеларуск/i, 'bel', 'ltr'],
    [/\blithuanian\b|\blietuvi[uų]\b/i, 'lit', 'ltr'],
    [/\blatvian\b|\blatvie[sš]u\b/i, 'lav', 'ltr'],
    [/\bestonian\b|\beesti\b/i, 'est', 'ltr'],
    [/\bfinnish\b|\bsuomi\b|\bsuomalainen\b/i, 'fin', 'ltr'],
    [/\bswedish\b|\bsvensk\b/i, 'swe', 'ltr'],
    [/\bnorwegian\b|\bnorsk\b/i, 'nor', 'ltr'],
    [/\bdanish\b|\bdansk\b/i, 'dan', 'ltr'],
    [/\bicelandic\b|\bíslen[sz]k/i, 'isl', 'ltr'],
    [/\bgreek\b|\bελληνικ[άή]/i, 'ell', 'ltr'],
    [/\balbanian\b|\bshqip/i, 'sqi', 'ltr'],
    [/\bmacedonian\b|\bмакедонски/i, 'mkd', 'ltr'],

    // Asian languages
    [/\bchinese\b|\b中[文国國]\b|\b简体\b|\b繁[體体]\b|\b和合本\b/i, 'zho', 'ltr'],
    [/\bjapanese\b|\b日本語\b|\b口語訳\b/i, 'jpn', 'ltr'],
    [/\bkorean\b|\b한국어\b|\b한글\b|\b개역\b/i, 'kor', 'ltr'],
    [/\bvietnamese\b|\btiếng.?việt\b|\bviệt\b/i, 'vie', 'ltr'],
    [/\bthai\b|\bไทย\b/i, 'tha', 'ltr'],
    [/\bindonesian\b|\bbahasa.?indonesia\b|\bterjemahan.?baru\b/i, 'ind', 'ltr'],
    [/\bmalay\b|\bmelayu\b|\bbahasa.?melayu\b/i, 'msa', 'ltr'],
    [/\bfilipino\b|\btagalog\b|\bpilipino\b/i, 'tgl', 'ltr'],
    [/\bhindi\b|\bहिन्दी\b|\bहिंदी\b/i, 'hin', 'ltr'],
    [/\bbengali\b|\bbangla\b|\bবাংলা\b/i, 'ben', 'ltr'],
    [/\btamil\b|\bதமிழ்\b/i, 'tam', 'ltr'],
    [/\btelugu\b|\bతెలుగు\b/i, 'tel', 'ltr'],
    [/\bmarathi\b|\bमराठी\b/i, 'mar', 'ltr'],
    [/\bgujarati\b|\bગુજરાતી\b/i, 'guj', 'ltr'],
    [/\bkannada\b|\bಕನ್ನಡ\b/i, 'kan', 'ltr'],
    [/\bmalayalam\b|\bമലയാളം\b/i, 'mal', 'ltr'],
    [/\bpunjabi\b|\bਪੰਜਾਬੀ\b/i, 'pan', 'ltr'],
    [/\bnepali\b|\bनेपाली\b/i, 'nep', 'ltr'],
    [/\bsinhala\b|\bසිංහල\b/i, 'sin', 'ltr'],
    [/\bburmese\b|\bမြန်မာ\b/i, 'mya', 'ltr'],
    [/\bkhmer\b|\bកម្ពុជា\b|\bcambodian\b/i, 'khm', 'ltr'],
    [/\blao\b|\bລາວ\b/i, 'lao', 'ltr'],
    [/\bmongolian\b|\bмонгол\b/i, 'mon', 'ltr'],

    // Middle Eastern languages (RTL)
    [/\barabic\b|\bعربي\b|\bالعربية\b|\bvan.?dyck\b/i, 'arb', 'rtl'],
    [/\bhebrew\b|\bעברית\b|\bיהוד/i, 'heb', 'rtl'],
    [/\bpersian\b|\bfarsi\b|\bفارسی\b/i, 'fas', 'rtl'],
    [/\burdu\b|\bاردو\b/i, 'urd', 'rtl'],
    [/\bpashto\b|\bپښتو\b/i, 'pus', 'rtl'],
    [/\bkurdish\b|\bکوردی\b/i, 'kur', 'rtl'],

    // African languages
    [/\bswahili\b|\bkiswahili\b/i, 'swa', 'ltr'],
    [/\bamharic\b|\bአማርኛ\b/i, 'amh', 'ltr'],
    [/\bhausa\b/i, 'hau', 'ltr'],
    [/\byoruba\b|\byorùbá\b/i, 'yor', 'ltr'],
    [/\bigbo\b/i, 'ibo', 'ltr'],
    [/\bzulu\b|\bisizulu\b/i, 'zul', 'ltr'],
    [/\bxhosa\b|\bisixhosa\b/i, 'xho', 'ltr'],
    [/\bafrikaans\b/i, 'afr', 'ltr'],
    [/\bmalagasy\b/i, 'mlg', 'ltr'],
    [/\bsomali\b|\bsoomaali\b/i, 'som', 'ltr'],
    [/\btigrinya\b|\bትግርኛ\b/i, 'tir', 'ltr'],
    [/\boromo\b|\bafaan.?oromoo\b/i, 'orm', 'ltr'],
    [/\bshona\b|\bchishona\b/i, 'sna', 'ltr'],
    [/\bnyanja\b|\bchichewa\b|\bchewa\b/i, 'nya', 'ltr'],
    [/\btswana\b|\bsetswana\b/i, 'tsn', 'ltr'],
    [/\bsotho\b|\bsesotho\b/i, 'sot', 'ltr'],
    [/\brwanda\b|\bkinyarwanda\b/i, 'kin', 'ltr'],
    [/\bkirundi\b|\brundi\b/i, 'run', 'ltr'],
    [/\blingala\b/i, 'lin', 'ltr'],
    [/\bwolof\b/i, 'wol', 'ltr'],
    [/\bfula\b|\bfulfulde\b|\bpulaar\b/i, 'ful', 'ltr'],

    // Other languages
    [/\bturkish\b|\btürkçe\b/i, 'tur', 'ltr'],
    [/\bazerbaijani\b|\bazərbaycan\b/i, 'aze', 'ltr'],
    [/\bkazakh\b|\bқазақ\b/i, 'kaz', 'ltr'],
    [/\buzbe[ck]\b|\bo['ʻ]zbek\b/i, 'uzb', 'ltr'],
    [/\bgeorgian\b|\bქართული\b/i, 'kat', 'ltr'],
    [/\barmenian\b|\bհայերdelays\b/i, 'hye', 'ltr'],
    [/\bhaitia?n?.?creole\b|\bkreyòl\b/i, 'hat', 'ltr'],
    [/\bcatalan\b|\bcatalà\b/i, 'cat', 'ltr'],
    [/\bbasque\b|\beuskara\b/i, 'eus', 'ltr'],
    [/\bgalician\b|\bgalego\b/i, 'glg', 'ltr'],
    [/\bwelsh\b|\bcymraeg\b/i, 'cym', 'ltr'],
    [/\birish\b|\bgaeilge\b/i, 'gle', 'ltr'],
    [/\bscots.?gaelic\b|\bgàidhlig\b/i, 'gla', 'ltr'],
    [/\bmaltese\b|\bmalti\b/i, 'mlt', 'ltr'],
    [/\besperanto\b/i, 'epo', 'ltr'],
    [/\blatin\b|\bvulgata?\b|\blatina\b/i, 'lat', 'ltr'],
    [/\baceh\b|\bacehnese\b/i, 'ace', 'ltr'],
    [/\bjavanese\b|\bjawa\b|\bbasa.?jawa\b/i, 'jav', 'ltr'],
    [/\bsundanese\b|\bsunda\b/i, 'sun', 'ltr'],
    [/\bbatak\b/i, 'btk', 'ltr'],
    [/\bcebuano\b|\bsinugboanon\b/i, 'ceb', 'ltr'],
    [/\bilocano\b|\biloko\b/i, 'ilo', 'ltr'],
    [/\bhiligaynon\b|\bilonggo\b/i, 'hil', 'ltr'],
    [/\bwaray\b/i, 'war', 'ltr'],
    [/\bbikol\b|\bbicol\b/i, 'bik', 'ltr'],
    [/\bpapua\b|\btok.?pisin\b/i, 'tpi', 'ltr'],
    [/\bmaori\b|\bmāori\b/i, 'mri', 'ltr'],
    [/\bsamoan\b|\bsā?moa\b/i, 'smo', 'ltr'],
    [/\btongan\b|\blea.?faka-?tonga\b/i, 'ton', 'ltr'],
    [/\bfijian\b|\bvosa.?vakaviti\b/i, 'fij', 'ltr'],
    [/\btahitian\b|\breo.?tahiti\b/i, 'tah', 'ltr'],
    [/\bhawaiian\b|\bʻōlelo.?hawaiʻi\b/i, 'haw', 'ltr'],
];

/**
 * RTL (Right-to-Left) language codes
 */
const RTL_LANGUAGES = new Set([
    'arb', 'ara', 'ar', // Arabic
    'heb', 'he', // Hebrew
    'fas', 'per', 'fa', // Persian/Farsi
    'urd', 'ur', // Urdu
    'pus', 'ps', // Pashto
    'kur', 'ku', // Kurdish
    'uig', 'ug', // Uyghur
    'syr', // Syriac
    'div', 'dv', // Dhivehi
    'yid', 'yi', // Yiddish
]);

/**
 * Detects the ISO 639-3 language code from a translation name.
 *
 * @param name - The translation name (e.g., "Romanian VDC 1924", "Aceh Language")
 * @returns The detected ISO 639-3 language code, or 'eng' as fallback
 */
export function detectLanguageFromName(name: string): string {
    const normalizedName = name.toLowerCase();

    for (const [pattern, code] of LANGUAGE_PATTERNS) {
        if (pattern.test(normalizedName)) {
            return code;
        }
    }

    // Default fallback to English
    return 'eng';
}

/**
 * Checks if a language code represents an RTL (Right-to-Left) language.
 *
 * @param langCode - The ISO 639 language code (2 or 3 letter)
 * @returns true if the language is RTL, false otherwise
 */
export function isRtlLanguage(langCode: string): boolean {
    return RTL_LANGUAGES.has(langCode.toLowerCase());
}

/**
 * Gets the text direction for a language code.
 *
 * @param langCode - The ISO 639 language code
 * @returns 'rtl' for RTL languages, 'ltr' for LTR languages
 */
export function getTextDirection(langCode: string): 'ltr' | 'rtl' {
    return isRtlLanguage(langCode) ? 'rtl' : 'ltr';
}

/**
 * Normalizes a language code to ISO 639-3 format.
 * Handles common variations and mappings.
 *
 * @param code - The input language code
 * @returns The normalized ISO 639-3 code
 */
export function normalizeLanguageCode(code: string): string {
    const normalized = code.toLowerCase().trim();

    // Common ISO 639-1 to ISO 639-3 mappings
    const mappings: Record<string, string> = {
        en: 'eng',
        ro: 'ron',
        es: 'spa',
        fr: 'fra',
        de: 'deu',
        pt: 'por',
        it: 'ita',
        nl: 'nld',
        pl: 'pol',
        cs: 'ces',
        sk: 'slk',
        hu: 'hun',
        bg: 'bul',
        sr: 'srp',
        hr: 'hrv',
        sl: 'slv',
        uk: 'ukr',
        ru: 'rus',
        be: 'bel',
        lt: 'lit',
        lv: 'lav',
        et: 'est',
        fi: 'fin',
        sv: 'swe',
        no: 'nor',
        da: 'dan',
        is: 'isl',
        el: 'ell',
        sq: 'sqi',
        mk: 'mkd',
        zh: 'zho',
        ja: 'jpn',
        ko: 'kor',
        vi: 'vie',
        th: 'tha',
        id: 'ind',
        ms: 'msa',
        tl: 'tgl',
        hi: 'hin',
        bn: 'ben',
        ta: 'tam',
        te: 'tel',
        mr: 'mar',
        gu: 'guj',
        kn: 'kan',
        ml: 'mal',
        pa: 'pan',
        ne: 'nep',
        si: 'sin',
        my: 'mya',
        km: 'khm',
        lo: 'lao',
        mn: 'mon',
        ar: 'arb',
        he: 'heb',
        fa: 'fas',
        ur: 'urd',
        ps: 'pus',
        ku: 'kur',
        sw: 'swa',
        am: 'amh',
        ha: 'hau',
        yo: 'yor',
        ig: 'ibo',
        zu: 'zul',
        xh: 'xho',
        af: 'afr',
        mg: 'mlg',
        so: 'som',
        ti: 'tir',
        om: 'orm',
        sn: 'sna',
        ny: 'nya',
        tn: 'tsn',
        st: 'sot',
        rw: 'kin',
        rn: 'run',
        ln: 'lin',
        wo: 'wol',
        ff: 'ful',
        tr: 'tur',
        az: 'aze',
        kk: 'kaz',
        uz: 'uzb',
        ka: 'kat',
        hy: 'hye',
        ht: 'hat',
        ca: 'cat',
        eu: 'eus',
        gl: 'glg',
        cy: 'cym',
        ga: 'gle',
        gd: 'gla',
        mt: 'mlt',
        eo: 'epo',
        la: 'lat',
        jv: 'jav',
        su: 'sun',
        mi: 'mri',
        sm: 'smo',
        to: 'ton',
        fj: 'fij',
        ty: 'tah',
    };

    return mappings[normalized] ?? normalized;
}

/**
 * Attempts to extract language information from a filename.
 *
 * @param filename - The filename (e.g., "RomanianBible.xml", "AcehBible.xml")
 * @returns The detected language code or null if not detected
 */
export function detectLanguageFromFilename(filename: string): string | null {
    // Remove extension and common suffixes
    const baseName = filename
        .replace(/\.xml$/i, '')
        .replace(/Bible$/i, '')
        .replace(/_/g, ' ');

    const detected = detectLanguageFromName(baseName);
    return detected !== 'eng' ? detected : null;
}
