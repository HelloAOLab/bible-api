# डेटासेट

पूरक बाइबिल डेटासेट को ब्राउज़ करने के लिए एंडपॉइंट्स - जैसे कि क्रॉस रेफरेंस, बाइबिल संबंधी संस्थाएं (लोग, स्थान, घटनाएं और जनसमूह), मूल भाषा के अंतररेखीय शब्द, शब्दकोश और दिन के श्लोक के उम्मीदवार - और उनकी पुस्तकों, अध्याय सामग्री, संस्थाओं, शब्दकोश प्रविष्टियों और श्लोक श्रेणियों को प्राप्त करना।

## उपलब्ध डेटासेट

`GET https://bible.helloao.org/api/available_datasets.json`

API में उपलब्ध बाइबिल डेटासेट की सूची प्राप्त करता है।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * डेटासेट की सूची।
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * डेटासेट की आईडी।
     */
    id: string;

    /**
     * डेटासेट का नाम।
     */
    name: string;

    /**
     * डेटासेट की वेबसाइट।
     */
    website: string;

    /**
     * वह यूआरएल जहां डेटासेट के लाइसेंस का पता लगाया जा सकता है।
     */
    licenseUrl: string;

    /**
     * लाइसेंस के लिए एपीआई द्वारा जोड़े गए नोट्स।
     * यदि कोई नोट्स नहीं हैं तो यह शून्य या अपरिभाषित होगा।
     */
    licenseNotes?: string | null;

    /**
     * डेटासेट का अंग्रेजी नाम।
     */
    englishName: string;

    /**
     * डेटासेट मुख्य रूप से ISO 639 3-अक्षर भाषा टैग में है।
     */
    language: string;

    /**
     * जिस दिशा में भाषा लिखी जाती है।
     * "ltr" का अर्थ है कि पाठ पृष्ठ के बाईं ओर से दाईं ओर लिखा गया है।
     * "rtl" का अर्थ है कि पाठ पृष्ठ के दाहिने भाग से बाएं भाग की ओर लिखा गया है।
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * इस डेटासेट के लिए उपलब्ध पुस्तकों की सूची का एपीआई लिंक।
     */
    listOfBooksApiLink: string;

    /**
     * उपलब्ध प्रारूपों की सूची।
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * इस डेटासेट में शामिल पुस्तकों की संख्या।
     */
    numberOfBooks: number;

    /**
     * इस डेटासेट में शामिल अध्यायों की कुल संख्या।
     */
    totalNumberOfChapters: number;

    /**
     * इस डेटासेट में शामिल छंदों की कुल संख्या।
     */
    totalNumberOfVerses: number;

    /**
     * इस डेटासेट में मौजूद क्रॉस रेफरेंस की कुल संख्या।
     * उन डेटासेट के लिए 0 जिनमें क्रॉस रेफरेंस नहीं हैं।
     */
    totalNumberOfReferences: number;

    /**
     * इस डेटासेट में मौजूद अंतःरैखिक शब्दों की कुल संख्या।
     * यदि डेटासेट में अंतररेखीय शब्द नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    totalNumberOfWords?: number;

    /**
     * यह उस भाषा का नाम प्राप्त करता है जिसमें डेटासेट मौजूद है।
     * यदि भाषा का नाम ज्ञात नहीं है तो मान शून्य या अपरिभाषित होगा।
     */
    languageName?: string;

    /**
     * यह भाषा का नाम अंग्रेजी में प्राप्त करता है।
     * यदि भाषा का कोई अंग्रेजी नाम नहीं है तो मान शून्य या अपरिभाषित होगा।
     */
    languageEnglishName?: string;

    /**
     * डेटासेट में मौजूद संस्थाओं की सूचियों के लिए एपीआई लिंक।
     * यदि डेटासेट में संबंधित इकाइयाँ मौजूद नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * डेटासेट में शामिल संस्थाओं की कुल संख्या।
     * यदि डेटासेट में संबंधित इकाइयाँ मौजूद नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * डेटासेट में मौजूद शब्दकोश प्रविष्टियों की सूची के लिए एपीआई लिंक।
     * यदि डेटासेट में शब्दकोश प्रविष्टियाँ नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    listOfLexiconApiLink?: string;

    /**
     * डेटासेट में मौजूद शब्दकोश प्रविष्टियों की कुल संख्या।
     * यदि डेटासेट में शब्दकोश प्रविष्टियाँ नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    totalNumberOfLexicon?: number;

    /**
     * डेटासेट में मौजूद प्रत्येक श्लोक की सूची और उसकी श्रेणियों के लिए एपीआई लिंक।
     * यदि डेटासेट के छंदों में श्रेणियां नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    listOfVersesApiLink?: string;

    /**
     * डेटासेट में श्लोक श्रेणियों की सूची के लिए एपीआई लिंक।
     * यदि डेटासेट में श्लोक श्रेणियां शामिल नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    listOfCategoriesApiLink?: string;

    /**
     * डेटासेट में शामिल श्लोक श्रेणियों की कुल संख्या।
     * यदि डेटासेट में श्लोक श्रेणियां शामिल नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    totalNumberOfCategories?: number;
}
```

### उदाहरण

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

## डेटासेट में पुस्तकों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

दिए गए डेटासेट के लिए उपलब्ध पुस्तकों की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `open-cross-ref` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// ओपन-क्रॉस-रेफ़ डेटासेट के लिए पुस्तकों की सूची प्राप्त करें
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

### संरचना

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * पुस्तकों से संबंधित डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * इस डेटासेट के लिए उपलब्ध पुस्तकों की सूची।
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * पुस्तक की आईडी।
     * यह बाइबिल में संबंधित पुस्तक (उत्पत्ति, निर्गमन आदि) की आईडी से मेल खाता है।
     */
    id: string;

    /**
     * बाइबल में पुस्तकों का क्रम।
     */
    order: number;

    /**
     * पुस्तक के पहले अध्याय की संख्या।
     */
    firstChapterNumber: number;

    /**
     * पुस्तक के पहले अध्याय का लिंक।
     */
    firstChapterApiLink: string | null;

    /**
     * पुस्तक के अंतिम अध्याय की संख्या।
     */
    lastChapterNumber: number | null;

    /**
     * पुस्तक के अंतिम अध्याय का लिंक।
     */
    lastChapterApiLink: string | null;

    /**
     * पुस्तक में मौजूद अध्यायों की संख्या।
     */
    numberOfChapters: number;

    /**
     * पुस्तक में मौजूद श्लोकों की संख्या।
     */
    totalNumberOfVerses: number;

    /**
     * इस पुस्तक में मौजूद संदर्भों की कुल संख्या।
     */
    totalNumberOfReferences: number;
}
```

### उदाहरण

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

## डेटासेट से एक अध्याय प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

किसी दी गई पुस्तक और डेटासेट के लिए एक अध्याय की सामग्री प्राप्त करता है।

क्रॉस-रेफरेंस डेटासेट (जैसे कि `open-cross-ref` ) के लिए, अध्याय में प्रत्येक श्लोक के लिए क्रॉस-रेफरेंस की सूची होती है। इंटरलाइनियर डेटासेट (जैसे कि `bsb-interlinear` ) के लिए, अध्याय में प्रत्येक श्लोक के मूल भाषा के शब्द होते हैं - [इंटरलाइनियर डेटासेट](#interlinear-datasets) देखें। एंटिटी डेटासेट (जैसे कि `theographic` ) के लिए, अध्याय में उस अध्याय में दिखाई देने वाले लोग, स्थान और घटनाएँ होती हैं - [अध्याय में एंटिटी प्राप्त करें](#get-the-entities-in-a-chapter) देखें। `verse-of-the-day` डेटासेट के लिए, अध्याय में उस अध्याय में दिन के श्लोक के संभावित उम्मीदवार और उनकी श्रेणियाँ होती हैं - [दिन का श्लोक](#verse-of-the-day) देखें।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `open-cross-ref` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` )।
-   `chapter` अध्याय की संख्यात्मक संख्या है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// ओपन-क्रॉस-रेफ़ डेटासेट से जेनेसिस 1 प्राप्त करें
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

