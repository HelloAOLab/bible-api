package org.helloao.freeusebibleapi

import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertIs
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertSame
import kotlin.test.assertTrue

class FreeUseBibleApiTest {
    private val http = FixtureHttpClient()
    private val api = FreeUseBibleApi(httpClient = http)

    @Test
    fun `requests available translations from the default endpoint`() = runTest {
        val result = api.getAvailableTranslations()

        assertEquals(listOf("https://bible.helloao.org/api/available_translations.json"), http.requests)
        assertEquals("bsb", result.translations.single().id)
        assertEquals("ltr", result.translations.single().textDirection)
    }

    @Test
    fun `gets the available commentaries and datasets`() = runTest {
        assertEquals(listOf("comment"), api.getAvailableCommentaries().commentaries.map { it.id })
        assertEquals(
            listOf("theographic", "bsb-interlinear", "stepbible-lexicon", "verse-of-the-day", "default"),
            api.getAvailableDatasets().datasets.map { it.id },
        )
    }

    @Test
    fun `supports overriding the endpoint`() = runTest {
        val recorder = RecordingHttpClient()
        val custom = FreeUseBibleApi(endpoint = "https://example.com/bible/", httpClient = recorder)
        runCatching { custom.getTranslationBooks("bsb") }
        runCatching { custom.getTranslationBooks("bsb", endpoint = "https://other.example.com") }

        // Links from the API are relative to the origin, so they ignore the path of the endpoint.
        val chapter = api.getTranslationBookChapter("bsb", "GEN", 1)
        runCatching { custom.getNextChapter(chapter) }

        assertEquals(
            listOf(
                "https://example.com/bible/api/bsb/books.json",
                "https://other.example.com/api/bsb/books.json",
                "https://example.com/api/bsb/GEN/2.json",
            ),
            recorder.requests,
        )
    }

    @Test
    fun `encodes each path segment`() = runTest {
        val recorder = RecordingHttpClient()
        val client = FreeUseBibleApi(httpClient = recorder)

        runCatching { client.getTranslationBookChapter("my translation/ü", "GEN", 1) }
        runCatching { client.getTranslationBookChapterAudioTimings("bsb", "1 SA", 3, "reader?x") }
        runCatching { client.getDatasetLexiconEntry("step bible", "H0430#a") }

        assertEquals(
            listOf(
                "https://bible.helloao.org/api/my%20translation%2F%C3%BC/GEN/1.json",
                "https://bible.helloao.org/api/bsb/1%20SA/3.reader%3Fx.audioTimings.json",
                "https://bible.helloao.org/api/d/step%20bible/lexicon/H0430%23a.json",
            ),
            recorder.requests,
        )
    }

    @Test
    fun `gets translation books and chapters`() = runTest {
        val books = api.getTranslationBooks("bsb")
        assertEquals(listOf("GEN"), books.books.map { it.id })

        val chapter = api.getTranslationBookChapter("bsb", "GEN", 1)
        assertEquals(1, chapter.chapter.number)
        assertEquals("Genesis", chapter.book.name)
        val heading = assertIs<ChapterHeading>(chapter.chapter.content[0])
        assertEquals(listOf("The Creation"), heading.content)
        val verse = assertIs<ChapterVerse>(chapter.chapter.content[1])
        assertEquals(FormattedText(text = "In the beginning", poem = 1), verse.content.single())
    }

    @Test
    fun `gets simplified translation chapters`() = runTest {
        val chapter = api.getSimpleTranslationBookChapter("bsb", "GEN", 1)

        assertEquals(SimpleChapterHeading(text = "The Creation"), chapter.chapter.content[0])
        val verse = assertIs<SimpleChapterVerse>(chapter.chapter.content[1])
        assertEquals("In the beginning", verse.text)
        assertEquals(listOf(SimplePoemRange(start = 0, end = 16, level = 1)), verse.poem)
        assertEquals("/api/bsb/GEN/1.json", chapter.fullChapterApiLink)
    }

