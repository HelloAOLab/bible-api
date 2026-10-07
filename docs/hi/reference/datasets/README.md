# डेटासेट

पूरक बाइबिल डेटासेट - जैसे कि क्रॉस रेफरेंस और बाइबिल संबंधी संस्थाएं (लोग, स्थान, घटनाएं और जनसमूह) - को ब्राउज़ करने और उनकी पुस्तकों, अध्याय सामग्री और संस्थाओं को प्राप्त करने के लिए एंडपॉइंट।

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
     */
    totalNumberOfReferences: number;

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

क्रॉस रेफरेंस डेटासेट (जैसे कि `open-cross-ref` ) के लिए, अध्याय में प्रत्येक श्लोक के लिए क्रॉस रेफरेंस की सूची होती है। एंटिटी डेटासेट (जैसे कि `theographic` ) के लिए, अध्याय में वे लोग, स्थान और घटनाएँ होती हैं जो उस अध्याय में दिखाई देती हैं - [अध्याय में एंटिटी प्राप्त करें](#get-the-entities-in-a-chapter) देखें।

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

interface DatasetVerse {
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
