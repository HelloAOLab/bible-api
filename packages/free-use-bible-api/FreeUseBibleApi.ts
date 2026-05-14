import type {
    ApiAvailableDatasets,
    ApiAvailableTranslations,
    ApiCommentaryBookChapter,
    ApiDatasetBookChapter,
    ApiDatasetBooks,
    ApiTranslationBookChapter,
    ApiTranslationBooks,
    ApiTranslationComplete,
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
