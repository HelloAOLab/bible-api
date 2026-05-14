# ApiTranslationBookChapter

Defines an interface that contains information about a book chapter in a translation.

## Properties

| Name                        | Type                                                                    |
| --------------------------- | ----------------------------------------------------------------------- |
| `chapter`                   | [ApiTranslationBookChapterChapter](ApiTranslationBookChapterChapter.md) |
| `thisChapterAudioLinks`     | { [key: string]: string; }                                              |
| `translation`               | [ApiTranslation](ApiTranslation.md)                                     |
| `book`                      | [ApiTranslationBook](ApiTranslationBook.md)                             |
| `thisChapterLink`           | string                                                                  |
| `thisChapterReference`      | [TranslationChapterReference](TranslationChapterReference.md)           |
| `nextChapterApiLink`        | string                                                                  |
| `nextChapterReference`      | [TranslationChapterReference](TranslationChapterReference.md)           |
| `nextChapterAudioLinks`     | { [key: string]: string; }                                              |
| `previousChapterApiLink`    | string                                                                  |
| `previousChapterReference`  | [TranslationChapterReference](TranslationChapterReference.md)           |
| `previousChapterAudioLinks` | { [key: string]: string; }                                              |
| `numberOfVerses`            | number                                                                  |

## Example

```typescript
import type { ApiTranslationBookChapter } from '';

// TODO: Update the object below with actual values
const example = {
    chapter: null,
    thisChapterAudioLinks: null,
    translation: null,
    book: null,
    thisChapterLink: null,
    thisChapterReference: null,
    nextChapterApiLink: null,
    nextChapterReference: null,
    nextChapterAudioLinks: null,
    previousChapterApiLink: null,
    previousChapterReference: null,
    previousChapterAudioLinks: null,
    numberOfVerses: null,
} satisfies ApiTranslationBookChapter;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiTranslationBookChapter;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
