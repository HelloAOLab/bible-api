# conjuntos de datos

Puntos de acceso para explorar conjuntos de datos bíblicos complementarios, como referencias cruzadas, entidades bíblicas (personas, lugares, eventos y grupos de personas), palabras interlineales en el idioma original, léxicos y posibles versículos del día, y para obtener sus libros, contenido de capítulos, entidades, entradas de léxico y categorías de versículos.

## Conjuntos de datos disponibles

`GET https://bible.helloao.org/api/available_datasets.json`

Obtiene la lista de conjuntos de datos bíblicos disponibles en la API.

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * La lista de conjuntos de datos.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * El ID del conjunto de datos.
     */
    id: string;

    /**
     * El nombre del conjunto de datos.
     */
    name: string;

    /**
     * El sitio web del conjunto de datos.
     */
    website: string;

    /**
     * La URL donde se puede encontrar la licencia del conjunto de datos.
     */
    licenseUrl: string;

    /**
     * Notas añadidas por la API para la licencia.
     * Nulo o indefinido si no hay notas.
     */
    licenseNotes?: string | null;

    /**
     * El nombre en inglés del conjunto de datos.
     */
    englishName: string;

    /**
     * La etiqueta de idioma de 3 letras ISO 639 en la que se encuentra principalmente el conjunto de datos.
     */
    language: string;

    /**
     * La dirección en la que está escrito el idioma.
     * "ltr" indica que el texto se escribe desde el lado izquierdo de la página hacia la derecha.
     * "rtl" indica que el texto se escribe desde el lado derecho de la página hacia la izquierda.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Enlace a la API para la lista de libros disponibles para este conjunto de datos.
     */
    listOfBooksApiLink: string;

    /**
     * La lista de formatos disponibles.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * El número de libros que contiene este conjunto de datos.
     */
    numberOfBooks: number;

    /**
     * El número total de capítulos que contiene este conjunto de datos.
     */
    totalNumberOfChapters: number;

    /**
     * El número total de versículos que contiene este conjunto de datos.
     */
    totalNumberOfVerses: number;

    /**
     * El número total de referencias cruzadas que contiene este conjunto de datos.
     * 0 para conjuntos de datos que no contienen referencias cruzadas.
     */
    totalNumberOfReferences: number;

    /**
     * El número total de palabras interlineales que contiene este conjunto de datos.
     * Se omite si el conjunto de datos no contiene palabras interlineales.
     */
    totalNumberOfWords?: number;

    /**
     * Obtiene el nombre del idioma en el que se encuentra el conjunto de datos.
     * Nulo o indefinido si se desconoce el nombre del idioma.
     */
    languageName?: string;

    /**
     * Obtiene el nombre del idioma en inglés.
     * Nulo o indefinido si el idioma no tiene un nombre en inglés.
     */
    languageEnglishName?: string;

    /**
     * Los enlaces API para las listas de entidades en el conjunto de datos.
     * Se omite si el conjunto de datos no contiene las entidades correspondientes.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * El número total de entidades que contiene el conjunto de datos.
     * Se omite si el conjunto de datos no contiene las entidades correspondientes.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * Enlace a la API para la lista de entradas del léxico en el conjunto de datos.
     * Se omite si el conjunto de datos no contiene entradas de léxico.
     */
    listOfLexiconApiLink?: string;

    /**
     * El número total de entradas del léxico que contiene el conjunto de datos.
     * Se omite si el conjunto de datos no contiene entradas de léxico.
     */
    totalNumberOfLexicon?: number;

    /**
     * Enlace a la API para la lista de todos los versículos del conjunto de datos, con sus categorías.
     * Se omite si los versículos del conjunto de datos no tienen categorías.
     */
    listOfVersesApiLink?: string;

    /**
     * Enlace a la API para la lista de categorías de versos en el conjunto de datos.
     * Se omite si el conjunto de datos no contiene categorías de versos.
     */
    listOfCategoriesApiLink?: string;

    /**
     * El número total de categorías de versículos que contiene el conjunto de datos.
     * Se omite si el conjunto de datos no contiene categorías de versos.
     */
    totalNumberOfCategories?: number;
}
```

### Ejemplo

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

## Listar libros en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Obtiene la lista de libros disponibles para el conjunto de datos proporcionado.

-   `dataset` el ID del conjunto de datos (por ejemplo `open-cross-ref` ).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Obtén la lista de libros para el conjunto de datos open-cross-ref.
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

### Estructura

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * La información del conjunto de datos para los libros.
     */
    dataset: Dataset;

    /**
     * La lista de libros disponibles para el conjunto de datos.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * La identificación del libro.
     * Coincide con el ID del libro correspondiente en la Biblia (GEN, EXO, etc.).
     */
    id: string;

    /**
     * El orden de los libros en la Biblia.
     */
    order: number;

    /**
     * El número del primer capítulo del libro.
     */
    firstChapterNumber: number;

    /**
     * Enlace al primer capítulo del libro.
     */
    firstChapterApiLink: string | null;

    /**
     * El número del último capítulo del libro.
     */
    lastChapterNumber: number | null;

    /**
     * El enlace al último capítulo del libro.
     */
    lastChapterApiLink: string | null;

    /**
     * El número de capítulos que contiene el libro.
     */
    numberOfChapters: number;

    /**
     * El número de versículos que contiene el libro.
     */
    totalNumberOfVerses: number;

    /**
     * El número total de referencias cruzadas que contiene este libro.
     */
    totalNumberOfReferences: number;
}
```

### Ejemplo

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

## Obtener un capítulo de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Obtiene el contenido de un solo capítulo de un libro y un conjunto de datos determinados.

