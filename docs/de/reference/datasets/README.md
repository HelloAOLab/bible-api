# Datensätze

Endpunkte zum Durchsuchen ergänzender Bibeldatensätze – wie Querverweise und biblische Entitäten (Personen, Orte, Ereignisse und Volksgruppen) – und zum Abrufen ihrer Bücher, Kapitelinhalte und Entitäten.

## Verfügbare Datensätze

`GET https://bible.helloao.org/api/available_datasets.json`

Ruft die Liste der in der API verfügbaren Bibeldatensätze ab.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### Struktur

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Die Liste der Datensätze.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * Die ID des Datensatzes.
     */
    id: string;

    /**
     * Der Name des Datensatzes.
     */
    name: string;

    /**
     * Die Website zum Datensatz.
     */
    website: string;

    /**
     * Die URL, unter der die Lizenz für den Datensatz gefunden werden kann.
     */
    licenseUrl: string;

    /**
     * Der englische Name für den Datensatz.
     */
    englishName: string;

    /**
     * Die ISO 639 3-Buchstaben-Sprachkennzeichnung, in der der Datensatz hauptsächlich vorliegt.
     */
    language: string;

    /**
     * Die Richtung, in der die Sprache geschrieben ist.
     * „ltr“ bedeutet, dass der Text von links nach rechts geschrieben wird.
     * „rtl“ bedeutet, dass der Text von rechts nach links geschrieben wird.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Der API-Link zur Liste der für diesen Datensatz verfügbaren Bücher.
     */
    listOfBooksApiLink: string;

    /**
     * Die Liste der verfügbaren Formate.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Die Anzahl der in diesem Datensatz enthaltenen Bücher.
     */
    numberOfBooks: number;

    /**
     * Die Gesamtzahl der Kapitel, die in diesem Datensatz enthalten sind.
     */
    totalNumberOfChapters: number;

    /**
     * Die Gesamtzahl der Verse, die in diesem Datensatz enthalten sind.
     */
    totalNumberOfVerses: number;

    /**
     * Die Gesamtzahl der Querverweise in diesem Datensatz.
     */
    totalNumberOfReferences: number;

    /**
     * Gibt den Namen der Sprache zurück, in der der Datensatz vorliegt.
     * Null oder undefiniert, wenn der Name der Sprache nicht bekannt ist.
     */
    languageName?: string;

    /**
     * Gibt den Namen der Sprache auf Englisch zurück.
     * Null oder undefiniert, wenn die Sprache keinen englischen Namen hat.
     */
    languageEnglishName?: string;

    /**
     * Die API-Links für die Listen der Entitäten im Datensatz.
     * Wird weggelassen, wenn der Datensatz die entsprechenden Entitäten nicht enthält.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Die Gesamtzahl der im Datensatz enthaltenen Entitäten.
     * Wird weggelassen, wenn der Datensatz die entsprechenden Entitäten nicht enthält.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/available_datasets.json"
{
    "datasets": [
        {
            "id": "open-cross-ref",
            "name": "Bible Cross References",
            "website": "https://www.openbible.info/labs/cross-references/",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Bible Cross References",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 29364,
            "totalNumberOfReferences": 344799,
            "languageName": "English",
            "languageEnglishName": "English"
        },
        {
            "id": "theographic",
            "name": "Theographic Bible Metadata",
            "website": "https://github.com/robertrouse/theographic-bible-metadata",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
            "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Theographic Bible Metadata",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/theographic/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1182,
            "totalNumberOfVerses": 24547,
            "totalNumberOfReferences": 53120,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfPeopleApiLink": "/api/d/theographic/people.json",
            "totalNumberOfPeople": 3067,
            "listOfPlacesApiLink": "/api/d/theographic/places.json",
            "totalNumberOfPlaces": 1274,
            "listOfEventsApiLink": "/api/d/theographic/events.json",
            "totalNumberOfEvents": 450,
            "listOfPeopleGroupsApiLink": "/api/d/theographic/groups.json",
            "totalNumberOfPeopleGroups": 23
        }
    ]
}
```

## Bücher in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Ruft die Liste der für den angegebenen Datensatz verfügbaren Bücher ab.

-   `dataset` die ID des Datensatzes (z. B. `open-cross-ref` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Rufen Sie die Liste der Bücher für den Open-Cross-Ref-Datensatz ab.
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Die Datensatzinformationen für die Bücher.
     */
    dataset: Dataset;

    /**
     * Die Liste der für den Datensatz verfügbaren Bücher.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * Die ID des Buches.
     * Entspricht der ID des entsprechenden Buches in der Bibel (GEN, EXO usw.).
     */
    id: string;

    /**
     * Die Reihenfolge der Bücher in der Bibel.
     */
    order: number;

    /**
     * Die Nummer des ersten Kapitels im Buch.
     */
    firstChapterNumber: number;

    /**
     * Der Link zum ersten Kapitel des Buches.
     */
    firstChapterApiLink: string | null;

    /**
     * Die Nummer des letzten Kapitels im Buch.
     */
    lastChapterNumber: number | null;

    /**
     * Der Link zum letzten Kapitel des Buches.
     */
    lastChapterApiLink: string | null;

    /**
     * Die Anzahl der Kapitel, die das Buch enthält.
     */
    numberOfChapters: number;

    /**
     * Die Anzahl der Verse, die das Buch enthält.
     */
    totalNumberOfVerses: number;

    /**
     * Die Gesamtzahl der Querverweise in diesem Buch.
     */
    totalNumberOfReferences: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/open-cross-ref/books.json"
{
    "dataset": {
        "id": "open-cross-ref",
        "name": "Bible Cross References",
        "website": "https://www.openbible.info/labs/cross-references/",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
        "englishName": "Bible Cross References",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 29364,
        "totalNumberOfReferences": 344799,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "datasetId": "open-cross-ref",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/d/open-cross-ref/GEN/1.json",
            "lastChapterNumber": 50,
            "lastChapterApiLink": "/api/d/open-cross-ref/GEN/50.json",
            "totalNumberOfVerses": 1382,
            "totalNumberOfReferences": 13327
        },
        {
            "id": "EXO",
            "datasetId": "open-cross-ref",
            "order": 2,
            "numberOfChapters": 40,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/d/open-cross-ref/EXO/1.json",
            "lastChapterNumber": 40,
            "lastChapterApiLink": "/api/d/open-cross-ref/EXO/40.json",
            "totalNumberOfVerses": 1084,
            "totalNumberOfReferences": 9974
        },
    ]
}
```

## Ein Kapitel aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Ruft den Inhalt eines einzelnen Kapitels eines gegebenen Buches und Datensatzes ab.

Bei Querverweisdatensätzen (wie z. B. `open-cross-ref` ) enthält das Kapitel die Liste der Querverweise für jeden Vers. Bei Entitätsdatensätzen (wie z. B. `theographic` ) enthält das Kapitel die Personen, Orte und Ereignisse, die in diesem Kapitel vorkommen – siehe [„Die Entitäten in einem Kapitel abrufen“](#get-the-entities-in-a-chapter) .

-   `dataset` die ID des Datensatzes (z. B. `open-cross-ref` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis).
-   `chapter` ist die numerische Kapitelnummer (z. B. `1` für das erste Kapitel).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Genesis 1 aus dem Open-Cross-Ref-Datensatz abrufen
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Die Datensatzinformationen für das Buchkapitel.
     */
    dataset: Dataset;

    /**
     * Die Buchinformationen für das Buchkapitel.
     */
    book: DatasetBook;

    /**
     * Der Link zu diesem Kapitel.
     */
    thisChapterLink: string;

    /**
     * Der Link zum nächsten Kapitel.
     * Null, falls dies das letzte Kapitel im Datensatz ist.
     */
    nextChapterApiLink: string | null;

    /**
     * Der Link zum vorherigen Kapitel.
     * Null, falls dies das erste Kapitel im Datensatz ist.
     */
    previousChapterApiLink: string | null;

    /**
     * Die Anzahl der Verse, die das Kapitel enthält.
     */
    numberOfVerses: number;

    /**
     * Die Informationen für das Kapitel.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Die Kapitelnummer.
     */
    number: number;

    /**
     * Der Inhalt des Kapitels.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * Die Versnummer.
     */
    verse: number;

    /**
     * Die Querverweise für den Vers.
     *
     * Sortiert nach Punktzahl, absteigend.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * Die ID des Buches, auf das Bezug genommen wird.
     */
    book: string;

    /**
     * Die Kapitelnummer.
     */
    chapter: number;

    /**
     * Die Versnummer.
     * Wenn `endVerse` vorhanden ist, dann ist dies der Vers, bei dem die Referenz beginnt.
     */
    verse: number;

    /**
     * Der Vers, bei dem die Bezugnahme endet.
     */
    endVerse?: number;

    /**
     * Der Relevanzwert für die Referenz.
     */
    score?: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/open-cross-ref/REV/22.json"
{
    "dataset": {
        "id": "open-cross-ref",
        "name": "Bible Cross References",
        "website": "https://www.openbible.info/labs/cross-references/",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
        "englishName": "Bible Cross References",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 29364,
        "totalNumberOfReferences": 344799,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "REV",
        "datasetId": "open-cross-ref",
        "order": 66,
        "numberOfChapters": 22,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/d/open-cross-ref/REV/1.json",
        "lastChapterNumber": 22,
        "lastChapterApiLink": "/api/d/open-cross-ref/REV/22.json",
        "totalNumberOfVerses": 402,
        "totalNumberOfReferences": 6495
    },
    "chapter": {
        "number": 22,
        "content": [
            {
                "verse": 1,
                "references": [
                    {
                        "book": "REV",
                        "chapter": 7,
                        "verse": 17,
                        "score": 74
                    },
                    {
                        "book": "JHN",
                        "chapter": 4,
                        "verse": 14,
                        "score": 62
                    },
                    {
                        "book": "PSA",
                        "chapter": 36,
                        "verse": 8,
                        "endVerse": 9,
                        "score": 59
                    },
                    {
                        "book": "JHN",
                        "chapter": 7,
                        "verse": 38,
                        "endVerse": 39,
                        "score": 59
                    },
                    {
                        "book": "JHN",
                        "chapter": 4,
                        "verse": 10,
                        "endVerse": 11,
                        "score": 55
                    },
                ]
            }
        ]
    },
    "thisChapterLink": "/api/d/open-cross-ref/REV/22.json",
    "nextChapterApiLink": null,
    "previousChapterApiLink": "/api/d/open-cross-ref/REV/21.json",
    "numberOfVerses": 21,
    "numberOfReferences": 360
}
```

