import type {
    ApiAvailableCommentaries,
    ApiAvailableDatasets,
    ApiAvailableTranslations,
    ApiCommentaryBook,
    ApiCommentaryBookChapter,
    ApiCommentaryBooks,
    ApiDatasetBook,
    ApiDatasetBookChapter,
    ApiDatasetBooks,
    ApiDatasetCategorizedVerse,
    ApiDatasetCategories,
    ApiDatasetCategory,
    ApiDatasetEntityBookChapter,
    ApiDatasetEvent,
    ApiDatasetEvents,
    ApiDatasetLexicon,
    ApiDatasetLexiconEntry,
    ApiDatasetPeople,
    ApiDatasetPeopleGroup,
    ApiDatasetPeopleGroups,
    ApiDatasetPerson,
    ApiDatasetPlace,
    ApiDatasetPlaces,
    ApiDatasetVerses,
    ApiSimpleCommentaryBookChapter,
    ApiSimpleTranslationBookChapter,
    ApiSimpleTranslationBookChapterWords,
    ApiSimpleTranslationComplete,
    ApiTranslationBook,
    ApiTranslationBookChapter,
    ApiTranslationBookChapterAudioTimings,
    ApiTranslationBookChapterWords,
    ApiTranslationBooks,
    ApiTranslationComplete,
    ChapterVerse,
    ChapterWord,
    SimpleChapterVerse,
    SimpleChapterWord,
    SimpleTranslationCompleteChapter,
    TranslationChapterReference,
    TranslationCompleteChapter,
} from './types.gen.js';
import {
    pickVerseOfTheDay,
    PickVerseOfTheDayOptions,
} from './verseOfTheDay.js';

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
 * Options accepted by every request method.
 */
export interface RequestOptions {
    /**
     * Cancels the request when aborted. The returned promise then rejects with
     * an `AbortError`.
     *
     * Responses are shared between callers who request the same URL while it
     * is downloading (and cached afterwards), so aborting only stops *this*
     * caller waiting. The download itself is cancelled once every caller
     * waiting on it has aborted.
     */
    signal?: AbortSignal;
}

/** Bookkeeping for a download that several callers may be waiting on. */
interface SharedRequest {
    /** Cancels the download. Never a caller's own signal. */
    controller: AbortController;
    /**
     * How many callers are still waiting. Callers without a signal can never
     * stop waiting, so while one is present this never reaches zero.
     */
    waiting: number;
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
    private _sharedRequests = new Map<string, SharedRequest>();
    private _useCache: boolean = true;

    constructor(options?: FreeUseBibleApiOptions) {
        this.endpoint = options?.endpoint ?? this.endpoint;
        this._useCache = options?.useCache ?? this._useCache;
    }

