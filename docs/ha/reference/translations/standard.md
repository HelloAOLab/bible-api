# Tsarin Daidaitacce

Tsarin da aka saba amfani da shi don surori, saukar da cikakken fassarar, da kuma bayanin kalmomi. Duba [Fassara, Littattafai, & Babi](./README.md) don ƙarshen fassarar da jerin littattafai, ko kuma [tsarin da aka sauƙaƙe](./simplified.md) don wakilcin madadin wannan abun ciki.

## Sami Babi daga Fassara

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Yana samun abubuwan da ke cikin babi ɗaya na wani littafi da fassararsa.

-   `translation` shine ID na fassarar (misali `BSB` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa - zaka iya samun jerin ID na littafi [anan](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` shine babin lambobi (misali `1` don babi na farko).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Samu Farawa 1 daga fassarar BSB
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

### Tsarin gini

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * Hanyoyin haɗi zuwa nau'ikan sauti daban-daban don babin.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Hanyoyin haɗi zuwa lokutan sauti don nau'ikan sauti daban-daban na babin.
     * Kowace hanyar haɗi tana nuna fayil ɗin lokacin sauti na wannan mai karatu - duba "Sami Lokutan Sauti don Babi" a ƙasa.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Hanyar haɗi zuwa babi na gaba.
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
     * Hanyar haɗi zuwa babi na baya.
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
     * Hanyar haɗi zuwa bayanin matakin kalma don babin.
     * Ba a cire shi ba idan babin ba shi da wani bayani na matakin kalma.
     */
    thisChapterWordsLink?: string;

    /**
     * Hanyar haɗi zuwa bayanin kalmomi don babi na gaba.
     * An yi watsi da shi idan wannan shine babi na ƙarshe a fassarar, ko kuma idan babi na gaba ba shi da wani bayani na matakin kalma.
     */
    nextChapterWordsLink?: string;

    /**
     * Hanyar haɗi zuwa bayanin kalmomi na babi na baya.
     * An yi watsi da shi idan wannan shine babi na farko a cikin fassarar, ko kuma idan babi na baya ba shi da wani bayani na matakin kalma.
     */
    previousChapterWordsLink?: string;

    /**
     * Adadin ayoyin da surar ta kunsa.
     */
    numberOfVerses: number;

    /**
     * Hanyar haɗi zuwa sigar da aka sauƙaƙa ta wannan babi.
     * An yi watsi da shi idan ba a samu sassauƙan surori ba.
     */
    simpleChapterApiLink?: string;

    /**
     * Bayanin da aka bayar don babi.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Adadin babin.
     */
    number: number;

    /**
     * Abubuwan da ke cikin babin.
     */
    content: ChapterContent[];

    /**
     * Jerin bayanan ƙasa na babin.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Nau'in ƙungiyar da ke wakiltar wani ɓangare ɗaya na abubuwan da ke cikin babi.
 * Rubutun wani ɓangare na babi zai iya zama ɗaya daga cikin waɗannan abubuwa:
 * - Kanun labarai.
 * - Rage layi.
 * - Aya.
 * - Subtitle na Ibrananci.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Kan magana a cikin wani babi.
 */
interface ChapterHeading {
    /**
     * Yana nuna cewa abubuwan da ke ciki suna wakiltar wani taken.
     */
    type: 'heading';

    /**
     * Abubuwan da ke cikin taken.
     * Idan an haɗa igiyoyi da yawa a cikin jerin, ya kamata a haɗa su da sarari.
     */
    content: string[];
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
 * Subtitle na Ibrananci a cikin babi.
 * Ana amfani da waɗannan sau da yawa azaman abubuwan da ke cikin bayanai waɗanda suka bayyana a cikin rubutun asali.
 * Misali, Zabura ta 49 tana da taken Ibrananci "Ga shugaban mawaƙa. Zabura ta 'Ya'yan Kora."
 */
interface ChapterHebrewSubtitle {
    /**
     * Yana nuna cewa abubuwan da ke ciki suna wakiltar Subtitle na Ibrananci.
     */
    type: 'hebrew_subtitle';

    /**
     * Jerin abubuwan da ke cikin ƙaramin taken.
     * Kowace abu a cikin jerin na iya zama igiya, rubutu da aka tsara, ko kuma bayanin ƙasa.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Aya a cikin babi.
 */
interface ChapterVerse {
    /**
     * Yana nuna cewa abin da ke ciki aya ce.
     */
    type: 'verse';

    /**
     * Adadin ayar.
     */
    number: number;

    /**
     * Jerin abubuwan da ke cikin ayar.
     * Kowace abu a cikin jerin na iya zama igiya, rubutu da aka tsara, ko kuma bayanin ƙasa.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Rubutun da aka tsara. Wato, rubutun da aka tsara ta wata hanya ta musamman.
 */
interface FormattedText {
    /**
     * Rubutun da aka tsara.
     */
    text: string;

    /**
     * Ko rubutun yana wakiltar waƙa.
     * Lambar tana nuna matakin ƙofa.
     *
     * Wanda aka saba gani a cikin Zabura.
     */
    poem?: number;

    /**
     * Ko rubutun yana wakiltar Kalmomin Yesu.
     */
    wordsOfJesus?: boolean;
}

/**
 * Yana bayyana hanyar sadarwa da ke wakiltar wani jigo da aka saka a cikin aya.
 */
interface InlineHeading {
    /**
     * Rubutun kanun.
     */
    heading: string;
}

/**
 * Yana bayyana hanyar sadarwa da ke wakiltar wani layin da aka saka a cikin aya.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Nassin bayan shafi a cikin aya ko kuma Subtitle na Ibrananci.
 */
interface VerseFootnoteReference {
    /**
     * ID na takardar.
     */
    noteId: number;
}

/**
 * Bayani game da alamar ƙasa.
 */
interface ChapterFootnote {
    /**
     * ID na takardar da aka ambata.
     */
    noteId: number;

    /**
     * Rubutun ƙasan ƙasa.
     */
    text: string;

    /**
     * Nassin ayar don bayanin ƙasa.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Mai kiran da ya kamata a yi amfani da shi don yin amfani da ƙasidar ƙasa.
     * Ga ƙasidar ƙasa, "mai kira" shine harafin da ake amfani da shi a cikin rubutun don yin nuni ga ƙasidar ƙasa.
     *
     * Misali, a cikin rubutun:
     * Sannu (a) Duniya
     *
     * ---- (a) Wannan bayanin ƙasa ne.
     *
     * "(a)" shine mai kiran.
     *
     * Idan "+" ne, to ya kamata a ƙirƙiri mai kiran ta atomatik.
     * Idan babu komai, to mai kiran ya kamata ya zama babu komai.
     * Idan igiya ce, to mai kiran ya kamata ya zama igiyar.
     */
    caller: '+' | string | null;
}

/**
 * Hanyoyin sauti don babi na littafi.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Mai karatu na babi da kuma hanyar haɗin URL zuwa fayil ɗin sauti.
     */
    [reader: string]: string;
}

/**
 * Hanyoyin sauti na babi na littafi suna da alaƙa da lokacin da za a ɗauka.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Mai karatu na babi da kuma hanyar haɗin API zuwa fayil ɗin lokutan sauti na wannan mai karatu.
     */
    [reader: string]: string;
}
```

### Misali

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

## Nemo Lokacin Sauti na Babi

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Yana samun lokutan sauti na kowane aya na babi ɗaya, don labarin mai karatu ɗaya game da shi - wato, lokacin (a cikin daƙiƙa, dangane da farkon fayil ɗin sauti na mai karatu) wanda kowace aya ta fara. Abokan ciniki za su iya amfani da wannan don haskaka ayar da ake karantawa a halin yanzu yayin da sautin ke kunnawa.

Wasu fassarori da masu karatu ne kawai ke da lokutan sauti. Babi wanda ke ɗauke da su ga mai karatu yana haɗa zuwa wannan fayil ɗin tare da shigarwar a cikin `thisChapterAudioTimings` , wanda aka makulli da ID na mai karatu; idan mai karatu ba mabuɗi bane a cikin wannan taswirar, wannan fayil ɗin ba ya wanzu ga wannan mai karatu da babi.

-   `translation` shine ID na fassarar (misali `BSB` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa - zaka iya samun jerin ID na littafi [anan](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` shine babin lambobi (misali `1` don babi na farko).
-   `reader` shine ID na mai karatu wanda labarinsa lokacinsa na (misali `hays` ) ne - masu karatu da ake da su don babi sune mabuɗan `thisChapterAudioLinks` ɗinsa.

Ƙarshen aya shine farkon aya ta gaba (ko kuma, ga aya ta ƙarshe, ƙarshen fayil ɗin sauti), don haka abokin ciniki ba ya buƙatar komai fiye da jerin lokutan farawa da aka tsara don gina jeri na haskakawa ga dukkan babin.

Wannan fayil ɗin iri ɗaya ne ko an kai shi daga ƙarshen babi na yau da kullun ko [wanda aka sauƙaƙe](./simplified.md#get-a-simplified-chapter-from-a-translation) - akwai saitin lokaci ɗaya kawai ga kowane fassara, littafi, babi, da mai karatu.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Sami lokutan sauti na Farawa 1 (BSB), kamar yadda "hays" ya karanta
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

### Tsarin gini

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Yana bayyana lokutan sauti na babi na littafi, ga mai karatu ɗaya.
 * Taswirori zuwa ƙarshen /api/{translation}/{book}/{babi}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
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
     * ID na mai karatu wanda waɗannan lokutan suke yi.
     */
    reader: string;

    /**
     * Hanyar haɗi zuwa fayil ɗin sauti da waɗannan lokutan suke.
     */
    audioLink: string;

    /**
     * Hanyar haɗi zuwa bayanin wannan babi.
     */
    thisChapterLink: string;

    /**
     * Hanyar haɗi zuwa bayanin don babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterLink: string | null;

    /**
     * Hanyar haɗi zuwa bayanin da ke cikin babi na baya.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterLink: string | null;

    /**
     * Hanyar haɗi zuwa wannan fayil ɗin lokacin sauti.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Hanyar haɗi zuwa lokutan babi na gaba, ga mai karatu ɗaya.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Hanyar haɗi zuwa lokutan babi na baya, ga mai karatu ɗaya.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Lokutan da kowace aya ta fara a cikin daƙiƙa, cikin tsari.
     * Lamba ta farko (fihiri 0) ita ce lokacin da ayar farko ta fara a cikin rikodin.
     */
    verses: number[];
}
```

### Misali

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

`verses[0]` shine lokacin farawa na aya ta 1, `verses[1]` shine lokacin farawa na aya ta 2, da sauransu - don haka a cikin wannan misalin, aya ta 2 na Farawa 1 (BSB, kamar yadda "hays" ya karanta) ta fara da daƙiƙa 4.32 cikin `audioLink` .

## Karanta Kalmomin Babi

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Yana samun bayanin matakin kalmomi (lambobin ƙarfi da bayanan tushe masu alaƙa) na babi ɗaya.

Wasu fassarori ne kawai suka haɗa da bayanin matakin kalma. Babi wanda ke da alaƙa da wannan fayil ɗin tare da `thisChapterWordsLink` ; idan wannan siffa ta ɓace, wannan fayil ɗin ba ya wanzu don babin.

-   `translation` shine ID na fassarar (misali `BSB` ).
-   `book` shine ID na littafin (misali `GEN` don Farawa - zaka iya samun jerin ID na littafi [anan](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` shine babin lambobi (misali `1` don babi na farko).

Kowace bayanin an haɗa ta da jerin haruffa a cikin abu ɗaya na jerin `content` na baiti: `contentIndex` shine ma'aunin abun, kuma `start` sune ma'aunin haruffa a cikin rubutun wannan abun. `end` keɓantacce ne, don haka `end` `text.slice(start, end)` kalmar da aka yi bayani dalla-dalla.

Mannewa ga abun ciki (maimakon ayar gaba ɗaya) yana nufin cewa ma'aunin ya kasance daidai ga ayoyin da abubuwan da ke ciki suka kasu kashi-kashi da yawa, kamar layukan waƙa, kalmomin Yesu, da kuma bayanan ƙasa.

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Sami kalmomin Farawa 1 daga fassarar BSB
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

### Tsarin gini

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * Hanyar haɗi zuwa bayanin wannan babi.
     */
    thisChapterLink: string;

    /**
     * Hanyar haɗi zuwa bayanin don babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar.
     */
    nextChapterLink: string | null;

    /**
     * Hanyar haɗi zuwa bayanin da ke cikin babi na baya.
     * Babu komai idan wannan shine babi na farko a fassarar.
     */
    previousChapterLink: string | null;

    /**
     * Hanyar haɗi zuwa wannan fayil ɗin kalmomi.
     */
    thisChapterWordsLink: string;

    /**
     * Hanyar haɗi zuwa kalmomin don babi na gaba.
     * Babu komai idan wannan shine babi na ƙarshe a fassarar, ko kuma idan babi na gaba ba shi da wani bayani na matakin kalma.
     */
    nextChapterWordsLink: string | null;

    /**
     * Hanyar haɗi zuwa kalmomin babi na baya.
     * Babu komai idan wannan shine babi na farko a fassarar, ko kuma idan babi na baya ba shi da wani bayani na matakin kalma.
     */
    previousChapterWordsLink: string | null;

    /**
     * Kalmomin da aka rubuta a cikin kowace aya a cikin surar, waɗanda aka manne da lambar aya.
     * Kowanne jeri yana cikin tsarin da kalmomin suka bayyana a cikin ayar.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Fihirisar abin da ke cikin jerin abubuwan da ke cikin ayar da bayanin ya shafi.
     */
    contentIndex: number;

    /**
     * Fihirisar harafin farko na kalmar da aka yi wa alama a cikin rubutun abun ciki.
     */
    start: number;

    /**
     * Fihirisar da ke bayan harafin ƙarshe na kalmar da aka yi wa alama a cikin rubutun abin da ke ciki.
     * Wato, text.slice(farko, ƙarshe) ita ce kalmar da aka yi bayani a kai.
     */
    end: number;

    /**
     * Lambar(s) na kalmar The Strong.
     * An yi watsi da fassarar idan fassarar ta ba da wasu bayanai kawai ga kalmar.
     */
    strongs?: string[];

    /**
     * Siffar ƙamus (ƙirƙirar) kalmar.
     * An yi watsi da fassarar idan fassarar ba ta bayar da ɗaya ba.
     */
    lemma?: string;

    /**
     * Lambar nazarin yanayin kalma.
     * An yi watsi da fassarar idan fassarar ba ta bayar da ɗaya ba.
     */
    morph?: string;

    /**
     * Mai nuna kalmar a cikin rubutun tushe, a cikin tsarin <sourceName> : <location> .
     * An yi watsi da fassarar idan fassarar ba ta bayar da ɗaya ba.
     */
    srcloc?: string;

    /**
     * Wace irin asalin kalmar da wannan kalmar ta samo asali. 1-tushen.
     * An yi watsi da fassarar idan fassarar ba ta bayar da ɗaya ba.
     */
    occurrence?: number;

    /**
     * Jimillar adadin lokutan da kalmar tushe ta bayyana.
     * An yi watsi da fassarar idan fassarar ba ta bayar da ɗaya ba.
     */
    occurrences?: number;
}
```

### Misali

Idan aka ba da babi wanda baitinsa na farko yana da abu ɗaya da ke ciki:

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

Fayil ɗin kalmomin yana bayanin haruffan wannan abun:

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

Wato, `"In the beginning...".slice(0, 2)` shine `"In"` , wanda tushen ya yiwa alama da `G1722` .

## Sami cikakken Fassara

`GET https://bible.helloao.org/api/{translation}/complete.json`

Yana samun abubuwan da ke cikin fassarar gaba ɗaya.

-   `translation` shine ID na fassarar (misali `BSB` ).

### Misalin Lambar

::: code-tabs#lang

@shafin JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Samu Farawa 1 daga fassarar BSB
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

### Tsarin gini

```typescript:no-line-numbers title="complete.ts"
/**
 * Yana bayyana cikakken bayanan sauke fassarar.
 * Taswirori zuwa ƙarshen /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Bayanan fassarar.
     */
    translation: Translation;

    /**
     * Cikakken jerin littattafai tare da dukkan surori.
     */
    books: TranslationCompleteBook[];
}

/**
 * Littafi a cikin cikakken fassarar da aka sauke.
 */
export interface TranslationCompleteBook {
    /**
     * ID na littafin.
     */
    id: string;

    /**
     * Sunan littafin daga fassarar.
     */
    name: string;

    /**
     * Sunan da aka saba amfani da shi a littafin.
     */
    commonName: string;

    /**
     * Sunan littafin.
     */
    title: string | null;

    /**
     * Tsarin littafin.
     */
    order: number;

    /**
     * Adadin surori a cikin littafin.
     */
    numberOfChapters: number;

    /**
     * Jimillar ayoyi a cikin littafin.
     */
    totalNumberOfVerses: number;

    /**
     * Ko littafin apokrifa ne.
     */
    isApocryphal?: boolean;

    /**
     * Cikakken jerin surori tare da duk abubuwan da ke ciki.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Babi a cikin cikakken fassarar da aka sauke.
 */
export interface TranslationCompleteChapter {
    /**
     * Adadin ayoyin da surar ta kunsa.
     */
    numberOfVerses: number;

    /**
     * Hanyoyin haɗi zuwa nau'ikan sauti daban-daban don babin.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Lokacin sauti (kowace aya lokacin farawa, a cikin daƙiƙa) don nau'ikan sauti daban-daban na babin.
     *
     * Ba kamar `thisChapterAudioTimings` a ƙarshen babin babi ɗaya ba (wanda ke haɗe zuwa "Sami Lokutan Sauti don Babi" a ƙasa), wannan ya ƙunshi lokutan da kansu - tunda manufar sauke fassarar gaba ɗaya ita ce a sami komai a cikin fayil ɗaya.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Hanyar haɗi zuwa bayanin matakin kalma don babin.
     * Ba a cire shi ba idan babin ba shi da wani bayani na matakin kalma.
     */
    thisChapterWordsLink?: string;

    /**
     * Bayanin da aka bayar don babi.
     */
    chapter: ChapterData;
}

/**
 * Lokacin sauti na babi na littafi, an saka shi kai tsaye maimakon a haɗa shi.
 * Yana nuna katin shaidar mai karatu zuwa jerin lokutan da kowace aya ta fara (a cikin daƙiƙa), bisa ga tsarin baiti.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Misali

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
