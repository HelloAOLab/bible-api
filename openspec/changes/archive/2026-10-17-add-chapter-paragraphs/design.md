## Context

See proposal.md - Why. The current state that shapes the approach:

- eBible translations are downloaded as USFM zips. With `--convert-to-usx3` they go through BibleMultiConverter and are parsed by `USXParser`; otherwise they go to `UsfmParser`. The live output for `fra_lsg` (no breaks, a clean verse 1) matches the USX route exactly. Run on the same source, `UsfmParser` gives 7 `line_break`s for GEN 1 and leaks `\ms`/`\mr` text into verse 1.
- `USXParser.iterateChapterContent` handles `<para>` styles `s1`–`s4` (heading), `b` (line break) and `d` (Hebrew subtitle). Other paragraph styles are passed through without producing content, and their verses are parsed as usual.
- `UsfmParser` matches `\b` and `\p` together and pushes an inline `{ lineBreak: true }` into an open verse. `cleanupVerse` later moves trailing inline breaks and headings to chapter level. The later `\p` branch that resets `_poem` can't be reached. `\m`, `\pi*`, `\mi`, `\pc` and `\nb` fall through without effect.
- `LockmanParser` pushes a chapter-level `line_break` for `<PM>`.
- `generation/simple.ts` copies chapter-level `line_break`s and turns inline `lineBreak`s into newlines in the verse `text`. Inline headings are recorded as `headings: [{ offset, text }]`.
- `PARSER_VERSION` (`usx-parser.ts`) is part of the input-file hash in `helloao-cli/files.ts`, so bumping it forces every source to be re-parsed.
- `helloao-cli/kotlin.ts` generates `Models.kt`. Discriminated unions become a `sealed interface` with `@JsonClassDiscriminator` and no default; shape-based unions become a `JsonContentPolymorphicSerializer` whose last branch throws. `ignoreUnknownKeys` covers unknown fields but not unknown members.
- The localized `docs/<lang>/` copies are machine-translated from English by `tools/translate-docs.ts` (`pnpm translate:docs`), which needs the maintainers' Google Cloud project.

## Goals / Non-Goals

**Goals:**

- One shared rule for every parser: what is a paragraph, what is a continuation, what is a blank line.
- Words of every verse unchanged; snapshot diffs show only structural items.
- Older clients either see the new breaks (TS, React) or keep decoding (Kotlin, once rebuilt).

**Non-Goals:**

- Fixing the `\ms`/`\mr` leak, or adding `\ms`/`\mr` as headings (separate PR).
- Representing paragraph indentation beyond passing `style` through.
- Paragraph support in codex JSON sources.

## Decisions

### 1. A `line_break` + `paragraph` pair, not `paragraph` alone

Each paragraph emits `line_break` then `paragraph`. Clients that predate this change already render `line_break`, so every translation that gains paragraphs also gains visible breaks in existing apps, including `free-use-bible-api-react`.
_Alternative:_ `paragraph` only, with `line_break` reserved for `\b`. That keeps the types clean, but existing clients would get nothing for the translations this change fixes. USFM-sourced chapters, which already turn `\p` into a `line_break`, would also differ from USX-sourced ones.
_Trade-off:_ `line_break` stays overloaded. New clients can tell a paragraph break from a stanza break because only a paragraph break is followed by a `paragraph` item.

### 2. `style` is the raw marker

`style` carries the marker as written, minus the backslash (`p`, `m`, `pi1`, `mi`, `pc`), and is the same for USFM and USX. Lockman `<PM>` maps to `p`. Clients map styles to indentation themselves; the API does not collapse `pi` and `pi1` or invent a level field.
_Alternative:_ a normalized `{ indent, continuation }` object. That would lose information, and we'd have to decide semantics for rare markers we can't test against real sources.

### 3. The paragraph marker set

The paragraph styles are `p`, `m`, `pi`, `pi1`–`pi3`, `mi`, `pc`, `po`, `pr`, `pm`, `pmo`, `pmc`, `pmr`, `ph1`–`ph3` and `cls`. `nb` is a continuation and emits nothing. `b` stays a bare `line_break`. Poetry (`q*`), headings (`s*`), `d`, `r`, `mr`, `ms*` and intro markers keep their current handling. USFM markers keep their number when written with one (`\pi1` gives `pi1`). A bare `\pi` gives `pi`.
Poetry state (`_poem`) is reset by every paragraph marker, not just `\p`.

### 4. A shared helper keeps the parsers consistent

A small helper in `parser/` exports the paragraph style set and the `nb`/`b` rules, and both parsers call it. This keeps the USX and USFM handling from drifting apart, the way `\p` already has.
_Alternative:_ inline string checks in each parser, which is how the parsers handle headings today. That's fine for four heading styles, but too easy to get out of sync for a list of roughly twenty.

