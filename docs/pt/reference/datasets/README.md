# Conjuntos de dados

Pontos de extremidade para navegar em conjuntos de dados bíblicos suplementares - como referências cruzadas, entidades bíblicas (pessoas, lugares, eventos e grupos de pessoas), palavras interlineares no idioma original, léxicos e candidatos a versículo do dia - e obter seus livros, conteúdo dos capítulos, entidades, entradas do léxico e categorias de versículos.

## Conjuntos de dados disponíveis

`GET https://bible.helloao.org/api/available_datasets.json`

Obtém a lista de conjuntos de dados bíblicos disponíveis na API.

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * A lista de conjuntos de dados.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * O ID do conjunto de dados.
     */
    id: string;

    /**
     * O nome do conjunto de dados.
     */
    name: string;

    /**
     * O site onde o conjunto de dados está disponível.
     */
    website: string;

    /**
     * O endereço URL onde se pode encontrar a licença do conjunto de dados.
     */
    licenseUrl: string;

    /**
     * Notas adicionais da API referentes à licença.
     * Nulo ou indefinido se não houver anotações.
     */
    licenseNotes?: string | null;

    /**
     * O nome em inglês para o conjunto de dados.
     */
    englishName: string;

    /**
     * A etiqueta de idioma de 3 letras ISO 639 na qual o conjunto de dados se encontra principalmente.
     */
    language: string;

    /**
     * A direção em que a língua é escrita.
     * "ltr" indica que o texto é escrito da esquerda para a direita na página.
     * "rtl" indica que o texto é escrito da direita para a esquerda na página.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * O link da API para a lista de livros disponíveis para este conjunto de dados.
     */
    listOfBooksApiLink: string;

    /**
     * Lista de formatos disponíveis.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * O número de livros contidos neste conjunto de dados.
     */
    numberOfBooks: number;

    /**
     * O número total de capítulos contidos neste conjunto de dados.
     */
    totalNumberOfChapters: number;

    /**
     * O número total de versículos contidos neste conjunto de dados.
     */
    totalNumberOfVerses: number;

    /**
     * O número total de referências cruzadas contidas neste conjunto de dados.
     * 0 para conjuntos de dados que não contêm referências cruzadas.
     */
    totalNumberOfReferences: number;

    /**
     * O número total de palavras interlineares contidas neste conjunto de dados.
     * Omitido se o conjunto de dados não contiver palavras interlineares.
     */
    totalNumberOfWords?: number;

    /**
     * Obtém o nome do idioma em que o conjunto de dados está contido.
     * Nulo ou indefinido se o nome do idioma for desconhecido.
     */
    languageName?: string;

    /**
     * Obtém o nome do idioma em inglês.
     * Nulo ou indefinido se o idioma não tiver um nome em inglês.
     */
    languageEnglishName?: string;

    /**
     * Os links da API para as listas de entidades no conjunto de dados.
     * Omitido se o conjunto de dados não contiver as entidades correspondentes.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * O número total de entidades contidas no conjunto de dados.
     * Omitido se o conjunto de dados não contiver as entidades correspondentes.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * O link da API para a lista de entradas do léxico no conjunto de dados.
     * Omitido se o conjunto de dados não contiver entradas de léxico.
     */
    listOfLexiconApiLink?: string;

    /**
     * O número total de entradas do léxico contidas no conjunto de dados.
     * Omitido se o conjunto de dados não contiver entradas de léxico.
     */
    totalNumberOfLexicon?: number;

    /**
     * O link da API para a lista de todos os versículos do conjunto de dados, com suas respectivas categorias.
     * Omitido se os versos do conjunto de dados não tiverem categorias.
     */
    listOfVersesApiLink?: string;

    /**
     * O link da API para a lista de categorias de versículos no conjunto de dados.
     * Omitido se o conjunto de dados não contiver categorias de versículos.
     */
    listOfCategoriesApiLink?: string;

    /**
     * O número total de categorias de versículos contidas no conjunto de dados.
     * Omitido se o conjunto de dados não contiver categorias de versículos.
     */
    totalNumberOfCategories?: number;
}
```

### Exemplo

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

## Listar livros em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Obtém a lista de livros disponíveis para o conjunto de dados fornecido.

-   `dataset` o ID do conjunto de dados (ex: `open-cross-ref` ).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Obtenha a lista de livros para o conjunto de dados open-cross-ref
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

### Estrutura

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Informações do conjunto de dados referentes aos livros.
     */
    dataset: Dataset;

    /**
     * Lista dos livros disponíveis para o conjunto de dados.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * A identificação do livro.
     * Corresponde ao ID do livro correspondente na Bíblia (Gênesis, Êxodo, etc.).
     */
    id: string;

    /**
     * A ordem dos livros na Bíblia.
     */
    order: number;

    /**
     * O número do primeiro capítulo do livro.
     */
    firstChapterNumber: number;

    /**
     * O link para o primeiro capítulo do livro.
     */
    firstChapterApiLink: string | null;

    /**
     * O número do último capítulo do livro.
     */
    lastChapterNumber: number | null;

    /**
     * O link para o último capítulo do livro.
     */
    lastChapterApiLink: string | null;

    /**
     * O número de capítulos que o livro contém.
     */
    numberOfChapters: number;

    /**
     * O número de versículos que o livro contém.
     */
    totalNumberOfVerses: number;

    /**
     * O número total de referências cruzadas que este livro contém.
     */
    totalNumberOfReferences: number;
}
```

### Exemplo

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

## Obter um capítulo de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Obtém o conteúdo de um único capítulo de um livro e conjunto de dados específicos.

