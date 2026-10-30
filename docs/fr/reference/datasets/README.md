# Ensembles de données

Points d'accès pour parcourir des ensembles de données bibliques supplémentaires - tels que les références croisées, les entités bibliques (personnes, lieux, événements et groupes de personnes), les mots interlinéaires de la langue originale, les lexiques et les candidats au verset du jour - et récupérer leurs livres, le contenu des chapitres, les entités, les entrées de lexique et les catégories de versets.

## Ensembles de données disponibles

`GET https://bible.helloao.org/api/available_datasets.json`

Obtient la liste des jeux de données bibliques disponibles dans l'API.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-datasets.js"
fetch(`https://bible.helloao.org/api/available_datasets.json`)
    .then(request => request.json())
    .then(availableDatasets => {
        console.log('The API has the following datasets:', availableDatasets);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_datasets.json
```

:::

### Structure

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * La liste des ensembles de données.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * L'identifiant du jeu de données.
     */
    id: string;

    /**
     * Le nom de l'ensemble de données.
     */
    name: string;

    /**
     * Le site web contenant l'ensemble de données.
     */
    website: string;

    /**
     * L'URL où se trouve la licence du jeu de données.
     */
    licenseUrl: string;

    /**
     * Notes ajoutées par l'API pour la licence.
     * Valeur nulle ou indéfinie s'il n'y a pas de notes.
     */
    licenseNotes?: string | null;

    /**
     * Le nom anglais de l'ensemble de données.
     */
    englishName: string;

    /**
     * L'étiquette de langue à 3 lettres ISO 639 dans laquelle se trouve principalement l'ensemble de données.
     */
    language: string;

    /**
     * Le sens dans lequel la langue est écrite.
     * « ltr » indique que le texte est écrit de gauche à droite sur la page.
     * « rtl » indique que le texte est écrit de la droite vers la gauche.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Lien API vers la liste des livres disponibles pour cet ensemble de données.
     */
    listOfBooksApiLink: string;

    /**
     * Liste des formats disponibles.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Le nombre de livres contenus dans cet ensemble de données.
     */
    numberOfBooks: number;

    /**
     * Le nombre total de chapitres contenus dans cet ensemble de données.
     */
    totalNumberOfChapters: number;

    /**
     * Le nombre total de versets contenus dans cet ensemble de données.
     */
    totalNumberOfVerses: number;

    /**
     * Le nombre total de références croisées contenues dans cet ensemble de données.
     * 0 pour les ensembles de données qui ne contiennent pas de références croisées.
     */
    totalNumberOfReferences: number;

    /**
     * Le nombre total de mots interlinéaires contenus dans cet ensemble de données.
     * Omis si l'ensemble de données ne contient pas de mots interlinéaires.
     */
    totalNumberOfWords?: number;

    /**
     * Obtient le nom de la langue dans laquelle se trouve l'ensemble de données.
     * Valeur nulle ou indéfinie si le nom de la langue est inconnu.
     */
    languageName?: string;

    /**
     * Obtient le nom de la langue en anglais.
     * Valeur nulle ou indéfinie si la langue n'a pas de nom en anglais.
     */
    languageEnglishName?: string;

    /**
     * Les liens API pour les listes d'entités dans l'ensemble de données.
     * Omis si l'ensemble de données ne contient pas les entités correspondantes.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Le nombre total d'entités contenues dans l'ensemble de données.
     * Omis si l'ensemble de données ne contient pas les entités correspondantes.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * Lien API pour la liste des entrées du lexique dans l'ensemble de données.
     * Omis si l'ensemble de données ne contient pas d'entrées de lexique.
     */
    listOfLexiconApiLink?: string;

    /**
     * Le nombre total d'entrées lexicales contenues dans l'ensemble de données.
     * Omis si l'ensemble de données ne contient pas d'entrées de lexique.
     */
    totalNumberOfLexicon?: number;

    /**
     * Lien API pour la liste de tous les versets du jeu de données, avec leurs catégories.
     * Omis si les versets de l'ensemble de données ne comportent pas de catégories.
     */
    listOfVersesApiLink?: string;

    /**
     * Lien API pour la liste des catégories de versets dans l'ensemble de données.
     * Omis si l'ensemble de données ne contient pas de catégories de versets.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Le nombre total de catégories de versets contenues dans l'ensemble de données.
     * Omis si l'ensemble de données ne contient pas de catégories de versets.
     */
    totalNumberOfCategories?: number;
}
```

### Exemple

```json:no-line-numbers title="/api/available_datasets.json"
{
    "datasets": [
        {
            "id": "open-cross-ref",
            "name": "Bible Cross References",
            "website": "https://www.openbible.info/labs/cross-references/",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Bible Cross References",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 29364,
            "totalNumberOfReferences": 344799,
            "languageName": "English",
            "languageEnglishName": "English"
        },
        {
            "id": "theographic",
            "name": "Theographic Bible Metadata",
            "website": "https://github.com/robertrouse/theographic-bible-metadata",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
            "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Theographic Bible Metadata",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/theographic/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1182,
            "totalNumberOfVerses": 24547,
            "totalNumberOfReferences": 53120,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfPeopleApiLink": "/api/d/theographic/people.json",
            "totalNumberOfPeople": 3067,
            "listOfPlacesApiLink": "/api/d/theographic/places.json",
            "totalNumberOfPlaces": 1274,
            "listOfEventsApiLink": "/api/d/theographic/events.json",
            "totalNumberOfEvents": 450,
            "listOfPeopleGroupsApiLink": "/api/d/theographic/groups.json",
            "totalNumberOfPeopleGroups": 23
        },
        {
            "id": "bsb-interlinear",
            "name": "Berean Standard Bible Interlinear",
            "website": "https://bereanbible.com/",
            "licenseUrl": "https://berean.bible/terms.htm",
            "licenseNotes": "The Berean Standard Bible and its interlinear tables are in the public domain. Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "Berean Standard Bible Interlinear",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/bsb-interlinear/books.json",
            "numberOfBooks": 66,
            "totalNumberOfChapters": 1189,
            "totalNumberOfVerses": 31102,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "totalNumberOfWords": 443625
        },
        {
            "id": "stepbible-lexicon",
            "name": "STEPBible Brief Lexicons",
            "website": "https://github.com/STEPBible/STEPBible-Data",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "The Translators Brief lexicons of Extended Strongs (TBESH and TBESG) are by STEPBible.org / Tyndale House, Cambridge, and are licensed under CC BY 4.0. Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "STEPBible Brief Lexicons",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/stepbible-lexicon/books.json",
            "numberOfBooks": 0,
            "totalNumberOfChapters": 0,
            "totalNumberOfVerses": 0,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfLexiconApiLink": "/api/d/stepbible-lexicon/lexicon.json",
            "totalNumberOfLexicon": 18085
        },
        {
            "id": "history-globe",
            "name": "History Globe",
            "website": "https://historyglobe.app",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
            "licenseNotes": "History Globe by Vadym Arnaut (https://historyglobe.app) is licensed under CC BY 4.0. Its places, verse tags, and coordinates start from the OpenBible.info Bible Geocoding Data (CC BY 4.0), with corrections, and some coordinates are from Wikidata (CC0). Changes were made to the data to fit the Free Use Bible API format.",
            "englishName": "History Globe",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/history-globe/books.json",
            "numberOfBooks": 61,
            "totalNumberOfChapters": 849,
            "totalNumberOfVerses": 5546,
            "totalNumberOfReferences": 8617,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfPlacesApiLink": "/api/d/history-globe/places.json",
            "totalNumberOfPlaces": 1231
        },
        {
            "id": "verse-of-the-day",
            "name": "Verse of the Day",
            "website": "https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts",
            "licenseUrl": "https://github.com/HelloAOLab/bible-api/blob/main/LICENSE",
            "licenseNotes": "A curated list of well-known verses by AO Lab, released under the MIT License.",
            "englishName": "Verse of the Day",
            "language": "eng",
            "textDirection": "ltr",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/d/verse-of-the-day/books.json",
            "numberOfBooks": 65,
            "totalNumberOfChapters": 381,
            "totalNumberOfVerses": 750,
            "totalNumberOfReferences": 0,
            "languageName": "English",
            "languageEnglishName": "English",
            "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json",
            "listOfCategoriesApiLink": "/api/d/verse-of-the-day/categories.json",
            "totalNumberOfCategories": 31
        }
    ]
}
```

## Lister les livres d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Obtient la liste des livres disponibles pour l'ensemble de données donné.

-   `dataset` l'ID de l'ensemble de données (ex `open-cross-ref` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Obtenez la liste des livres pour l'ensemble de données open-cross-ref
fetch(`https://bible.helloao.org/api/d/${dataset}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The open-cross-ref dataset has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/books.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Informations sur les données relatives aux livres.
     */
    dataset: Dataset;

    /**
     * Liste des livres disponibles pour l'ensemble de données.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * L'identifiant du livre.
     * Correspond à l'identifiant du livre correspondant dans la Bible (GENÈVE, EXO, etc.).
     */
    id: string;

    /**
     * L'ordre des livres dans la Bible.
     */
    order: number;

    /**
     * Le numéro du premier chapitre du livre.
     */
    firstChapterNumber: number;

    /**
     * Le lien vers le premier chapitre du livre.
     */
    firstChapterApiLink: string | null;

    /**
     * Le numéro du dernier chapitre du livre.
     */
    lastChapterNumber: number | null;

    /**
     * Le lien vers le dernier chapitre du livre.
     */
    lastChapterApiLink: string | null;

    /**
     * Le nombre de chapitres que contient le livre.
     */
    numberOfChapters: number;

    /**
     * Le nombre de versets que contient le livre.
     */
    totalNumberOfVerses: number;

    /**
     * Le nombre total de références croisées que contient ce livre.
     */
    totalNumberOfReferences: number;
}
```

### Exemple

```json:no-line-numbers title="/api/d/open-cross-ref/books.json"
{
    "dataset": {
        "id": "open-cross-ref",
        "name": "Bible Cross References",
        "website": "https://www.openbible.info/labs/cross-references/",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
        "englishName": "Bible Cross References",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 29364,
        "totalNumberOfReferences": 344799,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "datasetId": "open-cross-ref",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/d/open-cross-ref/GEN/1.json",
            "lastChapterNumber": 50,
            "lastChapterApiLink": "/api/d/open-cross-ref/GEN/50.json",
            "totalNumberOfVerses": 1382,
            "totalNumberOfReferences": 13327
        },
        {
            "id": "EXO",
            "datasetId": "open-cross-ref",
            "order": 2,
            "numberOfChapters": 40,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/d/open-cross-ref/EXO/1.json",
            "lastChapterNumber": 40,
            "lastChapterApiLink": "/api/d/open-cross-ref/EXO/40.json",
            "totalNumberOfVerses": 1084,
            "totalNumberOfReferences": 9974
        },
    ]
}
```

## Obtenir un chapitre à partir d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Obtient le contenu d'un seul chapitre pour un livre et un ensemble de données donnés.

Pour les jeux de données de références croisées (comme le jeu de données `open-cross-ref` ), le chapitre contient la liste des références croisées pour chaque verset. Pour les jeux de données interlinéaires (comme le jeu de données `bsb-interlinear` ), le chapitre contient les mots de chaque verset dans la langue originale ; voir [Jeux de données interlinéaires](#interlinear-datasets) . Pour les jeux de données d'entités (comme le jeu de données `theographic` ), le chapitre contient les personnes, les lieux et les événements qui y apparaissent ; voir [Obtenir les entités d'un chapitre](#get-the-entities-in-a-chapter) . Pour le jeu de données `verse-of-the-day` , le chapitre contient les versets du jour et leurs catégories ; voir [Verset du jour](#verse-of-the-day) .

-   `dataset` l'ID de l'ensemble de données (ex `open-cross-ref` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse).
-   `chapter` correspond au numéro numérique du chapitre (par exemple `1` pour le premier chapitre).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Récupérez le chapitre 1 de la Genèse à partir de l'ensemble de données open-cross-ref.
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (open-cross-ref):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/open-cross-ref/GEN/1.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Informations sur l'ensemble de données pour ce chapitre du livre.
     */
    dataset: Dataset;

    /**
     * Informations relatives au chapitre du livre.
     */
    book: DatasetBook;

    /**
     * Le lien vers ce chapitre.
     */
    thisChapterLink: string;

    /**
     * Le lien vers le chapitre suivant.
     * Nul si c'est le dernier chapitre de l'ensemble de données.
     */
    nextChapterApiLink: string | null;

    /**
     * Le lien vers le chapitre précédent.
     * Nul s'il s'agit du premier chapitre de l'ensemble de données.
     */
    previousChapterApiLink: string | null;

    /**
     * Le nombre de versets que contient le chapitre.
     */
    numberOfVerses: number;

    /**
     * Informations relatives à ce chapitre.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Le numéro du chapitre.
     */
    number: number;

    /**
     * Le contenu du chapitre.
     */
    content: DatasetVerse[];
}

/**
 * Un verset porte `references` (ensembles de données de référence croisée), `words` (ensembles de données interlinéaires) ou `categories` (ensemble de données du verset du jour).
 * Vérifiez lequel est présent avec `'words' in verse` ou `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * Le numéro du verset.
     */
    verse: number;

    /**
     * Les références croisées pour le verset.
     *
     * Trié par score, décroissant.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * Le numéro du verset.
     */
    verse: number;

    /**
     * Les mots du verset dans leur langue originale, dans l'ordre du texte original.
     * Voir « Ensembles de données interlinéaires » ci-dessous.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Le numéro du verset.
     * Si `endVerse` est présent, alors il s'agit du verset par lequel le passage commence.
     */
    verse: number;

    /**
     * Le verset qui conclut le passage.
     * Omis si l'entrée ne comporte qu'un seul verset.
     */
    endVerse?: number;

    /**
     * Les identifiants des catégories auxquelles appartient le verset, des plus pertinentes aux plus rares.
     * Voir le « Verset du jour » ci-dessous.
     */
    categories: string[];

    /**
     * La première année où le verset peut être le verset du jour.
     * Omis si le verset a toujours figuré dans la liste.
     */
    addedIn?: number;

    /**
     * La première année où le verset ne peut plus être le verset du jour.
     * Les versets supprimés restent dans l'ensemble de données afin que les versets des années précédentes puissent toujours être sélectionnés.
     * Omis si le verset n'a pas été retiré de la liste.
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * L'identifiant du livre auquel il est fait référence.
     */
    book: string;

    /**
     * Le numéro du chapitre.
     */
    chapter: number;

    /**
     * Le numéro du verset.
     * Si la valeur `endVerse` est présente, alors il s'agit du verset à partir duquel la référence commence.
     */
    verse: number;

    /**
     * Le verset auquel se termine la référence.
     */
    endVerse?: number;

    /**
     * Score de pertinence de la référence.
     */
    score?: number;
}

// Voir « Ensembles de données interlinéaires » ci-dessous pour la structure d’InterlinearWord.
```

### Exemple

```json:no-line-numbers title="/api/d/open-cross-ref/REV/22.json"
{
    "dataset": {
        "id": "open-cross-ref",
        "name": "Bible Cross References",
        "website": "https://www.openbible.info/labs/cross-references/",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "licenseNotes": "Changes were made to the data to fit the Free Use Bible API format.",
        "englishName": "Bible Cross References",
        "language": "eng",
        "textDirection": "ltr",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/d/open-cross-ref/books.json",
        "numberOfBooks": 66,
        "totalNumberOfChapters": 1189,
        "totalNumberOfVerses": 29364,
        "totalNumberOfReferences": 344799,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "REV",
        "datasetId": "open-cross-ref",
        "order": 66,
        "numberOfChapters": 22,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/d/open-cross-ref/REV/1.json",
        "lastChapterNumber": 22,
        "lastChapterApiLink": "/api/d/open-cross-ref/REV/22.json",
        "totalNumberOfVerses": 402,
        "totalNumberOfReferences": 6495
    },
    "chapter": {
        "number": 22,
        "content": [
            {
                "verse": 1,
                "references": [
                    {
                        "book": "REV",
                        "chapter": 7,
                        "verse": 17,
                        "score": 74
                    },
                    {
                        "book": "JHN",
                        "chapter": 4,
                        "verse": 14,
                        "score": 62
                    },
                    {
                        "book": "PSA",
                        "chapter": 36,
                        "verse": 8,
                        "endVerse": 9,
                        "score": 59
                    },
                    {
                        "book": "JHN",
                        "chapter": 7,
                        "verse": 38,
                        "endVerse": 39,
                        "score": 59
                    },
                    {
                        "book": "JHN",
                        "chapter": 4,
                        "verse": 10,
                        "endVerse": 11,
                        "score": 55
                    },
                ]
            }
        ]
    },
    "thisChapterLink": "/api/d/open-cross-ref/REV/22.json",
    "nextChapterApiLink": null,
    "previousChapterApiLink": "/api/d/open-cross-ref/REV/21.json",
    "numberOfVerses": 21,
    "numberOfReferences": 360
}
```

## Entités

Certains ensembles de données - tels que l'ensemble de données [de métadonnées théographiques de la Bible](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - contiennent des entités : personnes, lieux, événements et groupes de personnes, ainsi que les relations entre eux et les versets bibliques qui les mentionnent.

L'ensemble de données [History Globe](https://historyglobe.app) ( `history-globe` ) contient uniquement des lieux : les lieux mentionnés dans la Bible, avec leurs coordonnées et les versets qui les citent. Ses identifiants de lieu (par exemple, `a15257a` pour Jérusalem) sont les identifiants stables de History Globe, identiques à ceux utilisés par son [API de données ouvertes](https://historyglobe.app/docs/api.html) ; ils restent donc inchangés même en cas de correction d'un nom. Ses valeurs `featureType` correspondent à celles utilisées par l'ensemble de données Theographic ( `City` , `Region` , `Water` , etc.), et `featureSubType` indique le type plus spécifique lorsqu'il existe (par exemple, `River` , `Gate` , `Spring` ).

Les ensembles de données qui contiennent des entités comprennent `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` et `listOfPeopleGroupsApiLink` propriétés dans leur entrée dans `/api/available_datasets.json` .

Les ensembles de données d'entités fournissent également des données alignées sur les chapitres : `/api/d/{dataset}/books.json` liste les livres dont les chapitres contiennent des données d'entités, et `/api/d/{dataset}/{book}/{chapter}.json` renvoie les personnes, les lieux et les événements qui apparaissent dans ce chapitre, ainsi que les numéros de versets où chacun est mentionné. Voir [Obtenir les entités d'un chapitre](#get-the-entities-in-a-chapter) .

Les entités référencent les passages bibliques en utilisant les mêmes identifiants de livre, numéros de chapitre et numéros de verset que le reste de l'API, ce qui permet de les combiner avec n'importe quelle traduction. Elles se référencent entre elles à l'aide de références d'entité.

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * L'identifiant de l'entité référencée.
     */
    id: string;

    /**
     * Le type de l'entité référencée.
     * Correspond au segment de collection du lien API de l'entité, de sorte que le lien peut être construit comme `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Le nom de l'entité à laquelle il est fait référence.
     */
    name?: string;

    /**
     * Lien API de l'entité référencée.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * L'identifiant du livre (GEN, EXO, etc.).
     */
    book: string;

    /**
     * Le numéro du chapitre à partir duquel la référence commence.
     */
    chapter: number;

    /**
     * Le numéro du verset à partir duquel la référence commence.
     */
    verse: number;

    /**
     * Le verset auquel se termine la référence.
     * Les versets consécutifs d'un même chapitre sont regroupés en une seule référence.
     */
    endVerse?: number;
}
```

### Attribution du globe historique

Les données de History Globe sont diffusées sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Si vous les utilisez, veuillez mentionner History Globe ( https://historyglobe.app ) et les données de géocodage biblique d'OpenBible.info sur lesquelles elles s'appuient, et indiquer toute modification. La propriété `licenseNotes` du jeu de données contient la mention de source.

## Obtenez les entités d'un chapitre

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Pour les ensembles de données d'entités, récupère les personnes, les lieux et les événements qui apparaissent dans un seul chapitre, ainsi que les numéros de versets du chapitre où chacun est mentionné.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).
-   `book` est l'identifiant du livre (par exemple `GEN` pour la Genèse).
-   `chapter` correspond au numéro numérique du chapitre (par exemple `1` pour le premier chapitre).

La liste des livres et chapitres contenant des données d'entités est disponible à l'adresse `GET https://bible.helloao.org/api/d/{dataset}/books.json` , qui suit la même structure que le [point d'accès aux livres du jeu de données](#list-books-in-a-dataset) . Pour les jeux de données d'entités, `totalNumberOfVerses` représente le nombre de versets mentionnés par au moins une entité et `totalNumberOfReferences` le nombre total de mentions entité-verset.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Trouvez les personnes, les lieux et les événements qui apparaissent dans Genèse 2
fetch(`https://bible.helloao.org/api/d/${dataset}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 2 (theographic):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/GEN/2.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Informations sur l'ensemble de données pour ce chapitre du livre.
     */
    dataset: Dataset;

    /**
     * Informations relatives au chapitre du livre.
     */
    book: DatasetBook;

    /**
     * Les données d'entité pour le chapitre.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Le lien vers ce chapitre.
     */
    thisChapterLink: string;

    /**
     * Le lien vers le chapitre suivant.
     * Nul si c'est le dernier chapitre de l'ensemble de données.
     */
    nextChapterApiLink: string | null;

    /**
     * Le lien vers le chapitre précédent.
     * Nul s'il s'agit du premier chapitre de l'ensemble de données.
     */
    previousChapterApiLink: string | null;

    /**
     * Le nombre de personnes, de lieux et d'événements qui apparaissent dans le chapitre.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Le numéro du chapitre.
     */
    number: number;

    /**
     * Les personnes qui apparaissent dans ce chapitre.
     * Classés selon le premier verset dans lequel ils apparaissent.
     */
    people: ChapterPerson[];

    /**
     * Les lieux qui apparaissent dans le chapitre.
     * Classés selon le premier verset dans lequel ils apparaissent.
     */
    places: ChapterPlace[];

    /**
     * Les événements qui apparaissent dans ce chapitre.
     * Classés selon le premier verset dans lequel ils apparaissent.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * L'identité de la personne.
     */
    id: string;

    /**
     * Le nom de la personne.
     */
    name: string;

    /**
     * Si le nom de la personne est un nom propre.
     */
    isProperName?: boolean;

    /**
     * Le sexe de la personne.
     */
    gender?: string;

    /**
     * L'année de naissance et l'année de décès de la personne.
     * Les nombres négatifs correspondent aux années avant J.-C. Les nombres positifs correspondent aux années après J.-C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Lien API de la personne.
     */
    apiLink: string;

    /**
     * Les numéros des versets du chapitre qui mentionnent la personne.
     * Trié par ordre croissant.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * L'identifiant du lieu.
     */
    id: string;

    /**
     * Le nom du lieu.
     */
    name: string;

    /**
     * Le type de caractéristique géographique du lieu.
     */
    featureType?: string;

    /**
     * La latitude et la longitude du lieu.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Lien API pour ce lieu.
     */
    apiLink: string;

    /**
     * Les numéros des versets du chapitre qui mentionnent le lieu.
     * Trié par ordre croissant.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * L'identifiant de l'événement.
     */
    id: string;

    /**
     * Le nom de l'événement.
     */
    name: string;

    /**
     * La date à laquelle l'événement a débuté.
     */
    startDate?: string;

    /**
     * Lien API pour l'événement.
     */
    apiLink: string;

    /**
     * Les numéros des versets du chapitre qui décrivent l'événement.
     * Trié par ordre croissant.
     */
    verses: number[];
}
```

### Exemple

```json:no-line-numbers title="/api/d/theographic/GEN/2.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "book": {
        "id": "GEN",
        "order": 1,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/d/theographic/GEN/1.json",
        "lastChapterNumber": 50,
        "lastChapterApiLink": "/api/d/theographic/GEN/50.json",
        "numberOfChapters": 50,
        "totalNumberOfVerses": 1343,
        "totalNumberOfReferences": 3346
    },
    "chapter": {
        "number": 2,
        "people": [
            {
                "id": "god_1324",
                "name": "God",
                "isProperName": true,
                "gender": "Male",
                "apiLink": "/api/d/theographic/people/god_1324.json",
                "verses": [2, 3, 4, 5, 7, 8, 9, 15, 16, 18, 19, 21, 22]
            },
            {
                "id": "adam_78",
                "name": "Adam",
                "isProperName": true,
                "gender": "Male",
                "birthYear": -4004,
                "deathYear": -3074,
                "apiLink": "/api/d/theographic/people/adam_78.json",
                "verses": [19, 20, 21, 23]
            }
        ],
        "places": [
            {
                "id": "eden_354",
                "name": "Eden",
                "featureType": "Region",
                "apiLink": "/api/d/theographic/places/eden_354.json",
                "verses": [8, 10, 15]
            },
            {
                "id": "havilah_533",
                "name": "Havilah (of Eden)",
                "featureType": "Region",
                "apiLink": "/api/d/theographic/places/havilah_533.json",
                "verses": [11]
            }
        ],
        "events": [
            {
                "id": "creation-of-all-things_1",
                "name": "Creation of all things",
                "startDate": "-4003",
                "apiLink": "/api/d/theographic/events/creation-of-all-things_1.json",
                "verses": [1, 2, 3]
            },
            {
                "id": "creation-of-adam-and-eve_2",
                "name": "Creation of Adam and Eve",
                "startDate": "-4003",
                "apiLink": "/api/d/theographic/events/creation-of-adam-and-eve_2.json",
                "verses": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            }
        ]
    },
    "thisChapterLink": "/api/d/theographic/GEN/2.json",
    "previousChapterApiLink": "/api/d/theographic/GEN/1.json",
    "nextChapterApiLink": "/api/d/theographic/GEN/3.json",
    "numberOfPeople": 2,
    "numberOfPlaces": 8,
    "numberOfEvents": 2
}
```

## Lister les personnes dans un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Obtient la liste des personnes disponibles pour l'ensemble de données donné.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Obtenez la liste des personnes pour l'ensemble de données théographiques
fetch(`https://bible.helloao.org/api/d/${dataset}/people.json`)
    .then(request => request.json())
    .then(people => {
        console.log('The theographic dataset has the following people:', people);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Les données relatives aux personnes.
     */
    dataset: Dataset;

    /**
     * Liste des personnes disponibles pour l'ensemble de données.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * L'identité de la personne.
     */
    id: string;

    /**
     * Le nom de la personne.
     */
    name: string;

    /**
     * Si le nom de la personne est un nom propre.
     */
    isProperName?: boolean;

    /**
     * Le sexe de la personne.
     */
    gender?: string;

    /**
     * Le nombre de références bibliques mentionnant cette personne.
     */
    numberOfReferences: number;

    /**
     * Lien API de la personne.
     */
    thisPersonApiLink: string;
}
```

### Exemple

```json:no-line-numbers title="/api/d/theographic/people.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "people": [
        {
            "id": "paul_2479",
            "name": "Paul",
            "gender": "Male",
            "numberOfReferences": 150,
            "thisPersonApiLink": "/api/d/theographic/people/paul_2479.json"
        },
        {
            "id": "peter_2745",
            "name": "Simon Peter",
            "gender": "Male",
            "numberOfReferences": 129,
            "thisPersonApiLink": "/api/d/theographic/people/peter_2745.json"
        }
    ]
}
```

## Obtenir une personne à partir d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Permet d'obtenir des informations sur une personne en particulier, y compris les références bibliques qui la mentionnent et ses relations avec d'autres personnes, lieux, événements et groupes de personnes.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).
-   `person` l'identifiant de la personne (ex. `paul_2479` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Obtenez les informations concernant Paul à partir de l'ensemble de données théographiques.
fetch(`https://bible.helloao.org/api/d/${dataset}/people/${person}.json`)
    .then(request => request.json())
    .then(person => {
        console.log('Paul:', person);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/theographic/people/paul_2479.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Informations relatives à la personne dans l'ensemble de données.
     */
    dataset: Dataset;

    /**
     * Les informations concernant la personne.
     */
    person: DatasetPerson;

    /**
     * Lien API pour cette personne.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * L'identité de la personne.
     */
    id: string;

    /**
     * Le nom de la personne.
     */
    name: string;

    /**
     * Autres noms par lesquels la personne est appelée.
     */
    alsoCalled?: string[];

    /**
     * Si le nom de la personne est un nom propre.
     */
    isProperName?: boolean;

    /**
     * Le sexe de la personne.
     */
    gender?: string;

    /**
     * Description de la personne. Chaque chaîne de caractères correspond à un paragraphe.
     */
    description?: string[];

    /**
     * L'année de naissance et l'année de décès de la personne.
     * Les nombres négatifs correspondent aux années avant J.-C. Les nombres positifs correspondent aux années après J.-C.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Les années les plus anciennes et les plus récentes où la personne est mentionnée.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Le lieu de naissance et de décès de la personne.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Les relations familiales de la personne.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Les groupes ethniques auxquels la personne appartient.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Les événements auxquels la personne a participé.
     */
    events?: DatasetEntityRef[];

    /**
     * La liste des références bibliques mentionnant cette personne.
     * Triés par ordre de livre, chapitre et verset.
     */
    references: VerseRef[];
}
```

### Exemple

```json:no-line-numbers title="/api/d/theographic/people/ananias_259.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "person": {
        "id": "ananias_259",
        "name": "Ananias (Disciple at Damascus)",
        "gender": "Male",
        "description": [
            "A Christian at Damascus (Acts 9:10). He became Paul’s instructor; ..."
        ],
        "minYear": 35,
        "maxYear": 60,
        "events": [
            {
                "id": "saul-is-converted_326",
                "type": "events",
                "name": "Saul is converted",
                "apiLink": "/api/d/theographic/events/saul-is-converted_326.json"
            }
        ],
        "references": [
            { "book": "ACT", "chapter": 9, "verse": 10 },
            { "book": "ACT", "chapter": 9, "verse": 12, "endVerse": 13 },
            { "book": "ACT", "chapter": 9, "verse": 17 },
            { "book": "ACT", "chapter": 22, "verse": 12 }
        ]
    },
    "thisPersonApiLink": "/api/d/theographic/people/ananias_259.json"
}
```

## Lister les lieux dans un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Obtient la liste des lieux disponibles pour l'ensemble de données donné.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).

### Structure

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Informations sur les données relatives aux lieux.
     */
    dataset: Dataset;

    /**
     * Liste des lieux disponibles pour l'ensemble de données.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * L'identifiant du lieu.
     */
    id: string;

    /**
     * Le nom du lieu.
     */
    name: string;

    /**
     * Le type de caractéristique géographique du lieu.
     * Par exemple, « Ville », « Région », « Montagne », « Eau », etc.
     */
    featureType?: string;

    /**
     * La latitude et la longitude du lieu.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Le nombre de références bibliques mentionnant ce lieu.
     */
    numberOfReferences: number;

    /**
     * Lien API pour ce lieu.
     */
    thisPlaceApiLink: string;
}
```

## Obtenir un lieu à partir d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Permet d'obtenir des informations sur un lieu précis, y compris les références bibliques qui le mentionnent, ainsi que les personnes et les événements qui y sont liés.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).
-   `place` l'identifiant du lieu (ex. `jerusalem_636` ).

### Structure

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Informations relatives aux données de ce lieu.
     */
    dataset: Dataset;

    /**
     * Les informations concernant le lieu.
     */
    place: DatasetPlace;

    /**
     * Lien API pour cet endroit.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * L'identifiant du lieu.
     */
    id: string;

    /**
     * Le nom du lieu.
     */
    name: string;

    /**
     * Le nom du lieu tel qu'il apparaît dans la version du roi Jacques et la version standard anglaise.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Autres noms donnés à ce lieu.
     */
    aliases?: string[];

    /**
     * Le type de caractéristique géographique du lieu.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * La latitude et la longitude du lieu, et leur précision.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Description du lieu. Chaque chaîne de caractères correspond à un paragraphe.
     */
    description?: string[];

    /**
     * Commentaire des auteurs du jeu de données concernant ce lieu.
     */
    comment?: string;

    /**
     * Le lieu d'origine de cet endroit.
     * Différents noms pour un même lieu géographique partagent la même origine.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * L'endroit dont cet endroit est une copie conforme.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Les personnes qui ont séjourné à cet endroit, y sont nées ou y sont décédées.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Les événements qui se sont déroulés à cet endroit.
     */
    events?: DatasetEntityRef[];

    /**
     * Liste des références bibliques mentionnant ce lieu.
     * Triés par ordre de livre, chapitre et verset.
     */
    references: VerseRef[];
}
```

### Exemple

```json:no-line-numbers title="/api/d/theographic/places/damascus_322.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "place": {
        "id": "damascus_322",
        "name": "Damascus",
        "kjvName": "Damascus",
        "esvName": "Damascus",
        "featureType": "City",
        "latitude": 33.511612,
        "longitude": 36.309102,
        "description": [
            "Activity, the most ancient of Oriental cities; the capital of Syria; ..."
        ],
        "events": [
            {
                "id": "saul-is-converted_326",
                "type": "events",
                "name": "Saul is converted",
                "apiLink": "/api/d/theographic/events/saul-is-converted_326.json"
            }
        ],
        "references": [
            { "book": "GEN", "chapter": 14, "verse": 15 },
            { "book": "GEN", "chapter": 15, "verse": 2 }
        ]
    },
    "thisPlaceApiLink": "/api/d/theographic/places/damascus_322.json"
}
```

## Lister les événements d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Obtient la liste des événements disponibles pour l'ensemble de données donné.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).

### Structure

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Informations relatives aux événements dans l'ensemble de données.
     */
    dataset: Dataset;

    /**
     * Liste des événements disponibles pour l'ensemble de données.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * L'identifiant de l'événement.
     */
    id: string;

    /**
     * Le nom de l'événement.
     */
    name: string;

    /**
     * La date à laquelle l'événement a débuté.
     * Les nombres négatifs correspondent aux années avant J.-C. Les nombres positifs correspondent aux années après J.-C.
     * Les dates plus précises utilisent le format `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Le nombre de références bibliques qui décrivent l'événement.
     */
    numberOfReferences: number;

    /**
     * Lien API pour l'événement.
     */
    thisEventApiLink: string;
}
```

## Obtenir un événement à partir d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Permet d'obtenir des informations sur un événement précis, y compris les références bibliques qui le décrivent ainsi que les personnes, les lieux et les groupes de personnes qui y sont liés.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).
-   `event` l'ID de l'événement (ex `saul-is-converted_326` ).

### Structure

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Informations relatives aux données de l'événement.
     */
    dataset: Dataset;

    /**
     * Informations concernant l'événement.
     */
    event: DatasetEvent;

    /**
     * Lien API pour cet événement.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * L'identifiant de l'événement.
     */
    id: string;

    /**
     * Le nom de l'événement.
     */
    name: string;

    /**
     * La date à laquelle l'événement a débuté.
     */
    startDate?: string;

    /**
     * La durée de l'événement.
     * Par exemple, « 1J » signifie un jour et « 40Y » quarante ans.
     */
    duration?: string;

    /**
     * Les personnes qui ont participé à l'événement.
     */
    participants?: DatasetEntityRef[];

    /**
     * Les lieux où l'événement s'est déroulé.
     */
    locations?: DatasetEntityRef[];

    /**
     * Les groupes ethniques qui ont participé à l'événement.
     */
    groups?: DatasetEntityRef[];

    /**
     * L'événement dont cet événement fait partie.
     */
    partOf?: DatasetEntityRef;

    /**
     * L'événement qui s'est produit avant cet événement.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Liste des références bibliques décrivant l'événement.
     * Triés par ordre de livre, chapitre et verset.
     */
    references: VerseRef[];
}
```

