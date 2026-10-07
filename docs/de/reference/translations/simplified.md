# Vereinfachtes Format

Das vereinfachte Format für Kapitel, vollständige Übersetzungen zum Download und Anmerkungen auf Wortebene. Die entsprechenden Endpunkte für Übersetzungen und Buchlisten finden Sie unter [„Übersetzungen, Bücher & Kapitel“](./README.md) . [Das Standardformat](./standard.md) für die ursprüngliche, strukturierte Darstellung desselben Inhalts wird ebenfalls angezeigt.

## Holen Sie sich ein vereinfachtes Kapitel aus einer Übersetzung

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Ruft den Inhalt eines einzelnen Kapitels eines gegebenen Buches und einer gegebenen Übersetzung im vereinfachten Format ab.

Im vereinfachten Format besteht der Inhalt jedes Verses aus einer einzigen Zeichenkette anstatt aus einer Liste formatierter Inhalte. Dadurch entfällt das manuelle Erstellen des Verstextes, was – insbesondere im Hinblick auf die korrekte Formatierung – mitunter knifflig sein kann. Alles, was sich nicht durch eine einfache Zeichenkette darstellen lässt – Fußnoten, die Worte Jesu, Gedichte und Überschriften innerhalb eines Verses – wird als Offset in diese Zeichenkette eingefügt, sodass nichts verloren geht.

