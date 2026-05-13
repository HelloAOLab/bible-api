
# DatasetChapterVerseContent

Defines the schema for information about a verse in a dataset chapter.

## Properties

Name | Type
------------ | -------------
`verse` | number
`references` | [Array&lt;ScoredVerseRef&gt;](ScoredVerseRef.md)

## Example

```typescript
import type { DatasetChapterVerseContent } from ''

// TODO: Update the object below with actual values
const example = {
  "verse": null,
  "references": null,
} satisfies DatasetChapterVerseContent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DatasetChapterVerseContent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


