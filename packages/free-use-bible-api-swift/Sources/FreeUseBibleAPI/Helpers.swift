import Foundation

/// A chapter response that links to the chapters before and after it.
public protocol ApiChapterResponse: Decodable, Sendable {
    /// The API link to the next chapter. `nil` if this is the last chapter.
    var nextChapterApiLink: String? { get }

    /// The API link to the previous chapter. `nil` if this is the first chapter.
    var previousChapterApiLink: String? { get }
}

extension ApiTranslationBookChapter: ApiChapterResponse {}
extension ApiSimpleTranslationBookChapter: ApiChapterResponse {}
extension ApiCommentaryBookChapter: ApiChapterResponse {}
extension ApiSimpleCommentaryBookChapter: ApiChapterResponse {}
extension ApiDatasetBookChapter: ApiChapterResponse {}
extension ApiDatasetEntityBookChapter: ApiChapterResponse {}

extension ApiDatasetBookChapterResponse: ApiChapterResponse {
    public var nextChapterApiLink: String? {
        switch self {
        case .datasetBookChapter(let chapter):
            return chapter.nextChapterApiLink
        case .datasetEntityBookChapter(let chapter):
            return chapter.nextChapterApiLink
        case .unknown:
            return nil
        }
    }

    public var previousChapterApiLink: String? {
        switch self {
        case .datasetBookChapter(let chapter):
            return chapter.previousChapterApiLink
        case .datasetEntityBookChapter(let chapter):
            return chapter.previousChapterApiLink
        case .unknown:
            return nil
        }
    }
}

/// A reference to a specific verse (or range of verses) in a Bible translation, commentary, or dataset.
public struct VerseReference: Hashable, Sendable {
    /// The chapter number of the reference.
    public var chapter: Int

    /// The verse number of the reference.
    ///
    /// If `nil`, then the reference refers to the entire chapter rather than a specific verse.
    public var verse: Int?

    /// The ending verse number of the reference, for references that span multiple verses.
    public var endVerse: Int?

    /// The ending chapter number of the reference, for references that span multiple chapters.
    public var endChapter: Int?

    public init(chapter: Int, verse: Int? = nil, endVerse: Int? = nil, endChapter: Int? = nil) {
        self.chapter = chapter
        self.verse = verse
        self.endVerse = endVerse
        self.endChapter = endChapter
    }
}

/// Options for the `getChapterVerseText` and `getSimpleChapterVerseText` methods.
public struct GetChapterTextOptions: Hashable, Sendable {
    /// Whether to omit verse numbers from the returned text.
    public var omitVerseNumbers: Bool

    /// Whether to omit the chapter reference from the returned text.
    public var omitReference: Bool

    public init(omitVerseNumbers: Bool = false, omitReference: Bool = false) {
        self.omitVerseNumbers = omitVerseNumbers
        self.omitReference = omitReference
    }
}

/// A word-level annotation, paired with the text of the verse that it covers.
public struct AnnotatedWord: Hashable, Sendable {
    /// The annotation.
    public var word: ChapterWord

    /// The text that the annotation applies to.
    public var text: String

    public init(word: ChapterWord, text: String) {
        self.word = word
        self.text = text
    }
}

/// A word-level annotation in a simplified chapter, paired with the text of the verse that it covers.
public struct SimpleAnnotatedWord: Hashable, Sendable {
    /// The annotation.
    public var word: SimpleChapterWord

    /// The text that the annotation applies to.
    public var text: String

    public init(word: SimpleChapterWord, text: String) {
        self.word = word
        self.text = text
    }
}

// MARK: - Navigation

extension FreeUseBibleAPI {
    /// Gets the next chapter for a given chapter, if available.
    /// - Parameters:
    ///   - chapter: The chapter to get the next chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The next chapter, or `nil` if there is no next chapter.
    public func getNextChapter<Chapter: ApiChapterResponse>(_ chapter: Chapter, endpoint: URL? = nil) async throws -> Chapter? {
        guard let link = chapter.nextChapterApiLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as Chapter
    }

    /// Gets the previous chapter for a given chapter, if available.
    /// - Parameters:
    ///   - chapter: The chapter to get the previous chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The previous chapter, or `nil` if there is no previous chapter.
    public func getPreviousChapter<Chapter: ApiChapterResponse>(_ chapter: Chapter, endpoint: URL? = nil) async throws -> Chapter? {
        guard let link = chapter.previousChapterApiLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as Chapter
    }

