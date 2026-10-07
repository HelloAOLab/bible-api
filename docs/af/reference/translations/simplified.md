# Vereenvoudigde Formaat

Die vereenvoudigde formaat vir hoofstukke, volledige vertaling-aflaaie en woordvlak-aantekeninge. Sien [Vertalings, Boeke en Hoofstukke](./README.md) vir die vertaling- en boeklys-eindpunte, of [die standaardformaat](./standard.md) vir die oorspronklike, gestruktureerde voorstelling van dieselfde inhoud.

## Kry 'n vereenvoudigde hoofstuk uit 'n vertaling

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Kry die inhoud van 'n enkele hoofstuk vir 'n gegewe boek en vertaling, deur die vereenvoudigde formaat te gebruik.

In die vereenvoudigde formaat is die inhoud van elke vers 'n enkele string in plaas van 'n lys van geformateerde inhoud. Dit beteken dat jy nie self die teks van 'n vers hoef te bou nie, wat nie triviaal kan wees om reg te kry nie - veral as dit by spasiëring kom. Enigiets wat nie deur 'n gewone string verteenwoordig kan word nie - voetnote, die Woorde van Jesus, poësie en opskrifte wat in die middel van 'n vers voorkom - word as 'n verrekening in daardie string gehou, sodat niks verlore gaan nie.

Gebruik hierdie eindpunt wanneer jy die teks van 'n hoofstuk wil hê. Gebruik [die gewone hoofstuk-eindpunt](./standard.md#get-a-chapter-from-a-translation) wanneer jy die hoofstuk met sy oorspronklike formatering wil weergee.

