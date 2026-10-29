import Foundation
import XCTest
@testable import FreeUseBibleAPI

final class VerseOfTheDayTests: XCTestCase {
    var api: FreeUseBibleAPI!

    override func setUp() {
        api = FreeUseBibleAPI(transport: FixtureTransport())
    }

    // 400 different verses: more than there are days in a year.
    let verses = (0..<400).map { i in
        ApiDatasetCategorizedVerse(
            book: .PSA,
            chapter: i / 10 + 1,
            verse: i % 10 + 1,
            categories: [i % 2 == 0 ? "hope" : "peace"]
        )
    }

    func ref(_ verse: ApiDatasetCategorizedVerse?) -> String? {
        verse.map { "\($0.book.rawValue) \($0.chapter):\($0.verse)" }
    }

    func testHashesKeysTheSameWayAsTheJavaScriptClient() {
        XCTAssertEqual(hashVerseOfTheDayKey(""), 2872998923)
        XCTAssertEqual(hashVerseOfTheDayKey("a"), 444641715)
        XCTAssertEqual(hashVerseOfTheDayKey("|JHN 3:16"), 3773609941)
        XCTAssertEqual(hashVerseOfTheDayKey("my-app|PSA 23:1"), 3194902081)
        XCTAssertEqual(hashVerseOfTheDayKey("é|GEN 1:1"), 3708505705)
    }

    func testCountsTheDaysFrom1970() throws {
        XCTAssertEqual(try getDayNumber("1970-01-01"), 0)
        XCTAssertEqual(try getDayNumber("1969-12-31"), -1)
        XCTAssertEqual(try getDayNumber("2026-10-27"), 20753)
        XCTAssertEqual(try getDayNumber("2926-01-01"), 349172)
        XCTAssertEqual(try getDayNumber("0001-01-01"), -719162)
        XCTAssertThrowsError(try getDayNumber("2926-1-1")) { XCTAssertTrue($0 is InvalidDateError) }
        XCTAssertThrowsError(try getDayNumber("2926-02-29")) { XCTAssertTrue($0 is InvalidDateError) }
        XCTAssertThrowsError(try getDayNumber("2926-01-01x"))
        XCTAssertEqual(try getDayNumber("2028-02-29"), try getDayNumber("2028-03-01") - 1)
    }

    func testPicksTheSameVersesAsTheJavaScriptClient() async throws {
        // Computed with the JavaScript client's pickVerseOfTheDay() for the verses in the verses.json fixture.
        let expected: [(String, String, String?, String)] = [
            ("2926-01-01", "", nil, "JHN 3:16"),
            ("2926-01-02", "", nil, "PRO 3:5"),
            ("1969-12-31", "", nil, "PRO 3:3"),
            ("2026-10-27", "", nil, "JHN 3:17"),
            ("2926-01-01", "my-app", nil, "PRO 3:3"),
        ]
        for (date, seed, category, expectedRef) in expected {
            let verse = try await api.getVerseOfTheDay(date: date, seed: seed, category: category)
            XCTAssertEqual(ref(verse), expectedRef, "\(date) \(seed) \(category ?? "")")
        }
    }

    func testPicksTheSameVersesAsTheJavaScriptClientWhenVersesAreAddedAndRemoved() async throws {
        // Computed with the JavaScript client's pickVerseOfTheDay() for the verses in the verses.json fixture,
        // with JHN 3:16 added in 2927 and PRO 3:3 removed in 2927.
        // Only the verses of the chapter 3 fixtures (not the Christmas verses).
        let changed = try await api.getDatasetVerses(dataset: "verse-of-the-day").verses.filter { $0.chapter == 3 }.map { verse in
            var verse = verse
            switch ref(verse) {
            case "JHN 3:16": verse.addedIn = 2927
            case "PRO 3:3": verse.removedIn = 2927
            default: break
            }
            return verse
        }
        let expected = [
            "2926-01-01": "PRO 3:5",
            "2926-01-02": "PRO 3:3",
            "2926-01-03": "PRO 3:27",
            "2926-01-04": "JHN 3:17",
            "2927-01-01": "JHN 3:17",
            "2927-01-02": "PRO 3:27",
            "2927-01-03": "PRO 3:5",
            "2927-01-04": "JHN 3:16",
        ]
        for (date, expectedRef) in expected {
            XCTAssertEqual(ref(try pickVerseOfTheDay(changed, date: date)), expectedRef, date)
        }
    }

    func testOnlyPicksVersesThatAreInUseInTheYear() {
        let verse = ApiDatasetCategorizedVerse(book: .JHN, chapter: 3, verse: 16, categories: [], addedIn: 2027, removedIn: 2030)
        XCTAssertEqual((2026...2030).map { isVerseOfTheDayInUse(verse, year: Int64($0)) }, [false, true, true, true, false])
    }

