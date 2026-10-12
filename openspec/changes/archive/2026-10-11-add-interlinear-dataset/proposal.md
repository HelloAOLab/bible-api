## Why

The API publishes translation text and, since V1.13, English word annotations with Strong's numbers (`.words.json`), but nothing on the original-language side: no Hebrew, Aramaic or Greek words per verse and no lexicon to look a Strong's number up in. An existing reference implementation already builds and validates this data from open sources, in a shape that follows this API's datasets. Upstream now supports entity datasets (Theographic, V1.14), which gives a lexicon keyed by Strong's number a natural home.

## What Changes

- New CLI command `fetch-interlinear <dir>` that downloads the Berean interlinear table (`bsb_tables.tsv`) and the STEPBible brief lexicons (TBESH, TBESG) plus the STEPBible repository README that carries their CC BY 4.0 licence, mirroring `fetch-bible-metadata`.
- New CLI command `import-interlinear <dir>` that parses those files and imports two datasets into the database, mirroring `import-bible-metadata`.
- New dataset `bsb-interlinear` (public domain): for every chapter, each verse's original-language words in original order with transliteration, parsing, Strong's number, BSB order and BSB phrase.
  - `GET /api/d/bsb-interlinear/books.json`
  - `GET /api/d/bsb-interlinear/{book}/{chapter}.json`
- New dataset `stepbible-lexicon` (CC BY 4.0, Tyndale House): one lexicon entry per base Strong's number, each with its senses, published as a new `lexicon` entity collection.
  - `GET /api/d/stepbible-lexicon/lexicon.json`
  - `GET /api/d/stepbible-lexicon/lexicon/{strongs}.json`
- Dataset chapter verse content gains a second shape: a verse carries either `references` (cross references) or `words` (interlinear). Existing cross-reference and Theographic responses are unchanged.
- `available_datasets.json` entries gain counts and links for the new content (`totalNumberOfWords`, `listOfLexiconApiLink`, `totalNumberOfLexicon`).
- Docs, OpenAPI document, `free-use-bible-api` client types and `CHANGELOG.md` are updated. Machine-translating the new docs sections (`pnpm translate:docs`) is left to the upstream maintainers, who hold the Google Cloud project.

Not in this change: per-Strong's usage statistics, occurrence lists, the renderings dictionary, stored KJV word links, generated BSB `.words.json` annotations, and any alignment for licensed translations. Clients can already link English text to the interlinear words: KJV (`eng_kjv`, `eng_kja`) by joining its `.words.json` Strong's numbers, and BSB by matching each word's `gloss` phrase in `bsbPos` order against the BSB verse text. Generating BSB `.words.json` from that alignment is a candidate follow-up.

## Capabilities

### New Capabilities
- `interlinear-sources`: fetching the interlinear and lexicon source files with their licence, and importing them into the database as datasets.
- `interlinear-dataset`: the `bsb-interlinear` dataset and its per-chapter original-language word endpoints.
- `lexicon-dataset`: the `stepbible-lexicon` dataset and its Strong's-keyed lexicon entity endpoints.

### Modified Capabilities
<!-- None: the project has no specs yet. -->

## Impact

- `packages/helloao-tools/generation`: new `interlinear.ts` parser (ported from an existing reference implementation) with tests; `common-types.ts` and `api.ts` schemas and generation for interlinear chapters and lexicon entities; `dataset.ts` dataset output.
- `packages/helloao-cli`: `cli.ts`, `actions.ts`, `db.ts` (store and reload interlinear verse content and lexicon entities), `files.ts`, `openapi.ts`, `README.md`; `package.json` scripts `fetch:bible:interlinear` and `import:bible:interlinear`.
- `packages/free-use-bible-api`: regenerated types and client methods.
- Database: interlinear words live in the existing `DatasetChapter` / `DatasetChapterVerse` JSON columns and lexicon entries in `DatasetEntity`; no new tables expected.
- Output size: about 1,189 chapter files (chapters run 50–100 KB) and about 18,000 small lexicon files (8,723 Hebrew/Aramaic and 9,362 Greek base numbers).
- Licensing: BSB tables are public domain; STEPBible lexicons require CC BY 4.0 attribution, carried in the dataset's `licenseUrl` and `licenseNotes`.
