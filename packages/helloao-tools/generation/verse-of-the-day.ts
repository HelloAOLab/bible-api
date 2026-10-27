import { Dataset, DatasetCategory } from './common-types.js';
import { DatasetDataset, DatasetDatasetBook } from './dataset.js';
import { bookOrderMap } from './book-order.js';
import { BookId } from '../utils.js';

/**
 * The dataset information for the verse of the day dataset.
 */
export const VERSE_OF_THE_DAY_DATASET: Dataset = {
    id: 'verse-of-the-day',
    name: 'Verse of the Day',
    englishName: 'Verse of the Day',
    website:
        'https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts',
    licenseUrl: 'https://github.com/HelloAOLab/bible-api/blob/main/LICENSE',
    licenseNotes:
        'A curated list of well-known verses by AO Lab, released under the MIT License.',
    language: 'eng',
    textDirection: 'ltr',
};

/**
 * The categories that verse of the day candidates can belong to.
 * Every candidate has between one and three of these.
 */
export const VERSE_OF_THE_DAY_CATEGORIES = [
    'comfort',
    'courage',
    'faith',
    'forgiveness',
    'gratitude',
    'guidance',
    'hope',
    'inspiration',
    'joy',
    'love',
    'peace',
    'praise',
    'prayer',
    'provision',
    'salvation',
    'strength',
    'wisdom',
] as const;

/**
 * A category that a verse of the day candidate can belong to.
 */
export type VerseOfTheDayCategory =
    (typeof VERSE_OF_THE_DAY_CATEGORIES)[number];

/**
 * The English name of each verse of the day category.
 */
export const VERSE_OF_THE_DAY_CATEGORY_NAMES: Record<
    VerseOfTheDayCategory,
    string
> = {
    comfort: 'Comfort',
    courage: 'Courage',
    faith: 'Faith',
    forgiveness: 'Forgiveness',
    gratitude: 'Gratitude',
    guidance: 'Guidance',
    hope: 'Hope',
    inspiration: 'Inspiration',
    joy: 'Joy',
    love: 'Love',
    peace: 'Peace',
    praise: 'Praise',
    prayer: 'Prayer',
    provision: 'Provision',
    salvation: 'Salvation',
    strength: 'Strength',
    wisdom: 'Wisdom',
};

/**
 * Describes what each verse of the day category is for.
 */
export const VERSE_OF_THE_DAY_CATEGORY_DESCRIPTIONS: Record<
    VerseOfTheDayCategory,
    string
> = {
    comfort: "God's nearness and care in grief, trouble, and loneliness.",
    courage: 'Standing firm and not being afraid.',
    faith: 'Trusting God and His promises.',
    forgiveness: "God's forgiveness of sin and forgiving others.",
    gratitude: 'Giving thanks to God.',
    guidance: 'God directing our steps, plans, and decisions.',
    hope: 'Confidence in the future that God has promised.',
    inspiration: 'Encouragement to live out the faith and do good.',
    joy: 'Rejoicing and gladness in God.',
    love: "God's love for us and our love for God and others.",
    peace: 'Rest, stillness, and freedom from anxiety.',
    praise: "Worship and declarations of God's greatness.",
    prayer: 'Calling on God and His promise to hear.',
    provision: 'God supplying what we need.',
    salvation: 'Redemption, grace, and new life in Christ.',
    strength: 'God giving strength and endurance.',
    wisdom: 'Godly wisdom and practical instruction for life.',
};

/**
 * Defines a verse (or short passage) that is a good candidate for a "verse of the day".
 */
export interface VerseOfTheDay {
    /**
     * The USFM ID of the book. e.g. "JHN"
     */
    book: string;

    /**
     * The chapter number.
     */
    chapter: number;

    /**
     * The verse number.
     * If `endVerse` is present, then this is the verse that the passage starts at.
     */
    verse: number;

    /**
     * The verse that the passage ends at.
     * Omitted if the candidate is a single verse.
     */
    endVerse?: number;

