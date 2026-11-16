/**
 * The audio Bibles published by Wordproject (https://www.wordproject.org/bibles/audio/index.htm)
 * and the Free Use Bible API translations each one matches.
 *
 * Wordproject offers one zip per book, named `{zipId}_{bookNumber}.zip`, for example
 * https://www.wordproaudio.net/bibles/app/audio/17_1.zip (Amharic, Genesis).
 * Book numbers follow the 66 book Protestant order (1 = GEN ... 66 = REV).
 *
 * The URLs below come from the book pages on wordproject.org. Some book pages link to the
 * wrong zip (for example Somali Psalms links to 36_18.zip, which is Job), so the URLs are
 * built from the naming pattern rather than copied from the pages.
 *
 * ## How the translations were matched
 *
 * Each recording narrates the text Wordproject publishes for that language. The text of
 * John 1 and Genesis 1 on wordproject.org was compared with every API translation in the
 * same language (character similarity after removing punctuation and diacritics).
 *
 * - `exact`: the API has the same text (similarity of about 0.95 or more).
 * - `close`: the same translation in a revised edition, another script, or a partial copy,
 *   or the same text read in a different spoken language.
 * - `unverified`: the language matches but Wordproject has no text to compare with.
 * - `poor`: the API has no copy of the narrated translation, so this is the closest
 *   translation in the same language. Listeners will hear different wording than they read.
 * - `none`: the API has no translation in this language. Nothing is written for these
 *   unless a translation is given with `--map` on the command line.
 */

export type WordprojectMatch =
    | 'exact'
    | 'close'
    | 'unverified'
    | 'poor'
    | 'none';

/**
 * Match levels from best to worst.
 */
export const WORDPROJECT_MATCH_LEVELS: readonly WordprojectMatch[] = [
    'exact',
    'close',
    'unverified',
    'poor',
    'none',
];

export interface WordprojectAudioSet {
    /**
     * The folder of the audio Bible on wordproject.org, e.g. `17_amharic`.
     */
    id: string;

    /**
     * The ISO 639-3 code of the spoken language.
     */
    language: string;

    /**
     * The English name of the audio Bible.
     */
    name: string;

    /**
     * The translation that is narrated, as far as Wordproject says.
     */
    narratedText: string;

    /**
     * The prefix of the zip file names, e.g. `17` for `17_1.zip`.
     */
    zipId: string;

    /**
     * The URL that the zip files live under. Defaults to {@link DEFAULT_HOST}.
     */
    host?: string;

    /**
     * Which books have audio. Defaults to `all`.
     */
    books?: 'all' | 'nt';

    /**
     * Zip URLs for books that don't follow the `{host}{zipId}_{book}.zip` pattern.
     */
    zipUrls?: Record<number, string>;

    /**
     * The Free Use Bible API translations that this audio matches, best first.
     * The audio is written to the first one unless `--all-translations` is passed.
     */
    translations: string[];

    /**
     * How well the translations match the narration.
     */
    match: WordprojectMatch;

    /**
     * The reader ID used for the file name. Defaults to {@link DEFAULT_READER}.
     * Sets that share a translation with another set get their own reader so the files don't collide.
     */
    reader?: string;

    /**
     * Why the translations were picked and anything to watch out for.
     */
    notes?: string;
}

export const DEFAULT_READER = 'wordproject';

export const DEFAULT_HOST = 'https://www.wordproaudio.net/bibles/app/audio/';

/**
 * Hosts that Wordproject serves the same zip files from.
 * When a download fails the script tries the same file name on these hosts.
 */
export const MIRROR_HOSTS = [
    'https://www.wordproaudio.net/bibles/app/audio/',
    'https://www.wordproaudio.org/bibles/app/audio/',
    'http://audio5.wordfree.net/bibles/app/audio/',
];

const AUDIO5_HOST = 'http://audio5.wordfree.net/bibles/app/audio/';
const WORDPROAUDIO_ORG_HOST = 'https://www.wordproaudio.org/bibles/app/audio/';

/**
 * The Modern Greek Old Testament zips are named after the book instead of numbered.
 */
