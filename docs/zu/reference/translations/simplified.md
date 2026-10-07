# Ifomethi Elula

Ifomethi elula yezahluko, ukulandwa kokuhumusha okuphelele, kanye nezichasiselo ezingeni lamagama. Bheka [Ukuhumusha, Izincwadi, kanye Nezahluko](./README.md) ukuze uthole amaphuzu okuphela okuhumusha nohlu lwezincwadi, noma [ifomethi ejwayelekile](./standard.md) yokumelwa kokuqala, okuhlelekile kwalokhu okuqukethwe okufanayo.

## Thola Isahluko Esenziwe Lula Enguqulweni

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Uthola okuqukethwe yisahluko esisodwa sencwadi ethile kanye nokuhumusha, esebenzisa ifomethi elula.

Ngefomethi elula, okuqukethwe yivesi ngalinye kuyintambo eyodwa esikhundleni sohlu lokuqukethwe okufomethiwe. Lokhu kusho ukuthi akudingeki ukuthi wakhe umbhalo wevesi ngokwakho, okungaba yinto engelutho ukuze ulunge - ikakhulukazi uma kukhulunywa ngesikhala. Noma yini engenakumelwa yintambo elula - imibhalo yaphansi, amazwi kaJesu, izinkondlo, kanye nezihloko ezivela phakathi kwevesi - igcinwa njenge-offset kuleyo ntambo, ngakho akukho lutho olulahlekile.

