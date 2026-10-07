# Formato standard

Formato standard per capitoli, download di traduzioni complete e annotazioni a livello di parola. Consultare [Traduzioni, Libri e Capitoli](./README.md) per i link alle traduzioni e all'elenco dei libri, oppure [il formato semplificato](./simplified.md) per la rappresentazione alternativa dello stesso contenuto.

## Ottieni un capitolo da una traduzione

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Consente di ottenere il contenuto di un singolo capitolo di un determinato libro e di una data traduzione.

-   `translation` è l'ID della traduzione (es. `BSB` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi - puoi trovare un elenco degli ID dei libri [qui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` indica il numero del capitolo (ad esempio `1` per il primo capitolo).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Ottieni Genesi 1 dalla traduzione BSB
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

### Struttura

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * I link alle diverse versioni audio del capitolo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * I link ai tempi audio per le diverse versioni audio del capitolo.
     * Ciascun link rimanda al file con i tempi audio per quel lettore - vedi "Ottieni i tempi audio per un capitolo" qui sotto.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Il link al capitolo successivo.
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
     * Il link al capitolo precedente.
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
     * Il link alle annotazioni a livello di parola per il capitolo.
     * Omesso se il capitolo non presenta annotazioni a livello di singola parola.
     */
    thisChapterWordsLink?: string;

    /**
     * Il link alle annotazioni a livello di parola per il capitolo successivo.
     * Omesso se questo è l'ultimo capitolo della traduzione, o se il capitolo successivo non presenta annotazioni a livello di parola.
     */
    nextChapterWordsLink?: string;

    /**
     * Il link alle annotazioni a livello di parola del capitolo precedente.
     * Omesso se si tratta del primo capitolo della traduzione, oppure se il capitolo precedente non presenta annotazioni a livello di parola.
     */
    previousChapterWordsLink?: string;

    /**
     * Il numero di versetti contenuti nel capitolo.
     */
    numberOfVerses: number;

    /**
     * Ecco il link alla versione semplificata di questo capitolo.
     * Omesso se non sono disponibili capitoli semplificati.
     */
    simpleChapterApiLink?: string;

    /**
     * Le informazioni relative al capitolo.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Il numero del capitolo.
     */
    number: number;

    /**
     * Il contenuto del capitolo.
     */
    content: ChapterContent[];

    /**
     * Elenco delle note a piè di pagina del capitolo.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Un tipo di unione che rappresenta un singolo elemento del contenuto di un capitolo.
 * Il contenuto di un capitolo può essere uno dei seguenti:
 * - Un titolo.
 * - Un'interruzione di riga.
 * - Un verso.
 * - Sottotitoli in ebraico.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Un titolo all'interno di un capitolo.
 */
interface ChapterHeading {
    /**
     * Indica che il contenuto rappresenta un'intestazione.
     */
    type: 'heading';

    /**
     * Il contenuto dell'intestazione.
     * Se l'array contiene più stringhe, queste devono essere concatenate separandole con uno spazio.
     */
    content: string[];
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
 * Un sottotitolo in ebraico in un capitolo.
 * Questi elementi vengono spesso inclusi come contenuti informativi presenti nei manoscritti originali.
 * Ad esempio, il Salmo 49 ha il sottotitolo ebraico "Al maestro del coro. Salmo dei figli di Core".
 */
interface ChapterHebrewSubtitle {
    /**
     * Indica che il contenuto rappresenta un sottotitolo in ebraico.
     */
    type: 'hebrew_subtitle';

    /**
     * L'elenco dei contenuti contenuti nel sottotitolo.
     * Ciascun elemento dell'elenco potrebbe essere una stringa, un testo formattato o un riferimento a una nota a piè di pagina.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Un versetto in un capitolo.
 */
interface ChapterVerse {
    /**
     * Indica che il contenuto è un verso.
     */
    type: 'verse';

    /**
     * Il numero del versetto.
     */
    number: number;

    /**
     * L'elenco dei contenuti del versetto.
     * Ciascun elemento dell'elenco potrebbe essere una stringa, un testo formattato o un riferimento a una nota a piè di pagina.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Testo formattato. Ovvero, testo formattato in un modo particolare.
 */
interface FormattedText {
    /**
     * Il testo formattato.
     */
    text: string;

