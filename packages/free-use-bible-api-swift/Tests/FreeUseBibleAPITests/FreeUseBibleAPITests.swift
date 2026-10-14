import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
import XCTest
@testable import FreeUseBibleAPI

/// Serves the files in the Fixtures directory, keyed by URL path.
final class FixtureTransport: FreeUseBibleAPITransport, @unchecked Sendable {
    private let lock = NSLock()
    private var _requests: [URL] = []

    var requests: [URL] {
        lock.lock()
        defer { lock.unlock() }
        return _requests
    }

    private func record(_ url: URL) {
        lock.lock()
        defer { lock.unlock() }
        _requests.append(url)
    }

    func data(from url: URL) async throws -> (Data, HTTPURLResponse) {
        record(url)

        // Ignore any prefix before "/api/" so that custom endpoints are served the same fixtures.
        let path = url.path.range(of: "/api/").map { String(url.path[$0.lowerBound...].dropFirst()) } ?? url.path
        let fixtures = Bundle.module.url(forResource: "Fixtures", withExtension: nil)!
        let file = fixtures.appendingPathComponent(path)
        if let data = try? Data(contentsOf: file) {
            return (data, HTTPURLResponse(url: url, statusCode: 200, httpVersion: nil, headerFields: nil)!)
        }
        return (Data(), HTTPURLResponse(url: url, statusCode: 404, httpVersion: nil, headerFields: nil)!)
    }
}

final class FreeUseBibleAPITests: XCTestCase {
    var transport: FixtureTransport!
    var api: FreeUseBibleAPI!

    override func setUp() {
        transport = FixtureTransport()
        api = FreeUseBibleAPI(transport: transport)
    }

    func expectedText(_ name: String) throws -> String {
        let url = Bundle.module.url(forResource: "Fixtures", withExtension: nil)!
            .appendingPathComponent("expected")
            .appendingPathComponent(name)
        return try String(contentsOf: url, encoding: .utf8)
    }

    // MARK: - Endpoints

    func testTranslationEndpoints() async throws {
        let available = try await api.getAvailableTranslations()
        XCTAssertEqual(available.translations.map(\.id), ["BSB", "engwebp"])
        XCTAssertEqual(available.translations[0].textDirection, .ltr)

        let books = try await api.getTranslationBooks(translation: "BSB")
        XCTAssertEqual(books.books.map(\.id), [.GEN, .PSA])
        XCTAssertEqual(books.books[0].name, "Genesis")

        let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
        XCTAssertEqual(chapter.chapter.number, 1)
        XCTAssertEqual(chapter.numberOfVerses, 31)
        XCTAssertEqual(chapter.thisChapterReference, TranslationChapterReference(translationId: "BSB", book: .GEN, chapter: 1))
        XCTAssertNil(chapter.previousChapterApiLink)
        guard case .heading(let heading) = chapter.chapter.content.first else {
            return XCTFail("Expected the chapter to start with a heading.")
        }
        XCTAssertEqual(heading.content, ["The Creation"])
        let verses = chapter.chapter.content.compactMap { content -> ChapterVerse? in
            if case .verse(let verse) = content { return verse }
            return nil
        }
        XCTAssertEqual(verses.count, 31)

        let simple = try await api.getSimpleTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
        XCTAssertEqual(simple.fullChapterApiLink, "/api/BSB/GEN/1.json")

        let timings = try await api.getTranslationBookChapterAudioTimings(translation: "BSB", book: .GEN, chapter: 1, reader: "hays")
        XCTAssertEqual(timings.verses, [0, 4.32, 10.28, 19.06, 27.84])

        let words = try await api.getTranslationBookChapterWords(translation: "engwebp", book: .JHN, chapter: 1)
        XCTAssertEqual(words.verses["1"]?.first?.strongs, ["G1722"])

        let simpleWords = try await api.getSimpleTranslationBookChapterWords(translation: "engwebp", book: .JHN, chapter: 1)
        XCTAssertEqual(simpleWords.verses["1"]?.count, 3)

        let complete = try await api.getCompleteTranslation(translation: "engwebp")
        XCTAssertEqual(complete.books.map(\.id), [.JHN])
        XCTAssertEqual(complete.books[0].chapters.first?.chapter.number, 1)

        let simpleComplete = try await api.getSimpleCompleteTranslation(translation: "engwebp")
        XCTAssertEqual(simpleComplete.books[0].chapters.first?.chapter.number, 1)
    }

