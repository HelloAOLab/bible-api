# Standardformat

Das Standardformat für Kapitel, vollständige Übersetzungen zum Download und Anmerkungen auf Wortebene. Die entsprechenden Endpunkte für Übersetzungen und Buchlisten finden Sie unter [„Übersetzungen, Bücher & Kapitel“](./README.md) . Alternativ [können Sie das vereinfachte Format](./simplified.md) für die Darstellung desselben Inhalts nutzen.

## Holen Sie sich ein Kapitel aus einer Übersetzung

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Ruft den Inhalt eines einzelnen Kapitels eines bestimmten Buches und einer bestimmten Übersetzung ab.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis – eine Liste der Buch-IDs finden Sie [hier](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` steht für das numerische Kapitel (z. B. `1` für das erste Kapitel).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Holen Sie sich Genesis 1 aus der BSB-Übersetzung.
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### Struktur

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * Die Links zu verschiedenen Audioversionen des Kapitels.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die Links zu den Audio-Zeitangaben für die verschiedenen Audioversionen des Kapitels.
     * Jeder Link verweist auf die Audio-Timing-Datei für den jeweiligen Reader – siehe „Audio-Timings für ein Kapitel abrufen“ weiter unten.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Der Link zum nächsten Kapitel.
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
     * Der Link zum vorherigen Kapitel.
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
     * Der Link zu den Wort-Ebenen-Annotationen für das Kapitel.
     * Wird ausgelassen, wenn das Kapitel keine Wort-Ebenen-Anmerkungen enthält.
     */
    thisChapterWordsLink?: string;

    /**
     * Der Link zu den Wort-Ebenen-Annotationen für das nächste Kapitel.
     * Wird ausgelassen, wenn dies das letzte Kapitel der Übersetzung ist oder wenn das nächste Kapitel keine Wort-Ebene-Anmerkungen enthält.
     */
    nextChapterWordsLink?: string;

    /**
     * Der Link zu den Wort-Ebenen-Annotationen des vorherigen Kapitels.
     * Wird weggelassen, wenn es sich um das erste Kapitel der Übersetzung handelt oder wenn das vorherige Kapitel keine Wort-Ebene-Anmerkungen enthält.
     */
    previousChapterWordsLink?: string;

    /**
     * Die Anzahl der Verse, die das Kapitel enthält.
     */
    numberOfVerses: number;

    /**
     * Hier finden Sie den Link zur vereinfachten Version dieses Kapitels.
     * Wird ausgelassen, falls keine vereinfachten Kapitel verfügbar sind.
     */
    simpleChapterApiLink?: string;

    /**
     * Die Informationen für das Kapitel.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Die Kapitelnummer.
     */
    number: number;

    /**
     * Der Inhalt des Kapitels.
     */
    content: ChapterContent[];

    /**
     * Das Fußnotenverzeichnis zum Kapitel.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Ein Union-Typ, der einen einzelnen Abschnitt des Kapitelinhalts repräsentiert.
 * Ein Kapitelinhalt kann beispielsweise Folgendes umfassen:
 * - Eine Überschrift.
 * - Ein Zeilenumbruch.
 * - Ein Vers.
 * - Ein hebräischer Untertitel.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Eine Überschrift in einem Kapitel.
 */
interface ChapterHeading {
    /**
     * Kennzeichnet einen Inhalt, der eine Überschrift darstellt.
     */
    type: 'heading';

    /**
     * Der Inhalt für die Überschrift.
     * Wenn mehrere Zeichenketten im Array enthalten sind, sollten diese mit einem Leerzeichen verkettet werden.
     */
    content: string[];
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
 * Ein hebräischer Untertitel in einem Kapitel.
 * Diese werden häufig als informativer Inhalt verwendet, der in den Originalmanuskripten enthalten war.
 * Psalm 49 trägt beispielsweise den hebräischen Untertitel „Dem Chorleiter. Ein Psalm der Söhne Korachs.“
 */
interface ChapterHebrewSubtitle {
    /**
     * Kennzeichnet einen hebräischen Untertitel.
     */
    type: 'hebrew_subtitle';

    /**
     * Die im Untertitel enthaltene Inhaltsliste.
     * Jedes Element in der Liste kann eine Zeichenkette, formatierter Text oder ein Fußnotenverweis sein.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Ein Vers in einem Kapitel.
 */
interface ChapterVerse {
    /**
     * Zeigt an, dass es sich bei dem Inhalt um einen Vers handelt.
     */
    type: 'verse';

    /**
     * Die Versnummer.
     */
    number: number;

    /**
     * Die Inhaltsangabe für den Vers.
     * Jedes Element in der Liste kann eine Zeichenkette, formatierter Text oder ein Fußnotenverweis sein.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Formatierter Text. Das heißt, Text, der auf eine bestimmte Weise formatiert ist.
 */
interface FormattedText {
    /**
     * Der formatierte Text.
     */
    text: string;

    /**
     * Ob der Text ein Gedicht darstellt.
     * Die Zahl gibt die Einrückungsebene an.
     *
     * Häufig in den Psalmen.
     */
    poem?: number;

    /**
     * Ob der Text die Worte Jesu wiedergibt.
     */
    wordsOfJesus?: boolean;
}

/**
 * Definiert eine Schnittstelle, die eine in einen Vers eingebettete Überschrift darstellt.
 */
interface InlineHeading {
    /**
     * Der Text der Überschrift.
     */
    heading: string;
}

/**
 * Definiert eine Schnittstelle, die einen in einen Vers eingebetteten Zeilenumbruch darstellt.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Eine Fußnotenreferenz in einem Vers oder einem hebräischen Untertitel.
 */
interface VerseFootnoteReference {
    /**
     * Die ID der Notiz.
     */
    noteId: number;
}

/**
 * Informationen zu einer Fußnote.
 */
interface ChapterFootnote {
    /**
     * Die ID der Notiz, auf die Bezug genommen wird.
     */
    noteId: number;

    /**
     * Der Text der Fußnote.
     */
    text: string;

    /**
     * Die Versreferenz für die Fußnote.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Der Aufrufer, der für die Fußnote verwendet werden soll.
     * Bei Fußnoten ist der sogenannte „Aufrufer“ das Zeichen, das im Text verwendet wird, um auf die Fußnote zu verweisen.
     *
     * Zum Beispiel im Text:
     * Hallo Welt
     *
     * ---- (a) Dies ist eine Fußnote.
     *
     * Das "(a)" ist der Anrufer.
     *
     * Bei einem "+" sollte der Aufrufer automatisch generiert werden.
     * Wenn null, dann sollte der Aufrufer leer sein.
     * Wenn es sich um eine Zeichenkette handelt, dann sollte der Aufrufer diese Zeichenkette sein.
     */
    caller: '+' | string | null;
}

/**
 * Die Audio-Links zu einem Buchkapitel.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Der Reader für das Kapitel und der URL-Link zur Audiodatei.
     */
    [reader: string]: string;
}

/**
 * Die Audio-Zeitangaben für ein Buchkapitel.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Der Reader für das Kapitel und der API-Link zur Audio-Timing-Datei für diesen Reader.
     */
    [reader: string]: string;
}
```

### Beispiel

```json:no-line-numbers title="/api/BSB/GEN/1.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "licenseNotes": null,
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
        "translationId": "BSB",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterNumber": 50,
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "thisChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
    },
    "thisChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/1.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "nextChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_002_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_002_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_002.mp3"
    },
    "nextChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/2.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterAudioLinks": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "content": [
                    "The Creation"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning God created the heavens and the earth."
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "content": [
                    "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
            },
            {
                "type": "heading",
                "content": [
                    "The First Day"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "content": [
                    "And God said, “Let there be light,”",
                    {
                        "noteId": 0
                    },
                    "and there was light."
                ]
            },
            {
                "type": "verse",
                "number": 4,
                "content": [
                    "And God saw that the light was good, and He separated the light from the darkness."
                ]
            },
            {
                "type": "verse",
                "number": 5,
                "content": [
                    "God called the light “day,” and the darkness He called “night.”",
                    {
                        "lineBreak": true
                    },
                    "And there was evening, and there was morning—the first day.",
                    {
                        "noteId": 1
                    }
                ]
            }
        ],
        "footnotes": [
            {
                "noteId": 0,
                "text": "Cited in 2 Corinthians 4:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 3
                }
            },
            {
                "noteId": 1,
                "text": "Literally day one",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 5
                }
            },
            {
                "noteId": 2,
                "text": "Or a canopy or a firmament or a vault; also in verses 7, 8, 14, 15, 17, and 20",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 6
                }
            },
            {
                "noteId": 3,
                "text": "MT; Syriac and over all the beasts of the earth",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 26
                }
            },
            {
                "noteId": 4,
                "text": "Cited in Matthew 19:4 and Mark 10:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 27
                }
            }
        ]
    }
}
```

## Die Audio-Zeitangaben für ein Kapitel abrufen

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Ermittelt die Audio-Zeiten für jeden Vers eines einzelnen Kapitels, gesprochen von einem einzelnen Sprecher – also die Zeit (in Sekunden, relativ zum Beginn der Audiodatei dieses Sprechers), zu der jeder Vers beginnt. Kunden können dies nutzen, um den aktuell gelesenen Vers während der Wiedergabe hervorzuheben.

Nur einige Übersetzungen und Sprecher verfügen über Audio-Timings. Ein Kapitel, das Audio-Timings für einen Sprecher enthält, verweist mit einem Eintrag in `thisChapterAudioTimings` , der durch die Sprecher-ID identifiziert wird, auf diese Datei. Ist ein Sprecher in dieser Zuordnung nicht vorhanden, existiert diese Datei für diesen Sprecher und dieses Kapitel nicht.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis – eine Liste der Buch-IDs finden Sie [hier](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` steht für das numerische Kapitel (z. B. `1` für das erste Kapitel).
-   `reader` ist die ID des Lesers, für dessen Erzählung die Zeitangaben gelten (z. B. `hays` ) - die verfügbaren Leser für ein Kapitel sind die Schlüssel seiner `thisChapterAudioLinks` .

Das Ende eines Verses ist der Beginn des nächsten Verses (bzw. beim letzten Vers das Ende der Audiodatei), sodass der Kunde nichts weiter als die geordnete Liste der Startzeiten benötigt, um Hervorhebungsbereiche für das gesamte Kapitel zu erstellen.

Diese Datei ist immer gleich, egal ob man sie vom regulären Kapitelendpunkt oder [vom vereinfachten Endpunkt aus](./simplified.md#get-a-simplified-chapter-from-a-translation) aufruft – es gibt nur einen Satz von Zeitangaben pro Übersetzung, Buch, Kapitel und Leser.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Holen Sie sich die Audio-Timings für Genesis 1 (BSB), wie sie von "hays" vorgelesen werden.
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.${reader}.audioTimings.json`)
    .then(request => request.json())
    .then(timings => {
        console.log('Genesis 1 (BSB, hays) verse start times:', timings.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.hays.audioTimings.json
```

:::

### Struktur

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Definiert die Audio-Zeiten für ein Buchkapitel für einen einzelnen Leser.
 * Ordnet dem Endpunkt /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json zu.
 */
export interface TranslationBookChapterAudioTimings {
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
     * Die ID des Lesers, für den diese Zeitangaben gelten.
     */
    reader: string;

    /**
     * Der Link zur Audiodatei, auf die sich diese Zeitangaben beziehen.
     */
    audioLink: string;

    /**
     * Der Link zu den Informationen für dieses Kapitel.
     */
    thisChapterLink: string;

    /**
     * Der Link zu den Informationen für das nächste Kapitel.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterLink: string | null;

    /**
     * Der Link zu den Informationen des vorherigen Kapitels.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterLink: string | null;

    /**
     * Der Link zu dieser Audio-Timing-Datei.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Hier der Link zu den Zeitangaben für das nächste Kapitel, für denselben Leser.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Hier der Link zu den Zeitangaben des vorherigen Kapitels für denselben Leser.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Die Zeitpunkte in Sekunden, zu denen die einzelnen Strophen beginnen, in der Reihenfolge ihres Beginns.
     * Die erste Zahl (Index 0) ist die Zeit in der Aufnahme, zu der die erste Strophe beginnt.
     */
    verses: number[];
}
```

### Beispiel

```json:no-line-numbers title="/api/BSB/GEN/1.hays.audioTimings.json"
{
    "translationId": "BSB",
    "bookId": "GEN",
    "chapterNumber": 1,
    "reader": "hays",
    "audioLink": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "nextChapterLink": "/api/BSB/GEN/2.json",
    "previousChapterLink": null,
    "thisChapterAudioTimingsLink": "/api/BSB/GEN/1.hays.audioTimings.json",
    "nextChapterAudioTimingsLink": "/api/BSB/GEN/2.hays.audioTimings.json",
    "previousChapterAudioTimingsLink": null,
    "verses": [
        0,
        4.32,
        10.28,
        19.06,
        27.84
    ]
}
```

`verses[0]` ist der Startzeitpunkt von Vers 1, `verses[1]` ist der Startzeitpunkt von Vers 2 usw. - in diesem Beispiel beginnt Vers 2 von Genesis 1 (BSB, gelesen von "hays") bei 4,32 Sekunden in `audioLink` .

## Den Wortschatz eines Kapitels

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Ruft die Wort-Ebene-Annotationen (Strong-Nummern und zugehörige Quelldaten) für ein einzelnes Kapitel ab.

Nur einige Übersetzungen enthalten Anmerkungen auf Wortebene. Ein Kapitel mit solchen Anmerkungen verweist mit `thisChapterWordsLink` auf diese Datei; fehlt diese Eigenschaft, existiert die Datei für das Kapitel nicht.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis – eine Liste der Buch-IDs finden Sie [hier](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` steht für das numerische Kapitel (z. B. `1` für das erste Kapitel).

Jede Annotation ist an einen Zeichenbereich innerhalb eines einzelnen Elements des `content` `end` eines Verses gebunden: `contentIndex` ist der Index des Elements, und `start` sind die Zeichenpositionen innerhalb dieses Elements. `end` ist exklusiv, daher ist `text.slice(start, end)` das annotierte Wort.

Die Verankerung an einem Inhaltselement (anstatt am gesamten Vers) bedeutet, dass die Offsets auch dann korrekt bleiben, wenn der Inhalt in mehrere Elemente unterteilt ist, wie z. B. Gedichtzeilen, Worte Jesu und Fußnotenverweise.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Den Text von Genesis 1 finden Sie in der BSB-Übersetzung.
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.json`)
    .then(request => request.json())
    .then(words => {
        console.log('Genesis 1 words (BSB):', words);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.words.json
```

:::

### Struktur

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * Der Link zu den Informationen für dieses Kapitel.
     */
    thisChapterLink: string;

    /**
     * Der Link zu den Informationen für das nächste Kapitel.
     * Null, falls dies das letzte Kapitel der Übersetzung ist.
     */
    nextChapterLink: string | null;

    /**
     * Der Link zu den Informationen des vorherigen Kapitels.
     * Null, falls dies das erste Kapitel der Übersetzung ist.
     */
    previousChapterLink: string | null;

    /**
     * Der Link zu dieser Word-Datei.
     */
    thisChapterWordsLink: string;

    /**
     * Der Link zum Text des nächsten Kapitels.
     * Null, falls dies das letzte Kapitel der Übersetzung ist oder falls das nächste Kapitel keine Wort-Ebenen-Anmerkungen enthält.
     */
    nextChapterWordsLink: string | null;

    /**
     * Der Link zu den Wörtern des vorherigen Kapitels.
     * Null, falls dies das erste Kapitel der Übersetzung ist oder falls das vorherige Kapitel keine Wort-Ebene-Anmerkungen enthält.
     */
    previousChapterWordsLink: string | null;

    /**
     * Die kommentierten Wörter für jeden Vers im Kapitel, geordnet nach Versnummer.
     * Die Listen sind in der Reihenfolge angeordnet, in der die Wörter im Vers vorkommen.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Der Index des Elements im Inhaltsarray des Verses, auf das sich die Annotation bezieht.
     */
    contentIndex: number;

    /**
     * Der Index des ersten Zeichens des annotierten Wortes im Text des Inhaltselements.
     */
    start: number;

    /**
     * Der Index nach dem letzten Zeichen des annotierten Wortes im Text des Inhaltselements.
     * Das heißt, text.slice(start, end) ist das annotierte Wort.
     */
    end: number;

    /**
     * Die Strong-Nummer(n) für das Wort.
     * Wird weggelassen, wenn die Übersetzung nur andere Anmerkungen zu dem Wort enthielt.
     */
    strongs?: string[];

    /**
     * Die Wörterbuchform (Zitatform) des Wortes.
     * Wird weggelassen, falls die Übersetzung keine Angabe enthielt.
     */
    lemma?: string;

    /**
     * Der morphologische Analysecode für das Wort.
     * Wird weggelassen, falls die Übersetzung keine Angabe enthielt.
     */
    morph?: string;

    /**
     * Der Zeiger auf das Wort im Quelltext im Format <sourceName> : <location> .
     * Wird weggelassen, falls die Übersetzung keine Angabe enthielt.
     */
    srcloc?: string;

    /**
     * Auf welcher Stelle des Quellwortes dieses Wort basiert. 1-basiert.
     * Wird weggelassen, falls die Übersetzung keine Angabe enthielt.
     */
    occurrence?: number;

    /**
     * Die Gesamtzahl der Vorkommen des Quellworts.
     * Wird weggelassen, falls die Übersetzung keine Angabe enthielt.
     */
    occurrences?: number;
}
```

### Beispiel

Angenommen, ein Kapitel, dessen erster Vers nur einen einzigen Inhaltseintrag enthält:

```json:no-line-numbers title="/api/engwebp/JHN/1.json"
{
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
                ]
            }
        ]
    }
}
```

Die Wörter „Datei“ kennzeichnen die Zeichen dieses Elements:

```json:no-line-numbers title="/api/engwebp/JHN/1.words.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.json",
    "nextChapterLink": "/api/engwebp/JHN/2.json",
    "previousChapterLink": "/api/engwebp/MAT/28.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.json",
    "verses": {
        "1": [
            {
                "contentIndex": 0,
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

Das heißt, `"In the beginning...".slice(0, 2)` ist `"In"` , was die Quelle mit `G1722` gekennzeichnet hat.

## Erhalten Sie eine vollständige Übersetzung

`GET https://bible.helloao.org/api/{translation}/complete.json`

Ruft den Inhalt einer vollständigen Übersetzung ab.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Holen Sie sich Genesis 1 aus der BSB-Übersetzung.
fetch(`https://bible.helloao.org/api/${translation}/complete.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('BSB:', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.json
```

:::

### Struktur

```typescript:no-line-numbers title="complete.ts"
/**
 * Definiert die vollständigen Übersetzungsdownloaddaten.
 * Verweist auf den Endpunkt /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Die Übersetzungsmetadaten.
     */
    translation: Translation;

    /**
     * Die vollständige Liste der Bücher mit allen ihren Kapiteln.
     */
    books: TranslationCompleteBook[];
}

/**
 * Ein Buch in vollständiger Übersetzung zum Download.
 */
export interface TranslationCompleteBook {
    /**
     * Die ID des Buches.
     */
    id: string;

    /**
     * Der Name des Buches aus der Übersetzung.
     */
    name: string;

    /**
     * Der gebräuchliche Name für das Buch.
     */
    commonName: string;

    /**
     * Der Titel des Buches.
     */
    title: string | null;

    /**
     * Die Reihenfolge des Buches.
     */
    order: number;

    /**
     * Die Anzahl der Kapitel im Buch.
     */
    numberOfChapters: number;

    /**
     * Die Gesamtzahl der Verse im Buch.
     */
    totalNumberOfVerses: number;

    /**
     * Ob das Buch apokryph ist.
     */
    isApocryphal?: boolean;

    /**
     * Die vollständige Liste der Kapitel mit allen Inhalten.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Ein Kapitel aus dem vollständigen Übersetzungs-Download.
 */
export interface TranslationCompleteChapter {
    /**
     * Die Anzahl der Verse, die das Kapitel enthält.
     */
    numberOfVerses: number;

    /**
     * Die Links zu verschiedenen Audioversionen des Kapitels.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die Audio-Zeitangaben (Startzeiten pro Vers, in Sekunden) für die verschiedenen Audioversionen des Kapitels.
     *
     * Im Gegensatz zu `thisChapterAudioTimings` am Endpunkt des einzelnen Kapitels (der weiter unten auf „Audio-Timings für ein Kapitel abrufen“ verlinkt) enthält dieser Link die Timings selbst – denn der Sinn des Downloads der kompletten Übersetzung besteht darin, alles in einer Datei zu haben.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Der Link zu den Wort-Ebenen-Annotationen für das Kapitel.
     * Wird ausgelassen, wenn das Kapitel keine Wort-Ebenen-Anmerkungen enthält.
     */
    thisChapterWordsLink?: string;

    /**
     * Die Informationen für das Kapitel.
     */
    chapter: ChapterData;
}

/**
 * Die Audio-Zeitangaben für ein Buchkapitel, direkt eingebettet und nicht verlinkt.
 * Ordnet eine Leser-ID der Liste der Startzeiten (in Sekunden) der einzelnen Verse in der Reihenfolge ihrer Verse zu.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Beispiel

```json:no-line-numbers title="/api/BSB/complete.json"
{
  "translation": {
    "id": "BSB",
    "name": "Berean Standard Bible",
    "website": "https://berean.bible/",
    "licenseUrl": "https://berean.bible/",
    "licenseNotes": null,
    "shortName": "BSB",
    "englishName": "Berean Standard Bible",
    "language": "eng",
    "textDirection": "ltr",
    "sha256": "b2898c49cadb50fd8763feb9e2f74a90a3817e33408a24b6cbf09e7a950dde97",
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
            "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
            "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
            "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
          },
          "thisChapterAudioTimings": {
            "gilbert": [0, 4.4, 10.36],
            "hays": [0, 4.32, 10.28],
            "souer": [0, 4.28, 10.19]
          },
          "chapter": {
            "number": 1,
            "content": [
              {
                "type": "heading",
                "content": [
                  "The Creation"
                ]
              },
              {
                "type": "verse",
                "number": 1,
                "content": [
                  "In the beginning God created the heavens and the earth."
                ]
              },
              {
                "type": "line_break"
              },
              {
                "type": "verse",
                "number": 2,
                "content": [
                  "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
              },
            ]
          }
        }
      ]
    }
  ]
}
```