    /**
     * Se il testo rappresenta una poesia.
     * Il numero indica il livello di rientranza.
     *
     * Comune nei Salmi.
     */
    poem?: number;

    /**
     * Se il testo rappresenti le parole di Gesù.
     */
    wordsOfJesus?: boolean;
}

/**
 * Definisce un'interfaccia che rappresenta un'intestazione incorporata in un verso.
 */
interface InlineHeading {
    /**
     * Il testo dell'intestazione.
     */
    heading: string;
}

/**
 * Definisce un'interfaccia che rappresenta un'interruzione di riga incorporata in un verso.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Una nota a piè di pagina in un verso o un sottotitolo in ebraico.
 */
interface VerseFootnoteReference {
    /**
     * L'ID della nota.
     */
    noteId: number;
}

/**
 * Informazioni su una nota a piè di pagina.
 */
interface ChapterFootnote {
    /**
     * L'ID della nota a cui si fa riferimento.
     */
    noteId: number;

    /**
     * Il testo della nota a piè di pagina.
     */
    text: string;

    /**
     * Il riferimento al verso per la nota a piè di pagina.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Il chiamante da utilizzare per la nota a piè di pagina.
     * Per le note a piè di pagina, il "richiamante" è il carattere utilizzato nel testo per fare riferimento alla nota a piè di pagina.
     *
     * Ad esempio, nel testo:
     * Ciao (a) Mondo
     *
     * ---- (a) Questa è una nota a piè di pagina.
     *
     * La "(a)" indica chi effettua la chiamata.
     *
     * Se "+", il chiamante dovrebbe essere generato automaticamente.
     * Se nullo, il chiamante deve essere vuoto.
     * Se si tratta di una stringa, il chiamante dovrebbe essere quella stringa.
     */
    caller: '+' | string | null;
}

/**
 * I link audio per un capitolo del libro.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Il testo del capitolo e il link URL al file audio.
     */
    [reader: string]: string;
}

/**
 * I link relativi alla temporizzazione audio di un capitolo del libro.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Il lettore per il capitolo e il collegamento API al file delle tempistiche audio per quel lettore.
     */
    [reader: string]: string;
}
```

### Esempio

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

## Ottieni i tempi audio per un capitolo

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Consente di ottenere i tempi audio per ogni versetto di un singolo capitolo, per la narrazione di un singolo lettore, ovvero il momento (in secondi, rispetto all'inizio del file audio di quel lettore) in cui inizia ogni versetto. I clienti possono utilizzare questa funzione per evidenziare il versetto attualmente in fase di lettura durante la riproduzione dell'audio.

Solo alcune traduzioni e lettori dispongono di informazioni sulla durata dell'audio. Un capitolo che le include per un lettore è collegato a questo file tramite una voce in `thisChapterAudioTimings` , identificata dall'ID di quel lettore; quando un lettore non è presente in quella mappa, questo file non esiste per quel lettore e quel capitolo.

-   `translation` è l'ID della traduzione (es. `BSB` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi - puoi trovare un elenco degli ID dei libri [qui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` indica il numero del capitolo (ad esempio `1` per il primo capitolo).
-   `reader` è l'ID del lettore per la cui narrazione sono indicati i tempi (es. `hays` ) - i lettori disponibili per un capitolo sono le chiavi del suo `thisChapterAudioLinks` .

La fine di un verso coincide con l'inizio del verso successivo (oppure, per l'ultimo verso, con la fine del file audio), quindi un cliente non ha bisogno di altro oltre all'elenco ordinato degli orari di inizio per creare intervalli di evidenziazione per l'intero capitolo.

