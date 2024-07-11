# Generator Changelog

This is the log of changes for the Bible API Generator and associated tools.
For information on the API itself, see [API-CHANGELOG.md](./API-CHANGELOG.md).

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
        2. Import the translations into a SQLite database.
            -   This can be done by using the `import-translations` command from the CLI.
        3. Generate the API files or upload them directly to S3.
            -   You can generate API files on your local file system by calling the `generate-api-files` command.
            -   You can upload directly to an S3 bucket by using the `upload-api-files` command.
-   Added the ability to import Bible translations into a SQLite database.
    -   This makes it easy to search and filter translations and verses.