# insiemi di dati

Punti di accesso per la consultazione di set di dati biblici supplementari, come riferimenti incrociati ed entità bibliche (persone, luoghi, eventi e gruppi di persone), e per il recupero dei relativi libri, contenuti dei capitoli ed entità.

## Set di dati disponibili

`GET https://bible.helloao.org/api/available_datasets.json`

Recupera l'elenco dei dataset biblici disponibili nell'API.

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * L'elenco dei set di dati.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * L'ID del set di dati.
     */
    id: string;

    /**
     * Il nome del set di dati.
     */
    name: string;

    /**
     * Il sito web del dataset.
     */
    website: string;

    /**
     * L'URL dove è possibile trovare la licenza per il dataset.
     */
    licenseUrl: string;

    /**
     * Il nome in inglese del dataset.
     */
    englishName: string;

    /**
     * Il tag linguistico ISO 639 di 3 lettere in cui è principalmente contenuto il dataset.
     */
    language: string;

    /**
     * La direzione in cui è scritta la lingua.
     * "ltr" indica che il testo è scritto da sinistra a destra.
     * "rtl" indica che il testo viene scritto da destra a sinistra.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Il link API per l'elenco dei libri disponibili per questo set di dati.
     */
    listOfBooksApiLink: string;

    /**
     * Elenco dei formati disponibili.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Il numero di libri contenuti in questo dataset.
     */
    numberOfBooks: number;

    /**
     * Il numero totale di capitoli contenuti in questo dataset.
     */
    totalNumberOfChapters: number;

    /**
     * Il numero totale di versi contenuti in questo dataset.
     */
    totalNumberOfVerses: number;

    /**
     * Il numero totale di riferimenti incrociati contenuti in questo dataset.
     */
    totalNumberOfReferences: number;

    /**
     * Restituisce il nome della lingua in cui si trova il dataset.
     * Valore nullo o indefinito se il nome della lingua non è noto.
     */
    languageName?: string;

    /**
     * Recupera il nome della lingua in inglese.
     * Valore nullo o indefinito se la lingua non ha un nome in inglese.
     */
    languageEnglishName?: string;

    /**
     * I link API per gli elenchi di entità presenti nel dataset.
     * Omesso se il dataset non contiene le entità corrispondenti.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Il numero totale di entità contenute nel dataset.
     * Omesso se il dataset non contiene le entità corrispondenti.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;
}
```

### Esempio

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

## Elenca i libri in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Recupera l'elenco dei libri disponibili per il set di dati specificato.

-   `dataset` l'ID del dataset (es. `open-cross-ref` ).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Ottieni l'elenco dei libri per il dataset open-cross-ref
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

### Struttura

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Le informazioni del dataset relative ai libri.
     */
    dataset: Dataset;

    /**
     * L'elenco dei libri disponibili per il dataset.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * L'ID del libro.
     * Corrisponde all'ID del libro corrispondente nella Bibbia (GEN, EXO, ecc.).
     */
    id: string;

    /**
     * L'ordine dei libri nella Bibbia.
     */
    order: number;

    /**
     * Il numero del primo capitolo del libro.
     */
    firstChapterNumber: number;

    /**
     * Il link al primo capitolo del libro.
     */
    firstChapterApiLink: string | null;

    /**
     * Il numero dell'ultimo capitolo del libro.
     */
    lastChapterNumber: number | null;

    /**
     * Il link all'ultimo capitolo del libro.
     */
    lastChapterApiLink: string | null;

    /**
     * Il numero di capitoli che il libro contiene.
     */
    numberOfChapters: number;

    /**
     * Il numero di versi contenuti nel libro.
     */
    totalNumberOfVerses: number;

    /**
     * Il numero totale di riferimenti incrociati contenuti in questo libro.
     */
    totalNumberOfReferences: number;
}
```

### Esempio

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

## Ottieni un capitolo da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Consente di ottenere il contenuto di un singolo capitolo di un determinato libro e set di dati.

Per i set di dati di riferimenti incrociati (come `open-cross-ref` ), il capitolo contiene l'elenco dei riferimenti incrociati per ogni versetto. Per i set di dati di entità (come `theographic` ), il capitolo contiene le persone, i luoghi e gli eventi che compaiono nel capitolo - vedi [Ottenere le entità in un capitolo](#get-the-entities-in-a-chapter) .

-   `dataset` l'ID del dataset (es. `open-cross-ref` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi).
-   `chapter` è il numero del capitolo (ad esempio `1` per il primo capitolo).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Ottieni Genesis 1 dal dataset open-cross-ref
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

### Struttura

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Informazioni sul dataset relative al capitolo del libro.
     */
    dataset: Dataset;

    /**
     * Informazioni sul capitolo del libro.
     */
    book: DatasetBook;

    /**
     * Il link a questo capitolo.
     */
    thisChapterLink: string;

    /**
     * Il link al capitolo successivo.
     * Valore nullo se si tratta dell'ultimo capitolo del dataset.
     */
    nextChapterApiLink: string | null;

    /**
     * Il link al capitolo precedente.
     * Valore nullo se si tratta del primo capitolo del dataset.
     */
    previousChapterApiLink: string | null;

    /**
     * Il numero di versetti contenuti nel capitolo.
     */
    numberOfVerses: number;

    /**
     * Le informazioni relative al capitolo.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Il numero del capitolo.
     */
    number: number;

    /**
     * Il contenuto del capitolo.
     */
    content: DatasetVerse[];
}

interface DatasetVerse {
    /**
     * Il numero del versetto.
     */
    verse: number;

    /**
     * I riferimenti incrociati per il versetto.
     *
     * Ordinati per punteggio, in ordine decrescente.
     */
    references: DatasetReference[];
}

interface DatasetReference {
    /**
     * L'ID del libro a cui si fa riferimento.
     */
    book: string;

    /**
     * Il numero del capitolo.
     */
    chapter: number;

    /**
     * Il numero del versetto.
     * Se è presente `endVerse` , allora questo è il verso da cui inizia il riferimento.
     */
    verse: number;

    /**
     * Il verso in cui termina il riferimento.
     */
    endVerse?: number;

    /**
     * Il punteggio di rilevanza per il riferimento.
     */
    score?: number;
}
```