## Entitäten

Einige Datensätze – wie beispielsweise der [theographische Bibelmetadatensatz](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) – enthalten Entitäten: Personen, Orte, Ereignisse und Volksgruppen sowie die Beziehungen zwischen ihnen und den Bibelversen, in denen sie erwähnt werden.

Datensätze, die Entitäten enthalten, umfassen `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` und `listOfPeopleGroupsApiLink` Eigenschaften in ihrem Eintrag in `/api/available_datasets.json` .

Entitätsdatensätze liefern außerdem kapitelbezogene Daten: `/api/d/{dataset}/books.json` listet die Bücher auf, deren Kapitel Entitätsdaten enthalten, und `/api/d/{dataset}/{book}/{chapter}.json` gibt die Personen, Orte und Ereignisse zurück, die in diesem Kapitel vorkommen, zusammen mit den Versnummern, in denen sie jeweils erwähnt werden. Siehe [„Entitäten in einem Kapitel abrufen“](#get-the-entities-in-a-chapter) .

Entitäten verweisen auf Bibelstellen mithilfe derselben Buch-IDs, Kapitel- und Versnummern wie der Rest der API, sodass sie mit jeder Übersetzung kombiniert werden können. Sie verweisen untereinander über Entitätsreferenzen:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * Die ID der Entität, auf die verwiesen wird.
     */
    id: string;

    /**
     * Der Typ der Entität, auf die verwiesen wird.
     * Entspricht dem Sammlungssegment des API-Links der Entität, sodass der Link als `/api/d/{dataset}/{type}/{id}.json` konstruiert werden kann.
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Der Name der Entität, auf die Bezug genommen wird.
     */
    name?: string;

    /**
     * Der API-Link für die referenzierte Entität.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * Die ID des Buches (GEN, EXO usw.).
     */
    book: string;

    /**
     * Die Kapitelnummer, bei der die Referenz beginnt.
     */
    chapter: number;

    /**
     * Die Versnummer, bei der die Bezugnahme beginnt.
     */
    verse: number;

    /**
     * Der Vers, bei dem die Bezugnahme endet.
     * Aufeinanderfolgende Verse im selben Kapitel werden zu einer einzigen Referenz zusammengefasst.
     */
    endVerse?: number;
}
```

## Die Entitäten in einem Kapitel

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Für Entitätsdatensätze werden die Personen, Orte und Ereignisse abgerufen, die in einem einzelnen Kapitel vorkommen, zusammen mit den Versnummern in dem Kapitel, in denen sie jeweils erwähnt werden.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).
-   `book` ist die ID des Buches (z. B. `GEN` für Genesis).
-   `chapter` ist die numerische Kapitelnummer (z. B. `1` für das erste Kapitel).

Die Liste der Bücher und Kapitel mit Entitätsdaten ist unter `GET https://bible.helloao.org/api/d/{dataset}/books.json` verfügbar und folgt der gleichen Struktur wie der [Endpunkt des Datensatzes „books“](#list-books-in-a-dataset) . Bei Entitätsdatensätzen gibt `totalNumberOfVerses` die Anzahl der Verse an, die von mindestens einer Entität erwähnt werden, und `totalNumberOfReferences` die Gesamtzahl der Erwähnungen von Entitäten in Versen.

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Finde die Personen, Orte und Ereignisse, die in Genesis 2 vorkommen.
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 2 (theographic):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/GEN/2.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Die Datensatzinformationen für das Buchkapitel.
     */
    dataset: Dataset;

    /**
     * Die Buchinformationen für das Buchkapitel.
     */
    book: DatasetBook;

    /**
     * Die Entitätsdaten für das Kapitel.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Der Link zu diesem Kapitel.
     */
    thisChapterLink: string;

    /**
     * Der Link zum nächsten Kapitel.
     * Null, falls dies das letzte Kapitel im Datensatz ist.
     */
    nextChapterApiLink: string | null;

    /**
     * Der Link zum vorherigen Kapitel.
     * Null, falls dies das erste Kapitel im Datensatz ist.
     */
    previousChapterApiLink: string | null;

    /**
     * Die Anzahl der Personen, Orte und Ereignisse, die in dem Kapitel vorkommen.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Die Kapitelnummer.
     */
    number: number;

    /**
     * Die Personen, die in diesem Kapitel vorkommen.
     * Sortiert nach der ersten Strophe, in der sie vorkommen.
     */
    people: ChapterPerson[];

    /**
     * Die Orte, die in diesem Kapitel vorkommen.
     * Sortiert nach der ersten Strophe, in der sie vorkommen.
     */
    places: ChapterPlace[];

    /**
     * Die Ereignisse, die in diesem Kapitel beschrieben werden.
     * Sortiert nach der ersten Strophe, in der sie vorkommen.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * Die ID der Person.
     */
    id: string;

    /**
     * Der Name der Person.
     */
    name: string;

    /**
     * Ob es sich bei dem Namen der Person um einen Eigennamen handelt.
     */
    isProperName?: boolean;

    /**
     * Das Geschlecht der Person.
     */
    gender?: string;

    /**
     * Das Geburtsjahr und das Sterbejahr der Person.
     * Negative Zahlen beziehen sich auf die Jahre vor Christus. Positive Zahlen beziehen sich auf die Jahre nach Christus.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Der API-Link für die Person.
     */
    apiLink: string;

    /**
     * Die Nummern der Verse im Kapitel, in denen die Person erwähnt wird.
     * In aufsteigender Reihenfolge sortiert.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * Die ID des Ortes.
     */
    id: string;

    /**
     * Der Name des Ortes.
     */
    name: string;

    /**
     * Die Art des geographischen Merkmals, das der Ort darstellt.
     */
    featureType?: string;

    /**
     * Die geografische Breite und Länge des Ortes.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Der API-Link für den Ort.
     */
    apiLink: string;

    /**
     * Die Nummern der Verse im Kapitel, in denen der Ort erwähnt wird.
     * In aufsteigender Reihenfolge sortiert.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * Die ID des Ereignisses.
     */
    id: string;

    /**
     * Der Name der Veranstaltung.
     */
    name: string;

    /**
     * Das Datum, an dem die Veranstaltung begann.
     */
    startDate?: string;

    /**
     * Der API-Link für die Veranstaltung.
     */
    apiLink: string;

    /**
     * Die Nummern der Verse im Kapitel, die das Ereignis beschreiben.
     * In aufsteigender Reihenfolge sortiert.
     */
    verses: number[];
}
```

### Beispiel

```json:no-line-numbers title="/api/d/theographic/GEN/2.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "book": {
        "id": "GEN",
        "order": 1,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/d/theographic/GEN/1.json",
        "lastChapterNumber": 50,
        "lastChapterApiLink": "/api/d/theographic/GEN/50.json",
        "numberOfChapters": 50,
        "totalNumberOfVerses": 1343,
        "totalNumberOfReferences": 3346
    },
    "chapter": {
        "number": 2,
        "people": [
            {
                "id": "god_1324",
                "name": "God",
                "isProperName": true,
                "gender": "Male",
                "apiLink": "/api/d/theographic/people/god_1324.json",
                "verses": [2, 3, 4, 5, 7, 8, 9, 15, 16, 18, 19, 21, 22]
            },
            {
                "id": "adam_78",
                "name": "Adam",
                "isProperName": true,
                "gender": "Male",
                "birthYear": -4004,
                "deathYear": -3074,
                "apiLink": "/api/d/theographic/people/adam_78.json",
                "verses": [19, 20, 21, 23]
            }
        ],
        "places": [
            {
                "id": "eden_354",
                "name": "Eden",
                "featureType": "Region",
                "apiLink": "/api/d/theographic/places/eden_354.json",
                "verses": [8, 10, 15]
            },
            {
                "id": "havilah_533",
                "name": "Havilah (of Eden)",
                "featureType": "Region",
                "apiLink": "/api/d/theographic/places/havilah_533.json",
                "verses": [11]
            }
        ],
        "events": [
            {
                "id": "creation-of-all-things_1",
                "name": "Creation of all things",
                "startDate": "-4003",
                "apiLink": "/api/d/theographic/events/creation-of-all-things_1.json",
                "verses": [1, 2, 3]
            },
            {
                "id": "creation-of-adam-and-eve_2",
                "name": "Creation of Adam and Eve",
                "startDate": "-4003",
                "apiLink": "/api/d/theographic/events/creation-of-adam-and-eve_2.json",
                "verses": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            }
        ]
    },
    "thisChapterLink": "/api/d/theographic/GEN/2.json",
    "previousChapterApiLink": "/api/d/theographic/GEN/1.json",
    "nextChapterApiLink": "/api/d/theographic/GEN/3.json",
    "numberOfPeople": 2,
    "numberOfPlaces": 8,
    "numberOfEvents": 2
}
```

## Personen in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Ruft die Liste der für den angegebenen Datensatz verfügbaren Personen ab.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Holen Sie sich die Liste der Personen für den theographischen Datensatz.
fetch(`https://bible.helloao.org/api/d/${dataset}/people.json`)
    .then(request => request.json())
    .then(people => {
        console.log('The theographic dataset has the following people:', people);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Die Datensatzinformationen für die Personen.
     */
    dataset: Dataset;

    /**
     * Die Liste der Personen, die für den Datensatz zur Verfügung stehen.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * Die ID der Person.
     */
    id: string;

    /**
     * Der Name der Person.
     */
    name: string;

    /**
     * Ob es sich bei dem Namen der Person um einen Eigennamen handelt.
     */
    isProperName?: boolean;

    /**
     * Das Geschlecht der Person.
     */
    gender?: string;

    /**
     * Die Anzahl der Bibelstellen, in denen die Person erwähnt wird.
     */
    numberOfReferences: number;

    /**
     * Der API-Link für die Person.
     */
    thisPersonApiLink: string;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/theographic/people.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "people": [
        {
            "id": "paul_2479",
            "name": "Paul",
            "gender": "Male",
            "numberOfReferences": 150,
            "thisPersonApiLink": "/api/d/theographic/people/paul_2479.json"
        },
        {
            "id": "peter_2745",
            "name": "Simon Peter",
            "gender": "Male",
            "numberOfReferences": 129,
            "thisPersonApiLink": "/api/d/theographic/people/peter_2745.json"
        }
    ]
}
```

## Eine Person aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Ermittelt Informationen über eine einzelne Person, einschließlich der Bibelstellen, in denen sie erwähnt wird, sowie ihrer Beziehungen zu anderen Personen, Orten, Ereignissen und Bevölkerungsgruppen.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).
-   `person` die ID der Person (z. B. `paul_2479` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Informationen über Paulus finden Sie im theographischen Datensatz.
fetch(`https://bible.helloao.org/api/d/${dataset}/people/${person}.json`)
    .then(request => request.json())
    .then(person => {
        console.log('Paul:', person);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people/paul_2479.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Die Datensatzinformationen für die Person.
     */
    dataset: Dataset;

    /**
     * Die Informationen über die Person.
     */
    person: DatasetPerson;

    /**
     * Der API-Link für diese Person.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * Die ID der Person.
     */
    id: string;

    /**
     * Der Name der Person.
     */
    name: string;

    /**
     * Andere Namen, mit denen die Person gerufen wird.
     */
    alsoCalled?: string[];

    /**
     * Ob es sich bei dem Namen der Person um einen Eigennamen handelt.
     */
    isProperName?: boolean;

    /**
     * Das Geschlecht der Person.
     */
    gender?: string;

    /**
     * Die Beschreibung der Person. Jeder String entspricht einem Absatz.
     */
    description?: string[];

    /**
     * Das Geburtsjahr und das Sterbejahr der Person.
     * Negative Zahlen beziehen sich auf die Jahre vor Christus. Positive Zahlen beziehen sich auf die Jahre nach Christus.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Das früheste und das letzte Jahr, in dem die Person erwähnt wird.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Der Ort, an dem die Person geboren wurde und an dem sie gestorben ist.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Die familiären Beziehungen der Person.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Die Bevölkerungsgruppen, denen die Person angehört.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Die Ereignisse, an denen die Person teilgenommen hat.
     */
    events?: DatasetEntityRef[];

    /**
     * Die Liste der Bibelstellen, in denen die Person erwähnt wird.
     * Sortiert nach Buchreihenfolge, Kapitel und Vers.
     */
    references: VerseRef[];
}
```

### Beispiel

```json:no-line-numbers title="/api/d/theographic/people/ananias_259.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "person": {
        "id": "ananias_259",
        "name": "Ananias (Disciple at Damascus)",
        "gender": "Male",
        "description": [
            "A Christian at Damascus (Acts 9:10). He became Paul’s instructor; ..."
        ],
        "minYear": 35,
        "maxYear": 60,
        "events": [
            {
                "id": "saul-is-converted_326",
                "type": "events",
                "name": "Saul is converted",
                "apiLink": "/api/d/theographic/events/saul-is-converted_326.json"
            }
        ],
        "references": [
            { "book": "ACT", "chapter": 9, "verse": 10 },
            { "book": "ACT", "chapter": 9, "verse": 12, "endVerse": 13 },
            { "book": "ACT", "chapter": 9, "verse": 17 },
            { "book": "ACT", "chapter": 22, "verse": 12 }
        ]
    },
    "thisPersonApiLink": "/api/d/theographic/people/ananias_259.json"
}
```

## Orte in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Ruft die Liste der für den angegebenen Datensatz verfügbaren Orte ab.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).

### Struktur

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Die Datensatzinformationen für die Orte.
     */
    dataset: Dataset;

    /**
     * Die Liste der für den Datensatz verfügbaren Orte.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * Die ID des Ortes.
     */
    id: string;

    /**
     * Der Name des Ortes.
     */
    name: string;

    /**
     * Die Art des geographischen Merkmals, das der Ort darstellt.
     * Zum Beispiel „Stadt“, „Region“, „Berg“, „Wasser“ usw.
     */
    featureType?: string;

    /**
     * Die geografische Breite und Länge des Ortes.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Die Anzahl der Bibelstellen, die den Ort erwähnen.
     */
    numberOfReferences: number;

    /**
     * Der API-Link für den Ort.
     */
    thisPlaceApiLink: string;
}
```