Verwenden Sie diesen Endpunkt, wenn Sie den Text eines Kapitels benötigen. Verwenden Sie [den regulären Kapitel-Endpunkt,](./standard.md#get-a-chapter-from-a-translation) wenn Sie das Kapitel in seiner ursprünglichen Formatierung anzeigen möchten.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis – eine Liste der Buch-IDs finden Sie [hier](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` steht für das numerische Kapitel (z. B. `1` für das erste Kapitel).

Kapitel, die Anmerkungen auf Wortebene enthalten, sind mit `thisChapterWordsLink` verlinkt, was auf [die vereinfachten Anmerkungen](#get-the-words-of-a-chapter-in-the-simplified-format) verweist – diejenigen, deren Offsets mit dem Text in dieser Datei übereinstimmen.

Kapitel, die über Audio-Timings pro Leser verfügen, sind mit `thisChapterAudioTimings` verlinkt, was auf [den Endpunkt für die Audio-Timings](./standard.md#get-the-audio-timings-for-a-chapter) verweist – dieselbe Datei, auf die auch der reguläre Kapitel-Endpunkt verweist, da die Timings nicht vom Kapitelformat abhängen.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Den Text von Genesis 1 finden Sie in der BSB-Übersetzung.
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### Versätze

Alle Offsets im vereinfachten Format – `offset` , `start` und `end` – sind Indizes für die `text` des Verses, in dem sie enthalten sind. Sie werden in UTF-16-Codeeinheiten gemessen, die auch von JavaScripts `String.prototype.length` und `String.prototype.slice()` verwendet werden.

`start` bedeutet inklusive, `end` exklusiv; `text.slice(start, end)` gibt also exakt den markierten Textbereich zurück. Fußnoten-Offsets geben die Position des aufrufenden Textabschnitts an; `text.slice(0, offset)` bezeichnet den vorhergehenden Text.

### Struktur

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * Die Übersetzungsinformationen für das Buchkapitel.
     */
    translation: Translation;

    /**
     * Die Buchinformationen für das Buchkapitel.
     */
    book: TranslationBook;

    /**
     * Der Link zum aktuellen Kapitel.
     */
    thisChapterLink: string;

    /**
     * Hier finden Sie den Link zur regulären (nicht vereinfachten) Version dieses Kapitels.
     */
    fullChapterApiLink: string;

    /**
     * Die Links zu verschiedenen Audioversionen des Kapitels.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die Links zu den Audio-Zeitangaben für die verschiedenen Audioversionen des Kapitels.
     * Siehe „Audio-Timings für ein Kapitel abrufen“ in der Dokumentation zum Standardformat – die Timing-Datei ist unabhängig davon, welches Kapitelformat damit verknüpft ist, immer gleich.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Der Link zum nächsten Kapitel in vereinfachter Form.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterApiLink: string | null;

    /**
     * Die Links zu verschiedenen Audioversionen für das nächste Kapitel.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Die Links zu den Audio-Zeitangaben für verschiedene Audioversionen für das nächste Kapitel.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Der Link zum vorherigen Kapitel in vereinfachter Form.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterApiLink: string | null;

    /**
     * Die Links zu verschiedenen Audioversionen des vorherigen Kapitels.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Die Links zu den Audio-Zeitangaben für verschiedene Audioversionen des vorherigen Kapitels.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Die Anzahl der Verse, die das Kapitel enthält.
     */
    numberOfVerses: number;

    /**
     * Die Informationen für das Kapitel.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Die Kapitelnummer.
     */
    number: number;

    /**
     * Der Inhalt des Kapitels.
     */
    content: SimpleChapterContent[];

    /**
     * Die Liste der Fußnoten, die keinem Vers zugeordnet werden konnten.
     * Fußnoten, die zu einem Vers gehören, sind im Vers selbst aufgeführt, daher ist diese Liste normalerweise leer.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Ein Union-Typ, der einen einzelnen Inhaltsabschnitt in einem vereinfachten Kapitel repräsentiert.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Eine Überschrift in einem Kapitel.
 */
interface SimpleChapterHeading {
    /**
     * Kennzeichnet einen Inhalt, der eine Überschrift darstellt.
     */
    type: 'heading';

    /**
     * Der Text der Überschrift.
     */
    text: string;
}

/**
 * Ein Zeilenumbruch in einem Kapitel.
 */
interface ChapterLineBreak {
    /**
     * Zeigt an, dass der Inhalt einen Zeilenumbruch darstellt.
     */
    type: 'line_break';
}

/**
 * Ein Vers in einem Kapitel.
 */
interface SimpleChapterVerse {
    /**
     * Zeigt an, dass es sich bei dem Inhalt um einen Vers handelt.
     */
    type: 'verse';

    /**
     * Die Versnummer.
     */
    number: number;

    /**
     * Der Text des Verses.
     * Gedichtzeilen und Zeilenumbrüche werden durch Zeilenumbruchzeichen (\n) getrennt.
     */
    text: string;

    /**
     * Die Fußnoten, die im Vers vorkommen.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Die Überschriften, die in der Mitte des Verses vorkommen.
     * Wird weggelassen, wenn der Vers keine Zwischenüberschriften enthält.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Die Textabschnitte des Verses, die die Worte Jesu darstellen.
     * Wird weggelassen, falls der Vers keinen enthält.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Die Bereiche des Verstextes, die die Zeilen des Gedichts darstellen.
     * Wird weggelassen, falls der Vers keinen enthält.
     */
    poem?: SimplePoemRange[];
}

/**
 * Ein hebräischer Untertitel in einem Kapitel.
 * Diese werden häufig als informativer Inhalt aufgeführt, der bereits in den Originalmanuskripten enthalten war.
 * Psalm 49 trägt beispielsweise den hebräischen Untertitel „Dem Chorleiter. Ein Psalm der Söhne Korachs.“
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Kennzeichnet einen hebräischen Untertitel.
     */
    type: 'hebrew_subtitle';
}

/**
 * Eine Fußnote in einem Vers.
 */
interface SimpleVerseFootnote {
    /**
     * Die ID der Notiz.
     */
    noteId: number;

    /**
     * Die Stelle im Verstext, an der der Fußnotenaufruf eingefügt werden soll.
     */
    offset: number;

    /**
     * Der Text der Fußnote.
     */
    text: string;

    /**
     * Der Aufrufer, der für die Fußnote verwendet werden soll.
     * Bei einem "+" sollte der Aufrufer automatisch generiert werden.
     * Wenn null, dann sollte der Aufrufer leer sein.
     * Wenn es sich um eine Zeichenkette handelt, dann sollte der Aufrufer diese Zeichenkette sein.
     */
    caller: '+' | string | null;
}

/**
 * Eine Überschrift, die in einen Vers eingebettet ist.
 */
interface SimpleInlineHeading {
    /**
     * Die Indexstelle im Verstext, an der die Überschrift vorkommt.
     */
    offset: number;

    /**
     * Der Text der Überschrift.
     */
    text: string;
}

/**
 * Ein Textabschnitt innerhalb eines Verses.
 */
interface SimpleTextRange {
    /**
     * Der Index des ersten Zeichens des Bereichs.
     */
    start: number;

    /**
     * Der Index nach dem letzten Zeichen des Bereichs.
     */
    end: number;
}

/**
 * Ein Textabschnitt innerhalb eines Verses, der eine Gedichtzeile darstellt.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Der Einrückungsgrad, mit dem die Gedichtzeile angezeigt werden soll.
     */
    level: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/BSB/GEN/1.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 31086,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "GEN",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.simple.json",
    "fullChapterApiLink": "/api/BSB/GEN/1.json",
    "thisChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 1
    },
    "thisChapterAudioLinks": {
        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
    },
    "thisChapterAudioTimings": {
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json",
        "david": "/api/BSB/GEN/1.david.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.simple.json",
    "nextChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 2
    },
    "nextChapterAudioTimings": {
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json",
        "david": "/api/BSB/GEN/2.david.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterReference": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "text": "The Creation"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "text": "In the beginning God created the heavens and the earth.",
                "footnotes": []
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "text": "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "footnotes": []
            },
            {
                "type": "heading",
                "text": "The First Day"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "text": "And God said, “Let there be light,” and there was light.",
                "footnotes": [
                    {
                        "noteId": 0,
                        "offset": 35,
                        "text": "Cited in 2 Corinthians 4:6",
                        "caller": "+"
                    }
                ]
            }
        ],
        "footnotes": []
    }
}
```

Poesie und die Worte Jesu werden als Bereiche über dem Verstext dargestellt. Zum Beispiel sieht `Matthew 5:3` in der Übersetzung `engwebp` so aus:

```json:no-line-numbers title="/api/engwebp/MAT/5.simple.json"
{
    "type": "verse",
    "number": 3,
    "text": "“Blessed are the poor in spirit,\nfor theirs is the Kingdom of Heaven.",
    "footnotes": [],
    "wordsOfJesus": [
        {
            "start": 0,
            "end": 69
        }
    ],
    "poem": [
        {
            "start": 0,
            "end": 32,
            "level": 1
        },
        {
            "start": 33,
            "end": 69,
            "level": 2
        }
    ]
}
```

## Den Wortlaut eines Kapitels im vereinfachten Format abrufen

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Ruft die Wort-Ebenen-Anmerkungen für ein einzelnes Kapitel ab, wobei deren Offsets auf den Text jedes [vereinfachten Verses](#get-a-simplified-chapter-from-a-translation) neu abgebildet werden.

Die Offsets in [den regulären Annotationen](./standard.md#get-the-words-of-a-chapter) sind an Elemente des `content` Arrays eines Verses gebunden, welches im vereinfachten Format durch eine einzelne Zeichenkette ersetzt wird – daher können sie dort nicht verwendet werden. Verwenden Sie stattdessen diese Datei, wenn Sie mit den vereinfachten Kapiteln arbeiten.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis – eine Liste der Buch-IDs finden Sie [hier](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` steht für das numerische Kapitel (z. B. `1` für das erste Kapitel).

