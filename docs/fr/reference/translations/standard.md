# Format standard

Le format standard est utilisé pour les chapitres, les téléchargements de traductions complètes et les annotations au niveau du mot. Consultez [la section Traductions, Livres et Chapitres](./README.md) pour accéder aux liens vers les traductions et la liste des livres, ou [le format simplifié](./simplified.md) pour une autre présentation de ce contenu.

## Obtenir un chapitre à partir d'une traduction

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Obtient le contenu d'un seul chapitre pour un livre et une traduction donnés.

-   `translation` est l'ID de la traduction (ex `BSB` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse - vous pouvez trouver une liste des identifiants de livres [ici](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` correspond au chapitre numérique (par exemple `1` pour le premier chapitre).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenez Genèse 1 à partir de la traduction BSB
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

### Structure

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
    /**
     * Informations relatives à la traduction du chapitre du livre.
     */
    translation: Translation;

    /**
     * Informations relatives au chapitre du livre.
     */
    book: TranslationBook;

    /**
     * Le lien vers le chapitre actuel.
     */
    thisChapterLink: string;

    /**
     * Les liens vers les différentes versions audio du chapitre.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Les liens vers les minutages audio des différentes versions audio du chapitre.
     * Chaque lien renvoie au fichier de minutage audio correspondant au lecteur ; voir « Obtenir le minutage audio d’un chapitre » ci-dessous.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Le lien vers le chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterApiLink: string | null;

    /**
     * Voici les liens vers les différentes versions audio du chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Voici les liens vers les minutages audio des différentes versions audio du chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Le lien vers le chapitre précédent.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterApiLink: string | null;

    /**
     * Les liens vers les différentes versions audio du chapitre précédent.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Voici les liens vers les minutages audio des différentes versions audio du chapitre précédent.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Le lien vers les annotations au niveau du mot pour ce chapitre.
     * Omis si le chapitre ne comporte aucune annotation au niveau du mot.
     */
    thisChapterWordsLink?: string;

    /**
     * Le lien vers les annotations au niveau du mot pour le chapitre suivant.
     * Omis si c'est le dernier chapitre de la traduction, ou si le chapitre suivant ne comporte aucune annotation au niveau du mot.
     */
    nextChapterWordsLink?: string;

    /**
     * Le lien vers les annotations au niveau des mots pour le chapitre précédent.
     * Omis si c'est le premier chapitre de la traduction, ou si le chapitre précédent ne comporte aucune annotation au niveau du mot.
     */
    previousChapterWordsLink?: string;

    /**
     * Le nombre de versets que contient le chapitre.
     */
    numberOfVerses: number;

    /**
     * Voici le lien vers la version simplifiée de ce chapitre.
     * Omis si les chapitres simplifiés ne sont pas disponibles.
     */
    simpleChapterApiLink?: string;

    /**
     * Informations relatives à ce chapitre.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Le numéro du chapitre.
     */
    number: number;

    /**
     * Le contenu du chapitre.
     */
    content: ChapterContent[];

    /**
     * Liste des notes de bas de page du chapitre.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Un type union qui représente un seul élément de contenu de chapitre.
 * Un élément du contenu d'un chapitre peut être l'un des éléments suivants :
 * - Un titre.
 * - Un saut de ligne.
 * - Un verset.
 * - Un sous-titre en hébreu.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Un titre de chapitre.
 */
interface ChapterHeading {
    /**
     * Indique que le contenu représente un titre.
     */
    type: 'heading';

    /**
     * Le contenu de l'en-tête.
     * Si plusieurs chaînes de caractères sont incluses dans le tableau, elles doivent être concaténées avec un espace.
     */
    content: string[];
}

/**
 * Un saut de ligne dans un chapitre.
 */
interface ChapterLineBreak {
    /**
     * Indique que le contenu représente un saut de ligne.
     */
    type: 'line_break';
}

/**
 * Un sous-titre hébreu dans un chapitre.
 * Ces éléments sont souvent utilisés comme contenu informatif figurant dans les manuscrits originaux.
 * Par exemple, le Psaume 49 porte le sous-titre hébreu « Au chef de chœur. Psaume des fils de Coré. »
 */
interface ChapterHebrewSubtitle {
    /**
     * Indique que le contenu représente un sous-titre en hébreu.
     */
    type: 'hebrew_subtitle';

