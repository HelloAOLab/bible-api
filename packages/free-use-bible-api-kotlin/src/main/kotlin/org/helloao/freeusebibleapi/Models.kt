// This file was generated from the Free Use Bible API OpenAPI document. Do not edit it by hand.
// To regenerate it, run: pnpm generate:kotlin

@file:OptIn(ExperimentalSerializationApi::class)

package org.helloao.freeusebibleapi

import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.KSerializer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.json.JsonClassDiscriminator
import kotlinx.serialization.json.JsonContentPolymorphicSerializer
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic

/**
 * A piece of plain text in a union of text and objects.
 *
 * Serialized as a plain JSON string.
 */
@Serializable(with = PlainTextSerializer::class)
public data class PlainText(
    /**
     * The text.
     */
    public val text: String,
) : VerseContent, HebrewSubtitleContent

internal object PlainTextSerializer : KSerializer<PlainText> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("org.helloao.freeusebibleapi.PlainText", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: PlainText): Unit = encoder.encodeString(value.text)

    override fun deserialize(decoder: Decoder): PlainText = PlainText(decoder.decodeString())
}

/**
 * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
 */
public typealias BookId = String

/**
 * The list of available translations. Maps to the /api/available-translations.json endpoint.
 */
@Serializable
public data class ApiAvailableTranslations(
    /**
     * The list of translations that are available in the API.
     */
    public val translations: List<ApiTranslation>,
)

/**
 * Defines a translation that is used in the API.
 */
@Serializable
public data class ApiTranslation(
    /**
     * The ID of the translation.
     */
    public val id: String,

    /**
     * The name of the translation.
     */
    public val name: String,

    /**
     * The website for the translation.
     */
    public val website: String,

    /**
     * The URL that the license for the translation can be found.
     */
    public val licenseUrl: String,

    /**
     * The API-added notes for the license.
     */
    public val licenseNotes: String? = null,

    /**
     * The notice that should be displayed when displaying content from the translation.
     */
    public val licenseNotice: String? = null,

    /**
     * The structured license terms that were detected for the translation, if any.
     */
    public val license: License? = null,

    /**
     * The short name for the translation.
     */
    public val shortName: String? = null,

    /**
     * The English name for the translation.
     */
    public val englishName: String,

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    public val language: String,

    /**
     * The direction that the language is written in. `ltr` indicates that the text is written from the left side of the page to the right. `rtl` indicates that the text is written from the right side of the page to the left.
     */
    public val textDirection: String,

    /**
     * The API link for the list of books for this translation. Relative to the API origin.
     */
    public val listOfBooksApiLink: String,

    public val availableFormats: List<String>,

    /**
     * The number of books that are contained in this translation. Complete translations should have the same number of books as the Bible (66).
     */
    public val numberOfBooks: Int,

    /**
     * The total number of chapters that are contained in this translation. Complete translations should have the same number of chapters as the Bible (1,189).
     */
    public val totalNumberOfChapters: Int,

    /**
     * The total number of verses that are contained in this translation. Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    public val totalNumberOfVerses: Int,

    /**
     * The total number of apocryphal books that are contained in this translation.
     */
    public val numberOfApocryphalBooks: Int? = null,

    /**
     * The total number of apocryphal chapters that are contained in this translation.
     */
    public val totalNumberOfApocryphalChapters: Int? = null,

    /**
     * The total number of apocryphal verses that are contained in this translation.
     */
    public val totalNumberOfApocryphalVerses: Int? = null,

    /**
     * Gets the name of the language that the translation is in. Null or undefined if the name of the language is not known.
     */
    public val languageName: String? = null,

    /**
     * Gets the name of the language in English. Null or undefined if the language doesn't have an english name.
     */
    public val languageEnglishName: String? = null,

    /**
     * The API link for downloading the complete translation as a single JSON file. Relative to the API origin. Undefined if complete translation files are not available.
     */
    public val completeTranslationApiLink: String? = null,

    /**
     * The API link for downloading the complete translation as a single JSON file, using the simplified chapter format. Relative to the API origin. Undefined if complete translation files are not available.
     */
    public val simpleCompleteTranslationApiLink: String? = null,
)

/**
 * Defines the structured license terms that were detected for a translation.
 */
@Serializable
public data class License(
    /**
     * Whether attribution to the original source is required when using the translation.
     */
    public val attribution: String,

    /**
     * Whether commercial use of the translation is allowed.
     */
    public val commercialUse: String,

    /**
     * Whether creating and distributing derivative works of the translation is allowed.
     */
    public val derivatives: String,

    /**
     * Whether derivative works must be distributed under the same license (i.e. a "share-alike" requirement).
     */
    public val copyleft: Boolean,

    /**
     * Whether the translation has been dedicated to the public domain.
     */
    public val publicDomain: Boolean,
)

/**
 * Defines an interface that contains information about the books that are available for a translation.
 */
@Serializable
public data class ApiTranslationBooks(
    /**
     * The translation information for the books.
     */
    public val translation: ApiTranslation,

    /**
     * The list of books that are available for the translation.
     */
    public val books: List<ApiTranslationBook>,
)

/**
 * Defines a schema that contains information about a translation book.
 */
@Serializable
public data class ApiTranslationBook(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val id: BookId,

    /**
     * The name that the translation provided for the book.
     */
    public val name: String,

    /**
     * The common name for the book.
     */
    public val commonName: String,

    /**
     * The short name (abbreviation) that the translation provided for the book. If not available, then one was not provided by the translation.
     */
    public val shortName: String? = null,

    /**
     * The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.
     */
    public val title: String? = null,

    /**
     * The numerical order of the book in the translation.
     */
    public val order: Int,

    /**
     * Whether the book is an apocryphal book.
     */
    public val isApocryphal: Boolean? = null,

    /**
     * The number of the first chapter in the book.
     */
    public val firstChapterNumber: Int,

    /**
     * The link to the first chapter of the book.
     */
    public val firstChapterApiLink: String,

    /**
     * Defines a reference to a chapter in a translation.
     */
    public val firstChapterReference: TranslationChapterReference,

    /**
     * The number of the last chapter in the book.
     */
    public val lastChapterNumber: Int,

    /**
     * The link to the last chapter of the book.
     */
    public val lastChapterApiLink: String,

    /**
     * Defines a reference to a chapter in a translation.
     */
    public val lastChapterReference: TranslationChapterReference,

    /**
     * The number of chapters that the book contains.
     */
    public val numberOfChapters: Int,

    /**
     * The number of verses that the book contains.
     */
    public val totalNumberOfVerses: Int,
)

/**
 * Defines a reference to a chapter in a translation.
 */
@Serializable
public data class TranslationChapterReference(
    /**
     * The ID of the translation that the chapter reference is for.
     */
    public val translationId: String,

    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val book: BookId,

    /**
     * The chapter number of the chapter reference.
     */
    public val chapter: Int,
)

/**
 * Defines an interface that contains information about a book chapter in a translation.
 */
@Serializable
public data class ApiTranslationBookChapter(
    /**
     * The information for the chapter.
     */
    public val chapter: ChapterData,

    /**
     * The links to different audio versions for the chapter.
     */
    public val thisChapterAudioLinks: TranslationBookChapterAudioLinks,

    /**
     * The links to the audio timings for different audio versions for the chapter. Relative to the API origin.
     */
    public val thisChapterAudioTimings: Map<String, String>,

    /**
     * The translation information for the book chapter.
     */
    public val translation: ApiTranslation,

    /**
     * The book information for the book chapter.
     */
    public val book: ApiTranslationBook,

    /**
     * The API link for this chapter. Relative to the API origin.
     */
    public val thisChapterLink: String,

    /**
     * Defines a reference to a chapter in a translation.
     */
    public val thisChapterReference: TranslationChapterReference,

    /**
     * The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
     */
    public val nextChapterApiLink: String? = null,

    /**
     * The reference for the next chapter. Null if this is the last chapter in the translation.
     */
    public val nextChapterReference: TranslationChapterReference? = null,

    /**
     * The links to the audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
     */
    public val nextChapterAudioLinks: Map<String, String>? = null,

    /**
     * The links to the audio timings for different audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
     */
    public val nextChapterAudioTimings: Map<String, String>? = null,

    /**
     * The links to the audio timings for different audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
     */
    public val previousChapterAudioTimings: Map<String, String>? = null,

    /**
     * The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
     */
    public val previousChapterApiLink: String? = null,

    /**
     * The reference for the previous chapter. Null if this is the first chapter in the translation.
     */
    public val previousChapterReference: TranslationChapterReference? = null,

    /**
     * The links to the audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
     */
    public val previousChapterAudioLinks: Map<String, String>? = null,

    /**
     * The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
     */
    public val thisChapterWordsLink: String? = null,

    /**
     * The link to the word-level annotations for the next chapter. Relative to the API origin. Omitted if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
     */
    public val nextChapterWordsLink: String? = null,

    /**
     * The link to the word-level annotations for the previous chapter. Relative to the API origin. Omitted if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
     */
    public val previousChapterWordsLink: String? = null,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The API link to the simplified version of this chapter. Relative to the API origin. Omitted if simplified chapters are not available.
     */
    public val simpleChapterApiLink: String? = null,
)

/**
 * Defines a union type that represents a single piece of chapter content. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.
 */
@Serializable
@JsonClassDiscriminator("type")
public sealed interface ChapterContent

/**
 * A ChapterContent that this version of the SDK does not recognize.
 * The original JSON is kept in [raw].
 */
@Serializable(with = UnknownChapterContentSerializer::class)
public data class UnknownChapterContent(public val raw: JsonElement) : ChapterContent

/**
 * Reads and writes [UnknownChapterContent] as its raw JSON.
 */
internal object UnknownChapterContentSerializer : KSerializer<UnknownChapterContent> {
    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor
    override fun deserialize(decoder: Decoder): UnknownChapterContent {
        return UnknownChapterContent(decoder.decodeSerializableValue(JsonElement.serializer()))
    }
    override fun serialize(encoder: Encoder, value: UnknownChapterContent) {
        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)
    }
}

/**
 * Defines the schema for a heading in a chapter.
 */
@Serializable
@SerialName("heading")
public data class ChapterHeading(
    /**
     * The content for the heading. If multiple strings are included in the array, they should be concatenated with a space.
     */
    public val content: List<String>,
) : ChapterContent

