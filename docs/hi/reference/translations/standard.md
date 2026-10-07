# मानक प्रारूप

अध्यायों, पूर्ण अनुवाद डाउनलोड और शब्द-स्तरीय टिप्पणियों के लिए मानक प्रारूप। अनुवाद और पुस्तक सूची के अंतिम बिंदुओं के लिए [अनुवाद, पुस्तकें और अध्याय](./README.md) देखें, या इसी सामग्री के वैकल्पिक निरूपण के लिए [सरलीकृत प्रारूप](./simplified.md) देखें।

## अनुवाद से एक अध्याय प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

किसी दी गई पुस्तक और उसके अनुवाद के एक अध्याय की सामग्री प्राप्त करता है।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` - आप [यहां](https://ubsicap.github.io/usfm/identification/books.html) पुस्तक आईडी की सूची पा सकते हैं)।
-   `chapter` संख्यात्मक अध्याय है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// उत्पत्ति 1 को बीएसबी अनुवाद से प्राप्त करें
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (BSB):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.json
```

:::

### संरचना

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के लिंक।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के ऑडियो समय के लिंक यहां दिए गए हैं।
     * प्रत्येक लिंक उस पाठक के लिए ऑडियो टाइमिंग फ़ाइल की ओर इंगित करता है - नीचे "किसी अध्याय के लिए ऑडियो टाइमिंग प्राप्त करें" देखें।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * अगले अध्याय का लिंक।
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
     * पिछले अध्याय का लिंक।
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
     * अध्याय के लिए शब्द-स्तरीय टिप्पणियों का लिंक।
     * यदि अध्याय में शब्द-स्तर की कोई टिप्पणी नहीं है तो इसे छोड़ दिया जाएगा।
     */
    thisChapterWordsLink?: string;

    /**
     * अगले अध्याय के लिए शब्द-स्तरीय टिप्पणियों का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है, या यदि अगले अध्याय में शब्द-स्तर की कोई व्याख्या नहीं है, तो इसे छोड़ दिया जाएगा।
     */
    nextChapterWordsLink?: string;

    /**
     * पिछले अध्याय के लिए शब्द-स्तरीय टिप्पणियों का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है, या यदि पिछले अध्याय में शब्द-स्तर की कोई व्याख्या नहीं है, तो इसे छोड़ दिया जाएगा।
     */
    previousChapterWordsLink?: string;

    /**
     * अध्याय में मौजूद श्लोकों की संख्या।
     */
    numberOfVerses: number;

    /**
     * इस अध्याय के सरलीकृत संस्करण का लिंक।
     * सरलीकृत अध्याय उपलब्ध न होने की स्थिति में इसे छोड़ दिया जाएगा।
     */
    simpleChapterApiLink?: string;

    /**
     * इस अध्याय की जानकारी।
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * अध्याय संख्या।
     */
    number: number;

    /**
     * अध्याय की विषयवस्तु।
     */
    content: ChapterContent[];

    /**
     * इस अध्याय के फुटनोट्स की सूची।
     */
    footnotes: ChapterFootnote[];
}

/**
 * एक यूनियन प्रकार जो अध्याय की सामग्री के एक ही भाग का प्रतिनिधित्व करता है।
 * अध्याय की विषयवस्तु निम्नलिखित में से कोई एक हो सकती है:
 * - एक शीर्षक।
 * - एक पंक्ति विराम।
 * - एक श्लोक।
 * - हिब्रू उपशीर्षक।
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * अध्याय का शीर्षक।
 */
interface ChapterHeading {
    /**
     * यह इंगित करता है कि सामग्री एक शीर्षक को दर्शाती है।
     */
    type: 'heading';

    /**
     * शीर्षक की सामग्री।
     * यदि ऐरे में एक से अधिक स्ट्रिंग शामिल हैं, तो उन्हें एक स्पेस से जोड़ा जाना चाहिए।
     */
    content: string[];
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
 * अध्याय में हिब्रू उपशीर्षक।
 * इन्हें अक्सर मूल पांडुलिपियों में मौजूद सूचनात्मक सामग्री के रूप में शामिल किया जाता है।
 * उदाहरण के लिए, भजन संहिता 49 का हिब्रू उपशीर्षक है "संगीत निर्देशक के लिए। कोरह के पुत्रों का भजन।"
 */
interface ChapterHebrewSubtitle {
    /**
     * यह दर्शाता है कि सामग्री हिब्रू उपशीर्षक का प्रतिनिधित्व करती है।
     */
    type: 'hebrew_subtitle';

