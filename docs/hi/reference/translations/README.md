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
     * लाइसेंस के लिए एपीआई द्वारा जोड़े गए नोट्स।
     * यदि कोई नोट्स नहीं हैं तो यह शून्य या अपरिभाषित होगा।
     */
    licenseNotes?: string | null;

    /**
     * अनुवादित सामग्री प्रदर्शित करते समय प्रदर्शित होने वाली सूचना।
     * यदि अनुवाद में कोई सूचना नहीं है तो मान शून्य या अपरिभाषित होगा।
     */
    licenseNotice?: string | null;

    /**
     * अनुवाद के लिए पहचानी गई संरचित लाइसेंस शर्तें।
     * यदि शर्तों का निर्धारण नहीं किया जा सका तो शून्य या अपरिभाषित।
     * उस स्थिति में, शर्तों के लिए लाइसेंस यूआरएल पर स्थित पृष्ठ देखें।
     */
    license?: License | null;

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

/**
 * यह अनुवाद के लिए पहचाने गए संरचित लाइसेंस शर्तों को परिभाषित करता है।
 */
interface License {
    /**
     * क्या अनुवाद का उपयोग करते समय मूल स्रोत का उल्लेख करना आवश्यक है?
     */
    attribution: 'required' | 'not-required';

    /**
     * क्या अनुवाद का व्यावसायिक उपयोग अनुमत है?
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * क्या अनुवाद से व्युत्पन्न कृतियों का निर्माण और वितरण करना अनुमत है?
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * क्या व्युत्पन्न कार्यों को समान लाइसेंस के तहत वितरित किया जाना चाहिए (अर्थात "शेयर-अलाइक" आवश्यकता)?
     */
    copyleft: boolean;

    /**
     * क्या अनुवाद को सार्वजनिक डोमेन में समर्पित किया गया है?
     */
    publicDomain: boolean;
}
```

### लाइसेंस

प्रत्येक अनुवाद अपने स्वयं के लाइसेंस के तहत प्रकाशित होता है, इसलिए इसका उपयोग करने से पहले अनुवाद की शर्तों की जांच कर लें।

-   `licenseUrl` हमेशा पूर्ण लाइसेंस शर्तों से लिंक करता है।
-   यदि मौजूद हो, तो `licenseNotice` अनुवाद की सामग्री के साथ प्रदर्शित करने के लिए कॉपीराइट या श्रेय सूचना है।
-   `licenseNotes` में एपीआई द्वारा जोड़े गए नोट्स शामिल हैं, जैसे कि मूल पाठ में किए गए परिवर्तन।
-   `license` , यदि मौजूद हो, तो शर्तों को ऐसे रूप में सारांशित करता है जिसे आपका कोड जांच सकता है। उदाहरण के लिए, आप सूची को उन अनुवादों तक सीमित कर सकते हैं जो व्यावसायिक उपयोग की अनुमति देते हैं:

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

`license` का मान केवल तभी निर्धारित किया जाता है जब शब्दों का स्वचालित रूप से पता लगाया जा सके। इसके बिना किए गए अनुवाद भी आपके उपयोग की अनुमति दे सकते हैं, इसलिए उनके लिए पृष्ठ `licenseUrl` पर दी गई जानकारी पढ़ें।

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
     * अनुवाद द्वारा पुस्तक को दिया गया संक्षिप्त नाम (संक्षिप्त रूप)।
     * यदि उपलब्ध नहीं है, तो अनुवाद द्वारा इसे प्रदान नहीं किया गया है।
     */
    shortName?: string;

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