### Exemple

```json:no-line-numbers title="/api/d/theographic/events/saul-is-converted_326.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "event": {
        "id": "saul-is-converted_326",
        "name": "Saul is converted",
        "startDate": "0032",
        "duration": "1D",
        "participants": [
            {
                "id": "holy_spirit_7400",
                "type": "people",
                "name": "Holy Spirit",
                "apiLink": "/api/d/theographic/people/holy_spirit_7400.json"
            },
            {
                "id": "ananias_259",
                "type": "people",
                "name": "Ananias (Disciple at Damascus)",
                "apiLink": "/api/d/theographic/people/ananias_259.json"
            },
            {
                "id": "paul_2479",
                "type": "people",
                "name": "Paul",
                "apiLink": "/api/d/theographic/people/paul_2479.json"
            }
        ],
        "locations": [
            {
                "id": "damascus_322",
                "type": "places",
                "name": "Damascus",
                "apiLink": "/api/d/theographic/places/damascus_322.json"
            }
        ],
        "predecessor": {
            "id": "conversion-of-ethiopian-eunuch_325",
            "type": "events",
            "name": "Conversion of Ethiopian Eunuch",
            "apiLink": "/api/d/theographic/events/conversion-of-ethiopian-eunuch_325.json"
        },
        "references": [
            { "book": "ACT", "chapter": 9, "verse": 1, "endVerse": 19 }
        ]
    },
    "thisEventApiLink": "/api/d/theographic/events/saul-is-converted_326.json"
}
```

