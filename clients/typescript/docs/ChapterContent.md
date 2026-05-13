
# ChapterContent

Defines a union type that represents a single piece of chapter content. A piece of chapter content can be one of the following things: A heading, a line break, a verse, or a Hebrew Subtitle.

## Properties

Name | Type
------------ | -------------
`type` | string
`content` | [Array&lt;ChapterHebrewSubtitleContentInner&gt;](ChapterHebrewSubtitleContentInner.md)
`number` | number

## Example

```typescript
import type { ChapterContent } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "content": null,
  "number": null,
} satisfies ChapterContent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChapterContent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