### संरचना

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * पुस्तक के अध्याय के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * पुस्तक के अध्याय से संबंधित पुस्तक की जानकारी।
     */
    book: DatasetBook;

    /**
     * इस अध्याय का लिंक।
     */
    thisChapterLink: string;

    /**
     * अगले अध्याय का लिंक।
     * यदि यह डेटासेट का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterApiLink: string | null;

    /**
     * पिछले अध्याय का लिंक।
     * यदि यह डेटासेट का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterApiLink: string | null;

    /**
     * अध्याय में मौजूद श्लोकों की संख्या।
     */
    numberOfVerses: number;

    /**
     * इस अध्याय की जानकारी।
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * अध्याय संख्या।
     */
    number: number;

    /**
     * अध्याय की विषयवस्तु।
     */
    content: DatasetVerse[];
}

/**
 * एक श्लोक में `references` (क्रॉस रेफरेंस डेटासेट), `words` (इंटरलाइनियर डेटासेट), या `categories` (दिन के श्लोक का डेटासेट) होता है।
 * यह जांचें कि इनमें से कौन सा `'words' in verse` या `'categories' in verse` के साथ मौजूद है।
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * श्लोक की संख्या।
     */
    verse: number;

    /**
     * श्लोक के लिए संदर्भ।
     *
     * स्कोर के अनुसार घटते क्रम में व्यवस्थित।
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * श्लोक की संख्या।
     */
    verse: number;

    /**
     * श्लोक के मूल भाषा के शब्द, मूल पाठ के क्रम में।
     * नीचे "इंटरलाइनियर डेटासेट" देखें।
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * श्लोक की संख्या।
     * यदि `endVerse` मौजूद है, तो यह वह श्लोक है जहाँ से अंश शुरू होता है।
     */
    verse: number;

    /**
     * वह श्लोक जिस पर यह अंश समाप्त होता है।
     * यदि प्रविष्टि एक ही श्लोक की है तो इसे छोड़ दिया जाएगा।
     */
    endVerse?: number;

    /**
     * श्लोक जिस श्रेणी से संबंधित है, उसकी आईडी, सबसे प्रासंगिक श्रेणी से शुरू करते हुए।
     * नीचे "आज का श्लोक" देखें।
     */
    categories: string[];

    /**
     * यह पहला वर्ष है जब इस श्लोक को दिन का श्लोक बनाया जा सकता है।
     * यदि श्लोक हमेशा से सूची में रहा हो तो उसे छोड़ दिया जाएगा।
     */
    addedIn?: number;

    /**
     * वह पहला वर्ष जब यह श्लोक अब दिन का श्लोक नहीं रह सकता।
     * हटाए गए छंद डेटासेट में बने रहते हैं ताकि पिछले वर्षों के छंदों को अभी भी चुना जा सके।
     * यदि श्लोक को सूची से नहीं हटाया गया है तो इसे छोड़ दिया जाएगा।
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * जिस पुस्तक का संदर्भ दिया जा रहा है, उसकी आईडी।
     */
    book: string;

    /**
     * अध्याय संख्या।
     */
    chapter: number;

    /**
     * श्लोक संख्या।
     * यदि `endVerse` मौजूद है, तो यह वह श्लोक है जहाँ से संदर्भ शुरू होता है।
     */
    verse: number;

    /**
     * वह श्लोक जहाँ संदर्भ समाप्त होता है।
     */
    endVerse?: number;

    /**
     * संदर्भ के लिए प्रासंगिकता स्कोर।
     */
    score?: number;
}

// इंटरलिनियरवर्ड की संरचना के लिए नीचे "इंटरलिनियर डेटासेट" देखें।
```

### उदाहरण

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

## इकाइयां,

कुछ डेटासेट - जैसे कि [थियोग्राफिक बाइबिल मेटाडेटा](https://github.com/robertrouse/theographic-bible-metadata) डेटासेट ( `theographic` ) - में संस्थाएं शामिल हैं: लोग, स्थान, घटनाएँ और लोगों के समूह, साथ ही उनके बीच और बाइबिल की आयतों के बीच संबंध जो उनका उल्लेख करते हैं।

[हिस्ट्री ग्लोब](https://historyglobe.app) डेटासेट ( `history-globe` ) में केवल स्थान शामिल हैं: बाइबिल में उल्लिखित स्थान, उनके निर्देशांक और उन्हें नाम देने वाले श्लोक। इसके स्थान आईडी (जैसे यरूशलेम के लिए `a15257a` ) हिस्ट्री ग्लोब के स्थिर स्थान आईडी हैं, वही आईडी जिनका उपयोग इसका अपना [ओपन डेटा एपीआई](https://historyglobe.app/docs/api.html) करता है, इसलिए नाम सही होने पर वे नहीं बदलते हैं। इसके `featureType` मान थियोग्राफिक डेटासेट द्वारा उपयोग किए जाने वाले मानों ( `City` , `Region` , `Water` , इत्यादि) का अनुसरण करते हैं, और `featureSubType` अधिक विशिष्ट प्रकार के स्थान को दर्शाता है जहाँ ऐसा कोई स्थान होता है (जैसे `River` , `Gate` , `Spring` )।

डेटासेट जिनमें संस्थाएं शामिल हैं, उनकी प्रविष्टि में `/api/available_datasets.json` में `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` और `listOfPeopleGroupsApiLink` गुण शामिल हैं।

एंटिटी डेटासेट अध्याय-आधारित डेटा भी प्रदान करते हैं: `/api/d/{dataset}/books.json` उन पुस्तकों की सूची देता है जिनके अध्यायों में एंटिटी डेटा शामिल है, और `/api/d/{dataset}/{book}/{chapter}.json` उस अध्याय में दिखाई देने वाले व्यक्तियों, स्थानों और घटनाओं को, साथ ही प्रत्येक का उल्लेख जिन श्लोकों में हुआ है, उनकी संख्याएँ लौटाता है। [अध्याय में एंटिटी प्राप्त करें](#get-the-entities-in-a-chapter) देखें।

एंटिटीज़, API के बाकी हिस्सों की तरह ही बाइबिल के अंशों को संदर्भित करने के लिए समान पुस्तक आईडी, अध्याय संख्या और श्लोक संख्या का उपयोग करती हैं, इसलिए उन्हें किसी भी अनुवाद के साथ जोड़ा जा सकता है। वे एंटिटी संदर्भों का उपयोग करके एक दूसरे को संदर्भित करती हैं:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * जिस इकाई का संदर्भ दिया जा रहा है, उसकी आईडी।
     */
    id: string;

    /**
     * संदर्भित की जा रही इकाई का प्रकार।
     * यह एंटिटी के एपीआई लिंक के संग्रह खंड से मेल खाता है, इसलिए लिंक को `/api/d/{dataset}/{type}/{id}.json` के रूप में निर्मित किया जा सकता है।
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * जिस संस्था का संदर्भ दिया जा रहा है, उसका नाम।
     */
    name?: string;

    /**
     * संदर्भित इकाई के लिए एपीआई लिंक।
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * पुस्तक की आईडी (GEN, EXO, आदि)।
     */
    book: string;

    /**
     * वह अध्याय संख्या जहाँ से संदर्भ शुरू होता है।
     */
    chapter: number;

    /**
     * वह श्लोक संख्या जिससे संदर्भ शुरू होता है।
     */
    verse: number;

    /**
     * वह श्लोक जहाँ संदर्भ समाप्त होता है।
     * एक ही अध्याय के लगातार श्लोकों को एक ही संदर्भ में समेकित कर दिया गया है।
     */
    endVerse?: number;
}
```

### इतिहास ग्लोब श्रेय

