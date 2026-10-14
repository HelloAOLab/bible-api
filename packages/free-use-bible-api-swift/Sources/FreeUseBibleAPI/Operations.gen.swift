// This file was generated from the Free Use Bible API OpenAPI document.
// Do not edit it by hand. Run `npm run generate:swift` to regenerate it.

import Foundation

extension FreeUseBibleAPI {
    /// Get the list of available Bible translations.
    ///
    /// `GET /api/available_translations.json`
    ///
    /// - Parameters:
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getAvailableTranslations(endpoint: URL? = nil) async throws -> ApiAvailableTranslations {
        try await getJSON("api/available_translations.json", endpoint: endpoint)
    }

    /// Get the list of books available for a specific translation.
    ///
    /// `GET /api/{translation}/books.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getTranslationBooks(translation: String, endpoint: URL? = nil) async throws -> ApiTranslationBooks {
        try await getJSON("api/\(encodePathComponent(translation))/books.json", endpoint: endpoint)
    }

    /// Get the content of a specific chapter of a specific book for a specific translation.
    ///
    /// `GET /api/{translation}/{book}/{chapter}.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getTranslationBookChapter(translation: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiTranslationBookChapter {
        try await getJSON("api/\(encodePathComponent(translation))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).json", endpoint: endpoint)
    }

    /// Get the content of a specific chapter of a specific book for a specific translation, using the simplified format. In the simplified format, the content of each verse is a single string instead of a list of formatted content, and the footnotes are available on the verse that they occur in, along with the offset that they occur at.
    ///
    /// `GET /api/{translation}/{book}/{chapter}.simple.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getSimpleTranslationBookChapter(translation: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiSimpleTranslationBookChapter {
        try await getJSON("api/\(encodePathComponent(translation))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).simple.json", endpoint: endpoint)
    }

    /// Get the audio timings (per-verse start times, in seconds) for a specific chapter of a specific book for a specific translation and reader.
    ///
    /// `GET /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - reader: The ID of the reader to get the audio timings for. For example, "hays" for the Hays reading of the Berean Standard Bible.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getTranslationBookChapterAudioTimings(translation: String, book: BookId, chapter: Int, reader: String, endpoint: URL? = nil) async throws -> ApiTranslationBookChapterAudioTimings {
        try await getJSON("api/\(encodePathComponent(translation))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).\(encodePathComponent(reader)).audioTimings.json", endpoint: endpoint)
    }

    /// Get the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific translation.
    ///
    /// `GET /api/{translation}/{book}/{chapter}.words.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getTranslationBookChapterWords(translation: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiTranslationBookChapterWords {
        try await getJSON("api/\(encodePathComponent(translation))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).words.json", endpoint: endpoint)
    }

    /// Get the word-level annotations (Strong's numbers and related source data) for a specific chapter of a specific book for a specific translation, with their offsets remapped onto the text of each simplified verse. Use this with the simplified chapter format, since the offsets in the regular annotations are anchored to a verse's content array.
    ///
    /// `GET /api/{translation}/{book}/{chapter}.words.simple.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getSimpleTranslationBookChapterWords(translation: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiSimpleTranslationBookChapterWords {
        try await getJSON("api/\(encodePathComponent(translation))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).words.simple.json", endpoint: endpoint)
    }

    /// Get the complete content of a specific translation.
    ///
    /// The results of this endpoint are very large, so the response is not cached.
    ///
    /// `GET /api/{translation}/complete.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getCompleteTranslation(translation: String, endpoint: URL? = nil) async throws -> ApiTranslationComplete {
        try await getJSON("api/\(encodePathComponent(translation))/complete.json", endpoint: endpoint, useCache: false)
    }

    /// Get the complete content of a specific translation, using the simplified format. In the simplified format, the content of each verse is a single string instead of a list of formatted content, and the footnotes are available on the verse that they occur in, along with the offset that they occur at.
    ///
    /// The results of this endpoint are very large, so the response is not cached.
    ///
    /// `GET /api/{translation}/complete.simple.json`
    ///
    /// - Parameters:
    ///   - translation: The translation ID of the Bible translation to get the books for. For example, "eng_kjv" for the King James Version.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getSimpleCompleteTranslation(translation: String, endpoint: URL? = nil) async throws -> ApiSimpleTranslationComplete {
        try await getJSON("api/\(encodePathComponent(translation))/complete.simple.json", endpoint: endpoint, useCache: false)
    }

    /// Get the list of available commentaries.
    ///
    /// `GET /api/available_commentaries.json`
    ///
    /// - Parameters:
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getAvailableCommentaries(endpoint: URL? = nil) async throws -> ApiAvailableCommentaries {
        try await getJSON("api/available_commentaries.json", endpoint: endpoint)
    }

    /// Get the list of books available for a specific commentary.
    ///
    /// `GET /api/c/{commentary}/books.json`
    ///
    /// - Parameters:
    ///   - commentary: The commentary ID of the commentary to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getCommentaryBooks(commentary: String, endpoint: URL? = nil) async throws -> ApiCommentaryBooks {
        try await getJSON("api/c/\(encodePathComponent(commentary))/books.json", endpoint: endpoint)
    }

    /// Get the content of a specific chapter of a specific book for a specific commentary.
    ///
    /// `GET /api/c/{commentary}/{book}/{chapter}.json`
    ///
    /// - Parameters:
    ///   - commentary: The commentary ID of the commentary to get the books or chapter content for.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getCommentaryBookChapter(commentary: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiCommentaryBookChapter {
        try await getJSON("api/c/\(encodePathComponent(commentary))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).json", endpoint: endpoint)
    }

    /// Get the content of a specific chapter of a specific book for a specific commentary, using the simplified format. In the simplified format, the content of each verse is a single string instead of a list of formatted content.
    ///
    /// `GET /api/c/{commentary}/{book}/{chapter}.simple.json`
    ///
    /// - Parameters:
    ///   - commentary: The commentary ID of the commentary to get the books or chapter content for.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getSimpleCommentaryBookChapter(commentary: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiSimpleCommentaryBookChapter {
        try await getJSON("api/c/\(encodePathComponent(commentary))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).simple.json", endpoint: endpoint)
    }

    /// Get the list of available datasets.
    ///
    /// `GET /api/available_datasets.json`
    ///
    /// - Parameters:
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getAvailableDatasets(endpoint: URL? = nil) async throws -> ApiAvailableDatasets {
        try await getJSON("api/available_datasets.json", endpoint: endpoint)
    }

    /// Get the list of books available for a specific dataset.
    ///
    /// `GET /api/d/{dataset}/books.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetBooks(dataset: String, endpoint: URL? = nil) async throws -> ApiDatasetBooks {
        try await getJSON("api/d/\(encodePathComponent(dataset))/books.json", endpoint: endpoint)
    }

    /// Get the content of a specific chapter of a specific book for a specific dataset. For cross reference datasets, this is the list of cross references for each verse in the chapter. For interlinear datasets (such as "bsb-interlinear"), this is the original-language words of each verse in the chapter. For entity datasets (such as "theographic"), this is the people, places, and events that appear in the chapter.
    ///
    /// `GET /api/d/{dataset}/{book}/{chapter}.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - book: IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    ///   - chapter: The chapter number to get the content for. This should be a positive integer.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetBookChapter(dataset: String, book: BookId, chapter: Int, endpoint: URL? = nil) async throws -> ApiDatasetBookChapterResponse {
        try await getJSON("api/d/\(encodePathComponent(dataset))/\(encodePathComponent(book.rawValue))/\(encodePathComponent(String(chapter))).json", endpoint: endpoint)
    }

    /// Get the list of people that are available for a specific dataset.
    ///
    /// `GET /api/d/{dataset}/people.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetPeople(dataset: String, endpoint: URL? = nil) async throws -> ApiDatasetPeople {
        try await getJSON("api/d/\(encodePathComponent(dataset))/people.json", endpoint: endpoint)
    }

    /// Get the information about a specific person for a specific dataset. Includes the Bible references that mention the person and their relationships to other people, places, events, and people groups.
    ///
    /// `GET /api/d/{dataset}/people/{person}.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - person: The ID of the person to get the information for. For example, "paul_2479" for the apostle Paul.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetPerson(dataset: String, person: String, endpoint: URL? = nil) async throws -> ApiDatasetPerson {
        try await getJSON("api/d/\(encodePathComponent(dataset))/people/\(encodePathComponent(person)).json", endpoint: endpoint)
    }

    /// Get the list of places that are available for a specific dataset.
    ///
    /// `GET /api/d/{dataset}/places.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetPlaces(dataset: String, endpoint: URL? = nil) async throws -> ApiDatasetPlaces {
        try await getJSON("api/d/\(encodePathComponent(dataset))/places.json", endpoint: endpoint)
    }

    /// Get the information about a specific place for a specific dataset. Includes the Bible references that mention the place and its related people and events.
    ///
    /// `GET /api/d/{dataset}/places/{place}.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - place: The ID of the place to get the information for. For example, "jerusalem_636" for Jerusalem.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetPlace(dataset: String, place: String, endpoint: URL? = nil) async throws -> ApiDatasetPlace {
        try await getJSON("api/d/\(encodePathComponent(dataset))/places/\(encodePathComponent(place)).json", endpoint: endpoint)
    }

    /// Get the list of events that are available for a specific dataset.
    ///
    /// `GET /api/d/{dataset}/events.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetEvents(dataset: String, endpoint: URL? = nil) async throws -> ApiDatasetEvents {
        try await getJSON("api/d/\(encodePathComponent(dataset))/events.json", endpoint: endpoint)
    }

    /// Get the information about a specific event for a specific dataset. Includes the Bible references that describe the event and its related people, places, and people groups.
    ///
    /// `GET /api/d/{dataset}/events/{event}.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - event: The ID of the event to get the information for. For example, "saul-is-converted_326" for the conversion of Saul.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetEvent(dataset: String, event: String, endpoint: URL? = nil) async throws -> ApiDatasetEvent {
        try await getJSON("api/d/\(encodePathComponent(dataset))/events/\(encodePathComponent(event)).json", endpoint: endpoint)
    }

    /// Get the list of people groups that are available for a specific dataset.
    ///
    /// `GET /api/d/{dataset}/groups.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetPeopleGroups(dataset: String, endpoint: URL? = nil) async throws -> ApiDatasetPeopleGroups {
        try await getJSON("api/d/\(encodePathComponent(dataset))/groups.json", endpoint: endpoint)
    }

    /// Get the information about a specific people group for a specific dataset. Includes the members of the group and the events that the group participated in.
    ///
    /// `GET /api/d/{dataset}/groups/{group}.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - group: The ID of the people group to get the information for. For example, "tribe-of-benjamin" for the tribe of Benjamin.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetPeopleGroup(dataset: String, group: String, endpoint: URL? = nil) async throws -> ApiDatasetPeopleGroup {
        try await getJSON("api/d/\(encodePathComponent(dataset))/groups/\(encodePathComponent(group)).json", endpoint: endpoint)
    }

    /// Get the list of lexicon entries that are available for a specific dataset.
    ///
    /// `GET /api/d/{dataset}/lexicon.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetLexicon(dataset: String, endpoint: URL? = nil) async throws -> ApiDatasetLexicon {
        try await getJSON("api/d/\(encodePathComponent(dataset))/lexicon.json", endpoint: endpoint)
    }

    /// Get the information about a specific lexicon entry for a specific dataset. Includes the senses (lemma, transliteration, part of speech, gloss, and definition) of the base Strong's number.
    ///
    /// `GET /api/d/{dataset}/lexicon/{strongs}.json`
    ///
    /// - Parameters:
    ///   - dataset: The dataset ID of the dataset to get the books or chapter content for.
    ///   - strongs: The zero-padded Strong's number of the lexicon entry to get the information for. For example, "H0430" for the Hebrew word Elohim or "G3056" for the Greek word logos.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    public func getDatasetLexiconEntry(dataset: String, strongs: String, endpoint: URL? = nil) async throws -> ApiDatasetLexiconEntry {
        try await getJSON("api/d/\(encodePathComponent(dataset))/lexicon/\(encodePathComponent(strongs)).json", endpoint: endpoint)
    }
}