    /**
     * The categories that the verse belongs to, most relevant first.
     */
    categories: VerseOfTheDayCategory[];
}

/**
 * A curated list of well-known verses that are good candidates for a "verse of the day".
 *
 * Candidates are short (at most three verses), make sense when read on their own,
 * and use the standard English verse numbering (the same numbering as the BSB).
 * The list is sorted in canonical order.
 */
export const VERSES_OF_THE_DAY: VerseOfTheDay[] = [
    // Old Testament
    { book: 'GEN', chapter: 1, verse: 1, categories: ['praise'] },
    {
        book: 'GEN',
        chapter: 28,
        verse: 15,
        categories: ['comfort', 'guidance'],
    },
    { book: 'GEN', chapter: 50, verse: 20, categories: ['hope', 'faith'] },
    { book: 'EXO', chapter: 14, verse: 14, categories: ['peace', 'faith'] },
    {
        book: 'EXO',
        chapter: 15,
        verse: 2,
        categories: ['strength', 'praise', 'salvation'],
    },
    { book: 'NUM', chapter: 6, verse: 24, endVerse: 26, categories: ['peace'] },
    { book: 'DEU', chapter: 6, verse: 5, categories: ['love'] },
    { book: 'DEU', chapter: 7, verse: 9, categories: ['love', 'faith'] },
    { book: 'DEU', chapter: 31, verse: 6, categories: ['courage', 'strength'] },
    { book: 'DEU', chapter: 31, verse: 8, categories: ['courage', 'comfort'] },
    { book: 'JOS', chapter: 1, verse: 9, categories: ['courage', 'strength'] },
    {
        book: 'JOS',
        chapter: 24,
        verse: 15,
        categories: ['faith', 'inspiration'],
    },
    { book: 'RUT', chapter: 1, verse: 16, categories: ['love'] },
    { book: '1SA', chapter: 16, verse: 7, categories: ['wisdom'] },
    {
        book: '1CH',
        chapter: 16,
        verse: 34,
        categories: ['gratitude', 'praise', 'love'],
    },
    {
        book: '2CH',
        chapter: 7,
        verse: 14,
        categories: ['prayer', 'forgiveness'],
    },
    { book: 'NEH', chapter: 8, verse: 10, categories: ['joy', 'strength'] },
    { book: 'JOB', chapter: 19, verse: 25, categories: ['hope', 'salvation'] },
    { book: 'PSA', chapter: 1, verse: 1, endVerse: 2, categories: ['wisdom'] },
    { book: 'PSA', chapter: 4, verse: 8, categories: ['peace'] },
    { book: 'PSA', chapter: 5, verse: 3, categories: ['prayer'] },
    { book: 'PSA', chapter: 9, verse: 1, categories: ['gratitude', 'praise'] },
    { book: 'PSA', chapter: 9, verse: 10, categories: ['faith', 'comfort'] },
    { book: 'PSA', chapter: 16, verse: 11, categories: ['joy', 'guidance'] },
    { book: 'PSA', chapter: 18, verse: 2, categories: ['strength', 'faith'] },
    { book: 'PSA', chapter: 19, verse: 14, categories: ['prayer'] },
    {
        book: 'PSA',
        chapter: 23,
        verse: 1,
        categories: ['provision', 'comfort'],
    },
    { book: 'PSA', chapter: 23, verse: 4, categories: ['comfort', 'courage'] },
    { book: 'PSA', chapter: 27, verse: 1, categories: ['courage', 'faith'] },
    { book: 'PSA', chapter: 27, verse: 14, categories: ['hope', 'courage'] },
    {
        book: 'PSA',
        chapter: 28,
        verse: 7,
        categories: ['strength', 'faith', 'praise'],
    },
    {
        book: 'PSA',
        chapter: 30,
        verse: 5,
        categories: ['joy', 'hope', 'comfort'],
    },
    { book: 'PSA', chapter: 31, verse: 24, categories: ['courage', 'hope'] },
    { book: 'PSA', chapter: 32, verse: 8, categories: ['guidance'] },
    { book: 'PSA', chapter: 34, verse: 8, categories: ['praise', 'faith'] },
    { book: 'PSA', chapter: 34, verse: 18, categories: ['comfort'] },
    { book: 'PSA', chapter: 37, verse: 4, categories: ['joy', 'faith'] },
    { book: 'PSA', chapter: 37, verse: 5, categories: ['faith', 'guidance'] },
    { book: 'PSA', chapter: 37, verse: 7, categories: ['peace'] },
    { book: 'PSA', chapter: 42, verse: 11, categories: ['hope', 'praise'] },
    { book: 'PSA', chapter: 46, verse: 1, categories: ['strength', 'comfort'] },
    { book: 'PSA', chapter: 46, verse: 10, categories: ['peace', 'faith'] },
    {
        book: 'PSA',
        chapter: 51,
        verse: 10,
        categories: ['prayer', 'forgiveness'],
    },
    { book: 'PSA', chapter: 55, verse: 22, categories: ['comfort', 'peace'] },
    { book: 'PSA', chapter: 56, verse: 3, categories: ['courage', 'faith'] },
    { book: 'PSA', chapter: 62, verse: 1, categories: ['peace', 'salvation'] },
    { book: 'PSA', chapter: 63, verse: 3, categories: ['love', 'praise'] },
    {
        book: 'PSA',
        chapter: 68,
        verse: 19,
        categories: ['provision', 'praise'],
    },
    { book: 'PSA', chapter: 73, verse: 26, categories: ['strength', 'hope'] },
    {
        book: 'PSA',
        chapter: 86,
        verse: 5,
        categories: ['forgiveness', 'love', 'prayer'],
    },
    { book: 'PSA', chapter: 90, verse: 12, categories: ['wisdom', 'prayer'] },
    {
        book: 'PSA',
        chapter: 91,
        verse: 1,
        endVerse: 2,
        categories: ['comfort', 'faith'],
    },
    { book: 'PSA', chapter: 94, verse: 19, categories: ['comfort', 'peace'] },
    {
        book: 'PSA',
        chapter: 100,
        verse: 4,
        categories: ['gratitude', 'praise'],
    },
    { book: 'PSA', chapter: 103, verse: 12, categories: ['forgiveness'] },
    { book: 'PSA', chapter: 107, verse: 1, categories: ['gratitude', 'love'] },
    { book: 'PSA', chapter: 116, verse: 1, categories: ['prayer', 'love'] },
    { book: 'PSA', chapter: 118, verse: 24, categories: ['joy', 'gratitude'] },
    {
        book: 'PSA',
        chapter: 119,
        verse: 105,
        categories: ['guidance', 'wisdom'],
    },
    {
        book: 'PSA',
        chapter: 121,
        verse: 1,
        endVerse: 2,
        categories: ['strength', 'faith'],
    },
    { book: 'PSA', chapter: 136, verse: 1, categories: ['gratitude', 'love'] },
    {
        book: 'PSA',
        chapter: 139,
        verse: 14,
        categories: ['praise', 'inspiration'],
    },
    {
        book: 'PSA',
        chapter: 143,
        verse: 8,
        categories: ['prayer', 'guidance', 'love'],
    },
    { book: 'PSA', chapter: 145, verse: 18, categories: ['prayer', 'comfort'] },
    { book: 'PSA', chapter: 147, verse: 3, categories: ['comfort'] },
    { book: 'PSA', chapter: 150, verse: 6, categories: ['praise'] },
    {
        book: 'PRO',
        chapter: 3,
        verse: 5,
        endVerse: 6,
        categories: ['faith', 'guidance', 'wisdom'],
    },
    { book: 'PRO', chapter: 4, verse: 23, categories: ['wisdom'] },
    { book: 'PRO', chapter: 9, verse: 10, categories: ['wisdom'] },
    { book: 'PRO', chapter: 15, verse: 1, categories: ['wisdom'] },
    { book: 'PRO', chapter: 16, verse: 3, categories: ['guidance', 'faith'] },
    { book: 'PRO', chapter: 16, verse: 9, categories: ['guidance'] },
    { book: 'PRO', chapter: 17, verse: 17, categories: ['love'] },
    {
        book: 'PRO',
        chapter: 18,
        verse: 10,
        categories: ['strength', 'comfort'],
    },
    { book: 'PRO', chapter: 19, verse: 21, categories: ['guidance', 'wisdom'] },
    { book: 'PRO', chapter: 27, verse: 17, categories: ['wisdom'] },
    { book: 'ECC', chapter: 3, verse: 1, categories: ['wisdom'] },
    { book: 'ECC', chapter: 3, verse: 11, categories: ['hope', 'faith'] },
    { book: 'ISA', chapter: 1, verse: 18, categories: ['forgiveness'] },
    {
        book: 'ISA',
        chapter: 9,
        verse: 6,
        categories: ['salvation', 'hope', 'praise'],
    },
    {
        book: 'ISA',
        chapter: 12,
        verse: 2,
        categories: ['salvation', 'courage', 'faith'],
    },
    { book: 'ISA', chapter: 26, verse: 3, categories: ['peace', 'faith'] },
    { book: 'ISA', chapter: 30, verse: 21, categories: ['guidance'] },
    { book: 'ISA', chapter: 40, verse: 8, categories: ['faith'] },
    { book: 'ISA', chapter: 40, verse: 29, categories: ['strength'] },
    { book: 'ISA', chapter: 40, verse: 31, categories: ['strength', 'hope'] },
    {
        book: 'ISA',
        chapter: 41,
        verse: 10,
        categories: ['courage', 'strength', 'comfort'],
    },
    { book: 'ISA', chapter: 43, verse: 2, categories: ['comfort', 'courage'] },
    {
        book: 'ISA',
        chapter: 43,
        verse: 18,
        endVerse: 19,
        categories: ['hope', 'inspiration'],
    },
    {
        book: 'ISA',
        chapter: 53,
        verse: 5,
        categories: ['salvation', 'forgiveness'],
    },
    { book: 'ISA', chapter: 54, verse: 10, categories: ['love', 'comfort'] },
    {
        book: 'ISA',
        chapter: 55,
        verse: 8,
        endVerse: 9,
        categories: ['wisdom', 'faith'],
    },
    {
        book: 'ISA',
        chapter: 58,
        verse: 11,
        categories: ['guidance', 'provision'],
    },
    { book: 'JER', chapter: 17, verse: 7, categories: ['faith'] },
    { book: 'JER', chapter: 29, verse: 11, categories: ['hope', 'guidance'] },
    { book: 'JER', chapter: 31, verse: 3, categories: ['love'] },
    { book: 'JER', chapter: 33, verse: 3, categories: ['prayer'] },
    {
        book: 'LAM',
        chapter: 3,
        verse: 22,
        endVerse: 23,
        categories: ['love', 'hope'],
    },
    { book: 'EZK', chapter: 36, verse: 26, categories: ['salvation', 'hope'] },
    {
        book: 'MIC',
        chapter: 6,
        verse: 8,
        categories: ['wisdom', 'inspiration'],
    },
    { book: 'MIC', chapter: 7, verse: 18, categories: ['forgiveness', 'love'] },
    { book: 'NAM', chapter: 1, verse: 7, categories: ['comfort', 'strength'] },
    { book: 'HAB', chapter: 3, verse: 18, categories: ['joy', 'salvation'] },
    { book: 'ZEP', chapter: 3, verse: 17, categories: ['love', 'joy'] },
    { book: 'ZEC', chapter: 4, verse: 6, categories: ['strength', 'faith'] },

    // New Testament
    { book: 'MAT', chapter: 5, verse: 9, categories: ['peace'] },
    { book: 'MAT', chapter: 5, verse: 16, categories: ['inspiration'] },
    { book: 'MAT', chapter: 5, verse: 44, categories: ['love'] },
    { book: 'MAT', chapter: 6, verse: 26, categories: ['provision', 'peace'] },
    {
        book: 'MAT',
        chapter: 6,
        verse: 33,
        categories: ['provision', 'guidance'],
    },
    { book: 'MAT', chapter: 6, verse: 34, categories: ['peace'] },
    { book: 'MAT', chapter: 7, verse: 7, categories: ['prayer'] },
    { book: 'MAT', chapter: 11, verse: 28, categories: ['comfort', 'peace'] },
    {
        book: 'MAT',
        chapter: 19,
        verse: 26,
        categories: ['faith', 'inspiration'],
    },
    { book: 'MAT', chapter: 22, verse: 37, endVerse: 39, categories: ['love'] },
    { book: 'MAT', chapter: 28, verse: 20, categories: ['comfort'] },
    { book: 'MRK', chapter: 9, verse: 23, categories: ['faith'] },
    { book: 'MRK', chapter: 11, verse: 24, categories: ['prayer', 'faith'] },
    { book: 'LUK', chapter: 1, verse: 37, categories: ['faith'] },
    { book: 'LUK', chapter: 6, verse: 31, categories: ['love', 'wisdom'] },
    { book: 'LUK', chapter: 19, verse: 10, categories: ['salvation'] },
    { book: 'JHN', chapter: 1, verse: 5, categories: ['hope'] },
    { book: 'JHN', chapter: 1, verse: 12, categories: ['salvation'] },
    { book: 'JHN', chapter: 3, verse: 16, categories: ['love', 'salvation'] },
    { book: 'JHN', chapter: 3, verse: 17, categories: ['salvation'] },
    {
        book: 'JHN',
        chapter: 6,
        verse: 35,
        categories: ['provision', 'salvation'],
    },
    {
        book: 'JHN',
        chapter: 8,
        verse: 12,
        categories: ['guidance', 'salvation'],
    },
    { book: 'JHN', chapter: 10, verse: 10, categories: ['joy', 'salvation'] },
    { book: 'JHN', chapter: 11, verse: 25, categories: ['hope', 'salvation'] },
    { book: 'JHN', chapter: 13, verse: 34, endVerse: 35, categories: ['love'] },
    { book: 'JHN', chapter: 14, verse: 1, categories: ['peace', 'faith'] },
    { book: 'JHN', chapter: 14, verse: 6, categories: ['salvation'] },
    { book: 'JHN', chapter: 14, verse: 27, categories: ['peace', 'courage'] },
    { book: 'JHN', chapter: 15, verse: 5, categories: ['faith', 'strength'] },
    { book: 'JHN', chapter: 15, verse: 13, categories: ['love'] },
    { book: 'JHN', chapter: 16, verse: 33, categories: ['courage', 'peace'] },
    { book: 'ACT', chapter: 4, verse: 12, categories: ['salvation'] },
    { book: 'ACT', chapter: 16, verse: 31, categories: ['salvation', 'faith'] },
    {
        book: 'ACT',
        chapter: 20,
        verse: 35,
        categories: ['love', 'inspiration'],
    },
    {
        book: 'ROM',
        chapter: 3,
        verse: 23,
        endVerse: 24,
        categories: ['salvation', 'forgiveness'],
    },
    {
        book: 'ROM',
        chapter: 5,
        verse: 1,
        categories: ['peace', 'salvation', 'faith'],
    },
    {
        book: 'ROM',
        chapter: 5,
        verse: 3,
        endVerse: 4,
        categories: ['hope', 'strength'],
    },
    { book: 'ROM', chapter: 5, verse: 8, categories: ['love', 'salvation'] },
    { book: 'ROM', chapter: 6, verse: 23, categories: ['salvation'] },
    {
        book: 'ROM',
        chapter: 8,
        verse: 1,
        categories: ['forgiveness', 'salvation'],
    },
    { book: 'ROM', chapter: 8, verse: 18, categories: ['hope'] },
    { book: 'ROM', chapter: 8, verse: 28, categories: ['hope', 'faith'] },
    { book: 'ROM', chapter: 8, verse: 31, categories: ['courage'] },
    {
        book: 'ROM',
        chapter: 8,
        verse: 38,
        endVerse: 39,
        categories: ['love', 'hope'],
    },
    { book: 'ROM', chapter: 10, verse: 9, categories: ['salvation', 'faith'] },
    { book: 'ROM', chapter: 12, verse: 2, categories: ['wisdom', 'guidance'] },
    { book: 'ROM', chapter: 12, verse: 10, categories: ['love'] },
    {
        book: 'ROM',
        chapter: 12,
        verse: 12,
        categories: ['hope', 'prayer', 'joy'],
    },
    { book: 'ROM', chapter: 12, verse: 21, categories: ['inspiration'] },
    {
        book: 'ROM',
        chapter: 15,
        verse: 13,
        categories: ['hope', 'joy', 'peace'],
    },
    { book: '1CO', chapter: 10, verse: 13, categories: ['strength', 'faith'] },
    { book: '1CO', chapter: 13, verse: 4, categories: ['love'] },
    {
        book: '1CO',
        chapter: 13,
        verse: 13,
        categories: ['love', 'faith', 'hope'],
    },
    {
        book: '1CO',
        chapter: 15,
        verse: 57,
        categories: ['gratitude', 'salvation'],
    },
    {
        book: '1CO',
        chapter: 16,
        verse: 13,
        endVerse: 14,
        categories: ['courage', 'strength', 'love'],
    },
    {
        book: '2CO',
        chapter: 1,
        verse: 3,
        endVerse: 4,
        categories: ['comfort', 'praise'],
    },
    { book: '2CO', chapter: 4, verse: 18, categories: ['hope', 'faith'] },
    { book: '2CO', chapter: 5, verse: 7, categories: ['faith'] },
    {
        book: '2CO',
        chapter: 5,
        verse: 17,
        categories: ['salvation', 'inspiration'],
    },
    { book: '2CO', chapter: 9, verse: 8, categories: ['provision'] },
    { book: '2CO', chapter: 12, verse: 9, categories: ['strength', 'comfort'] },
    {
        book: 'GAL',
        chapter: 2,
        verse: 20,
        categories: ['faith', 'salvation', 'love'],
    },
    {
        book: 'GAL',
        chapter: 5,
        verse: 22,
        endVerse: 23,
        categories: ['love', 'joy', 'peace'],
    },
    {
        book: 'GAL',
        chapter: 6,
        verse: 9,
        categories: ['inspiration', 'strength'],
    },
    {
        book: 'EPH',
        chapter: 1,
        verse: 7,
        categories: ['forgiveness', 'salvation'],
    },
    {
        book: 'EPH',
        chapter: 2,
        verse: 8,
        endVerse: 9,
        categories: ['salvation', 'faith'],
    },
    { book: 'EPH', chapter: 2, verse: 10, categories: ['inspiration'] },
    { book: 'EPH', chapter: 3, verse: 20, categories: ['faith', 'praise'] },
    { book: 'EPH', chapter: 4, verse: 2, categories: ['love'] },
    { book: 'EPH', chapter: 4, verse: 32, categories: ['forgiveness', 'love'] },
    { book: 'EPH', chapter: 6, verse: 10, categories: ['strength', 'courage'] },
    { book: 'PHP', chapter: 1, verse: 6, categories: ['hope', 'faith'] },
    {
        book: 'PHP',
        chapter: 3,
        verse: 13,
        endVerse: 14,
        categories: ['inspiration'],
    },
    { book: 'PHP', chapter: 4, verse: 4, categories: ['joy', 'praise'] },
    {
        book: 'PHP',
        chapter: 4,
        verse: 6,
        endVerse: 7,
        categories: ['prayer', 'peace', 'gratitude'],
    },
    {
        book: 'PHP',
        chapter: 4,
        verse: 8,
        categories: ['wisdom', 'inspiration'],
    },
    {
        book: 'PHP',
        chapter: 4,
        verse: 13,
        categories: ['strength', 'inspiration'],
    },
    { book: 'PHP', chapter: 4, verse: 19, categories: ['provision'] },
    { book: 'COL', chapter: 3, verse: 2, categories: ['wisdom'] },
    { book: 'COL', chapter: 3, verse: 13, categories: ['forgiveness', 'love'] },
    { book: 'COL', chapter: 3, verse: 15, categories: ['peace', 'gratitude'] },
    { book: 'COL', chapter: 3, verse: 23, categories: ['inspiration'] },
    { book: '1TH', chapter: 5, verse: 11, categories: ['inspiration', 'love'] },
    {
        book: '1TH',
        chapter: 5,
        verse: 16,
        endVerse: 18,
        categories: ['joy', 'prayer', 'gratitude'],
    },
    { book: '2TH', chapter: 3, verse: 16, categories: ['peace'] },
    { book: '1TI', chapter: 4, verse: 12, categories: ['inspiration'] },
    {
        book: '2TI',
        chapter: 1,
        verse: 7,
        categories: ['courage', 'strength', 'love'],
    },
    {
        book: '2TI',
        chapter: 3,
        verse: 16,
        endVerse: 17,
        categories: ['wisdom', 'guidance'],
    },
    { book: 'TIT', chapter: 3, verse: 5, categories: ['salvation'] },
    { book: 'HEB', chapter: 4, verse: 12, categories: ['wisdom'] },
    { book: 'HEB', chapter: 4, verse: 16, categories: ['prayer'] },
    { book: 'HEB', chapter: 10, verse: 23, categories: ['hope', 'faith'] },
    { book: 'HEB', chapter: 11, verse: 1, categories: ['faith', 'hope'] },
    { book: 'HEB', chapter: 11, verse: 6, categories: ['faith'] },
    {
        book: 'HEB',
        chapter: 12,
        verse: 1,
        endVerse: 2,
        categories: ['inspiration', 'faith', 'strength'],
    },
    {
        book: 'HEB',
        chapter: 13,
        verse: 5,
        categories: ['comfort', 'provision'],
    },
    { book: 'HEB', chapter: 13, verse: 8, categories: ['faith'] },
    {
        book: 'JAS',
        chapter: 1,
        verse: 2,
        endVerse: 3,
        categories: ['joy', 'faith'],
    },
    { book: 'JAS', chapter: 1, verse: 5, categories: ['wisdom', 'prayer'] },
    {
        book: 'JAS',
        chapter: 1,
        verse: 17,
        categories: ['gratitude', 'provision'],
    },
    { book: 'JAS', chapter: 1, verse: 19, categories: ['wisdom'] },
    { book: 'JAS', chapter: 4, verse: 8, categories: ['prayer'] },
    {
        book: 'JAS',
        chapter: 5,
        verse: 16,
        categories: ['prayer', 'forgiveness'],
    },
    {
        book: '1PE',
        chapter: 1,
        verse: 3,
        categories: ['hope', 'salvation', 'praise'],
    },
    {
        book: '1PE',
        chapter: 2,
        verse: 9,
        categories: ['inspiration', 'praise'],
    },
    { book: '1PE', chapter: 4, verse: 8, categories: ['love', 'forgiveness'] },
    { book: '1PE', chapter: 5, verse: 7, categories: ['peace', 'comfort'] },
    { book: '2PE', chapter: 3, verse: 9, categories: ['salvation'] },
    { book: '1JN', chapter: 1, verse: 9, categories: ['forgiveness'] },
    { book: '1JN', chapter: 3, verse: 1, categories: ['love'] },
    { book: '1JN', chapter: 4, verse: 18, categories: ['love', 'courage'] },
    { book: '1JN', chapter: 4, verse: 19, categories: ['love'] },
    { book: '1JN', chapter: 5, verse: 14, categories: ['prayer'] },
    {
        book: 'JUD',
        chapter: 1,
        verse: 24,
        endVerse: 25,
        categories: ['praise'],
    },
    { book: 'REV', chapter: 3, verse: 20, categories: ['salvation'] },
    { book: 'REV', chapter: 4, verse: 11, categories: ['praise'] },
    { book: 'REV', chapter: 21, verse: 4, categories: ['hope', 'comfort'] },
    { book: 'REV', chapter: 21, verse: 5, categories: ['hope'] },
];

