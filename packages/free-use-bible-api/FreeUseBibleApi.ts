import type {
    ApiAvailableDatasets,
    ApiAvailableTranslations,
    ApiCommentaryBook,
    ApiCommentaryBookChapter,
    ApiDatasetBook,
    ApiDatasetBookChapter,
    ApiDatasetBooks,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBooks,
    ApiTranslationComplete,
    ChapterVerse,
    TranslationChapterReference,
} from './types.gen.js';

/**
 * Options for the FreeUseBibleApi class.
 */
export interface FreeUseBibleApiOptions {
    /**
     * The API endpoint to use for the requests. If not provided, the default endpoint will be used.
     */
    endpoint?: string;

    /**
     * Whether to cache responses in memory.
     *
     * Defaults to `true`.
     */
    useCache?: boolean;
}

/**
 * Options for the `getChapterText` method.
 */
export interface GetChapterTextOptions {
    /**
     * Whether to omit verse numbers from the returned text.
     * Defaults to `false`.
     */
    omitVerseNumbers?: boolean;

    /**
     * Whether to omit the chapter reference from the returned text.
     */
    omitReference?: boolean;
}

/**
 * Options for the `getVerseText` method.
 */
export interface GetVerseTextOptions {
    /**
     * Whether to omit the chapter reference from the returned text.
     */
    omitReference?: boolean;
}

/**
 * A reference to a specific verse in a Bible translation, commentary, or dataset.
 */
export interface VerseReference {
    /**
     * The chapter number of the reference. This should be a positive integer.
     */
    chapter: number;

    /**
     * The verse number of the reference.
     *
     * If omitted, then the reference refers to the entire chapter rather than a specific verse.
     */
    verse?: number;

    /**
     * The ending verse number of the reference, for references that span multiple verses. This should be greater than or equal to the `verse` property if it is provided.
     */
    endVerse?: number;

    /**
     * The ending chapter number of the reference, for references that span multiple chapters. This should be greater than or equal to the `chapter` property if it is provided.
     */
    endChapter?: number;
}

/**
 * A client for interacting with the [Free Use Bible API](https://bible.helloao.org/).
 *
 * This API provides access to a large collection of Bible translations, commentaries, and datasets that are free to use.
 */
export class FreeUseBibleApi {
    endpoint: string = 'https://bible.helloao.org/';
    private _responseCache = new Map<string, Promise<unknown>>();
    private _useCache: boolean = true;

    constructor(options?: FreeUseBibleApiOptions) {
        this.endpoint = options?.endpoint ?? this.endpoint;
        this._useCache = options?.useCache ?? this._useCache;
    }

