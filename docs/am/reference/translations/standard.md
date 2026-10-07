# መደበኛ ቅርጸት

የምዕራፎች፣ የተሟላ የትርጉም ማውረዶች እና የቃላት ደረጃ ማብራሪያዎች መደበኛ ቅርጸት። የትርጉም እና የመጽሐፍ ዝርዝር የመጨረሻ ነጥቦችን ለማግኘት [ትርጉሞችን፣ መጻሕፍትን እና ምዕራፎችን](./README.md) ወይም የዚህን ይዘት አማራጭ ውክልና ለማግኘት [የተቃለለውን ቅርጸት](./simplified.md) ይመልከቱ።

## ከትርጉም አንድ ምዕራፍ ያግኙ

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

ለአንድ የተወሰነ መጽሐፍ እና ትርጉም የአንድ ምዕራፍ ይዘት ያገኛል።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ ለዘፍጥረት `GEN` - የመጽሐፍ መታወቂያዎችን ዝርዝር [እዚህ](https://ubsicap.github.io/usfm/identification/books.html) ማግኘት ይችላሉ)።
-   `chapter` የቁጥር ምዕራፍ ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// ዘፍጥረት 1ን ከቢኤስቢ ትርጉም ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች አገናኞች።
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች የድምጽ ጊዜዎች አገናኞች።
     * እያንዳንዱ አገናኝ ለዚያ አንባቢ የድምጽ ጊዜ ፋይሉን ይጠቁማል - ከታች "ለአንድ ምዕራፍ የድምጽ ጊዜ ፈልግ" የሚለውን ይመልከቱ።
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * ወደሚቀጥለው ምዕራፍ የሚወስድ አገናኝ።
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
     * ወደ ቀዳሚው ምዕራፍ የሚወስድ አገናኝ።
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
     * ለምዕራፉ የቃላት ደረጃ ማብራሪያዎች አገናኝ።
     * ምዕራፉ በቃላት ደረጃ ምንም አይነት ማብራሪያ ከሌለው ይሰረዛል።
     */
    thisChapterWordsLink?: string;

    /**
     * ለሚቀጥለው ምዕራፍ የቃላት ደረጃ ማብራሪያዎች አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጨረሻው ምዕራፍ ከሆነ ወይም የሚቀጥለው ምዕራፍ በቃላት ደረጃ ምንም አይነት ማብራሪያ ከሌለው ተትቷል።
     */
    nextChapterWordsLink?: string;

    /**
     * ለቀደመው ምዕራፍ የቃላት ደረጃ ማብራሪያዎች አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ወይም የቀደመው ምዕራፍ በቃላት ደረጃ ማብራሪያ ከሌለው ተትቷል።
     */
    previousChapterWordsLink?: string;

    /**
     * ምዕራፉ የያዘው የቁጥሮች ብዛት።
     */
    numberOfVerses: number;

    /**
     * ወደዚህ ምዕራፍ ቀለል ወዳለው ስሪት የሚወስድ አገናኝ።
     * የተቀረጹ ምዕራፎች ከሌሉ ተትቷል።
     */
    simpleChapterApiLink?: string;

    /**
     * ለምዕራፉ የተሰጠው መረጃ።
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * የምዕራፉ ቁጥር።
     */
    number: number;

    /**
     * የምዕራፉ ይዘት።
     */
    content: ChapterContent[];

    /**
     * የምዕራፉ የግርጌ ማስታወሻዎች ዝርዝር።
     */
    footnotes: ChapterFootnote[];
}

/**
 * የአንድ የምዕራፍ ይዘት አንድ ክፍል የሚወክል የህብረት አይነት።
 * የምዕራፍ ይዘት ከሚከተሉት ነገሮች አንዱ ሊሆን ይችላል፡
 * - ርዕስ።
 * - የመስመር መግቻ።
 * - አንድ ጥቅስ።
 * - የዕብራይስጥ ንዑስ ርዕስ።
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * በአንድ ምዕራፍ ውስጥ ያለ ርዕስ።
 */
interface ChapterHeading {
    /**
     * ይዘቱ ርዕስን እንደሚወክል ያመለክታል።
     */
    type: 'heading';