    @Test
    fun `gets complete translations without caching them`() = runTest {
        val complete = api.getCompleteTranslation("bsb")
        api.getCompleteTranslation("bsb")
        val simple = api.getSimpleCompleteTranslation("bsb")
        api.getSimpleCompleteTranslation("bsb")

        assertEquals(listOf(1, 2), complete.books.single().chapters.map { it.chapter.number })
        assertEquals(listOf(1, 2), simple.books.single().chapters.map { it.chapter.number })
        assertEquals(4, http.requests.size)
    }

    @Test
    fun `gets audio timings`() = runTest {
        val timings = api.getTranslationBookChapterAudioTimings("bsb", "GEN", 1, "hays")

        assertEquals("hays", timings.reader)
        assertEquals(listOf(0.0, 5.24, 12.5), timings.verses)
        assertEquals("https://bible.helloao.org/api/bsb/GEN/1.hays.audioTimings.json", http.requests.single())
    }

    @Test
    fun `gets word-level annotations`() = runTest {
        val words = api.getTranslationBookChapterWords("bsb", "GEN", 1)
        assertEquals(listOf("H8064"), words.verses["1"]!![0].strongs)

        val simpleWords = api.getSimpleTranslationBookChapterWords("bsb", "GEN", 1)
        assertEquals(SimpleChapterWord(start = 3, end = 6, strongs = listOf("H1254")), simpleWords.verses["1"]!![1])
    }

    @Test
    fun `follows the links of loaded chapters`() = runTest {
        val chapter1 = api.getTranslationBookChapter("bsb", "GEN", 1)
        val chapter2 = api.getTranslationBookChapter("bsb", "GEN", 2)

        assertEquals(chapter2, api.getNextChapter(chapter1))
        assertEquals(chapter1, api.getPreviousChapter(chapter2))
        assertNull(api.getPreviousChapter(chapter1))
        assertNull(api.getNextChapter(chapter2))

        assertNotNull(api.getChapterWords(chapter1))
        assertNull(api.getChapterWords(chapter2))

        val simple1 = assertNotNull(api.getSimpleChapter(chapter1))
        assertEquals(api.getSimpleTranslationBookChapter("bsb", "GEN", 1), simple1)
        val simple2 = assertNotNull(api.getNextChapter(simple1))
        assertEquals(2, simple2.chapter.number)
        assertEquals(simple1, api.getPreviousChapter(simple2))
        assertNotNull(api.getSimpleChapterWords(simple1))
        assertNull(api.getSimpleChapterWords(simple2))

        val complete = api.getCompleteTranslation("bsb").books.single().chapters
        assertNotNull(api.getChapterWords(complete[0]))
        assertNull(api.getChapterWords(complete[1]))
        val simpleComplete = api.getSimpleCompleteTranslation("bsb").books.single().chapters
        assertNotNull(api.getSimpleChapterWords(simpleComplete[0]))
        assertNull(api.getSimpleChapterWords(simpleComplete[1]))
    }

    @Test
    fun `gets the first and last chapters of books`() = runTest {
        val book = api.getTranslationBooks("bsb").books.single()
        assertEquals(1, api.getFirstChapter(book).chapter.number)
        assertEquals(2, api.getLastChapter(book).chapter.number)

        val commentaryBook = api.getCommentaryBooks("comment").books.single()
        assertEquals("Genesis Book Intro", commentaryBook.introduction)
        assertEquals(1, api.getFirstChapter(commentaryBook)?.chapter?.number)
        assertEquals(1, api.getLastChapter(commentaryBook)?.chapter?.number)
        assertNull(api.getFirstChapter(commentaryBook.copy(firstChapterApiLink = null)))

        val datasetBook = api.getDatasetBooks("theographic").books.first()
        assertEquals(1, assertIs<ApiDatasetEntityBookChapter>(api.getFirstChapter(datasetBook)).chapter.number)
        assertEquals(2, assertIs<ApiDatasetEntityBookChapter>(api.getLastChapter(datasetBook)).chapter.number)
    }

