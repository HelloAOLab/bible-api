# Formato simplificado

Formato simplificado para capítulos, descargas de traducciones completas y anotaciones a nivel de palabra. Consulte [Traducciones, Libros y Capítulos](./README.md) para acceder a los enlaces de traducción y listado de libros, o [el formato estándar](./standard.md) para la representación estructurada original de este mismo contenido.

## Obtén un capítulo simplificado de una traducción.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Obtiene el contenido de un solo capítulo de un libro y traducción determinados, utilizando el formato simplificado.

En el formato simplificado, el contenido de cada versículo es una sola cadena de texto en lugar de una lista de texto formateado. Esto significa que no es necesario construir el texto de un versículo manualmente, lo cual puede ser complicado, especialmente en lo que respecta al espaciado. Todo aquello que no se puede representar con una cadena de texto simple (notas al pie, las Palabras de Jesús, poemas y encabezados que aparecen en medio de un versículo) se mantiene como un desplazamiento dentro de esa cadena, por lo que no se pierde nada.

Utilice este punto final cuando desee el texto de un capítulo. Utilice [el punto final de capítulo habitual](./standard.md#get-a-chapter-from-a-translation) cuando desee visualizar el capítulo con su formato original.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis; puede encontrar una lista de ID de libros [aquí](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).

Los capítulos que tienen anotaciones a nivel de palabra se enlazan con ellas mediante `thisChapterWordsLink` , que apunta a [las anotaciones simplificadas](#get-the-words-of-a-chapter-in-the-simplified-format) , aquellas cuyos desplazamientos coinciden con el texto de este archivo.

Los capítulos que tienen tiempos de audio por lector se enlazan con `thisChapterAudioTimings` , que apunta al [punto final de tiempos de audio](./standard.md#get-the-audio-timings-for-a-chapter) , el mismo archivo al que enlaza el punto final del capítulo normal, ya que los tiempos no dependen del formato del capítulo.

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtén el texto de Génesis 1 de la traducción BSB.
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### Desfases

Todos los desplazamientos en el formato simplificado ( `offset` , `start` y `end` ) son índices del `text` que los contiene. Se miden en unidades de código UTF-16, que es el `String.prototype.length` que utilizan `String.prototype.slice()` .

`start` es inclusivo y `end` es exclusivo, por lo que `text.slice(start, end)` devuelve exactamente el rango de texto marcado. Los desplazamientos de las notas al pie indican la posición del elemento que las llama, por lo que `text.slice(0, offset)` representa el texto que las precede.

### Estructura

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * Información sobre la traducción del capítulo del libro.
     */
    translation: Translation;

    /**
     * La información del libro correspondiente al capítulo del libro.
     */
    book: TranslationBook;

    /**
     * El enlace al capítulo actual.
     */
    thisChapterLink: string;

    /**
     * Enlace a la versión normal (no simplificada) de este capítulo.
     */
    fullChapterApiLink: string;

    /**
     * Los enlaces a las diferentes versiones de audio del capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Enlaces a los tiempos de audio para las diferentes versiones de audio del capítulo.
     * Consulte la sección "Obtener la sincronización de audio para un capítulo" en la documentación del formato estándar; el archivo de sincronización es el mismo independientemente del formato de capítulo al que esté vinculado.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * El enlace al siguiente capítulo, en formato simplificado.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterApiLink: string | null;

    /**
     * Enlaces a las diferentes versiones de audio del próximo capítulo.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Enlaces a la sincronización del audio para las diferentes versiones de audio del próximo capítulo.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * El enlace al capítulo anterior, en formato simplificado.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterApiLink: string | null;

    /**
     * Enlaces a diferentes versiones de audio del capítulo anterior.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Enlaces a la sincronización del audio para las diferentes versiones de audio del capítulo anterior.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * El número de versículos que contiene el capítulo.
     */
    numberOfVerses: number;

    /**
     * La información del capítulo.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * El número del capítulo.
     */
    number: number;

    /**
     * El contenido del capítulo.
     */
    content: SimpleChapterContent[];

    /**
     * La lista de notas a pie de página que no pudieron asociarse con ningún versículo.
     * Las notas a pie de página que corresponden a un versículo se incluyen en el propio versículo, por lo que esta lista suele estar vacía.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Un tipo de unión que representa una sola pieza de contenido en un capítulo simplificado.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Un encabezado en un capítulo.
 */
interface SimpleChapterHeading {
    /**
     * Indica que el contenido representa un encabezado.
     */
    type: 'heading';

    /**
     * El texto del encabezado.
     */
    text: string;
}

/**
 * Un salto de línea en un capítulo.
 */
interface ChapterLineBreak {
    /**
     * Indica que el contenido representa un salto de línea.
     */
    type: 'line_break';
}

/**
 * Un versículo en un capítulo.
 */
interface SimpleChapterVerse {
    /**
     * Indica que el contenido es un versículo.
     */
    type: 'verse';

    /**
     * El número del versículo.
     */
    number: number;

    /**
     * El texto del versículo.
     * Los versos y los saltos de línea están separados por caracteres de nueva línea (\n).
     */
    text: string;

    /**
     * Las notas a pie de página que aparecen en el versículo.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Los encabezados que aparecen en medio del versículo.
     * Se omite si el versículo no contiene encabezados en línea.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Los rangos del texto del versículo que representan las Palabras de Jesús.
     * Se omite si el versículo no contiene ninguno.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Los rangos del texto en verso que representan versos de poesía.
     * Se omite si el versículo no contiene ninguno.
     */
    poem?: SimplePoemRange[];
}

/**
 * Un subtítulo en hebreo en un capítulo.
 * Estos elementos suelen incluirse como contenido informativo que aparecía en los manuscritos originales.
 * Por ejemplo, el Salmo 49 tiene el subtítulo en hebreo "Al director del coro. Salmo de los hijos de Coré".
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Indica que el contenido corresponde a un subtítulo en hebreo.
     */
    type: 'hebrew_subtitle';
}

/**
 * Una nota a pie de página en un verso.
 */
interface SimpleVerseFootnote {
    /**
     * El ID de la nota.
     */
    noteId: number;

    /**
     * El índice en el texto del versículo donde debe insertarse la nota al pie.
     */
    offset: number;

    /**
     * El texto de la nota al pie.
     */
    text: string;

    /**
     * La persona que realizó la llamada que debe utilizarse para la nota al pie.
     * Si es "+", entonces la persona que realiza la llamada debería generarse automáticamente.
     * Si es nulo, entonces el llamador debe estar vacío.
     * Si es una cadena, entonces quien realiza la llamada debe ser esa cadena.
     */
    caller: '+' | string | null;
}

/**
 * Un encabezado que está insertado en un verso.
 */
interface SimpleInlineHeading {
    /**
     * El índice en el texto del versículo donde aparece el encabezado.
     */
    offset: number;

    /**
     * El texto del encabezado.
     */
    text: string;
}

/**
 * Un fragmento de texto dentro de un verso.
 */
interface SimpleTextRange {
    /**
     * El índice del primer carácter del rango.
     */
    start: number;

    /**
     * El índice que sigue al último carácter del rango.
     */
    end: number;
}

/**
 * Un fragmento de texto dentro de un verso que representa una línea de poesía.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * El grado de sangría con el que debe mostrarse el verso.
     */
    level: number;
}
```

### Ejemplo

```json:no-line-numbers title="/api/BSB/GEN/1.simple.json"
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
    "book": {
        "id": "GEN",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.simple.json",
    "fullChapterApiLink": "/api/BSB/GEN/1.json",
    "thisChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 1
    },
    "thisChapterAudioLinks": {
        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
    },
    "thisChapterAudioTimings": {
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json",
        "david": "/api/BSB/GEN/1.david.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.simple.json",
    "nextChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 2
    },
    "nextChapterAudioTimings": {
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json",
        "david": "/api/BSB/GEN/2.david.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterReference": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "text": "The Creation"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "text": "In the beginning God created the heavens and the earth.",
                "footnotes": []
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "text": "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "footnotes": []
            },
            {
                "type": "heading",
                "text": "The First Day"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "text": "And God said, “Let there be light,” and there was light.",
                "footnotes": [
                    {
                        "noteId": 0,
                        "offset": 35,
                        "text": "Cited in 2 Corinthians 4:6",
                        "caller": "+"
                    }
                ]
            }
        ],
        "footnotes": []
    }
}
```

La poesía y las palabras de Jesús se conservan como rangos sobre el texto del versículo. Por ejemplo, `Matthew 5:3` en la traducción `engwebp` se ve así:

```json:no-line-numbers title="/api/engwebp/MAT/5.simple.json"
{
    "type": "verse",
    "number": 3,
    "text": "“Blessed are the poor in spirit,\nfor theirs is the Kingdom of Heaven.",
    "footnotes": [],
    "wordsOfJesus": [
        {
            "start": 0,
            "end": 69
        }
    ],
    "poem": [
        {
            "start": 0,
            "end": 32,
            "level": 1
        },
        {
            "start": 33,
            "end": 69,
            "level": 2
        }
    ]
}
```

## Obtén el texto de un capítulo en formato simplificado.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Obtiene las anotaciones a nivel de palabra para un solo capítulo, con sus desplazamientos reasignados al texto de cada [versículo simplificado](#get-a-simplified-chapter-from-a-translation) .

Las marcas de desplazamiento en [las anotaciones regulares](./standard.md#get-the-words-of-a-chapter) están vinculadas a elementos de la matriz `content` de cada versículo, que el formato simplificado reemplaza con una sola cadena; por lo tanto, no se pueden usar con él. Utilice este archivo cuando trabaje con los capítulos simplificados.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis; puede encontrar una lista de ID de libros [aquí](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).

Estas entradas no tienen `contentIndex` `start` y `end` son desplazamientos dentro del `text` del versículo, exactamente como los desplazamientos de la nota al pie, el poema y las Palabras de Jesús en los capítulos simplificados, por lo que `text.slice(start, end)` es la palabra anotada.

Al igual que con las anotaciones regulares, solo algunas traducciones las incluyen. Un capítulo simplificado que las contiene enlaza con este archivo con `thisChapterWordsLink` ; cuando falta esta propiedad, este archivo no existe para ese capítulo.

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtén el texto de Génesis 1 y las palabras que están anotadas en él.
Promise.all([
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`).then(r => r.json()),
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.simple.json`).then(r => r.json()),
]).then(([chapter, words]) => {
    for (let content of chapter.chapter.content) {
        if (content.type !== 'verse') {
            continue;
        }
        for (let word of words.verses[content.number] ?? []) {
            console.log(content.text.slice(word.start, word.end), word.strongs);
        }
    }
});
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
curl https://bible.helloao.org/api/BSB/GEN/1.words.simple.json
```

