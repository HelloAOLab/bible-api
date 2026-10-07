# Tsarin da aka Sauƙaƙa

Tsarin da aka sauƙaƙe don surori, saukar da cikakken fassarar, da kuma bayanin kalmomi. Duba [Fassara, Littattafai, & Babi](./README.md) don ƙarshen fassarar da jerin littattafai, ko [tsarin da aka saba amfani da shi](./standard.md) don wakilcin asali da tsari na wannan abun ciki.

## Sami Babi Mai Sauƙi daga Fassara

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Yana samun abubuwan da ke cikin babi ɗaya na wani littafi da fassararsa, ta amfani da tsarin da aka sauƙaƙe.

A cikin tsarin da aka sauƙaƙe, abubuwan da ke cikin kowace baiti za su kasance zare ɗaya maimakon jerin abubuwan da aka tsara. Wannan yana nufin ba sai ka gina rubutun baiti da kanka ba, wanda ba shi da mahimmanci don samun daidaito - musamman idan ana maganar tazara. Duk wani abu da ba za a iya wakilta shi da zaren da ba a iya bayyana shi ba - ƙananan bayanai, Kalmomin Yesu, waƙoƙi, da kanun labarai da suka faru a tsakiyar baiti - ana ajiye shi a matsayin madadin wannan zaren, don haka babu abin da ya ɓace.