## Lister les groupes de personnes dans un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Obtient la liste des groupes de personnes disponibles pour l'ensemble de données donné.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).

### Structure

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Informations sur les groupes de population.
     */
    dataset: Dataset;

    /**
     * Liste des groupes ethniques disponibles pour l'ensemble de données.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * L'identifiant du groupe ethnique.
     */
    id: string;

    /**
     * Le nom du groupe ethnique.
     */
    name: string;

    /**
     * Le nombre de personnes qui font partie du groupe ethnique.
     */
    numberOfMembers: number;

    /**
     * Lien API pour le groupe de personnes.
     */
    thisPeopleGroupApiLink: string;
}
```

## Obtenir un groupe de personnes à partir d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Permet d'obtenir des informations sur un groupe ethnique donné, notamment ses membres et les événements auxquels le groupe a participé.

-   `dataset` l'ID de l'ensemble de données (ex `theographic` ).
-   `group` l'ID du groupe de personnes (ex `tribe-of-benjamin` ).

### Structure

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Informations relatives aux données du groupe de personnes.
     */
    dataset: Dataset;

    /**
     * Les informations concernant ce groupe ethnique.
     */
    group: DatasetPeopleGroup;

    /**
     * Lien API pour ce groupe de personnes.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * L'identifiant du groupe ethnique.
     */
    id: string;

    /**
     * Le nom du groupe ethnique.
     */
    name: string;

    /**
     * Les personnes qui appartiennent au groupe ethnique.
     */
    members?: DatasetEntityRef[];

    /**
     * Les événements auxquels ce groupe ethnique a participé.
     */
    events?: DatasetEntityRef[];

    /**
     * Liste des références bibliques mentionnant ce peuple.
     * Triés par ordre de livre, chapitre et verset.
     */
    references: VerseRef[];
}
```

