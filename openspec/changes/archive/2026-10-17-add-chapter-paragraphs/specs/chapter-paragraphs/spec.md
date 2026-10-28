## Purpose

Marks where paragraphs start in translation chapter content, in both the standard and simplified formats, so reader apps can lay out text the way the source translation does. This covers how USFM, USX and Lockman sources produce paragraphs and how clients that predate this change keep working.

## ADDED Requirements

### Requirement: Paragraphs are line breaks

Translation chapter content (`/api/{translation}/{book}/{chapter}.json`) SHALL mark the start of each source paragraph with a `line_break` item that has a `paragraph` property: `{ "type": "line_break", "paragraph": string }`. It SHALL appear immediately before the first verse, or verse fragment, of the paragraph. `paragraph` SHALL be the source paragraph marker without its backslash (for example `p`, `m`, `pi1`, `mi`, `pc`). Any heading for the paragraph SHALL come before the line break, not between it and the verse. There SHALL NOT be a separate paragraph item type, so clients that only understand `line_break` show a single break at each paragraph.

#### Scenario: Paragraph after a section heading

- **WHEN** a USFM chapter contains `\s1 Création du monde`, a `\r` reference line, then `\p` and `\v 1 …`
- **THEN** the chapter content starts with the heading, then `{ "type": "line_break", "paragraph": "p" }`, then verse 1

#### Scenario: Indented paragraph style

- **WHEN** a paragraph starts with `\pi1` (USFM) or `<para style="pi1">` (USX)
- **THEN** its line break has `paragraph` `pi1`

#### Scenario: Paragraph after a reference line between verses

- **WHEN** verse 1 is followed by an `\r` reference line, then `\p` and `\v 2`
- **THEN** `{ "type": "line_break", "paragraph": "p" }` appears at chapter level between verse 1 and verse 2, and verse 1's content does not end with a line break

### Requirement: Blank lines merge into the following paragraph

A blank-line marker (`\b`, `<para style="b">`) SHALL produce a `line_break` with no `paragraph`. A blank-line break that is immediately followed by a paragraph break SHALL be merged into a single line break carrying that paragraph, so the source is not rendered with two breaks. Consecutive blank-line markers SHALL each produce their own line break.

#### Scenario: Blank line before a paragraph

- **WHEN** a chapter contains `\b` followed by `\m`
- **THEN** the chapter content contains a single `{ "type": "line_break", "paragraph": "m" }` at that point

#### Scenario: Repeated blank lines

- **WHEN** a chapter contains `\b` followed by `\b`
- **THEN** the chapter content contains two `{ "type": "line_break" }` items

#### Scenario: Stanza break is not a paragraph

- **WHEN** a chapter contains `\b` between two poetry lines
- **THEN** the open verse contains an inline `{ "lineBreak": true }` at that point with no `paragraph`; a trailing break moves to a chapter-level `line_break`

### Requirement: Paragraph markers from every source format

USFM sources SHALL produce paragraphs from `\p`, `\m`, `\pi`, `\pi1`–`\pi3`, `\mi`, `\pc`, `\po`, `\pr`, `\pm`, `\pmo`, `\pmc`, `\pmr`, `\ph1`–`\ph3` and `\cls`. USX sources SHALL produce paragraphs from `<para>` elements with the same styles. Lockman sources SHALL produce a paragraph `p` at each `<PM>` paragraph marker. The words of every verse SHALL be identical to those produced without paragraph support. The only difference allowed is a newline where a paragraph now starts mid-verse.

#### Scenario: USX paragraphs

- **WHEN** a USX chapter has verses 1 and 2 in one `<para style="p">` and verse 3 in a following `<para style="m">`
- **THEN** the chapter content is `line_break` (`p`), verse 1, verse 2, `line_break` (`m`), verse 3

#### Scenario: Lockman paragraph marker

- **WHEN** a Lockman verse starts with `<PM>`
- **THEN** `{ "type": "line_break", "paragraph": "p" }` precedes that verse

### Requirement: No-break continuation

A no-break marker (`\nb`, `<para style="nb">`) SHALL continue the current paragraph and SHALL NOT produce a line break.

#### Scenario: Paragraph continues across a chapter boundary

- **WHEN** a chapter starts with `\nb` followed by `\v 1`
- **THEN** the chapter content has no `line_break` before verse 1

### Requirement: Paragraph inside a verse

When a paragraph starts in the middle of a verse, the verse content SHALL contain `{ "lineBreak": true, "paragraph": string }` at that point instead of a chapter-level item. A paragraph marker that comes after the last text of a verse SHALL be emitted at chapter level before the next verse.

#### Scenario: Mid-verse paragraph

- **WHEN** a verse's text is split by `\p` partway through
- **THEN** the verse content contains `{ "lineBreak": true, "paragraph": "p" }` between the two parts

#### Scenario: Trailing paragraph marker

- **WHEN** `\p` comes after a verse's last text and before the next `\v`
- **THEN** `{ "type": "line_break", "paragraph": "p" }` appears at chapter level and the verse content does not end with a line break

### Requirement: Poetry state ends at a paragraph

A paragraph marker SHALL end poetry formatting, so text after it is not marked as a poem line until the next poetry marker.

#### Scenario: Prose after poetry

- **WHEN** `\q1` poetry is followed by `\p` and prose
- **THEN** the prose text has no `poem` level

### Requirement: Paragraphs in the simplified format

Simplified chapters (`.simple.json`) SHALL contain the same chapter-level `line_break` items, including their `paragraph` property, as the standard chapter. A simplified verse with a mid-verse paragraph SHALL list it in `paragraphs` as `{ offset, style }`, where `offset` is the index in the verse `text` where the paragraph starts. The verse text SHALL contain a newline at that point, as it does for inline line breaks today.

#### Scenario: Simplified chapter paragraphs

- **WHEN** a client fetches the simplified chapter for a chapter that has paragraph line breaks in the standard format
- **THEN** the simplified chapter has the same sequence of `line_break` items between its verses

#### Scenario: Simplified mid-verse paragraph

- **WHEN** a verse has a mid-verse `\p` after the text `Au commencement`
- **THEN** the simplified verse `text` has a newline after that text and `paragraphs` contains an entry whose `offset` is the start of the next line and whose `style` is `p`

### Requirement: Generated clients tolerate unknown content types

The Kotlin SDK SHALL decode chapter content, simplified chapter content and inline verse content that contain an item with an unrecognized `type` or shape, without failing the whole response. Unknown items SHALL be exposed as an unknown variant that clients can skip.

#### Scenario: Unknown chapter item

- **WHEN** the Kotlin SDK decodes a chapter whose content contains `{ "type": "future_item" }`
- **THEN** decoding succeeds, the item is an unknown variant, and the other items decode normally

#### Scenario: Paragraph line break

- **WHEN** the Kotlin SDK decodes a chapter containing `{ "type": "line_break", "paragraph": "p" }`
- **THEN** the item decodes as `ChapterLineBreak(paragraph = "p")`
