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
  -V, --version                                         output the version number
  -h, --help                                            display help for command

Commands:
  init [options] [path]                                 Initialize a new Bible API DB.
  generate-translation-metadata                         Generates a metadata file for a translation.
  import-translation [options] <dir> [dirs...]          Imports a translation from the given directory into the database.
  import-translations [options] <dir>                   Imports all translations from the given directory into the database.
  upload-test-translation [options] <input>             Uploads a translation to the HelloAO Free Bible API test S3 bucket.
                                                        Requires access to the HelloAO Free Bible API test S3 bucket.
                                                        For inquiries, please contact hello@helloao.org.
  upload-test-translations [options] <input>            Uploads all the translations in the given input directory to the HelloAO Free Bible API test S3 bucket.
                                                        Requires access to the HelloAO Free Bible API test S3 bucket.
                                                        For inquiries, please contact hello@helloao.org.
  generate-translation-files [options] <input> <dir>    Generates API files from the given input translation.
  generate-translations-files [options] <input> <dir>   Generates API files from the given input translations.
  upload-api-files [options] <dest>                     Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.
  fetch-translations [options] <dir> [translations...]  Fetches the specified translations from fetch.bible and places them in the given directory.
  fetch-audio [options] <dir> [translations...]         Fetches the specified audio translations and places them in the given directory.
                                                        Translations should be in the format "translationId/audioId". e.g. "BSB/gilbert"
  fetch-bible-metadata <dir>                            Fetches the Theographic bible metadata and places it in the given directory.
  help [command]                                        display help for command
```

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
