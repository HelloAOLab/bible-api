# Traductions, livres et chapitres

Points d'accès pour parcourir les traductions, consulter la liste des livres et récupérer le contenu des chapitres.

Le contenu des chapitres, les téléchargements de traductions complètes et les annotations au niveau du mot sont disponibles chacun en deux formats :

-   [**Format standard**](./standard.md) — le format original et structuré. Le contenu du poème est une liste d’éléments (texte brut, texte formaté, notes de bas de page, etc.) que vous assemblez vous-même.
-   [**Format simplifié**](./simplified.md) - un format aplati où le contenu de chaque verset est une seule chaîne de caractères, les notes de bas de page, la poésie et autres balises étant exprimées sous forme de décalages dans cette chaîne.

Utilisez le format qui correspond le mieux à la façon dont vous prévoyez de rendre ou de traiter le texte.

## Traductions disponibles

`GET https://bible.helloao.org/api/available_translations.json`

Obtient la liste des traductions disponibles dans l'API.

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(availableTranslations => {
        console.log('The API has the following translations:', availableTranslations);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_translations.json
```

:::

### Structure

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * La liste des traductions.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * L'identifiant de la traduction.
     */
    id: string;

    /**
     * Le nom de la traduction.
     * Il s'agit généralement du nom de la traduction dans la langue de la traduction.
     */
    name: string;

    /**
     * Le nom anglais de la traduction.
     */
    englishName: string;

    /**
     * Le site web de la traduction.
     */
    website: string;

    /**
     * L'URL où se trouve la licence de la traduction.
     */
    licenseUrl: string;

    /**
     * Nom abrégé de la traduction.
     */
    shortName: string;

    /**
     * L'étiquette de langue ISO 639 à 3 lettres dans laquelle se trouve principalement la traduction.
     */
    language: string;

    /**
     * Obtient le nom de la langue dans laquelle se trouve la traduction.
     * Valeur nulle ou indéfinie si le nom de la langue est inconnu.
     */
    languageName?: string;

    /**
     * Obtient le nom de la langue en anglais.
     * Valeur nulle ou indéfinie si la langue n'a pas de nom en anglais.
     */
    languageEnglishName?: string;

    /**
     * Le sens dans lequel la langue est écrite.
     * « ltr » indique que le texte est écrit de gauche à droite sur la page.
     * « rtl » indique que le texte est écrit de la droite vers la gauche.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Liste des formats disponibles.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Lien API vers la liste des livres disponibles pour cette traduction.
     */
    listOfBooksApiLink: string;

    /**
     * Le nombre de livres contenus dans cette traduction.
     *
     * Les traductions complètes devraient comporter le même nombre de livres que la Bible (66).
     */
    numberOfBooks: number;

    /**
     * Le nombre total de chapitres contenus dans cette traduction.
     *
     * Les traductions complètes devraient avoir le même nombre de chapitres que la Bible (1 189).
     */
    totalNumberOfChapters: number;

    /**
     * Le nombre total de versets contenus dans cette traduction.
     *
     * Les traductions complètes devraient avoir le même nombre de versets que la Bible (environ 31 102 - certaines traductions excluent des versets en fonction de la probabilité apparente de leur existence dans les textes sources originaux).
     */
    totalNumberOfVerses: number;

    /**
     * Le nombre total de livres apocryphes contenus dans cette traduction.
     * Omis si la traduction n'inclut pas les apocryphes.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Le nombre total de chapitres apocryphes contenus dans cette traduction.
     * Omis si la traduction n'inclut pas les apocryphes.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * le nombre total de versets apocryphes contenus dans cette traduction.
     * Omis si la traduction n'inclut pas les apocryphes.
     */
    totalNumberOfApocryphalVerses?: number;
}
```

### Exemple

```json:no-line-numbers title="/api/available_translations.json"
{
    "translations": [
        {
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
        }
    ]
}
```

## Liste de livres en traduction

`GET https://bible.helloao.org/api/{translation}/books.json`

Obtient la liste des livres disponibles pour la traduction donnée.

-   `translation` est l'ID de la traduction (ex `BSB` ).

### Exemple de code

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Obtenez la liste des livres pour la traduction BSB
fetch(`https://bible.helloao.org/api/${translation}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The BSB has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/BSB/books.json
```

:::

### Structure

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Informations sur la traduction des livres.
     */
    translation: Translation;

    /**
     * Liste des ouvrages disponibles pour la traduction.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * L'identifiant du livre.
     */
    id: string;

    /**
     * Le nom que la traduction a donné au livre.
     */
    name: string;

    /**
     * Le nom commun du livre.
     */
    commonName: string;

    /**
     * Le titre du livre.
     * Il s'agit généralement d'une version plus descriptive du titre du livre.
     * Si elle n'est pas disponible, c'est qu'elle n'a pas été fournie par la traduction.
     */
    title: string | null;

    /**
     * L'ordre numérique du livre dans la traduction.
     */
    order: number;

    /**
     * Le nombre de chapitres que contient le livre.
     */
    numberOfChapters: number;

    /**
     * Le numéro du premier chapitre du livre.
     */
    firstChapterNumber: number;

    /**
     * Le lien vers le premier chapitre du livre.
     */
    firstChapterApiLink: string;

    /**
     * Le numéro du dernier chapitre du livre.
     */
    lastChapterNumber: number;

    /**
     * Le lien vers le dernier chapitre du livre.
     */
    lastChapterApiLink: string;

    /**
     * Le nombre de versets que contient le livre.
     */
    totalNumberOfVerses: number;

    /**
     * Que le livre soit apocryphe.
     * Omis si la traduction est canonique.
     */
    isApocryphal?: boolean;
}
```

### Exemple

```json:no-line-numbers title="/api/BSB/books.json"
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
    "books": [
        {
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
    ]
}
```
