
# ChapterVerse

Defines the schema for a verse in a chapter.

## Properties

Name | Type
------------ | -------------
`type` | string
`number` | number
`content` | [Array&lt;ChapterVerseContentInner&gt;](ChapterVerseContentInner.md)

## Example

```typescript
import type { ChapterVerse } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "number": null,
  "content": null,
} satisfies ChapterVerse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChapterVerse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


