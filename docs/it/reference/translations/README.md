# Traduzioni, libri e capitoli

Punti di accesso per sfogliare le traduzioni, visualizzare l'elenco dei libri e recuperare il contenuto dei capitoli.

Il contenuto dei capitoli, i download della traduzione completa e le annotazioni a livello di parola sono disponibili in due formati:

-   [**Formato standard**](./standard.md) : il formato originale e strutturato. Il contenuto dei versi è un elenco di elementi (testo semplice, testo formattato, riferimenti in nota a piè di pagina, ecc.) che devi assemblare tu stesso.
-   [**Formato semplificato**](./simplified.md) : un formato appiattito in cui il contenuto di ogni verso è una singola stringa, con note a piè di pagina, poesie e altri elementi di markup espressi come offset all'interno di tale stringa.

Utilizza il formato che meglio si adatta al modo in cui intendi visualizzare o elaborare il testo.

## Traduzioni disponibili

`GET https://bible.helloao.org/api/available_translations.json`

Recupera l'elenco delle traduzioni disponibili nell'API.

### Esempio di codice

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

### Struttura

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * L'elenco delle traduzioni.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * L'ID della traduzione.
     */
    id: string;

    /**
     * Il nome della traduzione.
     * Questo è solitamente il nome della traduzione nella lingua della traduzione.
     */
    name: string;

    /**
     * Il nome inglese della traduzione.
     */
    englishName: string;

    /**
     * Il sito web per la traduzione.
     */
    website: string;

    /**
     * L'URL dove è possibile trovare la licenza per la traduzione.
     */
    licenseUrl: string;

    /**
     * Nome abbreviato per la traduzione.
     */
    shortName: string;

    /**
     * Il codice ISO 639 che identifica la lingua principale in cui è stata effettuata la traduzione.
     */
    language: string;

    /**
     * Restituisce il nome della lingua in cui è stata effettuata la traduzione.
     * Valore nullo o indefinito se il nome della lingua non è noto.
     */
    languageName?: string;

    /**
     * Recupera il nome della lingua in inglese.
     * Valore nullo o indefinito se la lingua non ha un nome in inglese.
     */
    languageEnglishName?: string;

    /**
     * La direzione in cui è scritta la lingua.
     * "ltr" indica che il testo è scritto da sinistra a destra.
     * "rtl" indica che il testo viene scritto da destra a sinistra.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Elenco dei formati disponibili.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Il link API per l'elenco dei libri disponibili per questa traduzione.
     */
    listOfBooksApiLink: string;

    /**
     * Il numero di libri contenuti in questa traduzione.
     *
     * Le traduzioni complete dovrebbero avere lo stesso numero di libri della Bibbia (66).
     */
    numberOfBooks: number;

    /**
     * Il numero totale di capitoli contenuti in questa traduzione.
     *
     * Le traduzioni complete dovrebbero avere lo stesso numero di capitoli della Bibbia (1.189).
     */
    totalNumberOfChapters: number;

    /**
     * Il numero totale di versetti contenuti in questa traduzione.
     *
     * Le traduzioni complete dovrebbero avere lo stesso numero di versetti della Bibbia (circa 31.102 - alcune traduzioni escludono versetti basandosi sulla presunta probabilità della loro presenza nei testi originali).
     */
    totalNumberOfVerses: number;

    /**
     * Il numero totale di libri apocrifi contenuti in questa traduzione.
     * Omesso se la traduzione non include i testi apocrifi.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Il numero totale di capitoli apocrifi contenuti in questa traduzione.
     * Omesso se la traduzione non include i testi apocrifi.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * il numero totale di versi apocrifi contenuti in questa traduzione.
     * Omesso se la traduzione non include i testi apocrifi.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Esempio

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

## Elenco dei libri in traduzione

`GET https://bible.helloao.org/api/{translation}/books.json`

Recupera l'elenco dei libri disponibili per la traduzione specificata.

-   `translation` è l'ID della traduzione (es. `BSB` ).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Ottieni l'elenco dei libri per la traduzione BSB
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

### Struttura

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Informazioni sulla traduzione dei libri.
     */
    translation: Translation;

    /**
     * L'elenco dei libri disponibili per la traduzione.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * L'ID del libro.
     */
    id: string;

    /**
     * Il titolo che la traduzione ha dato al libro.
     */
    name: string;

    /**
     * Il nome comune del libro.
     */
    commonName: string;

    /**
     * Il titolo del libro.
     * Questa è solitamente una versione più descrittiva del titolo del libro.
     * Se non disponibile, significa che la traduzione non l'ha fornita.
     */
    title: string | null;

    /**
     * L'ordine numerico del libro nella traduzione.
     */
    order: number;

    /**
     * Il numero di capitoli che il libro contiene.
     */
    numberOfChapters: number;

    /**
     * Il numero del primo capitolo del libro.
     */
    firstChapterNumber: number;

    /**
     * Il link al primo capitolo del libro.
     */
    firstChapterApiLink: string;

    /**
     * Il numero dell'ultimo capitolo del libro.
     */
    lastChapterNumber: number;

    /**
     * Il link all'ultimo capitolo del libro.
     */
    lastChapterApiLink: string;

    /**
     * Il numero di versi contenuti nel libro.
     */
    totalNumberOfVerses: number;

    /**
     * Se il libro sia apocrifo o meno.
     * Omesso se la traduzione è canonica.
     */
    isApocryphal?: boolean;
}
```

### Esempio

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