    /**
     * ለርዕሱ ይዘት።
     * በርካታ ሕብረቁምፊዎች በአደራደሩ ውስጥ ከተካተቱ፣ ከቦታ ጋር መያያዝ አለባቸው።
     */
    content: string[];
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
 * በአንድ ምዕራፍ ውስጥ የሚገኝ የዕብራይስጥ ንዑስ ርዕስ።
 * እነዚህ ብዙውን ጊዜ በዋናው የእጅ ጽሑፎች ውስጥ እንደ መረጃ ሰጪ ይዘት ተካትተው ያገለግላሉ።
 * ለምሳሌ፣ መዝሙር 49 የዕብራይስጥ ንዑስ ርዕስ አለው "ለመዘምራን አለቃ። የቆሬ ልጆች መዝሙር።"
 */
interface ChapterHebrewSubtitle {
    /**
     * ይዘቱ የዕብራይስጥ ንዑስ ርዕስን እንደሚወክል ያመለክታል።
     */
    type: 'hebrew_subtitle';

    /**
     * በንዑስ ጽሑፉ ውስጥ የተካተተው የይዘት ዝርዝር።
     * በዝርዝሩ ውስጥ ያለው እያንዳንዱ አካል ሕብረቁምፊ፣ የተቀረጸ ጽሑፍ ወይም የግርጌ ማስታወሻ ማጣቀሻ ሊሆን ይችላል።
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * በአንድ ምዕራፍ ውስጥ ያለ ጥቅስ።
 */
interface ChapterVerse {
    /**
     * ይዘቱ አንድ ጥቅስ መሆኑን ያመለክታል።
     */
    type: 'verse';

    /**
     * የጥቅሱ ቁጥር።
     */
    number: number;

    /**
     * የጥቅሱ ይዘት ዝርዝር።
     * በዝርዝሩ ውስጥ ያለው እያንዳንዱ አካል ሕብረቁምፊ፣ የተቀረጸ ጽሑፍ ወይም የግርጌ ማስታወሻ ማጣቀሻ ሊሆን ይችላል።
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * የተቀረጸ ጽሑፍ። ማለትም፣ በተወሰነ መንገድ የተቀረጸ ጽሑፍ።
 */
interface FormattedText {
    /**
     * የተቀረጸው ጽሑፍ።
     */
    text: string;

    /**
     * ጽሑፉ ግጥምን ይወክል እንደሆነ።
     * ቁጥሩ የገባበትን ደረጃ ያሳያል።
     *
     * በመዝሙራት ውስጥ የተለመደ።
     */
    poem?: number;

    /**
     * ጽሑፉ የኢየሱስን ቃላት ይወክል እንደሆነ።
     */
    wordsOfJesus?: boolean;
}

/**
 * በአንድ ጥቅስ ውስጥ የተካተተ ርዕስን የሚወክል በይነገጽን ይገልጻል።
 */
interface InlineHeading {
    /**
     * የርዕሱ ጽሑፍ።
     */
    heading: string;
}

/**
 * በአንድ ጥቅስ ውስጥ የተከተተ የመስመር መግቻን የሚወክል በይነገጽን ይገልጻል።
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * በአንድ ጥቅስ ወይም በዕብራይስጥ ንዑስ ርዕስ ውስጥ የግርጌ ማስታወሻ ማጣቀሻ።
 */
interface VerseFootnoteReference {
    /**
     * የማስታወሻው መታወቂያ።
     */
    noteId: number;
}

/**
 * ስለ የግርጌ ማስታወሻ መረጃ።
 */
interface ChapterFootnote {
    /**
     * የተጠቀሰው ማስታወሻ መታወቂያ።
     */
    noteId: number;

    /**
     * የግርጌ ማስታወሻው ጽሑፍ።
     */
    text: string;