    @Test
    fun `gets commentary chapters`() = runTest {
        val chapter = api.getCommentaryBookChapter("comment", "GEN", 1)
        assertEquals("Chapter introduction", chapter.chapter.introduction)
        assertEquals("This is the commentary for Genesis 1:1.", api.getVerseText(chapter.chapter.content.single()))
        assertNull(api.getNextChapter(chapter))
        assertNull(api.getPreviousChapter(chapter))

        val simple = api.getSimpleCommentaryBookChapter("comment", "GEN", 1)
        assertEquals(simple, api.getSimpleChapter(chapter))
        assertEquals("This is the commentary for Genesis 1:1.", simple.chapter.content.single().text)
        assertNull(api.getNextChapter(simple))
    }

    @Test
    fun `gets dataset chapters`() = runTest {
        val interlinear = assertIs<ApiDatasetBookChapter>(api.getDatasetBookChapter("bsb-interlinear", "GEN", 1))
        val words = assertIs<DatasetChapterVerseWords>(interlinear.chapter.content.first())
        assertEquals("In the beginning", words.words.first().gloss)
        assertEquals("hebrew", words.words.first().language)

        val next: ApiDatasetBookChapter? = api.getNextChapter(interlinear)
        assertEquals(2, next?.chapter?.number)
        assertEquals(interlinear, api.getPreviousChapter(next!!))

        val crossReferences = assertIs<ApiDatasetBookChapter>(api.getDatasetBookChapter("default", "GEN", 1))
        val references = assertIs<DatasetChapterVerseReferences>(crossReferences.chapter.content.single())
        assertEquals(ScoredVerseRef(book = "JHN", chapter = 1, verse = 1, endVerse = 3, score = 500.0), references.references.single())

        val entities = assertIs<ApiDatasetEntityBookChapter>(api.getDatasetBookChapter("theographic", "GEN", 1))
        assertEquals(listOf("adam_2"), entities.chapter.people.map { it.id })
        assertEquals(31.777444, entities.chapter.places.single().latitude)
        val nextEntities: ApiDatasetEntityBookChapter? = api.getNextChapter(entities)
        assertEquals(2, nextEntities?.chapter?.number)

        // The union overloads dispatch to the right type.
        val result: ApiDatasetBookChapterResult = entities
        assertIs<ApiDatasetEntityBookChapter>(api.getNextChapter(result))
        assertNull(api.getPreviousChapter(result))
    }

    @Test
    fun `gets dataset entities`() = runTest {
        assertEquals(listOf("adam_2", "seth_10"), api.getDatasetPeople("theographic").people.map { it.id })
        val adam = api.getDatasetPerson("theographic", "adam_2").person
        assertEquals("Adam", adam.name)
        assertEquals(listOf("seth_10"), adam.children?.map { it.id })
        assertEquals("people", adam.children?.single()?.type)

        assertEquals(listOf("eden_1"), api.getDatasetPlaces("theographic").places.map { it.id })
        assertEquals(listOf("Paradise", "Garden of God"), api.getDatasetPlace("theographic", "eden_1").place.aliases)

        assertEquals(
            listOf("creation-of-adam-and-eve_1", "the-fall_2"),
            api.getDatasetEvents("theographic").events.map { it.id },
        )
        assertEquals("1D", api.getDatasetEvent("theographic", "the-fall_2").event.duration)

        assertEquals(listOf("humanity"), api.getDatasetPeopleGroups("theographic").groups.map { it.id })
        assertEquals(
            listOf("adam_2", "seth_10"),
            api.getDatasetPeopleGroup("theographic", "humanity").group.members?.map { it.id },
        )
    }

    @Test
    fun `gets the lexicon`() = runTest {
        val lexicon = api.getDatasetLexicon("stepbible-lexicon")
        assertTrue(lexicon.lexicon.any { it.id == "H0430" })

        val entry = api.getDatasetLexiconEntry("stepbible-lexicon", "H0430").entry
        assertEquals("God", entry.senses.single().gloss)
    }

