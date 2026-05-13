
# DatasetChapterData

Defines the schema for information about a chapter in a dataset.

## Properties

Name | Type
------------ | -------------
`number` | number
`content` | [Array&lt;DatasetChapterVerseContent&gt;](DatasetChapterVerseContent.md)

## Example

```typescript
import type { DatasetChapterData } from ''

// TODO: Update the object below with actual values
const example = {
  "number": null,
  "content": null,
} satisfies DatasetChapterData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DatasetChapterData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