हिस्ट्री ग्लोब डेटा [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) लाइसेंस के तहत उपलब्ध है। यदि आप इसका उपयोग करते हैं, तो हिस्ट्री ग्लोब ( https://historyglobe.app ) और ओपनबाइबल.इन्फो बाइबल जियोकोडिंग डेटा, जिस पर यह आधारित है, का श्रेय दें और किसी भी बदलाव का उल्लेख करें। डेटासेट की `licenseNotes` प्रॉपर्टी को इसका श्रेय दिया जाता है।

## किसी अध्याय में मौजूद संस्थाओं को प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

एंटिटी डेटासेट के लिए, यह किसी एक अध्याय में दिखाई देने वाले लोगों, स्थानों और घटनाओं को प्राप्त करता है, साथ ही अध्याय में उन छंदों की संख्या भी प्राप्त करता है जहां प्रत्येक का उल्लेख किया गया है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` )।
-   `chapter` अध्याय की संख्यात्मक संख्या है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।

एंटिटी डेटा वाले पुस्तकों और अध्यायों की सूची `GET https://bible.helloao.org/api/d/{dataset}/books.json` से प्राप्त की जा सकती है, जो [डेटासेट बुक्स एंडपॉइंट](#list-books-in-a-dataset) के समान संरचना का अनुसरण करती है। एंटिटी डेटासेट के लिए, `totalNumberOfVerses` उन श्लोकों की संख्या है जिनका उल्लेख कम से कम एक एंटिटी द्वारा किया गया है और `totalNumberOfReferences` एंटिटी-श्लोक उल्लेखों की कुल संख्या है।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// उत्पत्ति 2 में दिखाई देने वाले लोगों, स्थानों और घटनाओं को प्राप्त करें
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

### संरचना

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * पुस्तक के अध्याय के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * पुस्तक के अध्याय से संबंधित पुस्तक की जानकारी।
     */
    book: DatasetBook;

    /**
     * अध्याय के लिए इकाई डेटा।
     */
    chapter: DatasetEntityChapterData;

    /**
     * इस अध्याय का लिंक।
     */
    thisChapterLink: string;

    /**
     * अगले अध्याय का लिंक।
     * यदि यह डेटासेट का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterApiLink: string | null;

    /**
     * पिछले अध्याय का लिंक।
     * यदि यह डेटासेट का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterApiLink: string | null;

    /**
     * अध्याय में आने वाले व्यक्तियों, स्थानों और घटनाओं की संख्या।
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * अध्याय संख्या।
     */
    number: number;

    /**
     * इस अध्याय में जिन लोगों का जिक्र है।
     * इन्हें उस पहले श्लोक के अनुसार क्रमबद्ध किया गया है जिसमें ये दिखाई देते हैं।
     */
    people: ChapterPerson[];

    /**
     * अध्याय में जिन स्थानों का उल्लेख किया गया है।
     * इन्हें उस पहले श्लोक के अनुसार क्रमबद्ध किया गया है जिसमें ये दिखाई देते हैं।
     */
    places: ChapterPlace[];

    /**
     * इस अध्याय में वर्णित घटनाएँ।
     * इन्हें उस पहले श्लोक के अनुसार क्रमबद्ध किया गया है जिसमें ये दिखाई देते हैं।
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * उस व्यक्ति की पहचान।
     */
    id: string;

    /**
     * उस व्यक्ति का नाम।
     */
    name: string;

    /**
     * क्या उस व्यक्ति का नाम उचित नाम है?
     */
    isProperName?: boolean;

    /**
     * व्यक्ति का लिंग।
     */
    gender?: string;

    /**
     * जिस वर्ष व्यक्ति का जन्म हुआ और जिस वर्ष उसकी मृत्यु हुई।
     * ऋणात्मक संख्याएँ ईसा पूर्व के वर्ष हैं। धनात्मक संख्याएँ ईस्वी के वर्ष हैं।
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * उस व्यक्ति के लिए एपीआई लिंक।
     */
    apiLink: string;

    /**
     * अध्याय में उन श्लोकों की संख्या जिनमें उस व्यक्ति का उल्लेख है।
     * आरोही क्रम में व्यवस्थित।
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * उस स्थान की आईडी।
     */
    id: string;

    /**
     * उस स्थान का नाम।
     */
    name: string;

    /**
     * वह स्थान किस प्रकार की भौगोलिक विशेषता का है।
     */
    featureType?: string;

    /**
     * उस स्थान का अक्षांश और देशांतर।
     */
    latitude?: number;
    longitude?: number;

    /**
     * उस स्थान का एपीआई लिंक।
     */
    apiLink: string;

    /**
     * अध्याय में उन श्लोकों की संख्या जिनमें उस स्थान का उल्लेख है।
     * आरोही क्रम में व्यवस्थित।
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * इवेंट की आईडी।
     */
    id: string;

    /**
     * आयोजन का नाम।
     */
    name: string;

    /**
     * जिस तारीख को यह कार्यक्रम शुरू हुआ था।
     */
    startDate?: string;

    /**
     * इवेंट का एपीआई लिंक।
     */
    apiLink: string;

    /**
     * अध्याय में घटना का वर्णन करने वाले श्लोकों की संख्या।
     * आरोही क्रम में व्यवस्थित।
     */
    verses: number[];
}
```

### उदाहरण

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

## डेटासेट में लोगों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

दिए गए डेटासेट के लिए उपलब्ध लोगों की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// थियोग्राफिक डेटासेट के लिए लोगों की सूची प्राप्त करें
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

### संरचना

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * लोगों के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट के लिए उपलब्ध लोगों की सूची।
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * उस व्यक्ति की पहचान।
     */
    id: string;

    /**
     * उस व्यक्ति का नाम।
     */
    name: string;

    /**
     * क्या उस व्यक्ति का नाम उचित नाम है?
     */
    isProperName?: boolean;

    /**
     * व्यक्ति का लिंग।
     */
    gender?: string;

    /**
     * बाइबल में उस व्यक्ति का उल्लेख करने वाले संदर्भों की संख्या।
     */
    numberOfReferences: number;

    /**
     * उस व्यक्ति के लिए एपीआई लिंक।
     */
    thisPersonApiLink: string;
}
```

### उदाहरण

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

## डेटासेट से एक व्यक्ति प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

