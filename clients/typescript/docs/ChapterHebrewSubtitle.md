
# ChapterHebrewSubtitle

Defines the schema for a Hebrew Subtitle in a chapter.

## Properties

Name | Type
------------ | -------------
`type` | string
`content` | [Array&lt;ChapterHebrewSubtitleContentInner&gt;](ChapterHebrewSubtitleContentInner.md)

## Example

```typescript
import type { ChapterHebrewSubtitle } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "content": null,
} satisfies ChapterHebrewSubtitle

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChapterHebrewSubtitle
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


