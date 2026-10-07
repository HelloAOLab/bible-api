# Formato semplificato

Formato semplificato per capitoli, download di traduzioni complete e annotazioni a livello di parola. Consultare [Traduzioni, Libri e Capitoli](./README.md) per i link alle traduzioni e all'elenco dei libri, oppure [il formato standard](./standard.md) per la rappresentazione strutturata originale dello stesso contenuto.

## Ottieni un capitolo semplificato da una traduzione

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Consente di estrarre il contenuto di un singolo capitolo di un determinato libro e di una data traduzione, utilizzando il formato semplificato.

Nel formato semplificato, il contenuto di ogni versetto è rappresentato da una singola stringa anziché da un elenco di contenuti formattati. Ciò significa che non è necessario costruire manualmente il testo di un versetto, operazione che può risultare complessa, soprattutto per quanto riguarda la spaziatura. Tutto ciò che non può essere rappresentato da una semplice stringa (note a piè di pagina, le parole di Gesù, poesie e titoli inseriti all'interno di un versetto) viene mantenuto come offset all'interno della stringa, in modo che nulla vada perso.

Utilizza questo endpoint quando desideri il testo di un capitolo. Utilizza [l'endpoint standard per i capitoli](./standard.md#get-a-chapter-from-a-translation) quando desideri visualizzare il capitolo con la sua formattazione originale.

-   `translation` è l'ID della traduzione (es. `BSB` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi - puoi trovare un elenco degli ID dei libri [qui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` indica il numero del capitolo (ad esempio `1` per il primo capitolo).

I capitoli che presentano annotazioni a livello di parola sono collegati ad esse tramite il `thisChapterWordsLink` , che punta alle [annotazioni semplificate](#get-the-words-of-a-chapter-in-the-simplified-format) , ovvero quelle i cui offset corrispondono al testo in questo file.

I capitoli che dispongono di tempi audio specifici per ciascun lettore sono collegati tramite il link `thisChapterAudioTimings` , che punta [all'endpoint dei tempi audio](./standard.md#get-the-audio-timings-for-a-chapter) , ovvero lo stesso file a cui punta l'endpoint del capitolo standard, poiché i tempi non dipendono dal formato del capitolo.

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Ottieni il testo di Genesi 1 dalla traduzione BSB
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

### Offset

Tutti gli offset nel formato semplificato - `offset` , `start` e `end` - sono indici del versetto `text` che li contiene. Sono misurati in unità di codice UTF-16, che è quella utilizzata da JavaScript `String.prototype.length` e `String.prototype.slice()` .

`start` è inclusivo e `end` è esclusivo, quindi `text.slice(start, end)` restituisce esattamente l'intervallo di testo selezionato. Gli offset delle note a piè di pagina indicano la posizione a cui appartiene chi richiama la nota, quindi `text.slice(0, offset)` è il testo che la precede.

### Struttura

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * Informazioni sulla traduzione del capitolo del libro.
     */
    translation: Translation;

    /**
     * Informazioni sul capitolo del libro.
     */
    book: TranslationBook;

    /**
     * Il link al capitolo corrente.
     */
    thisChapterLink: string;

    /**
     * Il link alla versione integrale (non semplificata) di questo capitolo.
     */
    fullChapterApiLink: string;

    /**
     * I link alle diverse versioni audio del capitolo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * I link ai tempi audio per le diverse versioni audio del capitolo.
     * Consulta la sezione "Ottieni i tempi audio per un capitolo" nella documentazione del formato standard: il file dei tempi è lo stesso indipendentemente dal formato del capitolo a cui è collegato.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Il link al capitolo successivo, in formato semplificato.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterApiLink: string | null;

    /**
     * I link alle diverse versioni audio per il prossimo capitolo.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Di seguito i link ai tempi audio per le diverse versioni audio del capitolo successivo.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Il link al capitolo precedente, in formato semplificato.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterApiLink: string | null;

    /**
     * I link alle diverse versioni audio del capitolo precedente.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * I link ai timestamp audio per le diverse versioni audio del capitolo precedente.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Il numero di versetti contenuti nel capitolo.
     */
    numberOfVerses: number;

    /**
     * Le informazioni relative al capitolo.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Il numero del capitolo.
     */
    number: number;

    /**
     * Il contenuto del capitolo.
     */
    content: SimpleChapterContent[];

    /**
     * Elenco delle note a piè di pagina che non è stato possibile associare a un verso.
     * Le note a piè di pagina relative a un versetto sono incluse nel versetto stesso, quindi questo elenco è solitamente vuoto.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Un tipo di unione che rappresenta un singolo elemento di contenuto in un capitolo semplificato.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Un titolo all'interno di un capitolo.
 */
interface SimpleChapterHeading {
    /**
     * Indica che il contenuto rappresenta un'intestazione.
     */
    type: 'heading';

    /**
     * Il testo dell'intestazione.
     */
    text: string;
}

/**
 * Un'interruzione di riga in un capitolo.
 */
interface ChapterLineBreak {
    /**
     * Indica che il contenuto rappresenta un'interruzione di riga.
     */
    type: 'line_break';
}

/**
 * Un versetto in un capitolo.
 */
interface SimpleChapterVerse {
    /**
     * Indica che il contenuto è un verso.
     */
    type: 'verse';

    /**
     * Il numero del versetto.
     */
    number: number;

    /**
     * Il testo del verso.
     * I versi delle poesie e le interruzioni di riga sono separati dal carattere di nuova riga (\n).
     */
    text: string;

    /**
     * Le note a piè di pagina presenti nel verso.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * I titoli che compaiono al centro del verso.
     * Omesso se il verso non contiene intestazioni in linea.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Le parti del testo del versetto che rappresentano le parole di Gesù.
     * Omesso se il verso non ne contiene.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Le porzioni di testo in versi che rappresentano le righe della poesia.
     * Omesso se il verso non ne contiene.
     */
    poem?: SimplePoemRange[];
}

/**
 * Un sottotitolo in ebraico in un capitolo.
 * Questi elementi sono spesso inclusi come contenuti informativi presenti nei manoscritti originali.
 * Ad esempio, il Salmo 49 ha il sottotitolo ebraico "Al maestro del coro. Salmo dei figli di Core".
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Indica che il contenuto rappresenta un sottotitolo in ebraico.
     */
    type: 'hebrew_subtitle';
}

/**
 * Una nota a piè di pagina in un verso.
 */
interface SimpleVerseFootnote {
    /**
     * L'ID della nota.
     */
    noteId: number;

    /**
     * L'indice nel testo del verso in cui deve essere inserito il richiamo alla nota a piè di pagina.
     */
    offset: number;

    /**
     * Il testo della nota a piè di pagina.
     */
    text: string;

    /**
     * Il chiamante da utilizzare per la nota a piè di pagina.
     * Se "+", il chiamante dovrebbe essere generato automaticamente.
     * Se nullo, il chiamante deve essere vuoto.
     * Se si tratta di una stringa, il chiamante dovrebbe essere quella stringa.
     */
    caller: '+' | string | null;
}

/**
 * Un titolo inserito all'interno di un verso.
 */
interface SimpleInlineHeading {
    /**
     * L'indice nel testo del verso in cui compare il titolo.
     */
    offset: number;

    /**
     * Il testo dell'intestazione.
     */
    text: string;
}

/**
 * Una porzione di testo all'interno di un verso.
 */
interface SimpleTextRange {
    /**
     * L'indice del primo carattere dell'intervallo.
     */
    start: number;

    /**
     * L'indice che segue l'ultimo carattere dell'intervallo.
     */
    end: number;
}

/**
 * Una porzione di testo all'interno di un verso che rappresenta una riga di poesia.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Il livello di rientro con cui deve essere visualizzato il verso della poesia.
     */
    level: number;
}
```

### Esempio

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

La poesia e le parole di Gesù sono mantenute come intervalli sopra il testo del versetto. Ad esempio, `Matthew 5:3` nella traduzione `engwebp` appare così:

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

## Ottieni il testo di un capitolo in formato semplificato

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Recupera le annotazioni a livello di parola per un singolo capitolo, con i relativi offset rimappati sul testo di ogni [versetto semplificato](#get-a-simplified-chapter-from-a-translation) .

Gli offset nelle [annotazioni standard](./standard.md#get-the-words-of-a-chapter) sono ancorati agli elementi dell'array `content` di un verso, che il formato semplificato sostituisce con una singola stringa, quindi non possono essere utilizzati con esso. Utilizzare invece questo file quando si lavora con i capitoli semplificati.

-   `translation` è l'ID della traduzione (es. `BSB` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi - puoi trovare un elenco degli ID dei libri [qui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` indica il numero del capitolo (ad esempio `1` per il primo capitolo).

Queste voci non hanno `contentIndex` `start` e `end` sono offset nel `text` del versetto, esattamente come gli offset della nota a piè di pagina, della poesia e delle Parole di Gesù nei capitoli semplificati, quindi `text.slice(start, end)` è la parola annotata.

Come per le annotazioni standard, solo alcune traduzioni le possiedono. Un capitolo semplificato che le include rimanda a questo file con `thisChapterWordsLink` ; quando tale proprietà è assente, il file non esiste per quel capitolo.

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Ottieni il testo di Genesi 1 e le parole che sono annotate in esso
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

### Struttura

La struttura corrisponde [alle annotazioni standard](./standard.md#get-the-words-of-a-chapter) , tranne per il fatto che i collegamenti puntano ai file semplificati e le voci non hanno `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * L'ID della traduzione.
     */
    translationId: string;

    /**
     * L'ID del libro.
     */
    bookId: string;

    /**
     * Il numero del capitolo.
     */
    chapterNumber: number;

    /**
     * Il link al capitolo semplificato a cui si riferiscono queste annotazioni.
     */
    thisChapterLink: string;

    /**
     * Il link al capitolo successivo in versione semplificata.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterLink: string | null;

    /**
     * Il link al capitolo precedente, in versione semplificata.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterLink: string | null;

    /**
     * Il link a queste annotazioni.
     */
    thisChapterWordsLink: string;

    /**
     * Ecco il link alle annotazioni per il capitolo successivo.
     * Valore nullo se questo è l'ultimo capitolo della traduzione, oppure se il capitolo successivo non presenta annotazioni a livello di parola.
     */
    nextChapterWordsLink: string | null;

    /**
     * Il link alle annotazioni del capitolo precedente.
     * Valore nullo se si tratta del primo capitolo della traduzione o se il capitolo precedente non presenta annotazioni a livello di parola.
     */
    previousChapterWordsLink: string | null;

    /**
     * Le parole annotate per ogni versetto del capitolo, ordinate per numero di versetto.
     * Ogni elenco segue l'ordine in cui le parole compaiono nel versetto.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Annotazioni a livello di parola in un capitolo semplificato.
 */
export interface SimpleChapterWord {
    /**
     * L'indice del primo carattere della parola annotata nel testo del verso.
     */
    start: number;

    /**
     * L'indice che segue l'ultimo carattere della parola annotata nel testo del verso.
     */
    end: number;

    /**
     * I numeri di Strong per la parola.
     */
    strongs?: string[];

    /**
     * Il lemma (forma lessicale) della parola nella lingua di origine.
     */
    lemma?: string;

    /**
     * La morfologia della parola nella lingua di origine.
     */
    morph?: string;

    /**
     * La posizione della parola nel testo di origine.
     */
    srcloc?: string;

    /**
     * Di quale occorrenza della parola si tratta nel verso.
     */
    occurrence?: number;

    /**
     * Il numero di volte in cui la parola ricorre nel verso.
     */
    occurrences?: number;
}
```

### Esempio

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

Il versetto 1 di quel capitolo ha il testo `"In the beginning was the Word, and the Word was with God, and the Word was God."` , quindi `text.slice(7, 16)` è `"beginning"` .

## Ottieni la traduzione completa in formato semplificato

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Consente di ottenere il contenuto di un'intera traduzione, utilizzando il formato semplificato. Questo è il [formato semplificato dei capitoli](#get-a-simplified-chapter-from-a-translation) applicato al [download della traduzione completa](./standard.md#get-an-entire-translation) : un unico file contenente l'intera traduzione, in cui il contenuto di ogni versetto è una singola stringa.

Utilizza questa opzione quando desideri il testo completo di una traduzione senza dover effettuare una richiesta per ogni singolo capitolo e senza dover ricostruire il testo da zero.

-   `translation` è l'ID della traduzione (es. `BSB` ).

Questo file viene generato insieme a `complete.json` , quindi una traduzione o contiene entrambi o nessuno dei due. L'oggetto `translation` in entrambi i file contiene un `completeTranslationApiLink` e un `simpleCompleteTranslationApiLink` , quindi è possibile passare da un formato all'altro.

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Ottieni il testo dell'intera traduzione BSB
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

### Struttura

La struttura corrisponde [a quella della traduzione completa scaricabile](./standard.md#get-an-entire-translation) , con la differenza che ogni capitolo utilizza il formato semplificato.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Definisce i dati completi per il download della traduzione, utilizzando il formato capitolo semplificato.
 * Corrisponde all'endpoint /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * I metadati di traduzione.
     */
    translation: Translation;

    /**
     * L'elenco completo dei libri con tutti i loro capitoli.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Un libro nella sua traduzione integrale, scaricabile utilizzando il formato a capitoli semplificato.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * L'elenco completo dei capitoli con tutti i contenuti.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Un capitolo della traduzione completa scaricabile, utilizzando il formato di capitolo semplificato.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Il numero di versetti contenuti nel capitolo.
     */
    numberOfVerses: number;

    /**
     * I link alle diverse versioni audio del capitolo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Le tempistiche audio (orari di inizio di ogni strofa, in secondi) per il capitolo.
     *
     * Si noti che i file di traduzione completi contengono le tempistiche stesse (vedere TranslationBookChapterAudioTimingsMap nella documentazione del formato standard), a differenza dei singoli punti finali dei capitoli, che contengono collegamenti a tali tempistiche.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Il collegamento alle annotazioni a livello di parola per il capitolo, utilizzando il formato semplificato. Omesso se il capitolo non presenta annotazioni a livello di parola.
     */
    thisChapterWordsLink?: string;

    /**
     * Informazioni semplificate per il capitolo.
     */
    chapter: SimpleChapterData;
}
```

### Esempio

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
