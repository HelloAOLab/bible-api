
# ApiDatasetBooks

Defines an interface that contains information about the books that are available for a dataset.

## Properties

Name | Type
------------ | -------------
`dataset` | [ApiDataset](ApiDataset.md)
`books` | [Array&lt;ApiDatasetBook&gt;](ApiDatasetBook.md)

## Example

```typescript
import type { ApiDatasetBooks } from ''

// TODO: Update the object below with actual values
const example = {
  "dataset": null,
  "books": null,
} satisfies ApiDatasetBooks

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiDatasetBooks
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


