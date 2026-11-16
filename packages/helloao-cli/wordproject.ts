import path from 'node:path';
import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import fsExtra from 'fs-extra';
import { DOMParser } from 'linkedom';
import { log } from '@helloao/tools';
import { bookOrderMap } from '@helloao/tools/generation/book-order.js';
import type {
    InputTranslationMetadata,
    License,
} from '@helloao/tools/generation/common-types.js';
import {
    configure as configureZip,
    TextWriter,
    Uint8ArrayReader,
    ZipReader,
} from '@zip.js/zip.js';
import { fetchWithRetry, mapConcurrent } from './fetch-bible.js';

const { exists } = fsExtra;

/**
 * The page that lists every Bible text that Wordproject publishes.
 */
export const WORDPROJECT_INDEX_URL =
    'https://www.wordproject.org/bibles/index.htm';

/**
 * The URL that the Bible texts are served under.
 */
export const WORDPROJECT_BIBLES_URL = 'https://www.wordproject.org/bibles/';

/**
 * The URL that Wordproject's whole-Bible zip downloads are served under.
 * Each zip holds the same chapter pages as the website (see https://www.wordproject.org/download/bibles/index.htm).
 */
export const WORDPROJECT_ZIP_URL =
    'https://www.wordpocket.org/bibles/download_zip/';

/**
 * Wordproject's statement about the copyright of the texts it publishes.
 */
export const WORDPROJECT_COPYRIGHT_URL =
    'https://www.wordproject.org/contact/new/copyrights.htm';

/**
 * The name of the file that is written into each translation directory that was fetched from Wordproject.
 * It records where the text came from so that translations that were already fetched can be skipped.
 */
export const WORDPROJECT_MARKER_FILE = 'wordproject.txt';

/**
 * A Bible text that is published on wordproject.org.
 */
export interface WordprojectTranslation {
    /**
     * The folder of the Bible on wordproject.org, relative to {@link WORDPROJECT_BIBLES_URL}, e.g. `kj` or `new/hau`.
     */
    path: string;

    /**
     * The ID that the translation is given in the Free Use Bible API.
     */
    id: string;

    /**
     * The ISO 639-3 code of the language.
     */
    language: string;

    /**
     * The name of the translation in its own language.
     */
    name: string;

    /**
     * The English name of the translation.
     */
    englishName: string;

    /**
     * The short name of the translation. Defaults to the ID in upper case.
     */
    shortName?: string;

    /**
     * The direction of the text. Defaults to `ltr`.
     */
    direction?: 'ltr' | 'rtl';

    /**
     * The API translation that has the same text, if any.
     * These translations are skipped unless `includeDuplicates` is set, since importing them would add a second copy of the same text.
     * Taken from the text comparison in tools/wordproject-audio.ts (only `exact` matches are listed).
     */
    duplicateOf?: string;

    /**
     * Whether the text is known to be in the public domain.
     * Wordproject does not publish license terms for its texts (see {@link WORDPROJECT_COPYRIGHT_URL}),
     * so every other text needs its license checked before it is published.
     */
    publicDomain?: boolean;

    /**
     * Whether verse texts start with the verse number of another versification, like `(22-1)`, that should be removed.
     */
    stripAltVerseNumbers?: boolean;

    /**
     * Notes about the text.
     */
    notes?: string;
}

/**
 * The Bible texts on wordproject.org.
 *
 * Two study editions are left out: `gb_py` (Pinyin with English glosses) and `gb_py_en` (English, Pinyin and Chinese on one page),
 * since they interleave several texts on each page.
 */
