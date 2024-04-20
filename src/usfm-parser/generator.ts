import { omit, sortBy } from "lodash";
import { FootnoteReference, Heading, ParseTree, Text, UsfmParser } from "./usfm-parser";


/**
 * Generates a list of output files from the given list of input files.
 * @param file The list of files.
 */
export function generate(files: InputFile[]): OutputFile[] {
    let output = [] as OutputFile[];

    let parser = new UsfmParser();

    let availableTranslations: AvailableTranslations = {
        translations: []
    };
    
    let parsedTranslations = new Map<string, { 
        file: InputFile,
        tree: ParseTree,
        order: number,
        bookName: {
            commonName: string
        } | undefined
    }[]>();

    const unknownLanguages = new Set<string>();
    for(let file of files) {
        if (file.fileType !== 'usfm') {
            console.warn('[generate] File does not have the USFM file type!', file.name);
            continue;
        }
        try {
            const parsed = parser.parse(file.content);
            const id = parsed.id;

            if (!id) {
                console.warn('[generate] File does not have a valid book ID!', file.name, id);
                continue;
            }

            const order = bookOrderMap.get(id);

            if (typeof order !== 'number') {
                console.warn('[generate] Book does not have an order!', id);
                continue;
            }
            
            const bookMap = bookIdMap.get(file.metadata.translation.language);

            if (!bookMap) {
                if (!unknownLanguages.has(file.metadata.translation.language)) {
                    console.warn('[generate] File does not have a known language!', file.name, file.metadata.translation.language);
                    unknownLanguages.add(file.metadata.translation.language);
                }
            }

            const bookName = bookMap?.get(id);

            if (!!bookMap && !bookName) {
                console.warn('[generate] Book name not found for ID!', file.name, id);
            }

            let translation = parsedTranslations.get(file.metadata.translation.id);

            if (!translation) {
                translation = [];
                parsedTranslations.set(file.metadata.translation.id, translation);
            }

            translation.push({
                file,
                tree: parsed,
                order,
                bookName
            });

        } catch(err) {
            console.error(`[generate] Error occurred while parsing ${file.name}`, err);
        }
    }
    
    let translationBooks = new Map<string, TranslationBooks>();

    for (let parsedBooks of parsedTranslations.values()) {
        const orderedBooks = sortBy(parsedBooks, b => b.order);

        let previousCommonChapter: TranslationBookChapter | null = null;
        let previousIdChapter: TranslationBookChapter | null = null;
        for (let { file, tree: parsed } of orderedBooks) {
            const id = parsed.id;

            if (!id) {
                console.warn('[generate] File does not have a valid book ID!', file.name, id);
                continue;
            }
            
            const bookMap = bookIdMap.get(file.metadata.translation.language);

            if (!bookMap) {
                if (!unknownLanguages.has(file.metadata.translation.language)) {
                    console.warn('[generate] File does not have a known language!', file.name, file.metadata.translation.language);
                    unknownLanguages.add(file.metadata.translation.language);
                }
            }

            const bookName = bookMap?.get(id);

            if (!!bookMap && !bookName) {
                console.warn('[generate] Common book name not found for ID!', file.name, id);
            }

            let translation = availableTranslations.translations.find(t => file.metadata.translation.id === t.id);

            if (!translation) {
                translation = {
                    ...omit(file.metadata.translation, 'direction'),
                    availableFormats: [
                        'json'
                    ],
                    listOfBooksApiLink: listOfBooksApiLink(file.metadata.translation.id),
                    textDirection: getTranslationDirection(file.metadata.translation)
                };
                availableTranslations.translations.push(translation);
            }

            let currentTanslationBooks = translationBooks.get(translation.id);

            if (!currentTanslationBooks) {
                currentTanslationBooks = {
                    translation,
                    books: []
                };

                translationBooks.set(translation.id, currentTanslationBooks);
            }

            const name = parsed.header ?? bookName?.commonName ?? parsed.title;

            if (!name) {
                throw new Error(`Book does not have a name: ${translation.id}/${id}`);
            }

            const commonName = bookName?.commonName ?? parsed.header ?? parsed.title ?? id;

            // The book that has links based on the book common name
            let commonBook: TranslationBook = {
                id: id,
                name,
                commonName,
                title: parsed.title ?? null,
                firstChapterApiLink: bookChapterApiLink(translation.id, commonName, 1, 'json'),
                lastChapterApiLink: bookChapterApiLink(translation.id, commonName, 1, 'json'),
                numberOfChapters: 0
            };
            // The book that has links based on the book ID.
            const idBook: TranslationBook = {
                id: id,
                name,
                commonName,
                title: parsed.title ?? null,
                firstChapterApiLink: bookChapterApiLink(translation.id, id, 1, 'json'),
                lastChapterApiLink: bookChapterApiLink(translation.id, id, 1, 'json'),
                numberOfChapters: 0
            };

            currentTanslationBooks.books.push(idBook);

            for (let content of parsed.content) {
                if (content.type === 'chapter') {
                    // The chapter that has links based on the book common name.
                    let commonChapter: TranslationBookChapter = {
                        translation,
                        book: commonBook,
                        nextChapterApiLink: null,
                        previousChapterApiLink: previousCommonChapter ? bookChapterApiLink(previousCommonChapter.translation.id, previousCommonChapter.book.commonName, previousCommonChapter.chapter.number, 'json') : null,
                        chapter: {
                            number: content.number,
                            content: content.content,
                            footnotes: content.footnotes
                        }
                    };
                    commonBook.numberOfChapters += 1;
                    idBook.numberOfChapters += 1;

                    // The chapter that has links based on the book ID.
                    let idChapter: TranslationBookChapter = {
                        translation,
                        book: idBook,
                        nextChapterApiLink: null,
                        previousChapterApiLink: previousIdChapter ? bookChapterApiLink(previousIdChapter.translation.id, previousIdChapter.book.id, previousIdChapter.chapter.number, 'json') : null,
                        chapter: {
                            number: content.number,
                            content: content.content,
                            footnotes: content.footnotes
                        }
                    };

                    const commonLink = bookChapterApiLink(translation.id, commonBook.commonName, commonChapter.chapter.number, 'json');
                    const idLink = bookChapterApiLink(translation.id, idBook.id, idChapter.chapter.number, 'json');
                    commonBook.lastChapterApiLink = commonLink;
                    idBook.lastChapterApiLink = idLink;

                    output.push(jsonFile(commonLink, commonChapter));
                    output.push(jsonFile(idLink, idChapter));

                    if (previousCommonChapter) {
                        previousCommonChapter.nextChapterApiLink = commonLink;
                    }
                    if (previousIdChapter) {
                        previousIdChapter.nextChapterApiLink = idLink;
                    }
                    previousCommonChapter = commonChapter;
                    previousIdChapter = idChapter;
                }
            }
        }
    }

    for(let [translation, books] of translationBooks) {
        const link = listOfBooksApiLink(translation);

        output.push(jsonFile(link, books));
    }

    output.push(jsonFile('/api/available_translations.json', availableTranslations));

    return output;

    function listOfBooksApiLink(translationId: string): string {
        return `/api/${translationId}/books.json`;
    }
    
    function bookChapterApiLink(translationId: string, commonName: string, chapterNumber: number, extension: string) {
        return `/api/${translationId}/${replaceSpacesWithUnderscores(commonName)}/${chapterNumber}.${extension}`;
    }
}