    /**
     * Gets the list of available Bible translations from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getAvailableTranslations(
        endpoint?: string
    ): Promise<ApiAvailableTranslations> {
        return this._getJson<ApiAvailableTranslations>(
            'api/available_translations.json',
            endpoint
        );
    }

    /**
     * Gets the complete content of a specific Bible translation.
     *
     * The results of this endpoint are very large, so the response is not cached.
     * @param translation The ID of the translation to get the complete content for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getCompleteTranslation(
        translation: string,
        endpoint?: string
    ): Promise<ApiTranslationComplete> {
        const encodedTranslation = encodeURIComponent(translation);
        return this._getJson<ApiTranslationComplete>(
            `api/${encodedTranslation}/complete.json`,
            endpoint,
            false
        );
    }

    /**
     * Gets the list of available Bible commentaries from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getAvailableCommentaries(
        endpoint?: string
    ): Promise<ApiAvailableTranslations> {
        return this._getJson<ApiAvailableTranslations>(
            'api/available_commentaries.json',
            endpoint
        );
    }

    /**
     * Gets the list of available datasets from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getAvailableDatasets(
        endpoint?: string
    ): Promise<ApiAvailableDatasets> {
        return this._getJson<ApiAvailableDatasets>(
            'api/available_datasets.json',
            endpoint
        );
    }

    /**
     * Gets the list of books for a given Bible translation.
     * @param translation The ID of the translation to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getTranslationBooks(
        translation: string,
        endpoint?: string
    ): Promise<ApiTranslationBooks> {
        const encodedTranslation = encodeURIComponent(translation);
        return this._getJson<ApiTranslationBooks>(
            `api/${encodedTranslation}/books.json`,
            endpoint
        );
    }

    /**
     * Gets the list of books for a given Bible commentary.
     * @param commentary The ID of the commentary to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getCommentaryBooks(
        commentary: string,
        endpoint?: string
    ): Promise<ApiTranslationBooks> {
        const encodedCommentary = encodeURIComponent(commentary);
        return this._getJson<ApiTranslationBooks>(
            `api/${encodedCommentary}/books.json`,
            endpoint
        );
    }

    /**
     * Gets the list of books for a given dataset.
     * @param dataset The ID of the dataset to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getDatasetBooks(
        dataset: string,
        endpoint?: string
    ): Promise<ApiDatasetBooks> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetBooks>(
            `api/d/${encodedDataset}/books.json`,
            endpoint
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible translation.
     * @param translation The ID of the translation to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getTranslationBookChapter(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiTranslationBookChapter> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiTranslationBookChapter>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.json`,
            endpoint
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible commentary.
     * @param commentary The ID of the commentary to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getCommentaryBookChapter(
        commentary: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiTranslationBookChapter> {
        const encodedCommentary = encodeURIComponent(commentary);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiTranslationBookChapter>(
            `api/${encodedCommentary}/${encodedBook}/${encodedChapter}.json`,
            endpoint
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific dataset.
     * @param dataset The ID of the dataset to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getDatasetBookChapter(
        dataset: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiDatasetBookChapter> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiDatasetBookChapter>(
            `api/d/${encodedDataset}/${encodedBook}/${encodedChapter}.json`,
            endpoint
        );
    }

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint?: string
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiTranslationBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiDatasetBookChapter,
        endpoint?: string
    ): Promise<ApiDatasetBookChapter | null>;
    async getNextChapter(
        chapter:
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter,
        endpoint?: string
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | null
    > {
        if (!chapter.nextChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
        >(chapter.nextChapterApiLink, endpoint);
    }

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint?: string
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiTranslationBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiDatasetBookChapter,
        endpoint?: string
    ): Promise<ApiDatasetBookChapter | null>;
    async getPreviousChapter(
        chapter:
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter,
        endpoint?: string
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | null
    > {
        if (!chapter.previousChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
        >(chapter.previousChapterApiLink, endpoint);
    }

    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The first chapter, or null if there is no first chapter.
     */
    getFirstChapter(
        book: ApiCommentaryBook,
        endpoint?: string
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The first chapter, or null if there is no first chapter.
     */
    getFirstChapter(
        book: ApiTranslationBook,
        endpoint?: string
    ): Promise<ApiTranslationBookChapter>;
    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The first chapter, or null if there is no first chapter.
     */
    getFirstChapter(
        book: ApiDatasetBook,
        endpoint?: string
    ): Promise<ApiDatasetBookChapter>;
    async getFirstChapter(
        book: ApiTranslationBook | ApiCommentaryBook | ApiDatasetBook,
        endpoint?: string
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | null
    > {
        if (!book.firstChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
        >(book.firstChapterApiLink, endpoint);
    }

    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The last chapter, or null if there is no last chapter.
     */
    getLastChapter(
        book: ApiCommentaryBook,
        endpoint?: string
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The last chapter, or null if there is no last chapter.
     */
    getLastChapter(
        book: ApiTranslationBook,
        endpoint?: string
    ): Promise<ApiTranslationBookChapter>;
    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The last chapter, or null if there is no last chapter.
     */
    getLastChapter(
        book: ApiDatasetBook,
        endpoint?: string
    ): Promise<ApiDatasetBookChapter>;
    async getLastChapter(
        book: ApiTranslationBook | ApiCommentaryBook | ApiDatasetBook,
        endpoint?: string
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | null
    > {
        if (!book.lastChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
        >(book.lastChapterApiLink, endpoint);
    }

    /**
     * Formats a verse reference as a human-readable string.
     *
     * e.g. Genesis 1:1-2, John 3:16, Exodus 20-22, etc.
     *
     * @param book The book that the reference is for.
     * @param reference The reference to format.
     */
    formatReference(
        book: ApiTranslationBook,
        reference: VerseReference
    ): string {
        const bookName = book.name;
        const chapter = reference.chapter;
        const verse = reference.verse;
        const endChapter = reference.endChapter;
        const endVerse = reference.endVerse;

        let referenceStr = `${bookName} ${chapter}`;
        if (endChapter) {
            referenceStr += `-${endChapter}`;
        } else if (verse) {
            referenceStr += `:${verse}`;
            if (endVerse) {
                referenceStr += `-${endVerse}`;
            }
        }
        return referenceStr;
    }

    /**
     * Gets the text for a verse.
     * @param verse The verse to get the text for.
     * @param options Options for getting the verse text.
     */
    getVerseText(verse: ChapterVerse): string {
        let content = '';
        for (let part of verse.content) {
            if (typeof part === 'string') {
                content += part;
            } else if (typeof part === 'object' && 'text' in part) {
                if (part.poem) {
                    content += '\n';
                    for (let i = 0; i < part.poem; i++) {
                        content += '\t';
                    }
                }
                content += part.text;
            } else if (typeof part === 'object' && 'lineBreak' in part) {
                content += '\n';
            } else if (typeof part === 'object') {
                content += ' ';
            }
        }
        return content.trim();
    }

    /**
     * Gets the verse text for the given chapter.
     * By default, the returned text includes markers for verse numbers and a reference to the chapter, but these can be omitted by passing options to the `options` parameter.
     * @param chapter The chapter to get the text for.
     * @param options Options for getting the chapter text.
     */
    getChapterVerseText(
        chapter: ApiTranslationBookChapter,
        options: GetChapterTextOptions = {}
    ): string {
        let content = '';
        for (let chapterContent of chapter.chapter.content) {
            if (chapterContent.type === 'verse') {
                if (!options.omitVerseNumbers) {
                    content += `[${chapterContent.number}] `;
                }
                content += this.getVerseText(chapterContent) + ' ';
            } else if (chapterContent.type === 'line_break') {
                content = content.trim() + '\n';
            }
        }

        if (!options.omitReference) {
            content = `${this.formatReference(chapter.book, {
                chapter: chapter.chapter.number,
            })}\n${content.trim()}`;
        }

        return content.trim();
    }

    private _getJson<T>(
        path: string,
        endpoint: string | undefined,
        useCache: boolean = true
    ): Promise<T> {
        const url = this._buildUrl(path, endpoint);
        const existing = this._responseCache.get(url) as Promise<T> | undefined;
        if (existing) {
            return existing;
        }

        const request: Promise<T> = fetch(url)
            .then(async (response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(
                        `Failed request to ${url}. Status: ${response.status} ${response.statusText}`
                    );
                }
                return await response.json();
            })
            .catch((error) => {
                this._responseCache.delete(url);
                throw error;
            });

        if (this._useCache && useCache) {
            this._responseCache.set(url, request);
        }
        return request;
    }

    private _buildUrl(path: string, endpoint?: string): string {
        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        const baseEndpoint = endpoint ?? this.endpoint;
        return new URL(path, baseEndpoint).href;
    }
}
