# Tafsiri, Vitabu, na Sura

Sehemu za mwisho za kuvinjari tafsiri, kuorodhesha vitabu vyao, na kutafuta maudhui ya sura.

Maudhui ya sura, vipakuliwa vya tafsiri kamili, na maelezo ya kiwango cha maneno yanapatikana katika miundo miwili:

-   [**Muundo wa kawaida**](./standard.md) - muundo asilia na uliopangwa. Maudhui ya mistari ni orodha ya vipande (maandishi wazi, maandishi yaliyopangwa, marejeleo ya tanbihi, n.k.) ambavyo unavikusanya mwenyewe.
-   [**Muundo uliorahisishwa**](./simplified.md) - muundo uliobanwa ambapo maudhui ya kila mstari ni mfuatano mmoja, huku tanbihi, ushairi, na alama zingine zikionyeshwa kama marekebisho katika mfuatano huo.

Tumia umbizo lolote linalofaa zaidi jinsi unavyopanga kutoa au kusindika maandishi.

## Tafsiri Zinazopatikana

`GET https://bible.helloao.org/api/available_translations.json`

Hupata orodha ya tafsiri zinazopatikana katika API.

### Mfano wa Msimbo

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

### Muundo

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Orodha ya tafsiri.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * Kitambulisho cha tafsiri.
     */
    id: string;

    /**
     * Jina la tafsiri.
     * Kwa kawaida hili ndilo jina la tafsiri katika lugha ya tafsiri.
     */
    name: string;

    /**
     * Jina la tafsiri ya Kiingereza.
     */
    englishName: string;

    /**
     * Tovuti ya tafsiri.
     */
    website: string;

    /**
     * URL ambayo leseni ya tafsiri inaweza kupatikana.
     */
    licenseUrl: string;

    /**
     * Jina fupi la tafsiri.
     */
    shortName: string;

    /**
     * Lebo ya lugha ya ISO 639 yenye herufi 3 ambayo tafsiri hiyo inapatikana hasa.
     */
    language: string;

    /**
     * Hupata jina la lugha ambayo tafsiri ipo.
     * Haifafanuliwa au haijafafanuliwa ikiwa jina la lugha halijulikani.
     */
    languageName?: string;

    /**
     * Anapata jina la lugha hiyo kwa Kiingereza.
     * Haijafafanuliwa au haijafafanuliwa ikiwa lugha haina jina la Kiingereza.
     */
    languageEnglishName?: string;

    /**
     * Mwelekeo ambao lugha imeandikwa.
     * "ltr" inaonyesha kwamba maandishi yameandikwa kutoka upande wa kushoto wa ukurasa kwenda kulia.
     * "rtl" inaonyesha kwamba maandishi yameandikwa kutoka upande wa kulia wa ukurasa kwenda kushoto.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Orodha inayopatikana ya miundo.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Kiungo cha API cha orodha ya vitabu vinavyopatikana kwa tafsiri hii.
     */
    listOfBooksApiLink: string;

    /**
     * Idadi ya vitabu vilivyomo katika tafsiri hii.
     *
     * Tafsiri kamili zinapaswa kuwa na idadi sawa ya vitabu kama Biblia (66).
     */
    numberOfBooks: number;

    /**
     * Jumla ya idadi ya sura zilizomo katika tafsiri hii.
     *
     * Tafsiri kamili zinapaswa kuwa na idadi sawa ya sura na Biblia (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * Jumla ya mistari iliyomo katika tafsiri hii.
     *
     * Tafsiri kamili zinapaswa kuwa na idadi sawa ya mistari kama Biblia (karibu 31,102 - baadhi ya tafsiri huondoa mistari kulingana na uwezekano wa kuwepo katika maandishi asilia ya asili).
     */
    totalNumberOfVerses: number;

    /**
     * Jumla ya vitabu vya apokrifa vilivyomo katika tafsiri hii.
     * Imeachwa ikiwa tafsiri haijumuishi apokrifa.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Jumla ya sura za apokrifa zilizomo katika tafsiri hii.
     * Imeachwa ikiwa tafsiri haijumuishi apokrifa.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * jumla ya mistari ya apokrifa iliyomo katika tafsiri hii.
     * Imeachwa ikiwa tafsiri haijumuishi apokrifa.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Mfano

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

## Orodhesha Vitabu katika Tafsiri

`GET https://bible.helloao.org/api/{translation}/books.json`

Hupata orodha ya vitabu vinavyopatikana kwa tafsiri iliyotolewa.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Pata orodha ya vitabu vya tafsiri ya BSB
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

### Muundo

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Taarifa za tafsiri ya vitabu.
     */
    translation: Translation;

    /**
     * Orodha ya vitabu vinavyopatikana kwa ajili ya tafsiri.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * Kitambulisho cha kitabu.
     */
    id: string;

    /**
     * Jina ambalo tafsiri hiyo ilitoa kwa ajili ya kitabu hicho.
     */
    name: string;

    /**
     * Jina la kawaida la kitabu.
     */
    commonName: string;

    /**
     * Kichwa cha kitabu.
     * Kwa kawaida hii ni toleo linaloelezea zaidi jina la kitabu.
     * Kama haipatikani, basi tafsiri haikutoa moja.
     */
    title: string | null;

    /**
     * Mpangilio wa nambari wa kitabu katika tafsiri.
     */
    order: number;

    /**
     * Idadi ya sura ambazo kitabu kina.
     */
    numberOfChapters: number;

    /**
     * Nambari ya sura ya kwanza katika kitabu.
     */
    firstChapterNumber: number;

    /**
     * Kiungo cha sura ya kwanza ya kitabu.
     */
    firstChapterApiLink: string;

    /**
     * Nambari ya sura ya mwisho katika kitabu.
     */
    lastChapterNumber: number;

    /**
     * Kiungo cha sura ya mwisho ya kitabu.
     */
    lastChapterApiLink: string;

    /**
     * Idadi ya mistari iliyomo katika kitabu hicho.
     */
    totalNumberOfVerses: number;

    /**
     * Kama kitabu hicho ni kitabu cha apokrifa.
     * Imeachwa ikiwa tafsiri ni ya kisheria.
     */
    isApocryphal?: boolean;
}
```

### Mfano

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
