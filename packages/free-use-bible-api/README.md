# Free Use Bible API

The Free Use Bible API provides access to over 1000 Bible translations in hundreds of languages.

This package is an auto-generated TypeScript and JavaScript client for the public API hosted at:

- https://bible.helloao.org

## Installation

Install with your preferred package manager:

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

Create a client and point it at the production API:

```ts
import { Configuration, DefaultApi } from 'free-use-bible-api';

const config = new Configuration({
	basePath: 'https://bible.helloao.org',
});

const api = new DefaultApi(config);
```

## Translation Usage Guide

This section covers the most common translation flow:

1. Get available translations.
2. Pick a translation ID.
3. Get books for that translation.
4. Fetch a chapter.
5. Optionally fetch the full translation payload.

### 1. Get Available Translations

```ts
import { Configuration, FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi(
	new Configuration({ basePath: 'https://bible.helloao.org' })
);

const result = await api.getAvailableTranslations();

console.log('Total translations:', result.translations.length);
console.log('First translation:', result.translations[0]);
```

### 2. Get Books For A Translation

Use a translation ID from the previous step, for example `BSB`:

```ts
const books = await api.getTranslationBooks({
	translation: 'BSB',
});

console.log('Books in translation:', books.books.length);
console.log('First book:', books.books[0]);
```

### 3. Get A Translation Chapter

Use a USFM book ID and chapter number:

```ts
import { BookId } from 'free-use-bible-api';

const chapter = await api.getTranslationBookChapter({
	translation: 'BSB',
	book: BookId.GEN,
	chapter: 1,
});

console.log('Chapter number:', chapter.chapter.number);
console.log('Verse count:', chapter.numberOfVerses);
```

### 4. Get A Complete Translation

Some workflows need the entire translation document in one call:

```ts
const complete = await api.getTranslationComplete({
	translation: 'BSB',
});

console.log('Translation:', complete.translation.id);
console.log('Book count:', complete.books.length);
```

## Direct HTTP Examples For Translations

If you do not want to use the SDK, these translation endpoints are available directly:

- GET `/api/available_translations.json`
- GET `/api/{translation}/books.json`
- GET `/api/{translation}/{book}/{chapter}.json`
- GET `/api/{translation}/complete.json`

Example requests:

```bash
curl https://bible.helloao.org/api/available_translations.json
curl https://bible.helloao.org/api/BSB/books.json
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

## Error Handling

A 404 response usually means one of these values is invalid:

- translation
- book
- chapter

Use available translations and books responses to drive your UI selections and reduce bad requests.

## Notes

- This client uses fetch under the hood.
- In modern Node.js versions, fetch is available globally.
- For custom environments, pass a custom fetch implementation in `Configuration`.

