# ApiCommentaryBookChapter

Defines a schema that contains information about a book chapter in a commentary.

## Properties

| Name                       | Type                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| `chapter`                  | [ApiCommentaryBookChapterChapter](ApiCommentaryBookChapterChapter.md) |
| `commentary`               | [ApiCommentary](ApiCommentary.md)                                     |
| `book`                     | [ApiCommentaryBook](ApiCommentaryBook.md)                             |
| `thisChapterLink`          | string                                                                |
| `thisChapterReference`     | [CommentaryChapterReference](CommentaryChapterReference.md)           |
| `nextChapterApiLink`       | string                                                                |
| `nextChapterReference`     | [CommentaryChapterReference](CommentaryChapterReference.md)           |
| `previousChapterApiLink`   | string                                                                |
| `previousChapterReference` | [CommentaryChapterReference](CommentaryChapterReference.md)           |
| `numberOfVerses`           | number                                                                |

## Example

```typescript
import type { ApiCommentaryBookChapter } from '';

// TODO: Update the object below with actual values
const example = {
    chapter: null,
    commentary: null,
    book: null,
    thisChapterLink: null,
    thisChapterReference: null,
    nextChapterApiLink: null,
    nextChapterReference: null,
    previousChapterApiLink: null,
    previousChapterReference: null,
    numberOfVerses: null,
} satisfies ApiCommentaryBookChapter;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiCommentaryBookChapter;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