/**
 * Defines the schema for a line break in a chapter.
 */
@Serializable
@SerialName("line_break")
public data class ChapterLineBreak(
    /**
     * The source paragraph marker (without its backslash) when the line break starts a new paragraph, for example `p`, `m`, `pi1` or `mi`. Omitted for plain line breaks.
     */
    public val paragraph: String? = null,
) : ChapterContent, SimpleChapterContent

/**
 * Defines the schema for a verse in a chapter.
 */
@Serializable
@SerialName("verse")
public data class ChapterVerse(
    /**
     * The number of the verse.
     */
    public val number: Int,

    /**
     * The list of content for the verse. Each element in the list could be a string, formatted text, or a footnote reference.
     */
    public val content: List<VerseContent>,
) : ChapterContent

/**
 * Defines the schema for formatted text. That is, text that is formatted in a particular manner.
 */
@Serializable
public data class FormattedText(
    /**
     * The text that is formatted.
     */
    public val text: String,

    /**
     * Whether the text represents a poem. The number indicates the level of indent. Common in Psalms.
     */
    public val poem: Int? = null,

    /**
     * Whether the text represents the Words of Jesus.
     */
    public val wordsOfJesus: Boolean? = null,
) : VerseContent, HebrewSubtitleContent

/**
 * Defines the schema for a heading that is embedded in a verse.
 */
@Serializable
public data class InlineHeading(
    /**
     * The text of the heading.
     */
    public val heading: String,
) : VerseContent

/**
 * Defines the schema for a line break that is embedded in a verse.
 */
@Serializable
public data class InlineLineBreak(
    public val lineBreak: Boolean = true,

    /**
     * The source paragraph marker (without its backslash) when the line break starts a new paragraph, for example `p`, `m`, `pi1` or `mi`. Omitted for plain line breaks.
     */
    public val paragraph: String? = null,
) : VerseContent

/**
 * Defines the schema for a footnote reference in a verse or a Hebrew Subtitle.
 */
@Serializable
public data class VerseFootnoteReference(
    /**
     * The ID of the note.
     */
    public val noteId: Int,
) : VerseContent, HebrewSubtitleContent

/**
 * Defines the schema for a Hebrew Subtitle in a chapter.
 */
@Serializable
@SerialName("hebrew_subtitle")
public data class ChapterHebrewSubtitle(
    /**
     * The content that is contained in the subtitle. Each element in the list could be a string, formatted text, or a footnote reference.
     */
    public val content: List<HebrewSubtitleContent>,
) : ChapterContent

/**
 * Defines the schema for information about a footnote.
 */
@Serializable
public data class ChapterFootnote(
    /**
     * The ID of the note that is referenced.
     */
    public val noteId: Int,

    /**
     * The text of the footnote.
     */
    public val text: String,

    /**
     * The verse reference for the footnote. Undefined if the footnote isn't associated with a specific verse.
     */
    public val reference: ChapterFootnoteReference? = null,

    /**
     * The caller that should be used for the footnote. For footnotes, a "caller" is the character that is used in the text to reference to footnote. For example, in the text: Hello (a) World ---- (a) This is a footnote. The "(a)" is the caller. If "+", then the caller should be autogenerated. If null, then the caller should be empty. If a string, then the caller should be that string.
     */
    public val caller: String? = null,
)

/**
 * Defines the schema for the audio links for a book chapter.
 */
public typealias TranslationBookChapterAudioLinks = Map<String, String>

/**
 * Defines an interface that contains information about a book chapter in a translation, using the simplified chapter format.
 */
@Serializable
public data class ApiSimpleTranslationBookChapter(
    /**
     * The links to different audio versions for the chapter.
     */
    public val thisChapterAudioLinks: TranslationBookChapterAudioLinks,

    /**
     * The links to the audio timings for different audio versions for the chapter. Relative to the API origin.
     */
    public val thisChapterAudioTimings: Map<String, String>,

    /**
     * The translation information for the book chapter.
     */
    public val translation: ApiTranslation,

    /**
     * The book information for the book chapter.
     */
    public val book: ApiTranslationBook,

    /**
     * The API link for this chapter. Relative to the API origin.
     */
    public val thisChapterLink: String,

    /**
     * Defines a reference to a chapter in a translation.
     */
    public val thisChapterReference: TranslationChapterReference,

    /**
     * The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
     */
    public val nextChapterApiLink: String? = null,

    /**
     * The reference for the next chapter. Null if this is the last chapter in the translation.
     */
    public val nextChapterReference: TranslationChapterReference? = null,

    /**
     * The links to the audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
     */
    public val nextChapterAudioLinks: Map<String, String>? = null,

    /**
     * The links to the audio timings for different audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
     */
    public val nextChapterAudioTimings: Map<String, String>? = null,

    /**
     * The links to the audio timings for different audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
     */
    public val previousChapterAudioTimings: Map<String, String>? = null,

    /**
     * The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
     */
    public val previousChapterApiLink: String? = null,

    /**
     * The reference for the previous chapter. Null if this is the first chapter in the translation.
     */
    public val previousChapterReference: TranslationChapterReference? = null,

    /**
     * The links to the audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
     */
    public val previousChapterAudioLinks: Map<String, String>? = null,

    /**
     * The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
     */
    public val thisChapterWordsLink: String? = null,

    /**
     * The link to the word-level annotations for the next chapter. Relative to the API origin. Omitted if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
     */
    public val nextChapterWordsLink: String? = null,

    /**
     * The link to the word-level annotations for the previous chapter. Relative to the API origin. Omitted if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
     */
    public val previousChapterWordsLink: String? = null,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The simplified information for the chapter. Each verse contains a single text string, and the footnotes and formatting are represented by offsets into that string.
     */
    public val chapter: SimpleChapterData,

    /**
     * The API link to the regular (non-simplified) version of this chapter. Relative to the API origin.
     */
    public val fullChapterApiLink: String,
)

/**
 * Defines the schema for the data in a simplified chapter. Unlike the regular chapter format, each verse contains a single text string and the footnotes/formatting are represented by offsets into that string.
 */
@Serializable
public data class SimpleChapterData(
    /**
     * The number of the chapter.
     */
    public val number: Int,

    /**
     * The content of the chapter.
     */
    public val content: List<SimpleChapterContent>,

    /**
     * The list of footnotes that could not be associated with a verse. Footnotes that belong to a verse are included on the verse itself, so this list is usually empty.
     */
    public val footnotes: List<ChapterFootnote>,
)

/**
 * Defines a union type that represents a single piece of content in a simplified chapter. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.
 */
@Serializable
@JsonClassDiscriminator("type")
public sealed interface SimpleChapterContent

/**
 * A SimpleChapterContent that this version of the SDK does not recognize.
 * The original JSON is kept in [raw].
 */
@Serializable(with = UnknownSimpleChapterContentSerializer::class)
public data class UnknownSimpleChapterContent(public val raw: JsonElement) : SimpleChapterContent

/**
 * Reads and writes [UnknownSimpleChapterContent] as its raw JSON.
 */
internal object UnknownSimpleChapterContentSerializer : KSerializer<UnknownSimpleChapterContent> {
    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor
    override fun deserialize(decoder: Decoder): UnknownSimpleChapterContent {
        return UnknownSimpleChapterContent(decoder.decodeSerializableValue(JsonElement.serializer()))
    }
    override fun serialize(encoder: Encoder, value: UnknownSimpleChapterContent) {
        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)
    }
}

/**
 * Defines the schema for a heading in a simplified chapter.
 */
@Serializable
@SerialName("heading")
public data class SimpleChapterHeading(
    /**
     * The text of the heading.
     */
    public val text: String,
) : SimpleChapterContent

/**
 * Defines the schema for a verse in a simplified chapter.
 */
@Serializable
@SerialName("verse")
public data class SimpleChapterVerse(
    /**
     * The number of the verse.
     */
    public val number: Int,

    /**
     * The text of the verse. Lines of poetry and line breaks are separated by newline (\n) characters.
     */
    public val text: String,

    /**
     * The footnotes that occur in the verse.
     */
    public val footnotes: List<SimpleVerseFootnote>,

    /**
     * The headings that occur in the middle of the verse. Omitted if the verse contains no inline headings.
     */
    public val headings: List<SimpleInlineHeading>? = null,

    /**
     * The positions and source styles of paragraphs that start inside the verse.
     */
    public val paragraphs: List<SimpleVerseParagraph>? = null,

    /**
     * The ranges of the verse text that represent the Words of Jesus. Omitted if the verse contains none.
     */
    public val wordsOfJesus: List<SimpleTextRange>? = null,

    /**
     * The ranges of the verse text that represent lines of poetry. Omitted if the verse contains none.
     */
    public val poem: List<SimplePoemRange>? = null,
) : SimpleChapterContent

/**
 * Defines the schema for a footnote in a simplified verse. Unlike the footnotes in the regular chapter format, simplified footnotes include the position that they occur at in the verse text.
 */
@Serializable
public data class SimpleVerseFootnote(
    /**
     * The ID of the note.
     */
    public val noteId: Int,

    /**
     * The index in the verse text that the footnote caller should be inserted at. Measured in UTF-16 code units.
     */
    public val offset: Int,

    /**
     * The text of the footnote.
     */
    public val text: String,

    /**
     * The caller that should be used for the footnote. If "+", then the caller should be autogenerated. If null, then the caller should be empty. If a string, then the caller should be that string.
     */
    public val caller: String? = null,
)

/**
 * Defines the schema for a heading that is embedded in a simplified verse.
 */
@Serializable
public data class SimpleInlineHeading(
    /**
     * The index in the verse text that the heading occurs at. Measured in UTF-16 code units.
     */
    public val offset: Int,

    /**
     * The text of the heading.
     */
    public val text: String,
)

/**
 * A paragraph start in the text of a simplified verse.
 */
@Serializable
public data class SimpleVerseParagraph(
    /**
     * The index in the verse text, measured in UTF-16 code units.
     */
    public val offset: Int,

    /**
     * The source paragraph marker without its backslash.
     */
    public val style: String,
)

/**
 * Defines the schema for a range of text inside a simplified verse. Ranges are expressed as offsets into the text of the verse that contains them, measured in UTF-16 code units.
 */