    /**
     * उपशीर्षक में शामिल सामग्री की सूची।
     * सूची में प्रत्येक तत्व एक स्ट्रिंग, स्वरूपित पाठ या फुटनोट संदर्भ हो सकता है।
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * एक अध्याय का एक श्लोक।
 */
interface ChapterVerse {
    /**
     * यह इंगित करता है कि विषयवस्तु एक श्लोक है।
     */
    type: 'verse';

    /**
     * श्लोक की संख्या।
     */
    number: number;

    /**
     * श्लोक की विषयवस्तु की सूची।
     * सूची में प्रत्येक तत्व एक स्ट्रिंग, स्वरूपित पाठ या फुटनोट संदर्भ हो सकता है।
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * स्वरूपित पाठ। अर्थात्, वह पाठ जिसे एक विशेष तरीके से स्वरूपित किया गया हो।
 */
interface FormattedText {
    /**
     * वह पाठ जिसे स्वरूपित किया गया है।
     */
    text: string;

    /**
     * क्या यह पाठ एक कविता को दर्शाता है?
     * यह संख्या इंडेंट के स्तर को दर्शाती है।
     *
     * भजन संहिता में आम तौर पर पाया जाता है।
     */
    poem?: number;

    /**
     * क्या यह पाठ यीशु के वचनों को दर्शाता है?
     */
    wordsOfJesus?: boolean;
}

/**
 * यह एक ऐसे इंटरफेस को परिभाषित करता है जो किसी श्लोक में अंतर्निहित शीर्षक को दर्शाता है।
 */
interface InlineHeading {
    /**
     * शीर्षक का पाठ।
     */
    heading: string;
}

/**
 * यह एक ऐसे इंटरफेस को परिभाषित करता है जो किसी छंद में अंतर्निहित पंक्ति विराम का प्रतिनिधित्व करता है।
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * किसी श्लोक या हिब्रू उपशीर्षक में दिया गया फुटनोट संदर्भ।
 */
interface VerseFootnoteReference {
    /**
     * नोट की आईडी।
     */
    noteId: number;
}

/**
 * फुटनोट के बारे में जानकारी।
 */
interface ChapterFootnote {
    /**
     * संदर्भित नोट की आईडी।
     */
    noteId: number;

    /**
     * फुटनोट का पाठ।
     */
    text: string;