Para conjuntos de datos de referencias cruzadas (como `open-cross-ref` ), el capítulo contiene la lista de referencias cruzadas para cada versículo. Para conjuntos de datos interlineales (como `bsb-interlinear` ), el capítulo contiene las palabras en el idioma original de cada versículo; consulte [Conjuntos de datos interlineales](#interlinear-datasets) . Para conjuntos de datos de entidades (como el `theographic` ), el capítulo contiene las personas, lugares y eventos que aparecen en el capítulo; consulte [Obtener las entidades en un capítulo](#get-the-entities-in-a-chapter) . Para el conjunto de datos `verse-of-the-day` , el capítulo contiene los candidatos a versículo del día en el capítulo y sus categorías; consulte [Versículo del día](#verse-of-the-day) .

-   `dataset` el ID del conjunto de datos (por ejemplo `open-cross-ref` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Obtén Génesis 1 del conjunto de datos open-cross-ref.
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

### Estructura

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Información del conjunto de datos para el capítulo del libro.
     */
    dataset: Dataset;

    /**
     * La información del libro correspondiente al capítulo del libro.
     */
    book: DatasetBook;

    /**
     * El enlace a este capítulo.
     */
    thisChapterLink: string;

    /**
     * El enlace al siguiente capítulo.
     * Nulo si este es el último capítulo del conjunto de datos.
     */
    nextChapterApiLink: string | null;

    /**
     * El enlace al capítulo anterior.
     * Nulo si este es el primer capítulo del conjunto de datos.
     */
    previousChapterApiLink: string | null;

    /**
     * El número de versículos que contiene el capítulo.
     */
    numberOfVerses: number;

    /**
     * La información del capítulo.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * El número del capítulo.
     */
    number: number;

    /**
     * El contenido del capítulo.
     */
    content: DatasetVerse[];
}

/**
 * Un versículo contiene `references` (conjuntos de datos de referencia cruzada), `words` (conjuntos de datos interlineales) o `categories` (el conjunto de datos del versículo del día).
 * Comprueba cuál está presente con `'words' in verse` o `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * El número del versículo.
     */
    verse: number;

    /**
     * Las referencias cruzadas del versículo.
     *
     * Ordenado por puntuación, descendente.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * El número del versículo.
     */
    verse: number;

    /**
     * Las palabras del verso en su idioma original, en el orden del texto original.
     * Consulte la sección "Conjuntos de datos interlineales" a continuación.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * El número del versículo.
     * Si aparece `endVerse` , entonces este es el versículo donde comienza el pasaje.
     */
    verse: number;

    /**
     * El versículo en el que termina el pasaje.
     * Se omite si la entrada es un solo verso.
     */
    endVerse?: number;

    /**
     * Los identificadores de las categorías a las que pertenece el verso, de la más relevante a la más antigua.
     * Vea el "Versículo del día" a continuación.
     */
    categories: string[];

    /**
     * El primer año en que el versículo puede ser el versículo del día.
     * Se omite si el versículo siempre ha estado en la lista.
     */
    addedIn?: number;

    /**
     * El primer año en que el versículo ya no puede ser el versículo del día.
     * Los versículos eliminados permanecen en el conjunto de datos para que aún se puedan seleccionar los versículos de años anteriores.
     * Se omite si el versículo no ha sido eliminado de la lista.
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * El ID del libro al que se hace referencia.
     */
    book: string;

    /**
     * El número del capítulo.
     */
    chapter: number;

    /**
     * El número del versículo.
     * Si aparece `endVerse` , entonces este es el versículo donde comienza la referencia.
     */
    verse: number;

    /**
     * El versículo donde termina la referencia.
     */
    endVerse?: number;

    /**
     * La puntuación de relevancia para la referencia.
     */
    score?: number;
}

// Consulte la sección "Conjuntos de datos interlineales" a continuación para conocer la estructura de InterlinearWord.
```

### Ejemplo

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

## Entidades

Algunos conjuntos de datos, como el conjunto de datos [de metadatos bíblicos teográficos](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ), contienen entidades: personas, lugares, eventos y grupos de personas, junto con las relaciones entre ellos y los versículos bíblicos que los mencionan.

El conjunto de datos [History Globe](https://historyglobe.app) ( `history-globe` ) contiene solo lugares: los lugares nombrados en la Biblia, con sus coordenadas y los versículos que los nombran. Sus identificadores de lugar (por ejemplo, `a15257a` para Jerusalén) son los identificadores de lugar estables de History Globe, los mismos que utiliza su propia [API de datos abiertos](https://historyglobe.app/docs/api.html) , por lo que no cambian cuando se corrige un nombre. Sus `featureType` valores siguen los que utiliza el conjunto de datos Theographic ( `City` , `Region` , `Water` , etc.), y `featureSubType` lleva el tipo más específico cuando lo hay (por ejemplo, `River` , `Gate` , `Spring` ).

Los conjuntos de datos que contienen entidades incluyen las propiedades `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` y `listOfPeopleGroupsApiLink` en su entrada en `/api/available_datasets.json` .

Los conjuntos de datos de entidades también proporcionan datos alineados con los capítulos: `/api/d/{dataset}/books.json` enumera los libros cuyos capítulos contienen datos de entidades, y `/api/d/{dataset}/{book}/{chapter}.json` devuelve las personas, lugares y eventos que aparecen en ese capítulo, junto con los números de versículo donde se menciona cada uno. Consulte [Obtener las entidades en un capítulo](#get-the-entities-in-a-chapter) .

Las entidades hacen referencia a pasajes bíblicos utilizando los mismos identificadores de libro, números de capítulo y números de versículo que el resto de la API, por lo que pueden combinarse con cualquier traducción. Se referencian entre sí mediante referencias de entidad:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * El ID de la entidad a la que se hace referencia.
     */
    id: string;

    /**
     * El tipo de entidad a la que se hace referencia.
     * Coincide con el segmento de colección del enlace API de la entidad, por lo que el enlace se puede construir como `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * El nombre de la entidad a la que se hace referencia.
     */
    name?: string;

    /**
     * El enlace API de la entidad a la que se hace referencia.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * La identificación del libro (GEN, EXO, etc.).
     */
    book: string;

    /**
     * El número de capítulo donde comienza la referencia.
     */
    chapter: number;

    /**
     * El número de versículo donde comienza la referencia.
     */
    verse: number;

    /**
     * El versículo donde termina la referencia.
     * Los versículos consecutivos del mismo capítulo se agrupan en una sola referencia.
     */
    endVerse?: number;
}
```

### Atribución de History Globe

Los datos de History Globe están bajo la licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Si los utiliza, cite a History Globe ( https://historyglobe.app ) y a los datos de geocodificación bíblica de OpenBible.info en los que se basan, e indique cualquier modificación. La propiedad `licenseNotes` del conjunto de datos contiene la atribución.

## Obtener las entidades en un capítulo

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Para conjuntos de datos de entidades, se obtienen las personas, los lugares y los eventos que aparecen en un solo capítulo, junto con los números de versículo en el capítulo donde se menciona cada uno.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).

La lista de libros y capítulos que tienen datos de entidades está disponible en `GET https://bible.helloao.org/api/d/{dataset}/books.json` , que sigue la misma estructura que el [punto final de libros del conjunto de datos](#list-books-in-a-dataset) . Para los conjuntos de datos de entidades, `totalNumberOfVerses` es el número de versículos que son mencionados por al menos una entidad y `totalNumberOfReferences` es el número total de menciones de entidades-versículos.

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Obtén las personas, los lugares y los eventos que aparecen en Génesis 2.
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