यह किसी एक व्यक्ति के बारे में जानकारी प्राप्त करता है, जिसमें बाइबिल में उनके उल्लेख और अन्य लोगों, स्थानों, घटनाओं और जनसमूहों के साथ उनके संबंधों का विवरण शामिल है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।
-   `person` व्यक्ति की आईडी (उदाहरण के लिए `paul_2479` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// धार्मिक डेटासेट से पॉल के बारे में जानकारी प्राप्त करें
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

### संरचना

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * उस व्यक्ति से संबंधित डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * उस व्यक्ति के बारे में जानकारी।
     */
    person: DatasetPerson;

    /**
     * इस व्यक्ति का एपीआई लिंक।
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * उस व्यक्ति की पहचान।
     */
    id: string;

    /**
     * उस व्यक्ति का नाम।
     */
    name: string;

    /**
     * अन्य नाम जिनसे उस व्यक्ति को पुकारा जाता है।
     */
    alsoCalled?: string[];

    /**
     * क्या उस व्यक्ति का नाम उचित नाम है?
     */
    isProperName?: boolean;

    /**
     * व्यक्ति का लिंग।
     */
    gender?: string;

    /**
     * व्यक्ति का विवरण। प्रत्येक स्ट्रिंग एक पैराग्राफ है।
     */
    description?: string[];

    /**
     * जिस वर्ष व्यक्ति का जन्म हुआ और जिस वर्ष उसकी मृत्यु हुई।
     * ऋणात्मक संख्याएँ ईसा पूर्व के वर्ष हैं। धनात्मक संख्याएँ ईस्वी के वर्ष हैं।
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * वह प्रारंभिक और अंतिम वर्ष जिसमें उस व्यक्ति का उल्लेख किया गया है।
     */
    minYear?: number;
    maxYear?: number;

    /**
     * वह स्थान जहाँ व्यक्ति का जन्म हुआ और जहाँ उसकी मृत्यु हुई।
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * उस व्यक्ति के पारिवारिक संबंध।
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * वह व्यक्ति जिन जनसमूहों का सदस्य है।
     */
    memberOf?: DatasetEntityRef[];

    /**
     * वे घटनाएँ जिनमें उस व्यक्ति ने भाग लिया।
     */
    events?: DatasetEntityRef[];

    /**
     * बाइबल में उस व्यक्ति का उल्लेख करने वाले संदर्भों की सूची।
     * पुस्तक क्रम, अध्याय और श्लोक के अनुसार क्रमबद्ध।
     */
    references: VerseRef[];
}
```

### उदाहरण

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

## डेटासेट में स्थानों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

दिए गए डेटासेट के लिए उपलब्ध स्थानों की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।

### संरचना

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * स्थानों से संबंधित डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट के लिए उपलब्ध स्थानों की सूची।
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * उस स्थान की आईडी।
     */
    id: string;

    /**
     * उस स्थान का नाम।
     */
    name: string;

    /**
     * वह स्थान किस प्रकार की भौगोलिक विशेषता का है।
     * उदाहरण के लिए, "शहर", "क्षेत्र", "पहाड़", "पानी", आदि।
     */
    featureType?: string;

    /**
     * उस स्थान का अक्षांश और देशांतर।
     */
    latitude?: number;
    longitude?: number;

    /**
     * बाइबल में इस स्थान का उल्लेख करने वाले संदर्भों की संख्या।
     */
    numberOfReferences: number;

    /**
     * उस स्थान का एपीआई लिंक।
     */
    thisPlaceApiLink: string;
}
```

## डेटासेट से स्थान प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

यह किसी एक स्थान के बारे में जानकारी प्राप्त करता है, जिसमें बाइबिल में उस स्थान का उल्लेख और उससे संबंधित लोग और घटनाएँ शामिल हैं।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।
-   `place` स्थान की आईडी (उदाहरण के लिए `jerusalem_636` )।

### संरचना

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * उस स्थान से संबंधित डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * उस स्थान के बारे में जानकारी।
     */
    place: DatasetPlace;

    /**
     * इस स्थान का एपीआई लिंक।
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * उस स्थान की आईडी।
     */
    id: string;

    /**
     * उस स्थान का नाम।
     */
    name: string;

    /**
     * किंग जेम्स वर्जन और इंग्लिश स्टैंडर्ड वर्जन में दिए गए स्थान का नाम।
     */
    kjvName?: string;
    esvName?: string;

    /**
     * इस स्थान को अन्य नामों से भी जाना जाता है।
     */
    aliases?: string[];

    /**
     * वह स्थान किस प्रकार की भौगोलिक विशेषता का है।
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * उस स्थान का अक्षांश और देशांतर, और उनकी सटीकता।
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * स्थान का विवरण। प्रत्येक पंक्ति एक पैराग्राफ है।
     */
    description?: string[];

    /**
     * डेटासेट के लेखकों द्वारा उस स्थान पर की गई टिप्पणी।
     */
    comment?: string;

    /**
     * इस स्थान की जड़ यहीं से है।
     * एक ही भौगोलिक स्थान के विभिन्न नामों का मूल स्थान एक ही होता है।
     */
    rootPlace?: DatasetEntityRef;

    /**
     * यह स्थान जिस स्थान की प्रतिकृति है।
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * वे लोग जो उस स्थान पर रहे हों, जहां उनका जन्म हुआ हो या जहां उनकी मृत्यु हुई हो।
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * उस स्थान पर घटी घटनाएँ।
     */
    events?: DatasetEntityRef[];

    /**
     * बाइबल में इस स्थान का उल्लेख करने वाले संदर्भों की सूची।
     * पुस्तक क्रम, अध्याय और श्लोक के अनुसार क्रमबद्ध।
     */
    references: VerseRef[];
}
```

### उदाहरण

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

## डेटासेट में घटनाओं की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

दिए गए डेटासेट के लिए उपलब्ध घटनाओं की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।

### संरचना

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * घटनाओं से संबंधित डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट के लिए उपलब्ध घटनाओं की सूची।
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * इवेंट की आईडी।
     */
    id: string;

    /**
     * आयोजन का नाम।
     */
    name: string;

    /**
     * जिस तारीख को यह कार्यक्रम शुरू हुआ था।
     * ऋणात्मक संख्याएँ ईसा पूर्व के वर्ष हैं। धनात्मक संख्याएँ ईस्वी के वर्ष हैं।
     * अधिक सटीक तिथियों के लिए `YYYY-MM-DD` प्रारूप का उपयोग किया जाता है।
     */
    startDate?: string;

    /**
     * इस घटना का वर्णन करने वाले बाइबल के संदर्भों की संख्या।
     */
    numberOfReferences: number;

    /**
     * इवेंट का एपीआई लिंक।
     */
    thisEventApiLink: string;
}
```

## डेटासेट से एक इवेंट प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

यह किसी एक घटना के बारे में जानकारी प्राप्त करता है, जिसमें बाइबिल के वे संदर्भ भी शामिल हैं जो इसका वर्णन करते हैं और इससे संबंधित लोग, स्थान और जनसमूह भी शामिल हैं।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।
-   `event` घटना की आईडी (उदाहरण के लिए `saul-is-converted_326` )।

### संरचना

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * इस घटना से संबंधित डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * इस आयोजन से संबंधित जानकारी।
     */
    event: DatasetEvent;

    /**
     * इस इवेंट का एपीआई लिंक।
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * इवेंट की आईडी।
     */
    id: string;

    /**
     * आयोजन का नाम।
     */
    name: string;

    /**
     * जिस तारीख को यह कार्यक्रम शुरू हुआ था।
     */
    startDate?: string;

    /**
     * आयोजन की अवधि।
     * उदाहरण के लिए, "1D" का अर्थ एक दिन है और "40Y" का अर्थ चालीस वर्ष है।
     */
    duration?: string;

    /**
     * इस कार्यक्रम में भाग लेने वाले लोग।
     */
    participants?: DatasetEntityRef[];

    /**
     * वे स्थान जहां यह घटना घटी।
     */
    locations?: DatasetEntityRef[];

    /**
     * इस आयोजन में भाग लेने वाले जनसमूह।
     */
    groups?: DatasetEntityRef[];

    /**
     * यह आयोजन जिस कार्यक्रम का हिस्सा है।
     */
    partOf?: DatasetEntityRef;

    /**
     * इस घटना से पहले घटी घटना।
     */
    predecessor?: DatasetEntityRef;

    /**
     * घटना का वर्णन करने वाले बाइबिल के संदर्भों की सूची।
     * पुस्तक क्रम, अध्याय और श्लोक के अनुसार क्रमबद्ध।
     */
    references: VerseRef[];
}
```

### उदाहरण

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

## डेटासेट में लोगों के समूहों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

दिए गए डेटासेट के लिए उपलब्ध लोगों के समूहों की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।

### संरचना

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * लोगों के समूहों के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट के लिए उपलब्ध लोगों के समूहों की सूची।
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * लोगों के समूह की आईडी।
     */
    id: string;

    /**
     * उस जनसमूह का नाम।
     */
    name: string;

    /**
     * उस जनसमूह के सदस्यों की संख्या।
     */
    numberOfMembers: number;

    /**
     * लोगों के समूह के लिए एपीआई लिंक।
     */
    thisPeopleGroupApiLink: string;
}
```

## डेटासेट से लोगों का समूह प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

यह किसी एक जनसमूह के बारे में जानकारी प्राप्त करता है, जिसमें उसके सदस्य और समूह द्वारा भाग लिए गए कार्यक्रम शामिल होते हैं।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `theographic` )।
-   `group` लोगों के समूह की आईडी (उदाहरण के लिए `tribe-of-benjamin` )।

