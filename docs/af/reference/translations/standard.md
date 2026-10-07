# Standaardformaat

Die standaardformaat vir hoofstukke, volledige vertaling-aflaaie en woordvlak-aantekeninge. Sien [Vertalings, Boeke en Hoofstukke](./README.md) vir die vertaling- en boeklys-eindpunte, of [die vereenvoudigde formaat](./simplified.md) vir die alternatiewe voorstelling van dieselfde inhoud.

## Kry 'n hoofstuk uit 'n vertaling

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Kry die inhoud van 'n enkele hoofstuk vir 'n gegewe boek en vertaling.

-   `translation` is die ID van die vertaling (bv. `BSB` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis - jy kan 'n lys van boek-ID's [hier](https://ubsicap.github.io/usfm/identification/books.html) vind).
-   `chapter` is die numeriese hoofstuk (bv. `1` vir die eerste hoofstuk).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Kry Genesis 1 uit die BSB-vertaling
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

### Struktuur

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * Die vertaalinligting vir die boekhoofstuk.
     */
    translation: Translation;

    /**
     * Die boekinligting vir die boekhoofstuk.
     */
    book: TranslationBook;

    /**
     * Die skakel na die huidige hoofstuk.
     */
    thisChapterLink: string;

    /**
     * Die skakels na verskillende oudioweergawes vir die hoofstuk.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die skakels na die oudio-tye vir verskillende oudio-weergawes vir die hoofstuk.
     * Elke skakel wys na die oudio-tydsberekeninglêer vir daardie leser - sien "Kry die oudio-tydsberekeninge vir 'n hoofstuk" hieronder.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Die skakel na die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterApiLink: string | null;

    /**
     * Die skakels na verskillende oudioweergawes vir die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Die skakels na die oudio-tye vir verskillende oudio-weergawes vir die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Die skakel na die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterApiLink: string | null;

    /**
     * Die skakels na verskillende oudioweergawes vir die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Die skakels na die oudio-tye vir verskillende oudio-weergawes vir die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Die skakel na die woordvlak-annotasies vir die hoofstuk.
     * Weglaat indien die hoofstuk geen woordvlak-aantekeninge het nie.
     */
    thisChapterWordsLink?: string;

    /**
     * Die skakel na die woordvlak-aantekeninge vir die volgende hoofstuk.
     * Weglaat as dit die laaste hoofstuk in die vertaling is, of as die volgende hoofstuk geen woordvlak-aantekeninge het nie.
     */
    nextChapterWordsLink?: string;

    /**
     * Die skakel na die woordvlak-aantekeninge vir die vorige hoofstuk.
     * Weglaat as dit die eerste hoofstuk in die vertaling is, of as die vorige hoofstuk geen woordvlak-aantekeninge het nie.
     */
    previousChapterWordsLink?: string;

    /**
     * Die aantal verse wat die hoofstuk bevat.
     */
    numberOfVerses: number;

    /**
     * Die skakel na die vereenvoudigde weergawe van hierdie hoofstuk.
     * Weglaat indien vereenvoudigde hoofstukke nie beskikbaar is nie.
     */
    simpleChapterApiLink?: string;

    /**
     * Die inligting vir die hoofstuk.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Die nommer van die hoofstuk.
     */
    number: number;

    /**
     * Die inhoud van die hoofstuk.
     */
    content: ChapterContent[];

    /**
     * Die lys van voetnotas vir die hoofstuk.
     */
    footnotes: ChapterFootnote[];
}

/**
 * 'n Unietipe wat 'n enkele stuk hoofstukinhoud verteenwoordig.
 * 'n Stukkie hoofstukinhoud kan een van die volgende dinge wees:
 * - 'n Opskrif.
 * - 'n Lynbreuk.
 * - 'n Vers.
 * - 'n Hebreeuse ondertitel.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * 'n Opskrif in 'n hoofstuk.
 */
interface ChapterHeading {
    /**
     * Dui aan dat die inhoud 'n opskrif verteenwoordig.
     */
    type: 'heading';

    /**
     * Die inhoud vir die opskrif.
     * Indien verskeie stringe in die skikking ingesluit is, moet hulle met 'n spasie gekoppel word.
     */
    content: string[];
}

/**
 * 'n Lynbreuk in 'n hoofstuk.
 */
interface ChapterLineBreak {
    /**
     * Dui aan dat die inhoud 'n reëlbreuk verteenwoordig.
     */
    type: 'line_break';
}

/**
 * 'n Hebreeuse ondertitel in 'n hoofstuk.
 * Hierdie word dikwels gebruik as inligtingsinhoud wat in die oorspronklike manuskripte verskyn het.
 * Byvoorbeeld, Psalm 49 het die Hebreeuse subtitel "Vir die koorleier. 'n Psalm van die seuns van Korag."
 */
interface ChapterHebrewSubtitle {
    /**
     * Dui aan dat die inhoud 'n Hebreeuse ondertitel verteenwoordig.
     */
    type: 'hebrew_subtitle';

    /**
     * Die lys van inhoud wat in die subtitel voorkom.
     * Elke element in die lys kan 'n string, geformateerde teks of 'n voetnootverwysing wees.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * 'n Vers in 'n hoofstuk.
 */
interface ChapterVerse {
    /**
     * Dui aan dat die inhoud 'n vers is.
     */
    type: 'verse';

    /**
     * Die nommer van die vers.
     */
    number: number;

    /**
     * Die lys van inhoud vir die vers.
     * Elke element in die lys kan 'n string, geformateerde teks of 'n voetnootverwysing wees.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Geformateerde teks. Dit wil sê, teks wat op 'n spesifieke manier geformateer is.
 */
interface FormattedText {
    /**
     * Die teks wat geformateer is.
     */
    text: string;

    /**
     * Of die teks 'n gedig voorstel.
     * Die getal dui die vlak van inspringing aan.
     *
     * Algemeen in Psalms.
     */
    poem?: number;

    /**
     * Of die teks die Woorde van Jesus verteenwoordig.
     */
    wordsOfJesus?: boolean;
}

/**
 * Definieer 'n koppelvlak wat 'n opskrif verteenwoordig wat in 'n vers ingebed is.
 */
interface InlineHeading {
    /**
     * Die teks van die opskrif.
     */
    heading: string;
}

/**
 * Definieer 'n koppelvlak wat 'n reëlbreuk verteenwoordig wat in 'n vers ingebed is.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * 'n Voetnootverwysing in 'n vers of 'n Hebreeuse ondertitel.
 */
interface VerseFootnoteReference {
    /**
     * Die ID van die nota.
     */
    noteId: number;
}

/**
 * Inligting oor 'n voetnoot.
 */
interface ChapterFootnote {
    /**
     * Die ID van die nota waarna verwys word.
     */
    noteId: number;

    /**
     * Die teks van die voetnoot.
     */
    text: string;

    /**
     * Die versverwysing vir die voetnoot.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Die oproeper wat vir die voetnoot gebruik moet word.
     * Vir voetnotas is 'n "oproeper" die karakter wat in die teks gebruik word om na 'n voetnoot te verwys.
     *
     * Byvoorbeeld, in die teks:
     * Hallo (’n) Wêreld
     *
     * ---- (a) Hierdie is 'n voetnoot.
     *
     * Die "(a)" is die oproeper.
     *
     * Indien "+", dan moet die oproeper outomaties gegenereer word.
     * Indien nul, dan moet die oproeper leeg wees.
     * Indien 'n string, dan moet die oproeper daardie string wees.
     */
    caller: '+' | string | null;
}

/**
 * Die klankskakels vir 'n boekhoofstuk.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Die leser vir die hoofstuk en die URL-skakel na die klanklêer.
     */
    [reader: string]: string;
}

/**
 * Die skakels na die klanktydsberekening vir 'n boekhoofstuk.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Die leser vir die hoofstuk en die API skakel na die oudio-tydsberekeninglêer vir daardie leser.
     */
    [reader: string]: string;
}
```

### Voorbeeld

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

## Kry die klanktydsberekening vir 'n hoofstuk

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Kry die oudio-tydsberekening per vers vir 'n enkele hoofstuk, vir 'n enkele leser se vertelling daarvan - dit wil sê die tyd (in sekondes, relatief tot die begin van daardie leser se oudiolêer) waarop elke vers begin. Kliënte kan dit gebruik om die vers wat tans gelees word, uit te lig terwyl die oudio speel.

Slegs sommige vertalings en lesers het oudio-tydsberekeninge. 'n Hoofstuk wat dit vir 'n leser het, skakel na hierdie lêer met 'n inskrywing in `thisChapterAudioTimings` , gekodeer deur daardie leser se ID; wanneer 'n leser nie 'n sleutel in daardie kaart is nie, bestaan ​​hierdie lêer nie vir daardie leser en hoofstuk nie.

-   `translation` is die ID van die vertaling (bv. `BSB` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis - jy kan 'n lys van boek-ID's [hier](https://ubsicap.github.io/usfm/identification/books.html) vind).
-   `chapter` is die numeriese hoofstuk (bv. `1` vir die eerste hoofstuk).
-   `reader` is die ID van die leser vir wie se vertelling die tydsberekening is (bv. `hays` ) - die beskikbare lesers vir 'n hoofstuk is die sleutels van sy `thisChapterAudioLinks` .

Die einde van 'n vers is die begin van die volgende vers (of, vir die laaste vers, die einde van die klanklêer), dus benodig 'n kliënt niks anders as die geordende lys van begintye om uitligreekse vir die hele hoofstuk te bou nie.

Hierdie lêer is dieselfde ongeag of dit vanaf die gewone hoofstuk-eindpunt of [die vereenvoudigde een](./simplified.md#get-a-simplified-chapter-from-a-translation) bereik word - daar is slegs een stel tydsberekening per vertaling, boek, hoofstuk en leser.

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Kry die oudio-tydsberekening vir Genesis 1 (BSB), soos voorgelees deur "hays"
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

### Struktuur

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Definieer die oudio-tydsberekening vir 'n boekhoofstuk, vir 'n enkele leser.
 * Kaarte na die /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json eindpunt.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * Die ID van die vertaling.
     */
    translationId: string;

    /**
     * Die ID van die boek.
     */
    bookId: string;

    /**
     * Die nommer van die hoofstuk.
     */
    chapterNumber: number;

    /**
     * Die ID van die leser waarvoor hierdie tye is.
     */
    reader: string;

    /**
     * Die skakel na die klanklêer waarvoor hierdie tydsberekeninge is.
     */
    audioLink: string;

    /**
     * Die skakel na die inligting vir hierdie hoofstuk.
     */
    thisChapterLink: string;

    /**
     * Die skakel na die inligting vir die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterLink: string | null;

    /**
     * Die skakel na die inligting vir die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterLink: string | null;

    /**
     * Die skakel na hierdie oudio-tydsberekeninglêer.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Die skakel na die tye vir die volgende hoofstuk, vir dieselfde leser.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Die skakel na die tye vir die vorige hoofstuk, vir dieselfde leser.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Die tye in sekondes waarop elke vers begin, in volgorde.
     * Die eerste nommer (indeks 0) is die tyd in die opname waarop die eerste vers begin.
     */
    verses: number[];
}
```

### Voorbeeld

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

`verses[0]` is die begintyd van vers 1, `verses[1]` is die begintyd van vers 2, ensovoorts - so in hierdie voorbeeld begin vers 2 van Genesis 1 (BSB, soos gelees deur "hays") 4.32 sekondes in `audioLink` .

## Kry die woorde van 'n hoofstuk

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Kry die woordvlak-annotasies (Strong se nommers en verwante brondata) vir 'n enkele hoofstuk.

Slegs sommige vertalings bevat woordvlak-aantekeninge. 'n Hoofstuk wat hulle bevat, skakel na hierdie lêer met `thisChapterWordsLink` ; wanneer daardie eienskap ontbreek, bestaan ​​hierdie lêer nie vir die hoofstuk nie.

-   `translation` is die ID van die vertaling (bv. `BSB` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis - jy kan 'n lys van boek-ID's [hier](https://ubsicap.github.io/usfm/identification/books.html) vind).
-   `chapter` is die numeriese hoofstuk (bv. `1` vir die eerste hoofstuk).

Elke aantekening is geanker aan 'n reeks karakters in ' `end` enkele item van 'n vers se `content` -skikking: `contentIndex` is die indeks van die item, en `start` is karakterverskuiwings in daardie item se teks. `end` is eksklusief, dus is `text.slice(start, end)` die geannoteerde woord.

Deur aan 'n inhoudsitem te anker (in plaas van aan die vers as geheel) word die verrekeninge korrek gehou vir verse waarvan die inhoud in verskeie items verdeel is, soos gedigreëls, woorde van Jesus en voetnootverwysings.

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Kry die woorde vir Genesis 1 uit die BSB-vertaling
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

### Struktuur

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * Die ID van die vertaling.
     */
    translationId: string;

    /**
     * Die ID van die boek.
     */
    bookId: string;

    /**
     * Die nommer van die hoofstuk.
     */
    chapterNumber: number;

    /**
     * Die skakel na die inligting vir hierdie hoofstuk.
     */
    thisChapterLink: string;

    /**
     * Die skakel na die inligting vir die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterLink: string | null;

    /**
     * Die skakel na die inligting vir die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterLink: string | null;

    /**
     * Die skakel na hierdie woordelêer.
     */
    thisChapterWordsLink: string;

    /**
     * Die skakel na die woorde vir die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is, of as die volgende hoofstuk geen woordvlak-aantekeninge het nie.
     */
    nextChapterWordsLink: string | null;

    /**
     * Die skakel na die woorde vir die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is, of as die vorige hoofstuk geen woordvlak-aantekeninge het nie.
     */
    previousChapterWordsLink: string | null;

    /**
     * Die geannoteerde woorde vir elke vers in die hoofstuk, gerangskik volgens versnommer.
     * Elke lys is in die volgorde waarin die woorde in die vers voorkom.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Die indeks van die item in die vers se inhoudskikking waarop die aantekening van toepassing is.
     */
    contentIndex: number;

    /**
     * Die indeks van die eerste karakter van die geannoteerde woord in die inhoudsitem se teks.
     */
    start: number;

    /**
     * Die indeks na die laaste karakter van die geannoteerde woord in die inhoudsitem se teks.
     * Dit wil sê, text.slice(begin, einde) is die geannoteerde woord.
     */
    end: number;

    /**
     * Die Strong se getal(le) vir die woord.
     * Weglaat indien die vertaling slegs ander aantekeninge vir die woord verskaf het.
     */
    strongs?: string[];

    /**
     * Die woordeboekvorm (aanhaling) van die woord.
     * Weglaat indien die vertaling nie een verskaf het nie.
     */
    lemma?: string;

    /**
     * Die morfologie-ontledingskode vir die woord.
     * Weglaat indien die vertaling nie een verskaf het nie.
     */
    morph?: string;

    /**
     * Die wyser na die woord in die bronteks, in die <sourceName> : <location> formaat.
     * Weglaat indien die vertaling nie een verskaf het nie.
     */
    srcloc?: string;

    /**
     * Watter voorkoms van die bronwoord hierdie woord is. 1-gebaseer.
     * Weglaat indien die vertaling nie een verskaf het nie.
     */
    occurrence?: number;

    /**
     * Die totale aantal kere wat die bronwoord voorkom.
     * Weglaat indien die vertaling nie een verskaf het nie.
     */
    occurrences?: number;
}
```

### Voorbeeld

Gegewe 'n hoofstuk waarvan die eerste vers 'n enkele inhoudsitem het:

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

Die woordelêer annoteer die karakters van daardie item:

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

Dit wil sê, `"In the beginning...".slice(0, 2)` is `"In"` , wat die bron met `G1722` gemerk het.

## Kry 'n volledige vertaling

`GET https://bible.helloao.org/api/{translation}/complete.json`

Kry die inhoud van 'n volledige vertaling.

-   `translation` is die ID van die vertaling (bv. `BSB` ).

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Kry Genesis 1 uit die BSB-vertaling
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

### Struktuur

```typescript:no-line-numbers title="complete.ts"
/**
 * Definieer die volledige vertaling-aflaaidata.
 * Kaarteer na die /api/:translationId/complete.json eindpunt.
 */
export interface TranslationComplete {
    /**
     * Die vertalingsmetadata.
     */
    translation: Translation;

    /**
     * Die volledige lys van boeke met al hul hoofstukke.
     */
    books: TranslationCompleteBook[];
}

/**
 * 'n Boek in die volledige vertaling aflaai.
 */
export interface TranslationCompleteBook {
    /**
     * Die ID van die boek.
     */
    id: string;

    /**
     * Die naam van die boek uit die vertaling.
     */
    name: string;

    /**
     * Die algemene naam vir die boek.
     */
    commonName: string;

    /**
     * Die titel van die boek.
     */
    title: string | null;

    /**
     * Die volgorde van die boek.
     */
    order: number;

    /**
     * Die aantal hoofstukke in die boek.
     */
    numberOfChapters: number;

    /**
     * Die totale aantal verse in die boek.
     */
    totalNumberOfVerses: number;

    /**
     * Of die boek apokrief is.
     */
    isApocryphal?: boolean;

    /**
     * Die volledige lys van hoofstukke met alle inhoud.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * 'n Hoofstuk in die volledige vertaling aflaai.
 */
export interface TranslationCompleteChapter {
    /**
     * Die aantal verse wat die hoofstuk bevat.
     */
    numberOfVerses: number;

    /**
     * Die skakels na verskillende oudioweergawes vir die hoofstuk.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die oudio-tydsberekening (begintye per vers, in sekondes) vir verskillende oudioweergawes vir die hoofstuk.
     *
     * Anders as `thisChapterAudioTimings` op die individuele hoofstuk-eindpunt (wat skakel na "Kry die klanktydsberekening vir 'n hoofstuk" hieronder), bevat hierdie een die tydsberekening self - aangesien die punt van die volledige vertaling-aflaai is om alles in een lêer te hê.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Die skakel na die woordvlak-annotasies vir die hoofstuk.
     * Weglaat indien die hoofstuk geen woordvlak-aantekeninge het nie.
     */
    thisChapterWordsLink?: string;

    /**
     * Die inligting vir die hoofstuk.
     */
    chapter: ChapterData;
}

/**
 * Die oudio-tydsberekening vir 'n boekhoofstuk, direk ingebed eerder as gekoppel.
 * Wys 'n leser-ID toe aan die lys van kere (in sekondes) wat elke vers begin, in versvolgorde.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Voorbeeld

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