    /**
     * Liste du contenu figurant dans le sous-titre.
     * Chaque élément de la liste peut être une chaîne de caractères, un texte formaté ou une référence de note de bas de page.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Un verset dans un chapitre.
 */
interface ChapterVerse {
    /**
     * Indique que le contenu est un verset.
     */
    type: 'verse';

    /**
     * Le numéro du verset.
     */
    number: number;

    /**
     * Liste des éléments du verset.
     * Chaque élément de la liste peut être une chaîne de caractères, un texte formaté ou une référence de note de bas de page.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Texte formaté. C'est-à-dire un texte mis en forme d'une manière particulière.
 */
interface FormattedText {
    /**
     * Le texte formaté.
     */
    text: string;

    /**
     * Si le texte représente un poème.
     * Le chiffre indique le niveau de retrait.
     *
     * Fréquent dans les Psaumes.
     */
    poem?: number;

    /**
     * Si le texte représente les paroles de Jésus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Définit une interface qui représente un titre intégré dans un verset.
 */
interface InlineHeading {
    /**
     * Le texte de l'en-tête.
     */
    heading: string;
}

/**
 * Définit une interface qui représente un saut de ligne intégré dans un verset.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Une référence en note de bas de page dans un verset ou un sous-titre hébreu.
 */
interface VerseFootnoteReference {
    /**
     * L'identifiant du billet.
     */
    noteId: number;
}

/**
 * Information concernant une note de bas de page.
 */
interface ChapterFootnote {
    /**
     * L'identifiant de la note référencée.
     */
    noteId: number;

    /**
     * Le texte de la note de bas de page.
     */
    text: string;

    /**
     * Référence du verset pour la note de bas de page.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * L'appelant à utiliser pour la note de bas de page.
     * Pour les notes de bas de page, le « personnage référent » est celui utilisé dans le texte pour faire référence à la note.
     *
     * Par exemple, dans le texte :
     * Bonjour (a) Monde
     *
     * ---- (a) Ceci est une note de bas de page.
     *
     * Le « (a) » désigne l'appelant.
     *
     * Si "+", alors l'appelant doit être généré automatiquement.
     * Si la valeur est nulle, l'appelant doit être vide.
     * Si c'est une chaîne de caractères, alors l'appelant doit être cette chaîne.
     */
    caller: '+' | string | null;
}

/**
 * Les liens audio pour un chapitre de livre.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Le texte du chapitre et le lien URL vers le fichier audio.
     */
    [reader: string]: string;
}

/**
 * Liens vers les minutages audio d'un chapitre de livre.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Le lecteur du chapitre et le lien API vers le fichier de minutage audio correspondant.
     */
    [reader: string]: string;
}
```

### Exemple

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

## Obtenez le minutage audio d'un chapitre

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Permet d'obtenir le minutage audio de chaque verset d'un chapitre, pour la narration d'un seul lecteur : le moment (en secondes, par rapport au début du fichier audio de ce lecteur) où commence chaque verset. Les clients peuvent utiliser cette information pour mettre en évidence le verset en cours de lecture.

Seules certaines traductions et certains lecteurs disposent d'un minutage audio. Un chapitre qui en possède un pour un lecteur donné est lié à ce fichier par une entrée dans `thisChapterAudioTimings` , indexée par l'identifiant de ce lecteur ; si un lecteur ne figure pas dans cette table de correspondance, ce fichier n'existe pas pour ce lecteur et ce chapitre.

-   `translation` est l'ID de la traduction (ex `BSB` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse - vous pouvez trouver une liste des identifiants de livres [ici](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` correspond au chapitre numérique (par exemple `1` pour le premier chapitre).
-   `reader` est l'ID du lecteur dont la narration est destinée aux minutages (ex `hays` ) - les lecteurs disponibles pour un chapitre sont les clés de son `thisChapterAudioLinks` .

La fin d'un verset correspond au début du verset suivant (ou, pour le dernier verset, à la fin du fichier audio), de sorte qu'un client n'a besoin de rien d'autre que la liste ordonnée des heures de début pour créer des plages de surbrillance pour l'ensemble du chapitre.

Ce fichier est identique, qu'il soit accessible depuis le point de terminaison de chapitre normal ou [le point de terminaison simplifié](./simplified.md#get-a-simplified-chapter-from-a-translation) : il n'y a qu'un seul ensemble de minutages par traduction, livre, chapitre et lecteur.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Obtenez les minutages audio de Genesis 1 (BSB), tels que lus par « hays ».
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

### Structure

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Définit la durée audio d'un chapitre de livre, pour un seul lecteur.
 * Correspond au point de terminaison /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
    /**
     * L'identifiant de la traduction.
     */
    translationId: string;

