# jpn-kougo-translation Specification

## Purpose

Serves the complete public domain Japanese Kougo-yaku Bible (口語訳, 1954/1955 edition) from the API as the `jpn_kou` translation.

## Requirements

### Requirement: Translation metadata
The API SHALL list a translation with id `jpn_kou`, name `口語訳`, English name `Japanese Kougo-yaku (1955)`, language `jpn`, and text direction `ltr`. Its license SHALL be public domain, with attribution not required and commercial use and derivatives allowed. Its website and license URL SHALL point to the open-bibles source file the text was taken from.

#### Scenario: Listed in available translations
- **WHEN** a client requests `/api/available_translations.json`
- **THEN** it contains an entry with `id` `jpn_kou`, `name` `口語訳`, `englishName` `Japanese Kougo-yaku (1955)`, `language` `jpn`, and `numberOfBooks` 66

### Requirement: Complete book, chapter and verse coverage
The translation SHALL contain all 66 Protestant canon books and 1,189 chapters. Each chapter SHALL contain one verse for each `<verse>` element in the source chapter. The one exception is Exodus 22, whose split verse 3 is a single verse, which makes 31,087 verses in total. Versification SHALL follow the source without renumbering. In particular, 2 Corinthians 13 ends at verse 13, and 3 John 1:15, Revelation 12:18 and Psalm 47:10 exist.

#### Scenario: Book list
- **WHEN** a client requests `/api/jpn_kou/books.json`
- **THEN** it lists 66 books from `GEN` to `REV` with the source's chapter counts (e.g. `PSA` has 150 chapters)

#### Scenario: Versification differences from the KJV
- **WHEN** a client requests `/api/jpn_kou/2CO/13.json` and `/api/jpn_kou/REV/12.json`
- **THEN** 2 Corinthians 13 has 13 verses and Revelation 12 has 18 verses

### Requirement: Verse text is plain Japanese without furigana
Verse text SHALL be the base Japanese text of the 1954/1955 edition, with no furigana readings and no chapter labels.

#### Scenario: Spot-checked verses
- **WHEN** a client reads Genesis 1:1, Psalm 23:1, John 3:16 and Revelation 22:21
- **THEN** they read, respectively:
  - `はじめに神は天と地とを創造された。`
  - `主はわたしの牧者であって、わたしには乏しいことがない。` (two poetry lines)
  - `神はそのひとり子を賜わったほどに、この世を愛して下さった。それは御子を信じる者がひとりも滅びないで、永遠の命を得るためである。`
  - `主イエスの恵みが、一同の者と共にあるように。`

#### Scenario: Psalm title preserved
- **WHEN** a client requests `/api/jpn_kou/PSA/23.json`
- **THEN** the chapter begins with a Hebrew subtitle reading `ダビデの歌`
