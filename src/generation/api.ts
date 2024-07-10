import { OutputFile, Translation, TranslationBook, TranslationBookChapter } from "./common-types";
import { DatasetOutput } from "./dataset";

/**
 * Defines the output of the API generation.
 */
export interface ApiOutput {
    /**
     * The list of available translations.
     * This maps to the /api/available-translations.json endpoint.
     */
    availableTranslations: ApiAvailableTranslations;

    /**
     * The list of books for each translation.
     * This maps to the /api/:translationId/books.json endpoint.
     */
    translationBooks: ApiTranslationBooks[];

    /**
     * The list of chapters for each book.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.json
     * - /api/:translationId/:bookCommonName/:chapterNumber.json
     */
    translationBookChapters: ApiTranslationBookChapter[];
}

/**
 * The list of available translations.
 * Maps to the /api/available-translations.json endpoint.
 */
export interface ApiAvailableTranslations {
    /**
     * The list of translations.
     */
    translations: ApiTranslation[];
}

/**
 * Defines a translation that is used in the API.
 */
export interface ApiTranslation extends Translation {
    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: string;

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];
}

/**
 * Defines an interface that contains information about the books that are available for a translation.
 */
export interface ApiTranslationBooks {
    /**
     * The translation information for the books.
     */
    translation: ApiTranslation;

    /**
     * The list of books that are available for the translation.
     */
    books: ApiTranslationBook[];
}

/**
 * Defines a translation book that is used in the API.
 */
export interface ApiTranslationBook extends TranslationBook {
    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;
}

/**
 * Defines an interface that contains information about a book chapter.
 */
export interface ApiTranslationBookChapter extends TranslationBookChapter {
    /**
     * The translation information for the book chapter.
     */
    translation: ApiTranslation;

    /**
     * The book information for the book chapter.
     */
    book: ApiTranslationBook;

    /**
     * The link to this chapter.
     */
    thisChapterLink: string;

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
}

/**
 * Generates the API output for the given dataset.
 * @param dataset The dataset to generate the API for.
 * @param useCommonName Whether to use the common name for the book chapter API link. If false, then book IDs are used.
 */
export function generateApiForDataset(dataset: DatasetOutput, useCommonName: boolean = false): ApiOutput {
    let api: ApiOutput = {
        availableTranslations: {
            translations: [],
        },
        translationBooks: [],
        translationBookChapters: [],
    };

    for (let { books, ...translation } of dataset.translations) {

        const apiTranslation: ApiTranslation = {
            ...translation,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfBooksApiLink(translation.id),
        };

        const translationBooks: ApiTranslationBooks = {
            translation: apiTranslation,
            books: [],
        };

        let translationChapters: ApiTranslationBookChapter[] = [];

        for(let { chapters, ...book } of books) {
            const apiBook: ApiTranslationBook = {
                ...book,
                firstChapterApiLink: bookChapterApiLink(translation.id, getBookLink(book), 1, 'json'),
                lastChapterApiLink: bookChapterApiLink(translation.id, getBookLink(book), chapters.length, 'json'),
                numberOfChapters: chapters.length,
            };

            for(let { chapter } of chapters) {
                const apiBookChapter: ApiTranslationBookChapter = {
                    translation: apiTranslation,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookChapterApiLink(translation.id, getBookLink(book), chapter.number, 'json'),
                    nextChapterApiLink: null,
                    previousChapterApiLink: null,
                };

                translationChapters.push(apiBookChapter);
                api.translationBookChapters.push(apiBookChapter);
            }

            translationBooks.books.push(apiBook);
        }

        for (let i = 0; i < translationChapters.length; i++) {
            if (i > 0) {
                translationChapters[i].previousChapterApiLink = bookChapterApiLink(translation.id, getBookLink(translationChapters[i - 1].book), translationChapters[i - 1].chapter.number, 'json');
            }

            if (i < translationChapters.length - 1) {
                translationChapters[i].nextChapterApiLink = bookChapterApiLink(translation.id, getBookLink(translationChapters[i + 1].book), translationChapters[i + 1].chapter.number, 'json');
            }
        }

        api.availableTranslations.translations.push(apiTranslation);
        api.translationBooks.push(translationBooks);
    }

    return api;

    function getBookLink(book: TranslationBook): string {
        return useCommonName ? book.commonName : book.id;
    }
}

export function generateFilesForApi(api: ApiOutput): OutputFile[] {
    let files: OutputFile[] = [];

    files.push(jsonFile('/api/available_translations.json', api.availableTranslations, true));
    for(let translationBooks of api.translationBooks) {
        files.push(jsonFile(translationBooks.translation.listOfBooksApiLink, translationBooks));
    }

    for (let bookChapter of api.translationBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    return files;
};

export function listOfBooksApiLink(translationId: string): string {
    return `/api/${translationId}/books.json`;
}

export function bookChapterApiLink(translationId: string, commonName: string, chapterNumber: number, extension: string) {
    return `/api/${translationId}/${replaceSpacesWithUnderscores(commonName)}/${chapterNumber}.${extension}`;
}

export function jsonFile(path: string, content: any, mergable?: boolean): OutputFile {
    return {
        path,
        content,
        mergable
    };
}

export function replaceSpacesWithUnderscores(str: string): string {
    return str.replace(/[<>:"/\\|?*\s]/g, '_');
}