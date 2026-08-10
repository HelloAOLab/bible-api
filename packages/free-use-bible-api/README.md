# Free Use Bible API

TypeScript and JavaScript client for the public Free Use Bible API:

-   `https://bible.helloao.org`

## Installation

```bash
npm install free-use-bible-api
```

```bash
pnpm add free-use-bible-api
```

```bash
yarn add free-use-bible-api
```

## Quick Start

```ts
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

const available = await api.getAvailableTranslations();
console.log('Total translations:', available.translations.length);

const books = await api.getTranslationBooks('BSB');
console.log('Books in BSB:', books.books.length);

const chapter = await api.getTranslationBookChapter('BSB', 'GEN', 1);
console.log('Verses in Genesis 1:', chapter.numberOfVerses);
```

## Client Options

You can customize the client with `FreeUseBibleApiOptions`:

```ts
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi({
    endpoint: 'https://bible.helloao.org/',
    useCache: true,
});
```

-   `endpoint`: Base API endpoint.
-   `useCache`: Enables in-memory response caching (default: `true`).

## API Methods

### Translations

-   `getAvailableTranslations(endpoint?)`
-   `getTranslationBooks(translation, endpoint?)`
-   `getTranslationBookChapter(translation, book, chapter, endpoint?)`
-   `getTranslationBookChapterWords(translation, book, chapter, endpoint?)`
-   `getCompleteTranslation(translation, endpoint?)`

`getCompleteTranslation()` disables per-request cache internally because payloads are typically large.

### Commentaries

-   `getAvailableCommentaries(endpoint?)`
-   `getCommentaryBooks(commentary, endpoint?)`
-   `getCommentaryBookChapter(commentary, book, chapter, endpoint?)`

### Datasets

-   `getAvailableDatasets(endpoint?)`
-   `getDatasetBooks(dataset, endpoint?)`
-   `getDatasetBookChapter(dataset, book, chapter, endpoint?)`

### Chapter Navigation Helpers

-   `getNextChapter(chapter, endpoint?)`
-   `getPreviousChapter(chapter, endpoint?)`

These helpers work with translation, commentary, and dataset chapter responses.

### Word Annotations

Some translations include word-level annotations (Strong's numbers and related source data) for their chapters.

-   `getChapterWords(chapter, endpoint?)` - gets the annotations for a chapter you already loaded, or `null` if it doesn't have any.
-   `getWordText(verse, word)` - gets the text that a single annotation applies to.
-   `getVerseWords(verse, words)` - gets the annotations for a verse, each paired with the text it applies to.

Each annotation is anchored to a range of characters in a single item of a verse's `content` array: `contentIndex` is the index of the item, and `start`/`end` are character offsets into that item's text (`end` is exclusive). Anchoring per content item keeps the offsets correct for verses whose content is split into multiple items, such as poem lines and the words of Jesus.

`getWordText()` and `getVerseWords()` resolve those offsets for you, so you don't have to walk the content array yourself.

## Examples

### Get a complete translation

```ts
const complete = await api.getCompleteTranslation('BSB');
console.log(complete.translation.id);
console.log(complete.books.length);
```

### Read a commentary chapter

```ts
const comm = await api.getCommentaryBookChapter('matthew_henry', 'GEN', 1);
console.log(comm.book.name);
```

### Read a dataset chapter

```ts
const dataChapter = await api.getDatasetBookChapter(
    'cross_references',
    'JHN',
    3
);
console.log(dataChapter.book.name);
```

### Navigate to next/previous chapter

```ts
const current = await api.getTranslationBookChapter('BSB', 'GEN', 1);

const next = await api.getNextChapter(current);
const previous = await api.getPreviousChapter(current);

console.log(next?.chapter.number);
console.log(previous?.chapter.number);
```

### Read the Strong's numbers for a chapter

```ts
const chapter = await api.getTranslationBookChapter('engwebp', 'JHN', 1);
const words = await api.getChapterWords(chapter);

if (!words) {
    // This translation has no word-level annotations for the chapter.
    return;
}

for (const content of chapter.chapter.content) {
    if (content.type !== 'verse') {
        continue;
    }

    for (const word of api.getVerseWords(content, words)) {
        console.log(word.text, word.strongs);
    }
}

// In [ 'G1722' ]
// the [ 'G1722' ]
// beginning [ 'G0746' ]
// ...
```

## Direct HTTP Endpoints

### Translation endpoints

-   `GET /api/available_translations.json`
-   `GET /api/{translation}/books.json`
-   `GET /api/{translation}/{book}/{chapter}.json`
-   `GET /api/{translation}/{book}/{chapter}.words.json`
-   `GET /api/{translation}/complete.json`

### Commentary endpoints

-   `GET /api/available_commentaries.json`
-   `GET /api/{commentary}/books.json`
-   `GET /api/{commentary}/{book}/{chapter}.json`

### Dataset endpoints

-   `GET /api/available_datasets.json`
-   `GET /api/d/{dataset}/books.json`
-   `GET /api/d/{dataset}/{book}/{chapter}.json`

Example requests:

```bash
curl https://bible.helloao.org/api/available_translations.json
curl https://bible.helloao.org/api/BSB/books.json
curl https://bible.helloao.org/api/BSB/GEN/1.json
curl https://bible.helloao.org/api/available_commentaries.json
curl https://bible.helloao.org/api/available_datasets.json
```

## Error Handling

Methods throw on non-2xx responses.

A 404 response usually means one of the path values is invalid, for example:

-   translation
-   commentary
-   dataset
-   book
-   chapter

## Notes

-   Uses the global `fetch` API.
-   For Node.js, use a runtime that provides `fetch` (Node 18+ recommended) or polyfill it.