function jsonFile(path: string, content: any): OutputFile {
    return {
        path,
        content
    };
}

function getTranslationDirection(translation: InputTranslationMetadata): 'ltr' | 'rtl' {
    return translation.direction;
}

export interface InputFile {
    name?: string;

    metadata: ParseTreeMetadata;
    content: string;
    fileType: 'usfm';
}

export interface OutputFile {
    path: string;
    content: object;
}

/**
 * Defines an interface that contains metadata for a parse tree.
 */
export interface ParseTreeMetadata {
    /**
     * Information about the translation.
     */
    translation: InputTranslationMetadata;
}

export interface InputTranslationMetadata {
    /**
     * The ID of the translation.
     */
    id: string;

    /**
     * The name of the translation.
     */
    name: string;

    /**
     * The english name of the translation.
     */
    englishName: string;

    /**
     * The website for the translation.
     */
    website: string;

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: string;

    /**
     * The short name for the translation.
     */
    shortName?: string;

    /**
     * The RFC 5646 letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the text is written in.
     */
    direction: 'ltr' | 'rtl';
}

export interface AvailableTranslations {
    /**
     * The list of translations.
     */
    translations: Translation[];
}

export interface Translation {
    /**
     * The ID of the translation.
     */
    id: string;

    /**
     * The name of the translation.
     */
    name: string;

