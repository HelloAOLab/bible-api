import {
    Dataset,
    DatasetChapterVerseWords,
    DatasetInterlinearWord,
    DatasetLexiconEntry,
    DatasetLexiconSense,
} from './common-types.js';
import { DatasetDataset, DatasetDatasetBook } from './dataset.js';
import { bookOrderMap } from './book-order.js';
import { BookId } from '../utils.js';
import { sortBy } from 'es-toolkit/compat';

/**
 * The dataset information for the Berean interlinear dataset.
 * See https://bereanbible.com/
 */
export const BSB_INTERLINEAR_DATASET: Dataset = {
    id: 'bsb-interlinear',
    name: 'Berean Standard Bible Interlinear',
    englishName: 'Berean Standard Bible Interlinear',
    website: 'https://bereanbible.com/',
    licenseUrl: 'https://berean.bible/terms.htm',
    licenseNotes:
        'The Berean Standard Bible and its interlinear tables are in the public domain. Changes were made to the data to fit the Free Use Bible API format.',
    language: 'eng',
    textDirection: 'ltr',
};

/**
 * The dataset information for the STEPBible lexicon dataset.
 * See https://github.com/STEPBible/STEPBible-Data
 */
export const STEPBIBLE_LEXICON_DATASET: Dataset = {
    id: 'stepbible-lexicon',
    name: 'STEPBible Brief Lexicons',
    englishName: 'STEPBible Brief Lexicons',
    website: 'https://github.com/STEPBible/STEPBible-Data',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    licenseNotes:
        'The Translators Brief lexicons of Extended Strongs (TBESH and TBESG) are by STEPBible.org / Tyndale House, Cambridge, and are licensed under CC BY 4.0. Changes were made to the data to fit the Free Use Bible API format.',
    language: 'eng',
    textDirection: 'ltr',
};

/**
 * The contents of the interlinear source files that are needed to generate the datasets.
 */
export interface InterlinearFiles {
    /**
     * The contents of the Berean interlinear table (bsb_tables.tsv).
     */
    berean: string;

    /**
     * The contents of the STEPBible TBESH lexicon.
     */
    tbesh: string;

    /**
     * The contents of the STEPBible TBESG lexicon.
     */
    tbesg: string;
}

/**
 * A verse from the Berean interlinear table.
 */
export interface BereanVerse {
    book: BookId;
    chapter: number;
    verse: number;
    words: DatasetInterlinearWord[];
}

/**
 * The language of an interlinear word or lexicon sense.
 */
type InterlinearLanguage = DatasetInterlinearWord['language'];

/**
 * A single sense from a STEPBible lexicon.
 */
export interface LexiconSense extends DatasetLexiconSense {
    /**
     * The base Strong's number of the sense. e.g. "H0430" for "H0430G".
     */
    strongs: string;
}

/**
 * The number of books that the Berean table is expected to cover.
 */
export const BEREAN_BOOK_COUNT = 66;

/**
 * The USFM book IDs in canonical order.
 * The Berean table names its books in canonical order, so the nth book in the table is the nth book here.
 */
const canonicalBooks: BookId[] = [...bookOrderMap.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, BEREAN_BOOK_COUNT)
    .map(([id]) => id as BookId);

// Column indexes in bsb_tables.tsv (23 tab-separated columns, no quoting).
const COL = {
    hebSort: 0,
    grkSort: 1,
    bsbSort: 2,
    language: 4,
    surface: 5,
    transliteration: 7,
    parsing: 8,
    parsingFull: 9,
    strHeb: 10,
    strGrk: 11,
    verseId: 12,
    gloss: 18,
};
const COLUMNS = 23;

const LANGUAGES: { [key: string]: InterlinearLanguage } = {
    Hebrew: 'hebrew',
    Aramaic: 'aramaic',
    Greek: 'greek',
};

/**
 * Formats a Strong's number for the given language.
 * "430" + hebrew -> "H0430"; "3056" + greek -> "G3056"; empty -> null.
 * @param number The number from the source.
 * @param language The language of the word.
 */
export function normalizeStrongs(
    number: string | null | undefined,
    language: InterlinearLanguage
): string | null {
    const digits = String(number ?? '').trim();
    if (!/^\d+$/.test(digits)) {
        return null;
    }
    return `${language === 'greek' ? 'G' : 'H'}${digits.padStart(4, '0')}`;
}

/**
 * Converts a Berean gloss cell to an English phrase.
 * "-" (a word the BSB leaves untranslated) and cells holding only the "vvv" split marker become null.
 * "vvv" inside a phrase ("vvv him") is dropped.
 * @param cell The gloss cell.
 */
