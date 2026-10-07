# Ensembles de données

Points d'accès pour parcourir des ensembles de données bibliques supplémentaires - tels que les références croisées et les entités bibliques (personnes, lieux, événements et groupes de personnes) - et récupérer leurs livres, le contenu de leurs chapitres et leurs entités.

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
     */
    totalNumberOfReferences: number;

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
        }
    ]
}
```

## Lister les livres d'un ensemble de données

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Obtient la liste des livres disponibles pour l'ensemble de données donné.

-   `dataset` l'ID de l'ensemble de données (par exemple `open-cross-ref` ).

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

Pour les ensembles de données de références croisées (comme `open-cross-ref` ), le chapitre contient la liste des références croisées pour chaque verset. Pour les ensembles de données d'entités (comme `theographic` ), le chapitre contient les personnes, les lieux et les événements qui y apparaissent ; voir [« Obtenir les entités d'un chapitre »](#get-the-entities-in-a-chapter) .

-   `dataset` l'ID de l'ensemble de données (par exemple `open-cross-ref` ).
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

interface DatasetVerse {
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

## Obtenez les entités d'un chapitre

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Pour les ensembles de données d'entités, récupère les personnes, les lieux et les événements qui apparaissent dans un seul chapitre, ainsi que les numéros de versets du chapitre où chacun est mentionné.

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).
-   `book` correspond à l'identifiant du livre (par exemple `GEN` pour la Genèse).
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

-   `dataset` l'ID de l'ensemble de données (par exemple `theographic` ).
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
