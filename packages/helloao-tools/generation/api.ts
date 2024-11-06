import {
    Commentary,
    CommentaryBook,
    CommentaryBookChapter,
    OutputFile,
    Translation,
    TranslationBook,
    TranslationBookChapter,
    TranslationBookChapterAudioLinks,
} from './common-types.js';
import { DatasetOutput } from './dataset.js';

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

    /**
     * The list of available commentaries.
     * This maps to the /api/available-commentaries.json endpoint.
     */
    availableCommentaries: ApiAvailableCommentaries;

    /**
     * The list of books for each commentary.
     * This maps to the /api/c/:commentaryId/books.json endpoint.
     */
    commentaryBooks: ApiCommentaryBooks[];

    /**
     * The list of chapters for each commentary book.
     * This maps to the following endpoint:
     * - /api/c/:commentaryId/:bookId/:chapterNumber.json
     */
    commentaryBookChapters: ApiCommentaryBookChapter[];

    /**
     * The path prefix that the API should use.
     */
    pathPrefix: string;
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
 * The list of available commentaries.
 * Maps to the /api/available-commentaries.json endpoint.
 */
export interface ApiAvailableCommentaries {
    /**
     * The list of commentaries.
     */
    commentaries: ApiCommentary[];
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

    /**
     * Gets the name of the language that the translation is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName?: string;

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName?: string;
}

/**
 * Defines a commentary that is used in the API.
 */
export interface ApiCommentary extends Commentary {
    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: string;

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * The number of books that are contained in this commentary.
     *
     * Complete commentaries should have the same number of books as the Bible (66).
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this translation.
     *
     * Complete commentaries should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this commentary.
     *
     * Complete commentaries should have the same number of verses as the Bible (around 31,102 - some commentaries exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: number;

    /**
     * Gets the name of the language that the commentary is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName?: string;

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName?: string;
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
 * Defines an interface that contains information about the books that are available for a commentary.
 */
export interface ApiCommentaryBooks {
    /**
     * The commentary information for the books.
     */
    commentary: ApiCommentary;

    /**
     * The list of books that are available for the commentary.
     */
    books: ApiCommentaryBook[];
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
 * Defines a commentary book that is used in the API.
 */
export interface ApiCommentaryBook extends CommentaryBook {
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

/**
 * Defines an interface that contains information about a book chapter.
 */
export interface ApiCommentaryBookChapter extends CommentaryBookChapter {
    /**
     * The commentary information for the book chapter.
     */
    commentary: ApiCommentary;

    /**
     * The book information for the book chapter.
     */
    book: ApiCommentaryBook;

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
     * The link to the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: string | null;

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

/**
 * The options for generating the API.
 */
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

    /**
     * Gets the english name of the given language.
     * If not provided, then the english name for the language will be unknown and omitted.
     * @param language The language to get the english name for.
     */
    getEnglishName?: (language: string) => string | null | undefined;

    /**
     * Gets the native name of the given language.
     * If not provided, then the native name for the language will be unknown and omitted.
     * @param language The language to get the native name for.
     */
    getNativeName?: (language: string) => string | null | undefined;

    /**
     * The prefix that should be added to paths that are generated.
     */
    pathPrefix?: string;
}

/**
 * Generates the API output for the given dataset.
 * @param dataset The dataset to generate the API for.
 * @param options The options for generating the API.
 */
export function generateApiForDataset(
    dataset: DatasetOutput,
    options: GenerateApiOptions = {}
): ApiOutput {
    const { useCommonName, pathPrefix } = options;
    const apiPathPrefix = pathPrefix ? pathPrefix : '';
    let api: ApiOutput = {
        availableTranslations: {
            translations: [],
        },
        translationBooks: [],
        translationBookChapters: [],
        translationBookChapterAudio: [],
        availableCommentaries: {
            commentaries: [],
        },
        commentaryBookChapters: [],
        commentaryBooks: [],
        pathPrefix: apiPathPrefix,
    };

    const getNativeName = options.getNativeName;
    const getEnglishName = options.getEnglishName;

    for (let { books, ...translation } of dataset.translations) {
        const apiTranslation: ApiTranslation = {
            ...translation,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfBooksApiLink(
                translation.id,
                apiPathPrefix
            ),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            languageName: getNativeName
                ? getNativeName(translation.language) ?? undefined
                : undefined,
            languageEnglishName: getEnglishName
                ? getEnglishName(translation.language) ?? undefined
                : undefined,
        };

        const translationBooks: ApiTranslationBooks = {
            translation: apiTranslation,
            books: [],
        };

        let translationChapters: ApiTranslationBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const apiBook: ApiTranslationBook = {
                ...book,
                firstChapterApiLink: bookChapterApiLink(
                    translation.id,
                    getBookLink(book),
                    1,
                    'json',
                    apiPathPrefix
                ),
                lastChapterApiLink: bookChapterApiLink(
                    translation.id,
                    getBookLink(book),
                    chapters.length,
                    'json',
                    apiPathPrefix
                ),
                numberOfChapters: chapters.length,
                totalNumberOfVerses: 0,
            };

            for (let { chapter, thisChapterAudioLinks } of chapters) {
                const audio: TranslationBookChapterAudioLinks = {};
                const apiBookChapter: ApiTranslationBookChapter = {
                    translation: apiTranslation,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookChapterApiLink(
                        translation.id,
                        getBookLink(book),
                        chapter.number,
                        'json',
                        apiPathPrefix
                    ),
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
                            link: bookChapterAudioApiLink(
                                translation.id,
                                getBookLink(book),
                                chapter.number,
                                reader,
                                apiPathPrefix
                            ),
                            originalUrl: thisChapterAudioLinks[reader],
                        };
                        audio[reader] = apiAudio.link;
                        api.translationBookChapterAudio.push(apiAudio);
                    } else {
                        audio[reader] = thisChapterAudioLinks[reader];
                    }
                }

                for (let c of chapter.content) {
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
                translationChapters[i].previousChapterApiLink =
                    bookChapterApiLink(
                        translation.id,
                        getBookLink(translationChapters[i - 1].book),
                        translationChapters[i - 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                translationChapters[i].previousChapterAudioLinks =
                    translationChapters[i - 1].thisChapterAudioLinks;
            }

            if (i < translationChapters.length - 1) {
                translationChapters[i].nextChapterApiLink = bookChapterApiLink(
                    translation.id,
                    getBookLink(translationChapters[i + 1].book),
                    translationChapters[i + 1].chapter.number,
                    'json',
                    apiPathPrefix
                );
                translationChapters[i].nextChapterAudioLinks =
                    translationChapters[i + 1].thisChapterAudioLinks;
            }
        }

        api.availableTranslations.translations.push(apiTranslation);
        api.translationBooks.push(translationBooks);
    }

    for (let { books, ...commentary } of dataset.commentaries) {
        const apiCommentary: ApiCommentary = {
            ...commentary,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfCommentaryBooksApiLink(
                commentary.id,
                apiPathPrefix
            ),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            languageName: getNativeName
                ? getNativeName(commentary.language) ?? undefined
                : undefined,
            languageEnglishName: getEnglishName
                ? getEnglishName(commentary.language) ?? undefined
                : undefined,
        };

        const commentaryBooks: ApiCommentaryBooks = {
            commentary: apiCommentary,
            books: [],
        };

        let commentaryChapters: ApiCommentaryBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const apiBook: ApiCommentaryBook = {
                ...book,
                firstChapterApiLink: bookCommentaryChapterApiLink(
                    commentary.id,
                    getBookLink(book),
                    1,
                    'json',
                    apiPathPrefix
                ),
                lastChapterApiLink: bookCommentaryChapterApiLink(
                    commentary.id,
                    getBookLink(book),
                    chapters.length,
                    'json',
                    apiPathPrefix
                ),
                numberOfChapters: chapters.length,
                totalNumberOfVerses: 0,
            };

            for (let { chapter } of chapters) {
                const apiBookChapter: ApiCommentaryBookChapter = {
                    commentary: apiCommentary,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookCommentaryChapterApiLink(
                        commentary.id,
                        getBookLink(book),
                        chapter.number,
                        'json',
                        apiPathPrefix
                    ),
                    nextChapterApiLink: null,
                    previousChapterApiLink: null,
                    numberOfVerses: 0,
                };

                for (let c of chapter.content) {
                    if (c.type === 'verse') {
                        apiBookChapter.numberOfVerses++;
                    }
                }

                apiBook.totalNumberOfVerses += apiBookChapter.numberOfVerses;

                commentaryChapters.push(apiBookChapter);
                api.commentaryBookChapters.push(apiBookChapter);
            }

            commentaryBooks.books.push(apiBook);

            apiCommentary.totalNumberOfChapters += apiBook.numberOfChapters;
            apiCommentary.totalNumberOfVerses += apiBook.totalNumberOfVerses;
        }

        for (let i = 0; i < commentaryChapters.length; i++) {
            if (i > 0) {
                commentaryChapters[i].previousChapterApiLink =
                    bookCommentaryChapterApiLink(
                        commentary.id,
                        getBookLink(commentaryChapters[i - 1].book),
                        commentaryChapters[i - 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                // commentaryChapters[i].previousChapterAudioLinks =
                //     commentaryChapters[i - 1].thisChapterAudioLinks;
            }

            if (i < commentaryChapters.length - 1) {
                commentaryChapters[i].nextChapterApiLink =
                    bookCommentaryChapterApiLink(
                        commentary.id,
                        getBookLink(commentaryChapters[i + 1].book),
                        commentaryChapters[i + 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
                // commentaryChapters[i].nextChapterAudioLinks =
                //     commentaryChapters[i + 1].thisChapterAudioLinks;
            }
        }

        api.availableCommentaries.commentaries.push(apiCommentary);
        api.commentaryBooks.push(commentaryBooks);
    }

    return api;

    function getBookLink(book: TranslationBook | CommentaryBook): string {
        return useCommonName ? book.commonName : book.id;
    }
}

/**
 * Generates the output files for the given API.
 * @param api The API that the files should be generated for.
 */
export function generateFilesForApi(api: ApiOutput): OutputFile[] {
    let files: OutputFile[] = [];

    files.push(
        jsonFile(
            `${api.pathPrefix}/api/available_translations.json`,
            api.availableTranslations,
            true
        )
    );
    for (let translationBooks of api.translationBooks) {
        files.push(
            jsonFile(
                translationBooks.translation.listOfBooksApiLink,
                translationBooks
            )
        );
    }

    for (let bookChapter of api.translationBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    for (let audio of api.translationBookChapterAudio) {
        files.push(downloadedFile(audio.link, audio.originalUrl));
    }

    files.push(
        jsonFile(
            `${api.pathPrefix}/api/available_commentaries.json`,
            api.availableCommentaries,
            true
        )
    );
    for (let commentaryBooks of api.commentaryBooks) {
        files.push(
            jsonFile(
                commentaryBooks.commentary.listOfBooksApiLink,
                commentaryBooks
            )
        );
    }

    for (let bookChapter of api.commentaryBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    // for (let audio of api.translationBookChapterAudio) {
    //     files.push(downloadedFile(audio.link, audio.originalUrl));
    // }

    return files;
}

/**
 * Generates the output files for the given datasets.
 * @param datasets The datasets to generate the output files for.
 * @param options The options for generating the API files.
 */
export async function* generateOutputFilesFromDatasets(
    datasets: AsyncIterable<DatasetOutput>,
    options?: GenerateApiOptions
): AsyncGenerator<OutputFile[]> {
    for await (let dataset of datasets) {
        const api = generateApiForDataset(dataset, options);
        const files = generateFilesForApi(api);

        yield files;
    }
}

/**
 * Gets the API Link for the list of books endpoint for a translation.
 * @param translationId The ID of the translation.
 * @returns
 */
export function listOfBooksApiLink(
    translationId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/${translationId}/books.json`;
}

/**
 * Gets the API Link for the list of books endpoint for a commentary.
 * @param commentaryId The ID of the commentary.
 * @returns
 */
export function listOfCommentaryBooksApiLink(
    commentaryId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/c/${commentaryId}/books.json`;
}

/**
 * Getes the API link for a book chapter.
 * @param translationId The ID of the translation.
 * @param commonName The name of the book.
 * @param chapterNumber The number of the book.
 * @param extension The extension of the file.
 */
export function bookChapterApiLink(
    translationId: string,
    commonName: string,
    chapterNumber: number,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/${translationId}/${replaceSpacesWithUnderscores(
        commonName
    )}/${chapterNumber}.${extension}`;
}

/**
 * Getes the API link for a book chapter.
 * @param translationId The ID of the translation.
 * @param commonName The name of the book.
 * @param chapterNumber The number of the book.
 * @param extension The extension of the file.
 */
export function bookCommentaryChapterApiLink(
    translationId: string,
    commonName: string,
    chapterNumber: number,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/c/${translationId}/${replaceSpacesWithUnderscores(
        commonName
    )}/${chapterNumber}.${extension}`;
}

export function bookChapterAudioApiLink(
    translationId: string,
    bookId: string,
    chapterNumber: number,
    reader: string,
    prefix: string = ''
) {
    return `${prefix}/api/${translationId}/${replaceSpacesWithUnderscores(
        bookId
    )}/${chapterNumber}.${reader}.mp3`;
}

export function jsonFile(
    path: string,
    content: any,
    mergable?: boolean
): OutputFile {
    return {
        path,
        content,
        mergable,
    };
}

export function downloadedFile(path: string, url: string): OutputFile {
    return {
        path,
        content: () => fetch(url).then((response) => response.body),
    };
}

export function replaceSpacesWithUnderscores(str: string): string {
    return str.replace(/[<>:"/\\|?*\s]/g, '_');
}
