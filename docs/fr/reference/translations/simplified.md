# Format simplifié

Le format simplifié est utilisé pour les chapitres, le téléchargement des traductions complètes et les annotations au niveau du mot. Consultez [la section Traductions, Livres et Chapitres](./README.md) pour accéder aux liens vers les traductions et la liste des livres, ou [le format standard](./standard.md) pour la présentation structurée originale de ce même contenu.

## Obtenez un chapitre simplifié à partir d'une traduction

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Obtient le contenu d'un seul chapitre d'un livre et d'une traduction donnés, en utilisant le format simplifié.

Dans ce format simplifié, le contenu de chaque verset est une simple chaîne de caractères au lieu d'une liste de texte formaté. Vous n'avez donc plus besoin de composer vous-même le texte d'un verset, une tâche parfois complexe, notamment en ce qui concerne l'espacement. Tout élément ne pouvant être représenté par une simple chaîne de caractères (notes de bas de page, paroles de Jésus, poèmes et titres en milieu de verset) est intégré à cette chaîne par un décalage, garantissant ainsi la conservation de toutes les informations.

Utilisez ce point de terminaison pour obtenir le texte d'un chapitre. Utilisez [le point de terminaison de chapitre standard](./standard.md#get-a-chapter-from-a-translation) pour afficher le chapitre en conservant sa mise en forme d'origine.

-   `translation` est l'ID de la traduction (ex `BSB` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse - vous pouvez trouver une liste des identifiants de livres [ici](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` correspond au chapitre numérique (par exemple `1` pour le premier chapitre).

