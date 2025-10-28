# API Changelog

This is the log of changes for the Free Use Bible API.
For information on the API Generator, see [GENERATOR-CHANGELOG.md](./GENERATOR-CHANGELOG.md).

## V1.7.0

#### Date: 2025-10-28

### :rocket: Features

-   Added the [Open BIble Cross Reference](https://www.openbible.info/labs/cross-references/) dataset.

## V1.6.0

#### Date: 2025-09-16

### :rocket: Features

-   Added the `firstChapterNumber` and `lastChapterNumber` fields for `TranslationBook`.

### :bug: Bug Fixes

-   Fixed chapter links to start at the correct number for the book. ([#24](https://github.com/HelloAOLab/bible-api/issues/24))

## V1.5.0

#### Date: 2025-07-02

### :rocket: Features

-   Switched primary source for Bible translations to [ebible.org](https://ebible.org/).
    -   This switch adds a bunch of new translations in various different languages.
-   Added apocrypha for translations which decide to include them.
    -   Apocryphal books have their `isApocryphal` property set to `true` in their book information and are always ordered after Revelation.
    -   An example is the King James Version + Apocrypha (`eng_kja`) translation.

### :bug: Bug Fixes

-   Fixed missing verses in PSA 119 in the `npi_ulb` translation. ([#18](https://github.com/HelloAOLab/bible-api/issues/18))
-   Fixed missing books in the `fra_lsg` translation. ([#17](https://github.com/HelloAOLab/bible-api/issues/17))
-   Fixed missing books in the `hbo_wlc` translation. ([#14](https://github.com/HelloAOLab/bible-api/issues/14))
-   Changed the ID of `eng_drv` to `eng_dra`. ([#21](https://github.com/HelloAOLab/bible-api/issues/21))
-   Fixed audio links for Titus in the BSB translation. ([#15](https://github.com/HelloAOLab/bible-api/issues/15))

## V1.4.0

#### Date: 2024-12-18

### :rocket: Features

-   Added the [Tyndale](https://tyndaleopenresources.com/) Bible commentary.

### :bug: Bug Fixes

-   Fixed cases where consecutive poem lines that have the same indentation now have an explicit line break to indicate that they are actually on separate lines.

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
