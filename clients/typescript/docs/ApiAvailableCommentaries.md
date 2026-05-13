
# ApiAvailableCommentaries

The list of available commentaries. Maps to the /api/available-commentaries.json endpoint.

## Properties

Name | Type
------------ | -------------
`commentaries` | [Array&lt;ApiCommentary&gt;](ApiCommentary.md)

## Example

```typescript
import type { ApiAvailableCommentaries } from ''

// TODO: Update the object below with actual values
const example = {
  "commentaries": null,
} satisfies ApiAvailableCommentaries

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiAvailableCommentaries
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


