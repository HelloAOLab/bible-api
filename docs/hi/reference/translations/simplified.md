# सरलीकृत प्रारूप

अध्यायों, पूर्ण अनुवाद डाउनलोड और शब्द-स्तरीय टिप्पणियों के लिए सरलीकृत प्रारूप। अनुवाद और पुस्तक सूची के अंतिम बिंदुओं के लिए [अनुवाद, पुस्तकें और अध्याय](./README.md) देखें, या इसी सामग्री के मूल, संरचित निरूपण के लिए [मानक प्रारूप](./standard.md) देखें।

## अनुवाद से सरलीकृत अध्याय प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

यह सरलीकृत प्रारूप का उपयोग करके किसी दी गई पुस्तक और अनुवाद के एक अध्याय की सामग्री प्राप्त करता है।

सरलीकृत प्रारूप में, प्रत्येक श्लोक की सामग्री स्वरूपित सामग्री की सूची के बजाय एक एकल स्ट्रिंग होती है। इसका अर्थ है कि आपको श्लोक का पाठ स्वयं बनाने की आवश्यकता नहीं है, जिसे सही ढंग से लिखना आसान नहीं होता - विशेष रूप से रिक्ति के मामले में। ऐसी कोई भी चीज़ जिसे एक साधारण स्ट्रिंग द्वारा प्रदर्शित नहीं किया जा सकता - जैसे कि फुटनोट, यीशु के वचन, कविता और श्लोक के मध्य में आने वाले शीर्षक - उस स्ट्रिंग में एक ऑफसेट के रूप में रखी जाती है, इसलिए कुछ भी खोता नहीं है।

