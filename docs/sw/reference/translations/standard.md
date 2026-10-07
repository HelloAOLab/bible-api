# Muundo wa Kawaida

Muundo wa kawaida wa sura, vipakuliwa vya tafsiri kamili, na maelezo ya kiwango cha maneno. Tazama [Tafsiri, Vitabu, na Sura](./README.md) kwa sehemu za mwisho za tafsiri na orodha ya vitabu, au [muundo uliorahisishwa](./simplified.md) kwa uwakilishi mbadala wa maudhui haya haya.

## Pata Sura kutoka kwa Tafsiri

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Hupata maudhui ya sura moja kwa kitabu na tafsiri fulani.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo - unaweza kupata orodha ya vitambulisho vya kitabu [hapa](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` ni sura ya nambari (km `1` kwa sura ya kwanza).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Pata Mwanzo 1 kutoka kwa tafsiri ya BSB
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

### Muundo

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * Viungo vya matoleo tofauti ya sauti kwa sura hiyo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Viungo vya muda wa sauti kwa matoleo tofauti ya sauti kwa sura hiyo.
     * Kila kiungo kinaelekeza kwenye faili ya muda wa sauti kwa msomaji huyo - tazama "Pata Muda wa Sauti kwa Sura" hapa chini.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Kiungo cha sura inayofuata.
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
     * Kiungo cha sura iliyotangulia.
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
     * Kiungo cha maelezo ya kiwango cha neno kwa sura hiyo.
     * Imeachwa ikiwa sura haina maelezo yoyote ya kiwango cha neno.
     */
    thisChapterWordsLink?: string;

    /**
     * Kiungo cha maelezo ya kiwango cha neno kwa sura inayofuata.
     * Imeachwa ikiwa hii ndiyo sura ya mwisho katika tafsiri, au ikiwa sura inayofuata haina maelezo yoyote ya kiwango cha maneno.
     */
    nextChapterWordsLink?: string;

    /**
     * Kiungo cha maelezo ya kiwango cha neno kwa sura iliyotangulia.
     * Imeachwa ikiwa hii ni sura ya kwanza katika tafsiri, au ikiwa sura iliyotangulia haina maelezo yoyote ya kiwango cha maneno.
     */
    previousChapterWordsLink?: string;

    /**
     * Idadi ya mistari ambayo sura hiyo ina.
     */
    numberOfVerses: number;

    /**
     * Kiungo cha toleo lililorahisishwa la sura hii.
     * Imeachwa ikiwa sura zilizorahisishwa hazipatikani.
     */
    simpleChapterApiLink?: string;

    /**
     * Taarifa kwa ajili ya sura.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Idadi ya sura.
     */
    number: number;

    /**
     * Maudhui ya sura hiyo.
     */
    content: ChapterContent[];

    /**
     * Orodha ya maelezo ya chini ya sura hiyo.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Aina ya muungano inayowakilisha kipande kimoja cha maudhui ya sura.
 * Maudhui ya sehemu ya sura yanaweza kuwa mojawapo ya mambo yafuatayo:
 * - Kichwa cha habari.
 * - Mgawanyiko wa mstari.
 * - Mstari.
 * - Kichwa Kidogo cha Kiebrania.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Kichwa cha habari katika sura.
 */
interface ChapterHeading {
    /**
     * Inaonyesha kwamba maudhui yanawakilisha kichwa cha habari.
     */
    type: 'heading';

    /**
     * Maudhui ya kichwa cha habari.
     * Ikiwa nyuzi nyingi zimejumuishwa kwenye safu, zinapaswa kuunganishwa na nafasi.
     */
    content: string[];
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
 * Kichwa kidogo cha Kiebrania katika sura.
 * Hizi mara nyingi hutumika kama maudhui ya taarifa yaliyoonekana katika hati asilia.
 * Kwa mfano, Zaburi 49 ina Kichwa Kidogo cha Kiebrania "Kwa kiongozi wa kwaya. Zaburi ya Wana wa Kora."
 */
interface ChapterHebrewSubtitle {
    /**
     * Inaonyesha kwamba maudhui yanawakilisha Kichwa Kidogo cha Kiebrania.
     */
    type: 'hebrew_subtitle';

    /**
     * Orodha ya maudhui yaliyomo katika kichwa kidogo.
     * Kila kipengele katika orodha kinaweza kuwa mfuatano, maandishi yaliyopangwa, au marejeleo ya tanbihi.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Mstari katika sura.
 */
interface ChapterVerse {
    /**
     * Inaonyesha kwamba maudhui ni mstari.
     */
    type: 'verse';

    /**
     * Nambari ya mstari.
     */
    number: number;

    /**
     * Orodha ya maudhui ya mstari huo.
     * Kila kipengele katika orodha kinaweza kuwa mfuatano, maandishi yaliyopangwa, au marejeleo ya tanbihi.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Maandishi yaliyopangwa. Yaani, maandishi yaliyopangwa kwa namna fulani.
 */
interface FormattedText {
    /**
     * Maandishi yaliyopangwa.
     */
    text: string;

    /**
     * Kama maandishi yanawakilisha shairi.
     * Nambari inaonyesha kiwango cha ujongezaji.
     *
     * Kawaida katika Zaburi.
     */
    poem?: number;

    /**
     * Kama maandishi yanawakilisha Maneno ya Yesu.
     */
    wordsOfJesus?: boolean;
}

/**
 * Hufafanua kiolesura kinachowakilisha kichwa cha habari kilichopachikwa katika mstari.
 */
interface InlineHeading {
    /**
     * Maandishi ya kichwa cha habari.
     */
    heading: string;
}

/**
 * Hufafanua kiolesura kinachowakilisha mgawanyiko wa mstari ambao umepachikwa kwenye mstari.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Rejea ya tanbihi katika mstari au Kichwa kidogo cha Kiebrania.
 */
interface VerseFootnoteReference {
    /**
     * Kitambulisho cha noti.
     */
    noteId: number;
}

/**
 * Taarifa kuhusu tanbihi.
 */
interface ChapterFootnote {
    /**
     * Kitambulisho cha noti inayorejelewa.
     */
    noteId: number;

    /**
     * Maandishi ya tanbihi.
     */
    text: string;

    /**
     * Rejea ya mstari kwa tanbihi.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Mpigaji simu anayepaswa kutumika kwa maelezo ya chini.
     * Kwa maelezo ya chini, "mwitaji" ni herufi inayotumika katika maandishi kurejelea maelezo ya chini.
     *
     * Kwa mfano, katika maandishi:
     * Habari (a) Dunia
     *
     * ---- (a) Hii ni tanbihi.
     *
     * "(a)" ni mpigaji simu.
     *
     * Ikiwa "+", basi mpigaji simu anapaswa kuzalishwa kiotomatiki.
     * Ikiwa ni batili, basi mpigaji simu anapaswa kuwa mtupu.
     * Ikiwa ni kamba, basi mpigaji anapaswa kuwa kamba hiyo.
     */
    caller: '+' | string | null;
}

/**
 * Viungo vya sauti vya sura ya kitabu.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Msomaji wa sura na kiungo cha URL kwenye faili ya sauti.
     */
    [reader: string]: string;
}

/**
 * Viungo vya muda wa sauti kwa sura ya kitabu.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Kiungo cha msomaji wa sura na API kwenye faili ya muda wa sauti kwa msomaji huyo.
     */
    [reader: string]: string;
}
```

### Mfano

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

## Pata Muda wa Sauti kwa Sura

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Hupata muda wa sauti kwa kila mstari kwa sura moja, kwa ajili ya simulizi ya msomaji mmoja kuhusu hilo - yaani, muda (kwa sekunde, ikilinganishwa na mwanzo wa faili ya sauti ya msomaji huyo) ambapo kila mstari huanza. Wateja wanaweza kutumia hii kuangazia mstari unaosomwa kwa sasa kadri sauti inavyocheza.

Ni baadhi tu ya tafsiri na wasomaji wenye muda wa sauti. Sura ambayo inao kwa ajili ya msomaji huunganisha faili hii na ingizo katika `thisChapterAudioTimings` , lililowekwa funguo na kitambulisho cha msomaji huyo; wakati msomaji si ufunguo katika ramani hiyo, faili hii haipo kwa ajili ya msomaji na sura hiyo.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo - unaweza kupata orodha ya vitambulisho vya kitabu [hapa](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` ni sura ya nambari (km `1` kwa sura ya kwanza).
-   `reader` ni kitambulisho cha msomaji ambaye simulizi yake ina majira yake (km `hays` ) - wasomaji wanaopatikana kwa sura ndio funguo za `thisChapterAudioLinks` yake.

Mwisho wa mstari ni mwanzo wa mstari unaofuata (au, kwa mstari wa mwisho, mwisho wa faili ya sauti), kwa hivyo mteja hahitaji chochote zaidi ya orodha iliyopangwa ya nyakati za kuanza ili kujenga safu za kuangazia sura nzima.

Faili hii ni ile ile bila kujali kama imefikiwa kutoka sehemu ya mwisho ya sura ya kawaida au [ile iliyorahisishwa](./simplified.md#get-a-simplified-chapter-from-a-translation) - kuna seti moja tu ya muda kwa kila tafsiri, kitabu, sura, na msomaji.

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Pata muda wa sauti wa Mwanzo 1 (BSB), kama ulivyosomwa na "hays"
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

### Muundo

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Hufafanua muda wa sauti kwa sura ya kitabu, kwa msomaji mmoja.
 * Ramani za sehemu ya mwisho ya /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
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
     * Kitambulisho cha msomaji ambacho nyakati hizi ni za.
     */
    reader: string;

    /**
     * Kiungo cha faili ya sauti ambacho muda huu unatumika.
     */
    audioLink: string;

    /**
     * Kiungo cha taarifa kwa sura hii.
     */
    thisChapterLink: string;

    /**
     * Kiungo cha taarifa kwa sura inayofuata.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterLink: string | null;

    /**
     * Kiungo cha taarifa kwa sura iliyotangulia.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterLink: string | null;

    /**
     * Kiungo cha faili hii ya muda wa sauti.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Kiungo cha muda wa sura inayofuata, kwa msomaji yule yule.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Kiungo cha muda wa sura iliyopita, kwa msomaji yule yule.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Nyakati kwa sekunde ambazo kila mstari huanza, kwa mpangilio.
     * Nambari ya kwanza (faharasa 0) ni wakati katika rekodi ambapo mstari wa kwanza huanza.
     */
    verses: number[];
}
```

### Mfano

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

`verses[0]` ni wakati wa kuanza kwa mstari wa 1, `verses[1]` ni wakati wa kuanza kwa mstari wa 2, na kadhalika - kwa hivyo katika mfano huu, mstari wa 2 wa Mwanzo 1 (BSB, kama inavyosomwa na "hays") unaanza sekunde 4.32 katika `audioLink` .

## Pata Maneno ya Sura

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Hupata maelezo ya kiwango cha maneno (nambari za Strong na data ya chanzo inayohusiana) kwa sura moja.

Ni baadhi tu ya tafsiri zinazojumuisha maelezo ya kiwango cha maneno. Sura ambayo ina viungo vyao kwenye faili hii na `thisChapterWordsLink` ; sifa hiyo inapokosekana, faili hii haipo kwa sura hiyo.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).
-   `book` ni kitambulisho cha kitabu (km `GEN` kwa Mwanzo - unaweza kupata orodha ya vitambulisho vya kitabu [hapa](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` ni sura ya nambari (km `1` kwa sura ya kwanza).

Kila maelezo yameunganishwa na safu ya herufi katika kipengee kimoja cha safu `end` `content` ya mstari: `contentIndex` ni faharasa ya kipengee, na `start` ni marekebisho ya herufi katika maandishi ya kipengee hicho. `end` ni ya kipekee, kwa hivyo `text.slice(start, end)` ni neno lililofafanuliwa.

Kushikilia kipengele cha maudhui (badala ya mstari mzima) kunamaanisha kuwa marekebisho yanabaki sahihi kwa mistari ambayo maudhui yake yamegawanywa katika vipengele vingi, kama vile mistari ya mashairi, maneno ya Yesu, na marejeleo ya tanbihi.

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Pata maneno ya Mwanzo 1 kutoka kwa tafsiri ya BSB
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

### Muundo

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * Kiungo cha taarifa kwa sura hii.
     */
    thisChapterLink: string;

    /**
     * Kiungo cha taarifa kwa sura inayofuata.
     * Bati ikiwa hii ndiyo sura ya mwisho katika tafsiri.
     */
    nextChapterLink: string | null;

    /**
     * Kiungo cha taarifa kwa sura iliyotangulia.
     * Bati ikiwa hii ndiyo sura ya kwanza katika tafsiri.
     */
    previousChapterLink: string | null;

    /**
     * Kiungo cha faili hii ya maneno.
     */
    thisChapterWordsLink: string;

    /**
     * Kiungo cha maneno ya sura inayofuata.
     * Batilisha ikiwa hii ndiyo sura ya mwisho katika tafsiri, au ikiwa sura inayofuata haina maelezo yoyote ya kiwango cha neno.
     */
    nextChapterWordsLink: string | null;

    /**
     * Kiungo cha maneno ya sura iliyopita.
     * Batilisha ikiwa hii ni sura ya kwanza katika tafsiri, au ikiwa sura iliyotangulia haina maelezo yoyote ya kiwango cha neno.
     */
    previousChapterWordsLink: string | null;

    /**
     * Maneno yaliyoandikwa kwa kila mstari katika sura, yameunganishwa na nambari ya mstari.
     * Kila orodha iko katika mpangilio ambao maneno yanatokea katika mstari.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Faharasa ya kipengee katika safu ya maudhui ya mstari ambayo maelezo yanatumika.
     */
    contentIndex: number;

    /**
     * Faharasa ya herufi ya kwanza ya neno lililofafanuliwa katika maandishi ya kipengee cha maudhui.
     */
    start: number;

    /**
     * Faharasa baada ya herufi ya mwisho ya neno lililofafanuliwa katika maandishi ya kipengee cha maudhui.
     * Hiyo ni, text.slice(start, end) ni neno lililofafanuliwa.
     */
    end: number;

    /**
     * Nambari ya Strong kwa neno hilo.
     * Imeachwa ikiwa tafsiri ilitoa maelezo mengine tu kwa neno hilo.
     */
    strongs?: string[];

    /**
     * Umbo la kamusi (nukuu) la neno.
     * Imeachwa ikiwa tafsiri haikutoa moja.
     */
    lemma?: string;

    /**
     * Msimbo wa uchanganuzi wa mofolojia wa neno.
     * Imeachwa ikiwa tafsiri haikutoa moja.
     */
    morph?: string;

    /**
     * Kielekezi cha neno katika maandishi chanzo, katika umbizo la <sourceName> : <location> .
     * Imeachwa ikiwa tafsiri haikutoa moja.
     */
    srcloc?: string;

    /**
     * Neno hili linatokeaje katika neno chanzo? Linatokana na 1.
     * Imeachwa ikiwa tafsiri haikutoa moja.
     */
    occurrence?: number;

    /**
     * Jumla ya mara ambazo neno chanzo hutokea.
     * Imeachwa ikiwa tafsiri haikutoa moja.
     */
    occurrences?: number;
}
```

### Mfano

Kwa kuzingatia sura ambayo mstari wake wa kwanza una kipengele kimoja cha maudhui:

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

Faili ya maneno huelezea herufi za kipengee hicho:

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

Hiyo ni, `"In the beginning...".slice(0, 2)` ni `"In"` , ambayo chanzo kiliweka alama na `G1722` .

## Pata Tafsiri nzima

`GET https://bible.helloao.org/api/{translation}/complete.json`

Hupata maudhui ya tafsiri nzima.

-   `translation` ni kitambulisho cha tafsiri (km `BSB` ).

### Mfano wa Msimbo

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Pata Mwanzo 1 kutoka kwa tafsiri ya BSB
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

### Muundo

```typescript:no-line-numbers title="complete.ts"
/**
 * Hufafanua data kamili ya upakuaji wa tafsiri.
 * Ramani za sehemu ya mwisho ya /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Metadata ya tafsiri.
     */
    translation: Translation;

    /**
     * Orodha kamili ya vitabu vyenye sura zao zote.
     */
    books: TranslationCompleteBook[];
}

/**
 * Kitabu katika tafsiri kamili ya upakuaji.
 */
export interface TranslationCompleteBook {
    /**
     * Kitambulisho cha kitabu.
     */
    id: string;

    /**
     * Jina la kitabu kutoka kwa tafsiri.
     */
    name: string;

    /**
     * Jina la kawaida la kitabu.
     */
    commonName: string;

    /**
     * Kichwa cha kitabu.
     */
    title: string | null;

    /**
     * Mpangilio wa kitabu.
     */
    order: number;

    /**
     * Idadi ya sura katika kitabu.
     */
    numberOfChapters: number;

    /**
     * Jumla ya mistari katika kitabu.
     */
    totalNumberOfVerses: number;

    /**
     * Kama kitabu hicho ni cha apokrifa.
     */
    isApocryphal?: boolean;

    /**
     * Orodha kamili ya sura zenye maudhui yote.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Sura katika upakuaji kamili wa tafsiri.
 */
export interface TranslationCompleteChapter {
    /**
     * Idadi ya mistari ambayo sura hiyo ina.
     */
    numberOfVerses: number;

    /**
     * Viungo vya matoleo tofauti ya sauti kwa sura hiyo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Muda wa sauti (wakati wa kuanza kwa kila mstari, kwa sekunde) kwa matoleo tofauti ya sauti kwa sura hiyo.
     *
     * Tofauti na `thisChapterAudioTimings` kwenye sehemu ya mwisho ya sura (ambayo inaunganisha na "Pata Muda wa Sauti kwa Sura" hapa chini), hii ina nyakati zenyewe - kwa kuwa lengo la upakuaji kamili wa tafsiri ni kuwa na kila kitu katika faili moja.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Kiungo cha maelezo ya kiwango cha neno kwa sura hiyo.
     * Imeachwa ikiwa sura haina maelezo yoyote ya kiwango cha neno.
     */
    thisChapterWordsLink?: string;

    /**
     * Taarifa kwa ajili ya sura.
     */
    chapter: ChapterData;
}

/**
 * Muda wa sauti wa sura ya kitabu, uliopachikwa moja kwa moja badala ya kuunganishwa na.
 * Huunganisha kitambulisho cha msomaji kwenye orodha ya nyakati (kwa sekunde) ambazo kila mstari unaanza, kwa mpangilio wa mstari.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Mfano

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
