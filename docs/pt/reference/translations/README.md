# Traduções, livros e capítulos

Pontos de extremidade para navegar pelas traduções, listar seus livros e obter o conteúdo dos capítulos.

O conteúdo dos capítulos, os downloads da tradução completa e as anotações em nível de palavra estão disponíveis em dois formatos:

-   [**Formato padrão**](./standard.md) - o formato original e estruturado. O conteúdo do verso é uma lista de elementos (texto simples, texto formatado, referências em notas de rodapé, etc.) que você mesmo compila.
-   [**Formato simplificado**](./simplified.md) - um formato plano onde o conteúdo de cada verso é uma única sequência de caracteres, com notas de rodapé, poesia e outras marcações expressas como deslocamentos dentro dessa sequência.

Use o formato que melhor se adapte à maneira como você planeja renderizar ou processar o texto.

## Traduções disponíveis

`GET https://bible.helloao.org/api/available_translations.json`

Obtém a lista de traduções disponíveis na API.

### Exemplo de código

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

### Estrutura

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * A lista de traduções.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * O ID da tradução.
     */
    id: string;

    /**
     * O nome da tradução.
     * Normalmente, esse é o nome da tradução no idioma original.
     */
    name: string;

    /**
     * O nome em inglês da tradução.
     */
    englishName: string;

    /**
     * O site para a tradução.
     */
    website: string;

    /**
     * O endereço URL onde se encontra a licença da tradução.
     */
    licenseUrl: string;

    /**
     * Notas adicionais da API referentes à licença.
     * Nulo ou indefinido se não houver anotações.
     */
    licenseNotes?: string | null;

    /**
     * O aviso que deve ser exibido ao mostrar o conteúdo da tradução.
     * Nulo ou indefinido se a tradução não tiver um aviso.
     */
    licenseNotice?: string | null;

    /**
     * Os termos de licença estruturados que foram detectados para a tradução.
     * Nulo ou indefinido se os termos não puderam ser determinados.
     * Nesse caso, consulte os termos na página em licenseUrl.
     */
    license?: License | null;

    /**
     * Nome abreviado da tradução.
     */
    shortName: string;

    /**
     * A etiqueta de idioma ISO 639 de 3 letras na qual a tradução se encontra principalmente.
     */
    language: string;

    /**
     * Obtém o nome do idioma em que a tradução está sendo feita.
     * Nulo ou indefinido se o nome do idioma for desconhecido.
     */
    languageName?: string;

    /**
     * Obtém o nome do idioma em inglês.
     * Nulo ou indefinido se o idioma não tiver um nome em inglês.
     */
    languageEnglishName?: string;

    /**
     * A direção em que a língua é escrita.
     * "ltr" indica que o texto é escrito da esquerda para a direita na página.
     * "rtl" indica que o texto é escrito da direita para a esquerda na página.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Lista de formatos disponíveis.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * O link da API para a lista de livros disponíveis para esta tradução.
     */
    listOfBooksApiLink: string;

    /**
     * O número de livros contidos nesta tradução.
     *
     * As traduções completas devem ter o mesmo número de livros que a Bíblia (66).
     */
    numberOfBooks: number;

    /**
     * O número total de capítulos contidos nesta tradução.
     *
     * As traduções completas devem ter o mesmo número de capítulos que a Bíblia (1.189).
     */
    totalNumberOfChapters: number;

    /**
     * O número total de versículos contidos nesta tradução.
     *
     * As traduções completas devem ter o mesmo número de versículos que a Bíblia (cerca de 31.102 - algumas traduções excluem versículos com base na aparente probabilidade de existirem nos textos originais).
     */
    totalNumberOfVerses: number;

    /**
     * O número total de livros apócrifos contidos nesta tradução.
     * Omitido se a tradução não incluir apócrifos.
     */
    numberOfApocryphalBooks?: number;

    /**
     * O número total de capítulos apócrifos contidos nesta tradução.
     * Omitido se a tradução não incluir apócrifos.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * o número total de versículos apócrifos contidos nesta tradução.
     * Omitido se a tradução não incluir apócrifos.
     */
    totalNumberOfApocryphalVerses?: number;
}

