# Free Use Bible API for Kotlin

<!-- #region docs -->

Kotlin client for the public Free Use Bible API:

- `https://bible.helloao.org`

It works on the JVM (Java 8+) and Android, uses [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) for the response models, and exposes every request as a `suspend` function.

## Installation

The library isn't published to Maven Central yet. To use it, build it from source and install it into your local Maven repository:

```bash
git clone https://github.com/HelloAOLab/bible-api.git
cd bible-api/packages/free-use-bible-api-kotlin
./gradlew publishToMavenLocal
```

Then add it to your project:

```kotlin
// build.gradle.kts
repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation("org.helloao:free-use-bible-api:1.15.0")
}
```

## Quick Start

```kotlin
import kotlinx.coroutines.runBlocking
import org.helloao.freeusebibleapi.FreeUseBibleApi

fun main() = runBlocking {
    val api = FreeUseBibleApi()

    val available = api.getAvailableTranslations()
    println("Total translations: ${available.translations.size}")

    val books = api.getTranslationBooks("BSB")
    println("Books in BSB: ${books.books.size}")

    val chapter = api.getTranslationBookChapter("BSB", "GEN", 1)
    println("Verses in Genesis 1: ${chapter.numberOfVerses}")

    println(api.getChapterVerseText(chapter))
}
```

## Client Options

```kotlin
import org.helloao.freeusebibleapi.FreeUseBibleApi
import org.helloao.freeusebibleapi.UrlConnectionHttpClient

val api = FreeUseBibleApi(
    endpoint = "https://bible.helloao.org/",
    useCache = true,
    httpClient = UrlConnectionHttpClient(connectTimeoutMillis = 10_000, readTimeoutMillis = 30_000),
)
```

- `endpoint`: Base API endpoint.
- `useCache`: Enables in-memory response caching (default: `true`). Concurrent requests for the same URL share a single HTTP request.
- `httpClient`: The `FreeUseBibleApiHttpClient` used to make requests. The default (`UrlConnectionHttpClient`) uses `HttpURLConnection`, so the library has no dependencies besides kotlinx.serialization and kotlinx.coroutines.

To use a different HTTP library (like OkHttp or Ktor), implement `FreeUseBibleApiHttpClient`:

```kotlin
val api = FreeUseBibleApi(httpClient = { url ->
    val response = myHttpClient.get(url)
    FreeUseBibleApiHttpResponse(response.code, response.message, response.bodyAsText())
})
```

Every request method also accepts an optional `endpoint` argument that overrides the client's endpoint for that request.

## API Methods

### Translations

- `getAvailableTranslations(endpoint?)`
- `getTranslationBooks(translation, endpoint?)`
- `getTranslationBookChapter(translation, book, chapter, endpoint?)`
- `getTranslationBookChapterAudioTimings(translation, book, chapter, reader, endpoint?)`
- `getTranslationBookChapterWords(translation, book, chapter, endpoint?)`
- `getCompleteTranslation(translation, endpoint?)`
- `getSimpleTranslationBookChapter(translation, book, chapter, endpoint?)`
- `getSimpleTranslationBookChapterWords(translation, book, chapter, endpoint?)`
- `getSimpleCompleteTranslation(translation, endpoint?)`

`getCompleteTranslation()` and `getSimpleCompleteTranslation()` are never cached because their responses are very large.

Only some chapters have audio timings. The keys of a chapter's `thisChapterAudioTimings` property identify the readers available to pass to `getTranslationBookChapterAudioTimings()`.

### Commentaries

- `getAvailableCommentaries(endpoint?)`
- `getCommentaryBooks(commentary, endpoint?)`
- `getCommentaryBookChapter(commentary, book, chapter, endpoint?)`
- `getSimpleCommentaryBookChapter(commentary, book, chapter, endpoint?)`

### Datasets

- `getAvailableDatasets(endpoint?)`
- `getDatasetBooks(dataset, endpoint?)`
- `getDatasetBookChapter(dataset, book, chapter, endpoint?)` - returns an `ApiDatasetBookChapterResult`, which is either an `ApiDatasetBookChapter` (the cross references for cross reference datasets, or the original-language words of each verse for interlinear datasets such as `bsb-interlinear`) or an `ApiDatasetEntityBookChapter` (the people, places, and events that appear in the chapter for entity datasets such as `theographic`).
- `getDatasetPeople(dataset, endpoint?)`
- `getDatasetPerson(dataset, person, endpoint?)`
- `getDatasetPlaces(dataset, endpoint?)`
- `getDatasetPlace(dataset, place, endpoint?)`
- `getDatasetEvents(dataset, endpoint?)`
- `getDatasetEvent(dataset, event, endpoint?)`
- `getDatasetPeopleGroups(dataset, endpoint?)`
- `getDatasetPeopleGroup(dataset, group, endpoint?)`
- `getDatasetLexicon(dataset, endpoint?)`
- `getDatasetLexiconEntry(dataset, strongs, endpoint?)`
- `getDatasetVerses(dataset, endpoint?)`
- `getDatasetCategories(dataset, endpoint?)`
- `getDatasetCategory(dataset, category, endpoint?)`

### Chapter Navigation Helpers

- `getNextChapter(chapter, endpoint?)` / `getPreviousChapter(chapter, endpoint?)` - accept any kind of chapter (translation, simplified translation, commentary, simplified commentary, or dataset) and return a chapter of the same kind, or `null` if there isn't one.
- `getFirstChapter(book, endpoint?)` / `getLastChapter(book, endpoint?)` - accept a translation, commentary, or dataset book.