    /**
     * The website for the translation.
     */
    website: string;

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: string;

    /**
     * The short name for the translation.
     */
    shortName?: string;

    /**
     * The English name for the translation.
     */
    englishName: string;

    /**
     * The RFC 5646 letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: string;
}

export interface TranslationBooks {
    /**
     * The translation information for the books.
     */
    translation: Translation;

    /**
     * The list of books that are available for the translation.
     */
    books: TranslationBook[];
}

export interface TranslationBook {
    /**
     * The ID of the book.
     */
    id: string;

    /**
     * The name that the translation provided for the book.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The title of the book.
     * This is usually a more descriptive version of the book name.
     * If not available, then one was not provided by the translation.
     */
    title: string | null;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string;
}

export interface TranslationBookChapter {
    /**
     * The translation information for the book chapter.
     */
    translation: Translation;

    /**
     * The book information for the book chapter.
     */
    book: TranslationBook;

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the book.
     */
    nextChapterApiLink: string | null;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the book.
     */
    previousChapterApiLink: string | null;

    /**
     * The information for the chapter.
     */
    chapter: ChapterData;
}

export interface ChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The content of the chapter.
     */
    content: ChapterContent[];

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: ChapterFootnote[];
}

/**
 * A union type that represents a single piece of chapter content.
 * A piece of chapter content can be one of the following things:
 * - A heading.
 * - A line break.
 * - A verse.
 * - A Hebrew Subtitle.
 */
export type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * A heading in a chapter.
 */
export interface ChapterHeading {
    /**
     * Indicates that the content represents a heading.
     */
    type: 'heading';

    /**
     * The content for the heading.
     * If multiple strings are included in the array, they should be concatenated with a space.
     */
    content: string[];
}

/**
 * A line break in a chapter.
 */
export interface ChapterLineBreak {
    /**
     * Indicates that the content represents a line break.
     */
    type: 'line_break';
}

/**
 * A Hebrew Subtitle in a chapter.
 * These are often used included as informational content that appeared in the original manuscripts.
 * For example, Psalms 49 has the Hebrew Subtitle "To the choirmaster. A Psalm of the Sons of Korah."
 */
export interface ChapterHebrewSubtitle {
    /**
     * Indicates that the content represents a Hebrew Subtitle.
     */
    type: 'hebrew_subtitle';

    /**
     * The list of content that is contained in the subtitle.
     * Each element in the list could be a string, formatted text, or a footnote reference.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * A verse in a chapter.
 */
export interface ChapterVerse {
    /**
     * Indicates that the content is a verse.
     */
    type: 'verse';

    /**
     * The number of the verse.
     */
    number: number;
    
    /**
     * The list of content for the verse.
     * Each element in the list could be a string, formatted text, or a footnote reference.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Formatted text. That is, text that is formated in a particular manner.
 */
export interface FormattedText {
    /**
     * The text that is formatted.
     */
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     * 
     * Common in Psalms.
     */
    poem?: number;

