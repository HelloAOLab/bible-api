
# ApiAvailableDatasets

The list of available datasets. Maps to the /api/available-datasets.json endpoint.

## Properties

Name | Type
------------ | -------------
`datasets` | [Array&lt;ApiDataset&gt;](ApiDataset.md)

## Example

```typescript
import type { ApiAvailableDatasets } from ''

// TODO: Update the object below with actual values
const example = {
  "datasets": null,
} satisfies ApiAvailableDatasets

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiAvailableDatasets
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