### Esempio

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

## Entità

Alcuni set di dati, come il set di dati [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ), contengono entità: persone, luoghi, eventi e gruppi di persone, insieme alle relazioni tra di essi e i versetti biblici che li menzionano.

I dataset che contengono entità includono `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` e `listOfPeopleGroupsApiLink` proprietà nella loro voce in `/api/available_datasets.json` .

I dataset di entità forniscono anche dati allineati ai capitoli: `/api/d/{dataset}/books.json` elenca i libri i cui capitoli contengono dati di entità e `/api/d/{dataset}/{book}/{chapter}.json` restituisce le persone, i luoghi e gli eventi che compaiono in quel capitolo, insieme ai numeri dei versetti in cui ciascuno di essi viene menzionato. Vedi [Ottenere le entità in un capitolo](#get-the-entities-in-a-chapter) .

Le entità fanno riferimento ai passi biblici utilizzando gli stessi ID dei libri, numeri di capitolo e numeri di versetto del resto dell'API, in modo da poter essere combinate con qualsiasi traduzione. Fanno riferimento l'una all'altra tramite riferimenti di entità:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * L'ID dell'entità a cui si fa riferimento.
     */
    id: string;

    /**
     * Il tipo dell'entità a cui si fa riferimento.
     * Corrisponde al segmento di raccolta del collegamento API dell'entità, quindi il collegamento può essere costruito come `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Il nome dell'entità a cui si fa riferimento.
     */
    name?: string;

    /**
     * Il link API per l'entità a cui si fa riferimento.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * L'ID del libro (GEN, EXO, ecc.).
     */
    book: string;

    /**
     * Il numero del capitolo da cui inizia il riferimento.
     */
    chapter: number;

    /**
     * Il numero del versetto da cui inizia il riferimento.
     */
    verse: number;

    /**
     * Il verso in cui termina il riferimento.
     * I versi consecutivi dello stesso capitolo sono raggruppati in un unico riferimento.
     */
    endVerse?: number;
}
```

## Ottieni le entità in un capitolo

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Per i dataset di entità, recupera le persone, i luoghi e gli eventi che compaiono in un singolo capitolo, insieme ai numeri dei versetti del capitolo in cui ciascuno di essi viene menzionato.

-   `dataset` l'ID del dataset (es. `theographic` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi).
-   `chapter` è il numero del capitolo (ad esempio `1` per il primo capitolo).

L'elenco di libri e capitoli che contengono dati relativi alle entità è disponibile all'indirizzo `GET https://bible.helloao.org/api/d/{dataset}/books.json` , che segue la stessa struttura [dell'endpoint dei libri del dataset](#list-books-in-a-dataset) . Per i dataset di entità, `totalNumberOfVerses` è il numero di versetti menzionati da almeno un'entità e `totalNumberOfReferences` è il numero totale di menzioni entità-versetto.

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Ottieni le persone, i luoghi e gli eventi che compaiono in Genesi 2
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

