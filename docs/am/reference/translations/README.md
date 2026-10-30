# ትርጉሞች፣ መጻሕፍት እና ምዕራፎች

የትርጉም ማሰስ፣ መጽሐፎቻቸውን መዘርዘር እና የምዕራፍ ይዘትን ማምጣት የመጨረሻ ነጥቦች።

የምዕራፍ ይዘት፣ የተሟላ የትርጉም ውርዶች እና የቃላት ደረጃ ማብራሪያዎች እያንዳንዳቸው በሁለት ቅርጸቶች ይገኛሉ፡

-   [**መደበኛ ቅርጸት**](./standard.md) - የመጀመሪያው፣ የተዋቀረ ቅርጸት። የጥቅሱ ይዘት እርስዎ እራስዎ የሚያሰባስቡዋቸው የቁራጭ ዝርዝሮች (ግልጽ ጽሑፍ፣ የተቀረጸ ጽሑፍ፣ የግርጌ ማስታወሻ ማጣቀሻዎች፣ ወዘተ) ናቸው።
-   [**ቀለል ያለ ቅርጸት**](./simplified.md) - የእያንዳንዱ ጥቅስ ይዘት አንድ ነጠላ ሕብረቁምፊ የሆነበት፣ የግርጌ ማስታወሻዎች፣ ግጥም እና ሌሎች ማርከሮች በዚያ ሕብረቁምፊ ውስጥ እንደ ማካካሻዎች የተገለጹበት ጠፍጣፋ ቅርጸት።

ጽሑፉን እንዴት እንደሚያቀርቡ ወይም እንደሚያስኬዱ በተሻለ ሁኔታ የሚስማማውን ቅርጸት ይጠቀሙ።

## የሚገኙ ትርጉሞች

`GET https://bible.helloao.org/api/available_translations.json`

በኤፒአይ ውስጥ የሚገኙ የትርጉም ዝርዝሮችን ያገኛል።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

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

### መዋቅር

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * የትርጉም ዝርዝር።
     */
    translations: Translation[];
}

interface Translation {
    /**
     * የትርጉሙ መታወቂያ።
     */
    id: string;

    /**
     * የትርጉሙ ስም።
     * ይህ አብዛኛውን ጊዜ በትርጉሙ ቋንቋ የትርጉሙ ስም ነው።
     */
    name: string;

    /**
     * የትርጉሙ የእንግሊዝኛ ስም።
     */
    englishName: string;

    /**
     * የትርጉም ድረ-ገጽ።
     */
    website: string;

    /**
     * የትርጉሙ ፈቃድ የሚገኝበት ዩአርኤል።
     */
    licenseUrl: string;

    /**
     * የፈቃዱ ኤፒአይ-የተጨመሩ ማስታወሻዎች።
     * ምንም ማስታወሻዎች ከሌሉ ባዶ ወይም ያልተገለጸ።
     */
    licenseNotes?: string | null;

    /**
     * ከትርጉሙ ውስጥ ይዘትን ሲያሳዩ መታየት ያለበት ማስታወቂያ።
     * ትርጉሙ ማስታወቂያ ከሌለው ባዶ ወይም ያልተገለጸ።
     */
    licenseNotice?: string | null;

    /**
     * ለትርጉሙ የተገኙት የተዋቀሩ የፈቃድ ቃላት።
     * ውሎቹ ሊታወቁ ካልቻሉ ባዶ ወይም ያልተገለጸ።
     * በዚህ ሁኔታ፣ ውሎቹን ለማግኘት በ licenseUrl ላይ ያለውን ገጽ ይመልከቱ።
     */
    license?: License | null;

    /**
     * የትርጉሙ አጭር ስም።
     */
    shortName: string;

    /**
     * ትርጉሙ በዋናነት የተካተተበት የISO 639 ባለ 3-ፊደል ቋንቋ መለያ።
     */
    language: string;

    /**
     * ትርጉሙ የተጻፈበትን ቋንቋ ስም ያገኛል።
     * የቋንቋው ስም የማይታወቅ ከሆነ ባዶ ወይም ያልተገለጸ።
     */
    languageName?: string;