export const WORDPROJECT_TRANSLATIONS: WordprojectTranslation[] = [
    {
        path: 'ace',
        id: 'ace_wp',
        language: 'ace',
        name: 'Alkitab Lam Basa Aceh',
        englishName: 'Acehnese Bible (Wordproject)',
    },
    {
        path: 'af_2',
        id: 'afr_wp',
        language: 'afr',
        name: 'Bybel',
        englishName: 'Afrikaans Bible (Wordproject)',
    },
    {
        path: 'al',
        id: 'sqi_wp',
        language: 'sqi',
        name: 'Bibla e Shenjtë',
        englishName: 'Albanian Bible (Wordproject)',
    },
    {
        path: 'am',
        id: 'amh_wp',
        language: 'amh',
        name: 'መጽሐፍ ቅዱስ',
        englishName: 'Amharic Bible (Wordproject)',
        notes: 'The 1962 Haile Selassie Bible. A close, but not identical, copy is in the API as amh_amh.',
    },
    {
        path: 'ar',
        id: 'arb_wp',
        language: 'arb',
        name: 'الكتاب المقدس',
        englishName: 'Arabic Bible - Van Dyck (Wordproject)',
        direction: 'rtl',
        notes: 'The Van Dyck translation with vowel marks. A close, but not identical, copy is in the API as arb_vdv.',
    },
    {
        path: 'ben',
        id: 'ben_wp',
        language: 'ben',
        name: 'পবিত্র বাইবেল',
        englishName: 'Bengali Bible (Wordproject)',
    },
    {
        path: 'bg',
        id: 'bul_wp',
        language: 'bul',
        name: 'Българска Библия',
        englishName: 'Bulgarian Bible (Wordproject)',
    },
    {
        path: 'big5',
        id: 'cmn_wpcuvt',
        language: 'cmn',
        name: '聖經 (和合本)',
        englishName: 'Chinese Union Version - Traditional (Wordproject)',
        shortName: '和合本',
    },
    {
        path: 'big5_cath',
        id: 'cmn_wpsgt',
        language: 'cmn',
        name: '思高聖經',
        englishName:
            'Chinese Catholic Bible - Si Gao Version, Traditional (Wordproject)',
        shortName: '思高本',
    },
    {
        path: 'ceb',
        id: 'ceb_wp',
        language: 'ceb',
        name: 'Bibliya',
        englishName: 'Cebuano Bible (Wordproject)',
    },
    {
        path: 'cr',
        id: 'hrv_wp',
        language: 'hrv',
        name: 'Biblija',
        englishName: 'Croatian Bible (Wordproject)',
    },
    {
        path: 'cz',
        id: 'ces_wp',
        language: 'ces',
        name: 'Bible kralická',
        englishName: 'Czech Bible Kralická (Wordproject)',
        duplicateOf: 'ces_bkr',
        publicDomain: true,
    },
    {
        path: 'de',
        id: 'deu_wp',
        language: 'deu',
        name: 'Lutherbibel 1912',
        englishName: 'German Luther Bible 1912 (Wordproject)',
        duplicateOf: 'deu_l12',
        publicDomain: true,
    },
    {
        path: 'dk',
        id: 'dan_wp',
        language: 'dan',
        name: 'Bibelen',
        englishName: 'Danish Bible (Wordproject)',
    },
    {
        path: 'drc',
        id: 'eng_wpdrc',
        language: 'eng',
        name: 'Douay-Rheims Bible',
        englishName: 'Douay-Rheims Bible (Wordproject)',
        shortName: 'DRC',
        publicDomain: true,
    },
    {
        path: 'et',
        id: 'est_wp',
        language: 'est',
        name: 'Eestikeelne piibel',
        englishName: 'Estonian Bible (Wordproject)',
    },
    {
        path: 'fa',
        id: 'pes_wp',
        language: 'pes',
        name: 'کتاب مقدس',
        englishName: 'Persian Old Version (Wordproject)',
        direction: 'rtl',
        duplicateOf: 'pes_pbs',
    },
    {
        path: 'fi',
        id: 'fin_wp',
        language: 'fin',
        name: 'Raamattu',
        englishName: 'Finnish Bible 1933/1938 (Wordproject)',
    },
    {
        path: 'fj',
        id: 'fij_wp',
        language: 'fij',
        name: 'Ai Vola Tabu',
        englishName: 'Fijian Bible (Wordproject)',
    },
    {
        path: 'fr',
        id: 'fra_wp',
        language: 'fra',
        name: 'La Bible Louis Segond',
        englishName: 'French Louis Segond 1910 (Wordproject)',
        duplicateOf: 'fra_lsg',
        publicDomain: true,
    },
    {
        path: 'gb',
        id: 'cmn_wpcuvs',
        language: 'cmn',
        name: '圣经 (和合本)',
        englishName: 'Chinese Union Version - Simplified (Wordproject)',
        shortName: '和合本',
        duplicateOf: 'cmn_cuv',
    },
    {
        path: 'gb_cat',
        id: 'cmn_wpsgs',
        language: 'cmn',
        name: '思高圣经',
        englishName:
            'Chinese Catholic Bible - Si Gao Version, Simplified (Wordproject)',
        shortName: '思高本',
    },
    {
        path: 'gk',
        id: 'grc_wp',
        language: 'grc',
        name: 'Βίβλος',
        englishName: 'Greek Bible - Old Greek (Wordproject)',
    },
    {
        path: 'gk_2',
        id: 'ell_wp',
        language: 'ell',
        name: 'Βίβλος',
        englishName: 'Modern Greek Bible (Wordproject)',
    },
    {
        path: 'guj',
        id: 'guj_wp',
        language: 'guj',
        name: 'પવિત્ર બાઇબલ',
        englishName: 'Gujarati Bible (Wordproject)',
    },
    {
        path: 'he',
        id: 'heb_wp',
        language: 'heb',
        name: 'תנ״ך ובְּרִית הַחֲדָשָׁה',
        englishName: 'Hebrew Bible (Wordproject)',
        direction: 'rtl',
        duplicateOf: 'heb_mod',
    },
    {
        path: 'hu',
        id: 'hun_wp',
        language: 'hun',
        name: 'Károli Biblia',
        englishName: 'Hungarian Károli Bible (Wordproject)',
        notes: 'A close, but not identical, copy is in the API as hun_bib.',
    },
    {
        path: 'hy',
        id: 'hye_wp',
        language: 'hye',
        name: 'Հայերեն Աստվածաշունչ',
        englishName: 'Armenian Bible (Wordproject)',
    },
    {
        path: 'id_tb',
        id: 'ind_wp',
        language: 'ind',
        name: 'Alkitab Terjemahan Baru',
        englishName: 'Indonesian Terjemahan Baru (Wordproject)',
    },
    {
        path: 'ig',
        id: 'ibo_wp',
        language: 'ibo',
        name: 'Akwụkwọ Nsọ',
        englishName: 'Igbo Bible (Wordproject)',
    },
    {
        path: 'in',
        id: 'hin_wp',
        language: 'hin',
        name: 'पवित्र बाइबिल',
        englishName: 'Hindi Bible (Wordproject)',
    },
    {
        path: 'in_tr',
        id: 'hin_wprom',
        language: 'hin',
        name: 'Pavitra Baaibil',
        englishName: 'Hindi Bible - Romanized (Wordproject)',
    },
    {
        path: 'is',
        id: 'isl_wp',
        language: 'isl',
        name: 'Biblían',
        englishName: 'Icelandic Bible (Wordproject)',
    },
    {
        path: 'it',
        id: 'ita_wp',
        language: 'ita',
        name: 'La Sacra Bibbia Riveduta',
        englishName: 'Italian Riveduta 1927 (Wordproject)',
        duplicateOf: 'ita_riv',
    },
    {
        path: 'jp',
        id: 'jpn_wp',
        language: 'jpn',
        name: '口語訳',
        englishName: 'Japanese Kougo-yaku (Wordproject)',
        duplicateOf: 'jpn_kou',
    },
    {
        path: 'khmer',
        id: 'khm_wp',
        language: 'khm',
        name: 'ព្រះគម្ពីរខ្មែរ',
        englishName: 'Khmer Bible (Wordproject)',
    },
    {
        path: 'kj',
        id: 'eng_wpkjv',
        language: 'eng',
        name: 'King James Version',
        englishName: 'King James Version (Wordproject)',
        shortName: 'KJV',
        duplicateOf: 'eng_kjv',
        publicDomain: true,
    },
    {
        path: 'kk',
        id: 'kaz_wp',
        language: 'kaz',
        name: 'Қасиетті кітап',
        englishName: 'Kazakh Bible (Wordproject)',
    },
    {
        path: 'kn',
        id: 'kan_wp',
        language: 'kan',
        name: 'ಪವಿತ್ರ ಬೈಬಲ್',
        englishName: 'Kannada Bible (Wordproject)',
    },
    {
        path: 'kr',
        id: 'kor_wp',
        language: 'kor',
        name: '성경 개역한글판',
        englishName: 'Korean Revised Version (Wordproject)',
        duplicateOf: 'kor_old',
    },
    {
        path: 'lug',
        id: 'lug_wp',
        language: 'lug',
        name: "Baibuli y'Oluganda",
        englishName: 'Luganda Bible (Wordproject)',
    },
    {
        path: 'mar',
        id: 'mar_wp',
        language: 'mar',
        name: 'मराठी बायबल',
        englishName: 'Marathi Bible (Wordproject)',
    },
    {
        path: 'ml',
        id: 'mal_wp',
        language: 'mal',
        name: 'സത്യവേദപുസ്തകം',
        englishName: 'Malayalam Sathyavedapusthakam 1910 (Wordproject)',
        duplicateOf: 'mal_fbf',
    },
    {
        path: 'mn',
        id: 'khk_wp',
        language: 'khk',
        name: 'Монгол Ариун Библи',
        englishName: 'Mongolian Bible (Wordproject)',
    },
    {
        path: 'my',
        id: 'mya_wp',
        language: 'mya',
        name: 'သမ္မာကျမ်းစာ',
        englishName: 'Burmese Judson Bible (Wordproject)',
        duplicateOf: 'mya_jvb',
    },
    {
        path: 'ne',
        id: 'npi_wp',
        language: 'npi',
        name: 'पवित्र बाइबल (सरल नेपाली)',
        englishName: 'Nepali Bible (Wordproject)',
    },
    {
        path: 'new/hau',
        id: 'hau_wp',
        language: 'hau',
        name: 'Littafi Mai Tsarki',
        englishName: 'Hausa Bible (Wordproject)',
    },
    {
        path: 'new/kde',
        id: 'kde_wp',
        language: 'kde',
        name: 'Biblia Maconde',
        englishName: 'Makonde New Testament (Wordproject)',
    },
    {
        path: 'new/kik',
        id: 'kik_wp',
        language: 'kik',
        name: 'Kĩrĩkanĩro',
        englishName: 'Kikuyu Bible (Wordproject)',
    },
    {
        path: 'new/kin',
        id: 'kin_wp',
        language: 'kin',
        name: 'Isezerano Rishya',
        englishName: 'Kinyarwanda New Testament (Wordproject)',
    },
    {
        path: 'new/lin',
        id: 'lin_wp',
        language: 'lin',
        name: 'Biblia Mosantu',
        englishName: 'Lingala Bible (Wordproject)',
    },
    {
        path: 'new/mas',
        id: 'mas_wp',
        language: 'mas',
        name: 'Biblia Sinyati',
        englishName: 'Maasai New Testament (Wordproject)',
    },
    {
        path: 'new/orm',
        id: 'gaz_wp',
        language: 'gaz',
        name: 'Macaafa Qulqulluu',
        englishName: 'Oromo New Testament (Wordproject)',
    },
    {
        path: 'new/run',
        id: 'run_wp',
        language: 'run',
        name: 'Bibiliya Yera',
        englishName: 'Kirundi New Testament (Wordproject)',
    },
    {
        path: 'new/sna',
        id: 'sna_wp',
        language: 'sna',
        name: 'Bhaibheri Dzvene',
        englishName: 'Shona New Testament (Wordproject)',
    },
    {
        path: 'new/vmw',
        id: 'vmw_wp',
        language: 'vmw',
        name: 'Biblia Emakhuwa',
        englishName: 'Makhuwa New Testament (Wordproject)',
    },
    {
        path: 'new/yor',
        id: 'yor_wp',
        language: 'yor',
        name: 'Bibeli Mimọ',
        englishName: 'Yoruba Bible (Wordproject)',
    },
    {
        path: 'nl',
        id: 'nld_wp',
        language: 'nld',
        name: 'De Bijbel',
        englishName: 'Dutch Bible (Wordproject)',
    },
    {
        path: 'no',
        id: 'nno_wp',
        language: 'nno',
        name: 'Bibelen',
        englishName: 'Norwegian Nynorsk Bible (Wordproject)',
    },
    {
        path: 'or',
        id: 'ory_wp',
        language: 'ory',
        name: 'ପବିତ୍ର ବାଇବଲ',
        englishName: 'Oriya Bible (Wordproject)',
    },
    {
        path: 'pa',
        id: 'pan_wp',
        language: 'pan',
        name: 'ਬਾਇਬਲ',
        englishName: 'Punjabi Bible (Wordproject)',
    },
    {
        path: 'pl',
        id: 'pol_wp',
        language: 'pol',
        name: 'Biblia Gdańska',
        englishName: 'Polish Gdańsk Bible (Wordproject)',
    },
    {
        path: 'pn',
        id: 'cmn_wppy',
        language: 'cmn',
        name: 'Shèng Jīng',
        englishName: 'Chinese Union Version - Pinyin (Wordproject)',
    },
    {
        path: 'po-BR',
        id: 'por_wpacf',
        language: 'por',
        name: 'Almeida Corrigida Fiel',
        englishName: 'Portuguese Almeida Corrigida Fiel (Wordproject)',
        shortName: 'ACF',
    },
    {
        path: 'po',
        id: 'por_wparc',
        language: 'por',
        name: 'Almeida Revista e Corrigida',
        englishName: 'Portuguese Almeida Revista e Corrigida (Wordproject)',
        shortName: 'ARC',
    },
    {
        path: 'pus',
        id: 'pus_wp',
        language: 'pus',
        name: 'انجیل مقدس',
        englishName: 'Pashto Bible (Wordproject)',
        direction: 'rtl',
    },
    {
        path: 'ro',
        id: 'ron_wp',
        language: 'ron',
        name: 'Biblia Cornilescu',
        englishName: 'Romanian Cornilescu Bible (Wordproject)',
        notes: 'A close, but not identical, copy is in the API as ron_924.',
    },
    {
        path: 'ru',
        id: 'rus_wp',
        language: 'rus',
        name: 'Синодальный перевод',
        englishName: 'Russian Synodal Translation (Wordproject)',
        stripAltVerseNumbers: true,
        notes: 'A close, but not identical, copy is in the API as rus_syn.',
    },
    {
        path: 'se',
        id: 'swe_wp',
        language: 'swe',
        name: 'Bibeln 1917',
        englishName: 'Swedish Bible 1917 (Wordproject)',
    },
    {
        path: 'si',
        id: 'sin_wp',
        language: 'sin',
        name: 'ශුද්ධ වූ බයිබලය',
        englishName: 'Sinhala Bible (Wordproject)',
    },
    {
        path: 'so',
        id: 'som_wp',
        language: 'som',
        name: 'Kitaabka Quduuska Ah',
        englishName: 'Somali Bible (Wordproject)',
        duplicateOf: 'som_sim',
    },
    {
        path: 'sp',
        id: 'spa_wp',
        language: 'spa',
        name: 'Reina-Valera 1909',
        englishName: 'Spanish Reina-Valera 1909 (Wordproject)',
        duplicateOf: 'spa_r09',
        publicDomain: true,
    },
    {
        path: 'sr',
        id: 'srp_wp',
        language: 'srp',
        name: 'Српска Библија',
        englishName: 'Serbian Daničić-Karadžić Bible (Wordproject)',
        duplicateOf: 'srp_dkl',
    },
    {
        path: 'sw',
        id: 'swh_wp',
        language: 'swh',
        name: 'Biblia Takatifu',
        englishName: 'Swahili Union Version (Wordproject)',
    },
    {
        path: 'tel',
        id: 'tel_wp',
        language: 'tel',
        name: 'పవిత్ర బైబిల్',
        englishName: 'Telugu Bible (Wordproject)',
    },
    {
        path: 'ti',
        id: 'tha_wp',
        language: 'tha',
        name: 'พระคัมภีร์ไบเบิล',
        englishName: 'Thai KJV (Wordproject)',
        duplicateOf: 'tha_kjv',
    },
    {
        path: 'tk',
        id: 'tuk_wp',
        language: 'tuk',
        name: 'Mukaddes Kitap',
        englishName: 'Turkmen Bible (Wordproject)',
    },
    {
        path: 'tl',
        id: 'tgl_wp',
        language: 'tgl',
        name: 'Ang Dating Biblia',
        englishName: 'Tagalog Ang Dating Biblia 1905 (Wordproject)',
    },
    {
        path: 'tm',
        id: 'tam_wp',
        language: 'tam',
        name: 'வேதாகமம்',
        englishName: 'Tamil Bible (Wordproject)',
    },
    {
        path: 'tr',
        id: 'tur_wp',
        language: 'tur',
        name: 'Kutsal Kitap',
        englishName: 'Turkish Bible (Wordproject)',
    },
    {
        path: 'uk',
        id: 'ukr_wpo',
        language: 'ukr',
        name: 'Українська Біблія - Огієнко',
        englishName: 'Ukrainian Bible - Ohienko (Wordproject)',
    },
    {
        path: 'uk_ik',
        id: 'ukr_wpk',
        language: 'ukr',
        name: 'Українська Біблія - Хоменко',
        englishName: 'Ukrainian Bible - Khomenko (Wordproject)',
    },
    {
        path: 'ur',
        id: 'urd_wp',
        language: 'urd',
        name: 'انجیل مقدس',
        englishName: 'Urdu Bible (Wordproject)',
        direction: 'rtl',
    },
    {
        path: 'vg',
        id: 'lat_wp',
        language: 'lat',
        name: 'Biblia Sacra Vulgata',
        englishName: 'Latin Vulgate (Wordproject)',
        duplicateOf: 'lat_clv',
        publicDomain: true,
    },
    {
        path: 'vt',
        id: 'vie_wp',
        language: 'vie',
        name: 'Kinh Thánh',
        englishName: 'Vietnamese Bible 1934 (Wordproject)',
        duplicateOf: 'vie_1934',
        publicDomain: true,
    },
    {
        path: 'xho_2',
        id: 'xho_wp',
        language: 'xho',
        name: 'IZibhalo Ezingcwele',
        englishName: 'Xhosa Bible (Wordproject)',
    },
    {
        path: 'zu_2',
        id: 'zul_wp',
        language: 'zul',
        name: 'IBhayibheli',
        englishName: 'Zulu Bible (Wordproject)',
    },
];