## Einen Platz aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Ruft Informationen über einen bestimmten Ort ab, einschließlich der Bibelstellen, die ihn erwähnen, sowie der damit verbundenen Personen und Ereignisse.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).
-   `place` die ID des Ortes (z. B. `jerusalem_636` ).

### Struktur

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Die Datensatzinformationen für den Ort.
     */
    dataset: Dataset;

    /**
     * Die Informationen über den Ort.
     */
    place: DatasetPlace;

    /**
     * Der API-Link für diesen Ort.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * Die ID des Ortes.
     */
    id: string;

    /**
     * Der Name des Ortes.
     */
    name: string;

    /**
     * Der Name des Ortes, wie er in der King-James-Übersetzung und der englischen Standardübersetzung erscheint.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Andere Namen, unter denen der Ort bekannt ist.
     */
    aliases?: string[];

    /**
     * Die Art des geographischen Merkmals, das der Ort darstellt.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * Die geografische Breite und Länge des Ortes und wie genau diese Angaben sind.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Die Beschreibung des Ortes. Jeder String entspricht einem Absatz.
     */
    description?: string[];

    /**
     * Der Kommentar der Autoren des Datensatzes zu diesem Ort.
     */
    comment?: string;

    /**
     * Der Ursprung dieses Ortes.
     * Unterschiedliche Bezeichnungen für denselben geografischen Ort haben denselben Ursprung.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Der Ort, von dem dieser Ort ein Duplikat ist.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Die Menschen, die an diesem Ort waren, dort geboren wurden oder dort gestorben sind.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Die Ereignisse, die sich an diesem Ort zugetragen haben.
     */
    events?: DatasetEntityRef[];

    /**
     * Die Liste der Bibelstellen, die den Ort erwähnen.
     * Sortiert nach Buchreihenfolge, Kapitel und Vers.
     */
    references: VerseRef[];
}
```

### Beispiel

```json:no-line-numbers title="/api/d/theographic/places/damascus_322.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "place": {
        "id": "damascus_322",
        "name": "Damascus",
        "kjvName": "Damascus",
        "esvName": "Damascus",
        "featureType": "City",
        "latitude": 33.511612,
        "longitude": 36.309102,
        "description": [
            "Activity, the most ancient of Oriental cities; the capital of Syria; ..."
        ],
        "events": [
            {
                "id": "saul-is-converted_326",
                "type": "events",
                "name": "Saul is converted",
                "apiLink": "/api/d/theographic/events/saul-is-converted_326.json"
            }
        ],
        "references": [
            { "book": "GEN", "chapter": 14, "verse": 15 },
            { "book": "GEN", "chapter": 15, "verse": 2 }
        ]
    },
    "thisPlaceApiLink": "/api/d/theographic/places/damascus_322.json"
}
```

## Ereignisse in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Ruft die Liste der für den angegebenen Datensatz verfügbaren Ereignisse ab.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).

### Struktur

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Die Datensatzinformationen für die Ereignisse.
     */
    dataset: Dataset;

    /**
     * Die Liste der Ereignisse, die für den Datensatz verfügbar sind.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * Die ID des Ereignisses.
     */
    id: string;

    /**
     * Der Name der Veranstaltung.
     */
    name: string;

    /**
     * Das Datum, an dem die Veranstaltung begann.
     * Negative Zahlen beziehen sich auf die Jahre vor Christus. Positive Zahlen beziehen sich auf die Jahre nach Christus.
     * Genauere Datumsangaben verwenden das Format `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Die Anzahl der Bibelstellen, die das Ereignis beschreiben.
     */
    numberOfReferences: number;

    /**
     * Der API-Link für die Veranstaltung.
     */
    thisEventApiLink: string;
}
```

## Ein Ereignis aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Ruft Informationen über ein einzelnes Ereignis ab, einschließlich der Bibelstellen, die es beschreiben, sowie der damit verbundenen Personen, Orte und Volksgruppen.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).
-   `event` die ID des Ereignisses (z. B. `saul-is-converted_326` ).

### Struktur

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Die Datensatzinformationen für das Ereignis.
     */
    dataset: Dataset;

    /**
     * Informationen zur Veranstaltung.
     */
    event: DatasetEvent;

    /**
     * Der API-Link für dieses Ereignis.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * Die ID des Ereignisses.
     */
    id: string;

    /**
     * Der Name der Veranstaltung.
     */
    name: string;

    /**
     * Das Datum, an dem die Veranstaltung begann.
     */
    startDate?: string;

    /**
     * Die Dauer der Veranstaltung.
     * Zum Beispiel steht „1D“ für einen Tag und „40Y“ für vierzig Jahre.
     */
    duration?: string;

    /**
     * Die Personen, die an der Veranstaltung teilgenommen haben.
     */
    participants?: DatasetEntityRef[];

    /**
     * Die Orte, an denen das Ereignis stattfand.
     */
    locations?: DatasetEntityRef[];

    /**
     * Die an der Veranstaltung beteiligten Bevölkerungsgruppen.
     */
    groups?: DatasetEntityRef[];

    /**
     * Das Ereignis, zu dem dieses Ereignis gehört.
     */
    partOf?: DatasetEntityRef;

    /**
     * Das Ereignis, das diesem Ereignis vorausging.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Die Liste der Bibelstellen, die das Ereignis beschreiben.
     * Sortiert nach Buchreihenfolge, Kapitel und Vers.
     */
    references: VerseRef[];
}
```

