
# ApiCommentaryBookChapterChapter

The information for the chapter.

## Properties

Name | Type
------------ | -------------
`number` | number
`introduction` | string
`content` | [Array&lt;ChapterVerse&gt;](ChapterVerse.md)

## Example

```typescript
import type { ApiCommentaryBookChapterChapter } from ''

// TODO: Update the object below with actual values
const example = {
  "number": null,
  "introduction": null,
  "content": null,
} satisfies ApiCommentaryBookChapterChapter

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiCommentaryBookChapterChapter
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


