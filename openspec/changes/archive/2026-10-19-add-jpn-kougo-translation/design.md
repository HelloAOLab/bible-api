## Context

How translations enter the API today (observed in the code):

- **eBible translations**: `source-translations` downloads USFM, converts it to USX3 with BibleMultiConverter, and `import-translations` reads it.
- **Locally committed translations**: each sits in `bible/<dir>/` as USFM files plus a metadata file, which `loadTranslationMetadata` in `packages/helloao-cli/files.ts` looks for as `metadata.ts`, then `meta.json`, then `metadata.json`. Examples are `bsb`, `arbnav`, `engwebp`, `hinirv`, `hbomas`, `grcbre` and `grctcg`, and they are imported with `import-translation <dir>`.
- `getFileType` knows only `.usfm`, `.usx`, `.json`/`.codex` and `.lockman.txt`. **There is no OSIS input.**
- The USFM parser handles `\id \h \mt \c \v \d \p \q \s \w \wj \f \x`. It drops `\w` attributes and has no ruby marker. `FormattedText` has `text`, `poem` and `wordsOfJesus`, and no ruby field.
- I ran a quick test through the built `generateDataset`. Japanese USFM with no spaces parses intact, `\h` becomes the book name, `\d` becomes a `hebrew_subtitle`, and `\q1` becomes `poem: 1`. `\v 9-10` becomes verse 9 holding the combined text, which is how the parser already treats every verse bridge.

The source facts (counts, combined and split verses, KJV differences) are in proposal.md under "Source facts".

## Goals / Non-Goals

**Goals:**
- Get the Kougo-yaku into the existing local-USFM path without changing the importer, generator or API schema.
- Make the conversion reproducible: anyone can re-run one command on the pinned source file and get the committed USFM byte for byte.

**Non-Goals:**
- A general OSIS import (`fileType: 'osis'`) in the generator. The converter handles only the OSIS subset this file uses, and fails on anything else.
- Furigana/ruby in the API.
- Mapping the text onto KJV versification.
- Committing the 12.6 MB OSIS source. It is pinned by URL, commit and SHA-256 instead.

## Decisions

### 1. Convert OSIS → USFM once and commit the USFM (vs. adding an OSIS parser to the generator)
Every other non-eBible translation in the repo is committed USFM, so this route keeps the maintainers' review and import flow unchanged, and the diff shows the exact text the API will serve. An OSIS `fileType` would touch `getFileType`, `PARSER_VERSION` hashing and the generator dispatch. It would also need a second set of generator tests, all for one translation. Using an external tool (BibleMultiConverter has an OSIS importer) was also considered. It would make conversion depend on Java plus a jar that isn't vendored, and its USFM output for milestone verses and `!a`/`!b` splits is unverified. A small TypeScript converter can be tested in jest like the other parsers.

### 2. Where the code lives
- `packages/helloao-tools/parser/osis-to-usfm.ts` exports a pure function `convertOsisToUsfm(xml: string, domParser: DOMParser): { bookId: string; usfm: string }[]`. It takes a `DOMParser` in the same way `USXParser` does, so it runs under `linkedom` in node and tests. It is exported from `parser/index.ts`.
- `packages/helloao-tools/parser/osis-to-usfm.spec.ts` holds small inline OSIS fixtures, one per spec scenario, and an inline snapshot for a short book.
- `packages/helloao-cli` gets a `convert-osis-to-usfm <file> <dir>` command in `cli.ts` → `actions.ts`, which reads the file, calls the converter and writes `<dir>/<bookid-lowercase>.usfm` into `./bible/jpn_kou/usfm` for this translation (the `hinirv`/`hbomas` naming). It refuses to overwrite existing files unless `--overwrite` is passed, like the other commands.

### 3. Walking the XML
The converter walks each book's DOM in document order and keeps a "current verse" that both container `<verse>` elements and `sID`/`eID` milestones set. Text nodes and `<w>` base text are added to the current verse. `<p>` emits `\p`, prose following a closing `<lg>` within the same verse starts a new `\p` line, `<lg>/<l>` emits `\q1` per line, and `<title type="psalm">` emits `\d`. `<title type="main">` goes into the header lines, and `<title type="chapter">` is skipped. Verse ranges come from the first and last references in `osisID`. Any element or type outside {`div[book|x-testament]`, `chapter`, `title[main|chapter|psalm]`, `p`, `lg`, `l`, `verse`, `w`} throws, naming the element and the nearest verse.

