# Generator Changelog

This is the log of changes for the Bible API Generator and associated tools.
For information on the API itself, see [API-CHANGELOG.md](./API-CHANGELOG.md).

## V1.5.0

#### Date: 2025-07-02

### :rocket: Features

-   Added the ability to download and convert sources from [ebible.org](https://ebible.org/).

### :bug: Bug Fixes

-   Fixed an issue where every second verse would be skipped in USX files which don't contain ending verse markers.

## V1.2.0

#### Date: 2024-07-24

### :rocket: Features

-   Added the ability to track input files and if their content changes to make API updates quicker.
-   Added the ability to generate the total number of books, chapters, and verses that are in a translation to make it easier to determine if a translation is complete or not.
-   Added the native and english names of the language that translations are in.
-   Added the ability to check SHA-256 checksums before uploading to S3.

### :bug: Bug Fixes

-   Fixed an issue where some verses would not get parsed correctly and would be left out of the API.
-   Note that `Translation.language` actually contains a 3-letter ISO-639 language tag and not a RFC 5646 language tag.

## V1.1.0

#### Date: 2024-07-11

### :rocket: Features

-   Added the ability to generate audio links for a chapter. - Currently, this is only available for the BSB translation. - Thanks to [https://openbible.com/](https://openbible.com/) for making this possible!
    `

## V1.0.0

#### Date: 2024-07-11

### :rocket: Features

-   Improved the API generator to support USX.
    -   [USX](https://markups.paratext.org/usx/) is a XML-based format for representing Bible translation content. It is preferred over USFM since it has fewer edge cases and allows us to reuse already written HTML parsers.
    -   USX is additionally supported by the [BibleMultiConverter](https://github.com/schierlm/BibleMultiConverter).
-   Added a CLI for making it easy to download, import, and generate the API.
    -   It supports the ability to download translations from https://fetch.bible/, import translations to SQLite from a directory, and export the API to a directory or directly to S3.
    -   To generate the API, you need to follow the following steps:
        1.  Download Bible translations and place them in a directory.
            -   This can be done by using the `fetch-translations` command from the CLI.
            -   Alternatively, any translation that is available in USFM (not preferred - there are some parsing errors with USFM formated translations) or USX (preferred - it works better) can be used as long as it has a `metadata.json` file that matches the [`InputTranslationMetadata` interface](./src/generation/common-types.ts#L38). Each translation should have its own directory.
        2.  Import the translations into a SQLite database.
            -   This can be done by using the `import-translations` command from the CLI.
        3.  Generate the API files or upload them directly to S3.
            -   You can generate API files on your local file system by calling the `generate-api-files` command.
            -   You can upload directly to an S3 bucket by using the `upload-api-files` command.
-   Added the ability to import Bible translations into a SQLite database.
    -   This makes it easy to search and filter translations and verses.
