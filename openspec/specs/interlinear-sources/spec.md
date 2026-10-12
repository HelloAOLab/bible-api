# interlinear-sources Specification

## Purpose

Lets maintainers download the interlinear and lexicon source files together with their licence, and import them into the API database as datasets.

## Requirements

### Requirement: Fetch interlinear sources
The CLI SHALL provide a `fetch-interlinear <dir>` command that downloads into `<dir>` the Berean interlinear table (`bsb_tables.tsv` from bereanbible.com), the STEPBible TBESH and TBESG brief lexicons, and the STEPBible-Data repository `README.md` that states their licence. The lexicons and README SHALL be stored under a `stepbible/` subdirectory.

#### Scenario: Fresh download
- **WHEN** `fetch-interlinear ./sources/interlinear` runs against an empty directory
- **THEN** the directory contains `bsb_tables.tsv`, `stepbible/tbesh.txt`, `stepbible/tbesg.txt` and `stepbible/README.md`

#### Scenario: Licence is kept with the data
- **WHEN** the lexicons are downloaded
- **THEN** the STEPBible-Data `README.md` stating "CC BY 4.0" is saved alongside them in the same run

#### Scenario: Failed download
- **WHEN** any source responds with a non-success HTTP status
- **THEN** the command fails with an error naming the URL and status, and leaves no partially written file at that file's final path

### Requirement: Import interlinear sources
The CLI SHALL provide an `import-interlinear <dir>` command that reads the files written by `fetch-interlinear` and imports the `bsb-interlinear` and `stepbible-lexicon` datasets into the database selected by `--db`. Re-running the import SHALL replace the previous contents of both datasets rather than duplicating them.

#### Scenario: Import into a database
- **WHEN** `import-interlinear ./sources/interlinear --db ./free-use-bible-api.db` runs after a successful fetch
- **THEN** the database contains the `bsb-interlinear` dataset with 66 books and 1,189 chapters, and the `stepbible-lexicon` dataset with its lexicon entries

#### Scenario: Missing source file
- **WHEN** a required file is absent from `<dir>`
- **THEN** the command fails with an error naming the missing file and telling the user to run `fetch-interlinear` first

#### Scenario: Re-import
- **WHEN** the import runs twice against the same database
- **THEN** each dataset holds exactly one copy of every chapter and lexicon entry

### Requirement: Source parsing is strict
The import SHALL reject source data whose structure it does not recognise instead of guessing: a Berean table row with an unexpected column count, a word before any verse reference, an unknown word language, a table that does not cover exactly 66 books, or duplicate lexicon sense ids.

#### Scenario: Malformed table row
- **WHEN** a `bsb_tables.tsv` data row does not have 23 tab-separated columns
- **THEN** the import fails with an error naming the line number, and nothing is written to the database

#### Scenario: Unknown language
- **WHEN** a table row's language is not Hebrew, Aramaic or Greek
- **THEN** the import fails with an error naming the language
