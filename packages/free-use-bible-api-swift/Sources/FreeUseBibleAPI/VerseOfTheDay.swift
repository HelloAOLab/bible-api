import Foundation

/// The error that is thrown when a date string isn't a valid `YYYY-MM-DD` date.
public struct InvalidDateError: Error, Sendable, CustomStringConvertible {
    /// The date string that couldn't be parsed.
    public var date: String

    public init(date: String) {
        self.date = date
    }

    public var description: String {
        "Invalid date \"\(date)\". Use the YYYY-MM-DD format."
    }
}

extension InvalidDateError: LocalizedError {
    public var errorDescription: String? {
        description
    }
}

// MARK: - Verse of the Day

extension FreeUseBibleAPI {
    /// Gets the verse of the day for the given date from the verse-of-the-day dataset.
    ///
    /// The same date always gives the same verse, a verse doesn't repeat within a calendar year, and each year has a different order.
    /// See `pickVerseOfTheDay(_:date:seed:category:holidays:)` for how the verse is picked.
    /// - Parameters:
    ///   - date: The date to get the verse for, as a `YYYY-MM-DD` string (e.g. `"2026-01-01"`).
    ///   - seed: The seed that the order of the verses is derived from. Different seeds give different (but equally valid) orders.
    ///   - category: Only pick from the verses in this category.
    ///   - dataset: The ID of the dataset to pick from.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The verse (its reference and categories), or `nil` if the dataset has no verses to pick from.
    /// - Throws: ``InvalidDateError`` if the date isn't a valid `YYYY-MM-DD` date.
    public func getVerseOfTheDay(
        date: String,
        seed: String = "",
        category: String? = nil,
        dataset: String = "verse-of-the-day",
        endpoint: URL? = nil
    ) async throws -> ApiDatasetCategorizedVerse? {
        let parts = try parseDate(date)
        let verses = try await getDatasetVerses(dataset: dataset, endpoint: endpoint)
        return pickVerseOfTheDay(verses.verses, parts: parts, seed: seed, category: category, holidays: verses.holidays ?? [])
    }

    /// Gets the verse of the day for the given date from the verse-of-the-day dataset.
    ///
    /// The same date always gives the same verse, a verse doesn't repeat within a calendar year, and each year has a different order.
    /// See `pickVerseOfTheDay(_:date:seed:category:holidays:)` for how the verse is picked.
    /// - Parameters:
    ///   - date: The date to get the verse for. Its calendar date in the current time zone is used. Defaults to today.
    ///   - seed: The seed that the order of the verses is derived from. Different seeds give different (but equally valid) orders.
    ///   - category: Only pick from the verses in this category.
    ///   - dataset: The ID of the dataset to pick from.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    /// - Returns: The verse (its reference and categories), or `nil` if the dataset has no verses to pick from.
    public func getVerseOfTheDay(
        date: Date = Date(),
        seed: String = "",
        category: String? = nil,
        dataset: String = "verse-of-the-day",
        endpoint: URL? = nil
    ) async throws -> ApiDatasetCategorizedVerse? {
        let verses = try await getDatasetVerses(dataset: dataset, endpoint: endpoint)
        return pickVerseOfTheDay(verses.verses, parts: dateParts(date), seed: seed, category: category, holidays: verses.holidays ?? [])
    }
}

