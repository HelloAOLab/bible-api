> **Superseded in part:** review on PR #94 replaced the separate `paragraph` item with a `paragraph` property on line breaks. See "Revision after review" in `design.md` and `specs/chapter-paragraphs/spec.md` for the final shape.

## 1. Reproduce

- [x] 1.1 Add a failing `usx-parser.spec.ts` case using a fra_lsg-style USX fixture (`ms1`, `mr`, `s1`, `r`, `<para style="p">` with an `x` note and `w` chars) that expects `heading`, `line_break`, `paragraph` before verse 1 and between verses 1 and 2; verify it fails on the current parser with no paragraph or line break items
- [x] 1.2 Add a failing `usfm-parser.spec.ts` case using lines copied from the real `02-GENfraLSG.usfm` GEN 1 (`\s1`, `\r`, `\p`, `\x … \x*`, `\w …|strong="…"\w*`) that expects `line_break` + `paragraph` pairs; verify it fails (today: a bare `line_break`, no `paragraph`)

## 2. Types and schemas

- [x] 2.1 In `parser/types.ts`, add `ChapterParagraph { type: 'paragraph'; style?: string }` to the chapter content union and optional `paragraph?: true; style?: string` to `InlineLineBreak`; verify with `tsc --build`
- [x] 2.2 In `generation/common-types.ts`, add `ChapterParagraphSchema` (id `ChapterParagraph`) to the chapter content unions, add the inline fields to `InlineLineBreakSchema`, add a simplified `paragraph` chapter item and `paragraphs: [{ offset, style }]` on `SimpleChapterVerseSchema` (design decision 8), with `.meta` descriptions; verify with `tsc --build` and the existing `api.spec.ts` / `simple.spec.ts` passing

## 3. Parsers

- [x] 3.1 Add the shared paragraph-style helper in `parser/` (design decisions 3 and 4) with a small spec covering `p`, `pi`, `pi1`, `m`, `nb` (continuation), `b` (not a paragraph) and `q1` (not a paragraph); verify the spec passes
- [x] 3.2 USX: emit `line_break` + `paragraph` before the first verse in a paragraph-style `<para>`, and the inline item when a paragraph opens mid-verse (design decision 5); verify 1.1 passes, plus new cases for `m`, `pi1`, `nb`, a mid-verse paragraph, an empty `<para style="p"/>`, and `b` still giving a bare `line_break`
- [x] 3.3 USFM: split `\b` from the paragraph markers, emit the inline paragraph item in an open verse, reset `_poem` on every paragraph marker, and remove the dead `\p` branch (design decision 6); verify 1.2 passes plus cases for `\m`, `\pi1`, `\nb`, a mid-verse `\p`, `\p` after `\r`/`\s1`, `\b` unchanged, and prose after `\q1` having no `poem`
- [x] 3.4 Extend `cleanupVerse` to move a trailing inline paragraph item to chapter level as `line_break` + `paragraph`; verify with the `\v 1 … \r … \p \v 2` case, where verse 1 content does not end with a line break
- [x] 3.5 Lockman: push `paragraph` (style `p`) after the existing `<PM>` `line_break`; verify with a `lockman-parser.spec.ts` case
- [x] 3.6 Bump `PARSER_VERSION` to 5 and `LOCKMAN_PARSER_VERSION` to 4; verify that a `files.ts` input hash differs for the same file before and after
- [x] 3.7 Review every changed parser snapshot by hand, one file at a time, accepting only added `line_break` / `paragraph` / inline paragraph items; verify the full parser suite passes and that no string or formatted-text content changed in the diff
  - `poem` removals after paragraph markers are expected per design decision 6.

## 4. Generation

- [x] 4.1 `generation/simple.ts`: copy chapter-level `paragraph` items, and record mid-verse paragraphs in `paragraphs` with the offset after the newline; verify with `simple.spec.ts` cases for both
- [x] 4.2 Check that `generation/api.ts` passes `paragraph` items through to `.json` unchanged; add an `api.spec.ts` case with a fra_lsg-style fixture asserting `paragraph` items in both the `.json` and `.simple.json` outputs, and that verse words match a run without paragraphs
- [x] 4.3 Check `helloao-cli/db.ts`: chapter JSON is stored whole, and inline paragraphs already count as `lineBreak` in the verse text column; verify with an import plus `loadDatasets` round-trip of the fixture that keeps `paragraph` items

## 5. OpenAPI and clients

- [x] 5.1 Update `helloao-cli/openapi.ts` so the OpenAPI document includes `ChapterParagraph`, the simplified paragraph item and `paragraphs`; regenerate `packages/free-use-bible-api/types.gen.ts` with the `generate-clients` command; verify with `tsc --build` and the client spec
- [x] 5.2 `helloao-cli/kotlin.ts`: emit an `Unknown<Name>` member plus default deserializer for discriminated sealed interfaces, and an unknown result instead of `throw` in content-polymorphic serializers (design decision 9); verify with `kotlin.spec.ts` cases on the generated source
- [x] 5.3 Regenerate `Models.kt` (`pnpm generate:kotlin`) and wire the `SerializersModule` into `FreeUseBibleApi.json`; add `ModelsTest.kt` cases decoding a chapter with `paragraph`, an unknown `{ "type": "future_item" }` chapter item, an unknown simplified item, and an inline `{ lineBreak, paragraph, style }`; verify `./gradlew test` passes in `packages/free-use-bible-api-kotlin`

## 6. Docs and changelog

- [x] 6.1 Document `paragraph`, the `line_break` + `paragraph` pairing, `\nb`, the inline paragraph fields and `style` values in `docs/reference/translations/standard.md`, and the simplified items and `paragraphs` in `simplified.md`, with an example from fra_lsg GEN 1; verify with `pnpm build:docs`
- [x] 6.2 Leave the `docs/<lang>/` copies to the maintainers' `pnpm translate:docs` run and say so in the PR; add a `CHANGELOG.md` entry that notes the Kotlin SDK release order; verify the changelog renders in the docs build

## 7. Verification and PR

- [x] 7.1 Run `pnpm test` (which runs `tsc --build` first) and the Kotlin tests; verify that everything passes
- [x] 7.2 Produce before/after counts of `paragraph` / `line_break` items for fra_lsg, BSB and deu_l12 GEN 1, by running the old and new parsers on the real eBible sources (USX via BibleMultiConverter where available, USFM otherwise); verify that deu_l12 goes from 0 to 1 paragraph and BSB keeps its 19 `line_break`s
  - BSB measured 23 → 45 `line_break`s (22 from paragraph pairs); the "19" above predates counting inline breaks.
- [x] 7.3 Write the PR description: the root cause (USX parser ignores paragraph styles; production matches the USX3 route), the schema change, the compatibility decision, how a strict client behaves (old Kotlin SDK fails to decode; TS and React keep working), the release order, the counts table, and a link to the separate `\ms`/`\mr` PR
