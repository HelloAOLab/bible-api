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
     * Die API-bygevoegde notas vir die lisensie.
     * Nul of ongedefinieerd indien daar geen notas is nie.
     */
    licenseNotes?: string | null;

    /**
     * Die kennisgewing wat vertoon moet word wanneer inhoud van die vertaling vertoon word.
     * Nul of ongedefinieerd indien die vertaling nie 'n kennisgewing het nie.
     */
    licenseNotice?: string | null;

    /**
     * Die gestruktureerde lisensieterme wat vir die vertaling opgespoor is.
     * Nul of ongedefinieerd indien die terme nie bepaal kon word nie.
     * In daardie geval, kyk na die bladsy by licenseUrl vir die bepalings en voorwaardes.
     */
    license?: License | null;

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

/**
 * Definieer die gestruktureerde lisensieterme wat vir 'n vertaling opgespoor is.
 */
interface License {
    /**
     * Of verwysing na die oorspronklike bron vereis word wanneer die vertaling gebruik word.
     */
    attribution: 'required' | 'not-required';

    /**
     * Of kommersiële gebruik van die vertaling toegelaat word.
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * Of die skep en verspreiding van afgeleide werke van die vertaling toegelaat word.
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * Of afgeleide werke onder dieselfde lisensie versprei moet word (d.w.s. 'n "deel-gelyk"-vereiste).
     */
    copyleft: boolean;

    /**
     * Of die vertaling aan die publieke domein gewy is.
     */
    publicDomain: boolean;
}
```

### Lisensies

Elke vertaling word onder sy eie lisensie gepubliseer, so kyk eers na die bepalings en voorwaardes van 'n vertaling voordat jy dit gebruik.

-   `licenseUrl` skakel altyd na die volledige lisensievoorwaardes.
-   `licenseNotice` , indien teenwoordig, is die kopiereg- of erkenningskennisgewing wat langs inhoud van die vertaling vertoon moet word.
-   `licenseNotes` bevat notas wat deur die API bygevoeg is, soos veranderinge wat aan die bronteks aangebring is.
-   `license` , wanneer teenwoordig, som die terme op in 'n vorm wat jou kode kan nagaan. Jy kan byvoorbeeld die lys filter na vertalings wat kommersiële gebruik toelaat:

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

`license` word slegs gestel wanneer die terme outomaties opgespoor kan word. Vertalings daarsonder mag steeds jou gebruik toelaat, so lees die bladsy by `licenseUrl` daarvoor.

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
     * Die kort naam (afkorting) wat die vertaling vir die boek verskaf het.
     * Indien nie beskikbaar nie, dan is een nie deur die vertaling verskaf nie.
     */
    shortName?: string;

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
