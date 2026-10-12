## Context

See proposal.md for motivation. Relevant current state:

- Datasets flow `fetch-* -> import-* -> DB -> loadDatasets -> generateApiForDataset -> files`. Theographic (V1.14) is the template: `fetch-bible-metadata` downloads raw files, `import-bible-metadata` runs `generateDatasetFromTheographic` (helloao-tools) and `importDatasetOutput` (cli).
- `DatasetChapter.json` stores a whole chapter and is reloaded verbatim. `db.ts` assumes cross-reference content in two places: the insert loop over `verse.references` (writes `DatasetReference` rows) and the reload sort of `verse.references`.
- Entities are stored generically in `DatasetEntity { datasetId, type, id, name, json, sha256 }`. `DatasetEntityTypeSchema` is the enum `people | places | events | groups`, which also names the URL segment `/api/d/{dataset}/{type}/{id}.json`.
- An existing reference implementation already parses the sources, with tests, and documents the source quirks.
- Translation `.words.json` uses zero-padded Strong's numbers (`H0430`), the same format the reference implementation emits (true for the KJV; other translations may need normalizing).

## Goals / Non-Goals

**Goals:**
- Reuse the dataset pipeline end to end, with no new tables or endpoint families.
- Port the reference parser so both produce the same words and senses from the same sources.
- Leave the `open-cross-ref` and `theographic` output byte-identical.

**Non-Goals:**
- KJV tagged-text parsing, a renderings builder, and usage stats. `.words.json` already covers the KJV side.
- Any alignment onto translation text, including BSB.
- Changing the existing datasets' schemas, except for the additive union described below.

## Decisions

### 1. Two datasets split by licence
`bsb-interlinear` (public domain) holds the words. `stepbible-lexicon` (CC BY 4.0) holds the lexicon. Licence metadata is per dataset, so a combined dataset would either under-credit Tyndale House or over-restrict the public-domain words.
*Alternative:* a single `interlinear` dataset with chapters plus lexicon entities. Simpler to list, but its licence fields would be wrong for half of the content.

### 2. Verse content is a union told apart by shape, not a dataset `type` field
`DatasetChapterVerseContent` becomes `{ verse, references } | { verse, words }`. In zod this is a `z.union` of two named schemas (`DatasetChapterVerseReferences`, `DatasetChapterVerseWords`). OpenAPI renders it as `oneOf` and the generated client as a TypeScript union.
*Why not a `type` column:* `Dataset` has no type today, Theographic is already identified by which collections it has, and a column would need a Prisma migration plus back-filling for no extra information.
*Trade-off:* clients branch on `'words' in verse`. The `available_datasets.json` counts (`totalNumberOfWords` vs `totalNumberOfReferences`) tell clients which shape a dataset holds before they fetch a chapter.

### 3. Lexicon as a fifth entity collection
Add `lexicon` to `DatasetEntityTypeSchema`. The collection segment is `lexicon`, giving `/api/d/{dataset}/lexicon.json` and `/api/d/{dataset}/lexicon/{strongs}.json` from the existing `listOfDatasetEntitiesApiLink` / `datasetEntityApiLink` helpers. One entity per base Strong's number, `name` = first sense's lemma, `json` = `{ id, language, senses[] }`. The entry endpoint wraps it as `{ dataset, entry, thisLexiconEntryApiLink }`, like the person, place and group responses. The `ApiDataset` entry gains `listOfLexiconApiLink` and `totalNumberOfLexicon`, following the `listOfPeopleApiLink` / `totalNumberOfPeople` pattern.
*Alternative:* one file per sense id (`H0430G`). Rejected because Strong's numbers in words and `.words.json` are base numbers, so every lookup would need a second hop.

### 4. Field names follow API conventions, not the reference implementation's
Reference → API: `lang` → `language`, `translit` → `transliteration`, `posTag` → `partOfSpeech`. Other names (`pos`, `bsbPos`, `parsing`, `parsingFull`, `strongs`, `gloss`, `lemma`, `definition`) are kept. The port changes only the names, never the values, so the reference and API output stay comparable.

### 5. Parser lives in helloao-tools as `generation/interlinear.ts`
It is a pure TypeScript port of `parseBerean`, `cleanGloss`, `normalizeStrongs`, `parseLexicon` and `markupToText`, plus `generateDatasetsFromInterlinear(files): DatasetDataset[]`, matching `theographic.ts`. The reference's book table is replaced by the API's canonical book order (`bookOrderMap`). The Berean table names books in canonical order, so book index → book id, with a check that the result has exactly 66 books. The reference unit tests are ported to `interlinear.spec.ts` with jest.

### 6. DB: store words through the existing chapter JSON
`importDatasetOutput` already writes `DatasetChapter.json` and `DatasetChapterVerse.contentJson`. The insert loop becomes `for (ref of verse.references ?? [])`, and the reload sort runs only when `references` is present. No migration. Lexicon entities go through the existing `DatasetEntity` upsert, which also deletes entities that disappeared, so a re-import replaces the old contents.

### 7. Fetch: plain downloads, licence README alongside
`fetch-interlinear` uses `downloadFile` (which already throws on non-2xx) into a `.part` path, then renames it into place. Files:
- `bsb_tables.tsv` ← `https://bereanbible.com/bsb_tables.tsv`
- `stepbible/tbesh.txt`, `stepbible/tbesg.txt` ← STEPBible-Data `Lexicons/` raw URLs (`master`)
- `stepbible/README.md` ← STEPBible-Data `README.md` (the licence statement; the repository has no LICENSE file)

Each file gets a size floor (about 50 MB for the table and 1 MB for each lexicon) to catch HTML error pages served with a 200 status.

## Risks / Trade-offs

- [Upstream files change without versioning (`master`, bereanbible.com)] → The parser is strict (spec: interlinear-sources) so format drift fails the import loudly. The sha256 per chapter and entity makes content changes visible in upload diffs.
- [Union type is a client typing change] → It is additive for JSON consumers. TypeScript users narrowing on `references` get a compile error that points them to the union. Call this out in the CHANGELOG.
- [Output size: about 1,189 chapters at 50–100 KB plus about 18k lexicon files] → Comparable to one translation's chapter set, and upload already skips unchanged files by hash.
- [STEPBible TBESH header mentions Online Bible permission for the Hebrew meanings] → Project owner confirmed the lexicons are free to use with attribution. `licenseNotes` credits STEPBible.org / Tyndale House, and the saved README keeps the licence statement with the source.
- [Reference and API parsers drift apart] → The port keeps behaviour identical and the ported tests keep the same fixtures.
- [`G2258` vs `G1510` and similar numbering differences between the KJV's tags and the Berean table] → A few KJV joins miss. Documented in the dataset docs, not corrected.

## Migration Plan

1. Implement on the `vu/interlinear-dataset` branch. Run `fetch:bible:interlinear` and `import:bible:interlinear` against a local DB, then generate files and spot-check them against the spec scenarios.
2. Release as CHANGELOG V1.16.0 with docs. Production follows the normal `s3:sync:db` / `s3:sync:api` flow.
3. Rollback: delete the two dataset ids from the DB and regenerate. No other data depends on them.
