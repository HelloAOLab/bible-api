# Muundo Uliorahisishwa

Muundo uliorahisishwa wa sura, vipakuliwa vya tafsiri kamili, na maelezo ya kiwango cha maneno. Tazama [Tafsiri, Vitabu, na Sura](./README.md) kwa sehemu za mwisho za tafsiri na orodha ya vitabu, au [muundo wa kawaida](./standard.md) wa uwakilishi asilia na uliopangwa wa maudhui haya haya.

## Pata Sura Iliyorahisishwa kutoka kwa Tafsiri

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Hupata maudhui ya sura moja kwa kitabu na tafsiri fulani, kwa kutumia muundo uliorahisishwa.

Katika umbizo rahisi, maudhui ya kila mstari ni mfuatano mmoja badala ya orodha ya maudhui yaliyopangwa. Hii ina maana kwamba huna haja ya kujenga maandishi ya mstari mwenyewe, ambayo yanaweza kuwa si rahisi ili kuyapata - hasa linapokuja suala la nafasi. Chochote ambacho hakiwezi kuwakilishwa na mfuatano wa kawaida - tanbihi, Maneno ya Yesu, ushairi, na vichwa vya habari vinavyotokea katikati ya mstari - huwekwa kama kikwazo katika mfuatano huo, kwa hivyo hakuna kinachopotea.