Para conjuntos de dados de referência cruzada (como o `open-cross-ref` ), o capítulo contém a lista de referências cruzadas para cada versículo. Para conjuntos de dados interlineares (como o `bsb-interlinear` ), o capítulo contém as palavras no idioma original de cada versículo — veja [Conjuntos de Dados Interlineares](#interlinear-datasets) . Para conjuntos de dados de entidades (como o `theographic` ), o capítulo contém as pessoas, os lugares e os eventos que aparecem no capítulo — veja [Como Obter as Entidades em um Capítulo](#get-the-entities-in-a-chapter) . Para o conjunto de dados `verse-of-the-day` , o capítulo contém os candidatos a versículo do dia no capítulo e suas categorias — veja [Versículo do Dia](#verse-of-the-day) .

-   `dataset` o ID do conjunto de dados (ex: `open-cross-ref` ).
-   `book` é o ID do livro (por exemplo, `GEN` para Gênesis).
-   `chapter` é o número do capítulo (por exemplo, `1` para o primeiro capítulo).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Obtenha o Genesis 1 do conjunto de dados open-cross-ref.
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

### Estrutura

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Informações do conjunto de dados para o capítulo do livro.
     */
    dataset: Dataset;

    /**
     * Informações sobre o capítulo do livro.
     */
    book: DatasetBook;

    /**
     * O link para este capítulo.
     */
    thisChapterLink: string;

    /**
     * O link para o próximo capítulo.
     * Nulo se este for o último capítulo do conjunto de dados.
     */
    nextChapterApiLink: string | null;

    /**
     * O link para o capítulo anterior.
     * Nulo se este for o primeiro capítulo do conjunto de dados.
     */
    previousChapterApiLink: string | null;

    /**
     * O número de versículos que o capítulo contém.
     */
    numberOfVerses: number;

    /**
     * As informações para o capítulo.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * O número do capítulo.
     */
    number: number;

    /**
     * O conteúdo do capítulo.
     */
    content: DatasetVerse[];
}

/**
 * Um versículo carrega o valor `references` (conjuntos de dados de referência cruzada), `words` (conjuntos de dados interlineares) ou `categories` (conjunto de dados do versículo do dia).
 * Verifique qual deles está presente com `'words' in verse` ou `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * O número do versículo.
     */
    verse: number;

    /**
     * As referências cruzadas para o versículo.
     *
     * Ordenado por pontuação, em ordem decrescente.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * O número do versículo.
     */
    verse: number;

    /**
     * As palavras do verso no idioma original, na ordem do texto original.
     * Veja "Conjuntos de dados interlineares" abaixo.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * O número do versículo.
     * Se `endVerse` estiver presente, então este é o versículo em que a passagem começa.
     */
    verse: number;

    /**
     * O versículo em que a passagem termina.
     * Omitido se a entrada for um único verso.
     */
    endVerse?: number;

    /**
     * Os IDs das categorias às quais o verso pertence, da mais relevante para a menos relevante.
     * Veja o "Versículo do Dia" abaixo.
     */
    categories: string[];

    /**
     * O primeiro ano em que o versículo pode ser o versículo do dia.
     * Omitido se o versículo sempre esteve na lista.
     */
    addedIn?: number;

    /**
     * O primeiro ano em que o versículo não pode mais ser o versículo do dia.
     * Os versículos removidos permanecem no conjunto de dados para que os versículos de anos anteriores ainda possam ser selecionados.
     * Omitido se o versículo não tiver sido removido da lista.
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * O ID do livro ao qual se faz referência.
     */
    book: string;

    /**
     * O número do capítulo.
     */
    chapter: number;

    /**
     * O número do versículo.
     * Se `endVerse` estiver presente, então este é o versículo em que a referência começa.
     */
    verse: number;

    /**
     * O versículo em que a referência termina.
     */
    endVerse?: number;

    /**
     * A pontuação de relevância para a referência.
     */
    score?: number;
}

// Consulte "Conjuntos de dados interlineares" abaixo para obter informações sobre a estrutura do InterlinearWord.
```

### Exemplo

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

Alguns conjuntos de dados - como o conjunto de dados [de Metadados Teográficos da Bíblia](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - contêm entidades: pessoas, lugares, eventos e grupos de pessoas, juntamente com as relações entre eles e os versículos bíblicos que os mencionam.

O conjunto de dados [History Globe](https://historyglobe.app) ( `history-globe` ) contém apenas lugares: os lugares mencionados na Bíblia, com suas coordenadas e os versículos que os nomeiam. Seus IDs de lugar (por exemplo, `a15257a` para Jerusalém) são os IDs de lugar estáveis ​​do History Globe, os mesmos que sua própria [API de dados abertos](https://historyglobe.app/docs/api.html) usa, portanto, eles não mudam quando um nome é corrigido. Seus `featureType` valores seguem os que o conjunto de dados Theographic usa ( `City` , `Region` , `Water` e assim por diante), e `featureSubType` carrega o tipo mais específico quando existe um (por exemplo, `River` , `Gate` , `Spring` ).

Os conjuntos de dados que contêm entidades incluem `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` e `listOfPeopleGroupsApiLink` propriedades em sua entrada em `/api/available_datasets.json` .

Os conjuntos de dados de entidades também fornecem dados alinhados por capítulo: `/api/d/{dataset}/books.json` lista os livros cujos capítulos contêm dados de entidades e `/api/d/{dataset}/{book}/{chapter}.json` retorna as pessoas, lugares e eventos que aparecem nesse capítulo, juntamente com os números dos versículos em que cada um é mencionado. Consulte [Obter as Entidades em um Capítulo](#get-the-entities-in-a-chapter) .

As entidades fazem referência a passagens bíblicas usando os mesmos IDs de livro, números de capítulo e números de versículo do restante da API, permitindo que sejam combinadas com qualquer tradução. Elas fazem referência umas às outras usando referências de entidade:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * O ID da entidade que está sendo referenciada.
     */
    id: string;

    /**
     * O tipo da entidade à qual se faz referência.
     * Corresponde ao segmento de coleção do link da API da entidade, portanto o link pode ser construído como `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * O nome da entidade à qual se faz referência.
     */
    name?: string;

    /**
     * O link da API para a entidade que está sendo referenciada.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * O ID do livro (GEN, EXO, etc.).
     */
    book: string;

    /**
     * O número do capítulo em que a referência começa.
     */
    chapter: number;

    /**
     * O número do versículo em que a referência começa.
     */
    verse: number;

    /**
     * O versículo em que a referência termina.
     * Versículos consecutivos no mesmo capítulo são agrupados em uma única referência.
     */
    endVerse?: number;
}
```

### Atribuição do Globo Histórico

Os dados do History Globe são licenciados sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Se você os usar, dê crédito ao History Globe ( https://historyglobe.app ) e aos dados de geocodificação bíblica do OpenBible.info nos quais ele se baseia, e mencione quaisquer alterações. A propriedade `licenseNotes` do conjunto de dados contém o crédito.

## Obtenha as entidades em um capítulo.

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Para conjuntos de dados de entidades, obtém as pessoas, os lugares e os eventos que aparecem em um único capítulo, juntamente com os números dos versículos no capítulo em que cada um é mencionado.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).
-   `book` é o ID do livro (por exemplo, `GEN` para Gênesis).
-   `chapter` é o número do capítulo (por exemplo, `1` para o primeiro capítulo).

A lista de livros e capítulos que possuem dados de entidades está disponível em `GET https://bible.helloao.org/api/d/{dataset}/books.json` , que segue a mesma estrutura do [endpoint do conjunto de dados de livros](#list-books-in-a-dataset) . Para conjuntos de dados de entidades, `totalNumberOfVerses` é o número de versículos que são mencionados por pelo menos uma entidade e `totalNumberOfReferences` é o número total de menções de versículos por entidade.

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Descubra as pessoas, os lugares e os eventos que aparecem em Gênesis 2.
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