### Beispiel

```json:no-line-numbers title="/api/d/theographic/events/saul-is-converted_326.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "event": {
        "id": "saul-is-converted_326",
        "name": "Saul is converted",
        "startDate": "0032",
        "duration": "1D",
        "participants": [
            {
                "id": "holy_spirit_7400",
                "type": "people",
                "name": "Holy Spirit",
                "apiLink": "/api/d/theographic/people/holy_spirit_7400.json"
            },
            {
                "id": "ananias_259",
                "type": "people",
                "name": "Ananias (Disciple at Damascus)",
                "apiLink": "/api/d/theographic/people/ananias_259.json"
            },
            {
                "id": "paul_2479",
                "type": "people",
                "name": "Paul",
                "apiLink": "/api/d/theographic/people/paul_2479.json"
            }
        ],
        "locations": [
            {
                "id": "damascus_322",
                "type": "places",
                "name": "Damascus",
                "apiLink": "/api/d/theographic/places/damascus_322.json"
            }
        ],
        "predecessor": {
            "id": "conversion-of-ethiopian-eunuch_325",
            "type": "events",
            "name": "Conversion of Ethiopian Eunuch",
            "apiLink": "/api/d/theographic/events/conversion-of-ethiopian-eunuch_325.json"
        },
        "references": [
            { "book": "ACT", "chapter": 9, "verse": 1, "endVerse": 19 }
        ]
    },
    "thisEventApiLink": "/api/d/theographic/events/saul-is-converted_326.json"
}
```