अध्याय का पूरा पाठ देखने के लिए इस एंडपॉइंट का उपयोग करें। अध्याय को उसके मूल स्वरूप में प्रदर्शित करने के लिए [नियमित अध्याय एंडपॉइंट का](./standard.md#get-a-chapter-from-a-translation) उपयोग करें।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` - आप [यहां](https://ubsicap.github.io/usfm/identification/books.html) पुस्तक आईडी की सूची पा सकते हैं)।
-   `chapter` संख्यात्मक अध्याय है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।

जिन अध्यायों में शब्द-स्तरीय एनोटेशन हैं, वे `thisChapterWordsLink` से लिंक होते हैं, जो [सरलीकृत एनोटेशन की](#get-the-words-of-a-chapter-in-the-simplified-format) ओर इशारा करता है - वे एनोटेशन जिनके ऑफसेट इस फ़ाइल में टेक्स्ट से मेल खाते हैं।

जिन अध्यायों में प्रति-पाठक ऑडियो समय होता है, उन्हें `thisChapterAudioTimings` से लिंक किया जाता है, जो [ऑडियो समय एंडपॉइंट की](./standard.md#get-the-audio-timings-for-a-chapter) ओर इशारा करता है - वही फ़ाइल जिससे नियमित अध्याय एंडपॉइंट लिंक होता है, क्योंकि समय अध्याय प्रारूप पर निर्भर नहीं करता है।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// उत्पत्ति अध्याय 1 का पाठ बीएसबी अनुवाद से प्राप्त करें।
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`)
    .then(request => request.json())
    .then(chapter => {
        for (let content of chapter.chapter.content) {
            if (content.type === 'verse') {
                console.log(`${content.number}. ${content.text}`);
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
```

:::

### ऑफसेट

सरलीकृत प्रारूप में सभी ऑफ़सेट - `offset` , `start` और `end` - उस श्लोक के `text` के सूचकांक हैं जिसमें वे मौजूद हैं। इन्हें UTF-16 कोड इकाइयों में मापा जाता है, जिनका उपयोग जावास्क्रिप्ट के `String.prototype.length` और `String.prototype.slice()` भाग में किया जाता है।

`start` समावेशी है और `end` अनन्य है, इसलिए `text.slice(start, end)` चिह्नित पाठ की सटीक सीमा लौटाता है। फुटनोट ऑफसेट वह स्थिति है जहां फुटनोट का कॉलर स्थित होता है, इसलिए `text.slice(0, offset)` उससे पहले आने वाला पाठ है।

### संरचना

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * पुस्तक के अध्याय के अनुवाद संबंधी जानकारी।
     */
    translation: Translation;

    /**
     * पुस्तक के अध्याय से संबंधित पुस्तक की जानकारी।
     */
    book: TranslationBook;

    /**
     * वर्तमान अध्याय का लिंक।
     */
    thisChapterLink: string;

    /**
     * इस अध्याय के नियमित (सरलीकृत नहीं) संस्करण का लिंक।
     */
    fullChapterApiLink: string;

    /**
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के लिंक।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के ऑडियो समय के लिंक यहां दिए गए हैं।
     * मानक प्रारूप दस्तावेज़ों में "किसी अध्याय के लिए ऑडियो समय प्राप्त करें" देखें - समय फ़ाइल वही रहती है चाहे उससे कोई भी अध्याय प्रारूप जुड़ा हो।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * सरल प्रारूप में अगले अध्याय का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterApiLink: string | null;

    /**
     * अगले अध्याय के विभिन्न ऑडियो संस्करणों के लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * अगले अध्याय के विभिन्न ऑडियो संस्करणों के ऑडियो समय के लिंक यहां दिए गए हैं।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * सरल प्रारूप में पिछले अध्याय का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterApiLink: string | null;

    /**
     * पिछले अध्याय के विभिन्न ऑडियो संस्करणों के लिंक।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * पिछले अध्याय के विभिन्न ऑडियो संस्करणों के ऑडियो समय के लिंक यहां दिए गए हैं।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * अध्याय में मौजूद श्लोकों की संख्या।
     */
    numberOfVerses: number;

    /**
     * इस अध्याय की जानकारी।
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * अध्याय संख्या।
     */
    number: number;

    /**
     * अध्याय की विषयवस्तु।
     */
    content: SimpleChapterContent[];

    /**
     * उन फुटनोटों की सूची जिन्हें किसी श्लोक से संबद्ध नहीं किया जा सका।
     * श्लोक से संबंधित फुटनोट उसी श्लोक में शामिल किए जाते हैं, इसलिए यह सूची आमतौर पर खाली होती है।
     */
    footnotes: ChapterFootnote[];
}

/**
 * एक यूनियन प्रकार जो सरलीकृत अध्याय में सामग्री के एक ही भाग का प्रतिनिधित्व करता है।
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * अध्याय का शीर्षक।
 */
interface SimpleChapterHeading {
    /**
     * यह इंगित करता है कि सामग्री एक शीर्षक को दर्शाती है।
     */
    type: 'heading';

    /**
     * शीर्षक का पाठ।
     */
    text: string;
}

/**
 * अध्याय में पंक्ति विराम।
 */
interface ChapterLineBreak {
    /**
     * यह दर्शाता है कि सामग्री एक पंक्ति विराम का प्रतिनिधित्व करती है।
     */
    type: 'line_break';
}

/**
 * एक अध्याय का एक श्लोक।
 */
interface SimpleChapterVerse {
    /**
     * यह इंगित करता है कि विषयवस्तु एक श्लोक है।
     */
    type: 'verse';

    /**
     * श्लोक की संख्या।
     */
    number: number;

    /**
     * श्लोक का पाठ।
     * कविता की पंक्तियाँ और पंक्ति विराम नए अक्षर (\n) द्वारा अलग किए जाते हैं।
     */
    text: string;

    /**
     * श्लोक में आने वाले फुटनोट।
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * श्लोक के मध्य में आने वाले शीर्षक।
     * यदि श्लोक में कोई शीर्षक नहीं है तो इसे छोड़ दिया जाएगा।
     */
    headings?: SimpleInlineHeading[];

    /**
     * श्लोक के वे अंश जो यीशु के वचनों का प्रतिनिधित्व करते हैं।
     * यदि श्लोक में इसका उल्लेख नहीं है तो इसे छोड़ दिया जाएगा।
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * कविता की पंक्तियों को दर्शाने वाले पद्य पाठ की श्रेणियां।
     * यदि श्लोक में इसका उल्लेख नहीं है तो इसे छोड़ दिया जाएगा।
     */
    poem?: SimplePoemRange[];
}

/**
 * अध्याय में हिब्रू उपशीर्षक।
 * इन्हें अक्सर मूल पांडुलिपियों में मौजूद सूचनात्मक सामग्री के रूप में शामिल किया जाता है।
 * उदाहरण के लिए, भजन संहिता 49 का हिब्रू उपशीर्षक है "संगीत निर्देशक के लिए। कोरह के पुत्रों का भजन।"
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * यह दर्शाता है कि सामग्री हिब्रू उपशीर्षक का प्रतिनिधित्व करती है।
     */
    type: 'hebrew_subtitle';
}

/**
 * श्लोक में दिया गया एक फुटनोट।
 */
interface SimpleVerseFootnote {
    /**
     * नोट की आईडी।
     */
    noteId: number;

    /**
     * श्लोक के पाठ में वह अनुक्रमणिका जहां फुटनोट कॉलर को सम्मिलित किया जाना चाहिए।
     */
    offset: number;

    /**
     * फुटनोट का पाठ।
     */
    text: string;

    /**
     * फुटनोट के लिए जिस कॉलर का उपयोग किया जाना चाहिए।
     * यदि "+" है, तो कॉलर स्वतः उत्पन्न होना चाहिए।
     * यदि null है, तो कॉलर खाली होना चाहिए।
     * यदि यह एक स्ट्रिंग है, तो कॉलर भी वही स्ट्रिंग होनी चाहिए।
     */
    caller: '+' | string | null;
}

/**
 * एक शीर्षक जो किसी श्लोक में अंतर्निहित हो।
 */
interface SimpleInlineHeading {
    /**
     * श्लोक पाठ में वह अनुक्रमणिका जहाँ शीर्षक आता है।
     */
    offset: number;

    /**
     * शीर्षक का पाठ।
     */
    text: string;
}

/**
 * श्लोक के भीतर पाठ की एक श्रेणी।
 */
interface SimpleTextRange {
    /**
     * श्रेणी के पहले अक्षर का सूचकांक।
     */
    start: number;

    /**
     * रेंज के अंतिम अक्षर के बाद का इंडेक्स।
     */
    end: number;
}

/**
 * कविता की एक पंक्ति को दर्शाने वाला श्लोक के भीतर का पाठ।
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * कविता की पंक्ति को प्रदर्शित करने के लिए आवश्यक इंडेंट का स्तर।
     */
    level: number;
}
```

### उदाहरण

```json:no-line-numbers title="/api/BSB/GEN/1.simple.json"
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
    "book": {
        "id": "GEN",
        "name": "Genesis",
        "commonName": "Genesis",
        "title": "Genesis",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterApiLink": "/api/BSB/GEN/1.json",
        "lastChapterApiLink": "/api/BSB/GEN/50.json",
        "totalNumberOfVerses": 1533
    },
    "thisChapterLink": "/api/BSB/GEN/1.simple.json",
    "fullChapterApiLink": "/api/BSB/GEN/1.json",
    "thisChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 1
    },
    "thisChapterAudioLinks": {
        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
    },
    "thisChapterAudioTimings": {
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json",
        "david": "/api/BSB/GEN/1.david.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.simple.json",
    "nextChapterReference": {
        "translationId": "BSB",
        "book": "GEN",
        "chapter": 2
    },
    "nextChapterAudioTimings": {
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json",
        "david": "/api/BSB/GEN/2.david.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterReference": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "text": "The Creation"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "text": "In the beginning God created the heavens and the earth.",
                "footnotes": []
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "text": "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "footnotes": []
            },
            {
                "type": "heading",
                "text": "The First Day"
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "text": "And God said, “Let there be light,” and there was light.",
                "footnotes": [
                    {
                        "noteId": 0,
                        "offset": 35,
                        "text": "Cited in 2 Corinthians 4:6",
                        "caller": "+"
                    }
                ]
            }
        ],
        "footnotes": []
    }
}
```

कविता और यीशु के वचन को श्लोक पाठ पर श्रेणियों के रूप में रखा गया है। उदाहरण के लिए, अनुवाद `engwebp` में `Matthew 5:3` इस प्रकार दिखता है:

```json:no-line-numbers title="/api/engwebp/MAT/5.simple.json"
{
    "type": "verse",
    "number": 3,
    "text": "“Blessed are the poor in spirit,\nfor theirs is the Kingdom of Heaven.",
    "footnotes": [],
    "wordsOfJesus": [
        {
            "start": 0,
            "end": 69
        }
    ],
    "poem": [
        {
            "start": 0,
            "end": 32,
            "level": 1
        },
        {
            "start": 33,
            "end": 69,
            "level": 2
        }
    ]
}
```

## अध्याय के शब्दों को सरलीकृत प्रारूप में प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

यह एक अध्याय के लिए शब्द-स्तरीय एनोटेशन प्राप्त करता है, जिसमें उनके ऑफसेट को प्रत्येक [सरलीकृत श्लोक](#get-a-simplified-chapter-from-a-translation) के पाठ पर पुनः मैप किया जाता है।

[सामान्य एनोटेशन](./standard.md#get-the-words-of-a-chapter) में दिए गए ऑफसेट श्लोक के `content` ऐरे के आइटम से जुड़े होते हैं, जिसे सरलीकृत प्रारूप एक स्ट्रिंग से बदल देता है - इसलिए इनका उपयोग सामान्य प्रारूप के साथ नहीं किया जा सकता। सरलीकृत अध्यायों के साथ काम करते समय इस फ़ाइल का उपयोग करें।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` - आप [यहां](https://ubsicap.github.io/usfm/identification/books.html) पुस्तक आईडी की सूची पा सकते हैं)।
-   `chapter` संख्यात्मक अध्याय है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।

इन प्रविष्टियों में `contentIndex` नहीं है। `start` और `end` श्लोक के `text` में ऑफसेट हैं, ठीक वैसे ही जैसे सरलीकृत अध्यायों में फुटनोट, कविता और यीशु के वचन ऑफसेट होते हैं, इसलिए `text.slice(start, end)` एनोटेटेड शब्द है।

सामान्य टिप्पणियों की तरह, कुछ ही अनुवादों में ये मौजूद होती हैं। सरलीकृत अध्याय जिनमें ये मौजूद हैं, इस फ़ाइल से `thisChapterWordsLink` के साथ लिंक होते हैं; यदि यह प्रॉपर्टी मौजूद नहीं है, तो उस अध्याय के लिए यह फ़ाइल मौजूद नहीं होती।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// उत्पत्ति अध्याय 1 का पाठ और उसमें व्याख्या किए गए शब्द प्राप्त करें।
Promise.all([
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.simple.json`).then(r => r.json()),
    fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.simple.json`).then(r => r.json()),
]).then(([chapter, words]) => {
    for (let content of chapter.chapter.content) {
        if (content.type !== 'verse') {
            continue;
        }
        for (let word of words.verses[content.number] ?? []) {
            console.log(content.text.slice(word.start, word.end), word.strongs);
        }
    }
});
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.simple.json
curl https://bible.helloao.org/api/BSB/GEN/1.words.simple.json
```

:::

### संरचना

संरचना [नियमित एनोटेशन से](./standard.md#get-the-words-of-a-chapter) मेल खाती है, सिवाय इसके कि लिंक सरलीकृत फ़ाइलों की ओर इंगित करते हैं और प्रविष्टियों में `contentIndex` नहीं है।

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * अनुवाद की आईडी।
     */
    translationId: string;

    /**
     * पुस्तक की आईडी।
     */
    bookId: string;

    /**
     * अध्याय संख्या।
     */
    chapterNumber: number;

    /**
     * यह उस सरलीकृत अध्याय का लिंक है जिसके लिए ये टिप्पणियाँ हैं।
     */
    thisChapterLink: string;

    /**
     * अगले सरलीकृत अध्याय का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterLink: string | null;

    /**
     * पिछले सरलीकृत अध्याय का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterLink: string | null;

    /**
     * इन टिप्पणियों का लिंक।
     */
    thisChapterWordsLink: string;

    /**
     * अगले अध्याय के लिए टिप्पणियों का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है, या यदि अगले अध्याय में शब्द-स्तर की कोई टिप्पणी नहीं है, तो मान शून्य होगा।
     */
    nextChapterWordsLink: string | null;

    /**
     * पिछले अध्याय की व्याख्याओं का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है, या यदि पिछले अध्याय में शब्द-स्तर की कोई टिप्पणी नहीं है, तो मान शून्य होगा।
     */
    previousChapterWordsLink: string | null;

    /**
     * अध्याय के प्रत्येक श्लोक के लिए व्याख्या किए गए शब्द, श्लोक संख्या के अनुसार वर्गीकृत किए गए हैं।
     * प्रत्येक सूची श्लोक में शब्दों के आने के क्रम में व्यवस्थित है।
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * एक सरलीकृत अध्याय में शब्द-स्तर की व्याख्या।
 */
export interface SimpleChapterWord {
    /**
     * श्लोक के पाठ में टिप्पणी किए गए शब्द के पहले अक्षर का सूचकांक।
     */
    start: number;

    /**
     * श्लोक के पाठ में टिप्पणी किए गए शब्द के अंतिम अक्षर के बाद अनुक्रमणिका।
     */
    end: number;

    /**
     * शब्द के लिए स्ट्रॉन्ग संख्याएँ।
     */
    strongs?: string[];

    /**
     * मूल भाषा में शब्द का लेम्मा (शब्दकोश रूप)।
     */
    lemma?: string;

    /**
     * मूल भाषा में शब्द की आकृति विज्ञान।
     */
    morph?: string;

    /**
     * मूल पाठ में शब्द का स्थान।
     */
    srcloc?: string;

    /**
     * श्लोक में इस शब्द का कौन सा प्रयोग है?
     */
    occurrence?: number;

    /**
     * श्लोक में वह शब्द कितनी बार आया है।
     */
    occurrences?: number;
}
```

