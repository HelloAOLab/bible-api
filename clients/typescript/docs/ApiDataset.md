
# ApiDataset

Defines a dataset that is used in the API.

## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`website` | string
`licenseUrl` | string
`licenseNotes` | string
`englishName` | string
`language` | string
`textDirection` | string
`listOfBooksApiLink` | string
`availableFormats` | Array&lt;string&gt;
`numberOfBooks` | number
`totalNumberOfChapters` | number
`totalNumberOfVerses` | number
`totalNumberOfReferences` | number
`languageName` | string
`languageEnglishName` | string

## Example

```typescript
import type { ApiDataset } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "website": null,
  "licenseUrl": null,
  "licenseNotes": null,
  "englishName": null,
  "language": null,
  "textDirection": null,
  "listOfBooksApiLink": null,
  "availableFormats": null,
  "numberOfBooks": null,
  "totalNumberOfChapters": null,
  "totalNumberOfVerses": null,
  "totalNumberOfReferences": null,
  "languageName": null,
  "languageEnglishName": null,
} satisfies ApiDataset

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiDataset
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


