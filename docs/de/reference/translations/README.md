# Übersetzungen, Bücher und Kapitel

Endpunkte zum Durchsuchen von Übersetzungen, Auflisten ihrer Bücher und Abrufen von Kapitelinhalten.

Kapitelinhalte, vollständige Übersetzungen zum Download und Anmerkungen auf Wortebene sind jeweils in zwei Formaten verfügbar:

-   [**Standardformat**](./standard.md) – das ursprüngliche, strukturierte Format. Der Versinhalt ist eine Liste von Elementen (Klartext, formatierter Text, Fußnotenverweise usw.), die Sie selbst zusammenstellen.
-   [**Vereinfachtes Format**](./simplified.md) – ein flaches Format, bei dem der Inhalt jedes Verses eine einzelne Zeichenkette ist, wobei Fußnoten, Gedichte und andere Auszeichnungen als Offsets in diese Zeichenkette ausgedrückt werden.

Wählen Sie das Format, das am besten zu Ihrer geplanten Darstellung oder Verarbeitung des Textes passt.

## Verfügbare Übersetzungen

`GET https://bible.helloao.org/api/available_translations.json`

Ruft die Liste der in der API verfügbaren Übersetzungen ab.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### Struktur

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Die Liste der Übersetzungen.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * Die ID der Übersetzung.
     */
    id: string;

    /**
     * Der Name der Übersetzung.
     * Dies ist üblicherweise der Name der Übersetzung in der Sprache, in die die Übersetzung angefertigt wurde.
     */
    name: string;

    /**
     * Der englische Titel der Übersetzung.
     */
    englishName: string;

    /**
     * Die Website für die Übersetzung.
     */
    website: string;

    /**
     * Die URL, unter der die Lizenz für die Übersetzung zu finden ist.
     */
    licenseUrl: string;

    /**
     * Die Kurzbezeichnung für die Übersetzung.
     */
    shortName: string;

    /**
     * Die ISO 639 3-Buchstaben-Sprachkennzeichnung, in der die Übersetzung primär vorliegt.
     */
    language: string;

    /**
     * Gibt den Namen der Sprache zurück, in der die Übersetzung vorliegt.
     * Null oder undefiniert, wenn der Name der Sprache nicht bekannt ist.
     */
    languageName?: string;

    /**
     * Gibt den Namen der Sprache auf Englisch zurück.
     * Null oder undefiniert, wenn die Sprache keinen englischen Namen hat.
     */
    languageEnglishName?: string;

    /**
     * Die Richtung, in der die Sprache geschrieben ist.
     * „ltr“ bedeutet, dass der Text von links nach rechts geschrieben wird.
     * „rtl“ bedeutet, dass der Text von rechts nach links geschrieben wird.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Die Liste der verfügbaren Formate.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Der API-Link zur Liste der für diese Übersetzung verfügbaren Bücher.
     */
    listOfBooksApiLink: string;

    /**
     * Die Anzahl der in dieser Übersetzung enthaltenen Bücher.
     *
     * Vollständige Übersetzungen sollten die gleiche Anzahl an Büchern wie die Bibel (66) enthalten.
     */
    numberOfBooks: number;

    /**
     * Die Gesamtzahl der in dieser Übersetzung enthaltenen Kapitel.
     *
     * Vollständige Übersetzungen sollten die gleiche Anzahl an Kapiteln wie die Bibel (1189) haben.
     */
    totalNumberOfChapters: number;

    /**
     * Die Gesamtzahl der Verse, die in dieser Übersetzung enthalten sind.
     *
     * Vollständige Übersetzungen sollten die gleiche Anzahl an Versen wie die Bibel haben (etwa 31.102 – einige Übersetzungen schließen Verse aus, basierend auf der Annahme, dass sie in den ursprünglichen Quellentexten nicht vorhanden sind).
     */
    totalNumberOfVerses: number;

    /**
     * Die Gesamtzahl der in dieser Übersetzung enthaltenen apokryphen Bücher.
     * Wird weggelassen, wenn die Übersetzung keine Apokryphen enthält.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Die Gesamtzahl der in dieser Übersetzung enthaltenen apokryphen Kapitel.
     * Wird weggelassen, wenn die Übersetzung keine Apokryphen enthält.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * die Gesamtzahl der apokryphen Verse, die in dieser Übersetzung enthalten sind.
     * Wird weggelassen, wenn die Übersetzung keine Apokryphen enthält.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/available_translations.json"
{
    "translations": [
        {
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
        }
    ]
}
```

## Liste der Bücher in einer Übersetzung

`GET https://bible.helloao.org/api/{translation}/books.json`

Ruft die Liste der für die angegebene Übersetzung verfügbaren Bücher ab.

-   `translation` ist die ID der Übersetzung (z. B. `BSB` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Holen Sie sich die Liste der Bücher für die BSB-Übersetzung
fetch(`https://bible.helloao.org/api/${translation}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### Struktur

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Die Übersetzungsinformationen für die Bücher.
     */
    translation: Translation;

    /**
     * Die Liste der Bücher, die für die Übersetzung zur Verfügung stehen.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * Die ID des Buches.
     */
    id: string;

    /**
     * Der Name, den die Übersetzung dem Buch gegeben hat.
     */
    name: string;

    /**
     * Der gebräuchliche Name für das Buch.
     */
    commonName: string;

    /**
     * Der Titel des Buches.
     * Dies ist üblicherweise eine beschreibendere Version des Buchtitels.
     * Falls keines verfügbar ist, wurde bei der Übersetzung keins bereitgestellt.
     */
    title: string | null;

    /**
     * Die numerische Reihenfolge der Bücher in der Übersetzung.
     */
    order: number;

    /**
     * Die Anzahl der Kapitel, die das Buch enthält.
     */
    numberOfChapters: number;

    /**
     * Die Nummer des ersten Kapitels im Buch.
     */
    firstChapterNumber: number;

    /**
     * Der Link zum ersten Kapitel des Buches.
     */
    firstChapterApiLink: string;

    /**
     * Die Nummer des letzten Kapitels im Buch.
     */
    lastChapterNumber: number;

    /**
     * Der Link zum letzten Kapitel des Buches.
     */
    lastChapterApiLink: string;

    /**
     * Die Anzahl der Verse, die das Buch enthält.
     */
    totalNumberOfVerses: number;

    /**
     * Ob es sich bei dem Buch um ein apokryphes Buch handelt.
     * Wird weggelassen, wenn die Übersetzung kanonisch ist.
     */
    isApocryphal?: boolean;
}
```

### Beispiel

```json:no-line-numbers title="/api/BSB/books.json"
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
    "books": [
        {
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
    ]
}
```
