
# ApiTranslationCompleteBook

A book in the complete translation download.

## Properties

Name | Type
------------ | -------------
`id` | [BookId](BookId.md)
`name` | string
`commonName` | string
`title` | string
`order` | number
`isApocryphal` | boolean
`numberOfChapters` | number
`totalNumberOfVerses` | number
`chapters` | [Array&lt;TranslationBookChapter&gt;](TranslationBookChapter.md)

## Example

```typescript
import type { ApiTranslationCompleteBook } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "commonName": null,
  "title": null,
  "order": null,
  "isApocryphal": null,
  "numberOfChapters": null,
  "totalNumberOfVerses": null,
  "chapters": null,
} satisfies ApiTranslationCompleteBook

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiTranslationCompleteBook
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


