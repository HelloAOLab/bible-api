# Conjuntos de dados

Pontos de extremidade para navegar em conjuntos de dados bíblicos suplementares - como referências cruzadas e entidades bíblicas (pessoas, lugares, eventos e grupos de pessoas) - e obter seus livros, conteúdo dos capítulos e entidades.

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
     */
    totalNumberOfReferences: number;

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

Para conjuntos de dados de referência cruzada (como `open-cross-ref` ), o capítulo contém a lista de referências cruzadas para cada versículo. Para conjuntos de dados de entidades (como `theographic` ), o capítulo contém as pessoas, os lugares e os eventos que aparecem no capítulo - veja [Obter as Entidades em um Capítulo](#get-the-entities-in-a-chapter) .

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

interface DatasetVerse {
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