    /**
     * L'identifiant du livre.
     */
    bookId: string;

    /**
     * Le numéro du chapitre.
     */
    chapterNumber: number;

    /**
     * L'identifiant du lecteur auquel ces durées sont destinées.
     */
    reader: string;

    /**
     * Le lien vers le fichier audio auquel ces minutages se rapportent.
     */
    audioLink: string;

    /**
     * Le lien vers les informations de ce chapitre.
     */
    thisChapterLink: string;

    /**
     * Le lien vers les informations du chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterLink: string | null;

    /**
     * Le lien vers les informations du chapitre précédent.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterLink: string | null;

    /**
     * Voici le lien vers ce fichier de minutage audio.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Le lien vers le calendrier du chapitre suivant, pour le même lecteur.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Le lien vers le minutage du chapitre précédent, pour le même lecteur.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Les instants en secondes auxquels chaque couplet commence, dans l'ordre.
     * Le premier nombre (indice 0) correspond au moment de l'enregistrement où commence le premier couplet.
     */
    verses: number[];
}
```

### Exemple

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

`verses[0]` est le temps de début du verset 1, `verses[1]` est le temps de début du verset 2, et ainsi de suite - donc dans cet exemple, le verset 2 de la Genèse 1 (BSB, tel que lu par "hays") commence 4,32 secondes après le début `audioLink` .

## Obtenez les mots d'un chapitre

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Obtient les annotations au niveau des mots (numéros de Strong et données sources associées) pour un seul chapitre.

Seules certaines traductions contiennent des annotations au niveau du mot. Un chapitre qui en contient est lié à ce fichier avec `thisChapterWordsLink` ; si cette propriété est absente, ce fichier n’existe pas pour ce chapitre.

-   `translation` est l'ID de la traduction (ex `BSB` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse - vous pouvez trouver une liste des identifiants de livres [ici](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` correspond au chapitre numérique (par exemple `1` pour le premier chapitre).

Chaque annotation est liée à une plage de caractères dans un élément du tableau `content` d'un verset : `contentIndex` correspond à l'indice de l'élément, et `start` et `end` représentent les décalages de caractères dans le texte de cet élément. `end` est exclusif, donc `text.slice(start, end)` correspond au mot annoté.

L'ancrage à un élément de contenu (au lieu du verset dans son ensemble) garantit que les décalages restent corrects pour les versets dont le contenu est divisé en plusieurs éléments, tels que les vers d'un poème, les paroles de Jésus et les références en notes de bas de page.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Trouvez les paroles de Genèse 1 dans la traduction BSB
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

