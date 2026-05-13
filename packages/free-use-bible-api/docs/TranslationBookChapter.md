
# TranslationBookChapter

Defines the schema for information about a book chapter.

## Properties

Name | Type
------------ | -------------
`chapter` | [ApiTranslationBookChapterChapter](ApiTranslationBookChapterChapter.md)
`thisChapterAudioLinks` | { [key: string]: string; }

## Example

```typescript
import type { TranslationBookChapter } from ''

// TODO: Update the object below with actual values
const example = {
  "chapter": null,
  "thisChapterAudioLinks": null,
} satisfies TranslationBookChapter

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TranslationBookChapter
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