Les chapitres qui comportent des annotations au niveau des mots y sont liés par `thisChapterWordsLink` , qui pointe vers [les annotations simplifiées](#get-the-words-of-a-chapter-in-the-simplified-format) - celles dont les décalages correspondent au texte de ce fichier.

Les chapitres qui ont des minutages audio par lecteur y sont liés avec `thisChapterAudioTimings` , qui pointe vers [le point de terminaison des minutages audio](./standard.md#get-the-audio-timings-for-a-chapter) - le même fichier vers lequel le point de terminaison de chapitre régulier se connecte, puisque les minutages ne dépendent pas du format du chapitre.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenez le texte de Genèse 1 à partir de la traduction BSB
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

### Décalages

Les décalages, sous forme simplifiée ( `offset` , `start` et `end` ), correspondent à des indices dans le verset `text` qui les contient. Ils sont exprimés en unités de code UTF-16, le même format que celui utilisé par JavaScript (codes `String.prototype.length` et `String.prototype.slice()` .

`start` est inclusif et `end` est exclu ; ainsi, `text.slice(start, end)` renvoie exactement la plage de texte marquée. Les décalages des notes de bas de page correspondent à la position de l’élément qui les appelle ; `text.slice(0, offset)` représente donc le texte qui le précède.

### Structure

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
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
     * Voici le lien vers la version normale (non simplifiée) de ce chapitre.
     */
    fullChapterApiLink: string;

    /**
     * Les liens vers les différentes versions audio du chapitre.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Les liens vers les minutages audio des différentes versions audio du chapitre.
     * Consultez la section « Obtenir les minutages audio d'un chapitre » dans la documentation relative au format standard ; le fichier de minutage est identique quel que soit le format de chapitre auquel il est lié.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Le lien vers le chapitre suivant, en format simplifié.
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
     * Le lien vers le chapitre précédent, en format simplifié.
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
     * Le nombre de versets que contient le chapitre.
     */
    numberOfVerses: number;

    /**
     * Informations relatives à ce chapitre.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Le numéro du chapitre.
     */
    number: number;

    /**
     * Le contenu du chapitre.
     */
    content: SimpleChapterContent[];

    /**
     * Liste des notes de bas de page qui n'ont pu être associées à aucun verset.
     * Les notes de bas de page relatives à un verset sont incluses dans le verset lui-même, cette liste est donc généralement vide.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Un type union qui représente un seul élément de contenu dans un chapitre simplifié.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Un titre de chapitre.
 */
interface SimpleChapterHeading {
    /**
     * Indique que le contenu représente un titre.
     */
    type: 'heading';

    /**
     * Le texte de l'en-tête.
     */
    text: string;
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
 * Un verset dans un chapitre.
 */
interface SimpleChapterVerse {
    /**
     * Indique que le contenu est un verset.
     */
    type: 'verse';

    /**
     * Le numéro du verset.
     */
    number: number;

    /**
     * Le texte du verset.
     * Les vers de poésie et les sauts de ligne sont séparés par des caractères de nouvelle ligne (\n).
     */
    text: string;

    /**
     * Les notes de bas de page qui apparaissent dans le verset.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Les titres qui apparaissent au milieu du verset.
     * Omis si le verset ne contient aucun titre en ligne.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Les passages du texte des versets qui représentent les paroles de Jésus.
     * Omis si le verset n'en contient aucun.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Les sections du texte en vers qui représentent les lignes de poésie.
     * Omis si le verset n'en contient aucun.
     */
    poem?: SimplePoemRange[];
}

/**
 * Un sous-titre hébreu dans un chapitre.
 * Ces éléments sont souvent inclus à titre de contenu informatif figurant dans les manuscrits originaux.
 * Par exemple, le Psaume 49 porte le sous-titre hébreu « Au chef de chœur. Psaume des fils de Coré. »
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Indique que le contenu représente un sous-titre en hébreu.
     */
    type: 'hebrew_subtitle';
}

/**
 * Une note de bas de page dans un verset.
 */
interface SimpleVerseFootnote {
    /**
     * L'identifiant du billet.
     */
    noteId: number;

    /**
     * L'index dans le texte du verset où doit être insérée la note de bas de page.
     */
    offset: number;

    /**
     * Le texte de la note de bas de page.
     */
    text: string;

    /**
     * L'appelant à utiliser pour la note de bas de page.
     * Si "+", alors l'appelant doit être généré automatiquement.
     * Si la valeur est nulle, l'appelant doit être vide.
     * Si c'est une chaîne de caractères, alors l'appelant doit être cette chaîne.
     */
    caller: '+' | string | null;
}

/**
 * Un titre intégré à un verset.
 */
interface SimpleInlineHeading {
    /**
     * L'indice dans le texte du verset où apparaît le titre.
     */
    offset: number;

    /**
     * Le texte de l'en-tête.
     */
    text: string;
}

/**
 * Un ensemble de texte à l'intérieur d'un verset.
 */
interface SimpleTextRange {
    /**
     * L'indice du premier caractère de la plage.
     */
    start: number;

    /**
     * L'indice suivant le dernier caractère de la plage.
     */
    end: number;
}

/**
 * Un ensemble de texte à l'intérieur d'un vers qui représente un vers de poésie.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Le niveau d'indentation avec lequel le vers de poésie doit être affiché.
     */
    level: number;
}
```

### Exemple

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

Les poèmes et les paroles de Jésus sont présentés sous forme d'intervalles au-dessus du texte des versets. Par exemple, le chiffre `Matthew 5:3` dans la traduction `engwebp` se présente ainsi :

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

## Obtenez le texte d'un chapitre au format simplifié

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Obtient les annotations au niveau des mots pour un seul chapitre, avec leurs décalages réattribués au texte de chaque [verset simplifié](#get-a-simplified-chapter-from-a-translation) .

Les décalages dans [les annotations classiques](./standard.md#get-the-words-of-a-chapter) sont liés aux éléments du tableau `content` d'un verset, que le format simplifié remplace par une simple chaîne de caractères ; ils sont donc inutilisables avec ce dernier. Utilisez plutôt ce fichier lorsque vous travaillez avec les chapitres simplifiés.

-   `translation` est l'ID de la traduction (ex `BSB` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse - vous pouvez trouver une liste des identifiants de livres [ici](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` correspond au chapitre numérique (par exemple `1` pour le premier chapitre).

Ces entrées n'ont pas `contentIndex` `start` et `end` sont des décalages dans le `text` du verset, exactement comme les décalages de la note de bas de page, du poème et des Paroles de Jésus dans les chapitres simplifiés, donc `text.slice(start, end)` est le mot annoté.

Comme pour les annotations classiques, seules certaines traductions en contiennent. Un chapitre simplifié qui en possède renvoie à ce fichier avec un `thisChapterWordsLink` ; si cette propriété est absente, ce fichier n’existe pas pour ce chapitre.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Obtenez le texte de la Genèse 1 et les mots qui y sont annotés.
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

### Structure

La structure correspond [aux annotations régulières](./standard.md#get-the-words-of-a-chapter) , sauf que les liens pointent vers les fichiers simplifiés et que les entrées n'ont pas `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
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
     * Le lien vers le chapitre simplifié auquel ces annotations se rapportent.
     */
    thisChapterLink: string;

    /**
     * Le lien vers le chapitre simplifié suivant.
     * Nul si c'est le dernier chapitre de la traduction.
     */
    nextChapterLink: string | null;

    /**
     * Le lien vers le chapitre simplifié précédent.
     * Nul si c'est le premier chapitre de la traduction.
     */
    previousChapterLink: string | null;

    /**
     * Le lien vers ces annotations.
     */
    thisChapterWordsLink: string;

    /**
     * Le lien vers les annotations du chapitre suivant.
     * Nul si c'est le dernier chapitre de la traduction, ou si le chapitre suivant ne comporte aucune annotation au niveau des mots.
     */
    nextChapterWordsLink: string | null;

    /**
     * Le lien vers les annotations du chapitre précédent.
     * Nul si c'est le premier chapitre de la traduction, ou si le chapitre précédent ne comporte aucune annotation au niveau des mots.
     */
    previousChapterWordsLink: string | null;

    /**
     * Les mots annotés pour chaque verset du chapitre, classés par numéro de verset.
     * Chaque liste suit l'ordre d'apparition des mots dans le verset.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Une annotation au niveau du mot dans un chapitre simplifié.
 */
export interface SimpleChapterWord {
    /**
     * L'indice du premier caractère du mot annoté dans le texte du verset.
     */
    start: number;

    /**
     * L'indice suivant le dernier caractère du mot annoté dans le texte du verset.
     */
    end: number;

    /**
     * Les chiffres Strong pour ce mot.
     */
    strongs?: string[];

    /**
     * Le lemme (forme de dictionnaire) du mot dans la langue source.
     */
    lemma?: string;

    /**
     * La morphologie du mot dans la langue source.
     */
    morph?: string;

    /**
     * L'emplacement du mot dans le texte source.
     */
    srcloc?: string;

    /**
     * De quelle occurrence du mot s'agit-il dans le verset ?
     */
    occurrence?: number;

    /**
     * Le nombre de fois où le mot apparaît dans le verset.
     */
    occurrences?: number;
}
```

### Exemple

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

Le verset 1 de ce chapitre contient le texte `"In the beginning was the Word, and the Word was with God, and the Word was God."` , donc `text.slice(7, 16)` est `"beginning"` .

## Obtenez une traduction complète au format simplifié

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Permet d'obtenir le contenu d'une traduction complète au format simplifié. Il s'agit du [format simplifié par chapitre](#get-a-simplified-chapter-from-a-translation) appliqué au [téléchargement de la traduction complète](./standard.md#get-an-entire-translation) : un seul fichier contenant l'intégralité de la traduction, où le contenu de chaque verset est une simple chaîne de caractères.

Utilisez cette option lorsque vous souhaitez obtenir le texte d'une traduction complète sans avoir à faire une demande par chapitre et sans avoir à construire le texte vous-même.

-   `translation` est l'ID de la traduction (ex `BSB` ).

Ce fichier est généré en parallèle avec un fichier `complete.json` ; une traduction peut donc contenir les deux ou aucun des deux. L’objet `translation` présent dans les deux fichiers contient un `completeTranslationApiLink` et un `simpleCompleteTranslationApiLink` , ce qui permet de passer d’un format à l’autre.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Obtenez le texte intégral de la traduction BSB
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

### Structure

La structure correspond à [celle du téléchargement de la traduction complète habituelle](./standard.md#get-an-entire-translation) , à ceci près que chaque chapitre utilise le format simplifié.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Définit les données complètes de téléchargement de la traduction, en utilisant le format de chapitre simplifié.
 * Correspond au point de terminaison /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Les métadonnées de traduction.
     */
    translation: Translation;

    /**
     * La liste complète des livres avec tous leurs chapitres.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Un livre en téléchargement avec traduction intégrale, utilisant le format de chapitres simplifiés.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * La liste complète des chapitres avec leur contenu.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Un chapitre du téléchargement de la traduction complète, utilisant le format de chapitre simplifié.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Le nombre de versets que contient le chapitre.
     */
    numberOfVerses: number;

    /**
     * Les liens vers les différentes versions audio du chapitre.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Les minutages audio (heures de début par verset, en secondes) pour le chapitre.
     *
     * Notez que les fichiers de traduction complets contiennent les minutages eux-mêmes (voir TranslationBookChapterAudioTimingsMap dans la documentation du format standard), contrairement aux points de fin de chapitre individuels, qui contiennent des liens vers ceux-ci.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Lien vers les annotations lexicales du chapitre, au format simplifié. Omis si le chapitre ne comporte aucune annotation lexicale.
     */
    thisChapterWordsLink?: string;

    /**
     * Informations simplifiées pour ce chapitre.
     */
    chapter: SimpleChapterData;
}
```

### Exemple

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
