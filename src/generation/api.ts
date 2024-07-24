import { OutputFile, Translation, TranslationBook, TranslationBookChapter, TranslationBookChapterAudioLinks } from "./common-types";
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

    /**
     * The list of audio files.
     * This maps to the following endpoints:
     * - /api/:translationId/:bookId/:chapterNumber.:reader.mp3
     */
    translationBookChapterAudio: ApiTranslationBookChapterAudio[];
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

    /**
     * The number of books that are contained in this translation.
     * 
     * Complete translations should have the same number of books as the Bible (66).
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this translation.
     * 
     * Complete translations should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this translation.
     * 
     * Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: number;
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

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: number;
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
     * Null if this is the last chapter in the translation.
     */
    nextChapterApiLink: string | null;

    /**
     * The links to the audio versions for the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: string | null;

    /**
     * The links to the audio versions for the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;
}

export interface ApiTranslationBookChapterAudio {
    /**
     * The chapter that the audio is for.
     */
    chapter: ApiTranslationBookChapter;

    /**
     * The link that the audio should be placed at.
     */
    link: string;

    /**
     * The original URL of the audio.
     */
    originalUrl: string;
}

export interface GenerateApiOptions {
    /**
     * Whether to use the common name for the book chapter API link. If false, then book IDs are used.
     * Audio URLs will always use the book ID.
     * Defaults to false.
     */
    useCommonName?: boolean;

    /**
     * Whether to replace the audio URLs in the dataset with ones that are hosted locally.
     * If true, then the audio URLs in the dataset will be replaced with ones that reference files hosted by the API itself.
     * If false, then the audio URLs in the dataset will be left as is.
     * Defaults to false.
     */
    generateAudioFiles?: boolean;
}

/**
 * Generates the API output for the given dataset.
 * @param dataset The dataset to generate the API for.
 * @param options The options for generating the API.
 */
export function generateApiForDataset(dataset: DatasetOutput, options : GenerateApiOptions = {}): ApiOutput {
    const { useCommonName } = options;
    let api: ApiOutput = {
        availableTranslations: {
            translations: [],
        },
        translationBooks: [],
        translationBookChapters: [],
        translationBookChapterAudio: [],
    };

    for (let { books, ...translation } of dataset.translations) {

        const apiTranslation: ApiTranslation = {
            ...translation,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfBooksApiLink(translation.id),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
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
                totalNumberOfVerses: 0,
            };

            for(let { chapter, thisChapterAudioLinks } of chapters) {
                const audio: TranslationBookChapterAudioLinks = {};
                const apiBookChapter: ApiTranslationBookChapter = {
                    translation: apiTranslation,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookChapterApiLink(translation.id, getBookLink(book), chapter.number, 'json'),
                    thisChapterAudioLinks: audio,
                    nextChapterApiLink: null,
                    nextChapterAudioLinks: null,
                    previousChapterApiLink: null,
                    previousChapterAudioLinks: null,
                    numberOfVerses: 0,
                };

                for (let reader in thisChapterAudioLinks) {
                    if (options.generateAudioFiles) {
                        const apiAudio: ApiTranslationBookChapterAudio = {
                            chapter: apiBookChapter,
                            link: bookChapterAudioApiLink(translation.id, getBookLink(book), chapter.number, reader),
                            originalUrl: thisChapterAudioLinks[reader],
                        };
                        audio[reader] = apiAudio.link;
                        api.translationBookChapterAudio.push(apiAudio)
                    } else {
                        audio[reader] = thisChapterAudioLinks[reader];
                    }
                }

                for(let c of chapter.content) {
                    if (c.type === 'verse') {
                        apiBookChapter.numberOfVerses++;
                    }
                }

                apiBook.totalNumberOfVerses += apiBookChapter.numberOfVerses;

                translationChapters.push(apiBookChapter);
                api.translationBookChapters.push(apiBookChapter);
            }

            translationBooks.books.push(apiBook);

            apiTranslation.totalNumberOfChapters += apiBook.numberOfChapters;
            apiTranslation.totalNumberOfVerses += apiBook.totalNumberOfVerses;
        }

        for (let i = 0; i < translationChapters.length; i++) {
            if (i > 0) {
                translationChapters[i].previousChapterApiLink = bookChapterApiLink(translation.id, getBookLink(translationChapters[i - 1].book), translationChapters[i - 1].chapter.number, 'json');
                translationChapters[i].previousChapterAudioLinks = translationChapters[i - 1].thisChapterAudioLinks;
            }

            if (i < translationChapters.length - 1) {
                translationChapters[i].nextChapterApiLink = bookChapterApiLink(translation.id, getBookLink(translationChapters[i + 1].book), translationChapters[i + 1].chapter.number, 'json');
                translationChapters[i].nextChapterAudioLinks = translationChapters[i + 1].thisChapterAudioLinks;
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
    for (let translationBooks of api.translationBooks) {
        files.push(jsonFile(translationBooks.translation.listOfBooksApiLink, translationBooks));
    }

    for (let bookChapter of api.translationBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    for (let audio of api.translationBookChapterAudio) {
        files.push(downloadedFile(audio.link, audio.originalUrl));
    }

    return files;
};

export function listOfBooksApiLink(translationId: string): string {
    return `/api/${translationId}/books.json`;
}

export function bookChapterApiLink(translationId: string, commonName: string, chapterNumber: number, extension: string) {
    return `/api/${translationId}/${replaceSpacesWithUnderscores(commonName)}/${chapterNumber}.${extension}`;
}

export function bookChapterAudioApiLink(translationId: string, bookId: string, chapterNumber: number, reader: string) {
    return `/api/${translationId}/${replaceSpacesWithUnderscores(bookId)}/${chapterNumber}.${reader}.mp3`;
}

export function jsonFile(path: string, content: any, mergable?: boolean): OutputFile {
    return {
        path,
        content,
        mergable
    };
}

export function downloadedFile(path: string, url: string): OutputFile {
    return {
        path,
        content: () => fetch(url).then(response => response.body),
    };
}

export function replaceSpacesWithUnderscores(str: string): string {
    return str.replace(/[<>:"/\\|?*\s]/g, '_');
}