    /**
     * Gets the list of available Bible translations from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getAvailableTranslations(
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiAvailableTranslations> {
        return this._getJson<ApiAvailableTranslations>(
            'api/available_translations.json',
            endpoint,
            options
        );
    }

    /**
     * Gets the complete content of a specific Bible translation.
     *
     * The results of this endpoint are very large, so the response is not cached.
     * @param translation The ID of the translation to get the complete content for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getCompleteTranslation(
        translation: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationComplete> {
        const encodedTranslation = encodeURIComponent(translation);
        return this._getJson<ApiTranslationComplete>(
            `api/${encodedTranslation}/complete.json`,
            endpoint,
            options,
            false
        );
    }

    /**
     * Gets the complete content of a specific Bible translation, using the simplified chapter format.
     *
     * The results of this endpoint are very large, so the response is not cached.
     * @param translation The ID of the translation to get the complete content for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getSimpleCompleteTranslation(
        translation: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationComplete> {
        const encodedTranslation = encodeURIComponent(translation);
        return this._getJson<ApiSimpleTranslationComplete>(
            `api/${encodedTranslation}/complete.simple.json`,
            endpoint,
            options,
            false
        );
    }

    /**
     * Gets the list of available Bible commentaries from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getAvailableCommentaries(
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiAvailableCommentaries> {
        return this._getJson<ApiAvailableCommentaries>(
            'api/available_commentaries.json',
            endpoint,
            options
        );
    }

    /**
     * Gets the list of available datasets from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getAvailableDatasets(
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiAvailableDatasets> {
        return this._getJson<ApiAvailableDatasets>(
            'api/available_datasets.json',
            endpoint,
            options
        );
    }

    /**
     * Gets the list of books for a given Bible translation.
     * @param translation The ID of the translation to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getTranslationBooks(
        translation: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBooks> {
        const encodedTranslation = encodeURIComponent(translation);
        return this._getJson<ApiTranslationBooks>(
            `api/${encodedTranslation}/books.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of books for a given Bible commentary.
     * @param commentary The ID of the commentary to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getCommentaryBooks(
        commentary: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiCommentaryBooks> {
        const encodedCommentary = encodeURIComponent(commentary);
        return this._getJson<ApiCommentaryBooks>(
            `api/c/${encodedCommentary}/books.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of books for a given dataset.
     * @param dataset The ID of the dataset to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetBooks(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetBooks> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetBooks>(
            `api/d/${encodedDataset}/books.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of people for a given dataset.
     * @param dataset The ID of the dataset to get the people for.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetPeople(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetPeople> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetPeople>(
            `api/d/${encodedDataset}/people.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the information about a specific person for a given dataset.
     * Includes the Bible references that mention the person and their relationships
     * to other people, places, events, and people groups.
     * @param dataset The ID of the dataset to get the person for.
     * @param person The ID of the person to get.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetPerson(
        dataset: string,
        person: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetPerson> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedPerson = encodeURIComponent(person);
        return this._getJson<ApiDatasetPerson>(
            `api/d/${encodedDataset}/people/${encodedPerson}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of places for a given dataset.
     * @param dataset The ID of the dataset to get the places for.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetPlaces(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetPlaces> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetPlaces>(
            `api/d/${encodedDataset}/places.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the information about a specific place for a given dataset.
     * Includes the Bible references that mention the place and its related people and events.
     * @param dataset The ID of the dataset to get the place for.
     * @param place The ID of the place to get.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetPlace(
        dataset: string,
        place: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetPlace> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedPlace = encodeURIComponent(place);
        return this._getJson<ApiDatasetPlace>(
            `api/d/${encodedDataset}/places/${encodedPlace}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of events for a given dataset.
     * @param dataset The ID of the dataset to get the events for.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetEvents(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetEvents> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetEvents>(
            `api/d/${encodedDataset}/events.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the information about a specific event for a given dataset.
     * Includes the Bible references that describe the event and its related people, places, and people groups.
     * @param dataset The ID of the dataset to get the event for.
     * @param event The ID of the event to get.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetEvent(
        dataset: string,
        event: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetEvent> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedEvent = encodeURIComponent(event);
        return this._getJson<ApiDatasetEvent>(
            `api/d/${encodedDataset}/events/${encodedEvent}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of people groups for a given dataset.
     * @param dataset The ID of the dataset to get the people groups for.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetPeopleGroups(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetPeopleGroups> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetPeopleGroups>(
            `api/d/${encodedDataset}/groups.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the information about a specific people group for a given dataset.
     * Includes the members of the group and the events that the group participated in.
     * @param dataset The ID of the dataset to get the people group for.
     * @param group The ID of the people group to get.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetPeopleGroup(
        dataset: string,
        group: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetPeopleGroup> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedGroup = encodeURIComponent(group);
        return this._getJson<ApiDatasetPeopleGroup>(
            `api/d/${encodedDataset}/groups/${encodedGroup}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the list of lexicon entries for a given dataset.
     * @param dataset The ID of the dataset to get the lexicon entries for.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetLexicon(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetLexicon> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetLexicon>(
            `api/d/${encodedDataset}/lexicon.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the information about a specific lexicon entry for a given dataset.
     * Includes the senses of the base Strong's number.
     * @param dataset The ID of the dataset to get the lexicon entry for.
     * @param strongs The zero-padded Strong's number of the lexicon entry to get. For example, "H0430".
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetLexiconEntry(
        dataset: string,
        strongs: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetLexiconEntry> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedStrongs = encodeURIComponent(strongs);
        return this._getJson<ApiDatasetLexiconEntry>(
            `api/d/${encodedDataset}/lexicon/${encodedStrongs}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets every verse in a given dataset, with the categories that each verse belongs to, in canonical order.
     * Only available for datasets whose verses have categories, such as "verse-of-the-day".
     * @param dataset The ID of the dataset to get the verses for. For example, "verse-of-the-day".
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetVerses(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetVerses> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetVerses>(
            `api/d/${encodedDataset}/verses.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the verse of the day for the given date from the verse-of-the-day dataset.
     * The same date always gives the same verse, a verse doesn't repeat within a calendar year, and each year has a different order.
     * See {@link pickVerseOfTheDay} for how the verse is picked.
     * @param date The date to get the verse for: a `YYYY-MM-DD` string (e.g. "2026-01-01"), or a `Date` (its local calendar date is used). Defaults to today.
     * @param options The options for picking the verse. Pass a `seed` to use a different (but equally valid) order, or a `category` to only pick from one category. `dataset` defaults to "verse-of-the-day". The dataset's holidays are used unless other `holidays` are given.
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param requestOptions Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The verse (its reference and categories), or null if the dataset has no verses to pick from.
     */
    async getVerseOfTheDay(
        date: Date | string = new Date(),
        options: PickVerseOfTheDayOptions & { dataset?: string } = {},
        endpoint?: string,
        requestOptions?: RequestOptions
    ): Promise<ApiDatasetCategorizedVerse | null> {
        const { dataset = 'verse-of-the-day', ...pickOptions } = options;
        const verses = await this.getDatasetVerses(
            dataset,
            endpoint,
            requestOptions
        );
        return pickVerseOfTheDay(verses.verses, date, {
            holidays: verses.holidays,
            ...pickOptions,
        });
    }