@Serializable
public data class SimpleTextRange(
    /**
     * The index of the first character of the range in the verse text. Measured in UTF-16 code units.
     */
    public val start: Int,

    /**
     * The index after the last character of the range in the verse text. Measured in UTF-16 code units.
     */
    public val end: Int,
)

/**
 * Defines the schema for a range of text inside a simplified verse that represents a line of poetry.
 */
@Serializable
public data class SimplePoemRange(
    /**
     * The index of the first character of the range in the verse text. Measured in UTF-16 code units.
     */
    public val start: Int,

    /**
     * The index after the last character of the range in the verse text. Measured in UTF-16 code units.
     */
    public val end: Int,

    /**
     * The level of indent that the line of poetry should be displayed with.
     */
    public val level: Int,
)

/**
 * Defines the schema for a Hebrew Subtitle in a simplified chapter.
 */
@Serializable
@SerialName("hebrew_subtitle")
public data class SimpleChapterHebrewSubtitle(
    /**
     * The text of the verse. Lines of poetry and line breaks are separated by newline (\n) characters.
     */
    public val text: String,

    /**
     * The footnotes that occur in the verse.
     */
    public val footnotes: List<SimpleVerseFootnote>,

    /**
     * The headings that occur in the middle of the verse. Omitted if the verse contains no inline headings.
     */
    public val headings: List<SimpleInlineHeading>? = null,

    /**
     * The positions and source styles of paragraphs that start inside the verse.
     */
    public val paragraphs: List<SimpleVerseParagraph>? = null,

    /**
     * The ranges of the verse text that represent the Words of Jesus. Omitted if the verse contains none.
     */
    public val wordsOfJesus: List<SimpleTextRange>? = null,

    /**
     * The ranges of the verse text that represent lines of poetry. Omitted if the verse contains none.
     */
    public val poem: List<SimplePoemRange>? = null,
) : SimpleChapterContent

/**
 * Defines an interface that contains the audio timings for a book chapter, for a specific reader.
 */
@Serializable
public data class ApiTranslationBookChapterAudioTimings(
    /**
     * The ID of the translation.
     */
    public val translationId: String,

    /**
     * The ID of the book.
     */
    public val bookId: String,

    /**
     * The number of the chapter.
     */
    public val chapterNumber: Int,

    /**
     * The reader for the chapter.
     */
    public val reader: String,

    /**
     * The link to the audio for these timings.
     */
    public val audioLink: String,

    /**
     * The link to the information for this chapter.
     */
    public val thisChapterLink: String,

    /**
     * The link to the information for the next chapter. Null if this is the last chapter in the translation.
     */
    public val nextChapterLink: String? = null,

    /**
     * The link to the information for the previous chapter. Null if this is the first chapter in the translation.
     */
    public val previousChapterLink: String? = null,

    /**
     * The link to this audio timings file.
     */
    public val thisChapterAudioTimingsLink: String,

    /**
     * The link to the timings for the next chapter. Null if this is the last chapter in the translation.
     */
    public val nextChapterAudioTimingsLink: String? = null,

    /**
     * The link to the timings for the previous chapter. Null if this is the first chapter in the translation.
     */
    public val previousChapterAudioTimingsLink: String? = null,

    /**
     * The times in seconds at which each verse starts, in order. The first number (index 0) is the time in the recording at which the first verse starts.
     */
    public val verses: List<Double>,
)

/**
 * Defines an interface that contains the word-level annotations for a book chapter.
 */
@Serializable
public data class ApiTranslationBookChapterWords(
    /**
     * The ID of the translation.
     */
    public val translationId: String,

    /**
     * The ID of the book.
     */
    public val bookId: String,

    /**
     * The number of the chapter.
     */
    public val chapterNumber: Int,

    /**
     * The link to the information for this chapter.
     */
    public val thisChapterLink: String,

    /**
     * The link to the information for the next chapter. Null if this is the last chapter in the translation.
     */
    public val nextChapterLink: String? = null,

    /**
     * The link to the information for the previous chapter. Null if this is the first chapter in the translation.
     */
    public val previousChapterLink: String? = null,

    /**
     * The link to this words file.
     */
    public val thisChapterWordsLink: String,

    /**
     * The link to the words for the next chapter. Null if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
     */
    public val nextChapterWordsLink: String? = null,

    /**
     * The link to the words for the previous chapter. Null if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
     */
    public val previousChapterWordsLink: String? = null,

    /**
     * The annotated words for each verse in the chapter, keyed by verse number. Each list is in the order that the words occur in the verse.
     */
    public val verses: Map<String, List<ChapterWord>>,
)

/**
 * Defines the schema for a word-level annotation in a chapter. The annotation is anchored to a range of characters in a single item of a verse's content.
 */
@Serializable
public data class ChapterWord(
    /**
     * The index of the item in the verse's content array that the annotation applies to.
     */
    public val contentIndex: Int,

    /**
     * The index of the first character of the annotated word in the content item's text.
     */
    public val start: Int,

    /**
     * The index after the last character of the annotated word in the content item's text. That is, text.slice(start, end) is the annotated word.
     */
    public val end: Int,

    /**
     * The Strong's number(s) for the word. Omitted if the translation only provided other annotations for the word.
     */
    public val strongs: List<String>? = null,

    /**
     * The dictionary (citation) form of the word. Omitted if the translation did not provide one.
     */
    public val lemma: String? = null,

    /**
     * The morphology parse code for the word. Omitted if the translation did not provide one.
     */
    public val morph: String? = null,

    /**
     * The pointer to the word in the source text, in the <sourceName>:<location> format. Omitted if the translation did not provide one.
     */
    public val srcloc: String? = null,

    /**
     * Which occurrence of the source word this word is. 1-based. Omitted if the translation did not provide one.
     */
    public val occurrence: Int? = null,

    /**
     * The total number of times that the source word occurs. Omitted if the translation did not provide one.
     */
    public val occurrences: Int? = null,
)

/**
 * Defines an interface that contains the word-level annotations for a book chapter, with their offsets remapped onto the text of each simplified verse.
 */
@Serializable
public data class ApiSimpleTranslationBookChapterWords(
    /**
     * The ID of the translation.
     */
    public val translationId: String,

    /**
     * The ID of the book.
     */
    public val bookId: String,

    /**
     * The number of the chapter.
     */
    public val chapterNumber: Int,

    /**
     * The link to the information for this chapter.
     */
    public val thisChapterLink: String,

    /**
     * The link to the information for the next chapter. Null if this is the last chapter in the translation.
     */
    public val nextChapterLink: String? = null,

    /**
     * The link to the information for the previous chapter. Null if this is the first chapter in the translation.
     */
    public val previousChapterLink: String? = null,

    /**
     * The link to this words file.
     */
    public val thisChapterWordsLink: String,

    /**
     * The link to the words for the next chapter. Null if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
     */
    public val nextChapterWordsLink: String? = null,

    /**
     * The link to the words for the previous chapter. Null if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
     */
    public val previousChapterWordsLink: String? = null,

    /**
     * The annotated words for each verse in the chapter, keyed by verse number. Each list is in the order that the words occur in the verse. The offsets are into the text of the simplified verse.
     */
    public val verses: Map<String, List<SimpleChapterWord>>,
)

/**
 * Defines the schema for a word-level annotation in a simplified chapter. The annotation is anchored to a range of characters in the verse's text.
 */
@Serializable
public data class SimpleChapterWord(
    /**
     * The index of the first character of the annotated word in the content item's text.
     */
    public val start: Int,

    /**
     * The index after the last character of the annotated word in the content item's text. That is, text.slice(start, end) is the annotated word.
     */
    public val end: Int,

    /**
     * The Strong's number(s) for the word. Omitted if the translation only provided other annotations for the word.
     */
    public val strongs: List<String>? = null,

    /**
     * The dictionary (citation) form of the word. Omitted if the translation did not provide one.
     */
    public val lemma: String? = null,

    /**
     * The morphology parse code for the word. Omitted if the translation did not provide one.
     */
    public val morph: String? = null,

    /**
     * The pointer to the word in the source text, in the <sourceName>:<location> format. Omitted if the translation did not provide one.
     */
    public val srcloc: String? = null,

    /**
     * Which occurrence of the source word this word is. 1-based. Omitted if the translation did not provide one.
     */
    public val occurrence: Int? = null,

    /**
     * The total number of times that the source word occurs. Omitted if the translation did not provide one.
     */
    public val occurrences: Int? = null,
)

/**
 * Defines the complete translation download data. Maps to the /api/:translationId/complete.json endpoint.
 */
@Serializable
public data class ApiTranslationComplete(
    /**
     * The translation metadata.
     */
    public val translation: ApiTranslation,

    /**
     * The complete list of books with all their chapters.
     */
    public val books: List<ApiTranslationCompleteBook>,
)

/**
 * A book in the complete translation download.
 */
@Serializable
public data class ApiTranslationCompleteBook(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val id: BookId,

    /**
     * The name that the translation provided for the book.
     */
    public val name: String,

    /**
     * The common name for the book.
     */
    public val commonName: String,

    /**
     * The short name (abbreviation) that the translation provided for the book. If not available, then one was not provided by the translation.
     */
    public val shortName: String? = null,

    /**
     * The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.
     */
    public val title: String? = null,

    /**
     * The numerical order of the book in the translation.
     */
    public val order: Int,

    /**
     * Whether the book is an apocryphal book.
     */
    public val isApocryphal: Boolean? = null,

    /**
     * The number of chapters in the book.
     */
    public val numberOfChapters: Int,

    /**
     * The total number of verses in the book.
     */
    public val totalNumberOfVerses: Int,

    /**
     * The complete list of chapters with all content.
     */
    public val chapters: List<TranslationCompleteChapter>,
)

/**
 * A chapter in the complete translation download.
 */
@Serializable
public data class TranslationCompleteChapter(
    /**
     * The information for the chapter.
     */
    public val chapter: ChapterData,

    /**
     * The links to different audio versions for the chapter.
     */
    public val thisChapterAudioLinks: TranslationBookChapterAudioLinks,

    /**
     * The audio timings (per-verse start times, in seconds) for different audio versions for the chapter.
     */
    public val thisChapterAudioTimings: TranslationBookChapterAudioTimings,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
     */
    public val thisChapterWordsLink: String? = null,
)

