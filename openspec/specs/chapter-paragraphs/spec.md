# chapter-paragraphs Specification

## Purpose

Marks where paragraphs start in translation chapter content, in both the standard and simplified formats, so reader apps can lay out text the way the source translation does. This covers how USFM, USX and Lockman sources produce paragraphs and how clients that predate this change keep working.

## Requirements

### Requirement: Paragraph chapter content
Translation chapter content (`/api/{translation}/{book}/{chapter}.json`) SHALL support an item `{ "type": "paragraph", "style"?: string }`. It SHALL appear immediately before the first verse, or verse fragment, of each paragraph in the source. `style` SHALL be the source paragraph marker without its backslash (for example `p`, `m`, `pi1`, `mi`, `pc`). Any heading for the paragraph SHALL come before the `paragraph` item, not between it and the verse.

#### Scenario: Paragraph after a section heading
- **WHEN** a USFM chapter contains `\s1 Création du monde`, a `\r` reference line, then `\p` and `\v 1 …`
- **THEN** the chapter content starts with the heading, then `line_break`, then `{ "type": "paragraph", "style": "p" }`, then verse 1

#### Scenario: Indented paragraph style
- **WHEN** a paragraph starts with `\pi1` (USFM) or `<para style="pi1">` (USX)
- **THEN** its `paragraph` item has `style` `pi1`

#### Scenario: Paragraph after a reference line between verses
- **WHEN** verse 1 is followed by an `\r` reference line, then `\p` and `\v 2`
- **THEN** a `line_break` and a `paragraph` item appear at chapter level between verse 1 and verse 2, and verse 1's content does not end with a line break

### Requirement: Paragraphs are preceded by a line break
Every chapter-level `paragraph` item SHALL be immediately preceded by a `line_break` item, so clients that only understand `line_break` still show a break at each paragraph. A blank-line marker (`\b`, `<para style="b">`) SHALL produce a `line_break` with no `paragraph` item.

#### Scenario: Stanza break is not a paragraph
- **WHEN** a chapter contains `\b` between two poetry lines
- **THEN** the open verse contains an inline `{lineBreak:true}` at that point and no paragraph marker; a trailing break moves to a chapter-level `line_break`

#### Scenario: Old client sees breaks
- **WHEN** a client that ignores items with an unknown `type` reads a chapter with three paragraphs
- **THEN** it sees three `line_break` items at the paragraph starts

### Requirement: Paragraph markers from every source format
USFM sources SHALL produce paragraphs from `\p`, `\m`, `\pi`, `\pi1`–`\pi3`, `\mi`, `\pc`, `\po`, `\pr`, `\pm`, `\pmo`, `\pmc`, `\pmr`, `\ph1`–`\ph3` and `\cls`. USX sources SHALL produce paragraphs from `<para>` elements with the same styles. Lockman sources SHALL produce a paragraph with style `p` at each `<PM>` paragraph marker. The words of every verse SHALL be identical to those produced without paragraph support. The only difference allowed is a newline where a paragraph now starts mid-verse.

#### Scenario: USX paragraphs
- **WHEN** a USX chapter has verses 1 and 2 in one `<para style="p">` and verse 3 in a following `<para style="m">`
- **THEN** the chapter content is `line_break`, `paragraph` (`p`), verse 1, verse 2, `line_break`, `paragraph` (`m`), verse 3

#### Scenario: Lockman paragraph marker
- **WHEN** a Lockman verse starts with `<PM>`
- **THEN** a `line_break` and a `paragraph` item with style `p` precede that verse

#### Scenario: Verse text unchanged
- **WHEN** a translation is generated before and after this change
- **THEN** the text and formatted-text items of every verse are the same in both outputs, apart from the added inline paragraph items

### Requirement: No-break continuation
A no-break marker (`\nb`, `<para style="nb">`) SHALL continue the current paragraph and SHALL NOT produce a `paragraph` or `line_break` item.

#### Scenario: Paragraph continues across a chapter boundary
- **WHEN** a chapter starts with `\nb` followed by `\v 1`
- **THEN** the chapter content has no `paragraph` or `line_break` before verse 1

### Requirement: Paragraph inside a verse
When a paragraph starts in the middle of a verse, the verse content SHALL contain `{ "lineBreak": true, "paragraph": true, "style": string }` at that point instead of a chapter-level item. A paragraph marker that comes after the last text of a verse SHALL be emitted at chapter level before the next verse.

#### Scenario: Mid-verse paragraph
- **WHEN** a verse's text is split by `\p` partway through
- **THEN** the verse content contains `{ "lineBreak": true, "paragraph": true, "style": "p" }` between the two parts

#### Scenario: Trailing paragraph marker
- **WHEN** `\p` comes after a verse's last text and before the next `\v`
- **THEN** the `line_break` and `paragraph` items appear at chapter level and the verse content does not end with a line break

### Requirement: Poetry state ends at a paragraph
A paragraph marker SHALL end poetry formatting, so text after it is not marked as a poem line until the next poetry marker.

#### Scenario: Prose after poetry
- **WHEN** `\q1` poetry is followed by `\p` and prose
- **THEN** the prose text has no `poem` level

### Requirement: Paragraphs in the simplified format
Simplified chapters (`.simple.json`) SHALL contain the same chapter-level `line_break` and `{ "type": "paragraph", "style"?: string }` items as the standard chapter. A simplified verse with a mid-verse paragraph SHALL list it in `paragraphs` as `{ offset, style }`, where `offset` is the index in the verse `text` where the paragraph starts. The verse text SHALL contain a newline at that point, as it does for inline line breaks today.

#### Scenario: Simplified chapter paragraphs
- **WHEN** a client fetches the simplified chapter for a chapter that has paragraph items in the standard format
- **THEN** the simplified chapter has the same sequence of `line_break` and `paragraph` items between its verses

#### Scenario: Simplified mid-verse paragraph
- **WHEN** a verse has a mid-verse `\p` after the text `Au commencement`
- **THEN** the simplified verse `text` has a newline after that text and `paragraphs` contains an entry whose `offset` is the start of the next line and whose `style` is `p`

### Requirement: Generated clients tolerate unknown content types
The Kotlin SDK SHALL decode chapter content, simplified chapter content and inline verse content that contain an item with an unrecognized `type` or shape, without failing the whole response. Unknown items SHALL be exposed as an unknown variant that clients can skip.

#### Scenario: Unknown chapter item
- **WHEN** the Kotlin SDK decodes a chapter whose content contains `{ "type": "future_item" }`
- **THEN** decoding succeeds, the item is an unknown variant, and the other items decode normally

#### Scenario: Paragraph item
- **WHEN** the Kotlin SDK decodes a chapter containing `{ "type": "paragraph", "style": "p" }`
- **THEN** the item decodes as a paragraph with style `p`
