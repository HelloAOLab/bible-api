
# ApiTranslationComplete

Defines the complete translation download data. Maps to the /api/:translationId/complete.json endpoint.

## Properties

Name | Type
------------ | -------------
`translation` | [ApiTranslation](ApiTranslation.md)
`books` | [Array&lt;ApiTranslationCompleteBook&gt;](ApiTranslationCompleteBook.md)

## Example

```typescript
import type { ApiTranslationComplete } from ''

// TODO: Update the object below with actual values
const example = {
  "translation": null,
  "books": null,
} satisfies ApiTranslationComplete

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiTranslationComplete
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


