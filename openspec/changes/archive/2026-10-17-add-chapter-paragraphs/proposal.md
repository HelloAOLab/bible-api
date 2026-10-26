> **Superseded in part:** review on PR #94 replaced the separate `paragraph` item with a `paragraph` property on line breaks. See "Revision after review" in `design.md` and `specs/chapter-paragraphs/spec.md` for the final shape.

## Why

Chapter content has no notion of a paragraph, and most eBible translations lose their paragraph breaks entirely. `fra_lsg` Genesis has 129 `\p` markers in its source, but the live API returns no breaks for `GEN 1`. The same happens to `cmn_cu1`, `cmn_cuv`, `HINIRV`, `ben_irv` and `deu_l12`. Reader apps need to know where paragraphs start, and `line_break` alone can't tell a paragraph from a stanza break.

The cause is in the parsers. The USX parser turns only `<para style="b">` into a break and ignores the paragraph styles (`p`, `m`, `pi`, `mi`, `pc`, …). eBible translations converted to USX3 therefore lose every paragraph. The USFM parser maps `\p` to a `line_break`, but it ignores the other paragraph markers, and its separate `\p` branch, which resets poetry state, is unreachable.

## What Changes

- New chapter content item `{ type: 'paragraph', style?: string }`, emitted immediately before the first verse (or verse fragment) of a paragraph. `style` is the source marker without a backslash (`p`, `m`, `pi1`, `mi`, `pc`, …).
- Each paragraph marker emits a `line_break` immediately followed by a `paragraph`. Clients that only understand `line_break` see a break at every paragraph, so existing consumers gain the breaks without updating. `\b` / `<para style="b">` still emits only a `line_break`.
- A paragraph that starts inside a verse becomes the inline item `{ lineBreak: true, paragraph: true, style }` in the verse content. A paragraph marker that trails a verse is still moved to the chapter level.
- `\nb` / `<para style="nb">` continues the current paragraph and emits nothing.
- Parsers: USX and USFM handle the paragraph family of markers. Lockman `<PM>` also emits a `paragraph` with style `p`. The USFM `\p` branch is fixed so poetry state resets on `\p`.
- The simplified format (`.simple.json`) carries the same chapter-level `paragraph` items, and records where mid-verse paragraphs start.
- `PARSER_VERSION` is bumped so that the next generation re-parses every translation.
- The Kotlin SDK generator emits fallbacks for unknown union members, so a client built from it tolerates new content types, including `paragraph`, instead of failing to decode the chapter. `Models.kt` is regenerated.
- OpenAPI document, `free-use-bible-api` types, English docs (`docs/reference/translations/standard.md`, `simplified.md`) and `CHANGELOG.md` are updated. Machine-translating the docs (`pnpm translate:docs`) is left to the upstream maintainers, who hold the Google Cloud project.
- **BREAKING** for any Kotlin SDK release that predates this change: `ChapterContent` is a sealed type with no default, so a `paragraph` item fails decoding. The fixed SDK must be published before the regenerated data goes live.

Not in this change: the USFM parser leaking `\ms`/`\mr` text into the first verse (it changes verse text, so it gets its own PR), paragraph data for codex JSON sources (they carry no paragraph markers), a Swift client (none is generated), and rendering `paragraph` in `free-use-bible-api-react`, which already renders the added `line_break`s.

## Capabilities

### New Capabilities
- `chapter-paragraphs`: paragraph structure in chapter content, how USFM, USX and Lockman sources produce it, its form in the standard and simplified formats, and how generated clients tolerate content types they don't know.

### Modified Capabilities
<!-- None: existing specs cover interlinear and lexicon datasets only. -->

## Impact

- `packages/helloao-tools/parser`: `usx-parser.ts` (paragraph styles, `PARSER_VERSION`), `usfm-parser.ts` (paragraph markers, `\p` branch), `lockman-parser.ts` (`<PM>`), `types.ts`, plus specs and snapshots.
- `packages/helloao-tools/generation`: `common-types.ts` (`ChapterParagraph`, inline paragraph fields, simplified schemas), `simple.ts`, and the `api.spec.ts` / `simple.spec.ts` specs.
- `packages/helloao-cli`: `openapi.ts`, `kotlin.ts` (unknown-member fallbacks) and its spec.
- `packages/free-use-bible-api`: regenerated `types.gen.ts`. `packages/free-use-bible-api-kotlin`: regenerated `Models.kt` and a decoding test.
- Data: every translation is re-parsed on the next generation. Chapters gain `line_break` + `paragraph` pairs; verse text does not change.
- Release order: publish the Kotlin SDK first, then deploy the regenerated API.
