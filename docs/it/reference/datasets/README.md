# insiemi di dati

Punti di accesso per la consultazione di set di dati biblici supplementari, come riferimenti incrociati, entità bibliche (persone, luoghi, eventi e gruppi di persone), parole interlineari in lingua originale, lessici e candidati al versetto del giorno, e per il recupero dei relativi libri, contenuti dei capitoli, entità, voci del lessico e categorie di versetti.

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
     * Le note aggiunte dall'API per la licenza.
     * Valore nullo o indefinito se non sono presenti note.
     */
    licenseNotes?: string | null;

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
     * 0 per i set di dati che non contengono riferimenti incrociati.
     */
    totalNumberOfReferences: number;

    /**
     * Il numero totale di parole interlineari contenute in questo dataset.
     * Omesso se il dataset non contiene parole interlineari.
     */
    totalNumberOfWords?: number;

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

    /**
     * Il link API per l'elenco delle voci del lessico presenti nel dataset.
     * Omesso se il dataset non contiene voci di lessico.
     */
    listOfLexiconApiLink?: string;

    /**
     * Il numero totale di voci lessicali contenute nel dataset.
     * Omesso se il dataset non contiene voci di lessico.
     */
    totalNumberOfLexicon?: number;

    /**
     * Il link API per l'elenco di tutti i versi presenti nel dataset, con le relative categorie.
     * Omesso se i versi del dataset non hanno categorie.
     */
    listOfVersesApiLink?: string;

    /**
     * Il link API per l'elenco delle categorie di versi presenti nel dataset.
     * Omesso se il set di dati non contiene categorie di versi.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Il numero totale di categorie di versi contenute nel dataset.
     * Omesso se il set di dati non contiene categorie di versi.
     */
    totalNumberOfCategories?: number;
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

Per i dataset di riferimenti incrociati (come `open-cross-ref` ), il capitolo contiene l'elenco dei riferimenti incrociati per ogni versetto. Per i dataset interlineari (come `bsb-interlinear` ), il capitolo contiene le parole nella lingua originale di ogni versetto - vedi [Dataset interlineari](#interlinear-datasets) . Per i dataset di entità (come `theographic` ), il capitolo contiene le persone, i luoghi e gli eventi che compaiono nel capitolo - vedi [Ottenere le entità in un capitolo](#get-the-entities-in-a-chapter) . Per il dataset `verse-of-the-day` , il capitolo contiene i candidati al versetto del giorno nel capitolo e le loro categorie - vedi [Versetto del giorno](#verse-of-the-day) .

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

/**
 * Un verso può avere valore `references` (nei dataset di riferimento incrociato), `words` (nei dataset interlineari) o `categories` (nel dataset del verso del giorno).
 * Verifica quale dei due è presente con `'words' in verse` o `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
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

interface DatasetWordsVerse {
    /**
     * Il numero del versetto.
     */
    verse: number;

    /**
     * Le parole del verso nella lingua originale, nell'ordine del testo originale.
     * Vedi "Dataset interlineari" qui di seguito.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Il numero del versetto.
     * Se è presente `endVerse` , allora questo è il versetto da cui inizia il brano.
     */
    verse: number;

    /**
     * Il verso in cui termina il brano.
     * Omesso se la voce è un singolo verso.
     */
    endVerse?: number;

    /**
     * Gli ID delle categorie a cui appartiene il verso, dalla più rilevante alla meno rilevante.
     * Vedi il "Versetto del giorno" qui sotto.
     */
    categories: string[];

    /**
     * Il primo anno in cui il verso può essere il verso del giorno.
     * Omesso se il versetto è sempre stato presente nell'elenco.
     */
    addedIn?: number;

    /**
     * Il primo anno in cui il versetto non può più essere il versetto del giorno.
     * I versetti rimossi rimangono nel dataset in modo che sia ancora possibile selezionare i versetti degli anni precedenti.
     * Omesso se il verso non è stato rimosso dall'elenco.
     */
    removedIn?: number;
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

// Per la struttura di InterlinearWord, consultare la sezione "Dataset interlineari" qui di seguito.
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