### Struttura

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Informazioni sul dataset relative al capitolo del libro.
     */
    dataset: Dataset;

    /**
     * Informazioni sul capitolo del libro.
     */
    book: DatasetBook;

    /**
     * I dati relativi all'entità del capitolo.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Il link a questo capitolo.
     */
    thisChapterLink: string;

    /**
     * Il link al capitolo successivo.
     * Valore nullo se si tratta dell'ultimo capitolo del dataset.
     */
    nextChapterApiLink: string | null;

    /**
     * Il link al capitolo precedente.
     * Valore nullo se si tratta del primo capitolo del dataset.
     */
    previousChapterApiLink: string | null;

    /**
     * Il numero di persone, luoghi ed eventi che compaiono nel capitolo.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Il numero del capitolo.
     */
    number: number;

    /**
     * Le persone che compaiono nel capitolo.
     * Ordinati in base al primo verso in cui compaiono.
     */
    people: ChapterPerson[];

    /**
     * I luoghi che compaiono nel capitolo.
     * Ordinati in base al primo verso in cui compaiono.
     */
    places: ChapterPlace[];

    /**
     * Gli eventi che compaiono nel capitolo.
     * Ordinati in base al primo verso in cui compaiono.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * L'ID della persona.
     */
    id: string;

    /**
     * Il nome della persona.
     */
    name: string;

    /**
     * Se il nome della persona è un nome proprio.
     */
    isProperName?: boolean;

    /**
     * Il genere della persona.
     */
    gender?: string;

    /**
     * L'anno di nascita e l'anno di morte della persona.
     * I numeri negativi indicano anni a.C. I numeri positivi indicano anni d.C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Il link API per la persona.
     */
    apiLink: string;

    /**
     * I numeri dei versetti del capitolo che menzionano la persona.
     * Ordinati in ordine crescente.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * L'identificativo del luogo.
     */
    id: string;

    /**
     * Il nome del luogo.
     */
    name: string;

    /**
     * Il tipo di caratteristica geografica che rappresenta il luogo.
     */
    featureType?: string;

    /**
     * La latitudine e la longitudine del luogo.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Il link API per il luogo.
     */
    apiLink: string;

    /**
     * I numeri dei versetti del capitolo che menzionano il luogo.
     * Ordinati in ordine crescente.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * L'ID dell'evento.
     */
    id: string;

    /**
     * Il nome dell'evento.
     */
    name: string;

    /**
     * La data di inizio dell'evento.
     */
    startDate?: string;

    /**
     * Il link API per l'evento.
     */
    apiLink: string;

    /**
     * I numeri dei versetti del capitolo che descrivono l'evento.
     * Ordinati in ordine crescente.
     */
    verses: number[];
}
```

### Esempio

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

## Elenca le persone in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Recupera l'elenco delle persone disponibili per il set di dati specificato.

-   `dataset` l'ID del dataset (es. `theographic` ).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Ottieni l'elenco delle persone per il dataset teorico
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

### Struttura

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Le informazioni del set di dati per le persone.
     */
    dataset: Dataset;

    /**
     * L'elenco delle persone disponibili per il dataset.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * L'ID della persona.
     */
    id: string;

    /**
     * Il nome della persona.
     */
    name: string;

    /**
     * Se il nome della persona è un nome proprio.
     */
    isProperName?: boolean;

    /**
     * Il genere della persona.
     */
    gender?: string;

    /**
     * Il numero di riferimenti biblici che menzionano la persona.
     */
    numberOfReferences: number;

    /**
     * Il link API per la persona.
     */
    thisPersonApiLink: string;
}
```

### Esempio

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

## Recuperare una persona da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Fornisce informazioni su una singola persona, inclusi i riferimenti biblici che la menzionano e le sue relazioni con altre persone, luoghi, eventi e gruppi di persone.

