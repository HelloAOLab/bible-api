
# ApiTranslationBookChapterChapter

The information for the chapter.

## Properties

Name | Type
------------ | -------------
`number` | number
`content` | [Array&lt;ChapterContent&gt;](ChapterContent.md)
`footnotes` | [Array&lt;ChapterFootnote&gt;](ChapterFootnote.md)

## Example

```typescript
import type { ApiTranslationBookChapterChapter } from ''

// TODO: Update the object below with actual values
const example = {
  "number": null,
  "content": null,
  "footnotes": null,
} satisfies ApiTranslationBookChapterChapter

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiTranslationBookChapterChapter
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


