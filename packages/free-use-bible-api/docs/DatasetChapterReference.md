# DatasetChapterReference

Defines a reference to a chapter in a dataset.

## Properties

| Name        | Type                |
| ----------- | ------------------- |
| `datasetId` | string              |
| `book`      | [BookId](BookId.md) |
| `chapter`   | number              |

## Example

```typescript
import type { DatasetChapterReference } from '';

// TODO: Update the object below with actual values
const example = {
    datasetId: null,
    book: null,
    chapter: null,
} satisfies DatasetChapterReference;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DatasetChapterReference;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
