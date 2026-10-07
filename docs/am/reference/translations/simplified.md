# ቀለል ያለ ቅርጸት

ለምዕራፎች፣ ለተሟላ የትርጉም ውርዶች እና ለቃላት ደረጃ ማብራሪያዎች የተቃለለ ቅርጸት። የትርጉም እና የመጽሐፍ ዝርዝር የመጨረሻ ነጥቦችን ለማግኘት [ትርጉሞችን፣ መጻሕፍትን እና ምዕራፎችን](./README.md) ወይም የዚህን ይዘት የመጀመሪያ እና የተዋቀረ ውክልና [መደበኛ ቅርጸት](./standard.md) ይመልከቱ።

## ከትርጉም ቀለል ያለ ምዕራፍ ያግኙ

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

የአንድ የተወሰነ መጽሐፍ እና የትርጉም አንድ ምዕራፍ ይዘትን ቀለል ባለ ቅርጸት በመጠቀም ያገኛል።

በቀላል አጻጻፍ፣ የእያንዳንዱ ጥቅስ ይዘት የተቀረጸ ይዘት ዝርዝር ሳይሆን አንድ ነጠላ ሕብረቁምፊ ነው። ይህ ማለት የአንድን ጥቅስ ጽሑፍ እራስዎ መገንባት የለብዎትም ማለት ነው፣ ይህም በትክክል ለማግኘት ቀላል ላይሆን ይችላል - በተለይም ክፍተትን በተመለከተ። በቀላል ሕብረቁምፊ - የግርጌ ማስታወሻዎች፣ የኢየሱስ ቃላት፣ ግጥም እና በጥቅሱ መካከል የሚከሰቱ ርዕሶች - ሊወከል የማይችል ማንኛውም ነገር በዚያ ሕብረቁምፊ ውስጥ እንደ ማካካሻ ይቀመጣል፣ ስለዚህ ምንም ነገር አይጠፋም።

