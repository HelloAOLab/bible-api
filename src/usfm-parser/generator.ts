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

    let translationBooks = new Map<string, TranslationBooks>();

    for (let file of files) {
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
            
            const bookMap = bookIdMap.get(file.metadata.translation.language);

            if (!bookMap) {
                console.warn('[generate] File does not have a valid language!', file.name, file.metadata.translation.language);
                continue;
            }

            const bookName = bookMap.get(id);

            if (!bookName) {
                console.warn('[generate] Book name not found for ID!', file.name, id);
                continue;
            }

            let translation = availableTranslations.translations.find(t => file.metadata.translation.id === t.id);

            if (!translation) {
                translation = {
                    ...file.metadata.translation,
                    availableFormats: [
                        'json'
                    ],
                    listOfBooksApiLink: listOfBooksApiLink(file.metadata.translation.id)
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

            let book: TranslationBook = {
                id: id,
                commonName: bookName.commonName,
                firstChapterApiLink: bookChapterApiLink(translation.id, bookName.commonName, 1, 'json'),
                numberOfChapters: 0
            };

            currentTanslationBooks.books.push(book);

            let previousChapter: TranslationBookChapter | null = null;
            for (let content of parsed.content) {
                if (content.type === 'chapter') {
                    let chapter: TranslationBookChapter = {
                        translation,
                        book,
                        nextChapterLink: null,
                        chapter: {
                            number: content.number,
                            content: content.content,
                            footnotes: content.footnotes
                        }
                    };
                    book.numberOfChapters += 1;

                    const link = bookChapterApiLink(translation.id, book.commonName, chapter.chapter.number, 'json');
                    output.push(jsonFile(link, chapter));

                    if (previousChapter) {
                        previousChapter.nextChapterLink = link;
                    }
                    previousChapter = chapter;
                }
            }
        } catch(err) {
            console.error(`[generate] Error occurred while parsing ${file.name}`, err);
        }
    }

    for(let [translation, books] of translationBooks) {
        const link = listOfBooksApiLink(translation);

        output.push(jsonFile(link, books));
    }

    output.push(jsonFile('/bible/available_translations', availableTranslations));

    return output;

    function listOfBooksApiLink(translationId: string): string {
        return `/bible/${translationId}/books`;
    }
    
    function bookChapterApiLink(translationId: string, commonBookName: string, chapterNumber: number, extension: string) {
        return `/bible/${translationId}/${commonBookName}/${chapterNumber}.${extension}`;
    }
}


function jsonFile(path: string, content: any): OutputFile {
    return {
        path,
        content: JSON.stringify(content)
    };
}

export interface InputFile {
    name?: string;

    metadata: ParseTreeMetadata;
    content: string;
    fileType: 'usfm';
}

export interface OutputFile {
    path: string;
    content: string;
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
     * The two letter language code that the translation is primarily in.
     */
    language: string;
}

export interface AvailableTranslations {
    translations: Translation[]
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
     * The two letter language code that the translation is primarily in.
     */
    language: string;

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
    translation: Translation;
    books: TranslationBook[];
}

export interface TranslationBook {
    id: string;
    commonName: string;
    numberOfChapters: number;
    firstChapterApiLink: string;
}

export interface TranslationBookChapter {
    translation: Translation;
    book: TranslationBook;
    nextChapterLink: string | null;
    chapter: ChapterData;
}

export interface ChapterData {
    number: number;
    content: ChapterContent[];
    footnotes: ChapterFootnote[];
}

export type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

export interface ChapterHeading {
    type: 'heading';
    content: string[];
}

export interface ChapterLineBreak {
    type: 'line_break';
}

export interface ChapterHebrewSubtitle {
    type: 'hebrew_subtitle';
    content: (string | VerseText | VerseFootnoteReference)[];
}

export interface ChapterVerse {
    type: 'verse';
    number: number;
    content: (string | VerseText | VerseFootnoteReference)[];
}

export interface VerseText {
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     */
    poem?: number;
}

export interface VerseFootnoteReference {
    noteId: number;
}

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

export const bookIdMap = new Map([
    ['en',
        new Map([
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
        ])
    ]
]);