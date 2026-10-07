# Vertalings, Boeke en Hoofstukke

Eindpunte vir die blaai van vertalings, die lys van hul boeke en die ophaal van hoofstukinhoud.

Hoofstukinhoud, volledige vertaling-aflaaie en woordvlak-aantekeninge is elk in twee formate beskikbaar:

-   [**Standaardformaat**](./standard.md) - die oorspronklike, gestruktureerde formaat. Versinhoud is 'n lys van stukke (gewone teks, geformateerde teks, voetnootverwysings, ens.) wat jy self saamstel.
-   [**Vereenvoudigde formaat**](./simplified.md) - 'n plat formaat waar die inhoud van elke vers 'n enkele string is, met voetnote, poësie en ander opmaak wat as verrekenings in daardie string uitgedruk word.

Gebruik watter formaat die beste pas by hoe jy beplan om die teks te lewer of te verwerk.

## Beskikbare vertalings

`GET https://bible.helloao.org/api/available_translations.json`

Kry die lys van beskikbare vertalings in die API.

### Kode Voorbeeld

::: code-tabs#taal

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

### Struktuur

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Die lys van vertalings.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * Die ID van die vertaling.
     */
    id: string;

    /**
     * Die naam van die vertaling.
     * Dit is gewoonlik die naam van die vertaling in die vertaling se taal.
     */
    name: string;

    /**
     * Die Engelse naam van die vertaling.
     */
    englishName: string;

    /**
     * Die webwerf vir die vertaling.
     */
    website: string;

    /**
     * Die URL waar die lisensie vir die vertaling gevind kan word.
     */
    licenseUrl: string;

    /**
     * Die kort naam vir die vertaling.
     */
    shortName: string;

    /**
     * Die ISO 639 3-letter taaletiket waarin die vertaling hoofsaaklik is.
     */
    language: string;

    /**
     * Kry die naam van die taal waarin die vertaling is.
     * Nul of ongedefinieerd indien die naam van die taal nie bekend is nie.
     */
    languageName?: string;

    /**
     * Kry die naam van die taal in Engels.
     * Nul of ongedefinieerd as die taal nie 'n Engelse naam het nie.
     */
    languageEnglishName?: string;

    /**
     * Die rigting waarin die taal geskryf is.
     * "ltr" dui aan dat die teks van die linkerkant van die bladsy na regs geskryf is.
     * "rtl" dui aan dat die teks van die regterkant van die bladsy na links geskryf is.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Die beskikbare lys van formate.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Die API-skakel vir die lys van beskikbare boeke vir hierdie vertaling.
     */
    listOfBooksApiLink: string;

    /**
     * Die aantal boeke wat in hierdie vertaling vervat is.
     *
     * Volledige vertalings behoort dieselfde aantal boeke as die Bybel te hê (66).
     */
    numberOfBooks: number;

    /**
     * Die totale aantal hoofstukke wat in hierdie vertaling vervat is.
     *
     * Volledige vertalings moet dieselfde aantal hoofstukke hê as die Bybel (1 189).
     */
    totalNumberOfChapters: number;

    /**
     * Die totale aantal verse wat in hierdie vertaling vervat is.
     *
     * Volledige vertalings behoort dieselfde aantal verse as die Bybel te hê (ongeveer 31 102 - sommige vertalings sluit verse uit gebaseer op die oënskynlike waarskynlikheid dat hulle in die oorspronklike brontekste bestaan).
     */
    totalNumberOfVerses: number;

    /**
     * Die totale aantal apokriewe boeke wat in hierdie vertaling vervat is.
     * Weglaat indien die vertaling nie apokriewe insluit nie.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Die totale aantal apokriewe hoofstukke wat in hierdie vertaling vervat is.
     * Weglaat indien die vertaling nie apokriewe insluit nie.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * die totale aantal apokriewe verse wat in hierdie vertaling vervat is.
     * Weglaat indien die vertaling nie apokriewe insluit nie.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Voorbeeld

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

## Lys boeke in 'n vertaling

`GET https://bible.helloao.org/api/{translation}/books.json`

Kry die lys van boeke wat beskikbaar is vir die gegewe vertaling.

-   `translation` is die ID van die vertaling (bv. `BSB` ).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Kry die lys van boeke vir die BSB-vertaling
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

### Struktuur

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Die vertaalinligting vir die boeke.
     */
    translation: Translation;

    /**
     * Die lys van boeke wat beskikbaar is vir vertaling.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * Die ID van die boek.
     */
    id: string;

    /**
     * Die naam wat die vertaling vir die boek verskaf het.
     */
    name: string;

    /**
     * Die algemene naam vir die boek.
     */
    commonName: string;

    /**
     * Die titel van die boek.
     * Dit is gewoonlik 'n meer beskrywende weergawe van die boeknaam.
     * Indien nie beskikbaar nie, dan is een nie deur die vertaling verskaf nie.
     */
    title: string | null;

    /**
     * Die numeriese volgorde van die boek in die vertaling.
     */
    order: number;

    /**
     * Die aantal hoofstukke wat die boek bevat.
     */
    numberOfChapters: number;

    /**
     * Die nommer van die eerste hoofstuk in die boek.
     */
    firstChapterNumber: number;

    /**
     * Die skakel na die eerste hoofstuk van die boek.
     */
    firstChapterApiLink: string;

    /**
     * Die nommer van die laaste hoofstuk in die boek.
     */
    lastChapterNumber: number;

    /**
     * Die skakel na die laaste hoofstuk van die boek.
     */
    lastChapterApiLink: string;

    /**
     * Die aantal verse wat die boek bevat.
     */
    totalNumberOfVerses: number;

    /**
     * Of die boek 'n apokriewe boek is.
     * Weglaat indien die vertaling kanoniek is.
     */
    isApocryphal?: boolean;
}
```

### Voorbeeld

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