### Estructura

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Información del conjunto de datos para el capítulo del libro.
     */
    dataset: Dataset;

    /**
     * La información del libro correspondiente al capítulo del libro.
     */
    book: DatasetBook;

    /**
     * Los datos de la entidad para el capítulo.
     */
    chapter: DatasetEntityChapterData;

    /**
     * El enlace a este capítulo.
     */
    thisChapterLink: string;

    /**
     * El enlace al siguiente capítulo.
     * Nulo si este es el último capítulo del conjunto de datos.
     */
    nextChapterApiLink: string | null;

    /**
     * El enlace al capítulo anterior.
     * Nulo si este es el primer capítulo del conjunto de datos.
     */
    previousChapterApiLink: string | null;

    /**
     * El número de personas, lugares y eventos que aparecen en el capítulo.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * El número del capítulo.
     */
    number: number;

    /**
     * Las personas que aparecen en el capítulo.
     * Ordenados según el primer verso en el que aparecen.
     */
    people: ChapterPerson[];

    /**
     * Los lugares que aparecen en el capítulo.
     * Ordenados según el primer verso en el que aparecen.
     */
    places: ChapterPlace[];

    /**
     * Los acontecimientos que aparecen en el capítulo.
     * Ordenados según el primer verso en el que aparecen.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * El documento de identidad de la persona.
     */
    id: string;

    /**
     * El nombre de la persona.
     */
    name: string;

    /**
     * Si el nombre de la persona es un nombre propio.
     */
    isProperName?: boolean;

    /**
     * El género de la persona.
     */
    gender?: string;

    /**
     * El año en que nació la persona y el año en que murió.
     * Los números negativos representan los años antes de Cristo. Los números positivos representan los años después de Cristo.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * El enlace API para la persona.
     */
    apiLink: string;

    /**
     * Los números de los versículos del capítulo que mencionan a la persona.
     * Ordenados en orden ascendente.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * La identificación del lugar.
     */
    id: string;

    /**
     * El nombre del lugar.
     */
    name: string;

    /**
     * El tipo de accidente geográfico que es el lugar.
     */
    featureType?: string;

    /**
     * La latitud y longitud del lugar.
     */
    latitude?: number;
    longitude?: number;

    /**
     * El enlace API del lugar.
     */
    apiLink: string;

    /**
     * Los números de los versículos del capítulo que mencionan el lugar.
     * Ordenados en orden ascendente.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * El ID del evento.
     */
    id: string;

    /**
     * El nombre del evento.
     */
    name: string;

    /**
     * La fecha en que comenzó el evento.
     */
    startDate?: string;

    /**
     * El enlace de la API para el evento.
     */
    apiLink: string;

    /**
     * Los números de los versículos del capítulo que describen el evento.
     * Ordenados en orden ascendente.
     */
    verses: number[];
}
```

### Ejemplo

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

## Enumerar personas en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Obtiene la lista de personas disponibles para el conjunto de datos proporcionado.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Obtén la lista de personas para el conjunto de datos teográficos.
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

### Estructura

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * La información del conjunto de datos para las personas.
     */
    dataset: Dataset;

    /**
     * La lista de personas disponibles para el conjunto de datos.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * El documento de identidad de la persona.
     */
    id: string;

    /**
     * El nombre de la persona.
     */
    name: string;

    /**
     * Si el nombre de la persona es un nombre propio.
     */
    isProperName?: boolean;

    /**
     * El género de la persona.
     */
    gender?: string;

    /**
     * El número de referencias bíblicas que mencionan a la persona.
     */
    numberOfReferences: number;

    /**
     * El enlace API para la persona.
     */
    thisPersonApiLink: string;
}
```

### Ejemplo

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

## Obtener una persona de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Obtiene información sobre una sola persona, incluidas las referencias bíblicas que la mencionan y sus relaciones con otras personas, lugares, eventos y grupos de personas.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).
-   `person` el ID de la persona (por ejemplo `paul_2479` ).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Obtén la información sobre Pablo del conjunto de datos teográficos.
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