/**
 * Maps the folder names that Wordproject uses for deuterocanonical books (in the Catholic Bibles) to book IDs.
 * The number is the protocanonical book that they follow.
 */
const DEUTEROCANONICAL_FOLDERS = new Map<string, string>([
    ['16_A', 'TOB'],
    ['16_B', 'JDT'],
    ['17_A', '1MA'],
    ['17_B', '2MA'],
    ['22_A', 'WIS'],
    ['22_B', 'SIR'],
    ['25_A', 'BAR'],
]);

/** Maps a book number (1 = GEN ... 66 = REV) to its book ID. */
const BOOK_ID_BY_NUMBER = new Map<number, string>(
    [...bookOrderMap].filter(([, n]) => n <= 66).map(([id, n]) => [n, id])
);

/**
 * A book that is listed on the index page of a Wordproject Bible.
 */
export interface WordprojectBookLink {
    /**
     * The USFM ID of the book.
     */
    bookId: string;

    /**
     * The name of the book as it is listed on the index page.
     */
    name: string;

    /**
     * The URL of the first page of the book (the first chapter, or a list of chapters).
     */
    url: string;
}

/**
 * A chapter that is linked from a Wordproject book page.
 */
export interface WordprojectChapterLink {
    number: number;
    url: string;
}

/**
 * Gets the book ID for a Wordproject book folder, like `01`, `B01`, `1` or `16_A`.
 * @returns The book ID, or null if the folder is not a known book.
 */
