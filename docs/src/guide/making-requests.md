# Making Requests

To access the API, all you need to do is make an HTTP GET Request to the right endpoint.

For example, to access the `available_translations.json` endpoint, you can use the following JavaScript:

```javascript
fetch(`https://bible-api.pages.dev/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

Below, you can find a list of examples. For more complete documentation, see the [Reference Documentation](../reference/README.md).

## Examples

### Get the List of Available Translations

`GET https://bible-api.pages.dev/api/available_translations.json`

```javascript
fetch(`https://bible-api.pages.dev/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

### List Books in a Translation

`GET https://bible-api.pages.dev/api/{translation}/books.json`

```javascript
// Get the list of books for the BSB translation
fetch(`https://bible-api.pages.dev/api/BSB/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

### Get a Chapter from a Translation

`GET https://bible-api.pages.dev/api/{translation}/{book}/{chapter}.json`

```javascript
// Get Genesis 1 from the BSB translation
fetch(`https://bible-api.pages.dev/api/BSB/Genesis/1.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```