# ApiDatasetBook

Defines a schema that contains information about a book in a dataset.

## Properties

| Name                      | Type                                                  |
| ------------------------- | ----------------------------------------------------- |
| `id`                      | [BookId](BookId.md)                                   |
| `order`                   | number                                                |
| `firstChapterNumber`      | number                                                |
| `firstChapterApiLink`     | string                                                |
| `firstChapterReference`   | [DatasetChapterReference](DatasetChapterReference.md) |
| `lastChapterNumber`       | number                                                |
| `lastChapterApiLink`      | string                                                |
| `lastChapterReference`    | [DatasetChapterReference](DatasetChapterReference.md) |
| `numberOfChapters`        | number                                                |
| `totalNumberOfVerses`     | number                                                |
| `totalNumberOfReferences` | number                                                |

## Example

```typescript
import type { ApiDatasetBook } from '';

// TODO: Update the object below with actual values
const example = {
    id: null,
    order: null,
    firstChapterNumber: null,
    firstChapterApiLink: null,
    firstChapterReference: null,
    lastChapterNumber: null,
    lastChapterApiLink: null,
    lastChapterReference: null,
    numberOfChapters: null,
    totalNumberOfVerses: null,
    totalNumberOfReferences: null,
} satisfies ApiDatasetBook;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiDatasetBook;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