-   `translation` is die ID van die vertaling (bv. `BSB` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis - jy kan 'n lys van boek-ID's [hier](https://ubsicap.github.io/usfm/identification/books.html) vind).
-   `chapter` is die numeriese hoofstuk (bv. `1` vir die eerste hoofstuk).

Hoofstukke met woordvlak-aantekeninge skakel daarna met `thisChapterWordsLink` , wat na [die vereenvoudigde aantekeninge](#get-the-words-of-a-chapter-in-the-simplified-format) wys - die waarvan die verrekeninge ooreenstem met die teks in hierdie lêer.

Hoofstukke wat per-leser oudio-tydsberekeninge het, skakel daarna met `thisChapterAudioTimings` , wat na [die oudio-tydsberekening-eindpunt](./standard.md#get-the-audio-timings-for-a-chapter) wys - dieselfde lêer waarna die gewone hoofstuk-eindpunt skakel, aangesien tydsberekeninge nie van die hoofstukformaat afhang nie.

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Kry die teks van Genesis 1 uit die BSB-vertaling
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

### Verrekeninge

Al die verrekeninge in die vereenvoudigde formaat - `offset` , `start` en `end` - is indekse in die `text` van die vers wat hulle bevat. Hulle word gemeet in UTF-16-kode-eenhede, wat JavaScript se `String.prototype.length` en `String.prototype.slice()` gebruik.

`start` is inklusief en `end` is eksklusief, dus `text.slice(start, end)` gee presies die reeks teks terug wat gemerk is. Voetnootverskuiwings is die posisie waar die voetnoot se oproeper hoort, dus `text.slice(0, offset)` is die teks wat daarvoor kom.

### Struktuur

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * Die skakel na die gewone (nie-vereenvoudigde) weergawe van hierdie hoofstuk.
     */
    fullChapterApiLink: string;

    /**
     * Die skakels na verskillende oudioweergawes vir die hoofstuk.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die skakels na die oudio-tye vir verskillende oudio-weergawes vir die hoofstuk.
     * Sien "Kry die oudio-tydsberekening vir 'n hoofstuk" in die standaardformaatdokumentasie - die tydsberekeninglêer is dieselfde ongeag watter hoofstukformaat daaraan gekoppel is.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Die skakel na die volgende hoofstuk, in die vereenvoudigde formaat.
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
     * Die skakel na die vorige hoofstuk, in die vereenvoudigde formaat.
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
     * Die aantal verse wat die hoofstuk bevat.
     */
    numberOfVerses: number;

    /**
     * Die inligting vir die hoofstuk.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Die nommer van die hoofstuk.
     */
    number: number;

    /**
     * Die inhoud van die hoofstuk.
     */
    content: SimpleChapterContent[];

    /**
     * Die lys van voetnotas wat nie met 'n vers geassosieer kon word nie.
     * Voetnotas wat aan 'n vers behoort, word op die vers self ingesluit, dus is hierdie lys gewoonlik leeg.
     */
    footnotes: ChapterFootnote[];
}

/**
 * 'n Unietipe wat 'n enkele stuk inhoud in 'n vereenvoudigde hoofstuk verteenwoordig.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * 'n Opskrif in 'n hoofstuk.
 */
interface SimpleChapterHeading {
    /**
     * Dui aan dat die inhoud 'n opskrif verteenwoordig.
     */
    type: 'heading';

    /**
     * Die teks van die opskrif.
     */
    text: string;
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
 * 'n Vers in 'n hoofstuk.
 */
interface SimpleChapterVerse {
    /**
     * Dui aan dat die inhoud 'n vers is.
     */
    type: 'verse';

    /**
     * Die nommer van die vers.
     */
    number: number;

    /**
     * Die teks van die vers.
     * Reëls van gedigte en reëlbreuke word geskei deur reëlnuu (\n) karakters.
     */
    text: string;

    /**
     * Die voetnotas wat in die vers voorkom.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Die opskrifte wat in die middel van die vers voorkom.
     * Weglaat indien die vers geen inlynopskrifte bevat nie.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Die reekse van die vers teks wat die Woorde van Jesus verteenwoordig.
     * Weglaat as die vers niks bevat nie.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Die reekse van die vers teks wat poësiereëls verteenwoordig.
     * Weglaat as die vers niks bevat nie.
     */
    poem?: SimplePoemRange[];
}

/**
 * 'n Hebreeuse ondertitel in 'n hoofstuk.
 * Dit word dikwels ingesluit as inligtingsinhoud wat in die oorspronklike manuskripte verskyn het.
 * Byvoorbeeld, Psalm 49 het die Hebreeuse subtitel "Vir die koorleier. 'n Psalm van die seuns van Korag."
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Dui aan dat die inhoud 'n Hebreeuse ondertitel verteenwoordig.
     */
    type: 'hebrew_subtitle';
}

/**
 * 'n Voetnoot in 'n vers.
 */
interface SimpleVerseFootnote {
    /**
     * Die ID van die nota.
     */
    noteId: number;

    /**
     * Die indeks in die versteks waar die voetnootoproeper ingevoeg moet word.
     */
    offset: number;

    /**
     * Die teks van die voetnoot.
     */
    text: string;

    /**
     * Die oproeper wat vir die voetnoot gebruik moet word.
     * Indien "+", dan moet die oproeper outomaties gegenereer word.
     * Indien nul, dan moet die oproeper leeg wees.
     * Indien 'n string, dan moet die oproeper daardie string wees.
     */
    caller: '+' | string | null;
}

/**
 * 'n Opskrif wat in 'n vers ingebed is.
 */
interface SimpleInlineHeading {
    /**
     * Die indeks in die versteks waar die opskrif voorkom.
     */
    offset: number;

    /**
     * Die teks van die opskrif.
     */
    text: string;
}

/**
 * 'n Teksreeks binne 'n vers.
 */
interface SimpleTextRange {
    /**
     * Die indeks van die eerste karakter van die reeks.
     */
    start: number;

    /**
     * Die indeks na die laaste karakter van die reeks.
     */
    end: number;
}

/**
 * 'n Teksreeks binne 'n vers wat 'n poësiereël verteenwoordig.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Die vlak van inspringing waarmee die poësiereël vertoon moet word.
     */
    level: number;
}
```

### Voorbeeld

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

Poësie en die Woorde van Jesus word as reekse oor die vers teks gehou. Byvoorbeeld, `Matthew 5:3` in die `engwebp` vertaling lyk so:

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

## Kry die woorde van 'n hoofstuk in die vereenvoudigde formaat

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Kry die woordvlak-annotasies vir 'n enkele hoofstuk, met hul verrekenings hertoegewys op die teks van elke [vereenvoudigde vers](#get-a-simplified-chapter-from-a-translation) .

Die verrekeninge in [die gewone aantekeninge](./standard.md#get-the-words-of-a-chapter) is geanker aan items van 'n vers se `content` skikking, wat die vereenvoudigde formaat met 'n enkele string vervang - dus kan hulle nie daarmee saam gebruik word nie. Gebruik hierdie lêer eerder wanneer jy met die vereenvoudigde hoofstukke werk.

-   `translation` is die ID van die vertaling (bv. `BSB` ).
-   `book` is die ID van die boek (bv. `GEN` vir Genesis - jy kan 'n lys van boek-ID's [hier](https://ubsicap.github.io/usfm/identification/books.html) vind).
-   `chapter` is die numeriese hoofstuk (bv. `1` vir die eerste hoofstuk).

Hierdie inskrywings het geen `contentIndex` nie. `start` en `end` is verskuiwings in die `text` van die vers, presies soos die voetnoot, gedig en Woorde van Jesus-verskuiwings in die vereenvoudigde hoofstukke, dus is `text.slice(start, end)` die geannoteerde woord.

Soos met die gewone aantekeninge, het slegs sommige vertalings hulle. 'n Vereenvoudigde hoofstuk wat hulle het, skakel na hierdie lêer met `thisChapterWordsLink` ; wanneer daardie eienskap ontbreek, bestaan ​​hierdie lêer nie vir die hoofstuk nie.

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Kry die teks van Genesis 1 en die woorde wat daarin geannoteer is
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

### Struktuur

Die struktuur stem ooreen met [die gewone aantekeninge](./standard.md#get-the-words-of-a-chapter) , behalwe dat die skakels na die vereenvoudigde lêers wys en die inskrywings geen `contentIndex` het nie.

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * Die skakel na die vereenvoudigde hoofstuk waarvoor hierdie aantekeninge is.
     */
    thisChapterLink: string;

    /**
     * Die skakel na die volgende vereenvoudigde hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is.
     */
    nextChapterLink: string | null;

    /**
     * Die skakel na die vorige vereenvoudigde hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is.
     */
    previousChapterLink: string | null;

    /**
     * Die skakel na hierdie aantekeninge.
     */
    thisChapterWordsLink: string;

    /**
     * Die skakel na die aantekeninge vir die volgende hoofstuk.
     * Nul as dit die laaste hoofstuk in die vertaling is, of as die volgende hoofstuk geen woordvlak-aantekeninge het nie.
     */
    nextChapterWordsLink: string | null;

    /**
     * Die skakel na die aantekeninge vir die vorige hoofstuk.
     * Nul as dit die eerste hoofstuk in die vertaling is, of as die vorige hoofstuk geen woordvlak-aantekeninge het nie.
     */
    previousChapterWordsLink: string | null;

    /**
     * Die geannoteerde woorde vir elke vers in die hoofstuk, gerangskik volgens versnommer.
     * Elke lys is in die volgorde waarin die woorde in die vers voorkom.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * 'n Woordvlak-annotasie in 'n vereenvoudigde hoofstuk.
 */
export interface SimpleChapterWord {
    /**
     * Die indeks van die eerste karakter van die geannoteerde woord in die versteks.
     */
    start: number;

    /**
     * Die indeks na die laaste karakter van die geannoteerde woord in die versteks.
     */
    end: number;

    /**
     * Die Strong se getalle vir die woord.
     */
    strongs?: string[];

    /**
     * Die lemma (woordeboekvorm) van die woord in die brontaal.
     */
    lemma?: string;

    /**
     * Die morfologie van die woord in die brontaal.
     */
    morph?: string;

    /**
     * Die ligging van die woord in die bronteks.
     */
    srcloc?: string;

    /**
     * Watter voorkoms van die woord in die vers is dit.
     */
    occurrence?: number;

    /**
     * Die aantal kere wat die woord in die vers voorkom.
     */
    occurrences?: number;
}
```

### Voorbeeld

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

Vers 1 van daardie hoofstuk het die teks `"In the beginning was the Word, and the Word was with God, and the Word was God."` , so `text.slice(7, 16)` is `"beginning"` .

## Kry 'n volledige vertaling in die vereenvoudigde formaat

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Kry die inhoud van 'n volledige vertaling, met behulp van die vereenvoudigde formaat. Dit is die [vereenvoudigde hoofstukformaat](#get-a-simplified-chapter-from-a-translation) wat toegepas word op [die volledige vertaling-aflaai](./standard.md#get-an-entire-translation) : een lêer wat die hele vertaling bevat, waar die inhoud van elke vers 'n enkele string is.

Gebruik dit wanneer jy die teks van 'n volledige vertaling wil hê sonder om 'n versoek per hoofstuk te maak en sonder om die teks self te bou.

-   `translation` is die ID van die vertaling (bv. `BSB` ).

Hierdie lêer word saam met `complete.json` gegenereer, so 'n vertaling het óf albei óf geeneen nie. Die `translation` objek in beide lêers bevat 'n `completeTranslationApiLink` en 'n `simpleCompleteTranslationApiLink` , sodat jy tussen die twee formate kan beweeg.

### Kode Voorbeeld

::: code-tabs#taal

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Kry die teks van die volledige BSB-vertaling
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

### Struktuur

Die struktuur stem ooreen met [die gewone volledige vertaling-aflaai](./standard.md#get-an-entire-translation) , behalwe dat elke hoofstuk die vereenvoudigde formaat gebruik.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Definieer die volledige vertaling-aflaaidata, met behulp van die vereenvoudigde hoofstukformaat.
 * Kaarteer na die /api/:translationId/complete.simple.json eindpunt.
 */
export interface SimpleTranslationComplete {
    /**
     * Die vertalingsmetadata.
     */
    translation: Translation;

    /**
     * Die volledige lys van boeke met al hul hoofstukke.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * 'n Boek in die volledige vertaling aflaai, met behulp van die vereenvoudigde hoofstukformaat.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Die volledige lys van hoofstukke met alle inhoud.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * 'n Hoofstuk in die volledige vertaling-aflaai, met behulp van die vereenvoudigde hoofstukformaat.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Die aantal verse wat die hoofstuk bevat.
     */
    numberOfVerses: number;

    /**
     * Die skakels na verskillende oudioweergawes vir die hoofstuk.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Die oudio-tydsberekening (begintye per vers, in sekondes) vir die hoofstuk.
     *
     * Let daarop dat die volledige vertaallêers die tydsberekening self bevat (sien TranslationBookChapterAudioTimingsMap in die standaardformaatdokumente), anders as die individuele hoofstuk-eindpunte, wat skakels daarna bevat.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Die skakel na die woordvlak-aantekeninge vir die hoofstuk, met behulp van die vereenvoudigde formaat. Weglaat as die hoofstuk geen woordvlak-aantekeninge het nie.
     */
    thisChapterWordsLink?: string;

    /**
     * Die vereenvoudigde inligting vir die hoofstuk.
     */
    chapter: SimpleChapterData;
}
```

### Voorbeeld

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
