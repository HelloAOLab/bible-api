# अनुवाद, पुस्तकें और अध्याय

अनुवादों को ब्राउज़ करने, उनकी पुस्तकों को सूचीबद्ध करने और अध्याय की सामग्री प्राप्त करने के लिए एंडपॉइंट।

अध्याय की सामग्री, संपूर्ण अनुवाद डाउनलोड और शब्द-स्तरीय टिप्पणियाँ प्रत्येक दो प्रारूपों में उपलब्ध हैं:

-   [**मानक प्रारूप**](./standard.md) - मूल, संरचित प्रारूप। कविता की सामग्री उन अंशों (साधारण पाठ, स्वरूपित पाठ, फुटनोट संदर्भ आदि) की सूची है जिन्हें आप स्वयं संकलित करते हैं।
-   [**सरलीकृत प्रारूप**](./simplified.md) - एक सपाट प्रारूप जहां प्रत्येक श्लोक की सामग्री एक एकल स्ट्रिंग होती है, जिसमें फुटनोट, कविता और अन्य मार्कअप को उस स्ट्रिंग में ऑफसेट के रूप में व्यक्त किया जाता है।

आप जिस भी फॉर्मेट का उपयोग टेक्स्ट को प्रस्तुत करने या प्रोसेस करने की योजना बना रहे हैं, उसके लिए सबसे उपयुक्त फॉर्मेट का उपयोग करें।

## उपलब्ध अनुवाद

`GET https://bible.helloao.org/api/available_translations.json`

API में उपलब्ध अनुवादों की सूची प्राप्त करता है।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

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

### संरचना

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * अनुवादों की सूची।
     */
    translations: Translation[];
}

interface Translation {
    /**
     * अनुवाद की आईडी।
     */
    id: string;

    /**
     * अनुवाद का नाम।
     * यह आमतौर पर अनुवाद की भाषा में अनुवाद का नाम होता है।
     */
    name: string;

    /**
     * अनुवाद का अंग्रेजी नाम।
     */
    englishName: string;

    /**
     * अनुवाद के लिए वेबसाइट।
     */
    website: string;

    /**
     * अनुवाद के लाइसेंस का URL यहाँ उपलब्ध है।
     */
    licenseUrl: string;

    /**
     * अनुवाद का संक्षिप्त नाम।
     */
    shortName: string;

    /**
     * यह अनुवाद मुख्य रूप से ISO 639 3-अक्षर वाले भाषा टैग में किया गया है।
     */
    language: string;

    /**
     * यह उस भाषा का नाम प्राप्त करता है जिसमें अनुवाद किया जा रहा है।
     * यदि भाषा का नाम ज्ञात नहीं है तो मान शून्य या अपरिभाषित होगा।
     */
    languageName?: string;

    /**
     * यह भाषा का नाम अंग्रेजी में प्राप्त करता है।
     * यदि भाषा का कोई अंग्रेजी नाम नहीं है तो मान शून्य या अपरिभाषित होगा।
     */
    languageEnglishName?: string;

    /**
     * जिस दिशा में भाषा लिखी जाती है।
     * "ltr" का अर्थ है कि पाठ पृष्ठ के बाईं ओर से दाईं ओर लिखा गया है।
     * "rtl" का अर्थ है कि पाठ पृष्ठ के दाहिने भाग से बाएं भाग की ओर लिखा गया है।
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * उपलब्ध प्रारूपों की सूची।
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * इस अनुवाद के लिए उपलब्ध पुस्तकों की सूची का एपीआई लिंक।
     */
    listOfBooksApiLink: string;

    /**
     * इस अनुवाद में शामिल पुस्तकों की संख्या।
     *
     * पूर्ण अनुवादों में बाइबिल के समान पुस्तकों की संख्या होनी चाहिए (66)।
     */
    numberOfBooks: number;

    /**
     * इस अनुवाद में शामिल अध्यायों की कुल संख्या।
     *
     * पूर्ण अनुवादों में बाइबिल के समान अध्यायों की संख्या होनी चाहिए (1,189)।
     */
    totalNumberOfChapters: number;

    /**
     * इस अनुवाद में शामिल छंदों की कुल संख्या।
     *
     * पूर्ण अनुवादों में बाइबिल के समान ही छंदों की संख्या होनी चाहिए (लगभग 31,102 - कुछ अनुवाद मूल स्रोत ग्रंथों में मौजूद होने की स्पष्ट संभावना के आधार पर छंदों को छोड़ देते हैं)।
     */
    totalNumberOfVerses: number;

    /**
     * इस अनुवाद में शामिल अपोक्रिफ़ल पुस्तकों की कुल संख्या।
     * यदि अनुवाद में अपोक्रिफा शामिल नहीं है तो इसे छोड़ दिया जाएगा।
     */
    numberOfApocryphalBooks?: number;

    /**
     * इस अनुवाद में शामिल अपोक्रिफ़ल अध्यायों की कुल संख्या।
     * यदि अनुवाद में अपोक्रिफा शामिल नहीं है तो इसे छोड़ दिया जाएगा।
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * इस अनुवाद में शामिल अपोक्रिफ़ल छंदों की कुल संख्या।
     * यदि अनुवाद में अपोक्रिफा शामिल नहीं है तो इसे छोड़ दिया जाएगा।
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### उदाहरण

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

## अनुवाद में पुस्तकों की सूची

`GET https://bible.helloao.org/api/{translation}/books.json`

दिए गए अनुवाद के लिए उपलब्ध पुस्तकों की सूची प्राप्त करता है।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// बीएसबी अनुवाद के लिए पुस्तकों की सूची प्राप्त करें
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

### संरचना

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * पुस्तकों के अनुवाद संबंधी जानकारी।
     */
    translation: Translation;

    /**
     * अनुवाद के लिए उपलब्ध पुस्तकों की सूची।
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * पुस्तक की आईडी।
     */
    id: string;

    /**
     * अनुवाद के आधार पर पुस्तक को दिया गया नाम।
     */
    name: string;

    /**
     * पुस्तक का सामान्य नाम।
     */
    commonName: string;

    /**
     * पुस्तक का शीर्षक।
     * यह आमतौर पर पुस्तक के नाम का अधिक वर्णनात्मक रूप होता है।
     * यदि उपलब्ध नहीं है, तो अनुवाद द्वारा इसे प्रदान नहीं किया गया है।
     */
    title: string | null;

    /**
     * अनुवाद में पुस्तक का संख्यात्मक क्रम।
     */
    order: number;

    /**
     * पुस्तक में मौजूद अध्यायों की संख्या।
     */
    numberOfChapters: number;

    /**
     * पुस्तक के पहले अध्याय की संख्या।
     */
    firstChapterNumber: number;

    /**
     * पुस्तक के पहले अध्याय का लिंक।
     */
    firstChapterApiLink: string;

    /**
     * पुस्तक के अंतिम अध्याय की संख्या।
     */
    lastChapterNumber: number;

    /**
     * पुस्तक के अंतिम अध्याय का लिंक।
     */
    lastChapterApiLink: string;

    /**
     * पुस्तक में मौजूद श्लोकों की संख्या।
     */
    totalNumberOfVerses: number;

    /**
     * क्या यह पुस्तक एक अपोक्रिफाइस पुस्तक है?
     * यदि अनुवाद प्रामाणिक है तो इसे छोड़ दिया जाएगा।
     */
    isApocryphal?: boolean;
}
```

### उदाहरण

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
