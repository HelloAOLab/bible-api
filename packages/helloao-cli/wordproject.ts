import path from 'node:path';
import { existsSync } from 'node:fs';
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
     * The API translation that has the same text (or a close edition of it) and is at least as complete, if any.
     * Importing these would add a second copy of the same text, so they are never downloaded by default.
     *
     * Found by comparing the text of 7 chapters (GEN 1, PSA 23, ISA 53, MAT 5, JHN 3, ROM 8, REV 22) of each Wordproject Bible
     * with every API translation in the same language (character similarity after removing punctuation and diacritics),
     * and comparing their numbers of books. A similarity of 0.85 or more counts as the same text.
     * Texts that are the same as an API translation with fewer books (like amh_amh) are not duplicates.
     */
    duplicateOf?: string;

    /**
     * Whether the text is known to be in the public domain.
     * Wordproject does not publish license terms for its texts (see {@link WORDPROJECT_COPYRIGHT_URL}),
     * so every other text needs its license checked before it is published.
     */
    publicDomain?: boolean;

    /**
     * The license of a text that is not in the public domain but may be published under some terms.
     * Written to the translation's metadata.json, along with {@link licenseNotice} and {@link licenseUrl}.
     */
    license?: License;

    /**
     * The notice that should be shown with the text. Defaults to a notice about where the text came from.
     */
    licenseNotice?: string;

    /**
     * The URL of the license. Defaults to {@link WORDPROJECT_COPYRIGHT_URL}.
     */
    licenseUrl?: string;

    /**
     * What a search for the text's copyright found (see wordproject-licenses.md):
     * - `public-domain`: the text is in the public domain.
     * - `non-commercial`: the text may be published, but not used commercially.
     * - `copyrighted`: the text is copyrighted, so it must not be published.
     * - `unknown`: the edition or its status could not be determined.
     *
     * Not set for the texts that the API already has (see {@link duplicateOf}), which weren't checked.
     */
    licenseStatus?:
        | 'public-domain'
        | 'non-commercial'
        | 'copyrighted'
        | 'unknown';

    /**
     * The edition that the text was identified as when its copyright was checked.
     */
    identifiedAs?: string;

    /**
     * Whether the text is downloaded when no translations are given.
     * Only set for texts that the API doesn't already have (or has a less complete copy of) and that may be published.
     */
    includeByDefault?: boolean;

    /**
     * Whether the text replaces a translation with the same ID that comes from another source (like eBible).
     * That translation is not downloaded by source-translations, and import-translations only imports its Wordproject copy
     * (see {@link isReplacedByWordproject}), so that the two copies aren't mixed.
     * Sync configs should exclude it from the other source instead (see sync.config.example.json).
     */
    replacesExisting?: boolean;

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
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Alkitab Bahasa Aceh (Acehnese Bible), Lembaga Alkitab Indonesia (LAI); identical Gen 1:1 incl. 'atawa' alternative readings appears on bible.com version 2835 (LAIACE)",
    },
    {
        path: 'af_2',
        id: 'afr_wp',
        language: 'afr',
        name: 'Bybel',
        englishName: 'Afrikaans Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Afrikaans Bybel 1933/1953 (Ou Vertaling, 1953 revised edition), Bybelgenootskap van Suid-Afrika (Bible Society of South Africa)',
    },
    {
        path: 'al',
        id: 'sqi_wp',
        language: 'sqi',
        name: 'Bibla e Shenjtë',
        englishName: 'Albanian Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Albanian Bible (Bibla e Shenjtë, 1994), Albanian Bible Society / Albanian Bible Institute, translated from the Italian Nuova Diodati (1991). Same text as Unbound Bible / BibleGateway 'ALB'",
    },
    {
        path: 'am',
        id: 'amh_amh',
        language: 'amh',
        name: 'መጽሐፍ ቅዱስ',
        englishName: 'Amharic Bible (1962)',
        shortName: 'AMH',
        notes: 'The complete Bible of the text that the API had as amh_amh from eBible, which only has the New Testament. It replaces that copy.',
        replacesExisting: true,
        licenseStatus: 'non-commercial',
        identifiedAs:
            "Amharic Bible 1962 ('Haile Selassie Bible'), Bible Society of Ethiopia / United Bible Societies",
        includeByDefault: true,
        license: {
            publicDomain: false,
            attribution: 'required',
            commercialUse: 'not-allowed',
            derivatives: 'not-allowed',
            copyleft: false,
        },
        licenseNotice:
            'Copyright © 1962, 2003 United Bible Societies. Used for non-commercial purposes only; commercial use requires written permission from the Bible Society of Ethiopia.',
        licenseUrl: 'https://ebible.org/amh/copyright.htm',
    },
    {
        path: 'ar',
        id: 'arb_wp',
        language: 'arb',
        name: 'الكتاب المقدس',
        englishName: 'Arabic Bible - Van Dyck (Wordproject)',
        direction: 'rtl',
        duplicateOf: 'arb_vdv',
        notes: 'Same text as arb_vdv (Van Dyck).',
    },
    {
        path: 'ben',
        id: 'ben_wp',
        language: 'ben',
        name: 'পবিত্র বাইবেল',
        englishName: 'Bengali Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Bengali Holy Bible: Easy-to-Read Version (ERV-BN), (c) 2001-2006 World Bible Translation Center (now Bible League International)',
    },
    {
        path: 'bg',
        id: 'bul_wp',
        language: 'bul',
        name: 'Българска Библия',
        englishName: 'Bulgarian Bible (Wordproject)',
        licenseStatus: 'unknown',
        identifiedAs:
            'Bulgarian Bible 1940 (Synodal/Bible Society edition of 1940) in modern spelling, probably via the Bibliata.com digital text (BG1940)',
    },
    {
        path: 'big5',
        id: 'cmn_wpcuvt',
        language: 'cmn',
        name: '聖經 (和合本)',
        englishName: 'Chinese Union Version - Traditional (Wordproject)',
        shortName: '和合本',
        duplicateOf: 'cmn_cuvmpt',
        notes: 'Same text as cmn_cuvmpt (Chinese Union Version, Traditional).',
    },
    {
        path: 'big5_cath',
        id: 'cmn_wpsgt',
        language: 'cmn',
        name: '思高聖經',
        englishName:
            'Chinese Catholic Bible - Si Gao Version, Traditional (Wordproject)',
        shortName: '思高本',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Studium Biblicum Version (思高聖經), complete Bible 1968, Studium Biblicum O.F.M., Hong Kong (Traditional characters)',
    },
    {
        path: 'ceb',
        id: 'ceb_wp',
        language: 'ceb',
        name: 'Bibliya',
        englishName: 'Cebuano Bible (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Ang Biblia (Cebuano 'Bugna' Version), 1917, American Bible Society / Philippine Bible Society (inferred from the wording)",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'cr',
        id: 'hrv_wp',
        language: 'hrv',
        name: 'Biblija',
        englishName: 'Croatian Bible (Wordproject)',
        notes: 'The same text as hrv_iva, which is missing Esther.',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Croatian 'Zagrebačka Biblija' (Zagreb Bible, 1968; ed. Jure Kaštelan & Bonaventura Duda), Kršćanska sadašnjost, Zagreb (identification by inference). Same text that the Unbound Bible / CrossWire 'CroSaric' module mislabels as the Šarić Bible",
    },
    {
        path: 'cz',
        id: 'ces_wp',
        language: 'ces',
        name: 'Bible kralická',
        englishName: 'Czech Bible Kralická (Wordproject)',
        publicDomain: true,
        duplicateOf: 'ces_bkr',
        notes: 'Same text as ces_bkr.',
    },
    {
        path: 'de',
        id: 'deu_wp',
        language: 'deu',
        name: 'Lutherbibel 1912',
        englishName: 'German Luther Bible 1912 (Wordproject)',
        publicDomain: true,
        duplicateOf: 'deu_l12',
        notes: 'Same text as deu_l12.',
    },
    {
        path: 'dk',
        id: 'dan_wp',
        language: 'dan',
        name: 'Bibelen',
        englishName: 'Danish Bible (Wordproject)',
        duplicateOf: 'dan_det',
        notes: 'Same text as dan_det.',
    },
    {
        path: 'drc',
        id: 'eng_wpdrc',
        language: 'eng',
        name: 'Douay-Rheims Bible',
        englishName: 'Douay-Rheims Bible (Wordproject)',
        shortName: 'DRC',
        publicDomain: true,
        duplicateOf: 'eng_dra',
        notes: 'The same Douay-Rheims (Challoner) text as eng_dra, which also has the deuterocanonical books.',
    },
    {
        path: 'et',
        id: 'est_wp',
        language: 'est',
        name: 'Eestikeelne piibel',
        englishName: 'Estonian Bible (Wordproject)',
        notes: 'ekk_bib in the API is a different text that only has the New Testament.',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Estonian Bible, Eesti Piibliselts tradition: wordproject calls it 'Eestikeelne Piibel 1997' (the 1997 Estonian Bible Society edition, a revision of the 1968 Kõpp/Pold Bible). Near-identical to CrossWire 'Est' (Gen 1:1 there reads 'taevad ja maa' instead of 'taeva ja maa')",
    },
    {
        path: 'fa',
        id: 'pes_wp',
        language: 'pes',
        name: 'کتاب مقدس',
        englishName: 'Persian Old Version (Wordproject)',
        direction: 'rtl',
        duplicateOf: 'pes_pbs',
        notes: 'Same text as pes_pbs.',
    },
    {
        path: 'fi',
        id: 'fin_wp',
        language: 'fin',
        name: 'Raamattu',
        englishName: 'Finnish Bible 1933/1938 (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            'Finnish Kirkkoraamattu 1933/1938 (Pyhä Raamattu; OT adopted by the Church Assembly in 1933, NT in 1938), Evangelical Lutheran Church of Finland',
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'fj',
        id: 'fij_wp',
        language: 'fij',
        name: 'Ai Vola Tabu',
        englishName: 'Fijian Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Modern Fijian translation, most likely the Fijian New Version (Ai Vola Tabu ena Vakavakadewa Vou), Bible Society in the South Pacific. It is NOT the 1902 Langham 'Fijian Old Version'.",
    },
    {
        path: 'fr',
        id: 'fra_wp',
        language: 'fra',
        name: 'La Bible Louis Segond',
        englishName: 'French Louis Segond 1910 (Wordproject)',
        publicDomain: true,
        duplicateOf: 'fra_lsg',
        notes: 'Same text as fra_lsg.',
    },
    {
        path: 'gb',
        id: 'cmn_wpcuvs',
        language: 'cmn',
        name: '圣经 (和合本)',
        englishName: 'Chinese Union Version - Simplified (Wordproject)',
        shortName: '和合本',
        duplicateOf: 'cmn_cu1',
        notes: 'Same text as cmn_cu1 and cmn_cuvmps (Chinese Union Version, Simplified).',
    },
    {
        path: 'gb_cat',
        id: 'cmn_wpsgs',
        language: 'cmn',
        name: '思高圣经',
        englishName:
            'Chinese Catholic Bible - Si Gao Version, Simplified (Wordproject)',
        shortName: '思高本',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Studium Biblicum Version (思高圣经), 1968, Studium Biblicum O.F.M., Hong Kong (Simplified-character conversion)',
    },
    {
        path: 'gk',
        id: 'grc_wp',
        language: 'grc',
        name: 'Βίβλος',
        englishName: 'Greek Bible - Old Greek (Wordproject)',
        duplicateOf: 'grc_gtr',
        notes: 'The New Testament is the Textus Receptus (grc_gtr) and the Old Testament is the Modern Greek text of ell_wp.',
    },
    {
        path: 'gk_2',
        id: 'ell_wp',
        language: 'ell',
        name: 'Βίβλος',
        englishName: 'Modern Greek Bible (Wordproject)',
        notes: 'The New Testament is in Ancient Greek (polytonic).',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "OT: Spyros Filos's demotic revision of the Vamvas Bible (FPB, 'Filos Pergamos Bible', 1994; latest edition 2013), Pergamos Publications, Athens. NT: a polytonic Byzantine/Textus-Receptus-type Ancient Greek NT, edition not identified",
    },
    {
        path: 'guj',
        id: 'guj_wp',
        language: 'guj',
        name: 'પવિત્ર બાઇબલ',
        englishName: 'Gujarati Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Gujarati Holy Bible: Easy-to-Read Version (ERV-GU), (c) 1997-2009 World Bible Translation Center',
    },
    {
        path: 'he',
        id: 'heb_wp',
        language: 'heb',
        name: 'תנ״ך ובְּרִית הַחֲדָשָׁה',
        englishName: 'Hebrew Bible (Wordproject)',
        direction: 'rtl',
        duplicateOf: 'heb_mod',
        notes: 'Same text as heb_mod.',
    },
    {
        path: 'hu',
        id: 'hun_wp',
        language: 'hun',
        name: 'Károli Biblia',
        englishName: 'Hungarian Károli Bible (Wordproject)',
        notes: 'The same Károli text as hun_bib, which only has the New Testament.',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Hungarian Károli Bible, 1908 revised edition (revideált Károli, revision of Gáspár Károli's 1590 translation, sponsored by the British and Foreign Bible Society)",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'hy',
        id: 'hye_wp',
        language: 'hye',
        name: 'Հայերեն Աստվածաշունչ',
        englishName: 'Armenian Bible (Wordproject)',
        licenseStatus: 'unknown',
        identifiedAs:
            'Western Armenian Bible in classical orthography (full OT+NT); exact edition not identified. Possibly a Bible Society Western Armenian edition (inference).',
    },
    {
        path: 'id_tb',
        id: 'ind_wp',
        language: 'ind',
        name: 'Alkitab Terjemahan Baru',
        englishName: 'Indonesian Terjemahan Baru (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Alkitab Terjemahan Baru (TB), 1974, Lembaga Alkitab Indonesia',
    },
    {
        path: 'ig',
        id: 'ibo_wp',
        language: 'ibo',
        name: 'Akwụkwọ Nsọ',
        englishName: 'Igbo Bible (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Union Igbo Bible ('Bible Nso', Union Version), NT c.1906-1909, complete Bible 1913, translated by Archdeacon Thomas John Dennis (CMS) with Igbo collaborators, published by the British and Foreign Bible Society; currently reprinted by the Bible Society of Nigeria (bible.com IGBOB, (c) 1906, 2006 BSN).",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'in',
        id: 'hin_wp',
        language: 'hin',
        name: 'पवित्र बाइबिल',
        englishName: 'Hindi Bible (Wordproject)',
        duplicateOf: 'HINIRV',
        notes: 'A close edition of HINIRV (Hindi Indian Revised Version).',
    },
    {
        path: 'in_tr',
        id: 'hin_wprom',
        language: 'hin',
        name: 'Pavitra Baaibil',
        englishName: 'Hindi Bible - Romanized (Wordproject)',
        notes: 'A Hindi Bible in the Latin alphabet.',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Romanized transliteration of the Hindi Bible 'Old Version' (O.V.), Bible Society of India (originally BFBS), the same text as wordproject's Devanagari Hindi Bible (/bibles/in/)",
    },
    {
        path: 'is',
        id: 'isl_wp',
        language: 'isl',
        name: 'Biblían',
        englishName: 'Icelandic Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Icelandic Bible 1981 (Biblían – Heilög ritning, 10th Icelandic Bible; OT a light revision of 1912, new NT), Hið íslenska biblíufélag (Icelandic Bible Society)',
    },
    {
        path: 'it',
        id: 'ita_wp',
        language: 'ita',
        name: 'La Sacra Bibbia Riveduta',
        englishName: 'Italian Riveduta 1927 (Wordproject)',
        duplicateOf: 'ita_riv',
        notes: 'Same text as ita_riv.',
    },
    {
        path: 'jp',
        id: 'jpn_wp',
        language: 'jpn',
        name: '口語訳',
        englishName: 'Japanese Kougo-yaku (Wordproject)',
        duplicateOf: 'jpn_kou',
        notes: 'Same text as jpn_kou.',
    },
    {
        path: 'khmer',
        id: 'khm_wp',
        language: 'khm',
        name: 'ព្រះគម្ពីរខ្មែរ',
        englishName: 'Khmer Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Khmer Old Version (KOV, 'Hammond version'), 1954 / rev. 1962, translated by Arthur L. Hammond, Bible Society in Cambodia",
    },
    {
        path: 'kj',
        id: 'eng_wpkjv',
        language: 'eng',
        name: 'King James Version',
        englishName: 'King James Version (Wordproject)',
        shortName: 'KJV',
        publicDomain: true,
        duplicateOf: 'eng_kjv',
        notes: 'Same text as eng_kjv.',
    },
    {
        path: 'kk',
        id: 'kaz_wp',
        language: 'kaz',
        name: 'Қасиетті кітап',
        englishName: 'Kazakh Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Киелі кітап, Kazakh Bible, «Орта Азия баспасы ЖШС» (Central Asia Publishing / kkitap.net), 2010+ edition',
    },
    {
        path: 'kn',
        id: 'kan_wp',
        language: 'kan',
        name: 'ಪವಿತ್ರ ಬೈಬಲ್',
        englishName: 'Kannada Bible (Wordproject)',
        licenseStatus: 'unknown',
        identifiedAs:
            "Kannada Bible, Old Version (Bible Society of India / BFBS 'Kannada O.V.'), the committee revision that Wikipedia says was completed by c.1934 (inference)",
    },
    {
        path: 'kr',
        id: 'kor_wp',
        language: 'kor',
        name: '성경 개역한글판',
        englishName: 'Korean Revised Version (Wordproject)',
        duplicateOf: 'kor_old',
        notes: 'Same text as kor_old.',
    },
    {
        path: 'lug',
        id: 'lug_wp',
        language: 'lug',
        name: "Baibuli y'Oluganda",
        englishName: 'Luganda Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Luganda Bible 1968 (Baibuli Entukuvu, LUG68), Bible Society of Uganda',
    },
    {
        path: 'mar',
        id: 'mar_wp',
        language: 'mar',
        name: 'मराठी बायबल',
        englishName: 'Marathi Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Marathi Holy Bible: Easy-to-Read Version (ERV-MR), (c) 1992-2010 World Bible Translation Center',
    },
    {
        path: 'ml',
        id: 'mal_wp',
        language: 'mal',
        name: 'സത്യവേദപുസ്തകം',
        englishName: 'Malayalam Sathyavedapusthakam 1910 (Wordproject)',
        duplicateOf: 'mal_fbf',
        notes: 'Same text as mal_fbf.',
    },
    {
        path: 'mn',
        id: 'khk_wp',
        language: 'khk',
        name: 'Монгол Ариун Библи',
        englishName: 'Mongolian Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Ариун Библи 2004 (АБ2004), Mongolian Union Bible Society (formerly the Mongolian Bible Translation Committee)',
    },
    {
        path: 'my',
        id: 'mya_wp',
        language: 'mya',
        name: 'သမ္မာကျမ်းစာ',
        englishName: 'Burmese Judson Bible (Wordproject)',
        duplicateOf: 'mya_jvb',
        notes: 'Same text as mya_jvb.',
    },
    {
        path: 'ne',
        id: 'npi_wp',
        language: 'npi',
        name: 'पवित्र बाइबल (सरल नेपाली)',
        englishName: 'Nepali Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Nepali Holy Bible: Easy-to-Read Version (NPIERV, 'Saral Nepali'), 2004, World Bible Translation Center / Bible League International",
    },
    {
        path: 'new/hau',
        id: 'hau_wp',
        language: 'hau',
        name: 'Littafi Mai Tsarki',
        englishName: 'Hausa Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Probably 'Littafi Mai Tsarki' (HAU), the Hausa Bible of the Bible Society of Nigeria (Common Language-style text; bible.com version 71, text (c) 2015 Bible Society of Nigeria). NOT Biblica's Hausa Contemporary Bible / Open Hausa (SRK/BSRK), whose Gen 1:1 reads 'A farko-farko, Allah ya halicci sama da kasa'.",
    },
    {
        path: 'new/kde',
        id: 'kde_wp',
        language: 'kde',
        name: 'Biblia Maconde',
        englishName: 'Makonde New Testament (Wordproject)',
        duplicateOf: 'kde_wbt',
        notes: 'Same text as kde_wbt, which also has more books.',
    },
    {
        path: 'new/kik',
        id: 'kik_wp',
        language: 'kik',
        name: 'Kĩrĩkanĩro',
        englishName: 'Kikuyu Bible (Wordproject)',
        notes: 'Wordproject only has 55 books of this Bible.',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Kikuyu (Gikuyu) Bible, 'Kiugo Githeru kia Ngai', Bible Society of Kenya, 1965 (first complete Kikuyu Bible), apparently in a later edition with tilde vowels (bible.com GKY, version 1622).",
    },
    {
        path: 'new/kin',
        id: 'kin_wp',
        language: 'kin',
        name: 'Isezerano Rishya',
        englishName: 'Kinyarwanda New Testament (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Kinyarwanda 'Bibiliya Ijambo ry'Imana' (BIR), new translation by the Bible Society of Rwanda (La Societe Biblique au Rwanda) with local churches (c. 2004); Wordproject has the NT only.",
    },
    {
        path: 'new/lin',
        id: 'lin_wp',
        language: 'lin',
        name: 'Biblia Mosantu',
        englishName: 'Lingala Bible (Wordproject)',
        duplicateOf: 'lin_bib',
        notes: 'Same text as the New Testament of lin_bib, which also has the Old Testament.',
    },
    {
        path: 'new/mas',
        id: 'mas_wp',
        language: 'mas',
        name: 'Biblia Sinyati',
        englishName: 'Maasai New Testament (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Maasai 'Biblia Sinyati' (New Testament portion), Bible Society of Kenya (with Bible Society of Tanzania); a revised Maasai Bible is (c) 2018 Bible Society of Kenya (bible.com 1816/3310). Exact edition (original vs. 2018 revision) not confirmed.",
    },
    {
        path: 'new/orm',
        id: 'gaz_wp',
        language: 'gaz',
        name: 'Macaafa Qulqulluu',
        englishName: 'Oromo New Testament (Wordproject)',
        notes: 'Wordproject has the New Testament and a few Old Testament books.',
        licenseStatus: 'unknown',
        identifiedAs:
            "Unidentified Oromo (Afaan Oromoo) NT plus Genesis and Ruth. Most likely a Bible Society of Ethiopia 'Macaafa Qulqulluu' text (the 1997 Latin-script Oromo Bible) or a later Ethiopian translation; same John 3:16 wording is quoted in Adventist Oromo Sabbath School lessons.",
    },
    {
        path: 'new/run',
        id: 'run_wp',
        language: 'run',
        name: 'Bibiliya Yera',
        englishName: 'Kirundi New Testament (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Kirundi 'Bibiliya Yera' (1951/1967), Bible Society of Burundi (bible.com RUN1967, version 2944), apparently in modernised spelling.",
    },
    {
        path: 'new/sna',
        id: 'sna_wp',
        language: 'sna',
        name: 'Bhaibheri Dzvene',
        englishName: 'Shona New Testament (Wordproject)',
        duplicateOf: 'sna_bib',
        notes: 'Same text as the New Testament of sna_bib, which also has the Old Testament.',
    },
    {
        path: 'new/vmw',
        id: 'vmw_wp',
        language: 'vmw',
        name: 'Biblia Emakhuwa',
        englishName: 'Makhuwa New Testament (Wordproject)',
        licenseStatus: 'unknown',
        identifiedAs:
            "Unidentified Makhuwa (Emakhuwa, vmw) New Testament. Probably the Sociedade Biblica de Mocambique's Makhuwa translation (complete Bible 1982; a newer Emakhuwa Bible was finished later), but not confirmed. It is not the Makhuwa-Meetto (mgh) texts in the API, which are a different language.",
    },
    {
        path: 'new/yor',
        id: 'yor_wp',
        language: 'yor',
        name: 'Bibeli Mimọ',
        englishName: 'Yoruba Bible (Wordproject)',
        notes: 'Related to yor_bib, but a different edition.',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Bibeli Mimo - the classic Yoruba Bible (1900 complete edition by the CMS/BFBS translators, building on Samuel Ajayi Crowther's work), as reprinted by the Bible Society of Nigeria (bible.com 'YCE'/'BM' and 'YBCV - Yoruba Bible 1884 Edition (Crowther)').",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'nl',
        id: 'nld_wp',
        language: 'nld',
        name: 'De Bijbel',
        englishName: 'Dutch Bible (Wordproject)',
        duplicateOf: 'nld_',
        notes: 'Same text as nld_.',
    },
    {
        path: 'no',
        id: 'nob_wp',
        language: 'nob',
        name: 'Bibelen 1930',
        englishName: 'Norwegian Bokmål Bible 1930 (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            'Norwegian Bible 1930, Det Norske Bibelselskap (Riksmål/Bokmål, NOT Nynorsk)',
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'or',
        id: 'ory_wp',
        language: 'ory',
        name: 'ପବିତ୍ର ବାଇବଲ',
        englishName: 'Oriya Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Oriya/Odia Holy Bible: Easy-to-Read Version (ERV-OR), (c) 1992-2010 World Bible Translation Center',
    },
    {
        path: 'pa',
        id: 'pan_wp',
        language: 'pan',
        name: 'ਬਾਇਬਲ',
        englishName: 'Punjabi Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'MIXED text: Old Testament = Punjabi Easy-to-Read Version (ERV-PA, (c) 1992-2010 WBTC); New Testament = Punjabi (Gurmukhi) Old Version, Bible Society of India (edition not identified)',
    },
    {
        path: 'pl',
        id: 'pol_wp',
        language: 'pol',
        name: 'Biblia Gdańska',
        englishName: 'Polish Gdańsk Bible (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs: 'Polish Biblia Gdańska (1632 translation, 1881 edition)',
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'pn',
        id: 'cmn_wppy',
        language: 'cmn',
        name: 'Shèng Jīng',
        englishName: 'Chinese Union Version - Pinyin (Wordproject)',
        notes: 'The Chinese Union Version in Pinyin.',
        licenseStatus: 'public-domain',
        identifiedAs:
            'Chinese Union Version (和合本, 1919) in Hanyu Pinyin with tone marks; romanizer unknown (possibly Wordproject or an older CUV-Pinyin e-text)',
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'po-BR',
        id: 'por_wpacf',
        language: 'por',
        name: 'Almeida Corrigida Fiel',
        englishName: 'Portuguese Almeida Corrigida Fiel (Wordproject)',
        shortName: 'ACF',
        notes: 'A different Almeida edition from por_blj and por_bsl.',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Almeida Corrigida Fiel (ACF), Sociedade Bíblica Trinitariana do Brasil (1994/1995/2007/2011)',
    },
    {
        path: 'po',
        id: 'por_wparc',
        language: 'por',
        name: 'Almeida Revista e Corrigida',
        englishName: 'Portuguese Almeida Revista e Corrigida (Wordproject)',
        shortName: 'ARC',
        notes: 'A different Almeida edition from por_blj and por_bsl.',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'João Ferreira de Almeida, Edição Revista e Corrigida (ARC) in European Portuguese spelling: the Sociedade Bíblica de Portugal edition (the 1898 Revista e Corrigida, updated 1968 and later re-spelled). It is NOT the 1911 public-domain printing.',
    },
    {
        path: 'pus',
        id: 'pus_wp',
        language: 'pus',
        name: 'انجیل مقدس',
        englishName: 'Pashto Bible (Wordproject)',
        direction: 'rtl',
        licenseStatus: 'unknown',
        identifiedAs:
            "Unidentified modern Pashto translation (Afghan-style vocabulary: 'خدای پاک', 'عیسی مسیح'); not the 1895 Peshawar Bible",
    },
    {
        path: 'ro',
        id: 'ron_wp',
        language: 'ron',
        name: 'Biblia Cornilescu',
        englishName: 'Romanian Cornilescu Bible (Wordproject)',
        notes: 'The Cornilescu 1924 text in the Latin alphabet. The API has it in Cyrillic letters as ron_924.',
        licenseStatus: 'public-domain',
        identifiedAs:
            'Dumitru Cornilescu Romanian Bible, 1924 edition (British and Foreign Bible Society), original pre-1993 spelling with î, not the 2010/2014 revision',
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'ru',
        id: 'rus_wp',
        language: 'rus',
        name: 'Синодальный перевод',
        englishName: 'Russian Synodal Translation (Wordproject)',
        stripAltVerseNumbers: true,
        duplicateOf: 'rus_syn',
        notes: 'A close edition of rus_syn (Synodal Translation).',
    },
    {
        path: 'se',
        id: 'swe_wp',
        language: 'swe',
        name: 'Bibeln 1917',
        englishName: 'Swedish Bible 1917 (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Swedish Bible 1917 (Bibeln, Gustav V's 1917 Church Bible, Bibelkommissionen), Project Runeberg text",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'si',
        id: 'sin_wp',
        language: 'sin',
        name: 'ශුද්ධ වූ බයිබලය',
        englishName: 'Sinhala Bible (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Sinhala Revised Old Version / 'Union Version' (Ceylon Bible Society, complete Bible 1938)",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'so',
        id: 'som_wp',
        language: 'som',
        name: 'Kitaabka Quduuska Ah',
        englishName: 'Somali Bible (Wordproject)',
        duplicateOf: 'som_sim',
        notes: 'Same text as som_sim.',
    },
    {
        path: 'sp',
        id: 'spa_wp',
        language: 'spa',
        name: 'Reina-Valera 1909',
        englishName: 'Spanish Reina-Valera 1909 (Wordproject)',
        publicDomain: true,
        duplicateOf: 'spa_r09',
        notes: 'Same text as spa_r09.',
    },
    {
        path: 'sr',
        id: 'srp_wp',
        language: 'srp',
        name: 'Српска Библија',
        englishName: 'Serbian Daničić-Karadžić Bible (Wordproject)',
        duplicateOf: 'srp_dkl',
        notes: 'Same text as srp_dkl.',
    },
    {
        path: 'sw',
        id: 'swh_wp',
        language: 'swh',
        name: 'Biblia Takatifu',
        englishName: 'Swahili Union Version (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Swahili Union Version (Biblia Takatifu, SUV), 1952, Bible Society of Kenya & Bible Society of Tanzania',
    },
    {
        path: 'tel',
        id: 'tel_wp',
        language: 'tel',
        name: 'పవిత్ర బైబిల్',
        englishName: 'Telugu Bible (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            "Telugu Bible, Old Version (BSI/BFBS; Lyman Jewett et al. 1880s, revised 1904; the 'Telugu Bible 1929 edition' text)",
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'ti',
        id: 'tha_wp',
        language: 'tha',
        name: 'พระคัมภีร์ไบเบิล',
        englishName: 'Thai KJV (Wordproject)',
        duplicateOf: 'tha_kjv',
        notes: 'Same text as tha_kjv.',
    },
    {
        path: 'tk',
        id: 'tuk_wp',
        language: 'tuk',
        name: 'Mukaddes Kitap',
        englishName: 'Turkmen Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Mukaddes Kitap, Turkmen Bible (Latin script), Institute for Bible Translation (Mukaddes Kitaby Terjime Instituty), 2016',
    },
    {
        path: 'tl',
        id: 'tgl_wp',
        language: 'tgl',
        name: 'Ang Dating Biblia',
        englishName: 'Tagalog Ang Dating Biblia 1905 (Wordproject)',
        licenseStatus: 'public-domain',
        identifiedAs:
            'Ang Dating Biblia (Tagalog), 1905, British & Foreign Bible Society / American Bible Society',
        publicDomain: true,
        includeByDefault: true,
    },
    {
        path: 'tm',
        id: 'tam_wp',
        language: 'tam',
        name: 'வேதாகமம்',
        englishName: 'Tamil Bible (Wordproject)',
        duplicateOf: 'tam_irv',
        notes: 'A close edition of tam_irv.',
    },
    {
        path: 'tr',
        id: 'tur_wp',
        language: 'tur',
        name: 'Kutsal Kitap',
        englishName: 'Turkish Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "Kutsal Kitap Yeni Çeviri (New Turkish Bible), Kitab-ı Mukaddes Şirketi (Bible Society in Turkey) and Yeni Yaşam Yayınları, 2001/2009. Wordproject labels it '1989', but the text is not a 1989 edition.",
    },
    {
        path: 'uk',
        id: 'ukr_wpo',
        language: 'ukr',
        name: 'Українська Біблія - Огієнко',
        englishName: 'Ukrainian Bible - Ohienko (Wordproject)',
        licenseStatus: 'unknown',
        identifiedAs:
            "Ivan Ohienko (Metropolitan Ilarion) Ukrainian Bible, published 1962 by the United Bible Societies / BFBS (wordproject: 'Огієнко, 1962')",
    },
    {
        path: 'uk_ik',
        id: 'ukr_wpk',
        language: 'ukr',
        name: 'Українська Біблія - Хоменко',
        englishName: 'Ukrainian Bible - Khomenko (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'Ivan Khomenko Ukrainian Catholic Bible (Святе Письмо Старого і Нового Завіту), Basilian Fathers (OSBM), Rome 1963 (later revisions 1983, 2004)',
    },
    {
        path: 'ur',
        id: 'urd_wp',
        language: 'urd',
        name: 'انجیل مقدس',
        englishName: 'Urdu Bible (Wordproject)',
        direction: 'rtl',
        licenseStatus: 'unknown',
        identifiedAs:
            "Urdu Revised Version 'Kitab-e-Muqaddas' (BFBS / Bible Society of India / Pakistan Bible Society; revised 1930s-1943; NT revised again 2010). Exact edition not determined",
    },
    {
        path: 'vg',
        id: 'lat_wp',
        language: 'lat',
        name: 'Biblia Sacra Vulgata',
        englishName: 'Latin Vulgate (Wordproject)',
        publicDomain: true,
        duplicateOf: 'lat_clv',
        notes: 'A close edition of lat_clv (Clementine Vulgate).',
    },
    {
        path: 'vt',
        id: 'vie_wp',
        language: 'vie',
        name: 'Kinh Thánh',
        englishName: 'Vietnamese Bible 1934 (Wordproject)',
        publicDomain: true,
        duplicateOf: 'vie_1934',
        notes: 'Same text as vie_1934.',
    },
    {
        path: 'xho_2',
        id: 'xho_wp',
        language: 'xho',
        name: 'IZibhalo Ezingcwele',
        englishName: 'Xhosa Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            'isiXhosa Bible 1975 revision (XHO75), Bible Society of South Africa (bible.com version 281).',
    },
    {
        path: 'zu_2',
        id: 'zul_wp',
        language: 'zul',
        name: 'IBhayibheli',
        englishName: 'Zulu Bible (Wordproject)',
        licenseStatus: 'copyrighted',
        identifiedAs:
            "isiZulu Bible 1959 ('IBhayibheli Elingcwele', ZUL59), Bible Society of South Africa, in its 1997 new-orthography edition.",
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
 * The IDs of the translations whose Wordproject copy replaces a copy from another source (see {@link WordprojectTranslation.replacesExisting}).
 */
export const WORDPROJECT_REPLACED_TRANSLATION_IDS: readonly string[] =
    WORDPROJECT_TRANSLATIONS.filter((t) => t.replacesExisting).map((t) => t.id);

/**
 * Determines whether the translation in the given directory is replaced by its Wordproject copy and should not be imported.
 * This is the case for translations that are replaced by a Wordproject text (like amh_amh), unless the directory holds the Wordproject copy.
 * @param translationId The ID of the translation (or the name of its directory).
 * @param translationDir The directory that the translation is stored in.
 */
export function isReplacedByWordproject(
    translationId: string,
    translationDir: string
): boolean {
    return (
        WORDPROJECT_REPLACED_TRANSLATION_IDS.includes(translationId) &&
        !existsSync(path.join(translationDir, WORDPROJECT_MARKER_FILE))
    );
}

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
        let folder = match[1];
        let bookId = getWordprojectBookId(folder);
        // The title of each link has the book number, like "[38] Zechariah".
        // Some index pages link a book to the wrong folder (Zechariah to Malachi's folder 39 in the Icelandic, Norwegian and Swedish Bibles),
        // so the number in the title wins when they disagree.
        const titleNumber = /\[(\d+(?:_[A-Z])?)\]/.exec(
            a.getAttribute('title') ?? ''
        )?.[1];
        const titleBookId = titleNumber
            ? getWordprojectBookId(titleNumber)
            : null;
        if (bookId && titleBookId && titleBookId !== bookId) {
            const digits = /\d+/.exec(folder)![0];
            folder =
                (folder.startsWith('B') ? 'B' : '') +
                titleNumber!.replace(/^\d+/, (n) =>
                    parseInt(n, 10).toString().padStart(digits.length, '0')
                );
            bookId = titleBookId;
        }
        if (!bookId || seen.has(bookId)) {
            continue;
        }
        seen.add(bookId);
        const fixedHref = href.replace(/^[^/]+/, folder);
        books.push({
            bookId,
            name: cleanText(a.textContent),
            url: new URL(fixedHref, pageUrl).href.replace(/#.*$/, ''),
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
        : (translation.license ?? null);
    return {
        id: translation.id,
        name: translation.name,
        englishName: translation.englishName,
        shortName: translation.shortName ?? translation.id.toUpperCase(),
        language: translation.language,
        direction: translation.direction ?? 'ltr',
        website,
        licenseUrl: translation.licenseUrl ?? WORDPROJECT_COPYRIGHT_URL,
        licenseNotice:
            translation.licenseNotice ??
            (translation.publicDomain
                ? `This text is in the public domain. It was downloaded from Wordproject (${website}).`
                : `This text was downloaded from Wordproject (${website}), which publishes it in good faith as a text that is believed to be in the public domain. See ${WORDPROJECT_COPYRIGHT_URL}.`),
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
 * @param ids The translation IDs (like `hau_wp`) or Wordproject folders (like `am` or `new/hau`).
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
     * The IDs (or Wordproject folders) of the translations to fetch. Defaults to the ones that are included by default.
     */
    translations?: string[];

    /**
     * Whether every translation in the catalog should be fetched when no translations are given,
     * instead of only the ones that are included by default (see {@link WordprojectTranslation.includeByDefault}).
     */
    all?: boolean;

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
            : catalog.filter((t) => options.all || t.includeByDefault);
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

            // The book list always comes from the website, since the index pages in some zips link books to the wrong folder
            // (the Danish zip links Zechariah to Malachi's folder, for example).
            let indexPage: string;
            try {
                indexPage = await getPage(indexUrl);
            } catch (err) {
                const zipIndex = zipPages?.get(indexUrl);
                if (zipIndex === undefined) {
                    throw err;
                }
                logger.warn(
                    `${translation.id}: could not download ${indexUrl}, so the book list in the zip is used: ${err instanceof Error ? err.message : err}`
                );
                indexPage = zipIndex;
            }
            const books = parseWordprojectIndex(indexPage, indexUrl);
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
                        let chapter: WordprojectChapter;
                        try {
                            chapter = parseWordprojectChapter(
                                html,
                                parseOptions
                            );
                        } catch (err) {
                            // Some pages are empty or broken (like 1 Corinthians 1 in new/kik).
                            // Treat them as chapters without text, so that the website's copy is tried for zip pages,
                            // and the chapter is otherwise skipped.
                            logger.warn(
                                `${translation.id} ${book.bookId} ${link.number}: could not read ${link.url}${zipPages?.has(link.url) ? ' in the zip' : ''}: ${err instanceof Error ? err.message : err}`
                            );
                            chapter = {
                                title: null,
                                paragraphs: [],
                                emptyVerses: [],
                            };
                        }
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
