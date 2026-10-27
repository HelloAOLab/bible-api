# sync-pipeline Specification

## Purpose

Lets maintainers keep a database and its published API up to date with a single command that only does the work that the changes since the last run require, and that only ever publishes the sources it was configured with.

## Requirements

### Requirement: Configured sources

The CLI SHALL provide a `sync [config]` command that reads a JSON config listing the database, the sources (`translation`, `translations`, `commentary`, `commentaries`, `theographic`, and `interlinear` directories), optional `include` and `exclude` ID patterns, and the destinations. Paths SHALL be resolved relative to the config file. A configured source directory that does not exist SHALL fail the sync before anything is changed.

#### Scenario: Missing source directory

- **WHEN** a configured source directory does not exist
- **THEN** the sync fails with an error naming the directory, and no source is removed from the database

### Requirement: Change detection

The sync SHALL import a source only when it is new, when the names or contents of its files changed since it was last imported, or when the processor for its type changed. Sources whose files were only touched (modification time changed, contents identical) SHALL NOT be reimported.

#### Scenario: Unchanged sources

- **WHEN** the sync runs twice without any source changing
- **THEN** the second run imports nothing and uploads nothing

#### Scenario: Metadata change

- **WHEN** only a translation's `metadata.json` changes
- **THEN** that translation is reimported and re-uploaded, and `available_translations.json` reflects the new metadata

### Requirement: Deletions

When a source is deleted or becomes excluded, the sync SHALL delete its items from the database and their files from every destination. When a source changes, its items SHALL be replaced as a whole, so content removed from the source is removed from the database and the destinations. Audio timings imported separately SHALL be kept for chapters that still exist.

#### Scenario: Deleted translation

- **WHEN** a translation directory is deleted and the sync runs
- **THEN** the translation is no longer in the database, its files are deleted from the destination, and it is no longer listed in `available_translations.json`

### Requirement: Source filtering

The sync SHALL only import, and only upload, the items from configured sources that pass the `include` and `exclude` patterns. Items that were imported into the database by other commands SHALL NOT be uploaded.

#### Scenario: Excluded translation

- **WHEN** a translation matches an `exclude` pattern
- **THEN** it is never imported into the database or uploaded to any destination

### Requirement: Processor changes

Each imported source SHALL record the version of the processor it was imported with. The version SHALL be derived from the declared parser and dataset versions and a hash of the minified processing code, so that comment and formatting changes do not change it. When the version changes, every source of the affected type SHALL be reimported, unless the sync is run with `--ignore-processor-changes`.

#### Scenario: Parser change

- **WHEN** the code that parses translations changes and the sync runs
- **THEN** every translation and commentary source is reimported, and only items whose resulting content changed are re-uploaded

### Requirement: Incremental uploads

For each destination, the sync SHALL record the content hash and generator version of every uploaded item, and SHALL only generate and upload the items whose content or generator version changed. Merged files such as `available_translations.json` SHALL be rebuilt from every synced item whenever they change. Files for removed items SHALL only be deleted after the merged files no longer link to them. Zip destinations SHALL be rewritten from scratch whenever anything changes.

#### Scenario: Output matches a full generation

- **WHEN** the sync uploads a set of translations to a local directory
- **THEN** the files are identical to the ones that `import-translations` followed by `upload-api-files` produce for the same sources