    /// Gets the first chapter of the given book.
    /// - Parameters:
    ///   - book: The book to get the first chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getFirstChapter(_ book: ApiTranslationBook, endpoint: URL? = nil) async throws -> ApiTranslationBookChapter {
        try await getJSON(book.firstChapterApiLink, endpoint: endpoint)
    }

    /// Gets the first chapter of the given book, if available.
    /// - Parameters:
    ///   - book: The book to get the first chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The first chapter, or `nil` if the commentary doesn't have any chapters for the book.
    public func getFirstChapter(_ book: ApiCommentaryBook, endpoint: URL? = nil) async throws -> ApiCommentaryBookChapter? {
        guard let link = book.firstChapterApiLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiCommentaryBookChapter
    }

    /// Gets the first chapter of the given book.
    /// - Parameters:
    ///   - book: The book to get the first chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getFirstChapter(_ book: ApiDatasetBook, endpoint: URL? = nil) async throws -> ApiDatasetBookChapterResponse {
        try await getJSON(book.firstChapterApiLink, endpoint: endpoint)
    }

    /// Gets the last chapter of the given book.
    /// - Parameters:
    ///   - book: The book to get the last chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getLastChapter(_ book: ApiTranslationBook, endpoint: URL? = nil) async throws -> ApiTranslationBookChapter {
        try await getJSON(book.lastChapterApiLink, endpoint: endpoint)
    }

    /// Gets the last chapter of the given book, if available.
    /// - Parameters:
    ///   - book: The book to get the last chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The last chapter, or `nil` if the commentary doesn't have any chapters for the book.
    public func getLastChapter(_ book: ApiCommentaryBook, endpoint: URL? = nil) async throws -> ApiCommentaryBookChapter? {
        guard let link = book.lastChapterApiLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiCommentaryBookChapter
    }

    /// Gets the last chapter of the given book.
    /// - Parameters:
    ///   - book: The book to get the last chapter for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getLastChapter(_ book: ApiDatasetBook, endpoint: URL? = nil) async throws -> ApiDatasetBookChapterResponse {
        try await getJSON(book.lastChapterApiLink, endpoint: endpoint)
    }

    /// Gets the simplified version of the given chapter, if available.
    /// - Parameters:
    ///   - chapter: The chapter to get the simplified version of.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The simplified chapter, or `nil` if simplified chapters aren't available for it.
    public func getSimpleChapter(_ chapter: ApiTranslationBookChapter, endpoint: URL? = nil) async throws -> ApiSimpleTranslationBookChapter? {
        guard let link = chapter.simpleChapterApiLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiSimpleTranslationBookChapter
    }

    /// Gets the simplified version of the given chapter, if available.
    /// - Parameters:
    ///   - chapter: The chapter to get the simplified version of.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The simplified chapter, or `nil` if simplified chapters aren't available for it.
    public func getSimpleChapter(_ chapter: ApiCommentaryBookChapter, endpoint: URL? = nil) async throws -> ApiSimpleCommentaryBookChapter? {
        guard let link = chapter.simpleChapterApiLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiSimpleCommentaryBookChapter
    }
}

// MARK: - Word annotations

extension FreeUseBibleAPI {
    /// Gets the word-level annotations for the given chapter, if it has any.
    /// - Parameters:
    ///   - chapter: The chapter to get the annotations for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The annotations for the chapter, or `nil` if the chapter doesn't have any.
    public func getChapterWords(_ chapter: ApiTranslationBookChapter, endpoint: URL? = nil) async throws -> ApiTranslationBookChapterWords? {
        guard let link = chapter.thisChapterWordsLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiTranslationBookChapterWords
    }

    /// Gets the word-level annotations for the given chapter of a complete translation download, if it has any.
    /// - Parameters:
    ///   - chapter: The chapter to get the annotations for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The annotations for the chapter, or `nil` if the chapter doesn't have any.
    public func getChapterWords(_ chapter: TranslationCompleteChapter, endpoint: URL? = nil) async throws -> ApiTranslationBookChapterWords? {
        guard let link = chapter.thisChapterWordsLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiTranslationBookChapterWords
    }

