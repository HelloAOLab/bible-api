# API Changelog

This is the log of changes for the Free Use Bible API.
For information on the API Generator, see [GENERATOR-CHANGELOG.md](./GENERATOR-CHANGELOG.md).

## V1.4.0

#### Date: 2024-12-18

### :rocket: Features

-   Added the [Tyndale](https://tyndaleopenresources.com/) Bible commentary.

## V1.3.0

#### Date: 2024-11-15

### :rocket: Features

-   Added support for Bible commentaries.
    -   See the the [API Reference](https://bible.helloao.org/docs/reference/#available-commentaries) for more info.

## V1.2.0

#### Date: 2024-07-25

### :rocket: Features

-   Added the total number of books, chapters, and verses that each translation, book, and chapter contains.
-   Added `languageName` and `languageEnglishName` for translations so that it is easy to display a name for the language that the translation is in.

### :bug: Bug Fixes

-   Fixed an issue where parts of some verses were missing.
-   Fixed the documentation to note that the language of a translation is in ISO 639 format.

## V1.1.0

#### Date: 2024-07-11

### :rocket: Features

-   Added links for audio versions to the chapter data.
    -   Currently, this is only available for the BSB translation.
    -   Thanks to [https://openbible.com/](https://openbible.com/) for making this possible!

## V1.0.0

#### Date: 2024-07-11

### :bug: Bug Fixes

-   Fixed an issue where where some chapters would be missing the first verse of the chapter.
    -   This was fixed by moving to using USX versions of translations.