-   `dataset` l'ID del dataset (es. `theographic` ).
-   `person` l'ID della persona (es. `paul_2479` ).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Ottieni le informazioni su Paolo dal set di dati teografico
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

### Struttura

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Il set di dati contenente le informazioni relative alla persona.
     */
    dataset: Dataset;

    /**
     * Le informazioni sulla persona.
     */
    person: DatasetPerson;

    /**
     * Il link API per questa persona.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * L'ID della persona.
     */
    id: string;

    /**
     * Il nome della persona.
     */
    name: string;

    /**
     * Altri nomi con cui la persona viene chiamata.
     */
    alsoCalled?: string[];

    /**
     * Se il nome della persona è un nome proprio.
     */
    isProperName?: boolean;

    /**
     * Il genere della persona.
     */
    gender?: string;

    /**
     * Descrizione della persona. Ogni stringa corrisponde a un paragrafo.
     */
    description?: string[];

    /**
     * L'anno di nascita e l'anno di morte della persona.
     * I numeri negativi indicano anni a.C. I numeri positivi indicano anni d.C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Gli anni in cui la persona viene menzionata, sia il primo che l'ultimo.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Il luogo in cui la persona è nata e morta.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Le relazioni familiari della persona.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * I gruppi di persone di cui la persona fa parte.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Gli eventi a cui la persona ha partecipato.
     */
    events?: DatasetEntityRef[];

    /**
     * L'elenco dei riferimenti biblici che menzionano la persona.
     * Ordinati per libro, capitolo e versetto.
     */
    references: VerseRef[];
}
```

### Esempio

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

## Elenca i luoghi in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Recupera l'elenco dei luoghi disponibili per il set di dati specificato.

-   `dataset` l'ID del dataset (es. `theographic` ).

### Struttura

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Le informazioni del set di dati relative ai luoghi.
     */
    dataset: Dataset;

    /**
     * L'elenco dei luoghi disponibili per il dataset.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * L'identificativo del luogo.
     */
    id: string;

    /**
     * Il nome del luogo.
     */
    name: string;

    /**
     * Il tipo di caratteristica geografica che rappresenta il luogo.
     * Ad esempio, "Città", "Regione", "Montagna", "Acqua", ecc.
     */
    featureType?: string;

    /**
     * La latitudine e la longitudine del luogo.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Il numero di riferimenti biblici che menzionano il luogo.
     */
    numberOfReferences: number;

    /**
     * Il link API per il luogo.
     */
    thisPlaceApiLink: string;
}
```

## Ottieni un luogo da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Fornisce informazioni su un singolo luogo, inclusi i riferimenti biblici che lo menzionano e le persone e gli eventi ad esso correlati.

-   `dataset` l'ID del dataset (es. `theographic` ).
-   `place` l'ID del luogo (es. `jerusalem_636` ).