    // The test values from the Verse of the Day Convention page (docs/reference/datasets/verse-of-the-day-convention.md).
    func testMatchesTheTestValuesOnTheConventionPage() throws {
        XCTAssertEqual(hashVerseOfTheDayKey("|2026|JHN 3:16"), 1930190452)
        XCTAssertEqual(hashVerseOfTheDayKey("my-app|2026|PSA 23:1"), 2020168843)
        XCTAssertEqual(hashVerseOfTheDayKey("é|1|GEN 1:1"), 3677064616)

        for (date, year, dayOfYear) in [
            ("2026-01-01", 2026, 0),
            ("2028-02-29", 2028, 59),
            ("2000-12-31", 2000, 365),
            ("1900-12-31", 1900, 364),
            ("0001-03-01", 1, 59),
        ] {
            let result = try getYearAndDayOfYear(date)
            XCTAssertEqual(result.year, Int64(year), date)
            XCTAssertEqual(result.dayOfYear, dayOfYear, date)
        }

        func v(_ book: BookId, _ chapter: Int, _ verse: Int, _ categories: String..., endVerse: Int? = nil, addedIn: Int? = nil, removedIn: Int? = nil) -> ApiDatasetCategorizedVerse {
            ApiDatasetCategorizedVerse(book: book, chapter: chapter, verse: verse, endVerse: endVerse, categories: categories, addedIn: addedIn, removedIn: removedIn)
        }
        let list = [
            v(.GEN, 1, 1, "praise"),
            v(.PSA, 23, 1, "comfort", "provision"),
            v(.PRO, 3, 5, "faith", "guidance", endVerse: 6),
            v(.ISA, 40, 31, "strength", "hope"),
            v(.JHN, 3, 16, "love", "salvation"),
            v(.ROM, 8, 28, "hope", removedIn: 2027),
            v(.PHP, 4, 13, "strength"),
            v("1JN", 4, 19, "love", addedIn: 2027),
            v(.LUK, 2, 7, "christmas"),
            v(.LUK, 2, 10, "christmas", endVerse: 11),
            v(.MAT, 1, 23, "christmas", addedIn: 2027),
            v(.MAT, 28, 6, "resurrection-sunday"),
            v(.ACT, 2, 24, "post-resurrection-sunday"),
            v(.ROM, 6, 9, "post-resurrection-sunday"),
            v("1CO", 15, 20, "post-resurrection-sunday"),
            v("1TH", 4, 14, "post-resurrection-sunday"),
        ]
        let holidays = [
            ApiDatasetVersesHoliday(month: 12, day: 24, id: "christmas-eve", name: "Christmas Eve"),
            ApiDatasetVersesHoliday(month: 12, day: 25, id: "christmas", name: "Christmas"),
            ApiDatasetVersesHoliday(dates: ["2026-04-05", "2027-03-28"], id: "resurrection-sunday", name: "Resurrection Sunday"),
            ApiDatasetVersesHoliday(
                dates: ["2026-04-06", "2026-04-07", "2026-04-08", "2027-03-29", "2027-03-30", "2027-03-31"],
                id: "post-resurrection-sunday",
                name: "After Resurrection Sunday"
            ),
        ]
        let expected: [(String, String, String?, String?)] = [
            ("2026-01-01", "", nil, "PSA 23:1"),
            ("2026-01-02", "", nil, "ROM 8:28"),
            ("2026-03-15", "", nil, "JHN 3:16"),
            ("2026-12-31", "", nil, "PSA 23:1"),
            ("2027-01-01", "", nil, "JHN 3:16"),
            ("2027-06-30", "", nil, "PRO 3:5"),
            ("2028-02-29", "", nil, "PRO 3:5"),
            ("2028-12-31", "", nil, "PSA 23:1"),
            ("1969-12-31", "", nil, "PRO 3:5"),
            ("0001-01-01", "", nil, "ISA 40:31"),
            ("2026-01-01", "my-app", nil, "ISA 40:31"),
            ("2027-01-01", "my-app", nil, "PHP 4:13"),
            ("2026-01-01", "", "hope", "ROM 8:28"),
            ("2027-01-01", "", "hope", "ISA 40:31"),
            ("2027-01-01", "", "joy", nil),
            ("2026-12-25", "", nil, "LUK 2:10"),
            ("2027-12-25", "", nil, "LUK 2:7"),
            ("2028-12-25", "", nil, "LUK 2:10"),
            ("2029-12-25", "", nil, "MAT 1:23"),
            ("2026-12-25", "my-app", nil, "LUK 2:10"),
            ("2026-04-05", "", nil, "MAT 28:6"),
            ("2027-03-28", "", nil, "MAT 28:6"),
            ("2028-04-16", "", nil, "PSA 23:1"),
            ("2026-12-24", "", nil, "PSA 23:1"),
            ("2026-07-01", "", "christmas", "LUK 2:7"),
            ("2026-04-06", "", nil, "1CO 15:20"),
            ("2026-04-07", "", nil, "ACT 2:24"),
            ("2026-04-08", "", nil, "1TH 4:14"),
            ("2026-04-09", "", nil, "PSA 23:1"),
            ("2027-03-29", "", nil, "ROM 6:9"),
            ("2027-03-30", "", nil, "1CO 15:20"),
            ("2027-03-31", "", nil, "ACT 2:24"),
        ]
        for (date, seed, category, expectedRef) in expected {
            let verse = try pickVerseOfTheDay(list, date: date, seed: seed, category: category, holidays: holidays)
            XCTAssertEqual(ref(verse), expectedRef, "\(date) \(seed) \(category ?? "")")
        }
    }