### Structure

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
    /**
     * L'identifiant de la traduction.
     */
    translationId: string;

    /**
     * L'identifiant du livre.
     */
    bookId: string;

    /**
     * Le numéro du chapitre.
     */
    chapterNumber: number;

    /**
     * Le lien vers les informations de ce chapitre.
     */
    thisChapterLink: string;

    /**
     * Le lien vers les informations du chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterLink: string | null;

    /**
     * Le lien vers les informations du chapitre précédent.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterLink: string | null;

    /**
     * Le lien vers ce fichier Word.
     */
    thisChapterWordsLink: string;

    /**
     * Le lien vers le texte du chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction, ou si le chapitre suivant ne comporte aucune annotation au niveau des mots.
     */
    nextChapterWordsLink: string | null;

    /**
     * Le lien vers les mots du chapitre précédent.
     * Nul s'il s'agit du premier chapitre de la traduction, ou si le chapitre précédent ne comporte aucune annotation au niveau des mots.
     */
    previousChapterWordsLink: string | null;

    /**
     * Les mots annotés pour chaque verset du chapitre, classés par numéro de verset.
     * Chaque liste suit l'ordre d'apparition des mots dans le verset.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * L'index de l'élément dans le tableau de contenu du verset auquel l'annotation s'applique.
     */
    contentIndex: number;

    /**
     * L'indice du premier caractère du mot annoté dans le texte de l'élément de contenu.
     */
    start: number;

    /**
     * L'index suivant le dernier caractère du mot annoté dans le texte de l'élément de contenu.
     * Autrement dit, text.slice(start, end) est le mot annoté.
     */
    end: number;

    /**
     * Le ou les numéros Strong pour le mot.
     * Omis si la traduction ne fournissait que d'autres annotations pour le mot.
     */
    strongs?: string[];

    /**
     * La forme du mot telle qu'elle apparaît dans le dictionnaire (citation).
     * Omis si la traduction n'en comportait pas.
     */
    lemma?: string;

    /**
     * Le code d'analyse morphologique du mot.
     * Omis si la traduction n'en comportait pas.
     */
    morph?: string;

    /**
     * Le pointeur vers le mot dans le texte source, au format <sourceName> : <location> .
     * Omis si la traduction n'en comportait pas.
     */
    srcloc?: string;

    /**
     * À quelle occurrence du mot source ce mot appartient-il ? 1-basé.
     * Omis si la traduction n'en comportait pas.
     */
    occurrence?: number;

    /**
     * Le nombre total de fois où le mot source apparaît.
     * Omis si la traduction n'en comportait pas.
     */
    occurrences?: number;
}
```

### Exemple

Étant donné un chapitre dont le premier verset ne contient qu'un seul élément :

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

Le fichier de mots annote les caractères de cet élément :

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

C’est-à-dire que `"In the beginning...".slice(0, 2)` est `"In"` , alors que la source l’a étiqueté avec `G1722` .

## Obtenez une traduction complète

`GET https://bible.helloao.org/api/{translation}/complete.json`

Obtient le contenu d'une traduction complète.

-   `translation` est l'ID de la traduction (ex `BSB` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Obtenez Genèse 1 à partir de la traduction BSB
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

### Structure

```typescript:no-line-numbers title="complete.ts"
/**
 * Définit les données complètes de téléchargement de la traduction.
 * Correspond au point de terminaison /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Les métadonnées de traduction.
     */
    translation: Translation;

    /**
     * La liste complète des livres avec tous leurs chapitres.
     */
    books: TranslationCompleteBook[];
}

/**
 * Un livre en traduction intégrale à télécharger.
 */
export interface TranslationCompleteBook {
    /**
     * L'identifiant du livre.
     */
    id: string;

    /**
     * Le titre du livre d'après la traduction.
     */
    name: string;

    /**
     * Le nom commun du livre.
     */
    commonName: string;

    /**
     * Le titre du livre.
     */
    title: string | null;

    /**
     * L'ordre du livre.
     */
    order: number;

    /**
     * Le nombre de chapitres du livre.
     */
    numberOfChapters: number;

    /**
     * Le nombre total de versets dans le livre.
     */
    totalNumberOfVerses: number;

    /**
     * Que le livre soit apocryphe.
     */
    isApocryphal?: boolean;

    /**
     * La liste complète des chapitres avec leur contenu.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Un chapitre du téléchargement de la traduction complète.
 */
export interface TranslationCompleteChapter {
    /**
     * Le nombre de versets que contient le chapitre.
     */
    numberOfVerses: number;

    /**
     * Les liens vers les différentes versions audio du chapitre.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Les minutages audio (heures de début par verset, en secondes) pour les différentes versions audio du chapitre.
     *
     * Contrairement à `thisChapterAudioTimings` sur le point de terminaison de chaque chapitre (qui renvoie à « Obtenir les minutages audio d'un chapitre » ci-dessous), celui-ci contient les minutages eux-mêmes, puisque l'objectif du téléchargement de la traduction complète est de tout avoir dans un seul fichier.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Le lien vers les annotations au niveau du mot pour ce chapitre.
     * Omis si le chapitre ne comporte aucune annotation au niveau du mot.
     */
    thisChapterWordsLink?: string;

    /**
     * Informations relatives à ce chapitre.
     */
    chapter: ChapterData;
}

/**
 * Les minutages audio d'un chapitre de livre, intégrés directement plutôt que liés.
 * Associe un identifiant de lecteur à la liste des heures (en secondes) auxquelles chaque verset commence, dans l'ordre des versets.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Exemple

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