Tumia sehemu hii ya mwisho unapotaka maandishi ya sura. Tumia [sehemu ya mwisho ya sura ya kawaida](./standard.md#get-a-chapter-from-a-translation) unapotaka kuionyesha sura hiyo kwa umbizo lake la asili.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo - unaweza kupata orodha ya vitambulisho vya kitabu [hapa](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` ni sura ya nambari (km `1` kwa sura ya kwanza).

Sura zenye maelezo ya kiwango cha maneno zinaunganishwa nazo na `thisChapterWordsLink` , ambayo inaelekeza kwenye [maelezo yaliyorahisishwa](#get-the-words-of-a-chapter-in-the-simplified-format) - zile ambazo makosa yake yanalingana na maandishi katika faili hii.

Sura zenye muda wa sauti kwa kila msomaji huunganishwa nazo na `thisChapterAudioTimings` , ambayo huelekeza kwenye [mwisho wa muda wa sauti](./standard.md#get-the-audio-timings-for-a-chapter) - faili ile ile ambayo mwisho wa sura ya kawaida huunganisha, kwani muda hautegemei umbizo la sura.

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Pata maandishi ya Mwanzo 1 kutoka kwa tafsiri ya BSB
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

### Malipo ya ziada

Marekebisho yote katika umbizo lililorahisishwa - `offset` , `start` , na `end` - ni faharasa katika mstari wa `text` unaozijumuisha. Zinapimwa katika vitengo vya msimbo wa UTF-16, ambavyo ndivyo JavaScript hutumia `String.prototype.length` na `String.prototype.slice()` .

`start` inajumuisha na `end` ni ya kipekee, kwa hivyo `text.slice(start, end)` inarudisha safu kamili ya maandishi ambayo yalitiwa alama. Marekebisho ya chinichini ni nafasi ambayo kipigaji cha chinichini kinamiliki, kwa hivyo `text.slice(0, offset)` ni maandishi yanayokuja kabla yake.

### Muundo

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * Taarifa za tafsiri ya sura ya kitabu.
     */
    translation: Translation;

    /**
     * Taarifa za kitabu kwa ajili ya sura ya kitabu.
     */
    book: TranslationBook;

    /**
     * Kiungo cha sura ya sasa.
     */
    thisChapterLink: string;

    /**
     * Kiungo cha toleo la kawaida (lisilorahisishwa) la sura hii.
     */
    fullChapterApiLink: string;

    /**
     * Viungo vya matoleo tofauti ya sauti kwa sura hiyo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Viungo vya muda wa sauti kwa matoleo tofauti ya sauti kwa sura hiyo.
     * Tazama "Pata Muda wa Sauti kwa Sura" katika hati za umbizo la kawaida - faili ya muda ni sawa bila kujali ni umbizo gani la sura lililounganishwa nalo.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Kiungo cha sura inayofuata, katika muundo rahisi.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterApiLink: string | null;

    /**
     * Viungo vya matoleo tofauti ya sauti kwa sura inayofuata.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Viungo vya muda wa sauti kwa matoleo tofauti ya sauti kwa sura inayofuata.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Kiungo cha sura iliyotangulia, katika muundo rahisi.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterApiLink: string | null;

    /**
     * Viungo vya matoleo tofauti ya sauti kwa sura iliyotangulia.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Viungo vya muda wa sauti kwa matoleo tofauti ya sauti kwa sura iliyopita.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Idadi ya mistari ambayo sura hiyo ina.
     */
    numberOfVerses: number;

    /**
     * Taarifa kwa ajili ya sura.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Idadi ya sura.
     */
    number: number;

    /**
     * Maudhui ya sura hiyo.
     */
    content: SimpleChapterContent[];

    /**
     * Orodha ya tanbihi ambazo haziwezi kuhusishwa na mstari.
     * Tanbihi za chini zinazohusu mstari zimejumuishwa kwenye mstari wenyewe, kwa hivyo orodha hii kwa kawaida huwa tupu.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Aina ya muungano inayowakilisha kipande kimoja cha maudhui katika sura iliyorahisishwa.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Kichwa cha habari katika sura.
 */
interface SimpleChapterHeading {
    /**
     * Inaonyesha kwamba maudhui yanawakilisha kichwa cha habari.
     */
    type: 'heading';

    /**
     * Maandishi ya kichwa cha habari.
     */
    text: string;
}

/**
 * Mgawanyiko wa mstari katika sura.
 */
interface ChapterLineBreak {
    /**
     * Inaonyesha kwamba maudhui yanawakilisha mgawanyiko wa mstari.
     */
    type: 'line_break';
}

/**
 * Mstari katika sura.
 */
interface SimpleChapterVerse {
    /**
     * Inaonyesha kwamba maudhui ni mstari.
     */
    type: 'verse';

    /**
     * Nambari ya mstari.
     */
    number: number;

    /**
     * Maandishi ya mstari huo.
     * Mistari ya ushairi na migawanyiko ya mistari hutenganishwa na herufi mpya (\n).
     */
    text: string;

    /**
     * Tanbihi zinazopatikana katika mstari huo.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Vichwa vya habari vinavyotokea katikati ya mstari.
     * Imeachwa ikiwa mstari hauna vichwa vya habari vilivyoandikwa kwa mstari.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Safu za maandishi ya mistari zinazowakilisha Maneno ya Yesu.
     * Imeachwa ikiwa mstari hauna chochote.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Safu za maandishi ya mistari zinazowakilisha mistari ya ushairi.
     * Imeachwa ikiwa mstari hauna chochote.
     */
    poem?: SimplePoemRange[];
}

/**
 * Kichwa kidogo cha Kiebrania katika sura.
 * Hizi mara nyingi hujumuishwa kama maudhui ya taarifa yaliyoonekana katika hati asilia.
 * Kwa mfano, Zaburi 49 ina Kichwa Kidogo cha Kiebrania "Kwa kiongozi wa kwaya. Zaburi ya Wana wa Kora."
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Inaonyesha kwamba maudhui yanawakilisha Kichwa Kidogo cha Kiebrania.
     */
    type: 'hebrew_subtitle';
}

/**
 * Tanbihi katika mstari.
 */
interface SimpleVerseFootnote {
    /**
     * Kitambulisho cha noti.
     */
    noteId: number;

    /**
     * Faharasa katika maandishi ya mstari ambayo mtoa taarifa tanbihi anapaswa kuingizwa.
     */
    offset: number;

    /**
     * Maandishi ya tanbihi.
     */
    text: string;

    /**
     * Mpigaji simu anayepaswa kutumika kwa maelezo ya chini.
     * Ikiwa "+", basi mpigaji simu anapaswa kuzalishwa kiotomatiki.
     * Ikiwa ni batili, basi mpigaji simu anapaswa kuwa mtupu.
     * Ikiwa ni kamba, basi mpigaji anapaswa kuwa kamba hiyo.
     */
    caller: '+' | string | null;
}

/**
 * Kichwa cha habari kilichowekwa ndani ya mstari.
 */
interface SimpleInlineHeading {
    /**
     * Faharasa katika maandishi ya mstari ambapo kichwa cha habari kinatokea.
     */
    offset: number;

    /**
     * Maandishi ya kichwa cha habari.
     */
    text: string;
}

/**
 * Aina mbalimbali za maandishi ndani ya mstari.
 */
interface SimpleTextRange {
    /**
     * Kielezo cha herufi ya kwanza ya masafa.
     */
    start: number;

    /**
     * Faharasa baada ya herufi ya mwisho ya masafa.
     */
    end: number;
}

/**
 * Aina mbalimbali za maandishi ndani ya mstari unaowakilisha mstari wa ushairi.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Kiwango cha utangulizi ambacho mstari wa ushairi unapaswa kuonyeshwa nacho.
     */
    level: number;
}
```

### Mfano

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

Mashairi na Maneno ya Yesu huhifadhiwa kulingana na safu katika maandishi ya mstari. Kwa mfano, `Matthew 5:3` katika tafsiri `engwebp` inaonekana kama hii:

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

## Pata Maneno ya Sura katika Umbizo Lililorahisishwa

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Hupata maelezo ya kiwango cha neno kwa sura moja, huku marekebisho yake yakipangwa upya kwenye maandishi ya kila [mstari uliorahisishwa](#get-a-simplified-chapter-from-a-translation) .

Vipunguzo katika [maelezo ya kawaida](./standard.md#get-the-words-of-a-chapter) vimeunganishwa na vipengee vya safu `content` ya mstari, ambayo umbizo lililorahisishwa hubadilisha na mfuatano mmoja - kwa hivyo haziwezi kutumika nayo. Tumia faili hii badala yake unapofanya kazi na sura zilizorahisishwa.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo - unaweza kupata orodha ya vitambulisho vya kitabu [hapa](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` ni sura ya nambari (km `1` kwa sura ya kwanza).

Maingizo haya hayana `contentIndex` `start` na `end` ni mapungufu katika `text` ya mstari, kama vile tanbihi, shairi, na maneno ya Yesu yanavyofanya katika sura zilizorahisishwa, kwa hivyo `text.slice(start, end)` ni neno lililofafanuliwa.

Kama ilivyo kwa maelezo ya kawaida, ni baadhi tu ya tafsiri zinazoyapata. Sura iliyorahisishwa ambayo inayapata inaunganisha faili hii na `thisChapterWordsLink` ; wakati sifa hiyo haipo, faili hii haipo kwa sura hiyo.

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Pata maandishi ya Mwanzo 1 na maneno yaliyoandikwa ndani yake
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

### Muundo

Muundo unalingana na [maelezo ya kawaida](./standard.md#get-the-words-of-a-chapter) , isipokuwa kwamba viungo vinaelekeza kwenye faili zilizorahisishwa na maingizo hayana `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * Kitambulisho cha tafsiri.
     */
    translationId: string;

    /**
     * Kitambulisho cha kitabu.
     */
    bookId: string;

    /**
     * Idadi ya sura.
     */
    chapterNumber: number;

    /**
     * Kiungo cha sura iliyorahisishwa ambacho maelezo haya yanalenga.
     */
    thisChapterLink: string;

    /**
     * Kiungo cha sura inayofuata iliyorahisishwa.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterLink: string | null;

    /**
     * Kiungo cha sura iliyorahisishwa iliyotangulia.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterLink: string | null;

    /**
     * Kiungo cha maelezo haya.
     */
    thisChapterWordsLink: string;

    /**
     * Kiungo cha maelezo ya sura inayofuata.
     * Batilisha ikiwa hii ndiyo sura ya mwisho katika tafsiri, au ikiwa sura inayofuata haina maelezo yoyote ya kiwango cha neno.
     */
    nextChapterWordsLink: string | null;

    /**
     * Kiungo cha maelezo ya sura iliyopita.
     * Batilisha ikiwa hii ni sura ya kwanza katika tafsiri, au ikiwa sura iliyotangulia haina maelezo yoyote ya kiwango cha neno.
     */
    previousChapterWordsLink: string | null;

    /**
     * Maneno yaliyoandikwa kwa kila mstari katika sura, yameunganishwa na nambari ya mstari.
     * Kila orodha iko katika mpangilio ambao maneno yanatokea katika mstari.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Maelezo ya kiwango cha neno katika sura iliyorahisishwa.
 */
export interface SimpleChapterWord {
    /**
     * Faharasa ya herufi ya kwanza ya neno lililoandikwa kwa ufasaha katika maandishi ya mstari.
     */
    start: number;

    /**
     * Faharasa baada ya herufi ya mwisho ya neno lililofafanuliwa katika maandishi ya mstari.
     */
    end: number;

    /**
     * Nambari za Strong kwa neno.
     */
    strongs?: string[];

    /**
     * Lemma (umbo la kamusi) la neno katika lugha chanzi.
     */
    lemma?: string;

    /**
     * Mofolojia ya neno katika lugha chanzi.
     */
    morph?: string;

    /**
     * Mahali pa neno katika maandishi chanzo.
     */
    srcloc?: string;

    /**
     * Ni neno gani linalojitokeza katika mstari huu?
     */
    occurrence?: number;

    /**
     * Idadi ya mara ambazo neno hilo linatokea katika mstari.
     */
    occurrences?: number;
}
```

### Mfano

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

Mstari wa 1 wa sura hiyo una maandishi `"In the beginning was the Word, and the Word was with God, and the Word was God."` , kwa hivyo `text.slice(7, 16)` ni `"beginning"` .

## Pata Tafsiri nzima katika Umbizo Lililorahisishwa

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Hupata maudhui ya tafsiri nzima, kwa kutumia umbizo lililorahisishwa. Huu ni [umbizo la sura lililorahisishwa](#get-a-simplified-chapter-from-a-translation) linalotumika kwa [upakuaji kamili wa tafsiri](./standard.md#get-an-entire-translation) : faili moja iliyo na tafsiri nzima, ambapo maudhui ya kila mstari ni mfuatano mmoja.

Tumia hii unapotaka maandishi ya tafsiri nzima bila kuomba kwa kila sura na bila kulazimika kujenga maandishi mwenyewe.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).

Faili hii imeundwa pamoja na `complete.json` , kwa hivyo tafsiri ina zote mbili au hakuna. Kitu `translation` katika faili zote mbili kina `completeTranslationApiLink` na `simpleCompleteTranslationApiLink` , kwa hivyo unaweza kusogeza kati ya miundo miwili.

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Pata maandishi ya tafsiri nzima ya BSB
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

### Muundo

Muundo unalingana na [upakuaji kamili wa kawaida wa tafsiri](./standard.md#get-an-entire-translation) , isipokuwa kwamba kila sura inatumia umbizo lililorahisishwa.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Hufafanua data kamili ya upakuaji wa tafsiri, kwa kutumia umbizo la sura lililorahisishwa.
 * Ramani za sehemu ya mwisho ya /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Metadata ya tafsiri.
     */
    translation: Translation;

    /**
     * Orodha kamili ya vitabu vyenye sura zao zote.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Kitabu katika tafsiri kamili ya kupakua, kwa kutumia umbizo rahisi la sura.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Orodha kamili ya sura zenye maudhui yote.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Sura katika tafsiri kamili ya kupakua, kwa kutumia umbizo la sura lililorahisishwa.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Idadi ya mistari ambayo sura hiyo ina.
     */
    numberOfVerses: number;

    /**
     * Viungo vya matoleo tofauti ya sauti kwa sura hiyo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Muda wa sauti (wakati wa kuanza kwa kila mstari, kwa sekunde) kwa sura.
     *
     * Kumbuka kwamba faili kamili za tafsiri zina muda wenyewe (tazama TranslationBookChapterAudioTimingsMap katika hati za umbizo la kawaida), tofauti na sehemu za mwisho za sura, ambazo zina viungo vyake.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Kiungo cha maelezo ya kiwango cha neno kwa sura, kwa kutumia umbizo lililorahisishwa. Haijatolewa ikiwa sura haina maelezo yoyote ya kiwango cha neno.
     */
    thisChapterWordsLink?: string;

    /**
     * Taarifa iliyorahisishwa kwa sura hiyo.
     */
    chapter: SimpleChapterData;
}
```

### Mfano

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
