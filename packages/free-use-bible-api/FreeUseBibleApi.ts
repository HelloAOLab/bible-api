import type {
    ApiAvailableDatasets,
    ApiAvailableTranslations,
    ApiCommentaryBook,
    ApiCommentaryBookChapter,
    ApiDatasetBook,
    ApiDatasetBookChapter,
    ApiDatasetBooks,
    ApiSimpleCommentaryBookChapter,
    ApiSimpleTranslationBookChapter,
    ApiSimpleTranslationBookChapterWords,
    ApiSimpleTranslationComplete,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBookChapterWords,
    ApiTranslationBooks,
    ApiTranslationComplete,
    ChapterVerse,
    ChapterWord,
    SimpleChapterVerse,
    SimpleChapterWord,
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
 * A word-level annotation, paired with the text of the verse that it covers.
 */
export interface AnnotatedWord extends ChapterWord {
    /**
     * The text that the annotation applies to.
     */
    text: string;
}

/**
 * A word-level annotation in a simplified chapter, paired with the text of the verse that it covers.
 */
export interface SimpleAnnotatedWord extends SimpleChapterWord {
    /**
     * The text that the annotation applies to.
     */
    text: string;
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
     * Gets the complete content of a specific Bible translation, using the simplified chapter format.
     *
     * The results of this endpoint are very large, so the response is not cached.
     * @param translation The ID of the translation to get the complete content for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getSimpleCompleteTranslation(
        translation: string,
        endpoint?: string
    ): Promise<ApiSimpleTranslationComplete> {
        const encodedTranslation = encodeURIComponent(translation);
        return this._getJson<ApiSimpleTranslationComplete>(
            `api/${encodedTranslation}/complete.simple.json`,
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
            `api/c/${encodedCommentary}/books.json`,
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
     * Gets the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific Bible translation.
     *
     * Only some translations have word-level annotations. This request will fail for chapters that don't have any.
     * Use `getChapterWords()` to get the annotations for a chapter that you have already loaded, which returns null instead of failing.
     * @param translation The ID of the translation to get the annotations for.
     * @param book The ID of the book to get the annotations for.
     * @param chapter The chapter number to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getTranslationBookChapterWords(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiTranslationBookChapterWords> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiTranslationBookChapterWords>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.words.json`,
            endpoint
        );
    }

    /**
     * Gets the word-level annotations for the given chapter, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The annotations for the chapter, or null if the chapter doesn't have any.
     */
    async getChapterWords(
        chapter: ApiTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiTranslationBookChapterWords | null> {
        if (!chapter.thisChapterWordsLink) {
            return null;
        }
        return this._getJson<ApiTranslationBookChapterWords>(
            chapter.thisChapterWordsLink,
            endpoint
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible translation, using the simplified chapter format.
     *
     * In the simplified format, each verse's content is a single string instead of a list of formatted content, and footnotes, inline headings, the Words of Jesus, and poetry are represented as offset ranges into that string.
     * @param translation The ID of the translation to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getSimpleTranslationBookChapter(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiSimpleTranslationBookChapter> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiSimpleTranslationBookChapter>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.simple.json`,
            endpoint
        );
    }

    /**
     * Gets the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific Bible translation, with their offsets remapped onto the text of each simplified verse.
     *
     * Use this instead of `getTranslationBookChapterWords()` when working with the simplified chapter format, since the offsets in the regular annotations are anchored to a verse's content array instead of its plain text.
     * Use `getSimpleChapterWords()` to get the annotations for a simplified chapter that you have already loaded, which returns null instead of failing.
     * @param translation The ID of the translation to get the annotations for.
     * @param book The ID of the book to get the annotations for.
     * @param chapter The chapter number to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getSimpleTranslationBookChapterWords(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiSimpleTranslationBookChapterWords> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiSimpleTranslationBookChapterWords>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.words.simple.json`,
            endpoint
        );
    }

    /**
     * Gets the simplified version of a given chapter, if available.
     * @param chapter The chapter to get the simplified version of.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The simplified chapter, or null if simplified chapters aren't available for it.
     */
    getSimpleChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleCommentaryBookChapter | null>;
    /**
     * Gets the simplified version of a given chapter, if available.
     * @param chapter The chapter to get the simplified version of.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The simplified chapter, or null if simplified chapters aren't available for it.
     */
    getSimpleChapter(
        chapter: ApiTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleTranslationBookChapter | null>;
    async getSimpleChapter(
        chapter: ApiTranslationBookChapter | ApiCommentaryBookChapter,
        endpoint?: string
    ): Promise<
        ApiSimpleTranslationBookChapter | ApiSimpleCommentaryBookChapter | null
    > {
        if (!chapter.simpleChapterApiLink) {
            return null;
        }
        return this._getJson<
            ApiSimpleTranslationBookChapter | ApiSimpleCommentaryBookChapter
        >(chapter.simpleChapterApiLink, endpoint);
    }

    /**
     * Gets the word-level annotations for the given simplified chapter, if it has any.
     * @param chapter The simplified chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The annotations for the chapter, or null if the chapter doesn't have any.
     */
    async getSimpleChapterWords(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleTranslationBookChapterWords | null> {
        if (!chapter.thisChapterWordsLink) {
            return null;
        }
        return this._getJson<ApiSimpleTranslationBookChapterWords>(
            chapter.thisChapterWordsLink,
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
            `api/c/${encodedCommentary}/${encodedBook}/${encodedChapter}.json`,
            endpoint
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible commentary, using the simplified chapter format.
     * @param commentary The ID of the commentary to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    async getSimpleCommentaryBookChapter(
        commentary: string,
        book: string,
        chapter: number | string,
        endpoint?: string
    ): Promise<ApiSimpleCommentaryBookChapter> {
        const encodedCommentary = encodeURIComponent(commentary);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiSimpleCommentaryBookChapter>(
            `api/c/${encodedCommentary}/${encodedBook}/${encodedChapter}.simple.json`,
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
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiSimpleCommentaryBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleCommentaryBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleTranslationBookChapter | null>;
    async getNextChapter(
        chapter:
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter,
        endpoint?: string
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | ApiSimpleTranslationBookChapter
        | ApiSimpleCommentaryBookChapter
        | null
    > {
        if (!chapter.nextChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter
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
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiSimpleCommentaryBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleCommentaryBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint?: string
    ): Promise<ApiSimpleTranslationBookChapter | null>;
    async getPreviousChapter(
        chapter:
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter,
        endpoint?: string
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | ApiSimpleTranslationBookChapter
        | ApiSimpleCommentaryBookChapter
        | null
    > {
        if (!chapter.previousChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter
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

    /**
     * Gets the verse text for the given simplified chapter.
     * By default, the returned text includes markers for verse numbers and a reference to the chapter, but these can be omitted by passing options to the `options` parameter.
     * @param chapter The simplified chapter to get the text for.
     * @param options Options for getting the chapter text.
     */
    getSimpleChapterVerseText(
        chapter: ApiSimpleTranslationBookChapter,
        options: GetChapterTextOptions = {}
    ): string {
        let content = '';
        for (let chapterContent of chapter.chapter.content) {
            if (chapterContent.type === 'verse') {
                if (!options.omitVerseNumbers) {
                    content += `[${chapterContent.number}] `;
                }
                content += chapterContent.text.trim() + ' ';
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

    /**
     * Gets the text that the given word-level annotation applies to.
     *
     * Annotations are anchored to a range of characters in a single item of the verse's content,
     * so that the ranges stay correct for verses whose content is split into multiple items,
     * such as poem lines and the words of Jesus.
     * @param verse The verse that the annotation is in.
     * @param word The annotation to get the text for.
     * @returns The annotated text, or an empty string if the annotation doesn't point at any text.
     */
    getWordText(verse: ChapterVerse, word: ChapterWord): string {
        const content = verse.content[word.contentIndex];

        if (typeof content === 'string') {
            return content.slice(word.start, word.end);
        } else if (
            typeof content === 'object' &&
            content !== null &&
            'text' in content
        ) {
            return content.text.slice(word.start, word.end);
        }

        // Line breaks, inline headings, and footnote references have no text of their own.
        return '';
    }

    /**
     * Gets the word-level annotations for the given verse, paired with the text that each one applies to.
     * @param verse The verse to get the annotations for.
     * @param words The annotations for the chapter that the verse is in.
     * @returns The annotations for the verse, in the order that they occur. Empty if the verse has no annotations.
     */
    getVerseWords(
        verse: ChapterVerse,
        words: ApiTranslationBookChapterWords
    ): AnnotatedWord[] {
        const verseWords = words.verses[verse.number.toString()] ?? [];

        return verseWords.map((word) => ({
            ...word,
            text: this.getWordText(verse, word),
        }));
    }

    /**
     * Gets the text that the given simplified word-level annotation applies to.
     * @param verse The simplified verse that the annotation is in.
     * @param word The annotation to get the text for.
     * @returns The annotated text.
     */
    getSimpleWordText(
        verse: SimpleChapterVerse,
        word: SimpleChapterWord
    ): string {
        return verse.text.slice(word.start, word.end);
    }

    /**
     * Gets the word-level annotations for the given simplified verse, paired with the text that each one applies to.
     * @param verse The simplified verse to get the annotations for.
     * @param words The simplified annotations for the chapter that the verse is in.
     * @returns The annotations for the verse, in the order that they occur. Empty if the verse has no annotations.
     */
    getSimpleVerseWords(
        verse: SimpleChapterVerse,
        words: ApiSimpleTranslationBookChapterWords
    ): SimpleAnnotatedWord[] {
        const verseWords = words.verses[verse.number.toString()] ?? [];

        return verseWords.map((word) => ({
            ...word,
            text: this.getSimpleWordText(verse, word),
        }));
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