    /**
     * फुटनोट के लिए श्लोक संदर्भ।
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * फुटनोट के लिए जिस कॉलर का उपयोग किया जाना चाहिए।
     * फुटनोट के लिए, "कॉलर" वह अक्षर होता है जिसका उपयोग पाठ में फुटनोट को संदर्भित करने के लिए किया जाता है।
     *
     * उदाहरण के लिए, पाठ में:
     * हैलो (ए) वर्ल्ड
     *
     * ---- (क) यह एक फुटनोट है।
     *
     * "(a)" कॉल करने वाले को दर्शाता है।
     *
     * यदि "+" है, तो कॉलर स्वतः उत्पन्न होना चाहिए।
     * यदि null है, तो कॉलर खाली होना चाहिए।
     * यदि यह एक स्ट्रिंग है, तो कॉलर भी वही स्ट्रिंग होनी चाहिए।
     */
    caller: '+' | string | null;
}

/**
 * पुस्तक के एक अध्याय के लिए ऑडियो लिंक।
 */
interface TranslationBookChapterAudioLinks {
    /**
     * अध्याय का पाठ और ऑडियो फ़ाइल का यूआरएल लिंक।
     */
    [reader: string]: string;
}

/**
 * पुस्तक के एक अध्याय के लिए ऑडियो समय के लिंक।
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * अध्याय के लिए रीडर और उस रीडर के लिए ऑडियो टाइमिंग फ़ाइल का एपीआई लिंक।
     */
    [reader: string]: string;
}
```

### उदाहरण

```json:no-line-numbers title="/api/BSB/GEN/1.json"
{
    "translation": {
        "id": "BSB",
        "name": "Berean Standard Bible",
        "website": "https://berean.bible/",
        "licenseUrl": "https://berean.bible/",
        "licenseNotes": null,
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
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "thisChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
    },
    "thisChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/1.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/1.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/1.souer.audioTimings.json"
    },
    "nextChapterApiLink": "/api/BSB/GEN/2.json",
    "nextChapterAudioLinks": {
        "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_002_G.mp3",
        "hays": "https://openbible.com/audio/hays/BSB_01_Gen_002_H.mp3",
        "souer": "https://openbible.com/audio/souer/BSB_01_Gen_002.mp3"
    },
    "nextChapterAudioTimings": {
        "gilbert": "/api/BSB/GEN/2.gilbert.audioTimings.json",
        "hays": "/api/BSB/GEN/2.hays.audioTimings.json",
        "souer": "/api/BSB/GEN/2.souer.audioTimings.json"
    },
    "previousChapterApiLink": null,
    "previousChapterAudioLinks": null,
    "previousChapterAudioTimings": null,
    "numberOfVerses": 31,
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "heading",
                "content": [
                    "The Creation"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning God created the heavens and the earth."
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 2,
                "content": [
                    "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
            },
            {
                "type": "heading",
                "content": [
                    "The First Day"
                ]
            },
            {
                "type": "line_break"
            },
            {
                "type": "verse",
                "number": 3,
                "content": [
                    "And God said, “Let there be light,”",
                    {
                        "noteId": 0
                    },
                    "and there was light."
                ]
            },
            {
                "type": "verse",
                "number": 4,
                "content": [
                    "And God saw that the light was good, and He separated the light from the darkness."
                ]
            },
            {
                "type": "verse",
                "number": 5,
                "content": [
                    "God called the light “day,” and the darkness He called “night.”",
                    {
                        "lineBreak": true
                    },
                    "And there was evening, and there was morning—the first day.",
                    {
                        "noteId": 1
                    }
                ]
            }
        ],
        "footnotes": [
            {
                "noteId": 0,
                "text": "Cited in 2 Corinthians 4:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 3
                }
            },
            {
                "noteId": 1,
                "text": "Literally day one",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 5
                }
            },
            {
                "noteId": 2,
                "text": "Or a canopy or a firmament or a vault; also in verses 7, 8, 14, 15, 17, and 20",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 6
                }
            },
            {
                "noteId": 3,
                "text": "MT; Syriac and over all the beasts of the earth",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 26
                }
            },
            {
                "noteId": 4,
                "text": "Cited in Matthew 19:4 and Mark 10:6",
                "caller": "+",
                "reference": {
                    "chapter": 1,
                    "verse": 27
                }
            }
        ]
    }
}
```

## किसी अध्याय के लिए ऑडियो टाइमिंग प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

यह किसी अध्याय के लिए, किसी एक पाठक द्वारा पढ़े गए पाठ के प्रत्येक श्लोक का ऑडियो समय बताता है - यानी, वह समय (सेकंड में, उस पाठक की ऑडियो फ़ाइल की शुरुआत के सापेक्ष) जब प्रत्येक श्लोक शुरू होता है। ग्राहक इसका उपयोग ऑडियो चलते समय वर्तमान में पढ़े जा रहे श्लोक को हाइलाइट करने के लिए कर सकते हैं।

केवल कुछ अनुवादकों और पाठकों के लिए ही ऑडियो समय उपलब्ध है। जिस अध्याय में किसी पाठक के लिए ऑडियो समय उपलब्ध है, वह इस फ़ाइल से `thisChapterAudioTimings` प्रविष्टि के साथ लिंक होता है, जिसे उस पाठक की आईडी द्वारा चिह्नित किया जाता है; यदि कोई पाठक उस मानचित्र में कुंजी नहीं है, तो उस पाठक और अध्याय के लिए यह फ़ाइल मौजूद नहीं होती है।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` - आप [यहां](https://ubsicap.github.io/usfm/identification/books.html) पुस्तक आईडी की सूची पा सकते हैं)।
-   `chapter` संख्यात्मक अध्याय है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।
-   `reader` पाठक की आईडी है जिसके कथन के लिए समय निर्धारित किया गया है (जैसे `hays` ) - एक अध्याय के लिए उपलब्ध पाठक उसके `thisChapterAudioLinks` की कुंजी हैं।

किसी श्लोक का अंत अगले श्लोक का प्रारंभ होता है (या, अंतिम श्लोक के लिए, ऑडियो फ़ाइल का अंत), इसलिए किसी ग्राहक को पूरे अध्याय के लिए हाइलाइटिंग रेंज बनाने के लिए प्रारंभ समय की क्रमबद्ध सूची के अलावा किसी और चीज़ की आवश्यकता नहीं होती है।

यह फ़ाइल इस बात से अप्रभावित रहती है कि इसे नियमित अध्याय के अंतिम बिंदु से प्राप्त किया जाता है या [सरलीकृत अध्याय के अंतिम बिंदु](./simplified.md#get-a-simplified-chapter-from-a-translation) से - प्रत्येक अनुवाद, पुस्तक, अध्याय और पाठक के लिए समय का केवल एक ही सेट होता है।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// उत्पत्ति 1 (बीएसबी) के ऑडियो समय, जैसा कि "हेस" द्वारा पढ़ा गया है, प्राप्त करें।
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.${reader}.audioTimings.json`)
    .then(request => request.json())
    .then(timings => {
        console.log('Genesis 1 (BSB, hays) verse start times:', timings.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.hays.audioTimings.json
```

:::

### संरचना

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * यह किसी पुस्तक के अध्याय के लिए, एक ही पाठक द्वारा पढ़ी जाने वाली ऑडियो टाइमिंग को परिभाषित करता है।
 * यह /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json एंडपॉइंट से मैप करता है।
 */
export interface TranslationBookChapterAudioTimings {
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
     * यह उस रीडर की आईडी है जिसके लिए ये समय निर्धारित किए गए हैं।
     */
    reader: string;

    /**
     * यह उस ऑडियो फ़ाइल का लिंक है जिसके लिए ये समय दिए गए हैं।
     */
    audioLink: string;

    /**
     * इस अध्याय की जानकारी का लिंक।
     */
    thisChapterLink: string;

    /**
     * अगले अध्याय की जानकारी का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterLink: string | null;

    /**
     * पिछले अध्याय की जानकारी का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterLink: string | null;

    /**
     * इस ऑडियो टाइमिंग फाइल का लिंक।
     */
    thisChapterAudioTimingsLink: string;

    /**
     * अगले अध्याय के समय की जानकारी उसी पाठक के लिए यहां दी गई है।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * पिछले अध्याय के समय का लिंक, उसी पाठक के लिए।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * प्रत्येक श्लोक के प्रारंभ होने का समय (सेकंड में), क्रमानुसार।
     * पहली संख्या (सूचकांक 0) रिकॉर्डिंग में वह समय है जब पहला छंद शुरू होता है।
     */
    verses: number[];
}
```

### उदाहरण

```json:no-line-numbers title="/api/BSB/GEN/1.hays.audioTimings.json"
{
    "translationId": "BSB",
    "bookId": "GEN",
    "chapterNumber": 1,
    "reader": "hays",
    "audioLink": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
    "thisChapterLink": "/api/BSB/GEN/1.json",
    "nextChapterLink": "/api/BSB/GEN/2.json",
    "previousChapterLink": null,
    "thisChapterAudioTimingsLink": "/api/BSB/GEN/1.hays.audioTimings.json",
    "nextChapterAudioTimingsLink": "/api/BSB/GEN/2.hays.audioTimings.json",
    "previousChapterAudioTimingsLink": null,
    "verses": [
        0,
        4.32,
        10.28,
        19.06,
        27.84
    ]
}
```

`verses[0]` श्लोक 1 का प्रारंभ समय है, `verses[1]` श्लोक 2 का प्रारंभ समय है, इत्यादि - इसलिए इस उदाहरण में, उत्पत्ति 1 (बीएसबी, जैसा कि "हेस" द्वारा पढ़ा गया है) का श्लोक 2, `audioLink` में 4.32 सेकंड पर शुरू होता है।

## एक अध्याय के शब्द प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

यह किसी एक अध्याय के लिए शब्द-स्तरीय एनोटेशन (स्ट्रॉन्ग के नंबर और संबंधित स्रोत डेटा) प्राप्त करता है।

कुछ ही अनुवादों में शब्द-स्तरीय टिप्पणियाँ शामिल हैं। जिन अध्यायों में ये टिप्पणियाँ होती हैं, वे इस फ़ाइल से `thisChapterWordsLink` के साथ लिंक होते हैं; यदि यह विशेषता मौजूद नहीं है, तो उस अध्याय के लिए यह फ़ाइल मौजूद नहीं होती।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।
-   `book` पुस्तक की आईडी है (उदाहरण के लिए उत्पत्ति के लिए `GEN` - आप [यहां](https://ubsicap.github.io/usfm/identification/books.html) पुस्तक आईडी की सूची पा सकते हैं)।
-   `chapter` संख्यात्मक अध्याय है (उदाहरण के लिए, पहले अध्याय के लिए `1` )।

प्रत्येक एनोटेशन किसी श्लोक के `content` सरणी में `end` वर्णों की एक श्रेणी से जुड़ा होता है: `contentIndex` उस आइटम का सूचकांक है, और `start` उस आइटम के पाठ में वर्ण ऑफसेट हैं। `end` अनन्य है, इसलिए `text.slice(start, end)` एनोटेटेड शब्द है।

किसी विषयवस्तु से जुड़ाव स्थापित करने का (संपूर्ण श्लोक के बजाय) यह अर्थ है कि उन श्लोकों के लिए ऑफसेट सही बने रहते हैं जिनकी विषयवस्तु कई मदों में विभाजित होती है, जैसे कि कविता की पंक्तियाँ, यीशु के वचन और पादलेख संदर्भ।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// उत्पत्ति अध्याय 1 के शब्द बीएसबी अनुवाद से प्राप्त करें
fetch(`https://bible.helloao.org/api/${translation}/${book}/${chapter}.words.json`)
    .then(request => request.json())
    .then(words => {
        console.log('Genesis 1 words (BSB):', words);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/GEN/1.words.json
```

:::

### संरचना

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * इस अध्याय की जानकारी का लिंक।
     */
    thisChapterLink: string;

    /**
     * अगले अध्याय की जानकारी का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है तो मान शून्य होगा।
     */
    nextChapterLink: string | null;

    /**
     * पिछले अध्याय की जानकारी का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है तो मान शून्य होगा।
     */
    previousChapterLink: string | null;

    /**
     * इस शब्द फ़ाइल का लिंक।
     */
    thisChapterWordsLink: string;

    /**
     * अगले अध्याय के शब्दों का लिंक।
     * यदि यह अनुवाद का अंतिम अध्याय है, या यदि अगले अध्याय में शब्द-स्तर की कोई टिप्पणी नहीं है, तो मान शून्य होगा।
     */
    nextChapterWordsLink: string | null;

    /**
     * पिछले अध्याय के शब्दों का लिंक।
     * यदि यह अनुवाद का पहला अध्याय है, या यदि पिछले अध्याय में शब्द-स्तर की कोई टिप्पणी नहीं है, तो मान शून्य होगा।
     */
    previousChapterWordsLink: string | null;

    /**
     * अध्याय के प्रत्येक श्लोक के लिए व्याख्या किए गए शब्द, श्लोक संख्या के अनुसार वर्गीकृत किए गए हैं।
     * प्रत्येक सूची श्लोक में शब्दों के आने के क्रम में व्यवस्थित है।
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * श्लोक की विषयवस्तु सारणी में उस आइटम का सूचकांक जिस पर यह टिप्पणी लागू होती है।
     */
    contentIndex: number;

    /**
     * विषयवस्तु के पाठ में टिप्पणी किए गए शब्द के पहले अक्षर का सूचकांक।
     */
    start: number;

    /**
     * विषयवस्तु के पाठ में टिप्पणी किए गए शब्द के अंतिम अक्षर के बाद का सूचकांक।
     * यानी, text.slice(start, end) एनोटेटेड शब्द है।
     */
    end: number;

    /**
     * शब्द के लिए स्ट्रॉन्ग संख्या(एँ)।
     * यदि अनुवाद में शब्द के लिए केवल अन्य व्याख्याएँ दी गई हों तो इसे छोड़ दिया जाएगा।
     */
    strongs?: string[];

    /**
     * शब्द का शब्दकोश (उद्धरण) रूप।
     * यदि अनुवाद में इसका विकल्प नहीं दिया गया है तो इसे छोड़ दिया जाएगा।
     */
    lemma?: string;

    /**
     * शब्द के लिए मॉर्फोलॉजी पार्स कोड।
     * यदि अनुवाद में इसका विकल्प नहीं दिया गया है तो इसे छोड़ दिया जाएगा।
     */
    morph?: string;

    /**
     * मूल पाठ में शब्द का सूचक, <sourceName> : <location> प्रारूप में।
     * यदि अनुवाद में इसका विकल्प नहीं दिया गया है तो इसे छोड़ दिया जाएगा।
     */
    srcloc?: string;

    /**
     * यह शब्द मूल शब्द के किस रूप पर आधारित है? 1-आधारित।
     * यदि अनुवाद में इसका विकल्प नहीं दिया गया है तो इसे छोड़ दिया जाएगा।
     */
    occurrence?: number;

    /**
     * मूल शब्द के आने की कुल संख्या।
     * यदि अनुवाद में इसका विकल्प नहीं दिया गया है तो इसे छोड़ दिया जाएगा।
     */
    occurrences?: number;
}
```

### उदाहरण

मान लीजिए कि एक अध्याय का पहला श्लोक केवल एक विषयवस्तु से युक्त है:

```json:no-line-numbers title="/api/engwebp/JHN/1.json"
{
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "In the beginning was the Word, and the Word was with God, and the Word was God."
                ]
            }
        ]
    }
}
```

शब्द फ़ाइल उस आइटम के वर्णों को एनोटेट करती है:

```json:no-line-numbers title="/api/engwebp/JHN/1.words.json"
{
    "translationId": "engwebp",
    "bookId": "JHN",
    "chapterNumber": 1,
    "thisChapterLink": "/api/engwebp/JHN/1.json",
    "nextChapterLink": "/api/engwebp/JHN/2.json",
    "previousChapterLink": "/api/engwebp/MAT/28.json",
    "thisChapterWordsLink": "/api/engwebp/JHN/1.words.json",
    "nextChapterWordsLink": "/api/engwebp/JHN/2.words.json",
    "previousChapterWordsLink": "/api/engwebp/MAT/28.words.json",
    "verses": {
        "1": [
            {
                "contentIndex": 0,
                "start": 0,
                "end": 2,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 3,
                "end": 6,
                "strongs": ["G1722"]
            },
            {
                "contentIndex": 0,
                "start": 7,
                "end": 16,
                "strongs": ["G0746"]
            }
        ]
    }
}
```

यानी, `"In the beginning...".slice(0, 2)` अर्थ `"In"` है, जिसे स्रोत ने `G1722` के रूप में टैग किया है।

## संपूर्ण अनुवाद प्राप्त करें

`GET https://bible.helloao.org/api/{translation}/complete.json`

संपूर्ण अनुवाद की सामग्री प्राप्त करता है।

-   `translation` अनुवाद की आईडी है (उदाहरण के लिए `BSB` )।

### कोड उदाहरण

::: code-tabs#भाषा

@tab जावास्क्रिप्ट

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// उत्पत्ति 1 को बीएसबी अनुवाद से प्राप्त करें
fetch(`https://bible.helloao.org/api/${translation}/complete.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('BSB:', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/complete.json
```

:::

### संरचना

```typescript:no-line-numbers title="complete.ts"
/**
 * यह संपूर्ण अनुवाद डाउनलोड डेटा को परिभाषित करता है।
 * यह /api/:translationId/complete.json एंडपॉइंट से मैप करता है।
 */
export interface TranslationComplete {
    /**
     * अनुवाद संबंधी मेटाडेटा।
     */
    translation: Translation;

    /**
     * सभी अध्यायों सहित पुस्तकों की पूरी सूची।
     */
    books: TranslationCompleteBook[];
}

/**
 * पूरी अनुवादित पुस्तक डाउनलोड करें।
 */
export interface TranslationCompleteBook {
    /**
     * पुस्तक की आईडी।
     */
    id: string;

    /**
     * अनुवाद से प्राप्त पुस्तक का नाम।
     */
    name: string;

    /**
     * पुस्तक का सामान्य नाम।
     */
    commonName: string;

    /**
     * पुस्तक का शीर्षक।
     */
    title: string | null;

    /**
     * पुस्तक का क्रम।
     */
    order: number;

    /**
     * पुस्तक में अध्यायों की संख्या।
     */
    numberOfChapters: number;

    /**
     * पुस्तक में श्लोकों की कुल संख्या।
     */
    totalNumberOfVerses: number;

    /**
     * क्या यह पुस्तक मनगढ़ंत है?
     */
    isApocryphal?: boolean;

    /**
     * सभी अध्यायों की पूरी सूची, जिसमें उनकी विषयवस्तु भी शामिल है।
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * संपूर्ण अनुवाद डाउनलोड में एक अध्याय।
 */
export interface TranslationCompleteChapter {
    /**
     * अध्याय में मौजूद श्लोकों की संख्या।
     */
    numberOfVerses: number;

    /**
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के लिंक।
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * इस अध्याय के विभिन्न ऑडियो संस्करणों के लिए ऑडियो समय (प्रति श्लोक प्रारंभ समय, सेकंड में)।
     *
     * अलग-अलग अध्याय के अंत बिंदु पर मौजूद `thisChapterAudioTimings` (जो नीचे "किसी अध्याय के लिए ऑडियो समय प्राप्त करें" से लिंक करता है) के विपरीत, इसमें समय ही शामिल है - क्योंकि संपूर्ण अनुवाद डाउनलोड का उद्देश्य सब कुछ एक ही फ़ाइल में रखना है।
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * अध्याय के लिए शब्द-स्तरीय टिप्पणियों का लिंक।
     * यदि अध्याय में शब्द-स्तर की कोई टिप्पणी नहीं है तो इसे छोड़ दिया जाएगा।
     */
    thisChapterWordsLink?: string;

    /**
     * इस अध्याय की जानकारी।
     */
    chapter: ChapterData;
}

/**
 * पुस्तक के एक अध्याय के ऑडियो समय को सीधे एम्बेड किया गया है, न कि लिंक के माध्यम से।
 * यह रीडर आईडी को प्रत्येक श्लोक के प्रारंभ होने के समय (सेकंड में) की सूची से जोड़ता है, जो श्लोक के क्रम में व्यवस्थित होता है।
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### उदाहरण

```json:no-line-numbers title="/api/BSB/complete.json"
{
  "translation": {
    "id": "BSB",
    "name": "Berean Standard Bible",
    "website": "https://berean.bible/",
    "licenseUrl": "https://berean.bible/",
    "licenseNotes": null,
    "shortName": "BSB",
    "englishName": "Berean Standard Bible",
    "language": "eng",
    "textDirection": "ltr",
    "sha256": "b2898c49cadb50fd8763feb9e2f74a90a3817e33408a24b6cbf09e7a950dde97",
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
            "gilbert": "https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3",
            "hays": "https://openbible.com/audio/hays/BSB_01_Gen_001_H.mp3",
            "souer": "https://openbible.com/audio/souer/BSB_01_Gen_001.mp3"
          },
          "thisChapterAudioTimings": {
            "gilbert": [0, 4.4, 10.36],
            "hays": [0, 4.32, 10.28],
            "souer": [0, 4.28, 10.19]
          },
          "chapter": {
            "number": 1,
            "content": [
              {
                "type": "heading",
                "content": [
                  "The Creation"
                ]
              },
              {
                "type": "verse",
                "number": 1,
                "content": [
                  "In the beginning God created the heavens and the earth."
                ]
              },
              {
                "type": "line_break"
              },
              {
                "type": "verse",
                "number": 2,
                "content": [
                  "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters."
                ]
              },
            ]
          }
        }
      ]
    }
  ]
}
```