/**
 * Defines the schema for the audio timings for a book chapter. Maps a reader ID to the list of times (in seconds) that each verse starts, in verse order.
 */
public typealias TranslationBookChapterAudioTimings = Map<String, List<Double>>

/**
 * Defines the complete translation download data, using the simplified chapter format. Maps to the /api/:translationId/complete.simple.json endpoint.
 */
@Serializable
public data class ApiSimpleTranslationComplete(
    /**
     * The translation metadata.
     */
    public val translation: ApiTranslation,

    /**
     * The complete list of books with all their chapters.
     */
    public val books: List<ApiSimpleTranslationCompleteBook>,
)

/**
 * A book in the complete translation download, using the simplified chapter format.
 */
@Serializable
public data class ApiSimpleTranslationCompleteBook(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val id: BookId,

    /**
     * The name that the translation provided for the book.
     */
    public val name: String,

    /**
     * The common name for the book.
     */
    public val commonName: String,

    /**
     * The short name (abbreviation) that the translation provided for the book. If not available, then one was not provided by the translation.
     */
    public val shortName: String? = null,

    /**
     * The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.
     */
    public val title: String? = null,

    /**
     * The numerical order of the book in the translation.
     */
    public val order: Int,

    /**
     * Whether the book is an apocryphal book.
     */
    public val isApocryphal: Boolean? = null,

    /**
     * The number of chapters in the book.
     */
    public val numberOfChapters: Int,

    /**
     * The total number of verses in the book.
     */
    public val totalNumberOfVerses: Int,

    /**
     * The complete list of chapters with all content.
     */
    public val chapters: List<SimpleTranslationCompleteChapter>,
)

/**
 * A chapter in the complete translation download, using the simplified chapter format.
 */
@Serializable
public data class SimpleTranslationCompleteChapter(
    /**
     * The simplified information for the chapter.
     */
    public val chapter: SimpleChapterData,

    /**
     * The links to different audio versions for the chapter.
     */
    public val thisChapterAudioLinks: TranslationBookChapterAudioLinks,

    /**
     * The audio timings (per-verse start times, in seconds) for different audio versions for the chapter.
     */
    public val thisChapterAudioTimings: TranslationBookChapterAudioTimings,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
     */
    public val thisChapterWordsLink: String? = null,
)

/**
 * The list of available commentaries. Maps to the /api/available-commentaries.json endpoint.
 */
@Serializable
public data class ApiAvailableCommentaries(
    /**
     * The list of commentaries that are available in the API.
     */
    public val commentaries: List<ApiCommentary>,
)

/**
 * Defines a commentary that is used in the API.
 */
@Serializable
public data class ApiCommentary(
    /**
     * The ID of the commentary.
     */
    public val id: String,

    /**
     * The name of the commentary.
     */
    public val name: String,

    /**
     * The website for the commentary.
     */
    public val website: String,

    /**
     * The URL that the license for the commentary can be found.
     */
    public val licenseUrl: String,

    /**
     * The API-added notes for the license.
     */
    public val licenseNotes: String? = null,

    /**
     * The English name for the commentary.
     */
    public val englishName: String,

    /**
     * The ISO 639 3-letter language tag that the translation is primarily in.
     */
    public val language: String,

    /**
     * The direction that the language is written in. `ltr` indicates that the text is written from the left side of the page to the right. `rtl` indicates that the text is written from the right side of the page to the left.
     */
    public val textDirection: String,

    /**
     * The API link for the list of books for this commentary. Relative to the API origin.
     */
    public val listOfBooksApiLink: String,

    /**
     * The API link for the list of profiles for this commentary. Relative to the API origin.
     */
    public val listOfProfilesApiLink: String,

    public val availableFormats: List<String>,

    /**
     * The number of books that are contained in this commentary. Complete commentaries should have the same number of books as the Bible (66).
     */
    public val numberOfBooks: Int,

    /**
     * The total number of chapters that are contained in this commentary. Complete commentaries should have the same number of chapters as the Bible (1,189).
     */
    public val totalNumberOfChapters: Int,

    /**
     * The total number of verses that are contained in this commentary. Complete commentaries should have the same number of verses as the Bible (around 31,102 - some commentaries exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    public val totalNumberOfVerses: Int,

    /**
     * The total number of profiles that are contained in this commentary. Profiles are used to provide additional information about people and people groups that are mentioned in the Bible.
     */
    public val totalNumberOfProfiles: Int,

    /**
     * Gets the name of the language that the commentary is in. Null or undefined if the name of the language is not known.
     */
    public val languageName: String? = null,

    /**
     * Gets the name of the language in English. Null or undefined if the language doesn't have an english name.
     */
    public val languageEnglishName: String? = null,
)

/**
 * Defines an interface that contains information about the books that are available for a commentary.
 */
@Serializable
public data class ApiCommentaryBooks(
    /**
     * The commentary information for the books.
     */
    public val commentary: ApiCommentary,

    /**
     * The list of books that are available for the commentary.
     */
    public val books: List<ApiCommentaryBook>,
)

/**
 * Defines a schema that contains information about a commentary book.
 */
@Serializable
public data class ApiCommentaryBook(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val id: BookId,

    /**
     * The name that the commentary provided for the book.
     */
    public val name: String,

    /**
     * The common name for the book.
     */
    public val commonName: String,

    /**
     * The commentary's introduction for the book. Undefined if the commentary didn't provide an introduction for the book.
     */
    public val introduction: String? = null,

    /**
     * The summary of the commentary's introduction for the book. Undefined if the commentary didn't provide a summary for the book.
     */
    public val introductionSummary: String? = null,

    /**
     * The order of the book in the Bible.
     */
    public val order: Int,

    /**
     * The number of the first chapter in the book. Null if the comentary book has no chapters.
     */
    public val firstChapterNumber: Int? = null,

    /**
     * The link to the first chapter of the book. Null if the comentary book has no chapters.
     */
    public val firstChapterApiLink: String? = null,

    /**
     * The reference for the first chapter in the book. Null if the comentary book has no chapters.
     */
    public val firstChapterReference: CommentaryChapterReference? = null,

    /**
     * The number of the last chapter in the book. Null if the comentary book has no chapters.
     */
    public val lastChapterNumber: Int? = null,

    /**
     * The link to the last chapter of the book. Null if the comentary book has no chapters.
     */
    public val lastChapterApiLink: String? = null,

    /**
     * The reference for the last chapter in the book. Null if the comentary book has no chapters.
     */
    public val lastChapterReference: CommentaryChapterReference? = null,

    /**
     * The number of chapters that the book contains.
     */
    public val numberOfChapters: Int,

    /**
     * The number of verses that the book contains.
     */
    public val totalNumberOfVerses: Int,
)

/**
 * Defines a reference to a chapter in a commentary.
 */
@Serializable
public data class CommentaryChapterReference(
    /**
     * The ID of the commentary that the chapter reference is for.
     */
    public val commentaryId: String,

    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val book: BookId,

    /**
     * The chapter number of the chapter reference.
     */
    public val chapter: Int,
)

/**
 * Defines a schema that contains information about a book chapter in a commentary.
 */
@Serializable
public data class ApiCommentaryBookChapter(
    /**
     * The information for the chapter.
     */
    public val chapter: CommentaryChapterData,

    /**
     * The commentary information for the book chapter.
     */
    public val commentary: ApiCommentary,

    /**
     * The book information for the book chapter.
     */
    public val book: ApiCommentaryBook,

    /**
     * The API link for this chapter. Relative to the API origin.
     */
    public val thisChapterLink: String,

    /**
     * Defines a reference to a chapter in a commentary.
     */
    public val thisChapterReference: CommentaryChapterReference,

    /**
     * The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the commentary.
     */
    public val nextChapterApiLink: String? = null,

    /**
     * The reference for the next chapter. Null if this is the last chapter in the commentary.
     */
    public val nextChapterReference: CommentaryChapterReference? = null,

    /**
     * The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the commentary.
     */
    public val previousChapterApiLink: String? = null,

    /**
     * The reference for the previous chapter. Null if this is the first chapter in the commentary.
     */
    public val previousChapterReference: CommentaryChapterReference? = null,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The API link to the simplified version of this chapter. Relative to the API origin. Omitted if simplified chapters are not available.
     */
    public val simpleChapterApiLink: String? = null,
)

/**
 * Defines a schema that contains information about a book chapter in a commentary, using the simplified chapter format.
 */
@Serializable
public data class ApiSimpleCommentaryBookChapter(
    /**
     * The commentary information for the book chapter.
     */
    public val commentary: ApiCommentary,

    /**
     * The book information for the book chapter.
     */
    public val book: ApiCommentaryBook,

    /**
     * The API link for this chapter. Relative to the API origin.
     */
    public val thisChapterLink: String,

    /**
     * Defines a reference to a chapter in a commentary.
     */
    public val thisChapterReference: CommentaryChapterReference,

    /**
     * The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the commentary.
     */
    public val nextChapterApiLink: String? = null,

    /**
     * The reference for the next chapter. Null if this is the last chapter in the commentary.
     */
    public val nextChapterReference: CommentaryChapterReference? = null,

    /**
     * The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the commentary.
     */
    public val previousChapterApiLink: String? = null,

    /**
     * The reference for the previous chapter. Null if this is the first chapter in the commentary.
     */
    public val previousChapterReference: CommentaryChapterReference? = null,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The simplified information for the chapter. Each verse contains a single text string, and the footnotes and formatting are represented by offsets into that string.
     */
    public val chapter: SimpleCommentaryChapterData,

    /**
     * The API link to the regular (non-simplified) version of this chapter. Relative to the API origin.
     */
    public val fullChapterApiLink: String,
)

/**
 * Defines the schema for the data in a simplified commentary chapter.
 */
@Serializable
public data class SimpleCommentaryChapterData(
    /**
     * The number of the chapter.
     */
    public val number: Int,

    /**
     * The introduction that the commentary provided to the chapter. Not all commentaries provide an introduction to a chapter.
     */
    public val introduction: String? = null,

    /**
     * The content of the chapter.
     */
    public val content: List<SimpleChapterVerse>,
)

/**
 * The list of available datasets. Maps to the /api/available-datasets.json endpoint.
 */
@Serializable
public data class ApiAvailableDatasets(
    /**
     * The list of datasets that are available in the API.
     */
    public val datasets: List<ApiDataset>,
)