### उदाहरण

```json:no-line-numbers title="/api/engwebp/JHN/1.words.simple.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.simple.json",
    "nextChapterLink": "/api/engwebp/JHN/2.simple.json",
    "previousChapterLink": "/api/engwebp/MAT/28.simple.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.simple.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.simple.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.simple.json",
    "verses": {
        "1": [
            {
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

उस अध्याय के श्लोक 1 में पाठ `"In the beginning was the Word, and the Word was with God, and the Word was God."` है, इसलिए `text.slice(7, 16)` `"beginning"` है।

## सरलीकृत प्रारूप में संपूर्ण अनुवाद प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

सरलीकृत प्रारूप का उपयोग करके संपूर्ण अनुवाद की सामग्री प्राप्त करें। यह [संपूर्ण अनुवाद डाउनलोड](./standard.md#get-an-entire-translation) पर लागू किया गया [सरलीकृत अध्याय प्रारूप](#get-a-simplified-chapter-from-a-translation) है: एक फ़ाइल जिसमें संपूर्ण अनुवाद होता है, जहाँ प्रत्येक श्लोक की सामग्री एक ही स्ट्रिंग के रूप में होती है।

इसका उपयोग तब करें जब आप प्रत्येक अध्याय के लिए अलग-अलग अनुरोध किए बिना और स्वयं पाठ तैयार किए बिना, संपूर्ण अनुवाद का पाठ चाहते हों।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।

यह फ़ाइल `complete.json` के साथ ही जनरेट होती है, इसलिए अनुवाद में या तो दोनों होते हैं या दोनों में से कोई भी नहीं। दोनों फ़ाइलों में मौजूद `translation` ऑब्जेक्ट में `completeTranslationApiLink` और `simpleCompleteTranslationApiLink` दोनों शामिल हैं, इसलिए आप दोनों फ़ॉर्मेट के बीच स्विच कर सकते हैं।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// संपूर्ण बीएसबी अनुवाद का पाठ प्राप्त करें
fetch(`https://bible.helloao.org/api/${translation}/complete.simple.json`)
    .then(request => request.json())
    .then(complete => {
        for (let book of complete.books) {
            for (let { chapter } of book.chapters) {
                for (let content of chapter.content) {
                    if (content.type === 'verse') {
                        console.log(`${book.commonName} ${chapter.number}:${content.number} ${content.text}`);
                    }
                }
            }
        }
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.simple.json
```

:::

### संरचना

संरचना [नियमित पूर्ण अनुवाद डाउनलोड](./standard.md#get-an-entire-translation) के समान है, सिवाय इसके कि प्रत्येक अध्याय सरलीकृत प्रारूप का उपयोग करता है।

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * सरलीकृत अध्याय प्रारूप का उपयोग करते हुए, संपूर्ण अनुवाद डाउनलोड डेटा को परिभाषित करता है।
 * यह /api/:translationId/complete.simple.json एंडपॉइंट से मैप करता है।
 */
export interface SimpleTranslationComplete {
    /**
     * अनुवाद संबंधी मेटाडेटा।
     */
    translation: Translation;

    /**
     * सभी अध्यायों सहित पुस्तकों की पूरी सूची।
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * सरलीकृत अध्याय प्रारूप का उपयोग करते हुए, संपूर्ण अनुवाद के साथ पुस्तक डाउनलोड करें।
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * सभी अध्यायों की पूरी सूची, जिसमें उनकी विषयवस्तु भी शामिल है।
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * सरलीकृत अध्याय प्रारूप का उपयोग करते हुए, संपूर्ण अनुवाद डाउनलोड में एक अध्याय।
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * अध्याय में मौजूद श्लोकों की संख्या।
     */
    numberOfVerses: number;

    /**
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के लिंक।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * अध्याय के लिए ऑडियो समय (प्रत्येक श्लोक के प्रारंभ होने का समय, सेकंड में)।
     *
     * ध्यान दें कि संपूर्ण अनुवाद फ़ाइलों में समय-निर्धारण स्वयं शामिल होता है (मानक प्रारूप दस्तावेज़ों में TranslationBookChapterAudioTimingsMap देखें), व्यक्तिगत अध्याय अंतबिंदुओं के विपरीत, जिनमें उनके लिंक होते हैं।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * अध्याय के लिए शब्द-स्तरीय टिप्पणियों का लिंक, सरलीकृत प्रारूप में दिया गया है। यदि अध्याय में कोई शब्द-स्तरीय टिप्पणियां नहीं हैं तो इसे छोड़ दिया जाएगा।
     */
    thisChapterWordsLink?: string;

    /**
     * इस अध्याय के लिए सरलीकृत जानकारी।
     */
    chapter: SimpleChapterData;
}
```

### उदाहरण

```json:no-line-numbers title="/api/BSB/complete.simple.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "englishName": "Berean Standard Bible",
        "language": "eng",
        "licenseUrl": "https://berean.bible/",
        "shortName": "BSB",
        "website": "https://berean.bible/",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/BSB/books.json",
        "completeTranslationApiLink": "/api/BSB/complete.json",
        "simpleCompleteTranslationApiLink": "/api/BSB/complete.simple.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 31086,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "name": "Genesis",
            "commonName": "Genesis",
            "title": "Genesis",
            "order": 1,
            "numberOfChapters": 50,
            "totalNumberOfVerses": 1533,
            "chapters": [
                {
                    "numberOfVerses": 31,
                    "thisChapterAudioLinks": {
                        "hays": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/hays.mp3",
                        "souer": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/souer.mp3",
                        "david": "https://audio.bible.helloao.org/api/BSB/GEN/1/audio/david.mp3"
                    },
                    "thisChapterAudioTimings": {
                        "hays": [0, 4.32, 10.28],
                        "souer": [0, 4.28, 10.19],
                        "david": [0, 4.51, 10.62]
                    },
                    "chapter": {
                        "number": 1,
                        "content": [
                            {
                                "type": "heading",
                                "text": "The Creation"
                            },
                            {
                                "type": "line_break"
                            },
                            {
                                "type": "verse",
                                "number": 1,
                                "text": "In the beginning God created the heavens and the earth.",
                                "footnotes": []
                            }
                        ],
                        "footnotes": []
                    }
                }
            ]
        }
    ]
}
```