Questo file è identico sia che vi si acceda tramite il punto di accesso al capitolo standard, sia [tramite quello semplificato](./simplified.md#get-a-simplified-chapter-from-a-translation) : esiste un solo set di tempi per traduzione, libro, capitolo e lettore.

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Ottieni le tempistiche audio per Genesis 1 (BSB), come lette da "hays"
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

### Struttura

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Definisce la durata dell'audio per un capitolo del libro, per un singolo lettore.
 * Corrisponde all'endpoint /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
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
     * L'ID del lettore a cui sono destinati questi orari.
     */
    reader: string;

    /**
     * Ecco il link al file audio a cui si riferiscono queste indicazioni temporali.
     */
    audioLink: string;

    /**
     * Il link alle informazioni relative a questo capitolo.
     */
    thisChapterLink: string;

    /**
     * Ecco il link alle informazioni per il capitolo successivo.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterLink: string | null;

    /**
     * Il link alle informazioni relative al capitolo precedente.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterLink: string | null;

    /**
     * Il link al file con le tempistiche audio.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Ecco il link con gli orari del prossimo capitolo, per lo stesso lettore.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Il link ai tempi relativi al capitolo precedente, per lo stesso lettore.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Gli istanti in secondi in cui inizia ogni strofa, in ordine.
     * Il primo numero (indice 0) indica il punto della registrazione in cui inizia la prima strofa.
     */
    verses: number[];
}
```

### Esempio

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

`verses[0]` è l'ora di inizio del versetto 1, `verses[1]` è l'ora di inizio del versetto 2 e così via - quindi in questo esempio, il versetto 2 di Genesi 1 (BSB, come letto da "hays") inizia a 4,32 secondi dall'inizio del versetto `audioLink` .

## Ottieni le parole di un capitolo

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Recupera le annotazioni a livello di parola (numeri di Strong e dati di origine correlati) per un singolo capitolo.

Solo alcune traduzioni includono annotazioni a livello di parola. Un capitolo che le possiede rimanda a questo file con `thisChapterWordsLink` ; quando tale proprietà è assente, il file non esiste per quel capitolo.

-   `translation` è l'ID della traduzione (es. `BSB` ).
-   `book` è l'ID del libro (ad esempio `GEN` per la Genesi - puoi trovare un elenco degli ID dei libri [qui](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` indica il numero del capitolo (ad esempio `1` per il primo capitolo).

Ogni annotazione è ancorata a un intervallo di caratteri in un singolo elemento dell'array `content` di un verso: `contentIndex` è l'indice dell'elemento e `start` sono gli offset dei caratteri all'interno `end` testo di quell'elemento. `end` è esclusivo, quindi `text.slice(start, end)` è la parola annotata.

Ancorare un elemento di contenuto (anziché l'intero versetto) significa che gli offset rimangono corretti per i versetti il ​​cui contenuto è suddiviso in più elementi, come versi di poesie, parole di Gesù e riferimenti a note a piè di pagina.

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Ottieni il testo di Genesi 1 dalla traduzione BSB
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

### Struttura

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * Il link alle informazioni relative a questo capitolo.
     */
    thisChapterLink: string;

    /**
     * Ecco il link alle informazioni per il capitolo successivo.
     * Nullo se questo è l'ultimo capitolo della traduzione.
     */
    nextChapterLink: string | null;

    /**
     * Il link alle informazioni relative al capitolo precedente.
     * Nullo se questo è il primo capitolo della traduzione.
     */
    previousChapterLink: string | null;

    /**
     * Il link a questo file di testo.
     */
    thisChapterWordsLink: string;

    /**
     * Ecco il link al testo del prossimo capitolo.
     * Valore nullo se questo è l'ultimo capitolo della traduzione, oppure se il capitolo successivo non presenta annotazioni a livello di parola.
     */
    nextChapterWordsLink: string | null;

    /**
     * Il link al testo del capitolo precedente.
     * Valore nullo se si tratta del primo capitolo della traduzione o se il capitolo precedente non presenta annotazioni a livello di parola.
     */
    previousChapterWordsLink: string | null;

    /**
     * Il testo annotato per ogni versetto del capitolo, con indicazione del numero del versetto.
     * Ogni elenco segue l'ordine in cui le parole compaiono nel versetto.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * L'indice dell'elemento nell'array di contenuti del verso a cui si applica l'annotazione.
     */
    contentIndex: number;

    /**
     * L'indice del primo carattere della parola annotata nel testo dell'elemento di contenuto.
     */
    start: number;

    /**
     * L'indice che segue l'ultimo carattere della parola annotata nel testo dell'elemento di contenuto.
     * Ovvero, text.slice(start, end) è la parola annotata.
     */
    end: number;

    /**
     * Il/I numero/i di Strong per la parola.
     * Omesso se la traduzione forniva solo altre annotazioni per la parola.
     */
    strongs?: string[];

    /**
     * La forma del termine presente nel dizionario (citazione).
     * Omesso se la traduzione non lo prevedeva.
     */
    lemma?: string;

    /**
     * Il codice di analisi morfologica per la parola.
     * Omesso se la traduzione non lo prevedeva.
     */
    morph?: string;

    /**
     * Il puntatore alla parola nel testo sorgente, nel formato <sourceName> : <location> .
     * Omesso se la traduzione non lo prevedeva.
     */
    srcloc?: string;

    /**
     * Quale occorrenza della parola di origine è questa parola. 1-based.
     * Omesso se la traduzione non lo prevedeva.
     */
    occurrence?: number;

    /**
     * Il numero totale di volte in cui ricorre la parola di origine.
     * Omesso se la traduzione non lo prevedeva.
     */
    occurrences?: number;
}
```

### Esempio

Dato un capitolo il cui primo versetto contiene un solo elemento:

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

Il file delle parole annota i caratteri di quell'elemento:

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

Cioè, `"In the beginning...".slice(0, 2)` è `"In"` , che la fonte ha etichettato con `G1722` .

## Ottieni la traduzione completa

`GET https://bible.helloao.org/api/{translation}/complete.json`

