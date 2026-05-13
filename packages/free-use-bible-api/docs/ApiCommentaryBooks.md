
# ApiCommentaryBooks

Defines an interface that contains information about the books that are available for a commentary.

## Properties

Name | Type
------------ | -------------
`commentary` | [ApiCommentary](ApiCommentary.md)
`books` | [Array&lt;ApiCommentaryBook&gt;](ApiCommentaryBook.md)

## Example

```typescript
import type { ApiCommentaryBooks } from ''

// TODO: Update the object below with actual values
const example = {
  "commentary": null,
  "books": null,
} satisfies ApiCommentaryBooks

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiCommentaryBooks
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


