// This file was generated from the Free Use Bible API OpenAPI document.
// Do not edit it by hand. Run `npm run generate:swift` to regenerate it.

import Foundation

/// IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
///
/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct BookId: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let GEN = BookId(rawValue: "GEN")
    public static let EXO = BookId(rawValue: "EXO")
    public static let LEV = BookId(rawValue: "LEV")
    public static let NUM = BookId(rawValue: "NUM")
    public static let DEU = BookId(rawValue: "DEU")
    public static let JOS = BookId(rawValue: "JOS")
    public static let JDG = BookId(rawValue: "JDG")
    public static let RUT = BookId(rawValue: "RUT")
    public static let _1SA = BookId(rawValue: "1SA")
    public static let _2SA = BookId(rawValue: "2SA")
    public static let _1KI = BookId(rawValue: "1KI")
    public static let _2KI = BookId(rawValue: "2KI")
    public static let _1CH = BookId(rawValue: "1CH")
    public static let _2CH = BookId(rawValue: "2CH")
    public static let EZR = BookId(rawValue: "EZR")
    public static let NEH = BookId(rawValue: "NEH")
    public static let EST = BookId(rawValue: "EST")
    public static let JOB = BookId(rawValue: "JOB")
    public static let PSA = BookId(rawValue: "PSA")
    public static let PRO = BookId(rawValue: "PRO")
    public static let ECC = BookId(rawValue: "ECC")
    public static let SNG = BookId(rawValue: "SNG")
    public static let ISA = BookId(rawValue: "ISA")
    public static let JER = BookId(rawValue: "JER")
    public static let LAM = BookId(rawValue: "LAM")
    public static let EZK = BookId(rawValue: "EZK")
    public static let DAN = BookId(rawValue: "DAN")
    public static let HOS = BookId(rawValue: "HOS")
    public static let JOL = BookId(rawValue: "JOL")
    public static let AMO = BookId(rawValue: "AMO")
    public static let OBA = BookId(rawValue: "OBA")
    public static let JON = BookId(rawValue: "JON")
    public static let MIC = BookId(rawValue: "MIC")
    public static let NAM = BookId(rawValue: "NAM")
    public static let HAB = BookId(rawValue: "HAB")
    public static let ZEP = BookId(rawValue: "ZEP")
    public static let HAG = BookId(rawValue: "HAG")
    public static let ZEC = BookId(rawValue: "ZEC")
    public static let MAL = BookId(rawValue: "MAL")
    public static let MAT = BookId(rawValue: "MAT")
    public static let MRK = BookId(rawValue: "MRK")
    public static let LUK = BookId(rawValue: "LUK")
    public static let JHN = BookId(rawValue: "JHN")
    public static let ACT = BookId(rawValue: "ACT")
    public static let ROM = BookId(rawValue: "ROM")
    public static let _1CO = BookId(rawValue: "1CO")
    public static let _2CO = BookId(rawValue: "2CO")
    public static let GAL = BookId(rawValue: "GAL")
    public static let EPH = BookId(rawValue: "EPH")
    public static let PHP = BookId(rawValue: "PHP")
    public static let COL = BookId(rawValue: "COL")
    public static let _1TH = BookId(rawValue: "1TH")
    public static let _2TH = BookId(rawValue: "2TH")
    public static let _1TI = BookId(rawValue: "1TI")
    public static let _2TI = BookId(rawValue: "2TI")
    public static let TIT = BookId(rawValue: "TIT")
    public static let PHM = BookId(rawValue: "PHM")
    public static let HEB = BookId(rawValue: "HEB")
    public static let JAS = BookId(rawValue: "JAS")
    public static let _1PE = BookId(rawValue: "1PE")
    public static let _2PE = BookId(rawValue: "2PE")
    public static let _1JN = BookId(rawValue: "1JN")
    public static let _2JN = BookId(rawValue: "2JN")
    public static let _3JN = BookId(rawValue: "3JN")
    public static let JUD = BookId(rawValue: "JUD")
    public static let REV = BookId(rawValue: "REV")
    public static let TOB = BookId(rawValue: "TOB")
    public static let JDT = BookId(rawValue: "JDT")
    public static let ESG = BookId(rawValue: "ESG")
    public static let WIS = BookId(rawValue: "WIS")
    public static let SIR = BookId(rawValue: "SIR")
    public static let BAR = BookId(rawValue: "BAR")
    public static let LJE = BookId(rawValue: "LJE")
    public static let S3Y = BookId(rawValue: "S3Y")
    public static let SUS = BookId(rawValue: "SUS")
    public static let BEL = BookId(rawValue: "BEL")
    public static let _1MA = BookId(rawValue: "1MA")
    public static let _2MA = BookId(rawValue: "2MA")
    public static let _3MA = BookId(rawValue: "3MA")
    public static let _4MA = BookId(rawValue: "4MA")
    public static let _1ES = BookId(rawValue: "1ES")
    public static let _2ES = BookId(rawValue: "2ES")
    public static let MAN = BookId(rawValue: "MAN")
    public static let PS2 = BookId(rawValue: "PS2")
    public static let ODA = BookId(rawValue: "ODA")
    public static let PSS = BookId(rawValue: "PSS")
    public static let EZA = BookId(rawValue: "EZA")
    public static let _5EZ = BookId(rawValue: "5EZ")
    public static let _6EZ = BookId(rawValue: "6EZ")
    public static let DAG = BookId(rawValue: "DAG")
    public static let PS3 = BookId(rawValue: "PS3")
    public static let _2BA = BookId(rawValue: "2BA")
    public static let LBA = BookId(rawValue: "LBA")
    public static let JUB = BookId(rawValue: "JUB")
    public static let ENO = BookId(rawValue: "ENO")
    public static let _1MQ = BookId(rawValue: "1MQ")
    public static let _2MQ = BookId(rawValue: "2MQ")
    public static let _3MQ = BookId(rawValue: "3MQ")
    public static let REP = BookId(rawValue: "REP")
    public static let _4BA = BookId(rawValue: "4BA")
    public static let LAO = BookId(rawValue: "LAO")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [BookId] = [
        .GEN,
        .EXO,
        .LEV,
        .NUM,
        .DEU,
        .JOS,
        .JDG,
        .RUT,
        ._1SA,
        ._2SA,
        ._1KI,
        ._2KI,
        ._1CH,
        ._2CH,
        .EZR,
        .NEH,
        .EST,
        .JOB,
        .PSA,
        .PRO,
        .ECC,
        .SNG,
        .ISA,
        .JER,
        .LAM,
        .EZK,
        .DAN,
        .HOS,
        .JOL,
        .AMO,
        .OBA,
        .JON,
        .MIC,
        .NAM,
        .HAB,
        .ZEP,
        .HAG,
        .ZEC,
        .MAL,
        .MAT,
        .MRK,
        .LUK,
        .JHN,
        .ACT,
        .ROM,
        ._1CO,
        ._2CO,
        .GAL,
        .EPH,
        .PHP,
        .COL,
        ._1TH,
        ._2TH,
        ._1TI,
        ._2TI,
        .TIT,
        .PHM,
        .HEB,
        .JAS,
        ._1PE,
        ._2PE,
        ._1JN,
        ._2JN,
        ._3JN,
        .JUD,
        .REV,
        .TOB,
        .JDT,
        .ESG,
        .WIS,
        .SIR,
        .BAR,
        .LJE,
        .S3Y,
        .SUS,
        .BEL,
        ._1MA,
        ._2MA,
        ._3MA,
        ._4MA,
        ._1ES,
        ._2ES,
        .MAN,
        .PS2,
        .ODA,
        .PSS,
        .EZA,
        ._5EZ,
        ._6EZ,
        .DAG,
        .PS3,
        ._2BA,
        .LBA,
        .JUB,
        .ENO,
        ._1MQ,
        ._2MQ,
        ._3MQ,
        .REP,
        ._4BA,
        .LAO,
    ]
}

/// The list of available translations. Maps to the /api/available-translations.json endpoint.
public struct ApiAvailableTranslations: Codable, Hashable, Sendable {
    /// The list of translations that are available in the API.
    public var translations: [ApiTranslation]

    public init(
        translations: [ApiTranslation]
    ) {
        self.translations = translations
    }
}

/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct TextDirection: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let ltr = TextDirection(rawValue: "ltr")
    public static let rtl = TextDirection(rawValue: "rtl")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [TextDirection] = [
        .ltr,
        .rtl,
    ]
}

/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct ApiFormat: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let json = ApiFormat(rawValue: "json")
    public static let usfm = ApiFormat(rawValue: "usfm")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [ApiFormat] = [
        .json,
        .usfm,
    ]
}

/// Defines a translation that is used in the API.
public struct ApiTranslation: Codable, Hashable, Sendable {
    /// The ID of the translation.
    public var id: String

    /// The name of the translation.
    public var name: String

    /// The website for the translation.
    public var website: String

    /// The URL that the license for the translation can be found.
    public var licenseUrl: String

    /// The API-added notes for the license.
    public var licenseNotes: String?

    /// The notice that should be displayed when displaying content from the translation.
    public var licenseNotice: String?

    /// The structured license terms that were detected for the translation, if any.
    public var license: License?

    /// The short name for the translation.
    public var shortName: String?

    /// The English name for the translation.
    public var englishName: String

    /// The ISO 639 3-letter language tag that the translation is primarily in.
    public var language: String

    /// The direction that the language is written in. `ltr` indicates that the text is written from the left side of the page to the right. `rtl` indicates that the text is written from the right side of the page to the left.
    public var textDirection: TextDirection

    /// The API link for the list of books for this translation. Relative to the API origin.
    public var listOfBooksApiLink: String

    public var availableFormats: [ApiFormat]

    /// The number of books that are contained in this translation. Complete translations should have the same number of books as the Bible (66).
    public var numberOfBooks: Int

    /// The total number of chapters that are contained in this translation. Complete translations should have the same number of chapters as the Bible (1,189).
    public var totalNumberOfChapters: Int

    /// The total number of verses that are contained in this translation. Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).
    public var totalNumberOfVerses: Int

    /// The total number of apocryphal books that are contained in this translation.
    public var numberOfApocryphalBooks: Int?

    /// The total number of apocryphal chapters that are contained in this translation.
    public var totalNumberOfApocryphalChapters: Int?

    /// The total number of apocryphal verses that are contained in this translation.
    public var totalNumberOfApocryphalVerses: Int?

    /// Gets the name of the language that the translation is in. Null or undefined if the name of the language is not known.
    public var languageName: String?

    /// Gets the name of the language in English. Null or undefined if the language doesn't have an english name.
    public var languageEnglishName: String?

    /// The API link for downloading the complete translation as a single JSON file. Relative to the API origin. Undefined if complete translation files are not available.
    public var completeTranslationApiLink: String?

    /// The API link for downloading the complete translation as a single JSON file, using the simplified chapter format. Relative to the API origin. Undefined if complete translation files are not available.
    public var simpleCompleteTranslationApiLink: String?

    public init(
        id: String,
        name: String,
        website: String,
        licenseUrl: String,
        licenseNotes: String? = nil,
        licenseNotice: String? = nil,
        license: License? = nil,
        shortName: String? = nil,
        englishName: String,
        language: String,
        textDirection: TextDirection,
        listOfBooksApiLink: String,
        availableFormats: [ApiFormat],
        numberOfBooks: Int,
        totalNumberOfChapters: Int,
        totalNumberOfVerses: Int,
        numberOfApocryphalBooks: Int? = nil,
        totalNumberOfApocryphalChapters: Int? = nil,
        totalNumberOfApocryphalVerses: Int? = nil,
        languageName: String? = nil,
        languageEnglishName: String? = nil,
        completeTranslationApiLink: String? = nil,
        simpleCompleteTranslationApiLink: String? = nil
    ) {
        self.id = id
        self.name = name
        self.website = website
        self.licenseUrl = licenseUrl
        self.licenseNotes = licenseNotes
        self.licenseNotice = licenseNotice
        self.license = license
        self.shortName = shortName
        self.englishName = englishName
        self.language = language
        self.textDirection = textDirection
        self.listOfBooksApiLink = listOfBooksApiLink
        self.availableFormats = availableFormats
        self.numberOfBooks = numberOfBooks
        self.totalNumberOfChapters = totalNumberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
        self.numberOfApocryphalBooks = numberOfApocryphalBooks
        self.totalNumberOfApocryphalChapters = totalNumberOfApocryphalChapters
        self.totalNumberOfApocryphalVerses = totalNumberOfApocryphalVerses
        self.languageName = languageName
        self.languageEnglishName = languageEnglishName
        self.completeTranslationApiLink = completeTranslationApiLink
        self.simpleCompleteTranslationApiLink = simpleCompleteTranslationApiLink
    }
}

/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct LicenseRequirement: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let required = LicenseRequirement(rawValue: "required")
    public static let notRequired = LicenseRequirement(rawValue: "not-required")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [LicenseRequirement] = [
        .required,
        .notRequired,
    ]
}

/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct LicensePermission: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let allowed = LicensePermission(rawValue: "allowed")
    public static let notAllowed = LicensePermission(rawValue: "not-allowed")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [LicensePermission] = [
        .allowed,
        .notAllowed,
    ]
}

/// Defines the structured license terms that were detected for a translation.
public struct License: Codable, Hashable, Sendable {
    /// Whether attribution to the original source is required when using the translation.
    public var attribution: LicenseRequirement

    /// Whether commercial use of the translation is allowed.
    public var commercialUse: LicensePermission

    /// Whether creating and distributing derivative works of the translation is allowed.
    public var derivatives: LicensePermission

    /// Whether derivative works must be distributed under the same license (i.e. a "share-alike" requirement).
    public var copyleft: Bool

    /// Whether the translation has been dedicated to the public domain.
    public var publicDomain: Bool

    public init(
        attribution: LicenseRequirement,
        commercialUse: LicensePermission,
        derivatives: LicensePermission,
        copyleft: Bool,
        publicDomain: Bool
    ) {
        self.attribution = attribution
        self.commercialUse = commercialUse
        self.derivatives = derivatives
        self.copyleft = copyleft
        self.publicDomain = publicDomain
    }
}

/// Defines an interface that contains information about the books that are available for a translation.
public struct ApiTranslationBooks: Codable, Hashable, Sendable {
    /// The translation information for the books.
    public var translation: ApiTranslation

    /// The list of books that are available for the translation.
    public var books: [ApiTranslationBook]

    public init(
        translation: ApiTranslation,
        books: [ApiTranslationBook]
    ) {
        self.translation = translation
        self.books = books
    }
}

/// Defines a schema that contains information about a translation book.
public struct ApiTranslationBook: Codable, Hashable, Sendable {
    public var id: BookId

    /// The name that the translation provided for the book.
    public var name: String

    /// The common name for the book.
    public var commonName: String

    /// The short name (abbreviation) that the translation provided for the book. If not available, then one was not provided by the translation.
    public var shortName: String?

    /// The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.
    public var title: String?

    /// The numerical order of the book in the translation.
    public var order: Int

    /// Whether the book is an apocryphal book.
    public var isApocryphal: Bool?

    /// The number of the first chapter in the book.
    public var firstChapterNumber: Int

    /// The link to the first chapter of the book.
    public var firstChapterApiLink: String

    public var firstChapterReference: TranslationChapterReference

    /// The number of the last chapter in the book.
    public var lastChapterNumber: Int

    /// The link to the last chapter of the book.
    public var lastChapterApiLink: String

    public var lastChapterReference: TranslationChapterReference

    /// The number of chapters that the book contains.
    public var numberOfChapters: Int

    /// The number of verses that the book contains.
    public var totalNumberOfVerses: Int