export function cleanGloss(cell: string | null | undefined): string | null {
    const text = String(cell ?? '')
        .replace(/\bvvv\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return text === '' || text === '-' ? null : text;
}

function sortKey(cell: string): number | null {
    const n = Number(cell);
    return Number.isFinite(n) && n > 0 && n < 999999 ? n : null;
}

/**
 * Parses the Berean interlinear table into verses.
 *
 * Rows arrive in BSB order. The verse reference sits on the first row of each verse and
 * is carried forward; the table's own "Verse" column is a global counter, not a verse number.
 * Placeholder rows (no original word) are dropped. `pos` is the word's rank in the original
 * text's order and `bsbPos` is its rank in the BSB's order, both 1-based per verse.
 *
 * Throws if the table has an unexpected structure.
 * @param text The contents of bsb_tables.tsv.
 */
export function parseBerean(text: string): {
    verses: BereanVerse[];
    books: string[];
} {
    const lines = text.split(/\r?\n/);
    const verses: BereanVerse[] = [];
    const bookIndexByName = new Map<string, number>();
    let verse: Omit<BereanVerse, 'words'> | null = null;
    let rows: string[][] = [];

    const flush = () => {
        if (verse) {
            verses.push({ ...verse, words: buildWords(rows) });
        }
        rows = [];
    };

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) {
            continue;
        }
        const cols = line.split('\t');
        if (cols.length !== COLUMNS) {
            throw new Error(
                `bsb_tables.tsv line ${i + 1}: expected ${COLUMNS} columns, got ${cols.length}`
            );
        }
        const ref = cols[COL.verseId];
        if (ref) {
            const match = /^(.+) (\d+):(\d+)$/.exec(ref);
            if (!match) {
                throw new Error(
                    `bsb_tables.tsv line ${i + 1}: bad verse reference "${ref}"`
                );
            }
            flush();
            let index = bookIndexByName.get(match[1]);
            if (index === undefined) {
                index = bookIndexByName.size;
                if (index >= canonicalBooks.length) {
                    throw new Error(
                        `bsb_tables.tsv line ${i + 1}: unexpected extra book "${match[1]}"`
                    );
                }
                bookIndexByName.set(match[1], index);
            }
            verse = {
                book: canonicalBooks[index],
                chapter: Number(match[2]),
                verse: Number(match[3]),
            };
        }
        if (!verse) {
            throw new Error(
                `bsb_tables.tsv line ${i + 1}: word before any verse reference`
            );
        }
        if (cols[COL.surface].trim() !== '') {
            rows.push(cols);
        }
    }
    flush();
    return { verses, books: [...bookIndexByName.keys()] };
}

function buildWords(rows: string[][]): DatasetInterlinearWord[] {
    const entries = rows.map((cols, order) => {
        const language = LANGUAGES[cols[COL.language]];
        if (!language) {
            throw new Error(`Unknown language "${cols[COL.language]}"`);
        }
        const original =
            language === 'greek'
                ? sortKey(cols[COL.grkSort])
                : sortKey(cols[COL.hebSort]);
        return {
            cols,
            language,
            original: original ?? Infinity,
            bsb: Number(cols[COL.bsbSort]),
            order,
        };
    });

    const rank = (key: 'original' | 'bsb') => {
        const sorted = [...entries].sort(
            (a, b) => a[key] - b[key] || a.order - b.order
        );
        return new Map(sorted.map((e, i) => [e, i + 1]));
    };
    const originalRank = rank('original');
    const bsbRank = rank('bsb');

    return entries
        .sort((a, b) => originalRank.get(a)! - originalRank.get(b)!)
        .map((e) => {
            const { cols, language } = e;
            return {
                pos: originalRank.get(e)!,
                bsbPos: bsbRank.get(e)!,
                language,
                // NFC so the same word has one byte form (the source mixes oxia/tonos Greek,
                // and orders some Hebrew combining marks differently).
                text: cols[COL.surface].trim().normalize('NFC'),
                transliteration: cols[COL.transliteration].trim() || null,
                parsing: cols[COL.parsing].trim() || null,
                parsingFull: cols[COL.parsingFull].trim() || null,
                strongs: normalizeStrongs(
                    language === 'greek' ? cols[COL.strGrk] : cols[COL.strHeb],
                    language
                ),
                gloss: cleanGloss(cols[COL.gloss]),
            };
        });
}

const ENTITIES: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
};

/**
 * Converts STEPBible lexicon markup to plain text.
 * Line breaks (<br>) become paragraph breaks and every other tag is dropped, keeping its text.
 * Paragraphs are separated by a blank line.
 * @param markup The markup to convert.
 */
