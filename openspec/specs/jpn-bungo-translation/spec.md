# jpn-bungo-translation Specification

## Purpose

Serves the complete public domain Japanese Bungo-yaku Bible (文語訳: the Meiji Old Testament of 1887 and the Taisho New Testament of 1917) from the API as the `jpn_bun` translation.

## Requirements

### Requirement: Translation metadata
The API SHALL list a translation with id `jpn_bun`, name `文語訳`, English name `Japanese Bungo-yaku (1887/1917)`, language `jpn`, and text direction `ltr`. Its license SHALL be public domain, with attribution not required and commercial use and derivatives allowed. Its website and license URL SHALL point to the open-bibles source file the text was taken from, at commit `b8bd6285c0a7e18acfe6abda56597135cb83338c` of `KallynGowdy/open-bibles`.

#### Scenario: Listed in available translations
- **WHEN** a client requests `/api/available_translations.json`
- **THEN** it contains an entry with `id` `jpn_bun`, `name` `文語訳`, `englishName` `Japanese Bungo-yaku (1887/1917)`, `language` `jpn`, and `numberOfBooks` 66

### Requirement: Complete book, chapter and verse coverage
The translation SHALL contain all 66 Protestant canon books and 1,189 chapters. Each chapter SHALL contain one verse for each `<verse>` element in the source chapter, which makes 31,079 verses in total. Verses whose `osisID` lists several references (e.g. `Num.15.4 Num.15.5`) SHALL be a single verse range. The source numbers 2 Samuel 19:25 and 2 Chronicles 2:13 as the verses before them, so those two verses SHALL be renumbered to 25 and 13.

#### Scenario: Corrected verse numbers
- **WHEN** a client requests `/api/jpn_bun/2SA/19.json` and `/api/jpn_bun/2CH/2.json`
- **THEN** 2 Samuel 19 has verses 24, 25, 26 and 27 once each, with verse 25 beginning `彼エルサレムよりきたりて`, and 2 Chronicles 2 has verses 12, 13 and 14 once each, with verse 13 beginning `今我わが達人ヒラム`

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