    public init(
        id: BookId,
        name: String,
        commonName: String,
        shortName: String? = nil,
        title: String? = nil,
        order: Int,
        isApocryphal: Bool? = nil,
        firstChapterNumber: Int,
        firstChapterApiLink: String,
        firstChapterReference: TranslationChapterReference,
        lastChapterNumber: Int,
        lastChapterApiLink: String,
        lastChapterReference: TranslationChapterReference,
        numberOfChapters: Int,
        totalNumberOfVerses: Int
    ) {
        self.id = id
        self.name = name
        self.commonName = commonName
        self.shortName = shortName
        self.title = title
        self.order = order
        self.isApocryphal = isApocryphal
        self.firstChapterNumber = firstChapterNumber
        self.firstChapterApiLink = firstChapterApiLink
        self.firstChapterReference = firstChapterReference
        self.lastChapterNumber = lastChapterNumber
        self.lastChapterApiLink = lastChapterApiLink
        self.lastChapterReference = lastChapterReference
        self.numberOfChapters = numberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
    }
}

/// Defines a reference to a chapter in a translation.
public struct TranslationChapterReference: Codable, Hashable, Sendable {
    /// The ID of the translation that the chapter reference is for.
    public var translationId: String

    public var book: BookId

    /// The chapter number of the chapter reference.
    public var chapter: Int

    public init(
        translationId: String,
        book: BookId,
        chapter: Int
    ) {
        self.translationId = translationId
        self.book = book
        self.chapter = chapter
    }
}

/// Defines an interface that contains information about a book chapter in a translation.
public struct ApiTranslationBookChapter: Codable, Hashable, Sendable {
    /// The information for the chapter.
    public var chapter: Chapter

    /// The links to different audio versions for the chapter.
    public var thisChapterAudioLinks: TranslationBookChapterAudioLinks

    /// The links to the audio timings for different audio versions for the chapter. Relative to the API origin.
    public var thisChapterAudioTimings: [String: String]

    /// The translation information for the book chapter.
    public var translation: ApiTranslation

    /// The book information for the book chapter.
    public var book: ApiTranslationBook

    /// The API link for this chapter. Relative to the API origin.
    public var thisChapterLink: String

    public var thisChapterReference: TranslationChapterReference

    /// The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
    public var nextChapterApiLink: String?

    /// The reference for the next chapter. Null if this is the last chapter in the translation.
    public var nextChapterReference: TranslationChapterReference?

    /// The links to the audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
    public var nextChapterAudioLinks: [String: String]?

    /// The links to the audio timings for different audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
    public var nextChapterAudioTimings: [String: String]?

    /// The links to the audio timings for different audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
    public var previousChapterAudioTimings: [String: String]?

    /// The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
    public var previousChapterApiLink: String?

    /// The reference for the previous chapter. Null if this is the first chapter in the translation.
    public var previousChapterReference: TranslationChapterReference?

    /// The links to the audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
    public var previousChapterAudioLinks: [String: String]?

    /// The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
    public var thisChapterWordsLink: String?

    /// The link to the word-level annotations for the next chapter. Relative to the API origin. Omitted if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
    public var nextChapterWordsLink: String?

    /// The link to the word-level annotations for the previous chapter. Relative to the API origin. Omitted if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
    public var previousChapterWordsLink: String?

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The API link to the simplified version of this chapter. Relative to the API origin. Omitted if simplified chapters are not available.
    public var simpleChapterApiLink: String?

    public init(
        chapter: Chapter,
        thisChapterAudioLinks: TranslationBookChapterAudioLinks,
        thisChapterAudioTimings: [String: String],
        translation: ApiTranslation,
        book: ApiTranslationBook,
        thisChapterLink: String,
        thisChapterReference: TranslationChapterReference,
        nextChapterApiLink: String? = nil,
        nextChapterReference: TranslationChapterReference? = nil,
        nextChapterAudioLinks: [String: String]? = nil,
        nextChapterAudioTimings: [String: String]? = nil,
        previousChapterAudioTimings: [String: String]? = nil,
        previousChapterApiLink: String? = nil,
        previousChapterReference: TranslationChapterReference? = nil,
        previousChapterAudioLinks: [String: String]? = nil,
        thisChapterWordsLink: String? = nil,
        nextChapterWordsLink: String? = nil,
        previousChapterWordsLink: String? = nil,
        numberOfVerses: Int,
        simpleChapterApiLink: String? = nil
    ) {
        self.chapter = chapter
        self.thisChapterAudioLinks = thisChapterAudioLinks
        self.thisChapterAudioTimings = thisChapterAudioTimings
        self.translation = translation
        self.book = book
        self.thisChapterLink = thisChapterLink
        self.thisChapterReference = thisChapterReference
        self.nextChapterApiLink = nextChapterApiLink
        self.nextChapterReference = nextChapterReference
        self.nextChapterAudioLinks = nextChapterAudioLinks
        self.nextChapterAudioTimings = nextChapterAudioTimings
        self.previousChapterAudioTimings = previousChapterAudioTimings
        self.previousChapterApiLink = previousChapterApiLink
        self.previousChapterReference = previousChapterReference
        self.previousChapterAudioLinks = previousChapterAudioLinks
        self.thisChapterWordsLink = thisChapterWordsLink
        self.nextChapterWordsLink = nextChapterWordsLink
        self.previousChapterWordsLink = previousChapterWordsLink
        self.numberOfVerses = numberOfVerses
        self.simpleChapterApiLink = simpleChapterApiLink
    }

    /// The information for the chapter.
    public struct Chapter: Codable, Hashable, Sendable {
        /// The number of the chapter.
        public var number: Int

        /// The content of the chapter.
        public var content: [ChapterContent]

        /// The list of footnotes for the chapter.
        public var footnotes: [ChapterFootnote]

        public init(
            number: Int,
            content: [ChapterContent],
            footnotes: [ChapterFootnote]
        ) {
            self.number = number
            self.content = content
            self.footnotes = footnotes
        }
    }
}

/// Defines a union type that represents a single piece of chapter content. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.
public enum ChapterContent: Codable, Hashable, Sendable {
    case heading(ChapterHeading)
    case lineBreak(ChapterLineBreak)
    case verse(ChapterVerse)
    case hebrewSubtitle(ChapterHebrewSubtitle)
    /// A value that this version of the SDK doesn't know about.
    case unknown(JSONValue)

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: AnyCodingKey.self)
        let discriminator = try container.decodeIfPresent(String.self, forKey: AnyCodingKey("type"))
        switch discriminator ?? "" {
        case "heading":
            self = .heading(try ChapterHeading(from: decoder))
        case "line_break":
            self = .lineBreak(try ChapterLineBreak(from: decoder))
        case "verse":
            self = .verse(try ChapterVerse(from: decoder))
        case "hebrew_subtitle":
            self = .hebrewSubtitle(try ChapterHebrewSubtitle(from: decoder))
        default:
            self = .unknown(try JSONValue(from: decoder))
        }
    }

    public func encode(to encoder: Encoder) throws {
        switch self {
        case .heading(let value):
            try value.encode(to: encoder)
        case .lineBreak(let value):
            try value.encode(to: encoder)
        case .verse(let value):
            try value.encode(to: encoder)
        case .hebrewSubtitle(let value):
            try value.encode(to: encoder)
        case .unknown(let value):
            try value.encode(to: encoder)
        }
    }
}

/// Defines the schema for a heading in a chapter.
public struct ChapterHeading: Codable, Hashable, Sendable {
    public var type: String

    /// The content for the heading. If multiple strings are included in the array, they should be concatenated with a space.
    public var content: [String]

    public init(
        type: String = "heading",
        content: [String]
    ) {
        self.type = type
        self.content = content
    }
}

/// Defines the schema for a line break in a chapter.
public struct ChapterLineBreak: Codable, Hashable, Sendable {
    public var type: String

    /// The source paragraph marker (without its backslash) when the line break starts a new paragraph, for example `p`, `m`, `pi1` or `mi`. Omitted for plain line breaks.
    public var paragraph: String?

    public init(
        type: String = "line_break",
        paragraph: String? = nil
    ) {
        self.type = type
        self.paragraph = paragraph
    }
}

public enum VerseContent: Codable, Hashable, Sendable {
    case text(String)
    case formattedText(FormattedText)
    case inlineHeading(InlineHeading)
    case inlineLineBreak(InlineLineBreak)
    case verseFootnoteReference(VerseFootnoteReference)
    /// A value that this version of the SDK doesn't know about.
    case unknown(JSONValue)

