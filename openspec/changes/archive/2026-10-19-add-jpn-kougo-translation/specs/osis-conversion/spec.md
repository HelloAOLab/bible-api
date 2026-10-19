## Purpose

Lets maintainers turn an OSIS Bible file into per-book USFM files, so OSIS sources can enter the API through the existing USFM translation import.

## ADDED Requirements

### Requirement: Convert an OSIS file to per-book USFM
The CLI SHALL provide a `convert-osis-to-usfm <file> <dir>` command that reads one OSIS XML file and writes one USFM file per `<div type="book">` into `<dir>`. Each file SHALL start with an `\id` line using the USFM book code that matches the book's OSIS ID (e.g. `Gen` → `GEN`, `Matt` → `MAT`, `1John` → `1JN`). The order of books in the OSIS file SHALL NOT affect the output.

#### Scenario: Whole Bible
- **WHEN** `convert-osis-to-usfm jpn-kougo.osis.xml ./out` runs
- **THEN** `./out` contains 66 USFM files, one per book, even though the OSIS file lists the New Testament first

#### Scenario: Unknown OSIS book
- **WHEN** the OSIS file contains a book whose OSIS ID has no USFM code
- **THEN** the command fails with an error naming that OSIS ID and writes no files

### Requirement: Book titles
The converter SHALL write a book's `<title type="main">` text as that book's `\h`, `\toc1`, `\toc2` and `\mt1` lines.

#### Scenario: Book title becomes the book name
- **WHEN** a book has `<title type="main">創世記</title>`
- **THEN** the USFM contains `\h 創世記` and `\mt1 創世記`, and importing it gives the book the name `創世記`

### Requirement: Chapters and verses
The converter SHALL write a `\c` marker for each `<chapter>` and a `\v` marker for each verse, whether the verse is a container element (`<verse osisID>…</verse>`) or a milestone pair (`<verse sID/>…<verse eID/>`). A verse whose `osisID` lists several references SHALL be written as a verse range from the first to the last reference (`Ps.132.3 Ps.132.4 Ps.132.5` → `\v 3-5`). `<title type="chapter">` labels (e.g. `第一章`) SHALL NOT appear in the output, since the chapter number already carries them.

#### Scenario: Milestone verse across paragraphs
- **WHEN** a verse starts with `<verse sID="Matt.1.6"/>`, crosses a `</p><p>` boundary, and ends with `<verse eID="Matt.1.6"/>`
- **THEN** the USFM has one `\v 6` whose text includes both parts, with a `\p` between them

#### Scenario: Combined verses
- **WHEN** a verse element has `osisID="Rom.1.9 Rom.1.10"`
- **THEN** the USFM contains `\v 9-10` followed by that element's text

#### Scenario: Chapter label dropped
- **WHEN** a chapter contains `<title type="chapter">第一章</title>`
- **THEN** the text `第一章` does not appear anywhere in that chapter's USFM

### Requirement: Split verses are merged in numeric order
When one verse is split into parts (`osisID="Exod.22.3!a"` and `osisID="Exod.22.3!b"`), the converter SHALL write a single `\v` for that verse containing the parts in suffix order (`a`, then `b`). The verses of that chapter SHALL be written in ascending verse order, so that no verse number appears twice.

#### Scenario: Exodus 22:3
- **WHEN** the source orders Exodus 22 as 1, 3b, 4, 2, 3a, 5
- **THEN** the USFM orders it as 1, 2, 3, 4, 5, and verse 3's text is the 3a text followed by the 3b text

### Requirement: Paragraphs, poetry and Psalm titles
The converter SHALL write `<p>` as `\p`, each `<l>` inside `<lg>` as a `\q1` line, and `<title type="psalm">` as a `\d` line. Prose following a closing `<lg>` within the same verse SHALL start a new `\p` line.

#### Scenario: Paragraphs: prose after poetry

- **WHEN** Matthew 1:23 contains poetry in `<lg>` followed by prose within the same verse
- **THEN** the USFM has a new `\p` line before `これは、「神われらと共にいます」という意味である。`

#### Scenario: Psalm with a title
- **WHEN** Psalm 23 begins with `<title type="psalm" canonical="true">ダビデの歌</title>` followed by poetry lines
- **THEN** importing the USFM gives chapter 23 a Hebrew subtitle `ダビデの歌` before verse 1, and verse 1's text is marked as poetry

### Requirement: Furigana is reduced to base text
The converter SHALL replace each `<w gloss="…">X</w>` with its base text `X` and SHALL NOT write the `gloss` value anywhere in the output.

#### Scenario: Ruby annotation stripped
- **WHEN** a verse contains `イサクの<w gloss="ちち">父</w>であり`
- **THEN** the USFM text reads `イサクの父であり`, and `ちち` does not appear in it

### Requirement: Unsupported markup fails loudly
The converter SHALL fail with an error naming the element and its location when it meets an OSIS element or `title`/`div` type it does not handle, so that no text is dropped without notice.

#### Scenario: Unhandled element
- **WHEN** the OSIS file contains a `<note>` element
- **THEN** the command fails with an error naming `note` and the verse it appears in, and writes no files

### Requirement: Fetch pinned OSIS translations
The CLI SHALL provide a `fetch-osis-translations <dir>` command that, for each configured OSIS translation, downloads the file from its pinned URL, verifies its SHA-256 hash, converts it to USFM, and writes `<dir>/<translation id>/` containing one USFM file per book and a `metadata.json` with the translation's metadata, so that `import-translations <dir>` can import it. An existing translation directory SHALL only be replaced after the download, hash check and conversion have succeeded.

#### Scenario: Fetch the Kougo-yaku
- **WHEN** `fetch-osis-translations ./sources/osis` runs
- **THEN** `./sources/osis/jpn_kou/` contains 66 USFM files and a `metadata.json` with id `jpn_kou`, and `import-translations ./sources/osis` imports the translation

#### Scenario: Hash mismatch
- **WHEN** the downloaded file's SHA-256 differs from the pinned hash
- **THEN** the command fails with an error showing both hashes and writes no files

#### Scenario: Failed download keeps the previous fetch
- **WHEN** the download responds with a non-success HTTP status and `<dir>/jpn_kou/` already exists
- **THEN** the command fails with an error naming the URL and status, and leaves the existing directory unchanged
