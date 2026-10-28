# jpn-bungo-translation Specification

## Purpose

Serves the complete public domain Japanese Bungo-yaku Bible (文語訳: the Meiji Old Testament of 1887 and the Taisho New Testament of 1917) from the API as the `jpn_bun` translation.

## Requirements

### Requirement: Translation metadata
The API SHALL list a translation with id `jpn_bun`, name `文語訳`, English name `Japanese Bungo-yaku (1887/1917)`, language `jpn`, and text direction `ltr`. Its license SHALL be public domain, with attribution not required and commercial use and derivatives allowed. Its website and license URL SHALL point to the open-bibles source file the text was taken from, at commit `5a86195a040b18bb8ec6348984429b726af98774` of `KallynGowdy/open-bibles`.

#### Scenario: Listed in available translations
- **WHEN** a client requests `/api/available_translations.json`
- **THEN** it contains an entry with `id` `jpn_bun`, `name` `文語訳`, `englishName` `Japanese Bungo-yaku (1887/1917)`, `language` `jpn`, and `numberOfBooks` 66

### Requirement: Complete book, chapter and verse coverage
The translation SHALL contain all 66 Protestant canon books and 1,189 chapters. Each chapter SHALL contain one verse for each `<verse>` element in the source chapter, which makes 31,080 verses in total. Verses whose `osisID` lists several references (e.g. `Num.15.4 Num.15.5`) SHALL be a single verse range.

#### Scenario: Book list
- **WHEN** a client requests `/api/jpn_bun/books.json`
- **THEN** it lists 66 books from `GEN` to `REV` with the source's chapter counts (e.g. `PSA` has 150 chapters)

### Requirement: Verse text is plain Japanese without furigana
Verse text SHALL be the base Japanese text, with no furigana readings.

#### Scenario: Spot-checked verses
- **WHEN** a client reads Genesis 1:1, Psalm 23:1 and John 3:16
- **THEN** they read, respectively:
  - `元始に神天地を創造たまへり`
  - `ヱホバは我が牧者なり われ乏しきことあらじ`
  - `それ神はその獨子を賜ふほどに世を愛し給へり、すべて彼を信ずる者の亡びずして、永遠の生命を得んためなり。`

#### Scenario: Psalm title preserved
- **WHEN** a client requests `/api/jpn_bun/PSA/3.json`
- **THEN** the chapter begins with a Hebrew subtitle reading `ダビデその子アブサロムを避しときのうた`