## Personengruppen in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Gibt die Liste der für den angegebenen Datensatz verfügbaren Personengruppen zurück.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).

### Struktur

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Die Datensatzinformationen für die Bevölkerungsgruppen.
     */
    dataset: Dataset;

    /**
     * Die Liste der für den Datensatz verfügbaren Personengruppen.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * Die Kennung der Volksgruppe.
     */
    id: string;

    /**
     * Der Name der Volksgruppe.
     */
    name: string;

    /**
     * Die Anzahl der Personen, die der Volksgruppe angehören.
     */
    numberOfMembers: number;

    /**
     * Der API-Link für die Personengruppe.
     */
    thisPeopleGroupApiLink: string;
}
```

## Eine Personengruppe aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Ermittelt Informationen über eine einzelne Personengruppe, einschließlich ihrer Mitglieder und der Ereignisse, an denen die Gruppe teilgenommen hat.

-   `dataset` die ID des Datensatzes (z. B. `theographic` ).
-   `group` die ID der Personengruppe (z. B. `tribe-of-benjamin` ).

### Struktur

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Die Datensatzinformationen für die Personengruppe.
     */
    dataset: Dataset;

    /**
     * Die Informationen über die Volksgruppe.
     */
    group: DatasetPeopleGroup;

    /**
     * Der API-Link für diese Personengruppe.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * Die Kennung der Volksgruppe.
     */
    id: string;

    /**
     * Der Name der Volksgruppe.
     */
    name: string;

    /**
     * Die Personen, die Mitglieder dieser Volksgruppe sind.
     */
    members?: DatasetEntityRef[];

    /**
     * Die Ereignisse, an denen die Volksgruppe teilgenommen hat.
     */
    events?: DatasetEntityRef[];

    /**
     * Die Liste der Bibelstellen, die die Volksgruppe erwähnen.
     * Sortiert nach Buchreihenfolge, Kapitel und Vers.
     */
    references: VerseRef[];
}
```

### Beispiel

```json:no-line-numbers title="/api/d/theographic/groups/tribe-of-benjamin.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "group": {
        "id": "tribe-of-benjamin",
        "name": "Tribe of Benjamin",
        "members": [
            {
                "id": "abiah_17",
                "type": "people",
                "name": "Abiah",
                "apiLink": "/api/d/theographic/people/abiah_17.json"
            },
            {
                "id": "abihud_34",
                "type": "people",
                "name": "Abihud",
                "apiLink": "/api/d/theographic/people/abihud_34.json"
            }
        ],
        "references": []
    },
    "thisPeopleGroupApiLink": "/api/d/theographic/groups/tribe-of-benjamin.json"
}
```
