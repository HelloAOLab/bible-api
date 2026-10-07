---
description: 'How to make requests to the Free Use Bible API: fetch translations, books, chapters, commentaries, and datasets over plain HTTP GET.'
---

# Making Requests

To access the API, all you need to do is make an HTTP GET Request to the right endpoint.

For example, to access the `available_translations.json` endpoint, you can use the following JavaScript or cURL command:

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

Below, you can find a list of examples. For more complete documentation, see the [Reference Documentation](../reference/README.md).

## Examples

### Get the List of Available Translations

([reference](../reference/translations/README.md#available-translations))

`GET https://bible.helloao.org/api/available_translations.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### List Books in a Translation

([reference](../reference/translations/README.md#list-books-in-a-translation))

`GET https://bible.helloao.org/api/{translation}/books.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Get the list of books for the BSB translation
fetch(`https://bible.helloao.org/api/BSB/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### Get a Chapter from a Translation

([reference](../reference/translations/standard.md#get-a-chapter-from-a-translation))

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Get Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/BSB/GEN/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### Get a Simplified Chapter from a Translation

([reference](../reference/translations/simplified.md#get-a-simplified-chapter-from-a-translation))

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Use this when you just want the text of a chapter. Each verse contains a single `text` string instead of a list of formatted content, so you don't have to build the text yourself.

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers
// Get the text of Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/BSB/GEN/1.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### Get the List of Available Commentaries

([reference](../reference/commentaries/README.md#available-commentaries))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_commentaries.json
```

:::

### List Books in a Commentary

([reference](../reference/commentaries/README.md#list-books-in-a-commentary))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Get the list of books for the adam-clarke commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/books.json
```

:::

### Get a Chapter from a Commentary

([reference](../reference/commentaries/README.md#get-a-chapter-from-a-commentary))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Get Genesis 1 from the adam-clarke commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (adam-clarke):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/GEN/1.json
```

:::

### List Profiles in a Commentary

([reference](../reference/commentaries/README.md#list-profiles-in-a-commentary))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Get the list of profiles for the tyndale commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles.json`)
    .then(request => request.json())
    .then(profiles => {
        console.log('The tyndale commentary has the following profiles:', profiles);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles.json
```

:::

### Get a Profile in a Commentary

([reference](../reference/commentaries/README.md#get-a-profile-in-a-commentary))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Get the aaron profile from the tyndale commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles/${profile}.json`)
    .then(request => request.json())
    .then(profile => {
        console.log('The Aaron tyndale commentary profile:', profile);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles/aaron.json
```

:::

### Get the list of Available Datasets

([reference](../reference/datasets/README.md#available-datasets))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### Get the list of books in a dataset

([reference](../reference/datasets/README.md#list-books-in-a-dataset))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Get the list of books for the open-cross-ref dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### Get a Chapter from a Dataset

([reference](../reference/datasets/README.md#get-a-chapter-from-a-dataset))

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Get Genesis 1 from the open-cross-ref dataset
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::