    func testPoetryAndHebrewSubtitles() async throws {
        let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .PSA, chapter: 3)
        let subtitle = chapter.chapter.content.compactMap { content -> ChapterHebrewSubtitle? in
            if case .hebrewSubtitle(let subtitle) = content { return subtitle }
            return nil
        }.first
        guard case .formattedText(let text)? = subtitle?.content.first else {
            return XCTFail("Expected the Hebrew subtitle to contain formatted text.")
        }
        XCTAssertEqual(text.text, "A Psalm of David, when he fled from his son Absalom.")
        XCTAssertEqual(text.poem, 1)

        let simple = try await api.getSimpleTranslationBookChapter(translation: "BSB", book: .PSA, chapter: 3)
        XCTAssertTrue(simple.chapter.content.contains { content in
            if case .hebrewSubtitle = content { return true }
            return false
        })
    }

    func testCommentaryEndpoints() async throws {
        let available = try await api.getAvailableCommentaries()
        XCTAssertFalse(available.commentaries.isEmpty)

        let books = try await api.getCommentaryBooks(commentary: "adam-clarke")
        XCTAssertEqual(books.books.first?.id, .GEN)

        let chapter = try await api.getCommentaryBookChapter(commentary: "adam-clarke", book: .GEN, chapter: 1)
        XCTAssertEqual(chapter.chapter.content.first?.number, 1)
        XCTAssertNotNil(chapter.chapter.introduction)
    }

    func testDatasetEndpoints() async throws {
        let available = try await api.getAvailableDatasets()
        XCTAssertTrue(available.datasets.contains { $0.id == "theographic" })

        let books = try await api.getDatasetBooks(dataset: "open-cross-ref")
        XCTAssertEqual(books.books.first?.id, .GEN)

        let crossReferences = try await api.getDatasetBookChapter(dataset: "open-cross-ref", book: .REV, chapter: 22)
        guard case .datasetBookChapter(let referencesChapter) = crossReferences,
              case .references(let references)? = referencesChapter.chapter.content.first else {
            return XCTFail("Expected a cross reference chapter.")
        }
        XCTAssertFalse(references.references.isEmpty)

        let interlinear = try await api.getDatasetBookChapter(dataset: "bsb-interlinear", book: .GEN, chapter: 1)
        guard case .datasetBookChapter(let interlinearChapter) = interlinear,
              case .words(let words)? = interlinearChapter.chapter.content.first else {
            return XCTFail("Expected an interlinear chapter.")
        }
        XCTAssertEqual(words.words.first?.language, .hebrew)
        XCTAssertEqual(words.words.first?.strongs, "H7225")

        let entities = try await api.getDatasetBookChapter(dataset: "theographic", book: .GEN, chapter: 2)
        guard case .datasetEntityBookChapter(let entityChapter) = entities else {
            return XCTFail("Expected an entity chapter.")
        }
        XCTAssertFalse(entityChapter.chapter.people.isEmpty)

        let people = try await api.getDatasetPeople(dataset: "theographic")
        XCTAssertFalse(people.people.isEmpty)

        let person = try await api.getDatasetPerson(dataset: "theographic", person: "ananias_259")
        XCTAssertEqual(person.person.id, "ananias_259")

        let place = try await api.getDatasetPlace(dataset: "theographic", place: "damascus_322")
        XCTAssertEqual(place.place.id, "damascus_322")
        XCTAssertNotNil(place.place.latitude)

        let event = try await api.getDatasetEvent(dataset: "theographic", event: "saul-is-converted_326")
        XCTAssertEqual(event.event.id, "saul-is-converted_326")

        let group = try await api.getDatasetPeopleGroup(dataset: "theographic", group: "tribe-of-benjamin")
        XCTAssertEqual(group.group.id, "tribe-of-benjamin")

        let lexicon = try await api.getDatasetLexicon(dataset: "stepbible-lexicon")
        XCTAssertFalse(lexicon.lexicon.isEmpty)

        let entry = try await api.getDatasetLexiconEntry(dataset: "stepbible-lexicon", strongs: "H1254")
        XCTAssertEqual(entry.entry.id, "H1254")
        XCTAssertEqual(entry.entry.senses.first?.language, .hebrew)
    }

    // MARK: - Requests

    func testRequestURLs() async throws {
        _ = try? await api.getTranslationBookChapter(translation: "a b/c", book: ._1SA, chapter: 3)
        _ = try? await api.getDatasetLexiconEntry(dataset: "stepbible-lexicon", strongs: "H1254")
        XCTAssertEqual(transport.requests.map(\.absoluteString), [
            "https://bible.helloao.org/api/a%20b%2Fc/1SA/3.json",
            "https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/H1254.json",
        ])
    }

    func testCustomEndpoints() async throws {
        let custom = FreeUseBibleAPI(endpoint: URL(string: "https://example.com/bible/")!, transport: transport)
        _ = try await custom.getAvailableTranslations()
        _ = try await custom.getAvailableTranslations(endpoint: URL(string: "https://other.example.com/")!)

        let chapter = try await custom.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
        _ = try await custom.getNextChapter(chapter)

        XCTAssertEqual(transport.requests.map(\.absoluteString), [
            "https://example.com/bible/api/available_translations.json",
            "https://other.example.com/api/available_translations.json",
            "https://example.com/bible/api/BSB/GEN/1.json",
            // Links in responses are absolute paths, so they resolve against the host.
            "https://example.com/api/BSB/GEN/2.json",
        ])
    }

    func testCachesResponses() async throws {
        _ = try await api.getAvailableTranslations()
        _ = try await api.getAvailableTranslations()
        XCTAssertEqual(transport.requests.count, 1)

        // Complete translations are too large to cache.
        _ = try await api.getCompleteTranslation(translation: "engwebp")
        _ = try await api.getCompleteTranslation(translation: "engwebp")
        XCTAssertEqual(transport.requests.count, 3)
    }

    func testCachingCanBeDisabled() async throws {
        let uncached = FreeUseBibleAPI(useCache: false, transport: transport)
        _ = try await uncached.getAvailableTranslations()
        _ = try await uncached.getAvailableTranslations()
        XCTAssertEqual(transport.requests.count, 2)
    }

    func testThrowsForFailedRequests() async throws {
        for _ in 0..<2 {
            do {
                _ = try await api.getTranslationBooks(translation: "missing")
                XCTFail("Expected the request to fail.")
            } catch FreeUseBibleAPIError.requestFailed(let url, let statusCode) {
                XCTAssertEqual(url.absoluteString, "https://bible.helloao.org/api/missing/books.json")
                XCTAssertEqual(statusCode, 404)
            }
        }

        // Failed requests aren't cached.
        XCTAssertEqual(transport.requests.count, 2)
    }

    // MARK: - Navigation

    func testChapterNavigation() async throws {
        let first = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
        let previous = try await api.getPreviousChapter(first)
        XCTAssertNil(previous)

        let next = try await api.getNextChapter(first)
        XCTAssertEqual(next?.chapter.number, 2)

        let back = try await api.getPreviousChapter(next!)
        XCTAssertEqual(back?.chapter.number, 1)

        let books = try await api.getTranslationBooks(translation: "BSB")
        let firstChapter = try await api.getFirstChapter(books.books[0])
        XCTAssertEqual(firstChapter.thisChapterLink, "/api/BSB/GEN/1.json")
        let lastChapter = try await api.getLastChapter(books.books[1])
        XCTAssertEqual(lastChapter.chapter.number, 3)

        let simple = try await api.getSimpleChapter(first)
        XCTAssertEqual(simple?.thisChapterLink, "/api/BSB/GEN/1.simple.json")

        let dataset = try await api.getDatasetBookChapter(dataset: "theographic", book: .GEN, chapter: 2)
        XCTAssertEqual(dataset.nextChapterApiLink, "/api/d/theographic/GEN/3.json")
    }

    // MARK: - Words

    func testChapterWords() async throws {
        let chapter = try await api.getTranslationBookChapter(translation: "engwebp", book: .JHN, chapter: 1)
        let words = try await api.getChapterWords(chapter)
        XCTAssertNotNil(words)

        guard case .verse(let verse)? = chapter.chapter.content.first(where: {
            if case .verse = $0 { return true }
            return false
        }) else {
            return XCTFail("Expected a verse.")
        }

        let annotated = api.getVerseWords(verse, words!)
        XCTAssertEqual(annotated.map(\.text), ["In", "the", "beginning"])
        XCTAssertEqual(annotated.map(\.word.strongs), [["G1722"], ["G1722"], ["G0746"]])

        let gen = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
        let noWords = try await api.getChapterWords(gen)
        XCTAssertNil(noWords)
    }

    func testSimpleChapterWords() async throws {
        let chapter = try await api.getSimpleTranslationBookChapter(translation: "engwebp", book: .JHN, chapter: 1)
        let words = try await api.getSimpleChapterWords(chapter)
        XCTAssertNotNil(words)

        guard case .verse(let verse)? = chapter.chapter.content.first(where: {
            if case .verse = $0 { return true }
            return false
        }) else {
            return XCTFail("Expected a verse.")
        }

        let annotated = api.getSimpleVerseWords(verse, words!)
        XCTAssertEqual(annotated.map(\.text), ["In", "the", "beginning"])
    }

    func testWordTextUsesUTF16Offsets() {
        // "𝔄" is a single character, but two UTF-16 code units, like in JavaScript.
        let verse = ChapterVerse(number: 1, content: [
            .inlineHeading(InlineHeading(heading: "Heading")),
            .formattedText(FormattedText(text: "𝔄 é word")),
        ])
        XCTAssertEqual(api.getWordText(verse, ChapterWord(contentIndex: 1, start: 5, end: 9)), "word")
        XCTAssertEqual(api.getWordText(verse, ChapterWord(contentIndex: 1, start: 3, end: 4)), "é")
        XCTAssertEqual(api.getWordText(verse, ChapterWord(contentIndex: 0, start: 0, end: 2)), "")
        XCTAssertEqual(api.getWordText(verse, ChapterWord(contentIndex: 5, start: 0, end: 2)), "")
        XCTAssertEqual(api.getWordText(verse, ChapterWord(contentIndex: 1, start: 7, end: 100)), "rd")
    }

    // MARK: - Text

    func testChapterVerseTextMatchesTypeScriptSDK() async throws {
        for (name, book, chapterNumber, translation) in [
            ("BSB-GEN-1", BookId.GEN, 1, "BSB"),
            ("BSB-PSA-3", BookId.PSA, 3, "BSB"),
            ("engwebp-JHN-1", BookId.JHN, 1, "engwebp"),
        ] {
            let chapter = try await api.getTranslationBookChapter(translation: translation, book: book, chapter: chapterNumber)
            XCTAssertEqual(api.getChapterVerseText(chapter), try expectedText("\(name).txt"), name)
            XCTAssertEqual(
                api.getChapterVerseText(chapter, options: GetChapterTextOptions(omitVerseNumbers: true, omitReference: true)),
                try expectedText("\(name).no-numbers.txt"),
                name
            )

            let simple = try await api.getSimpleTranslationBookChapter(translation: translation, book: book, chapter: chapterNumber)
            XCTAssertEqual(api.getSimpleChapterVerseText(simple), try expectedText("\(name).simple.txt"), name)
        }
    }

    func testFormatReference() {
        XCTAssertEqual(api.formatReference(bookName: "John", VerseReference(chapter: 3)), "John 3")
        XCTAssertEqual(api.formatReference(bookName: "John", VerseReference(chapter: 3, verse: 16)), "John 3:16")
        XCTAssertEqual(api.formatReference(bookName: "Genesis", VerseReference(chapter: 1, verse: 1, endVerse: 2)), "Genesis 1:1-2")
        XCTAssertEqual(api.formatReference(bookName: "Exodus", VerseReference(chapter: 20, endChapter: 22)), "Exodus 20-22")
    }

    // MARK: - Decoding

    func testRoundTripsThroughJSON() async throws {
        let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .PSA, chapter: 3)
        let encoded = try JSONEncoder().encode(chapter)
        let decoded = try JSONDecoder().decode(ApiTranslationBookChapter.self, from: encoded)
        XCTAssertEqual(decoded, chapter)
    }

    func testPreservesUnknownValues() throws {
        let json = """
        [
            {"type": "verse", "number": 1, "content": ["Text", {"newKind": true}]},
            {"type": "new_content_type", "value": 1}
        ]
        """
        let content = try JSONDecoder().decode([ChapterContent].self, from: Data(json.utf8))
        guard case .verse(let verse) = content[0] else {
            return XCTFail("Expected a verse.")
        }
        XCTAssertEqual(verse.content[0], .text("Text"))
        XCTAssertEqual(verse.content[1], .unknown(.object(["newKind": .bool(true)])))
        XCTAssertEqual(content[1], .unknown(.object(["type": .string("new_content_type"), "value": .number(1)])))

        let book = try JSONDecoder().decode(BookId.self, from: Data("\"XYZ\"".utf8))
        XCTAssertEqual(book.rawValue, "XYZ")
        XCTAssertFalse(BookId.allKnownValues.contains(book))
        XCTAssertTrue(BookId.allKnownValues.contains("GEN"))
    }
}