የአንድ ምዕራፍ ጽሑፍ ሲፈልጉ ይህንን የመጨረሻ ነጥብ ይጠቀሙ። ምዕራፉን ከመጀመሪያው ቅርጸት ጋር ለማሳየት ሲፈልጉ [መደበኛውን የምዕራፍ የመጨረሻ ነጥብ](./standard.md#get-a-chapter-from-a-translation) ይጠቀሙ።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ ለዘፍጥረት `GEN` - የመጽሐፍ መታወቂያዎችን ዝርዝር [እዚህ](https://ubsicap.github.io/usfm/identification/books.html) ማግኘት ይችላሉ)።
-   `chapter` የቁጥር ምዕራፍ ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

የቃላት ደረጃ ማብራሪያዎች ያላቸው ምዕራፎች ከ `thisChapterWordsLink` ጋር ያገናኛሉ፣ ይህም ወደ [ቀለል ያሉ ማብራሪያዎች](#get-the-words-of-a-chapter-in-the-simplified-format) የሚያመለክት ነው - ማካካሻዎቻቸው በዚህ ፋይል ውስጥ ካለው ጽሑፍ ጋር የሚዛመዱ።

በእያንዳንዱ አንባቢ የድምጽ ጊዜ አቆጣጠር ያላቸው ምዕራፎች ከ `thisChapterAudioTimings` ጋር ያገናኛሉ፣ ይህም [በድምጽ ጊዜ አቆጣጠር የመጨረሻ ነጥብ](./standard.md#get-the-audio-timings-for-a-chapter) ላይ ያተኩራል - መደበኛው የምዕራፍ መጨረሻ ነጥብ የሚያገናኘው ተመሳሳይ ፋይል ነው፣ ምክንያቱም ጊዜዎች በምዕራፍ ቅርጸት ላይ የተመካ ስላልሆኑ።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// የዘፍጥረት 1ን ጽሑፍ ከቢኤስቢ ትርጉም ያግኙ
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

### ማካካሻዎች

በቀላል ቅርጸት - `offset` ፣ `start` እና `end` - ውስጥ ያሉት ሁሉም ማካካሻዎች በያዘው የቁጥር `text` ውስጥ ያሉ ኢንዴክሶች ናቸው። የሚለኩት በUTF-16 የኮድ አሃዶች ነው፣ ይህም የጃቫስክሪፕት `String.prototype.length` እና `String.prototype.slice()` ጥቅም ላይ የሚውለው።

`start` የሚያካትት ሲሆን `end` ደግሞ ልዩ ነው፣ ስለዚህ `text.slice(start, end)` ምልክት የተደረገበትን የጽሑፍ ክልል በትክክል ይመልሳል። የግርጌ ማስታወሻ ማካካሻዎች የግርጌ ማስታወሻው ደዋዩ ያለበት ቦታ ናቸው፣ ስለዚህ `text.slice(0, offset)` ከሱ በፊት የሚመጣው ጽሑፍ ነው።

### መዋቅር

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * የመጽሐፉ ምዕራፍ የትርጉም መረጃ።
     */
    translation: Translation;

    /**
     * ለመጽሐፉ ምዕራፍ የመጽሐፉ መረጃ።
     */
    book: TranslationBook;

    /**
     * ወደ የአሁኑ ምዕራፍ የሚወስድ አገናኝ።
     */
    thisChapterLink: string;

    /**
     * የዚህ ምዕራፍ መደበኛ (ቀላል ያልሆነ) ስሪት አገናኝ።
     */
    fullChapterApiLink: string;

    /**
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች አገናኞች።
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች የድምጽ ጊዜዎች አገናኞች።
     * በመደበኛው የሰነዶች ቅርጸት "ለአንድ ምዕራፍ የድምጽ ጊዜዎችን ያግኙ" የሚለውን ይመልከቱ - የጊዜ ፋይሉ ከየትኛውም የምዕራፍ ቅርጸት ጋር ቢገናኝም ተመሳሳይ ነው።
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * ወደሚቀጥለው ምዕራፍ የሚወስደው አገናኝ፣ በቀላል ቅርጸት።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterApiLink: string | null;

    /**
     * ለቀጣዩ ምዕራፍ ወደተለያዩ የድምጽ ቅጂዎች የሚወስዱ አገናኞች።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * ለቀጣዩ ምዕራፍ የተለያዩ የድምጽ ስሪቶች የድምጽ ጊዜዎች አገናኞች።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * ወደ ቀዳሚው ምዕራፍ የሚወስደው አገናኝ፣ በቀላል ቅርጸት።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterApiLink: string | null;

    /**
     * ለቀደመው ምዕራፍ ወደተለያዩ የድምጽ ስሪቶች የሚወስዱ አገናኞች።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * ለቀደመው ምዕራፍ የተለያዩ የድምጽ ስሪቶች የድምጽ ጊዜ አገናኞች።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * ምዕራፉ የያዘው የቁጥሮች ብዛት።
     */
    numberOfVerses: number;

    /**
     * ለምዕራፉ የተሰጠው መረጃ።
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * የምዕራፉ ቁጥር።
     */
    number: number;

    /**
     * የምዕራፉ ይዘት።
     */
    content: SimpleChapterContent[];

    /**
     * ከጥቅስ ጋር ሊዛመዱ የማይችሉ የግርጌ ማስታወሻዎች ዝርዝር።
     * የአንድ ጥቅስ የግርጌ ማስታወሻዎች በጥቅሱ ራሱ ላይ ተካትተዋል፣ ስለዚህ ይህ ዝርዝር ብዙውን ጊዜ ባዶ ነው።
     */
    footnotes: ChapterFootnote[];
}

/**
 * በቀላል ምዕራፍ ውስጥ አንድ የይዘት ክፍልን የሚወክል የህብረት አይነት።
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * በአንድ ምዕራፍ ውስጥ ያለ ርዕስ።
 */
interface SimpleChapterHeading {
    /**
     * ይዘቱ ርዕስን እንደሚወክል ያመለክታል።
     */
    type: 'heading';

    /**
     * የርዕሱ ጽሑፍ።
     */
    text: string;
}

/**
 * በአንድ ምዕራፍ ውስጥ የመስመር መግቻ።
 */
interface ChapterLineBreak {
    /**
     * ይዘቱ የመስመር መግቻን እንደሚወክል ያመለክታል።
     */
    type: 'line_break';
}

/**
 * በአንድ ምዕራፍ ውስጥ ያለ ጥቅስ።
 */
interface SimpleChapterVerse {
    /**
     * ይዘቱ አንድ ጥቅስ መሆኑን ያመለክታል።
     */
    type: 'verse';

    /**
     * የጥቅሱ ቁጥር።
     */
    number: number;

    /**
     * የጥቅሱ ጽሑፍ።
     * የግጥም መስመሮች እና የመስመር ክፍተቶች በአዲስ መስመር (\n) ገፀ-ባህሪያት ተለያይተዋል።
     */
    text: string;

    /**
     * በጥቅሱ ውስጥ የሚገኙት የግርጌ ማስታወሻዎች።
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * በጥቅሱ መሃል ላይ የሚከሰቱት ርዕሶች።
     * ጥቅሱ ምንም አይነት የውስጥ ርዕስ ከሌለው ይሰረዛል።
     */
    headings?: SimpleInlineHeading[];

    /**
     * የኢየሱስን ቃላት የሚወክሉ የጥቅሱ ክፍሎች።
     * ጥቅሱ ምንም ነገር ከሌለው ተትቷል።
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * የግጥም መስመሮችን የሚወክሉ የግጥም ጽሑፍ ክልሎች።
     * ጥቅሱ ምንም ነገር ከሌለው ተትቷል።
     */
    poem?: SimplePoemRange[];
}

/**
 * በአንድ ምዕራፍ ውስጥ የሚገኝ የዕብራይስጥ ንዑስ ርዕስ።
 * እነዚህ ብዙውን ጊዜ በዋናዎቹ የእጅ ጽሑፎች ውስጥ እንደ መረጃ ሰጪ ይዘት ይካተታሉ።
 * ለምሳሌ፣ መዝሙር 49 የዕብራይስጥ ንዑስ ርዕስ አለው "ለመዘምራን አለቃ። የቆሬ ልጆች መዝሙር።"
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * ይዘቱ የዕብራይስጥ ንዑስ ርዕስን እንደሚወክል ያመለክታል።
     */
    type: 'hebrew_subtitle';
}

/**
 * በአንድ ጥቅስ ውስጥ የግርጌ ማስታወሻ።
 */
interface SimpleVerseFootnote {
    /**
     * የማስታወሻው መታወቂያ።
     */
    noteId: number;

    /**
     * የግርጌ ማስታወሻ ደዋዩ ማስገባት ያለበት በጥቅሱ ጽሑፍ ውስጥ ያለው ማውጫ።
     */
    offset: number;

    /**
     * የግርጌ ማስታወሻው ጽሑፍ።
     */
    text: string;

    /**
     * ለግርጌ ማስታወሻው ጥቅም ላይ መዋል ያለበት ደዋይ።
     * "+" ከሆነ ደዋዩ በራስ-ሰር መፈጠር አለበት።
     * ባዶ ከሆነ ደዋዩ ባዶ መሆን አለበት።
     * ሕብረቁምፊ ከሆነ፣ ደዋዩ ያ ሕብረቁምፊ መሆን አለበት።
     */
    caller: '+' | string | null;
}

/**
 * በአንድ ጥቅስ ውስጥ የተካተተ ርዕስ።
 */
interface SimpleInlineHeading {
    /**
     * ርዕሱ በጥቅሱ ጽሑፍ ውስጥ የሚገኘው ማውጫ።
     */
    offset: number;

    /**
     * የርዕሱ ጽሑፍ።
     */
    text: string;
}

/**
 * በአንድ ጥቅስ ውስጥ የፅሁፍ ክልል።
 */
interface SimpleTextRange {
    /**
     * የክልል የመጀመሪያው ቁምፊ መረጃ ጠቋሚ።
     */
    start: number;

    /**
     * ከክልሉ የመጨረሻ ቁምፊ በኋላ ያለው መረጃ ጠቋሚ።
     */
    end: number;
}

/**
 * የግጥም መስመርን የሚወክል በአንድ ጥቅስ ውስጥ ያለ የጽሑፍ ክልል።
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * የግጥም መስመሩ መታየት ያለበት የገባ ደረጃ።
     */
    level: number;
}
```

### ለምሳሌ

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

ግጥምና የኢየሱስ ቃላት በጥቅሱ ጽሑፍ ውስጥ እንደ ክልል ተቀምጠዋል። ለምሳሌ፣ በ `engwebp` ትርጉም ውስጥ `Matthew 5:3` ቃል የሚከተለውን ይመስላል

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

## የምዕራፍ ቃላትን በቀላል ቅርጸት ያግኙ

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

የአንድ ምዕራፍ የቃላት ደረጃ ማብራሪያዎችን ያገኛል፣ ማካካሻዎቻቸው በእያንዳንዱ [ቀለል ባለ ቁጥር](#get-a-simplified-chapter-from-a-translation) ጽሑፍ ላይ እንደገና ተስተካክለዋል።

[በመደበኛ ማብራሪያዎች](./standard.md#get-the-words-of-a-chapter) ውስጥ ያሉት ማካካሻዎች ከቁጥር `content` አደራደር ክፍሎች ጋር የተቆራኙ ናቸው፣ ይህም ቀለል ያለው ቅርጸት በአንድ ሕብረቁምፊ ይተካቸዋል - ስለዚህ ከእሱ ጋር መጠቀም አይቻልም። ከቀላል ምዕራፎች ጋር ሲሰሩ ይህንን ፋይል ይጠቀሙ።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ ለዘፍጥረት `GEN` - የመጽሐፍ መታወቂያዎችን ዝርዝር [እዚህ](https://ubsicap.github.io/usfm/identification/books.html) ማግኘት ይችላሉ)።
-   `chapter` የቁጥር ምዕራፍ ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

እነዚህ ግቤቶች `contentIndex` የላቸውም። `start` እና `end` ልክ እንደ ጥቅሱ `text` ክፍል፣ ግጥም እና የኢየሱስ ቃላት ማካካሻዎች ናቸው፣ ስለዚህ `text.slice(start, end)` የተብራራው ቃል ነው።

እንደ መደበኛ ማብራሪያዎች፣ አንዳንድ ትርጉሞች ብቻ ነው ያላቸው። ከዚህ ፋይል ጋር የሚያገናኝ ቀለል ያለ ምዕራፍ ከ `thisChapterWordsLink` ጋር፤ ያ ባህሪ ሲጠፋ፣ ይህ ፋይል ለምዕራፉ የለም።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// የዘፍጥረት 1ን ጽሑፍ እና በውስጡ የተገለጹትን ቃላት ያግኙ
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

### መዋቅር

አወቃቀሩ [ከመደበኛው ማብራሪያዎች](./standard.md#get-the-words-of-a-chapter) ጋር ይዛመዳል፣ አገናኞቹ ወደ ቀለል ያሉ ፋይሎች የሚያመለክቱ ከመሆናቸው በስተቀር እና ግቤቶቹ `contentIndex` የላቸውም።

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * የትርጉሙ መታወቂያ።
     */
    translationId: string;

    /**
     * የመጽሐፉ መታወቂያ።
     */
    bookId: string;

    /**
     * የምዕራፉ ቁጥር።
     */
    chapterNumber: number;

    /**
     * እነዚህ ማብራሪያዎች የሚቀርቡበት ወደ ቀለል ወዳለው ምዕራፍ የሚወስድ አገናኝ።
     */
    thisChapterLink: string;

    /**
     * ወደሚቀጥለው ቀለል ያለ ምዕራፍ የሚወስድ አገናኝ።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterLink: string | null;

    /**
     * ወደ ቀዳሚው ቀለል ያለ ምዕራፍ የሚወስድ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterLink: string | null;

    /**
     * ወደ እነዚህ ማብራሪያዎች የሚወስድ አገናኝ።
     */
    thisChapterWordsLink: string;

    /**
     * ለሚቀጥለው ምዕራፍ ወደ ማብራሪያዎች የሚወስድ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጨረሻው ምዕራፍ ከሆነ ወይም የሚቀጥለው ምዕራፍ በቃላት ደረጃ ምንም አይነት ማብራሪያ ከሌለው ባዶ ነው።
     */
    nextChapterWordsLink: string | null;

    /**
     * ወደ ቀዳሚው ምዕራፍ ወደ ማብራሪያዎች የሚወስድ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ወይም የቀደመው ምዕራፍ በቃላት ደረጃ ማብራሪያ ከሌለው ባዶ ነው።
     */
    previousChapterWordsLink: string | null;

    /**
     * በምዕራፉ ውስጥ ለእያንዳንዱ ጥቅስ የተገለጹ ቃላት፣ በቁጥር ቁጥር የተጻፉ።
     * እያንዳንዱ ዝርዝር ቃላቱ በጥቅሱ ውስጥ በተከሰቱበት ቅደም ተከተል ነው።
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * በቀላል ምዕራፍ ውስጥ የቃላት ደረጃ ማብራሪያ።
 */
export interface SimpleChapterWord {
    /**
     * በጥቅሱ ጽሑፍ ውስጥ የተብራራው ቃል የመጀመሪያ ቁምፊ ማውጫ።
     */
    start: number;

    /**
     * በግጥሙ ጽሑፍ ውስጥ ከተብራራው ቃል የመጨረሻ ቁምፊ በኋላ ያለው ማውጫ።
     */
    end: number;

    /**
     * የቃሉ የጠንካራው ቁጥሮች።
     */
    strongs?: string[];

    /**
     * የቃሉ ሌማ (የመዝገበ-ቃላት ቅጽ) በምንጭ ቋንቋ።
     */
    lemma?: string;

    /**
     * የቃሉ ሞርፎሎጂ በምንጭ ቋንቋ።
     */
    morph?: string;

    /**
     * በምንጭ ጽሑፍ ውስጥ የቃሉ ቦታ።
     */
    srcloc?: string;

    /**
     * ይህ በጥቅሱ ውስጥ የተጠቀሰው ቃል የትኛው መከሰት ነው።
     */
    occurrence?: number;

    /**
     * ቃሉ በጥቅሱ ውስጥ የተከሰተበት ጊዜ ብዛት።
     */
    occurrences?: number;
}
```