/// Picks the verse of the day for the given date from the given list of verses.
///
/// The pick follows a fixed convention, so every implementation (including the JavaScript/TypeScript client's
/// `pickVerseOfTheDay()` and the Kotlin SDK's) picks the same verse on the same day:
///
/// 1. Only the verses that are in use in the year of the date are picked from: those whose `addedIn` year is
///    unset or at most the year, and whose `removedIn` year is unset or after the year.
/// 2. If a category is given, the verses in that category are picked from by the day of the year (as in 4).
/// 3. Otherwise, if the date is a holiday (a holiday with the date's month and day, or with the date in its `dates`),
///    the holiday's verses are picked from: sorted as in 4, but with the holiday's ID in place of the year
///    (`"{seed}|{holiday}|{book} {chapter}:{verse}"`), at position `(year * k + i) mod n`, where `k` is the number
///    of days the holiday is observed in the year and `i` is the number of those days before the date. A holiday
///    goes through its verses one year (and day) at a time.
/// 4. Otherwise, the verses that aren't for a holiday are picked from. Each one gets a sort key: the 32-bit FNV-1a hash
///    of the UTF-8 bytes of `"{seed}|{year}|{book} {chapter}:{verse}"` (e.g. `"|2026|JHN 3:16"`), passed through
///    the MurmurHash3 `fmix32` finalizer. They are sorted by their key (as an unsigned number), then by the key's
///    string if two keys are equal, and the verse at position `day mod n` is picked, where `day` is the day of the
///    year of the date (0 for January 1st) and `n` is the number of verses.
///
/// See the [Verse of the Day Convention](https://bible.helloao.org/docs/reference/datasets/verse-of-the-day-convention.html) for the full convention.
///
/// Each year has its own order, so with 366 or more verses a verse never repeats within a calendar year
/// (but can appear on December 31st and again on January 1st), and the order isn't repeated from one year to the next.
/// - Parameters:
///   - verses: The verses to pick from. For example, the `verses` from ``FreeUseBibleAPI/getDatasetVerses(dataset:endpoint:)``.
///   - date: The date to pick the verse for, as a `YYYY-MM-DD` string.
///   - seed: The seed that the order of the verses is derived from. Different seeds give different (but equally valid) orders.
///   - category: Only pick from the verses in this category (including a holiday's category), on any day. Categories have fewer verses than there are days in a year, so their verses repeat sooner.
///   - holidays: The holidays that have their own verses: the `holidays` from ``FreeUseBibleAPI/getDatasetVerses(dataset:endpoint:)``. Without them, holiday verses are picked like any other verse.
/// - Returns: The verse of the day, or `nil` if there are no verses to pick from.
/// - Throws: ``InvalidDateError`` if the date isn't a valid `YYYY-MM-DD` date.
public func pickVerseOfTheDay(
    _ verses: [ApiDatasetCategorizedVerse],
    date: String,
    seed: String = "",
    category: String? = nil,
    holidays: [ApiDatasetVersesHoliday] = []
) throws -> ApiDatasetCategorizedVerse? {
    pickVerseOfTheDay(verses, parts: try parseDate(date), seed: seed, category: category, holidays: holidays)
}

/// Picks the verse of the day for the given date from the given list of verses.
///
/// See `pickVerseOfTheDay(_:date:seed:category:holidays:)` for how the verse is picked.
/// - Parameters:
///   - verses: The verses to pick from. For example, the `verses` from ``FreeUseBibleAPI/getDatasetVerses(dataset:endpoint:)``.
///   - date: The date to pick the verse for. Its calendar date in the current time zone is used. Defaults to today.
///   - seed: The seed that the order of the verses is derived from. Different seeds give different (but equally valid) orders.
///   - category: Only pick from the verses in this category (including a holiday's category), on any day.
///   - holidays: The holidays that have their own verses: the `holidays` from ``FreeUseBibleAPI/getDatasetVerses(dataset:endpoint:)``.
/// - Returns: The verse of the day, or `nil` if there are no verses to pick from.
public func pickVerseOfTheDay(
    _ verses: [ApiDatasetCategorizedVerse],
    date: Date = Date(),
    seed: String = "",
    category: String? = nil,
    holidays: [ApiDatasetVersesHoliday] = []
) -> ApiDatasetCategorizedVerse? {
    pickVerseOfTheDay(verses, parts: dateParts(date), seed: seed, category: category, holidays: holidays)
}