### Estructura

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * La información del conjunto de datos para la persona.
     */
    dataset: Dataset;

    /**
     * La información sobre la persona.
     */
    person: DatasetPerson;

    /**
     * El enlace API para esta persona.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * El documento de identidad de la persona.
     */
    id: string;

    /**
     * El nombre de la persona.
     */
    name: string;

    /**
     * Otros nombres con los que se conoce a la persona.
     */
    alsoCalled?: string[];

    /**
     * Si el nombre de la persona es un nombre propio.
     */
    isProperName?: boolean;

    /**
     * El género de la persona.
     */
    gender?: string;

    /**
     * La descripción de la persona. Cada cadena es un párrafo.
     */
    description?: string[];

    /**
     * El año en que nació la persona y el año en que murió.
     * Los números negativos representan los años antes de Cristo. Los números positivos representan los años después de Cristo.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Los primeros y últimos años en los que se menciona a la persona.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * El lugar donde la persona nació y murió.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Las relaciones familiares de la persona.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Los grupos de personas a los que pertenece la persona.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Los eventos en los que participó la persona.
     */
    events?: DatasetEntityRef[];

    /**
     * La lista de referencias bíblicas que mencionan a la persona.
     * Ordenados por orden del libro, capítulo y versículo.
     */
    references: VerseRef[];
}
```

### Ejemplo

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

## Enumerar lugares en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Obtiene la lista de lugares disponibles para el conjunto de datos dado.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).

### Estructura

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * La información del conjunto de datos para los lugares.
     */
    dataset: Dataset;

    /**
     * La lista de lugares disponibles para el conjunto de datos.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * La identificación del lugar.
     */
    id: string;

    /**
     * El nombre del lugar.
     */
    name: string;

    /**
     * El tipo de accidente geográfico que es el lugar.
     * Por ejemplo, "Ciudad", "Región", "Montaña", "Agua", etc.
     */
    featureType?: string;

    /**
     * La latitud y longitud del lugar.
     */
    latitude?: number;
    longitude?: number;

    /**
     * El número de referencias bíblicas que mencionan el lugar.
     */
    numberOfReferences: number;

    /**
     * El enlace API del lugar.
     */
    thisPlaceApiLink: string;
}
```

## Obtener un lugar a partir de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Obtiene información sobre un lugar específico, incluyendo las referencias bíblicas que lo mencionan, así como las personas y los eventos relacionados.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).
-   `place` el ID del lugar (por ejemplo `jerusalem_636` ).

### Estructura

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * La información del conjunto de datos para el lugar.
     */
    dataset: Dataset;

    /**
     * La información sobre el lugar.
     */
    place: DatasetPlace;

    /**
     * El enlace API para este lugar.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * La identificación del lugar.
     */
    id: string;

    /**
     * El nombre del lugar.
     */
    name: string;

    /**
     * El nombre del lugar tal como aparece en la versión King James y en la versión English Standard Version.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Otros nombres con los que se conoce el lugar.
     */
    aliases?: string[];

    /**
     * El tipo de accidente geográfico que es el lugar.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * La latitud y la longitud del lugar, y su precisión.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * La descripción del lugar. Cada cadena es un párrafo.
     */
    description?: string[];

    /**
     * El comentario sobre el lugar por parte de los autores del conjunto de datos.
     */
    comment?: string;

    /**
     * El origen de este lugar.
     * Los diferentes nombres para una misma ubicación geográfica comparten el mismo origen.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * El lugar del que este lugar es una copia.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Las personas que han estado allí, que nacieron allí o que murieron allí.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Los acontecimientos que tuvieron lugar allí.
     */
    events?: DatasetEntityRef[];

    /**
     * La lista de referencias bíblicas que mencionan el lugar.
     * Ordenados por orden del libro, capítulo y versículo.
     */
    references: VerseRef[];
}
```

### Ejemplo

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

## Enumerar eventos en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Obtiene la lista de eventos disponibles para el conjunto de datos dado.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).

### Estructura

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * La información del conjunto de datos para los eventos.
     */
    dataset: Dataset;

    /**
     * La lista de eventos disponibles para el conjunto de datos.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * El ID del evento.
     */
    id: string;

    /**
     * El nombre del evento.
     */
    name: string;

    /**
     * La fecha en que comenzó el evento.
     * Los números negativos representan años antes de Cristo. Los números positivos representan años después de Cristo.
     * Para fechas más específicas, utilice el formato `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * El número de referencias bíblicas que describen el evento.
     */
    numberOfReferences: number;

    /**
     * El enlace de la API para el evento.
     */
    thisEventApiLink: string;
}
```

## Obtener un evento de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Obtiene información sobre un evento específico, incluyendo las referencias bíblicas que lo describen, así como las personas, lugares y grupos étnicos relacionados.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).
-   `event` el ID del evento (por ejemplo `saul-is-converted_326` ).

### Estructura

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * La información del conjunto de datos para el evento.
     */
    dataset: Dataset;

    /**
     * La información sobre el evento.
     */
    event: DatasetEvent;

    /**
     * El enlace de la API para este evento.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * El ID del evento.
     */
    id: string;

    /**
     * El nombre del evento.
     */
    name: string;

    /**
     * La fecha en que comenzó el evento.
     */
    startDate?: string;

    /**
     * La duración del evento.
     * Por ejemplo, "1D" significa un día y "40Y" significa cuarenta años.
     */
    duration?: string;

    /**
     * Las personas que participaron en el evento.
     */
    participants?: DatasetEntityRef[];

    /**
     * Los lugares donde tuvo lugar el evento.
     */
    locations?: DatasetEntityRef[];

    /**
     * Los grupos de personas que participaron en el evento.
     */
    groups?: DatasetEntityRef[];

    /**
     * El evento del que forma parte este evento.
     */
    partOf?: DatasetEntityRef;

    /**
     * El evento que ocurrió antes de este evento.
     */
    predecessor?: DatasetEntityRef;

    /**
     * La lista de referencias bíblicas que describen el evento.
     * Ordenados por orden del libro, capítulo y versículo.
     */
    references: VerseRef[];
}
```