/**
 * The number of milliseconds in a day.
 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Picks the verse of the day for the given date.
 *
 * The pick only depends on the UTC calendar date, so every caller gets the same verse on the same day,
 * and consecutive days get consecutive verses from the list.
 *
 * @param date The date to get the verse for. Defaults to now.
 * @param category The category to pick from. Omit to pick from every verse.
 * @param verses The list of verses to pick from. Defaults to {@link VERSES_OF_THE_DAY}.
 * @returns The picked verse, or null if no verses match.
 */
export function getVerseOfTheDay(
    date: Date = new Date(),
    category?: VerseOfTheDayCategory,
    verses: VerseOfTheDay[] = VERSES_OF_THE_DAY
): VerseOfTheDay | null {
    const candidates = category
        ? verses.filter((v) => v.categories.includes(category))
        : verses;
    if (candidates.length <= 0) {
        return null;
    }
    const day = Math.floor(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
            MS_PER_DAY
    );
    const index =
        ((day % candidates.length) + candidates.length) % candidates.length;
    return candidates[index];
}

/**
 * Generates the verse of the day dataset from the given list of verses.
 *
 * The dataset has a chapter for every chapter that contains a candidate, listing the
 * candidates and their categories, and a category entity for every category, listing its verses.
 *
 * @param verses The list of verses. Defaults to {@link VERSES_OF_THE_DAY}.
 * @param dataset The dataset information to use. Defaults to {@link VERSE_OF_THE_DAY_DATASET}.
 */
