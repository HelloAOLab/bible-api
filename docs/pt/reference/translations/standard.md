# Formato padrão

O formato padrão para capítulos, downloads de traduções completas e anotações em nível de palavra. Consulte [Traduções, Livros e Capítulos](./README.md) para obter os endpoints de listagem de traduções e livros, ou [o formato simplificado](./simplified.md) para a representação alternativa desse mesmo conteúdo.

## Obtenha um capítulo a partir de uma tradução.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Obtém o conteúdo de um único capítulo de um determinado livro e tradução.

-   `translation` é o ID da tradução (ex: `BSB` ).
-   `book` é o ID do livro (ex: `GEN` para Gênesis - você pode encontrar uma lista de IDs de livros [aqui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` representa o capítulo numérico (por exemplo, `1` para o primeiro capítulo).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenha Gênesis 1 na tradução BSB.
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

### Estrutura

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * Informações sobre a tradução do capítulo do livro.
     */
    translation: Translation;

    /**
     * Informações sobre o capítulo do livro.
     */
    book: TranslationBook;

    /**
     * O link para o capítulo atual.
     */
    thisChapterLink: string;

    /**
     * Os links para as diferentes versões em áudio do capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Os links para os tempos de áudio das diferentes versões em áudio do capítulo.
     * Cada link direciona para o arquivo de sincronização de áudio daquele leitor - veja "Obter a sincronização de áudio de um capítulo" abaixo.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * O link para o próximo capítulo.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterApiLink: string | null;

    /**
     * Os links para as diferentes versões em áudio do próximo capítulo.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Os links para os tempos de áudio das diferentes versões do próximo capítulo.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * O link para o capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterApiLink: string | null;

    /**
     * Os links para as diferentes versões em áudio do capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Os links para os tempos de áudio das diferentes versões do capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * O link para as anotações em nível de palavra do capítulo.
     * Omitido se o capítulo não tiver anotações em nível de palavra.
     */
    thisChapterWordsLink?: string;

    /**
     * O link para as anotações em nível de palavra do próximo capítulo.
     * (Omitido se este for o último capítulo da tradução ou se o próximo capítulo não tiver anotações ao nível das palavras.)
     */
    nextChapterWordsLink?: string;

    /**
     * O link para as anotações em nível de palavra do capítulo anterior.
     * Omitido se este for o primeiro capítulo da tradução ou se o capítulo anterior não tiver anotações ao nível das palavras.
     */
    previousChapterWordsLink?: string;

    /**
     * O número de versículos que o capítulo contém.
     */
    numberOfVerses: number;

    /**
     * O link para a versão simplificada deste capítulo.
     * Omitido se capítulos simplificados não estiverem disponíveis.
     */
    simpleChapterApiLink?: string;

    /**
     * As informações para o capítulo.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * O número do capítulo.
     */
    number: number;

    /**
     * O conteúdo do capítulo.
     */
    content: ChapterContent[];

    /**
     * Lista de notas de rodapé do capítulo.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Um tipo de união que representa um único trecho do conteúdo de um capítulo.
 * Um trecho do conteúdo de um capítulo pode ser uma das seguintes coisas:
 * - Um título.
 * - Uma quebra de linha.
 * — Um verso.
 * - Legendas em hebraico.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Um título em um capítulo.
 */
interface ChapterHeading {
    /**
     * Indica que o conteúdo representa um título.
     */
    type: 'heading';

    /**
     * O conteúdo do título.
     * Se várias strings estiverem incluídas na matriz, elas devem ser concatenadas com um espaço.
     */
    content: string[];
}

/**
 * Uma quebra de linha em um capítulo.
 */
interface ChapterLineBreak {
    /**
     * Indica que o conteúdo representa uma quebra de linha.
     */
    type: 'line_break';
}

/**
 * Legenda em hebraico em um capítulo.
 * Esses elementos são frequentemente utilizados como conteúdo informativo que aparecia nos manuscritos originais.
 * Por exemplo, o Salmo 49 tem o subtítulo em hebraico "Ao mestre de canto. Salmo dos filhos de Corá".
 */
interface ChapterHebrewSubtitle {
    /**
     * Indica que o conteúdo representa uma legenda em hebraico.
     */
    type: 'hebrew_subtitle';

    /**
     * A lista de conteúdo que está contido na legenda.
     * Cada elemento da lista pode ser uma cadeia de caracteres, um texto formatado ou uma referência de nota de rodapé.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Um versículo em um capítulo.
 */
interface ChapterVerse {
    /**
     * Indica que o conteúdo é um verso.
     */
    type: 'verse';

    /**
     * O número do versículo.
     */
    number: number;

    /**
     * Lista de conteúdo do versículo.
     * Cada elemento da lista pode ser uma cadeia de caracteres, um texto formatado ou uma referência de nota de rodapé.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Texto formatado. Ou seja, texto que está formatado de uma maneira específica.
 */
interface FormattedText {
    /**
     * O texto que está formatado.
     */
    text: string;

    /**
     * Se o texto representa um poema.
     * O número indica o nível de recuo.
     *
     * Comum nos Salmos.
     */
    poem?: number;

    /**
     * Se o texto representa as palavras de Jesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Define uma interface que representa um título inserido em um versículo.
 */
interface InlineHeading {
    /**
     * O texto do título.
     */
    heading: string;
}

/**
 * Define uma interface que representa uma quebra de linha inserida em um verso.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Uma referência em nota de rodapé em um versículo ou um subtítulo em hebraico.
 */
interface VerseFootnoteReference {
    /**
     * O ID da nota.
     */
    noteId: number;
}

/**
 * Informações sobre uma nota de rodapé.
 */
interface ChapterFootnote {
    /**
     * O ID da nota referenciada.
     */
    noteId: number;

    /**
     * O texto da nota de rodapé.
     */
    text: string;

    /**
     * A referência bíblica para a nota de rodapé.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * O identificador que deve ser usado para a nota de rodapé.
     * Em notas de rodapé, um "caractere de chamada" é o caractere usado no texto para fazer referência à nota de rodapé.
     *
     * Por exemplo, no texto:
     * Olá (a) Mundo
     *
     * ---- (a) Esta é uma nota de rodapé.
     *
     * O "(a)" é o chamador.
     *
     * Se "+", então o chamador deve ser gerado automaticamente.
     * Se for nulo, o chamador deverá estar vazio.
     * Se for uma string, então o chamador deve ser essa string.
     */
    caller: '+' | string | null;
}

/**
 * Os links de áudio para um capítulo do livro.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * O texto de apresentação do capítulo e o link URL para o arquivo de áudio.
     */
    [reader: string]: string;
}

/**
 * Os links para os tempos de áudio de um capítulo do livro.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * O leitor do capítulo e o link da API para o arquivo de sincronização de áudio desse leitor.
     */
    [reader: string]: string;
}
```

### Exemplo

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

## Obtenha a duração do áudio para um capítulo.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Obtém a duração de cada versículo do áudio de um capítulo específico, para a narração de um único leitor — ou seja, o tempo (em segundos, relativo ao início do arquivo de áudio desse leitor) em que cada versículo começa. Os clientes podem usar essa informação para destacar o versículo que está sendo lido no momento da reprodução do áudio.

Apenas algumas traduções e leitores possuem marcações de áudio. Um capítulo que as possui para um leitor específico tem um link para este arquivo com uma entrada em `thisChapterAudioTimings` , identificada pelo ID desse leitor; quando um leitor não é uma chave nesse mapa, este arquivo não existe para esse leitor e capítulo.

-   `translation` é o ID da tradução (ex: `BSB` ).
-   `book` é o ID do livro (ex: `GEN` para Gênesis - você pode encontrar uma lista de IDs de livros [aqui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` representa o capítulo numérico (por exemplo, `1` para o primeiro capítulo).
-   `reader` é o ID do leitor cuja narração os tempos são (ex: `hays` ) - os leitores disponíveis para um capítulo são as chaves do seu `thisChapterAudioLinks` .

O fim de um verso é o início do próximo verso (ou, no caso do último verso, o fim do arquivo de áudio), portanto, o cliente não precisa de nada além da lista ordenada de horários de início para criar intervalos de destaque para todo o capítulo.

Este arquivo é o mesmo, independentemente de ser acessado pelo ponto final do capítulo normal ou [pelo simplificado](./simplified.md#get-a-simplified-chapter-from-a-translation) - existe apenas um conjunto de tempos por tradução, livro, capítulo e leitor.

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Obtenha a duração do áudio de Gênesis 1 (BSB), conforme lido por "hays".
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

### Estrutura

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Define a duração do áudio para um capítulo de livro, para um único narrador.
 * Mapeia para o endpoint /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * O ID da tradução.
     */
    translationId: string;

    /**
     * A identificação do livro.
     */
    bookId: string;

    /**
     * O número do capítulo.
     */
    chapterNumber: number;

    /**
     * O ID do leitor ao qual esses horários se referem.
     */
    reader: string;

    /**
     * O link para o arquivo de áudio ao qual se referem esses tempos.
     */
    audioLink: string;

    /**
     * O link para as informações deste capítulo.
     */
    thisChapterLink: string;

    /**
     * O link para as informações do próximo capítulo.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterLink: string | null;

    /**
     * O link para as informações do capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterLink: string | null;

    /**
     * O link para este arquivo de sincronização de áudio.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * O link para os horários do próximo capítulo, para o mesmo leitor.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * O link para os horários do capítulo anterior, para o mesmo leitor.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Os instantes em segundos em que cada verso começa, em ordem.
     * O primeiro número (índice 0) indica o momento na gravação em que começa o primeiro verso.
     */
    verses: number[];
}
```

### Exemplo

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

`verses[0]` é o tempo de início do versículo 1, `verses[1]` é o tempo de início do versículo 2 e assim por diante - então, neste exemplo, o versículo 2 de Gênesis 1 (BSB, conforme lido por "hays") começa 4,32 segundos após o início do versículo `audioLink` .

## Obtenha as palavras de um capítulo

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Obtém as anotações em nível de palavra (números de Strong e dados de origem relacionados) para um único capítulo.

Apenas algumas traduções incluem anotações ao nível da palavra. Um capítulo que as possui está vinculado a este arquivo com o `thisChapterWordsLink` ; quando essa propriedade está ausente, este arquivo não existe para o capítulo.

-   `translation` é o ID da tradução (ex: `BSB` ).
-   `book` é o ID do livro (ex: `GEN` para Gênesis - você pode encontrar uma lista de IDs de livros [aqui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` representa o capítulo numérico (por exemplo, `1` para o primeiro capítulo).

Cada anotação está ancorada a um intervalo de caracteres em um único item da matriz `content` de um verso: `contentIndex` é o índice do item, e `start` são os deslocamentos de caracteres dentro `end` texto desse item. `end` é exclusivo, portanto `text.slice(start, end)` é a palavra anotada.

Ancorar a um item de conteúdo (em vez do versículo como um todo) significa que os deslocamentos permanecem corretos para versículos cujo conteúdo é dividido em vários itens, como linhas de poemas, palavras de Jesus e referências de notas de rodapé.

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenha as palavras de Gênesis 1 na tradução BSB.
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

### Estrutura

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * O ID da tradução.
     */
    translationId: string;

    /**
     * A identificação do livro.
     */
    bookId: string;

    /**
     * O número do capítulo.
     */
    chapterNumber: number;

    /**
     * O link para as informações deste capítulo.
     */
    thisChapterLink: string;

    /**
     * O link para as informações do próximo capítulo.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterLink: string | null;

    /**
     * O link para as informações do capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterLink: string | null;

    /**
     * O link para este arquivo de palavras.
     */
    thisChapterWordsLink: string;

    /**
     * O link para o texto do próximo capítulo.
     * Nulo se este for o último capítulo da tradução ou se o próximo capítulo não tiver anotações em nível de palavra.
     */
    nextChapterWordsLink: string | null;

    /**
     * O link para o texto do capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução ou se o capítulo anterior não tiver anotações em nível de palavra.
     */
    previousChapterWordsLink: string | null;

    /**
     * As palavras anotadas para cada versículo do capítulo, identificadas pelo número do versículo.
     * Cada lista está na ordem em que as palavras aparecem no versículo.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * O índice do item na matriz de conteúdo do versículo ao qual a anotação se aplica.
     */
    contentIndex: number;

    /**
     * O índice do primeiro caractere da palavra anotada no texto do item de conteúdo.
     */
    start: number;

    /**
     * O índice que se encontra após o último caractere da palavra anotada no texto do item de conteúdo.
     * Ou seja, text.slice(start, end) é a palavra anotada.
     */
    end: number;

    /**
     * Número(s) de Strong para a palavra.
     * Omitido se a tradução forneceu apenas outras anotações para a palavra.
     */
    strongs?: string[];

    /**
     * A forma da palavra citada no dicionário.
     * Omitido se a tradução não a forneceu.
     */
    lemma?: string;

    /**
     * O código de análise morfológica da palavra.
     * Omitido se a tradução não a forneceu.
     */
    morph?: string;

    /**
     * O ponteiro para a palavra no texto fonte, no formato <sourceName> : <location> .
     * Omitido se a tradução não a forneceu.
     */
    srcloc?: string;

    /**
     * Qual ocorrência da palavra-fonte é esta palavra? Baseada em 1.
     * Omitido se a tradução não a forneceu.
     */
    occurrence?: number;

    /**
     * O número total de vezes que a palavra-fonte ocorre.
     * Omitido se a tradução não a forneceu.
     */
    occurrences?: number;
}
```

### Exemplo

Dado um capítulo cujo primeiro versículo contém um único item de conteúdo:

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

O arquivo de palavras anota os caracteres desse item:

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

Ou seja, `"In the beginning...".slice(0, 2)` é `"In"` , que a fonte rotulou com `G1722` .

## Obtenha uma tradução completa.

`GET https://bible.helloao.org/api/{translation}/complete.json`

Obtém o conteúdo de uma tradução completa.

-   `translation` é o ID da tradução (ex: `BSB` ).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Obtenha Gênesis 1 na tradução BSB.
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

### Estrutura

```typescript:no-line-numbers title="complete.ts"
/**
 * Define os dados completos de download da tradução.
 * Mapeia para o endpoint /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Os metadados da tradução.
     */
    translation: Translation;

    /**
     * A lista completa dos livros com todos os seus capítulos.
     */
    books: TranslationCompleteBook[];
}

/**
 * Baixe o livro na íntegra, com a tradução completa.
 */
export interface TranslationCompleteBook {
    /**
     * A identificação do livro.
     */
    id: string;

    /**
     * O nome do livro, conforme a tradução.
     */
    name: string;

    /**
     * Nome comum do livro.
     */
    commonName: string;

    /**
     * O título do livro.
     */
    title: string | null;

    /**
     * A ordem do livro.
     */
    order: number;

    /**
     * O número de capítulos do livro.
     */
    numberOfChapters: number;

    /**
     * O número total de versículos no livro.
     */
    totalNumberOfVerses: number;

    /**
     * Se o livro é apócrifo.
     */
    isApocryphal?: boolean;

    /**
     * Lista completa dos capítulos com todo o conteúdo.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Um capítulo no download da tradução completa.
 */
export interface TranslationCompleteChapter {
    /**
     * O número de versículos que o capítulo contém.
     */
    numberOfVerses: number;

    /**
     * Os links para as diferentes versões em áudio do capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Os tempos de áudio (horários de início de cada verso, em segundos) para diferentes versões de áudio do capítulo.
     *
     * Ao contrário do item `thisChapterAudioTimings` no endpoint de cada capítulo individual (que leva a "Obter a sincronização de áudio de um capítulo" abaixo), este contém a própria sincronização - já que o objetivo do download da tradução completa é ter tudo em um único arquivo.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * O link para as anotações em nível de palavra do capítulo.
     * Omitido se o capítulo não tiver anotações em nível de palavra.
     */
    thisChapterWordsLink?: string;

    /**
     * As informações para o capítulo.
     */
    chapter: ChapterData;
}

/**
 * A duração do áudio de um capítulo do livro, incorporada diretamente em vez de por meio de um link.
 * Mapeia um ID de leitor para a lista de horários (em segundos) em que cada versículo começa, na ordem dos versículos.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Exemplo

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