/**
 * Defines a dataset that is used in the API.
 */
@Serializable
public data class ApiDataset(
    /**
     * The ID of the dataset.
     */
    public val id: String,

    /**
     * The name of the dataset.
     */
    public val name: String,

    /**
     * The website for the dataset.
     */
    public val website: String,

    /**
     * The URL that the license for the dataset can be found.
     */
    public val licenseUrl: String,

    /**
     * The API-added notes for the license.
     */
    public val licenseNotes: String? = null,

    /**
     * The English name for the dataset.
     */
    public val englishName: String,

    /**
     * The ISO 639 3-letter language tag that the dataset is primarily in.
     */
    public val language: String,

    /**
     * The direction that the language is written in.
     */
    public val textDirection: String,

    /**
     * The API link for the list of books for this dataset. Relative to the API origin.
     */
    public val listOfBooksApiLink: String,

    public val availableFormats: List<String>,

    /**
     * The number of books that are contained in this dataset.
     */
    public val numberOfBooks: Int,

    /**
     * The total number of chapters that are contained in this dataset.
     */
    public val totalNumberOfChapters: Int,

    /**
     * The total number of verses that are contained in this dataset.
     */
    public val totalNumberOfVerses: Int,

    /**
     * The total number of references that are contained in this dataset.
     */
    public val totalNumberOfReferences: Int,

    /**
     * The total number of interlinear words that are contained in this dataset. Omitted if the dataset doesn't contain interlinear words.
     */
    public val totalNumberOfWords: Int? = null,

    /**
     * Gets the name of the language that the dataset is in. Null or undefined if the name of the language is not known.
     */
    public val languageName: String? = null,

    /**
     * Gets the name of the language in English. Null or undefined if the language doesn't have an english name.
     */
    public val languageEnglishName: String? = null,

    /**
     * The API link for the list of people for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain people.
     */
    public val listOfPeopleApiLink: String? = null,

    /**
     * The API link for the list of places for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain places.
     */
    public val listOfPlacesApiLink: String? = null,

    /**
     * The API link for the list of events for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain events.
     */
    public val listOfEventsApiLink: String? = null,

    /**
     * The API link for the list of people groups for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain people groups.
     */
    public val listOfPeopleGroupsApiLink: String? = null,

    /**
     * The API link for the list of lexicon entries for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain lexicon entries.
     */
    public val listOfLexiconApiLink: String? = null,

    /**
     * The API link for the list of verse categories for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain verse categories.
     */
    public val listOfCategoriesApiLink: String? = null,

    /**
     * The total number of people that are contained in this dataset. Omitted if the dataset doesn't contain people.
     */
    public val totalNumberOfPeople: Int? = null,

    /**
     * The total number of places that are contained in this dataset. Omitted if the dataset doesn't contain places.
     */
    public val totalNumberOfPlaces: Int? = null,

    /**
     * The total number of events that are contained in this dataset. Omitted if the dataset doesn't contain events.
     */
    public val totalNumberOfEvents: Int? = null,

    /**
     * The total number of people groups that are contained in this dataset. Omitted if the dataset doesn't contain people groups.
     */
    public val totalNumberOfPeopleGroups: Int? = null,

    /**
     * The total number of lexicon entries that are contained in this dataset. Omitted if the dataset doesn't contain lexicon entries.
     */
    public val totalNumberOfLexicon: Int? = null,

    /**
     * The total number of verse categories that are contained in this dataset. Omitted if the dataset doesn't contain verse categories.
     */
    public val totalNumberOfCategories: Int? = null,
)

/**
 * Defines an interface that contains information about the books that are available for a dataset.
 */
@Serializable
public data class ApiDatasetBooks(
    /**
     * The dataset information for the books.
     */
    public val dataset: ApiDataset,

    /**
     * The list of books that are available for the dataset.
     */
    public val books: List<ApiDatasetBook>,
)

/**
 * Defines a schema that contains information about a book in a dataset.
 */
@Serializable
public data class ApiDatasetBook(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val id: BookId,

    /**
     * The order of the book in the Bible.
     */
    public val order: Int,

    /**
     * The number of the first chapter in the book.
     */
    public val firstChapterNumber: Int,

    /**
     * The link to the first chapter of the book.
     */
    public val firstChapterApiLink: String,

    /**
     * Defines a reference to a chapter in a dataset.
     */
    public val firstChapterReference: DatasetChapterReference,

    /**
     * The number of the last chapter in the book.
     */
    public val lastChapterNumber: Int,

    /**
     * The link to the last chapter of the book.
     */
    public val lastChapterApiLink: String,

    /**
     * Defines a reference to a chapter in a dataset.
     */
    public val lastChapterReference: DatasetChapterReference,

    /**
     * The number of chapters that the book contains.
     */
    public val numberOfChapters: Int,

    /**
     * The number of verses that the book contains.
     */
    public val totalNumberOfVerses: Int,

    /**
     * The number of references that the book contains.
     */
    public val totalNumberOfReferences: Int,
)

/**
 * Defines a reference to a chapter in a dataset.
 */
@Serializable
public data class DatasetChapterReference(
    /**
     * The ID of the dataset that the chapter reference is for.
     */
    public val datasetId: String,

    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val book: BookId,

    /**
     * The chapter number of the chapter reference.
     */
    public val chapter: Int,
)

/**
 * Defines a schema that contains information about a book chapter in a dataset.
 */
@Serializable
public data class ApiDatasetBookChapter(
    /**
     * The data for the chapter.
     */
    public val chapter: DatasetChapterData,

    /**
     * The dataset information for the book chapter.
     */
    public val dataset: ApiDataset,

    /**
     * The book information for the book chapter.
     */
    public val book: ApiDatasetBook,

    /**
     * The API link for this chapter. Relative to the API origin.
     */
    public val thisChapterLink: String,

    /**
     * Defines a reference to a chapter in a dataset.
     */
    public val thisChapterReference: DatasetChapterReference,

    /**
     * The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the dataset.
     */
    public val nextChapterApiLink: String? = null,

    /**
     * The reference for the next chapter. Null if this is the last chapter in the dataset.
     */
    public val nextChapterReference: DatasetChapterReference? = null,

    /**
     * The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the dataset.
     */
    public val previousChapterApiLink: String? = null,

    /**
     * The reference for the previous chapter. Null if this is the first chapter in the dataset.
     */
    public val previousChapterReference: DatasetChapterReference? = null,

    /**
     * The number of verses that the chapter contains.
     */
    public val numberOfVerses: Int,

    /**
     * The number of references that the chapter contains.
     */
    public val numberOfReferences: Int,
) : ApiDatasetBookChapterResult

/**
 * Defines the schema for information about a chapter in a dataset.
 */
@Serializable
public data class DatasetChapterData(
    /**
     * The number of the chapter.
     */
    public val number: Int,

    /**
     * The content of the chapter.
     */
    public val content: List<DatasetChapterVerseContent>,
)

/**
 * Defines the schema for information about a verse in a dataset chapter. A verse carries `references` (cross references), `words` (interlinear words), or `categories` (verse of the day candidates), depending on the dataset.
 */
@Serializable(with = DatasetChapterVerseContentSerializer::class)
public sealed interface DatasetChapterVerseContent

internal object DatasetChapterVerseContentSerializer : JsonContentPolymorphicSerializer<DatasetChapterVerseContent>(DatasetChapterVerseContent::class) {
    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<DatasetChapterVerseContent> = when {
        element is JsonObject && "references" in element -> DatasetChapterVerseReferences.serializer()
        element is JsonObject && "words" in element -> DatasetChapterVerseWords.serializer()
        element is JsonObject && "categories" in element -> DatasetChapterVerseCategories.serializer()
        else -> UnknownDatasetChapterVerseContent.serializer()
    }
}

/**
 * A DatasetChapterVerseContent that this version of the SDK does not recognize.
 * The original JSON is kept in [raw].
 */
@Serializable(with = UnknownDatasetChapterVerseContentSerializer::class)
public data class UnknownDatasetChapterVerseContent(public val raw: JsonElement) : DatasetChapterVerseContent

/**
 * Reads and writes [UnknownDatasetChapterVerseContent] as its raw JSON.
 */
internal object UnknownDatasetChapterVerseContentSerializer : KSerializer<UnknownDatasetChapterVerseContent> {
    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor
    override fun deserialize(decoder: Decoder): UnknownDatasetChapterVerseContent {
        return UnknownDatasetChapterVerseContent(decoder.decodeSerializableValue(JsonElement.serializer()))
    }
    override fun serialize(encoder: Encoder, value: UnknownDatasetChapterVerseContent) {
        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)
    }
}

/**
 * Defines the schema for a verse in a dataset chapter that lists references to other verses.
 */
@Serializable
public data class DatasetChapterVerseReferences(
    /**
     * The number of the verse.
     */
    public val verse: Int,

    /**
     * The list of references for the verse.
     */
    public val references: List<ScoredVerseRef>,
) : DatasetChapterVerseContent

/**
 * Defines the schema for information about a verse reference that has an arbitrary score attached to it.
 */
@Serializable
public data class ScoredVerseRef(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val book: BookId,

    /**
     * The chapter number that the reference starts at.
     */
    public val chapter: Int,

    /**
     * The verse number that the reference starts at.
     */
    public val verse: Int,

    /**
     * The rest of the content of the verse reference. This is the part of the string that comes after the verse reference. For example, in "GEN 1:1 In the beginning, God created the Heavens and the Earth.", the content would be "In the beginning, God created the Heavens and the Earth."
     */
    public val content: String? = null,

    /**
     * The chapter that the verse reference ends at. This is used for references that span multiple chapters, such as "GEN 1:1-2:3". In this case, the endChapter would be 2.
     */
    public val endChapter: Int? = null,

    /**
     * The verse that the verse reference ends at. This is used for references that span multiple verses, such as "GEN 1:1-1:3". In this case, the endVerse would be 3.
     */
    public val endVerse: Int? = null,

    /**
     * The score for the verse reference. The meaning of the score is arbitrary and is determined by the dataset.
     */
    public val score: Double,
)

/**
 * Defines the schema for a verse in a dataset chapter that lists its original-language words.
 */