Ottiene il contenuto di un'intera traduzione.

-   `translation` è l'ID della traduzione (es. `BSB` ).

### Esempio di codice

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Ottieni Genesi 1 dalla traduzione BSB
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

### Struttura

```typescript:no-line-numbers title="complete.ts"
/**
 * Definisce i dati completi per il download della traduzione.
 * Corrisponde all'endpoint /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * I metadati di traduzione.
     */
    translation: Translation;

    /**
     * L'elenco completo dei libri con tutti i loro capitoli.
     */
    books: TranslationCompleteBook[];
}

/**
 * Un libro nella sua traduzione completa da scaricare.
 */
export interface TranslationCompleteBook {
    /**
     * L'ID del libro.
     */
    id: string;

    /**
     * Il titolo del libro tratto dalla traduzione.
     */
    name: string;

    /**
     * Il nome comune del libro.
     */
    commonName: string;

    /**
     * Il titolo del libro.
     */
    title: string | null;

    /**
     * L'ordine del libro.
     */
    order: number;

    /**
     * Il numero di capitoli del libro.
     */
    numberOfChapters: number;

    /**
     * Il numero totale di versi presenti nel libro.
     */
    totalNumberOfVerses: number;

    /**
     * Se il libro sia apocrifo o meno.
     */
    isApocryphal?: boolean;

    /**
     * L'elenco completo dei capitoli con tutti i contenuti.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Un capitolo nella traduzione completa scaricabile.
 */
export interface TranslationCompleteChapter {
    /**
     * Il numero di versetti contenuti nel capitolo.
     */
    numberOfVerses: number;

    /**
     * I link alle diverse versioni audio del capitolo.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Le tempistiche audio (tempi di inizio per strofa, in secondi) per le diverse versioni audio del capitolo.
     *
     * A differenza del valore `thisChapterAudioTimings` presente nell'endpoint del singolo capitolo (che rimanda a "Ottieni i tempi audio per un capitolo" qui sotto), questo contiene i tempi stessi, poiché lo scopo del download della traduzione completa è quello di avere tutto in un unico file.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Il link alle annotazioni a livello di parola per il capitolo.
     * Omesso se il capitolo non presenta annotazioni a livello di singola parola.
     */
    thisChapterWordsLink?: string;

    /**
     * Le informazioni relative al capitolo.
     */
    chapter: ChapterData;
}

/**
 * La temporizzazione audio di un capitolo del libro, incorporata direttamente anziché tramite un link.
 * Associa l'ID di un lettore all'elenco degli istanti (in secondi) in cui inizia ciascun verso, nell'ordine dei versi.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Esempio

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