private func pickVerseOfTheDay(
    _ verses: [ApiDatasetCategorizedVerse],
    parts: DateParts,
    seed: String,
    category: String?,
    holidays: [ApiDatasetVersesHoliday]
) -> ApiDatasetCategorizedVerse? {
    let (year, month, day) = parts
    let dayOfYear = Int(daysSinceEpoch(year, month, day) - daysSinceEpoch(year, 1, 1))
    let inUse = verses.filter { isVerseOfTheDayInUse($0, year: year) }

    let candidates: [ApiDatasetCategorizedVerse]
    if let category {
        candidates = inUse.filter { $0.categories.contains(category) }
    } else {
        if let holiday = findHoliday(holidays, year, month, day) {
            let holidayVerses = inUse.filter { $0.categories.contains(holiday.id) }
            if !holidayVerses.isEmpty {
                let sorted = sortByKey(holidayVerses, prefix: "\(seed)|\(holiday.id)")
                let position = getHolidayPosition(holiday, year, month, day)
                return sorted[Int(floorMod(position, Int64(sorted.count)))]
            }
        }
        let holidayIds = Set(holidays.map(\.id))
        candidates = inUse.filter { verse in !verse.categories.contains { holidayIds.contains($0) } }
    }
    if candidates.isEmpty {
        return nil
    }
    let sorted = sortByKey(candidates, prefix: "\(seed)|\(year)")
    return sorted[dayOfYear % sorted.count]
}

/// Determines whether the given verse can be the verse of the day in the given year:
/// its `addedIn` year is unset or at most the year, and its `removedIn` year is unset or after the year.
public func isVerseOfTheDayInUse(_ verse: ApiDatasetCategorizedVerse, year: Int64) -> Bool {
    (verse.addedIn.map { Int64($0) <= year } ?? true) && (verse.removedIn.map { year < Int64($0) } ?? true)
}

/// Gets the number of days from 1970-01-01 to the given date.
/// - Parameter date: The date, as a `YYYY-MM-DD` string.
/// - Throws: ``InvalidDateError`` if the date isn't a valid `YYYY-MM-DD` date.
public func getDayNumber(_ date: String) throws -> Int64 {
    let (year, month, day) = try parseDate(date)
    return daysSinceEpoch(year, month, day)
}

/// Gets the year of the given date and its day of the year (0 for January 1st).
/// - Parameter date: The date, as a `YYYY-MM-DD` string.
/// - Throws: ``InvalidDateError`` if the date isn't a valid `YYYY-MM-DD` date.
public func getYearAndDayOfYear(_ date: String) throws -> (year: Int64, dayOfYear: Int) {
    let (year, month, day) = try parseDate(date)
    return (year, Int(daysSinceEpoch(year, month, day) - daysSinceEpoch(year, 1, 1)))
}

/// Gets the sort key of the given string: its 32-bit FNV-1a hash (of the UTF-8 bytes),
/// passed through the MurmurHash3 fmix32 finalizer.
public func hashVerseOfTheDayKey(_ key: String) -> UInt32 {
    var hash: UInt32 = 0x811c9dc5
    for byte in key.utf8 {
        hash ^= UInt32(byte)
        hash = hash &* 0x01000193
    }
    hash ^= hash >> 16
    hash = hash &* 0x85ebca6b
    hash ^= hash >> 13
    hash = hash &* 0xc2b2ae35
    hash ^= hash >> 16
    return hash
}

private typealias DateParts = (year: Int64, month: Int, day: Int)

/// Gets the position of the given date in the holiday's verses: `year * k + i`, where `k` is the number of days
/// that the holiday is observed in the year and `i` is the number of those days that come before the date.
/// For a holiday that is observed on one day a year, this is just the year.
private func getHolidayPosition(_ holiday: ApiDatasetVersesHoliday, _ year: Int64, _ month: Int, _ day: Int) -> Int64 {
    guard let dates = holiday.dates else {
        return year
    }
    let date = formatDate(year, month, day)
    let yearPrefix = String(date.dropLast(5))
    let datesInYear = dates.filter { $0.hasPrefix(yearPrefix) }
    return year * Int64(datesInYear.count) + Int64(datesInYear.filter { $0 < date }.count)
}