### Estrutura

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Informações do conjunto de dados para o capítulo do livro.
     */
    dataset: Dataset;

    /**
     * Informações sobre o capítulo do livro.
     */
    book: DatasetBook;

    /**
     * Os dados da entidade para o capítulo.
     */
    chapter: DatasetEntityChapterData;

    /**
     * O link para este capítulo.
     */
    thisChapterLink: string;

    /**
     * O link para o próximo capítulo.
     * Nulo se este for o último capítulo do conjunto de dados.
     */
    nextChapterApiLink: string | null;

    /**
     * O link para o capítulo anterior.
     * Nulo se este for o primeiro capítulo do conjunto de dados.
     */
    previousChapterApiLink: string | null;

    /**
     * O número de pessoas, lugares e eventos que aparecem no capítulo.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * O número do capítulo.
     */
    number: number;

    /**
     * As pessoas que aparecem no capítulo.
     * Ordenados pelo primeiro versículo em que aparecem.
     */
    people: ChapterPerson[];

    /**
     * Os lugares que aparecem no capítulo.
     * Ordenados pelo primeiro versículo em que aparecem.
     */
    places: ChapterPlace[];

    /**
     * Os eventos que aparecem no capítulo.
     * Ordenados pelo primeiro versículo em que aparecem.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * A identificação da pessoa.
     */
    id: string;

    /**
     * O nome da pessoa.
     */
    name: string;

    /**
     * Se o nome da pessoa é um nome próprio.
     */
    isProperName?: boolean;

    /**
     * O gênero da pessoa.
     */
    gender?: string;

    /**
     * O ano em que a pessoa nasceu e o ano em que morreu.
     * Números negativos representam anos a.C. Números positivos representam anos d.C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * O link da API para a pessoa.
     */
    apiLink: string;

    /**
     * Os números dos versículos do capítulo que mencionam a pessoa.
     * Ordenados em ordem crescente.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * A identificação do local.
     */
    id: string;

    /**
     * O nome do lugar.
     */
    name: string;

    /**
     * O tipo de acidente geográfico que o local representa.
     */
    featureType?: string;

    /**
     * A latitude e a longitude do local.
     */
    latitude?: number;
    longitude?: number;

    /**
     * O link da API para o local.
     */
    apiLink: string;

    /**
     * Os números dos versículos do capítulo que mencionam o lugar.
     * Ordenados em ordem crescente.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * O ID do evento.
     */
    id: string;

    /**
     * O nome do evento.
     */
    name: string;

    /**
     * A data em que o evento começou.
     */
    startDate?: string;

    /**
     * O link da API para o evento.
     */
    apiLink: string;

    /**
     * Os números dos versículos do capítulo que descrevem o evento.
     * Ordenados em ordem crescente.
     */
    verses: number[];
}
```

### Exemplo

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

## Listar pessoas em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Obtém a lista de pessoas disponíveis para o conjunto de dados fornecido.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Obtenha a lista de pessoas para o conjunto de dados teográficos.
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

### Estrutura

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * As informações do conjunto de dados são referentes às pessoas.
     */
    dataset: Dataset;

    /**
     * Lista de pessoas disponíveis para o conjunto de dados.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * A identificação da pessoa.
     */
    id: string;

    /**
     * O nome da pessoa.
     */
    name: string;

    /**
     * Se o nome da pessoa é um nome próprio.
     */
    isProperName?: boolean;

    /**
     * O gênero da pessoa.
     */
    gender?: string;

    /**
     * O número de referências bíblicas que mencionam a pessoa.
     */
    numberOfReferences: number;

    /**
     * O link da API para a pessoa.
     */
    thisPersonApiLink: string;
}
```

### Exemplo

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

## Obter uma pessoa de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Obtém informações sobre uma única pessoa, incluindo as referências bíblicas que a mencionam e seus relacionamentos com outras pessoas, lugares, eventos e grupos étnicos.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).
-   `person` o ID da pessoa (ex: `paul_2479` ).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Obtenha informações sobre Paulo a partir do conjunto de dados teográficos.
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

