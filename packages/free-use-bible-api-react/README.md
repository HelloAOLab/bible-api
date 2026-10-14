# Free Use Bible API for React

<!-- #region docs -->

React components and state managers for reading the Bible with the [Free Use Bible API](https://bible.helloao.org/docs/). They are the reading core of [Seed Bible](https://seedbible.org), packaged so any React app can use them.

-   **`BibleReader`** — a ready-made reader: the chapter text (headings, poetry, footnotes, words of Jesus in red), previous/next buttons, and loading, error, and "book not found" states.
-   **`BibleReadingState`** — where the reader is and how to move them: select a translation, book, or chapter; go to the next or previous chapter (crossing book boundaries); select verses; decorate verses.
-   **`BibleDataManager`** — loads and caches translations, book lists, and chapters, from the public API or your own endpoint.

## Installation

```bash
npm install free-use-bible-api-react
```

React 18 or 19 is required.

## Quick Start

```tsx
import {
    BibleReader,
    useBibleDataManager,
    useBibleReadingState,
} from 'free-use-bible-api-react';
import 'free-use-bible-api-react/styles.css';

export function App() {
    const dataManager = useBibleDataManager();
    const readingState = useBibleReadingState(dataManager, {
        initialTranslationId: 'BSB',
        initialBookId: 'JHN',
        initialChapterNumber: 3,
        scrollToVerse: 16,
    });

    return <BibleReader readingState={readingState} />;
}
```

## Moving the reader

Every navigation method moves the reader immediately and returns a promise that resolves once the new chapter's text has loaded. A slow response for a chapter the reader has already moved past is never shown.

```ts
await readingState.loadNextChapter(); // John 3 → John 4
await readingState.loadPreviousChapter();
await readingState.selectBook('ROM'); // Romans 1
await readingState.selectChapter('ROM', 8);
await readingState.selectTranslation('AAB'); // first chapter of the AAB
await readingState.selectTranslationAndChapter('BSB', 'PSA', 23, {
    scrollToVerse: 4,
});
```

## Reading state in your own components

The reading state is made of [signals](https://github.com/preactjs/signals): values that notify their readers when they change. Read one in a component with `useSignalValue`, and the component re-renders when it changes.

```tsx
import {
    useSignalValue,
    type BibleReadingState,
} from 'free-use-bible-api-react';

function ChapterPicker({ readingState }: { readingState: BibleReadingState }) {
    const books = useSignalValue(readingState.translationBooks);
    const bookId = useSignalValue(readingState.bookId);
    const chapterNumber = useSignalValue(readingState.chapterNumber);
    const book = books?.books.find((b) => b.id === bookId);
    if (!book) {
        return null;
    }

    return (
        <select
            value={chapterNumber}
            onChange={(e) =>
                readingState.selectChapter(book.id, Number(e.target.value))
            }
        >
            {Array.from({ length: book.numberOfChapters }, (_, i) => (
                <option key={i} value={book.firstChapterNumber + i}>
                    {book.firstChapterNumber + i}
                </option>
            ))}
        </select>
    );
}
```

Useful signals include `title` ("John 3"), `chapterData`, `translationBooks`, `availableTranslations`, `selectedVerses`, `loading`, `error`, `hasNext`, and `hasPrevious`.

## Customizing the reader

```tsx
<BibleReader
    readingState={readingState}
    scriptureElements={{ showVerseNumbers: false, showRedLettering: false }}
    labels={{ nextChapter: 'Siguiente capítulo' }}
    selectableVerses={false}
    headerActions={<ChapterPicker readingState={readingState} />}
/>
```

The stylesheet uses `--fuba-*` CSS variables for every color and font, so you can restyle the reader without overriding its rules:

```css
.fuba-bible-reader {
    --fuba-verse-font-family: 'Literata', serif;
    --fuba-accent-color: rebeccapurple;
}
```

To render a chapter without the reader around it, use `ChapterContent`:

```tsx
<ChapterContent chapter={chapter} />
```

## Decorating verses

Decorations add a class or style to whole verses, or to a phrase inside a verse. They are cleared when the reader changes chapter unless you pass `preserveOnChapterChange`.

```ts
const id = readingState.decorateVerses('JHN', 3, [16, 17], {
    className: 'my-highlight',
});
readingState.decorateVerses('JHN', 3, 16, {
    targetContent: 'loved the world',
    style: { fontWeight: 'bold' },
});
readingState.removeDecoration(id);
```

`emphasizeVerses(readingState, 'JHN', 3, 16, 17)` briefly highlights verses, fading after three seconds.

## Using your own endpoint

Pass a `FreeUseBibleApi` to read from a self-hosted copy of the API:

```ts
import { FreeUseBibleApi } from 'free-use-bible-api';

const dataManager = useBibleDataManager(
    new FreeUseBibleApi({ endpoint: 'https://bible.example.com/' })
);
```

A reading state can also open a translation from another endpoint by its `books.json` URL, for example `https://bible.example.com/api/MYT/books.json`. `dataManager.buildTranslationId(id)` returns that form for any translation the manager has seen.

## Without React

The managers do not depend on React. Use `createBibleDataManager` and `createBibleReadingState` directly, and watch their signals with `effect` from `@preact/signals-core`. Call `readingState.dispose()` when you are done with it.

<!-- #endregion docs -->

## License

MIT