:::

### Estructura

La estructura coincide con [las anotaciones regulares](./standard.md#get-the-words-of-a-chapter) , excepto que los enlaces apuntan a los archivos simplificados y las entradas no tienen `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * El ID de la traducción.
     */
    translationId: string;

    /**
     * La identificación del libro.
     */
    bookId: string;

    /**
     * El número del capítulo.
     */
    chapterNumber: number;

    /**
     * Enlace al capítulo simplificado al que corresponden estas anotaciones.
     */
    thisChapterLink: string;

    /**
     * Enlace al siguiente capítulo simplificado.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterLink: string | null;

    /**
     * Enlace al capítulo simplificado anterior.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterLink: string | null;

    /**
     * El enlace a estas anotaciones.
     */
    thisChapterWordsLink: string;

    /**
     * Enlace a las anotaciones del próximo capítulo.
     * Nulo si este es el último capítulo de la traducción, o si el siguiente capítulo no tiene anotaciones a nivel de palabra.
     */
    nextChapterWordsLink: string | null;

    /**
     * Enlace a las anotaciones del capítulo anterior.
     * Nulo si este es el primer capítulo de la traducción, o si el capítulo anterior no tiene anotaciones a nivel de palabra.
     */
    previousChapterWordsLink: string | null;

    /**
     * Las palabras anotadas para cada versículo del capítulo, indicadas por el número del versículo.
     * Cada lista está en el orden en que aparecen las palabras en el versículo.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Una anotación a nivel de palabra en un capítulo simplificado.
 */
export interface SimpleChapterWord {
    /**
     * El índice del primer carácter de la palabra anotada en el texto del verso.
     */
    start: number;

    /**
     * El índice que aparece después del último carácter de la palabra anotada en el texto del verso.
     */
    end: number;

    /**
     * Los números de Strong para la palabra.
     */
    strongs?: string[];

    /**
     * El lema (forma diccionaria) de la palabra en el idioma de origen.
     */
    lemma?: string;

    /**
     * La morfología de la palabra en el idioma de origen.
     */
    morph?: string;

    /**
     * La ubicación de la palabra en el texto original.
     */
    srcloc?: string;

    /**
     * ¿Cuál es la aparición de esta palabra en el versículo?
     */
    occurrence?: number;

    /**
     * El número de veces que aparece la palabra en el versículo.
     */
    occurrences?: number;
}
```

### Ejemplo

```json:no-line-numbers title="/api/engwebp/JHN/1.words.simple.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.simple.json",
    "nextChapterLink": "/api/engwebp/JHN/2.simple.json",
    "previousChapterLink": "/api/engwebp/MAT/28.simple.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.simple.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.simple.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.simple.json",
    "verses": {
        "1": [
            {
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

El versículo 1 de ese capítulo tiene el texto `"In the beginning was the Word, and the Word was with God, and the Word was God."` , por lo tanto `text.slice(7, 16)` es `"beginning"` .

## Obtenga una traducción completa en formato simplificado.

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Obtiene el contenido de una traducción completa, utilizando el formato simplificado. Este es el [formato de capítulo simplificado](#get-a-simplified-chapter-from-a-translation) aplicado a [la descarga de la traducción completa](./standard.md#get-an-entire-translation) : un archivo que contiene la traducción completa, donde el contenido de cada versículo es una sola cadena de texto.

Utilice esta opción cuando desee el texto de una traducción completa sin tener que solicitarlo capítulo por capítulo y sin tener que crear el texto usted mismo.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).

Este archivo se genera junto con `complete.json` , por lo que una traducción contiene ambos o ninguno. El objeto `translation` en ambos archivos contiene un `completeTranslationApiLink` y un `simpleCompleteTranslationApiLink` , por lo que puede alternar entre los dos formatos.

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Obtén el texto de la traducción completa del BSB.
fetch(`https://bible.helloao.org/api/${translation}/complete.simple.json`)
    .then(request => request.json())
    .then(complete => {
        for (let book of complete.books) {
            for (let { chapter } of book.chapters) {
                for (let content of chapter.content) {
                    if (content.type === 'verse') {
                        console.log(`${book.commonName} ${chapter.number}:${content.number} ${content.text}`);
                    }
                }
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.simple.json
```

:::

### Estructura

La estructura coincide con [la descarga de la traducción completa habitual](./standard.md#get-an-entire-translation) , salvo que cada capítulo utiliza el formato simplificado.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Define los datos completos de descarga de la traducción, utilizando el formato de capítulo simplificado.
 * Se corresponde con el punto final /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Los metadatos de la traducción.
     */
    translation: Translation;

    /**
     * La lista completa de libros con todos sus capítulos.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Descarga del libro en su traducción completa, utilizando el formato de capítulos simplificado.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * La lista completa de capítulos con todo su contenido.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Un capítulo de la descarga de la traducción completa, utilizando el formato de capítulo simplificado.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * El número de versículos que contiene el capítulo.
     */
    numberOfVerses: number;

    /**
     * Los enlaces a las diferentes versiones de audio del capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Los tiempos de audio (tiempos de inicio por verso, en segundos) para el capítulo.
     *
     * Tenga en cuenta que los archivos de traducción completos contienen las indicaciones de tiempo (consulte TranslationBookChapterAudioTimingsMap en la documentación del formato estándar), a diferencia de los puntos finales de los capítulos individuales, que contienen enlaces a ellos.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Enlace a las anotaciones a nivel de palabra del capítulo, en formato simplificado. Se omite si el capítulo no contiene anotaciones a nivel de palabra.
     */
    thisChapterWordsLink?: string;

    /**
     * Información simplificada para el capítulo.
     */
    chapter: SimpleChapterData;
}
```

### Ejemplo

```json:no-line-numbers title="/api/BSB/complete.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "website": "https://berean.bible/",
        "textDirection": "ltr",
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
                        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
                        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
                        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
                    },
                    "thisChapterAudioTimings": {
                        "hays": [0, 4.32, 10.28],
                        "souer": [0, 4.28, 10.19],
                        "david": [0, 4.51, 10.62]
                    },
                    "chapter": {
                        "number": 1,
                        "content": [
                            {
                                "type": "heading",
                                "text": "The Creation"
                            },
                            {
                                "type": "line_break"
                            },
                            {
                                "type": "verse",
                                "number": 1,
                                "text": "In the beginning God created the heavens and the earth.",
                                "footnotes": []
                            }
                        ],
                        "footnotes": []
                    }
                }
            ]
        }
    ]
}
```