### Chapter & Verse Helpers

- `formatReference(book, reference)` - formats a `VerseReference` as a string like `Genesis 1:1-3`.
- `getVerseText(verse)` - gets the plain text of a verse.
- `getChapterVerseText(chapter, omitVerseNumbers = false, omitReference = false)` - gets the plain text of a chapter.

### Word Annotations

Some translations include word-level annotations (Strong's numbers and related source data) for their chapters.

- `getChapterWords(chapter, endpoint?)` - gets the annotations for a chapter you already loaded, or `null` if it doesn't have any.
- `getWordText(verse, word)` - gets the text that a single annotation applies to.
- `getVerseWords(verse, words)` - gets the annotations for a verse, each paired with the text it applies to.

Each annotation is anchored to a range of characters in a single item of a verse's `content` list: `contentIndex` is the index of the item, and `start`/`end` are character offsets into that item's text (`end` is exclusive). `getWordText()` and `getVerseWords()` resolve those offsets for you.

### Simplified Chapters

Every translation and commentary chapter can also be fetched in a simplified format, where each verse's content is a single string instead of a list of formatted content. Footnotes, inline headings, the Words of Jesus, and poetry are represented as offset ranges into that string.

- `getSimpleTranslationBookChapter(translation, book, chapter, endpoint?)`
- `getSimpleCommentaryBookChapter(commentary, book, chapter, endpoint?)`
- `getSimpleCompleteTranslation(translation, endpoint?)`
- `getSimpleChapter(chapter, endpoint?)` - follows a chapter's `simpleChapterApiLink`, or returns `null` if simplified chapters aren't available for it.
- `getSimpleTranslationBookChapterWords(translation, book, chapter, endpoint?)` / `getSimpleChapterWords(chapter, endpoint?)` - the same as the regular word annotations, but with offsets into the simplified verse text.
- `getSimpleWordText(verse, word)` / `getSimpleVerseWords(verse, words)` - the same as `getWordText()`/`getVerseWords()`, but for simplified verses.
- `getSimpleChapterVerseText(chapter, omitVerseNumbers = false, omitReference = false)` - the same as `getChapterVerseText()`, but for a simplified chapter.

## Working With Chapter Content

Chapter content is modeled with sealed interfaces, so you can use `when` to handle each kind of content:

```kotlin
val chapter = api.getTranslationBookChapter("BSB", "PSA", 23)

for (content in chapter.chapter.content) {
    when (content) {
        is ChapterHeading -> println("## ${content.content.joinToString(" ")}")
        is ChapterVerse -> println("${content.number}: ${api.getVerseText(content)}")
        is ChapterHebrewSubtitle -> println("(${content.content.size} subtitle parts)")
        is ChapterLineBreak -> println()
        // Content types added in newer API versions decode as UnknownChapterContent.
        is UnknownChapterContent -> Unit
    }
}
```

The items in a verse's `content` are `VerseContent`s: `PlainText`, `FormattedText`, `InlineHeading`, `InlineLineBreak`, `VerseFootnoteReference`, or `UnknownVerseContent`. `ChapterLineBreak` and `InlineLineBreak` have a `paragraph` property with the source paragraph marker (such as `p` or `m`) when the break starts a new paragraph.

## Examples

### Read a dataset chapter

```kotlin
when (val chapter = api.getDatasetBookChapter("theographic", "GEN", 1)) {
    is ApiDatasetEntityBookChapter -> chapter.chapter.people.forEach { println(it.name) }
    is ApiDatasetBookChapter -> println("${chapter.numberOfReferences} references")
}
```

### Read the Strong's numbers for a chapter

```kotlin
val chapter = api.getTranslationBookChapter("engwebp", "JHN", 1)
val words = api.getChapterWords(chapter) ?: return // No word-level annotations.

for (verse in chapter.chapter.content.filterIsInstance<ChapterVerse>()) {
    for (word in api.getVerseWords(verse, words)) {
        println("${word.text} ${word.word.strongs}")
    }
}
```

## Error Handling

Requests that return a non-2xx status code throw a `FreeUseBibleApiException`, which includes the `url`, `statusCode`, and `statusMessage` of the response. Failed requests are not cached.

A 404 response usually means one of the path values is invalid, for example the translation, commentary, dataset, book, or chapter.

## Notes

- String enums in the API (such as `textDirection` and `language`) are represented as `String`s so that new values don't break existing apps.
- Unknown properties in responses are ignored, so newer versions of the API stay compatible with older versions of the library.
- `FreeUseBibleApi.json` is the `Json` instance used to parse responses, if you want to parse API files yourself.

<!-- #endregion docs -->

## Development

The response models in `src/main/kotlin/org/helloao/freeusebibleapi/Models.kt` are generated from the API's OpenAPI document. Don't edit them by hand. To regenerate them, run this from the repository root:

```bash
pnpm generate:kotlin
```

To build and test the library:

```bash
./gradlew build
```

The tests run against fixtures in `src/test/resources`, which were produced by the API generator in `packages/helloao-tools`. To check the models against a full build of the API files, set `FREE_USE_BIBLE_API_OUTPUT_DIR` to the directory that contains the generated `api` folder and run `./gradlew test`.

### Releasing

The library is published to Maven Central as `org.helloao:free-use-bible-api` by the [Release Kotlin SDK workflow](../../.github/workflows/release-kotlin-workflow.yml). To release a new version, bump `version` in `gradle.properties`, merge it, and publish a GitHub release (or run the workflow manually). The workflow skips publishing if that version is already on Maven Central.