    /**
     * Gets the list of verse categories for a given dataset.
     * @param dataset The ID of the dataset to get the categories for. For example, "verse-of-the-day".
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetCategories(
        dataset: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetCategories> {
        const encodedDataset = encodeURIComponent(dataset);
        return this._getJson<ApiDatasetCategories>(
            `api/d/${encodedDataset}/categories.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the information about a specific verse category for a given dataset.
     * Includes the verses that belong to the category.
     * @param dataset The ID of the dataset to get the category for. For example, "verse-of-the-day".
     * @param category The ID of the category to get. For example, "hope".
     * @param endpoint The endpoint to use for the request. If not provided, then the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetCategory(
        dataset: string,
        category: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetCategory> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedCategory = encodeURIComponent(category);
        return this._getJson<ApiDatasetCategory>(
            `api/d/${encodedDataset}/categories/${encodedCategory}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible translation.
     * @param translation The ID of the translation to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getTranslationBookChapter(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapter> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiTranslationBookChapter>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the audio timings for a specific chapter, read by a specific reader.
     *
     * Only some chapters have audio timings. Available readers are the keys of the chapter's `thisChapterAudioTimings` property.
     * @param translation The ID of the translation to get the audio timings for.
     * @param book The ID of the book to get the audio timings for.
     * @param chapter The chapter number to get the audio timings for.
     * @param reader The ID of the reader to get the audio timings for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getTranslationBookChapterAudioTimings(
        translation: string,
        book: string,
        chapter: number | string,
        reader: string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapterAudioTimings> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        const encodedReader = encodeURIComponent(reader);
        return this._getJson<ApiTranslationBookChapterAudioTimings>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.${encodedReader}.audioTimings.json`,
            endpoint,
            options
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
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getTranslationBookChapterWords(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapterWords> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiTranslationBookChapterWords>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.words.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the word-level annotations for the given chapter, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The annotations for the chapter, or null if the chapter doesn't have any.
     */
    getChapterWords(
        chapter: ApiTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapterWords | null>;
    /**
     * Gets the word-level annotations for the given chapter of a complete translation download, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The annotations for the chapter, or null if the chapter doesn't have any.
     */
    getChapterWords(
        chapter: TranslationCompleteChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapterWords | null>;
    async getChapterWords(
        chapter: ApiTranslationBookChapter | TranslationCompleteChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapterWords | null> {
        if (!chapter.thisChapterWordsLink) {
            return null;
        }
        return this._getJson<ApiTranslationBookChapterWords>(
            chapter.thisChapterWordsLink,
            endpoint,
            options
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
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getSimpleTranslationBookChapter(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapter> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiSimpleTranslationBookChapter>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.simple.json`,
            endpoint,
            options
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
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getSimpleTranslationBookChapterWords(
        translation: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapterWords> {
        const encodedTranslation = encodeURIComponent(translation);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiSimpleTranslationBookChapterWords>(
            `api/${encodedTranslation}/${encodedBook}/${encodedChapter}.words.simple.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the simplified version of a given chapter, if available.
     * @param chapter The chapter to get the simplified version of.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The simplified chapter, or null if simplified chapters aren't available for it.
     */
    getSimpleChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleCommentaryBookChapter | null>;
    /**
     * Gets the simplified version of a given chapter, if available.
     * @param chapter The chapter to get the simplified version of.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The simplified chapter, or null if simplified chapters aren't available for it.
     */
    getSimpleChapter(
        chapter: ApiTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapter | null>;
    async getSimpleChapter(
        chapter: ApiTranslationBookChapter | ApiCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<
        ApiSimpleTranslationBookChapter | ApiSimpleCommentaryBookChapter | null
    > {
        if (!chapter.simpleChapterApiLink) {
            return null;
        }
        return this._getJson<
            ApiSimpleTranslationBookChapter | ApiSimpleCommentaryBookChapter
        >(chapter.simpleChapterApiLink, endpoint, options);
    }

    /**
     * Gets the word-level annotations for the given simplified chapter, if it has any.
     * @param chapter The simplified chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The annotations for the chapter, or null if the chapter doesn't have any.
     */
    getSimpleChapterWords(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapterWords | null>;
    /**
     * Gets the word-level annotations for the given chapter of a simplified complete translation download, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The annotations for the chapter, or null if the chapter doesn't have any.
     */
    getSimpleChapterWords(
        chapter: SimpleTranslationCompleteChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapterWords | null>;
    async getSimpleChapterWords(
        chapter:
            | ApiSimpleTranslationBookChapter
            | SimpleTranslationCompleteChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapterWords | null> {
        if (!chapter.thisChapterWordsLink) {
            return null;
        }
        return this._getJson<ApiSimpleTranslationBookChapterWords>(
            chapter.thisChapterWordsLink,
            endpoint,
            options
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible commentary.
     * @param commentary The ID of the commentary to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getCommentaryBookChapter(
        commentary: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiCommentaryBookChapter> {
        const encodedCommentary = encodeURIComponent(commentary);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiCommentaryBookChapter>(
            `api/c/${encodedCommentary}/${encodedBook}/${encodedChapter}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible commentary, using the simplified chapter format.
     * @param commentary The ID of the commentary to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getSimpleCommentaryBookChapter(
        commentary: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleCommentaryBookChapter> {
        const encodedCommentary = encodeURIComponent(commentary);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<ApiSimpleCommentaryBookChapter>(
            `api/c/${encodedCommentary}/${encodedBook}/${encodedChapter}.simple.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the content of a specific chapter of a specific book for a specific dataset.
     *
     * For cross reference datasets, this is the list of cross references for each verse
     * in the chapter. For interlinear datasets (such as "bsb-interlinear"), this is the
     * original-language words of each verse in the chapter. For entity datasets (such as
     * "theographic"), this is the people, places, and events that appear in the chapter.
     * @param dataset The ID of the dataset to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     */
    async getDatasetBookChapter(
        dataset: string,
        book: string,
        chapter: number | string,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetBookChapter | ApiDatasetEntityBookChapter> {
        const encodedDataset = encodeURIComponent(dataset);
        const encodedBook = encodeURIComponent(book);
        const encodedChapter = encodeURIComponent(String(chapter));
        return this._getJson<
            ApiDatasetBookChapter | ApiDatasetEntityBookChapter
        >(
            `api/d/${encodedDataset}/${encodedBook}/${encodedChapter}.json`,
            endpoint,
            options
        );
    }

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiDatasetBookChapter | ApiDatasetEntityBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetBookChapter | ApiDatasetEntityBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiSimpleCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleCommentaryBookChapter | null>;
    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The next chapter, or null if there is no next chapter.
     */
    getNextChapter(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapter | null>;
    async getNextChapter(
        chapter:
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiDatasetEntityBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | ApiDatasetEntityBookChapter
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
            | ApiDatasetEntityBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter
        >(chapter.nextChapterApiLink, endpoint, options);
    }

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiDatasetBookChapter | ApiDatasetEntityBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetBookChapter | ApiDatasetEntityBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiSimpleCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleCommentaryBookChapter | null>;
    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The previous chapter, or null if there is no previous chapter.
     */
    getPreviousChapter(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiSimpleTranslationBookChapter | null>;
    async getPreviousChapter(
        chapter:
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiDatasetEntityBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | ApiDatasetEntityBookChapter
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
            | ApiDatasetEntityBookChapter
            | ApiSimpleTranslationBookChapter
            | ApiSimpleCommentaryBookChapter
        >(chapter.previousChapterApiLink, endpoint, options);
    }

    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The first chapter, or null if there is no first chapter.
     */
    getFirstChapter(
        book: ApiCommentaryBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The first chapter, or null if there is no first chapter.
     */
    getFirstChapter(
        book: ApiTranslationBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapter>;
    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The first chapter, or null if there is no first chapter.
     */
    getFirstChapter(
        book: ApiDatasetBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetBookChapter | ApiDatasetEntityBookChapter>;
    async getFirstChapter(
        book: ApiTranslationBook | ApiCommentaryBook | ApiDatasetBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | ApiDatasetEntityBookChapter
        | null
    > {
        if (!book.firstChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiDatasetEntityBookChapter
        >(book.firstChapterApiLink, endpoint, options);
    }

    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The last chapter, or null if there is no last chapter.
     */
    getLastChapter(
        book: ApiCommentaryBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiCommentaryBookChapter | null>;
    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The last chapter, or null if there is no last chapter.
     */
    getLastChapter(
        book: ApiTranslationBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiTranslationBookChapter>;
    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @param options Options for the request, such as an `AbortSignal` that cancels it.
     * @returns The last chapter, or null if there is no last chapter.
     */
    getLastChapter(
        book: ApiDatasetBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<ApiDatasetBookChapter | ApiDatasetEntityBookChapter>;
    async getLastChapter(
        book: ApiTranslationBook | ApiCommentaryBook | ApiDatasetBook,
        endpoint?: string,
        options?: RequestOptions
    ): Promise<
        | ApiTranslationBookChapter
        | ApiCommentaryBookChapter
        | ApiDatasetBookChapter
        | ApiDatasetEntityBookChapter
        | null
    > {
        if (!book.lastChapterApiLink) {
            return null;
        }
        return this._getJson<
            | ApiTranslationBookChapter
            | ApiCommentaryBookChapter
            | ApiDatasetBookChapter
            | ApiDatasetEntityBookChapter
        >(book.lastChapterApiLink, endpoint, options);
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
        options?: RequestOptions,
        useCache: boolean = true
    ): Promise<T> {
        const url = this._buildUrl(path, endpoint);
        const signal = options?.signal;
        if (signal?.aborted) {
            return Promise.reject(abortError());
        }

        if (!this._useCache || !useCache) {
            // Nobody else can be handed this request, so the caller's own
            // signal can cancel the download directly.
            return this._fetchJson<T>(url, signal);
        }

        const existing = this._responseCache.get(url) as Promise<T> | undefined;
        if (existing) {
            return this._waitForSharedRequest(url, existing, signal);
        }

        // The download gets its own controller rather than the caller's
        // signal, so one caller aborting can't cancel a download that other
        // callers asking for the same URL are still waiting on. A first caller
        // without a signal can never stop waiting, so then the download can
        // never be cancelled and needs no controller at all.
        const controller = signal ? new AbortController() : null;
        if (controller) {
            this._sharedRequests.set(url, { controller, waiting: 0 });
        }
        const request = this._fetchJson<T>(url, controller?.signal)
            .catch((error) => {
                // A failure must not be cached. Only evict our own entry: a
                // cancelled request may already have been replaced.
                if (this._responseCache.get(url) === request) {
                    this._responseCache.delete(url);
                }
                throw error;
            })
            .finally(() => {
                if (
                    controller &&
                    this._sharedRequests.get(url)?.controller === controller
                ) {
                    this._sharedRequests.delete(url);
                }
            });
        this._responseCache.set(url, request);
        return this._waitForSharedRequest(url, request, signal);
    }

    private async _fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
        const response = await (signal ? fetch(url, { signal }) : fetch(url));
        if (response.status < 200 || response.status >= 300) {
            throw new Error(
                `Failed request to ${url}. Status: ${response.status} ${response.statusText}`
            );
        }
        return await response.json();
    }

    /**
     * Gives one caller its own view of a shared download. Without a signal the
     * caller gets the shared promise itself. With one, the caller gets a promise
     * that rejects as soon as *its* signal aborts, without affecting anyone
     * else; the download is cancelled once every waiting caller has aborted.
     */
    private _waitForSharedRequest<T>(
        url: string,
        request: Promise<T>,
        signal?: AbortSignal
    ): Promise<T> {
        // Missing once the download has finished, or when it was started
        // without a controller and so can't be cancelled.
        const shared = this._sharedRequests.get(url);
        if (shared) {
            shared.waiting += 1;
        }
        if (!signal) {
            return request;
        }

        return new Promise<T>((resolve, reject) => {
            let settled = false;
            const onAbort = () => {
                if (settled) {
                    return;
                }
                settled = true;
                if (shared) {
                    shared.waiting -= 1;
                    if (shared.waiting <= 0) {
                        // Forget the request before cancelling it. Its
                        // rejection only lands a microtask later, and a caller
                        // arriving in between must start a fresh download
                        // rather than be handed this cancelled one.
                        if (this._sharedRequests.get(url) === shared) {
                            this._sharedRequests.delete(url);
                        }
                        if (this._responseCache.get(url) === request) {
                            this._responseCache.delete(url);
                        }
                        shared.controller.abort();
                    }
                }
                reject(abortError());
            };

            signal.addEventListener('abort', onAbort, { once: true });

            request.then(
                (value) => {
                    if (!settled) {
                        settled = true;
                        signal.removeEventListener('abort', onAbort);
                        resolve(value);
                    }
                },
                (error) => {
                    if (!settled) {
                        settled = true;
                        signal.removeEventListener('abort', onAbort);
                        reject(error);
                    }
                }
            );
        });
    }

    private _buildUrl(path: string, endpoint?: string): string {
        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        const baseEndpoint = endpoint ?? this.endpoint;
        return new URL(path, baseEndpoint).href;
    }
}

function abortError(): Error {
    const error = new Error('The operation was aborted.');
    error.name = 'AbortError';
    return error;
}
