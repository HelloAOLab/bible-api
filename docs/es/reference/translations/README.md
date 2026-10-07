# Traducciones, libros y capítulos

Puntos de acceso para explorar traducciones, listar sus libros y obtener el contenido de los capítulos.

El contenido de los capítulos, las descargas de traducciones completas y las anotaciones a nivel de palabra están disponibles en dos formatos:

-   [**Formato estándar**](./standard.md) : el formato original y estructurado. El contenido del verso es una lista de fragmentos (texto sin formato, texto con formato, referencias a notas al pie, etc.) que usted mismo ensambla.
-   [**Formato simplificado**](./simplified.md) : un formato plano donde el contenido de cada verso es una sola cadena de texto, con notas al pie, poesía y otras marcas expresadas como desplazamientos dentro de esa cadena.

Utilice el formato que mejor se adapte a la forma en que planea representar o procesar el texto.

## Traducciones disponibles

`GET https://bible.helloao.org/api/available_translations.json`

Obtiene la lista de traducciones disponibles en la API.

### Ejemplo de código

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

### Estructura

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * La lista de traducciones.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * El ID de la traducción.
     */
    id: string;

    /**
     * El nombre de la traducción.
     * Normalmente, este es el nombre de la traducción en el idioma de la traducción.
     */
    name: string;

    /**
     * El nombre en inglés de la traducción.
     */
    englishName: string;

    /**
     * El sitio web para la traducción.
     */
    website: string;

    /**
     * La URL donde se puede encontrar la licencia de la traducción.
     */
    licenseUrl: string;

    /**
     * El nombre abreviado de la traducción.
     */
    shortName: string;

    /**
     * La etiqueta de idioma de 3 letras ISO 639 en la que se encuentra principalmente la traducción.
     */
    language: string;

    /**
     * Obtiene el nombre del idioma en el que está la traducción.
     * Nulo o indefinido si se desconoce el nombre del idioma.
     */
    languageName?: string;

    /**
     * Obtiene el nombre del idioma en inglés.
     * Nulo o indefinido si el idioma no tiene un nombre en inglés.
     */
    languageEnglishName?: string;

    /**
     * La dirección en la que está escrito el idioma.
     * "ltr" indica que el texto se escribe desde el lado izquierdo de la página hacia la derecha.
     * "rtl" indica que el texto se escribe desde el lado derecho de la página hacia la izquierda.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * La lista de formatos disponibles.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Enlace API para la lista de libros disponibles para esta traducción.
     */
    listOfBooksApiLink: string;

    /**
     * El número de libros que contiene esta traducción.
     *
     * Las traducciones completas deberían tener el mismo número de libros que la Biblia (66).
     */
    numberOfBooks: number;

    /**
     * El número total de capítulos que contiene esta traducción.
     *
     * Las traducciones completas deberían tener el mismo número de capítulos que la Biblia (1.189).
     */
    totalNumberOfChapters: number;

    /**
     * El número total de versículos que contiene esta traducción.
     *
     * Las traducciones completas deberían tener el mismo número de versículos que la Biblia (alrededor de 31.102; algunas traducciones excluyen versículos basándose en la aparente probabilidad de que existan en los textos originales).
     */
    totalNumberOfVerses: number;

    /**
     * El número total de libros apócrifos que contiene esta traducción.
     * Se omite si la traducción no incluye los apócrifos.
     */
    numberOfApocryphalBooks?: number;

    /**
     * El número total de capítulos apócrifos que contiene esta traducción.
     * Se omite si la traducción no incluye los apócrifos.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * el número total de versículos apócrifos que contiene esta traducción.
     * Se omite si la traducción no incluye los apócrifos.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Ejemplo

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

## Lista de libros traducidos

`GET https://bible.helloao.org/api/{translation}/books.json`

Obtiene la lista de libros disponibles para la traducción especificada.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Obtén la lista de libros para la traducción de BSB
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

### Estructura

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * La información de traducción de los libros.
     */
    translation: Translation;

    /**
     * Lista de libros disponibles para su traducción.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * La identificación del libro.
     */
    id: string;

    /**
     * El nombre que la traducción proporcionó para el libro.
     */
    name: string;

    /**
     * El nombre común del libro.
     */
    commonName: string;

    /**
     * El título del libro.
     * Normalmente, esta es una versión más descriptiva del título del libro.
     * Si no está disponible, entonces no fue proporcionada por la traducción.
     */
    title: string | null;

    /**
     * El orden numérico del libro en la traducción.
     */
    order: number;

    /**
     * El número de capítulos que contiene el libro.
     */
    numberOfChapters: number;

    /**
     * El número del primer capítulo del libro.
     */
    firstChapterNumber: number;

    /**
     * Enlace al primer capítulo del libro.
     */
    firstChapterApiLink: string;

    /**
     * El número del último capítulo del libro.
     */
    lastChapterNumber: number;

    /**
     * El enlace al último capítulo del libro.
     */
    lastChapterApiLink: string;

    /**
     * El número de versículos que contiene el libro.
     */
    totalNumberOfVerses: number;

    /**
     * Si el libro es apócrifo o no.
     * Se omite si la traducción es canónica.
     */
    isApocryphal?: boolean;
}
```

### Ejemplo

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