Il dataset [History Globe](https://historyglobe.app) ( `history-globe` ) contiene solo luoghi: i luoghi citati nella Bibbia, con le loro coordinate e i versetti che li nominano. I suoi ID di luogo (ad esempio `a15257a` per Gerusalemme) sono gli ID di luogo stabili di History Globe, gli stessi che utilizza la sua [API di dati aperti](https://historyglobe.app/docs/api.html) , quindi non cambiano quando un nome viene corretto. I suoi `featureType` valori seguono quelli utilizzati dal dataset Theographic ( `City` , `Region` , `Water` e così via), e `featureSubType` riporta il tipo più specifico laddove presente (ad esempio `River` , `Gate` , `Spring` ).

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

### Storia globo Attribuzione

I dati di History Globe sono rilasciati sotto licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Se li utilizzi, cita History Globe ( https://historyglobe.app ) e i dati di geocodifica biblica di OpenBible.info su cui si basano, e segnala eventuali modifiche. La proprietà `licenseNotes` del dataset riporta il credito.

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

## Insiemi di dati interlineari

Il dataset interlineare Berean ( `bsb-interlinear` ) elenca le parole della lingua originale (ebraico, aramaico e greco) di ogni versetto della Bibbia, nell'ordine in cui appaiono nel testo originale. Ogni parola ha la sua traslitterazione, l'analisi grammaticale, [il numero di Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) e la frase inglese che la [Berean Standard Bible](https://berean.bible) usa per essa.

Il set di dati utilizza gli stessi endpoint degli altri set di dati:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` elenca i 66 libri.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (ad esempio `/api/d/bsb-interlinear/GEN/1.json` ) restituisce il capitolo, con `{ verse, words }` per ogni versetto. La risposta è un [dataset chapter](#get-a-chapter-from-a-dataset) .

I dati delle parole provengono dalle [tabelle interlineari della Berean Standard Bible](https://bereanbible.com/) , che sono di pubblico dominio. I numeri di Strong per le parole vengono cercati nel [lessico](#lexicon) ( `stepbible-lexicon` ).

### Struttura

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * La posizione in classifica della parola nell'ordine del testo originale, calcolata con base 1.
     * Le parole sono elencate in quest'ordine.
     */
    pos: number;

    /**
     * Il rango della parola in base 1 nell'ordine inglese della Berean Standard Bible.
     */
    bsbPos: number;

    /**
     * Il linguaggio della parola.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * La parola nella scrittura originale. Normalizzata tramite NFC.
     */
    text: string;

    /**
     * La traslitterazione della parola.
     */
    transliteration: string | null;

    /**
     * Il codice di analisi grammaticale breve della parola. Ad esempio "N-mp" o "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * L'analisi grammaticale dettagliata della parola.
     */
    parsingFull: string | null;

    /**
     * Il numero di Strong della parola, preceduto da zeri. Ad esempio "H0430" o "G3056".
     * Con zero aggiunto, in modo da corrispondere ai valori `.words.json` della versione KJV.
     * I valori di altre traduzioni potrebbero richiedere l'aggiunta di zeri e la rimozione dei suffissi prima di essere uniti.
     * Nullo quando la fonte fornisce la parola senza numero di Strong (questo è il caso di alcune parole che sono suffissi, come i suffissi dei pronomi).
     */
    strongs: string | null;

    /**
     * La frase in inglese della Berean Standard Bible per la parola.
     * Nullo quando la BSB lascia la parola non tradotta (come nel caso del marcatore di oggetto diretto ebraico).
     */
    gloss: string | null;
}
```

### Esempio

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

### Collegamento tra parole e traduzioni

I valori `strongs` interlineari vengono riempiti con zeri (ad esempio `H0430` ). Ciò corrisponde ai `strongs` valori nelle annotazioni delle parole della KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). I valori di altre traduzioni potrebbero richiedere il riempimento con zeri e la rimozione del suffisso (ad esempio `H430` o `H1961a` a `H0430` e `H1961` ) prima di poter essere uniti.

-   **KJV.** Per la versione King James ( `eng_kjv` e `eng_kja` ), unire i numeri di Strong nel file `.words.json` di un capitolo con le `strongs` parole interlineari dello stesso versetto. Ad esempio, ogni numero di Strong annotato in `/api/eng_kjv/GEN/1.words.json` per il versetto 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) appare come un valore `strongs` tra le parole del versetto 1 in `/api/d/bsb-interlinear/GEN/1.json` .
-   **Bibbia Standard Bereana.** Lo `gloss` di ogni parola è la frase BSB corrispondente. Leggi le parole del versetto in ordine `bsbPos` e confronta ogni `gloss` con il testo del versetto nella traduzione BSB per trovare la posizione della traduzione della parola.

La numerazione delle due fonti non sempre coincide. Ad esempio, la KJV assegna il valore `G2258` al verbo "was", mentre la tabella Bereana lo assegna `G1510` Alcune corrispondenze non vengono visualizzate a causa di differenze di questo tipo.

### Attribuzione

Le tavole interlineari di Bereano sono di pubblico dominio. Il [lessico](#lexicon) è rilasciato sotto licenza CC BY 4.0 e richiede l'attribuzione.

## Lessico

Il dataset lessicale STEPBible ( `stepbible-lexicon` ) contiene i lessici brevi ebraico, aramaico e greco (TBESH e TBESG) di [STEPBible.org](https://www.stepbible.org/) presso Tyndale House, Cambridge. Ha una voce per ogni numero di Strong di base e ogni voce ha uno o più significati con il lemma, la traslitterazione, la parte del discorso, la glossa inglese e una definizione.

Qualsiasi valore `strongs` , preceduto da zeri, derivante da una [parola interlineare](#interlinear-datasets) che possiede una voce nel lessico, può essere cercato al `/api/d/stepbible-lexicon/lexicon/{strongs}.json` senza necessità di riformattazione. Lo stesso vale per i valori `.words.json` della KJV; i valori di altre traduzioni potrebbero richiedere prima l'aggiunta di zeri e la rimozione dei suffissi. Le voci greche aggiunte dal lessico senza un numero di Strong non vengono pubblicate.

I dataset che contengono voci lessicali includono `listOfLexiconApiLink` e `totalNumberOfLexicon` nella loro voce in `/api/available_datasets.json` .

### Attribuzione

I dati del lessico sono rilasciati sotto licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Se li utilizzate, citate STEPBible.org / Tyndale House, Cambridge e indicate eventuali modifiche. La proprietà `licenseNotes` del dataset riporta il riferimento.

## Elenco delle voci lessicali in un dataset

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Restituisce l'elenco delle voci del lessico disponibili per un determinato set di dati.

-   `dataset` l'ID del dataset (es. `stepbible-lexicon` ).

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Informazioni sul dataset per il lessico.
     */
    dataset: Dataset;

    /**
     * L'elenco delle voci lessicali disponibili per il dataset.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Il numero di Strong della voce del lessico, preceduto da zeri. Ad esempio "H0430".
     */
    id: string;

    /**
     * La lingua della voce lessicale.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Il nome della voce del lessico.
     * Questo è il lemma del primo significato della voce.
     */
    name: string;

    /**
     * Il link API per la voce del lessico.
     */
    apiLink: string;
}
```

### Esempio

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

## Ottenere una voce lessicale da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Recupera la voce lessicale per un singolo numero di Strong di base, con tutti i suoi significati.

-   `dataset` l'ID del dataset (es. `stepbible-lexicon` ).
-   `strongs` è il numero di Strong con zero iniziale (ad esempio `H0430` per la parola ebraica _elohim_ o `G3056` per la parola greca _logos_).

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Le informazioni del dataset relative alla voce del lessico.
     */
    dataset: Dataset;

    /**
     * La voce del lessico.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Il link API per questa voce del lessico.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Il numero Strong della voce, preceduto da zeri. Ad esempio "H0430".
     */
    id: string;

    /**
     * La lingua della voce.
     * Questa è la lingua del primo significato della voce.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * I sensi della voce, in ordine ID.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * L'ID esteso del senso. Ad esempio "H0001G".
     * Corrisponde al numero di Strong di base quando il numero ha un solo significato.
     */
    id: string;

    /**
     * Il linguaggio dei sensi.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Il lemma del senso nella scrittura originale.
     */
    lemma: string;

    /**
     * La traslitterazione del lemma.
     */
    transliteration: string | null;

    /**
     * La parte del discorso (morfologia) codice del senso.
     */
    partOfSpeech: string | null;

    /**
     * Breve glossa inglese del significato.
     */
    gloss: string | null;

    /**
     * La definizione del senso come testo semplice.
     * I paragrafi sono separati da righe vuote. La formattazione presente nel codice sorgente è stata rimossa.
     */
    definition: string;
}
```

### Esempio

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

## Versetto del giorno

Il dataset del versetto del giorno ( `verse-of-the-day` ) è un elenco curato di versetti e brevi passaggi ben noti (al massimo tre versetti) che sono buoni candidati per un "versetto del giorno": più di 640 per ogni giorno dell'anno e più di 100 per le festività cristiane. Ognuno di essi ha un senso di per sé.

Ogni versetto per ogni giorno ha da una a tre categorie, le più rilevanti in ordine decrescente, da questo insieme fisso:

| ID            | Descrizione                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `comfort`     | La vicinanza e la cura di Dio nel dolore, nelle difficoltà e nella solitudine. |
| `courage`     | Rimanere saldi e non avere paura.                                              |
| `faith`       | Confidare in Dio e nelle sue promesse.                                         |
| `forgiveness` | Il perdono dei peccati da parte di Dio e il perdono verso gli altri.           |
| `gratitude`   | Rendere grazie a Dio.                                                          |
| `guidance`    | Dio guida i nostri passi, i nostri progetti e le nostre decisioni.             |
| `hope`        | Fiducia nel futuro che Dio ha promesso.                                        |
| `inspiration` | Un incoraggiamento a vivere la fede e a fare del bene.                         |
| `joy`         | Gioia e letizia in Dio.                                                        |
| `love`        | L'amore di Dio per noi e il nostro amore per Dio e per gli altri.              |
| `peace`       | Riposo, tranquillità e libertà dall'ansia.                                     |
| `praise`      | Adorazione e proclamazione della grandezza di Dio.                             |
| `prayer`      | Invocare Dio e la sua promessa di ascoltare.                                   |
| `provision`   | Dio provvede a ciò di cui abbiamo bisogno.                                     |
| `salvation`   | Redenzione, grazia e nuova vita in Cristo.                                     |
| `strength`    | Dio dona forza e resistenza.                                                   |
| `wisdom`      | Saggezza divina e insegnamenti pratici per la vita.                            |

Le festività hanno categorie proprie. In una festività, il versetto del giorno è uno dei versetti della festività stessa, e questi versetti non vengono utilizzati negli altri giorni. Una festività di solito dura un giorno; la festività dopo la Domenica di Pasqua dura i tre giorni successivi alla Domenica di Pasqua, quindi elenca tutte e tre le date. Ogni categoria di festività ha uno `holiday` accanto alle sue date: le festività che cadono nella stessa data ogni anno hanno un `month` e `day` , mentre le festività la cui data cambia ogni anno (perché dipendono dalla Domenica di Pasqua o dall'Avvento) hanno il loro `dates` nel calendario gregoriano, precalcolato per il periodo 2026-2125.

| ID                         | Vacanza                          | Data                                            |
| -------------------------- | -------------------------------- | ----------------------------------------------- |
| `epiphany`                 | Epifania                         | 6 gennaio                                       |
| `ash-wednesday`            | Mercoledì delle Ceneri           | 46 giorni prima della Domenica di Resurrezione  |
| `palm-sunday`              | Domenica delle Palme             | La domenica prima della domenica di Pasqua      |
| `maundy-thursday`          | Giovedì Santo                    | Il giovedì prima della domenica di Resurrezione |
| `good-friday`              | Venerdì Santo                    | Il venerdì prima della domenica di Pasqua       |
| `resurrection-sunday`      | Domenica di Resurrezione         | Domenica di Pasqua                              |
| `post-resurrection-sunday` | Dopo la Domenica di Risurrezione | I tre giorni dopo la domenica di Resurrezione   |
| `ascension-day`            | Giorno dell'Ascensione           | 39 giorni dopo la Domenica di Risurrezione      |
| `pentecost`                | Pentecoste                       | 49 giorni dopo la Domenica di Risurrezione      |
| `all-hallows-eve`          | Vigilia di Ognissanti            | 31 ottobre                                      |
| `all-saints-day`           | Giorno di Ognissanti             | 1° novembre                                     |
| `advent-sunday`            | Prima domenica di Avvento        | La quarta domenica prima di Natale              |
| `christmas-eve`            | Vigilia di Natale                | 24 dicembre                                     |
| `christmas`                | Natale                           | 25 dicembre                                     |

Il dataset contiene solo riferimenti, non il testo dei versi, quindi funziona con qualsiasi traduzione. I numeri dei versi utilizzano la numerazione standard inglese (la stessa del BSB). I dati possono essere letti in tre modi:

-   Il file [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) elenca tutti i versi presenti nel dataset con le relative categorie e le festività con le date corrispondenti.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) Elenca tutti i versetti di una categoria. Questo è il modo più semplice per scegliere un versetto del giorno da una categoria.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) elenca i candidati in un capitolo, con le relative categorie. Sono disponibili solo i capitoli che contengono un candidato; utilizzare i collegamenti ai capitoli del libro o `/api/d/verse-of-the-day/books.json` per trovarli.

I set di dati che contengono categorie di versi includono `listOfVersesApiLink` , `listOfCategoriesApiLink` e `totalNumberOfCategories` nella loro voce in `/api/available_datasets.json` .

### Scegliere un versetto del giorno

L'API è composta da file statici, quindi non sceglie un versetto per te. Esiste invece una convenzione per la scelta, in modo che ogni app che la segue mostri lo stesso versetto nello stesso giorno. Le app sono libere di scegliere diversamente; la convenzione fornisce semplicemente un valore predefinito condiviso.

La convenzione seleziona i versetti e le festività in `/api/d/verse-of-the-day/verses.json` In una festività, sceglie uno dei versetti della festività, scorrendoli un anno alla volta, quindi una festività ha un versetto diverso ogni anno finché non sono stati utilizzati tutti i suoi versetti. Negli altri giorni, ogni anno riceve il proprio shuffle dei versetti in uso in quell'anno (ordinati da un hash del riferimento di ciascun versetto, l'anno e un seed opzionale), e il versetto del giorno è quello corrispondente al giorno dell'anno della data in quello shuffle. Il dataset ha più di 366 versetti per ogni giorno in uso ogni anno, quindi un versetto non si ripete mai all'interno di un anno solare, l'ordine cambia ogni anno e la stessa data dà sempre lo stesso versetto. I nuovi versetti vengono aggiunti (con `addedIn` ) e quelli vecchi rimossi (con `removedIn` ) solo da un anno che non è ancora iniziato, quindi il versetto del giorno per una data passata non cambia mai.

La pagina ["Convenzione del Versetto del Giorno"](./verse-of-the-day-convention.md) specifica l'algoritmo passo dopo passo, con pseudocodice e valori di prova, in modo da poterlo implementare in qualsiasi linguaggio.

Per utilizzare un ordine personalizzato, scegli un seme a tua scelta (ad esempio, il nome della tua app): otterrai un incrocio diverso con le stesse garanzie. Puoi anche scegliere i versi di una singola categoria, ma ogni categoria ha meno versi dei giorni in un anno, quindi i suoi versi si ripeteranno prima.

Gli SDK seguono la convenzione:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Una data nel formato AAAA-MM-GG oppure una data (viene utilizzata la data del calendario locale). Il valore predefinito è la data odierna.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Ricava il testo del verso da una traduzione.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` scarica l'elenco dei versetti e ne sceglie uno da lì. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` sceglie da un elenco che hai già.
-   L'SDK Kotlin ha `getVerseOfTheDay(date?, seed?, category?)` e `pickVerseOfTheDay(verses, date?, seed?, category?)` , che prendono la data come una stringa `YYYY-MM-DD` .
-   L'SDK Swift ha `getVerseOfTheDay(date:seed:category:)` e `pickVerseOfTheDay(_:date:seed:category:holidays:)` , che prendono la data come una stringa `YYYY-MM-DD` o di `Date` (viene utilizzata la sua data del calendario nel fuso orario corrente).
-   Il [server MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) dispone di `getVerseOfTheDay` strumento che restituisce il versetto del giorno con il relativo testo.
-   Il pacchetto `@helloao/tools` ha lo stesso elenco e una funzione `getVerseOfTheDay(date?, { seed?, category? }?)` in `@helloao/tools/generation/verse-of-the-day.js` .

### Licenza

L'elenco è stato compilato da AO Lab ed è rilasciato sotto [licenza MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Il testo del verso proviene dalla traduzione da cui lo si prende.

## Elenca i versi in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Recupera ogni verso (o breve passaggio) in un dataset, con le categorie a cui appartiene ciascuno, in ordine canonico. Disponibile solo per dataset i cui versi hanno categorie, come `verse-of-the-day` .

-   `dataset` l'ID del dataset (es. `verse-of-the-day` ).

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Informazioni sul dataset relative ai versi.
     */
    dataset: Dataset;

    /**
     * Ogni verso (o breve passaggio) presente nel dataset, con le relative categorie, in ordine canonico.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Le festività che hanno i loro versi, con le loro date.
     * Omesso se il set di dati non include festività.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * L'ID della categoria della festività. Ad esempio "Natale".
     */
    id: string;

    /**
     * Il nome inglese della festività. Ad esempio "Christmas".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Il mese (1 per gennaio) e il giorno di una festività che cade nella stessa data ogni anno.
     * Omesso per le festività la cui data cambia ogni anno.
     */
    month?: number;
    day?: number;

    /**
     * Le date (AAAA-MM-GG, calendario gregoriano) di una festività la cui data cambia ogni anno, in ordine.
     * Sono calcolate in anticipo per un intervallo di anni (attualmente dal 2026 al 2125) e la festività viene osservata solo nelle date indicate.
     * Escluse le festività che cadono nella stessa data ogni anno.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * L'ID del libro. Ad esempio "PRO".
     */
    book: string;

    /**
     * Il numero del capitolo.
     */
    chapter: number;

    /**
     * Il numero del versetto.
     * Se è presente `endVerse` , allora questo è il versetto da cui inizia il brano.
     */
    verse: number;

    /**
     * Il verso in cui termina il brano.
     * Omesso se la voce è un singolo verso.
     */
    endVerse?: number;

    /**
     * Gli ID delle categorie a cui appartiene il verso, dalla più rilevante alla meno rilevante.
     */
    categories: string[];

    /**
     * Il primo anno in cui il verso può essere il verso del giorno.
     * Omesso se il versetto è sempre stato presente nell'elenco.
     */
    addedIn?: number;

    /**
     * Il primo anno in cui il versetto non può più essere il versetto del giorno.
     * I versetti rimossi rimangono nel dataset in modo che sia ancora possibile selezionare i versetti degli anni precedenti.
     * Omesso se il verso non è stato rimosso dall'elenco.
     */
    removedIn?: number;
}
```

### Esempio

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

## Elenca le categorie in un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Recupera l'elenco delle categorie di versi disponibili per un set di dati.

-   `dataset` l'ID del dataset (es. `verse-of-the-day` ).

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Informazioni sul set di dati per le categorie.
     */
    dataset: Dataset;

    /**
     * Elenco delle categorie di versi disponibili per il dataset.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * L'ID della categoria. Ad esempio "speranza".
     */
    id: string;

    /**
     * Il nome inglese della categoria. Ad esempio "Hope".
     */
    name: string;

    /**
     * Descrizione del contenuto dei versi di questa categoria.
     */
    description: string;

    /**
     * Il numero di versi (o brevi passaggi) che appartengono alla categoria.
     */
    numberOfVerses: number;

    /**
     * Le date della festività a cui si riferisce la categoria (vedi DatasetCategoryHoliday sopra).
     * Omesso per le categorie che non riguardano una festività.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Il link API per la categoria.
     */
    apiLink: string;
}
```