Yi amfani da wannan ƙarshen lokacin da kake son rubutun babi. Yi amfani da [ƙarshen babi na yau da kullun](./standard.md#get-a-chapter-from-a-translation) lokacin da kake son nuna babin tare da tsarinsa na asali.

-   `translation` shine ID na fassarar (misali `BSB` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa - zaka iya samun jerin ID na littafi [anan](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` shine babin lambobi (misali `1` don babi na farko).

Babi-babi masu bayanin kalmomi suna da alaƙa da su da `thisChapterWordsLink` , wanda ke [nuna bayanin da aka sauƙaƙe](#get-the-words-of-a-chapter-in-the-simplified-format) - waɗanda canje-canjen da suka yi daidai da rubutun da ke cikin wannan fayil ɗin.

Babi-babi da ke da lokutan sauti ga kowane mai karatu suna haɗuwa da su da `thisChapterAudioTimings` , wanda ke nuna [ƙarshen lokutan sauti](./standard.md#get-the-audio-timings-for-a-chapter) - fayil ɗin da ƙarshen babi na yau da kullun ke haɗawa da shi, tunda lokutan ba su dogara da tsarin babi ba.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Samo rubutun Farawa 1 daga fassarar BSB
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

### Ma'auni

Duk waɗannan canje-canje a cikin tsarin da aka sauƙaƙe - `offset` , `start` , da `end` - fihirisa ne a cikin `text` na ayar da ke ɗauke da su. Ana auna su a cikin raka'o'in lambar UTF-16, wanda shine abin da JavaScript ke amfani da shi `String.prototype.length` da `String.prototype.slice()` .

`start` yana da alaƙa da juna kuma `end` na musamman ne, don haka `text.slice(start, end)` yana dawo da daidai kewayon rubutun da aka yi wa alama. Ma'aunin bayanan ƙasa sune matsayin da mai kiran ƙasa yake a ciki, don haka `text.slice(0, offset)` shine rubutun da ke gabansa.

### Tsarin gini

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * Bayanin fassarar babin littafin.
     */
    translation: Translation;

    /**
     * Bayanin littafin don babin littafin.
     */
    book: TranslationBook;

    /**
     * Haɗin zuwa babi na yanzu.
     */
    thisChapterLink: string;

    /**
     * Hanyar haɗi zuwa sigar da aka saba (ba a sauƙaƙa ba) ta wannan babi.
     */
    fullChapterApiLink: string;

    /**
     * Hanyoyin haɗi zuwa nau'ikan sauti daban-daban don babin.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Hanyoyin haɗi zuwa lokutan sauti don nau'ikan sauti daban-daban na babin.
     * Duba "Sami Lokutan Sauti don Babi" a cikin takaddun tsari na yau da kullun - fayil ɗin lokaci iri ɗaya ne ba tare da la'akari da tsarin babi da aka haɗa shi ba.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Hanyar haɗi zuwa babi na gaba, a cikin tsarin da aka sauƙaƙe.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterApiLink: string | null;

    /**
     * Hanyoyin haɗi zuwa nau'ikan sauti daban-daban don babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Hanyoyin haɗi zuwa lokutan sauti don nau'ikan sauti daban-daban don babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Hanyar haɗi zuwa babi na baya, a cikin tsarin da aka sauƙaƙe.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterApiLink: string | null;

    /**
     * Hanyoyin haɗi zuwa nau'ikan sauti daban-daban na babi na baya.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Hanyoyin haɗi zuwa lokutan sauti don nau'ikan sauti daban-daban na babi na baya.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Adadin ayoyin da surar ta kunsa.
     */
    numberOfVerses: number;

    /**
     * Bayanin da aka bayar don babi.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Adadin babin.
     */
    number: number;

    /**
     * Abubuwan da ke cikin babin.
     */
    content: SimpleChapterContent[];

    /**
     * Jerin bayanan ƙasa waɗanda ba za a iya danganta su da aya ba.
     * An haɗa bayanan ƙasa waɗanda suke cikin aya a cikin ayar, don haka wannan jerin yawanci babu komai a ciki.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Nau'in haɗin gwiwa wanda ke wakiltar wani yanki guda na abun ciki a cikin babi mai sauƙi.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Kan magana a cikin wani babi.
 */
interface SimpleChapterHeading {
    /**
     * Yana nuna cewa abubuwan da ke ciki suna wakiltar wani taken.
     */
    type: 'heading';

    /**
     * Rubutun kanun.
     */
    text: string;
}

/**
 * Rage layi a cikin babi.
 */
interface ChapterLineBreak {
    /**
     * Yana nuna cewa abubuwan da ke ciki suna wakiltar karya layi.
     */
    type: 'line_break';
}

/**
 * Aya a cikin babi.
 */
interface SimpleChapterVerse {
    /**
     * Yana nuna cewa abin da ke ciki aya ce.
     */
    type: 'verse';

    /**
     * Adadin ayar.
     */
    number: number;

    /**
     * Nassin ayar.
     * Layukan waƙoƙi da ragowar layi an raba su da haruffan sabon layi (\n).
     */
    text: string;

    /**
     * Bayanan da suka bayyana a cikin ayar.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Kanun da suka bayyana a tsakiyar baitin.
     * An cire shi idan bai ƙunshi kanun labarai a layi ba.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Jerin ayar da ke wakiltar Kalmomin Yesu.
     * An yi watsi da shi idan ayar ba ta ƙunshi komai ba.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Jerin rubutun baiti da ke wakiltar layukan wakoki.
     * An yi watsi da shi idan ayar ba ta ƙunshi komai ba.
     */
    poem?: SimplePoemRange[];
}

/**
 * Subtitle na Ibrananci a cikin babi.
 * Sau da yawa ana haɗa waɗannan a matsayin abubuwan da ke cikin bayanai waɗanda suka bayyana a cikin rubuce-rubucen asali.
 * Misali, Zabura ta 49 tana da taken Ibrananci "Ga shugaban mawaƙa. Zabura ta 'Ya'yan Kora."
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Yana nuna cewa abubuwan da ke ciki suna wakiltar Subtitle na Ibrananci.
     */
    type: 'hebrew_subtitle';
}

/**
 * Bayanin ƙasa a cikin aya.
 */
interface SimpleVerseFootnote {
    /**
     * ID na takardar.
     */
    noteId: number;

    /**
     * Fihirisar da ke cikin rubutun baitin da ya kamata a saka a ƙasan bayanin da ke cikinsa.
     */
    offset: number;

    /**
     * Rubutun ƙasan ƙasa.
     */
    text: string;

    /**
     * Mai kiran da ya kamata a yi amfani da shi don yin amfani da ƙasidar ƙasa.
     * Idan "+" ne, to ya kamata a ƙirƙiri mai kiran ta atomatik.
     * Idan babu komai, to mai kiran ya kamata ya zama babu komai.
     * Idan igiya ce, to mai kiran ya kamata ya zama igiyar.
     */
    caller: '+' | string | null;
}

/**
 * Kanun da aka saka a cikin aya.
 */
interface SimpleInlineHeading {
    /**
     * Fihirisar da ke cikin rubutun ayar da taken ya bayyana a.
     */
    offset: number;

    /**
     * Rubutun kanun.
     */
    text: string;
}

/**
 * Jerin rubutu a cikin aya.
 */
interface SimpleTextRange {
    /**
     * Fihirisar harafin farko na zangon.
     */
    start: number;

    /**
     * Fihirisar bayan harafin ƙarshe na zangon.
     */
    end: number;
}

/**
 * Jerin rubutu a cikin baiti wanda ke wakiltar layin waƙa.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Matakin da ya kamata a nuna layin waƙar da shi.
     */
    level: number;
}
```

### Misali

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

An ajiye Waƙa da Kalmomin Yesu a matsayin jeri a kan rubutun ayar. Misali, `Matthew 5:3` a cikin fassarar `engwebp` yayi kama da haka:

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

## Nemo Kalmomin Babi a Tsarin Sauƙi

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Yana samun bayanin da ke matakin kalmomi na babi ɗaya, tare da sake tsara ma'aunin su a kan rubutun kowace [baiti mai sauƙi](#get-a-simplified-chapter-from-a-translation) .

An haɗa abubuwan da aka rage a cikin [bayanin da aka saba amfani da su](./standard.md#get-the-words-of-a-chapter) zuwa ga abubuwan da ke cikin jerin `content` na aya, waɗanda tsarin da aka sauƙaƙe ya ​​maye gurbinsu da igiya ɗaya - don haka ba za a iya amfani da su da ita ba. Yi amfani da wannan fayil ɗin a madadin lokacin da kake aiki da surori masu sauƙi.

-   `translation` shine ID na fassarar (misali `BSB` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa - zaka iya samun jerin ID na littafi [anan](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` shine babin lambobi (misali `1` don babi na farko).

Waɗannan shigarwar ba su da `contentIndex` `start` da `end` an yi musu gyara a cikin `text` na baiti, kamar yadda aka yi amfani da ƙarin bayani a ƙasa, waƙa, da kuma kalmomin Yesu a cikin surori masu sauƙi, don haka `text.slice(start, end)` ita ce kalmar da aka yi bayani a kai.

Kamar yadda yake a cikin bayanin da aka saba, wasu fassarori ne kawai ke da su. Babi mai sauƙi wanda ke ɗauke da hanyoyin haɗi zuwa wannan fayil ɗin tare da `thisChapterWordsLink` ; lokacin da wannan kadarar ta ɓace, wannan fayil ɗin ba ya wanzu don babin.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Sami rubutun Farawa 1 da kalmomin da aka yi bayani a ciki
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

### Tsarin gini

Tsarin ya yi daidai [da bayanin da aka saba bayarwa](./standard.md#get-the-words-of-a-chapter) , sai dai hanyoyin haɗin yanar gizon suna nuna fayilolin da aka sauƙaƙe kuma shigarwar ba ta da `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * ID na fassarar.
     */
    translationId: string;

    /**
     * ID na littafin.
     */
    bookId: string;

    /**
     * Adadin babin.
     */
    chapterNumber: number;

    /**
     * Haɗin zuwa babi mai sauƙi wanda waɗannan bayanan suka kasance don.
     */
    thisChapterLink: string;

    /**
     * Hanyar haɗi zuwa babi mai sauƙi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterLink: string | null;

    /**
     * Hanyar haɗi zuwa babin da aka sauƙaƙa a baya.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterLink: string | null;

    /**
     * Haɗin zuwa waɗannan bayanan.
     */
    thisChapterWordsLink: string;

    /**
     * Hanyar haɗi zuwa bayanin da ke ƙasa don babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar, ko kuma idan babi na gaba ba shi da wani bayani na matakin kalma.
     */
    nextChapterWordsLink: string | null;

    /**
     * Hanyar haɗi zuwa bayanin da aka bayar a babi na baya.
     * Babu komai idan wannan shine babi na farko a fassarar, ko kuma idan babi na baya ba shi da wani bayani na matakin kalma.
     */
    previousChapterWordsLink: string | null;

    /**
     * Kalmomin da aka rubuta a cikin kowace aya a cikin surar, waɗanda aka manne da lambar aya.
     * Kowanne jeri yana cikin tsarin da kalmomin suka bayyana a cikin ayar.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Bayanin matakin kalma a cikin babi mai sauƙi.
 */
export interface SimpleChapterWord {
    /**
     * Fihirisar harafin farko na kalmar da aka yi wa alama a cikin rubutun ayar.
     */
    start: number;

    /**
     * Fihirisar da ke bayan harafin ƙarshe na kalmar da aka yi wa alama a cikin rubutun baitin.
     */
    end: number;

    /**
     * Lambobin Ƙarfi don kalmar.
     */
    strongs?: string[];

    /**
     * Kalmar lemma (siffar ƙamus) a cikin harshen tushe.
     */
    lemma?: string;

    /**
     * Tsarin kalmar a cikin harshen tushe.
     */
    morph?: string;

    /**
     * Wurin da kalmar take a cikin rubutun tushe.
     */
    srcloc?: string;

    /**
     * Wace irin aukuwar kalmar a cikin ayar ce wannan.
     */
    occurrence?: number;

    /**
     * Adadin sau da kalmar ta bayyana a cikin ayar.
     */
    occurrences?: number;
}
```

### Misali

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

Aya ta 1 ta wannan babi tana da rubutun `"In the beginning was the Word, and the Word was with God, and the Word was God."` , don haka `text.slice(7, 16)` shine `"beginning"` .

## Sami cikakken Fassara a Tsarin Sauƙi

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Yana samun abubuwan da ke cikin fassarar gaba ɗaya, ta amfani da tsarin da aka sauƙaƙe. Wannan shine [tsarin babi mai sauƙi](#get-a-simplified-chapter-from-a-translation) da aka yi amfani da shi don [sauke fassarar gaba ɗaya](./standard.md#get-an-entire-translation) : fayil ɗaya wanda ke ɗauke da fassarar gaba ɗaya, inda abubuwan da ke cikin kowace baiti ɗaya ne.

Yi amfani da wannan lokacin da kake son rubutun fassarar gaba ɗaya ba tare da yin buƙata a kowane babi ba kuma ba tare da gina rubutun da kanka ba.

-   `translation` shine ID na fassarar (misali `BSB` ).

Ana samar da wannan fayil ɗin tare da `complete.json` , don haka fassarar ko dai tana da duka biyun ko kuma babu ɗayansu. Abu `translation` a cikin fayilolin biyu ya ƙunshi `completeTranslationApiLink` da `simpleCompleteTranslationApiLink` , don haka zaka iya motsawa tsakanin tsarin biyu.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Sami rubutun dukkan fassarar BSB
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

### Tsarin gini

Tsarin ya dace [da cikakken saukar da fassarar da aka saba yi](./standard.md#get-an-entire-translation) , sai dai cewa kowace babi tana amfani da tsarin da aka sauƙaƙe.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Yana bayyana cikakken bayanan saukar da fassarar, ta amfani da tsarin babi mai sauƙi.
 * Taswirori zuwa ƙarshen /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Bayanan fassarar.
     */
    translation: Translation;

    /**
     * Cikakken jerin littattafai tare da dukkan surori.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Sauke littafi a cikin cikakken fassarar, ta amfani da tsarin babi mai sauƙi.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Cikakken jerin surori tare da duk abubuwan da ke ciki.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Babi a cikin cikakken fassarar da aka sauke, ta amfani da tsarin babi mai sauƙi.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Adadin ayoyin da surar ta kunsa.
     */
    numberOfVerses: number;

    /**
     * Hanyoyin haɗi zuwa nau'ikan sauti daban-daban don babin.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Lokacin sauti (lokacin farawa a kowace aya, cikin daƙiƙa) na babin.
     *
     * Lura cewa cikakkun fayilolin fassarar suna ɗauke da lokutan da kansu (duba TranslationBookChapterAudioTimingsMap a cikin takaddun tsari na yau da kullun), sabanin ƙarshen babi na mutum ɗaya, wanda ke ɗauke da hanyoyin haɗi zuwa gare su.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Hanyar haɗi zuwa bayanin matakin kalma don babin, ta amfani da tsarin da aka sauƙaƙe. An cire shi idan babin ba shi da bayanin matakin kalma.
     */
    thisChapterWordsLink?: string;

    /**
     * Bayanin da aka sauƙaƙa don babin.
     */
    chapter: SimpleChapterData;
}
```

### Misali

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
