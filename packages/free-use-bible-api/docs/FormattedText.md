
# FormattedText

Defines the schema for formatted text. That is, text that is formatted in a particular manner.

## Properties

Name | Type
------------ | -------------
`text` | string
`poem` | number
`wordsOfJesus` | boolean

## Example

```typescript
import type { FormattedText } from ''

// TODO: Update the object below with actual values
const example = {
  "text": null,
  "poem": null,
  "wordsOfJesus": null,
} satisfies FormattedText

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FormattedText
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


