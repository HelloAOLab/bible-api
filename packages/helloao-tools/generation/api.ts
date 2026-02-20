import {
    ChapterContent,
    ChapterData,
    ChapterFootnote,
    Commentary,
    CommentaryBook,
    CommentaryBookChapter,
    CommentaryProfile,
    Dataset,
    DatasetBook,
    DatasetBookChapter,
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
     * The list of profiles for each commentary.
     * This maps to the /api/c/:commentaryId/profiles.json endpoint.
     */
    commentaryProfiles: ApiCommentaryProfiles[];

    /**
     * The list of chapters for each commentary book.
     * This maps to the following endpoint:
     * - /api/c/:commentaryId/:bookId/:chapterNumber.json
     */
    commentaryBookChapters: ApiCommentaryBookChapter[];

    /**
     * The list of individual profiles for each commentary.
     * This maps to the following endpoint:
     * - /api/c/:commentaryId/profiles/:profileId.json
     */
    commentaryProfileContents: ApiCommentaryProfileContent[];

    /**
     * The list of available datasets.
     * This maps to the /api/available-datasets.json endpoint.
     */
    availableDatasets?: ApiAvailableDatasets;

    /**
     * The list of books for each dataset.
     * This maps to the /api/d/:datasetId/books.json endpoint.
     */
    datasetBooks?: ApiDatasetBooks[];

    /**
     * The list of chapters for each dataset book.
     * This maps to the following endpoint:
     * - /api/d/:datasetId/:bookId/:chapterNumber.json
     */
    datasetBookChapters?: ApiDatasetBookChapter[];

    /**
     * The complete translation data for each translation.
     * This maps to the /api/:translationId/complete.json endpoint.
     */
    translationComplete: ApiTranslationComplete[];

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
 * The list of available datasets.
 * Maps to the /api/available-datasets.json endpoint.
 */
export interface ApiAvailableDatasets {
    datasets: ApiDataset[];
}

/**
 * Defines a dataset that is used in the API.
 */
export interface ApiDataset extends Dataset {
    /**
     * The API link for the list of books for this dataset.
     */
    listOfBooksApiLink: string;

    /**
     * The available list of formats.
     */
    availableFormats: 'json'[];

    /**
     * The number of books that are contained in this dataset.
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this dataset.
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this dataset.
     */
    totalNumberOfVerses: number;

    /**
     * The total number of references that are contained in this dataset.
     */
    totalNumberOfReferences: number;

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
     * The total number of apocryphal books that are contained in this translation.
     */
    numberOfApocryphalBooks?: number;

    /**
     * The total number of apocryphal chapters that are contained in this translation.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * the total number of apocryphal verses that are contained in this translation.
     */
    totalNumberOfApocryphalVerses?: number;

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

    /**
     * The API link for downloading the complete translation as a single JSON file.
     *
     * Undefined if complete translation files are not available.
     */
    completeTranslationApiLink?: string;
}

/**
 * Defines the complete translation download data.
 * Maps to the /api/:translationId/complete.json endpoint.
 */
export interface ApiTranslationComplete {
    /**
     * The translation metadata.
     */
    translation: ApiTranslation;

    /**
     * The complete list of books with all their chapters.
     */
    books: ApiTranslationCompleteBook[];
}

/**
 * A book in the complete translation download.
 */
export interface ApiTranslationCompleteBook {
    /**
     * The ID of the book.
     */
    id: string;

    /**
     * The name of the book from the translation.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;

    /**
     * The title of the book.
     */
    title: string | null;

    /**
     * The order of the book.
     */
    order: number;

    /**
     * The number of chapters in the book.
     */
    numberOfChapters: number;

    /**
     * The total number of verses in the book.
     */
    totalNumberOfVerses: number;

    /**
     * Whether the book is apocryphal.
     */
    isApocryphal?: boolean;

    /**
     * The complete list of chapters with all content.
     */
    chapters: TranslationBookChapter[];
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
     * The API link for the list of available profiles for this commentary.
     */
    listOfProfilesApiLink: string;

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
     * The total number of profiles that are contained in this commentary.
     *
     * Profiles are used to provide additional information about people and people groups that are mentioned in the Bible.
     */
    totalNumberOfProfiles: number;

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
 * Defines an interface that contains information about the books that are available for a dataset.
 */
export interface ApiDatasetBooks {
    /**
     * The dataset information for the books.
     */
    dataset: ApiDataset;

    /**
     * The list of books that are available for the dataset.
     */
    books: ApiDatasetBook[];
}

/**
 * Defines an interface that contains information about the profiles that are available for a commentary.
 */
export interface ApiCommentaryProfiles {
    /**
     * The commentary information for the books.
     */
    commentary: ApiCommentary;

    /**
     * The list of profiles that are available for the commentary.
     */
    profiles: ApiCommentaryProfile[];
}

/**
 * Defines an interface that contains information about a profile.
 */
export interface ApiCommentaryProfile extends CommentaryProfile {
    /**
     * The link to this profile.
     */
    thisProfileLink: string;

    /**
     * The link to the chapter that this profile references in the commentary.
     */
    referenceChapterLink: string | null;
}

/**
 * Defines a translation book that is used in the API.
 */
export interface ApiTranslationBook extends TranslationBook {
    /**
     * The number of the first chapter in the book.
     */
    firstChapterNumber: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The number of the last chapter in the book.
     */
    lastChapterNumber: number;

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
     * The number of the first chapter in the book.
     *
     * Null if the comentary book has no chapters.
     */
    firstChapterNumber: number | null;

    /**
     * The link to the first chapter of the book.
     *
     * Null if the comentary book has no chapters.
     */
    firstChapterApiLink: string | null;

    /**
     * The number of the last chapter in the book.
     *
     * Null if the comentary book has no chapters.
     */
    lastChapterNumber: number | null;

    /**
     * The link to the last chapter of the book.
     *
     * Null if the comentary book has no chapters.
     */
    lastChapterApiLink: string | null;

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
 * Defines an interface that contains information about a book in a dataset.
 */
export interface ApiDatasetBook extends DatasetBook {
    /**
     * The number of the first chapter in the book.
     */
    firstChapterNumber: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The number of the last chapter in the book.
     */
    lastChapterNumber: number;

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

    /**
     * The number of references that the book contains.
     */
    totalNumberOfReferences: number;
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

/**
 * Defines an interface that contains information about a book chapter.
 */
export interface ApiDatasetBookChapter extends DatasetBookChapter {
    /**
     * The dataset information for the book chapter.
     */
    dataset: ApiDataset;

    /**
     * The book information for the book chapter.
     */
    book: ApiDatasetBook;

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

    /**
     * The number of references that the chapter contains.
     */
    numberOfReferences: number;
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

export interface ApiCommentaryProfileContent {
    /**
     * The commentary information for the profile.
     */
    commentary: ApiCommentary;

    /**
     * The information about the profile.
     */
    profile: ApiCommentaryProfile;

    /**
     * The content of the profile.
     */
    content: string[];
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

    /**
     * Whether to generate complete translation files for each translation.
     */
    generateCompleteTranslationFiles?: boolean;
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
        translationComplete: [],
        availableCommentaries: {
            commentaries: [],
        },
        commentaryBookChapters: [],
        commentaryBooks: [],
        commentaryProfiles: [],
        commentaryProfileContents: [],
        pathPrefix: apiPathPrefix,
    };

    const getNativeName = options.getNativeName;
    const getEnglishName = options.getEnglishName;

    for (let { books, ...translation } of dataset.translations) {
        let numberOfBooks = 0;
        let numberOfApocryphalBooks = 0;

        for (let book of books) {
            if (book.isApocryphal) {
                numberOfApocryphalBooks++;
            } else {
                numberOfBooks++;
            }
        }

        const apiTranslation: ApiTranslation = {
            ...translation,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfBooksApiLink(
                translation.id,
                apiPathPrefix
            ),
            completeTranslationApiLink: options.generateCompleteTranslationFiles
                ? completeTranslationApiLink(translation.id, apiPathPrefix)
                : undefined,
            numberOfBooks,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            languageName: getNativeName
                ? (getNativeName(translation.language) ?? undefined)
                : undefined,
            languageEnglishName: getEnglishName
                ? (getEnglishName(translation.language) ?? undefined)
                : undefined,
        };

        if (numberOfApocryphalBooks > 0) {
            apiTranslation.numberOfApocryphalBooks = numberOfApocryphalBooks;
        }

        const translationBooks: ApiTranslationBooks = {
            translation: apiTranslation,
            books: [],
        };

        let translationChapters: ApiTranslationBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const firstChapterNumber = chapters[0]?.chapter.number;
            const lastChapterNumber =
                chapters[chapters.length - 1]?.chapter.number;
            const apiBook: ApiTranslationBook = {
                ...book,
                firstChapterNumber,
                firstChapterApiLink: bookChapterApiLink(
                    translation.id,
                    getBookLink(book),
                    firstChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                lastChapterNumber,
                lastChapterApiLink: bookChapterApiLink(
                    translation.id,
                    getBookLink(book),
                    lastChapterNumber,
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

            if (apiBook.isApocryphal) {
                if (!apiTranslation.totalNumberOfApocryphalChapters) {
                    apiTranslation.totalNumberOfApocryphalChapters = 0;
                }
                if (!apiTranslation.totalNumberOfApocryphalVerses) {
                    apiTranslation.totalNumberOfApocryphalVerses = 0;
                }
                apiTranslation.totalNumberOfApocryphalChapters +=
                    apiBook.numberOfChapters;
                apiTranslation.totalNumberOfApocryphalVerses +=
                    apiBook.totalNumberOfVerses;
            } else {
                apiTranslation.totalNumberOfChapters +=
                    apiBook.numberOfChapters;
                apiTranslation.totalNumberOfVerses +=
                    apiBook.totalNumberOfVerses;
            }
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

        if (options.generateCompleteTranslationFiles) {
            // Build the complete translation data for download
            const completeTranslation: ApiTranslationComplete = {
                translation: apiTranslation,
                books: translationBooks.books.map((book) => {
                    const bookChapters = translationChapters.filter(
                        (ch) => ch.book.id === book.id
                    );
                    return {
                        id: book.id,
                        name: book.name,
                        commonName: book.commonName,
                        title: book.title,
                        order: book.order,
                        numberOfChapters: book.numberOfChapters,
                        totalNumberOfVerses: book.totalNumberOfVerses,
                        isApocryphal: book.isApocryphal,
                        chapters: bookChapters.map((ch) => ({
                            numberOfVerses: ch.numberOfVerses,
                            thisChapterAudioLinks: ch.thisChapterAudioLinks,
                            chapter: ch.chapter,
                        })),
                    };
                }),
            };
            api.translationComplete.push(completeTranslation);
        }
    }

    for (let { books, profiles, ...commentary } of dataset.commentaries) {
        const apiCommentary: ApiCommentary = {
            ...commentary,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfCommentaryBooksApiLink(
                commentary.id,
                apiPathPrefix
            ),
            listOfProfilesApiLink: profilesCommentaryApiLink(
                commentary.id,
                'json',
                apiPathPrefix
            ),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            totalNumberOfProfiles: 0,
            languageName: getNativeName
                ? (getNativeName(commentary.language) ?? undefined)
                : undefined,
            languageEnglishName: getEnglishName
                ? (getEnglishName(commentary.language) ?? undefined)
                : undefined,
        };

        const commentaryBooks: ApiCommentaryBooks = {
            commentary: apiCommentary,
            books: [],
        };

        const commentaryProfiles: ApiCommentaryProfiles = {
            commentary: apiCommentary,
            profiles: [],
        };

        let commentaryChapters: ApiCommentaryBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const firstChapterNumber = chapters[0]?.chapter.number ?? null;
            const lastChapterNumber =
                chapters[chapters.length - 1]?.chapter.number ?? null;
            const apiBook: ApiCommentaryBook = {
                ...book,
                firstChapterNumber,
                firstChapterApiLink: firstChapterNumber
                    ? bookCommentaryChapterApiLink(
                          commentary.id,
                          getBookLink(book),
                          firstChapterNumber,
                          'json',
                          apiPathPrefix
                      )
                    : null,
                lastChapterNumber,
                lastChapterApiLink: lastChapterNumber
                    ? bookCommentaryChapterApiLink(
                          commentary.id,
                          getBookLink(book),
                          lastChapterNumber,
                          'json',
                          apiPathPrefix
                      )
                    : null,
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

        if (profiles) {
            for (let profile of profiles) {
                const apiProfile: ApiCommentaryProfile = {
                    id: profile.id,
                    reference: profile.reference,
                    subject: profile.subject,
                    thisProfileLink: profileCommentaryApiLink(
                        commentary.id,
                        profile.id,
                        'json',
                        apiPathPrefix
                    ),
                    referenceChapterLink: profile.reference
                        ? bookCommentaryChapterApiLink(
                              commentary.id,
                              profile.reference.book,
                              profile.reference.chapter,
                              'json',
                              apiPathPrefix
                          )
                        : null,
                };

                const apiProfileContent: ApiCommentaryProfileContent = {
                    commentary: apiCommentary,
                    profile: apiProfile,
                    content: profile.content,
                };

                apiCommentary.totalNumberOfProfiles += 1;
                commentaryProfiles.profiles.push(apiProfile);
                api.commentaryProfileContents.push(apiProfileContent);
            }
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
        api.commentaryProfiles.push(commentaryProfiles);
    }

    for (let { books, ...datasetInfo } of dataset.datasets ?? []) {
        const apiDataset: ApiDataset = {
            ...datasetInfo,
            availableFormats: ['json'],
            listOfBooksApiLink: listOfDatasetBooksApiLink(
                datasetInfo.id,
                apiPathPrefix
            ),
            numberOfBooks: books.length,
            totalNumberOfChapters: 0,
            totalNumberOfVerses: 0,
            totalNumberOfReferences: 0,
            languageName: getNativeName
                ? (getNativeName(datasetInfo.language) ?? undefined)
                : undefined,
            languageEnglishName: getEnglishName
                ? (getEnglishName(datasetInfo.language) ?? undefined)
                : undefined,
        };

        const datasetBooks: ApiDatasetBooks = {
            dataset: apiDataset,
            books: [],
        };

        let datasetChapters: ApiDatasetBookChapter[] = [];

        for (let { chapters, ...book } of books) {
            const firstChapterNumber = chapters[0]?.chapter.number ?? null;
            const lastChapterNumber =
                chapters[chapters.length - 1]?.chapter.number ?? null;
            const apiBook: ApiDatasetBook = {
                ...book,
                firstChapterNumber,
                firstChapterApiLink: bookDatasetChapterApiLink(
                    datasetInfo.id,
                    book.id,
                    firstChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                lastChapterNumber,
                lastChapterApiLink: bookDatasetChapterApiLink(
                    datasetInfo.id,
                    book.id,
                    lastChapterNumber,
                    'json',
                    apiPathPrefix
                ),
                numberOfChapters: chapters.length,
                totalNumberOfVerses: 0,
                totalNumberOfReferences: 0,
            };

            for (let { chapter } of chapters) {
                const apiBookChapter: ApiDatasetBookChapter = {
                    dataset: apiDataset,
                    book: apiBook,
                    chapter: chapter,
                    thisChapterLink: bookDatasetChapterApiLink(
                        datasetInfo.id,
                        book.id,
                        chapter.number,
                        'json',
                        apiPathPrefix
                    ),
                    nextChapterApiLink: null,
                    previousChapterApiLink: null,
                    numberOfVerses: chapter.content.length,
                    numberOfReferences: 0,
                };

                // apiBookChapter.numberOfVerses += ;
                for (let verse of chapter.content) {
                    apiBookChapter.numberOfReferences +=
                        verse.references.length;
                }

                apiBook.totalNumberOfVerses += apiBookChapter.numberOfVerses;
                apiBook.totalNumberOfReferences +=
                    apiBookChapter.numberOfReferences;

                datasetChapters.push(apiBookChapter);
                if (!api.datasetBookChapters) {
                    api.datasetBookChapters = [];
                }
                api.datasetBookChapters.push(apiBookChapter);
            }

            datasetBooks.books.push(apiBook);

            apiDataset.totalNumberOfChapters += apiBook.numberOfChapters;
            apiDataset.totalNumberOfVerses += apiBook.totalNumberOfVerses;
            apiDataset.totalNumberOfReferences +=
                apiBook.totalNumberOfReferences;
        }

        for (let i = 0; i < datasetChapters.length; i++) {
            if (i > 0) {
                datasetChapters[i].previousChapterApiLink =
                    bookDatasetChapterApiLink(
                        datasetInfo.id,
                        datasetChapters[i - 1].book.id,
                        datasetChapters[i - 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
            }

            if (i < datasetChapters.length - 1) {
                datasetChapters[i].nextChapterApiLink =
                    bookDatasetChapterApiLink(
                        datasetInfo.id,
                        datasetChapters[i + 1].book.id,
                        datasetChapters[i + 1].chapter.number,
                        'json',
                        apiPathPrefix
                    );
            }
        }

        if (!api.availableDatasets) {
            api.availableDatasets = {
                datasets: [],
            };
        }
        api.availableDatasets.datasets.push(apiDataset);
        if (!api.datasetBooks) {
            api.datasetBooks = [];
        }
        api.datasetBooks.push(datasetBooks);
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

    // Generate complete translation download files
    for (let complete of api.translationComplete) {
        if (complete.translation.completeTranslationApiLink) {
            files.push(
                jsonFile(
                    complete.translation.completeTranslationApiLink,
                    complete
                )
            );
        }
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

    for (let commentaryProfiles of api.commentaryProfiles) {
        files.push(
            jsonFile(
                commentaryProfiles.commentary.listOfProfilesApiLink,
                commentaryProfiles
            )
        );
    }

    for (let profileContent of api.commentaryProfileContents) {
        files.push(
            jsonFile(profileContent.profile.thisProfileLink, profileContent)
        );
    }

    for (let bookChapter of api.commentaryBookChapters) {
        files.push(jsonFile(bookChapter.thisChapterLink, bookChapter));
    }

    if (api.availableDatasets) {
        files.push(
            jsonFile(
                `${api.pathPrefix}/api/available_datasets.json`,
                api.availableDatasets,
                true
            )
        );
    }

    if (api.datasetBooks) {
        for (let datasetBook of api.datasetBooks) {
            files.push(
                jsonFile(datasetBook.dataset.listOfBooksApiLink, datasetBook)
            );
        }
    }

    if (api.datasetBookChapters) {
        for (let datasetBookChapter of api.datasetBookChapters) {
            files.push(
                jsonFile(datasetBookChapter.thisChapterLink, datasetBookChapter)
            );
        }
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
 * Gets the API Link for the complete translation download endpoint.
 * @param translationId The ID of the translation.
 * @param prefix The path prefix.
 * @returns
 */
export function completeTranslationApiLink(
    translationId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/${translationId}/complete.json`;
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
 * Gets the API Link for the list of books endpoint for a dataset.
 * @param datasetId The ID of the dataset.
 * @returns
 */
export function listOfDatasetBooksApiLink(
    datasetId: string,
    prefix: string = ''
): string {
    return `${prefix}/api/d/${datasetId}/books.json`;
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

/**
 * Getes the API link for a book chapter.
 * @param translationId The ID of the translation.
 * @param commonName The name of the book.
 * @param chapterNumber The number of the book.
 * @param extension The extension of the file.
 */
export function bookDatasetChapterApiLink(
    translationId: string,
    commonName: string,
    chapterNumber: number,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/d/${translationId}/${replaceSpacesWithUnderscores(
        commonName
    )}/${chapterNumber}.${extension}`;
}

/**
 * Gets the API link for a profile.
 * @param translationId The ID of the translation.
 * @param profileId The ID of the profile.
 * @param extension The extension of the file.
 */
export function profilesCommentaryApiLink(
    translationId: string,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/c/${translationId}/profiles.${extension}`;
}

/**
 * Gets the API link for a profile.
 * @param translationId The ID of the translation.
 * @param profileId The ID of the profile.
 * @param extension The extension of the file.
 */
export function profileCommentaryApiLink(
    translationId: string,
    profileId: string,
    extension: string,
    prefix: string = ''
) {
    return `${prefix}/api/c/${translationId}/profiles/${replaceSpacesWithUnderscores(
        profileId
    )}.${extension}`;
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