### Ejemplo

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

## Enumerar grupos de personas en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Obtiene la lista de grupos de personas disponibles para el conjunto de datos proporcionado.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).

### Estructura

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * La información del conjunto de datos para los grupos de personas.
     */
    dataset: Dataset;

    /**
     * La lista de grupos de personas disponibles para el conjunto de datos.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * La identificación del grupo de personas.
     */
    id: string;

    /**
     * El nombre del grupo étnico.
     */
    name: string;

    /**
     * El número de personas que son miembros del grupo étnico.
     */
    numberOfMembers: number;

    /**
     * El enlace API para el grupo de personas.
     */
    thisPeopleGroupApiLink: string;
}
```

## Obtener un grupo de personas a partir de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Obtiene información sobre un grupo étnico específico, incluyendo a sus miembros y los eventos en los que participó dicho grupo.

-   `dataset` el ID del conjunto de datos (por ejemplo `theographic` ).
-   `group` el ID del grupo de personas (por ejemplo `tribe-of-benjamin` ).

### Estructura

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Información del conjunto de datos para el grupo de personas.
     */
    dataset: Dataset;

    /**
     * La información sobre el grupo de personas.
     */
    group: DatasetPeopleGroup;

    /**
     * El enlace API para este grupo de personas.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * La identificación del grupo de personas.
     */
    id: string;

    /**
     * El nombre del grupo étnico.
     */
    name: string;

    /**
     * Las personas que son miembros del grupo étnico.
     */
    members?: DatasetEntityRef[];

    /**
     * Los eventos en los que participó el grupo de personas.
     */
    events?: DatasetEntityRef[];

    /**
     * La lista de referencias bíblicas que mencionan a este grupo étnico.
     * Ordenados por orden del libro, capítulo y versículo.
     */
    references: VerseRef[];
}
```

### Ejemplo

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

## Conjuntos de datos interlineales

El conjunto de datos interlineales Bereanos ( `bsb-interlinear` ) enumera las palabras en los idiomas originales (hebreo, arameo y griego) de cada versículo de la Biblia, en el orden en que aparecen en el texto original. Cada palabra tiene su transliteración, análisis gramatical, [número de Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) y la frase en inglés que la [Biblia Estándar Bereana](https://berean.bible) utiliza para ella.

El conjunto de datos utiliza los mismos puntos finales que otros conjuntos de datos:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` enumera los 66 libros.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (ej. `/api/d/bsb-interlinear/GEN/1.json` ) devuelve el capítulo, con `{ verse, words }` para cada versículo. La respuesta es un [conjunto de datos llamado capítulo](#get-a-chapter-from-a-dataset) .

Los datos de las palabras provienen de las [tablas interlineales de la Biblia Estándar Bereana](https://bereanbible.com/) , que son de dominio público. Los números de Strong para las palabras se buscan en el [léxico](#lexicon) ( `stepbible-lexicon` ).

### Estructura

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * La posición de la palabra (basada en 1) en el orden del texto original.
     * Las palabras se enumeran en este orden.
     */
    pos: number;

    /**
     * El rango de la palabra, basado en 1, en el orden en inglés de la Biblia Estándar Bereana.
     */
    bsbPos: number;

    /**
     * El lenguaje de la palabra.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * La palabra en el guion original. Normalizada mediante NFC.
     */
    text: string;

    /**
     * La transliteración de la palabra.
     */
    transliteration: string | null;

    /**
     * El código de análisis gramatical corto de la palabra. Por ejemplo, "N-mp" o "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * El análisis gramatical detallado de la palabra.
     */
    parsingFull: string | null;

    /**
     * El número de Strong de la palabra, rellenado con ceros. Por ejemplo, "H0430" o "G3056".
     * Con relleno de ceros, lo que coincide con los valores `.words.json` de la KJV.
     * Es posible que los valores de otras traducciones necesiten relleno con ceros y eliminación de sufijos antes de la unión.
     * Nulo cuando la fuente no proporciona el número de Strong para la palabra (este es el caso de algunas palabras que son sufijos, como los sufijos de pronombres).
     */
    strongs: string | null;

    /**
     * La frase en inglés de la Biblia Estándar Bereana para la palabra.
     * Nulo cuando el BSB deja la palabra sin traducir (como el marcador de objeto directo en hebreo).
     */
    gloss: string | null;
}
```

### Ejemplo

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

### Enlace de palabras con traducciones

Los valores interlineales `strongs` se rellenan con ceros (p. ej., `H0430` ). Esto coincide con los valores `strongs` en las anotaciones de palabras de la KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Los valores de otras traducciones pueden necesitar relleno con ceros y eliminación de sufijos (p. ej., `H430` o `H1961a` a `H0430` y `H1961` ) antes de poder unirse.

-   **KJV.** Para la versión King James ( `eng_kjv` y `eng_kja` ), combine los números de Strong en el archivo `.words.json` de un capítulo con el `strongs` de las palabras interlineales del mismo versículo. Por ejemplo, cada número de Strong anotado en `/api/eng_kjv/GEN/1.words.json` para el versículo 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) aparece como un valor `strongs` entre las palabras del versículo 1 en `/api/d/bsb-interlinear/GEN/1.json` .
-   **Biblia Estándar Bereana.** El `gloss` de cada palabra es la frase de la BSB para esa palabra. Recorre las palabras del versículo en `bsbPos` y compara cada `gloss` con el texto del versículo en la traducción de la BSB para encontrar la traducción de la palabra.

La numeración de ambas fuentes no siempre coincide. Por ejemplo, la versión King James etiqueta "was" como `G2258` , mientras que la tabla Bereana tiene `G1510` Algunas uniones fallan debido a diferencias como esta.

### Atribución