    /**
     * Whether the text represents the Words of Jesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Defines an interface that represents a heading that is embedded in a verse.
 */
export interface InlineHeading {
    /**
     * The text of the heading.
     */
    heading: string;
}

/**
 * Defines an interface that represents a line break that is embedded in a verse.
 */
export interface InlineLineBreak {
    lineBreak: true;
}

/**
 * A footnote reference in a verse or a Hebrew Subtitle.
 */
export interface VerseFootnoteReference {
    /**
     * The ID of the note.
     */
    noteId: number;
}

/**
 * Information about a footnote.
 */
export interface ChapterFootnote {
    /**
     * The ID of the note that is referenced.
     */
    noteId: number;

    /**
     * The text of the footnote.
     */
    text: string;

    /**
     * The verse reference for the footnote.
     */
    reference?: {
        chapter: number;
        verse: number;
    };
}

const bookOrderMap = new Map([
    ["GEN", 1]
    , ["EXO", 2]
    , ["LEV", 3]
    , ["NUM", 4]
    , ["DEU", 5]
    , ["JOS", 6]
    , ["JDG", 7]
    , ["RUT", 8]
    , ["1SA", 9]
    , ["2SA", 10]
    , ["1KI", 11]
    , ["2KI", 12]
    , ["1CH", 13]
    , ["2CH", 14]
    , ["EZR", 15]
    , ["NEH", 16]
    , ["EST", 17]
    , ["JOB", 18]
    , ["PSA", 19]
    , ["PRO", 20]
    , ["ECC", 21]
    , ["SNG", 22]
    , ["ISA", 23]
    , ["JER", 24]
    , ["LAM", 25]
    , ["EZK", 26]
    , ["DAN", 27]
    , ["HOS", 28]
    , ["JOL", 29]
    , ["AMO", 30]
    , ["OBA", 31]
    , ["JON", 32]
    , ["MIC", 33]
    , ["NAM", 34]
    , ["HAB", 35]
    , ["ZEP", 36]
    , ["HAG", 37]
    , ["ZEC", 38]
    , ["MAL", 39]
    , ["MAT", 40]
    , ["MRK", 41]
    , ["LUK", 42]
    , ["JHN", 43]
    , ["ACT", 44]
    , ["ROM", 45]
    , ["1CO", 46]
    , ["2CO", 47]
    , ["GAL", 48]
    , ["EPH", 49]
    , ["PHP", 50]
    , ["COL", 51]
    , ["1TH", 52]
    , ["2TH", 53]
    , ["1TI", 54]
    , ["2TI", 55]
    , ["TIT", 56]
    , ["PHM", 57]
    , ["HEB", 58]
    , ["JAS", 59]
    , ["1PE", 60]
    , ["2PE", 61]
    , ["1JN", 62]
    , ["2JN", 63]
    , ["3JN", 64]
    , ["JUD", 65]
    , ["REV", 66]
]);

const englishBookMap = new Map([
    ["GEN", { "commonName": "Genesis" }]
    , ["EXO", { "commonName": "Exodus" }]
    , ["LEV", { "commonName": "Leviticus" }]
    , ["NUM", { "commonName": "Numbers" }]
    , ["DEU", { "commonName": "Deuteronomy" }]
    , ["JOS", { "commonName": "Joshua" }]
    , ["JDG", { "commonName": "Judges" }]
    , ["RUT", { "commonName": "Ruth" }]
    , ["1SA", { "commonName": "1 Samuel" }]
    , ["2SA", { "commonName": "2 Samuel" }]
    , ["1KI", { "commonName": "1 Kings" }]
    , ["2KI", { "commonName": "2 Kings" }]
    , ["1CH", { "commonName": "1 Chronicles" }]
    , ["2CH", { "commonName": "2 Chronicles" }]
    , ["EZR", { "commonName": "Ezra" }]
    , ["NEH", { "commonName": "Nehemiah" }]
    , ["EST", { "commonName": "Esther" }]
    , ["JOB", { "commonName": "Job" }]
    , ["PSA", { "commonName": "Psalms" }]
    , ["PRO", { "commonName": "Proverbs" }]
    , ["ECC", { "commonName": "Ecclesiastes" }]
    , ["SNG", { "commonName": "Song of Songs" }]
    , ["ISA", { "commonName": "Isaiah" }]
    , ["JER", { "commonName": "Jeremiah" }]
    , ["LAM", { "commonName": "Lamentations" }]
    , ["EZK", { "commonName": "Ezekiel" }]
    , ["DAN", { "commonName": "Daniel" }]
    , ["HOS", { "commonName": "Hosea" }]
    , ["JOL", { "commonName": "Joel" }]
    , ["AMO", { "commonName": "Amos" }]
    , ["OBA", { "commonName": "Obadiah" }]
    , ["JON", { "commonName": "Jonah" }]
    , ["MIC", { "commonName": "Micah" }]
    , ["NAM", { "commonName": "Nahum" }]
    , ["HAB", { "commonName": "Habakkuk" }]
    , ["ZEP", { "commonName": "Zephaniah" }]
    , ["HAG", { "commonName": "Haggai" }]
    , ["ZEC", { "commonName": "Zechariah" }]
    , ["MAL", { "commonName": "Malachi" }]
    , ["MAT", { "commonName": "Matthew" }]
    , ["MRK", { "commonName": "Mark" }]
    , ["LUK", { "commonName": "Luke" }]
    , ["JHN", { "commonName": "John" }]
    , ["ACT", { "commonName": "Acts" }]
    , ["ROM", { "commonName": "Romans" }]
    , ["1CO", { "commonName": "1 Corinthians" }]
    , ["2CO", { "commonName": "2 Corinthians" }]
    , ["GAL", { "commonName": "Galatians" }]
    , ["EPH", { "commonName": "Ephesians" }]
    , ["PHP", { "commonName": "Philippians" }]
    , ["COL", { "commonName": "Colossians" }]
    , ["1TH", { "commonName": "1 Thessalonians" }]
    , ["2TH", { "commonName": "2 Thessalonians" }]
    , ["1TI", { "commonName": "1 Timothy" }]
    , ["2TI", { "commonName": "2 Timothy" }]
    , ["TIT", { "commonName": "Titus" }]
    , ["PHM", { "commonName": "Philemon" }]
    , ["HEB", { "commonName": "Hebrews" }]
    , ["JAS", { "commonName": "James" }]
    , ["1PE", { "commonName": "1 Peter" }]
    , ["2PE", { "commonName": "2 Peter" }]
    , ["1JN", { "commonName": "1 John" }]
    , ["2JN", { "commonName": "2 John" }]
    , ["3JN", { "commonName": "3 John" }]
    , ["JUD", { "commonName": "Jude" }]
    , ["REV", { "commonName": "Revelation" }]
]);

const arabicBookMap = new Map([
    ["GEN", { "commonName": "التَّكوين" }]
    , ["EXO", { "commonName": "الخُرُوج" }]
    , ["LEV", { "commonName": "اللّاويِّين" }]
    , ["NUM", { "commonName": "العَدَد" }]
    , ["DEU", { "commonName": "التَّثْنِيَة" }]
    , ["JOS", { "commonName": "يَشُوع" }]
    , ["JDG", { "commonName": "القُضاة" }]
    , ["RUT", { "commonName": "راعُوث" }]
    , ["1SA", { "commonName": "صَمُوئيلَ الأوَّلُ" }]
    , ["2SA", { "commonName": "صموئيلَ الثّانِي" }]
    , ["1KI", { "commonName": "المُلُوكِ الأوَّلُ" }]
    , ["2KI", { "commonName": "المُلُوكِ الثّانِي" }]
    , ["1CH", { "commonName": "أخبارِ الأيّامِ الأوّلُ" }]
    , ["2CH", { "commonName": " أخبارِ الأيّامِ الثّانِي" }]
    , ["EZR", { "commonName": "عَزْرا" }]
    , ["NEH", { "commonName": "نَحَمْيا" }]
    , ["EST", { "commonName": "أسْتِير" }]
    , ["JOB", { "commonName": "أيُّوب" }]
    , ["PSA", { "commonName": "المَزامِير" }]
    , ["PRO", { "commonName": "الأمثال" }]
    , ["ECC", { "commonName": "الجامِعَة" }]
    , ["SNG", { "commonName": "نَشِيدِ الأنشاد" }]
    , ["ISA", { "commonName": "إشَعْياء" }]
    , ["JER", { "commonName": "إرْمِيا" }]
    , ["LAM", { "commonName": "ﻣﺮﺍﺛﻲ ﺇﺭﻣﻴﺎ" }]
    , ["EZK", { "commonName": "حِزْقِيال" }]
    , ["DAN", { "commonName": "دانيال" }]
    , ["HOS", { "commonName": "هُوشَع" }]
    , ["JOL", { "commonName": "يُوئيل" }]
    , ["AMO", { "commonName": "عامُوس" }]
    , ["OBA", { "commonName": "عُوبَدْيا" }]
    , ["JON", { "commonName": "ﻳﻮﻧﺎﻥ" }]
    , ["MIC", { "commonName": "ميخا" }]
    , ["NAM", { "commonName": "ناحُوم" }]
    , ["HAB", { "commonName": "حَبَقُّوق" }]
    , ["ZEP", { "commonName": "صَفَنْيا" }]
    , ["HAG", { "commonName": "حَجَّي" }]
    , ["ZEC", { "commonName": "زَكَريّا" }]
    , ["MAL", { "commonName": "مَلاخِي" }]
    , ["MAT", { "commonName": "ﻣﺘﻰ" }]
    , ["MRK", { "commonName": "مَرْقُس" }]
    , ["LUK", { "commonName": "لُوقا" }]
    , ["JHN", { "commonName": "يُوحَنّا" }]
    , ["ACT", { "commonName": "اعمال الرسل" }]
    , ["ROM", { "commonName": "ﺭﻭﻣﻴﺔ" }]
    , ["1CO", { "commonName": "ﻛﻮﺭﻧﺜﻮﺱ ﺍﻻﻭﻝ" }]
    , ["2CO", { "commonName": "ﻛﻮﺭﻧﺜﻮﺱ ﺍﻟﺜﺎﻧﻴﺔ" }]
    , ["GAL", { "commonName": "غَلاطِيَّة" }]
    , ["EPH", { "commonName": "أفَسُس" }]
    , ["PHP", { "commonName": "فِيلِبِّي" }]
    , ["COL", { "commonName": "كُولُوسِي" }]
    , ["1TH", { "commonName": "الرِّسالَةُ الأُولَى إلَى تَسالُونِيكِي" }]
    , ["2TH", { "commonName": "الرِّسالَةُ الثّانيَةُ إلَى تَسالُونِيكِي" }]
    , ["1TI", { "commonName": "الرِّسالَةُ الأُولَى إلَى تِيمُوثاوُس" }]
    , ["2TI", { "commonName": "الرِّسالَةُ الثّانيَةُ إلَى تِيمُوثاوُس" }]
    , ["TIT", { "commonName": "تِيطُس" }]
    , ["PHM", { "commonName": "فِلِيْمُون" }]
    , ["HEB", { "commonName": "العِبرانِيّين" }]
    , ["JAS", { "commonName": "يَعقُوب" }]
    , ["1PE", { "commonName": "رسالَةُ بُطرُسَ الأُولَى" }]
    , ["2PE", { "commonName": "رسالَةُ بُطرُسَ الثّانيَة" }]
    , ["1JN", { "commonName": "رسالَةُ يُوحَنّا الأُولَى" }]
    , ["2JN", { "commonName": "رسالَةُ يُوحَنّا الثّانيَة" }]
    , ["3JN", { "commonName": "رسالَةُ يُوحَنّا الثّالثَة" }]
    , ["JUD", { "commonName": "يَهُوذا" }]
    , ["REV", { "commonName": "رُؤيا يُوحَنّا" }]
]);

export const bookIdMap = new Map([
    ['en', englishBookMap],
    ['en-US', englishBookMap],
    ['arb', arabicBookMap]
]);

function replaceSpacesWithUnderscores(str: string): string {
    return str.replace(/[<>:"/\\|?*\s]/g, '_');
}