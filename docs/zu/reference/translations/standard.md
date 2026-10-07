# Ifomethi Ejwayelekile

Ifomethi ejwayelekile yezahluko, ukulandwa kokuhumusha okuphelele, kanye nezichasiselo ezingeni lamagama. Bheka [Ukuhumusha, Izincwadi, kanye Nezahluko](./README.md) ukuze uthole amaphuzu okuphela okuhumusha nohlu lwezincwadi, noma [ifomethi elula](./simplified.md) yokumelela okunye kwalokhu okuqukethwe okufanayo.

## Thola Isahluko Esihunyushweni

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Uthola okuqukethwe yisahluko esisodwa sencwadi ethile kanye nokuhumusha.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).
-   `book` yi-ID yencwadi (isib. `GEN` kuGenesise - ungathola uhlu lwama-ID ezincwadi [lapha](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` yisahluko sezinombolo (isib. `1` sesahluko sokuqala).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Thola uGenesise 1 enguqulweni ye-BSB
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

### Isakhiwo

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * Ulwazi lokuhumusha lwesahluko sencwadi.
     */
    translation: Translation;

    /**
     * Ulwazi lwencwadi lwesahluko sencwadi.
     */
    book: TranslationBook;

    /**
     * Isixhumanisi sesahluko samanje.
     */
    thisChapterLink: string;

    /**
     * Izixhumanisi zezinguqulo ezahlukene zomsindo zesahluko.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Izixhumanisi zezikhathi zomsindo zezinguqulo ezahlukene zomsindo zesahluko.
     * Isixhumanisi ngasinye sikhomba ifayela lezikhathi zomsindo lalowo mfundi - bheka "Thola Izikhathi Zomsindo Zesahluko" ngezansi.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Isixhumanisi sesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterApiLink: string | null;

    /**
     * Izixhumanisi zezinguqulo ezahlukene zomsindo zesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Izixhumanisi zezikhathi zomsindo zezinguqulo ezahlukene zomsindo zesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Isixhumanisi sesahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterApiLink: string | null;

    /**
     * Izixhumanisi zezinguqulo ezahlukene zomsindo zesahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Izixhumanisi zezikhathi zomsindo zezinguqulo ezahlukene zomsindo zesahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Isixhumanisi sencazelo yezinga lamagama yesahluko.
     * Kushiywe uma isahluko singenazo izichasiselo ezingeni lamagama.
     */
    thisChapterWordsLink?: string;

    /**
     * Isixhumanisi sencazelo yezinga lamagama sesahluko esilandelayo.
     * Akuvunyelwe uma lesi kuyisahluko sokugcina ekuhumusheni, noma uma isahluko esilandelayo singenazo izichasiselo ezingeni lamagama.
     */
    nextChapterWordsLink?: string;

    /**
     * Isixhumanisi sencazelo yezinga lamagama sesahluko esedlule.
     * Akufakiwe uma lesi kuyisahluko sokuqala ekuhumusheni, noma uma isahluko esidlule singenazo izichasiselo ezingeni lamagama.
     */
    previousChapterWordsLink?: string;

    /**
     * Inani lamavesi aqukethwe yisahluko.
     */
    numberOfVerses: number;

    /**
     * Isixhumanisi senguqulo elula yalesi sahluko.
     * Akuvunyelwe uma izahluko ezilula zingatholakali.
     */
    simpleChapterApiLink?: string;

    /**
     * Ulwazi lwesahluko.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Inombolo yesahluko.
     */
    number: number;

    /**
     * Okuqukethwe kwesahluko.
     */
    content: ChapterContent[];

    /**
     * Uhlu lwemibhalo yaphansi yesahluko.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Uhlobo lwenyunyana olumelela ingxenye eyodwa yokuqukethwe kwesahluko.
 * Okuqukethwe kwesahluko kungaba ngenye yezinto ezilandelayo:
 * - Isihloko.
 * - Ukuhlukana komugqa.
 * - Ivesi.
 * - Isihlokwana sesiHebheru.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Isihloko esahlukweni.
 */
interface ChapterHeading {
    /**
     * Kubonisa ukuthi okuqukethwe kumele isihloko.
     */
    type: 'heading';

    /**
     * Okuqukethwe kwesihloko.
     * Uma izintambo eziningi zifakiwe ku-array, kufanele zihlanganiswe nesikhala.
     */
    content: string[];
}

/**
 * Ukuhlukana komugqa esahlukweni.
 */
interface ChapterLineBreak {
    /**
     * Kubonisa ukuthi okuqukethwe kumele ukuhlukana komugqa.
     */
    type: 'line_break';
}

/**
 * Isihlokwana sesiHebheru esahlukweni.
 * Lokhu kuvame ukusetshenziswa njengokuqukethwe kolwazi okuvele emibhalweni yokuqala.
 * Isibonelo, amaHubo 49 anesihloko sesiHebheru esithi "Kumholi wekwaya. IHubo Lamadodana KaKora."
 */
interface ChapterHebrewSubtitle {
    /**
     * Kubonisa ukuthi okuqukethwe kumelela isihlokwana sesiHebheru.
     */
    type: 'hebrew_subtitle';

    /**
     * Uhlu lokuqukethwe oluqukethwe kumbhalo ongezansi.
     * Into ngayinye ohlwini ingaba umucu, umbhalo ofomethiwe, noma ireferensi yaphansi.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Ivesi esahlukweni.
 */
interface ChapterVerse {
    /**
     * Kubonisa ukuthi okuqukethwe kuyivesi.
     */
    type: 'verse';

    /**
     * Inombolo yevesi.
     */
    number: number;

    /**
     * Uhlu lokuqukethwe kwevesi.
     * Into ngayinye ohlwini ingaba umucu, umbhalo ofomethiwe, noma ireferensi yaphansi.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Umbhalo ofomethiwe. Okusho ukuthi, umbhalo ofomethiwe ngendlela ethile.
 */
interface FormattedText {
    /**
     * Umbhalo ofomethiwe.
     */
    text: string;

    /**
     * Ukuthi umbhalo umele inkondlo yini.
     * Inombolo ikhombisa izinga lokuhlehlisa.
     *
     * Okuvamile kumaHubo.
     */
    poem?: number;

    /**
     * Ukuthi umbhalo umele yini amazwi kaJesu.
     */
    wordsOfJesus?: boolean;
}

/**
 * Ichaza isikhombimsebenzisi esimele isihloko esifakwe evesini.
 */
interface InlineHeading {
    /**
     * Umbhalo wesihloko.
     */
    heading: string;
}

/**
 * Ichaza isikhombimsebenzisi esimele ukuhlukana komugqa okufakwe evesini.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Ireferensi yaphansi evesini noma esihlokweni sesiHebheru.
 */
interface VerseFootnoteReference {
    /**
     * I-ID yenothi.
     */
    noteId: number;
}

/**
 * Ulwazi mayelana nombhalo waphansi.
 */
interface ChapterFootnote {
    /**
     * I-ID yenothi elibhekiselwe kulo.
     */
    noteId: number;

    /**
     * Umbhalo wombhalo waphansi.
     */
    text: string;

    /**
     * Ivesi elibhekisela kumbhalo waphansi.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Umshayi wezingcingo okufanele asetshenziswe kumbhalo waphansi.
     * Kuma-footnote, "umshayi wezwi" umlingiswa osetshenziswa embhalweni ukubhekisela kuma-footnote.
     *
     * Isibonelo, embhalweni:
     * Sawubona (a) Mhlaba
     *
     * ---- (a) Lona umbhalo ongezansi.
     *
     * "(a)" ngumshayeli.
     *
     * Uma "+", khona-ke umuntu oshaya ucingo kufanele azenzekele.
     * Uma kungekho lutho, khona-ke umuntu oshaya ucingo kufanele angabi nalutho.
     * Uma kuyintambo, khona-ke umuntu obizayo kufanele abe yintambo leyo.
     */
    caller: '+' | string | null;
}

/**
 * Izixhumanisi zomsindo zesahluko sencwadi.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Umfundi wesahluko kanye nesixhumanisi se-URL esiya efayeleni lomsindo.
     */
    [reader: string]: string;
}

/**
 * Izikhathi zomsindo zixhumanisa isahluko sencwadi.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Umfundi wesahluko kanye nesixhumanisi se-API esiya kufayela lezikhathi zomsindo lalowo mfundi.
     */
    [reader: string]: string;
}
```

### Isibonelo

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

## Thola Izikhathi Zomsindo Zesahluko

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Ithola izikhathi zomsindo ngevesi ngalinye zesahluko esisodwa, ukuze umfundi oyedwa alandise ngaso - okungukuthi, isikhathi (ngemizuzwana, uma siqhathaniswa nokuqala kwefayela lomsindo lalowo mfundi) lapho ivesi ngalinye liqala khona. Amakhasimende angasebenzisa lokhu ukugqamisa ivesi elifundwayo njengamanje njengoba umsindo udlala.

Izinguqulo ezithile kanye nabafundi kuphela abanezikhathi zomsindo. Isahluko esinazo zomfundi sixhumanisa leli fayela nokufakwa ku- `thisChapterAudioTimings` , okufakwe uphawu lwe-ID yalowo mfundi; uma umfundi engeyona isihluthulelo kuleyo mephu, leli fayela alikho kulowo mfundi kanye nesahluko.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).
-   `book` yi-ID yencwadi (isib. `GEN` kuGenesise - ungathola uhlu lwama-ID ezincwadi [lapha](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` yisahluko sezinombolo (isib. `1` sesahluko sokuqala).
-   `reader` ungumazisi womfundi okulandisa kwakhe izikhathi zakhe (isib. `hays` ) - abafundi abatholakalayo besahluko bayizihluthulelo ze `thisChapterAudioLinks` yaso.

Ukuphela kwevesi kuyisiqalo sevesi elilandelayo (noma, evesini lokugcina, ukuphela kwefayela lomsindo), ngakho-ke iklayenti alidingi lutho ngaphandle kohlu oluhleliwe lwezikhathi zokuqala ukuze lakhe amabanga okugqamisa isahluko sonke.

Leli fayela liyafana kungakhathaliseki ukuthi lifinyelelwe kusukela ekugcineni kwesahluko esijwayelekile noma [esilula](./simplified.md#get-a-simplified-chapter-from-a-translation) - kunesethi eyodwa kuphela yezikhathi ngokuhumusha, incwadi, isahluko, kanye nomfundi.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Thola izikhathi zomsindo zikaGenesise 1 (BSB), njengoba zifundwe ngu-"hays"
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

### Isakhiwo

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Ichaza izikhathi zomsindo zesahluko sencwadi, somfundi oyedwa.
 * Amamephu aya ku-/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json endpoint.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * I-ID yokuhumusha.
     */
    translationId: string;

    /**
     * I-ID yencwadi.
     */
    bookId: string;

    /**
     * Inombolo yesahluko.
     */
    chapterNumber: number;

    /**
     * I-ID yomfundi okukhulunywa ngayo kulezi zikhathi.
     */
    reader: string;

    /**
     * Isixhumanisi sefayela lomsindo esilungiselelwe lezi zikhathi.
     */
    audioLink: string;

    /**
     * Isixhumanisi solwazi lwalesi sahluko.
     */
    thisChapterLink: string;

    /**
     * Isixhumanisi solwazi lwesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterLink: string | null;

    /**
     * Isixhumanisi solwazi lwesahluko esidlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterLink: string | null;

    /**
     * Isixhumanisi saleli fayela lezikhathi zomsindo.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Isixhumanisi sezikhathi zesahluko esilandelayo, somfundi ofanayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Isixhumanisi sezikhathi zesahluko esedlule, somfundi ofanayo.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Izikhathi ngemizuzwana lapho ivesi ngalinye liqala khona, ngokulandelana.
     * Inombolo yokuqala (uhlu 0) yisikhathi lapho ivesi lokuqala liqala khona ekurekhodweni.
     */
    verses: number[];
}
```

### Isibonelo

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

`verses[0]` yisikhathi sokuqala kwevesi 1, `verses[1]` yisikhathi sokuqala kwevesi 2, njalo njalo - ngakho kulesi sibonelo, ivesi 2 likaGenesise 1 (BSB, njengoba lifundwa "yi-hays") liqala ngemizuzwana engu-4.32 ku `audioLink` .

## Thola Amagama Esahluko

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Uthola izichasiselo ezingeni lamagama (izinombolo zikaStrong kanye nedatha yomthombo ehlobene) yesahluko esisodwa.

Kuphela izinguqulo ezithile ezifaka izichasiselo ezingeni lamagama. Isahluko esinazo sixhumanisa leli fayela no- `thisChapterWordsLink` ; uma leyo mpahla ingekho, leli fayela alikho esahlukweni.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).
-   `book` yi-ID yencwadi (isib. `GEN` kuGenesise - ungathola uhlu lwama-ID ezincwadi [lapha](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` yisahluko sezinombolo (isib. `1` sesahluko sokuqala).

Isichasiselo ngasinye sinamathele kuhlu lwezinhlamvu entweni eyodwa yohlu lwevesi elingu `content` : `contentIndex` uyinkomba yento, kanti `start` / `end` uyizilinganiso zezinhlamvu embhalweni waleyo nto. `end` ukhethekile, ngakho `text.slice(start, end)` igama elichazwe.

Ukunamathela entweni yokuqukethwe (esikhundleni sevesi lonke) kusho ukuthi ama-offsets ahlala efanele emavesini okuqukethwe kwawo kuhlukaniswe izinto eziningi, njengemigqa yenkondlo, amazwi kaJesu, kanye nezinkomba zaphansi.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Thola amagama kaGenesise 1 enguqulweni ye-BSB
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

### Isakhiwo

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * I-ID yokuhumusha.
     */
    translationId: string;

    /**
     * I-ID yencwadi.
     */
    bookId: string;

    /**
     * Inombolo yesahluko.
     */
    chapterNumber: number;

    /**
     * Isixhumanisi solwazi lwalesi sahluko.
     */
    thisChapterLink: string;

    /**
     * Isixhumanisi solwazi lwesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterLink: string | null;

    /**
     * Isixhumanisi solwazi lwesahluko esidlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterLink: string | null;

    /**
     * Isixhumanisi sefayela lamagama.
     */
    thisChapterWordsLink: string;

    /**
     * Isixhumanisi samagama esahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni, noma uma isahluko esilandelayo singenazo izichasiselo ezingeni lamagama.
     */
    nextChapterWordsLink: string | null;

    /**
     * Isixhumanisi samagama esahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhumusheni, noma uma isahluko esidlule singenazo izichasiselo ezingeni lamagama.
     */
    previousChapterWordsLink: string | null;

    /**
     * Amagama anezichasiselo zevesi ngalinye esahlukweni, afakwe uphawu lwenombolo yevesi.
     * Uhlu ngalunye lulandelana ngendlela amagama avela ngayo evesini.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Inkomba yento eqoqweni lokuqukethwe kwevesi okusebenza kulo isichasiselo.
     */
    contentIndex: number;

    /**
     * Inkomba yohlamvu lokuqala lwegama elichaziwe embhalweni wento yokuqukethwe.
     */
    start: number;

    /**
     * Inkomba elandela uhlamvu lokugcina lwegama elichazwe embhalweni wento yokuqukethwe.
     * Okusho ukuthi, i-text.slice(start, end) yigama elichazwe ngenhla.
     */
    end: number;

    /**
     * Inombolo(izinombolo) kaStrong yegama.
     * Kushiywe uma ukuhumusha kunikeze ezinye izichasiselo zegama kuphela.
     */
    strongs?: string[];

    /**
     * Uhlobo lwesichazamazwi (ingcaphuno) saleli gama.
     * Kushiywe ngaphandle uma ukuhumusha kungazange kunikeze.
     */
    lemma?: string;

    /**
     * Ikhodi yokuhlaziya isimo segama.
     * Kushiywe ngaphandle uma ukuhumusha kungazange kunikeze.
     */
    morph?: string;

    /**
     * Isikhombisi segama elisembhalweni womthombo, ngefomethi ethi <sourceName> : <location> .
     * Kushiywe ngaphandle uma ukuhumusha kungazange kunikeze.
     */
    srcloc?: string;

    /**
     * Yikuphi ukuvela kwegama eliyinhloko leli gama. Kususelwa ku-1.
     * Kushiywe ngaphandle uma ukuhumusha kungazange kunikeze.
     */
    occurrence?: number;

    /**
     * Inani eliphelele lezikhathi lapho igama elivela khona.
     * Kushiywe ngaphandle uma ukuhumusha kungazange kunikeze.
     */
    occurrences?: number;
}
```

### Isibonelo

Inikezwe isahluko esinevesi lokuqala elinokuqukethwe okukodwa:

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

Ifayela lamagama lichaza izinhlamvu zaleyo nto:

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

Okusho ukuthi, `"In the beginning...".slice(0, 2)` ngu `"In"` , umthombo ophawule ngo `G1722` .

## Thola ukuhumusha okuphelele

`GET https://bible.helloao.org/api/{translation}/complete.json`

Uthola okuqukethwe yinguqulo yonke.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Thola uGenesise 1 enguqulweni ye-BSB
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

### Isakhiwo

```typescript:no-line-numbers title="complete.ts"
/**
 * Ichaza idatha ephelele yokulanda ukuhumusha.
 * Amamephu aya endaweni yokugcina ye-/api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * I-metadata yokuhumusha.
     */
    translation: Translation;

    /**
     * Uhlu oluphelele lwezincwadi nazo zonke izahluko zazo.
     */
    books: TranslationCompleteBook[];
}

/**
 * Incwadi ekulandisweni okuphelele kokuhumusha.
 */
export interface TranslationCompleteBook {
    /**
     * I-ID yencwadi.
     */
    id: string;

    /**
     * Igama lencwadi elivela enguqulweni.
     */
    name: string;

    /**
     * Igama elivamile lencwadi.
     */
    commonName: string;

    /**
     * Isihloko sencwadi.
     */
    title: string | null;

    /**
     * Ukuhleleka kwencwadi.
     */
    order: number;

    /**
     * Inani lezahluko encwadini.
     */
    numberOfChapters: number;

    /**
     * Inani eliphelele lamavesi encwadini.
     */
    totalNumberOfVerses: number;

    /**
     * Ukuthi le ncwadi ayilona yini iqiniso.
     */
    isApocryphal?: boolean;

    /**
     * Uhlu oluphelele lwezahluko ezinazo zonke izinto eziqukethwe.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Isahluko ekulandisweni okuphelele kokuhumusha.
 */
export interface TranslationCompleteChapter {
    /**
     * Inani lamavesi aqukethwe yisahluko.
     */
    numberOfVerses: number;

    /**
     * Izixhumanisi zezinguqulo ezahlukene zomsindo zesahluko.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Izikhathi zomsindo (izikhathi zokuqala ngevesi ngalinye, ngemizuzwana) zezinguqulo ezahlukene zomsindo zesahluko.
     *
     * Ngokungafani no `thisChapterAudioTimings` endaweni yokugcina yesahluko ngasinye (exhumanisa ne-"Thola Izikhathi Zomsindo Zesahluko" ngezansi), lokhu kuqukethe izikhathi ngokwazo - njengoba iphuzu lokulanda ukuhumusha okuphelele liwukuba nakho konke kufayela elilodwa.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Isixhumanisi sencazelo yezinga lamagama yesahluko.
     * Kushiywe uma isahluko singenazo izichasiselo ezingeni lamagama.
     */
    thisChapterWordsLink?: string;

    /**
     * Ulwazi lwesahluko.
     */
    chapter: ChapterData;
}

/**
 * Izikhathi zomsindo zesahluko sencwadi, ezifakwe ngqo esikhundleni sokuxhunywa.
 * Ihlanganisa i-ID yomfundi ohlwini lwezikhathi (ngemizuzwana) lapho ivesi ngalinye liqala khona, ngokulandelana kwevesi.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Isibonelo

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