    @Test
    fun `gets the verse categories`() = runTest {
        val categories = api.getDatasetCategories("verse-of-the-day")
        assertEquals(listOf("christmas", "hope", "love"), categories.categories.map { it.id })
        assertEquals(DatasetCategoryHoliday(month = 12, day = 25), categories.categories.first().holiday)
        assertEquals("/api/d/verse-of-the-day/categories/hope.json", categories.categories[1].apiLink)

        val hope = api.getDatasetCategory("verse-of-the-day", "hope").category
        assertEquals("Hope", hope.name)
        assertEquals(DatasetCategoryVerse(book = "GEN", chapter = 50, verse = 20), hope.verses.first())
        assertEquals(19, hope.verses.last().endVerse)
    }

    @Test
    fun `gets every verse in a dataset`() = runTest {
        val all = api.getDatasetVerses("verse-of-the-day")
        assertTrue(all.verses.any { "christmas" in it.categories })
        assertEquals(DatasetCategoryHoliday(month = 12, day = 25).month, all.holidays!!.first { it.id == "christmas" }.month)
        val verses = all.verses.filter { it.chapter == 3 }
        assertEquals(
            listOf("PRO" to 3, "PRO" to 5, "PRO" to 27, "JHN" to 16, "JHN" to 17),
            verses.map { it.book to it.verse },
        )
        assertEquals(6, verses[1].endVerse)
        assertEquals(listOf("love", "salvation"), verses[3].categories)
    }

    @Test
    fun `gets verse of the day chapters`() = runTest {
        val chapter = api.getDatasetBookChapter("verse-of-the-day", "PRO", 3)
        assertIs<ApiDatasetBookChapter>(chapter)
        assertEquals(3, chapter.chapter.content.size)
        val verse = assertIs<DatasetChapterVerseCategories>(chapter.chapter.content[1])
        assertEquals(5, verse.verse)
        assertEquals(6, verse.endVerse)
        assertEquals(listOf("faith", "guidance", "wisdom"), verse.categories)
    }

    @Test
    fun `caches repeated requests by default`() = runTest {
        val first = api.getTranslationBooks("bsb")
        val second = api.getTranslationBooks("bsb")

        assertSame(first, second)
        assertEquals(1, http.requests.size)
    }

    @Test
    fun `shares concurrent requests for the same URL`() = runTest {
        val results = (1..5).map { async { api.getTranslationBooks("bsb") } }.awaitAll()

        assertEquals(1, http.requests.size)
        assertTrue(results.all { it === results[0] })
    }

    @Test
    fun `does not cache when useCache is false`() = runTest {
        val client = FreeUseBibleApi(useCache = false, httpClient = http)
        client.getTranslationBooks("bsb")
        client.getTranslationBooks("bsb")

        assertEquals(2, http.requests.size)
    }

    @Test
    fun `throws on non-2xx responses and retries after a failure`() = runTest {
        http.failures = 1
        val error = assertFailsWith<FreeUseBibleApiException> { api.getTranslationBooks("bsb") }
        assertEquals(500, error.statusCode)
        assertEquals(
            "Failed request to https://bible.helloao.org/api/bsb/books.json. Status: 500 Internal Server Error",
            error.message,
        )

        assertEquals("bsb", api.getTranslationBooks("bsb").translation.id)
        assertEquals(2, http.requests.size)

        val notFound = assertFailsWith<FreeUseBibleApiException> { api.getTranslationBooks("missing") }
        assertEquals(404, notFound.statusCode)
    }

    private class RecordingHttpClient : FreeUseBibleApiHttpClient {
        val requests = mutableListOf<String>()

        override suspend fun get(url: String): FreeUseBibleApiHttpResponse {
            requests.add(url)
            return FreeUseBibleApiHttpResponse(404, "Not Found", "")
        }
    }
}
