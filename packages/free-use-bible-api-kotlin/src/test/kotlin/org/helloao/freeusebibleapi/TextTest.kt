package org.helloao.freeusebibleapi

import kotlin.test.Test
import kotlin.test.assertEquals

class TextTest {
    private val api = FreeUseBibleApi(httpClient = FixtureHttpClient())

    private val genesis = FreeUseBibleApi.json.decodeFromString<ApiTranslationBookChapter>(
        readResource("samples/BSB/GEN/1.json"),
    )

    private fun verse(vararg content: VerseContent) = ChapterVerse(number = 1, content = content.toList())

    @Test
    fun `getChapterVerseText matches the TypeScript SDK`() {
        for (chapter in listOf("GEN/1", "PSA/3", "PSA/23", "MAT/5")) {
            val full = FreeUseBibleApi.json.decodeFromString<ApiTranslationBookChapter>(
                readResource("samples/BSB/$chapter.json"),
            )
            assertEquals(readResource("samples/BSB/$chapter.txt"), api.getChapterVerseText(full), chapter)

            val simple = FreeUseBibleApi.json.decodeFromString<ApiSimpleTranslationBookChapter>(
                readResource("samples/BSB/$chapter.simple.json"),
            )
            assertEquals(readResource("samples/BSB/$chapter.simple.txt"), api.getSimpleChapterVerseText(simple), chapter)
        }
    }

    @Test
    fun `getChapterVerseText can omit verse numbers and the reference`() {
        val text = api.getChapterVerseText(genesis, omitVerseNumbers = true, omitReference = true)
        assertEquals(true, text.startsWith("In the beginning God created the heavens and the earth."))

        val withNumbers = api.getChapterVerseText(genesis, omitReference = true)
        assertEquals(true, withNumbers.startsWith("[1] In the beginning"))

        val withReference = api.getChapterVerseText(genesis, omitVerseNumbers = true)
        assertEquals(true, withReference.startsWith("Genesis 1\nIn the beginning"))
    }

    @Test
    fun `getVerseText concatenates string parts`() {
        assertEquals("Hello world", api.getVerseText(verse(PlainText("Hello "), PlainText("world"))))
    }

    @Test
    fun `getVerseText supports formatted text and line breaks`() {
        assertEquals(
            "Hello\nworld",
            api.getVerseText(verse(FormattedText(text = "Hello", wordsOfJesus = true), PlainInlineLineBreak(), PlainText("world"))),
        )
    }

    @Test
    fun `getVerseText renders poems on separate indented lines`() {
        assertEquals(
            "Line one\n\t\tLine two",
            api.getVerseText(verse(FormattedText(text = "Line one", poem = 1), FormattedText(text = "Line two", poem = 2))),
        )
    }

    @Test
    fun `getVerseText replaces notes and inline headings with spaces`() {
        assertEquals(
            "Hello world again",
            api.getVerseText(
                verse(PlainText("Hello"), VerseFootnoteReference(noteId = 1), PlainText("world"), InlineHeading("Title"), PlainText("again")),
            ),
        )
    }

    @Test
    fun `formatReference formats references`() {
        val book = genesis.book
        assertEquals("Genesis 1", api.formatReference(book, VerseReference(chapter = 1)))
        assertEquals("Genesis 1:1", api.formatReference(book, VerseReference(chapter = 1, verse = 1)))
        assertEquals("Genesis 1:1-3", api.formatReference(book, VerseReference(chapter = 1, verse = 1, endVerse = 3)))
        assertEquals("Genesis 1-3", api.formatReference(book, VerseReference(chapter = 1, verse = 1, endChapter = 3)))
    }

    @Test
    fun `getWordText slices words out of the verse content`() {
        val verse = verse(PlainText("In the beginning"), FormattedText(text = "God created"), VerseFootnoteReference(noteId = 1))

        assertEquals("beginning", api.getWordText(verse, ChapterWord(contentIndex = 0, start = 7, end = 16)))
        assertEquals("created", api.getWordText(verse, ChapterWord(contentIndex = 1, start = 4, end = 11)))
        assertEquals("", api.getWordText(verse, ChapterWord(contentIndex = 2, start = 0, end = 1)))
        assertEquals("", api.getWordText(verse, ChapterWord(contentIndex = 5, start = 0, end = 1)))
        assertEquals("ated", api.getWordText(verse, ChapterWord(contentIndex = 1, start = 7, end = 100)))
    }

    @Test
    fun `getVerseWords pairs annotations with their text`() {
        val chapter = FreeUseBibleApi.json.decodeFromString<ApiTranslationBookChapter>(readResource("api/bsb/GEN/1.json"))
        val words = FreeUseBibleApi.json.decodeFromString<ApiTranslationBookChapterWords>(readResource("api/bsb/GEN/1.words.json"))
        val verse = chapter.chapter.content.filterIsInstance<ChapterVerse>().first()

        assertEquals(listOf("In", "the", "beginning"), api.getVerseWords(verse, words).map { it.text })
        assertEquals(listOf("H7225"), api.getVerseWords(verse, words)[2].word.strongs)
        assertEquals(emptyList(), api.getVerseWords(verse.copy(number = 99), words))
    }

    @Test
    fun `getSimpleVerseWords pairs annotations with their text`() {
        val chapter = FreeUseBibleApi.json.decodeFromString<ApiSimpleTranslationBookChapter>(readResource("api/bsb/GEN/1.simple.json"))
        val words = FreeUseBibleApi.json.decodeFromString<ApiSimpleTranslationBookChapterWords>(readResource("api/bsb/GEN/1.words.simple.json"))
        val verse = chapter.chapter.content.filterIsInstance<SimpleChapterVerse>()[1]

        assertEquals(listOf("God", "created", "the", "earth"), api.getSimpleVerseWords(verse, words).map { it.text })
        assertEquals(emptyList(), api.getSimpleVerseWords(verse.copy(number = 99), words))
    }
}