export function markupToText(markup: string | null | undefined): string {
    return String(markup ?? '')
        .replace(/<\s*br\s*\/?\s*>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&(?:amp|lt|gt|quot|nbsp|#39);/g, (e) => ENTITIES[e])
        .split('\n')
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n\n');
}

/**
 * Parses a TBESH or TBESG file into lexicon senses.
 *
 * Data rows are the tab-separated lines whose first field is an extended Strong's ID and which have 8 fields:
 * eStrong, dStrong, uStrong, lemma, transliteration, morph, gloss, meaning.
 *
 * `id` is the disambiguated sense ID ("H0430G") and `strongs` is its base number ("H0430").
 * A G-numbered entry is Greek whatever its morph says (Greek transliterations of Hebrew words, "H:N").
 * An H-numbered entry is Aramaic when its morph starts with "A:", and Hebrew otherwise.
 *
 * Throws if the same sense ID appears twice.
 * @param text The contents of the lexicon file.
 */
export function parseLexicon(text: string): LexiconSense[] {
    const entries: LexiconSense[] = [];
    const seen = new Set<string>();
    for (let line of text.split(/\r?\n/)) {
        if (!/^[HG]\d/.test(line)) {
            continue;
        }
        const fields = line.split('\t');
        if (fields.length !== 8) {
            continue;
        }
        const id = fields[1].trim().split(/\s+/)[0];
        // Anything but a 4-digit number plus an optional sense letter (TBESG's G2xxxx LSJ-only
        // additions) has no Strong's number that a verse word could point at.
        const match = /^([HG]\d{4})[A-Za-z]?$/.exec(id);
        if (!match) {
            continue;
        }
        if (seen.has(id)) {
            throw new Error(`Duplicate lexicon sense ID "${id}"`);
        }
        seen.add(id);
        const morph = fields[5].trim();
        const prefix = /^([HAGN]):/.exec(morph)?.[1];
        const language: InterlinearLanguage = id.startsWith('G')
            ? 'greek'
            : prefix === 'A'
              ? 'aramaic'
              : 'hebrew';
        entries.push({
            id,
            strongs: match[1],
            language,
            lemma: fields[3].trim().normalize('NFC'),
            transliteration: fields[4].trim() || null,
            partOfSpeech: morph.replace(/^[HAGN]:/, '') || null,
            gloss: fields[6].trim() || null,
            definition: markupToText(fields[7]),
        });
    }
    return entries;
}

/**
 * Generates the bsb-interlinear and stepbible-lexicon datasets from the given interlinear source files.
 *
 * The transformation is deterministic: the same input always produces the same output.
 * Throws if the sources do not have the expected structure.
 *
 * @param files The contents of the source files.
 */
export function generateDatasetsFromInterlinear(
    files: InterlinearFiles
): DatasetDataset[] {
    return [
        generateInterlinearDataset(files.berean),
        generateLexiconDataset(files.tbesh, files.tbesg),
    ];
}

function generateInterlinearDataset(berean: string): DatasetDataset {
    const { verses, books: bookNames } = parseBerean(berean);
    if (bookNames.length !== BEREAN_BOOK_COUNT) {
        throw new Error(
            `bsb_tables.tsv covers ${bookNames.length} books, expected ${BEREAN_BOOK_COUNT}`
        );
    }

    const books = new Map<BookId, Map<number, DatasetChapterVerseWords[]>>();
    for (let verse of verses) {
        let chapters = books.get(verse.book);
        if (!chapters) {
            chapters = new Map();
            books.set(verse.book, chapters);
        }
        let content = chapters.get(verse.chapter);
        if (!content) {
            content = [];
            chapters.set(verse.chapter, content);
        }
        content.push({ verse: verse.verse, words: verse.words });
    }

    const datasetBooks: DatasetDatasetBook[] = [];
    for (let [id, chapters] of books) {
        datasetBooks.push({
            id,
            order: bookOrderMap.get(id) ?? 9999,
            chapters: sortBy([...chapters.entries()], (c) => c[0]).map(
                ([number, content]) => ({
                    chapter: {
                        number,
                        content: sortBy(content, (v) => v.verse),
                    },
                })
            ),
        });
    }

    return {
        ...BSB_INTERLINEAR_DATASET,
        books: sortBy(datasetBooks, (b) => b.order),
    };
}

function generateLexiconDataset(tbesh: string, tbesg: string): DatasetDataset {
    const senses = [...parseLexicon(tbesh), ...parseLexicon(tbesg)];

    const entries = new Map<string, LexiconSense[]>();
    for (let sense of senses) {
        let list = entries.get(sense.strongs);
        if (!list) {
            list = [];
            entries.set(sense.strongs, list);
        }
        list.push(sense);
    }

    const lexicon: DatasetLexiconEntry[] = [];
    for (let [id, list] of entries) {
        const sorted = sortBy(list, (s) => s.id);
        lexicon.push({
            id,
            language: sorted[0].language,
            senses: sorted.map(({ strongs, ...sense }) => sense),
        });
    }

    return {
        ...STEPBIBLE_LEXICON_DATASET,
        books: [],
        lexicon: sortBy(lexicon, (e) => e.id),
    };
}
