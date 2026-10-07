# Formato simplificado

Formato simplificado para capítulos, downloads de traduções completas e anotações em nível de palavra. Consulte [Traduções, Livros e Capítulos](./README.md) para obter os endpoints de tradução e listagem de livros, ou [o formato padrão](./standard.md) para a representação original e estruturada desse mesmo conteúdo.

## Obtenha um capítulo simplificado a partir de uma tradução.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Obtém o conteúdo de um único capítulo de um determinado livro e tradução, usando o formato simplificado.

No formato simplificado, o conteúdo de cada versículo é uma única sequência de caracteres em vez de uma lista de conteúdo formatado. Isso significa que você não precisa construir o texto de um versículo manualmente, o que pode ser complexo de se fazer corretamente, especialmente em relação ao espaçamento. Tudo o que não pode ser representado por uma simples sequência de caracteres — notas de rodapé, as Palavras de Jesus, poesia e títulos que aparecem no meio de um versículo — é mantido como um deslocamento dentro dessa sequência, para que nada se perca.

Use este endpoint quando desejar o texto de um capítulo. Use [o endpoint de capítulo padrão](./standard.md#get-a-chapter-from-a-translation) quando desejar exibir o capítulo com sua formatação original.

-   `translation` é o ID da tradução (ex: `BSB` ).
-   `book` é o ID do livro (ex: `GEN` para Gênesis - você pode encontrar uma lista de IDs de livros [aqui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` representa o capítulo numérico (por exemplo, `1` para o primeiro capítulo).

Os capítulos que possuem anotações em nível de palavra são vinculados a eles com `thisChapterWordsLink` , que aponta para [as anotações simplificadas](#get-the-words-of-a-chapter-in-the-simplified-format) - aquelas cujos deslocamentos correspondem ao texto neste arquivo.

Os capítulos que possuem marcações de tempo de áudio por leitor são vinculados a eles com `thisChapterAudioTimings` , que aponta para [o endpoint de marcações de tempo de áudio](./standard.md#get-the-audio-timings-for-a-chapter) - o mesmo arquivo para o qual o endpoint do capítulo regular é vinculado, já que as marcações de tempo não dependem do formato do capítulo.

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenha o texto de Gênesis 1 na tradução BSB.
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

### Deslocamentos

Todos os deslocamentos no formato simplificado - `offset` , `start` e `end` - são índices no `text` que os contém. Eles são medidos em unidades de código UTF-16, que é o que o JavaScript usa em suas versões `String.prototype.length` e `String.prototype.slice()` .

`start` é inclusivo e `end` é exclusivo, portanto `text.slice(start, end)` retorna exatamente o intervalo de texto que foi marcado. Os deslocamentos das notas de rodapé são a posição a que o elemento que chama a nota de rodapé pertence, portanto `text.slice(0, offset)` é o texto que vem antes dela.

### Estrutura

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * O link para a versão completa (não simplificada) deste capítulo.
     */
    fullChapterApiLink: string;

    /**
     * Os links para as diferentes versões em áudio do capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Os links para os tempos de áudio das diferentes versões em áudio do capítulo.
     * Consulte "Obter os tempos de áudio de um capítulo" na documentação do formato padrão - o arquivo de tempos é o mesmo, independentemente do formato do capítulo ao qual ele está vinculado.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * O link para o próximo capítulo, em formato simplificado.
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
     * O link para o capítulo anterior, em formato simplificado.
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
     * O número de versículos que o capítulo contém.
     */
    numberOfVerses: number;

    /**
     * As informações para o capítulo.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * O número do capítulo.
     */
    number: number;

    /**
     * O conteúdo do capítulo.
     */
    content: SimpleChapterContent[];

    /**
     * Lista de notas de rodapé que não puderam ser associadas a nenhum verso.
     * As notas de rodapé que pertencem a um versículo são incluídas no próprio versículo, portanto, essa lista geralmente está vazia.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Um tipo de união que representa um único elemento de conteúdo em um capítulo simplificado.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Um título em um capítulo.
 */
interface SimpleChapterHeading {
    /**
     * Indica que o conteúdo representa um título.
     */
    type: 'heading';

    /**
     * O texto do título.
     */
    text: string;
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
 * Um versículo em um capítulo.
 */
interface SimpleChapterVerse {
    /**
     * Indica que o conteúdo é um verso.
     */
    type: 'verse';

    /**
     * O número do versículo.
     */
    number: number;

    /**
     * O texto do versículo.
     * Os versos e as quebras de linha são separados por caracteres de nova linha (\n).
     */
    text: string;

    /**
     * As notas de rodapé que aparecem no verso.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Os títulos que aparecem no meio do versículo.
     * Omitido se o versículo não contiver títulos embutidos.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Os trechos do texto bíblico que representam as Palavras de Jesus.
     * Omitido se o verso não o contiver.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Os trechos do texto em verso que representam as linhas da poesia.
     * Omitido se o verso não o contiver.
     */
    poem?: SimplePoemRange[];
}

/**
 * Legenda em hebraico em um capítulo.
 * Esses elementos são frequentemente incluídos como conteúdo informativo que aparecia nos manuscritos originais.
 * Por exemplo, o Salmo 49 tem o subtítulo em hebraico "Ao mestre de canto. Salmo dos filhos de Corá".
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Indica que o conteúdo representa uma legenda em hebraico.
     */
    type: 'hebrew_subtitle';
}

/**
 * Uma nota de rodapé em um verso.
 */
interface SimpleVerseFootnote {
    /**
     * O ID da nota.
     */
    noteId: number;

    /**
     * O índice no texto do versículo onde a chamada da nota de rodapé deve ser inserida.
     */
    offset: number;

    /**
     * O texto da nota de rodapé.
     */
    text: string;

    /**
     * O identificador que deve ser usado para a nota de rodapé.
     * Se "+", então o chamador deve ser gerado automaticamente.
     * Se for nulo, o chamador deverá estar vazio.
     * Se for uma string, então o chamador deve ser essa string.
     */
    caller: '+' | string | null;
}

/**
 * Um título que está inserido em um versículo.
 */
interface SimpleInlineHeading {
    /**
     * O índice no texto do versículo indica onde o título aparece.
     */
    offset: number;

    /**
     * O texto do título.
     */
    text: string;
}

/**
 * Um trecho de texto dentro de um verso.
 */
interface SimpleTextRange {
    /**
     * O índice do primeiro caractere do intervalo.
     */
    start: number;

    /**
     * O índice após o último caractere do intervalo.
     */
    end: number;
}

/**
 * Um trecho de texto dentro de um verso que representa uma linha poética.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * O nível de recuo com que o verso do poema deve ser exibido.
     */
    level: number;
}
```

### Exemplo

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

A poesia e as palavras de Jesus são mantidas como intervalos ao longo do texto do versículo. Por exemplo, `Matthew 5:3` na tradução `engwebp` aparece assim:

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

## Obtenha o resumo de um capítulo em formato simplificado.

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Obtém as anotações em nível de palavra para um único capítulo, com seus deslocamentos remapeados para o texto de cada [versículo simplificado](#get-a-simplified-chapter-from-a-translation) .

Os deslocamentos nas [anotações regulares](./standard.md#get-the-words-of-a-chapter) estão ancorados a itens da matriz `content` de um versículo, que o formato simplificado substitui por uma única string — portanto, não podem ser usados ​​com ele. Use este arquivo em vez deste quando estiver trabalhando com os capítulos simplificados.

-   `translation` é o ID da tradução (ex: `BSB` ).
-   `book` é o ID do livro (ex: `GEN` para Gênesis - você pode encontrar uma lista de IDs de livros [aqui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` representa o capítulo numérico (por exemplo, `1` para o primeiro capítulo).

Essas entradas não têm `contentIndex` `start` e `end` são deslocamentos para o `text` do versículo, exatamente como os deslocamentos da nota de rodapé, do poema e das Palavras de Jesus nos capítulos simplificados, portanto `text.slice(start, end)` é a palavra anotada.

Assim como acontece com as anotações regulares, apenas algumas traduções as possuem. Um capítulo simplificado que as contém tem um link para este arquivo com valor `thisChapterWordsLink` ; quando essa propriedade está ausente, este arquivo não existe para o capítulo.

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenha o texto de Gênesis 1 e as palavras que estão anotadas nele.
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

### Estrutura

A estrutura corresponde [às anotações regulares](./standard.md#get-the-words-of-a-chapter) , exceto que os links apontam para os arquivos simplificados e as entradas não têm `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * O link para o capítulo simplificado ao qual estas anotações se referem.
     */
    thisChapterLink: string;

    /**
     * O link para o próximo capítulo simplificado.
     * Nulo se este for o último capítulo da tradução.
     */
    nextChapterLink: string | null;

    /**
     * O link para o capítulo simplificado anterior.
     * Nulo se este for o primeiro capítulo da tradução.
     */
    previousChapterLink: string | null;

    /**
     * O link para essas anotações.
     */
    thisChapterWordsLink: string;

    /**
     * O link para as anotações do próximo capítulo.
     * Nulo se este for o último capítulo da tradução ou se o próximo capítulo não tiver anotações em nível de palavra.
     */
    nextChapterWordsLink: string | null;

    /**
     * O link para as anotações do capítulo anterior.
     * Nulo se este for o primeiro capítulo da tradução ou se o capítulo anterior não tiver anotações em nível de palavra.
     */
    previousChapterWordsLink: string | null;

    /**
     * As palavras anotadas para cada versículo do capítulo, identificadas pelo número do versículo.
     * Cada lista está na ordem em que as palavras aparecem no versículo.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Anotações em nível de palavra em um capítulo simplificado.
 */
export interface SimpleChapterWord {
    /**
     * O índice do primeiro caractere da palavra anotada no texto do verso.
     */
    start: number;

    /**
     * O índice que se encontra após o último caractere da palavra anotada no texto do verso.
     */
    end: number;

    /**
     * Os números de Strong para a palavra.
     */
    strongs?: string[];

    /**
     * O lema (forma de dicionário) da palavra na língua de origem.
     */
    lemma?: string;

    /**
     * A morfologia da palavra na língua de origem.
     */
    morph?: string;

    /**
     * A localização da palavra no texto original.
     */
    srcloc?: string;

    /**
     * Em qual ocorrência da palavra no versículo isso acontece?
     */
    occurrence?: number;

    /**
     * O número de vezes que a palavra aparece no versículo.
     */
    occurrences?: number;
}
```

### Exemplo

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

O versículo 1 desse capítulo tem o texto `"In the beginning was the Word, and the Word was with God, and the Word was God."` , então `text.slice(7, 16)` é `"beginning"` .

## Obtenha uma tradução completa em formato simplificado.

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Obtém o conteúdo de uma tradução completa, usando o formato simplificado. Este é o [formato de capítulo simplificado](#get-a-simplified-chapter-from-a-translation) aplicado ao [download da tradução completa](./standard.md#get-an-entire-translation) : um arquivo contendo toda a tradução, onde o conteúdo de cada versículo é uma única sequência de caracteres.

Use esta opção quando desejar o texto de uma tradução completa sem precisar fazer uma solicitação para cada capítulo e sem ter que criar o texto você mesmo.

-   `translation` é o ID da tradução (ex: `BSB` ).

Este arquivo é gerado juntamente com o arquivo `complete.json` , portanto, uma tradução contém ambos ou nenhum. O objeto `translation` em ambos os arquivos contém um `completeTranslationApiLink` e um `simpleCompleteTranslationApiLink` , então você pode navegar entre os dois formatos.

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Obtenha o texto completo da tradução BSB.
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

### Estrutura

A estrutura corresponde [ao download completo da tradução regular](./standard.md#get-an-entire-translation) , exceto que cada capítulo usa o formato simplificado.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Define os dados completos de download da tradução, usando o formato de capítulo simplificado.
 * Mapeia para o endpoint /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Os metadados da tradução.
     */
    translation: Translation;

    /**
     * A lista completa dos livros com todos os seus capítulos.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Um livro em tradução completa para download, utilizando o formato de capítulos simplificado.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Lista completa dos capítulos com todo o conteúdo.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Um capítulo da tradução completa está disponível para download no formato simplificado.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * O número de versículos que o capítulo contém.
     */
    numberOfVerses: number;

    /**
     * Os links para as diferentes versões em áudio do capítulo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Os tempos de áudio (início de cada verso, em segundos) para o capítulo.
     *
     * Note que os arquivos de tradução completos contêm as marcações de tempo (consulte TranslationBookChapterAudioTimingsMap na documentação do formato padrão), ao contrário dos pontos finais de capítulos individuais, que contêm links para elas.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * O link para as anotações em nível de palavra do capítulo, usando o formato simplificado. Omitido se o capítulo não tiver anotações em nível de palavra.
     */
    thisChapterWordsLink?: string;

    /**
     * Informações simplificadas para o capítulo.
     */
    chapter: SimpleChapterData;
}
```

### Exemplo

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
