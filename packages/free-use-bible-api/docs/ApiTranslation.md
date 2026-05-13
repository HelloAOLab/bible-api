
# ApiTranslation

Defines a translation that is used in the API.

## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`website` | string
`licenseUrl` | string
`licenseNotes` | string
`licenseNotice` | string
`shortName` | string
`englishName` | string
`language` | string
`textDirection` | string
`listOfBooksApiLink` | string
`availableFormats` | Array&lt;string&gt;
`numberOfBooks` | number
`totalNumberOfChapters` | number
`totalNumberOfVerses` | number
`numberOfApocryphalBooks` | number
`totalNumberOfApocryphalChapters` | number
`totalNumberOfApocryphalVerses` | number
`languageName` | string
`languageEnglishName` | string
`completeTranslationApiLink` | string

## Example

```typescript
import type { ApiTranslation } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "website": null,
  "licenseUrl": null,
  "licenseNotes": null,
  "licenseNotice": null,
  "shortName": null,
  "englishName": null,
  "language": null,
  "textDirection": null,
  "listOfBooksApiLink": null,
  "availableFormats": null,
  "numberOfBooks": null,
  "totalNumberOfChapters": null,
  "totalNumberOfVerses": null,
  "numberOfApocryphalBooks": null,
  "totalNumberOfApocryphalChapters": null,
  "totalNumberOfApocryphalVerses": null,
  "languageName": null,
  "languageEnglishName": null,
  "completeTranslationApiLink": null,
} satisfies ApiTranslation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiTranslation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