@Serializable
public data class DatasetChapterVerseWords(
    /**
     * The number of the verse.
     */
    public val verse: Int,

    /**
     * The original-language words of the verse, in original-text order.
     */
    public val words: List<DatasetInterlinearWord>,
) : DatasetChapterVerseContent

/**
 * Defines the schema for an original-language word in an interlinear dataset verse.
 */
@Serializable
public data class DatasetInterlinearWord(
    /**
     * The 1-based rank of the word in the original text's order.
     */
    public val pos: Int,

    /**
     * The 1-based rank of the word in the Berean Standard Bible's English order.
     */
    public val bsbPos: Int,

    /**
     * The language of the word.
     */
    public val language: String,

    /**
     * The word in the original script. NFC-normalized.
     */
    public val text: String,

    /**
     * The transliteration of the word.
     */
    public val transliteration: String? = null,

    /**
     * The short grammatical parsing code of the word.
     */
    public val parsing: String? = null,

    /**
     * The spelled-out grammatical parsing of the word.
     */
    public val parsingFull: String? = null,

    /**
     * The zero-padded Strong's number of the word, such as `H0430` or `G3056`. Matches the KJV's `.words.json` values. Other translations' values may need zero-padding and suffix stripping before joining. Null when the source gives the word no Strong's number.
     */
    public val strongs: String? = null,

    /**
     * The Berean Standard Bible's English phrase for the word. Null when the BSB leaves the word untranslated.
     */
    public val gloss: String? = null,
)

/**
 * Defines the schema for a verse (or short passage) in a dataset chapter that lists the categories it belongs to.
 */
@Serializable
public data class DatasetChapterVerseCategories(
    /**
     * The number of the verse. If `endVerse` is present, then this is the verse that the passage starts at.
     */
    public val verse: Int,

    /**
     * The verse that the passage ends at. Omitted if the entry is a single verse.
     */
    public val endVerse: Int? = null,

    /**
     * The IDs of the categories that the verse belongs to, most relevant first. Each ID matches a category in the `categories` collection of the dataset (`/api/d/{dataset}/categories/{id}.json`).
     */
    public val categories: List<String>,
) : DatasetChapterVerseContent

/**
 * The entities (people, places, and events) that appear in a chapter of a book for a dataset. Maps to the /api/d/:datasetId/:bookId/:chapterNumber.json endpoint for datasets that contain entities.
 */
@Serializable
public data class ApiDatasetEntityBookChapter(
    /**
     * The dataset information for the book chapter.
     */
    public val dataset: ApiDataset,

    /**
     * The book information for the book chapter.
     */
    public val book: ApiDatasetBook,

    /**
     * The entity data for the chapter.
     */
    public val chapter: ApiDatasetEntityChapterData,

    /**
     * The link to this chapter. Relative to the API origin.
     */
    public val thisChapterLink: String,

    /**
     * The reference for this chapter.
     */
    public val thisChapterReference: DatasetChapterReference,

    /**
     * The link to the next chapter. Relative to the API origin. Null if this is the last chapter in the dataset.
     */
    public val nextChapterApiLink: String? = null,

    /**
     * The reference for the next chapter. Null if this is the last chapter in the dataset.
     */
    public val nextChapterReference: DatasetChapterReference? = null,

    /**
     * The link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the dataset.
     */
    public val previousChapterApiLink: String? = null,

    /**
     * The reference for the previous chapter. Null if this is the first chapter in the dataset.
     */
    public val previousChapterReference: DatasetChapterReference? = null,

    /**
     * The number of people that appear in the chapter.
     */
    public val numberOfPeople: Int,

    /**
     * The number of places that appear in the chapter.
     */
    public val numberOfPlaces: Int,

    /**
     * The number of events that appear in the chapter.
     */
    public val numberOfEvents: Int,
) : ApiDatasetBookChapterResult

/**
 * Defines a person that appears in a chapter of a dataset.
 */
@Serializable
public data class ApiDatasetChapterPerson(
    /**
     * The ID of the person.
     */
    public val id: String,

    /**
     * The name of the person.
     */
    public val name: String,

    /**
     * Whether the name of the person is a proper name.
     */
    public val isProperName: Boolean? = null,

    /**
     * The gender of the person.
     */
    public val gender: String? = null,

    /**
     * The year that the person was born. Negative numbers are years BC. Positive numbers are years AD.
     */
    public val birthYear: Int? = null,

    /**
     * The year that the person died. Negative numbers are years BC. Positive numbers are years AD.
     */
    public val deathYear: Int? = null,

    /**
     * The API link for the person. Relative to the API origin.
     */
    public val apiLink: String,

    /**
     * The numbers of the verses in the chapter that mention the person. Sorted in ascending order.
     */
    public val verses: List<Int>,
)

/**
 * Defines a place that appears in a chapter of a dataset.
 */
@Serializable
public data class ApiDatasetChapterPlace(
    /**
     * The ID of the place.
     */
    public val id: String,

    /**
     * The name of the place.
     */
    public val name: String,

    /**
     * The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.
     */
    public val featureType: String? = null,

    /**
     * The latitude of the place.
     */
    public val latitude: Double? = null,

    /**
     * The longitude of the place.
     */
    public val longitude: Double? = null,

    /**
     * The API link for the place. Relative to the API origin.
     */
    public val apiLink: String,

    /**
     * The numbers of the verses in the chapter that mention the place. Sorted in ascending order.
     */
    public val verses: List<Int>,
)

/**
 * Defines an event that appears in a chapter of a dataset.
 */
@Serializable
public data class ApiDatasetChapterEvent(
    /**
     * The ID of the event.
     */
    public val id: String,

    /**
     * The name of the event.
     */
    public val name: String,

    /**
     * The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.
     */
    public val startDate: String? = null,

    /**
     * The API link for the event. Relative to the API origin.
     */
    public val apiLink: String,

    /**
     * The numbers of the verses in the chapter that describe the event. Sorted in ascending order.
     */
    public val verses: List<Int>,
)

/**
 * Defines the entity data for a chapter in a dataset. Contains the people, places, and events that appear in the chapter.
 */
@Serializable
public data class ApiDatasetEntityChapterData(
    /**
     * The number of the chapter.
     */
    public val number: Int,

    /**
     * The people that appear in the chapter. Sorted by the first verse that they appear in.
     */
    public val people: List<ApiDatasetChapterPerson>,

    /**
     * The places that appear in the chapter. Sorted by the first verse that they appear in.
     */
    public val places: List<ApiDatasetChapterPlace>,

    /**
     * The events that appear in the chapter. Sorted by the first verse that they appear in.
     */
    public val events: List<ApiDatasetChapterEvent>,
)

/**
 * The list of people in a dataset. Maps to the /api/d/:datasetId/people.json endpoint.
 */
@Serializable
public data class ApiDatasetPeople(
    /**
     * The dataset information for the people.
     */
    public val dataset: ApiDataset,

    /**
     * The list of people that are available for the dataset.
     */
    public val people: List<ApiDatasetPersonSummary>,
)

/**
 * Defines a summary of a person in a dataset.
 */
@Serializable
public data class ApiDatasetPersonSummary(
    /**
     * The ID of the person.
     */
    public val id: String,

    /**
     * The name of the person.
     */
    public val name: String,

    /**
     * Whether the name of the person is a proper name.
     */
    public val isProperName: Boolean? = null,

    /**
     * The gender of the person.
     */
    public val gender: String? = null,

    /**
     * The number of Bible references that mention the person.
     */
    public val numberOfReferences: Int,

    /**
     * The API link for the person. Relative to the API origin.
     */
    public val thisPersonApiLink: String,
)

/**
 * The information about a person in a dataset. Maps to the /api/d/:datasetId/people/:personId.json endpoint.
 */
@Serializable
public data class ApiDatasetPerson(
    /**
     * The dataset information for the person.
     */
    public val dataset: ApiDataset,

    /**
     * The information about the person.
     */
    public val person: DatasetPerson,

    /**
     * The API link for this person. Relative to the API origin.
     */
    public val thisPersonApiLink: String,
)

/**
 * Defines the schema for a reference to another entity (person, place, event, or people group) in a dataset.
 */
@Serializable
public data class DatasetEntityRef(
    /**
     * The ID of the entity that is being referenced.
     */
    public val id: String,

    /**
     * The type of the entity that is being referenced. Matches the collection segment of the entity's API link, so the link can be constructed as `/api/d/{dataset}/{type}/{id}.json`.
     */
    public val type: DatasetEntityType,

    /**
     * The name of the entity that is being referenced.
     */
    public val name: String? = null,

    /**
     * The API link for the entity that is being referenced. Relative to the API origin. Only present in API responses.
     */
    public val apiLink: String? = null,
)

/**
 * The type of an entity in a dataset. Matches the collection segment of the entity API paths, so the API link for an entity can be constructed as `/api/d/{dataset}/{type}/{id}.json`.
 */
public typealias DatasetEntityType = String

/**
 * Defines a schema for verse references. A verse reference is a string that contains a book ID, chapter number, and verse number, such as "GEN 1:1". It can also contain an optional content part that comes after the verse reference, such as "GEN 1:1 In the beginning, God created the Heavens and the Earth." It can also contain optional endChapter and endVerse fields for references that span multiple chapters or verses, such as "GEN 1:1-2:3".
 */
@Serializable
public data class VerseRef(
    /**
     * IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
     */
    public val book: BookId,

    /**
     * The chapter number that the reference starts at.
     */
    public val chapter: Int,

    /**
     * The verse number that the reference starts at.
     */
    public val verse: Int,

    /**
     * The rest of the content of the verse reference. This is the part of the string that comes after the verse reference. For example, in "GEN 1:1 In the beginning, God created the Heavens and the Earth.", the content would be "In the beginning, God created the Heavens and the Earth."
     */
    public val content: String? = null,

    /**
     * The chapter that the verse reference ends at. This is used for references that span multiple chapters, such as "GEN 1:1-2:3". In this case, the endChapter would be 2.
     */
    public val endChapter: Int? = null,

    /**
     * The verse that the verse reference ends at. This is used for references that span multiple verses, such as "GEN 1:1-1:3". In this case, the endVerse would be 3.
     */
    public val endVerse: Int? = null,
)

/**
 * Defines the schema for information about a person in a dataset.
 */
