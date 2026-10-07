# conjuntos de datos

Puntos de acceso para explorar conjuntos de datos bíblicos complementarios, como referencias cruzadas y entidades bíblicas (personas, lugares, eventos y grupos de personas), y para obtener sus libros, el contenido de sus capítulos y sus entidades.

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
     */
    totalNumberOfReferences: number;

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

Para conjuntos de datos de referencias cruzadas (como `open-cross-ref` ), el capítulo contiene la lista de referencias cruzadas para cada versículo. Para conjuntos de datos de entidades (como `theographic` ), el capítulo contiene las personas, lugares y eventos que aparecen en el capítulo; consulte [Obtener las entidades en un capítulo](#get-the-entities-in-a-chapter) .

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

interface DatasetVerse {
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
     * Las personas que han estado en el lugar, que nacieron en él o que murieron allí.
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
     * Los números negativos representan los años antes de Cristo. Los números positivos representan los años después de Cristo.
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

Obtiene información sobre un grupo de personas en particular, incluyendo a sus miembros y los eventos en los que participó el grupo.

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