    func testPicksHolidayVersesOnHolidaysLikeTheJavaScriptClient() async throws {
        // Computed with the JavaScript client's pickVerseOfTheDay() for the verses and holidays in the verses.json fixture,
        // which has the Christmas verses but no verses for Christmas Eve or Resurrection Sunday.
        let expected: [(String, String, String?, String)] = [
            ("2026-12-25", "", nil, "ISA 9:6"),
            ("2027-12-25", "", nil, "LUK 2:20"),
            ("2028-12-25", "", nil, "LUK 2:10"),
            ("2026-12-24", "", nil, "PRO 3:3"),
            ("2026-04-05", "", nil, "JHN 3:17"),
            ("2026-12-25", "", "love", "PRO 3:3"),
        ]
        for (date, seed, category, expectedRef) in expected {
            let verse = try await api.getVerseOfTheDay(date: date, seed: seed, category: category)
            XCTAssertEqual(ref(verse), expectedRef, "\(date) \(seed) \(category ?? "")")
        }
    }

    func testDoesNotRepeatAVerseWithinACalendarYear() throws {
        for seed in ["", "my-app"] {
            for year in [2924, 2925, 2100, 2400] {
                let start = try getDayNumber("\(year)-01-01")
                let days = Int(try getDayNumber("\(year + 1)-01-01") - start)
                let picks = try (0..<days).map { i in ref(try pickVerseOfTheDay(verses, date: isoDate(start + Int64(i)), seed: seed)) }
                XCTAssertEqual(Set(picks).count, days, "\(year)")
            }
        }
    }

    func testUsesADifferentOrderEveryYear() throws {
        let first = try getDayNumber("2925-01-01")
        let second = try getDayNumber("2926-01-01")
        let sameDay = try (0..<365).filter { i in
            try pickVerseOfTheDay(verses, date: isoDate(first + Int64(i))) == pickVerseOfTheDay(verses, date: isoDate(second + Int64(i)))
        }.count
        XCTAssertLessThan(sameDay, 10)
    }

    func testUsesADifferentOrderForADifferentSeedAndIgnoresTheOrderOfTheList() throws {
        let start = try getDayNumber("2926-01-01")
        let days = (0..<30).map { isoDate(start + Int64($0)) }
        XCTAssertNotEqual(
            try days.map { ref(try pickVerseOfTheDay(verses, date: $0)) },
            try days.map { ref(try pickVerseOfTheDay(verses, date: $0, seed: "my-app")) }
        )
        XCTAssertEqual(
            try days.map { ref(try pickVerseOfTheDay(verses, date: $0)) },
            try days.map { ref(try pickVerseOfTheDay(verses.reversed(), date: $0)) }
        )
    }

    func testOnlyPicksVersesFromTheGivenCategory() throws {
        let start = try getDayNumber("2926-01-01")
        for i in 0..<30 {
            let verse = try pickVerseOfTheDay(verses, date: isoDate(start + Int64(i)), category: "hope")
            XCTAssertTrue(verse!.categories.contains("hope"))
        }
        XCTAssertNil(try pickVerseOfTheDay(verses, date: "2926-01-01", category: "joy"))
        XCTAssertNil(try pickVerseOfTheDay([], date: "2926-01-01"))
    }

    func testUsesTheCalendarDateOfADate() throws {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = .current
        let date = calendar.date(from: DateComponents(year: 2926, month: 1, day: 1, hour: 23, minute: 30))!
        XCTAssertEqual(pickVerseOfTheDay(verses, date: date), try pickVerseOfTheDay(verses, date: "2926-01-01"))
        XCTAssertEqual(pickVerseOfTheDay(verses), pickVerseOfTheDay(verses, date: Date()))
    }

    // Converts a day number back to a YYYY-MM-DD string (civil from days).
    func isoDate(_ dayNumber: Int64) -> String {
        let z = dayNumber + 719468
        let era = (z >= 0 ? z : z - 146096) / 146097
        let doe = z - era * 146097
        let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365
        let doy = doe - (365 * yoe + yoe / 4 - yoe / 100)
        let mp = (5 * doy + 2) / 153
        let d = doy - (153 * mp + 2) / 5 + 1
        let m = mp < 10 ? mp + 3 : mp - 9
        let y = yoe + era * 400 + (m <= 2 ? 1 : 0)
        return String(format: "%04d-%02d-%02d", Int(y), Int(m), Int(d))
    }
}