export function generateVerseOfTheDayDataset(
    verses: VerseOfTheDay[] = VERSES_OF_THE_DAY,
    dataset: Dataset = VERSE_OF_THE_DAY_DATASET
): DatasetDataset {
    const sorted = [...verses].sort(
        (a, b) =>
            (bookOrderMap.get(a.book) ?? 9999) -
                (bookOrderMap.get(b.book) ?? 9999) ||
            a.chapter - b.chapter ||
            a.verse - b.verse
    );

    const books: DatasetDatasetBook[] = [];
    for (let v of sorted) {
        let book = books[books.length - 1];
        if (!book || book.id !== v.book) {
            book = {
                id: v.book as BookId,
                order: bookOrderMap.get(v.book) ?? 9999,
                chapters: [],
            };
            books.push(book);
        }
        let chapter = book.chapters[book.chapters.length - 1]?.chapter;
        if (!chapter || chapter.number !== v.chapter) {
            chapter = { number: v.chapter, content: [] };
            book.chapters.push({ chapter });
        }
        chapter.content.push({
            verse: v.verse,
            ...(v.endVerse !== undefined ? { endVerse: v.endVerse } : {}),
            categories: [...v.categories],
        });
    }

    const categories: DatasetCategory[] = VERSE_OF_THE_DAY_CATEGORIES.map(
        (id) => ({
            id,
            name: VERSE_OF_THE_DAY_CATEGORY_NAMES[id],
            description: VERSE_OF_THE_DAY_CATEGORY_DESCRIPTIONS[id],
            verses: sorted
                .filter((v) => v.categories.includes(id))
                .map((v) => ({
                    book: v.book as BookId,
                    chapter: v.chapter,
                    verse: v.verse,
                    ...(v.endVerse !== undefined
                        ? { endVerse: v.endVerse }
                        : {}),
                })),
        })
    ).filter((c) => c.verses.length > 0);

    return {
        ...dataset,
        books,
        categories,
    };
}