    /**
     * የቋንቋውን ስም በእንግሊዝኛ ያገኛል።
     * ቋንቋው የእንግሊዝኛ ስም ከሌለው ባዶ ወይም ያልተገለጸ።
     */
    languageEnglishName?: string;

    /**
     * ቋንቋው የተጻፈበት አቅጣጫ።
     * "ltr" የሚለው ጽሑፍ የተጻፈው ከገጹ ግራ በኩል ወደ ቀኝ መሆኑን ያመለክታል።
     * "rtl" የሚለው ጽሑፍ የተጻፈው ከገጹ ቀኝ በኩል ወደ ግራ መሆኑን ያመለክታል።
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * የሚገኙ የቅርጸቶች ዝርዝር።
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * ለዚህ ትርጉም የሚገኙ መጽሐፍት ዝርዝር የኤፒአይ ሊንክ።
     */
    listOfBooksApiLink: string;

    /**
     * በዚህ ትርጉም ውስጥ የተካተቱት መጻሕፍት ብዛት።
     *
     * የተሟሉ ትርጉሞች ከመጽሐፍ ቅዱስ ጋር ተመሳሳይ የመጻሕፍት ብዛት ሊኖራቸው ይገባል (66)።
     */
    numberOfBooks: number;

    /**
     * በዚህ ትርጉም ውስጥ የተካተቱት ጠቅላላ የምዕራፎች ብዛት።
     *
     * የተሟሉ ትርጉሞች ከመጽሐፍ ቅዱስ ጋር ተመሳሳይ የምዕራፎች ብዛት ሊኖራቸው ይገባል (1,189)።
     */
    totalNumberOfChapters: number;

    /**
     * በዚህ ትርጉም ውስጥ የተካተቱት ጠቅላላ የጥቅሶች ብዛት።
     *
     * የተሟሉ ትርጉሞች ከመጽሐፍ ቅዱስ ጋር ተመሳሳይ የሆኑ የጥቅሶች ብዛት ሊኖራቸው ይገባል (ወደ 31,102 አካባቢ - አንዳንድ ትርጉሞች በዋናው ምንጭ ጽሑፎች ውስጥ ሊኖር በሚችለው ግልጽ ዕድል ላይ የተመሰረቱትን ጥቅሶችን አያካትቱም)።
     */
    totalNumberOfVerses: number;

    /**
     * በዚህ ትርጉም ውስጥ የተካተቱት የአዋልድ መጻሕፍት ጠቅላላ ብዛት።
     * ትርጉሙ አፖክሪፋን የማያካትት ከሆነ ተትቷል።
     */
    numberOfApocryphalBooks?: number;

    /**
     * በዚህ ትርጉም ውስጥ የተካተቱት የአዋልድ ምዕራፎች ጠቅላላ ብዛት።
     * ትርጉሙ አፖክሪፋን የማያካትት ከሆነ ተትቷል።
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * በዚህ ትርጉም ውስጥ የተካተቱት የአዋልድ ጥቅሶች ጠቅላላ ብዛት።
     * ትርጉሙ አፖክሪፋን የማያካትት ከሆነ ተትቷል።
     */
    totalNumberOfApocryphalVerses?: number;
}

/**
 * ለትርጉም የተገኙትን የተዋቀሩ የፈቃድ ውሎችን ይገልጻል።
 */
interface License {
    /**
     * ትርጉሙን ሲጠቀሙ ከዋናው ምንጭ ጋር መተዋወቅ አስፈላጊ መሆኑን ወይም አለመሆኑን።
     */
    attribution: 'required' | 'not-required';

    /**
     * የትርጉሙን የንግድ አጠቃቀም ይፈቀድ እንደሆነ።
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * የትርጉሙን ተዋጽኦዎች መፍጠር እና ማሰራጨት ይፈቀዳል ወይ የሚለው።
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * የተለዋዋጭ ስራዎች በተመሳሳይ ፈቃድ ስር መሰራጨት አለባቸው ወይ የሚለው (ማለትም "ተመሳሳይ" መስፈርት)።
     */
    copyleft: boolean;

