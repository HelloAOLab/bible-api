# Datensätze

Endpunkte zum Durchsuchen ergänzender Bibeldatensätze – wie Querverweise, biblische Entitäten (Personen, Orte, Ereignisse und Volksgruppen), interlineare Wörter in der Originalsprache, Lexika und Kandidaten für den Vers des Tages – und zum Abrufen ihrer Bücher, Kapitelinhalte, Entitäten, Lexikoneinträge und Verskategorien.

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
     * Die API fügte Hinweise zur Lizenz hinzu.
     * Null oder undefiniert, wenn keine Notizen vorhanden sind.
     */
    licenseNotes?: string | null;

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
     * 0 für Datensätze, die keine Querverweise enthalten.
     */
    totalNumberOfReferences: number;

    /**
     * Die Gesamtzahl der in diesem Datensatz enthaltenen interlinearen Wörter.
     * Wird weggelassen, wenn der Datensatz keine interlinearen Wörter enthält.
     */
    totalNumberOfWords?: number;

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

    /**
     * Der API-Link für die Liste der Lexikoneinträge im Datensatz.
     * Wird weggelassen, wenn der Datensatz keine Lexikoneinträge enthält.
     */
    listOfLexiconApiLink?: string;

    /**
     * Die Gesamtzahl der im Datensatz enthaltenen Lexikoneinträge.
     * Wird weggelassen, wenn der Datensatz keine Lexikoneinträge enthält.
     */
    totalNumberOfLexicon?: number;

    /**
     * Der API-Link für die Liste aller Verse im Datensatz mit ihren Kategorien.
     * Wird weggelassen, wenn die Verse des Datensatzes keine Kategorien haben.
     */
    listOfVersesApiLink?: string;

    /**
     * Der API-Link für die Liste der Verskategorien im Datensatz.
     * Wird weggelassen, wenn der Datensatz keine Verskategorien enthält.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Die Gesamtzahl der im Datensatz enthaltenen Verskategorien.
     * Wird weggelassen, wenn der Datensatz keine Verskategorien enthält.
     */
    totalNumberOfCategories?: number;
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
        },
        {
            "id": "bsb-interlinear",
            "name": "Berean Standard Bible Interlinear",
            "website": "https://bereanbible.com/",
            "licenseUrl": "https://berean.bible/terms.htm",
            "licenseNotes": "The Berean Standard Bible and its interlinear tables are in the public domain. Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Berean Standard Bible Interlinear",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/bsb-interlinear/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 31102,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "totalNumberOfWords": 443625
        },
        {
            "id": "stepbible-lexicon",
            "name": "STEPBible Brief Lexicons",
            "website": "https://github.com/STEPBible/STEPBible-Data",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "The Translators Brief lexicons of Extended Strongs (TBESH and TBESG) are by STEPBible.org / Tyndale House, Cambridge, and are licensed under CC BY 4.0. Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "STEPBible Brief Lexicons",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/stepbible-lexicon/books.json",
            "numberOfBooks": 0,
            "totalNumberOfChapters": 0,
            "totalNumberOfVerses": 0,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfLexiconApiLink": "/api/d/stepbible-lexicon/lexicon.json",
            "totalNumberOfLexicon": 18085
        },
        {
            "id": "history-globe",
            "name": "History Globe",
            "website": "https://historyglobe.app",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "History Globe by Vadym Arnaut (https://historyglobe.app) is licensed under CC BY 4.0. Its places, verse tags, and coordinates start from the OpenBible.info Bible Geocoding Data (CC BY 4.0), with corrections, and some coordinates are from Wikidata (CC0). Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "History Globe",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/history-globe/books.json",
            "numberOfBooks": 61,
            "totalNumberOfChapters": 849,
            "totalNumberOfVerses": 5546,
            "totalNumberOfReferences": 8617,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfPlacesApiLink": "/api/d/history-globe/places.json",
            "totalNumberOfPlaces": 1231
        },
        {
            "id": "verse-of-the-day",
            "name": "Verse of the Day",
            "website": "https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts",
            "licenseUrl": "https://github.com/HelloAOLab/bible-api/blob/main/LICENSE",
            "licenseNotes": "A curated list of well-known verses by AO Lab, released under the MIT License.",
            "englishName": "Verse of the Day",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/verse-of-the-day/books.json",
            "numberOfBooks": 65,
            "totalNumberOfChapters": 381,
            "totalNumberOfVerses": 750,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json",
            "listOfCategoriesApiLink": "/api/d/verse-of-the-day/categories.json",
            "totalNumberOfCategories": 31
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

Bei Datensätzen mit Querverweisen (wie z. B. `open-cross-ref` ) enthält das Kapitel die Liste der Querverweise für jeden Vers. Bei interlinearen Datensätzen (wie z. B. `bsb-interlinear` ) enthält das Kapitel die Wörter jedes Verses in der Originalsprache – siehe [Interlineare Datensätze](#interlinear-datasets) . Bei Entitätsdatensätzen (wie z. B. `theographic` ) enthält das Kapitel die Personen, Orte und Ereignisse, die im Kapitel vorkommen – siehe [Entitäten in einem Kapitel abrufen](#get-the-entities-in-a-chapter) . Im Datensatz `verse-of-the-day` enthält das Kapitel die Kandidaten für den Vers des Tages und ihre Kategorien – siehe [Vers des Tages](#verse-of-the-day) .

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

/**
 * Einem Vers ist der Wert `references` zugeordnet (Querverweisdatensätze), `words` (interlineare Datensätze) oder `categories` (der Vers des Tages-Datensatzes).
 * Prüfen Sie, welcher Wert mit `'words' in verse` oder `'categories' in verse` angegeben ist.
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * Die Versnummer.
     */
    verse: number;

    /**
     * Die Originalwörter des Verses in der Reihenfolge des Originaltextes.
     * Siehe unten „Interlineare Datensätze“.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Die Versnummer.
     * Wenn `endVerse` vorhanden ist, dann ist dies der Vers, mit dem die Passage beginnt.
     */
    verse: number;

    /**
     * Der Vers, mit dem die Passage endet.
     * Wird weggelassen, wenn der Eintrag nur aus einer einzigen Strophe besteht.
     */
    endVerse?: number;

    /**
     * Die IDs der Kategorien, zu denen der Vers gehört, die relevantesten zuerst.
     * Siehe unten den „Vers des Tages“.
     */
    categories: string[];

    /**
     * Das erste Jahr, in dem der Vers zum Vers des Tages gewählt werden kann.
     * Wird weggelassen, wenn der Vers schon immer in der Liste enthalten war.
     */
    addedIn?: number;

    /**
     * Das erste Jahr, in dem der Vers nicht mehr der Vers des Tages sein kann.
     * Entfernte Verse bleiben im Datensatz erhalten, sodass die Verse aus früheren Jahren weiterhin ausgewählt werden können.
     * Wird ausgelassen, wenn der Vers nicht aus der Liste entfernt wurde.
     */
    removedIn?: number;
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

// Die Struktur von InterlinearWord ist unter „Interlinear Datasets“ weiter unten beschrieben.
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

Der [History Globe-](https://historyglobe.app) Datensatz ( `history-globe` ) enthält ausschließlich Orte: die in der Bibel genannten Orte mit ihren Koordinaten und den entsprechenden Bibelversen. Seine Orts-IDs (z. B. `a15257a` für Jerusalem) sind die stabilen Orts-IDs von History Globe, dieselben, die auch die [Open-Data-API](https://historyglobe.app/docs/api.html) verwendet. Daher ändern sie sich nicht, wenn ein Name korrigiert wird. Die `featureType` Werte entsprechen denen des Theographic-Datensatzes ( `City` , `Region` , `Water` usw.), und `featureSubType` enthält, sofern vorhanden, die spezifischere Ortsangabe (z. B. `River` , `Gate` , `Spring` ).

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

### History Globe Attribution

Die Daten von History Globe sind unter [der CC BY 4.0-](https://creativecommons.org/licenses/by/4.0/) Lizenz lizenziert. Bei Verwendung ist History Globe ( https://historyglobe.app ) sowie die zugrunde liegenden Geodaten der Bibel von OpenBible.info als Quelle anzugeben. Änderungen sind zu vermerken. Die Quellenangabe befindet sich im Datensatz ( `licenseNotes` .

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

Ermittelt Informationen über eine einzelne Person, einschließlich der Bibelstellen, in denen sie erwähnt wird, sowie ihrer Beziehungen zu anderen Personen, Orten, Ereignissen und Volksgruppen.

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

## Interlineare Datensätze

Der Berean-Interlineardatensatz ( `bsb-interlinear` ) listet die Wörter jedes Bibelverses in den Originalsprachen (Hebräisch, Aramäisch und Griechisch) in der Reihenfolge ihres Erscheinens im Originaltext auf. Jedes Wort ist mit seiner Transliteration, grammatikalischen Analyse, [Strong-Nummer](https://en.wikipedia.org/wiki/Strong%27s_Concordance) und der englischen Formulierung der [Berean Standard Bible](https://berean.bible) versehen.

Der Datensatz verwendet die gleichen Endpunkte wie andere Datensätze:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` listet die 66 Bücher auf.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (z. B. `/api/d/bsb-interlinear/GEN/1.json` ) gibt das Kapitel zurück, wobei für jeden Vers `{ verse, words }` . Die Antwort ist ein [Datensatz namens „chapter“](#get-a-chapter-from-a-dataset) .

Die Wortdaten stammen aus den [interlinearen Tabellen der Berean Standard Bible](https://bereanbible.com/) , die gemeinfrei sind. Die Strong-Nummern der Wörter werden im [Lexikon](#lexicon) nachgeschlagen ( `stepbible-lexicon` ).

### Struktur

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Der Rang des Wortes, basierend auf 1, in der Reihenfolge des Originaltextes.
     * Die Wörter sind in dieser Reihenfolge aufgelistet.
     */
    pos: number;

    /**
     * Der Rang des Wortes basierend auf 1 in der englischen Wortreihenfolge der Berean Standard Bible.
     */
    bsbPos: number;

    /**
     * Die Sprache des Wortes.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Das Wort im Originalskript. NFC-normalisiert.
     */
    text: string;

    /**
     * Die Transliteration des Wortes.
     */
    transliteration: string | null;

    /**
     * Der kurze grammatikalische Analysecode des Wortes. z. B. "N-mp" oder "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Die ausgeschriebene grammatikalische Zerlegung des Wortes.
     */
    parsingFull: string | null;

    /**
     * Die mit Nullen aufgefüllte Strong-Nummer des Wortes. z. B. „H0430“ oder „G3056“.
     * Mit Nullen aufgefüllt, was den `.words.json` der KJV entspricht.
     * Bei anderen Übersetzungen müssen die Werte möglicherweise mit Nullen aufgefüllt und Suffixe entfernt werden, bevor sie zusammengefügt werden können.
     * Null, wenn die Quelle dem Wort keine Strong-Nummer angibt (dies ist bei einigen Wörtern der Fall, die Suffixe sind, wie z. B. Pronomensuffixe).
     */
    strongs: string | null;

    /**
     * Die englische Formulierung des Wortes in der Berean Standard Bible.
     * Nichtig, wenn die BSB das Wort nicht übersetzt (wie zum Beispiel die hebräische Markierung des direkten Objekts).
     */
    gloss: string | null;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/bsb-interlinear/GEN/1.json"
{
    "dataset": {
        "id": "bsb-interlinear",
        "name": "Berean Standard Bible Interlinear",
        "totalNumberOfWords": 443625
        // ...
    },
    "book": {
        "id": "GEN",
        "datasetId": "bsb-interlinear",
        "order": 1,
        "numberOfChapters": 50
        // ...
    },
    "chapter": {
        "number": 1,
        "content": [
            {
                "verse": 1,
                "words": [
                    {
                        "pos": 1,
                        "bsbPos": 1,
                        "language": "hebrew",
                        "text": "בְּרֵאשִׁ֖ית",
                        "transliteration": "bə·rê·šîṯ",
                        "parsing": "Prep-b | N-fs",
                        "parsingFull": "Preposition-b | Noun - feminine singular",
                        "strongs": "H7225",
                        "gloss": "In the beginning"
                    },
                    {
                        "pos": 2,
                        "bsbPos": 4,
                        "language": "hebrew",
                        "text": "בָּרָ֣א",
                        "transliteration": "bā·rā",
                        "parsing": "V-Qal-Perf-3ms",
                        "parsingFull": "Verb - Qal - Perfect - third person masculine singular",
                        "strongs": "H1254",
                        "gloss": "created"
                    }
                    // ...
                ]
            }
            // ...
        ]
    },
    "thisChapterLink": "/api/d/bsb-interlinear/GEN/1.json",
    "nextChapterApiLink": "/api/d/bsb-interlinear/GEN/2.json",
    "previousChapterApiLink": null,
    "numberOfVerses": 31,
    "numberOfReferences": 0
}
```

### Verknüpfung von Wörtern mit Übersetzungen

Interlineare `strongs` werden mit Nullen aufgefüllt (z. B. `H0430` ). Dies entspricht den `strongs` Werten in den Wortanmerkungen der KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Werte anderer Übersetzungen müssen möglicherweise mit Nullen aufgefüllt und Suffixe entfernt werden (z. B. `H430` oder `H1961a` zu `H0430` und `H1961` ), bevor sie zusammengefügt werden können.

-   **KJV.** Für die King-James-Version ( `eng_kjv` und `eng_kja` ) werden die Strong-Nummern in der Datei `.words.json` eines Kapitels mit den `strongs` der interlinearen Wörter desselben Verses verknüpft. Beispielsweise erscheint jede Strong-Nummer, die in `/api/eng_kjv/GEN/1.words.json` für Vers 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) angegeben ist, als Wert `strongs` unter den Wörtern von Vers 1 in `/api/d/bsb-interlinear/GEN/1.json` .
-   **Berean Standard Bible.** Die Zahl `gloss` jedes Wortes entspricht der BSB-Übersetzung. Gehen Sie die Wörter des Verses der Reihe `bsbPos` durch und vergleichen Sie jede Zahl `gloss` mit dem Verstext der BSB-Übersetzung, um die entsprechende Stelle zu finden.

Die Nummerierung der beiden Quellen stimmt nicht immer überein. Beispielsweise ist in der KJV-Tabelle für „was“ der Wert `G2258` vergeben, während er in der Berean-Tabelle `G1510` lautet. Aufgrund solcher Unterschiede schlagen einige Joins fehl.

### Quellenangabe

Die interlinearen Tafeln von Berean sind gemeinfrei. Das [Lexikon](#lexicon) ist unter der CC BY 4.0-Lizenz lizenziert und erfordert eine Namensnennung.

## Lexikon

Der STEPBible-Lexikondatensatz ( `stepbible-lexicon` ) enthält die hebräischen, aramäischen und griechischen Kurzlexika (TBESH und TBESG) von [STEPBible.org](https://www.stepbible.org/) , Tyndale House, Cambridge. Er enthält einen Eintrag für jede Strong-Nummer, und jeder Eintrag umfasst eine oder mehrere Bedeutungen mit Lemma, Transliteration, Wortart, englischer Glosse und Definition.

Jeder mit Nullen aufgefüllte Wert `strongs` eines [interlinearen Wortes](#interlinear-datasets) mit Lexikoneintrag kann ohne Umformatierung unter Punkt `/api/d/stepbible-lexicon/lexicon/{strongs}.json` nachgeschlagen werden. Dasselbe gilt für die Werte `.words.json` der KJV; Werte anderer Übersetzungen müssen gegebenenfalls vorher mit Nullen aufgefüllt und Suffixe entfernt werden. Griechische Einträge, die das Lexikon ohne Strong-Nummer hinzufügt, werden nicht veröffentlicht.

Datensätze, die Lexikoneinträge enthalten, enthalten `listOfLexiconApiLink` und `totalNumberOfLexicon` in ihrem Eintrag in `/api/available_datasets.json` .

### Quellenangabe

Die Lexikondaten sind unter [der CC BY 4.0-](https://creativecommons.org/licenses/by/4.0/) Lizenz lizenziert. Bei Verwendung ist STEPBible.org / Tyndale House, Cambridge, als Quelle anzugeben und Änderungen zu vermerken. Die Quelle ist im Datensatz unter der Nummer `licenseNotes` angegeben.

## Lexikoneinträge in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Ruft die Liste der für einen Datensatz verfügbaren Lexikoneinträge ab.

-   `dataset` die ID des Datensatzes (z. B. `stepbible-lexicon` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-lexicon.js"
fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json`)
    .then(request => request.json())
    .then(lexicon => {
        console.log('The lexicon has', lexicon.lexicon.length, 'entries');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Die Datensatzinformationen für das Lexikon.
     */
    dataset: Dataset;

    /**
     * Die Liste der für den Datensatz verfügbaren Lexikoneinträge.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Die mit Nullen aufgefüllte Strong-Nummer des Lexikoneintrags. z. B. „H0430“.
     */
    id: string;

    /**
     * Die Sprache des Lexikoneintrags.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Der Name des Lexikoneintrags.
     * Dies ist das Lemma der ersten Bedeutung des Eintrags.
     */
    name: string;

    /**
     * Der API-Link für den Lexikoneintrag.
     */
    apiLink: string;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/stepbible-lexicon/lexicon.json"
{
    "dataset": {
        "id": "stepbible-lexicon",
        "name": "STEPBible Brief Lexicons",
        "totalNumberOfLexicon": 18085
        // ...
    },
    "lexicon": [
        {
            "id": "G0001",
            "language": "greek",
            "name": "α, Ἀλφα",
            "apiLink": "/api/d/stepbible-lexicon/lexicon/G0001.json"
        },
        {
            "id": "G0002",
            "language": "greek",
            "name": "Ἀαρών",
            "apiLink": "/api/d/stepbible-lexicon/lexicon/G0002.json"
        }
        // ...
    ]
}
```

## Einen Lexikoneintrag aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Ruft den Lexikoneintrag für eine einzelne Strong-Nummer mit allen ihren Bedeutungen ab.

-   `dataset` die ID des Datensatzes (z. B. `stepbible-lexicon` ).
-   `strongs` ist die mit Nullen aufgefüllte Strong-Nummer (z. B. `H0430` für das hebräische Wort _elohim_ oder `G3056` für das griechische Wort _logos_).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-lexicon-entry.js"
const strongs = 'H1254';

fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/${strongs}.json`)
    .then(request => request.json())
    .then(({ entry }) => {
        console.log('H1254:', entry.senses.map(sense => sense.gloss));
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/H1254.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Die Datensatzinformationen für den Lexikoneintrag.
     */
    dataset: Dataset;

    /**
     * Der Lexikoneintrag.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Der API-Link für diesen Lexikoneintrag.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Die mit Nullen aufgefüllte Strong-Nummer des Eintrags. z. B. „H0430“.
     */
    id: string;

    /**
     * Die Sprache des Eintrags.
     * Dies ist die Sprache der ersten Bedeutung des Eintrags.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Die Bedeutungen des Eintrags, in der Reihenfolge der IDs.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * Die erweiterte Kennung des Sinns. z. B. „H0001G“.
     * Gleich der Basis-Strong-Zahl, wenn die Zahl nur eine Bedeutung hat.
     */
    id: string;

    /**
     * Die Sprache der Sinne.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Das Lemma des Sinns im Originalskript.
     */
    lemma: string;

    /**
     * Die Transliteration des Lemmas.
     */
    transliteration: string | null;

    /**
     * Der Wortartencode (morphologischer Code) der Bedeutung.
     */
    partOfSpeech: string | null;

    /**
     * Die kurze englische Erklärung des Sinns.
     */
    gloss: string | null;

    /**
     * Die Definition des Sinns als Klartext.
     * Absätze werden durch Leerzeilen getrennt. Formatierungen im Quelltext werden entfernt.
     */
    definition: string;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/stepbible-lexicon/lexicon/H1254.json"
{
    "dataset": {
        "id": "stepbible-lexicon",
        "name": "STEPBible Brief Lexicons",
        "totalNumberOfLexicon": 18085
        // ...
    },
    "entry": {
        "id": "H1254",
        "language": "hebrew",
        "senses": [
            {
                "id": "H1254A",
                "language": "hebrew",
                "lemma": "בָּרָא",
                "transliteration": "ba.ra",
                "partOfSpeech": "V",
                "gloss": "to create",
                "definition": "1) to create, shape, form\n\n1a) (Qal) to shape, fashion, create (always with God as subject)\n\n1b) (Niphal) to be created"
            },
            {
                "id": "H1254B",
                "language": "hebrew",
                "lemma": "בָּרָא",
                "transliteration": "ba.ra",
                "partOfSpeech": "V",
                "gloss": "to fatten",
                "definition": "1) to be fat\n\n1a) (Hiphil) to make yourselves fat"
            }
        ]
    },
    "thisLexiconEntryApiLink": "/api/d/stepbible-lexicon/lexicon/H1254.json"
}
```

## Tagesvers

Der Datensatz „Vers des Tages“ ( `verse-of-the-day` ) ist eine kuratierte Liste bekannter Verse und kurzer Abschnitte (maximal drei Verse), die sich gut als „Vers des Tages“ eignen: mehr als 640 für jeden Tag des Jahres und mehr als 100 für christliche Feiertage. Jeder einzelne ist für sich genommen verständlich.

Jeder Vers für jeden Tag ist einer bis drei Kategorien zugeordnet, wobei die relevanteste zuerst genannt wird, und zwar aus diesem festen Set:

| AUSWEIS       | Beschreibung                                                          |
| ------------- | --------------------------------------------------------------------- |
| `comfort`     | Gottes Nähe und Fürsorge in Trauer, Not und Einsamkeit.               |
| `courage`     | Standhaft bleiben und keine Angst haben.                              |
| `faith`       | Gott und seinen Verheißungen vertrauen.                               |
| `forgiveness` | Gottes Vergebung der Sünden und die Vergebung anderer.                |
| `gratitude`   | Dank sei Gott.                                                        |
| `guidance`    | Gott lenkt unsere Schritte, Pläne und Entscheidungen.                 |
| `hope`        | Vertrauen in die Zukunft, die Gott verheißen hat.                     |
| `inspiration` | Ermutigung, den Glauben zu leben und Gutes zu tun.                    |
| `joy`         | Freude und Jubel in Gott.                                             |
| `love`        | Gottes Liebe zu uns und unsere Liebe zu Gott und unseren Mitmenschen. |
| `peace`       | Ruhe, Stille und Freiheit von Ängsten.                                |
| `praise`      | Anbetung und Verkündigung der Größe Gottes.                           |
| `prayer`      | Ich rufe Gott und sein Versprechen an, mich zu erhören.               |
| `provision`   | Gott versorgt uns mit allem, was wir brauchen.                        |
| `salvation`   | Erlösung, Gnade und neues Leben in Christus.                          |
| `strength`    | Gott verleiht Kraft und Ausdauer.                                     |
| `wisdom`      | Göttliche Weisheit und praktische Lebensanleitung.                    |

Feiertage haben ihre eigenen Kategorien. An einem Feiertag ist der Tagesvers ein spezieller Feiertagsvers, der an anderen Tagen nicht verwendet wird. Ein Feiertag dauert in der Regel einen Tag; der Feiertag nach Ostern umfasst die drei Tage nach Ostern und listet daher alle drei Daten auf. Jede Feiertagskategorie hat eine `holiday` mit ihren Daten: Feiertage, die jedes Jahr am selben Datum stattfinden, haben eine `month` oder `day` , und Feiertage, deren Datum sich jährlich ändert (weil sie vom Ostersonntag oder dem Advent abhängen), führen ihre `dates` im Gregorianischen Kalender auf, vorab berechnet für die Jahre 2026 bis 2125.

| AUSWEIS                    | Urlaub                | Datum                               |
| -------------------------- | --------------------- | ----------------------------------- |
| `epiphany`                 | Epiphanie             | 6. Januar                           |
| `ash-wednesday`            | Aschermittwoch        | 46 Tage vor Ostersonntag            |
| `palm-sunday`              | Palmsonntag           | Der Sonntag vor dem Ostersonntag    |
| `maundy-thursday`          | Gründonnerstag        | Der Donnerstag vor dem Ostersonntag |
| `good-friday`              | Karfreitag            | Der Freitag vor dem Ostersonntag    |
| `resurrection-sunday`      | Auferstehungssonntag  | Ostersonntag                        |
| `post-resurrection-sunday` | Nach dem Ostersonntag | Die drei Tage nach dem Ostersonntag |
| `ascension-day`            | Himmelfahrtstag       | 39 Tage nach Ostersonntag           |
| `pentecost`                | Pfingsten             | 49 Tage nach Ostersonntag           |
| `all-hallows-eve`          | Allerheiligenabend    | 31. Oktober                         |
| `all-saints-day`           | Allerheiligen         | 1. November                         |
| `advent-sunday`            | Erster Adventssonntag | Der vierte Sonntag vor Weihnachten  |
| `christmas-eve`            | Heiligabend           | 24. Dezember                        |
| `christmas`                | Weihnachten           | 25. Dezember                        |

Der Datensatz enthält nur Verweise, nicht den Verstext, daher ist er mit jeder Übersetzung kompatibel. Die Versnummern entsprechen der englischen Standardnummerierung (wie in der BSB). Die Daten können auf drei Arten gelesen werden:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) listet alle Verse des Datensatzes mit ihren Kategorien und die Feiertage mit ihren Daten in einer Datei auf.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) listet alle Verse einer Kategorie auf. Dies ist der einfachste Weg, einen Tagesvers aus einer Kategorie auszuwählen.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) listet die Kandidaten eines Kapitels mit ihren Kategorien auf. Es werden nur Kapitel angezeigt, die einen Kandidaten enthalten; verwenden Sie die Kapitellinks des Buches oder `/api/d/verse-of-the-day/books.json` , um diese zu finden.

Datensätze, die Verskategorien enthalten, umfassen `listOfVersesApiLink` , `listOfCategoriesApiLink` , und `totalNumberOfCategories` in ihrem Eintrag in `/api/available_datasets.json` .

### Auswahl eines Tagesverses

Die API besteht aus statischen Dateien und wählt daher keinen Bibelvers automatisch aus. Stattdessen gibt es eine Konvention für die Auswahl, sodass alle Apps, die dieser folgen, am selben Tag denselben Vers anzeigen. Apps können natürlich auch andere Verse wählen; die Konvention dient lediglich als gemeinsamer Standard.

Die Konvention wählt Verse und Feiertage aus dem Datensatz `/api/d/verse-of-the-day/verses.json` aus. An einem Feiertag wird jeweils ein Vers des Feiertags ausgewählt, wobei die Verse Jahr für Jahr durchgegangen werden. So hat jeder Feiertag jedes Jahr einen anderen Vers, bis alle seine Verse verwendet wurden. An anderen Tagen erhält jedes Jahr eine eigene zufällige Reihenfolge der in diesem Jahr verwendeten Verse (geordnet nach einem Hash der Versreferenz, dem Jahr und einem optionalen Startwert). Der Vers des Tages ist derjenige, der am jeweiligen Tag des Jahres in dieser Reihenfolge vorkommt. Der Datensatz enthält mehr als 366 Verse für jeden Tag und jedes Jahr, sodass sich kein Vers innerhalb eines Kalenderjahres wiederholt, die Reihenfolge jährlich wechselt und dasselbe Datum immer denselben Vers ergibt. Neue Verse werden nur für ein `removedIn` nicht begonnenes Jahr hinzugefügt (mit `addedIn` ) und alte nur für ein noch nicht begonnenes Jahr entfernt, sodass sich der Vers des Tages für ein vergangenes Datum nie ändert.

Auf der Seite [„Vers des Tages-Konvention“](./verse-of-the-day-convention.md) wird der Algorithmus Schritt für Schritt mit Pseudocode und Testwerten beschrieben, sodass Sie ihn in jeder beliebigen Sprache implementieren können.

Um eine eigene Reihenfolge zu verwenden, wählen Sie einen Startwert (z. B. den Namen Ihrer App): Dies führt zu einer anderen zufälligen Anordnung der Verse, jedoch mit denselben Garantien. Sie können auch Verse aus einer einzelnen Kategorie auswählen, allerdings enthält jede Kategorie weniger Verse als ein Jahr Tage hat, sodass sich die Verse dort schneller wiederholen.

Die SDKs folgen der Konvention:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Ein Datum im Format JJJJ-MM-TT oder ein Datum (es wird das lokale Kalenderdatum verwendet). Standardmäßig wird das heutige Datum verwendet.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Den Text des Verses finden Sie in einer Übersetzung.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` Nutzer laden die Versliste herunter und wählen daraus aus. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` Nutzer wählt aus einer bereits vorhandenen Liste aus.
-   Das Kotlin SDK verfügt über `getVerseOfTheDay(date?, seed?, category?)` und `pickVerseOfTheDay(verses, date?, seed?, category?)` , die das Datum als `YYYY-MM-DD` Zeichenkette entgegennehmen.
-   Das Swift SDK verfügt über die Parameter `getVerseOfTheDay(date:seed:category:)` und `pickVerseOfTheDay(_:date:seed:category:holidays:)` , die das Datum als Zeichenkette vom Typ `YYYY-MM-DD` bzw. `Date` entgegennehmen (es wird das Kalenderdatum in der aktuellen Zeitzone verwendet).
-   Der [MCP-Server](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) verfügt `getVerseOfTheDay` ein Tool, das den Vers des Tages mit seinem Text zurückgibt.
-   Das Paket `@helloao/tools` enthält die gleiche Liste und eine Funktion `getVerseOfTheDay(date?, { seed?, category? }?)` in `@helloao/tools/generation/verse-of-the-day.js` .

### Lizenz

Die Liste wurde von AO Lab zusammengestellt und unter der [MIT-Lizenz](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) veröffentlicht. Der Verstext stammt aus der jeweiligen Übersetzung, die Sie verwenden.

## Verse in einem Datensatz auflisten

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Gibt alle Verse (oder kurzen Abschnitte) eines Datensatzes in kanonischer Reihenfolge mit den zugehörigen Kategorien zurück. Nur für Datensätze verfügbar, deren Verse Kategorien wie `verse-of-the-day` haben.

-   `dataset` die ID des Datensatzes (z. B. `verse-of-the-day` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-verses.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/verses.json`)
    .then(request => request.json())
    .then(verses => {
        console.log('The dataset has', verses.verses.length, 'verses');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/verses.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Die Datensatzinformationen für die Verse.
     */
    dataset: Dataset;

    /**
     * Jeder Vers (oder jede kurze Passage) im Datensatz, mit seinen Kategorien, in kanonischer Reihenfolge.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Die Feiertage, die ihre eigenen Verse und ihre Daten haben.
     * Wird weggelassen, wenn der Datensatz keine Feiertage enthält.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * Die ID der Kategorie des Feiertags, z. B. „Weihnachten“.
     */
    id: string;

    /**
     * Der englische Name des Feiertags. z. B. „Christmas“.
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Der Monat (1 für Januar) und der Tag eines Feiertags, der jedes Jahr auf dasselbe Datum fällt.
     * Ausgenommen sind Feiertage, deren Datum sich jährlich ändert.
     */
    month?: number;
    day?: number;

    /**
     * Die Daten (JJJJ-MM-TT, Gregorianischer Kalender) eines Feiertags, dessen Datum sich jedes Jahr ändert, in der richtigen Reihenfolge.
     * Sie sind für einen Zeitraum von Jahren (derzeit 2026 bis 2125) vorab berechnet, und der Feiertag wird nur an den aufgeführten Daten begangen.
     * Ausgenommen sind Feiertage, die jedes Jahr auf dasselbe Datum fallen.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * Die ID des Buches. z. B. „PRO“.
     */
    book: string;

    /**
     * Die Kapitelnummer.
     */
    chapter: number;

    /**
     * Die Versnummer.
     * Wenn `endVerse` vorhanden ist, dann ist dies der Vers, mit dem die Passage beginnt.
     */
    verse: number;

    /**
     * Der Vers, mit dem die Passage endet.
     * Wird weggelassen, wenn der Eintrag nur aus einer einzigen Strophe besteht.
     */
    endVerse?: number;

    /**
     * Die IDs der Kategorien, zu denen der Vers gehört, die relevantesten zuerst.
     */
    categories: string[];

    /**
     * Das erste Jahr, in dem der Vers zum Vers des Tages gewählt werden kann.
     * Wird weggelassen, wenn der Vers schon immer in der Liste enthalten war.
     */
    addedIn?: number;

    /**
     * Das erste Jahr, in dem der Vers nicht mehr der Vers des Tages sein kann.
     * Entfernte Verse bleiben im Datensatz erhalten, sodass die Verse aus früheren Jahren weiterhin ausgewählt werden können.
     * Wird ausgelassen, wenn der Vers nicht aus der Liste entfernt wurde.
     */
    removedIn?: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/verse-of-the-day/verses.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json"
        // ...
    },
    "verses": [
        {
            "book": "GEN",
            "chapter": 1,
            "verse": 1,
            "categories": ["praise"]
        },
        {
            "book": "GEN",
            "chapter": 15,
            "verse": 6,
            "categories": ["faith", "salvation"]
        },
        // ...
        {
            "book": "PRO",
            "chapter": 3,
            "verse": 5,
            "endVerse": 6,
            "categories": ["faith", "guidance", "wisdom"]
        },
        // ...
        {
            "book": "LUK",
            "chapter": 2,
            "verse": 7,
            "categories": ["christmas"]
        }
        // ...
    ],
    "holidays": [
        {
            "id": "christmas",
            "name": "Christmas",
            "month": 12,
            "day": 25
        },
        {
            "id": "good-friday",
            "name": "Good Friday",
            "dates": ["2026-04-03", "2027-03-26", "2028-04-14" /* ... */]
        }
        // ...
    ]
}
```

## Listenkategorien in einem Datensatz

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Ruft die Liste der für einen Datensatz verfügbaren Verskategorien ab.

-   `dataset` die ID des Datensatzes (z. B. `verse-of-the-day` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-categories.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories.json`)
    .then(request => request.json())
    .then(categories => {
        console.log('The dataset has the following categories:', categories.categories);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Die Datensatzinformationen für die Kategorien.
     */
    dataset: Dataset;

    /**
     * Die Liste der für den Datensatz verfügbaren Verskategorien.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * Die ID der Kategorie. z. B. „Hoffnung“.
     */
    id: string;

    /**
     * Die englische Bezeichnung der Kategorie. z. B. „Hope“.
     */
    name: string;

    /**
     * Die Beschreibung dessen, worum es in den Versen dieser Kategorie geht.
     */
    description: string;

    /**
     * Die Anzahl der Verse (oder kurzen Abschnitte), die zu dieser Kategorie gehören.
     */
    numberOfVerses: number;

    /**
     * Die Daten des Feiertags, für den die Kategorie gilt (siehe DatasetCategoryHoliday oben).
     * Ausgenommen sind Kategorien, die nicht für einen Feiertag gelten.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Der API-Link für die Kategorie.
     */
    apiLink: string;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/verse-of-the-day/categories.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 31
        // ...
    },
    "categories": [
        {
            "id": "comfort",
            "name": "Comfort",
            "description": "God's nearness and care in grief, trouble, and loneliness.",
            "numberOfVerses": 65,
            "apiLink": "/api/d/verse-of-the-day/categories/comfort.json"
        },
        {
            "id": "courage",
            "name": "Courage",
            "description": "Standing firm and not being afraid.",
            "numberOfVerses": 49,
            "apiLink": "/api/d/verse-of-the-day/categories/courage.json"
        }
        // ...
    ]
}
```

## Eine Kategorie aus einem Datensatz abrufen

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Erhält eine einzelne Verskategorie mit allen dazugehörigen Versen.

-   `dataset` die ID des Datensatzes (z. B. `verse-of-the-day` ).
-   `category` ist die ID der Kategorie (z. B. `hope` ).

### Codebeispiel

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-category.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json`)
    .then(request => request.json())
    .then(category => {
        console.log('Verses about hope:', category.category.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json
```

:::

### Struktur

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Die Datensatzinformationen für die Kategorie.
     */
    dataset: Dataset;

    /**
     * Die Kategorie mit den dazugehörigen Versen.
     */
    category: DatasetCategory;

    /**
     * Der API-Link für diese Kategorie.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * Die ID der Kategorie. z. B. „Hoffnung“.
     */
    id: string;

    /**
     * Die englische Bezeichnung der Kategorie. z. B. „Hope“.
     */
    name: string;

    /**
     * Die Beschreibung dessen, worum es in den Versen dieser Kategorie geht.
     */
    description: string;

    /**
     * Die Daten des Feiertags, für den die Kategorie gilt (siehe DatasetCategoryHoliday in "Liste der Verse in einem Datensatz").
     * An diesen Tagen wird ein Vers aus der jeweiligen Kategorie als Tagesvers verwendet, und an anderen Tagen werden keine Tagesverse verwendet.
     * Ausgenommen sind Kategorien, die nicht für einen Feiertag gelten.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Die Verse (oder kurzen Abschnitte), die zu dieser Kategorie gehören, in kanonischer Reihenfolge.
     * Beinhaltet Verse, die aus der Liste entfernt wurden (siehe `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * Die ID des Buches. z. B. „JER“.
     */
    book: string;

    /**
     * Die Kapitelnummer.
     */
    chapter: number;

    /**
     * Die Versnummer.
     * Wenn `endVerse` vorhanden ist, dann ist dies der Vers, mit dem die Passage beginnt.
     */
    verse: number;

    /**
     * Der Vers, mit dem die Passage endet.
     * Wird weggelassen, wenn es sich um einen einzelnen Vers handelt.
     */
    endVerse?: number;

    /**
     * Das erste Jahr, in dem der Vers zum Vers des Tages gewählt werden kann.
     * Wird weggelassen, wenn der Vers schon immer in der Liste enthalten war.
     */
    addedIn?: number;

    /**
     * Das erste Jahr, in dem der Vers nicht mehr der Vers des Tages sein kann.
     * Entfernte Verse bleiben im Datensatz erhalten, sodass die Verse aus früheren Jahren weiterhin ausgewählt werden können.
     * Wird ausgelassen, wenn der Vers nicht aus der Liste entfernt wurde.
     */
    removedIn?: number;
}
```

### Beispiel

```json:no-line-numbers title="/api/d/verse-of-the-day/categories/hope.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 31
        // ...
    },
    "category": {
        "id": "hope",
        "name": "Hope",
        "description": "Confidence in the future that God has promised.",
        "verses": [
            {
                "book": "GEN",
                "chapter": 50,
                "verse": 20
            },
            // ...
            {
                "book": "ISA",
                "chapter": 43,
                "verse": 18,
                "endVerse": 19
            },
            {
                "book": "JER",
                "chapter": 29,
                "verse": 11
            }
            // ...
        ]
    },
    "thisCategoryApiLink": "/api/d/verse-of-the-day/categories/hope.json"
}
```