export function getWordprojectBookId(folder: string): string | null {
    const match = /^B?(\d+)(_[A-Z])?$/.exec(folder);
    if (!match) {
        return null;
    }
    const number = parseInt(match[1], 10);
    if (match[2]) {
        return (
            DEUTEROCANONICAL_FOLDERS.get(
                `${number.toString().padStart(2, '0')}${match[2]}`
            ) ?? null
        );
    }
    return BOOK_ID_BY_NUMBER.get(number) ?? null;
}

function parseHtml(html: string): Document {
    return new DOMParser().parseFromString(html, 'text/html') as any;
}

function cleanText(text: string | null | undefined): string {
    return (text ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Finds the books that are listed on the index page of a Wordproject Bible.
 * @param html The HTML of the index page.
 * @param pageUrl The URL of the index page.
 */
export function parseWordprojectIndex(
    html: string,
    pageUrl: string
): WordprojectBookLink[] {
    const document = parseHtml(html);
    const books: WordprojectBookLink[] = [];
    const seen = new Set<string>();
    for (const a of Array.from(document.querySelectorAll('a[href]'))) {
        const href = a.getAttribute('href')!;
        const match = /^([^/?#]+)\/[^/?#]+\.htm(?:#.*)?$/.exec(href);
        if (!match) {
            continue;
        }
        const bookId = getWordprojectBookId(match[1]);
        if (!bookId || seen.has(bookId)) {
            continue;
        }
        seen.add(bookId);
        books.push({
            bookId,
            name: cleanText(a.textContent),
            url: new URL(href, pageUrl).href.replace(/#.*$/, ''),
        });
    }
    return books;
}

/**
 * Finds the chapters that a Wordproject book page links to, including the page itself if it is a chapter.
 * @param html The HTML of the page.
 * @param pageUrl The URL of the page.
 */
export function parseWordprojectChapterLinks(
    html: string,
    pageUrl: string
): WordprojectChapterLink[] {
    const document = parseHtml(html);
    const chapters = new Map<number, string>();
    const add = (href: string) => {
        const match = /^C?(\d+)\.htm(?:#.*)?$/.exec(href);
        if (match) {
            const number = parseInt(match[1], 10);
            if (number > 0 && !chapters.has(number)) {
                chapters.set(
                    number,
                    new URL(href, pageUrl).href.replace(/#.*$/, '')
                );
            }
        }
    };
    add(pageUrl.slice(pageUrl.lastIndexOf('/') + 1));
    for (const a of Array.from(document.querySelectorAll('a[href]'))) {
        add(a.getAttribute('href')!);
    }
    return [...chapters]
        .sort(([a], [b]) => a - b)
        .map(([number, url]) => ({ number, url }));
}

export interface WordprojectChapterOptions {
    /**
     * Whether verse texts start with the verse number of another versification, like `(22-1)`, that should be removed.
     */
    stripAltVerseNumbers?: boolean;
}

/**
 * A run of text in a verse.
 */
export interface WordprojectText {
    text: string;

    /**
     * Whether the text is words of Jesus (red letter text).
     */
    wordsOfJesus?: boolean;
}

/**
 * A verse, or the part of a verse that is in one paragraph.
 */
export interface WordprojectVerse {
    number: string;
    content: WordprojectText[];
}

/**
 * The text of a chapter on a Wordproject page.
 */
export interface WordprojectChapter {
    /**
     * The title of the chapter (for example a Psalm title), if any.
     */
    title: string | null;

    /**
     * The paragraphs of the chapter. Each paragraph is a list of verses.
     * A verse that is split across paragraphs is listed in each of them, with the same number.
     */
    paragraphs: WordprojectVerse[][];

    /**
     * The numbers of the verses that have a verse number on the page but no text.
     */
    emptyVerses: string[];
}

type Token =
    | { type: 'text'; text: string; wordsOfJesus: boolean }
    | { type: 'verse'; number: string }
    | { type: 'paragraph' };

/**
 * Reads the text of a chapter from a Wordproject chapter page.
 *
 * Each verse starts with a `<span class="verse" id="N">`, except for the first verse which usually has no marker.
 * Words of Jesus (`<span class="word">`) are kept as separate runs of text.
 * @param html The HTML of the chapter page.
 * @param options The options.
 */
export function parseWordprojectChapter(
    html: string,
    options: WordprojectChapterOptions = {}
): WordprojectChapter {
    const document = parseHtml(html);
    const body = document.getElementById('textBody');
    if (!body) {
        throw new Error('The page has no #textBody element.');
    }

    let title = '';
    const tokens: Token[] = [];
    const visit = (node: Node, wordsOfJesus: boolean) => {
        for (const child of Array.from(node.childNodes)) {
            if (child.nodeType === 3) {
                tokens.push({
                    type: 'text',
                    text: child.textContent ?? '',
                    wordsOfJesus,
                });
                continue;
            }
            if (child.nodeType !== 1) {
                continue;
            }
            const element = child as Element;
            const tag = element.tagName.toLowerCase();
            const classes = (element.getAttribute('class') ?? '').split(/\s+/);
            if (
                /^h\d$/.test(tag) ||
                tag === 'script' ||
                tag === 'style' ||
                classes.includes('ym-noprint')
            ) {
                continue;
            }
            if (classes.includes('dimver')) {
                title += ' ' + (element.textContent ?? '');
                continue;
            }
            if (classes.includes('verse')) {
                const number =
                    cleanText(element.textContent) ||
                    element.getAttribute('id') ||
                    '';
                if (/^\d+[a-z]?(?:-\d+[a-z]?)?$/.test(number)) {
                    tokens.push({ type: 'verse', number });
                }
                continue;
            }
            if (tag === 'br') {
                tokens.push({ type: 'text', text: ' ', wordsOfJesus });
                continue;
            }
            if (tag === 'p' || tag === 'div') {
                tokens.push({ type: 'paragraph' });
                visit(element, wordsOfJesus);
                tokens.push({ type: 'paragraph' });
                continue;
            }
            visit(element, wordsOfJesus || classes.includes('word'));
        }
    };
    visit(body, false);

    const paragraphs: WordprojectVerse[][] = [];
    let paragraph: WordprojectVerse[] = [];
    let verse: WordprojectVerse | null = null;
    let verseCount = 0;
    const markers: string[] = [];
    const endParagraph = () => {
        if (paragraph.length > 0) {
            paragraphs.push(paragraph);
        }
        paragraph = [];
    };
    for (const token of tokens) {
        if (token.type === 'paragraph') {
            if (verse) {
                // The rest of the verse goes into the next paragraph.
                verse = { number: verse.number, content: [] };
            }
            endParagraph();
        } else if (token.type === 'verse') {
            verse = { number: token.number, content: [] };
            verseCount++;
            markers.push(token.number);
        } else {
            if (!verse) {
                if (/^\s*$/.test(token.text)) {
                    continue;
                }
                // The first verse has no marker.
                verse = { number: '1', content: [] };
                verseCount++;
            }
            if (paragraph[paragraph.length - 1] !== verse) {
                paragraph.push(verse);
            }
            const last = verse.content[verse.content.length - 1];
            if (last && !!last.wordsOfJesus === token.wordsOfJesus) {
                last.text += token.text;
            } else {
                verse.content.push(
                    token.wordsOfJesus
                        ? { text: token.text, wordsOfJesus: true }
                        : { text: token.text }
                );
            }
        }
    }
    endParagraph();

    for (const p of paragraphs) {
        for (const v of p) {
            v.content = cleanVerseContent(v.content, options);
        }
    }

    const cleaned = paragraphs
        .map((p) => p.filter((v) => v.content.length > 0))
        .filter((p) => p.length > 0);

    title = cleanText(title.replace(/\^\^/g, ''));
    if (options.stripAltVerseNumbers) {
        title = title.replace(/^\(\d+[-:]\d+\)\s*/, '');
    }
    return {
        title: title.length > 0 ? title : null,
        paragraphs: verseCount > 0 ? cleaned : [],
        emptyVerses: [...new Set(markers)].filter(
            (n) => !cleaned.some((p) => p.some((v) => v.number === n))
        ),
    };
}

/**
 * Collapses the whitespace in the runs of a verse, trims the start and end of the verse,
 * moves spaces at the edges of words of Jesus outside of them, and removes empty runs.
 */
function cleanVerseContent(
    content: WordprojectText[],
    options: WordprojectChapterOptions
): WordprojectText[] {
    // Split the spaces at the edges of the words of Jesus into their own runs, so that they can be collapsed with their neighbours.
    const runs: WordprojectText[] = [];
    for (const run of content) {
        const text = run.text.replace(/\^\^/g, '').replace(/\s+/g, ' ');
        if (!run.wordsOfJesus) {
            runs.push({ text });
            continue;
        }
        const match = /^( ?)(.*?)( ?)$/.exec(text)!;
        if (match[1]) runs.push({ text: ' ' });
        if (match[2]) runs.push({ text: match[2], wordsOfJesus: true });
        if (match[3]) runs.push({ text: ' ' });
    }

    const merged: WordprojectText[] = [];
    for (const run of runs) {
        const last = merged[merged.length - 1];
        if (last && !!last.wordsOfJesus === !!run.wordsOfJesus) {
            last.text += run.text;
        } else {
            merged.push({ ...run });
        }
    }
    for (const run of merged) {
        if (!run.wordsOfJesus) {
            run.text = run.text.replace(/ {2,}/g, ' ');
        }
    }
    if (merged.length > 0) {
        merged[0].text = merged[0].text.trimStart();
        if (options.stripAltVerseNumbers) {
            merged[0].text = merged[0].text.replace(/^\(\d+[-:]\d+\)\s*/, '');
        }
        const last = merged[merged.length - 1];
        last.text = last.text.trimEnd();
    }
    return merged.filter((r) => r.text.length > 0);
}

/**
 * Gets the plain text of a verse.
 */
export function getWordprojectVerseText(verse: WordprojectVerse): string {
    return verse.content.map((c) => c.text).join('');
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Converts the chapters of a book into USX 3.0.
 * @param bookId The USFM ID of the book.
 * @param name The name of the book.
 * @param chapters The chapters of the book.
 */
export function createWordprojectUsx(
    bookId: string,
    name: string,
    chapters: { number: number; chapter: WordprojectChapter }[]
): string {
    const lines = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<usx version="3.0">',
        `  <book code="${bookId}" style="id" />`,
    ];
    if (name) {
        const escaped = escapeXml(name);
        for (const style of ['h', 'toc1', 'toc2', 'mt1']) {
            lines.push(`  <para style="${style}">${escaped}</para>`);
        }
    }
    for (const { number, chapter } of chapters) {
        const chapterId = `${bookId} ${number}`;
        lines.push(
            `  <chapter number="${number}" style="c" sid="${chapterId}" />`
        );
        if (chapter.title) {
            lines.push(`  <para style="d">${escapeXml(chapter.title)}</para>`);
        }
        const verses = chapter.paragraphs.flat();
        let index = 0;
        for (const paragraph of chapter.paragraphs) {
            let xml = '';
            for (const verse of paragraph) {
                const verseId = `${chapterId}:${verse.number}`;
                const previous = verses[index - 1];
                const next = verses[index + 1];
                index++;
                // A verse that continues from the previous paragraph has no start marker.
                if (previous?.number !== verse.number) {
                    if (xml) xml += ' ';
                    xml += `<verse number="${verse.number}" style="v" sid="${verseId}" />`;
                }
                for (const run of verse.content) {
                    const text = escapeXml(run.text);
                    xml += run.wordsOfJesus
                        ? `<char style="wj">${text}</char>`
                        : text;
                }
                // A verse that continues in the next paragraph ends there.
                if (next?.number !== verse.number) {
                    xml += `<verse eid="${verseId}" />`;
                }
            }
            lines.push(`  <para style="p">${xml}</para>`);
        }
        lines.push(`  <chapter eid="${chapterId}" />`);
    }
    lines.push('</usx>');
    return lines.join('\n') + '\n';
}

/**
 * Creates the metadata.json contents for a Wordproject translation.
 */
export function createWordprojectMetadata(
    translation: WordprojectTranslation
): InputTranslationMetadata {
    const website = getWordprojectTranslationUrl(translation);
    const license: License | null = translation.publicDomain
        ? {
              publicDomain: true,
              attribution: 'not-required',
              commercialUse: 'allowed',
              derivatives: 'allowed',
              copyleft: false,
          }
        : null;
    return {
        id: translation.id,
        name: translation.name,
        englishName: translation.englishName,
        shortName: translation.shortName ?? translation.id.toUpperCase(),
        language: translation.language,
        direction: translation.direction ?? 'ltr',
        website,
        licenseUrl: WORDPROJECT_COPYRIGHT_URL,
        licenseNotice: translation.publicDomain
            ? `This text is in the public domain. It was downloaded from Wordproject (${website}).`
            : `This text was downloaded from Wordproject (${website}), which publishes it in good faith as a text that is believed to be in the public domain. See ${WORDPROJECT_COPYRIGHT_URL}.`,
        license,
    };
}

/**
 * Gets the URL of the index page of a Wordproject translation.
 */
export function getWordprojectTranslationUrl(
    translation: WordprojectTranslation
): string {
    return new URL(`${translation.path}/index.htm`, WORDPROJECT_BIBLES_URL)
        .href;
}

/**
 * Thrown when a page does not exist on the website.
 */
class PageNotFoundError extends Error {}

/**
 * Gets the URL of the zip download of a Wordproject translation.
 * Not every translation has one (the ones under `new/`, for example, don't).
 */
export function getWordprojectZipUrl(
    translation: WordprojectTranslation
): string {
    return `${WORDPROJECT_ZIP_URL}${translation.path.replace(/\//g, '_')}_new.zip`;
}

/**
 * Reads the pages of a Wordproject zip download.
 * The zip holds a folder (like `kj_new/`) with the same `index.htm` and chapter pages as the website.
 * @param data The contents of the zip file.
 * @param indexUrl The URL of the translation's index page on the website.
 * @returns The HTML of each page, by the URL that the page has on the website.
 */
export async function readWordprojectZip(
    data: Uint8Array,
    indexUrl: string
): Promise<Map<string, string>> {
    configureZip({ useWebWorkers: false });
    const zip = new ZipReader(new Uint8ArrayReader(data));
    try {
        const entries = (await zip.getEntries()).filter(
            (e) =>
                !e.directory &&
                /\.html?$/i.test(e.filename) &&
                !e.filename.startsWith('__MACOSX/')
        );
        // The root of the Bible is the folder with the shallowest index.htm.
        const index = entries
            .filter((e) => /(^|\/)index\.htm$/i.test(e.filename))
            .sort(
                (a, b) =>
                    a.filename.split('/').length - b.filename.split('/').length
            )[0];
        if (!index) {
            throw new Error('The zip has no index.htm.');
        }
        const root = index.filename.slice(
            0,
            index.filename.length - 'index.htm'.length
        );
        const pages = new Map<string, string>();
        for (const entry of entries) {
            if (!entry.filename.startsWith(root)) {
                continue;
            }
            const relative = entry.filename.slice(root.length);
            const url = new URL(relative, indexUrl).href;
            pages.set(url, await entry.getData!(new TextWriter('utf-8')));
        }
        return pages;
    } finally {
        await zip.close();
    }
}

/**
 * Downloads and reads the zip download of a Wordproject translation.
 * @returns The pages in the zip, or null if Wordproject has no zip for the translation.
 */
async function downloadWordprojectZip(
    zipUrl: string,
    indexUrl: string,
    fetchPage: (url: string) => Promise<Response>
): Promise<Map<string, string> | null> {
    const logger = log.getLogger();
    let response: Response;
    try {
        response = await fetchPage(zipUrl);
    } catch (err) {
        logger.warn(
            `Could not download ${zipUrl}: ${err instanceof Error ? err.message : err}`
        );
        return null;
    }
    if (!response.ok) {
        await response.body?.cancel();
        return null;
    }
    const data = new Uint8Array(await response.arrayBuffer());
    // Missing zips may be answered with an HTML page.
    if (data.length < 4 || data[0] !== 0x50 || data[1] !== 0x4b) {
        return null;
    }
    try {
        return await readWordprojectZip(data, indexUrl);
    } catch (err) {
        logger.warn(
            `Could not read ${zipUrl}: ${err instanceof Error ? err.message : err}`
        );
        return null;
    }
}

/**
 * Finds the Wordproject translations with the given IDs or Wordproject folders.
 * @param ids The translation IDs (like `amh_wp`) or Wordproject folders (like `am` or `new/hau`).
 */
export function findWordprojectTranslations(
    ids: string[],
    translations: WordprojectTranslation[] = WORDPROJECT_TRANSLATIONS
): WordprojectTranslation[] {
    const result: WordprojectTranslation[] = [];
    for (const id of ids) {
        const translation = translations.find(
            (t) => t.id === id || t.path === id
        );
        if (!translation) {
            throw new Error(
                `Unknown Wordproject translation "${id}". Run list-wordproject-translations to see the IDs.`
            );
        }
        if (!result.includes(translation)) {
            result.push(translation);
        }
    }
    return result;
}

/**
 * The options for fetching Wordproject translations.
 */
export interface FetchWordprojectTranslationsOptions {
    /**
     * The IDs (or Wordproject folders) of the translations to fetch. Defaults to every translation that is not a duplicate.
     */
    translations?: string[];

    /**
     * Whether translations that the API already has a copy of should be fetched when no translations are given.
     */
    includeDuplicates?: boolean;

    /**
     * Whether only translations that are known to be in the public domain should be fetched.
     */
    publicDomainOnly?: boolean;

    /**
     * Whether translations that were already fetched should be downloaded again.
     */
    overwrite?: boolean;

    /**
     * The directory that books are saved to while a translation is being downloaded.
     * Defaults to `<dir>.partial`, so that unfinished translations are not picked up by import-translations.
     */
    partialDir?: string;

    /**
     * The number of pages to download at once. Defaults to 4.
     */
    concurrency?: number;

    /**
     * Whether to download each Bible as a zip file when Wordproject offers one. Defaults to true.
     * Bibles without a zip (and pages missing from a zip) are downloaded page by page from the website.
     */
    zip?: boolean;

    /**
     * The catalog to pick translations from. Defaults to {@link WORDPROJECT_TRANSLATIONS}.
     */
    catalog?: WordprojectTranslation[];

    /**
     * The function used to download pages. Defaults to {@link fetchWithRetry}.
     */
    fetch?: (url: string) => Promise<Response>;
}

/**
 * Picks the translations that should be fetched.
 */
export function selectWordprojectTranslations(
    options: FetchWordprojectTranslationsOptions
): WordprojectTranslation[] {
    const catalog = options.catalog ?? WORDPROJECT_TRANSLATIONS;
    let selected =
        options.translations && options.translations.length > 0
            ? findWordprojectTranslations(options.translations, catalog)
            : catalog.filter(
                  (t) => options.includeDuplicates || !t.duplicateOf
              );
    if (options.publicDomainOnly) {
        selected = selected.filter((t) => t.publicDomain);
    }
    return selected;
}

/**
 * Downloads Bible texts from wordproject.org and converts them into USX 3.0.
 *
 * Each translation is written to `<dir>/<id>/` as one USX file per book plus a `metadata.json`,
 * so the directory can be imported with the import-translations command.
 * Books are saved to `<dir>.partial/<id>/` as they are downloaded, so an interrupted download continues where it stopped.
 * The translation's directory is only replaced once every book has been downloaded.
 * @param dir The directory that the translations should be written to.
 * @param options The options.
 * @returns The IDs of the translations that were downloaded.
 */
export async function fetchWordprojectTranslations(
    dir: string,
    options: FetchWordprojectTranslationsOptions = {}
): Promise<string[]> {
    const logger = log.getLogger();
    const translations = selectWordprojectTranslations(options);
    const concurrency = options.concurrency ?? 4;
    const fetchPage = options.fetch ?? ((url: string) => fetchWithRetry(url));
    const downloaded: string[] = [];
    const failed: string[] = [];

    const getPage = async (url: string): Promise<string> => {
        const response = await fetchPage(url);
        if (!response.ok) {
            await response.body?.cancel();
            const message = `Failed to download ${url}: ${response.status} ${response.statusText}`;
            throw response.status === 404
                ? new PageNotFoundError(message)
                : new Error(message);
        }
        return await response.text();
    };

    logger.log(`Fetching ${translations.length} Wordproject translation(s).`);

    for (const translation of translations) {
        const translationDir = path.resolve(dir, translation.id);
        const partDir = path.resolve(
            options.partialDir ?? `${path.resolve(dir)}.partial`,
            translation.id
        );
        const indexUrl = getWordprojectTranslationUrl(translation);
        const metadata =
            JSON.stringify(createWordprojectMetadata(translation), null, 4) +
            '\n';

        if (
            !options.overwrite &&
            (await exists(path.join(translationDir, WORDPROJECT_MARKER_FILE)))
        ) {
            // Keep the metadata up to date with the catalog without downloading the text again.
            await writeFile(
                path.join(translationDir, 'metadata.json'),
                metadata,
                'utf-8'
            );
            logger.log(
                `${translation.id} was already downloaded. Skipping. (Use --overwrite to download it again.)`
            );
            continue;
        }

        if (!translation.publicDomain) {
            logger.warn(
                `${translation.id}: Wordproject does not publish license terms for this text. Check that it may be published before importing it.`
            );
        }

        try {
            let zipPages: Map<string, string> | null = null;
            let source = indexUrl;
            if (options.zip !== false) {
                const zipUrl = getWordprojectZipUrl(translation);
                zipPages = await downloadWordprojectZip(
                    zipUrl,
                    indexUrl,
                    fetchPage
                );
                if (zipPages) {
                    source = zipUrl;
                    logger.log(
                        `Downloaded ${translation.id} from ${zipUrl} (${zipPages.size} pages)`
                    );
                } else {
                    logger.log(
                        `${translation.id} has no zip download. Downloading each chapter from ${indexUrl}`
                    );
                }
            } else {
                logger.log(`Downloading ${translation.id} from ${indexUrl}`);
            }
            let missingFromZip = 0;
            let incompleteInZip = 0;
            const getTranslationPage = async (url: string) => {
                const page = zipPages?.get(url);
                if (page !== undefined) {
                    return page;
                }
                if (zipPages) {
                    missingFromZip++;
                }
                return await getPage(url);
            };

            const books = parseWordprojectIndex(
                await getTranslationPage(indexUrl),
                indexUrl
            );
            if (books.length === 0) {
                throw new Error(`No books were found on ${indexUrl}`);
            }

            await mkdir(partDir, { recursive: true });
            const existing = new Set(await readdir(partDir));

            let bookCount = 0;
            for (const book of books) {
                const fileName = `${book.bookId.toLowerCase()}.usx`;
                if (existing.has(fileName)) {
                    bookCount++;
                    continue;
                }
                const firstPage = await getTranslationPage(book.url);
                const links = parseWordprojectChapterLinks(firstPage, book.url);
                if (links.length === 0) {
                    logger.warn(
                        `${translation.id} ${book.bookId}: no chapters were found on ${book.url}. Skipping.`
                    );
                    continue;
                }
                const chapters = await mapConcurrent(
                    links,
                    concurrency,
                    async (link) => {
                        let html: string;
                        try {
                            html =
                                link.url === book.url
                                    ? firstPage
                                    : await getTranslationPage(link.url);
                        } catch (err) {
                            // Some pages link to chapters that don't exist (like chapter 3 of Obadiah in gb_cat).
                            if (err instanceof PageNotFoundError) {
                                logger.warn(
                                    `${translation.id} ${book.bookId}: chapter ${link.number} does not exist (${link.url}). Skipping it.`
                                );
                                return {
                                    number: link.number,
                                    chapter: null,
                                };
                            }
                            throw err;
                        }
                        const parseOptions = {
                            stripAltVerseNumbers:
                                translation.stripAltVerseNumbers,
                        };
                        let chapter = parseWordprojectChapter(
                            html,
                            parseOptions
                        );
                        // Some zips are older than the website and are missing the text of some verses.
                        // Use the website's copy of those chapters when it is more complete.
                        if (
                            zipPages?.has(link.url) &&
                            (chapter.emptyVerses.length > 0 ||
                                chapter.paragraphs.length === 0)
                        ) {
                            try {
                                const web = parseWordprojectChapter(
                                    await getPage(link.url),
                                    parseOptions
                                );
                                if (
                                    web.paragraphs.length > 0 &&
                                    (chapter.paragraphs.length === 0 ||
                                        web.emptyVerses.length <
                                            chapter.emptyVerses.length)
                                ) {
                                    chapter = web;
                                    incompleteInZip++;
                                }
                            } catch (err) {
                                logger.warn(
                                    `${translation.id} ${book.bookId} ${link.number}: could not download the chapter from the website: ${err instanceof Error ? err.message : err}`
                                );
                            }
                        }
                        return { number: link.number, chapter };
                    }
                );
                const found = chapters.filter(
                    (c): c is { number: number; chapter: WordprojectChapter } =>
                        c.chapter !== null
                );
                const withEmptyVerses = found.filter(
                    (c) =>
                        c.chapter.paragraphs.length > 0 &&
                        c.chapter.emptyVerses.length > 0
                );
                if (withEmptyVerses.length > 0) {
                    logger.warn(
                        `${translation.id} ${book.bookId}: verses with no text: ${withEmptyVerses.map((c) => `${c.number}:${c.chapter.emptyVerses.join(',')}`).join('; ')}`
                    );
                }
                const empty = found.filter(
                    (c) => c.chapter.paragraphs.length === 0
                );
                if (empty.length > 0) {
                    logger.warn(
                        `${translation.id} ${book.bookId}: no verses were found in chapter(s) ${empty.map((c) => c.number).join(', ')}`
                    );
                }
                const nonEmpty = found.filter(
                    (c) => c.chapter.paragraphs.length > 0
                );
                if (nonEmpty.length === 0) {
                    continue;
                }
                const usx = createWordprojectUsx(
                    book.bookId,
                    book.name,
                    nonEmpty
                );
                const filePath = path.join(partDir, fileName);
                await writeFile(`${filePath}.tmp`, usx, 'utf-8');
                await rename(`${filePath}.tmp`, filePath);
                bookCount++;
                logger.log(
                    `${translation.id} ${book.bookId}: ${nonEmpty.length} chapter(s)`
                );
            }

            if (bookCount === 0) {
                throw new Error('No books could be converted.');
            }
            if (incompleteInZip > 0) {
                logger.log(
                    `${translation.id}: ${incompleteInZip} chapter(s) were incomplete in the zip and were downloaded from the website.`
                );
            }
            if (missingFromZip > 0) {
                logger.log(
                    `${translation.id}: ${missingFromZip} page(s) were missing from the zip and were downloaded from the website.`
                );
            }

            await writeFile(
                path.join(partDir, 'metadata.json'),
                metadata,
                'utf-8'
            );
            await writeFile(
                path.join(partDir, WORDPROJECT_MARKER_FILE),
                `Source: ${source}\n`,
                'utf-8'
            );
            await rm(translationDir, { recursive: true, force: true });
            await mkdir(path.dirname(translationDir), { recursive: true });
            await rename(partDir, translationDir);
            logger.log(
                `Saved ${translation.id} (${bookCount} books) to ${translationDir}`
            );
            downloaded.push(translation.id);
        } catch (err) {
            // Keep the partial directory so that the next run continues where this one stopped.
            logger.error(
                `Failed to download ${translation.id}: ${err instanceof Error ? err.message : err}`
            );
            failed.push(translation.id);
        }
    }

    if (failed.length > 0) {
        throw new Error(
            `Failed to download ${failed.length} Wordproject translation(s): ${failed.join(', ')}. Run the command again to continue.`
        );
    }

    return downloaded;
}