### 4. Exodus 22:3a/3b
The API keys verses by number, so a repeated `3` would make the second copy unreachable or collide. The converter therefore gathers a chapter's verses when it finds a `!` suffix, merges the parts in suffix order, and writes that chapter in ascending verse order, keeping a `\p` before each verse that started a paragraph in the source. This gives the Hebrew text order (1, 2, 3, 4). What is lost is the Kougo's editorial transposition of vv. 2–3a after v. 4, and the PR states this. It is the only chapter in the source with this pattern, so all other chapters keep the source's exact order and paragraphing.

### 5. Furigana stripped
See proposal.md. Keeping `\rb 父|gloss="ちち"\rb*` in the committed USFM was considered, so that a later ruby feature could use it. The current parser treats unknown markers' attributes as text, though, so `gloss="ちち"` would leak into verses unless the parser changed too. The ruby data remains in the pinned OSIS source.

### 6. Metadata as `metadata.ts`
This matches `bsb`/`arbnav`. The `license` field uses the structured `License` shape (`publicDomain: true`, `attribution: 'not-required'`, `commercialUse: 'allowed'`, `derivatives: 'allowed'`, `copyleft: false`). A `licenseNotice` gives the 1954/1955 edition and the open-bibles commit. `shortName` is `口語訳`. The directory is `bible/jpn_kou/`, with a short `README.md` there recording the source URL, commit `3ca49fb73163f42297a32b7b1b1c40cf3dafd84b`, SHA-256 `6930015f5d0faf49f3038a7e2f482aeb45939510b6acb8a8fb1945640c1d91b6`, and the regeneration command.

## Risks / Trade-offs

- The repo USFM parser keeps poetry state across an in-verse `\p`, so prose following poetry is still served with `poem: 1`. Fixing the parser changes other translations' output (engwebp, grctcg and hinirv snapshots) and is left as a maintainer follow-up.
- [Combined verses (16 elements) are exposed only under their first number, e.g. no separate `ROM 1:10`] → This is how the parser already treats every bridge. The PR lists the 16 ranges.
- [The licence reasoning is a legal judgement and maintainers may want more evidence] → The PR gives the statute reasoning (50-year term for organization-credited works, expired end of 2005, 2018 extension not retroactive) and the open-bibles PD listing, and flags the JBS-revision caveat.
- [Ps 47:10 looks like the source splitting KJV 47:9 in two] → Keep it as in the source and mention it in the PR. Editorial correction is out of scope.
- [About 12 MB added to the repo] → Comparable to existing `bible/*` translations, and needed for the committed-USFM route.
- [`import-translation` rejects `metadata.ts` that imports from a path that doesn't exist] → `bsb`/`arbnav` import a type from `'../../src/usfm-parser/generator'`, a path that no longer exists, which works only because the import is type-only. The new file uses the same type-only `import type`, and the import is checked with a local run.

## Migration Plan

Additive only. After merge, maintainers run `pnpm cli import-translation ./bible/jpn_kou -- --db ./free-use-bible-api.db` and their usual upload. Rollback: delete the translation row and the `bible/jpn_kou` directory.

## Revision: fetch instead of commit

After the PR was opened, the translation was moved out of the repository to keep about 1.5 MB of compressed USFM (5.5 MB on disk) out of the git history. This follows the newer convention for sources (eBible, interlinear, metadata, commentaries), which are fetched into the gitignored `sources/` directory, rather than the older committed `bible/` translations. The rest of this document describes the original committed-USFM plan; where they differ, this section wins:

- `bible/jpn_kou/` is not committed. The `fetch-osis-translations <dir>` command (`pnpm fetch:bible:osis` → `./sources/osis`) downloads the file from the pinned open-bibles commit, checks the SHA-256, converts it, and writes `sources/osis/jpn_kou/` with the 66 USFM books and a `metadata.json`. `pnpm import:bible:osis` imports it with `import-translations`. The fetched output is byte-identical to the USFM that was committed before.
- The metadata, source URL, hash and licence rationale live in `OSIS_TRANSLATIONS` in `packages/helloao-cli/osis.ts`, not in `bible/jpn_kou/metadata.ts` and `README.md`.
- The USFM books sit next to `metadata.json` at the translation root rather than in a `usfm/` subdirectory. The loader treats any root `.json` file as a translation file and then does not fall back to `usfm/`. It skips files named `metadata`, though.