### 5. USX: emit when a paragraph's first verse content starts

In `iterateChapterContent`, a `<para>` with a paragraph style yields `line_break` + `paragraph` before the first verse that starts inside it. If the paragraph opens mid-verse, meaning its first content continues a verse that began in an earlier `<para>`, the pair can't go at chapter level. Instead the open verse gets the inline `{ lineBreak: true, paragraph: true, style }`, using the existing `iterateVerseContent` mechanism that already inserts poetry line breaks when the parent `<para>` changes.
An empty `<para style="p"/>` produces nothing.

### 6. USFM: split `\b` from the paragraph markers

`\b` keeps today's behavior: an inline `lineBreak` in an open verse, otherwise a chapter-level `line_break`. Paragraph markers close any pending section heading. They then push the inline paragraph item into an open verse, or the chapter-level pair otherwise. They also reset `_poem`.
`cleanupVerse` already moves trailing inline breaks to chapter level. It is extended to turn a trailing inline paragraph item into the chapter-level pair. That covers the common `\v 1 … \r … \p \v 2` layout: the `\p` arrives while verse 1 is still open and ends up between verses 1 and 2. The dead `\p` branch is removed.

### 7. Mid-verse paragraphs are a line break with extra fields

The inline item is `{ lineBreak: true, paragraph: true, style }` instead of a new shape. Every existing consumer, including the Kotlin `VerseContentSerializer`, the DB text builder, `simple.ts` and the React reader, checks `'lineBreak' in part`, so they keep working and ignore the extra fields.

### 8. Simplified format

Chapter-level `line_break` and `paragraph` items are copied as they are. A mid-verse paragraph already becomes a newline in the verse text. It additionally gets an entry in a new optional `paragraphs: [{ offset, style }]` on the simplified verse, like `headings: [{ offset, text }]`. `offset` is the index of the first character after the newline.

### 9. Kotlin generator fallbacks

For each discriminated `sealed interface`, the generator emits an `Unknown<Name>(type: String)` member and registers it as the default deserializer, using `SerializersModule { polymorphicDefaultDeserializer(...) }` wired into `FreeUseBibleApi.json`. For each `JsonContentPolymorphicSerializer`, the final `else ->` returns an `Unknown<Name>` that holds the raw `JsonElement` instead of throwing. `ChapterParagraph` and `SimpleChapterParagraph` are generated from the OpenAPI document like any other member.
_Alternative:_ hand-patching `Models.kt`, which the next `pnpm generate:kotlin` would overwrite.

### 10. Re-parse every translation

Bump `PARSER_VERSION` from 4 to 5. The Lockman parser has its own version, which is bumped as well, so `<PM>` sources are re-parsed too.

## Risks / Trade-offs

- **Kotlin SDK releases before this change crash on `paragraph`.** → Publish the fixed SDK before the regenerated data goes live, and state the order in the PR. The current SDK is days old, so few apps use it.
- **USFM-route chapters change shape.** Each `\p` that gave a `line_break` now gives `line_break` + `paragraph`. → Clients that ignore unknown types see no change.
- **USX layouts vary (paragraphs inside chapters, verses spanning `<para>` boundaries, empty paras).** → Spec fixtures for each layout, plus a check against real fra_lsg, cmn and hin USX produced by BibleMultiConverter where available.
- **Snapshot churn hides a text change.** → Review snapshot diffs by hand and add a spec asserting that verse words are unchanged before and after for the fra_lsg fixture.
- **Rare markers (`pm*`, `ph*`, `cls`) are untested against real sources.** → They fall back to the same rule as `p`, and `style` keeps the raw marker, so a client can still special-case them.

## Migration Plan

1. Merge and publish the Kotlin SDK containing the generator fallbacks.
2. Run generation. The `PARSER_VERSION` bump re-parses every translation, and the regenerated files are deployed.
3. Rollback: revert the data deploy. Clients that ignore unknown types are unaffected either way; the fixed Kotlin SDK tolerates both old and new data.

## Open Questions

- Which eBible translations went through `--convert-to-usx3` in production. This affects which before/after counts move, not the approach, since both parsers are fixed.

## Revision after review

Review on PR #94 replaced the separate `paragraph` item with a `paragraph` property on `line_break` (chapter level) and on inline `{ lineBreak: true }` items. A separate item made renderers that understand both types insert two breaks, and sources such as the BSB write `\b` before every `\m`, which doubled breaks. Each parser now runs a merge pass that folds a plain line break into a paragraph break that directly follows it; consecutive `\b` markers still produce separate breaks. `openspec/specs/chapter-paragraphs/spec.md` describes the final shape.

With this shape, the paragraph examples in the reference docs use the item shapes directly instead of a fra_lsg excerpt. The Kotlin SDK is new in V1.16.0 and already ignores unknown keys, so it needs no release order.
