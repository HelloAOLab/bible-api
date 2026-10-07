# Formato estándar

Formato estándar para capítulos, descargas de traducciones completas y anotaciones a nivel de palabra. Consulte [Traducciones, Libros y Capítulos](./README.md) para acceder a los enlaces de traducción y listado de libros, o [el formato simplificado](./simplified.md) para una representación alternativa de este mismo contenido.

## Obtén un capítulo de una traducción

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Obtiene el contenido de un solo capítulo de un libro y traducción determinados.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis; puede encontrar una lista de ID de libros [aquí](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtén Génesis 1 de la traducción BSB
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### Estructura

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * Enlaces a diferentes versiones de audio para el capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Enlaces a los tiempos de audio para las diferentes versiones de audio del capítulo.
     * Cada enlace apunta al archivo de sincronización de audio para ese lector; consulte "Obtener la sincronización de audio para un capítulo" a continuación.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * El enlace al siguiente capítulo.
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
     * El enlace al capítulo anterior.
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
     * Enlace a las anotaciones a nivel de palabra del capítulo.
     * Se omite si el capítulo no tiene anotaciones a nivel de palabra.
     */
    thisChapterWordsLink?: string;

    /**
     * Enlace a las anotaciones a nivel de palabra del próximo capítulo.
     * Se omite si este es el último capítulo de la traducción o si el siguiente capítulo no tiene anotaciones a nivel de palabra.
     */
    nextChapterWordsLink?: string;

    /**
     * Enlace a las anotaciones a nivel de palabra del capítulo anterior.
     * Se omite si este es el primer capítulo de la traducción o si el capítulo anterior no tiene anotaciones a nivel de palabra.
     */
    previousChapterWordsLink?: string;

    /**
     * El número de versículos que contiene el capítulo.
     */
    numberOfVerses: number;

    /**
     * Enlace a la versión simplificada de este capítulo.
     * Se omite si no hay capítulos simplificados disponibles.
     */
    simpleChapterApiLink?: string;

    /**
     * La información del capítulo.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * El número del capítulo.
     */
    number: number;

    /**
     * El contenido del capítulo.
     */
    content: ChapterContent[];

    /**
     * Lista de notas a pie de página del capítulo.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Un tipo de unión que representa una sola pieza de contenido de un capítulo.
 * Un fragmento del contenido de un capítulo puede ser una de las siguientes cosas:
 * - Un encabezado.
 * - Un salto de línea.
 * - Un verso.
 * - Un subtítulo en hebreo.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Un encabezado en un capítulo.
 */
interface ChapterHeading {
    /**
     * Indica que el contenido representa un encabezado.
     */
    type: 'heading';

    /**
     * El contenido del encabezado.
     * Si el array incluye varias cadenas, deben concatenarse con un espacio.
     */
    content: string[];
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
 * Un subtítulo en hebreo en un capítulo.
 * Estos elementos se utilizan a menudo como contenido informativo que aparecía en los manuscritos originales.
 * Por ejemplo, el Salmo 49 tiene el subtítulo en hebreo "Al director del coro. Salmo de los hijos de Coré".
 */
interface ChapterHebrewSubtitle {
    /**
     * Indica que el contenido corresponde a un subtítulo en hebreo.
     */
    type: 'hebrew_subtitle';

    /**
     * La lista de contenido que aparece en el subtítulo.
     * Cada elemento de la lista podría ser una cadena de texto, un texto con formato o una referencia a una nota al pie.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Un versículo en un capítulo.
 */
interface ChapterVerse {
    /**
     * Indica que el contenido es un versículo.
     */
    type: 'verse';

    /**
     * El número del versículo.
     */
    number: number;

    /**
     * La lista de contenido del versículo.
     * Cada elemento de la lista podría ser una cadena de texto, un texto con formato o una referencia a una nota al pie.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Texto formateado. Es decir, texto que está formateado de una manera particular.
 */
interface FormattedText {
    /**
     * El texto que está formateado.
     */
    text: string;

    /**
     * Si el texto representa un poema.
     * El número indica el nivel de sangría.
     *
     * Común en los Salmos.
     */
    poem?: number;

    /**
     * Si el texto representa las Palabras de Jesús.
     */
    wordsOfJesus?: boolean;
}

/**
 * Define una interfaz que representa un encabezado incrustado en un versículo.
 */
interface InlineHeading {
    /**
     * El texto del encabezado.
     */
    heading: string;
}

/**
 * Define una interfaz que representa un salto de línea insertado en un verso.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Una referencia a una nota al pie de página en un versículo o en un subtítulo hebreo.
 */
interface VerseFootnoteReference {
    /**
     * El ID de la nota.
     */
    noteId: number;
}

/**
 * Información sobre una nota al pie.
 */
interface ChapterFootnote {
    /**
     * El ID de la nota a la que se hace referencia.
     */
    noteId: number;

    /**
     * El texto de la nota al pie.
     */
    text: string;

    /**
     * La referencia del versículo para la nota al pie.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * La persona que realizó la llamada que debe utilizarse para la nota al pie.
     * En el caso de las notas al pie, un "indicador" es el carácter que se utiliza en el texto para hacer referencia a la nota al pie.
     *
     * Por ejemplo, en el texto:
     * Hola (a) Mundo
     *
     * ---- (a) Esta es una nota al pie.
     *
     * El "(a)" es quien llama.
     *
     * Si es "+", entonces la persona que realiza la llamada debería generarse automáticamente.
     * Si es nulo, entonces el llamador debe estar vacío.
     * Si es una cadena, entonces quien realiza la llamada debe ser esa cadena.
     */
    caller: '+' | string | null;
}

/**
 * Los enlaces de audio para un capítulo del libro.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * El texto del capítulo y el enlace URL al archivo de audio.
     */
    [reader: string]: string;
}

/**
 * Los enlaces con los tiempos de audio para un capítulo del libro.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * El lector del capítulo y el enlace API al archivo de sincronización de audio para dicho lector.
     */
    [reader: string]: string;
}
```

### Ejemplo

```json:no-line-numbers title="/api/BSB/GEN/1.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "licenseNotes": null,
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
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "thisChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
    },
    "thisChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/1.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "nextChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_002_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_002_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_002.mp3"
    },
    "nextChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/2.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterAudioLinks": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "content": [
                    "The Creation"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning God created the heavens and the earth."
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "content": [
                    "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
            },
            {
                "type": "heading",
                "content": [
                    "The First Day"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "content": [
                    "And God said, “Let there be light,”",
                    {
                        "noteId": 0
                    },
                    "and there was light."
                ]
            },
            {
                "type": "verse",
                "number": 4,
                "content": [
                    "And God saw that the light was good, and He separated the light from the darkness."
                ]
            },
            {
                "type": "verse",
                "number": 5,
                "content": [
                    "God called the light “day,” and the darkness He called “night.”",
                    {
                        "lineBreak": true
                    },
                    "And there was evening, and there was morning—the first day.",
                    {
                        "noteId": 1
                    }
                ]
            }
        ],
        "footnotes": [
            {
                "noteId": 0,
                "text": "Cited in 2 Corinthians 4:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 3
                }
            },
            {
                "noteId": 1,
                "text": "Literally day one",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 5
                }
            },
            {
                "noteId": 2,
                "text": "Or a canopy or a firmament or a vault; also in verses 7, 8, 14, 15, 17, and 20",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 6
                }
            },
            {
                "noteId": 3,
                "text": "MT; Syriac and over all the beasts of the earth",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 26
                }
            },
            {
                "noteId": 4,
                "text": "Cited in Matthew 19:4 and Mark 10:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 27
                }
            }
        ]
    }
}
```

## Obtén los tiempos de audio para un capítulo.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Obtiene la información de tiempo de audio por verso para un capítulo, para la narración de un solo lector; es decir, el tiempo (en segundos, con respecto al inicio del archivo de audio de ese lector) en el que comienza cada verso. Los clientes pueden usar esta información para resaltar el verso que se está leyendo mientras se reproduce el audio.

Solo algunas traducciones y lectores tienen sincronización de audio. Un capítulo que la tiene para un lector se vincula a este archivo con una entrada en `thisChapterAudioTimings` , identificada por la ID de ese lector; cuando un lector no es una clave en ese mapa, este archivo no existe para ese lector y capítulo.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis; puede encontrar una lista de ID de libros [aquí](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).
-   `reader` es la ID del lector cuya narración son los tiempos (por ejemplo, `hays` ) - los lectores disponibles para un capítulo son las claves de su `thisChapterAudioLinks` .

El final de un verso es el comienzo del siguiente (o, en el caso del último verso, el final del archivo de audio), por lo que un cliente no necesita nada más allá de la lista ordenada de tiempos de inicio para crear rangos de resaltado para todo el capítulo.

Este archivo es el mismo independientemente de si se accede a él desde el punto final del capítulo habitual o [desde el simplificado](./simplified.md#get-a-simplified-chapter-from-a-translation) ; solo hay un conjunto de tiempos por traducción, libro, capítulo y lector.

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Obtén los tiempos de audio para Genesis 1 (BSB), leídos por "hays".
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.${reader}.audioTimings.json`)
    .then(request => request.json())
    .then(timings => {
        console.log('Genesis 1 (BSB, hays) verse start times:', timings.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.hays.audioTimings.json
```

:::

### Estructura

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Define la duración del audio para un capítulo de un libro, para un solo lector.
 * Se asigna al punto final /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
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
     * La identificación del lector al que se refieren estos tiempos.
     */
    reader: string;

    /**
     * El enlace al archivo de audio al que corresponden estas indicaciones de tiempo.
     */
    audioLink: string;

    /**
     * Enlace a la información de este capítulo.
     */
    thisChapterLink: string;

    /**
     * Enlace a la información del próximo capítulo.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterLink: string | null;

    /**
     * Enlace a la información del capítulo anterior.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterLink: string | null;

    /**
     * El enlace a este archivo de tiempos de audio.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * El enlace a los horarios del próximo capítulo, para el mismo lector.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Enlace a los horarios del capítulo anterior, para el mismo lector.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Los tiempos en segundos en los que comienza cada verso, en orden.
     * El primer número (índice 0) indica el momento de la grabación en el que comienza la primera estrofa.
     */
    verses: number[];
}
```

### Ejemplo

```json:no-line-numbers title="/api/BSB/GEN/1.hays.audioTimings.json"
{
    "translationId": "BSB",
    "bookId": "GEN",
    "chapterNumber": 1,
    "reader": "hays",
    "audioLink": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "nextChapterLink": "/api/BSB/GEN/2.json",
    "previousChapterLink": null,
    "thisChapterAudioTimingsLink": "/api/BSB/GEN/1.hays.audioTimings.json",
    "nextChapterAudioTimingsLink": "/api/BSB/GEN/2.hays.audioTimings.json",
    "previousChapterAudioTimingsLink": null,
    "verses": [
        0,
        4.32,
        10.28,
        19.06,
        27.84
    ]
}
```

`verses[0]` es el tiempo de inicio del versículo 1, `verses[1]` es el tiempo de inicio del versículo 2, y así sucesivamente; por lo tanto, en este ejemplo, el versículo 2 de Génesis 1 (BSB, según lo leído por "hays") comienza a los 4,32 segundos del `audioLink` .

## Obtén las palabras de un capítulo

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Obtiene las anotaciones a nivel de palabra (números de Strong y datos de origen relacionados) para un solo capítulo.

Solo algunas traducciones incluyen anotaciones a nivel de palabra. Un capítulo que las tiene enlaza con este archivo con `thisChapterWordsLink` ; si falta esa propiedad, este archivo no existe para ese capítulo.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).
-   `book` es el ID del libro (por ejemplo, `GEN` para Génesis; puede encontrar una lista de ID de libros [aquí](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` es el número del capítulo (por ejemplo, `1` para el primer capítulo).

Cada anotación está vinculada a un rango de caracteres en un solo elemento de la matriz `content` de un verso: `contentIndex` es el índice del elemento, y `start` / `end` son desplazamientos de caracteres dentro del texto de ese elemento. `end` es exclusivo, por lo que `text.slice(start, end)` es la palabra anotada.

Anclar el contenido a un elemento específico (en lugar de al versículo en su conjunto) garantiza que los desplazamientos se mantengan correctos para los versículos cuyo contenido se divide en varios elementos, como versos de poemas, palabras de Jesús y referencias a notas al pie.

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtén las palabras de Génesis 1 de la traducción BSB.
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.json`)
    .then(request => request.json())
    .then(words => {
        console.log('Genesis 1 words (BSB):', words);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.words.json
```

:::

### Estructura

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * Enlace a la información de este capítulo.
     */
    thisChapterLink: string;

    /**
     * Enlace a la información del próximo capítulo.
     * Nulo si este es el último capítulo de la traducción.
     */
    nextChapterLink: string | null;

    /**
     * Enlace a la información del capítulo anterior.
     * Nulo si este es el primer capítulo de la traducción.
     */
    previousChapterLink: string | null;

    /**
     * El enlace a este archivo de palabras.
     */
    thisChapterWordsLink: string;

    /**
     * El enlace a las palabras del siguiente capítulo.
     * Nulo si este es el último capítulo de la traducción, o si el siguiente capítulo no tiene anotaciones a nivel de palabra.
     */
    nextChapterWordsLink: string | null;

    /**
     * Enlace a las palabras del capítulo anterior.
     * Nulo si este es el primer capítulo de la traducción, o si el capítulo anterior no tiene anotaciones a nivel de palabra.
     */
    previousChapterWordsLink: string | null;

    /**
     * Las palabras anotadas para cada versículo del capítulo, indicadas por el número del versículo.
     * Cada lista está en el orden en que aparecen las palabras en el versículo.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * El índice del elemento en la matriz de contenido del verso al que se aplica la anotación.
     */
    contentIndex: number;

    /**
     * El índice del primer carácter de la palabra anotada en el texto del elemento de contenido.
     */
    start: number;

    /**
     * El índice que aparece después del último carácter de la palabra anotada en el texto del elemento de contenido.
     * Es decir, text.slice(start, end) es la palabra anotada.
     */
    end: number;

    /**
     * El/los número(s) de Strong para la palabra.
     * Se omite si la traducción solo proporciona otras anotaciones para la palabra.
     */
    strongs?: string[];

    /**
     * La forma de la palabra que aparece en el diccionario (cita).
     * Se omite si la traducción no la proporciona.
     */
    lemma?: string;

    /**
     * El código de análisis morfológico para la palabra.
     * Se omite si la traducción no la proporciona.
     */
    morph?: string;

    /**
     * El puntero a la palabra en el texto fuente, en formato <sourceName> : <location> .
     * Se omite si la traducción no la proporciona.
     */
    srcloc?: string;

    /**
     * ¿Qué ocurrencia de la palabra fuente es esta palabra? 1-basado.
     * Se omite si la traducción no la proporciona.
     */
    occurrence?: number;

    /**
     * El número total de veces que aparece la palabra de origen.
     * Se omite si la traducción no la proporciona.
     */
    occurrences?: number;
}
```

### Ejemplo

Dado un capítulo cuyo primer versículo tiene un solo elemento de contenido:

```json:no-line-numbers title="/api/engwebp/JHN/1.json"
{
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
                ]
            }
        ]
    }
}
```

El archivo de palabras anota los caracteres de ese elemento:

```json:no-line-numbers title="/api/engwebp/JHN/1.words.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.json",
    "nextChapterLink": "/api/engwebp/JHN/2.json",
    "previousChapterLink": "/api/engwebp/MAT/28.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.json",
    "verses": {
        "1": [
            {
                "contentIndex": 0,
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

Es decir, `"In the beginning...".slice(0, 2)` es `"In"` , que la fuente etiquetó con `G1722` .

## Obtén una traducción completa

`GET https://bible.helloao.org/api/{translation}/complete.json`

Obtiene el contenido de una traducción completa.

-   `translation` es el ID de la traducción (por ejemplo `BSB` ).

### Ejemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Obtén Génesis 1 de la traducción BSB
fetch(`https://bible.helloao.org/api/${translation}/complete.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('BSB:', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.json
```

:::

### Estructura

```typescript:no-line-numbers title="complete.ts"
/**
 * Define los datos completos de descarga de la traducción.
 * Se corresponde con el punto final /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Los metadatos de la traducción.
     */
    translation: Translation;

    /**
     * La lista completa de libros con todos sus capítulos.
     */
    books: TranslationCompleteBook[];
}

/**
 * Descarga el libro en su traducción completa.
 */
export interface TranslationCompleteBook {
    /**
     * La identificación del libro.
     */
    id: string;

    /**
     * El nombre del libro según la traducción.
     */
    name: string;

    /**
     * El nombre común del libro.
     */
    commonName: string;

    /**
     * El título del libro.
     */
    title: string | null;

    /**
     * El orden del libro.
     */
    order: number;

    /**
     * El número de capítulos del libro.
     */
    numberOfChapters: number;

    /**
     * El número total de versículos del libro.
     */
    totalNumberOfVerses: number;

    /**
     * Si el libro es apócrifo.
     */
    isApocryphal?: boolean;

    /**
     * La lista completa de capítulos con todo su contenido.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Un capítulo de la traducción completa para descargar.
 */
export interface TranslationCompleteChapter {
    /**
     * El número de versículos que contiene el capítulo.
     */
    numberOfVerses: number;

    /**
     * Los enlaces a las diferentes versiones de audio del capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Los tiempos de audio (tiempos de inicio por verso, en segundos) para las diferentes versiones de audio del capítulo.
     *
     * A diferencia del valor `thisChapterAudioTimings` en el punto final de cada capítulo individual (que enlaza con "Obtener la sincronización de audio para un capítulo" más abajo), este contiene la sincronización en sí, ya que el objetivo de la descarga de la traducción completa es tener todo en un solo archivo.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Enlace a las anotaciones a nivel de palabra del capítulo.
     * Se omite si el capítulo no tiene anotaciones a nivel de palabra.
     */
    thisChapterWordsLink?: string;

    /**
     * La información del capítulo.
     */
    chapter: ChapterData;
}

/**
 * Los tiempos de audio de un capítulo del libro, integrados directamente en lugar de enlazados.
 * Asigna un ID de lector a la lista de momentos (en segundos) en que comienza cada verso, en orden de verso.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Ejemplo

```json:no-line-numbers title="/api/BSB/complete.json"
{
  "translation": {
    "id": "BSB",
    "name": "Berean Standard Bible",
    "website": "https://berean.bible/",
    "licenseUrl": "https://berean.bible/",
    "licenseNotes": null,
    "shortName": "BSB",
    "englishName": "Berean Standard Bible",
    "language": "eng",
    "textDirection": "ltr",
    "sha256": "b2898c49cadb50fd8763feb9e2f74a90a3817e33408a24b6cbf09e7a950dde97",
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
            "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
            "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
            "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
          },
          "thisChapterAudioTimings": {
            "gilbert": [0, 4.4, 10.36],
            "hays": [0, 4.32, 10.28],
            "souer": [0, 4.28, 10.19]
          },
          "chapter": {
            "number": 1,
            "content": [
              {
                "type": "heading",
                "content": [
                  "The Creation"
                ]
              },
              {
                "type": "verse",
                "number": 1,
                "content": [
                  "In the beginning God created the heavens and the earth."
                ]
              },
              {
                "type": "line_break"
              },
              {
                "type": "verse",
                "number": 2,
                "content": [
                  "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
              },
            ]
          }
        }
      ]
    }
  ]
}
```
