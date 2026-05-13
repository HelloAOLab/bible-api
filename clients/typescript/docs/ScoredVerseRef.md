
# ScoredVerseRef

Defines the schema for information about a verse reference that has an arbitrary score attached to it.

## Properties

Name | Type
------------ | -------------
`book` | [BookId](BookId.md)
`chapter` | number
`verse` | number
`content` | string
`endChapter` | number
`endVerse` | number
`score` | number

## Example

```typescript
import type { ScoredVerseRef } from ''

// TODO: Update the object below with actual values
const example = {
  "book": null,
  "chapter": null,
  "verse": null,
  "content": null,
  "endChapter": null,
  "endVerse": null,
  "score": null,
} satisfies ScoredVerseRef

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScoredVerseRef
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