    /**
     * የግርጌ ማስታወሻው የጥቅሱ ማጣቀሻ።
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * ለግርጌ ማስታወሻው ጥቅም ላይ መዋል ያለበት ደዋይ።
     * ለግርጌ ማስታወሻዎች፣ "ደዋይ" የሚለው ቃል በጽሑፉ ውስጥ የግርጌ ማስታወሻን ለማመልከት የሚያገለግል ገጸ-ባህሪ ነው።
     *
     * ለምሳሌ፣ በጽሑፉ ውስጥ፦
     * ሰላም (ሀ) ዓለም
     *
     * ---- (ሀ) ይህ የግርጌ ማስታወሻ ነው።
     *
     * "(ሀ)" የሚለው ደዋይ ነው።
     *
     * "+" ከሆነ ደዋዩ በራስ-ሰር መፈጠር አለበት።
     * ባዶ ከሆነ ደዋዩ ባዶ መሆን አለበት።
     * ሕብረቁምፊ ከሆነ፣ ደዋዩ ያ ሕብረቁምፊ መሆን አለበት።
     */
    caller: '+' | string | null;
}

/**
 * ለመጽሐፍ ምዕራፍ የድምጽ አገናኞች።
 */
interface TranslationBookChapterAudioLinks {
    /**
     * የምዕራፉ አንባቢ እና የዩአርኤል አገናኝ ወደ ኦዲዮ ፋይሉ።
     */
    [reader: string]: string;
}

/**
 * የድምፅ ጊዜዎች ለመጽሐፍ ምዕራፍ አገናኞች ናቸው።
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * የምዕራፉ አንባቢ እና የኤፒአይ አገናኝ ለዚያ አንባቢ የድምጽ ጊዜ ፋይሉ።
     */
    [reader: string]: string;
}
```

### ለምሳሌ

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

## ለአንድ ምዕራፍ የድምፅ ጊዜዎችን ያግኙ

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

የአንድ ምዕራፍ የድምጽ ጊዜዎችን ያገኛል፣ ለአንድ አንባቢ የሚተርክበት - ማለትም እያንዳንዱ ጥቅስ የሚጀምርበትን ጊዜ (በሰከንዶች ውስጥ፣ ከዚያ አንባቢ የድምጽ ፋይል መጀመሪያ አንጻር)። ደንበኞች ይህንን ተጠቅመው ኦዲዮው እየተጫወተ እያለ በአሁኑ ጊዜ እየተነበበ ያለውን ጥቅስ ማጉላት ይችላሉ።

አንዳንድ ትርጉሞችና አንባቢዎች ብቻ የድምጽ ጊዜ አላቸው። ለአንባቢዎች የሚያካትታቸው ምዕራፍ በ `thisChapterAudioTimings` ውስጥ የተቀመጠ ግቤት ያለው ሲሆን፣ በአንባቢው መታወቂያ የተቆለፈ ወደዚህ ፋይል ያገናኛል፤ አንባቢ በዚያ ካርታ ውስጥ ቁልፍ ካልሆነ፣ ይህ ፋይል ለዚያ አንባቢና ምዕራፍ የለም።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ ለዘፍጥረት `GEN` - የመጽሐፍ መታወቂያዎችን ዝርዝር [እዚህ](https://ubsicap.github.io/usfm/identification/books.html) ማግኘት ይችላሉ)።
-   `chapter` የቁጥር ምዕራፍ ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።
-   `reader` የአንባቢው ትረካ ጊዜዎቹ (ለምሳሌ `hays` ) የሆኑበት መለያ ነው - ለአንድ ምዕራፍ የሚገኙ አንባቢዎች የ `thisChapterAudioLinks` ቱ ቁልፎች ናቸው።

የአንድ ጥቅስ መጨረሻ የሚቀጥለው ጥቅስ መጀመሪያ (ወይም ለመጨረሻው ጥቅስ የድምጽ ፋይሉ መጨረሻ) ነው፣ ስለዚህ አንድ ደንበኛ ለሙሉ ምዕራፍ የማድመቂያ ክልሎችን ለመገንባት ከተደነገገው የመጀመሪያ ጊዜ ዝርዝር በላይ ምንም ነገር አያስፈልገውም።

ይህ ፋይል ከመደበኛው የምዕራፍ መጨረሻ ነጥብ ወይም [ከተቀላጠፈው ነጥብ](./simplified.md#get-a-simplified-chapter-from-a-translation) የተደረሰ ቢሆንም ተመሳሳይ ነው - በአንድ ትርጉም፣ መጽሐፍ፣ ምዕራፍ እና አንባቢ አንድ የጊዜ ስብስብ ብቻ አለ።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// የዘፍጥረት 1 (BSB) የድምጽ ጊዜዎችን በ"hays" እንደተነበበው ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * ለአንድ የመጽሐፍ ምዕራፍ የድምጽ ጊዜዎችን፣ ለአንድ አንባቢ ይገልጻል።
 * ካርታዎች ወደ /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json የመጨረሻ ነጥብ።
 */
export interface TranslationBookChapterAudioTimings {
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
     * እነዚህ የጊዜ ሰሌዳዎች የሚያመለክቱበት የአንባቢው መታወቂያ።
     */
    reader: string;

    /**
     * እነዚህ የጊዜ ሰሌዳዎች የሚቀርቡበት የድምጽ ፋይል አገናኝ።
     */
    audioLink: string;

    /**
     * የዚህ ምዕራፍ መረጃ አገናኝ።
     */
    thisChapterLink: string;

    /**
     * ለሚቀጥለው ምዕራፍ ወደ መረጃው የሚወስድ አገናኝ።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterLink: string | null;

    /**
     * ወደ ቀዳሚው ምዕራፍ የሚወስደው መረጃ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterLink: string | null;

    /**
     * ወደዚህ የድምጽ ጊዜ ፋይል የሚወስድ አገናኝ።
     */
    thisChapterAudioTimingsLink: string;

    /**
     * ለቀጣዩ ምዕራፍ የጊዜ ሰሌዳዎች የሚወስድ አገናኝ፣ ለተመሳሳይ አንባቢ።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * ለቀድሞው ምዕራፍ የጊዜ ሰሌዳዎች የሚወስድ አገናኝ፣ ለተመሳሳይ አንባቢ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * እያንዳንዱ ጥቅስ የሚጀምርባቸው ሰከንዶች፣ በቅደም ተከተል።
     * የመጀመሪያው ቁጥር (ኢንዴክስ 0) የመጀመሪያው ቁጥር የሚጀምርበት ጊዜ በመዝገብ ውስጥ ነው።
     */
    verses: number[];
}
```

### ለምሳሌ

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

`verses[0]` የቁጥር 1 የመጀመሪያ ጊዜ ነው፣ `verses[1]` የቁጥር 2 የመጀመሪያ ጊዜ ነው፣ ወዘተ - ስለዚህ በዚህ ምሳሌ፣ የዘፍጥረት 1 ቁጥር 2 (BSB፣ በ"hays" እንደተነበበው) ከ `audioLink` በኋላ በ4.32 ሰከንዶች ውስጥ ይጀምራል።

## የአንድ ምዕራፍ ቃላትን ያግኙ

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

ለአንድ ምዕራፍ የቃላት ደረጃ ማብራሪያዎችን (የጠንካራ ቁጥሮች እና ተዛማጅ የምንጭ መረጃዎች) ያገኛል።

አንዳንድ ትርጉሞች ብቻ የቃላት ደረጃ ማብራሪያዎችን ያካትታሉ። ከዚህ ፋይል ጋር የሚያገናኝ ምዕራፍ ከ `thisChapterWordsLink` ጋር፤ ያ ባህሪ ሲጠፋ፣ ይህ ፋይል ለምዕራፉ የለም።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።
-   `book` የመጽሐፉ መለያ ነው (ለምሳሌ ለዘፍጥረት `GEN` - የመጽሐፍ መታወቂያዎችን ዝርዝር [እዚህ](https://ubsicap.github.io/usfm/identification/books.html) ማግኘት ይችላሉ)።
-   `chapter` የቁጥር ምዕራፍ ነው (ለምሳሌ ለመጀመሪያው ምዕራፍ `1` )።

እያንዳንዱ ማብራሪያ በአንድ የቁጥር `content` ድርድር ውስጥ በአንድ `end` ንጥል ውስጥ ካሉ የተለያዩ የቁምፊዎች ክልል ጋር የተቆራኘ ነው `contentIndex` የእቃው ማውጫ ነው፣ እና `start` በዚያ ንጥል ጽሑፍ ውስጥ የቁምፊዎች ማካካሻ ናቸው። `end` ልዩ ነው፣ ስለዚህ `text.slice(start, end)` የተብራራው ቃል ነው።

ከይዘት ንጥል ጋር መጣበቅ (በጥቅሱ ላይ በአጠቃላይ ከመሆን ይልቅ) ማለት ይዘታቸው ወደ ብዙ ነገሮች የተከፈለባቸው ጥቅሶች ትክክል ሆነው ይቆያሉ ማለት ነው፣ ለምሳሌ የግጥም መስመሮች፣ የኢየሱስ ቃላት እና የግርጌ ማስታወሻ ማጣቀሻዎች።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// የዘፍጥረት 1 ቃላትን ከቢኤስቢ ትርጉም ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * የዚህ ምዕራፍ መረጃ አገናኝ።
     */
    thisChapterLink: string;

    /**
     * ለሚቀጥለው ምዕራፍ ወደ መረጃው የሚወስድ አገናኝ።
     * ይህ የትርጉም የመጨረሻው ምዕራፍ ከሆነ ባዶ ነው።
     */
    nextChapterLink: string | null;

    /**
     * ወደ ቀዳሚው ምዕራፍ የሚወስደው መረጃ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ባዶ ነው።
     */
    previousChapterLink: string | null;

    /**
     * ወደዚህ የቃላት ፋይል የሚወስድ አገናኝ።
     */
    thisChapterWordsLink: string;

    /**
     * ለሚቀጥለው ምዕራፍ ወደ ቃላቱ የሚወስድ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጨረሻው ምዕራፍ ከሆነ ወይም የሚቀጥለው ምዕራፍ በቃላት ደረጃ ምንም አይነት ማብራሪያ ከሌለው ባዶ ነው።
     */
    nextChapterWordsLink: string | null;

    /**
     * ለቀደመው ምዕራፍ ወደተጻፉት ቃላት የሚወስድ አገናኝ።
     * ይህ በትርጉሙ ውስጥ የመጀመሪያው ምዕራፍ ከሆነ ወይም የቀደመው ምዕራፍ በቃላት ደረጃ ማብራሪያ ከሌለው ባዶ ነው።
     */
    previousChapterWordsLink: string | null;

    /**
     * በምዕራፉ ውስጥ ለእያንዳንዱ ጥቅስ የተገለጹ ቃላት፣ በቁጥር ቁጥር የተጻፉ።
     * እያንዳንዱ ዝርዝር ቃላቱ በጥቅሱ ውስጥ በተከሰቱበት ቅደም ተከተል ነው።
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * ማብራሪያው የሚመለከተው በቁጥሩ የይዘት አደራደር ውስጥ ያለው የእቃው ማውጫ።
     */
    contentIndex: number;

    /**
     * በይዘት ንጥሉ ጽሑፍ ውስጥ የተብራራው ቃል የመጀመሪያ ቁምፊ ማውጫ።
     */
    start: number;

    /**
     * በይዘት ንጥሉ ጽሑፍ ውስጥ ከተብራራው ቃል የመጨረሻ ቁምፊ በኋላ ያለው መረጃ ጠቋሚ።
     * ማለትም፣ text.slice(መጀመሪያ፣ መጨረሻ) የተብራራው ቃል ነው።
     */
    end: number;

    /**
     * የቃሉ የጠንካራው ቁጥር(ዎች)።
     * ትርጉሙ ለቃሉ ሌሎች ማብራሪያዎችን ብቻ ካቀረበ ችላ ተብሏል።
     */
    strongs?: string[];

    /**
     * የቃሉ መዝገበ-ቃላት (የጥቅስ) ቅርፅ።
     * ትርጉሙ ካልሰጠ ተትቷል።
     */
    lemma?: string;

    /**
     * የቃሉ የሞርፎሎጂ ትንተና ኮድ።
     * ትርጉሙ ካልሰጠ ተትቷል።
     */
    morph?: string;

    /**
     * በምንጭ ጽሑፉ ውስጥ ወዳለው ቃል የሚጠቁመው ጠቋሚ፣ በ <sourceName> <location> ቅርጸት።
     * ትርጉሙ ካልሰጠ ተትቷል።
     */
    srcloc?: string;

    /**
     * የዚህ ቃል የምንጭ ቃል መከሰት በየትኛው ላይ የተመሠረተ ነው። 1-የተመሰረተ።
     * ትርጉሙ ካልሰጠ ተትቷል።
     */
    occurrence?: number;

    /**
     * የምንጭ ቃሉ የተከሰተበት ጠቅላላ ጊዜ ብዛት።
     * ትርጉሙ ካልሰጠ ተትቷል።
     */
    occurrences?: number;
}
```

### ለምሳሌ

የመጀመሪያው ጥቅስ አንድ የይዘት ንጥል ያለው ምዕራፍ ስንሰጥ፡

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

የቃላቱ ፋይል የዚያን ንጥል ቁምፊዎች ያብራራል፦

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

ማለትም፣ `"In the beginning...".slice(0, 2)` `"In"` ነው፣ ይህም ምንጩ በ `G1722` መለያ ተሰጥቶታል።

## ሙሉውን ትርጉም ያግኙ

`GET https://bible.helloao.org/api/{translation}/complete.json`

የአንድ ሙሉ ትርጉም ይዘት ያገኛል።

-   `translation` የትርጉሙ መለያ ነው (ለምሳሌ `BSB` )።

### የኮድ ምሳሌ

::: code-tabs#ቋንቋ

@tab ጃቫስክሪፕት

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// ዘፍጥረት 1ን ከቢኤስቢ ትርጉም ያግኙ
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

### መዋቅር

```typescript:no-line-numbers title="complete.ts"
/**
 * ሙሉውን የትርጉም ማውረድ ውሂብ ይገልጻል።
 * ወደ /api/:translationId/complete.json የመጨረሻ ነጥብ የሚወስዱ ካርታዎች።
 */
export interface TranslationComplete {
    /**
     * የትርጉም ሜታዳታ።
     */
    translation: Translation;

    /**
     * የመጽሐፎቹ ሙሉ ዝርዝር ከሁሉም ምዕራፎቻቸው ጋር።
     */
    books: TranslationCompleteBook[];
}

/**
 * ሙሉ የትርጉም ማውረድ ላይ ያለ መጽሐፍ።
 */
export interface TranslationCompleteBook {
    /**
     * የመጽሐፉ መታወቂያ።
     */
    id: string;

    /**
     * የመጽሐፉ ስም ከትርጉሙ።
     */
    name: string;

    /**
     * የመጽሐፉ የተለመደ ስም።
     */
    commonName: string;

    /**
     * የመጽሐፉ ርዕስ።
     */
    title: string | null;

    /**
     * የመጽሐፉ ቅደም ተከተል።
     */
    order: number;

    /**
     * በመጽሐፉ ውስጥ ያሉት የምዕራፎች ብዛት።
     */
    numberOfChapters: number;

    /**
     * በመጽሐፉ ውስጥ ያሉት አጠቃላይ የጥቅሶች ብዛት።
     */
    totalNumberOfVerses: number;

    /**
     * መጽሐፉ አፖክሪፋዊ ይሁን።
     */
    isApocryphal?: boolean;

    /**
     * ሙሉውን የምዕራፎች ዝርዝር የያዘ ሲሆን ሁሉንም ይዘቶች ያካትታል።
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * ሙሉ የትርጉም ማውረድ ላይ አንድ ምዕራፍ።
 */
export interface TranslationCompleteChapter {
    /**
     * ምዕራፉ የያዘው የቁጥሮች ብዛት።
     */
    numberOfVerses: number;

    /**
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች አገናኞች።
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * ለምዕራፉ የተለያዩ የድምጽ ስሪቶች የድምጽ ጊዜ (በአንድ-ቁጥር የሚጀምሩበት ጊዜ፣ በሰከንዶች)።
     *
     * በእያንዳንዱ የምዕራፍ መጨረሻ ላይ ካለው `thisChapterAudioTimings` በተለየ (ከታች "ለአንድ ምዕራፍ የድምጽ ጊዜዎችን ያግኙ" የሚለውን የሚያገናኝ)፣ ይህ የጊዜ ሰሌዳዎቹን እራሳቸው ይይዛል - ምክንያቱም ሙሉውን የትርጉም ማውረድ ዋናው ነገር ሁሉንም ነገር በአንድ ፋይል ውስጥ ማስቀመጥ ነው።
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * ለምዕራፉ የቃላት ደረጃ ማብራሪያዎች አገናኝ።
     * ምዕራፉ በቃላት ደረጃ ምንም አይነት ማብራሪያ ከሌለው ይሰረዛል።
     */
    thisChapterWordsLink?: string;

    /**
     * ለምዕራፉ የተሰጠው መረጃ።
     */
    chapter: ChapterData;
}

/**
 * የመጽሐፍ ምዕራፍ የድምጽ ጊዜዎች፣ በቀጥታ ከተገናኘው ይልቅ ተካትተዋል።
 * የአንባቢ መታወቂያን እያንዳንዱ ጥቅስ የሚጀምረውን የጊዜ ዝርዝር (በሰከንዶች)፣ በቁጥር ቅደም ተከተል ያስቀምጣል።
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### ለምሳሌ

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
