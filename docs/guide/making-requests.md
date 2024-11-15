# Making Requests

To access the API, all you need to do is make an HTTP GET Request to the right endpoint.

For example, to access the `available_translations.json` endpoint, you can use the following JavaScript:

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

Below, you can find a list of examples. For more complete documentation, see the [Reference Documentation](../reference/README.md).

## Examples

### Get the List of Available Translations

([reference](../reference/README.md#available-translations))

`GET https://bible.helloao.org/api/available_translations.json`

```ts:no-line-numbers
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

### List Books in a Translation

([reference](../reference/README.md#list-books-in-a-translation))

`GET https://bible.helloao.org/api/{translation}/books.json`

```ts:no-line-numbers
// Get the list of books for the BSB translation
fetch(`https://bible.helloao.org/api/BSB/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

### Get a Chapter from a Translation

([reference](../reference/README.md#get-a-chapter-from-a-translation))

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

```ts:no-line-numbers
// Get Genesis 1 from the BSB translation
fetch(`https://bible.helloao.org/api/BSB/Genesis/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

### Get the List of Available Commentaries

([reference](../reference/README.md#available-commentaries))

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

### List Books in a Commentary

([reference](../reference/README.md#list-books-in-a-commentary))

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Get the list of books for the adam-clarke commentary
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

### Get a Chapter from a Commentary

([reference](../reference/README.md#get-a-chapter-from-a-commentary))

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