### Exemple

```json:no-line-numbers title="/api/d/theographic/groups/tribe-of-benjamin.json"
{
    "dataset": {
        "id": "theographic",
        "name": "Theographic Bible Metadata",
        "...": "..."
    },
    "group": {
        "id": "tribe-of-benjamin",
        "name": "Tribe of Benjamin",
        "members": [
            {
                "id": "abiah_17",
                "type": "people",
                "name": "Abiah",
                "apiLink": "/api/d/theographic/people/abiah_17.json"
            },
            {
                "id": "abihud_34",
                "type": "people",
                "name": "Abihud",
                "apiLink": "/api/d/theographic/people/abihud_34.json"
            }
        ],
        "references": []
    },
    "thisPeopleGroupApiLink": "/api/d/theographic/groups/tribe-of-benjamin.json"
}
```

## Ensembles de données interlinéaires

Le jeu de données interlinéaire de Berean ( `bsb-interlinear` ) répertorie les mots en langue originale (hébreu, araméen et grec) de chaque verset de la Bible, dans l'ordre où ils apparaissent dans le texte original. Chaque mot est accompagné de sa translittération, de son analyse grammaticale, [de son numéro Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) et de la traduction anglaise utilisée dans la [Bible standard de Berean](https://berean.bible) .

Cet ensemble de données utilise les mêmes points d'accès que d'autres ensembles de données :