/**
 * Define os termos de licença estruturados que foram detectados para uma tradução.
 */
interface License {
    /**
     * É necessário atribuir a citação à fonte original ao usar a tradução?
     */
    attribution: 'required' | 'not-required';

    /**
     * É permitido o uso comercial da tradução?
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * É permitido criar e distribuir obras derivadas da tradução?
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * Se as obras derivadas devem ser distribuídas sob a mesma licença (ou seja, um requisito de "compartilhar pela mesma licença").
     */
    copyleft: boolean;

    /**
     * Se a tradução foi disponibilizada em domínio público.
     */
    publicDomain: boolean;
}
```

### Licenças

Cada tradução é publicada sob sua própria licença, portanto, verifique os termos da tradução antes de usá-la.

-   O link `licenseUrl` sempre direciona para os termos completos da licença.
-   `licenseNotice` , quando presente, é o aviso de direitos autorais ou de atribuição a ser exibido junto ao conteúdo da tradução.
-   O campo `licenseNotes` contém notas adicionadas pela API, como alterações feitas no texto original.
-   O parâmetro `license` , quando presente, resume os termos em um formato que seu código pode verificar. Por exemplo, você pode filtrar a lista para incluir apenas traduções que permitam uso comercial:

```ts:no-line-numbers title="commercial-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(({ translations }) => {
        const commercial = translations.filter(
            t => t.license?.commercialUse === 'allowed'
        );
        console.log('Translations that allow commercial use:', commercial);
    });
```

O `license` só é definido quando os termos puderam ser detectados automaticamente. Traduções sem esse valor ainda podem ser permitidas para uso, portanto, consulte a página `licenseUrl` para obter mais informações.

### Exemplo

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

## Lista de livros traduzidos

`GET https://bible.helloao.org/api/{translation}/books.json`

Obtém a lista de livros disponíveis para a tradução especificada.

-   `translation` é o ID da tradução (ex: `BSB` ).

### Exemplo de código

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Obtenha a lista de livros para a tradução BSB.
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

### Estrutura

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Informações sobre a tradução dos livros.
     */
    translation: Translation;

    /**
     * Lista de livros disponíveis para tradução.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * A identificação do livro.
     */
    id: string;

    /**
     * O nome que a tradução deu ao livro.
     */
    name: string;

    /**
     * Nome comum do livro.
     */
    commonName: string;

    /**
     * O nome abreviado (ou sigla) que a tradução forneceu para o livro.
     * Caso não esteja disponível, significa que a tradução não forneceu nenhuma.
     */
    shortName?: string;

    /**
     * O título do livro.
     * Essa geralmente é uma versão mais descritiva do nome do livro.
     * Caso não esteja disponível, significa que a tradução não forneceu nenhuma.
     */
    title: string | null;

    /**
     * A ordem numérica do livro na tradução.
     */
    order: number;

    /**
     * O número de capítulos que o livro contém.
     */
    numberOfChapters: number;

    /**
     * O número do primeiro capítulo do livro.
     */
    firstChapterNumber: number;

    /**
     * O link para o primeiro capítulo do livro.
     */
    firstChapterApiLink: string;

    /**
     * O número do último capítulo do livro.
     */
    lastChapterNumber: number;

    /**
     * O link para o último capítulo do livro.
     */
    lastChapterApiLink: string;

    /**
     * O número de versículos que o livro contém.
     */
    totalNumberOfVerses: number;

    /**
     * Se o livro é apócrifo ou não.
     * Omitido se a tradução for canônica.
     */
    isApocryphal?: boolean;
}
```

### Exemplo

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
            "shortName": "Gen",
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