Diese Einträge haben keine `contentIndex` `start` und `end` sind Versetzungen in die `text` des Verses, genau wie die Fußnoten, Gedichte und Worte Jesu Versetzungen in den vereinfachten Kapiteln, also ist `text.slice(start, end)` das annotierte Wort.

Wie bei den regulären Anmerkungen enthalten auch diese nur einige Übersetzungen. Ein vereinfachtes Kapitel, das Anmerkungen enthält, verweist mit `thisChapterWordsLink` auf diese Datei; fehlt diese Eigenschaft, existiert die Datei für das Kapitel nicht.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Besorgen Sie sich den Text von Genesis 1 und die darin enthaltenen Anmerkungen.
Promise.all([
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`).then(r => r.json()),
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.simple.json`).then(r => r.json()),
]).then(([chapter, words]) => {
    for (let content of chapter.chapter.content) {
        if (content.type !== 'verse') {
            continue;
        }
        for (let word of words.verses[content.number] ?? []) {
            console.log(content.text.slice(word.start, word.end), word.strongs);
        }
    }
});
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
curl https://bible.helloao.org/api/BSB/GEN/1.words.simple.json
```

:::

### Struktur

Die Struktur entspricht [den regulären Annotationen](./standard.md#get-the-words-of-a-chapter) , mit der Ausnahme, dass die Links auf die vereinfachten Dateien verweisen und die Einträge keine `contentIndex` enthalten.

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * Die ID der Übersetzung.
     */
    translationId: string;

    /**
     * Die ID des Buches.
     */
    bookId: string;

    /**
     * Die Kapitelnummer.
     */
    chapterNumber: number;

    /**
     * Der Link zum vereinfachten Kapitel, auf das sich diese Anmerkungen beziehen.
     */
    thisChapterLink: string;

    /**
     * Der Link zum nächsten vereinfachten Kapitel.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterLink: string | null;

    /**
     * Der Link zum vorherigen vereinfachten Kapitel.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterLink: string | null;

    /**
     * Der Link zu diesen Anmerkungen.
     */
    thisChapterWordsLink: string;

    /**
     * Der Link zu den Anmerkungen für das nächste Kapitel.
     * Null, falls dies das letzte Kapitel der Übersetzung ist oder falls das nächste Kapitel keine Wort-Ebenen-Anmerkungen enthält.
     */
    nextChapterWordsLink: string | null;

    /**
     * Der Link zu den Anmerkungen des vorherigen Kapitels.
     * Null, falls dies das erste Kapitel der Übersetzung ist oder falls das vorherige Kapitel keine Wort-Ebenen-Anmerkungen enthält.
     */
    previousChapterWordsLink: string | null;

    /**
     * Die kommentierten Wörter für jeden Vers im Kapitel, geordnet nach Versnummer.
     * Die Listen sind in der Reihenfolge angeordnet, in der die Wörter im Vers vorkommen.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Eine Wort-Ebene-Annotation in einem vereinfachten Kapitel.
 */
export interface SimpleChapterWord {
    /**
     * Der Index des ersten Zeichens des annotierten Wortes im Verstext.
     */
    start: number;

    /**
     * Der Index nach dem letzten Zeichen des annotierten Wortes im Verstext.
     */
    end: number;

    /**
     * Die Strong-Zahlen für das Wort.
     */
    strongs?: string[];

    /**
     * Das Lemma (die Wörterbuchform) des Wortes in der Ausgangssprache.
     */
    lemma?: string;

    /**
     * Die Morphologie des Wortes in der Ausgangssprache.
     */
    morph?: string;

    /**
     * Die Position des Wortes im Ausgangstext.
     */
    srcloc?: string;

    /**
     * Um welches Vorkommen des Wortes im Vers handelt es sich?
     */
    occurrence?: number;

    /**
     * Die Anzahl der Vorkommen des Wortes im Vers.
     */
    occurrences?: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/engwebp/JHN/1.words.simple.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.simple.json",
    "nextChapterLink": "/api/engwebp/JHN/2.simple.json",
    "previousChapterLink": "/api/engwebp/MAT/28.simple.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.simple.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.simple.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.simple.json",
    "verses": {
        "1": [
            {
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

Vers 1 dieses Kapitels hat den Text `"In the beginning was the Word, and the Word was with God, and the Word was God."` , also ist `text.slice(7, 16)` `"beginning"` .

## Erhalten Sie eine vollständige Übersetzung im vereinfachten Format

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Ruft den Inhalt einer vollständigen Übersetzung im vereinfachten Format ab. Dies ist das [vereinfachte Kapitelformat,](#get-a-simplified-chapter-from-a-translation) das auf [den vollständigen Übersetzungsdownload](./standard.md#get-an-entire-translation) angewendet wird: eine Datei, die die gesamte Übersetzung enthält, wobei der Inhalt jedes Verses als einzelne Zeichenkette dargestellt wird.

Nutzen Sie diese Option, wenn Sie den Text einer gesamten Übersetzung benötigen, ohne für jedes Kapitel eine Anfrage stellen zu müssen und ohne den Text selbst erstellen zu müssen.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).

Diese Datei wird zusammen mit `complete.json` generiert, daher enthält eine Übersetzung entweder beide oder keines von beiden. Das `translation` Objekt enthält in beiden Dateien eine `completeTranslationApiLink` und eine `simpleCompleteTranslationApiLink` , sodass Sie zwischen den beiden Formaten wechseln können.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Holen Sie sich den Text der gesamten BSB-Übersetzung.
fetch(`https://bible.helloao.org/api/${translation}/complete.simple.json`)
    .then(request => request.json())
    .then(complete => {
        for (let book of complete.books) {
            for (let { chapter } of book.chapters) {
                for (let content of chapter.content) {
                    if (content.type === 'verse') {
                        console.log(`${book.commonName} ${chapter.number}:${content.number} ${content.text}`);
                    }
                }
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.simple.json
```

:::

### Struktur

Die Struktur entspricht [dem regulären Download der vollständigen Übersetzung](./standard.md#get-an-entire-translation) , mit der Ausnahme, dass jedes Kapitel das vereinfachte Format verwendet.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Definiert die vollständigen Übersetzungsdownloaddaten unter Verwendung des vereinfachten Kapitelformats.
 * Verweist auf den Endpunkt /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Die Übersetzungsmetadaten.
     */
    translation: Translation;

    /**
     * Die vollständige Liste der Bücher mit allen ihren Kapiteln.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Ein Buch zum Herunterladen in vollständiger Übersetzung, im vereinfachten Kapitelformat.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Die vollständige Liste der Kapitel mit allen Inhalten.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Ein Kapitel aus dem vollständigen Übersetzungsdownload, im vereinfachten Kapitelformat.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Die Anzahl der Verse, die das Kapitel enthält.
     */
    numberOfVerses: number;

    /**
     * Die Links zu verschiedenen Audioversionen des Kapitels.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die Audio-Zeitangaben (Startzeiten pro Vers, in Sekunden) für das Kapitel.
     *
     * Beachten Sie, dass die vollständigen Übersetzungsdateien die Zeitangaben selbst enthalten (siehe TranslationBookChapterAudioTimingsMap in den Standardformatdokumenten), im Gegensatz zu den einzelnen Kapitelendpunkten, die Links zu ihnen enthalten.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Der Link zu den Wort-Anmerkungen des Kapitels im vereinfachten Format. Wird weggelassen, falls das Kapitel keine Wort-Anmerkungen enthält.
     */
    thisChapterWordsLink?: string;

    /**
     * Die vereinfachten Informationen für das Kapitel.
     */
    chapter: SimpleChapterData;
}
```

### Beispiel

```json:no-line-numbers title="/api/BSB/complete.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "website": "https://berean.bible/",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "completeTranslationApiLink": "/api/BSB/complete.json",
        "simpleCompleteTranslationApiLink": "/api/BSB/complete.simple.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 31086,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "name": "Genesis",
            "commonName": "Genesis",
            "title": "Genesis",
            "order": 1,
            "numberOfChapters": 50,
            "totalNumberOfVerses": 1533,
            "chapters": [
                {
                    "numberOfVerses": 31,
                    "thisChapterAudioLinks": {
                        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
                        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
                        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
                    },
                    "thisChapterAudioTimings": {
                        "hays": [0, 4.32, 10.28],
                        "souer": [0, 4.28, 10.19],
                        "david": [0, 4.51, 10.62]
                    },
                    "chapter": {
                        "number": 1,
                        "content": [
                            {
                                "type": "heading",
                                "text": "The Creation"
                            },
                            {
                                "type": "line_break"
                            },
                            {
                                "type": "verse",
                                "number": 1,
                                "text": "In the beginning God created the heavens and the earth.",
                                "footnotes": []
                            }
                        ],
                        "footnotes": []
                    }
                }
            ]
        }
    ]
}
```