@Serializable
public data class DatasetPerson(
    /**
     * The ID of the person.
     */
    public val id: String,

    /**
     * The name of the person.
     */
    public val name: String,

    /**
     * Other names that the person is called by.
     */
    public val alsoCalled: List<String>? = null,

    /**
     * Whether the name of the person is a proper name.
     */
    public val isProperName: Boolean? = null,

    /**
     * The gender of the person.
     */
    public val gender: String? = null,

    /**
     * The description of the person. Each string is a paragraph.
     */
    public val description: List<String>? = null,

    /**
     * The year that the person was born. Negative numbers are years BC. Positive numbers are years AD.
     */
    public val birthYear: Int? = null,

    /**
     * The year that the person died. Negative numbers are years BC. Positive numbers are years AD.
     */
    public val deathYear: Int? = null,

    /**
     * The earliest year that the person is mentioned in. Negative numbers are years BC. Positive numbers are years AD.
     */
    public val minYear: Int? = null,

    /**
     * The latest year that the person is mentioned in. Negative numbers are years BC. Positive numbers are years AD.
     */
    public val maxYear: Int? = null,

    /**
     * The place that the person was born in.
     */
    public val birthPlace: DatasetEntityRef? = null,

    /**
     * The place that the person died in.
     */
    public val deathPlace: DatasetEntityRef? = null,

    /**
     * The father(s) of the person.
     */
    public val father: List<DatasetEntityRef>? = null,

    /**
     * The mother(s) of the person.
     */
    public val mother: List<DatasetEntityRef>? = null,

    /**
     * The partners (spouses) of the person.
     */
    public val partners: List<DatasetEntityRef>? = null,

    /**
     * The children of the person.
     */
    public val children: List<DatasetEntityRef>? = null,

    /**
     * The siblings of the person.
     */
    public val siblings: List<DatasetEntityRef>? = null,

    /**
     * The half-siblings of the person that share the same mother.
     */
    public val halfSiblingsSameMother: List<DatasetEntityRef>? = null,

    /**
     * The half-siblings of the person that share the same father.
     */
    public val halfSiblingsSameFather: List<DatasetEntityRef>? = null,

    /**
     * The people groups that the person is a member of.
     */
    public val memberOf: List<DatasetEntityRef>? = null,

    /**
     * The events that the person participated in.
     */
    public val events: List<DatasetEntityRef>? = null,

    /**
     * The list of Bible references that mention the person. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
     */
    public val references: List<VerseRef>,
)

/**
 * The list of places in a dataset. Maps to the /api/d/:datasetId/places.json endpoint.
 */
@Serializable
public data class ApiDatasetPlaces(
    /**
     * The dataset information for the places.
     */
    public val dataset: ApiDataset,

    /**
     * The list of places that are available for the dataset.
     */
    public val places: List<ApiDatasetPlaceSummary>,
)

/**
 * Defines a summary of a place in a dataset.
 */
@Serializable
public data class ApiDatasetPlaceSummary(
    /**
     * The ID of the place.
     */
    public val id: String,

    /**
     * The name of the place.
     */
    public val name: String,

    /**
     * The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.
     */
    public val featureType: String? = null,

    /**
     * The latitude of the place.
     */
    public val latitude: Double? = null,

    /**
     * The longitude of the place.
     */
    public val longitude: Double? = null,

    /**
     * The number of Bible references that mention the place.
     */
    public val numberOfReferences: Int,

    /**
     * The API link for the place. Relative to the API origin.
     */
    public val thisPlaceApiLink: String,
)

/**
 * The information about a place in a dataset. Maps to the /api/d/:datasetId/places/:placeId.json endpoint.
 */
@Serializable
public data class ApiDatasetPlace(
    /**
     * The dataset information for the place.
     */
    public val dataset: ApiDataset,

    /**
     * The information about the place.
     */
    public val place: DatasetPlace,

    /**
     * The API link for this place. Relative to the API origin.
     */
    public val thisPlaceApiLink: String,
)

/**
 * Defines the schema for information about a place in a dataset.
 */
@Serializable
public data class DatasetPlace(
    /**
     * The ID of the place.
     */
    public val id: String,

    /**
     * The name of the place.
     */
    public val name: String,

    /**
     * The name of the place as it appears in the King James Version.
     */
    public val kjvName: String? = null,

    /**
     * The name of the place as it appears in the English Standard Version.
     */
    public val esvName: String? = null,

    /**
     * Other names that the place is called by.
     */
    public val aliases: List<String>? = null,

    /**
     * The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.
     */
    public val featureType: String? = null,

    /**
     * The sub-type of geographical feature that the place is.
     */
    public val featureSubType: String? = null,

    /**
     * The latitude of the place.
     */
    public val latitude: Double? = null,

    /**
     * The longitude of the place.
     */
    public val longitude: Double? = null,

    /**
     * How precise the latitude and longitude of the place are.
     */
    public val precision: String? = null,

    /**
     * The description of the place. Each string is a paragraph.
     */
    public val description: List<String>? = null,

    /**
     * The comment on the place from the dataset authors.
     */
    public val comment: String? = null,

    /**
     * The root place for this place. Different names for the same geographical location share the same root place.
     */
    public val rootPlace: DatasetEntityRef? = null,

    /**
     * The place that this place is a duplicate of.
     */
    public val duplicateOf: DatasetEntityRef? = null,

    /**
     * The people that have been at the place.
     */
    public val people: List<DatasetEntityRef>? = null,

    /**
     * The people that were born at the place.
     */
    public val peopleBorn: List<DatasetEntityRef>? = null,

    /**
     * The people that died at the place.
     */
    public val peopleDied: List<DatasetEntityRef>? = null,

    /**
     * The events that happened at the place.
     */
    public val events: List<DatasetEntityRef>? = null,

    /**
     * The list of Bible references that mention the place. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
     */
    public val references: List<VerseRef>,
)

/**
 * The list of events in a dataset. Maps to the /api/d/:datasetId/events.json endpoint.
 */
@Serializable
public data class ApiDatasetEvents(
    /**
     * The dataset information for the events.
     */
    public val dataset: ApiDataset,

    /**
     * The list of events that are available for the dataset.
     */
    public val events: List<ApiDatasetEventSummary>,
)

/**
 * Defines a summary of an event in a dataset.
 */
@Serializable
public data class ApiDatasetEventSummary(
    /**
     * The ID of the event.
     */
    public val id: String,

    /**
     * The name of the event.
     */
    public val name: String,

    /**
     * The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.
     */
    public val startDate: String? = null,

    /**
     * The number of Bible references that describe the event.
     */
    public val numberOfReferences: Int,

    /**
     * The API link for the event. Relative to the API origin.
     */
    public val thisEventApiLink: String,
)

/**
 * The information about an event in a dataset. Maps to the /api/d/:datasetId/events/:eventId.json endpoint.
 */
@Serializable
public data class ApiDatasetEvent(
    /**
     * The dataset information for the event.
     */
    public val dataset: ApiDataset,

    /**
     * The information about the event.
     */
    public val event: DatasetEvent,

    /**
     * The API link for this event. Relative to the API origin.
     */
    public val thisEventApiLink: String,
)

/**
 * Defines the schema for information about an event in a dataset.
 */
@Serializable
public data class DatasetEvent(
    /**
     * The ID of the event.
     */
    public val id: String,

    /**
     * The name of the event.
     */
    public val name: String,

    /**
     * The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.
     */
    public val startDate: String? = null,

    /**
     * The duration of the event. For example, "1D" is one day and "40Y" is fourty years.
     */
    public val duration: String? = null,

    /**
     * The people that participated in the event.
     */
    public val participants: List<DatasetEntityRef>? = null,

    /**
     * The places that the event happened at.
     */
    public val locations: List<DatasetEntityRef>? = null,

    /**
     * The people groups that participated in the event.
     */
    public val groups: List<DatasetEntityRef>? = null,

    /**
     * The event that this event is a part of.
     */
    public val partOf: DatasetEntityRef? = null,

    /**
     * The event that happened before this event.
     */
    public val predecessor: DatasetEntityRef? = null,

    /**
     * The list of Bible references that describe the event. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
     */
    public val references: List<VerseRef>,
)

/**
 * The list of people groups in a dataset. Maps to the /api/d/:datasetId/groups.json endpoint.
 */
@Serializable
public data class ApiDatasetPeopleGroups(
    /**
     * The dataset information for the people groups.
     */
    public val dataset: ApiDataset,

    /**
     * The list of people groups that are available for the dataset.
     */
    public val groups: List<ApiDatasetPeopleGroupSummary>,
)

/**
 * Defines a summary of a people group in a dataset.
 */
@Serializable
public data class ApiDatasetPeopleGroupSummary(
    /**
     * The ID of the people group.
     */
    public val id: String,

    /**
     * The name of the people group.
     */
    public val name: String,

    /**
     * The number of people that are members of the people group.
     */
    public val numberOfMembers: Int,

    /**
     * The API link for the people group. Relative to the API origin.
     */
    public val thisPeopleGroupApiLink: String,
)

/**
 * The information about a people group in a dataset. Maps to the /api/d/:datasetId/groups/:groupId.json endpoint.
 */
@Serializable
public data class ApiDatasetPeopleGroup(
    /**
     * The dataset information for the people group.
     */
    public val dataset: ApiDataset,

    /**
     * The information about the people group.
     */
    public val group: DatasetPeopleGroup,

    /**
     * The API link for this people group. Relative to the API origin.
     */
    public val thisPeopleGroupApiLink: String,
)

/**
 * Defines the schema for information about a people group in a dataset.
 */
@Serializable
public data class DatasetPeopleGroup(
    /**
     * The ID of the people group.
     */
    public val id: String,

    /**
     * The name of the people group.
     */
    public val name: String,

    /**
     * The people that are members of the people group.
     */
    public val members: List<DatasetEntityRef>? = null,

    /**
     * The events that the people group participated in.
     */
    public val events: List<DatasetEntityRef>? = null,

    /**
     * The list of Bible references that mention the people group. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
     */
    public val references: List<VerseRef>,
)

/**
 * The list of lexicon entries in a dataset. Maps to the /api/d/:datasetId/lexicon.json endpoint.
 */
@Serializable
public data class ApiDatasetLexicon(
    /**
     * The dataset information for the lexicon.
     */
    public val dataset: ApiDataset,

    /**
     * The list of lexicon entries that are available for the dataset.
     */
    public val lexicon: List<ApiDatasetLexiconEntrySummary>,
)