const MODERN_GREEK_OT_ZIPS = [
    'genesis',
    'exodus',
    'leviticus',
    'numbers',
    'deuterenomy',
    'joshua',
    'judges',
    'ruth',
    '1samuel',
    '2samuel',
    '1kings',
    '2kings',
    '1chron',
    '2chron',
    'ezra',
    'nehemiah',
    'esther',
    'job',
    'psalms',
    'proverbs',
    'eccles',
    'songsos',
    'isaiah',
    'jeremiah',
    'lament',
    'ezekiel',
    'dan',
    'hosea',
    'joel',
    'amos',
    'obad',
    'jonah',
    'micah',
    'nahum',
    'habak',
    'zepha',
    'hagg',
    'zech',
    'malac',
];

export const WORDPROJECT_AUDIO_SETS: WordprojectAudioSet[] = [
    {
        id: '01_english',
        language: 'eng',
        name: 'English',
        narratedText: 'King James Version',
        zipId: '1',
        translations: ['eng_kjv', 'eng_kja', 'eng_cpb'],
        match: 'exact',
    },
    {
        id: '02_portuguese',
        language: 'por',
        name: 'Portuguese (European narration)',
        narratedText: 'João Ferreira de Almeida (Revista e Corrigida)',
        zipId: '2',
        translations: ['por_blj', 'por_bsl'],
        match: 'poor',
        notes: 'The API has no Almeida translation. Bíblia Livre is the closest (0.85 in Genesis 1, 0.78 in John 1).',
    },
    {
        id: '02_portuguese-BR',
        language: 'por',
        name: 'Portuguese (Brazilian narration)',
        narratedText: 'João Ferreira de Almeida (Revista e Corrigida)',
        zipId: '2_BR',
        host: WORDPROAUDIO_ORG_HOST,
        translations: ['por_blj', 'por_bsl'],
        match: 'poor',
        reader: 'wordproject_br',
        notes: 'Same text as 02_portuguese read by a Brazilian narrator, so it gets its own reader. The API has no Almeida translation.',
    },
    {
        id: '03_hindi',
        language: 'hin',
        name: 'Hindi',
        narratedText: 'Hindi Indian Revised Version',
        zipId: '3',
        translations: ['HINIRV'],
        match: 'close',
        notes: 'John 1 is identical (0.98) but Genesis 1 differs more (0.83), so Wordproject may use an older edition of the IRV Old Testament.',
    },
    {
        id: '04_chinese',
        language: 'cmn',
        name: 'Chinese (Mandarin)',
        narratedText: 'Chinese Union Version',
        zipId: '4',
        translations: ['cmn_cuv', 'cmn_cu1', 'cmn_cuvmps', 'cmn_cuvmpt'],
        match: 'exact',
        notes: 'Same text in simplified and traditional characters. The API already serves a "mandarin" CUV reader for these translations.',
    },
    {
        id: '05_swahili',
        language: 'swh',
        name: 'Swahili',
        narratedText: 'Swahili Union Version',
        zipId: '5',
        translations: ['swh_bib', 'swh_ulb', 'swh_onmm'],
        match: 'poor',
        notes: 'The API has no Swahili Union Version. The closest are about 0.7 similar.',
    },
    {
        id: '06_spanish',
        language: 'spa',
        name: 'Spanish',
        narratedText: 'Reina-Valera 1909',
        zipId: '6',
        translations: ['spa_r09'],
        match: 'exact',
    },
    {
        id: '07_french',
        language: 'fra',
        name: 'French',
        narratedText: 'Louis Segond 1910',
        zipId: '7',
        translations: ['fra_lsg'],
        match: 'exact',
    },
    {
        id: '08_russian',
        language: 'rus',
        name: 'Russian',
        narratedText: 'Synodal Translation',
        zipId: '8',
        translations: ['rus_syn'],
        match: 'close',
        notes: 'Same translation: John 1 is identical (1.00) but Genesis 1 differs more (0.88), probably spelling or edition differences.',
    },
    {
        id: '09_german',
        language: 'deu',
        name: 'German',
        narratedText: 'Luther 1912',
        zipId: '9',
        translations: ['deu_l12'],
        match: 'exact',
    },
    {
        id: '10_italian',
        language: 'ita',
        name: 'Italian',
        narratedText: 'Riveduta 1927',
        zipId: '10',
        translations: ['ita_riv'],
        match: 'exact',
    },
    {
        id: '11_korean',
        language: 'kor',
        name: 'Korean',
        narratedText: 'Korean Revised Version',
        zipId: '11',
        translations: ['kor_old'],
        match: 'exact',
    },
    {
        id: '12_japanese',
        language: 'jpn',
        name: 'Japanese',
        narratedText: 'Kougo-yaku (1954/1955)',
        zipId: '12',
        translations: ['jpn_kou'],
        match: 'exact',
    },
    {
        id: '13_cantonese',
        language: 'yue',
        name: 'Chinese (Cantonese)',
        narratedText: 'Chinese Union Version',
        zipId: '13',
        translations: ['cmn_cuv', 'cmn_cuvmpt', 'cmn_cu1', 'cmn_cuvmps'],
        match: 'close',
        reader: 'wordproject_cantonese',
        notes: 'The Chinese Union Version read in Cantonese. The API lists the CUV as Mandarin (cmn), so it gets its own reader.',
    },
    {
        id: '14_indonesian',
        language: 'ind',
        name: 'Indonesian',
        narratedText: 'Terjemahan Baru',
        zipId: '14',
        translations: ['ind_ayt'],
        match: 'poor',
        notes: 'The API has no Terjemahan Baru. Alkitab Yang Terbuka is the closest (about 0.75).',
    },
    {
        id: '15_turkish',
        language: 'tur',
        name: 'Turkish',
        narratedText: 'Kutsal Kitap Yeni Çeviri',
        zipId: '15',
        translations: ['tur_ytc'],
        match: 'poor',
        notes: 'The API has no Yeni Çeviri. Yorumsuz Türkçe Çeviri is the closest (0.84 in John 1, 0.74 in Genesis 1).',
    },
    {
        id: '16_arabic',
        language: 'arb',
        name: 'Arabic',
        narratedText: 'Van Dyck',
        zipId: '16',
        translations: ['arb_vdv'],
        match: 'close',
        notes: 'Same translation (0.92 to 0.94); the small differences look like edition and spelling differences.',
    },
    {
        id: '17_amharic',
        language: 'amh',
        name: 'Amharic',
        narratedText: 'Amharic Bible (1962, Haile Selassie)',
        zipId: '17',
        translations: ['amh_amh'],
        match: 'close',
        notes: 'Same text (0.95 in John 1), but the API translation only has the New Testament, so the Old Testament audio has no text to go with it.',
    },
    {
        id: '18_thai',
        language: 'tha',
        name: 'Thai',
        narratedText: 'Thai KJV',
        zipId: '18',
        translations: ['tha_kjv'],
        match: 'exact',
    },
    {
        id: '19_vietnamese',
        language: 'vie',
        name: 'Vietnamese',
        narratedText: 'Vietnamese Bible 1934',
        zipId: '19',
        translations: ['vie_1934'],
        match: 'exact',
    },
    {
        id: '20_farsi',
        language: 'pes',
        name: 'Farsi (Persian)',
        narratedText: 'Old Persian Version',
        zipId: '20',
        translations: ['pes_pbs'],
        match: 'exact',
    },
    {
        id: '21_urdu',
        language: 'urd',
        name: 'Urdu',
        narratedText: 'Urdu Bible (Revised Version)',
        zipId: '21',
        translations: ['urd_oucv', 'urd_gvu'],
        match: 'poor',
        notes: 'The API has no copy of this Urdu text. The closest are about 0.7 similar.',
    },
    {
        id: '22_bengali',
        language: 'ben',
        name: 'Bengali',
        narratedText: 'Bengali Bible (Old Version)',
        zipId: '22',
        translations: ['ben_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version but reads quite differently (0.3 to 0.6).',
    },
    {
        id: '23_gujarati',
        language: 'guj',
        name: 'Gujarati',
        narratedText: 'Gujarati Bible (Old Version)',
        zipId: '23',
        translations: ['guj_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version but reads quite differently (about 0.4).',
    },
    {
        id: '24_kannada',
        language: 'kan',
        name: 'Kannada',
        narratedText: 'Kannada Bible (Old Version)',
        zipId: '24',
        translations: ['kan_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version (0.58 to 0.70).',
    },
    {
        id: '25_malayalam',
        language: 'mal',
        name: 'Malayalam',
        narratedText: 'Sathyavedapusthakam (1910)',
        zipId: '25',
        translations: ['mal_fbf', 'mal_irv'],
        match: 'exact',
        notes: 'mal_fbf is the same text; mal_irv is a close revision (about 0.92).',
    },
    {
        id: '26_oriya',
        language: 'ory',
        name: 'Oriya',
        narratedText: 'Oriya Bible (Old Version)',
        zipId: '26',
        translations: ['ory_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version but reads quite differently (about 0.4).',
    },
    {
        id: '27_punjabi',
        language: 'pan',
        name: 'Punjabi',
        narratedText: 'Punjabi Bible (Old Version)',
        zipId: '27',
        translations: ['pan_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version (0.57 in John 1, 0.82 in Genesis 1).',
    },
    {
        id: '28_marathi',
        language: 'mar',
        name: 'Marathi',
        narratedText: 'Marathi Bible (Old Version)',
        zipId: '28',
        translations: ['mar_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version (0.46 to 0.72).',
    },
    {
        id: '29_telugu',
        language: 'tel',
        name: 'Telugu',
        narratedText: 'Telugu Bible (Old Version)',
        zipId: '29',
        translations: ['tel_irv'],
        match: 'poor',
        notes: 'The IRV is a revision of the old version but reads quite differently (about 0.5).',
    },
    {
        id: '30_tamil',
        language: 'tam',
        name: 'Tamil',
        narratedText: 'Tamil Bible (Old Version)',
        zipId: '30',
        translations: ['tam_irv'],
        match: 'close',
        notes: 'The IRV is a light revision of the old version (0.86 to 0.89).',
    },
    {
        id: '31_serbian',
        language: 'srp',
        name: 'Serbian',
        narratedText: 'Daničić-Karadžić',
        zipId: '31',
        translations: ['srp_dkl', 'srp_dkc'],
        match: 'exact',
        notes: 'srp_dkl is the same text in Latin script, srp_dkc in Cyrillic.',
    },
    {
        id: '32_czech',
        language: 'ces',
        name: 'Czech',
        narratedText: 'Bible Kralická',
        zipId: '32',
        translations: ['ces_bkr'],
        match: 'exact',
    },
    {
        id: '33_polish',
        language: 'pol',
        name: 'Polish',
        narratedText: 'Biblia Gdańska (1632)',
        zipId: '33',
        translations: ['pol_ubg'],
        match: 'poor',
        notes: 'The Updated Gdańsk Bible modernises the wording heavily (0.84 in John 1, 0.65 in Genesis 1).',
    },
    {
        id: '34_romanian',
        language: 'ron',
        name: 'Romanian',
        narratedText: 'Cornilescu 1924',
        zipId: '34',
        translations: ['ron_924'],
        match: 'close',
        notes: 'ron_924 is the Cornilescu text transliterated into Cyrillic script, so the words match the audio but the script does not. The only Latin script option, ron_btf, is a different translation (about 0.8).',
    },
    {
        id: '35_zulu',
        language: 'zul',
        name: 'Zulu',
        narratedText: 'Zulu Bible (1959)',
        zipId: '35',
        translations: [],
        match: 'none',
        notes: 'The API has no Zulu translation.',
    },
    {
        id: '36_somali',
        language: 'som',
        name: 'Somali',
        narratedText: 'Kitaabka Quduuska Ah',
        zipId: '36',
        translations: ['som_sim'],
        match: 'exact',
        notes: 'The Psalms, Obadiah and Colossians pages link to the wrong zip; the pattern URL is used instead.',
    },
    {
        id: '39_bulgarian',
        language: 'bul',
        name: 'Bulgarian',
        narratedText: 'Bulgarian Bible',
        zipId: '39',
        translations: [],
        match: 'none',
        notes: 'The API has no Bulgarian translation.',
    },
    {
        id: '40_mod_greek_2',
        language: 'ell',
        name: 'Modern Greek',
        narratedText: 'Modern Greek Bible',
        zipId: '40',
        zipUrls: Object.fromEntries(
            MODERN_GREEK_OT_ZIPS.map((name, i) => [
                i + 1,
                `http://audio4.wordfree.net/bibles/app/audio/40_${String(i + 1).padStart(2, '0')}_${name}.zip`,
            ])
        ),
        translations: [],
        match: 'none',
        notes: 'The API has no Modern Greek translation. The Old Testament zips are named after the book and hosted on audio4.wordfree.net.',
    },
    {
        id: '41_latin',
        language: 'lat',
        name: 'Latin',
        narratedText: 'Vulgate',
        zipId: '41',
        books: 'nt',
        translations: ['lat_clv'],
        match: 'exact',
        notes: 'New Testament only.',
    },
    {
        id: '42_luganda',
        language: 'lug',
        name: 'Luganda',
        narratedText: 'Luganda Bible (Bible Society of Uganda)',
        zipId: '42',
        translations: ['lug_bib'],
        match: 'poor',
        notes: 'The API translation is a newer Luganda text (0.63 to 0.75).',
    },
    {
        id: '43_burmese',
        language: 'mya',
        name: 'Burmese',
        narratedText: 'Judson Bible',
        zipId: '43',
        translations: ['mya_jvb'],
        match: 'exact',
    },
    {
        id: '44_hebrew',
        language: 'heb',
        name: 'Hebrew',
        narratedText:
            'Modern Hebrew Bible (Masoretic Old Testament, modern Hebrew New Testament)',
        zipId: '44',
        translations: ['heb_mod', 'heb_wlc'],
        match: 'exact',
        notes: 'heb_mod is the same text. heb_wlc only has the Old Testament, which matches (0.99).',
    },
    {
        id: '45_hungarian',
        language: 'hun',
        name: 'Hungarian',
        narratedText: 'Károli',
        zipId: '45',
        translations: ['hun_bib'],
        match: 'close',
        notes: 'Close wording in John 1 (0.94), but the API translation only has the New Testament, so the Old Testament audio has no text to go with it.',
    },
    {
        id: '46_tagalog',
        language: 'tgl',
        name: 'Tagalog',
        narratedText: 'Ang Dating Biblia (1905)',
        zipId: '46',
        translations: ['tgl_bib', 'tgl_ulb'],
        match: 'poor',
        notes: 'The API has no Ang Dating Biblia. The closest are about 0.5 to 0.65 similar.',
    },
    {
        id: '47_khmer',
        language: 'khm',
        name: 'Khmer',
        narratedText: 'Khmer Bible',
        zipId: '47',
        host: WORDPROAUDIO_ORG_HOST,
        books: 'nt',
        translations: [],
        match: 'none',
        notes: 'New Testament only. The API has no Khmer translation.',
    },
    {
        id: '58_greek',
        language: 'grc',
        name: 'Koine Greek',
        narratedText: "Scrivener's Textus Receptus (1894)",
        zipId: '58',
        books: 'nt',
        translations: ['grc_gtr'],
        match: 'exact',
        notes: 'New Testament only. The Old Testament pages are leftovers that link to Modern Greek audio.',
    },
    {
        id: '61_chinese_cat',
        language: 'cmn',
        name: 'Chinese Catholic (Mandarin)',
        narratedText: 'Si Gao Version (思高本)',
        zipId: '61',
        translations: [],
        match: 'none',
        notes: 'The API has no Catholic Chinese translation. Every Protestant Chinese translation scores 0.6 or less, and the canon differs.',
    },
    {
        id: '62_cantonese_cath',
        language: 'yue',
        name: 'Chinese Catholic (Cantonese)',
        narratedText: 'Si Gao Version (思高本)',
        zipId: '62',
        translations: [],
        match: 'none',
        notes: 'The API has no Catholic Chinese translation.',
    },
    {
        id: '63_finnish',
        language: 'fin',
        name: 'Finnish',
        narratedText: 'Raamattu (1933/1938)',
        zipId: '63',
        books: 'nt',
        translations: ['fin_bib'],
        match: 'poor',
        notes: 'New Testament only. The only Finnish translation in the API is a modern paraphrase (about 0.4).',
    },
    {
        id: '64_swedish',
        language: 'swe',
        name: 'Swedish',
        narratedText: 'Bibeln 1917',
        zipId: '64',
        host: AUDIO5_HOST,
        books: 'nt',
        translations: ['swe_fol'],
        match: 'poor',
        notes: 'New Testament only. The API has no 1917 translation; Folkbibeln is the closest (0.76).',
    },
    {
        id: '65_turkmen',
        language: 'tuk',
        name: 'Turkmen',
        narratedText: 'Turkmen New Testament (IBT)',
        zipId: '65',
        books: 'nt',
        translations: [],
        match: 'none',
        notes: 'New Testament only. The API has no Turkmen translation.',
    },
    {
        id: '67_ukrainian',
        language: 'ukr',
        name: 'Ukrainian',
        narratedText: 'Ohienko (1962)',
        zipId: '67',
        translations: ['ukr_pan', 'ukr_1996'],
        match: 'poor',
        notes: 'The API has no Ohienko translation; the Kulish translations are about 0.55 to 0.6 similar. Wordproject does not say which text the audio reads, so this assumes Ohienko like its text Bible.',
    },
    {
        id: '100_uhygur',
        language: 'uig',
        name: 'Uyghur',
        narratedText: 'Uyghur New Testament',
        zipId: '100',
        host: AUDIO5_HOST,
        books: 'nt',
        translations: ['uig_ara', 'uig_lat', 'uig_cyr', 'uig_pin'],
        match: 'unverified',
        notes: 'New Testament only. Wordproject has no Uyghur text to compare with. The four API translations are the same text in different scripts; uig_ara uses the Arabic script most Uyghur readers use.',
    },
    {
        id: '101_makhuwa',
        language: 'vmw',
        name: 'Makhuwa (Macua)',
        narratedText: 'Makhuwa New Testament',
        zipId: '101',
        host: AUDIO5_HOST,
        books: 'nt',
        translations: ['mgh_wft'],
        match: 'poor',
        notes: 'New Testament only. The API only has Makhuwa-Meetto (mgh), a related but different language from Makhuwa (vmw).',
    },
];

/**
 * Gets the book numbers (1 = GEN ... 66 = REV) that the given set has audio for.
 */
export function getBookNumbers(set: WordprojectAudioSet): number[] {
    const first = set.books === 'nt' ? 40 : 1;
    const numbers: number[] = [];
    for (let n = first; n <= 66; n++) {
        numbers.push(n);
    }
    return numbers;
}

/**
 * Gets the URLs to try, in order, for the zip of the given book.
 * @param set The audio set.
 * @param bookNumber The book number (1 = GEN ... 66 = REV).
 * @param extraHosts Hosts to try after the built-in ones.
 */
export function getZipUrls(
    set: WordprojectAudioSet,
    bookNumber: number,
    extraHosts: string[] = []
): string[] {
    const override = set.zipUrls?.[bookNumber];
    const fileName = override
        ? override.slice(override.lastIndexOf('/') + 1)
        : `${set.zipId}_${bookNumber}.zip`;
    const primary = override ?? `${set.host ?? DEFAULT_HOST}${fileName}`;

    const urls = [primary];
    for (const host of [...MIRROR_HOSTS, ...extraHosts]) {
        const url = `${host.endsWith('/') ? host : host + '/'}${fileName}`;
        if (!urls.includes(url)) {
            urls.push(url);
        }
    }
    return urls;
}

/**
 * Works out the chapter number of an audio file from its name inside a zip.
 * Uses the last number in the file name, so `1.mp3`, `17/1/1.mp3` and
 * `Bible_gk_19_psalm_001.mp3` give 1.
 * @param entryName The path of the file inside the zip.
 * @param chapterCount The number of chapters in the book.
 * @param mp3Count The number of mp3 files in the zip.
 * @returns The chapter number, or null if it can't be worked out.
 */
export function getChapterFromEntryName(
    entryName: string,
    chapterCount: number,
    mp3Count: number
): number | null {
    // Single chapter books are sometimes named after the book only, e.g. "31##obadiah.mp3" or "36_31.mp3"
    if (chapterCount === 1 && mp3Count === 1) {
        return 1;
    }
    const baseName = entryName
        .slice(entryName.lastIndexOf('/') + 1)
        .replace(/\.mp3$/i, '');
    const numbers = baseName.match(/\d+/g);
    if (numbers && numbers.length > 0) {
        return parseInt(numbers[numbers.length - 1], 10);
    }
    return null;
}
