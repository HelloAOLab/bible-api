package org.helloao.freeusebibleapi

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.json.Json
import java.net.URI
import java.util.concurrent.ConcurrentHashMap

/**
 * A word-level annotation, paired with the text of the verse that it covers.
 */
public data class AnnotatedWord(
    /**
     * The annotation.
     */
    public val word: ChapterWord,

    /**
     * The text that the annotation applies to.
     */
    public val text: String,
)

/**
 * A word-level annotation in a simplified chapter, paired with the text of the verse that it covers.
 */
public data class SimpleAnnotatedWord(
    /**
     * The annotation.
     */
    public val word: SimpleChapterWord,

    /**
     * The text that the annotation applies to.
     */
    public val text: String,
)

/**
 * A reference to a specific verse in a Bible translation, commentary, or dataset.
 */
public data class VerseReference(
    /**
     * The chapter number of the reference. This should be a positive integer.
     */
    public val chapter: Int,

    /**
     * The verse number of the reference.
     *
     * If null, then the reference refers to the entire chapter rather than a specific verse.
     */
    public val verse: Int? = null,

    /**
     * The ending verse number of the reference, for references that span multiple verses.
     * This should be greater than or equal to [verse] if it is provided.
     */
    public val endVerse: Int? = null,

    /**
     * The ending chapter number of the reference, for references that span multiple chapters.
     * This should be greater than or equal to [chapter] if it is provided.
     */
    public val endChapter: Int? = null,
)

/**
 * A client for interacting with the [Free Use Bible API](https://bible.helloao.org/).
 *
 * This API provides access to a large collection of Bible translations, commentaries, and datasets that are free to use.
 *
 * All of the request methods accept an optional `endpoint` parameter that overrides [endpoint] for that request.
 *
 * @param endpoint The API endpoint to use for the requests.
 * @param useCache Whether to cache responses in memory.
 * @param httpClient The HTTP client that should be used to make requests.
 */