    public init(from decoder: Decoder) throws {
        if let value = try? decoder.singleValueContainer().decode(String.self) {
            self = .text(value)
            return
        }
        if let container = try? decoder.container(keyedBy: AnyCodingKey.self) {
            if container.contains(AnyCodingKey("text")) {
                self = .formattedText(try FormattedText(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("heading")) {
                self = .inlineHeading(try InlineHeading(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("lineBreak")) {
                self = .inlineLineBreak(try InlineLineBreak(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("noteId")) {
                self = .verseFootnoteReference(try VerseFootnoteReference(from: decoder))
                return
            }
        }
        self = .unknown(try JSONValue(from: decoder))
    }

    public func encode(to encoder: Encoder) throws {
        switch self {
        case .text(let value):
            var container = encoder.singleValueContainer()
            try container.encode(value)
        case .formattedText(let value):
            try value.encode(to: encoder)
        case .inlineHeading(let value):
            try value.encode(to: encoder)
        case .inlineLineBreak(let value):
            try value.encode(to: encoder)
        case .verseFootnoteReference(let value):
            try value.encode(to: encoder)
        case .unknown(let value):
            try value.encode(to: encoder)
        }
    }
}

/// Defines the schema for a verse in a chapter.
public struct ChapterVerse: Codable, Hashable, Sendable {
    public var type: String

    /// The number of the verse.
    public var number: Int

    /// The list of content for the verse. Each element in the list could be a string, formatted text, or a footnote reference.
    public var content: [VerseContent]

    public init(
        type: String = "verse",
        number: Int,
        content: [VerseContent]
    ) {
        self.type = type
        self.number = number
        self.content = content
    }
}

/// Defines the schema for formatted text. That is, text that is formatted in a particular manner.
public struct FormattedText: Codable, Hashable, Sendable {
    /// The text that is formatted.
    public var text: String

    /// Whether the text represents a poem. The number indicates the level of indent. Common in Psalms.
    public var poem: Int?

    /// Whether the text represents the Words of Jesus.
    public var wordsOfJesus: Bool?

    public init(
        text: String,
        poem: Int? = nil,
        wordsOfJesus: Bool? = nil
    ) {
        self.text = text
        self.poem = poem
        self.wordsOfJesus = wordsOfJesus
    }
}

/// Defines the schema for a heading that is embedded in a verse.
public struct InlineHeading: Codable, Hashable, Sendable {
    /// The text of the heading.
    public var heading: String

    public init(
        heading: String
    ) {
        self.heading = heading
    }
}

/// Defines the schema for a line break that is embedded in a verse.
public struct InlineLineBreak: Codable, Hashable, Sendable {
    public var lineBreak: Bool

    /// The source paragraph marker (without its backslash) when the line break starts a new paragraph, for example `p`, `m`, `pi1` or `mi`. Omitted for plain line breaks.
    public var paragraph: String?

    public init(
        lineBreak: Bool = true,
        paragraph: String? = nil
    ) {
        self.lineBreak = lineBreak
        self.paragraph = paragraph
    }
}

/// Defines the schema for a footnote reference in a verse or a Hebrew Subtitle.
public struct VerseFootnoteReference: Codable, Hashable, Sendable {
    /// The ID of the note.
    public var noteId: Int

    public init(
        noteId: Int
    ) {
        self.noteId = noteId
    }
}

public enum HebrewSubtitleContent: Codable, Hashable, Sendable {
    case text(String)
    case formattedText(FormattedText)
    case verseFootnoteReference(VerseFootnoteReference)
    /// A value that this version of the SDK doesn't know about.
    case unknown(JSONValue)

    public init(from decoder: Decoder) throws {
        if let value = try? decoder.singleValueContainer().decode(String.self) {
            self = .text(value)
            return
        }
        if let container = try? decoder.container(keyedBy: AnyCodingKey.self) {
            if container.contains(AnyCodingKey("text")) {
                self = .formattedText(try FormattedText(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("noteId")) {
                self = .verseFootnoteReference(try VerseFootnoteReference(from: decoder))
                return
            }
        }
        self = .unknown(try JSONValue(from: decoder))
    }

    public func encode(to encoder: Encoder) throws {
        switch self {
        case .text(let value):
            var container = encoder.singleValueContainer()
            try container.encode(value)
        case .formattedText(let value):
            try value.encode(to: encoder)
        case .verseFootnoteReference(let value):
            try value.encode(to: encoder)
        case .unknown(let value):
            try value.encode(to: encoder)
        }
    }
}

/// Defines the schema for a Hebrew Subtitle in a chapter.
public struct ChapterHebrewSubtitle: Codable, Hashable, Sendable {
    public var type: String

    /// The content that is contained in the subtitle. Each element in the list could be a string, formatted text, or a footnote reference.
    public var content: [HebrewSubtitleContent]

    public init(
        type: String = "hebrew_subtitle",
        content: [HebrewSubtitleContent]
    ) {
        self.type = type
        self.content = content
    }
}

/// Defines the schema for information about a footnote.
public struct ChapterFootnote: Codable, Hashable, Sendable {
    /// The ID of the note that is referenced.
    public var noteId: Int

    /// The text of the footnote.
    public var text: String

    /// The verse reference for the footnote. Undefined if the footnote isn't associated with a specific verse.
    public var reference: Reference?

    /// The caller that should be used for the footnote. For footnotes, a "caller" is the character that is used in the text to reference to footnote. For example, in the text: Hello (a) World ---- (a) This is a footnote. The "(a)" is the caller. If "+", then the caller should be autogenerated. If null, then the caller should be empty. If a string, then the caller should be that string.
    public var caller: String?

    public init(
        noteId: Int,
        text: String,
        reference: Reference? = nil,
        caller: String? = nil
    ) {
        self.noteId = noteId
        self.text = text
        self.reference = reference
        self.caller = caller
    }

    /// The verse reference for the footnote. Undefined if the footnote isn't associated with a specific verse.
    public struct Reference: Codable, Hashable, Sendable {
        public var chapter: Int

        public var verse: Int

        public init(
            chapter: Int,
            verse: Int
        ) {
            self.chapter = chapter
            self.verse = verse
        }
    }
}

/// Defines the schema for the audio links for a book chapter.
public typealias TranslationBookChapterAudioLinks = [String: String]

/// Defines an interface that contains information about a book chapter in a translation, using the simplified chapter format.
public struct ApiSimpleTranslationBookChapter: Codable, Hashable, Sendable {
    /// The links to different audio versions for the chapter.
    public var thisChapterAudioLinks: TranslationBookChapterAudioLinks

    /// The links to the audio timings for different audio versions for the chapter. Relative to the API origin.
    public var thisChapterAudioTimings: [String: String]

    /// The translation information for the book chapter.
    public var translation: ApiTranslation

    /// The book information for the book chapter.
    public var book: ApiTranslationBook

    /// The API link for this chapter. Relative to the API origin.
    public var thisChapterLink: String

    public var thisChapterReference: TranslationChapterReference

    /// The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
    public var nextChapterApiLink: String?

    /// The reference for the next chapter. Null if this is the last chapter in the translation.
    public var nextChapterReference: TranslationChapterReference?

    /// The links to the audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
    public var nextChapterAudioLinks: [String: String]?

    /// The links to the audio timings for different audio versions for the next chapter. Relative to the API origin. Null if this is the last chapter in the translation.
    public var nextChapterAudioTimings: [String: String]?

    /// The links to the audio timings for different audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
    public var previousChapterAudioTimings: [String: String]?

    /// The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
    public var previousChapterApiLink: String?

    /// The reference for the previous chapter. Null if this is the first chapter in the translation.
    public var previousChapterReference: TranslationChapterReference?

    /// The links to the audio versions for the previous chapter. Relative to the API origin. Null if this is the first chapter in the translation.
    public var previousChapterAudioLinks: [String: String]?

    /// The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
    public var thisChapterWordsLink: String?

    /// The link to the word-level annotations for the next chapter. Relative to the API origin. Omitted if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
    public var nextChapterWordsLink: String?

    /// The link to the word-level annotations for the previous chapter. Relative to the API origin. Omitted if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
    public var previousChapterWordsLink: String?

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The simplified information for the chapter. Each verse contains a single text string, and the footnotes and formatting are represented by offsets into that string.
    public var chapter: SimpleChapterData

    /// The API link to the regular (non-simplified) version of this chapter. Relative to the API origin.
    public var fullChapterApiLink: String

    public init(
        thisChapterAudioLinks: TranslationBookChapterAudioLinks,
        thisChapterAudioTimings: [String: String],
        translation: ApiTranslation,
        book: ApiTranslationBook,
        thisChapterLink: String,
        thisChapterReference: TranslationChapterReference,
        nextChapterApiLink: String? = nil,
        nextChapterReference: TranslationChapterReference? = nil,
        nextChapterAudioLinks: [String: String]? = nil,
        nextChapterAudioTimings: [String: String]? = nil,
        previousChapterAudioTimings: [String: String]? = nil,
        previousChapterApiLink: String? = nil,
        previousChapterReference: TranslationChapterReference? = nil,
        previousChapterAudioLinks: [String: String]? = nil,
        thisChapterWordsLink: String? = nil,
        nextChapterWordsLink: String? = nil,
        previousChapterWordsLink: String? = nil,
        numberOfVerses: Int,
        chapter: SimpleChapterData,
        fullChapterApiLink: String
    ) {
        self.thisChapterAudioLinks = thisChapterAudioLinks
        self.thisChapterAudioTimings = thisChapterAudioTimings
        self.translation = translation
        self.book = book
        self.thisChapterLink = thisChapterLink
        self.thisChapterReference = thisChapterReference
        self.nextChapterApiLink = nextChapterApiLink
        self.nextChapterReference = nextChapterReference
        self.nextChapterAudioLinks = nextChapterAudioLinks
        self.nextChapterAudioTimings = nextChapterAudioTimings
        self.previousChapterAudioTimings = previousChapterAudioTimings
        self.previousChapterApiLink = previousChapterApiLink
        self.previousChapterReference = previousChapterReference
        self.previousChapterAudioLinks = previousChapterAudioLinks
        self.thisChapterWordsLink = thisChapterWordsLink
        self.nextChapterWordsLink = nextChapterWordsLink
        self.previousChapterWordsLink = previousChapterWordsLink
        self.numberOfVerses = numberOfVerses
        self.chapter = chapter
        self.fullChapterApiLink = fullChapterApiLink
    }
}

/// Defines the schema for the data in a simplified chapter. Unlike the regular chapter format, each verse contains a single text string and the footnotes/formatting are represented by offsets into that string.
public struct SimpleChapterData: Codable, Hashable, Sendable {
    /// The number of the chapter.
    public var number: Int

    /// The content of the chapter.
    public var content: [SimpleChapterContent]

    /// The list of footnotes that could not be associated with a verse. Footnotes that belong to a verse are included on the verse itself, so this list is usually empty.
    public var footnotes: [ChapterFootnote]

    public init(
        number: Int,
        content: [SimpleChapterContent],
        footnotes: [ChapterFootnote]
    ) {
        self.number = number
        self.content = content
        self.footnotes = footnotes
    }
}

/// Defines a union type that represents a single piece of content in a simplified chapter. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.
public enum SimpleChapterContent: Codable, Hashable, Sendable {
    case heading(SimpleChapterHeading)
    case lineBreak(ChapterLineBreak)
    case verse(SimpleChapterVerse)
    case hebrewSubtitle(SimpleChapterHebrewSubtitle)
    /// A value that this version of the SDK doesn't know about.
    case unknown(JSONValue)

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: AnyCodingKey.self)
        let discriminator = try container.decodeIfPresent(String.self, forKey: AnyCodingKey("type"))
        switch discriminator ?? "" {
        case "heading":
            self = .heading(try SimpleChapterHeading(from: decoder))
        case "line_break":
            self = .lineBreak(try ChapterLineBreak(from: decoder))
        case "verse":
            self = .verse(try SimpleChapterVerse(from: decoder))
        case "hebrew_subtitle":
            self = .hebrewSubtitle(try SimpleChapterHebrewSubtitle(from: decoder))
        default:
            self = .unknown(try JSONValue(from: decoder))
        }
    }

    public func encode(to encoder: Encoder) throws {
        switch self {
        case .heading(let value):
            try value.encode(to: encoder)
        case .lineBreak(let value):
            try value.encode(to: encoder)
        case .verse(let value):
            try value.encode(to: encoder)
        case .hebrewSubtitle(let value):
            try value.encode(to: encoder)
        case .unknown(let value):
            try value.encode(to: encoder)
        }
    }
}

/// Defines the schema for a heading in a simplified chapter.
public struct SimpleChapterHeading: Codable, Hashable, Sendable {
    public var type: String

    /// The text of the heading.
    public var text: String

    public init(
        type: String = "heading",
        text: String
    ) {
        self.type = type
        self.text = text
    }
}

/// Defines the schema for a verse in a simplified chapter.
public struct SimpleChapterVerse: Codable, Hashable, Sendable {
    public var type: String

    /// The number of the verse.
    public var number: Int

    /// The text of the verse. Lines of poetry and line breaks are separated by newline (\n) characters.
    public var text: String

    /// The footnotes that occur in the verse.
    public var footnotes: [SimpleVerseFootnote]

    /// The headings that occur in the middle of the verse. Omitted if the verse contains no inline headings.
    public var headings: [SimpleInlineHeading]?

    /// The positions and source styles of paragraphs that start inside the verse.
    public var paragraphs: [SimpleVerseParagraph]?

    /// The ranges of the verse text that represent the Words of Jesus. Omitted if the verse contains none.
    public var wordsOfJesus: [SimpleTextRange]?

    /// The ranges of the verse text that represent lines of poetry. Omitted if the verse contains none.
    public var poem: [SimplePoemRange]?

    public init(
        type: String = "verse",
        number: Int,
        text: String,
        footnotes: [SimpleVerseFootnote],
        headings: [SimpleInlineHeading]? = nil,
        paragraphs: [SimpleVerseParagraph]? = nil,
        wordsOfJesus: [SimpleTextRange]? = nil,
        poem: [SimplePoemRange]? = nil
    ) {
        self.type = type
        self.number = number
        self.text = text
        self.footnotes = footnotes
        self.headings = headings
        self.paragraphs = paragraphs
        self.wordsOfJesus = wordsOfJesus
        self.poem = poem
    }
}

/// Defines the schema for a footnote in a simplified verse. Unlike the footnotes in the regular chapter format, simplified footnotes include the position that they occur at in the verse text.
public struct SimpleVerseFootnote: Codable, Hashable, Sendable {
    /// The ID of the note.
    public var noteId: Int

    /// The index in the verse text that the footnote caller should be inserted at. Measured in UTF-16 code units.
    public var offset: Int

    /// The text of the footnote.
    public var text: String

    /// The caller that should be used for the footnote. If "+", then the caller should be autogenerated. If null, then the caller should be empty. If a string, then the caller should be that string.
    public var caller: String?

    public init(
        noteId: Int,
        offset: Int,
        text: String,
        caller: String? = nil
    ) {
        self.noteId = noteId
        self.offset = offset
        self.text = text
        self.caller = caller
    }
}

/// Defines the schema for a heading that is embedded in a simplified verse.
public struct SimpleInlineHeading: Codable, Hashable, Sendable {
    /// The index in the verse text that the heading occurs at. Measured in UTF-16 code units.
    public var offset: Int

    /// The text of the heading.
    public var text: String

    public init(
        offset: Int,
        text: String
    ) {
        self.offset = offset
        self.text = text
    }
}

/// A paragraph start in the text of a simplified verse.
public struct SimpleVerseParagraph: Codable, Hashable, Sendable {
    /// The index in the verse text, measured in UTF-16 code units.
    public var offset: Int

    /// The source paragraph marker without its backslash.
    public var style: String

    public init(
        offset: Int,
        style: String
    ) {
        self.offset = offset
        self.style = style
    }
}

/// Defines the schema for a range of text inside a simplified verse. Ranges are expressed as offsets into the text of the verse that contains them, measured in UTF-16 code units.
public struct SimpleTextRange: Codable, Hashable, Sendable {
    /// The index of the first character of the range in the verse text. Measured in UTF-16 code units.
    public var start: Int

    /// The index after the last character of the range in the verse text. Measured in UTF-16 code units.
    public var end: Int

    public init(
        start: Int,
        end: Int
    ) {
        self.start = start
        self.end = end
    }
}

/// Defines the schema for a range of text inside a simplified verse that represents a line of poetry.
public struct SimplePoemRange: Codable, Hashable, Sendable {
    /// The index of the first character of the range in the verse text. Measured in UTF-16 code units.
    public var start: Int

    /// The index after the last character of the range in the verse text. Measured in UTF-16 code units.
    public var end: Int

    /// The level of indent that the line of poetry should be displayed with.
    public var level: Int

    public init(
        start: Int,
        end: Int,
        level: Int
    ) {
        self.start = start
        self.end = end
        self.level = level
    }
}

/// Defines the schema for a Hebrew Subtitle in a simplified chapter.
public struct SimpleChapterHebrewSubtitle: Codable, Hashable, Sendable {
    /// The text of the verse. Lines of poetry and line breaks are separated by newline (\n) characters.
    public var text: String

    /// The footnotes that occur in the verse.
    public var footnotes: [SimpleVerseFootnote]

    /// The headings that occur in the middle of the verse. Omitted if the verse contains no inline headings.
    public var headings: [SimpleInlineHeading]?

    /// The positions and source styles of paragraphs that start inside the verse.
    public var paragraphs: [SimpleVerseParagraph]?

    /// The ranges of the verse text that represent the Words of Jesus. Omitted if the verse contains none.
    public var wordsOfJesus: [SimpleTextRange]?

    /// The ranges of the verse text that represent lines of poetry. Omitted if the verse contains none.
    public var poem: [SimplePoemRange]?

    public var type: String

    public init(
        text: String,
        footnotes: [SimpleVerseFootnote],
        headings: [SimpleInlineHeading]? = nil,
        paragraphs: [SimpleVerseParagraph]? = nil,
        wordsOfJesus: [SimpleTextRange]? = nil,
        poem: [SimplePoemRange]? = nil,
        type: String = "hebrew_subtitle"
    ) {
        self.text = text
        self.footnotes = footnotes
        self.headings = headings
        self.paragraphs = paragraphs
        self.wordsOfJesus = wordsOfJesus
        self.poem = poem
        self.type = type
    }
}

/// Defines an interface that contains the audio timings for a book chapter, for a specific reader.
public struct ApiTranslationBookChapterAudioTimings: Codable, Hashable, Sendable {
    /// The ID of the translation.
    public var translationId: String

    /// The ID of the book.
    public var bookId: String

    /// The number of the chapter.
    public var chapterNumber: Int

    /// The reader for the chapter.
    public var reader: String

    /// The link to the audio for these timings.
    public var audioLink: String

    /// The link to the information for this chapter.
    public var thisChapterLink: String

    /// The link to the information for the next chapter. Null if this is the last chapter in the translation.
    public var nextChapterLink: String?

    /// The link to the information for the previous chapter. Null if this is the first chapter in the translation.
    public var previousChapterLink: String?

    /// The link to this audio timings file.
    public var thisChapterAudioTimingsLink: String

    /// The link to the timings for the next chapter. Null if this is the last chapter in the translation.
    public var nextChapterAudioTimingsLink: String?

    /// The link to the timings for the previous chapter. Null if this is the first chapter in the translation.
    public var previousChapterAudioTimingsLink: String?

    /// The times in seconds at which each verse starts, in order. The first number (index 0) is the time in the recording at which the first verse starts.
    public var verses: [Double]

    public init(
        translationId: String,
        bookId: String,
        chapterNumber: Int,
        reader: String,
        audioLink: String,
        thisChapterLink: String,
        nextChapterLink: String? = nil,
        previousChapterLink: String? = nil,
        thisChapterAudioTimingsLink: String,
        nextChapterAudioTimingsLink: String? = nil,
        previousChapterAudioTimingsLink: String? = nil,
        verses: [Double]
    ) {
        self.translationId = translationId
        self.bookId = bookId
        self.chapterNumber = chapterNumber
        self.reader = reader
        self.audioLink = audioLink
        self.thisChapterLink = thisChapterLink
        self.nextChapterLink = nextChapterLink
        self.previousChapterLink = previousChapterLink
        self.thisChapterAudioTimingsLink = thisChapterAudioTimingsLink
        self.nextChapterAudioTimingsLink = nextChapterAudioTimingsLink
        self.previousChapterAudioTimingsLink = previousChapterAudioTimingsLink
        self.verses = verses
    }
}

/// Defines an interface that contains the word-level annotations for a book chapter.
public struct ApiTranslationBookChapterWords: Codable, Hashable, Sendable {
    /// The ID of the translation.
    public var translationId: String

    /// The ID of the book.
    public var bookId: String

    /// The number of the chapter.
    public var chapterNumber: Int

    /// The link to the information for this chapter.
    public var thisChapterLink: String

    /// The link to the information for the next chapter. Null if this is the last chapter in the translation.
    public var nextChapterLink: String?

    /// The link to the information for the previous chapter. Null if this is the first chapter in the translation.
    public var previousChapterLink: String?

    /// The link to this words file.
    public var thisChapterWordsLink: String

    /// The link to the words for the next chapter. Null if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
    public var nextChapterWordsLink: String?

    /// The link to the words for the previous chapter. Null if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
    public var previousChapterWordsLink: String?

    /// The annotated words for each verse in the chapter, keyed by verse number. Each list is in the order that the words occur in the verse.
    public var verses: [String: [ChapterWord]]

    public init(
        translationId: String,
        bookId: String,
        chapterNumber: Int,
        thisChapterLink: String,
        nextChapterLink: String? = nil,
        previousChapterLink: String? = nil,
        thisChapterWordsLink: String,
        nextChapterWordsLink: String? = nil,
        previousChapterWordsLink: String? = nil,
        verses: [String: [ChapterWord]]
    ) {
        self.translationId = translationId
        self.bookId = bookId
        self.chapterNumber = chapterNumber
        self.thisChapterLink = thisChapterLink
        self.nextChapterLink = nextChapterLink
        self.previousChapterLink = previousChapterLink
        self.thisChapterWordsLink = thisChapterWordsLink
        self.nextChapterWordsLink = nextChapterWordsLink
        self.previousChapterWordsLink = previousChapterWordsLink
        self.verses = verses
    }
}

/// Defines the schema for a word-level annotation in a chapter. The annotation is anchored to a range of characters in a single item of a verse's content.
public struct ChapterWord: Codable, Hashable, Sendable {
    /// The index of the item in the verse's content array that the annotation applies to.
    public var contentIndex: Int

    /// The index of the first character of the annotated word in the content item's text.
    public var start: Int

    /// The index after the last character of the annotated word in the content item's text. That is, text.slice(start, end) is the annotated word.
    public var end: Int

    /// The Strong's number(s) for the word. Omitted if the translation only provided other annotations for the word.
    public var strongs: [String]?

    /// The dictionary (citation) form of the word. Omitted if the translation did not provide one.
    public var lemma: String?

    /// The morphology parse code for the word. Omitted if the translation did not provide one.
    public var morph: String?

    /// The pointer to the word in the source text, in the <sourceName>:<location> format. Omitted if the translation did not provide one.
    public var srcloc: String?

    /// Which occurrence of the source word this word is. 1-based. Omitted if the translation did not provide one.
    public var occurrence: Int?

    /// The total number of times that the source word occurs. Omitted if the translation did not provide one.
    public var occurrences: Int?

    public init(
        contentIndex: Int,
        start: Int,
        end: Int,
        strongs: [String]? = nil,
        lemma: String? = nil,
        morph: String? = nil,
        srcloc: String? = nil,
        occurrence: Int? = nil,
        occurrences: Int? = nil
    ) {
        self.contentIndex = contentIndex
        self.start = start
        self.end = end
        self.strongs = strongs
        self.lemma = lemma
        self.morph = morph
        self.srcloc = srcloc
        self.occurrence = occurrence
        self.occurrences = occurrences
    }
}

/// Defines an interface that contains the word-level annotations for a book chapter, with their offsets remapped onto the text of each simplified verse.
public struct ApiSimpleTranslationBookChapterWords: Codable, Hashable, Sendable {
    /// The ID of the translation.
    public var translationId: String

    /// The ID of the book.
    public var bookId: String

    /// The number of the chapter.
    public var chapterNumber: Int

    /// The link to the information for this chapter.
    public var thisChapterLink: String

    /// The link to the information for the next chapter. Null if this is the last chapter in the translation.
    public var nextChapterLink: String?

    /// The link to the information for the previous chapter. Null if this is the first chapter in the translation.
    public var previousChapterLink: String?

    /// The link to this words file.
    public var thisChapterWordsLink: String

    /// The link to the words for the next chapter. Null if this is the last chapter in the translation, or if the next chapter doesn't have any word-level annotations.
    public var nextChapterWordsLink: String?

    /// The link to the words for the previous chapter. Null if this is the first chapter in the translation, or if the previous chapter doesn't have any word-level annotations.
    public var previousChapterWordsLink: String?

    /// The annotated words for each verse in the chapter, keyed by verse number. Each list is in the order that the words occur in the verse. The offsets are into the text of the simplified verse.
    public var verses: [String: [SimpleChapterWord]]

    public init(
        translationId: String,
        bookId: String,
        chapterNumber: Int,
        thisChapterLink: String,
        nextChapterLink: String? = nil,
        previousChapterLink: String? = nil,
        thisChapterWordsLink: String,
        nextChapterWordsLink: String? = nil,
        previousChapterWordsLink: String? = nil,
        verses: [String: [SimpleChapterWord]]
    ) {
        self.translationId = translationId
        self.bookId = bookId
        self.chapterNumber = chapterNumber
        self.thisChapterLink = thisChapterLink
        self.nextChapterLink = nextChapterLink
        self.previousChapterLink = previousChapterLink
        self.thisChapterWordsLink = thisChapterWordsLink
        self.nextChapterWordsLink = nextChapterWordsLink
        self.previousChapterWordsLink = previousChapterWordsLink
        self.verses = verses
    }
}

/// Defines the schema for a word-level annotation in a simplified chapter. The annotation is anchored to a range of characters in the verse's text.
public struct SimpleChapterWord: Codable, Hashable, Sendable {
    /// The index of the first character of the annotated word in the content item's text.
    public var start: Int

    /// The index after the last character of the annotated word in the content item's text. That is, text.slice(start, end) is the annotated word.
    public var end: Int

    /// The Strong's number(s) for the word. Omitted if the translation only provided other annotations for the word.
    public var strongs: [String]?

    /// The dictionary (citation) form of the word. Omitted if the translation did not provide one.
    public var lemma: String?

    /// The morphology parse code for the word. Omitted if the translation did not provide one.
    public var morph: String?

    /// The pointer to the word in the source text, in the <sourceName>:<location> format. Omitted if the translation did not provide one.
    public var srcloc: String?

    /// Which occurrence of the source word this word is. 1-based. Omitted if the translation did not provide one.
    public var occurrence: Int?

    /// The total number of times that the source word occurs. Omitted if the translation did not provide one.
    public var occurrences: Int?

    public init(
        start: Int,
        end: Int,
        strongs: [String]? = nil,
        lemma: String? = nil,
        morph: String? = nil,
        srcloc: String? = nil,
        occurrence: Int? = nil,
        occurrences: Int? = nil
    ) {
        self.start = start
        self.end = end
        self.strongs = strongs
        self.lemma = lemma
        self.morph = morph
        self.srcloc = srcloc
        self.occurrence = occurrence
        self.occurrences = occurrences
    }
}

/// Defines the complete translation download data. Maps to the /api/:translationId/complete.json endpoint.
public struct ApiTranslationComplete: Codable, Hashable, Sendable {
    /// The translation metadata.
    public var translation: ApiTranslation

    /// The complete list of books with all their chapters.
    public var books: [ApiTranslationCompleteBook]

    public init(
        translation: ApiTranslation,
        books: [ApiTranslationCompleteBook]
    ) {
        self.translation = translation
        self.books = books
    }
}

/// A book in the complete translation download.
public struct ApiTranslationCompleteBook: Codable, Hashable, Sendable {
    public var id: BookId

    /// The name that the translation provided for the book.
    public var name: String

    /// The common name for the book.
    public var commonName: String

    /// The short name (abbreviation) that the translation provided for the book. If not available, then one was not provided by the translation.
    public var shortName: String?

    /// The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.
    public var title: String?

    /// The numerical order of the book in the translation.
    public var order: Int

    /// Whether the book is an apocryphal book.
    public var isApocryphal: Bool?

    /// The number of chapters in the book.
    public var numberOfChapters: Int

    /// The total number of verses in the book.
    public var totalNumberOfVerses: Int

    /// The complete list of chapters with all content.
    public var chapters: [TranslationCompleteChapter]

    public init(
        id: BookId,
        name: String,
        commonName: String,
        shortName: String? = nil,
        title: String? = nil,
        order: Int,
        isApocryphal: Bool? = nil,
        numberOfChapters: Int,
        totalNumberOfVerses: Int,
        chapters: [TranslationCompleteChapter]
    ) {
        self.id = id
        self.name = name
        self.commonName = commonName
        self.shortName = shortName
        self.title = title
        self.order = order
        self.isApocryphal = isApocryphal
        self.numberOfChapters = numberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
        self.chapters = chapters
    }
}

/// A chapter in the complete translation download.
public struct TranslationCompleteChapter: Codable, Hashable, Sendable {
    /// The information for the chapter.
    public var chapter: Chapter

    /// The links to different audio versions for the chapter.
    public var thisChapterAudioLinks: TranslationBookChapterAudioLinks

    /// The audio timings (per-verse start times, in seconds) for different audio versions for the chapter.
    public var thisChapterAudioTimings: TranslationBookChapterAudioTimings

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
    public var thisChapterWordsLink: String?

    public init(
        chapter: Chapter,
        thisChapterAudioLinks: TranslationBookChapterAudioLinks,
        thisChapterAudioTimings: TranslationBookChapterAudioTimings,
        numberOfVerses: Int,
        thisChapterWordsLink: String? = nil
    ) {
        self.chapter = chapter
        self.thisChapterAudioLinks = thisChapterAudioLinks
        self.thisChapterAudioTimings = thisChapterAudioTimings
        self.numberOfVerses = numberOfVerses
        self.thisChapterWordsLink = thisChapterWordsLink
    }

    public typealias Chapter = ApiTranslationBookChapter.Chapter
}

/// Defines the schema for the audio timings for a book chapter. Maps a reader ID to the list of times (in seconds) that each verse starts, in verse order.
public typealias TranslationBookChapterAudioTimings = [String: [Double]]

/// Defines the complete translation download data, using the simplified chapter format. Maps to the /api/:translationId/complete.simple.json endpoint.
public struct ApiSimpleTranslationComplete: Codable, Hashable, Sendable {
    /// The translation metadata.
    public var translation: ApiTranslation

    /// The complete list of books with all their chapters.
    public var books: [ApiSimpleTranslationCompleteBook]

    public init(
        translation: ApiTranslation,
        books: [ApiSimpleTranslationCompleteBook]
    ) {
        self.translation = translation
        self.books = books
    }
}

/// A book in the complete translation download, using the simplified chapter format.
public struct ApiSimpleTranslationCompleteBook: Codable, Hashable, Sendable {
    public var id: BookId

    /// The name that the translation provided for the book.
    public var name: String

    /// The common name for the book.
    public var commonName: String

    /// The short name (abbreviation) that the translation provided for the book. If not available, then one was not provided by the translation.
    public var shortName: String?

    /// The title of the book. This is usually a more descriptive version of the book name. If not available, then one was not provided by the translation.
    public var title: String?

    /// The numerical order of the book in the translation.
    public var order: Int

    /// Whether the book is an apocryphal book.
    public var isApocryphal: Bool?

    /// The number of chapters in the book.
    public var numberOfChapters: Int

    /// The total number of verses in the book.
    public var totalNumberOfVerses: Int

    /// The complete list of chapters with all content.
    public var chapters: [SimpleTranslationCompleteChapter]

    public init(
        id: BookId,
        name: String,
        commonName: String,
        shortName: String? = nil,
        title: String? = nil,
        order: Int,
        isApocryphal: Bool? = nil,
        numberOfChapters: Int,
        totalNumberOfVerses: Int,
        chapters: [SimpleTranslationCompleteChapter]
    ) {
        self.id = id
        self.name = name
        self.commonName = commonName
        self.shortName = shortName
        self.title = title
        self.order = order
        self.isApocryphal = isApocryphal
        self.numberOfChapters = numberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
        self.chapters = chapters
    }
}

/// A chapter in the complete translation download, using the simplified chapter format.
public struct SimpleTranslationCompleteChapter: Codable, Hashable, Sendable {
    /// The simplified information for the chapter.
    public var chapter: SimpleChapterData

    /// The links to different audio versions for the chapter.
    public var thisChapterAudioLinks: TranslationBookChapterAudioLinks

    /// The audio timings (per-verse start times, in seconds) for different audio versions for the chapter.
    public var thisChapterAudioTimings: TranslationBookChapterAudioTimings

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The link to the word-level annotations for this chapter. Relative to the API origin. Omitted if the chapter doesn't have any word-level annotations.
    public var thisChapterWordsLink: String?

    public init(
        chapter: SimpleChapterData,
        thisChapterAudioLinks: TranslationBookChapterAudioLinks,
        thisChapterAudioTimings: TranslationBookChapterAudioTimings,
        numberOfVerses: Int,
        thisChapterWordsLink: String? = nil
    ) {
        self.chapter = chapter
        self.thisChapterAudioLinks = thisChapterAudioLinks
        self.thisChapterAudioTimings = thisChapterAudioTimings
        self.numberOfVerses = numberOfVerses
        self.thisChapterWordsLink = thisChapterWordsLink
    }
}

/// The list of available commentaries. Maps to the /api/available-commentaries.json endpoint.
public struct ApiAvailableCommentaries: Codable, Hashable, Sendable {
    /// The list of commentaries that are available in the API.
    public var commentaries: [ApiCommentary]

    public init(
        commentaries: [ApiCommentary]
    ) {
        self.commentaries = commentaries
    }
}

/// Defines a commentary that is used in the API.
public struct ApiCommentary: Codable, Hashable, Sendable {
    /// The ID of the commentary.
    public var id: String

    /// The name of the commentary.
    public var name: String

    /// The website for the commentary.
    public var website: String

    /// The URL that the license for the commentary can be found.
    public var licenseUrl: String

    /// The API-added notes for the license.
    public var licenseNotes: String?

    /// The English name for the commentary.
    public var englishName: String

    /// The ISO 639 3-letter language tag that the translation is primarily in.
    public var language: String

    /// The direction that the language is written in. `ltr` indicates that the text is written from the left side of the page to the right. `rtl` indicates that the text is written from the right side of the page to the left.
    public var textDirection: TextDirection

    /// The API link for the list of books for this commentary. Relative to the API origin.
    public var listOfBooksApiLink: String

    /// The API link for the list of profiles for this commentary. Relative to the API origin.
    public var listOfProfilesApiLink: String

    public var availableFormats: [ApiFormat]

    /// The number of books that are contained in this commentary. Complete commentaries should have the same number of books as the Bible (66).
    public var numberOfBooks: Int

    /// The total number of chapters that are contained in this commentary. Complete commentaries should have the same number of chapters as the Bible (1,189).
    public var totalNumberOfChapters: Int

    /// The total number of verses that are contained in this commentary. Complete commentaries should have the same number of verses as the Bible (around 31,102 - some commentaries exclude verses based on the aparent likelyhood of existing in the original source texts).
    public var totalNumberOfVerses: Int

    /// The total number of profiles that are contained in this commentary. Profiles are used to provide additional information about people and people groups that are mentioned in the Bible.
    public var totalNumberOfProfiles: Int

    /// Gets the name of the language that the commentary is in. Null or undefined if the name of the language is not known.
    public var languageName: String?

    /// Gets the name of the language in English. Null or undefined if the language doesn't have an english name.
    public var languageEnglishName: String?

    public init(
        id: String,
        name: String,
        website: String,
        licenseUrl: String,
        licenseNotes: String? = nil,
        englishName: String,
        language: String,
        textDirection: TextDirection,
        listOfBooksApiLink: String,
        listOfProfilesApiLink: String,
        availableFormats: [ApiFormat],
        numberOfBooks: Int,
        totalNumberOfChapters: Int,
        totalNumberOfVerses: Int,
        totalNumberOfProfiles: Int,
        languageName: String? = nil,
        languageEnglishName: String? = nil
    ) {
        self.id = id
        self.name = name
        self.website = website
        self.licenseUrl = licenseUrl
        self.licenseNotes = licenseNotes
        self.englishName = englishName
        self.language = language
        self.textDirection = textDirection
        self.listOfBooksApiLink = listOfBooksApiLink
        self.listOfProfilesApiLink = listOfProfilesApiLink
        self.availableFormats = availableFormats
        self.numberOfBooks = numberOfBooks
        self.totalNumberOfChapters = totalNumberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
        self.totalNumberOfProfiles = totalNumberOfProfiles
        self.languageName = languageName
        self.languageEnglishName = languageEnglishName
    }
}

/// Defines an interface that contains information about the books that are available for a commentary.
public struct ApiCommentaryBooks: Codable, Hashable, Sendable {
    /// The commentary information for the books.
    public var commentary: ApiCommentary

    /// The list of books that are available for the commentary.
    public var books: [ApiCommentaryBook]

    public init(
        commentary: ApiCommentary,
        books: [ApiCommentaryBook]
    ) {
        self.commentary = commentary
        self.books = books
    }
}

/// Defines a schema that contains information about a commentary book.
public struct ApiCommentaryBook: Codable, Hashable, Sendable {
    public var id: BookId

    /// The name that the commentary provided for the book.
    public var name: String

    /// The common name for the book.
    public var commonName: String

    /// The commentary's introduction for the book. Undefined if the commentary didn't provide an introduction for the book.
    public var introduction: String?

    /// The summary of the commentary's introduction for the book. Undefined if the commentary didn't provide a summary for the book.
    public var introductionSummary: String?

    /// The order of the book in the Bible.
    public var order: Int

    /// The number of the first chapter in the book. Null if the comentary book has no chapters.
    public var firstChapterNumber: Int?

    /// The link to the first chapter of the book. Null if the comentary book has no chapters.
    public var firstChapterApiLink: String?

    /// The reference for the first chapter in the book. Null if the comentary book has no chapters.
    public var firstChapterReference: CommentaryChapterReference?

    /// The number of the last chapter in the book. Null if the comentary book has no chapters.
    public var lastChapterNumber: Int?

    /// The link to the last chapter of the book. Null if the comentary book has no chapters.
    public var lastChapterApiLink: String?

    /// The reference for the last chapter in the book. Null if the comentary book has no chapters.
    public var lastChapterReference: CommentaryChapterReference?

    /// The number of chapters that the book contains.
    public var numberOfChapters: Int

    /// The number of verses that the book contains.
    public var totalNumberOfVerses: Int

    public init(
        id: BookId,
        name: String,
        commonName: String,
        introduction: String? = nil,
        introductionSummary: String? = nil,
        order: Int,
        firstChapterNumber: Int? = nil,
        firstChapterApiLink: String? = nil,
        firstChapterReference: CommentaryChapterReference? = nil,
        lastChapterNumber: Int? = nil,
        lastChapterApiLink: String? = nil,
        lastChapterReference: CommentaryChapterReference? = nil,
        numberOfChapters: Int,
        totalNumberOfVerses: Int
    ) {
        self.id = id
        self.name = name
        self.commonName = commonName
        self.introduction = introduction
        self.introductionSummary = introductionSummary
        self.order = order
        self.firstChapterNumber = firstChapterNumber
        self.firstChapterApiLink = firstChapterApiLink
        self.firstChapterReference = firstChapterReference
        self.lastChapterNumber = lastChapterNumber
        self.lastChapterApiLink = lastChapterApiLink
        self.lastChapterReference = lastChapterReference
        self.numberOfChapters = numberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
    }
}

/// Defines a reference to a chapter in a commentary.
public struct CommentaryChapterReference: Codable, Hashable, Sendable {
    /// The ID of the commentary that the chapter reference is for.
    public var commentaryId: String

    public var book: BookId

    /// The chapter number of the chapter reference.
    public var chapter: Int

    public init(
        commentaryId: String,
        book: BookId,
        chapter: Int
    ) {
        self.commentaryId = commentaryId
        self.book = book
        self.chapter = chapter
    }
}

/// Defines a schema that contains information about a book chapter in a commentary.
public struct ApiCommentaryBookChapter: Codable, Hashable, Sendable {
    /// The information for the chapter.
    public var chapter: Chapter

    /// The commentary information for the book chapter.
    public var commentary: ApiCommentary

    /// The book information for the book chapter.
    public var book: ApiCommentaryBook

    /// The API link for this chapter. Relative to the API origin.
    public var thisChapterLink: String

    public var thisChapterReference: CommentaryChapterReference

    /// The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the commentary.
    public var nextChapterApiLink: String?

    /// The reference for the next chapter. Null if this is the last chapter in the commentary.
    public var nextChapterReference: CommentaryChapterReference?

    /// The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the commentary.
    public var previousChapterApiLink: String?

    /// The reference for the previous chapter. Null if this is the first chapter in the commentary.
    public var previousChapterReference: CommentaryChapterReference?

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The API link to the simplified version of this chapter. Relative to the API origin. Omitted if simplified chapters are not available.
    public var simpleChapterApiLink: String?

    public init(
        chapter: Chapter,
        commentary: ApiCommentary,
        book: ApiCommentaryBook,
        thisChapterLink: String,
        thisChapterReference: CommentaryChapterReference,
        nextChapterApiLink: String? = nil,
        nextChapterReference: CommentaryChapterReference? = nil,
        previousChapterApiLink: String? = nil,
        previousChapterReference: CommentaryChapterReference? = nil,
        numberOfVerses: Int,
        simpleChapterApiLink: String? = nil
    ) {
        self.chapter = chapter
        self.commentary = commentary
        self.book = book
        self.thisChapterLink = thisChapterLink
        self.thisChapterReference = thisChapterReference
        self.nextChapterApiLink = nextChapterApiLink
        self.nextChapterReference = nextChapterReference
        self.previousChapterApiLink = previousChapterApiLink
        self.previousChapterReference = previousChapterReference
        self.numberOfVerses = numberOfVerses
        self.simpleChapterApiLink = simpleChapterApiLink
    }

    /// The information for the chapter.
    public struct Chapter: Codable, Hashable, Sendable {
        /// The number of the chapter.
        public var number: Int

        /// The introduction that the commentary provided to the chapter. Not all commentaries provide an introduction to a chapter.
        public var introduction: String?

        /// The content of the chapter.
        public var content: [ChapterVerse]

        public init(
            number: Int,
            introduction: String? = nil,
            content: [ChapterVerse]
        ) {
            self.number = number
            self.introduction = introduction
            self.content = content
        }
    }
}

/// Defines a schema that contains information about a book chapter in a commentary, using the simplified chapter format.
public struct ApiSimpleCommentaryBookChapter: Codable, Hashable, Sendable {
    /// The commentary information for the book chapter.
    public var commentary: ApiCommentary

    /// The book information for the book chapter.
    public var book: ApiCommentaryBook

    /// The API link for this chapter. Relative to the API origin.
    public var thisChapterLink: String

    public var thisChapterReference: CommentaryChapterReference

    /// The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the commentary.
    public var nextChapterApiLink: String?

    /// The reference for the next chapter. Null if this is the last chapter in the commentary.
    public var nextChapterReference: CommentaryChapterReference?

    /// The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the commentary.
    public var previousChapterApiLink: String?

    /// The reference for the previous chapter. Null if this is the first chapter in the commentary.
    public var previousChapterReference: CommentaryChapterReference?

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The simplified information for the chapter. Each verse contains a single text string, and the footnotes and formatting are represented by offsets into that string.
    public var chapter: SimpleCommentaryChapterData

    /// The API link to the regular (non-simplified) version of this chapter. Relative to the API origin.
    public var fullChapterApiLink: String

    public init(
        commentary: ApiCommentary,
        book: ApiCommentaryBook,
        thisChapterLink: String,
        thisChapterReference: CommentaryChapterReference,
        nextChapterApiLink: String? = nil,
        nextChapterReference: CommentaryChapterReference? = nil,
        previousChapterApiLink: String? = nil,
        previousChapterReference: CommentaryChapterReference? = nil,
        numberOfVerses: Int,
        chapter: SimpleCommentaryChapterData,
        fullChapterApiLink: String
    ) {
        self.commentary = commentary
        self.book = book
        self.thisChapterLink = thisChapterLink
        self.thisChapterReference = thisChapterReference
        self.nextChapterApiLink = nextChapterApiLink
        self.nextChapterReference = nextChapterReference
        self.previousChapterApiLink = previousChapterApiLink
        self.previousChapterReference = previousChapterReference
        self.numberOfVerses = numberOfVerses
        self.chapter = chapter
        self.fullChapterApiLink = fullChapterApiLink
    }
}

/// Defines the schema for the data in a simplified commentary chapter.
public struct SimpleCommentaryChapterData: Codable, Hashable, Sendable {
    /// The number of the chapter.
    public var number: Int

    /// The introduction that the commentary provided to the chapter. Not all commentaries provide an introduction to a chapter.
    public var introduction: String?

    /// The content of the chapter.
    public var content: [SimpleChapterVerse]

    public init(
        number: Int,
        introduction: String? = nil,
        content: [SimpleChapterVerse]
    ) {
        self.number = number
        self.introduction = introduction
        self.content = content
    }
}

/// The list of available datasets. Maps to the /api/available-datasets.json endpoint.
public struct ApiAvailableDatasets: Codable, Hashable, Sendable {
    /// The list of datasets that are available in the API.
    public var datasets: [ApiDataset]

    public init(
        datasets: [ApiDataset]
    ) {
        self.datasets = datasets
    }
}

/// Defines a dataset that is used in the API.
public struct ApiDataset: Codable, Hashable, Sendable {
    /// The ID of the dataset.
    public var id: String

    /// The name of the dataset.
    public var name: String

    /// The website for the dataset.
    public var website: String

    /// The URL that the license for the dataset can be found.
    public var licenseUrl: String

    /// The API-added notes for the license.
    public var licenseNotes: String?

    /// The English name for the dataset.
    public var englishName: String

    /// The ISO 639 3-letter language tag that the dataset is primarily in.
    public var language: String

    /// The direction that the language is written in.
    public var textDirection: TextDirection

    /// The API link for the list of books for this dataset. Relative to the API origin.
    public var listOfBooksApiLink: String

    public var availableFormats: [String]

    /// The number of books that are contained in this dataset.
    public var numberOfBooks: Int

    /// The total number of chapters that are contained in this dataset.
    public var totalNumberOfChapters: Int

    /// The total number of verses that are contained in this dataset.
    public var totalNumberOfVerses: Int

    /// The total number of references that are contained in this dataset.
    public var totalNumberOfReferences: Int

    /// The total number of interlinear words that are contained in this dataset. Omitted if the dataset doesn't contain interlinear words.
    public var totalNumberOfWords: Int?

    /// Gets the name of the language that the dataset is in. Null or undefined if the name of the language is not known.
    public var languageName: String?

    /// Gets the name of the language in English. Null or undefined if the language doesn't have an english name.
    public var languageEnglishName: String?

    /// The API link for the list of people for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain people.
    public var listOfPeopleApiLink: String?

    /// The API link for the list of places for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain places.
    public var listOfPlacesApiLink: String?

    /// The API link for the list of events for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain events.
    public var listOfEventsApiLink: String?

    /// The API link for the list of people groups for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain people groups.
    public var listOfPeopleGroupsApiLink: String?

    /// The API link for the list of lexicon entries for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain lexicon entries.
    public var listOfLexiconApiLink: String?

    /// The API link for the list of every verse in this dataset, with its categories. Relative to the API origin. Omitted if the verses of the dataset don't have categories.
    public var listOfVersesApiLink: String?

    /// The API link for the list of verse categories for this dataset. Relative to the API origin. Omitted if the dataset doesn't contain verse categories.
    public var listOfCategoriesApiLink: String?

    /// The total number of people that are contained in this dataset. Omitted if the dataset doesn't contain people.
    public var totalNumberOfPeople: Int?

    /// The total number of places that are contained in this dataset. Omitted if the dataset doesn't contain places.
    public var totalNumberOfPlaces: Int?

    /// The total number of events that are contained in this dataset. Omitted if the dataset doesn't contain events.
    public var totalNumberOfEvents: Int?

    /// The total number of people groups that are contained in this dataset. Omitted if the dataset doesn't contain people groups.
    public var totalNumberOfPeopleGroups: Int?

    /// The total number of lexicon entries that are contained in this dataset. Omitted if the dataset doesn't contain lexicon entries.
    public var totalNumberOfLexicon: Int?

    /// The total number of verse categories that are contained in this dataset. Omitted if the dataset doesn't contain verse categories.
    public var totalNumberOfCategories: Int?

    public init(
        id: String,
        name: String,
        website: String,
        licenseUrl: String,
        licenseNotes: String? = nil,
        englishName: String,
        language: String,
        textDirection: TextDirection,
        listOfBooksApiLink: String,
        availableFormats: [String],
        numberOfBooks: Int,
        totalNumberOfChapters: Int,
        totalNumberOfVerses: Int,
        totalNumberOfReferences: Int,
        totalNumberOfWords: Int? = nil,
        languageName: String? = nil,
        languageEnglishName: String? = nil,
        listOfPeopleApiLink: String? = nil,
        listOfPlacesApiLink: String? = nil,
        listOfEventsApiLink: String? = nil,
        listOfPeopleGroupsApiLink: String? = nil,
        listOfLexiconApiLink: String? = nil,
        listOfVersesApiLink: String? = nil,
        listOfCategoriesApiLink: String? = nil,
        totalNumberOfPeople: Int? = nil,
        totalNumberOfPlaces: Int? = nil,
        totalNumberOfEvents: Int? = nil,
        totalNumberOfPeopleGroups: Int? = nil,
        totalNumberOfLexicon: Int? = nil,
        totalNumberOfCategories: Int? = nil
    ) {
        self.id = id
        self.name = name
        self.website = website
        self.licenseUrl = licenseUrl
        self.licenseNotes = licenseNotes
        self.englishName = englishName
        self.language = language
        self.textDirection = textDirection
        self.listOfBooksApiLink = listOfBooksApiLink
        self.availableFormats = availableFormats
        self.numberOfBooks = numberOfBooks
        self.totalNumberOfChapters = totalNumberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
        self.totalNumberOfReferences = totalNumberOfReferences
        self.totalNumberOfWords = totalNumberOfWords
        self.languageName = languageName
        self.languageEnglishName = languageEnglishName
        self.listOfPeopleApiLink = listOfPeopleApiLink
        self.listOfPlacesApiLink = listOfPlacesApiLink
        self.listOfEventsApiLink = listOfEventsApiLink
        self.listOfPeopleGroupsApiLink = listOfPeopleGroupsApiLink
        self.listOfLexiconApiLink = listOfLexiconApiLink
        self.listOfVersesApiLink = listOfVersesApiLink
        self.listOfCategoriesApiLink = listOfCategoriesApiLink
        self.totalNumberOfPeople = totalNumberOfPeople
        self.totalNumberOfPlaces = totalNumberOfPlaces
        self.totalNumberOfEvents = totalNumberOfEvents
        self.totalNumberOfPeopleGroups = totalNumberOfPeopleGroups
        self.totalNumberOfLexicon = totalNumberOfLexicon
        self.totalNumberOfCategories = totalNumberOfCategories
    }
}

/// Defines an interface that contains information about the books that are available for a dataset.
public struct ApiDatasetBooks: Codable, Hashable, Sendable {
    /// The dataset information for the books.
    public var dataset: ApiDataset

    /// The list of books that are available for the dataset.
    public var books: [ApiDatasetBook]

    public init(
        dataset: ApiDataset,
        books: [ApiDatasetBook]
    ) {
        self.dataset = dataset
        self.books = books
    }
}

/// Defines a schema that contains information about a book in a dataset.
public struct ApiDatasetBook: Codable, Hashable, Sendable {
    public var id: BookId

    /// The order of the book in the Bible.
    public var order: Int

    /// The number of the first chapter in the book.
    public var firstChapterNumber: Int

    /// The link to the first chapter of the book.
    public var firstChapterApiLink: String

    public var firstChapterReference: DatasetChapterReference

    /// The number of the last chapter in the book.
    public var lastChapterNumber: Int

    /// The link to the last chapter of the book.
    public var lastChapterApiLink: String

    public var lastChapterReference: DatasetChapterReference

    /// The number of chapters that the book contains.
    public var numberOfChapters: Int

    /// The number of verses that the book contains.
    public var totalNumberOfVerses: Int

    /// The number of references that the book contains.
    public var totalNumberOfReferences: Int

    public init(
        id: BookId,
        order: Int,
        firstChapterNumber: Int,
        firstChapterApiLink: String,
        firstChapterReference: DatasetChapterReference,
        lastChapterNumber: Int,
        lastChapterApiLink: String,
        lastChapterReference: DatasetChapterReference,
        numberOfChapters: Int,
        totalNumberOfVerses: Int,
        totalNumberOfReferences: Int
    ) {
        self.id = id
        self.order = order
        self.firstChapterNumber = firstChapterNumber
        self.firstChapterApiLink = firstChapterApiLink
        self.firstChapterReference = firstChapterReference
        self.lastChapterNumber = lastChapterNumber
        self.lastChapterApiLink = lastChapterApiLink
        self.lastChapterReference = lastChapterReference
        self.numberOfChapters = numberOfChapters
        self.totalNumberOfVerses = totalNumberOfVerses
        self.totalNumberOfReferences = totalNumberOfReferences
    }
}

/// Defines a reference to a chapter in a dataset.
public struct DatasetChapterReference: Codable, Hashable, Sendable {
    /// The ID of the dataset that the chapter reference is for.
    public var datasetId: String

    public var book: BookId

    /// The chapter number of the chapter reference.
    public var chapter: Int

    public init(
        datasetId: String,
        book: BookId,
        chapter: Int
    ) {
        self.datasetId = datasetId
        self.book = book
        self.chapter = chapter
    }
}

/// Defines a schema that contains information about a book chapter in a dataset.
public struct ApiDatasetBookChapter: Codable, Hashable, Sendable {
    /// The data for the chapter.
    public var chapter: DatasetChapterData

    /// The dataset information for the book chapter.
    public var dataset: ApiDataset

    /// The book information for the book chapter.
    public var book: ApiDatasetBook

    /// The API link for this chapter. Relative to the API origin.
    public var thisChapterLink: String

    public var thisChapterReference: DatasetChapterReference

    /// The API link to the next chapter. Relative to the API origin. Null if this is the last chapter in the dataset.
    public var nextChapterApiLink: String?

    /// The reference for the next chapter. Null if this is the last chapter in the dataset.
    public var nextChapterReference: DatasetChapterReference?

    /// The API link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the dataset.
    public var previousChapterApiLink: String?

    /// The reference for the previous chapter. Null if this is the first chapter in the dataset.
    public var previousChapterReference: DatasetChapterReference?

    /// The number of verses that the chapter contains.
    public var numberOfVerses: Int

    /// The number of references that the chapter contains.
    public var numberOfReferences: Int

    public init(
        chapter: DatasetChapterData,
        dataset: ApiDataset,
        book: ApiDatasetBook,
        thisChapterLink: String,
        thisChapterReference: DatasetChapterReference,
        nextChapterApiLink: String? = nil,
        nextChapterReference: DatasetChapterReference? = nil,
        previousChapterApiLink: String? = nil,
        previousChapterReference: DatasetChapterReference? = nil,
        numberOfVerses: Int,
        numberOfReferences: Int
    ) {
        self.chapter = chapter
        self.dataset = dataset
        self.book = book
        self.thisChapterLink = thisChapterLink
        self.thisChapterReference = thisChapterReference
        self.nextChapterApiLink = nextChapterApiLink
        self.nextChapterReference = nextChapterReference
        self.previousChapterApiLink = previousChapterApiLink
        self.previousChapterReference = previousChapterReference
        self.numberOfVerses = numberOfVerses
        self.numberOfReferences = numberOfReferences
    }
}

/// Defines the schema for information about a chapter in a dataset.
public struct DatasetChapterData: Codable, Hashable, Sendable {
    /// The number of the chapter.
    public var number: Int

    /// The content of the chapter.
    public var content: [DatasetChapterVerseContent]

    public init(
        number: Int,
        content: [DatasetChapterVerseContent]
    ) {
        self.number = number
        self.content = content
    }
}

/// Defines the schema for information about a verse in a dataset chapter. A verse carries `references` (cross references), `words` (interlinear words), or `categories` (verse of the day candidates), depending on the dataset.
public enum DatasetChapterVerseContent: Codable, Hashable, Sendable {
    case references(DatasetChapterVerseReferences)
    case words(DatasetChapterVerseWords)
    case categories(DatasetChapterVerseCategories)
    /// A value that this version of the SDK doesn't know about.
    case unknown(JSONValue)

    public init(from decoder: Decoder) throws {
        if let container = try? decoder.container(keyedBy: AnyCodingKey.self) {
            if container.contains(AnyCodingKey("references")) {
                self = .references(try DatasetChapterVerseReferences(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("words")) {
                self = .words(try DatasetChapterVerseWords(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("categories")) {
                self = .categories(try DatasetChapterVerseCategories(from: decoder))
                return
            }
        }
        self = .unknown(try JSONValue(from: decoder))
    }

    public func encode(to encoder: Encoder) throws {
        switch self {
        case .references(let value):
            try value.encode(to: encoder)
        case .words(let value):
            try value.encode(to: encoder)
        case .categories(let value):
            try value.encode(to: encoder)
        case .unknown(let value):
            try value.encode(to: encoder)
        }
    }
}

/// Defines the schema for a verse in a dataset chapter that lists references to other verses.
public struct DatasetChapterVerseReferences: Codable, Hashable, Sendable {
    /// The number of the verse.
    public var verse: Int

    /// The list of references for the verse.
    public var references: [ScoredVerseRef]

    public init(
        verse: Int,
        references: [ScoredVerseRef]
    ) {
        self.verse = verse
        self.references = references
    }
}

/// Defines the schema for information about a verse reference that has an arbitrary score attached to it.
public struct ScoredVerseRef: Codable, Hashable, Sendable {
    public var book: BookId

    /// The chapter number that the reference starts at.
    public var chapter: Int

    /// The verse number that the reference starts at.
    public var verse: Int

    /// The rest of the content of the verse reference. This is the part of the string that comes after the verse reference. For example, in "GEN 1:1 In the beginning, God created the Heavens and the Earth.", the content would be "In the beginning, God created the Heavens and the Earth."
    public var content: String?

    /// The chapter that the verse reference ends at. This is used for references that span multiple chapters, such as "GEN 1:1-2:3". In this case, the endChapter would be 2.
    public var endChapter: Int?

    /// The verse that the verse reference ends at. This is used for references that span multiple verses, such as "GEN 1:1-1:3". In this case, the endVerse would be 3.
    public var endVerse: Int?

    /// The score for the verse reference. The meaning of the score is arbitrary and is determined by the dataset.
    public var score: Double

    public init(
        book: BookId,
        chapter: Int,
        verse: Int,
        content: String? = nil,
        endChapter: Int? = nil,
        endVerse: Int? = nil,
        score: Double
    ) {
        self.book = book
        self.chapter = chapter
        self.verse = verse
        self.content = content
        self.endChapter = endChapter
        self.endVerse = endVerse
        self.score = score
    }
}

/// Defines the schema for a verse in a dataset chapter that lists its original-language words.
public struct DatasetChapterVerseWords: Codable, Hashable, Sendable {
    /// The number of the verse.
    public var verse: Int

    /// The original-language words of the verse, in original-text order.
    public var words: [DatasetInterlinearWord]

    public init(
        verse: Int,
        words: [DatasetInterlinearWord]
    ) {
        self.verse = verse
        self.words = words
    }
}

/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct OriginalLanguage: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let hebrew = OriginalLanguage(rawValue: "hebrew")
    public static let aramaic = OriginalLanguage(rawValue: "aramaic")
    public static let greek = OriginalLanguage(rawValue: "greek")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [OriginalLanguage] = [
        .hebrew,
        .aramaic,
        .greek,
    ]
}

/// Defines the schema for an original-language word in an interlinear dataset verse.
public struct DatasetInterlinearWord: Codable, Hashable, Sendable {
    /// The 1-based rank of the word in the original text's order.
    public var pos: Int

    /// The 1-based rank of the word in the Berean Standard Bible's English order.
    public var bsbPos: Int

    /// The language of the word.
    public var language: OriginalLanguage

    /// The word in the original script. NFC-normalized.
    public var text: String

    /// The transliteration of the word.
    public var transliteration: String?

    /// The short grammatical parsing code of the word.
    public var parsing: String?

    /// The spelled-out grammatical parsing of the word.
    public var parsingFull: String?

    /// The zero-padded Strong's number of the word, such as `H0430` or `G3056`. Matches the KJV's `.words.json` values. Other translations' values may need zero-padding and suffix stripping before joining. Null when the source gives the word no Strong's number.
    public var strongs: String?

    /// The Berean Standard Bible's English phrase for the word. Null when the BSB leaves the word untranslated.
    public var gloss: String?

    public init(
        pos: Int,
        bsbPos: Int,
        language: OriginalLanguage,
        text: String,
        transliteration: String? = nil,
        parsing: String? = nil,
        parsingFull: String? = nil,
        strongs: String? = nil,
        gloss: String? = nil
    ) {
        self.pos = pos
        self.bsbPos = bsbPos
        self.language = language
        self.text = text
        self.transliteration = transliteration
        self.parsing = parsing
        self.parsingFull = parsingFull
        self.strongs = strongs
        self.gloss = gloss
    }
}

/// Defines the schema for a verse (or short passage) in a dataset chapter that lists the categories it belongs to.
public struct DatasetChapterVerseCategories: Codable, Hashable, Sendable {
    /// The number of the verse. If `endVerse` is present, then this is the verse that the passage starts at.
    public var verse: Int

    /// The verse that the passage ends at. Omitted if the entry is a single verse.
    public var endVerse: Int?

    /// The IDs of the categories that the verse belongs to, most relevant first. Each ID matches a category in the `categories` collection of the dataset (`/api/d/{dataset}/categories/{id}.json`).
    public var categories: [String]

    /// The first year that the verse can be the verse of the day. Omitted if the verse has always been in the list.
    public var addedIn: Int?

    /// The first year that the verse can no longer be the verse of the day. Removed verses stay in the dataset so that the verses of earlier years can still be picked. Omitted if the verse hasn't been removed from the list.
    public var removedIn: Int?

    public init(
        verse: Int,
        endVerse: Int? = nil,
        categories: [String],
        addedIn: Int? = nil,
        removedIn: Int? = nil
    ) {
        self.verse = verse
        self.endVerse = endVerse
        self.categories = categories
        self.addedIn = addedIn
        self.removedIn = removedIn
    }
}

/// The entities (people, places, and events) that appear in a chapter of a book for a dataset. Maps to the /api/d/:datasetId/:bookId/:chapterNumber.json endpoint for datasets that contain entities.
public struct ApiDatasetEntityBookChapter: Codable, Hashable, Sendable {
    /// The dataset information for the book chapter.
    public var dataset: ApiDataset

    /// The book information for the book chapter.
    public var book: ApiDatasetBook

    /// The entity data for the chapter.
    public var chapter: ApiDatasetEntityChapterData

    /// The link to this chapter. Relative to the API origin.
    public var thisChapterLink: String

    /// The reference for this chapter.
    public var thisChapterReference: DatasetChapterReference

    /// The link to the next chapter. Relative to the API origin. Null if this is the last chapter in the dataset.
    public var nextChapterApiLink: String?

    /// The reference for the next chapter. Null if this is the last chapter in the dataset.
    public var nextChapterReference: DatasetChapterReference?

    /// The link to the previous chapter. Relative to the API origin. Null if this is the first chapter in the dataset.
    public var previousChapterApiLink: String?

    /// The reference for the previous chapter. Null if this is the first chapter in the dataset.
    public var previousChapterReference: DatasetChapterReference?

    /// The number of people that appear in the chapter.
    public var numberOfPeople: Int

    /// The number of places that appear in the chapter.
    public var numberOfPlaces: Int

    /// The number of events that appear in the chapter.
    public var numberOfEvents: Int

    public init(
        dataset: ApiDataset,
        book: ApiDatasetBook,
        chapter: ApiDatasetEntityChapterData,
        thisChapterLink: String,
        thisChapterReference: DatasetChapterReference,
        nextChapterApiLink: String? = nil,
        nextChapterReference: DatasetChapterReference? = nil,
        previousChapterApiLink: String? = nil,
        previousChapterReference: DatasetChapterReference? = nil,
        numberOfPeople: Int,
        numberOfPlaces: Int,
        numberOfEvents: Int
    ) {
        self.dataset = dataset
        self.book = book
        self.chapter = chapter
        self.thisChapterLink = thisChapterLink
        self.thisChapterReference = thisChapterReference
        self.nextChapterApiLink = nextChapterApiLink
        self.nextChapterReference = nextChapterReference
        self.previousChapterApiLink = previousChapterApiLink
        self.previousChapterReference = previousChapterReference
        self.numberOfPeople = numberOfPeople
        self.numberOfPlaces = numberOfPlaces
        self.numberOfEvents = numberOfEvents
    }
}

/// Defines a person that appears in a chapter of a dataset.
public struct ApiDatasetChapterPerson: Codable, Hashable, Sendable {
    /// The ID of the person.
    public var id: String

    /// The name of the person.
    public var name: String

    /// Whether the name of the person is a proper name.
    public var isProperName: Bool?

    /// The gender of the person.
    public var gender: String?

    /// The year that the person was born. Negative numbers are years BC. Positive numbers are years AD.
    public var birthYear: Int?

    /// The year that the person died. Negative numbers are years BC. Positive numbers are years AD.
    public var deathYear: Int?

    /// The API link for the person. Relative to the API origin.
    public var apiLink: String

    /// The numbers of the verses in the chapter that mention the person. Sorted in ascending order.
    public var verses: [Int]

    public init(
        id: String,
        name: String,
        isProperName: Bool? = nil,
        gender: String? = nil,
        birthYear: Int? = nil,
        deathYear: Int? = nil,
        apiLink: String,
        verses: [Int]
    ) {
        self.id = id
        self.name = name
        self.isProperName = isProperName
        self.gender = gender
        self.birthYear = birthYear
        self.deathYear = deathYear
        self.apiLink = apiLink
        self.verses = verses
    }
}

/// Defines a place that appears in a chapter of a dataset.
public struct ApiDatasetChapterPlace: Codable, Hashable, Sendable {
    /// The ID of the place.
    public var id: String

    /// The name of the place.
    public var name: String

    /// The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.
    public var featureType: String?

    /// The latitude of the place.
    public var latitude: Double?

    /// The longitude of the place.
    public var longitude: Double?

    /// The API link for the place. Relative to the API origin.
    public var apiLink: String

    /// The numbers of the verses in the chapter that mention the place. Sorted in ascending order.
    public var verses: [Int]

    public init(
        id: String,
        name: String,
        featureType: String? = nil,
        latitude: Double? = nil,
        longitude: Double? = nil,
        apiLink: String,
        verses: [Int]
    ) {
        self.id = id
        self.name = name
        self.featureType = featureType
        self.latitude = latitude
        self.longitude = longitude
        self.apiLink = apiLink
        self.verses = verses
    }
}

/// Defines an event that appears in a chapter of a dataset.
public struct ApiDatasetChapterEvent: Codable, Hashable, Sendable {
    /// The ID of the event.
    public var id: String

    /// The name of the event.
    public var name: String

    /// The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.
    public var startDate: String?

    /// The API link for the event. Relative to the API origin.
    public var apiLink: String

    /// The numbers of the verses in the chapter that describe the event. Sorted in ascending order.
    public var verses: [Int]

    public init(
        id: String,
        name: String,
        startDate: String? = nil,
        apiLink: String,
        verses: [Int]
    ) {
        self.id = id
        self.name = name
        self.startDate = startDate
        self.apiLink = apiLink
        self.verses = verses
    }
}

/// Defines the entity data for a chapter in a dataset. Contains the people, places, and events that appear in the chapter.
public struct ApiDatasetEntityChapterData: Codable, Hashable, Sendable {
    /// The number of the chapter.
    public var number: Int

    /// The people that appear in the chapter. Sorted by the first verse that they appear in.
    public var people: [ApiDatasetChapterPerson]

    /// The places that appear in the chapter. Sorted by the first verse that they appear in.
    public var places: [ApiDatasetChapterPlace]

    /// The events that appear in the chapter. Sorted by the first verse that they appear in.
    public var events: [ApiDatasetChapterEvent]

    public init(
        number: Int,
        people: [ApiDatasetChapterPerson],
        places: [ApiDatasetChapterPlace],
        events: [ApiDatasetChapterEvent]
    ) {
        self.number = number
        self.people = people
        self.places = places
        self.events = events
    }
}

/// The list of people in a dataset. Maps to the /api/d/:datasetId/people.json endpoint.
public struct ApiDatasetPeople: Codable, Hashable, Sendable {
    /// The dataset information for the people.
    public var dataset: ApiDataset

    /// The list of people that are available for the dataset.
    public var people: [ApiDatasetPersonSummary]

    public init(
        dataset: ApiDataset,
        people: [ApiDatasetPersonSummary]
    ) {
        self.dataset = dataset
        self.people = people
    }
}

/// Defines a summary of a person in a dataset.
public struct ApiDatasetPersonSummary: Codable, Hashable, Sendable {
    /// The ID of the person.
    public var id: String

    /// The name of the person.
    public var name: String

    /// Whether the name of the person is a proper name.
    public var isProperName: Bool?

    /// The gender of the person.
    public var gender: String?

    /// The number of Bible references that mention the person.
    public var numberOfReferences: Int

    /// The API link for the person. Relative to the API origin.
    public var thisPersonApiLink: String

    public init(
        id: String,
        name: String,
        isProperName: Bool? = nil,
        gender: String? = nil,
        numberOfReferences: Int,
        thisPersonApiLink: String
    ) {
        self.id = id
        self.name = name
        self.isProperName = isProperName
        self.gender = gender
        self.numberOfReferences = numberOfReferences
        self.thisPersonApiLink = thisPersonApiLink
    }
}

/// The information about a person in a dataset. Maps to the /api/d/:datasetId/people/:personId.json endpoint.
public struct ApiDatasetPerson: Codable, Hashable, Sendable {
    /// The dataset information for the person.
    public var dataset: ApiDataset

    /// The information about the person.
    public var person: DatasetPerson

    /// The API link for this person. Relative to the API origin.
    public var thisPersonApiLink: String

    public init(
        dataset: ApiDataset,
        person: DatasetPerson,
        thisPersonApiLink: String
    ) {
        self.dataset = dataset
        self.person = person
        self.thisPersonApiLink = thisPersonApiLink
    }
}

/// Defines the schema for a reference to another entity (person, place, event, or people group) in a dataset.
public struct DatasetEntityRef: Codable, Hashable, Sendable {
    /// The ID of the entity that is being referenced.
    public var id: String

    /// The type of the entity that is being referenced. Matches the collection segment of the entity's API link, so the link can be constructed as `/api/d/{dataset}/{type}/{id}.json`.
    public var type: DatasetEntityType

    /// The name of the entity that is being referenced.
    public var name: String?

    /// The API link for the entity that is being referenced. Relative to the API origin. Only present in API responses.
    public var apiLink: String?

    public init(
        id: String,
        type: DatasetEntityType,
        name: String? = nil,
        apiLink: String? = nil
    ) {
        self.id = id
        self.type = type
        self.name = name
        self.apiLink = apiLink
    }
}

/// The type of an entity in a dataset. Matches the collection segment of the entity API paths, so the API link for an entity can be constructed as `/api/d/{dataset}/{type}/{id}.json`.
///
/// Values that this version of the SDK doesn't know about are preserved in `rawValue`.
public struct DatasetEntityType: RawRepresentable, Codable, Hashable, Sendable, ExpressibleByStringLiteral, CustomStringConvertible {
    public var rawValue: String

    public init(rawValue: String) {
        self.rawValue = rawValue
    }

    public init(stringLiteral value: String) {
        self.rawValue = value
    }

    public init(from decoder: Decoder) throws {
        self.rawValue = try decoder.singleValueContainer().decode(String.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(rawValue)
    }

    public var description: String {
        rawValue
    }

    public static let people = DatasetEntityType(rawValue: "people")
    public static let places = DatasetEntityType(rawValue: "places")
    public static let events = DatasetEntityType(rawValue: "events")
    public static let groups = DatasetEntityType(rawValue: "groups")
    public static let lexicon = DatasetEntityType(rawValue: "lexicon")
    public static let categories = DatasetEntityType(rawValue: "categories")

    /// All of the values that this version of the SDK knows about.
    public static let allKnownValues: [DatasetEntityType] = [
        .people,
        .places,
        .events,
        .groups,
        .lexicon,
        .categories,
    ]
}

/// Defines a schema for verse references. A verse reference is a string that contains a book ID, chapter number, and verse number, such as "GEN 1:1". It can also contain an optional content part that comes after the verse reference, such as "GEN 1:1 In the beginning, God created the Heavens and the Earth." It can also contain optional endChapter and endVerse fields for references that span multiple chapters or verses, such as "GEN 1:1-2:3".
public struct VerseRef: Codable, Hashable, Sendable {
    public var book: BookId

    /// The chapter number that the reference starts at.
    public var chapter: Int

    /// The verse number that the reference starts at.
    public var verse: Int

    /// The rest of the content of the verse reference. This is the part of the string that comes after the verse reference. For example, in "GEN 1:1 In the beginning, God created the Heavens and the Earth.", the content would be "In the beginning, God created the Heavens and the Earth."
    public var content: String?

    /// The chapter that the verse reference ends at. This is used for references that span multiple chapters, such as "GEN 1:1-2:3". In this case, the endChapter would be 2.
    public var endChapter: Int?

    /// The verse that the verse reference ends at. This is used for references that span multiple verses, such as "GEN 1:1-1:3". In this case, the endVerse would be 3.
    public var endVerse: Int?

    public init(
        book: BookId,
        chapter: Int,
        verse: Int,
        content: String? = nil,
        endChapter: Int? = nil,
        endVerse: Int? = nil
    ) {
        self.book = book
        self.chapter = chapter
        self.verse = verse
        self.content = content
        self.endChapter = endChapter
        self.endVerse = endVerse
    }
}

/// Defines the schema for information about a person in a dataset.
public struct DatasetPerson: Codable, Hashable, Sendable {
    /// The ID of the person.
    public var id: String

    /// The name of the person.
    public var name: String

    /// Other names that the person is called by.
    public var alsoCalled: [String]?

    /// Whether the name of the person is a proper name.
    public var isProperName: Bool?

    /// The gender of the person.
    public var gender: String?

    /// The description of the person. Each string is a paragraph.
    public var description: [String]?

    /// The year that the person was born. Negative numbers are years BC. Positive numbers are years AD.
    public var birthYear: Int?

    /// The year that the person died. Negative numbers are years BC. Positive numbers are years AD.
    public var deathYear: Int?

    /// The earliest year that the person is mentioned in. Negative numbers are years BC. Positive numbers are years AD.
    public var minYear: Int?

    /// The latest year that the person is mentioned in. Negative numbers are years BC. Positive numbers are years AD.
    public var maxYear: Int?

    /// The place that the person was born in.
    public var birthPlace: DatasetEntityRef?

    /// The place that the person died in.
    public var deathPlace: DatasetEntityRef?

    /// The father(s) of the person.
    public var father: [DatasetEntityRef]?

    /// The mother(s) of the person.
    public var mother: [DatasetEntityRef]?

    /// The partners (spouses) of the person.
    public var partners: [DatasetEntityRef]?

    /// The children of the person.
    public var children: [DatasetEntityRef]?

    /// The siblings of the person.
    public var siblings: [DatasetEntityRef]?

    /// The half-siblings of the person that share the same mother.
    public var halfSiblingsSameMother: [DatasetEntityRef]?

    /// The half-siblings of the person that share the same father.
    public var halfSiblingsSameFather: [DatasetEntityRef]?

    /// The people groups that the person is a member of.
    public var memberOf: [DatasetEntityRef]?

    /// The events that the person participated in.
    public var events: [DatasetEntityRef]?

    /// The list of Bible references that mention the person. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
    public var references: [VerseRef]

    public init(
        id: String,
        name: String,
        alsoCalled: [String]? = nil,
        isProperName: Bool? = nil,
        gender: String? = nil,
        description: [String]? = nil,
        birthYear: Int? = nil,
        deathYear: Int? = nil,
        minYear: Int? = nil,
        maxYear: Int? = nil,
        birthPlace: DatasetEntityRef? = nil,
        deathPlace: DatasetEntityRef? = nil,
        father: [DatasetEntityRef]? = nil,
        mother: [DatasetEntityRef]? = nil,
        partners: [DatasetEntityRef]? = nil,
        children: [DatasetEntityRef]? = nil,
        siblings: [DatasetEntityRef]? = nil,
        halfSiblingsSameMother: [DatasetEntityRef]? = nil,
        halfSiblingsSameFather: [DatasetEntityRef]? = nil,
        memberOf: [DatasetEntityRef]? = nil,
        events: [DatasetEntityRef]? = nil,
        references: [VerseRef]
    ) {
        self.id = id
        self.name = name
        self.alsoCalled = alsoCalled
        self.isProperName = isProperName
        self.gender = gender
        self.description = description
        self.birthYear = birthYear
        self.deathYear = deathYear
        self.minYear = minYear
        self.maxYear = maxYear
        self.birthPlace = birthPlace
        self.deathPlace = deathPlace
        self.father = father
        self.mother = mother
        self.partners = partners
        self.children = children
        self.siblings = siblings
        self.halfSiblingsSameMother = halfSiblingsSameMother
        self.halfSiblingsSameFather = halfSiblingsSameFather
        self.memberOf = memberOf
        self.events = events
        self.references = references
    }
}

/// The list of places in a dataset. Maps to the /api/d/:datasetId/places.json endpoint.
public struct ApiDatasetPlaces: Codable, Hashable, Sendable {
    /// The dataset information for the places.
    public var dataset: ApiDataset

    /// The list of places that are available for the dataset.
    public var places: [ApiDatasetPlaceSummary]

    public init(
        dataset: ApiDataset,
        places: [ApiDatasetPlaceSummary]
    ) {
        self.dataset = dataset
        self.places = places
    }
}

/// Defines a summary of a place in a dataset.
public struct ApiDatasetPlaceSummary: Codable, Hashable, Sendable {
    /// The ID of the place.
    public var id: String

    /// The name of the place.
    public var name: String

    /// The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.
    public var featureType: String?

    /// The latitude of the place.
    public var latitude: Double?

    /// The longitude of the place.
    public var longitude: Double?

    /// The number of Bible references that mention the place.
    public var numberOfReferences: Int

    /// The API link for the place. Relative to the API origin.
    public var thisPlaceApiLink: String

    public init(
        id: String,
        name: String,
        featureType: String? = nil,
        latitude: Double? = nil,
        longitude: Double? = nil,
        numberOfReferences: Int,
        thisPlaceApiLink: String
    ) {
        self.id = id
        self.name = name
        self.featureType = featureType
        self.latitude = latitude
        self.longitude = longitude
        self.numberOfReferences = numberOfReferences
        self.thisPlaceApiLink = thisPlaceApiLink
    }
}

/// The information about a place in a dataset. Maps to the /api/d/:datasetId/places/:placeId.json endpoint.
public struct ApiDatasetPlace: Codable, Hashable, Sendable {
    /// The dataset information for the place.
    public var dataset: ApiDataset

    /// The information about the place.
    public var place: DatasetPlace

    /// The API link for this place. Relative to the API origin.
    public var thisPlaceApiLink: String

    public init(
        dataset: ApiDataset,
        place: DatasetPlace,
        thisPlaceApiLink: String
    ) {
        self.dataset = dataset
        self.place = place
        self.thisPlaceApiLink = thisPlaceApiLink
    }
}

/// Defines the schema for information about a place in a dataset.
public struct DatasetPlace: Codable, Hashable, Sendable {
    /// The ID of the place.
    public var id: String

    /// The name of the place.
    public var name: String

    /// The name of the place as it appears in the King James Version.
    public var kjvName: String?

    /// The name of the place as it appears in the English Standard Version.
    public var esvName: String?

    /// Other names that the place is called by.
    public var aliases: [String]?

    /// The type of geographical feature that the place is. For example, "City", "Region", "Mountain", "Water", etc.
    public var featureType: String?

    /// The sub-type of geographical feature that the place is.
    public var featureSubType: String?

    /// The latitude of the place.
    public var latitude: Double?

    /// The longitude of the place.
    public var longitude: Double?

    /// How precise the latitude and longitude of the place are.
    public var precision: String?

    /// The description of the place. Each string is a paragraph.
    public var description: [String]?

    /// The comment on the place from the dataset authors.
    public var comment: String?

    /// The root place for this place. Different names for the same geographical location share the same root place.
    public var rootPlace: DatasetEntityRef?

    /// The place that this place is a duplicate of.
    public var duplicateOf: DatasetEntityRef?

    /// The people that have been at the place.
    public var people: [DatasetEntityRef]?

    /// The people that were born at the place.
    public var peopleBorn: [DatasetEntityRef]?

    /// The people that died at the place.
    public var peopleDied: [DatasetEntityRef]?

    /// The events that happened at the place.
    public var events: [DatasetEntityRef]?

    /// The list of Bible references that mention the place. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
    public var references: [VerseRef]

    public init(
        id: String,
        name: String,
        kjvName: String? = nil,
        esvName: String? = nil,
        aliases: [String]? = nil,
        featureType: String? = nil,
        featureSubType: String? = nil,
        latitude: Double? = nil,
        longitude: Double? = nil,
        precision: String? = nil,
        description: [String]? = nil,
        comment: String? = nil,
        rootPlace: DatasetEntityRef? = nil,
        duplicateOf: DatasetEntityRef? = nil,
        people: [DatasetEntityRef]? = nil,
        peopleBorn: [DatasetEntityRef]? = nil,
        peopleDied: [DatasetEntityRef]? = nil,
        events: [DatasetEntityRef]? = nil,
        references: [VerseRef]
    ) {
        self.id = id
        self.name = name
        self.kjvName = kjvName
        self.esvName = esvName
        self.aliases = aliases
        self.featureType = featureType
        self.featureSubType = featureSubType
        self.latitude = latitude
        self.longitude = longitude
        self.precision = precision
        self.description = description
        self.comment = comment
        self.rootPlace = rootPlace
        self.duplicateOf = duplicateOf
        self.people = people
        self.peopleBorn = peopleBorn
        self.peopleDied = peopleDied
        self.events = events
        self.references = references
    }
}

/// The list of events in a dataset. Maps to the /api/d/:datasetId/events.json endpoint.
public struct ApiDatasetEvents: Codable, Hashable, Sendable {
    /// The dataset information for the events.
    public var dataset: ApiDataset

    /// The list of events that are available for the dataset.
    public var events: [ApiDatasetEventSummary]

    public init(
        dataset: ApiDataset,
        events: [ApiDatasetEventSummary]
    ) {
        self.dataset = dataset
        self.events = events
    }
}

/// Defines a summary of an event in a dataset.
public struct ApiDatasetEventSummary: Codable, Hashable, Sendable {
    /// The ID of the event.
    public var id: String

    /// The name of the event.
    public var name: String

    /// The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.
    public var startDate: String?

    /// The number of Bible references that describe the event.
    public var numberOfReferences: Int

    /// The API link for the event. Relative to the API origin.
    public var thisEventApiLink: String

    public init(
        id: String,
        name: String,
        startDate: String? = nil,
        numberOfReferences: Int,
        thisEventApiLink: String
    ) {
        self.id = id
        self.name = name
        self.startDate = startDate
        self.numberOfReferences = numberOfReferences
        self.thisEventApiLink = thisEventApiLink
    }
}

/// The information about an event in a dataset. Maps to the /api/d/:datasetId/events/:eventId.json endpoint.
public struct ApiDatasetEvent: Codable, Hashable, Sendable {
    /// The dataset information for the event.
    public var dataset: ApiDataset

    /// The information about the event.
    public var event: DatasetEvent

    /// The API link for this event. Relative to the API origin.
    public var thisEventApiLink: String

    public init(
        dataset: ApiDataset,
        event: DatasetEvent,
        thisEventApiLink: String
    ) {
        self.dataset = dataset
        self.event = event
        self.thisEventApiLink = thisEventApiLink
    }
}

/// Defines the schema for information about an event in a dataset.
public struct DatasetEvent: Codable, Hashable, Sendable {
    /// The ID of the event.
    public var id: String

    /// The name of the event.
    public var name: String

    /// The date that the event started at. Negative numbers are years BC. Positive numbers are years AD. More specific dates use the `YYYY-MM-DD` format.
    public var startDate: String?

    /// The duration of the event. For example, "1D" is one day and "40Y" is fourty years.
    public var duration: String?

    /// The people that participated in the event.
    public var participants: [DatasetEntityRef]?

    /// The places that the event happened at.
    public var locations: [DatasetEntityRef]?

    /// The people groups that participated in the event.
    public var groups: [DatasetEntityRef]?

    /// The event that this event is a part of.
    public var partOf: DatasetEntityRef?

    /// The event that happened before this event.
    public var predecessor: DatasetEntityRef?

    /// The list of Bible references that describe the event. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
    public var references: [VerseRef]

    public init(
        id: String,
        name: String,
        startDate: String? = nil,
        duration: String? = nil,
        participants: [DatasetEntityRef]? = nil,
        locations: [DatasetEntityRef]? = nil,
        groups: [DatasetEntityRef]? = nil,
        partOf: DatasetEntityRef? = nil,
        predecessor: DatasetEntityRef? = nil,
        references: [VerseRef]
    ) {
        self.id = id
        self.name = name
        self.startDate = startDate
        self.duration = duration
        self.participants = participants
        self.locations = locations
        self.groups = groups
        self.partOf = partOf
        self.predecessor = predecessor
        self.references = references
    }
}

/// The list of people groups in a dataset. Maps to the /api/d/:datasetId/groups.json endpoint.
public struct ApiDatasetPeopleGroups: Codable, Hashable, Sendable {
    /// The dataset information for the people groups.
    public var dataset: ApiDataset

    /// The list of people groups that are available for the dataset.
    public var groups: [ApiDatasetPeopleGroupSummary]

    public init(
        dataset: ApiDataset,
        groups: [ApiDatasetPeopleGroupSummary]
    ) {
        self.dataset = dataset
        self.groups = groups
    }
}

/// Defines a summary of a people group in a dataset.
public struct ApiDatasetPeopleGroupSummary: Codable, Hashable, Sendable {
    /// The ID of the people group.
    public var id: String

    /// The name of the people group.
    public var name: String

    /// The number of people that are members of the people group.
    public var numberOfMembers: Int

    /// The API link for the people group. Relative to the API origin.
    public var thisPeopleGroupApiLink: String

    public init(
        id: String,
        name: String,
        numberOfMembers: Int,
        thisPeopleGroupApiLink: String
    ) {
        self.id = id
        self.name = name
        self.numberOfMembers = numberOfMembers
        self.thisPeopleGroupApiLink = thisPeopleGroupApiLink
    }
}

/// The information about a people group in a dataset. Maps to the /api/d/:datasetId/groups/:groupId.json endpoint.
public struct ApiDatasetPeopleGroup: Codable, Hashable, Sendable {
    /// The dataset information for the people group.
    public var dataset: ApiDataset

    /// The information about the people group.
    public var group: DatasetPeopleGroup

    /// The API link for this people group. Relative to the API origin.
    public var thisPeopleGroupApiLink: String

    public init(
        dataset: ApiDataset,
        group: DatasetPeopleGroup,
        thisPeopleGroupApiLink: String
    ) {
        self.dataset = dataset
        self.group = group
        self.thisPeopleGroupApiLink = thisPeopleGroupApiLink
    }
}

/// Defines the schema for information about a people group in a dataset.
public struct DatasetPeopleGroup: Codable, Hashable, Sendable {
    /// The ID of the people group.
    public var id: String

    /// The name of the people group.
    public var name: String

    /// The people that are members of the people group.
    public var members: [DatasetEntityRef]?

    /// The events that the people group participated in.
    public var events: [DatasetEntityRef]?

    /// The list of Bible references that mention the people group. Sorted by book order, chapter, and verse. Consecutive verses in the same chapter are collapsed into a single reference using `endVerse`.
    public var references: [VerseRef]

    public init(
        id: String,
        name: String,
        members: [DatasetEntityRef]? = nil,
        events: [DatasetEntityRef]? = nil,
        references: [VerseRef]
    ) {
        self.id = id
        self.name = name
        self.members = members
        self.events = events
        self.references = references
    }
}

/// The list of lexicon entries in a dataset. Maps to the /api/d/:datasetId/lexicon.json endpoint.
public struct ApiDatasetLexicon: Codable, Hashable, Sendable {
    /// The dataset information for the lexicon.
    public var dataset: ApiDataset

    /// The list of lexicon entries that are available for the dataset.
    public var lexicon: [ApiDatasetLexiconEntrySummary]

    public init(
        dataset: ApiDataset,
        lexicon: [ApiDatasetLexiconEntrySummary]
    ) {
        self.dataset = dataset
        self.lexicon = lexicon
    }
}

/// Defines a summary of a lexicon entry in a dataset.
public struct ApiDatasetLexiconEntrySummary: Codable, Hashable, Sendable {
    /// The Strong's number of the lexicon entry.
    public var id: String

    /// The language of the lexicon entry.
    public var language: OriginalLanguage

    /// The name of the lexicon entry. This is the lemma of the entry's first sense.
    public var name: String

    /// The API link for the lexicon entry. Relative to the API origin.
    public var apiLink: String

    public init(
        id: String,
        language: OriginalLanguage,
        name: String,
        apiLink: String
    ) {
        self.id = id
        self.language = language
        self.name = name
        self.apiLink = apiLink
    }
}

/// The information about a lexicon entry in a dataset. Maps to the /api/d/:datasetId/lexicon/:strongs.json endpoint.
public struct ApiDatasetLexiconEntry: Codable, Hashable, Sendable {
    /// The dataset information for the lexicon entry.
    public var dataset: ApiDataset

    /// The lexicon entry.
    public var entry: DatasetLexiconEntry

    /// The API link for this lexicon entry. Relative to the API origin.
    public var thisLexiconEntryApiLink: String

    public init(
        dataset: ApiDataset,
        entry: DatasetLexiconEntry,
        thisLexiconEntryApiLink: String
    ) {
        self.dataset = dataset
        self.entry = entry
        self.thisLexiconEntryApiLink = thisLexiconEntryApiLink
    }
}

/// Defines the schema for a sense of a lexicon entry in a dataset.
public struct DatasetLexiconSense: Codable, Hashable, Sendable {
    /// The extended ID of the sense, such as `H0001G`. Equal to the base Strong's number when the number has a single sense.
    public var id: String

    /// The language of the sense.
    public var language: OriginalLanguage

    /// The lemma of the sense in the original script.
    public var lemma: String

    /// The transliteration of the lemma.
    public var transliteration: String?

    /// The part of speech (morphology) code of the sense.
    public var partOfSpeech: String?

    /// The short English gloss of the sense.
    public var gloss: String?

    /// The definition of the sense as plain text. Paragraphs are separated by blank lines.
    public var definition: String

    public init(
        id: String,
        language: OriginalLanguage,
        lemma: String,
        transliteration: String? = nil,
        partOfSpeech: String? = nil,
        gloss: String? = nil,
        definition: String
    ) {
        self.id = id
        self.language = language
        self.lemma = lemma
        self.transliteration = transliteration
        self.partOfSpeech = partOfSpeech
        self.gloss = gloss
        self.definition = definition
    }
}

/// Defines the schema for a lexicon entry in a dataset. There is one entry per base Strong's number.
public struct DatasetLexiconEntry: Codable, Hashable, Sendable {
    /// The zero-padded Strong's number of the entry, such as `H0430` or `G3056`.
    public var id: String

    /// The language of the entry. This is the language of the entry's first sense.
    public var language: OriginalLanguage

    /// The senses of the entry, in ID order.
    public var senses: [DatasetLexiconSense]

    public init(
        id: String,
        language: OriginalLanguage,
        senses: [DatasetLexiconSense]
    ) {
        self.id = id
        self.language = language
        self.senses = senses
    }
}

/// The list of every verse in a dataset whose verses have categories. Maps to the /api/d/:datasetId/verses.json endpoint.
public struct ApiDatasetVerses: Codable, Hashable, Sendable {
    /// The dataset information for the verses.
    public var dataset: ApiDataset

    /// Every verse (or short passage) in the dataset, with its categories, in canonical order.
    public var verses: [ApiDatasetCategorizedVerse]

    /// The holidays that have their own verses, with their dates. On a holiday, the verse of the day is one of the verses in the holiday's category, and those verses aren't used on other days. Omitted if the dataset has no holidays.
    public var holidays: [ApiDatasetVersesHoliday]?

    public init(
        dataset: ApiDataset,
        verses: [ApiDatasetCategorizedVerse],
        holidays: [ApiDatasetVersesHoliday]? = nil
    ) {
        self.dataset = dataset
        self.verses = verses
        self.holidays = holidays
    }
}

/// Defines a verse (or short passage) in a dataset, with the categories it belongs to.
public struct ApiDatasetCategorizedVerse: Codable, Hashable, Sendable {
    public var book: BookId

    /// The chapter number.
    public var chapter: Int

    /// The verse number. If `endVerse` is present, then this is the verse that the passage starts at.
    public var verse: Int

    /// The verse that the passage ends at. Omitted if the entry is a single verse.
    public var endVerse: Int?

    /// The IDs of the categories that the verse belongs to, most relevant first. Each ID matches a category in the `categories` collection of the dataset (`/api/d/{dataset}/categories/{id}.json`).
    public var categories: [String]

    /// The first year that the verse can be the verse of the day. Omitted if the verse has always been in the list.
    public var addedIn: Int?

    /// The first year that the verse can no longer be the verse of the day. Removed verses stay in the dataset so that the verses of earlier years can still be picked. Omitted if the verse hasn't been removed from the list.
    public var removedIn: Int?

    public init(
        book: BookId,
        chapter: Int,
        verse: Int,
        endVerse: Int? = nil,
        categories: [String],
        addedIn: Int? = nil,
        removedIn: Int? = nil
    ) {
        self.book = book
        self.chapter = chapter
        self.verse = verse
        self.endVerse = endVerse
        self.categories = categories
        self.addedIn = addedIn
        self.removedIn = removedIn
    }
}

/// Defines a holiday that has its own verses, with its dates. It either falls on the same `month` and `day` every year, or lists its `dates`.
public struct ApiDatasetVersesHoliday: Codable, Hashable, Sendable {
    /// The month of a holiday that falls on the same date every year (1 for January). Omitted for holidays whose date changes every year.
    public var month: Int?

    /// The day of the month of a holiday that falls on the same date every year. Omitted for holidays whose date changes every year.
    public var day: Int?

    /// The dates of a holiday whose date changes every year (such as Resurrection Sunday), as `YYYY-MM-DD` strings in the Gregorian calendar, in order. They are precomputed for a range of years, so the holiday is only observed in the years that are listed. Omitted for holidays that fall on the same date every year.
    public var dates: [String]?

    /// The ID of the holiday's category, such as `christmas`.
    public var id: String

    /// The English name of the holiday, such as `Christmas`.
    public var name: String

    public init(
        month: Int? = nil,
        day: Int? = nil,
        dates: [String]? = nil,
        id: String,
        name: String
    ) {
        self.month = month
        self.day = day
        self.dates = dates
        self.id = id
        self.name = name
    }
}

/// The list of verse categories in a dataset. Maps to the /api/d/:datasetId/categories.json endpoint.
public struct ApiDatasetCategories: Codable, Hashable, Sendable {
    /// The dataset information for the categories.
    public var dataset: ApiDataset

    /// The list of verse categories that are available for the dataset.
    public var categories: [ApiDatasetCategorySummary]

    public init(
        dataset: ApiDataset,
        categories: [ApiDatasetCategorySummary]
    ) {
        self.dataset = dataset
        self.categories = categories
    }
}

/// Defines a summary of a verse category in a dataset.
public struct ApiDatasetCategorySummary: Codable, Hashable, Sendable {
    /// The ID of the category, such as `hope`.
    public var id: String

    /// The English name of the category, such as `Hope`.
    public var name: String

    /// The description of what the verses in the category are about.
    public var description: String

    /// The number of verses (or short passages) that belong to the category.
    public var numberOfVerses: Int

    /// The dates of the holiday that the category is for. Omitted for categories that aren't for a holiday.
    public var holiday: DatasetCategoryHoliday?

    /// The API link for the category. Relative to the API origin.
    public var apiLink: String

    public init(
        id: String,
        name: String,
        description: String,
        numberOfVerses: Int,
        holiday: DatasetCategoryHoliday? = nil,
        apiLink: String
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.numberOfVerses = numberOfVerses
        self.holiday = holiday
        self.apiLink = apiLink
    }
}

/// Defines the schema for the dates of a holiday that a category of verses is for. A holiday either falls on the same `month` and `day` every year, or lists its `dates`.
public struct DatasetCategoryHoliday: Codable, Hashable, Sendable {
    /// The month of a holiday that falls on the same date every year (1 for January). Omitted for holidays whose date changes every year.
    public var month: Int?

    /// The day of the month of a holiday that falls on the same date every year. Omitted for holidays whose date changes every year.
    public var day: Int?

    /// The dates of a holiday whose date changes every year (such as Resurrection Sunday), as `YYYY-MM-DD` strings in the Gregorian calendar, in order. They are precomputed for a range of years, so the holiday is only observed in the years that are listed. Omitted for holidays that fall on the same date every year.
    public var dates: [String]?

    public init(
        month: Int? = nil,
        day: Int? = nil,
        dates: [String]? = nil
    ) {
        self.month = month
        self.day = day
        self.dates = dates
    }
}

/// The information about a verse category in a dataset. Maps to the /api/d/:datasetId/categories/:categoryId.json endpoint.
public struct ApiDatasetCategory: Codable, Hashable, Sendable {
    /// The dataset information for the category.
    public var dataset: ApiDataset

    /// The category, with the verses that belong to it.
    public var category: DatasetCategory

    /// The API link for this category. Relative to the API origin.
    public var thisCategoryApiLink: String

    public init(
        dataset: ApiDataset,
        category: DatasetCategory,
        thisCategoryApiLink: String
    ) {
        self.dataset = dataset
        self.category = category
        self.thisCategoryApiLink = thisCategoryApiLink
    }
}

/// Defines the schema for a verse (or short passage) in a category of a dataset.
public struct DatasetCategoryVerse: Codable, Hashable, Sendable {
    public var book: BookId

    /// The chapter number that the reference starts at.
    public var chapter: Int

    /// The verse number that the reference starts at.
    public var verse: Int

    /// The rest of the content of the verse reference. This is the part of the string that comes after the verse reference. For example, in "GEN 1:1 In the beginning, God created the Heavens and the Earth.", the content would be "In the beginning, God created the Heavens and the Earth."
    public var content: String?

    /// The chapter that the verse reference ends at. This is used for references that span multiple chapters, such as "GEN 1:1-2:3". In this case, the endChapter would be 2.
    public var endChapter: Int?

    /// The verse that the verse reference ends at. This is used for references that span multiple verses, such as "GEN 1:1-1:3". In this case, the endVerse would be 3.
    public var endVerse: Int?

    /// The first year that the verse can be the verse of the day. Omitted if the verse has always been in the list.
    public var addedIn: Int?

    /// The first year that the verse can no longer be the verse of the day. Removed verses stay in the dataset so that the verses of earlier years can still be picked. Omitted if the verse hasn't been removed from the list.
    public var removedIn: Int?

    public init(
        book: BookId,
        chapter: Int,
        verse: Int,
        content: String? = nil,
        endChapter: Int? = nil,
        endVerse: Int? = nil,
        addedIn: Int? = nil,
        removedIn: Int? = nil
    ) {
        self.book = book
        self.chapter = chapter
        self.verse = verse
        self.content = content
        self.endChapter = endChapter
        self.endVerse = endVerse
        self.addedIn = addedIn
        self.removedIn = removedIn
    }
}

/// Defines the schema for a category of verses in a dataset.
public struct DatasetCategory: Codable, Hashable, Sendable {
    /// The ID of the category, such as `hope`.
    public var id: String

    /// The English name of the category, such as `Hope`.
    public var name: String

    /// The description of what the verses in the category are about.
    public var description: String

    /// The dates of the holiday that the category is for. On those dates, the verse of the day is one of the category's verses, and the category's verses aren't used on other days. Omitted for categories that aren't for a holiday.
    public var holiday: DatasetCategoryHoliday?

    /// The verses (or short passages) that belong to the category, in canonical order. Includes verses that have been removed from the list (see `removedIn`).
    public var verses: [DatasetCategoryVerse]

    public init(
        id: String,
        name: String,
        description: String,
        holiday: DatasetCategoryHoliday? = nil,
        verses: [DatasetCategoryVerse]
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.holiday = holiday
        self.verses = verses
    }
}

public enum ApiDatasetBookChapterResponse: Codable, Hashable, Sendable {
    case datasetBookChapter(ApiDatasetBookChapter)
    case datasetEntityBookChapter(ApiDatasetEntityBookChapter)
    /// A value that this version of the SDK doesn't know about.
    case unknown(JSONValue)

    public init(from decoder: Decoder) throws {
        if let container = try? decoder.container(keyedBy: AnyCodingKey.self) {
            if container.contains(AnyCodingKey("numberOfVerses")) {
                self = .datasetBookChapter(try ApiDatasetBookChapter(from: decoder))
                return
            }
            if container.contains(AnyCodingKey("numberOfPeople")) {
                self = .datasetEntityBookChapter(try ApiDatasetEntityBookChapter(from: decoder))
                return
            }
        }
        self = .unknown(try JSONValue(from: decoder))
    }

    public func encode(to encoder: Encoder) throws {
        switch self {
        case .datasetBookChapter(let value):
            try value.encode(to: encoder)
        case .datasetEntityBookChapter(let value):
            try value.encode(to: encoder)
        case .unknown(let value):
            try value.encode(to: encoder)
        }
    }
}
