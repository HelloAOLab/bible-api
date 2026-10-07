# Ukuhumusha, Izincwadi, kanye Nezahluko

Ama-Endpoints okuphequlula izinguqulo, ukufaka ohlwini izincwadi zabo, nokulanda okuqukethwe kwezahluko.

Okuqukethwe kwezahluko, ukulandwa kokuhumusha okuphelele, kanye nezichasiselo ezingeni lamagama kuyatholakala ngamafomethi amabili:

-   [**Ifomethi ejwayelekile**](./standard.md) - ifomethi yokuqala nehlelekile. Okuqukethwe yivesi uhlu lwezingcezu (umbhalo ocacile, umbhalo ohlelekile, izinkomba zaphansi, njll.) ozihlanganisa wena.
-   [**Ifomethi elula**](./simplified.md) - ifomethi eyisicaba lapho okuqukethwe yivesi ngalinye kuyintambo eyodwa, enemibhalo yaphansi, izinkondlo, kanye nezinye izimpawu ezivezwe njengeziphazamiso kuleyo ntambo.

Sebenzisa noma iyiphi ifomethi efanelana kahle nendlela ohlela ukudweba noma ukucubungula ngayo umbhalo.

## Ukuhumusha Okutholakalayo

`GET https://bible.helloao.org/api/available_translations.json`

Ithola uhlu lwezinguqulo ezitholakalayo ku-API.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

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

### Isakhiwo

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Uhlu lwezinguqulo.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * I-ID yokuhumusha.
     */
    id: string;

    /**
     * Igama lokuhumusha.
     * Leli ngokuvamile igama lokuhumusha olimini lokuhumusha.
     */
    name: string;

    /**
     * Igama lesiNgisi lokuhumusha.
     */
    englishName: string;

    /**
     * Iwebhusayithi yokuhumusha.
     */
    website: string;

    /**
     * I-URL lapho ilayisensi yokuhumusha ingatholakala khona.
     */
    licenseUrl: string;

    /**
     * Igama elifushane lokuhumusha.
     */
    shortName: string;

    /**
     * Ithegi yolimi lwezinhlamvu ezintathu ye-ISO 639 lapho ukuhumusha kutholakala khona ngokuyinhloko.
     */
    language: string;

    /**
     * Uthola igama lolimi okuhunyushwe ngalo.
     * Akunamsebenzi noma akuchaziwe uma igama lolimi lingaziwa.
     */
    languageName?: string;

    /**
     * Uthola igama lolimi ngesiNgisi.
     * Akunamsebenzi noma akuchaziwe uma ulimi lungenalo igama lesiNgisi.
     */
    languageEnglishName?: string;

    /**
     * Isiqondiso ulimi olubhalwe ngaso.
     * "ltr" ikhombisa ukuthi umbhalo ubhalwe kusukela ohlangothini lwesobunxele lwekhasi kuya kwesokudla.
     * "rtl" ikhombisa ukuthi umbhalo ubhalwe kusukela kwesokudla sekhasi kuya kwesobunxele.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Uhlu olutholakalayo lwamafomethi.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Isixhumanisi se-API sohlu lwezincwadi ezitholakalayo zalolu humusho.
     */
    listOfBooksApiLink: string;

    /**
     * Inani lezincwadi eziqukethwe kule nguqulo.
     *
     * Izinguqulo eziphelele kufanele zibe nenani elifanayo lezincwadi njengeBhayibheli (66).
     */
    numberOfBooks: number;

    /**
     * Inani eliphelele lezahluko eziqukethwe kule nguqulo.
     *
     * Izinguqulo eziphelele kufanele zibe nenani elifanayo lezahluko njengeBhayibheli (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * Inani eliphelele lamavesi aqukethwe kule nguqulo.
     *
     * Izinguqulo eziphelele kufanele zibe nenani elifanayo lamavesi njengeBhayibheli (cishe angu-31,102 - ezinye izinguqulo azifaki amavesi ngokusekelwe ekutheni kungenzeka yini ukuthi akhona emibhalweni yokuqala).
     */
    totalNumberOfVerses: number;

    /**
     * Inani eliphelele lezincwadi ze-apocrypha eziqukethwe kule nguqulo.
     * Kushiywe uma ukuhumusha kungafaki i-apocrypha.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Inani eliphelele lezahluko ze-apocrypha eziqukethwe kule nguqulo.
     * Kushiywe uma ukuhumusha kungafaki i-apocrypha.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * inani eliphelele lamavesi e-apocrypha aqukethwe kule nguqulo.
     * Kushiywe uma ukuhumusha kungafaki i-apocrypha.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Isibonelo

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

## Bhala Izincwadi Ezihunyushweni

`GET https://bible.helloao.org/api/{translation}/books.json`

Uthola uhlu lwezincwadi ezitholakalayo zokuhumusha okunikeziwe.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Thola uhlu lwezincwadi zokuhumusha i-BSB
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

### Isakhiwo

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Ulwazi lokuhumusha lwezincwadi.
     */
    translation: Translation;

    /**
     * Uhlu lwezincwadi ezitholakalayo zokuhumusha.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * I-ID yencwadi.
     */
    id: string;

    /**
     * Igama elinikezwe yinguqulo yale ncwadi.
     */
    name: string;

    /**
     * Igama elivamile lencwadi.
     */
    commonName: string;

    /**
     * Isihloko sencwadi.
     * Lokhu ngokuvamile kuyinguqulo echazayo kakhulu yegama lencwadi.
     * Uma ingatholakali, khona-ke enye ayizange inikezwe yinguqulo.
     */
    title: string | null;

    /**
     * Ukuhleleka kwezinombolo kwencwadi ekuhunyushweni.
     */
    order: number;

    /**
     * Inani lezahluko eziqukethwe yile ncwadi.
     */
    numberOfChapters: number;

    /**
     * Inombolo yesahluko sokuqala encwadini.
     */
    firstChapterNumber: number;

    /**
     * Isixhumanisi sesahluko sokuqala sencwadi.
     */
    firstChapterApiLink: string;

    /**
     * Inombolo yesahluko sokugcina encwadini.
     */
    lastChapterNumber: number;

    /**
     * Isixhumanisi sesahluko sokugcina sencwadi.
     */
    lastChapterApiLink: string;

    /**
     * Inani lamavesi aqukethwe yile ncwadi.
     */
    totalNumberOfVerses: number;

    /**
     * Ukuthi incwadi iyincwadi engaphikiswanga yini.
     * Kushiywe ngaphandle uma ukuhumusha kungokomthetho.
     */
    isApocryphal?: boolean;
}
```

### Isibonelo

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