public class FreeUseBibleApi(
    public val endpoint: String = DEFAULT_ENDPOINT,
    private val useCache: Boolean = true,
    private val httpClient: FreeUseBibleApiHttpClient = UrlConnectionHttpClient(),
) {
    public companion object {
        /**
         * The default endpoint for the Free Use Bible API.
         */
        public const val DEFAULT_ENDPOINT: String = "https://bible.helloao.org/"

        /**
         * The [Json] configuration that is used to parse responses from the API.
         *
         * Unknown properties are ignored so that new additions to the API don't break existing clients.
         */
        public val json: Json = Json {
            ignoreUnknownKeys = true
            explicitNulls = false
            encodeDefaults = true
        }
    }

    private val responseCache = ConcurrentHashMap<String, CompletableDeferred<Any>>()

    /**
     * Gets the list of available Bible translations from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getAvailableTranslations(endpoint: String? = null): ApiAvailableTranslations =
        getJson(ApiAvailableTranslations.serializer(), "api/available_translations.json", endpoint)

    /**
     * Gets the complete content of a specific Bible translation.
     *
     * The results of this endpoint are very large, so the response is not cached.
     * @param translation The ID of the translation to get the complete content for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getCompleteTranslation(translation: String, endpoint: String? = null): ApiTranslationComplete =
        getJson(
            ApiTranslationComplete.serializer(),
            "api/${encode(translation)}/complete.json",
            endpoint,
            cache = false,
        )

    /**
     * Gets the complete content of a specific Bible translation, using the simplified chapter format.
     *
     * The results of this endpoint are very large, so the response is not cached.
     * @param translation The ID of the translation to get the complete content for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getSimpleCompleteTranslation(
        translation: String,
        endpoint: String? = null,
    ): ApiSimpleTranslationComplete =
        getJson(
            ApiSimpleTranslationComplete.serializer(),
            "api/${encode(translation)}/complete.simple.json",
            endpoint,
            cache = false,
        )

    /**
     * Gets the list of available Bible commentaries from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getAvailableCommentaries(endpoint: String? = null): ApiAvailableCommentaries =
        getJson(ApiAvailableCommentaries.serializer(), "api/available_commentaries.json", endpoint)

    /**
     * Gets the list of available datasets from the API.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getAvailableDatasets(endpoint: String? = null): ApiAvailableDatasets =
        getJson(ApiAvailableDatasets.serializer(), "api/available_datasets.json", endpoint)

    /**
     * Gets the list of books for a given Bible translation.
     * @param translation The ID of the translation to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getTranslationBooks(translation: String, endpoint: String? = null): ApiTranslationBooks =
        getJson(ApiTranslationBooks.serializer(), "api/${encode(translation)}/books.json", endpoint)

    /**
     * Gets the list of books for a given Bible commentary.
     * @param commentary The ID of the commentary to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getCommentaryBooks(commentary: String, endpoint: String? = null): ApiCommentaryBooks =
        getJson(ApiCommentaryBooks.serializer(), "api/c/${encode(commentary)}/books.json", endpoint)

    /**
     * Gets the list of books for a given dataset.
     * @param dataset The ID of the dataset to get the books for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetBooks(dataset: String, endpoint: String? = null): ApiDatasetBooks =
        getJson(ApiDatasetBooks.serializer(), "api/d/${encode(dataset)}/books.json", endpoint)

    /**
     * Gets the list of people for a given dataset.
     * @param dataset The ID of the dataset to get the people for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetPeople(dataset: String, endpoint: String? = null): ApiDatasetPeople =
        getJson(ApiDatasetPeople.serializer(), "api/d/${encode(dataset)}/people.json", endpoint)

    /**
     * Gets the information about a specific person for a given dataset.
     * Includes the Bible references that mention the person and their relationships
     * to other people, places, events, and people groups.
     * @param dataset The ID of the dataset to get the person for.
     * @param person The ID of the person to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetPerson(dataset: String, person: String, endpoint: String? = null): ApiDatasetPerson =
        getJson(ApiDatasetPerson.serializer(), "api/d/${encode(dataset)}/people/${encode(person)}.json", endpoint)

    /**
     * Gets the list of places for a given dataset.
     * @param dataset The ID of the dataset to get the places for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetPlaces(dataset: String, endpoint: String? = null): ApiDatasetPlaces =
        getJson(ApiDatasetPlaces.serializer(), "api/d/${encode(dataset)}/places.json", endpoint)

    /**
     * Gets the information about a specific place for a given dataset.
     * Includes the Bible references that mention the place and its related people and events.
     * @param dataset The ID of the dataset to get the place for.
     * @param place The ID of the place to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetPlace(dataset: String, place: String, endpoint: String? = null): ApiDatasetPlace =
        getJson(ApiDatasetPlace.serializer(), "api/d/${encode(dataset)}/places/${encode(place)}.json", endpoint)

    /**
     * Gets the list of events for a given dataset.
     * @param dataset The ID of the dataset to get the events for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetEvents(dataset: String, endpoint: String? = null): ApiDatasetEvents =
        getJson(ApiDatasetEvents.serializer(), "api/d/${encode(dataset)}/events.json", endpoint)

    /**
     * Gets the information about a specific event for a given dataset.
     * Includes the Bible references that describe the event and its related people, places, and people groups.
     * @param dataset The ID of the dataset to get the event for.
     * @param event The ID of the event to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetEvent(dataset: String, event: String, endpoint: String? = null): ApiDatasetEvent =
        getJson(ApiDatasetEvent.serializer(), "api/d/${encode(dataset)}/events/${encode(event)}.json", endpoint)

    /**
     * Gets the list of people groups for a given dataset.
     * @param dataset The ID of the dataset to get the people groups for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetPeopleGroups(dataset: String, endpoint: String? = null): ApiDatasetPeopleGroups =
        getJson(ApiDatasetPeopleGroups.serializer(), "api/d/${encode(dataset)}/groups.json", endpoint)

    /**
     * Gets the information about a specific people group for a given dataset.
     * Includes the members of the group and the events that the group participated in.
     * @param dataset The ID of the dataset to get the people group for.
     * @param group The ID of the people group to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetPeopleGroup(
        dataset: String,
        group: String,
        endpoint: String? = null,
    ): ApiDatasetPeopleGroup =
        getJson(ApiDatasetPeopleGroup.serializer(), "api/d/${encode(dataset)}/groups/${encode(group)}.json", endpoint)

    /**
     * Gets the list of lexicon entries for a given dataset.
     * @param dataset The ID of the dataset to get the lexicon entries for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetLexicon(dataset: String, endpoint: String? = null): ApiDatasetLexicon =
        getJson(ApiDatasetLexicon.serializer(), "api/d/${encode(dataset)}/lexicon.json", endpoint)

    /**
     * Gets the information about a specific lexicon entry for a given dataset.
     * Includes the senses of the base Strong's number.
     * @param dataset The ID of the dataset to get the lexicon entry for.
     * @param strongs The zero-padded Strong's number of the lexicon entry to get. For example, "H0430".
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetLexiconEntry(
        dataset: String,
        strongs: String,
        endpoint: String? = null,
    ): ApiDatasetLexiconEntry =
        getJson(
            ApiDatasetLexiconEntry.serializer(),
            "api/d/${encode(dataset)}/lexicon/${encode(strongs)}.json",
            endpoint,
        )

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible translation.
     * @param translation The ID of the translation to get the chapter for.
     * @param book The ID of the book to get the chapter for. (e.g. "GEN")
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getTranslationBookChapter(
        translation: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiTranslationBookChapter =
        getJson(
            ApiTranslationBookChapter.serializer(),
            "api/${encode(translation)}/${encode(book)}/$chapter.json",
            endpoint,
        )

    /**
     * Gets the audio timings for a specific chapter, read by a specific reader.
     *
     * Only some chapters have audio timings. Available readers are the keys of the chapter's [ApiTranslationBookChapter.thisChapterAudioTimings] property.
     * @param translation The ID of the translation to get the audio timings for.
     * @param book The ID of the book to get the audio timings for.
     * @param chapter The chapter number to get the audio timings for.
     * @param reader The ID of the reader to get the audio timings for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getTranslationBookChapterAudioTimings(
        translation: String,
        book: String,
        chapter: Int,
        reader: String,
        endpoint: String? = null,
    ): ApiTranslationBookChapterAudioTimings =
        getJson(
            ApiTranslationBookChapterAudioTimings.serializer(),
            "api/${encode(translation)}/${encode(book)}/$chapter.${encode(reader)}.audioTimings.json",
            endpoint,
        )

    /**
     * Gets the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific Bible translation.
     *
     * Only some translations have word-level annotations. This request will fail for chapters that don't have any.
     * Use [getChapterWords] to get the annotations for a chapter that you have already loaded, which returns null instead of failing.
     * @param translation The ID of the translation to get the annotations for.
     * @param book The ID of the book to get the annotations for.
     * @param chapter The chapter number to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getTranslationBookChapterWords(
        translation: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiTranslationBookChapterWords =
        getJson(
            ApiTranslationBookChapterWords.serializer(),
            "api/${encode(translation)}/${encode(book)}/$chapter.words.json",
            endpoint,
        )

    /**
     * Gets the word-level annotations for the given chapter, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The annotations for the chapter, or null if the chapter doesn't have any.
     */
    public suspend fun getChapterWords(
        chapter: ApiTranslationBookChapter,
        endpoint: String? = null,
    ): ApiTranslationBookChapterWords? = getLink(ApiTranslationBookChapterWords.serializer(), chapter.thisChapterWordsLink, endpoint)

    /**
     * Gets the word-level annotations for the given chapter of a complete translation download, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The annotations for the chapter, or null if the chapter doesn't have any.
     */
    public suspend fun getChapterWords(
        chapter: TranslationCompleteChapter,
        endpoint: String? = null,
    ): ApiTranslationBookChapterWords? = getLink(ApiTranslationBookChapterWords.serializer(), chapter.thisChapterWordsLink, endpoint)

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible translation, using the simplified chapter format.
     *
     * In the simplified format, each verse's content is a single string instead of a list of formatted content, and footnotes, inline headings,
     * the Words of Jesus, and poetry are represented as offset ranges into that string.
     * @param translation The ID of the translation to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getSimpleTranslationBookChapter(
        translation: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapter =
        getJson(
            ApiSimpleTranslationBookChapter.serializer(),
            "api/${encode(translation)}/${encode(book)}/$chapter.simple.json",
            endpoint,
        )

    /**
     * Gets the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific Bible translation,
     * with their offsets remapped onto the text of each simplified verse.
     *
     * Use this instead of [getTranslationBookChapterWords] when working with the simplified chapter format, since the offsets in the regular annotations
     * are anchored to a verse's content list instead of its plain text.
     * Use [getSimpleChapterWords] to get the annotations for a simplified chapter that you have already loaded, which returns null instead of failing.
     * @param translation The ID of the translation to get the annotations for.
     * @param book The ID of the book to get the annotations for.
     * @param chapter The chapter number to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getSimpleTranslationBookChapterWords(
        translation: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapterWords =
        getJson(
            ApiSimpleTranslationBookChapterWords.serializer(),
            "api/${encode(translation)}/${encode(book)}/$chapter.words.simple.json",
            endpoint,
        )

    /**
     * Gets the simplified version of a given commentary chapter, if available.
     * @param chapter The chapter to get the simplified version of.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The simplified chapter, or null if simplified chapters aren't available for it.
     */
    public suspend fun getSimpleChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint: String? = null,
    ): ApiSimpleCommentaryBookChapter? = getLink(ApiSimpleCommentaryBookChapter.serializer(), chapter.simpleChapterApiLink, endpoint)

    /**
     * Gets the simplified version of a given translation chapter, if available.
     * @param chapter The chapter to get the simplified version of.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The simplified chapter, or null if simplified chapters aren't available for it.
     */
    public suspend fun getSimpleChapter(
        chapter: ApiTranslationBookChapter,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapter? = getLink(ApiSimpleTranslationBookChapter.serializer(), chapter.simpleChapterApiLink, endpoint)

    /**
     * Gets the word-level annotations for the given simplified chapter, if it has any.
     * @param chapter The simplified chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The annotations for the chapter, or null if the chapter doesn't have any.
     */
    public suspend fun getSimpleChapterWords(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapterWords? =
        getLink(ApiSimpleTranslationBookChapterWords.serializer(), chapter.thisChapterWordsLink, endpoint)

    /**
     * Gets the word-level annotations for the given chapter of a simplified complete translation download, if it has any.
     * @param chapter The chapter to get the annotations for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The annotations for the chapter, or null if the chapter doesn't have any.
     */
    public suspend fun getSimpleChapterWords(
        chapter: SimpleTranslationCompleteChapter,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapterWords? =
        getLink(ApiSimpleTranslationBookChapterWords.serializer(), chapter.thisChapterWordsLink, endpoint)

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible commentary.
     * @param commentary The ID of the commentary to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getCommentaryBookChapter(
        commentary: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiCommentaryBookChapter =
        getJson(
            ApiCommentaryBookChapter.serializer(),
            "api/c/${encode(commentary)}/${encode(book)}/$chapter.json",
            endpoint,
        )

    /**
     * Gets the content of a specific chapter of a specific book for a specific Bible commentary, using the simplified chapter format.
     * @param commentary The ID of the commentary to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getSimpleCommentaryBookChapter(
        commentary: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiSimpleCommentaryBookChapter =
        getJson(
            ApiSimpleCommentaryBookChapter.serializer(),
            "api/c/${encode(commentary)}/${encode(book)}/$chapter.simple.json",
            endpoint,
        )

    /**
     * Gets the content of a specific chapter of a specific book for a specific dataset.
     *
     * For cross reference datasets, this is the list of cross references for each verse
     * in the chapter. For interlinear datasets (such as "bsb-interlinear"), this is the
     * original-language words of each verse in the chapter. These are returned as an [ApiDatasetBookChapter].
     *
     * For entity datasets (such as "theographic"), this is the people, places, and events that appear in the chapter.
     * These are returned as an [ApiDatasetEntityBookChapter].
     * @param dataset The ID of the dataset to get the chapter for.
     * @param book The ID of the book to get the chapter for.
     * @param chapter The chapter number to get.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getDatasetBookChapter(
        dataset: String,
        book: String,
        chapter: Int,
        endpoint: String? = null,
    ): ApiDatasetBookChapterResult =
        getJson(
            ApiDatasetBookChapterResult.serializer(),
            "api/d/${encode(dataset)}/${encode(book)}/$chapter.json",
            endpoint,
        )

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(chapter: ApiTranslationBookChapter, endpoint: String? = null): ApiTranslationBookChapter? =
        getLink(ApiTranslationBookChapter.serializer(), chapter.nextChapterApiLink, endpoint)

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapter? =
        getLink(ApiSimpleTranslationBookChapter.serializer(), chapter.nextChapterApiLink, endpoint)

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(chapter: ApiCommentaryBookChapter, endpoint: String? = null): ApiCommentaryBookChapter? =
        getLink(ApiCommentaryBookChapter.serializer(), chapter.nextChapterApiLink, endpoint)

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(
        chapter: ApiSimpleCommentaryBookChapter,
        endpoint: String? = null,
    ): ApiSimpleCommentaryBookChapter? =
        getLink(ApiSimpleCommentaryBookChapter.serializer(), chapter.nextChapterApiLink, endpoint)

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(chapter: ApiDatasetBookChapter, endpoint: String? = null): ApiDatasetBookChapter? =
        getDatasetChapterLink(chapter.nextChapterApiLink, endpoint)

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(
        chapter: ApiDatasetEntityBookChapter,
        endpoint: String? = null,
    ): ApiDatasetEntityBookChapter? = getDatasetChapterLink(chapter.nextChapterApiLink, endpoint)

    /**
     * Gets the next chapter for a given chapter, if available.
     * @param chapter The chapter to get the next chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The next chapter, or null if there is no next chapter.
     */
    public suspend fun getNextChapter(
        chapter: ApiDatasetBookChapterResult,
        endpoint: String? = null,
    ): ApiDatasetBookChapterResult? = when (chapter) {
        is ApiDatasetBookChapter -> getNextChapter(chapter, endpoint)
        is ApiDatasetEntityBookChapter -> getNextChapter(chapter, endpoint)
    }

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(
        chapter: ApiTranslationBookChapter,
        endpoint: String? = null,
    ): ApiTranslationBookChapter? = getLink(ApiTranslationBookChapter.serializer(), chapter.previousChapterApiLink, endpoint)

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(
        chapter: ApiSimpleTranslationBookChapter,
        endpoint: String? = null,
    ): ApiSimpleTranslationBookChapter? =
        getLink(ApiSimpleTranslationBookChapter.serializer(), chapter.previousChapterApiLink, endpoint)

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(
        chapter: ApiCommentaryBookChapter,
        endpoint: String? = null,
    ): ApiCommentaryBookChapter? = getLink(ApiCommentaryBookChapter.serializer(), chapter.previousChapterApiLink, endpoint)

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(
        chapter: ApiSimpleCommentaryBookChapter,
        endpoint: String? = null,
    ): ApiSimpleCommentaryBookChapter? =
        getLink(ApiSimpleCommentaryBookChapter.serializer(), chapter.previousChapterApiLink, endpoint)

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(chapter: ApiDatasetBookChapter, endpoint: String? = null): ApiDatasetBookChapter? =
        getDatasetChapterLink(chapter.previousChapterApiLink, endpoint)

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(
        chapter: ApiDatasetEntityBookChapter,
        endpoint: String? = null,
    ): ApiDatasetEntityBookChapter? = getDatasetChapterLink(chapter.previousChapterApiLink, endpoint)

    /**
     * Gets the previous chapter for a given chapter, if available.
     * @param chapter The chapter to get the previous chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The previous chapter, or null if there is no previous chapter.
     */
    public suspend fun getPreviousChapter(
        chapter: ApiDatasetBookChapterResult,
        endpoint: String? = null,
    ): ApiDatasetBookChapterResult? = when (chapter) {
        is ApiDatasetBookChapter -> getPreviousChapter(chapter, endpoint)
        is ApiDatasetEntityBookChapter -> getPreviousChapter(chapter, endpoint)
    }

    /**
     * Gets the first chapter for a given book.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getFirstChapter(book: ApiTranslationBook, endpoint: String? = null): ApiTranslationBookChapter =
        getJson(ApiTranslationBookChapter.serializer(), book.firstChapterApiLink, endpoint)

    /**
     * Gets the first chapter for a given book, if available.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The first chapter, or null if the book has no chapters.
     */
    public suspend fun getFirstChapter(book: ApiCommentaryBook, endpoint: String? = null): ApiCommentaryBookChapter? =
        getLink(ApiCommentaryBookChapter.serializer(), book.firstChapterApiLink, endpoint)

    /**
     * Gets the first chapter for a given book.
     * @param book The book to get the first chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getFirstChapter(book: ApiDatasetBook, endpoint: String? = null): ApiDatasetBookChapterResult =
        getJson(ApiDatasetBookChapterResult.serializer(), book.firstChapterApiLink, endpoint)

    /**
     * Gets the last chapter for a given book.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getLastChapter(book: ApiTranslationBook, endpoint: String? = null): ApiTranslationBookChapter =
        getJson(ApiTranslationBookChapter.serializer(), book.lastChapterApiLink, endpoint)

    /**
     * Gets the last chapter for a given book, if available.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     * @return The last chapter, or null if the book has no chapters.
     */
    public suspend fun getLastChapter(book: ApiCommentaryBook, endpoint: String? = null): ApiCommentaryBookChapter? =
        getLink(ApiCommentaryBookChapter.serializer(), book.lastChapterApiLink, endpoint)

    /**
     * Gets the last chapter for a given book.
     * @param book The book to get the last chapter for.
     * @param endpoint The API endpoint to use for the request. If not provided, the default endpoint will be used.
     */
    public suspend fun getLastChapter(book: ApiDatasetBook, endpoint: String? = null): ApiDatasetBookChapterResult =
        getJson(ApiDatasetBookChapterResult.serializer(), book.lastChapterApiLink, endpoint)

    /**
     * Formats a verse reference as a human-readable string.
     *
     * e.g. Genesis 1:1-2, John 3:16, Exodus 20-22, etc.
     *
     * @param book The book that the reference is for.
     * @param reference The reference to format.
     */
    public fun formatReference(book: ApiTranslationBook, reference: VerseReference): String {
        val result = StringBuilder("${book.name} ${reference.chapter}")
        if (reference.endChapter != null) {
            result.append('-').append(reference.endChapter)
        } else if (reference.verse != null) {
            result.append(':').append(reference.verse)
            if (reference.endVerse != null) {
                result.append('-').append(reference.endVerse)
            }
        }
        return result.toString()
    }

    /**
     * Gets the text for a verse.
     *
     * Poem lines are placed on their own lines and indented with tabs, and footnote references and inline headings are replaced with spaces.
     * @param verse The verse to get the text for.
     */
    public fun getVerseText(verse: ChapterVerse): String {
        val content = StringBuilder()
        for (part in verse.content) {
            when (part) {
                is PlainText -> content.append(part.text)
                is FormattedText -> {
                    val poem = part.poem
                    if (poem != null && poem > 0) {
                        content.append('\n')
                        repeat(poem) { content.append('\t') }
                    }
                    content.append(part.text)
                }
                is InlineLineBreak -> content.append('\n')
                is InlineHeading, is VerseFootnoteReference -> content.append(' ')
            }
        }
        return content.toString().trim()
    }

    /**
     * Gets the verse text for the given chapter.
     *
     * By default, the returned text includes markers for verse numbers and a reference to the chapter.
     * @param chapter The chapter to get the text for.
     * @param omitVerseNumbers Whether to omit verse numbers from the returned text.
     * @param omitReference Whether to omit the chapter reference from the returned text.
     */
    public fun getChapterVerseText(
        chapter: ApiTranslationBookChapter,
        omitVerseNumbers: Boolean = false,
        omitReference: Boolean = false,
    ): String {
        var content = ""
        for (item in chapter.chapter.content) {
            if (item is ChapterVerse) {
                if (!omitVerseNumbers) {
                    content += "[${item.number}] "
                }
                content += getVerseText(item) + " "
            } else if (item is ChapterLineBreak) {
                content = content.trim() + "\n"
            }
        }
        return withReference(content, chapter.book, chapter.chapter.number, omitReference)
    }

    /**
     * Gets the verse text for the given simplified chapter.
     *
     * By default, the returned text includes markers for verse numbers and a reference to the chapter.
     * @param chapter The simplified chapter to get the text for.
     * @param omitVerseNumbers Whether to omit verse numbers from the returned text.
     * @param omitReference Whether to omit the chapter reference from the returned text.
     */
    public fun getSimpleChapterVerseText(
        chapter: ApiSimpleTranslationBookChapter,
        omitVerseNumbers: Boolean = false,
        omitReference: Boolean = false,
    ): String {
        var content = ""
        for (item in chapter.chapter.content) {
            if (item is SimpleChapterVerse) {
                if (!omitVerseNumbers) {
                    content += "[${item.number}] "
                }
                content += item.text.trim() + " "
            } else if (item is ChapterLineBreak) {
                content = content.trim() + "\n"
            }
        }
        return withReference(content, chapter.book, chapter.chapter.number, omitReference)
    }

    /**
     * Gets the text that the given word-level annotation applies to.
     *
     * Annotations are anchored to a range of characters in a single item of the verse's content,
     * so that the ranges stay correct for verses whose content is split into multiple items,
     * such as poem lines and the words of Jesus.
     * @param verse The verse that the annotation is in.
     * @param word The annotation to get the text for.
     * @return The annotated text, or an empty string if the annotation doesn't point at any text.
     */
    public fun getWordText(verse: ChapterVerse, word: ChapterWord): String =
        when (val content = verse.content.getOrNull(word.contentIndex)) {
            is PlainText -> slice(content.text, word.start, word.end)
            is FormattedText -> slice(content.text, word.start, word.end)
            // Line breaks, inline headings, and footnote references have no text of their own.
            else -> ""
        }

    /**
     * Gets the word-level annotations for the given verse, paired with the text that each one applies to.
     * @param verse The verse to get the annotations for.
     * @param words The annotations for the chapter that the verse is in.
     * @return The annotations for the verse, in the order that they occur. Empty if the verse has no annotations.
     */
    public fun getVerseWords(verse: ChapterVerse, words: ApiTranslationBookChapterWords): List<AnnotatedWord> =
        words.verses[verse.number.toString()].orEmpty().map { AnnotatedWord(it, getWordText(verse, it)) }

    /**
     * Gets the text that the given simplified word-level annotation applies to.
     * @param verse The simplified verse that the annotation is in.
     * @param word The annotation to get the text for.
     * @return The annotated text.
     */
    public fun getSimpleWordText(verse: SimpleChapterVerse, word: SimpleChapterWord): String =
        slice(verse.text, word.start, word.end)

    /**
     * Gets the word-level annotations for the given simplified verse, paired with the text that each one applies to.
     * @param verse The simplified verse to get the annotations for.
     * @param words The simplified annotations for the chapter that the verse is in.
     * @return The annotations for the verse, in the order that they occur. Empty if the verse has no annotations.
     */
    public fun getSimpleVerseWords(
        verse: SimpleChapterVerse,
        words: ApiSimpleTranslationBookChapterWords,
    ): List<SimpleAnnotatedWord> =
        words.verses[verse.number.toString()].orEmpty().map { SimpleAnnotatedWord(it, getSimpleWordText(verse, it)) }

    private fun withReference(content: String, book: ApiTranslationBook, chapter: Int, omitReference: Boolean): String {
        if (omitReference) {
            return content.trim()
        }
        return "${formatReference(book, VerseReference(chapter = chapter))}\n${content.trim()}".trim()
    }

    private suspend inline fun <reified T : ApiDatasetBookChapterResult> getDatasetChapterLink(
        link: String?,
        endpoint: String?,
    ): T? {
        val chapter = getLink(ApiDatasetBookChapterResult.serializer(), link, endpoint) ?: return null
        return chapter as? T
            ?: throw IllegalStateException("Expected ${T::class.simpleName} from $link but got ${chapter::class.simpleName}.")
    }

    private suspend fun <T : Any> getLink(
        deserializer: DeserializationStrategy<T>,
        link: String?,
        endpoint: String?,
    ): T? = if (link.isNullOrEmpty()) null else getJson(deserializer, link, endpoint)

    private suspend fun <T : Any> getJson(
        deserializer: DeserializationStrategy<T>,
        path: String,
        endpoint: String?,
        cache: Boolean = true,
    ): T {
        val url = buildUrl(path, endpoint)
        if (!useCache || !cache) {
            return fetch(deserializer, url)
        }

        // The same URL may be decoded into different types (e.g. a dataset chapter), so include the type in the key.
        val key = "${deserializer.descriptor.serialName} $url"
        while (true) {
            val existing = responseCache[key]
            if (existing != null) {
                try {
                    @Suppress("UNCHECKED_CAST")
                    return existing.await() as T
                } catch (e: CancellationException) {
                    // The request that we were waiting on was cancelled by its caller.
                    // Make sure that we weren't cancelled too, and then try again.
                    currentCoroutineContext().ensureActive()
                    continue
                }
            }

            val request = CompletableDeferred<Any>()
            if (responseCache.putIfAbsent(key, request) != null) {
                continue
            }

            try {
                val result = fetch(deserializer, url)
                request.complete(result)
                return result
            } catch (e: Throwable) {
                responseCache.remove(key, request)
                request.completeExceptionally(e)
                throw e
            }
        }
    }

    private suspend fun <T> fetch(deserializer: DeserializationStrategy<T>, url: String): T {
        val response = httpClient.get(url)
        if (response.statusCode !in 200..299) {
            throw FreeUseBibleApiException(url, response.statusCode, response.statusMessage)
        }
        return json.decodeFromString(deserializer, response.body)
    }

    private fun buildUrl(path: String, endpoint: String?): String {
        if (path.startsWith("http://", ignoreCase = true) || path.startsWith("https://", ignoreCase = true)) {
            return path
        }

        var base = URI(endpoint ?: this.endpoint)
        if (base.rawPath.isNullOrEmpty()) {
            // URI.resolve() doesn't add the slash between the host and a relative path.
            base = base.resolve("/")
        }
        return base.resolve(path).toString()
    }
}

/**
 * Percent-encodes the given value so that it can be used as a single path segment.
 * Equivalent to JavaScript's encodeURIComponent().
 */
private fun encode(value: String): String {
    val result = StringBuilder()
    for (byte in value.toByteArray(Charsets.UTF_8)) {
        val c = byte.toInt() and 0xFF
        if (c < 0x80 && (c.toChar().isLetterOrDigit() || c.toChar() in "-_.!~*'()")) {
            result.append(c.toChar())
        } else {
            result.append('%').append("0123456789ABCDEF"[c shr 4]).append("0123456789ABCDEF"[c and 0xF])
        }
    }
    return result.toString()
}

/**
 * Gets the part of the given string between the start and end indexes, clamping the indexes to the bounds of the string.
 * Equivalent to JavaScript's String.prototype.slice() for non-negative indexes.
 */
private fun slice(value: String, start: Int, end: Int): String {
    val from = start.coerceIn(0, value.length)
    val to = end.coerceIn(0, value.length)
    return if (from < to) value.substring(from, to) else ""
}