    /// Gets the word-level annotations for the given simplified chapter, if it has any.
    /// - Parameters:
    ///   - chapter: The simplified chapter to get the annotations for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The annotations for the chapter, or `nil` if the chapter doesn't have any.
    public func getSimpleChapterWords(_ chapter: ApiSimpleTranslationBookChapter, endpoint: URL? = nil) async throws -> ApiSimpleTranslationBookChapterWords? {
        guard let link = chapter.thisChapterWordsLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiSimpleTranslationBookChapterWords
    }

    /// Gets the word-level annotations for the given chapter of a simplified complete translation download, if it has any.
    /// - Parameters:
    ///   - chapter: The chapter to get the annotations for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The annotations for the chapter, or `nil` if the chapter doesn't have any.
    public func getSimpleChapterWords(_ chapter: SimpleTranslationCompleteChapter, endpoint: URL? = nil) async throws -> ApiSimpleTranslationBookChapterWords? {
        guard let link = chapter.thisChapterWordsLink else {
            return nil
        }
        return try await getJSON(link, endpoint: endpoint) as ApiSimpleTranslationBookChapterWords
    }

    /// Gets the text that the given word-level annotation applies to.
    ///
    /// Annotations are anchored to a range of characters in a single item of the verse's content,
    /// so that the ranges stay correct for verses whose content is split into multiple items,
    /// such as poem lines and the words of Jesus.
    /// - Parameters:
    ///   - verse: The verse that the annotation is in.
    ///   - word: The annotation to get the text for.
    /// - Returns: The annotated text, or an empty string if the annotation doesn't point at any text.
    public func getWordText(_ verse: ChapterVerse, _ word: ChapterWord) -> String {
        guard verse.content.indices.contains(word.contentIndex) else {
            return ""
        }

        switch verse.content[word.contentIndex] {
        case .text(let text):
            return sliceUTF16(text, word.start, word.end)
        case .formattedText(let formatted):
            return sliceUTF16(formatted.text, word.start, word.end)
        default:
            // Line breaks, inline headings, and footnote references have no text of their own.
            return ""
        }
    }

    /// Gets the word-level annotations for the given verse, paired with the text that each one applies to.
    /// - Parameters:
    ///   - verse: The verse to get the annotations for.
    ///   - words: The annotations for the chapter that the verse is in.
    /// - Returns: The annotations for the verse, in the order that they occur. Empty if the verse has no annotations.
    public func getVerseWords(_ verse: ChapterVerse, _ words: ApiTranslationBookChapterWords) -> [AnnotatedWord] {
        let verseWords = words.verses[String(verse.number)] ?? []
        return verseWords.map { AnnotatedWord(word: $0, text: getWordText(verse, $0)) }
    }

    /// Gets the text that the given simplified word-level annotation applies to.
    /// - Parameters:
    ///   - verse: The simplified verse that the annotation is in.
    ///   - word: The annotation to get the text for.
    /// - Returns: The annotated text.
    public func getSimpleWordText(_ verse: SimpleChapterVerse, _ word: SimpleChapterWord) -> String {
        sliceUTF16(verse.text, word.start, word.end)
    }

    /// Gets the word-level annotations for the given simplified verse, paired with the text that each one applies to.
    /// - Parameters:
    ///   - verse: The simplified verse to get the annotations for.
    ///   - words: The simplified annotations for the chapter that the verse is in.
    /// - Returns: The annotations for the verse, in the order that they occur. Empty if the verse has no annotations.
    public func getSimpleVerseWords(_ verse: SimpleChapterVerse, _ words: ApiSimpleTranslationBookChapterWords) -> [SimpleAnnotatedWord] {
        let verseWords = words.verses[String(verse.number)] ?? []
        return verseWords.map { SimpleAnnotatedWord(word: $0, text: getSimpleWordText(verse, $0)) }
    }
}

// MARK: - Text

extension FreeUseBibleAPI {
    /// Formats a verse reference as a human-readable string.
    ///
    /// For example, "Genesis 1:1-2", "John 3:16", or "Exodus 20-22".
    /// - Parameters:
    ///   - book: The book that the reference is for.
    ///   - reference: The reference to format.
    public func formatReference(_ book: ApiTranslationBook, _ reference: VerseReference) -> String {
        formatReference(bookName: book.name, reference)
    }