/**
 * Defines a summary of a lexicon entry in a dataset.
 */
@Serializable
public data class ApiDatasetLexiconEntrySummary(
    /**
     * The Strong's number of the lexicon entry.
     */
    public val id: String,

    /**
     * The language of the lexicon entry.
     */
    public val language: String,

    /**
     * The name of the lexicon entry. This is the lemma of the entry's first sense.
     */
    public val name: String,

    /**
     * The API link for the lexicon entry. Relative to the API origin.
     */
    public val apiLink: String,
)

/**
 * The information about a lexicon entry in a dataset. Maps to the /api/d/:datasetId/lexicon/:strongs.json endpoint.
 */
@Serializable
public data class ApiDatasetLexiconEntry(
    /**
     * The dataset information for the lexicon entry.
     */
    public val dataset: ApiDataset,

    /**
     * The lexicon entry.
     */
    public val entry: DatasetLexiconEntry,

    /**
     * The API link for this lexicon entry. Relative to the API origin.
     */
    public val thisLexiconEntryApiLink: String,
)

/**
 * Defines the schema for a sense of a lexicon entry in a dataset.
 */
@Serializable
public data class DatasetLexiconSense(
    /**
     * The extended ID of the sense, such as `H0001G`. Equal to the base Strong's number when the number has a single sense.
     */
    public val id: String,

    /**
     * The language of the sense.
     */
    public val language: String,

    /**
     * The lemma of the sense in the original script.
     */
    public val lemma: String,

    /**
     * The transliteration of the lemma.
     */
    public val transliteration: String? = null,

    /**
     * The part of speech (morphology) code of the sense.
     */
    public val partOfSpeech: String? = null,

    /**
     * The short English gloss of the sense.
     */
    public val gloss: String? = null,

    /**
     * The definition of the sense as plain text. Paragraphs are separated by blank lines.
     */
    public val definition: String,
)

/**
 * Defines the schema for a lexicon entry in a dataset. There is one entry per base Strong's number.
 */
@Serializable
public data class DatasetLexiconEntry(
    /**
     * The zero-padded Strong's number of the entry, such as `H0430` or `G3056`.
     */
    public val id: String,

    /**
     * The language of the entry. This is the language of the entry's first sense.
     */
    public val language: String,

    /**
     * The senses of the entry, in ID order.
     */
    public val senses: List<DatasetLexiconSense>,
)

/**
 * The list of verse categories in a dataset. Maps to the /api/d/:datasetId/categories.json endpoint.
 */
@Serializable
public data class ApiDatasetCategories(
    /**
     * The dataset information for the categories.
     */
    public val dataset: ApiDataset,

    /**
     * The list of verse categories that are available for the dataset.
     */
    public val categories: List<ApiDatasetCategorySummary>,
)

/**
 * Defines a summary of a verse category in a dataset.
 */
@Serializable
public data class ApiDatasetCategorySummary(
    /**
     * The ID of the category, such as `hope`.
     */
    public val id: String,

    /**
     * The English name of the category, such as `Hope`.
     */
    public val name: String,

    /**
     * The description of what the verses in the category are about.
     */
    public val description: String,

    /**
     * The number of verses (or short passages) that belong to the category.
     */
    public val numberOfVerses: Int,

    /**
     * The API link for the category. Relative to the API origin.
     */
    public val apiLink: String,
)

/**
 * The information about a verse category in a dataset. Maps to the /api/d/:datasetId/categories/:categoryId.json endpoint.
 */
@Serializable
public data class ApiDatasetCategory(
    /**
     * The dataset information for the category.
     */
    public val dataset: ApiDataset,

    /**
     * The category, with the verses that belong to it.
     */
    public val category: DatasetCategory,

    /**
     * The API link for this category. Relative to the API origin.
     */
    public val thisCategoryApiLink: String,
)

/**
 * Defines the schema for a category of verses in a dataset.
 */
@Serializable
public data class DatasetCategory(
    /**
     * The ID of the category, such as `hope`.
     */
    public val id: String,

    /**
     * The English name of the category, such as `Hope`.
     */
    public val name: String,

    /**
     * The description of what the verses in the category are about.
     */
    public val description: String,

    /**
     * The verses (or short passages) that belong to the category, in canonical order.
     */
    public val verses: List<VerseRef>,
)

/**
 * The content of a chapter of a dataset. Entity datasets (such as "theographic") return an ApiDatasetEntityBookChapter, while all other datasets return an ApiDatasetBookChapter.
 */
@Serializable(with = ApiDatasetBookChapterResultSerializer::class)
public sealed interface ApiDatasetBookChapterResult

internal object ApiDatasetBookChapterResultSerializer : JsonContentPolymorphicSerializer<ApiDatasetBookChapterResult>(ApiDatasetBookChapterResult::class) {
    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<ApiDatasetBookChapterResult> = when {
        element is JsonObject && "numberOfVerses" in element -> ApiDatasetBookChapter.serializer()
        element is JsonObject && "numberOfPeople" in element -> ApiDatasetEntityBookChapter.serializer()
        else -> UnknownApiDatasetBookChapterResult.serializer()
    }
}

/**
 * A ApiDatasetBookChapterResult that this version of the SDK does not recognize.
 * The original JSON is kept in [raw].
 */
@Serializable(with = UnknownApiDatasetBookChapterResultSerializer::class)
public data class UnknownApiDatasetBookChapterResult(public val raw: JsonElement) : ApiDatasetBookChapterResult

/**
 * Reads and writes [UnknownApiDatasetBookChapterResult] as its raw JSON.
 */
internal object UnknownApiDatasetBookChapterResultSerializer : KSerializer<UnknownApiDatasetBookChapterResult> {
    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor
    override fun deserialize(decoder: Decoder): UnknownApiDatasetBookChapterResult {
        return UnknownApiDatasetBookChapterResult(decoder.decodeSerializableValue(JsonElement.serializer()))
    }
    override fun serialize(encoder: Encoder, value: UnknownApiDatasetBookChapterResult) {
        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)
    }
}

/**
 * The information for the chapter.
 */
@Serializable
public data class ChapterData(
    /**
     * The number of the chapter.
     */
    public val number: Int,

    /**
     * The content of the chapter.
     */
    public val content: List<ChapterContent>,

    /**
     * The list of footnotes for the chapter.
     */
    public val footnotes: List<ChapterFootnote>,
)

@Serializable(with = VerseContentSerializer::class)
public sealed interface VerseContent

internal object VerseContentSerializer : JsonContentPolymorphicSerializer<VerseContent>(VerseContent::class) {
    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<VerseContent> = when {
        element is JsonPrimitive && element.isString -> PlainText.serializer()
        element is JsonObject && "text" in element -> FormattedText.serializer()
        element is JsonObject && "heading" in element -> InlineHeading.serializer()
        element is JsonObject && "lineBreak" in element -> InlineLineBreak.serializer()
        element is JsonObject && "noteId" in element -> VerseFootnoteReference.serializer()
        else -> UnknownVerseContent.serializer()
    }
}

/**
 * A VerseContent that this version of the SDK does not recognize.
 * The original JSON is kept in [raw].
 */
@Serializable(with = UnknownVerseContentSerializer::class)
public data class UnknownVerseContent(public val raw: JsonElement) : VerseContent

/**
 * Reads and writes [UnknownVerseContent] as its raw JSON.
 */
internal object UnknownVerseContentSerializer : KSerializer<UnknownVerseContent> {
    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor
    override fun deserialize(decoder: Decoder): UnknownVerseContent {
        return UnknownVerseContent(decoder.decodeSerializableValue(JsonElement.serializer()))
    }
    override fun serialize(encoder: Encoder, value: UnknownVerseContent) {
        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)
    }
}

@Serializable(with = HebrewSubtitleContentSerializer::class)
public sealed interface HebrewSubtitleContent

internal object HebrewSubtitleContentSerializer : JsonContentPolymorphicSerializer<HebrewSubtitleContent>(HebrewSubtitleContent::class) {
    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<HebrewSubtitleContent> = when {
        element is JsonPrimitive && element.isString -> PlainText.serializer()
        element is JsonObject && "text" in element -> FormattedText.serializer()
        element is JsonObject && "noteId" in element -> VerseFootnoteReference.serializer()
        else -> UnknownHebrewSubtitleContent.serializer()
    }
}

/**
 * A HebrewSubtitleContent that this version of the SDK does not recognize.
 * The original JSON is kept in [raw].
 */
@Serializable(with = UnknownHebrewSubtitleContentSerializer::class)
public data class UnknownHebrewSubtitleContent(public val raw: JsonElement) : HebrewSubtitleContent

/**
 * Reads and writes [UnknownHebrewSubtitleContent] as its raw JSON.
 */
internal object UnknownHebrewSubtitleContentSerializer : KSerializer<UnknownHebrewSubtitleContent> {
    override val descriptor: SerialDescriptor = JsonElement.serializer().descriptor
    override fun deserialize(decoder: Decoder): UnknownHebrewSubtitleContent {
        return UnknownHebrewSubtitleContent(decoder.decodeSerializableValue(JsonElement.serializer()))
    }
    override fun serialize(encoder: Encoder, value: UnknownHebrewSubtitleContent) {
        encoder.encodeSerializableValue(JsonElement.serializer(), value.raw)
    }
}

/**
 * The verse reference for the footnote. Undefined if the footnote isn't associated with a specific verse.
 */
@Serializable
public data class ChapterFootnoteReference(
    public val chapter: Int,

    public val verse: Int,
)

/**
 * The information for the chapter.
 */
@Serializable
public data class CommentaryChapterData(
    /**
     * The number of the chapter.
     */
    public val number: Int,

    /**
     * The introduction that the commentary provided to the chapter. Not all commentaries provide an introduction to a chapter.
     */
    public val introduction: String? = null,

    /**
     * The content of the chapter.
     */
    public val content: List<ChapterVerse>,
)

/**
 * Decodes unrecognized members of discriminated unions as their Unknown variants.
 */
internal val UnknownContentSerializersModule = SerializersModule {
    polymorphic(ChapterContent::class) { defaultDeserializer { UnknownChapterContent.serializer() } }
    polymorphic(SimpleChapterContent::class) { defaultDeserializer { UnknownSimpleChapterContent.serializer() } }
}