/// Finds the first holiday that falls on the given date.
private func findHoliday(_ holidays: [ApiDatasetVersesHoliday], _ year: Int64, _ month: Int, _ day: Int) -> ApiDatasetVersesHoliday? {
    let date = formatDate(year, month, day)
    return holidays.first { ($0.month == month && $0.day == day) || ($0.dates?.contains(date) ?? false) }
}

/// Sorts the given verses by the hashes of their keys, `"{prefix}|{book} {chapter}:{verse}"`.
private func sortByKey(_ verses: [ApiDatasetCategorizedVerse], prefix: String) -> [ApiDatasetCategorizedVerse] {
    verses
        .map { verse -> (verse: ApiDatasetCategorizedVerse, key: String, hash: UInt32) in
            let key = "\(prefix)|\(verse.book.rawValue) \(verse.chapter):\(verse.verse)"
            return (verse, key, hashVerseOfTheDayKey(key))
        }
        // Compare the keys by their UTF-8 bytes, like JavaScript and Kotlin compare their (ASCII) strings.
        .sorted { $0.hash != $1.hash ? $0.hash < $1.hash : Array($0.key.utf8).lexicographicallyPrecedes(Array($1.key.utf8)) }
        .map(\.verse)
}

private func formatDate(_ year: Int64, _ month: Int, _ day: Int) -> String {
    let y = year < 0 ? "-" + pad(-year, 4) : pad(year, 4)
    return "\(y)-\(pad(Int64(month), 2))-\(pad(Int64(day), 2))"
}

private func pad(_ value: Int64, _ width: Int) -> String {
    let digits = String(value)
    return String(repeating: "0", count: max(0, width - digits.count)) + digits
}

private func dateParts(_ date: Date) -> DateParts {
    let components = Calendar(identifier: .gregorian).dateComponents(in: TimeZone.current, from: date)
    var year = Int64(components.year!)
    if components.era == 0 {
        // Years before 1 AD: 1 BC is year 0 in the proleptic Gregorian calendar.
        year = 1 - year
    }
    return (year, components.month!, components.day!)
}

private func parseDate(_ date: String) throws -> DateParts {
    var rest = Substring(date)
    let negative = rest.hasPrefix("-")
    if negative {
        rest = rest.dropFirst()
    }
    let parts = rest.split(separator: "-", omittingEmptySubsequences: false)
    guard parts.count == 3,
          parts[0].count >= 4, parts[1].count == 2, parts[2].count == 2,
          parts.allSatisfy({ $0.allSatisfy { $0 >= "0" && $0 <= "9" } }),
          let yearValue = Int64(parts[0]), let month = Int(parts[1]), let day = Int(parts[2])
    else {
        throw InvalidDateError(date: date)
    }
    let year = negative ? -yearValue : yearValue
    guard (1...12).contains(month), (1...daysInMonth(year, month)).contains(day) else {
        throw InvalidDateError(date: date)
    }
    return (year, month, day)
}

// Days from civil (proleptic Gregorian calendar), from https://howardhinnant.github.io/date_algorithms.html
private func daysSinceEpoch(_ year: Int64, _ month: Int, _ day: Int) -> Int64 {
    let y = month <= 2 ? year - 1 : year
    let era = floorDiv(y, 400)
    let yearOfEra = y - era * 400
    let dayOfYear = Int64((153 * ((month + 9) % 12) + 2) / 5 + day - 1)
    let dayOfEra = yearOfEra * 365 + yearOfEra / 4 - yearOfEra / 100 + dayOfYear
    return era * 146097 + dayOfEra - 719468
}

private func daysInMonth(_ year: Int64, _ month: Int) -> Int {
    switch month {
    case 2:
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) ? 29 : 28
    case 4, 6, 9, 11:
        return 30
    default:
        return 31
    }
}

private func floorDiv(_ a: Int64, _ b: Int64) -> Int64 {
    let q = a / b
    return (a % b != 0 && (a < 0) != (b < 0)) ? q - 1 : q
}

private func floorMod(_ a: Int64, _ b: Int64) -> Int64 {
    ((a % b) + b) % b
}