    /**
     * ትርጉሙ ለሕዝብ ጥቅም የተወሰነ መሆኑን ወይም አለመሆኑን።
     */
    publicDomain: boolean;
}
```

### ፈቃዶች

እያንዳንዱ ትርጉም የሚታተመው በራሱ ፈቃድ ነው፣ ስለዚህ የትርጉሙን ቃላት ከመጠቀምዎ በፊት ያረጋግጡ።

-   `licenseUrl` ሁልጊዜ ወደ ሙሉ የፈቃድ ውሎች ያገናኛል።
-   `licenseNotice` ፣ ሲኖር፣ ከትርጉሙ ይዘት ጎን ለጎን የሚታየው የቅጂ መብት ወይም የባለቤትነት ማስታወቂያ ነው።
-   `licenseNotes` በኤፒአይ የተጨመሩ ማስታወሻዎችን ይዟል፣ ለምሳሌ በምንጭ ጽሑፍ ላይ የተደረጉ ለውጦችን።
-   `license` ፣ ሲኖር፣ ኮድዎ ሊፈትሽ በሚችለው መልኩ ቃላቶቹን ያጠቃልላል። ለምሳሌ፣ ዝርዝሩን ለንግድ አገልግሎት ወደሚፈቅዱ ትርጉሞች ማጣራት ይችላሉ

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

`license` የሚቀመጠው ውሎቹ በራስ-ሰር ሊገኙ ሲችሉ ብቻ ነው። ያለሱ ትርጉሞች አሁንም ጥቅም ላይ እንዲውሉ ሊፈቅዱ ይችላሉ፣ ስለዚህ ለእነዚያ በ `licenseUrl` ላይ ያለውን ገጽ ያንብቡ።

### ለምሳሌ

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

## በትርጉም ውስጥ መጽሐፍትን ዘርዝር

`GET https://bible.helloao.org/api/{translation}/books.json`

ለተሰጠው ትርጉም የሚገኙ መጻሕፍትን ዝርዝር ያገኛል።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// የቢኤስቢ ትርጉም የመጽሐፍት ዝርዝር ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * የመጽሐፉ የትርጉም መረጃ።
     */
    translation: Translation;

    /**
     * ለትርጉም ሊገኙ የሚችሉ መጻሕፍት ዝርዝር።
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * የመጽሐፉ መታወቂያ።
     */
    id: string;

    /**
     * ትርጉሙ ለመጽሐፉ የሰጠው ስም።
     */
    name: string;

    /**
     * የመጽሐፉ የተለመደ ስም።
     */
    commonName: string;

    /**
     * ትርጉሙ ለመጽሐፉ የሰጠው አጭር ስም (አህጽሮተ ቃል)።
     * የማይገኝ ከሆነ፣ በትርጉሙ አንድ አልቀረበም።
     */
    shortName?: string;

    /**
     * የመጽሐፉ ርዕስ።
     * ይህ ብዙውን ጊዜ የመጽሐፉን ስም የበለጠ ገላጭ ስሪት ነው።
     * የማይገኝ ከሆነ፣ በትርጉሙ አንድ አልቀረበም።
     */
    title: string | null;

    /**
     * በትርጉሙ ውስጥ የመጽሐፉ የቁጥር ቅደም ተከተል።
     */
    order: number;

    /**
     * መጽሐፉ የያዘው የምዕራፍ ብዛት።
     */
    numberOfChapters: number;

    /**
     * በመጽሐፉ ውስጥ የመጀመሪያው ምዕራፍ ቁጥር።
     */
    firstChapterNumber: number;

    /**
     * ወደ መጽሐፉ የመጀመሪያ ምዕራፍ የሚወስድ አገናኝ።
     */
    firstChapterApiLink: string;

    /**
     * በመጽሐፉ ውስጥ የመጨረሻው ምዕራፍ ቁጥር።
     */
    lastChapterNumber: number;

    /**
     * ወደ መጽሐፉ የመጨረሻ ምዕራፍ የሚወስድ አገናኝ።
     */
    lastChapterApiLink: string;

    /**
     * መጽሐፉ የያዘው የቁጥሮች ብዛት።
     */
    totalNumberOfVerses: number;

    /**
     * መጽሐፉ የአዋልድ መጽሐፍ ይሁን።
     * ትርጉሙ ቀኖናዊ ከሆነ ተትቷል።
     */
    isApocryphal?: boolean;
}
```

### ለምሳሌ

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