### संरचना

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * लोगों के समूह के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * उस जनसमूह के बारे में जानकारी।
     */
    group: DatasetPeopleGroup;

    /**
     * इस समूह के लिए एपीआई लिंक।
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * लोगों के समूह की आईडी।
     */
    id: string;

    /**
     * उस जनसमूह का नाम।
     */
    name: string;

    /**
     * वे लोग जो उस जनसमूह के सदस्य हैं।
     */
    members?: DatasetEntityRef[];

    /**
     * वे आयोजन जिनमें उस जनसमूह ने भाग लिया था।
     */
    events?: DatasetEntityRef[];

    /**
     * बाइबल में इस जनसमूह का उल्लेख करने वाले संदर्भों की सूची।
     * पुस्तक क्रम, अध्याय और श्लोक के अनुसार क्रमबद्ध।
     */
    references: VerseRef[];
}
```

### उदाहरण

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

## अंतररेखीय डेटासेट

बेरेन इंटरलिनियर डेटासेट ( `bsb-interlinear` ) बाइबिल के प्रत्येक श्लोक के मूल भाषा (हिब्रू, अरामी और ग्रीक) शब्दों को मूल पाठ में उनके प्रकट होने के क्रम में सूचीबद्ध करता है। प्रत्येक शब्द का लिप्यंतरण, व्याकरणिक विश्लेषण, [स्ट्रॉन्ग संख्या](https://en.wikipedia.org/wiki/Strong%27s_Concordance) और वह अंग्रेजी वाक्यांश दिया गया है जिसका उपयोग [बेरेन स्टैंडर्ड बाइबिल](https://berean.bible) इसके लिए करती है।

यह डेटासेट अन्य डेटासेटों के समान एंडपॉइंट्स का उपयोग करता है:

-   `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` में 66 पुस्तकों की सूची दी गई है।
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (जैसे `/api/d/bsb-interlinear/GEN/1.json` ) अध्याय लौटाता है, प्रत्येक श्लोक के लिए `{ verse, words }` के साथ। प्रतिक्रिया एक [डेटासेट अध्याय](#get-a-chapter-from-a-dataset) है।

शब्द डेटा [बेरेन स्टैंडर्ड बाइबिल इंटरलिनियर तालिकाओं](https://bereanbible.com/) से आता है, जो सार्वजनिक डोमेन में हैं। शब्दों के लिए स्ट्रॉन्ग संख्याएँ [लेक्सिकॉन](#lexicon) ( `stepbible-lexicon` ) में देखी जाती हैं।

### संरचना

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * मूल पाठ के क्रम में शब्द की 1-आधारित रैंक।
     * शब्द इसी क्रम में सूचीबद्ध हैं।
     */
    pos: number;

    /**
     * बेरेन स्टैंडर्ड बाइबल के अंग्रेजी क्रम में शब्द का 1-आधारित स्थान।
     */
    bsbPos: number;

    /**
     * शब्दों की भाषा।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * मूल लिपि में मौजूद शब्द। एनएफसी-मानकीकृत।
     */
    text: string;

    /**
     * शब्द का लिप्यंतरण।
     */
    transliteration: string | null;

    /**
     * शब्द का संक्षिप्त व्याकरणिक पार्सिंग कोड। उदाहरण के लिए "N-mp" या "V-Qal-Perf-3ms"।
     */
    parsing: string | null;

    /**
     * शब्द का व्याकरणिक रूप से पूर्णतः विवेचन।
     */
    parsingFull: string | null;

    /**
     * शब्द का शून्य-पैडेड स्ट्रॉन्ग नंबर। उदाहरण के लिए "H0430" या "G3056"।
     * शून्य-पैडेड, जो कि केजेवी के `.words.json` मानों से मेल खाता है।
     * अन्य अनुवादों के मानों को जोड़ने से पहले शून्य-पैडिंग और प्रत्यय हटाने की आवश्यकता हो सकती है।
     * जब स्रोत शब्द को स्ट्रॉन्ग संख्या नहीं देता है तो यह शून्य होता है (यह कुछ ऐसे शब्दों के मामले में होता है जो प्रत्यय होते हैं, जैसे कि सर्वनाम प्रत्यय)।
     */
    strongs: string | null;

    /**
     * बेरेन स्टैंडर्ड बाइबल में इस शब्द के लिए प्रयुक्त अंग्रेजी वाक्यांश।
     * जब बीएसबी शब्द का अनुवाद नहीं करता है (जैसे कि हिब्रू प्रत्यक्ष वस्तु चिह्न), तो यह शून्य होता है।
     */
    gloss: string | null;
}
```

### उदाहरण

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

### शब्दों को अनुवादों से जोड़ना

इंटरलाइनर `strongs` मानों में शून्य पैडिंग की जाती है (जैसे `H0430` )। यह KJV के शब्द एनोटेशन ( `/api/eng_kjv/{book}/{chapter}.words.json` ) में `strongs` मानों से मेल खाता है। अन्य अनुवादों के मानों को जोड़ने से पहले शून्य पैडिंग और प्रत्यय हटाने की आवश्यकता हो सकती है (जैसे `H430` या `H1961a` से `H0430` और `H1961` )।

-   **केजेवी.** किंग जेम्स संस्करण ( `eng_kjv` और `eng_kja` ) के लिए, अध्याय की `.words.json` फ़ाइल में स्ट्रॉन्ग संख्याओं को उसी श्लोक के अंतर्पंक्ति शब्दों के `strongs` के साथ जोड़ें। उदाहरण के लिए, श्लोक 1 के लिए `/api/eng_kjv/GEN/1.words.json` में अंकित प्रत्येक स्ट्रॉन्ग संख्या ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) `/api/d/bsb-interlinear/GEN/1.json` में श्लोक 1 के शब्दों के बीच `strongs` मान के रूप में दिखाई देती है।
-   **बेरेन स्टैंडर्ड बाइबल।** प्रत्येक शब्द के `gloss` उस शब्द के लिए बीएसबी वाक्यांश है। श्लोक के शब्दों को `bsbPos` पढ़ें और प्रत्येक `gloss` का मिलान बीएसबी अनुवाद के पाठ से करें ताकि पता चल सके कि शब्द का अनुवाद कहाँ है।

दोनों स्रोतों की क्रमांकन प्रणाली हमेशा एक जैसी नहीं होती। उदाहरण के लिए, केजेवी में "था" को `G2258` के रूप में दर्शाया गया है, जबकि बेरेन तालिका में इसे `G1510` रूप में दर्शाया गया है। इस तरह के अंतरों के कारण कुछ संयोजन विफल हो जाते हैं।

### आरोपण

