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
  import-translation [options] <dir> [dirs...]          Imports a translation from the given directory into the database.
  import-translations [options] <dir>                   Imports all translations from the given directory into the database.
  generate-translation-files [options] <input> <dir>    Generates API files from the given input translation.
  generate-translations-files [options] <input> <dir>   Generates API files from the given input translations.
  upload-api-files [options] <dest>                     Uploads API files to the specified destination. For S3, use the format s3://bucket-name/path/to/folder.
  fetch-translations [options] <dir> [translations...]  Fetches the specified translations from fetch.bible and places them in the given directory.
  fetch-audio [options] <dir> [translations...]         Fetches the specified audio translations and places them in the given directory.
                                                        Translations should be in the format "translationId/audioId". e.g. "BSB/gilbert"
  fetch-bible-metadata <dir>                            Fetches the Theographic bible metadata and places it in the given directory.
  help [command]                                        display help for command
```