### Estrutura

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Informações do conjunto de dados referentes à pessoa.
     */
    dataset: Dataset;

    /**
     * As informações sobre a pessoa.
     */
    person: DatasetPerson;

    /**
     * O link da API para esta pessoa.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * A identificação da pessoa.
     */
    id: string;

    /**
     * O nome da pessoa.
     */
    name: string;

    /**
     * Outros nomes pelos quais a pessoa é chamada.
     */
    alsoCalled?: string[];

    /**
     * Se o nome da pessoa é um nome próprio.
     */
    isProperName?: boolean;

    /**
     * O gênero da pessoa.
     */
    gender?: string;

    /**
     * A descrição da pessoa. Cada linha de código representa um parágrafo.
     */
    description?: string[];

    /**
     * O ano em que a pessoa nasceu e o ano em que morreu.
     * Números negativos representam anos a.C. Números positivos representam anos d.C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Os anos mais antigos e mais recentes em que a pessoa é mencionada.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * O local onde a pessoa nasceu e morreu.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * As relações familiares da pessoa.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Os grupos étnicos aos quais a pessoa pertence.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Os eventos em que a pessoa participou.
     */
    events?: DatasetEntityRef[];

    /**
     * Lista de referências bíblicas que mencionam a pessoa.
     * Organizado por ordem do livro, capítulo e versículo.
     */
    references: VerseRef[];
}
```

### Exemplo

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

## Listar locais em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Obtém a lista de locais disponíveis para o conjunto de dados fornecido.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).

### Estrutura

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Informações do conjunto de dados referentes aos locais.
     */
    dataset: Dataset;

    /**
     * Lista de locais disponíveis para o conjunto de dados.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * A identificação do local.
     */
    id: string;

    /**
     * O nome do lugar.
     */
    name: string;

    /**
     * O tipo de acidente geográfico que o local representa.
     * Por exemplo, "Cidade", "Região", "Montanha", "Água", etc.
     */
    featureType?: string;

    /**
     * A latitude e a longitude do local.
     */
    latitude?: number;
    longitude?: number;

    /**
     * O número de referências bíblicas que mencionam o local.
     */
    numberOfReferences: number;

    /**
     * O link da API para o local.
     */
    thisPlaceApiLink: string;
}
```

## Obter um local a partir de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Obtém informações sobre um único local, incluindo as referências bíblicas que o mencionam, bem como as pessoas e os eventos relacionados.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).
-   `place` o ID do local (ex: `jerusalem_636` ).

### Estrutura

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Informações do conjunto de dados para o local.
     */
    dataset: Dataset;

    /**
     * Informações sobre o local.
     */
    place: DatasetPlace;

    /**
     * O link da API para este local.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * A identificação do local.
     */
    id: string;

    /**
     * O nome do lugar.
     */
    name: string;

    /**
     * O nome do local, conforme aparece na versão King James e na versão English Standard.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Outros nomes pelos quais o lugar é conhecido.
     */
    aliases?: string[];

    /**
     * O tipo de acidente geográfico que o local representa.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * A latitude e a longitude do local, e qual a sua precisão.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Descrição do local. Cada linha de código representa um parágrafo.
     */
    description?: string[];

    /**
     * O comentário sobre o local, feito pelos autores do conjunto de dados.
     */
    comment?: string;

    /**
     * O lugar raiz deste lugar.
     * Nomes diferentes para o mesmo local geográfico compartilham a mesma origem.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * O lugar do qual este lugar é uma duplicata.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * As pessoas que estiveram naquele lugar, nasceram naquele lugar ou morreram naquele lugar.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Os eventos que aconteceram no local.
     */
    events?: DatasetEntityRef[];

    /**
     * Lista de referências bíblicas que mencionam o local.
     * Organizado por ordem do livro, capítulo e versículo.
     */
    references: VerseRef[];
}
```

### Exemplo

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

## Listar eventos em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Obtém a lista de eventos disponíveis para o conjunto de dados fornecido.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).

### Estrutura

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Informações do conjunto de dados referentes aos eventos.
     */
    dataset: Dataset;

    /**
     * Lista de eventos disponíveis para o conjunto de dados.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * O ID do evento.
     */
    id: string;

    /**
     * O nome do evento.
     */
    name: string;

    /**
     * A data em que o evento começou.
     * Números negativos representam anos a.C. Números positivos representam anos d.C.
     * Datas mais específicas utilizam o formato `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * O número de referências bíblicas que descrevem o evento.
     */
    numberOfReferences: number;

    /**
     * O link da API para o evento.
     */
    thisEventApiLink: string;
}
```

## Obter um evento de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Obtém informações sobre um único evento, incluindo as referências bíblicas que o descrevem e as pessoas, lugares e grupos étnicos relacionados.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).
-   `event` o ID do evento (ex: `saul-is-converted_326` ).

### Estrutura

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Informações do conjunto de dados para o evento.
     */
    dataset: Dataset;

    /**
     * Informações sobre o evento.
     */
    event: DatasetEvent;

    /**
     * O link da API para este evento.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * O ID do evento.
     */
    id: string;

    /**
     * O nome do evento.
     */
    name: string;

    /**
     * A data em que o evento começou.
     */
    startDate?: string;

    /**
     * A duração do evento.
     * Por exemplo, "1D" significa um dia e "40Y" significa quarenta anos.
     */
    duration?: string;

    /**
     * As pessoas que participaram do evento.
     */
    participants?: DatasetEntityRef[];

    /**
     * Os locais onde o evento ocorreu.
     */
    locations?: DatasetEntityRef[];

    /**
     * Os grupos étnicos que participaram do evento.
     */
    groups?: DatasetEntityRef[];

    /**
     * O evento do qual este evento faz parte.
     */
    partOf?: DatasetEntityRef;

    /**
     * O evento que ocorreu antes deste evento.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Lista de referências bíblicas que descrevem o evento.
     * Organizado por ordem do livro, capítulo e versículo.
     */
    references: VerseRef[];
}
```