बेरेन इंटरलिनियर टेबल सार्वजनिक डोमेन में हैं। यह [लेक्सिकॉन](#lexicon) CC BY 4.0 लाइसेंस के तहत लाइसेंस प्राप्त है और इसके लिए श्रेय देना आवश्यक है।

## शब्दकोश

STEPBible लेक्सिकॉन डेटासेट ( `stepbible-lexicon` ) में कैम्ब्रिज के टिंडेल हाउस स्थित [STEPBible.org](https://www.stepbible.org/) से हिब्रू, अरामाइक और ग्रीक संक्षिप्त लेक्सिकॉन (TBESH और TBESG) शामिल हैं। इसमें प्रत्येक आधार स्ट्रॉन्ग संख्या के लिए एक प्रविष्टि है, और प्रत्येक प्रविष्टि में लेम्मा, लिप्यंतरण, शब्द भेद, अंग्रेजी व्याख्या और परिभाषा के साथ एक या अधिक अर्थ हैं।

किसी भी [अंतररेखीय शब्द](#interlinear-datasets) से प्राप्त शून्य-पैडेड `strongs` मान, जिसका शब्दकोश में प्रविष्टि है, को बिना पुनः स्वरूपण किए `/api/d/stepbible-lexicon/lexicon/{strongs}.json` पर देखा जा सकता है। यही बात KJV के `.words.json` मानों पर भी लागू होती है; अन्य अनुवादों के मानों के लिए पहले शून्य-पैडिंग और प्रत्यय हटाने की आवश्यकता हो सकती है। शब्दकोश द्वारा स्ट्रॉन्ग संख्या के बिना जोड़ी गई ग्रीक प्रविष्टियाँ प्रकाशित नहीं की जाती हैं।

डेटासेट जिनमें लेक्सिकॉन प्रविष्टियाँ शामिल हैं, उनकी प्रविष्टि में `listOfLexiconApiLink` और `totalNumberOfLexicon` शामिल हैं `/api/available_datasets.json` .

### आरोपण

शब्दकोश डेटा [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) लाइसेंस के तहत उपलब्ध है। यदि आप इसका उपयोग करते हैं, तो STEPBible.org / Tyndale House, Cambridge को श्रेय दें और किसी भी परिवर्तन का उल्लेख करें। डेटासेट की `licenseNotes` प्रॉपर्टी को श्रेय दिया जाता है।

## डेटासेट में लेक्सिकॉन प्रविष्टियों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

किसी डेटासेट के लिए उपलब्ध शब्दकोश प्रविष्टियों की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `stepbible-lexicon` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * शब्दकोश के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट के लिए उपलब्ध शब्दकोश प्रविष्टियों की सूची।
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * शब्दकोश प्रविष्टि का शून्य-पैडेड स्ट्रॉन्ग नंबर। उदाहरण: "H0430"।
     */
    id: string;

    /**
     * शब्दकोश प्रविष्टि की भाषा।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * शब्दकोश प्रविष्टि का नाम।
     * यह प्रविष्टि के प्रथम अर्थ का प्रमेय है।
     */
    name: string;

    /**
     * शब्दकोश प्रविष्टि के लिए एपीआई लिंक।
     */
    apiLink: string;
}
```

### उदाहरण

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

## डेटासेट से एक लेक्सिकॉन प्रविष्टि प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

इसमें एकल आधार वाले स्ट्रॉन्ग नंबर के लिए शब्दकोश प्रविष्टि शामिल है, जिसमें इसके सभी अर्थ शामिल हैं।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `stepbible-lexicon` )।
-   `strongs` शून्य-पैडेड स्ट्रॉन्ग संख्या है (उदाहरण के लिए हिब्रू शब्द _एलोहिम_ के लिए `H0430` , या ग्रीक शब्द _लोगोस_ के लिए `G3056` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * शब्दकोश प्रविष्टि के लिए डेटासेट जानकारी।
     */
    dataset: Dataset;

    /**
     * शब्दकोश प्रविष्टि।
     */
    entry: DatasetLexiconEntryContent;

    /**
     * इस शब्दकोश प्रविष्टि के लिए एपीआई लिंक।
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * प्रविष्टि का शून्य-पैडेड स्ट्रॉन्ग नंबर। उदाहरण के लिए "H0430"।
     */
    id: string;

    /**
     * प्रविष्टि की भाषा।
     * यह प्रविष्टि के पहले अर्थ की भाषा है।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * प्रविष्टि के अर्थ, पहचान क्रम में।
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * अर्थ की विस्तारित आईडी। उदाहरण के लिए "H0001G"।
     * जब संख्या का एक ही अर्थ होता है, तो यह आधार स्ट्रॉन्ग संख्या के बराबर होती है।
     */
    id: string;

    /**
     * इंद्रियों की भाषा।
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * मूल लिपि में अर्थ का प्रमेय।
     */
    lemma: string;

    /**
     * इस प्रश्न का लिप्यंतरण।
     */
    transliteration: string | null;

    /**
     * शब्दार्थ (रूपविज्ञान) का कोड जो उस शब्द का अर्थ बताता है।
     */
    partOfSpeech: string | null;

    /**
     * इस अर्थ का संक्षिप्त अंग्रेजी अनुवाद।
     */
    gloss: string | null;

    /**
     * अर्थ की परिभाषा को सादे पाठ के रूप में परिभाषित करना।
     * पैराग्राफों को खाली पंक्तियों द्वारा अलग किया गया है। मूल पाठ में मौजूद मार्कअप को हटा दिया गया है।
     */
    definition: string;
}
```

### उदाहरण

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

## आज का श्लोक

दिन का श्लोक डेटासेट ( `verse-of-the-day` ) प्रसिद्ध श्लोकों और छोटे अंशों (अधिकतम तीन श्लोक) की एक सुनियोजित सूची है जो "दिन का श्लोक" के लिए उपयुक्त हैं: वर्ष के प्रत्येक दिन के लिए 640 से अधिक और ईसाई त्योहारों के लिए 100 से अधिक। प्रत्येक श्लोक अपने आप में सार्थक है।

प्रत्येक दिन के लिए प्रत्येक श्लोक में एक से तीन श्रेणियां होती हैं, जिनमें से सबसे प्रासंगिक श्रेणी पहले आती है, इस निश्चित समूह से:

| पहचान         | विवरण                                                               |
| ------------- | ------------------------------------------------------------------- |
| `comfort`     | दुःख, संकट और अकेलेपन में ईश्वर की निकटता और देखभाल।                |
| `courage`     | दृढ़ रहना और भयभीत न होना।                                          |
| `faith`       | ईश्वर और उसके वादों पर भरोसा रखना।                                  |
| `forgiveness` | ईश्वर द्वारा पापों की क्षमा और दूसरों को क्षमा करना।                |
| `gratitude`   | ईश्वर का धन्यवाद करते हुए।                                          |
| `guidance`    | ईश्वर ही हमारे कदमों, योजनाओं और निर्णयों का मार्गदर्शन करता है।    |
| `hope`        | ईश्वर द्वारा वादा किए गए भविष्य पर विश्वास।                         |
| `inspiration` | धर्म के अनुसार जीवन जीने और अच्छे कार्य करने के लिए प्रोत्साहन।     |
| `joy`         | ईश्वर में आनंद और प्रसन्नता।                                        |
| `love`        | ईश्वर का हमारे प्रति प्रेम और हमारा ईश्वर और दूसरों के प्रति प्रेम। |
| `peace`       | विश्राम, शांति और चिंता से मुक्ति।                                  |
| `praise`      | ईश्वर की आराधना और उनकी महानता की घोषणाएँ।                          |
| `prayer`      | ईश्वर से प्रार्थना करना और उनकी प्रार्थना सुनना।                    |
| `provision`   | ईश्वर हमारी जरूरतों की पूर्ति करता है।                              |
| `salvation`   | उद्धार, अनुग्रह और मसीह में नया जीवन।                               |
| `strength`    | ईश्वर शक्ति और सहनशक्ति प्रदान करे।                                 |
| `wisdom`      | ईश्वरीय ज्ञान और जीवन के लिए व्यावहारिक निर्देश।                    |

त्योहारों की अपनी-अपनी श्रेणियां होती हैं। त्योहार के दिन, उस दिन का श्लोक त्योहार के श्लोकों में से एक होता है, और उन श्लोकों का उपयोग अन्य दिनों में नहीं किया जाता है। एक त्योहार आमतौर पर एक दिन का होता है; पुनरुत्थान रविवार के बाद का त्योहार पुनरुत्थान रविवार के बाद के तीन दिनों तक चलता है, इसलिए इसमें तीनों तिथियां शामिल होती हैं। प्रत्येक त्योहार श्रेणी में उसकी तिथियों के साथ `holiday` लिखा होता है: जो त्योहार हर साल एक ही तारीख को पड़ते हैं उनके साथ `month` और `day` लिखा होता है, और जिन त्योहारों की तिथि हर साल बदलती है (क्योंकि वे पुनरुत्थान रविवार या आगमन पर निर्भर करते हैं) उनके साथ ग्रेगोरियन कैलेंडर में `dates` लिखा होता है, जो 2026 से 2125 तक के लिए पहले से ही गणना किया गया होता है।

| पहचान                      | छुट्टी                   | तारीख                                 |
| -------------------------- | ------------------------ | ------------------------------------- |
| `epiphany`                 | एपिफेनी                  | 6 जनवरी                               |
| `ash-wednesday`            | ऐश बुधवार                | पुनरुत्थान रविवार से 46 दिन पहले      |
| `palm-sunday`              | महत्व रविवार             | पुनरुत्थान रविवार से पहले वाला रविवार |
| `maundy-thursday`          | पुण्य गुरुवार            | पुनरुत्थान रविवार से पहले का गुरुवार  |
| `good-friday`              | गुड फ्राइडे              | पुनरुत्थान रविवार से पहले का शुक्रवार |
| `resurrection-sunday`      | पुनरुत्थान रविवार        | ईस्टर रविवार                          |
| `post-resurrection-sunday` | पुनरुत्थान रविवार के बाद | पुनरुत्थान रविवार के बाद के तीन दिन   |
| `ascension-day`            | असेंशन दिवस              | पुनरुत्थान रविवार के 39 दिन बाद       |
| `pentecost`                | पेंटेकोस्ट               | पुनरुत्थान रविवार के 49 दिन बाद       |
| `all-hallows-eve`          | सभी पूज्य पूर्व संध्या   | 31 अक्टूबर                            |
| `all-saints-day`           | सभी संन्यासी दिवस        | 1 नवंबर                               |
| `advent-sunday`            | आगमन का पहला रविवार      | क्रिसमस से पहले का चौथा रविवार        |
| `christmas-eve`            | क्रिसमस की पूर्व संध्या  | 24 दिसंबर                             |
| `christmas`                | क्रिसमस                  | 25 दिसंबर                             |

इस डेटासेट में केवल संदर्भ शामिल हैं, श्लोक पाठ नहीं, इसलिए यह सभी अनुवादों के साथ काम करता है। श्लोक संख्याएँ मानक अंग्रेज़ी संख्या प्रणाली (BSB के समान) का उपयोग करती हैं। डेटा को तीन तरीकों से पढ़ा जा सकता है:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) यह फ़ाइल डेटासेट में मौजूद प्रत्येक श्लोक को उसकी श्रेणियों के साथ और छुट्टियों को उनकी तिथियों के साथ सूचीबद्ध करती है।
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) में एक श्रेणी के सभी श्लोक सूचीबद्ध हैं। किसी एक श्रेणी से दिन का श्लोक चुनने का यह सबसे आसान तरीका है।
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) अध्याय में उपस्थित उम्मीदवारों की सूची उनकी श्रेणियों सहित प्रस्तुत करता है। केवल वही अध्याय उपलब्ध हैं जिनमें कोई उम्मीदवार शामिल है; उन्हें खोजने के लिए पुस्तक के अध्याय लिंक या `/api/d/verse-of-the-day/books.json` उपयोग करें।

