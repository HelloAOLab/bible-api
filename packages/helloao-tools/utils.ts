import z from "zod";

/**
 * Normalizes the given language code into a ISO 639 code.
 * @param language The language code to normalize.
 */
export function normalizeLanguage(language: string): string {
    return language;
}

/**
 * The map of translation IDs from fetch.bible to their translation ID in the API.
 */
const TRANSLATION_ID_MAP: Map<string, string> = new Map([
    ['eng_bsb', 'BSB'],
    ['arb_nav', 'ARBNAV'],
    ['eng_webp', 'ENGWEBP'],
    ['hin_irv', 'HINIRV'],
    ['hbo_mas', 'HBOMAS'],
    ['eng_drv', 'eng_dra'],
]);

/**
 * Gets the ID of the translation.
 * @param translation The translation to get the ID for.
 */
export function getTranslationId(translationId: string): string {
    return TRANSLATION_ID_MAP.get(translationId) ?? translationId;
}

export function isEmptyOrWhitespace(str: string | null | undefined): boolean {
    return !str || /^\s*$/.test(str);
}

export function getFirstNonEmpty<T extends string>(...values: T[]): T {
    for (let value of values) {
        if (!isEmptyOrWhitespace(value)) {
            return value;
        }
    }

    throw new Error('All values are empty or whitespace!');
}


/**
 * Defines a Zod schema for all USFM book IDs.
 */
export const BookIdSchema = z.enum([
    // 'FRT',
    'GEN',
    'EXO',
    'LEV',
    'NUM',
    'DEU',
    'JOS',
    'JDG',
    'RUT',
    '1SA',
    '2SA',
    '1KI',
    '2KI',
    '1CH',
    '2CH',
    'EZR',
    'NEH',
    'EST',
    'JOB',
    'PSA',
    'PRO',
    'ECC',
    'SNG',
    'ISA',
    'JER',
    'LAM',
    'EZK',
    'DAN',
    'HOS',
    'JOL',
    'AMO',
    'OBA',
    'JON',
    'MIC',
    'NAM',
    'HAB',
    'ZEP',
    'HAG',
    'ZEC',
    'MAL',
    'MAT',
    'MRK',
    'LUK',
    'JHN',
    'ACT',
    'ROM',
    '1CO',
    '2CO',
    'GAL',
    'EPH',
    'PHP',
    'COL',
    '1TH',
    '2TH',
    '1TI',
    '2TI',
    'TIT',
    'PHM',
    'HEB',
    'JAS',
    '1PE',
    '2PE',
    '1JN',
    '2JN',
    '3JN',
    'JUD',
    'REV',
    'TOB',
    'JDT',
    'ESG',
    'WIS',
    'SIR',
    'BAR',
    'LJE',
    'S3Y',
    'SUS',
    'BEL',
    '1MA',
    '2MA',
    '3MA',
    '4MA',
    '1ES',
    '2ES',
    'MAN',
    'PS2',
    'ODA',
    'PSS',
    'EZA',
    '5EZ',
    '6EZ',
    'DAG',
    'PS3',
    '2BA',
    'LBA',
    'JUB',
    'ENO',
    '1MQ',
    '2MQ',
    '3MQ',
    'REP',
    '4BA',
    'LAO',
]).meta({
    id: "BookId",
    description: "IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)"
});

export type BookId = z.infer<typeof BookIdSchema>;

/**
 * Defines a schema for validating verse references.
 */
export const VerseRefSchema = z.object({
    book: BookIdSchema,
    chapter: z.number().meta({
        description: 'The chapter number that the reference starts at.'
    }),
    verse: z.number().meta({
        description: 'The verse number that the reference starts at.'
    }),

    /**
     * The rest of the content of the verse.
     */
    content: z.string().optional().meta({
        description: 'The rest of the content of the verse reference. This is the part of the string that comes after the verse reference. For example, in "GEN 1:1 In the beginning, God created the Heavens and the Earth.", the content would be "In the beginning, God created the Heavens and the Earth."',
    }),

    /**
     * The chapter that the verse reference ends at.
     */
    endChapter: z.number().optional().meta({
        description: 'The chapter that the verse reference ends at. This is used for references that span multiple chapters, such as "GEN 1:1-2:3". In this case, the endChapter would be 2.',
    }),

    /**
     * The verse that the verse reference ends at.
     */
    endVerse: z.number().optional().meta({
        description: 'The verse that the verse reference ends at. This is used for references that span multiple verses, such as "GEN 1:1-1:3". In this case, the endVerse would be 3.',
    }),
}).meta({
    id: 'VerseRef',
    description: 'Defines a schema for verse references. A verse reference is a string that contains a book ID, chapter number, and verse number, such as "GEN 1:1". It can also contain an optional content part that comes after the verse reference, such as "GEN 1:1 In the beginning, God created the Heavens and the Earth." It can also contain optional endChapter and endVerse fields for references that span multiple chapters or verses, such as "GEN 1:1-2:3".',
});

