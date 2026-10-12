## 1. Types and schemas (helloao-tools)

- [x] 1.1 In `generation/common-types.ts`, add `DatasetInterlinearWordSchema` (`pos`, `bsbPos`, `language`, `text`, `transliteration`, `parsing`, `parsingFull`, `strongs`, `gloss`) and split `DatasetChapterVerseContentSchema` into a union of `DatasetChapterVerseReferences` and `DatasetChapterVerseWords` (design decision 2); verify `tsc --build` passes and existing dataset specs still pass
- [x] 1.2 Add `lexicon` to `DatasetEntityTypeSchema` and add `DatasetLexiconEntrySchema` / `DatasetLexiconSenseSchema` (`id`, `language`, `lemma`, `transliteration`, `partOfSpeech`, `gloss`, `definition`); add optional `lexicon?: DatasetLexiconEntry[]` to `DatasetDataset` in `generation/dataset.ts`; verify with `tsc --build`

## 2. Source parser (helloao-tools)

- [x] 2.1 Create `generation/interlinear.ts` porting the reference `parseBerean`, `cleanGloss`, `normalizeStrongs` (book index → API book id via the canonical order, exactly 66 books), with the renamed fields from design decision 4; verify with ported `interlinear.spec.ts` cases for verse carry-forward, original vs BSB order (incl. fractional sort keys), placeholder rows dropped, `-` / `vvv` glosses → null, null Strong's, NFC normalization and strict errors (column count, word before verse, unknown language)
- [x] 2.2 Port `parseLexicon` and `markupToText` into the same module (`G2xxxx` skipped, `G` ids always Greek, `A:` morph → Aramaic, duplicate sense ids rejected); verify with ported spec cases, including the H0001 G/H/I senses fixture
- [x] 2.3 Add `generateDatasetsFromInterlinear(files)` returning the `bsb-interlinear` dataset (books/chapters/verses with `words`) and the `stepbible-lexicon` dataset (`lexicon` entities grouped by base number, senses in id order, metadata and licences per the specs); verify with a spec on a small fixture table that checks the dataset metadata, Genesis 1:1 words and the H0430 entry shape

## 3. API generation (helloao-tools)

- [x] 3.1 In `generation/api.ts`, emit `/api/d/{dataset}/{book}/{chapter}.json` for word datasets unchanged from the stored chapter, and add `totalNumberOfWords` to the `ApiDataset` schema and value (omitted for datasets without words); verify with an `api.spec.ts` case for an interlinear fixture and an unchanged snapshot for the cross-ref fixture
- [x] 3.2 Generate the lexicon entity files `/api/d/{dataset}/lexicon.json` (items `{ id, language, name, apiLink }`) and `/api/d/{dataset}/lexicon/{strongs}.json` via `listOfDatasetEntitiesApiLink` / `datasetEntityApiLink`, and add `listOfLexiconApiLink` / `totalNumberOfLexicon` to `ApiDataset`; verify with `api.spec.ts` cases for both paths and that the Theographic snapshot is unchanged

## 4. Database and CLI (helloao-cli)

- [x] 4.1 In `db.ts`, guard the `DatasetReference` insert loop with `verse.references ?? []` and run the reload sort only when `references` is present; make the entity upsert accept the `lexicon` collection; verify that an import plus `loadDatasets` round-trip of the fixture datasets returns identical chapters and entities
- [x] 4.2 Add `fetch-interlinear <dir>` to `cli.ts` (four files per design decision 7, `.part` then rename, size floors); verify by running it into a temp dir and checking the files and a non-2xx failure via a mocked URL in a spec or a manual run
- [x] 4.3 Add `importInterlinear` to `actions.ts` and `import-interlinear <dir>` to `cli.ts` (missing-file error that names the file and points at `fetch-interlinear`); add `fetch:bible:interlinear` and `import:bible:interlinear` scripts to `package.json`; document both commands in `packages/helloao-cli/README.md`; verify by running fetch + import against a fresh local DB and checking that 66 books, 1,189 chapters and about 18k lexicon entities are present, then re-running the import and checking the counts are unchanged
- [x] 4.4 Update `files.ts` (`loadDatasetsFromDirectory` / `import-api`) to read word chapters and lexicon entities back from generated API files; verify by generating files then running `import-api` on them into a fresh DB and comparing counts

## 5. OpenAPI and client

- [x] 5.1 Update `openapi.ts` for the verse content union, the lexicon list/entry endpoints and the new `ApiDataset` fields; regenerate the document and `packages/free-use-bible-api/types.gen.ts`; verify the OpenAPI document validates and `tsc --build` passes
- [x] 5.2 Add client methods to `FreeUseBibleApi.ts` for the lexicon list and entry (chapter fetch already exists for datasets), with `FreeUseBibleApi.spec.ts` cases; verify with `pnpm test`

## 6. End-to-end check

- [x] 6.1 Generate API files from the local DB and check every spec scenario by reading the output: Genesis 1:1 words, John 1 Greek, null gloss and Strong's cases, the KJV join against live `/api/eng_kjv/GEN/1.words.json`, the H0430, H0001 and G3056 entries, and `available_datasets.json` (new entries, existing entries unchanged); record the results in the PR description

## 7. Docs and changelog

- [x] 7.1 Document both datasets in `docs/reference/datasets/README.md` (endpoints, structures, examples, how to join with `.words.json` for KJV and with `gloss`/`bsbPos` for BSB, known numbering differences such as G2258/G1510, CC BY attribution); verify with `pnpm build:docs`
- [x] 7.2 Add a V1.16.0 entry to `CHANGELOG.md` covering the new datasets, endpoints, `available_datasets.json` fields, the verse content union (typing note for TypeScript clients) and the new CLI commands; verify the entry follows the V1.14.0 format
