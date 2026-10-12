## Purpose

Publishes the STEPBible brief Hebrew and Greek lexicons as the `stepbible-lexicon` dataset, with one entry per Strong's number, so clients can look up the meaning of any interlinear word.

## ADDED Requirements

### Requirement: Lexicon dataset listing
`/api/available_datasets.json` SHALL list a dataset with id `stepbible-lexicon`, `licenseUrl` `https://creativecommons.org/licenses/by/4.0/`, `licenseNotes` crediting Tyndale House / STEPBible.org, `listOfLexiconApiLink` set to `/api/d/stepbible-lexicon/lexicon.json`, and `totalNumberOfLexicon` set to the number of lexicon entries.

A dataset with no books SHALL still list a `books.json` with no books, report `numberOfBooks` and its chapter, verse and reference counts as 0, and omit `totalNumberOfWords`.

#### Scenario: Dataset is listed with attribution
- **WHEN** a client fetches `/api/available_datasets.json`
- **THEN** the `stepbible-lexicon` entry has the CC BY 4.0 `licenseUrl`, credits STEPBible.org in `licenseNotes`, and has a positive `totalNumberOfLexicon`

### Requirement: Lexicon entry
`GET /api/d/stepbible-lexicon/lexicon/{strongs}.json` SHALL return `{ dataset, entry, thisLexiconEntryApiLink }`, following the other entity responses. `entry` is the entry for one base Strong's number: `id` (the number, e.g. `H0430`), `language` (the first sense's language), and `senses`, a list of the number's lexicon senses. `thisLexiconEntryApiLink` SHALL be the entry's own endpoint. Each sense SHALL have its extended id (e.g. `H0001G`), `language` (`hebrew`, `aramaic` or `greek`), `lemma`, `transliteration`, `partOfSpeech`, `gloss` and `definition` as plain text with paragraphs separated by blank lines. Absent source values SHALL be null.

#### Scenario: Hebrew entry
- **WHEN** a client fetches `/api/d/stepbible-lexicon/lexicon/H0430.json`
- **THEN** the response has `entry.id` `H0430`, `entry.language` `hebrew`, and at least one sense in `entry.senses` whose `lemma` is `אֱלֹהִים`

#### Scenario: Several senses under one number
- **WHEN** a client fetches `/api/d/stepbible-lexicon/lexicon/H0001.json`
- **THEN** `entry.senses` contains `H0001G` (gloss `father`), `H0001H` and `H0001I`, in id order

#### Scenario: Greek entry
- **WHEN** a client fetches `/api/d/stepbible-lexicon/lexicon/G3056.json`
- **THEN** the response has `entry.language` `greek` and a sense in `entry.senses` whose `lemma` is `λόγος`

#### Scenario: Markup removed
- **WHEN** a source definition contains HTML markup such as `<br>`
- **THEN** the `definition` contains no tags; line breaks become paragraph breaks and other tags keep only their text

#### Scenario: LSJ-only ids excluded
- **WHEN** the Greek source contains `G2xxxx` ids that have no Strong's number
- **THEN** no lexicon entry is published for them

### Requirement: Lexicon list
`GET /api/d/stepbible-lexicon/lexicon.json` SHALL list every lexicon entry with its `id`, `language`, a `name` (the first sense's lemma) and an `apiLink` to its entry endpoint, following the structure of the existing entity list endpoints.

#### Scenario: List links to entries
- **WHEN** a client fetches `/api/d/stepbible-lexicon/lexicon.json`
- **THEN** the item with `id` `H0430` has `apiLink` `/api/d/stepbible-lexicon/lexicon/H0430.json`

### Requirement: Interlinear words resolve to lexicon entries
Every non-null `strongs` value in the `bsb-interlinear` dataset that has a lexicon entry SHALL be fetchable at `/api/d/stepbible-lexicon/lexicon/{strongs}.json` without reformatting the value. The values are zero-padded, which matches the KJV's `.words.json` values; other translations' values may need zero-padding and suffix stripping before they can be looked up.

#### Scenario: Word to definition
- **WHEN** a client takes `strongs` `H1254` from Genesis 1:1 in `bsb-interlinear`
- **THEN** `/api/d/stepbible-lexicon/lexicon/H1254.json` returns `{ dataset, entry, thisLexiconEntryApiLink }` where `entry.id` is `H1254`
