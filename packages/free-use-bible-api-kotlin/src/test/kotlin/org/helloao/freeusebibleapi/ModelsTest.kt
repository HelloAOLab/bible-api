package org.helloao.freeusebibleapi

import kotlinx.serialization.KSerializer
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.doubleOrNull
import java.io.File
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ModelsTest {
    private val json = FreeUseBibleApi.json

    @Test
    fun `decodes and re-encodes every fixture`() {
        val root = File(ModelsTest::class.java.getResource("/api")!!.toURI()).parentFile
        val files = root.walkTopDown().filter { it.isFile && it.extension == "json" }.toList()
        assertTrue(files.size > 40, "Expected to find the fixtures")

        for (file in files) {
            checkFile(file.relativeTo(root).invariantSeparatorsPath, file.readText())
        }
    }

    /**
     * Decodes every file in a directory of generated API files.
     *
     * Set the FREE_USE_BIBLE_API_OUTPUT_DIR environment variable to the directory that contains the `api` folder
     * (e.g. the output of `helloao generate-translation-files`) to check the models against a full build of the API.
     */
    @Test
    fun `decodes every file in FREE_USE_BIBLE_API_OUTPUT_DIR`() {
        val dir = System.getenv("FREE_USE_BIBLE_API_OUTPUT_DIR") ?: return
        val root = File(dir)
        var count = 0
        root.walkTopDown().filter { it.isFile && it.extension == "json" }.forEach { file ->
            val path = file.relativeTo(root).invariantSeparatorsPath
            if (serializerFor(path) != null) {
                checkFile(path, file.readText())
                count += 1
            }
        }
        println("Decoded $count files from $dir")
    }

    @Test
    fun `serializes unions in the same format as the API`() {
        val verse: ChapterContent = ChapterVerse(
            number = 1,
            content = listOf(
                PlainText("Hello"),
                FormattedText(text = "world", poem = 1),
                InlineHeading("Heading"),
                PlainInlineLineBreak(),
                VerseFootnoteReference(noteId = 2),
            ),
        )

        assertEquals(
            """{"type":"verse","number":1,"content":["Hello",{"text":"world","poem":1},{"heading":"Heading"},{"lineBreak":true},{"noteId":2}]}""",
            json.encodeToString(ChapterContent.serializer(), verse),
        )
        assertEquals("""{"type":"line_break"}""", json.encodeToString(ChapterContent.serializer(), ChapterLineBreak))
        assertEquals(ChapterLineBreak, json.decodeFromString(SimpleChapterContent.serializer(), """{"type":"line_break"}"""))
    }

    @Test
    fun `ignores unknown properties`() {
        val heading = json.decodeFromString(
            ChapterContent.serializer(),
            """{"type":"heading","content":["Title"],"somethingNew":true}""",
        )
        assertEquals(ChapterHeading(content = listOf("Title")), heading)
    }

    @Test
    fun `decodes paragraphs and unknown content variants`() {
        assertEquals(
            ChapterParagraph(style = "p"),
            json.decodeFromString(ChapterContent.serializer(), """{"type":"paragraph","style":"p"}"""),
        )
        assertEquals(
            UnknownChapterContent(json.parseToJsonElement("""{"type":"future_item","payload":{"keep":[1,true]}}""")),
            json.decodeFromString(ChapterContent.serializer(), """{"type":"future_item","payload":{"keep":[1,true]}}"""),
        )
        assertEquals(
            UnknownSimpleChapterContent(json.parseToJsonElement("""{"type":"future_item","payload":{"keep":[1,true]}}""")),
            json.decodeFromString(SimpleChapterContent.serializer(), """{"type":"future_item","payload":{"keep":[1,true]}}"""),
        )
        assertEquals(
            UnknownVerseContent(JsonObject(mapOf("future" to JsonPrimitive(true)))),
            json.decodeFromString(VerseContent.serializer(), """{"future":true}"""),
        )
        assertEquals(
            InlineParagraph(style = "p"),
            json.decodeFromString(VerseContent.serializer(), """{"lineBreak":true,"paragraph":true,"style":"p"}"""),
        )
    }

    @Test
    fun `unknown discriminated variants preserve their raw payload when re-encoded`() {
        val raw = json.parseToJsonElement("""{"type":"future_item","payload":{"keep":[1,true]}}""")
        val chapter = json.decodeFromString(ChapterContent.serializer(), raw.toString()) as UnknownChapterContent
        val simple = json.decodeFromString(SimpleChapterContent.serializer(), raw.toString()) as UnknownSimpleChapterContent
        assertEquals(raw, chapter.raw)
        assertEquals(raw, simple.raw)
        assertEquals(raw, json.encodeToJsonElement(UnknownChapterContent.serializer(), chapter))
        assertEquals(raw, json.encodeToJsonElement(UnknownSimpleChapterContent.serializer(), simple))
    }

    private fun checkFile(path: String, text: String) {
        @Suppress("UNCHECKED_CAST")
        val serializer = serializerFor(path) as KSerializer<Any>? ?: throw AssertionError("No serializer for $path")
        val decoded = try {
            json.decodeFromString(serializer, text)
        } catch (e: Exception) {
            throw AssertionError("Unable to decode $path", e)
        }

        // Re-encoding should produce the same JSON (ignoring nulls and properties that the models don't know about).
        val original = normalize(json.parseToJsonElement(text))
        val encoded = normalize(json.encodeToJsonElement(serializer, decoded))
        assertEquals(stripUnknown(original, encoded), encoded, "Re-encoding $path should match the original")
    }

    private fun serializerFor(path: String): KSerializer<*>? {
        val p = path.removePrefix("samples/BSB/").let { if (it == path) it else "api/BSB/$it" }
        return when {
            p.endsWith("/available_translations.json") -> ApiAvailableTranslations.serializer()
            p.endsWith("/available_commentaries.json") -> ApiAvailableCommentaries.serializer()
            p.endsWith("/available_datasets.json") -> ApiAvailableDatasets.serializer()
            Regex("api/c/[^/]+/books\\.json$").containsMatchIn(p) -> ApiCommentaryBooks.serializer()
            Regex("api/c/[^/]+/[^/]+/\\d+\\.simple\\.json$").containsMatchIn(p) -> ApiSimpleCommentaryBookChapter.serializer()
            Regex("api/c/[^/]+/[^/]+/\\d+\\.json$").containsMatchIn(p) -> ApiCommentaryBookChapter.serializer()
            Regex("api/d/[^/]+/books\\.json$").containsMatchIn(p) -> ApiDatasetBooks.serializer()
            Regex("api/d/[^/]+/people\\.json$").containsMatchIn(p) -> ApiDatasetPeople.serializer()
            Regex("api/d/[^/]+/people/[^/]+\\.json$").containsMatchIn(p) -> ApiDatasetPerson.serializer()
            Regex("api/d/[^/]+/places\\.json$").containsMatchIn(p) -> ApiDatasetPlaces.serializer()
            Regex("api/d/[^/]+/places/[^/]+\\.json$").containsMatchIn(p) -> ApiDatasetPlace.serializer()
            Regex("api/d/[^/]+/events\\.json$").containsMatchIn(p) -> ApiDatasetEvents.serializer()
            Regex("api/d/[^/]+/events/[^/]+\\.json$").containsMatchIn(p) -> ApiDatasetEvent.serializer()
            Regex("api/d/[^/]+/groups\\.json$").containsMatchIn(p) -> ApiDatasetPeopleGroups.serializer()
            Regex("api/d/[^/]+/groups/[^/]+\\.json$").containsMatchIn(p) -> ApiDatasetPeopleGroup.serializer()
            Regex("api/d/[^/]+/lexicon\\.json$").containsMatchIn(p) -> ApiDatasetLexicon.serializer()
            Regex("api/d/[^/]+/lexicon/[^/]+\\.json$").containsMatchIn(p) -> ApiDatasetLexiconEntry.serializer()
            Regex("api/d/[^/]+/[^/]+/\\d+\\.json$").containsMatchIn(p) -> ApiDatasetBookChapterResult.serializer()
            Regex("api/[^/]+/books\\.json$").containsMatchIn(p) -> ApiTranslationBooks.serializer()
            Regex("api/[^/]+/complete\\.json$").containsMatchIn(p) -> ApiTranslationComplete.serializer()
            Regex("api/[^/]+/complete\\.simple\\.json$").containsMatchIn(p) -> ApiSimpleTranslationComplete.serializer()
            Regex("api/[^/]+/[^/]+/\\d+\\.words\\.simple\\.json$").containsMatchIn(p) -> ApiSimpleTranslationBookChapterWords.serializer()
            Regex("api/[^/]+/[^/]+/\\d+\\.words\\.json$").containsMatchIn(p) -> ApiTranslationBookChapterWords.serializer()
            Regex("api/[^/]+/[^/]+/\\d+\\.[^/]+\\.audioTimings\\.json$").containsMatchIn(p) -> ApiTranslationBookChapterAudioTimings.serializer()
            Regex("api/[^/]+/[^/]+/\\d+\\.simple\\.json$").containsMatchIn(p) -> ApiSimpleTranslationBookChapter.serializer()
            Regex("api/[^/]+/[^/]+/\\d+\\.json$").containsMatchIn(p) -> ApiTranslationBookChapter.serializer()
            else -> null
        }
    }

    /**
     * Removes nulls and normalizes numbers so that 1 and 1.0 compare equal.
     */
    private fun normalize(element: JsonElement): JsonElement = when (element) {
        is JsonObject -> JsonObject(element.filterValues { it !is JsonNull }.mapValues { normalize(it.value) })
        is JsonArray -> JsonArray(element.map { normalize(it) })
        is JsonPrimitive -> if (!element.isString && element.doubleOrNull != null) JsonPrimitive(element.doubleOrNull) else element
        JsonNull -> JsonNull
    }

    /**
     * Removes the properties from the original JSON that weren't included in the encoded JSON at all
     * (because the models don't have them, like the "type" of verses in a commentary chapter).
     */
    private fun stripUnknown(original: JsonElement, encoded: JsonElement): JsonElement = when {
        original is JsonObject && encoded is JsonObject ->
            JsonObject(original.filterKeys { it in encoded }.mapValues { (key, value) -> stripUnknown(value, encoded[key]!!) })
        original is JsonArray && encoded is JsonArray && original.size == encoded.size ->
            JsonArray(original.mapIndexed { i, value -> stripUnknown(value, encoded[i]) })
        else -> original
    }
}