### Struttura

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Le informazioni del dataset relative al luogo.
     */
    dataset: Dataset;

    /**
     * Informazioni sul luogo.
     */
    place: DatasetPlace;

    /**
     * Il link API per questo luogo.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * L'identificativo del luogo.
     */
    id: string;

    /**
     * Il nome del luogo.
     */
    name: string;

    /**
     * Il nome del luogo come appare nella versione di Re Giacomo e nella versione standard inglese.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Altri nomi con cui è conosciuto il luogo.
     */
    aliases?: string[];

    /**
     * Il tipo di caratteristica geografica che rappresenta il luogo.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * La latitudine e la longitudine del luogo, e la loro precisione.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Descrizione del luogo. Ogni stringa corrisponde a un paragrafo.
     */
    description?: string[];

    /**
     * Il commento sul luogo da parte degli autori del dataset.
     */
    comment?: string;

    /**
     * Il luogo d'origine di questo posto.
     * Nomi diversi per la stessa località geografica condividono la stessa radice.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Il luogo di cui questo luogo è una copia.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Le persone che sono state in quel luogo, che vi sono nate o che vi sono morte.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Gli eventi accaduti in quel luogo.
     */
    events?: DatasetEntityRef[];

    /**
     * L'elenco dei riferimenti biblici che menzionano il luogo.
     * Ordinati per libro, capitolo e versetto.
     */
    references: VerseRef[];
}
```

### Esempio

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

## Elenco degli eventi in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Recupera l'elenco degli eventi disponibili per il dataset specificato.

-   `dataset` l'ID del dataset (es. `theographic` ).

### Struttura

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Le informazioni del dataset relative agli eventi.
     */
    dataset: Dataset;

    /**
     * Elenco degli eventi disponibili per il dataset.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * L'ID dell'evento.
     */
    id: string;

    /**
     * Il nome dell'evento.
     */
    name: string;

    /**
     * La data di inizio dell'evento.
     * I numeri negativi indicano anni a.C. I numeri positivi indicano anni d.C.
     * Per date più specifiche si utilizza il formato `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Il numero di riferimenti biblici che descrivono l'evento.
     */
    numberOfReferences: number;

    /**
     * Il link API per l'evento.
     */
    thisEventApiLink: string;
}
```

## Ottenere un evento da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Fornisce informazioni su un singolo evento, inclusi i riferimenti biblici che lo descrivono e le persone, i luoghi e i gruppi etnici ad esso correlati.

-   `dataset` l'ID del dataset (es. `theographic` ).
-   `event` l'ID dell'evento (es. `saul-is-converted_326` ).

### Struttura

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Le informazioni del set di dati relative all'evento.
     */
    dataset: Dataset;

    /**
     * Informazioni sull'evento.
     */
    event: DatasetEvent;

    /**
     * Il link API per questo evento.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * L'ID dell'evento.
     */
    id: string;

    /**
     * Il nome dell'evento.
     */
    name: string;

    /**
     * La data di inizio dell'evento.
     */
    startDate?: string;

    /**
     * La durata dell'evento.
     * Ad esempio, "1D" indica un giorno e "40Y" indica quaranta anni.
     */
    duration?: string;

    /**
     * Le persone che hanno partecipato all'evento.
     */
    participants?: DatasetEntityRef[];

    /**
     * I luoghi in cui si è svolto l'evento.
     */
    locations?: DatasetEntityRef[];

    /**
     * I gruppi etnici che hanno partecipato all'evento.
     */
    groups?: DatasetEntityRef[];

    /**
     * L'evento di cui questo evento fa parte.
     */
    partOf?: DatasetEntityRef;

    /**
     * L'evento accaduto prima di questo evento.
     */
    predecessor?: DatasetEntityRef;

    /**
     * L'elenco dei riferimenti biblici che descrivono l'evento.
     * Ordinati per libro, capitolo e versetto.
     */
    references: VerseRef[];
}
```

### Esempio

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

## Elenca i gruppi di persone in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Recupera l'elenco dei gruppi di persone disponibili per il set di dati specificato.

-   `dataset` l'ID del dataset (es. `theographic` ).

### Struttura

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Il set di dati contenente le informazioni relative ai gruppi di persone.
     */
    dataset: Dataset;

    /**
     * Elenco dei gruppi di persone disponibili per il dataset.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * L'identità del gruppo di persone.
     */
    id: string;

    /**
     * Il nome del gruppo etnico.
     */
    name: string;

    /**
     * Il numero di persone che appartengono al gruppo etnico.
     */
    numberOfMembers: number;

    /**
     * Il link API per il gruppo di persone.
     */
    thisPeopleGroupApiLink: string;
}
```

## Ottieni un gruppo di persone da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Fornisce informazioni su un singolo gruppo di persone, inclusi i suoi membri e gli eventi a cui il gruppo ha partecipato.

-   `dataset` l'ID del dataset (es. `theographic` ).
-   `group` l'ID del gruppo di persone (es. `tribe-of-benjamin` ).

### Struttura

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Le informazioni contenute nel set di dati relative al gruppo di persone.
     */
    dataset: Dataset;

    /**
     * Informazioni sul gruppo etnico.
     */
    group: DatasetPeopleGroup;

    /**
     * Il link API per questo gruppo di persone.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * L'identità del gruppo di persone.
     */
    id: string;

    /**
     * Il nome del gruppo etnico.
     */
    name: string;

    /**
     * Le persone che appartengono al gruppo etnico.
     */
    members?: DatasetEntityRef[];

    /**
     * Gli eventi a cui ha partecipato il gruppo etnico.
     */
    events?: DatasetEntityRef[];

    /**
     * Elenco dei riferimenti biblici che menzionano questo gruppo etnico.
     * Ordinati per libro, capitolo e versetto.
     */
    references: VerseRef[];
}
```

### Esempio

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
