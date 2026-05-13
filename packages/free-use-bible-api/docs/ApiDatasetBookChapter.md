
# ApiDatasetBookChapter

Defines a schema that contains information about a book chapter in a dataset.

## Properties

Name | Type
------------ | -------------
`chapter` | [DatasetChapterData](DatasetChapterData.md)
`dataset` | [ApiDataset](ApiDataset.md)
`book` | [ApiDatasetBook](ApiDatasetBook.md)
`thisChapterLink` | string
`nextChapterApiLink` | string
`previousChapterApiLink` | string
`numberOfVerses` | number
`numberOfReferences` | number

## Example

```typescript
import type { ApiDatasetBookChapter } from ''

// TODO: Update the object below with actual values
const example = {
  "chapter": null,
  "dataset": null,
  "book": null,
  "thisChapterLink": null,
  "nextChapterApiLink": null,
  "previousChapterApiLink": null,
  "numberOfVerses": null,
  "numberOfReferences": null,
} satisfies ApiDatasetBookChapter

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiDatasetBookChapter
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