export type VerseRef = z.infer<typeof VerseRefSchema>;

/**
 * Parses the given verse reference.
 * Formatted like "GEN 1:1".
 *
 * @param text The reference to parse.
 */
export function parseVerseReference(text: string): VerseRef | null {
    const match = text.match(
        /^\s*([0-9A-Za-z\s]+)[\s\.]+(\d+)[:\.](\d+)(?:-([0-9]+)(?:[\s:\.]([0-9]+))?)?/
    );

    if (!match) {
        return null;
    }

    const [reference, book, chapterStr, verseStr, endChapterStr, endVerseStr] =
        match;

    const chapter = parseInt(chapterStr);
    const verse = parseInt(verseStr);

    let endChapter = endChapterStr ? parseInt(endChapterStr) : undefined;
    let endVerse = endVerseStr ? parseInt(endVerseStr) : undefined;

    if (endChapter && !endVerse) {
        endVerse = endChapter;
        endChapter = undefined;
    }

    if (isNaN(chapter) || isNaN(verse)) {
        return null;
    }

    if (reference.length !== text.length) {
        return {
            book: getBookId(book) ?? book as BookId,
            chapter,
            verse,
            content: text.substring(reference.length).trim(),
            endChapter,
            endVerse,
        };
    }

    return {
        book: getBookId(book) ?? book as BookId,
        chapter,
        verse,
        endChapter,
        endVerse,
    };
}

/**
 * Defines a map that maps the book ID to the USFM Book identifier.
 */