### ለምሳሌ

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

የዚያ ምዕራፍ ቁጥር 1 ጽሑፍ `"In the beginning was the Word, and the Word was with God, and the Word was God."` አለው፣ ስለዚህ `text.slice(7, 16)` `"beginning"` ነው።

## ሙሉውን ትርጉም በቀላል ቅርጸት ያግኙ

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

የተቀለለውን ቅርጸት በመጠቀም የአንድ ሙሉ ትርጉም ይዘት ያገኛል። ይህ [ለሙሉ የትርጉም ማውረድ](./standard.md#get-an-entire-translation) የተተገበረው [የተቀለለው የምዕራፍ ቅርጸት](#get-a-simplified-chapter-from-a-translation) ነው፡- አንድ ፋይል ሙሉውን ትርጉም የያዘ ሲሆን የእያንዳንዱ ጥቅስ ይዘት አንድ ነጠላ ሕብረቁምፊ ነው።

በአንድ ምዕራፍ ጥያቄ ሳታቀርቡ እና ጽሑፉን እራስዎ መገንባት ሳያስፈልግዎት የአንድ ሙሉ ትርጉም ጽሑፍ ሲፈልጉ ይህንን ይጠቀሙ።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።

ይህ ፋይል ከ `complete.json` ጎን ለጎን የተፈጠረ ነው፣ ስለዚህ አንድ ትርጉም ሁለቱንም ወይም ሁለቱንም ይይዛል። በሁለቱም ፋይሎች ውስጥ ያለው `translation` ነገር `completeTranslationApiLink` እና `simpleCompleteTranslationApiLink` ይዟል፣ ስለዚህ በሁለቱ ቅርጸቶች መካከል መንቀሳቀስ ይችላሉ።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// የቢኤስቢ ትርጉምን ሙሉ ጽሑፍ ያግኙ
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

### መዋቅር

አወቃቀሩ [ከመደበኛው ሙሉ የትርጉም ማውረድ ጋር](./standard.md#get-an-entire-translation) ይዛመዳል፣ እያንዳንዱ ምዕራፍ ቀለል ያለ ቅርጸትን የሚጠቀም ካልሆነ በስተቀር።

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * የተቃለለውን የምዕራፍ ቅርጸት በመጠቀም የተሟላ የትርጉም ማውረድ ውሂብን ይገልጻል።
 * ወደ /api/:translationId/complete.simple.json የመጨረሻ ነጥብ የሚወስዱ ካርታዎች።
 */
export interface SimpleTranslationComplete {
    /**
     * የትርጉም ሜታዳታ።
     */
    translation: Translation;

    /**
     * የመጽሐፎቹ ሙሉ ዝርዝር ከሁሉም ምዕራፎቻቸው ጋር።
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * ቀለል ባለ የምዕራፍ ቅርጸት በመጠቀም ሙሉ የትርጉም ማውረድ የሚችል መጽሐፍ።
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * ሙሉውን የምዕራፎች ዝርዝር የያዘ ሲሆን ሁሉንም ይዘቶች ያካትታል።
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * ቀለል ባለ የምዕራፍ ቅርጸት በመጠቀም ሙሉ የትርጉም ማውረድ ምዕራፍ።
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * ምዕራፉ የያዘው የቁጥሮች ብዛት።
     */
    numberOfVerses: number;

    /**
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች አገናኞች።
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * የምዕራፉ የድምጽ ጊዜ (በአንድ-ቁጥር የሚጀምርበት ጊዜ፣ በሰከንዶች)።
     *
     * ሙሉ የትርጉም ፋይሎቹ የጊዜ ሰሌዳዎቹን እራሳቸው እንደያዙ ልብ ይበሉ (በመደበኛ ቅርጸት ሰነዶች ውስጥ የTranslateBookChapterAudioTimingsMap ን ይመልከቱ)፣ ወደ እነሱ የሚወስዱ አገናኞችን የያዙ የግለሰብ ምዕራፍ የመጨረሻ ነጥቦች ሳይሆኑ።
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * ለምዕራፉ የቃላት ደረጃ ማብራሪያዎች የሚወስድ አገናኝ፣ ቀለል ባለ ቅርጸት። ምዕራፉ ምንም አይነት የቃላት ደረጃ ማብራሪያዎች ከሌሉት ተትቷል።
     */
    thisChapterWordsLink?: string;

    /**
     * ለምዕራፉ የቀረበው ቀለል ያለ መረጃ።
     */
    chapter: SimpleChapterData;
}
```

### ለምሳሌ

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