जिन डेटासेट में श्लोक श्रेणियां शामिल हैं, उनमें `/api/available_datasets.json` में प्रविष्टि में `listOfVersesApiLink` , `listOfCategoriesApiLink` और `totalNumberOfCategories` शामिल हैं।

### दिन का एक श्लोक चुनना

यह API स्थिर फ़ाइलों से बना है, इसलिए यह आपके लिए कोई श्लोक नहीं चुनता। इसके बजाय, श्लोक चुनने के लिए एक नियम है, ताकि इसका पालन करने वाला हर ऐप एक ही दिन एक ही श्लोक दिखाए। ऐप्स अलग-अलग श्लोक चुनने के लिए स्वतंत्र हैं; यह नियम केवल उन्हें एक साझा डिफ़ॉल्ट प्रदान करता है।

यह पद्धति `/api/d/verse-of-the-day/verses.json` में मौजूद श्लोकों और त्योहारों में से चुनाव करती है। किसी त्योहार के दिन, यह उस त्योहार के श्लोकों में से एक को चुनती है, और एक-एक वर्ष करके उनका उपयोग करती है, इस प्रकार हर साल एक त्योहार के लिए एक अलग श्लोक होता है जब तक कि उसके सभी श्लोक उपयोग में न आ जाएं। अन्य दिनों में, प्रत्येक वर्ष के लिए उस वर्ष उपयोग में आने वाले श्लोकों का अपना क्रम होता है (प्रत्येक श्लोक के संदर्भ, वर्ष और एक वैकल्पिक सीड के हैश द्वारा व्यवस्थित), और उस दिन का श्लोक उस क्रम में उस तारीख के दिन का श्लोक होता है। डेटासेट में हर साल उपयोग में आने वाले प्रत्येक दिन के लिए 366 से अधिक श्लोक हैं, इसलिए एक कैलेंडर वर्ष में कोई श्लोक दोहराया नहीं जाता, क्रम हर साल बदलता है, और एक ही तारीख के लिए हमेशा एक ही श्लोक होता है। नए श्लोक ( `addedIn` के साथ) जोड़े जाते हैं और पुराने ( `removedIn` के साथ) केवल उसी वर्ष से हटाए जाते हैं जो अभी शुरू नहीं हुआ है, इसलिए बीते हुए दिनों के लिए दिन का श्लोक कभी नहीं बदलता।

' [Verse of the Day Convention'](./verse-of-the-day-convention.md) पेज पर एल्गोरिदम को चरण दर चरण, स्यूडोकोड और परीक्षण मानों के साथ निर्दिष्ट किया गया है, ताकि आप इसे किसी भी भाषा में लागू कर सकें।

अपने खुद के क्रम का उपयोग करने के लिए, अपनी पसंद का एक सीड चुनें (उदाहरण के लिए, आपके ऐप का नाम): इससे समान गारंटी के साथ एक अलग शफल मिलता है। आप किसी एक श्रेणी के छंदों में से भी चुन सकते हैं, लेकिन प्रत्येक श्रेणी में वर्ष के दिनों की तुलना में कम छंद होते हैं, इसलिए इसके छंद जल्दी दोहराए जाते हैं।

SDK निम्नलिखित परंपरा का पालन करते हैं:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// YYYY-MM-DD प्रारूप में एक तिथि, या कोई अन्य तिथि (उसके स्थानीय कैलेंडर की तिथि का उपयोग किया जाता है)। डिफ़ॉल्ट रूप से आज की तिथि ली जाती है।
const ref = await api.getVerseOfTheDay('2026-01-01');