const BOOK_ID_MAP: Map<string, BookId> = new Map([
    ['gen', 'GEN'],
    ['genesis', 'GEN'],
    ['exo', 'EXO'],
    ['exodus', 'EXO'],
    ['lev', 'LEV'],
    ['lev', 'LEV'],
    ['laviticus', 'LEV'],
    ['num', 'NUM'],
    ['numbers', 'NUM'],
    ['deu', 'DEU'],
    ['deuteronomy', 'DEU'],
    ['jos', 'JOS'],
    ['joshua', 'JOS'],
    ['jdg', 'JDG'],
    ['judges', 'JDG'],
    ['rut', 'RUT'],
    ['ruth', 'RUT'],
    ['1sa', '1SA'],
    ['1samuel', '1SA'],
    ['2sa', '2SA'],
    ['2samuel', '2SA'],
    ['1ki', '1KI'],
    ['1kings', '1KI'],
    ['1kgs', '1KI'],
    ['2ki', '2KI'],
    ['2kings', '2KI'],
    ['2kgs', '2KI'],
    ['1ch', '1CH'],
    ['1chronicles', '1CH'],
    ['chronicles1', '1CH'],
    ['2ch', '2CH'],
    ['2chronicles', '2CH'],
    ['chronicles2', '2CH'],
    ['ezr', 'EZR'],
    ['ezra', 'EZR'],
    ['neh', 'NEH'],
    ['nehemiah', 'NEH'],
    ['est', 'EST'],
    ['ester', 'EST'],
    ['job', 'JOB'],
    ['ps', 'PSA'],
    ['psa', 'PSA'],
    ['psalms', 'PSA'],
    ['psalm', 'PSA'],
    ['pr', 'PRO'],
    ['pro', 'PRO'],
    ['proverbs', 'PRO'],
    ['ecc', 'ECC'],
    ['ecclesiastes', 'ECC'],
    ['eccl', 'ECC'],
    ['sng', 'SNG'],
    ['song', 'SNG'],
    ['songofsolomon', 'SNG'],
    ['isa', 'ISA'],
    ['isaiah', 'ISA'],
    ['jer', 'JER'],
    ['jeremiah', 'JER'],
    ['lam', 'LAM'],
    ['lamentations', 'LAM'],
    ['ezk', 'EZK'],
    ['ezekiel', 'EZK'],
    ['ezek', 'EZK'],
    ['dan', 'DAN'],
    ['daniel', 'DAN'],
    ['hos', 'HOS'],
    ['hosea', 'HOS'],
    ['jol', 'JOL'],
    ['joel', 'JOL'],
    ['amo', 'AMO'],
    ['amos', 'AMO'],
    ['oba', 'OBA'],
    ['obadiah', 'OBA'],
    ['jon', 'JON'],
    ['jonah', 'JON'],
    ['mic', 'MIC'],
    ['micah', 'MIC'],
    ['nam', 'NAM'],
    ['nahum', 'NAM'],
    ['nah', 'NAM'],
    ['hab', 'HAB'],
    ['habakkuk', 'HAB'],
    ['zep', 'ZEP'],
    ['zepaniah', 'ZEP'],
    ['hag', 'HAG'],
    ['haggai', 'HAG'],
    ['zec', 'ZEC'],
    ['zechariah', 'ZEC'],
    ['mal', 'MAL'],
    ['malachi', 'MAL'],
    ['mat', 'MAT'],
    ['matthew', 'MAT'],
    ['mrk', 'MRK'],
    ['mark', 'MRK'],
    ['luk', 'LUK'],
    ['luke', 'LUK'],
    ['jhn', 'JHN'],
    ['john', 'JHN'],
    ['act', 'ACT'],
    ['acts', 'ACT'],
    ['rom', 'ROM'],
    ['romans', 'ROM'],
    ['1co', '1CO'],
    ['1corinthians', '1CO'],
    ['2co', '2CO'],
    ['2corinthians', '2CO'],
    ['gal', 'GAL'],
    ['galatians', 'GAL'],
    ['eph', 'EPH'],
    ['ephesians', 'EPH'],
    ['php', 'PHP'],
    ['philippians', 'PHP'],
    ['phil', 'PHP'],
    ['col', 'COL'],
    ['colossians', 'COL'],
    ['1th', '1TH'],
    ['1thessalonians', '1TH'],
    ['2th', '2TH'],
    ['2thessalonians', '2TH'],
    ['1ti', '1TI'],
    ['1timothy', '1TI'],
    ['2ti', '2TI'],
    ['2timothy', '2TI'],
    ['tit', 'TIT'],
    ['titus', 'TIT'],
    ['phm', 'PHM'],
    ['philemon', 'PHM'],
    ['phlm', 'PHM'],
    ['heb', 'HEB'],
    ['hebrews', 'HEB'],
    ['jas', 'JAS'],
    ['james', 'JAS'],
    ['1pe', '1PE'],
    ['1peter', '1PE'],
    ['2pe', '2PE'],
    ['2peter', '2PE'],
    ['1jn', '1JN'],
    ['1john', '1JN'],
    ['2jn', '2JN'],
    ['2john', '2JN'],
    ['3jn', '3JN'],
    ['3john', '3JN'],
    ['jud', 'JUD'],
    ['jude', 'JUD'],
    ['rev', 'REV'],
    ['revelation', 'REV'],
]);

/**
 * Gets the ID of the given book.
 * Returns null if the ID could not be found.
 * @param book The name/ID of the book.
 */
export function getBookId(book: string): BookId | null {
    const bookLower = book.toLowerCase().replaceAll(/\s+/g, '');

    const id = BOOK_ID_MAP.get(bookLower);
    if (id) {
        return id;
    }

    for (let [key, id] of BOOK_ID_MAP) {
        if (bookLower.startsWith(key)) {
            return id;
        }
    }

    return null;
}

/**
 * A brief list of verses which may appear in some older translations
 * but are not present in more modern translations.
 */
export const KNOWN_SKIPPED_VERSES = new Set([
    'MAT 12:47',
    'MAT 17:21',
    'MAT 18:11',
    'MAT 23:14',
    'MRK 7:16',
    'MRK 9:44',
    'MRK 9:46',
    'MRK 11:26',
    'LUK 17:36',
    'LUK 23:17',
    'JHN 5:4',
    'ACT 8:37',
    'ACT 15:34',
    'ACT 24:7',
    'ACT 28:29',
    'ROM 16:24',
]);