Sebenzisa leli phuzu lokugcina uma ufuna umbhalo wesahluko. Sebenzisa [iphuzu lokugcina lesahluko elijwayelekile](./standard.md#get-a-chapter-from-a-translation) uma ufuna ukudweba isahluko ngefomethi yaso yokuqala.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).
-   `book` yi-ID yencwadi (isib. `GEN` kuGenesise - ungathola uhlu lwama-ID ezincwadi [lapha](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` yisahluko sezinombolo (isib. `1` sesahluko sokuqala).

Izahluko ezinezichasiselo ezingeni lamagama zixhumanisa nazo no `thisChapterWordsLink` , okhomba [izichasiselo ezilula](#get-the-words-of-a-chapter-in-the-simplified-format) - lezo eziphambene nazo zihambisana nombhalo kuleli fayela.

Izahluko ezinezikhathi zomsindo ngomfundi ngamunye zixhumanisa nazo no- `thisChapterAudioTimings` , okhomba [endaweni yokugcina yezikhathi zomsindo](./standard.md#get-the-audio-timings-for-a-chapter) - ifayela elifanayo nelixhunywe endaweni yokugcina yesahluko evamile, njengoba izikhathi zingaxhomekile kufomethi yesahluko.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Thola umbhalo kaGenesise 1 enguqulweni ye-BSB
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

### Ama-Offsets

Zonke iziphazamiso ezifomethiwe elula - `offset` , `start` , kanye no `end` - ziyizikhombo eziku- `text` yevesi eliqukethe zona. Zilinganiswa ngamayunithi ekhodi ye-UTF-16, okuyilokho okusetshenziswa yi-JavaScript `String.prototype.length` kanye no `String.prototype.slice()` .

`start` ufaka konke kanti `end` ukhethekile, ngakho `text.slice(start, end)` ubuyisela uhla lombhalo olumakwe kahle. Ama-offset e-footnote yisikhundla lapho umshayi we-footnote ekhona, ngakho `text.slice(0, offset)` ungumbhalo oza ngaphambi kwawo.

### Isakhiwo

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * Isixhumanisi senguqulo evamile (engelula) yalesi sahluko.
     */
    fullChapterApiLink: string;

    /**
     * Izixhumanisi zezinguqulo ezahlukene zomsindo zesahluko.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Izixhumanisi zezikhathi zomsindo zezinguqulo ezahlukene zomsindo zesahluko.
     * Bheka "Thola Izikhathi Zomsindo Zesahluko" kumadokhumenti efomethi ejwayelekile - ifayela lezikhathi liyafana kungakhathaliseki ukuthi iyiphi ifomethi yesahluko exhunywe kulo.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Isixhumanisi sesahluko esilandelayo, ngefomethi elula.
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
     * Isixhumanisi sesahluko esidlule, ngefomethi elula.
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
     * Inani lamavesi aqukethwe yisahluko.
     */
    numberOfVerses: number;

    /**
     * Ulwazi lwesahluko.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Inombolo yesahluko.
     */
    number: number;

    /**
     * Okuqukethwe kwesahluko.
     */
    content: SimpleChapterContent[];

    /**
     * Uhlu lwemibhalo yaphansi engenakuhlotshaniswa nevesi.
     * Imibhalo yaphansi eyingxenye yevesi ifakiwe evesini ngokwalo, ngakho-ke lolu hlu luvame ukuba lungenalutho.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Uhlobo lwenhlangano olumelela ingxenye eyodwa yokuqukethwe esahlukweni esilula.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Isihloko esahlukweni.
 */
interface SimpleChapterHeading {
    /**
     * Kubonisa ukuthi okuqukethwe kumele isihloko.
     */
    type: 'heading';

    /**
     * Umbhalo wesihloko.
     */
    text: string;
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
 * Ivesi esahlukweni.
 */
interface SimpleChapterVerse {
    /**
     * Kubonisa ukuthi okuqukethwe kuyivesi.
     */
    type: 'verse';

    /**
     * Inombolo yevesi.
     */
    number: number;

    /**
     * Umbhalo wevesi.
     * Imigqa yezinkondlo kanye nokuhlukana kwemigqa kuhlukaniswa ngabalingiswa bomugqa omusha (\n).
     */
    text: string;

    /**
     * Imibhalo yaphansi evela evesini.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Izihloko ezivela phakathi nevesi.
     * Akuvunyelwe uma ivesi lingenazo izihloko eziqondile.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Izinga lombhalo wamavesi amelela amazwi kaJesu.
     * Kushiywe uma ivesi lingenalo nhlobo.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Izinga lombhalo wevesi elimelela imigqa yezinkondlo.
     * Kushiywe uma ivesi lingenalo nhlobo.
     */
    poem?: SimplePoemRange[];
}

/**
 * Isihlokwana sesiHebheru esahlukweni.
 * Lokhu kuvame ukufakwa njengokuqukethwe kolwazi okuvele emibhalweni yokuqala.
 * Isibonelo, amaHubo 49 anesihloko sesiHebheru esithi "Kumholi wekwaya. IHubo Lamadodana KaKora."
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Kubonisa ukuthi okuqukethwe kumelela isihlokwana sesiHebheru.
     */
    type: 'hebrew_subtitle';
}

/**
 * Umbhalo waphansi evesini.
 */
interface SimpleVerseFootnote {
    /**
     * I-ID yenothi.
     */
    noteId: number;

    /**
     * Inkomba embhalweni wevesi okufanele ifakwe kuyo umuntu obiza umbhalo waphansi.
     */
    offset: number;

    /**
     * Umbhalo wombhalo waphansi.
     */
    text: string;

    /**
     * Umshayi wezingcingo okufanele asetshenziswe kumbhalo waphansi.
     * Uma "+", khona-ke umuntu oshaya ucingo kufanele azenzekele.
     * Uma kungekho lutho, khona-ke umuntu oshaya ucingo kufanele angabi nalutho.
     * Uma kuyintambo, khona-ke umuntu obizayo kufanele abe yintambo leyo.
     */
    caller: '+' | string | null;
}

/**
 * Isihloko esifakwe evesini.
 */
interface SimpleInlineHeading {
    /**
     * Inkomba embhalweni wevesi lapho isihloko sivela khona.
     */
    offset: number;

    /**
     * Umbhalo wesihloko.
     */
    text: string;
}

/**
 * Uhlu lombhalo ngaphakathi kwevesi.
 */
interface SimpleTextRange {
    /**
     * Inkomba yohlamvu lokuqala lobubanzi.
     */
    start: number;

    /**
     * Inkomba ngemva kohlamvu lokugcina lobubanzi.
     */
    end: number;
}

/**
 * Uhlu lombhalo ngaphakathi kwevesi elimelela umugqa wezinkondlo.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Izinga lokuzinza okufanele kuboniswe ngalo umugqa wezinkondlo.
     */
    level: number;
}
```

### Isibonelo

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

Izinkondlo kanye namazwi kaJesu kugcinwa ngokwezinga lombhalo wevesi. Isibonelo, `Matthew 5:3` enguqulweni `engwebp` ubukeka kanje:

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

## Thola Amagama Esahluko Ngefomethi Elula

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Uthola izichasiselo ezingeni lamagama zesahluko esisodwa, kanye nokuhlelwa kabusha kwazo kuhlelwe kabusha kumbhalo [wevesi ngalinye elenziwe lula](#get-a-simplified-chapter-from-a-translation) .

Ama-offsets kuma [-regular annotations](./standard.md#get-the-words-of-a-chapter) anamathele ezintweni ze-array yevesi `content` , lapho ifomethi elula ithatha indawo ngentambo eyodwa - ngakho-ke azikwazi ukusetshenziswa nayo. Sebenzisa leli fayela esikhundleni salokho uma usebenza ngezahluko ezilula.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).
-   `book` yi-ID yencwadi (isib. `GEN` kuGenesise - ungathola uhlu lwama-ID ezincwadi [lapha](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` yisahluko sezinombolo (isib. `1` sesahluko sokuqala).

Lokhu okufakiwe akunawo `contentIndex` . `start` no- `end` kuyi-offset ku- `text` yevesi, njengoba nje umbhalo waphansi, inkondlo, kanye ne-offset yamazwi kaJesu ezahlukweni ezilula, ngakho `text.slice(start, end)` yigama elichazwe.

Njengakwezichasiselo ezivamile, ezinye izinguqulo kuphela ezinazo. Isahluko esilula esinazo sixhumanisa leli fayela no- `thisChapterWordsLink` ; uma leyo mpahla ingekho, leli fayela alikho kulesi sahluko.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Thola umbhalo kaGenesise 1 kanye namagama abhalwe kuwo
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

### Isakhiwo

Isakhiwo sifana [nezichasiselo ezijwayelekile](./standard.md#get-the-words-of-a-chapter) , ngaphandle kokuthi izixhumanisi zikhomba kumafayela alula futhi okufakiwe akunawo `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * Isixhumanisi sesahluko esenziwe lula esilungiselelwe lezi zichasiselo.
     */
    thisChapterLink: string;

    /**
     * Isixhumanisi sesahluko esilandelayo esenziwe lula.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni.
     */
    nextChapterLink: string | null;

    /**
     * Isixhumanisi sesahluko esenziwe lula esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhunyushweni.
     */
    previousChapterLink: string | null;

    /**
     * Isixhumanisi salezi zichasiselo.
     */
    thisChapterWordsLink: string;

    /**
     * Isixhumanisi sencazelo yesahluko esilandelayo.
     * Akunamsebenzi uma lesi kuyisahluko sokugcina ekuhumusheni, noma uma isahluko esilandelayo singenazo izichasiselo ezingeni lamagama.
     */
    nextChapterWordsLink: string | null;

    /**
     * Isixhumanisi sencazelo yesahluko esedlule.
     * Akunamsebenzi uma lesi kuyisahluko sokuqala ekuhumusheni, noma uma isahluko esidlule singenazo izichasiselo ezingeni lamagama.
     */
    previousChapterWordsLink: string | null;

    /**
     * Amagama anezichasiselo zevesi ngalinye esahlukweni, afakwe uphawu lwenombolo yevesi.
     * Uhlu ngalunye lulandelana ngendlela amagama avela ngayo evesini.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Isichasiselo sezinga lamagama esahlukweni esilula.
 */
export interface SimpleChapterWord {
    /**
     * Inkomba yohlamvu lokuqala lwegama elichazwe embhalweni wevesi.
     */
    start: number;

    /**
     * Inkomba elandela uhlamvu lokugcina lwegama elichazwe embhalweni wevesi.
     */
    end: number;

    /**
     * Izinombolo zikaStrong zegama.
     */
    strongs?: string[];

    /**
     * I-lemma (isichazamazwi) segama olimini lomthombo.
     */
    lemma?: string;

    /**
     * Ukwakheka kwegama olimini oluvela kulo.
     */
    morph?: string;

    /**
     * Indawo yegama embhalweni womthombo.
     */
    srcloc?: string;

    /**
     * Yikuphi ukuvela kwegama evesini lokhu.
     */
    occurrence?: number;

    /**
     * Inani lezikhathi lapho leli gama livela khona evesini.
     */
    occurrences?: number;
}
```

### Isibonelo

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

Ivesi 1 laleso sahluko linombhalo othi `"In the beginning was the Word, and the Word was with God, and the Word was God."` , ngakho-ke `text.slice(7, 16)` ungu `"beginning"` .

## Thola ukuhumusha okuphelele ngefomethi elula

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Ithola okuqukethwe kwenguqulo yonke, isebenzisa ifomethi elula. Lena [ifomethi yesahluko elula](#get-a-simplified-chapter-from-a-translation) esetshenziswa [ekulandeni okuphelele kokuhumusha](./standard.md#get-an-entire-translation) : ifayela elilodwa eliqukethe ukuhumusha konke, lapho okuqukethwe kwevesi ngalinye kuyintambo eyodwa.

Sebenzisa lokhu uma ufuna umbhalo wenguqulo yonke ngaphandle kokufaka isicelo ngesahluko ngasinye futhi ngaphandle kokudinga ukuzakhela umbhalo ngokwakho.

-   `translation` uyi-ID yokuhumusha (isib. `BSB` ).

Leli fayela lenziwe eceleni kwe `complete.json` , ngakho-ke ukuhumusha kungaba nakho kokubili noma akukho nhlobo. Into `translation` kumafayela womabili iqukethe i- `completeTranslationApiLink` kanye ne- `simpleCompleteTranslationApiLink` , ukuze ukwazi ukuhamba phakathi kwamafomethi amabili.

### Isibonelo Sekhodi

::: code-tabs#lang

@tab I-JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Thola umbhalo wayo yonke inguqulo ye-BSB
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

### Isakhiwo

Isakhiwo sifana [nokulanda okuphelele okuvamile kokuhumusha](./standard.md#get-an-entire-translation) , ngaphandle kokuthi isahluko ngasinye sisebenzisa ifomethi elula.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Ichaza idatha ephelele yokulanda ukuhumusha, isebenzisa ifomethi yesahluko esenziwe lula.
 * Amamephu aya endaweni yokugcina ye-/api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * I-metadata yokuhumusha.
     */
    translation: Translation;

    /**
     * Uhlu oluphelele lwezincwadi nazo zonke izahluko zazo.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Incwadi ehunyushwe ngokuphelele, kusetshenziswa ifomethi yezahluko elula.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Uhlu oluphelele lwezahluko ezinazo zonke izinto eziqukethwe.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Isahluko esiku-download ephelele yokuhumusha, kusetshenziswa ifomethi yesahluko esenziwe lula.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Inani lamavesi aqukethwe yisahluko.
     */
    numberOfVerses: number;

    /**
     * Izixhumanisi zezinguqulo ezahlukene zomsindo zesahluko.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Izikhathi zomsindo (izikhathi zokuqala ngevesi ngalinye, ngemizuzwana) zesahluko.
     *
     * Qaphela ukuthi amafayela okuhumusha aphelele aqukethe izikhathi ngokwazo (bheka i-TranslationBookChapterAudioTimingsMap kumadokhumenti efomethi ejwayelekile), ngokungafani nama-endpoints esahluko ngasinye, aqukethe izixhumanisi eziya kuwo.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Isixhumanisi esiya ezichasisweni zezinga lamagama zesahluko, kusetshenziswa ifomethi elula. Asifakwanga uma isahluko singenazo izichasiso zezinga lamagama.
     */
    thisChapterWordsLink?: string;

    /**
     * Ulwazi olulula lwesahluko.
     */
    chapter: SimpleChapterData;
}
```

### Isibonelo

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