### Esempio

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

## Ottenere una categoria da un set di dati

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Ottiene una singola categoria di versi, con tutti i versi che le appartengono.

-   `dataset` l'ID del dataset (es. `verse-of-the-day` ).
-   `category` è l'ID della categoria (es. `hope` ).

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Le informazioni del set di dati per la categoria.
     */
    dataset: Dataset;

    /**
     * La categoria, con i versi che la compongono.
     */
    category: DatasetCategory;

    /**
     * Il link API per questa categoria.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * L'ID della categoria. Ad esempio "speranza".
     */
    id: string;

    /**
     * Il nome inglese della categoria. Ad esempio "Hope".
     */
    name: string;

    /**
     * Descrizione del contenuto dei versi di questa categoria.
     */
    description: string;

    /**
     * Le date della festività a cui si riferisce la categoria (vedi DatasetCategoryHoliday in "Elenca i versi in un Dataset").
     * In quelle date, il versetto del giorno è uno dei versetti della categoria e non viene utilizzato negli altri giorni.
     * Omesso per le categorie che non riguardano una festività.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * I versi (o brevi passaggi) che appartengono alla categoria, in ordine canonico.
     * Include i versi che sono stati rimossi dall'elenco (vedi `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * L'ID del libro. Ad esempio "JER".
     */
    book: string;

    /**
     * Il numero del capitolo.
     */
    chapter: number;

    /**
     * Il numero del versetto.
     * Se è presente `endVerse` , allora questo è il versetto da cui inizia il brano.
     */
    verse: number;

    /**
     * Il verso in cui termina il brano.
     * Omesso se il riferimento è un singolo verso.
     */
    endVerse?: number;

    /**
     * Il primo anno in cui il verso può essere il verso del giorno.
     * Omesso se il versetto è sempre stato presente nell'elenco.
     */
    addedIn?: number;

    /**
     * Il primo anno in cui il versetto non può più essere il versetto del giorno.
     * I versetti rimossi rimangono nel dataset in modo che sia ancora possibile selezionare i versetti degli anni precedenti.
     * Omesso se il verso non è stato rimosso dall'elenco.
     */
    removedIn?: number;
}
```

### Esempio

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