// श्लोक का मूल पाठ किसी अनुवाद से प्राप्त करें।
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` विकल्प में छंदों की सूची डाउनलोड की जाती है और उसमें से छंद चुने जाते हैं। `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` विकल्प में आपके पास पहले से मौजूद सूची में से छंद चुने जाते हैं।
-   कोटलिन एसडीके में `getVerseOfTheDay(date?, seed?, category?)` और `pickVerseOfTheDay(verses, date?, seed?, category?)` हैं, जो दिनांक को `YYYY-MM-DD` स्ट्रिंग के रूप में लेते हैं।
-   स्विफ्ट एसडीके में `getVerseOfTheDay(date:seed:category:)` और `pickVerseOfTheDay(_:date:seed:category:holidays:)` हैं, जो दिनांक को `YYYY-MM-DD` स्ट्रिंग या `Date` के रूप में लेते हैं (वर्तमान समय क्षेत्र में इसकी कैलेंडर तिथि का उपयोग किया जाता है)।
-   [एमसीपी सर्वर में](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) एक `getVerseOfTheDay` टूल है जो दिन की कविता को उसके पाठ सहित लौटाता है।
-   `@helloao/tools` पैकेज में वही सूची है और `@helloao/tools/generation/verse-of-the-day.js` में `getVerseOfTheDay(date?, { seed?, category? }?)` फ़ंक्शन है।

### लाइसेंस

यह सूची एओ लैब द्वारा संकलित की गई है और [एमआईटी लाइसेंस](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) के तहत जारी की गई है। श्लोक का पाठ उस अनुवाद से लिया गया है जिससे आप इसे प्राप्त करते हैं।

## डेटासेट में छंदों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

यह किसी डेटासेट में मौजूद प्रत्येक श्लोक (या लघु अंश) को, उसके संबंधित श्रेणियों के साथ, मानक क्रम में प्राप्त करता है। यह सुविधा केवल उन डेटासेट के लिए उपलब्ध है जिनके श्लोकों में श्रेणियां होती हैं, जैसे कि `verse-of-the-day` ।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `verse-of-the-day` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * श्लोकों के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट में प्रत्येक श्लोक (या छोटा अंश), उसकी श्रेणियों सहित, मानक क्रम में।
     */
    verses: DatasetCategorizedVerse[];

    /**
     * वे त्यौहार जिनके अपने-अपने श्लोक और तिथियां हैं।
     * यदि डेटासेट में कोई छुट्टियां नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * छुट्टी की श्रेणी का आईडी। उदाहरण के लिए, "क्रिसमस"।
     */
    id: string;

    /**
     * छुट्टी का अंग्रेजी नाम। उदाहरण के लिए, "क्रिसमस"।
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * वह महीना (जनवरी के लिए 1) और वह दिन जिसमें हर साल एक ही तारीख को छुट्टी पड़ती है।
     * उन छुट्टियों के लिए इसे छोड़ दिया जाता है जिनकी तारीख हर साल बदलती है।
     */
    month?: number;
    day?: number;

    /**
     * एक ऐसे अवकाश की तिथियां (वर्ष-माह-दिन, ग्रेगोरियन कैलेंडर के अनुसार) जो हर साल बदलती हैं, क्रमानुसार।
     * इन तिथियों की गणना वर्षों की एक निश्चित अवधि (वर्तमान में 2026 से 2125 तक) के लिए पहले से ही कर ली जाती है, और यह अवकाश केवल सूचीबद्ध तिथियों पर ही मनाया जाता है।
     * उन छुट्टियों के लिए इसे छोड़ दिया जाता है जो हर साल एक ही तारीख पर पड़ती हैं।
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * पुस्तक की आईडी। उदाहरण के लिए, "PRO"।
     */
    book: string;

    /**
     * अध्याय संख्या।
     */
    chapter: number;

    /**
     * श्लोक संख्या।
     * यदि `endVerse` मौजूद है, तो यह वह श्लोक है जहाँ से अंश शुरू होता है।
     */
    verse: number;

    /**
     * वह श्लोक जिस पर यह अंश समाप्त होता है।
     * यदि प्रविष्टि एक ही श्लोक की है तो इसे छोड़ दिया जाएगा।
     */
    endVerse?: number;

    /**
     * श्लोक जिस श्रेणी से संबंधित है, उसकी आईडी, सबसे प्रासंगिक श्रेणी से शुरू करते हुए।
     */
    categories: string[];

    /**
     * यह पहला वर्ष है जब इस श्लोक को दिन का श्लोक बनाया जा सकता है।
     * यदि श्लोक हमेशा से सूची में रहा हो तो उसे छोड़ दिया जाएगा।
     */
    addedIn?: number;

    /**
     * वह पहला वर्ष जब यह श्लोक अब दिन का श्लोक नहीं रह सकता।
     * हटाए गए छंद डेटासेट में बने रहते हैं ताकि पिछले वर्षों के छंदों को अभी भी चुना जा सके।
     * यदि श्लोक को सूची से नहीं हटाया गया है तो इसे छोड़ दिया जाएगा।
     */
    removedIn?: number;
}
```

### उदाहरण

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

## डेटासेट में श्रेणियों की सूची बनाएं

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

किसी डेटासेट के लिए उपलब्ध श्लोक श्रेणियों की सूची प्राप्त करता है।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `verse-of-the-day` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * श्रेणियों के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * डेटासेट के लिए उपलब्ध छंद श्रेणियों की सूची।
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * श्रेणी की आईडी। उदाहरण के लिए, "आशा"।
     */
    id: string;

    /**
     * श्रेणी का अंग्रेजी नाम। उदाहरण: "Hope"।
     */
    name: string;

    /**
     * इस श्रेणी में शामिल छंदों का विषय क्या है, इसका विवरण।
     */
    description: string;

    /**
     * उस श्रेणी में आने वाले श्लोकों (या छोटे अंशों) की संख्या।
     */
    numberOfVerses: number;

    /**
     * उस श्रेणी से संबंधित अवकाश की तिथियां (ऊपर DatasetCategoryHoliday देखें)।
     * उन श्रेणियों के लिए इसे छोड़ दिया गया है जो किसी छुट्टी से संबंधित नहीं हैं।
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * इस श्रेणी के लिए एपीआई लिंक।
     */
    apiLink: string;
}
```

### उदाहरण

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

## डेटासेट से श्रेणी प्राप्त करें

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

इसमें एक ही श्लोक श्रेणी होती है, जिसमें उससे संबंधित सभी श्लोक शामिल होते हैं।

-   `dataset` डेटासेट की आईडी (उदाहरण के लिए `verse-of-the-day` )।
-   `category` श्रेणी की आईडी है (उदाहरण के लिए `hope` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * इस श्रेणी के लिए डेटासेट की जानकारी।
     */
    dataset: Dataset;

    /**
     * वह श्रेणी, और उससे संबंधित छंद।
     */
    category: DatasetCategory;

    /**
     * इस श्रेणी के लिए एपीआई लिंक।
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * श्रेणी की आईडी। उदाहरण के लिए, "आशा"।
     */
    id: string;

    /**
     * श्रेणी का अंग्रेजी नाम। उदाहरण: "Hope"।
     */
    name: string;

    /**
     * इस श्रेणी में शामिल छंदों का विषय क्या है, इसका विवरण।
     */
    description: string;

    /**
     * उस अवकाश की तिथियां जिसके लिए यह श्रेणी है (डेटासेट में छंदों की सूची में "डेटासेटश्रेणीछुट्टी" देखें)।
     * उन तारीखों पर, उस दिन का श्लोक उस श्रेणी के श्लोकों में से एक होता है, और उनका उपयोग अन्य दिनों में नहीं किया जाता है।
     * उन श्रेणियों के लिए इसे छोड़ दिया गया है जो किसी छुट्टी से संबंधित नहीं हैं।
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * वे श्लोक (या छोटे अंश) जो इस श्रेणी में आते हैं, विधिक क्रम में।
     * इसमें वे छंद शामिल हैं जिन्हें सूची से हटा दिया गया है (देखें `removedIn` )।
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * पुस्तक की आईडी। उदाहरण के लिए "JER"।
     */
    book: string;

    /**
     * अध्याय संख्या।
     */
    chapter: number;

    /**
     * श्लोक संख्या।
     * यदि `endVerse` मौजूद है, तो यह वह श्लोक है जहाँ से अंश शुरू होता है।
     */
    verse: number;

    /**
     * वह श्लोक जिस पर यह अंश समाप्त होता है।
     * यदि संदर्भ केवल एक श्लोक का है तो इसे छोड़ दिया जाएगा।
     */
    endVerse?: number;

    /**
     * यह पहला वर्ष है जब इस श्लोक को दिन का श्लोक बनाया जा सकता है।
     * यदि श्लोक हमेशा से सूची में रहा हो तो उसे छोड़ दिया जाएगा।
     */
    addedIn?: number;

    /**
     * वह पहला वर्ष जब यह श्लोक अब दिन का श्लोक नहीं रह सकता।
     * हटाए गए छंद डेटासेट में बने रहते हैं ताकि पिछले वर्षों के छंदों को अभी भी चुना जा सके।
     * यदि श्लोक को सूची से नहीं हटाया गया है तो इसे छोड़ दिया जाएगा।
     */
    removedIn?: number;
}
```

### उदाहरण

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