    /// Formats a verse reference as a human-readable string.
    ///
    /// For example, "Genesis 1:1-2", "John 3:16", or "Exodus 20-22".
    /// - Parameters:
    ///   - bookName: The name of the book that the reference is for.
    ///   - reference: The reference to format.
    public func formatReference(bookName: String, _ reference: VerseReference) -> String {
        var result = "\(bookName) \(reference.chapter)"
        if let endChapter = reference.endChapter, endChapter != 0 {
            result += "-\(endChapter)"
        } else if let verse = reference.verse, verse != 0 {
            result += ":\(verse)"
            if let endVerse = reference.endVerse, endVerse != 0 {
                result += "-\(endVerse)"
            }
        }
        return result
    }

    /// Gets the text for a verse.
    ///
    /// Poem lines and line breaks are put on new lines, and inline headings and footnote references are replaced with a space.
    /// - Parameter verse: The verse to get the text for.
    public func getVerseText(_ verse: ChapterVerse) -> String {
        var content = ""
        for part in verse.content {
            switch part {
            case .text(let text):
                content += text
            case .formattedText(let formatted):
                if let poem = formatted.poem, poem > 0 {
                    content += "\n" + String(repeating: "\t", count: poem)
                }
                content += formatted.text
            case .inlineLineBreak:
                content += "\n"
            case .inlineHeading, .verseFootnoteReference, .unknown:
                content += " "
            }
        }
        return trimmed(content)
    }

    /// Gets the verse text for the given chapter.
    ///
    /// By default, the returned text includes markers for verse numbers and a reference to the chapter, but these can be omitted with `options`.
    /// - Parameters:
    ///   - chapter: The chapter to get the text for.
    ///   - options: Options for getting the chapter text.
    public func getChapterVerseText(_ chapter: ApiTranslationBookChapter, options: GetChapterTextOptions = GetChapterTextOptions()) -> String {
        var content = ""
        for chapterContent in chapter.chapter.content {
            switch chapterContent {
            case .verse(let verse):
                if !options.omitVerseNumbers {
                    content += "[\(verse.number)] "
                }
                content += getVerseText(verse) + " "
            case .lineBreak:
                content = trimmed(content) + "\n"
            default:
                break
            }
        }

        if !options.omitReference {
            content = formatReference(chapter.book, VerseReference(chapter: chapter.chapter.number)) + "\n" + trimmed(content)
        }

        return trimmed(content)
    }

    /// Gets the verse text for the given simplified chapter.
    ///
    /// By default, the returned text includes markers for verse numbers and a reference to the chapter, but these can be omitted with `options`.
    /// - Parameters:
    ///   - chapter: The simplified chapter to get the text for.
    ///   - options: Options for getting the chapter text.
    public func getSimpleChapterVerseText(_ chapter: ApiSimpleTranslationBookChapter, options: GetChapterTextOptions = GetChapterTextOptions()) -> String {
        var content = ""
        for chapterContent in chapter.chapter.content {
            switch chapterContent {
            case .verse(let verse):
                if !options.omitVerseNumbers {
                    content += "[\(verse.number)] "
                }
                content += trimmed(verse.text) + " "
            case .lineBreak:
                content = trimmed(content) + "\n"
            default:
                break
            }
        }

        if !options.omitReference {
            content = formatReference(chapter.book, VerseReference(chapter: chapter.chapter.number)) + "\n" + trimmed(content)
        }

        return trimmed(content)
    }
}

private func trimmed(_ value: String) -> String {
    value.trimmingCharacters(in: .whitespacesAndNewlines)
}

/// Gets the part of the string between the given UTF-16 offsets, like JavaScript's `String.prototype.slice()`.
///
/// The offsets in the API are JavaScript string indexes, which count UTF-16 code units rather than characters.
func sliceUTF16(_ value: String, _ start: Int, _ end: Int) -> String {
    let utf16 = value.utf16
    let lower = min(max(start, 0), utf16.count)
    let upper = min(max(end, lower), utf16.count)
    let startIndex = utf16.index(utf16.startIndex, offsetBy: lower)
    let endIndex = utf16.index(utf16.startIndex, offsetBy: upper)
    return String(decoding: utf16[startIndex..<endIndex], as: UTF16.self)
}