### Exemplo

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

## Listar grupos de pessoas em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Obtém a lista de grupos de pessoas disponíveis para o conjunto de dados fornecido.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).

### Estrutura

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Informações do conjunto de dados para os grupos de pessoas.
     */
    dataset: Dataset;

    /**
     * Lista dos grupos populacionais disponíveis no conjunto de dados.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * A identificação do grupo étnico.
     */
    id: string;

    /**
     * O nome do grupo étnico.
     */
    name: string;

    /**
     * O número de pessoas que são membros do grupo étnico.
     */
    numberOfMembers: number;

    /**
     * O link da API para o grupo de pessoas.
     */
    thisPeopleGroupApiLink: string;
}
```

## Obter um grupo de pessoas a partir de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Obtém informações sobre um único grupo de pessoas, incluindo seus membros e os eventos em que o grupo participou.

-   `dataset` o ID do conjunto de dados (ex: `theographic` ).
-   `group` o ID do grupo de pessoas (ex: `tribe-of-benjamin` ).

### Estrutura

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Informações do conjunto de dados para o grupo de pessoas.
     */
    dataset: Dataset;

    /**
     * Informações sobre o grupo étnico.
     */
    group: DatasetPeopleGroup;

    /**
     * O link da API para este grupo de pessoas.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * A identificação do grupo étnico.
     */
    id: string;

    /**
     * O nome do grupo étnico.
     */
    name: string;

    /**
     * As pessoas que são membros do grupo étnico.
     */
    members?: DatasetEntityRef[];

    /**
     * Os eventos em que o grupo étnico participou.
     */
    events?: DatasetEntityRef[];

    /**
     * Lista de referências bíblicas que mencionam esse grupo étnico.
     * Organizado por ordem do livro, capítulo e versículo.
     */
    references: VerseRef[];
}
```

### Exemplo

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

## Conjuntos de dados interlineares

