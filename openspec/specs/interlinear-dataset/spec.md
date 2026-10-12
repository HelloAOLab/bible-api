# interlinear-dataset Specification

## Purpose

Publishes the original-language (Hebrew, Aramaic and Greek) words of every verse as the `bsb-interlinear` dataset, so clients can show an interlinear and link words to Strong's numbers, the lexicon and the English translations.

## Requirements

### Requirement: Interlinear dataset listing
`/api/available_datasets.json` SHALL list a dataset with id `bsb-interlinear`, a `licenseUrl` and `licenseNotes` describing the Berean Standard Bible tables' public-domain status, `listOfBooksApiLink` set to `/api/d/bsb-interlinear/books.json`, and `totalNumberOfWords` set to the number of words in the dataset. The entry SHALL keep every field that existing dataset entries have.

#### Scenario: Dataset is listed
- **WHEN** a client fetches `/api/available_datasets.json`
- **THEN** the response contains an entry with `id` `bsb-interlinear`, `numberOfBooks` 66, `totalNumberOfChapters` 1189 and a positive `totalNumberOfWords`

#### Scenario: Existing datasets unchanged
- **WHEN** a client fetches `/api/available_datasets.json`
- **THEN** the `open-cross-ref` and `theographic` entries have the same fields and values as before this change

### Requirement: Interlinear books
`GET /api/d/bsb-interlinear/books.json` SHALL return the 66 books of the Protestant canon, using the same book ids, order and structure as the other dataset books endpoints.

#### Scenario: Books listed
- **WHEN** a client fetches `/api/d/bsb-interlinear/books.json`
- **THEN** the response lists 66 books from `GEN` to `REV`, each with `firstChapterApiLink` pointing at `/api/d/bsb-interlinear/{book}/1.json`

### Requirement: Interlinear chapter words
`GET /api/d/bsb-interlinear/{book}/{chapter}.json` SHALL return every verse of the chapter as `{ verse, words }`, where `words` lists the verse's original-language words in original-text order. Each word SHALL have:
- `pos`: 1-based rank in the original text's order
- `bsbPos`: 1-based rank in the BSB's English order
- `language`: one of `hebrew`, `aramaic` or `greek`
- `text`: the word in the original script, NFC-normalized
- `transliteration`, `parsing` and `parsingFull`: string or null
- `strongs`: zero-padded Strong's number such as `H0430` or `G3056`, or null
- `gloss`: the word's BSB phrase, or null when the BSB leaves the word untranslated

#### Scenario: Genesis 1:1
- **WHEN** a client fetches `/api/d/bsb-interlinear/GEN/1.json`
- **THEN** verse 1's first word has `pos` 1, `bsbPos` 1, `language` `hebrew`, `strongs` `H7225` and `gloss` `In the beginning`, and its second word has `strongs` `H1254` and `gloss` `created`

#### Scenario: Greek chapter
- **WHEN** a client fetches `/api/d/bsb-interlinear/JHN/1.json`
- **THEN** every word has `language` `greek` and every non-null `strongs` starts with `G`

#### Scenario: Untranslated word
- **WHEN** a word is marked untranslated in the source (`-`), such as the direct object marker in Genesis 1:1
- **THEN** its `gloss` is null and its `strongs` and `parsing` are still present

#### Scenario: Word without a Strong's number
- **WHEN** the source gives a word no Strong's number
- **THEN** the word is still listed, with `strongs` null

#### Scenario: Placeholder rows dropped
- **WHEN** a source row has no original-language word
- **THEN** no word is emitted for it, and `pos` and `bsbPos` stay consecutive from 1 within the verse

### Requirement: Strong's numbers join with translation word annotations
Interlinear `strongs` values SHALL use the same format as the `strongs` values in translation `.words.json` files, so a client can join the two without reformatting.

#### Scenario: KJV join
- **WHEN** a client reads `/api/eng_kjv/GEN/1.words.json` and `/api/d/bsb-interlinear/GEN/1.json`
- **THEN** each Strong's number annotated in the KJV's verse 1 (`H7225`, `H1254`, `H0430`, `H0853`, `H8064`, `H0776`) appears verbatim as a `strongs` value among verse 1's interlinear words
