## Hello AO CLI

A Command Line Interface (CLI) that makes it easy to generate and manage your own [Free Use Bible API](https://bible.helloao.org/).

Additionally, it includes many functions and utilities that can make working with commonly formatted Bible data much easier.

### Features

-   Supports [USFM](https://ubsicap.github.io/usfm/), [USX](https://ubsicap.github.io/usx/), and Codex (A JSON format).
-   Download over 1000 Bible translations from [fetch.bible](https://fetch.bible/).
-   Import Bible translations into a SQLite database.
-   Upload to S3, a zip file, or a local directory.

### Usage

```
Usage: helloao [options] [command]

A CLI for managing a Free Use Bible API.

Options:
  -V, --version                                          output the version number
  -h, --help                                             display help for command

Commands:
  init [options] [path]                                  Initialize a new Bible API DB.
  generate-translation-metadata                          Generates a metadata file for a translation.
  import-translation [options] <dir> [dirs...]           Imports a translation from the given directory into the database.
  import-translations [options] <dir>                    Imports all translations from the given directory into the database.
  import-commentary [options] <dir> [dirs...]            Imports a commentary from the given directory into the database.
  import-commentaries [options] <dir>                    Imports all commentaries from the given directory into the database.
  import-bible-metadata <dir>                            Imports the Theographic bible metadata (people, places, events, and people groups) from the given directory into the database.
                                                         The directory should contain the JSON files downloaded by the fetch-bible-metadata command.
  import-interlinear <dir>                               Imports the Berean interlinear words and the STEPBible lexicons from the given directory into the database.
                                                         The directory should contain the files downloaded by the fetch-interlinear command.
  upload-test-translation [options] <input>              Uploads a translation to the HelloAO Free Bible API test S3 bucket.
                                                         Requires access to the HelloAO Free Bible API test S3 bucket.
                                                         For inquiries, please contact hello@helloao.org.
  upload-test-translations [options] <input>             Uploads all the translations in the given input directory to the HelloAO Free Bible API test S3 bucket.
                                                         Requires access to the HelloAO Free Bible API test S3 bucket.
                                                         For inquiries, please contact hello@helloao.org.
  generate-translation-files [options] <input> <dir>     Generates API files from the given input translation.
  generate-translations-files [options] <input> <dir>    Generates API files from the given input translations.
  upload-api-files [options] <dest>                      Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.
  source-translations [options] <dir> [translations...]  Finds translation sources from ebible.org and downloads it.
  source-fetch-bible-translations [options] <dir> [translations...]
                                                         Finds translation sources from fetch.bible and downloads them.
                                                         Translations that are already provided by eBible are skipped.
  source-all-translations [options] <dir> [translations...]
                                                         Finds translation sources from eBible and fetch.bible, and downloads them into the given directory so that they can be imported with import-translations.
                                                         Translations available from eBible are downloaded from eBible, and the rest are downloaded from fetch.bible. Only new and changed translations are downloaded.
  list-fetch-bible-translations [search]                 List available fetch.bible translations. Optionally filter by search term.
  list-ebible-translations [search]                      List available eBible translations. Optionally filter by search term.
  refresh-ebible-licenses [options] [translations...]    Detects the licenses of the eBible translations that are already in the database and stores them.
                                                         Optionally limited to the given translation IDs.
  fetch-audio [options] <dir> [translations...]          Fetches the specified audio translations and places them in the given directory.
                                                         Translations should be in the format "translationId/audioId". e.g. "BSB/gilbert"
  fetch-bible-metadata <dir>                             Fetches the Theographic bible metadata and places it in the given directory.
  fetch-interlinear <dir>                                Fetches the Berean interlinear table and the STEPBible lexicons (with their license) and places them in the given directory.
  fetch-tyndale-open-resources <dir>                     Fetches the Tyndale Open Bible Resources and places it in the given directory.
  help [command]                                         display help for command
```

> **eBible licenses.** `source-translations` detects the license of each eBible translation (from the Creative Commons link on its ebible.org details page, falling back to a "public domain" copyright notice) and stores it in `metadata.json`. To add licenses to a database that was imported before license detection existed, run `helloao refresh-ebible-licenses --db <path> --dir <sourced translations dir>`. It updates the `license` column of each eBible translation in place, and `--dir` also writes the licenses into the matching `metadata.json` files so that a later re-import doesn't clear them. Translations whose license can't be detected are left unchanged.

> **Sourcing translations.** `source-all-translations <dir>` is the one command for keeping a directory of translations up to date. It reconciles the translation lists from [eBible](https://ebible.org) and [fetch.bible](https://fetch.bible) so that each translation is downloaded from only one source: translations that eBible has are downloaded from eBible (like `source-translations`), and translations that only fetch.bible has (or that eBible lists but has no USFM download for) are downloaded from the [fetch.bible collection](https://github.com/gracious-tech/fetch_collection). Downloads are tracked in the database (`--db`), so later runs only download new and changed translations. Changes are detected from the git history of the fetch.bible collection: each run looks up the collection's latest commit with the GitHub API (3 requests) and compares the git tree SHA of each translation's directory with the one that was downloaded, and files are downloaded from that exact commit. Set `GITHUB_TOKEN` to raise the GitHub API rate limit; if the API is unavailable, changes are detected from each translation's `meta.json` instead. Use `--collection-repo` and `--collection-ref` to download from a fork or another branch. USFM files are converted to USX3 with [BibleMultiConverter](https://github.com/schierlm/BibleMultiConverter) (use `--no-convert-to-usx3` to keep the USFM files), and every translation gets a `metadata.json` (including its license), so the directory can be imported straight away with `import-translations <dir>`. Translations listed in `<dir>/ignorelist.txt` (by eBible ID, fetch.bible ID, or translation ID) are never downloaded. To only download from fetch.bible, use `source-fetch-bible-translations <dir>`, which skips translations that the database (or `--ebible-dir`) shows were already downloaded from eBible. Translations that came from fetch.bible have a `fetch-bible.txt` file in their directory.

> **Audio timings.** The `import-audio-timings <file>` command loads per-verse start times for a chapter's audio into the database, from a JSON array of `{ translationId, bookId, chapterNumber, reader, verses }` records. To generate that file from the audio itself, see [`tools/audio-timings`](../../tools/audio-timings/README.md), which transcribes a chapter with whisperX and aligns the result against the chapter's known verse text.

The `@helloao/cli` package can also be used as a library.

The library exports a variety of actions, utilities, and supporting classes designed to assist with generating and managing a Free Use Bible API.

There are 6 main exports:

-   `actions` - This export contains function versions of the CLI commands. They make it easy to call a CLI command from a script.
-   `db` - This export contains functions that make working with a database easier. It supports operations like importing translations into a database, inserting chapters, verses, etc. and getting an updated database instance from a path.
-   `downloads` - This export contains functions that make downloading files easier.
-   `files` - This export contains functions that make working with files easier. It has functions to load files from a translation, discover translation metadata from the filesystem, and classes that support uploading API files to the local file system or to a zip archive.
-   `uploads` - This export contains functions that make it easy to upload an API to a destination like S3, the local filesystem, or a zip archive.
-   `s3` - This export contains a class that can upload files to S3.

Here are some common operations that you might want to perform:

#### Get a SQL Database

```typescript
import { db } from '@helloao/cli';

const pathToDb = './bible-database.db';
const database = await db.getDb(pathToDb);

// do work on the database

// Close it when you are done.
database.close();
```

#### Import a translation into a database from a directory

```typescript
import { db } from '@helloao/cli';

const pathToDb = './bible-database.db';
const database = await db.getDb(pathToDb);

// Get a DOMParser for parsing USX.
// On Node.js, you may have to import jsdom or linkedom.
const parser = new DOMParser();

const pathToTranslation = './path/to/translation';

// Whether to overwrite files that already exist in the database.
// The system will automatically determine the hashes of the input files and overwrite changed files if needed, so this is only needed
// when you know that they need to be overwritten.
const overwrite = false;
await db.importTranslations(database, pathToTranslation, parser, overwrite);
```

#### Generate an API from a translation

```typescript
import { files, uploads } from '@helloao/cli';
import { generation } from '@helloao/tools';
import { toAsyncIterable } from '@helloao/tools/parser/iterators';

const translationPath = './path/to/translation';
const translationFiles = await files.loadTranslationFiles(translationPath);

// Used to parse XML
const domParser = new DOMParser();

// Generate a dataset from the files
// Datasets organize all the files and their content
// by translation, book, chapter, and verse
const dataset = generation.dataset.generateDataset(files, parser);

// You can optionally specifiy a prefix that should be added to all API
// links
const pathPrefix = '';

// Generate an API representation from the files
// This adds links between chapters and additional metadata.
const api = generation.api.generateApiForDataset(dataset, {
    pathPrefix,
});

// Generate output files from the API representation.
// This will give us a list of files and file paths that represent
// the entire API.
const outputFiles = generation.api.generateFilesForApi(api);

// Optionally upload files by using:
// const dest = 's3://my-bucket';
// await uploads.serializeAndUploadDatasets(dest, toAsyncIterable(outputFiles));
```