O conjunto de dados interlineares bereanos ( `bsb-interlinear` ) lista as palavras originais (hebraico, aramaico e grego) de cada versículo da Bíblia, na ordem em que aparecem no texto original. Cada palavra tem sua transliteração, análise gramatical, [número de Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) e a frase em inglês que a [Bíblia Padrão Bereana](https://berean.bible) usa para ela.

O conjunto de dados utiliza os mesmos pontos de extremidade que outros conjuntos de dados:

-   A lista `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` contém os 66 livros.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (ex: `/api/d/bsb-interlinear/GEN/1.json` ) retorna o capítulo, com `{ verse, words }` para cada versículo. A resposta é um [conjunto de dados capítulo](#get-a-chapter-from-a-dataset) .

Os dados das palavras provêm das [tabelas interlineares da Bíblia Padrão Bereana](https://bereanbible.com/) , que são de domínio público. Os números de Strong para as palavras são consultados no [léxico](#lexicon) ( `stepbible-lexicon` ).

### Estrutura

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * A posição da palavra, baseada em 1, na ordem do texto original.
     * As palavras estão listadas nesta ordem.
     */
    pos: number;

    /**
     * A classificação da palavra, baseada em 1, na ordem em inglês da Bíblia Padrão Bereana.
     */
    bsbPos: number;

    /**
     * A linguagem da palavra.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * A palavra no roteiro original. Normalizada por NFC.
     */
    text: string;

    /**
     * A transliteração da palavra.
     */
    transliteration: string | null;

    /**
     * O código gramatical abreviado da palavra. Ex.: "N-mp" ou "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * A análise gramatical completa da palavra.
     */
    parsingFull: string | null;

    /**
     * O número Strong preenchido com zeros da palavra. Exemplo: "H0430" ou "G3056".
     * Preenchido com zeros à esquerda, o que corresponde aos valores `.words.json` da Bíblia King James.
     * Os valores de outras traduções podem precisar de preenchimento com zeros e remoção de sufixos antes de serem unidos.
     * Nulo quando a fonte não fornece um número de Strong para a palavra (este é o caso de algumas palavras que são sufixos, como sufixos de pronomes).
     */
    strongs: string | null;

    /**
     * A expressão em inglês usada na Bíblia Bereana (Berean Standard Bible) para essa palavra.
     * Nulo quando a BSB deixa a palavra sem tradução (como o marcador de objeto direto em hebraico).
     */
    gloss: string | null;
}
```

### Exemplo

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

### Ligando palavras às traduções

Os valores interlineares `strongs` são preenchidos com zeros à esquerda (ex: `H0430` ). Isso corresponde aos `strongs` valores nas anotações de palavras da KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Os valores de outras traduções podem precisar de preenchimento com zeros à esquerda e remoção de sufixos (ex: `H430` ou `H1961a` para `H0430` e `H1961` ) antes de serem unidos.

-   **KJV.** Para a versão King James ( `eng_kjv` e `eng_kja` ), junte os números de Strong no arquivo `.words.json` de um capítulo com os `strongs` das palavras interlineares do mesmo versículo. Por exemplo, cada número de Strong anotado em `/api/eng_kjv/GEN/1.words.json` para o versículo 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) aparece como um valor `strongs` entre as palavras do versículo 1 em `/api/d/bsb-interlinear/GEN/1.json` .
-   **Bíblia Padrão Bereana.** O `gloss` de cada palavra é a frase da BSB para essa palavra. Percorra as palavras do versículo em `bsbPos` e compare cada `gloss` com o texto do versículo na tradução da BSB para encontrar onde a tradução da palavra se encaixa.

A numeração das duas fontes nem sempre coincide. Por exemplo, a versão King James (KJV) marca "era" com o valor `G2258` , enquanto a tabela bereana marca com o valor `G1510` Algumas junções falham devido a diferenças como essa.

### Atribuição

As tabelas interlineares bereanas são de domínio público. O [léxico](#lexicon) está licenciado sob CC BY 4.0 e requer atribuição.

## Léxico

O conjunto de dados do léxico STEPBible ( `stepbible-lexicon` ) contém os léxicos breves de hebraico, aramaico e grego (TBESH e TBESG) do [STEPBible.org](https://www.stepbible.org/) em Tyndale House, Cambridge. Ele tem uma entrada para cada número Strong base, e cada entrada tem um ou mais sentidos com o lema, transliteração, classe gramatical, glossário em inglês e uma definição.

Qualquer valor `strongs` preenchido com zeros de uma [palavra interlinear](#interlinear-datasets) que possua uma entrada no léxico pode ser consultado em `/api/d/stepbible-lexicon/lexicon/{strongs}.json` sem necessidade de reformatação. O mesmo se aplica aos valores `.words.json` da Bíblia King James; os valores de outras traduções podem necessitar de preenchimento com zeros e remoção de sufixos previamente. As entradas em grego que o léxico adiciona sem um número de Strong não são publicadas.

Os conjuntos de dados que contêm entradas de léxico incluem `listOfLexiconApiLink` e `totalNumberOfLexicon` em sua entrada em `/api/available_datasets.json` .

### Atribuição

Os dados do léxico estão licenciados sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Se você os utilizar, dê crédito a STEPBible.org / Tyndale House, Cambridge, e mencione quaisquer alterações. A propriedade `licenseNotes` do conjunto de dados contém o crédito.

## Listar entradas do léxico em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Obtém a lista de entradas do léxico que estão disponíveis para um conjunto de dados.

-   `dataset` o ID do conjunto de dados (ex: `stepbible-lexicon` ).

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Informações sobre o conjunto de dados do léxico.
     */
    dataset: Dataset;

    /**
     * Lista de entradas do léxico disponíveis para o conjunto de dados.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * O número Strong preenchido com zeros da entrada do léxico. Exemplo: "H0430".
     */
    id: string;

    /**
     * O idioma da entrada do léxico.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * O nome da entrada do léxico.
     * Este é o lema do primeiro sentido da entrada.
     */
    name: string;

    /**
     * O link da API para a entrada do léxico.
     */
    apiLink: string;
}
```

### Exemplo

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

## Obter uma entrada de léxico a partir de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Obtém a entrada do léxico para um único número de Strong básico, com todos os seus significados.

-   `dataset` o ID do conjunto de dados (ex: `stepbible-lexicon` ).
-   `strongs` é o número de Strong preenchido com zeros (por exemplo, `H0430` para a palavra hebraica _elohim_ ou `G3056` para a palavra grega _logos_).

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Informações do conjunto de dados para a entrada do léxico.
     */
    dataset: Dataset;

    /**
     * A entrada do léxico.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * O link da API para esta entrada do léxico.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * O número Strong preenchido com zeros da entrada. Exemplo: "H0430".
     */
    id: string;

    /**
     * O idioma da entrada.
     * Esta é a linguagem do primeiro sentido da entrada.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Os sentidos da entrada, em ordem de identificação.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * O ID estendido do sentido. Ex.: "H0001G".
     * Igual ao número de Strong base quando o número tem um único sentido.
     */
    id: string;

    /**
     * A linguagem do sentido.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * O lema do sentido no texto original.
     */
    lemma: string;

    /**
     * Transliteração do lema.
     */
    transliteration: string | null;

    /**
     * O código gramatical (morfológico) do sentido.
     */
    partOfSpeech: string | null;

    /**
     * Breve definição em inglês do sentido.
     */
    gloss: string | null;

    /**
     * A definição do sentido como texto simples.
     * Os parágrafos são separados por linhas em branco. A formatação no código-fonte foi removida.
     */
    definition: string;
}
```

### Exemplo

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

## Versículo do dia

O conjunto de dados do versículo do dia ( `verse-of-the-day` ) é uma lista selecionada de versículos conhecidos e passagens curtas (no máximo três versículos) que são bons candidatos para um "versículo do dia": mais de 640 para cada dia do ano e mais de 100 para feriados cristãos. Cada um faz sentido por si só.

Cada versículo para cada dia possui de uma a três categorias, da mais relevante para a mais antiga, a partir deste conjunto fixo:

| EU IA         | Descrição                                                              |
| ------------- | ---------------------------------------------------------------------- |
| `comfort`     | A proximidade e o cuidado de Deus na dor, na dificuldade e na solidão. |
| `courage`     | Mantendo-se firme e sem medo.                                          |
| `faith`       | Confiar em Deus e em Suas promessas.                                   |
| `forgiveness` | O perdão de Deus aos pecados e o ato de perdoar os outros.             |
| `gratitude`   | Dando graças a Deus.                                                   |
| `guidance`    | Deus guiando nossos passos, planos e decisões.                         |
| `hope`        | Confiança no futuro que Deus prometeu.                                 |
| `inspiration` | Incentivo para viver a fé e praticar o bem.                            |
| `joy`         | Alegria e júbilo em Deus.                                              |
| `love`        | O amor de Deus por nós e o nosso amor por Deus e pelos outros.         |
| `peace`       | Repouso, tranquilidade e ausência de ansiedade.                        |
| `praise`      | Adoração e declarações da grandeza de Deus.                            |
| `prayer`      | Invocando a Deus e Sua promessa de ouvir.                              |
| `provision`   | Deus nos provê o que precisamos.                                       |
| `salvation`   | Redenção, graça e nova vida em Cristo.                                 |
| `strength`    | Deus dá força e resistência.                                           |
| `wisdom`      | Sabedoria divina e instruções práticas para a vida.                    |

Os feriados têm suas próprias categorias. Em um feriado, o versículo do dia é um dos versículos do feriado, e esses versículos não são usados ​​em outros dias. Um feriado geralmente dura um dia; o feriado "Após o Domingo da Ressurreição" dura os três dias seguintes ao Domingo da Ressurreição, portanto, lista todas as três datas. Cada categoria de feriado tem um `holiday` com suas datas: feriados que ocorrem na mesma data todos os anos têm `month` e `day` , e feriados cuja data muda a cada ano (porque dependem do Domingo da Ressurreição ou do Advento) listam seu `dates` no calendário gregoriano, pré-calculado para o período de 2026 a 2125.

| EU IA                      | Feriado                        | Data                                            |
| -------------------------- | ------------------------------ | ----------------------------------------------- |
| `epiphany`                 | Epifania                       | 6 de janeiro                                    |
| `ash-wednesday`            | Quarta-feira de Cinzas         | 46 dias antes do Domingo da Ressurreição        |
| `palm-sunday`              | Domingo de Ramos               | O domingo anterior ao Domingo da Ressurreição   |
| `maundy-thursday`          | Quinta-feira Santa             | A quinta-feira antes do Domingo da Ressurreição |
| `good-friday`              | Sexta-feira Santa              | A sexta-feira antes do Domingo da Ressurreição  |
| `resurrection-sunday`      | Domingo da Ressurreição        | Domingo de Páscoa                               |
| `post-resurrection-sunday` | Após o Domingo da Ressurreição | Os três dias após o Domingo da Ressurreição     |
| `ascension-day`            | Dia da Ascensão                | 39 dias após o Domingo da Ressurreição          |
| `pentecost`                | Pentecost                      | 49 dias após o Domingo da Ressurreição          |
| `all-hallows-eve`          | Véspera de Todos os Santos     | 31 de outubro                                   |
| `all-saints-day`           | Dia de Todos os Santos         | 1º de novembro                                  |
| `advent-sunday`            | Primeiro domingo do Advento    | O quarto domingo antes do Natal                 |
| `christmas-eve`            | Noite de Natal                 | 24 de dezembro                                  |
| `christmas`                | Natal                          | 25 de dezembro                                  |

O conjunto de dados contém apenas referências, não o texto dos versículos, portanto funciona com qualquer tradução. A numeração dos versículos segue o padrão da numeração inglesa (o mesmo da BSB). Os dados podem ser lidos de três maneiras:

-   O [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) lista todos os versículos do conjunto de dados com suas categorias e os feriados com suas respectivas datas, em um único arquivo.
-   A opção [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) lista todos os versículos de uma categoria. Esta é a maneira mais fácil de escolher um versículo do dia em uma categoria.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) lista os candidatos em um capítulo, com suas respectivas categorias. Somente os capítulos que contêm um candidato estão disponíveis; use os links dos capítulos do livro ou `/api/d/verse-of-the-day/books.json` para encontrá-los.

Os conjuntos de dados que contêm categorias de versos incluem `listOfVersesApiLink` , `listOfCategoriesApiLink` e `totalNumberOfCategories` em sua entrada em `/api/available_datasets.json` .

### Escolhendo um versículo do dia

A API é composta por arquivos estáticos, portanto, ela não escolhe um versículo automaticamente. Em vez disso, existe uma convenção para a seleção, de modo que todos os aplicativos que a seguem exibam o mesmo versículo no mesmo dia. Os aplicativos têm liberdade para escolher versículos diferentes; a convenção apenas fornece um padrão compartilhado.

A convenção seleciona versículos e feriados a partir de `/api/d/verse-of-the-day/verses.json` Em um feriado, escolhe um dos versículos do feriado, percorrendo-os um ano de cada vez, de modo que um feriado tenha um versículo diferente a cada ano até que todos os seus versículos tenham sido usados. Nos outros dias, cada ano recebe sua própria mistura dos versículos em uso naquele ano (ordenados por um hash da referência de cada versículo, o ano e uma semente opcional), e o versículo do dia é aquele correspondente ao dia do ano nessa mistura. O conjunto de dados tem mais de 366 versículos para cada dia em uso a cada ano, portanto, um versículo nunca se repete dentro de um ano civil, a ordem muda a cada ano e a mesma data sempre resulta no mesmo versículo. Novos versículos são adicionados (com `addedIn` ) e antigos removidos (com `removedIn` ) apenas de um ano que ainda não começou, portanto, o versículo do dia para uma data passada nunca muda.

A página [da Convenção do Versículo do Dia](./verse-of-the-day-convention.md) especifica o algoritmo passo a passo, com pseudocódigo e valores de teste, para que você possa implementá-lo em qualquer linguagem.

Para usar sua própria ordem, escolha uma semente (por exemplo, o nome do seu aplicativo): isso gera uma ordem aleatória diferente, mas com as mesmas garantias. Você também pode escolher versos de uma única categoria, mas cada categoria tem menos versos do que dias em um ano, então seus versos se repetem com mais frequência.

Os SDKs seguem a seguinte convenção:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Uma data no formato AAAA-MM-DD ou uma data (utilizando o calendário local). O padrão é a data de hoje.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Obtenha o texto do versículo a partir de uma tradução.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` baixa a lista de versículos e escolhe um deles. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` escolhe um versículo de uma lista que você já possui.
-   O SDK do Kotlin possui os métodos `getVerseOfTheDay(date?, seed?, category?)` e `pickVerseOfTheDay(verses, date?, seed?, category?)` , que recebem a data como uma string `YYYY-MM-DD` bits.
-   O SDK Swift possui os métodos `getVerseOfTheDay(date:seed:category:)` e `pickVerseOfTheDay(_:date:seed:category:holidays:)` , que recebem a data como uma string `YYYY-MM-DD` caracteres ou `Date` (sendo utilizada a data do calendário no fuso horário atual).
-   O [servidor MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) possui `getVerseOfTheDay` ferramenta que retorna o versículo do dia com seu texto.
-   O pacote `@helloao/tools` tem a mesma lista e uma função `getVerseOfTheDay(date?, { seed?, category? }?)` em `@helloao/tools/generation/verse-of-the-day.js` .

### Licença

A lista foi compilada pelo AO Lab e é distribuída sob a [Licença MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . O texto dos versos provém da tradução da qual você o obteve.

## Listar versículos em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Obtém todos os versículos (ou trechos curtos) em um conjunto de dados, com as categorias às quais cada um pertence, em ordem canônica. Disponível apenas para conjuntos de dados cujos versículos possuem categorias, como `verse-of-the-day` .

-   `dataset` o ID do conjunto de dados (ex: `verse-of-the-day` ).

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Informações do conjunto de dados para os versículos.
     */
    dataset: Dataset;

    /**
     * Todos os versículos (ou pequenas passagens) do conjunto de dados, com suas respectivas categorias, em ordem canônica.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Os feriados que têm seus próprios versículos, com suas datas.
     * Omitido se o conjunto de dados não contiver feriados.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * O ID da categoria do feriado. Ex.: "Natal".
     */
    id: string;

    /**
     * O nome em inglês do feriado. Ex.: "Christmas".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * O mês (1 para janeiro) e o dia de um feriado que cai na mesma data todos os anos.
     * Omitido para feriados cuja data muda todos os anos.
     */
    month?: number;
    day?: number;

    /**
     * As datas (AAAA-MM-DD, calendário gregoriano) de um feriado cuja data muda todos os anos, em ordem.
     * Elas são pré-calculadas para um intervalo de anos (atualmente de 2026 a 2125), e o feriado é comemorado apenas nas datas listadas.
     * Exclui-se os feriados que ocorrem na mesma data todos os anos.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * O ID do livro. Ex.: "PRO".
     */
    book: string;

    /**
     * O número do capítulo.
     */
    chapter: number;

    /**
     * O número do versículo.
     * Se `endVerse` estiver presente, então este é o versículo em que a passagem começa.
     */
    verse: number;

    /**
     * O versículo em que a passagem termina.
     * Omitido se a entrada for um único verso.
     */
    endVerse?: number;

    /**
     * Os IDs das categorias às quais o verso pertence, da mais relevante para a menos relevante.
     */
    categories: string[];

    /**
     * O primeiro ano em que o versículo pode ser o versículo do dia.
     * Omitido se o versículo sempre esteve na lista.
     */
    addedIn?: number;

    /**
     * O primeiro ano em que o versículo não pode mais ser o versículo do dia.
     * Os versículos removidos permanecem no conjunto de dados para que os versículos de anos anteriores ainda possam ser selecionados.
     * Omitido se o versículo não tiver sido removido da lista.
     */
    removedIn?: number;
}
```

### Exemplo

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

## Listar categorias em um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Obtém a lista de categorias de versículos disponíveis para um conjunto de dados.

-   `dataset` o ID do conjunto de dados (ex: `verse-of-the-day` ).

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Informações do conjunto de dados para as categorias.
     */
    dataset: Dataset;

    /**
     * Lista das categorias de versículos disponíveis no conjunto de dados.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * O ID da categoria. Exemplo: "esperança".
     */
    id: string;

    /**
     * O nome em inglês da categoria. Ex.: "Hope".
     */
    name: string;

    /**
     * Descrição do conteúdo dos versículos da categoria.
     */
    description: string;

    /**
     * O número de versículos (ou pequenas passagens) que pertencem à categoria.
     */
    numberOfVerses: number;

    /**
     * As datas do feriado ao qual a categoria se refere (veja DatasetCategoryHoliday acima).
     * Omitido para categorias que não sejam relacionadas a feriados.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * O link da API para a categoria.
     */
    apiLink: string;
}
```

### Exemplo

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

## Obter uma categoria de um conjunto de dados

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Obtém uma única categoria de versos, com todos os versos que pertencem a ela.

-   `dataset` o ID do conjunto de dados (ex: `verse-of-the-day` ).
-   `category` é o ID da categoria (ex: `hope` ).

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Informações do conjunto de dados para a categoria.
     */
    dataset: Dataset;

    /**
     * A categoria, com os versículos que a ela pertencem.
     */
    category: DatasetCategory;

    /**
     * O link da API para esta categoria.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * O ID da categoria. Exemplo: "esperança".
     */
    id: string;

    /**
     * O nome em inglês da categoria. Ex.: "Hope".
     */
    name: string;

    /**
     * Descrição do conteúdo dos versículos da categoria.
     */
    description: string;

    /**
     * As datas do feriado ao qual a categoria se refere (consulte DatasetCategoryHoliday em "Listar Versos em um Conjunto de Dados").
     * Nessas datas, o versículo do dia é um dos versículos da categoria, e eles não são usados ​​em outros dias.
     * Omitido para categorias que não sejam relacionadas a feriados.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Os versículos (ou pequenas passagens) que pertencem à categoria, em ordem canônica.
     * Inclui versículos que foram removidos da lista (ver `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * O ID do livro. Ex.: "JER".
     */
    book: string;

    /**
     * O número do capítulo.
     */
    chapter: number;

    /**
     * O número do versículo.
     * Se `endVerse` estiver presente, então este é o versículo em que a passagem começa.
     */
    verse: number;

    /**
     * O versículo em que a passagem termina.
     * Omitido se a referência for um único versículo.
     */
    endVerse?: number;

    /**
     * O primeiro ano em que o versículo pode ser o versículo do dia.
     * Omitido se o versículo sempre esteve na lista.
     */
    addedIn?: number;

    /**
     * O primeiro ano em que o versículo não pode mais ser o versículo do dia.
     * Os versículos removidos permanecem no conjunto de dados para que os versículos de anos anteriores ainda possam ser selecionados.
     * Omitido se o versículo não tiver sido removido da lista.
     */
    removedIn?: number;
}
```

### Exemplo

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