Las tablas interlineales de Berea son de dominio público. El [léxico](#lexicon) está bajo la licencia CC BY 4.0 y requiere atribución.

## Léxico

El conjunto de datos del léxico STEPBible ( `stepbible-lexicon` ) contiene los léxicos breves hebreo, arameo y griego (TBESH y TBESG) de [STEPBible.org](https://www.stepbible.org/) en Tyndale House, Cambridge. Tiene una entrada para cada número base de Strong, y cada entrada tiene uno o más sentidos con el lema, la transliteración, la categoría gramatical, la glosa en inglés y una definición.

Cualquier valor `strongs` con ceros de relleno de una [palabra interlineal](#interlinear-datasets) que tenga una entrada en el léxico puede consultarse en `/api/d/stepbible-lexicon/lexicon/{strongs}.json` sin reformatear. Lo mismo ocurre con los valores `.words.json` de la KJV; los valores de otras traducciones pueden requerir relleno con ceros y eliminación de sufijos previamente. Las entradas griegas que el léxico añade sin un número de Strong no se publican.

Los conjuntos de datos que contienen entradas de léxico incluyen `listOfLexiconApiLink` y `totalNumberOfLexicon` en su entrada en `/api/available_datasets.json` .

### Atribución

Los datos del léxico están bajo la licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Si los utiliza, cite a STEPBible.org / Tyndale House, Cambridge, e indique cualquier modificación. La propiedad `licenseNotes` del conjunto de datos contiene la atribución.

## Listar las entradas del léxico en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Obtiene la lista de entradas del léxico que están disponibles para un conjunto de datos.

-   `dataset` el ID del conjunto de datos (por ejemplo `stepbible-lexicon` ).

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * La información del conjunto de datos para el léxico.
     */
    dataset: Dataset;

    /**
     * La lista de entradas del léxico disponibles para el conjunto de datos.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * El número de Strong con ceros de relleno de la entrada del léxico. Por ejemplo, "H0430".
     */
    id: string;

    /**
     * El idioma de la entrada del léxico.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * El nombre de la entrada del léxico.
     * Este es el lema del primer sentido de la entrada.
     */
    name: string;

    /**
     * El enlace API para la entrada del léxico.
     */
    apiLink: string;
}
```

### Ejemplo

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

## Obtener una entrada de léxico de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Obtiene la entrada del léxico para un número de Strong de base única, con todos sus sentidos.

-   `dataset` el ID del conjunto de datos (por ejemplo `stepbible-lexicon` ).
-   `strongs` es el número de Strong con ceros a la izquierda (por ejemplo, `H0430` para la palabra hebrea _elohim_ o `G3056` para la palabra griega _logos_).

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * La información del conjunto de datos para la entrada del léxico.
     */
    dataset: Dataset;

    /**
     * La entrada del léxico.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Enlace API para esta entrada del léxico.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * El número de Strong de la entrada, rellenado con ceros. Por ejemplo: "H0430".
     */
    id: string;

    /**
     * El idioma de la entrada.
     * Este es el lenguaje del primer sentido de la entrada.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Los sentidos de la entrada, en orden de identificación.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * El identificador extendido del sentido. Por ejemplo, "H0001G".
     * Igual al número de Strong base cuando el número tiene un solo sentido.
     */
    id: string;

    /**
     * El lenguaje de los sentidos.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * El lema del sentido en el guion original.
     */
    lemma: string;

    /**
     * La transliteración del lema.
     */
    transliteration: string | null;

    /**
     * La parte de la oración (morfología) del código del sentido.
     */
    partOfSpeech: string | null;

    /**
     * La breve explicación en inglés del significado.
     */
    gloss: string | null;

    /**
     * La definición del sentido como texto plano.
     * Los párrafos están separados por líneas en blanco. Se ha eliminado el formato del código fuente.
     */
    definition: string;
}
```

### Ejemplo

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

## Versículo del día

El conjunto de datos del versículo del día ( `verse-of-the-day` ) es una lista seleccionada de versículos conocidos y pasajes cortos (de un máximo de tres versículos) que son buenos candidatos para un "versículo del día": más de 640 para cada día del año y más de 100 para las festividades cristianas. Cada uno tiene sentido por sí mismo.

Cada versículo para cada día tiene de una a tres categorías, de la más relevante a la más importante, de este conjunto fijo:

| IDENTIFICACIÓN | Descripción                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `comfort`      | La cercanía y el cuidado de Dios en el dolor, la aflicción y la soledad. |
| `courage`      | Mantenerse firme y no tener miedo.                                       |
| `faith`        | Confiar en Dios y en sus promesas.                                       |
| `forgiveness`  | El perdón de Dios a los pecados y el perdón a los demás.                 |
| `gratitude`    | Dando gracias a Dios.                                                    |
| `guidance`     | Dios dirige nuestros pasos, planes y decisiones.                         |
| `hope`         | Confianza en el futuro que Dios ha prometido.                            |
| `inspiration`  | Animar a vivir la fe y a hacer el bien.                                  |
| `joy`          | Gozo y alegría en Dios.                                                  |
| `love`         | El amor de Dios por nosotros y nuestro amor por Dios y por los demás.    |
| `peace`        | Descanso, tranquilidad y ausencia de ansiedad.                           |
| `praise`       | Adoración y declaraciones de la grandeza de Dios.                        |
| `prayer`       | Invocando a Dios y su promesa de escuchar.                               |
| `provision`    | Dios provee lo que necesitamos.                                          |
| `salvation`    | Redención, gracia y nueva vida en Cristo.                                |
| `strength`     | Dios nos da fuerza y ​​resistencia.                                      |
| `wisdom`       | Sabiduría divina e instrucciones prácticas para la vida.                 |

Los días festivos tienen sus propias categorías. En un día festivo, el versículo del día es uno de los versículos propios de la festividad, y esos versículos no se usan en otros días. Un día festivo suele durar un día; Después del Domingo de Resurrección dura los tres días posteriores al Domingo de Resurrección, por lo que se incluyen las tres fechas. Cada categoría de día festivo tiene un `holiday` con sus fechas: los días festivos que se celebran en la misma fecha cada año tienen un `month` y `day` , y los días festivos cuya fecha cambia cada año (porque dependen del Domingo de Resurrección o del Adviento) tienen su `dates` en el calendario gregoriano, precalculado para el período 2026-2125.

| IDENTIFICACIÓN             | Día festivo                         | Fecha                                                |
| -------------------------- | ----------------------------------- | ---------------------------------------------------- |
| `epiphany`                 | Epifanía                            | 6 de enero                                           |
| `ash-wednesday`            | Miércoles de ceniza                 | 46 días antes del Domingo de Resurrección            |
| `palm-sunday`              | Domingo de Ramos                    | El domingo anterior al Domingo de Resurrección       |
| `maundy-thursday`          | Jueves Santo                        | El jueves anterior al Domingo de Resurrección        |
| `good-friday`              | Viernes Santo                       | El viernes anterior al Domingo de Resurrección       |
| `resurrection-sunday`      | Domingo de Resurrección             | Domingo de Resurrección                              |
| `post-resurrection-sunday` | Después del Domingo de Resurrección | Los tres días posteriores al Domingo de Resurrección |
| `ascension-day`            | Día de la Ascensión                 | 39 días después del Domingo de Resurrección          |
| `pentecost`                | Pentecostés                         | 49 días después del Domingo de Resurrección          |
| `all-hallows-eve`          | Noche de Todos los Santos           | 31 de octubre                                        |
| `all-saints-day`           | Día de Todos los Santos             | 1 de noviembre                                       |
| `advent-sunday`            | Primer domingo de Adviento          | El cuarto domingo antes de Navidad                   |
| `christmas-eve`            | Nochebuena                          | 24 de diciembre                                      |
| `christmas`                | Navidad                             | 25 de diciembre                                      |

El conjunto de datos solo contiene referencias, no el texto de los versículos, por lo que funciona con cualquier traducción. Los números de los versículos utilizan la numeración estándar en inglés (la misma que la del BSB). Los datos se pueden leer de tres maneras:

-   El archivo [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) enumera todos los versículos del conjunto de datos con sus categorías y las festividades con sus fechas, en un solo archivo.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) Muestra todos los versículos de una categoría. Esta es la forma más sencilla de elegir un versículo del día de una categoría.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) Muestra los candidatos de un capítulo, con sus categorías. Solo están disponibles los capítulos que contienen un candidato; para encontrarlos, utilice los enlaces de los capítulos del libro o `/api/d/verse-of-the-day/books.json` .