-   La liste `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` recense les 66 livres.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (par exemple `/api/d/bsb-interlinear/GEN/1.json` ) renvoie le chapitre, avec `{ verse, words }` pour chaque verset. La réponse est un [chapitre de l'ensemble de données](#get-a-chapter-from-a-dataset) .

Les données lexicales proviennent [des tables interlinéaires de la Bible standard de Bérée](https://bereanbible.com/) , qui sont dans le domaine public. Les numéros Strong des mots sont recherchés dans le [lexique](#lexicon) ( `stepbible-lexicon` ).

### Structure

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Le rang du mot, à partir de 1, dans l'ordre du texte original.
     * Les mots sont listés dans cet ordre.
     */
    pos: number;

    /**
     * Le rang du mot, basé sur 1, dans l'ordre anglais de la Bible standard de Bérée.
     */
    bsbPos: number;

    /**
     * Le langage du mot.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Le mot dans le script original. Normalisé NFC.
     */
    text: string;

    /**
     * La translittération du mot.
     */
    transliteration: string | null;

    /**
     * Le code d'analyse grammaticale abrégé du mot. Par exemple « N-mp » ou « V-Qal-Perf-3ms ».
     */
    parsing: string | null;

    /**
     * L'analyse grammaticale détaillée du mot.
     */
    parsingFull: string | null;

    /**
     * Le numéro Strong du mot, complété par des zéros. Par exemple : « H0430 » ou « G3056 ».
     * Complété par des zéros, ce qui correspond aux valeurs `.words.json` de la version King James.
     * Les valeurs d'autres traductions peuvent nécessiter un remplissage de zéros et la suppression des suffixes avant d'être jointes.
     * Nul lorsque la source ne donne aucun numéro Strong au mot (c'est le cas pour certains mots qui sont des suffixes, tels que les suffixes pronominaux).
     */
    strongs: string | null;

    /**
     * La traduction anglaise de ce mot dans la Bible standard de Bérée.
     * Nul lorsque le BSB laisse le mot non traduit (comme le marqueur d'objet direct hébreu).
     */
    gloss: string | null;
}
```

### Exemple

```json:no-line-numbers title="/api/d/bsb-interlinear/GEN/1.json"
{
    "dataset": {
        "id": "bsb-interlinear",
        "name": "Berean Standard Bible Interlinear",
        "totalNumberOfWords": 443625
        // ...
    },
    "book": {
        "id": "GEN",
        "datasetId": "bsb-interlinear",
        "order": 1,
        "numberOfChapters": 50
        // ...
    },
    "chapter": {
        "number": 1,
        "content": [
            {
                "verse": 1,
                "words": [
                    {
                        "pos": 1,
                        "bsbPos": 1,
                        "language": "hebrew",
                        "text": "בְּרֵאשִׁ֖ית",
                        "transliteration": "bə·rê·šîṯ",
                        "parsing": "Prep-b | N-fs",
                        "parsingFull": "Preposition-b | Noun - feminine singular",
                        "strongs": "H7225",
                        "gloss": "In the beginning"
                    },
                    {
                        "pos": 2,
                        "bsbPos": 4,
                        "language": "hebrew",
                        "text": "בָּרָ֣א",
                        "transliteration": "bā·rā",
                        "parsing": "V-Qal-Perf-3ms",
                        "parsingFull": "Verb - Qal - Perfect - third person masculine singular",
                        "strongs": "H1254",
                        "gloss": "created"
                    }
                    // ...
                ]
            }
            // ...
        ]
    },
    "thisChapterLink": "/api/d/bsb-interlinear/GEN/1.json",
    "nextChapterApiLink": "/api/d/bsb-interlinear/GEN/2.json",
    "previousChapterApiLink": null,
    "numberOfVerses": 31,
    "numberOfReferences": 0
}
```

### Associer les mots aux traductions

Les valeurs `strongs` interlinéaires sont complétées par des zéros (ex. `H0430` ). Cela correspond aux valeurs `strongs` des annotations de mots de la Bible du roi Jacques ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Les valeurs d'autres traductions peuvent nécessiter un complément de zéros et la suppression des suffixes (ex. : `H430` ou `H1961a` deviennent `H0430` et `H1961` ) avant de pouvoir être jointes.

-   Version du roi Jacques ( **KJV).** Pour la version du roi Jacques ( `eng_kjv` et `eng_kja` ), associez les numéros Strong du fichier `.words.json` d'un chapitre aux `strongs` mots interlinéaires du même verset. Par exemple, chaque numéro Strong annoté dans `/api/eng_kjv/GEN/1.words.json` pour le verset 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) apparaît comme une valeur `strongs` parmi les mots du verset 1 dans `/api/d/bsb-interlinear/GEN/1.json` .
-   **Bible standard de Berea.** Le `gloss` de chaque mot correspond à la traduction BSB correspondante. Parcourez les mots du verset dans `bsbPos` ordre et comparez chaque `gloss` avec le texte du verset dans la traduction BSB pour trouver la traduction du mot.

La numérotation des deux sources ne concorde pas toujours. Par exemple, la Bible du roi Jacques attribue la valeur `G2258` à « était », tandis que le tableau de Berea lui attribue la valeur `G1510` Quelques jointures échouent en raison de différences de ce type.

### Attribution

Les tables interlinéaires de Bérée sont dans le domaine public. Le [lexique](#lexicon) est sous licence CC BY 4.0 et nécessite la mention de l'auteur.

## Lexique

Le jeu de données lexical STEPBible ( `stepbible-lexicon` ) contient les lexiques abrégés hébreu, araméen et grec (TBESH et TBESG) de [STEPBible.org](https://www.stepbible.org/) à Tyndale House, Cambridge. Il comporte une entrée pour chaque numéro Strong de base, et chaque entrée comprend un ou plusieurs sens avec le lemme, la translittération, la catégorie grammaticale, la glose anglaise et une définition.

Toute valeur `strongs` complétée par des zéros provenant d'un [mot interlinéaire](#interlinear-datasets) et possédant une entrée lexicale peut être consultée à l'entrée `/api/d/stepbible-lexicon/lexicon/{strongs}.json` sans reformatage. Il en va de même pour les valeurs `.words.json` de la Bible du roi Jacques ; les valeurs d'autres traductions peuvent nécessiter un complément de zéros et la suppression des suffixes. Les entrées grecques ajoutées au lexique sans numéro Strong ne sont pas publiées.

Les ensembles de données qui contiennent des entrées de lexique incluent `listOfLexiconApiLink` et `totalNumberOfLexicon` dans leur entrée dans `/api/available_datasets.json` .

### Attribution

Les données lexicales sont mises à disposition selon les termes de la licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Si vous les utilisez, veuillez mentionner STEPBible.org / Tyndale House, Cambridge, et indiquer toute modification. La mention de source figure dans la propriété `licenseNotes` du jeu de données.

## Liste des entrées du lexique dans un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Obtient la liste des entrées de lexique disponibles pour un ensemble de données.

-   `dataset` l'ID de l'ensemble de données (ex `stepbible-lexicon` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-lexicon.js"
fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json`)
    .then(request => request.json())
    .then(lexicon => {
        console.log('The lexicon has', lexicon.lexicon.length, 'entries');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Informations sur l'ensemble de données du lexique.
     */
    dataset: Dataset;

    /**
     * La liste des entrées lexicales disponibles pour l'ensemble de données.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Le numéro Strong de l'entrée du lexique, complété par des zéros. Par exemple : « H0430 ».
     */
    id: string;

    /**
     * La langue de l'entrée lexicale.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Le nom de l'entrée du lexique.
     * Voici le lemme du premier sens de l'entrée.
     */
    name: string;

    /**
     * Lien API pour l'entrée du lexique.
     */
    apiLink: string;
}
```

### Exemple

```json:no-line-numbers title="/api/d/stepbible-lexicon/lexicon.json"
{
    "dataset": {
        "id": "stepbible-lexicon",
        "name": "STEPBible Brief Lexicons",
        "totalNumberOfLexicon": 18085
        // ...
    },
    "lexicon": [
        {
            "id": "G0001",
            "language": "greek",
            "name": "α, Ἀλφα",
            "apiLink": "/api/d/stepbible-lexicon/lexicon/G0001.json"
        },
        {
            "id": "G0002",
            "language": "greek",
            "name": "Ἀαρών",
            "apiLink": "/api/d/stepbible-lexicon/lexicon/G0002.json"
        }
        // ...
    ]
}
```

## Obtenir une entrée de lexique à partir d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Obtient l'entrée lexicale pour un seul nombre de base Strong, avec tous ses sens.

-   `dataset` l'ID de l'ensemble de données (ex `stepbible-lexicon` ).
-   `strongs` est le numéro Strong complété par des zéros (par exemple `H0430` pour le mot hébreu _elohim_, ou `G3056` pour le mot grec _logos_).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-lexicon-entry.js"
const strongs = 'H1254';

fetch(`https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/${strongs}.json`)
    .then(request => request.json())
    .then(({ entry }) => {
        console.log('H1254:', entry.senses.map(sense => sense.gloss));
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/stepbible-lexicon/lexicon/H1254.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Informations relatives à l'ensemble de données pour l'entrée du lexique.
     */
    dataset: Dataset;

    /**
     * L'entrée du lexique.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Lien API pour cette entrée de lexique.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Le numéro Strong de l'entrée, complété par des zéros. Par exemple : « H0430 ».
     */
    id: string;

    /**
     * La langue de l'entrée.
     * Il s'agit du langage du premier sens de l'entrée.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Les sens de l'entrée, par ordre d'identification.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * L'identifiant étendu du sens. Par exemple, « H0001G ».
     * Égal au nombre de Strong de base lorsque le nombre a une seule signification.
     */
    id: string;

    /**
     * Le langage des sens.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Le lemme du sens dans le script original.
     */
    lemma: string;

    /**
     * La translittération du lemme.
     */
    transliteration: string | null;

    /**
     * Le code grammatical (morphologique) du sens.
     */
    partOfSpeech: string | null;

    /**
     * La brève traduction anglaise du sens.
     */
    gloss: string | null;

    /**
     * Définition du sens en texte clair.
     * Les paragraphes sont séparés par des lignes vides. Le balisage dans le code source a été supprimé.
     */
    definition: string;
}
```

### Exemple

```json:no-line-numbers title="/api/d/stepbible-lexicon/lexicon/H1254.json"
{
    "dataset": {
        "id": "stepbible-lexicon",
        "name": "STEPBible Brief Lexicons",
        "totalNumberOfLexicon": 18085
        // ...
    },
    "entry": {
        "id": "H1254",
        "language": "hebrew",
        "senses": [
            {
                "id": "H1254A",
                "language": "hebrew",
                "lemma": "בָּרָא",
                "transliteration": "ba.ra",
                "partOfSpeech": "V",
                "gloss": "to create",
                "definition": "1) to create, shape, form\n\n1a) (Qal) to shape, fashion, create (always with God as subject)\n\n1b) (Niphal) to be created"
            },
            {
                "id": "H1254B",
                "language": "hebrew",
                "lemma": "בָּרָא",
                "transliteration": "ba.ra",
                "partOfSpeech": "V",
                "gloss": "to fatten",
                "definition": "1) to be fat\n\n1a) (Hiphil) to make yourselves fat"
            }
        ]
    },
    "thisLexiconEntryApiLink": "/api/d/stepbible-lexicon/lexicon/H1254.json"
}
```

## Verset du jour

Le jeu de données « verset du jour » ( `verse-of-the-day` ) est une liste soigneusement sélectionnée de versets et de courts passages connus (trois versets au maximum) qui peuvent être utilisés comme « verset du jour » : plus de 640 pour chaque jour de l’année et plus de 100 pour les fêtes chrétiennes. Chacun a sa propre signification.

Chaque verset pour chaque jour comporte une à trois catégories, les plus pertinentes en premier, issues de cet ensemble fixe :

| IDENTIFIANT   | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `comfort`     | La proximité et la sollicitude de Dieu dans la douleur, les difficultés et la solitude. |
| `courage`     | Rester ferme et ne pas avoir peur.                                                      |
| `faith`       | Faire confiance à Dieu et à ses promesses.                                              |
| `forgiveness` | Le pardon des péchés par Dieu et le pardon des autres.                                  |
| `gratitude`   | Rendons grâce à Dieu.                                                                   |
| `guidance`    | Dieu guide nos pas, nos projets et nos décisions.                                       |
| `hope`        | La confiance en l'avenir promis par Dieu.                                               |
| `inspiration` | Un encouragement à vivre sa foi et à faire le bien.                                     |
| `joy`         | Joie et allégresse en Dieu.                                                             |
| `love`        | L'amour de Dieu pour nous et notre amour pour Dieu et pour les autres.                  |
| `peace`       | Repos, calme et absence d'anxiété.                                                      |
| `praise`      | Adoration et proclamations de la grandeur de Dieu.                                      |
| `prayer`      | Invoquer Dieu et sa promesse d'exaucer.                                                 |
| `provision`   | Dieu nous fournit ce dont nous avons besoin.                                            |
| `salvation`   | Rédemption, grâce et vie nouvelle en Christ.                                            |
| `strength`    | Dieu donne la force et l'endurance.                                                     |
| `wisdom`      | La sagesse divine et des conseils pratiques pour la vie.                                |

Les fêtes sont classées par catégories. Le verset biblique du jour est un verset spécifique à cette fête et n'est utilisé que ce verset à cette occasion. Une fête dure généralement une journée ; les jours qui suivent Pâques durent trois jours, d'où la mention de ces trois dates. Chaque catégorie de fête est associée à un `holiday` suivi de ses dates : les fêtes ayant lieu à la même date chaque année sont identifiées par `month` et `day` , tandis que les fêtes dont la date varie chaque année (car elles dépendent de Pâques ou de l'Avent) sont identifiées par un `dates` dans le calendrier grégorien, précalculé pour la période de 2026 à 2125.

| IDENTIFIANT                | Vacances                    | Date                                          |
| -------------------------- | --------------------------- | --------------------------------------------- |
| `epiphany`                 | Épiphanie                   | 6 janvier                                     |
| `ash-wednesday`            | mercredi des Cendres        | 46 jours avant le dimanche de Pâques          |
| `palm-sunday`              | Dimanche des Rameaux        | Le dimanche précédant le dimanche de Pâques   |
| `maundy-thursday`          | Jeudi saint                 | Le jeudi précédant le dimanche de Pâques      |
| `good-friday`              | Vendredi Saint              | Le vendredi précédant le dimanche de Pâques   |
| `resurrection-sunday`      | Dimanche de la Résurrection | dimanche de Pâques                            |
| `post-resurrection-sunday` | Après le dimanche de Pâques | Les trois jours suivant le dimanche de Pâques |
| `ascension-day`            | Jour de l'Ascension         | 39 jours après le dimanche de Pâques          |
| `pentecost`                | Pentecôte                   | 49 jours après le dimanche de Pâques          |
| `all-hallows-eve`          | La veille de la Toussaint   | 31 octobre                                    |
| `all-saints-day`           | La Toussaint                | 1er novembre                                  |
| `advent-sunday`            | Premier dimanche de l'Avent | Le quatrième dimanche avant Noël              |
| `christmas-eve`            | la veille de Noël           | 24 décembre                                   |
| `christmas`                | Noël                        | 25 décembre                                   |

L'ensemble de données ne contient que des références, et non le texte des versets ; il est donc compatible avec toutes les traductions. La numérotation des versets utilise la numérotation anglaise standard (identique à celle de la BSB). Les données peuvent être lues de trois manières :

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) répertorie chaque verset de l'ensemble de données avec ses catégories, et les fêtes avec leurs dates, dans un seul fichier.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) liste recense tous les versets d'une catégorie. C'est la méthode la plus simple pour choisir un verset du jour dans une catégorie donnée.
-   La liste [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) répertorie les candidats d'un chapitre, avec leurs catégories. Seuls les chapitres contenant un candidat sont disponibles ; utilisez les liens vers les chapitres du livre ou `/api/d/verse-of-the-day/books.json` pour les trouver.

Les ensembles de données qui contiennent des catégories de versets incluent `listOfVersesApiLink` , `listOfCategoriesApiLink` et `totalNumberOfCategories` dans leur entrée dans `/api/available_datasets.json` .

### Choisir un verset du jour

L'API étant composée de fichiers statiques, elle ne choisit pas de verset pour vous. Elle utilise une convention pour la sélection, afin que chaque application qui la suit affiche le même verset le même jour. Les applications sont libres de choisir un verset différent ; la convention leur fournit simplement une valeur par défaut commune.

La convention sélectionne les versets et les fêtes de l'année `/api/d/verse-of-the-day/verses.json` Lors d'une fête, elle choisit un verset parmi ceux qui lui sont associés, en les parcourant année après année. Ainsi, chaque fête a un verset différent chaque année jusqu'à ce que tous ses versets aient été utilisés. Les autres jours, chaque année bénéficie d'un mélange aléatoire des versets en vigueur (triés selon un hachage de la référence de chaque verset, de l'année et d'une graine optionnelle). Le verset du jour est celui correspondant à la date de l'année dans ce mélange. L'ensemble de données contient plus de 366 versets, un pour chaque jour de l'année. Par conséquent, un verset ne se répète jamais au cours d'une même année civile, l'ordre change chaque année et une même date est toujours associée au même verset. De nouveaux versets sont ajoutés (avec `addedIn` ) et d'anciens sont supprimés (avec `removedIn` ) uniquement pour les années à venir. Ainsi, le verset du jour pour une date passée ne change jamais.

La page [de la Convention du Verset du Jour](./verse-of-the-day-convention.md) spécifie l'algorithme étape par étape, avec du pseudocode et des valeurs de test, afin que vous puissiez l'implémenter dans n'importe quel langage.

Pour utiliser votre propre ordre, choisissez une graine (par exemple, le nom de votre application) : cela donne un mélange différent avec les mêmes garanties. Vous pouvez aussi choisir parmi les versets d'une seule catégorie, mais chaque catégorie contient moins de versets que de jours dans une année, donc les versets se répètent plus tôt.

Les SDK suivent la convention :

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Une date au format AAAA-MM-JJ, ou une date (sa date du calendrier local est utilisée). Par défaut, la date du jour.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Obtenez le texte du verset à partir d'une traduction.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` télécharge la liste des versets et en sélectionne. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` sélectionne dans une liste que vous possédez déjà.
-   Le SDK Kotlin possède `getVerseOfTheDay(date?, seed?, category?)` et `pickVerseOfTheDay(verses, date?, seed?, category?)` , qui prennent la date comme une chaîne de caractères `YYYY-MM-DD` .
-   Le SDK Swift possède `getVerseOfTheDay(date:seed:category:)` et `pickVerseOfTheDay(_:date:seed:category:holidays:)` , qui prennent la date sous forme de chaîne de caractères `YYYY-MM-DD` ou `Date` (sa date calendaire dans le fuseau horaire actuel est utilisée).
-   Le [serveur MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) dispose d' `getVerseOfTheDay` outil qui renvoie le verset du jour avec son texte.
-   Le paquet `@helloao/tools` contient la même liste et une fonction `getVerseOfTheDay(date?, { seed?, category? }?)` dans `@helloao/tools/generation/verse-of-the-day.js` .

### Licence

Cette liste a été compilée par AO Lab et est diffusée sous [licence MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Le texte des versets provient de la traduction dont vous utilisez les données.

## Lister les versets d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Récupère chaque verset (ou court passage) d'un ensemble de données, avec les catégories auxquelles chacun appartient, dans l'ordre canonique. Disponible uniquement pour les ensembles de données dont les versets ont des catégories, comme `verse-of-the-day` .

-   `dataset` l'ID de l'ensemble de données (par exemple `verse-of-the-day` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-verses.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/verses.json`)
    .then(request => request.json())
    .then(verses => {
        console.log('The dataset has', verses.verses.length, 'verses');
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/verses.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Informations relatives aux versets dans l'ensemble de données.
     */
    dataset: Dataset;

    /**
     * Chaque verset (ou court passage) de l'ensemble de données, avec ses catégories, dans l'ordre canonique.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Les fêtes qui ont leurs propres versets, avec leurs dates.
     * Omis si l'ensemble de données ne comporte pas de jours fériés.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * L'identifiant de la catégorie de la fête, par exemple « Noël ».
     */
    id: string;

    /**
     * Le nom anglais de la fête. Par exemple, « Christmas ».
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Le mois (1 pour janvier) et le jour d'une fête qui tombe à la même date chaque année.
     * Omission pour les jours fériés dont la date change chaque année.
     */
    month?: number;
    day?: number;

    /**
     * Les dates (AAAA-MM-JJ, calendrier grégorien) d'une fête dont la date change chaque année, dans l'ordre.
     * Elles sont précalculées pour une période de plusieurs années (actuellement de 2026 à 2125), et les vacances ne sont observées qu'aux dates indiquées.
     * Omission pour les jours fériés qui tombent à la même date chaque année.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * L'identifiant du livre. Par exemple, « PRO ».
     */
    book: string;

    /**
     * Le numéro du chapitre.
     */
    chapter: number;

    /**
     * Le numéro du verset.
     * Si `endVerse` est présent, alors il s'agit du verset par lequel le passage commence.
     */
    verse: number;

    /**
     * Le verset qui conclut le passage.
     * Omis si l'entrée ne comporte qu'un seul verset.
     */
    endVerse?: number;

    /**
     * Les identifiants des catégories auxquelles appartient le verset, des plus pertinentes aux plus rares.
     */
    categories: string[];

    /**
     * La première année où le verset peut être le verset du jour.
     * Omis si le verset a toujours figuré dans la liste.
     */
    addedIn?: number;

    /**
     * La première année où le verset ne peut plus être le verset du jour.
     * Les versets supprimés restent dans l'ensemble de données afin que les versets des années précédentes puissent toujours être sélectionnés.
     * Omis si le verset n'a pas été retiré de la liste.
     */
    removedIn?: number;
}
```

### Exemple

```json:no-line-numbers title="/api/d/verse-of-the-day/verses.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "listOfVersesApiLink": "/api/d/verse-of-the-day/verses.json"
        // ...
    },
    "verses": [
        {
            "book": "GEN",
            "chapter": 1,
            "verse": 1,
            "categories": ["praise"]
        },
        {
            "book": "GEN",
            "chapter": 15,
            "verse": 6,
            "categories": ["faith", "salvation"]
        },
        // ...
        {
            "book": "PRO",
            "chapter": 3,
            "verse": 5,
            "endVerse": 6,
            "categories": ["faith", "guidance", "wisdom"]
        },
        // ...
        {
            "book": "LUK",
            "chapter": 2,
            "verse": 7,
            "categories": ["christmas"]
        }
        // ...
    ],
    "holidays": [
        {
            "id": "christmas",
            "name": "Christmas",
            "month": 12,
            "day": 25
        },
        {
            "id": "good-friday",
            "name": "Good Friday",
            "dates": ["2026-04-03", "2027-03-26", "2028-04-14" /* ... */]
        }
        // ...
    ]
}
```

## Lister les catégories d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Obtient la liste des catégories de versets disponibles pour un ensemble de données.

-   `dataset` l'ID de l'ensemble de données (par exemple `verse-of-the-day` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-categories.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories.json`)
    .then(request => request.json())
    .then(categories => {
        console.log('The dataset has the following categories:', categories.categories);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Informations sur l'ensemble de données pour les catégories.
     */
    dataset: Dataset;

    /**
     * Liste des catégories de versets disponibles pour l'ensemble de données.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * L'identifiant de la catégorie. Par exemple, « espoir ».
     */
    id: string;

    /**
     * Le nom anglais de la catégorie. Par exemple, « Hope » (espoir).
     */
    name: string;

    /**
     * Description du sujet des versets de cette catégorie.
     */
    description: string;

    /**
     * Le nombre de versets (ou de courts passages) qui appartiennent à la catégorie.
     */
    numberOfVerses: number;

    /**
     * Les dates des vacances auxquelles la catégorie se rapporte (voir DatasetCategoryHoliday ci-dessus).
     * Omis pour les catégories qui ne concernent pas une fête.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Lien API pour cette catégorie.
     */
    apiLink: string;
}
```

### Exemple

```json:no-line-numbers title="/api/d/verse-of-the-day/categories.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 31
        // ...
    },
    "categories": [
        {
            "id": "comfort",
            "name": "Comfort",
            "description": "God's nearness and care in grief, trouble, and loneliness.",
            "numberOfVerses": 65,
            "apiLink": "/api/d/verse-of-the-day/categories/comfort.json"
        },
        {
            "id": "courage",
            "name": "Courage",
            "description": "Standing firm and not being afraid.",
            "numberOfVerses": 49,
            "apiLink": "/api/d/verse-of-the-day/categories/courage.json"
        }
        // ...
    ]
}
```

## Extraire une catégorie d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Chaque verset se voit attribuer une seule catégorie, contenant tous les versets qui lui sont associés.

-   `dataset` l'ID de l'ensemble de données (par exemple `verse-of-the-day` ).
-   `category` est l'identifiant de la catégorie (par exemple `hope` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-category.js"
fetch(`https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json`)
    .then(request => request.json())
    .then(category => {
        console.log('Verses about hope:', category.category.verses);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/d/verse-of-the-day/categories/hope.json
```

:::

### Structure

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Informations sur l'ensemble de données pour cette catégorie.
     */
    dataset: Dataset;

    /**
     * La catégorie, avec les versets qui lui appartiennent.
     */
    category: DatasetCategory;

    /**
     * Lien vers l'API pour cette catégorie.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * L'identifiant de la catégorie. Par exemple, « espoir ».
     */
    id: string;

    /**
     * Le nom anglais de la catégorie. Par exemple, « Hope » (espoir).
     */
    name: string;

    /**
     * Description du sujet des versets de cette catégorie.
     */
    description: string;

    /**
     * Les dates de la fête à laquelle la catégorie se rapporte (voir DatasetCategoryHoliday dans « Lister les versets d'un jeu de données »).
     * À ces dates-là, le verset du jour est l'un des versets de la catégorie, et il n'est pas utilisé les autres jours.
     * Omis pour les catégories qui ne concernent pas une fête.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Les versets (ou courts passages) qui appartiennent à cette catégorie, dans l'ordre canonique.
     * Comprend des versets qui ont été retirés de la liste (voir `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * L'identifiant du livre. Par exemple, « JER ».
     */
    book: string;

    /**
     * Le numéro du chapitre.
     */
    chapter: number;

    /**
     * Le numéro du verset.
     * Si `endVerse` est présent, alors il s'agit du verset par lequel le passage commence.
     */
    verse: number;

    /**
     * Le verset qui conclut le passage.
     * Omis si la référence est un seul verset.
     */
    endVerse?: number;

    /**
     * La première année où le verset peut être le verset du jour.
     * Omis si le verset a toujours figuré dans la liste.
     */
    addedIn?: number;

    /**
     * La première année où le verset ne peut plus être le verset du jour.
     * Les versets supprimés restent dans l'ensemble de données afin que les versets des années précédentes puissent toujours être sélectionnés.
     * Omis si le verset n'a pas été retiré de la liste.
     */
    removedIn?: number;
}
```

### Exemple

```json:no-line-numbers title="/api/d/verse-of-the-day/categories/hope.json"
{
    "dataset": {
        "id": "verse-of-the-day",
        "name": "Verse of the Day",
        "totalNumberOfCategories": 31
        // ...
    },
    "category": {
        "id": "hope",
        "name": "Hope",
        "description": "Confidence in the future that God has promised.",
        "verses": [
            {
                "book": "GEN",
                "chapter": 50,
                "verse": 20
            },
            // ...
            {
                "book": "ISA",
                "chapter": 43,
                "verse": 18,
                "endVerse": 19
            },
            {
                "book": "JER",
                "chapter": 29,
                "verse": 11
            }
            // ...
        ]
    },
    "thisCategoryApiLink": "/api/d/verse-of-the-day/categories/hope.json"
}
```
