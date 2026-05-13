
# ApiCommentaryBook

Defines a schema that contains information about a commentary book.

## Properties

Name | Type
------------ | -------------
`id` | [BookId](BookId.md)
`name` | string
`commonName` | string
`introduction` | string
`introductionSummary` | string
`order` | number
`firstChapterNumber` | number
`firstChapterApiLink` | string
`lastChapterNumber` | number
`lastChapterApiLink` | string
`numberOfChapters` | number
`totalNumberOfVerses` | number

## Example

```typescript
import type { ApiCommentaryBook } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "commonName": null,
  "introduction": null,
  "introductionSummary": null,
  "order": null,
  "firstChapterNumber": null,
  "firstChapterApiLink": null,
  "lastChapterNumber": null,
  "lastChapterApiLink": null,
  "numberOfChapters": null,
  "totalNumberOfVerses": null,
} satisfies ApiCommentaryBook

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiCommentaryBook
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


