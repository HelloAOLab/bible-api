
# ApiTranslationBook

Defines a schema that contains information about a translation book.

## Properties

Name | Type
------------ | -------------
`id` | [BookId](BookId.md)
`name` | string
`commonName` | string
`title` | string
`order` | number
`isApocryphal` | boolean
`firstChapterNumber` | number
`firstChapterApiLink` | string
`lastChapterNumber` | number
`lastChapterApiLink` | string
`numberOfChapters` | number
`totalNumberOfVerses` | number

## Example

```typescript
import type { ApiTranslationBook } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "commonName": null,
  "title": null,
  "order": null,
  "isApocryphal": null,
  "firstChapterNumber": null,
  "firstChapterApiLink": null,
  "lastChapterNumber": null,
  "lastChapterApiLink": null,
  "numberOfChapters": null,
  "totalNumberOfVerses": null,
} satisfies ApiTranslationBook

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiTranslationBook
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


