# Free Use Bible API for React

<!-- #region docs -->

React components and state managers for reading the Bible with the [Free Use Bible API](https://bible.helloao.org/docs/). They are the reading core of [Seed Bible](https://seedbible.org), packaged so any React app can use them.

-   **`BibleReader`** — a ready-made reader: the chapter text (headings, poetry, footnotes, words of Jesus in red), verse highlights, previous/next buttons, and loading, error, and "book not found" states.
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

### Light and dark mode

The reader follows the device's light/dark setting. To force one, pass `theme`:

```tsx
<BibleReader readingState={readingState} theme={isDark ? 'dark' : 'light'} />
```

`theme` is `'system'` (the default), `'light'`, or `'dark'`. Without React, set `color-scheme` on the reader yourself: `.fuba-bible-reader { color-scheme: dark; }`.

Each color variable holds both modes, as `light-dark(<light>, <dark>)`. A plain color in your override is used in both modes; to set the two separately, use `light-dark()` too:

```css
.my-app {
    --fuba-accent-color: light-dark(rebeccapurple, plum);
}
```

`light-dark()` needs Chrome 123, Firefox 120, or Safari 17.5 or newer. Older browsers fall back to the browser's default colors.

### Rendering a chapter on its own

To render a chapter without the reader around it, use `ChapterContent`:

```tsx
<ChapterContent chapter={chapter} />
```

It takes the same `theme`, `highlights`, and `elements` (the `scriptureElements` settings) as the reader.

## Highlighting verses

Pass highlights to the reader and it draws them as rounded ribbons behind the text, the way Seed Bible does. Neighbouring verses with the same color join into one continuous ribbon, and the ribbons follow the shape of the text: ragged line ends, poetry indentation, and right-to-left translations. New highlights fade in and removed ones fade out.

```tsx
<BibleReader
    readingState={readingState}
    highlights={[
        { bookId: 'JHN', chapterNumber: 3, verse: 16, colorId: 'yellow' },
        { bookId: 'JHN', chapterNumber: 3, verse: [17, 18], colorId: 'green' },
        {
            bookId: 'JHN',
            chapterNumber: 3,
            verse: 21,
            colorId: 'custom',
            customColor: '#d8b4fe',
            customFontColor: '#3b0764',
        },
    ]}
/>
```

Pass every highlight you have; the reader shows the ones for the chapter on screen. Add `translationId` to limit a highlight to one translation. Storing highlights is up to your app. For example, to highlight the verses the reader has selected:

```tsx
const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
const selectedVerses = useSignalValue(readingState.selectedVerses);

const highlightSelection = (colorId: string) => {
    setHighlights([
        ...highlights,
        ...selectedVerses.map((selected) => ({
            bookId: selected.bookId,
            chapterNumber: selected.chapterNumber,
            verse: selected.verse.number,
            colorId,
        })),
    ]);
    readingState.clearSelectedVerses();
};
```

The preset colors are `yellow`, `green`, `cyan`, `blue`, `red`, `magenta`, `pink`, `purple`, `orange`, `cream`, `gray`, and `tan`, with separate light and dark mode values. Each is a set of CSS variables you can override, and you can add your own color IDs the same way:

```css
:root {
    --fuba-highlight-mint-color: #b9f6ca; /* the ribbon */
    --fuba-highlight-mint-font-color: #1b4332; /* text on top of it */
    --fuba-highlight-mint-words-of-jesus-font-color: #c62828;
}
.fuba-highlight-mint {
    color: var(--fuba-highlight-mint-font-color);
}
```

Turn highlights off with `scriptureElements={{ showHighlights: false }}`.

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
