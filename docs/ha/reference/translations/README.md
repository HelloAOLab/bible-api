# Fassara, Littattafai, & Babi-babi

Maƙallan ƙarshe don bincika fassarorin, jera littattafansu, da kuma ɗaukar abubuwan da ke cikin babi.

Abubuwan da ke cikin babi, sauke cikakken fassarar, da kuma bayanin da ke cikin matakin kalmomi kowannensu yana samuwa a cikin tsari biyu:

-   [**Tsarin da aka saba**](./standard.md) - tsarin asali, tsari mai tsari. Abubuwan da ke cikin baiti jerin guntu ne (rubutu mai sauƙi, rubutu mai tsari, nassoshi na ƙasa, da sauransu) da kuka haɗa kanku.
-   [**Tsarin Sauƙi**](./simplified.md) - tsari mai faɗi inda abubuwan da ke cikin kowace baiti suka kasance igiya ɗaya, tare da ƙananan bayanai, waƙoƙi, da sauran alamomi da aka bayyana a matsayin abubuwan da suka dace a cikin wannan zaren.

Yi amfani da duk wani tsari da ya fi dacewa da yadda kake shirin yin rubutu ko sarrafa shi.

## Fassarorin da ake da su

`GET https://bible.helloao.org/api/available_translations.json`

Yana samun jerin fassarorin da ake da su a cikin API.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

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

### Tsarin gini

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Jerin fassarorin.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * ID na fassarar.
     */
    id: string;

    /**
     * Sunan fassarar.
     * Wannan yawanci shine sunan fassarar a cikin harshen fassarar.
     */
    name: string;

    /**
     * Sunan fassarar Turanci.
     */
    englishName: string;

    /**
     * Shafin yanar gizo na fassarar.
     */
    website: string;

    /**
     * Ana iya samun URL ɗin da lasisin fassarar zai iya samu.
     */
    licenseUrl: string;

    /**
     * Gajeren sunan fassarar.
     */
    shortName: string;

    /**
     * Alamar harshen ISO 639 mai haruffa 3 da fassarar ta fi yawa.
     */
    language: string;

    /**
     * Yana samun sunan harshen da fassarar take ciki.
     * Ba a san ko an bayyana sunan harshen ba.
     */
    languageName?: string;

    /**
     * Yana samun sunan harshen a cikin Turanci.
     * Ba a fayyace ko ba a fayyace ba idan harshen ba shi da sunan Turanci.
     */
    languageEnglishName?: string;

    /**
     * Alkiblar da aka rubuta harshen a ciki.
     * "ltr" yana nuna cewa an rubuta rubutun daga gefen hagu na shafin zuwa dama.
     * "rtl" yana nuna cewa an rubuta rubutun daga gefen dama na shafin zuwa hagu.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Jerin tsare-tsare da ake da su.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Hanyar API don jerin littattafan da ake da su don wannan fassarar.
     */
    listOfBooksApiLink: string;

    /**
     * Adadin littattafan da ke cikin wannan fassarar.
     *
     * Cikakkun fassarori ya kamata su kasance daidai da adadin littattafai na Littafi Mai Tsarki (66).
     */
    numberOfBooks: number;

    /**
     * Jimillar surori da ke cikin wannan fassarar.
     *
     * Cikakkun fassarori ya kamata su kasance daidai da adadin surori na Littafi Mai Tsarki (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * Jimillar ayoyin da ke cikin wannan fassarar.
     *
     * Cikakkun fassarori yakamata su kasance daidai da adadin ayoyi kamar na Littafi Mai Tsarki (kusan 31,102 - wasu fassarori ba su haɗa da ayoyi bisa ga yuwuwar kasancewarsu a cikin rubutun asali ba).
     */
    totalNumberOfVerses: number;

    /**
     * Jimillar littattafan apocrypha da ke cikin wannan fassarar.
     * An yi watsi da fassarar idan fassarar ba ta haɗa da apocrypha ba.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Jimillar surori na apocrypha da ke cikin wannan fassarar.
     * An yi watsi da fassarar idan fassarar ba ta haɗa da apocrypha ba.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * jimillar ayoyin apokrifa da ke cikin wannan fassarar.
     * An yi watsi da fassarar idan fassarar ba ta haɗa da apocrypha ba.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Misali

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

## Jera Littattafai a Fassara

`GET https://bible.helloao.org/api/{translation}/books.json`

Yana samun jerin littattafan da ake da su don fassarar da aka bayar.

-   `translation` shine ID na fassarar (misali `BSB` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Nemi jerin littattafan fassarar BSB
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

### Tsarin gini

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Bayanin fassara ga littattafan.
     */
    translation: Translation;

    /**
     * Jerin littattafan da ake da su don fassara.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * ID na littafin.
     */
    id: string;

    /**
     * Sunan da fassarar ta bayar ga littafin.
     */
    name: string;

    /**
     * Sunan da aka saba amfani da shi a littafin.
     */
    commonName: string;

    /**
     * Sunan littafin.
     * Wannan yawanci sigar da ta fi bayyana sunan littafin ce.
     * Idan babu, to fassarar ba ta bayar da ɗaya ba.
     */
    title: string | null;

    /**
     * Tsarin lambobi na littafin a cikin fassarar.
     */
    order: number;

    /**
     * Adadin surori da littafin ya ƙunsa.
     */
    numberOfChapters: number;

    /**
     * Adadin babi na farko a cikin littafin.
     */
    firstChapterNumber: number;

    /**
     * Hanyar haɗi zuwa babi na farko na littafin.
     */
    firstChapterApiLink: string;

    /**
     * Adadin babi na ƙarshe a cikin littafin.
     */
    lastChapterNumber: number;

    /**
     * Hanyar haɗi zuwa babi na ƙarshe na littafin.
     */
    lastChapterApiLink: string;

    /**
     * Adadin ayoyin da littafin ya kunsa.
     */
    totalNumberOfVerses: number;

    /**
     * Ko littafin littafin apokrifa ne?
     * An yi watsi da fassarar idan fassarar ta kasance ta canonical.
     */
    isApocryphal?: boolean;
}
```

### Misali

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