Los conjuntos de datos que contienen categorías de versos incluyen `listOfVersesApiLink` , `listOfCategoriesApiLink` y `totalNumberOfCategories` en su entrada en `/api/available_datasets.json` .

### Elegir un versículo del día

La API se compone de archivos estáticos, por lo que no selecciona un versículo automáticamente. En cambio, existe una convención para elegirlo, de modo que todas las aplicaciones que la siguen muestren el mismo versículo el mismo día. Las aplicaciones pueden elegir versículos diferentes; la convención simplemente les proporciona un valor predeterminado común.

La convención elige de los versículos y días festivos en `/api/d/verse-of-the-day/verses.json` En un día festivo, elige uno de los versículos del día festivo, recorriéndolos año por año, por lo que un día festivo tiene un versículo diferente cada año hasta que se hayan usado todos sus versículos. En otros días, cada año tiene su propia mezcla de los versículos que están en uso ese año (ordenados por un hash de la referencia de cada versículo, el año y una semilla opcional), y el versículo del día es el que está en el día del año de la fecha en esa mezcla. El conjunto de datos tiene más de 366 versículos para cada día en uso cada año, por lo que un versículo nunca se repite dentro de un año calendario, el orden cambia cada año y la misma fecha siempre da el mismo versículo. Se agregan nuevos versículos (con `addedIn` ) y se eliminan los antiguos (con `removedIn` ) solo de un año que aún no ha comenzado, por lo que el versículo del día para una fecha pasada nunca cambia.

La página [de la Convención del Versículo del Día](./verse-of-the-day-convention.md) especifica el algoritmo paso a paso, con pseudocódigo y valores de prueba, para que puedas implementarlo en cualquier idioma.

Para usar tu propio orden, elige una semilla (por ejemplo, el nombre de tu aplicación): esto genera una mezcla diferente con las mismas garantías. También puedes elegir versículos de una sola categoría, pero cada categoría tiene menos versículos que días tiene un año, por lo que sus versículos se repiten antes.

Los SDK siguen la convención:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Una fecha en formato AAAA-MM-DD o una fecha (se utiliza la fecha del calendario local). Por defecto, se utiliza la fecha de hoy.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Obtén el texto del versículo de una traducción.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` descarga la lista de versículos y elige de ella. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` elige de una lista que ya tienes.
-   El SDK de Kotlin tiene `getVerseOfTheDay(date?, seed?, category?)` y `pickVerseOfTheDay(verses, date?, seed?, category?)` , que toman la fecha como una cadena `YYYY-MM-DD` caracteres.
-   El SDK de Swift tiene `getVerseOfTheDay(date:seed:category:)` y `pickVerseOfTheDay(_:date:seed:category:holidays:)` , que toman la fecha como una cadena `YYYY-MM-DD` o `Date` (se utiliza la fecha del calendario en la zona horaria actual).
-   El [servidor MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) tiene `getVerseOfTheDay` herramienta que devuelve el versículo del día con su texto.
-   El paquete `@helloao/tools` tiene la misma lista y una función `getVerseOfTheDay(date?, { seed?, category? }?)` en `@helloao/tools/generation/verse-of-the-day.js` .

### Licencia

La lista fue elaborada por AO Lab y se publica bajo la [licencia MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . El texto del versículo proviene de la traducción que se haya obtenido.

## Enumerar versículos en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Obtiene cada versículo (o pasaje corto) en un conjunto de datos, con las categorías a las que pertenece cada uno, en orden canónico. Solo disponible para conjuntos de datos cuyos versículos tienen categorías, como `verse-of-the-day` .

-   `dataset` el ID del conjunto de datos (por ejemplo `verse-of-the-day` ).

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * La información del conjunto de datos para los versículos.
     */
    dataset: Dataset;

    /**
     * Cada versículo (o pasaje corto) del conjunto de datos, con sus categorías, en orden canónico.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Las festividades que tienen sus propios versos, con sus fechas.
     * Se omite si el conjunto de datos no tiene días festivos.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * El identificador de la categoría de la festividad. Por ejemplo, "Navidad".
     */
    id: string;

    /**
     * El nombre en inglés de la festividad. Por ejemplo, "Navidad".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * El mes (1 para enero) y el día de una festividad que cae en la misma fecha todos los años.
     * Se omiten los días festivos cuya fecha cambia cada año.
     */
    month?: number;
    day?: number;

    /**
     * Las fechas (AAAA-MM-DD, calendario gregoriano) de un día festivo cuya fecha cambia cada año, en orden.
     * Se calculan previamente para un rango de años (actualmente de 2026 a 2125), y el día festivo solo se observa en las fechas que figuran en la lista.
     * Se omiten los días festivos que caen en la misma fecha todos los años.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * El ID del libro. Por ejemplo, "PRO".
     */
    book: string;

    /**
     * El número del capítulo.
     */
    chapter: number;

    /**
     * El número del versículo.
     * Si aparece `endVerse` , entonces este es el versículo donde comienza el pasaje.
     */
    verse: number;

    /**
     * El versículo en el que termina el pasaje.
     * Se omite si la entrada es un solo verso.
     */
    endVerse?: number;

    /**
     * Los identificadores de las categorías a las que pertenece el verso, de la más relevante a la más antigua.
     */
    categories: string[];

    /**
     * El primer año en que el versículo puede ser el versículo del día.
     * Se omite si el versículo siempre ha estado en la lista.
     */
    addedIn?: number;

    /**
     * El primer año en que el versículo ya no puede ser el versículo del día.
     * Los versículos eliminados permanecen en el conjunto de datos para que aún se puedan seleccionar los versículos de años anteriores.
     * Se omite si el versículo no ha sido eliminado de la lista.
     */
    removedIn?: number;
}
```

### Ejemplo

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

## Enumerar categorías en un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Obtiene la lista de categorías de versículos disponibles para un conjunto de datos.

-   `dataset` el ID del conjunto de datos (por ejemplo `verse-of-the-day` ).

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * La información del conjunto de datos para las categorías.
     */
    dataset: Dataset;

    /**
     * La lista de categorías de versículos disponibles para el conjunto de datos.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * El ID de la categoría. Por ejemplo, "esperanza".
     */
    id: string;

    /**
     * El nombre en inglés de la categoría. Por ejemplo: "Hope".
     */
    name: string;

    /**
     * La descripción del contenido de los versículos de esta categoría.
     */
    description: string;

    /**
     * El número de versículos (o pasajes cortos) que pertenecen a la categoría.
     */
    numberOfVerses: number;

    /**
     * Las fechas del día festivo al que se refiere la categoría (ver DatasetCategoryHoliday más arriba).
     * Se omiten las categorías que no corresponden a un día festivo.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * El enlace API para la categoría.
     */
    apiLink: string;
}
```

### Ejemplo

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

## Obtener una categoría de un conjunto de datos

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Obtiene una única categoría de versículo, con cada versículo que pertenece a ella.

-   `dataset` el ID del conjunto de datos (por ejemplo `verse-of-the-day` ).
-   `category` es el ID de la categoría (por ejemplo `hope` ).

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Información del conjunto de datos para la categoría.
     */
    dataset: Dataset;

    /**
     * La categoría, con los versículos que le pertenecen.
     */
    category: DatasetCategory;

    /**
     * El enlace de la API para esta categoría.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * El ID de la categoría. Por ejemplo, "esperanza".
     */
    id: string;

    /**
     * El nombre en inglés de la categoría. Por ejemplo: "Hope".
     */
    name: string;

    /**
     * La descripción del contenido de los versículos de esta categoría.
     */
    description: string;

    /**
     * Las fechas de la festividad a la que se refiere la categoría (véase DatasetCategoryHoliday en "Listar versos en un conjunto de datos").
     * En esas fechas, el versículo del día es uno de los versículos de la categoría, y no se utilizan en otros días.
     * Se omiten las categorías que no corresponden a un día festivo.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Los versículos (o pasajes cortos) que pertenecen a la categoría, en orden canónico.
     * Incluye versículos que han sido eliminados de la lista (ver `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * El identificador del libro. Por ejemplo, "JER".
     */
    book: string;

    /**
     * El número del capítulo.
     */
    chapter: number;

    /**
     * El número del versículo.
     * Si aparece `endVerse` , entonces este es el versículo donde comienza el pasaje.
     */
    verse: number;

    /**
     * El versículo en el que termina el pasaje.
     * Se omite si la referencia es un solo versículo.
     */
    endVerse?: number;

    /**
     * El primer año en que el versículo puede ser el versículo del día.
     * Se omite si el versículo siempre ha estado en la lista.
     */
    addedIn?: number;

    /**
     * El primer año en que el versículo ya no puede ser el versículo del día.
     * Los versículos eliminados permanecen en el conjunto de datos para que aún se puedan seleccionar los versículos de años anteriores.
     * Se omite si el versículo no ha sido eliminado de la lista.
     */
    removedIn?: number;
}
```

### Ejemplo

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
