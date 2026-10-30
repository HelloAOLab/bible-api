# Kumpulan data

Titik akhir untuk menelusuri kumpulan data Alkitab tambahan - seperti referensi silang, entitas Alkitab (orang, tempat, peristiwa, dan kelompok orang), kata-kata interlinear bahasa asli, leksikon, dan kandidat ayat harian - dan mengambil buku, isi bab, entitas, entri leksikon, dan kategori ayatnya.

## Kumpulan Data yang Tersedia

`GET https://bible.helloao.org/api/available_datasets.json`

Mendapatkan daftar dataset Alkitab yang tersedia di API.

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="available-datasets.ts"
export interface AvailableDatasets {
    /**
     * Daftar kumpulan data.
     */
    datasets: Dataset[];
}

export interface Dataset {
    /**
     * ID dari dataset tersebut.
     */
    id: string;

    /**
     * Nama dataset.
     */
    name: string;

    /**
     * Situs web untuk kumpulan data tersebut.
     */
    website: string;

    /**
     * URL tempat lisensi untuk dataset tersebut dapat ditemukan.
     */
    licenseUrl: string;

    /**
     * Catatan tambahan API untuk lisensi.
     * Null atau undefined jika tidak ada catatan.
     */
    licenseNotes?: string | null;

    /**
     * Nama bahasa Inggris untuk dataset tersebut.
     */
    englishName: string;

    /**
     * Tag bahasa ISO 639 3 huruf yang menjadi standar utama dataset ini.
     */
    language: string;

    /**
     * Arah penulisan bahasa tersebut.
     * "ltr" menunjukkan bahwa teks ditulis dari sisi kiri halaman ke kanan.
     * "rtl" menunjukkan bahwa teks ditulis dari sisi kanan halaman ke kiri.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Tautan API untuk daftar buku yang tersedia untuk dataset ini.
     */
    listOfBooksApiLink: string;

    /**
     * Daftar format yang tersedia.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Jumlah buku yang terdapat dalam dataset ini.
     */
    numberOfBooks: number;

    /**
     * Jumlah total bab yang terdapat dalam dataset ini.
     */
    totalNumberOfChapters: number;

    /**
     * Jumlah total ayat yang terdapat dalam dataset ini.
     */
    totalNumberOfVerses: number;

    /**
     * Jumlah total referensi silang yang terdapat dalam dataset ini.
     * 0 untuk dataset yang tidak berisi referensi silang.
     */
    totalNumberOfReferences: number;

    /**
     * Jumlah total kata interlinear yang terdapat dalam dataset ini.
     * Dihilangkan jika dataset tidak mengandung kata-kata interlinear.
     */
    totalNumberOfWords?: number;

    /**
     * Mendapatkan nama bahasa yang digunakan dalam dataset tersebut.
     * Nilai null atau tidak terdefinisi jika nama bahasanya tidak diketahui.
     */
    languageName?: string;

    /**
     * Mendapatkan nama bahasa tersebut dalam bahasa Inggris.
     * Null atau undefined jika bahasa tersebut tidak memiliki nama dalam bahasa Inggris.
     */
    languageEnglishName?: string;

    /**
     * Tautan API untuk daftar entitas dalam dataset.
     * Dihilangkan jika dataset tidak berisi entitas yang sesuai.
     */
    listOfPeopleApiLink?: string;
    listOfPlacesApiLink?: string;
    listOfEventsApiLink?: string;
    listOfPeopleGroupsApiLink?: string;

    /**
     * Jumlah total entitas yang terdapat dalam dataset.
     * Dihilangkan jika dataset tidak berisi entitas yang sesuai.
     */
    totalNumberOfPeople?: number;
    totalNumberOfPlaces?: number;
    totalNumberOfEvents?: number;
    totalNumberOfPeopleGroups?: number;

    /**
     * Tautan API untuk daftar entri leksikon dalam dataset.
     * Dihilangkan jika dataset tidak berisi entri leksikon.
     */
    listOfLexiconApiLink?: string;

    /**
     * Jumlah total entri leksikon yang terdapat dalam dataset.
     * Dihilangkan jika dataset tidak berisi entri leksikon.
     */
    totalNumberOfLexicon?: number;

    /**
     * Tautan API untuk daftar setiap ayat dalam dataset, beserta kategorinya.
     * Dihilangkan jika ayat-ayat dalam dataset tidak memiliki kategori.
     */
    listOfVersesApiLink?: string;

    /**
     * Tautan API untuk daftar kategori ayat dalam dataset.
     * Dihilangkan jika dataset tidak berisi kategori ayat.
     */
    listOfCategoriesApiLink?: string;

    /**
     * Jumlah total kategori ayat yang terdapat dalam dataset.
     * Dihilangkan jika dataset tidak berisi kategori ayat.
     */
    totalNumberOfCategories?: number;
}
```

### Contoh

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

## Daftar Buku dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/books.json`

Mendapatkan daftar buku yang tersedia untuk dataset yang diberikan.

-   `dataset` adalah ID dari dataset (misalnya `open-cross-ref` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-books.js"
const dataset = 'open-cross-ref';

// Dapatkan daftar buku untuk dataset open-cross-ref.
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

### Struktur

```typescript:no-line-numbers title="dataset-books.ts"
export interface DatasetBooks {
    /**
     * Informasi dataset untuk buku-buku tersebut.
     */
    dataset: Dataset;

    /**
     * Daftar buku yang tersedia untuk dataset tersebut.
     */
    books: DatasetBook[];
}

interface DatasetBook {
    /**
     * ID buku tersebut.
     * Sesuai dengan ID buku yang bersangkutan dalam Alkitab (Kejadian, Keluaran, dll.).
     */
    id: string;

    /**
     * Urutan kitab dalam Alkitab.
     */
    order: number;

    /**
     * Nomor bab pertama dalam buku tersebut.
     */
    firstChapterNumber: number;

    /**
     * Tautan ke bab pertama buku tersebut.
     */
    firstChapterApiLink: string | null;

    /**
     * Nomor bab terakhir dalam buku tersebut.
     */
    lastChapterNumber: number | null;

    /**
     * Tautan ke bab terakhir buku tersebut.
     */
    lastChapterApiLink: string | null;

    /**
     * Jumlah bab yang terdapat dalam buku tersebut.
     */
    numberOfChapters: number;

    /**
     * Jumlah ayat yang terdapat dalam buku tersebut.
     */
    totalNumberOfVerses: number;

    /**
     * Jumlah total referensi silang yang terdapat dalam buku ini.
     */
    totalNumberOfReferences: number;
}
```

### Contoh

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

## Ambil Satu Bab dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Mengambil isi dari satu bab dalam buku dan dataset yang diberikan.

Untuk kumpulan data referensi silang (seperti `open-cross-ref` ), bab tersebut berisi daftar referensi silang untuk setiap ayat. Untuk kumpulan data interlinear (seperti `bsb-interlinear` ), bab tersebut berisi kata-kata bahasa asli dari setiap ayat - lihat [Kumpulan Data Interlinear](#interlinear-datasets) . Untuk kumpulan data entitas (seperti `theographic` ), bab tersebut berisi orang, tempat, dan peristiwa yang muncul dalam bab tersebut - lihat [Mendapatkan Entitas dalam Sebuah Bab](#get-the-entities-in-a-chapter) . Untuk kumpulan data `verse-of-the-day` , bab tersebut berisi kandidat ayat harian dalam bab tersebut dan kategorinya - lihat [Ayat Harian](#verse-of-the-day) .

-   `dataset` adalah ID dari dataset (misalnya `open-cross-ref` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian).
-   `chapter` adalah nomor bab numerik (misalnya `1` untuk bab pertama).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-chapter.js"
const dataset = 'open-cross-ref';
const book = 'GEN';
const chapter = 1;

// Dapatkan Kejadian 1 dari dataset referensi silang terbuka.
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

### Struktur

```typescript:no-line-numbers title="dataset-chapter.ts"
export interface DatasetBookChapter {
    /**
     * Informasi dataset untuk bab buku tersebut.
     */
    dataset: Dataset;

    /**
     * Informasi buku untuk bab buku tersebut.
     */
    book: DatasetBook;

    /**
     * Tautan ke bab ini.
     */
    thisChapterLink: string;

    /**
     * Tautan ke bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam dataset.
     */
    nextChapterApiLink: string | null;

    /**
     * Tautan ke bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam dataset.
     */
    previousChapterApiLink: string | null;

    /**
     * Jumlah ayat yang terdapat dalam bab tersebut.
     */
    numberOfVerses: number;

    /**
     * Informasi untuk bab ini.
     */
    chapter: DatasetChapterData;
}

interface DatasetChapterData {
    /**
     * Nomor bab.
     */
    number: number;

    /**
     * Isi bab tersebut.
     */
    content: DatasetVerse[];
}

/**
 * Suatu ayat memiliki nilai `references` (dataset referensi silang), `words` (dataset interlinear), atau `categories` (dataset ayat harian).
 * Periksa mana yang bernilai `'words' in verse` atau `'categories' in verse` .
 */
type DatasetVerse =
    | DatasetReferencesVerse
    | DatasetWordsVerse
    | DatasetCategoriesVerse;

interface DatasetReferencesVerse {
    /**
     * Nomor ayat tersebut.
     */
    verse: number;

    /**
     * Referensi silang untuk ayat tersebut.
     *
     * Diurutkan berdasarkan skor, menurun.
     */
    references: DatasetReference[];
}

interface DatasetWordsVerse {
    /**
     * Nomor ayat tersebut.
     */
    verse: number;

    /**
     * Kata-kata asli dari ayat tersebut, dalam urutan teks aslinya.
     * Lihat "Dataset Interlinear" di bawah ini.
     */
    words: InterlinearWord[];
}

interface DatasetCategoriesVerse {
    /**
     * Nomor ayat tersebut.
     * Jika `endVerse` ada, maka ini adalah ayat tempat bagian tersebut dimulai.
     */
    verse: number;

    /**
     * Ayat yang menjadi penutup bagian tersebut.
     * Dihilangkan jika entri tersebut hanya berupa satu ayat.
     */
    endVerse?: number;

    /**
     * ID kategori tempat ayat tersebut berada, diurutkan dari yang paling relevan terlebih dahulu.
     * Lihat "Ayat Hari Ini" di bawah.
     */
    categories: string[];

    /**
     * Tahun pertama ayat tersebut dapat menjadi ayat harian.
     * Dihilangkan jika ayat tersebut selalu ada dalam daftar.
     */
    addedIn?: number;

    /**
     * Tahun pertama di mana ayat tersebut tidak lagi bisa menjadi ayat harian.
     * Ayat-ayat yang dihapus tetap ada dalam dataset sehingga ayat-ayat dari tahun-tahun sebelumnya masih dapat dipilih.
     * Dihilangkan jika ayat tersebut belum dihapus dari daftar.
     */
    removedIn?: number;
}

interface DatasetReference {
    /**
     * ID buku yang dirujuk.
     */
    book: string;

    /**
     * Nomor bab.
     */
    chapter: number;

    /**
     * Nomor ayat.
     * Jika `endVerse` ada, maka ini adalah ayat tempat referensi dimulai.
     */
    verse: number;

    /**
     * Ayat yang menjadi akhir dari referensi tersebut.
     */
    endVerse?: number;

    /**
     * Skor relevansi untuk referensi tersebut.
     */
    score?: number;
}

// Lihat "Dataset Interlinear" di bawah untuk struktur InterlinearWord.
```

### Contoh

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

## Entitas

Beberapa dataset - seperti dataset [Metadata Alkitab Teografis](https://github.com/robertrouse/theographic-bible-metadata) ( `theographic` ) - berisi entitas: orang, tempat, peristiwa, dan kelompok orang, beserta hubungan antara mereka dan ayat-ayat Alkitab yang menyebutkannya.

Dataset [History Globe](https://historyglobe.app) ( `history-globe` ) hanya berisi tempat: tempat-tempat yang disebutkan dalam Alkitab, dengan koordinat dan ayat-ayat yang menyebutkannya. ID tempatnya (misalnya `a15257a` untuk Yerusalem) adalah ID tempat stabil History Globe, yang sama dengan yang digunakan [oleh API data terbukanya](https://historyglobe.app/docs/api.html) sendiri, sehingga tidak berubah ketika sebuah nama dikoreksi. `featureType` nilainya mengikuti nilai yang digunakan oleh dataset Theographic ( `City` , `Region` , `Water` , dan seterusnya), dan `featureSubType` membawa jenis yang lebih spesifik jika ada (misalnya `River` , `Gate` , `Spring` ).

Kumpulan data yang berisi entitas mencakup `listOfPeopleApiLink` , `listOfPlacesApiLink` , `listOfEventsApiLink` , dan `listOfPeopleGroupsApiLink` properti dalam entri mereka di `/api/available_datasets.json` .

Kumpulan data entitas juga menyediakan data yang diselaraskan dengan bab: `/api/d/{dataset}/books.json` mencantumkan buku-buku yang babnya berisi data entitas, dan `/api/d/{dataset}/{book}/{chapter}.json` mengembalikan orang, tempat, dan peristiwa yang muncul dalam bab tersebut, beserta nomor ayat tempat masing-masing disebutkan. Lihat [Mendapatkan Entitas dalam Suatu Bab](#get-the-entities-in-a-chapter) .

Entitas merujuk pada bagian-bagian Alkitab menggunakan ID buku, nomor bab, dan nomor ayat yang sama dengan bagian API lainnya, sehingga dapat dikombinasikan dengan terjemahan apa pun. Mereka saling merujuk satu sama lain menggunakan referensi entitas:

```typescript:no-line-numbers title="entity-shared.ts"
export interface DatasetEntityRef {
    /**
     * ID dari entitas yang sedang dirujuk.
     */
    id: string;

    /**
     * Tipe entitas yang sedang dirujuk.
     * Sesuai dengan segmen koleksi tautan API entitas, sehingga tautan dapat dibuat sebagai `/api/d/{dataset}/{type}/{id}.json` .
     */
    type: 'people' | 'places' | 'events' | 'groups';

    /**
     * Nama entitas yang dirujuk.
     */
    name?: string;

    /**
     * Tautan API untuk entitas yang sedang dirujuk.
     */
    apiLink?: string;
}

export interface VerseRef {
    /**
     * ID buku tersebut (GEN, EXO, dll.).
     */
    book: string;

    /**
     * Nomor bab tempat referensi dimulai.
     */
    chapter: number;

    /**
     * Nomor ayat tempat referensi dimulai.
     */
    verse: number;

    /**
     * Ayat yang menjadi akhir dari referensi tersebut.
     * Ayat-ayat berurutan dalam bab yang sama digabungkan menjadi satu referensi.
     */
    endVerse?: number;
}
```

### Sejarah Globe Atribusi

Data History Globe dilisensikan di bawah [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Jika Anda menggunakannya, berikan kredit kepada History Globe ( https://historyglobe.app ) dan Data Geocoding Alkitab OpenBible.info yang menjadi dasarnya, dan catat setiap perubahan. Properti `licenseNotes` dari dataset tersebut memuat kredit.

## Dapatkan Entitas dalam Sebuah Bab

`GET https://bible.helloao.org/api/d/{dataset}/{book}/{chapter}.json`

Untuk dataset entitas, fungsi ini mengambil orang, tempat, dan peristiwa yang muncul dalam satu bab, beserta nomor ayat dalam bab tempat masing-masing disebutkan.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian).
-   `chapter` adalah nomor bab numerik (misalnya `1` untuk bab pertama).

Daftar buku dan bab yang memiliki data entitas tersedia dari `GET https://bible.helloao.org/api/d/{dataset}/books.json` , yang mengikuti struktur yang sama dengan [endpoint buku dataset](#list-books-in-a-dataset) . Untuk dataset entitas, `totalNumberOfVerses` adalah jumlah ayat yang disebutkan oleh setidaknya satu entitas dan `totalNumberOfReferences` adalah jumlah total penyebutan entitas-ayat.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-entities.js"
const dataset = 'theographic';
const book = 'GEN';
const chapter = 2;

// Cari tahu orang-orang, tempat-tempat, dan peristiwa-peristiwa yang muncul dalam Kejadian 2.
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

### Struktur

```typescript:no-line-numbers title="dataset-chapter-entities.ts"
export interface DatasetEntityBookChapter {
    /**
     * Informasi dataset untuk bab buku tersebut.
     */
    dataset: Dataset;

    /**
     * Informasi buku untuk bab buku tersebut.
     */
    book: DatasetBook;

    /**
     * Data entitas untuk bab tersebut.
     */
    chapter: DatasetEntityChapterData;

    /**
     * Tautan ke bab ini.
     */
    thisChapterLink: string;

    /**
     * Tautan ke bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam dataset.
     */
    nextChapterApiLink: string | null;

    /**
     * Tautan ke bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam dataset.
     */
    previousChapterApiLink: string | null;

    /**
     * Jumlah orang, tempat, dan peristiwa yang muncul dalam bab tersebut.
     */
    numberOfPeople: number;
    numberOfPlaces: number;
    numberOfEvents: number;
}

interface DatasetEntityChapterData {
    /**
     * Nomor bab.
     */
    number: number;

    /**
     * Orang-orang yang muncul dalam bab tersebut.
     * Diurutkan berdasarkan ayat pertama tempat mereka muncul.
     */
    people: ChapterPerson[];

    /**
     * Tempat-tempat yang muncul dalam bab tersebut.
     * Diurutkan berdasarkan ayat pertama tempat mereka muncul.
     */
    places: ChapterPlace[];

    /**
     * Peristiwa-peristiwa yang muncul dalam bab tersebut.
     * Diurutkan berdasarkan ayat pertama tempat mereka muncul.
     */
    events: ChapterEvent[];
}

interface ChapterPerson {
    /**
     * Identitas orang tersebut.
     */
    id: string;

    /**
     * Nama orang tersebut.
     */
    name: string;

    /**
     * Apakah nama orang tersebut merupakan nama diri.
     */
    isProperName?: boolean;

    /**
     * Jenis kelamin orang tersebut.
     */
    gender?: string;

    /**
     * Tahun kelahiran dan tahun kematian orang tersebut.
     * Angka negatif menunjukkan tahun SM. Angka positif menunjukkan tahun Masehi.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Tautan API untuk orang tersebut.
     */
    apiLink: string;

    /**
     * Nomor-nomor ayat dalam surah tersebut yang menyebutkan nama orang tersebut.
     * Diurutkan dalam urutan menaik.
     */
    verses: number[];
}

interface ChapterPlace {
    /**
     * ID tempat tersebut.
     */
    id: string;

    /**
     * Nama tempat tersebut.
     */
    name: string;

    /**
     * Jenis bentang geografis yang dimiliki tempat tersebut.
     */
    featureType?: string;

    /**
     * Garis lintang dan garis bujur tempat tersebut.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Tautan API untuk tempat tersebut.
     */
    apiLink: string;

    /**
     * Nomor-nomor ayat dalam bab tersebut yang menyebutkan tempat itu.
     * Diurutkan dalam urutan menaik.
     */
    verses: number[];
}

interface ChapterEvent {
    /**
     * ID acara tersebut.
     */
    id: string;

    /**
     * Nama acara tersebut.
     */
    name: string;

    /**
     * Tanggal dimulainya acara tersebut.
     */
    startDate?: string;

    /**
     * Tautan API untuk acara tersebut.
     */
    apiLink: string;

    /**
     * Nomor-nomor ayat dalam pasal yang menggambarkan peristiwa tersebut.
     * Diurutkan dalam urutan menaik.
     */
    verses: number[];
}
```

### Contoh

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

## Daftar Orang dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/people.json`

Mendapatkan daftar orang yang tersedia untuk dataset yang diberikan.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-people.js"
const dataset = 'theographic';

// Dapatkan daftar orang untuk dataset teografis.
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

### Struktur

```typescript:no-line-numbers title="dataset-people.ts"
export interface DatasetPeople {
    /**
     * Informasi dataset untuk orang-orang tersebut.
     */
    dataset: Dataset;

    /**
     * Daftar orang-orang yang tersedia untuk dataset tersebut.
     */
    people: DatasetPersonSummary[];
}

interface DatasetPersonSummary {
    /**
     * Identitas orang tersebut.
     */
    id: string;

    /**
     * Nama orang tersebut.
     */
    name: string;

    /**
     * Apakah nama orang tersebut merupakan nama diri.
     */
    isProperName?: boolean;

    /**
     * Jenis kelamin orang tersebut.
     */
    gender?: string;

    /**
     * Jumlah referensi Alkitab yang menyebutkan orang tersebut.
     */
    numberOfReferences: number;

    /**
     * Tautan API untuk orang tersebut.
     */
    thisPersonApiLink: string;
}
```

### Contoh

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

## Mengambil Seseorang dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/people/{person}.json`

Mengumpulkan informasi tentang satu orang, termasuk referensi Alkitab yang menyebutkan mereka dan hubungan mereka dengan orang lain, tempat, peristiwa, dan kelompok orang.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).
-   `person` adalah ID orang tersebut (misalnya `paul_2479` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-dataset-person.js"
const dataset = 'theographic';
const person = 'paul_2479';

// Dapatkan informasi tentang Paulus dari kumpulan data teografis.
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

### Struktur

```typescript:no-line-numbers title="dataset-person.ts"
export interface DatasetPersonResponse {
    /**
     * Informasi dataset untuk orang tersebut.
     */
    dataset: Dataset;

    /**
     * Informasi tentang orang tersebut.
     */
    person: DatasetPerson;

    /**
     * Tautan API untuk orang ini.
     */
    thisPersonApiLink: string;
}

interface DatasetPerson {
    /**
     * Identitas orang tersebut.
     */
    id: string;

    /**
     * Nama orang tersebut.
     */
    name: string;

    /**
     * Nama lain yang digunakan untuk memanggil orang tersebut.
     */
    alsoCalled?: string[];

    /**
     * Apakah nama orang tersebut merupakan nama diri.
     */
    isProperName?: boolean;

    /**
     * Jenis kelamin orang tersebut.
     */
    gender?: string;

    /**
     * Deskripsi orang tersebut. Setiap string merupakan sebuah paragraf.
     */
    description?: string[];

    /**
     * Tahun kelahiran dan tahun kematian orang tersebut.
     * Angka negatif menunjukkan tahun SM. Angka positif menunjukkan tahun Masehi.
     */
    birthYear?: number;
    deathYear?: number;

    /**
     * Tahun paling awal dan paling akhir di mana orang tersebut disebutkan.
     */
    minYear?: number;
    maxYear?: number;

    /**
     * Tempat kelahiran dan kematian seseorang.
     */
    birthPlace?: DatasetEntityRef;
    deathPlace?: DatasetEntityRef;

    /**
     * Hubungan keluarga orang tersebut.
     */
    father?: DatasetEntityRef[];
    mother?: DatasetEntityRef[];
    partners?: DatasetEntityRef[];
    children?: DatasetEntityRef[];
    siblings?: DatasetEntityRef[];
    halfSiblingsSameMother?: DatasetEntityRef[];
    halfSiblingsSameFather?: DatasetEntityRef[];

    /**
     * Kelompok-kelompok masyarakat tempat orang tersebut menjadi anggotanya.
     */
    memberOf?: DatasetEntityRef[];

    /**
     * Peristiwa-peristiwa yang diikuti oleh orang tersebut.
     */
    events?: DatasetEntityRef[];

    /**
     * Daftar referensi Alkitab yang menyebutkan orang tersebut.
     * Diurutkan berdasarkan urutan buku, bab, dan ayat.
     */
    references: VerseRef[];
}
```

### Contoh

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

## Daftar Tempat dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/places.json`

Mendapatkan daftar tempat yang tersedia untuk dataset yang diberikan.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).

### Struktur

```typescript:no-line-numbers title="dataset-places.ts"
export interface DatasetPlaces {
    /**
     * Informasi dataset untuk tempat-tempat tersebut.
     */
    dataset: Dataset;

    /**
     * Daftar tempat yang tersedia untuk dataset tersebut.
     */
    places: DatasetPlaceSummary[];
}

interface DatasetPlaceSummary {
    /**
     * ID tempat tersebut.
     */
    id: string;

    /**
     * Nama tempat tersebut.
     */
    name: string;

    /**
     * Jenis bentang geografis yang dimiliki tempat tersebut.
     * Sebagai contoh, "Kota", "Wilayah", "Gunung", "Air", dan lain sebagainya.
     */
    featureType?: string;

    /**
     * Garis lintang dan garis bujur tempat tersebut.
     */
    latitude?: number;
    longitude?: number;

    /**
     * Jumlah referensi Alkitab yang menyebutkan tempat tersebut.
     */
    numberOfReferences: number;

    /**
     * Tautan API untuk tempat tersebut.
     */
    thisPlaceApiLink: string;
}
```

## Mendapatkan Lokasi dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/places/{place}.json`

Mendapatkan informasi tentang satu tempat, termasuk referensi Alkitab yang menyebutkan tempat tersebut beserta orang-orang dan peristiwa yang terkait.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).
-   `place` adalah ID tempat tersebut (misalnya `jerusalem_636` ).

### Struktur

```typescript:no-line-numbers title="dataset-place.ts"
export interface DatasetPlaceResponse {
    /**
     * Informasi dataset untuk tempat tersebut.
     */
    dataset: Dataset;

    /**
     * Informasi tentang tempat tersebut.
     */
    place: DatasetPlace;

    /**
     * Tautan API untuk tempat ini.
     */
    thisPlaceApiLink: string;
}

interface DatasetPlace {
    /**
     * ID tempat tersebut.
     */
    id: string;

    /**
     * Nama tempat tersebut.
     */
    name: string;

    /**
     * Nama tempat tersebut sebagaimana tercantum dalam King James Version dan English Standard Version.
     */
    kjvName?: string;
    esvName?: string;

    /**
     * Nama lain yang digunakan untuk menyebut tempat itu.
     */
    aliases?: string[];

    /**
     * Jenis bentang geografis yang dimiliki tempat tersebut.
     */
    featureType?: string;
    featureSubType?: string;

    /**
     * Garis lintang dan garis bujur tempat tersebut, dan seberapa tepatnya angka-angka tersebut.
     */
    latitude?: number;
    longitude?: number;
    precision?: string;

    /**
     * Deskripsi tempat tersebut. Setiap string merupakan sebuah paragraf.
     */
    description?: string[];

    /**
     * Komentar tentang tempat tersebut dari para penulis dataset.
     */
    comment?: string;

    /**
     * Tempat asal mula tempat ini.
     * Nama-nama berbeda untuk lokasi geografis yang sama memiliki akar kata yang sama.
     */
    rootPlace?: DatasetEntityRef;

    /**
     * Tempat yang menjadi duplikat dari tempat ini.
     */
    duplicateOf?: DatasetEntityRef;

    /**
     * Orang-orang yang pernah berada di, lahir di, atau meninggal di tempat tersebut.
     */
    people?: DatasetEntityRef[];
    peopleBorn?: DatasetEntityRef[];
    peopleDied?: DatasetEntityRef[];

    /**
     * Peristiwa-peristiwa yang terjadi di tempat tersebut.
     */
    events?: DatasetEntityRef[];

    /**
     * Daftar referensi Alkitab yang menyebutkan tempat tersebut.
     * Diurutkan berdasarkan urutan buku, bab, dan ayat.
     */
    references: VerseRef[];
}
```

### Contoh

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

## Daftar Peristiwa dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/events.json`

Mendapatkan daftar acara yang tersedia untuk dataset yang diberikan.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).

### Struktur

```typescript:no-line-numbers title="dataset-events.ts"
export interface DatasetEvents {
    /**
     * Informasi dataset untuk peristiwa-peristiwa tersebut.
     */
    dataset: Dataset;

    /**
     * Daftar peristiwa yang tersedia untuk dataset tersebut.
     */
    events: DatasetEventSummary[];
}

interface DatasetEventSummary {
    /**
     * ID acara tersebut.
     */
    id: string;

    /**
     * Nama acara tersebut.
     */
    name: string;

    /**
     * Tanggal dimulainya acara tersebut.
     * Angka negatif menunjukkan tahun SM. Angka positif menunjukkan tahun Masehi.
     * Tanggal yang lebih spesifik menggunakan format `YYYY-MM-DD` .
     */
    startDate?: string;

    /**
     * Jumlah referensi Alkitab yang menggambarkan peristiwa tersebut.
     */
    numberOfReferences: number;

    /**
     * Tautan API untuk acara tersebut.
     */
    thisEventApiLink: string;
}
```

## Mengambil Suatu Peristiwa dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/events/{event}.json`

Mengumpulkan informasi tentang satu peristiwa tunggal, termasuk referensi Alkitab yang menggambarkannya serta orang-orang, tempat, dan kelompok masyarakat yang terkait.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).
-   `event` adalah ID acara (misalnya `saul-is-converted_326` ).

### Struktur

```typescript:no-line-numbers title="dataset-event.ts"
export interface DatasetEventResponse {
    /**
     * Informasi dataset untuk acara tersebut.
     */
    dataset: Dataset;

    /**
     * Informasi mengenai acara tersebut.
     */
    event: DatasetEvent;

    /**
     * Tautan API untuk acara ini.
     */
    thisEventApiLink: string;
}

interface DatasetEvent {
    /**
     * ID acara tersebut.
     */
    id: string;

    /**
     * Nama acara tersebut.
     */
    name: string;

    /**
     * Tanggal dimulainya acara tersebut.
     */
    startDate?: string;

    /**
     * Durasi acara tersebut.
     * Sebagai contoh, "1D" berarti satu hari dan "40Y" berarti empat puluh tahun.
     */
    duration?: string;

    /**
     * Orang-orang yang berpartisipasi dalam acara tersebut.
     */
    participants?: DatasetEntityRef[];

    /**
     * Tempat-tempat di mana peristiwa itu terjadi.
     */
    locations?: DatasetEntityRef[];

    /**
     * Kelompok-kelompok masyarakat yang berpartisipasi dalam acara tersebut.
     */
    groups?: DatasetEntityRef[];

    /**
     * Acara yang menjadi bagian dari acara ini.
     */
    partOf?: DatasetEntityRef;

    /**
     * Peristiwa yang terjadi sebelum peristiwa ini.
     */
    predecessor?: DatasetEntityRef;

    /**
     * Daftar referensi Alkitab yang menjelaskan peristiwa tersebut.
     * Diurutkan berdasarkan urutan buku, bab, dan ayat.
     */
    references: VerseRef[];
}
```

### Contoh

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

## Daftar Kelompok Orang dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/groups.json`

Mendapatkan daftar kelompok masyarakat yang tersedia untuk dataset yang diberikan.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).

### Struktur

```typescript:no-line-numbers title="dataset-people-groups.ts"
export interface DatasetPeopleGroups {
    /**
     * Informasi dataset untuk kelompok-kelompok masyarakat.
     */
    dataset: Dataset;

    /**
     * Daftar kelompok masyarakat yang tersedia untuk dataset ini.
     */
    groups: DatasetPeopleGroupSummary[];
}

interface DatasetPeopleGroupSummary {
    /**
     * Identitas kelompok masyarakat tersebut.
     */
    id: string;

    /**
     * Nama kelompok etnis tersebut.
     */
    name: string;

    /**
     * Jumlah orang yang menjadi anggota kelompok masyarakat tersebut.
     */
    numberOfMembers: number;

    /**
     * Tautan API untuk kelompok masyarakat tersebut.
     */
    thisPeopleGroupApiLink: string;
}
```

## Mendapatkan Kelompok Orang dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/groups/{group}.json`

Mengumpulkan informasi tentang satu kelompok masyarakat, termasuk anggotanya dan peristiwa-peristiwa yang diikuti oleh kelompok tersebut.

-   `dataset` adalah ID dari dataset (misalnya `theographic` ).
-   `group` adalah ID kelompok orang (misalnya `tribe-of-benjamin` ).

### Struktur

```typescript:no-line-numbers title="dataset-people-group.ts"
export interface DatasetPeopleGroupResponse {
    /**
     * Informasi dataset untuk kelompok masyarakat tersebut.
     */
    dataset: Dataset;

    /**
     * Informasi tentang kelompok masyarakat tersebut.
     */
    group: DatasetPeopleGroup;

    /**
     * Tautan API untuk kelompok masyarakat ini.
     */
    thisPeopleGroupApiLink: string;
}

interface DatasetPeopleGroup {
    /**
     * Identitas kelompok masyarakat tersebut.
     */
    id: string;

    /**
     * Nama kelompok etnis tersebut.
     */
    name: string;

    /**
     * Orang-orang yang merupakan anggota dari kelompok masyarakat tersebut.
     */
    members?: DatasetEntityRef[];

    /**
     * Peristiwa-peristiwa yang diikuti oleh kelompok masyarakat tersebut.
     */
    events?: DatasetEntityRef[];

    /**
     * Daftar referensi Alkitab yang menyebutkan kelompok masyarakat tersebut.
     * Diurutkan berdasarkan urutan buku, bab, dan ayat.
     */
    references: VerseRef[];
}
```

### Contoh

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

## Kumpulan Data Interlinear

Dataset interlinear Berean ( `bsb-interlinear` ) mencantumkan kata-kata bahasa asli (Ibrani, Aramaik, dan Yunani) dari setiap ayat Alkitab, sesuai urutan kemunculannya dalam teks asli. Setiap kata memiliki transliterasi, penguraian tata bahasa, [nomor Strong](https://en.wikipedia.org/wiki/Strong%27s_Concordance) , dan frasa bahasa Inggris yang digunakan [Alkitab Standar Berean](https://berean.bible) untuk kata tersebut.

Dataset ini menggunakan endpoint yang sama dengan dataset lainnya:

-   Angka `GET https://bible.helloao.org/api/d/bsb-interlinear/books.json` mencantumkan 66 buku.
-   `GET https://bible.helloao.org/api/d/bsb-interlinear/{book}/{chapter}.json` (misalnya `/api/d/bsb-interlinear/GEN/1.json` ) mengembalikan bab, dengan `{ verse, words }` untuk setiap ayat. Responsnya adalah [kumpulan data bab](#get-a-chapter-from-a-dataset) .

Data kata-kata berasal dari [tabel interlinear Berean Standard Bible](https://bereanbible.com/) , yang berada di domain publik. Nomor Strong untuk kata-kata dicari di [leksikon](#lexicon) ( `stepbible-lexicon` ).

### Struktur

```typescript:no-line-numbers title="interlinear-word.ts"
interface InterlinearWord {
    /**
     * Peringkat kata berdasarkan angka 1 dalam urutan teks asli.
     * Kata-kata tercantum dalam urutan ini.
     */
    pos: number;

    /**
     * Peringkat kata berbasis 1 dalam urutan bahasa Inggris Alkitab Standar Berean.
     */
    bsbPos: number;

    /**
     * Bahasa kata.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Kata dalam naskah asli. Dinormalisasi NFC.
     */
    text: string;

    /**
     * Transliterasi kata tersebut.
     */
    transliteration: string | null;

    /**
     * Kode penguraian tata bahasa singkat dari kata tersebut. Contoh: "N-mp" atau "V-Qal-Perf-3ms".
     */
    parsing: string | null;

    /**
     * Penjelasan tata bahasa lengkap dari kata tersebut.
     */
    parsingFull: string | null;

    /**
     * Nomor Strong dari kata tersebut yang diberi awalan nol. Contoh: "H0430" atau "G3056".
     * Ditambah angka nol di depannya, yang sesuai dengan nilai `.words.json` pada Alkitab King James Version (KJV).
     * Nilai terjemahan lainnya mungkin perlu diisi dengan angka nol dan dihilangkan akhirannya sebelum digabungkan.
     * Bernilai null jika sumber tidak memberikan nomor Strong untuk kata tersebut (ini berlaku untuk beberapa kata yang merupakan sufiks, seperti sufiks kata ganti).
     */
    strongs: string | null;

    /**
     * Frasa bahasa Inggris untuk kata tersebut dalam Berean Standard Bible.
     * Null ketika BSB membiarkan kata tersebut tidak diterjemahkan (seperti penanda objek langsung dalam bahasa Ibrani).
     */
    gloss: string | null;
}
```

### Contoh

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

### Menghubungkan Kata dengan Terjemahan

Nilai `strongs` interlinear diberi nol di depan (misalnya `H0430` ). Ini sesuai dengan nilai `strongs` dalam anotasi kata KJV ( `/api/eng_kjv/{book}/{chapter}.words.json` ). Nilai terjemahan lain mungkin perlu diberi nol di depan dan menghilangkan akhiran (misalnya `H430` atau `H1961a` menjadi `H0430` dan `H1961` ) sebelum dapat digabungkan.

-   **KJV.** Untuk King James Version ( `eng_kjv` dan `eng_kja` ), gabungkan nomor Strong dalam berkas `.words.json` suatu bab dengan `strongs` kata interlinear dari ayat yang sama. Misalnya, setiap nomor Strong yang diberi anotasi di `/api/eng_kjv/GEN/1.words.json` untuk ayat 1 ( `H7225` , `H1254` , `H0430` , `H0853` , `H8064` , `H0776` ) muncul sebagai nilai `strongs` di antara kata-kata ayat 1 di `/api/d/bsb-interlinear/GEN/1.json` .
-   **Alkitab Standar Berean.** Angka `gloss` pada setiap kata adalah frasa BSB untuk kata tersebut. Telusuri kata-kata dalam ayat tersebut dalam urutan `bsbPos` dan cocokkan setiap `gloss` dengan teks ayat dari terjemahan BSB untuk menemukan di mana terjemahan kata tersebut berada.

Penomoran dari kedua sumber tersebut tidak selalu sama. Misalnya, KJV memberi label "was" sebagai `G2258` sedangkan tabel Berea memberi label `G1510` Beberapa penggabungan gagal karena perbedaan seperti ini.

### Atribusi

Tabel interlinear Berean berada dalam domain publik. [Leksikon](#lexicon) ini dilisensikan di bawah CC BY 4.0 dan memerlukan atribusi.

## Kamus

Kumpulan data leksikon STEPBible ( `stepbible-lexicon` ) berisi leksikon singkat Ibrani, Aramaik, dan Yunani (TBESH dan TBESG) dari [STEPBible.org](https://www.stepbible.org/) di Tyndale House, Cambridge. Kumpulan data ini memiliki satu entri untuk setiap nomor Strong dasar, dan setiap entri memiliki satu atau lebih makna dengan lemma, transliterasi, bagian ucapan, glosarium bahasa Inggris, dan definisi.

Nilai `strongs` yang diberi awalan nol dari [kata interlinear](#interlinear-datasets) yang memiliki entri leksikon dapat dicari di `/api/d/stepbible-lexicon/lexicon/{strongs}.json` tanpa perlu pemformatan ulang. Hal yang sama berlaku untuk nilai `.words.json` KJV; nilai terjemahan lain mungkin perlu diberi awalan nol dan penghapusan sufiks terlebih dahulu. Entri bahasa Yunani yang ditambahkan leksikon tanpa nomor Strong tidak dipublikasikan.

Kumpulan data yang berisi entri leksikon menyertakan `listOfLexiconApiLink` dan `totalNumberOfLexicon` dalam entri mereka di `/api/available_datasets.json` .

### Atribusi

Data leksikon ini dilisensikan di bawah [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) . Jika Anda menggunakannya, berikan kredit kepada STEPBible.org / Tyndale House, Cambridge, dan catat setiap perubahan. Hak milik `licenseNotes` dari dataset tersebut mencantumkan kredit.

## Daftar Entri Leksikon dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/lexicon.json`

Mendapatkan daftar entri leksikon yang tersedia untuk suatu dataset.

-   `dataset` adalah ID dari dataset (misalnya `stepbible-lexicon` ).

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="dataset-lexicon.ts"
export interface DatasetLexicon {
    /**
     * Informasi dataset untuk leksikon.
     */
    dataset: Dataset;

    /**
     * Daftar entri leksikon yang tersedia untuk dataset tersebut.
     */
    lexicon: DatasetLexiconEntrySummary[];
}

export interface DatasetLexiconEntrySummary {
    /**
     * Nomor Strong yang diberi awalan nol pada entri leksikon. Contoh: "H0430".
     */
    id: string;

    /**
     * Bahasa dari entri leksikon.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Nama entri leksikon.
     * Ini adalah lemma dari makna pertama entri tersebut.
     */
    name: string;

    /**
     * Tautan API untuk entri leksikon.
     */
    apiLink: string;
}
```

### Contoh

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

## Mendapatkan Entri Leksikon dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/lexicon/{strongs}.json`

Mendapatkan entri leksikon untuk satu nomor Strong dasar, dengan semua maknanya.

-   `dataset` adalah ID dari dataset (misalnya `stepbible-lexicon` ).
-   `strongs` adalah nomor Strong yang diberi awalan nol (misalnya `H0430` untuk kata Ibrani _elohim_, atau `G3056` untuk kata Yunani _logos_).

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="dataset-lexicon-entry.ts"
export interface DatasetLexiconEntry {
    /**
     * Informasi dataset untuk entri leksikon.
     */
    dataset: Dataset;

    /**
     * Entri leksikon.
     */
    entry: DatasetLexiconEntryContent;

    /**
     * Tautan API untuk entri leksikon ini.
     */
    thisLexiconEntryApiLink: string;
}

export interface DatasetLexiconEntryContent {
    /**
     * Nomor Strong entri yang diberi awalan nol. Contoh: "H0430".
     */
    id: string;

    /**
     * Bahasa yang digunakan dalam entri tersebut.
     * Ini adalah bahasa dari makna pertama entri tersebut.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Makna dari entri tersebut, berdasarkan urutan ID.
     */
    senses: DatasetLexiconSense[];
}

export interface DatasetLexiconSense {
    /**
     * ID yang diperluas dari makna tersebut. Contoh: "H0001G".
     * Sama dengan angka Strong dasar ketika angka tersebut memiliki satu makna.
     */
    id: string;

    /**
     * Bahasa indera.
     */
    language: 'hebrew' | 'aramaic' | 'greek';

    /**
     * Lemma dari makna dalam naskah aslinya.
     */
    lemma: string;

    /**
     * Transliterasi lema tersebut.
     */
    transliteration: string | null;

    /**
     * Kode bagian ucapan (morfologi) dari makna tersebut.
     */
    partOfSpeech: string | null;

    /**
     * Penjelasan singkat dalam bahasa Inggris mengenai maknanya.
     */
    gloss: string | null;

    /**
     * Definisi makna sebagaimana tertulis biasa.
     * Paragraf dipisahkan oleh baris kosong. Markup dalam sumber dihilangkan.
     */
    definition: string;
}
```

### Contoh

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

## Ayat Hari Ini

Kumpulan data ayat harian ( `verse-of-the-day` ) adalah daftar pilihan ayat-ayat terkenal dan bagian-bagian pendek (paling banyak tiga ayat) yang menjadi kandidat yang baik untuk "ayat harian": lebih dari 640 untuk setiap hari dalam setahun, dan lebih dari 100 untuk hari raya Kristen. Masing-masing ayat memiliki makna tersendiri.

Setiap ayat untuk setiap hari memiliki satu hingga tiga kategori, yang paling relevan terlebih dahulu, dari kumpulan tetap ini:

| PENGENAL      | Keterangan                                                           |
| ------------- | -------------------------------------------------------------------- |
| `comfort`     | Kedekatan dan perhatian Tuhan di saat duka, kesulitan, dan kesepian. |
| `courage`     | Berdiri teguh dan tidak takut.                                       |
| `faith`       | Percaya kepada Tuhan dan janji-janji-Nya.                            |
| `forgiveness` | Pengampunan dosa oleh Tuhan dan pengampunan terhadap sesama.         |
| `gratitude`   | Mengucap syukur kepada Tuhan.                                        |
| `guidance`    | Tuhan menuntun langkah, rencana, dan keputusan kita.                 |
| `hope`        | Keyakinan akan masa depan yang telah Tuhan janjikan.                 |
| `inspiration` | Dorongan untuk menghayati iman dan berbuat baik.                     |
| `joy`         | Bersukacita dan bergembira di dalam Tuhan.                           |
| `love`        | Kasih Tuhan kepada kita dan kasih kita kepada Tuhan dan sesama.      |
| `peace`       | Istirahat, ketenangan, dan kebebasan dari kecemasan.                 |
| `praise`      | Penyembahan dan pernyataan tentang kebesaran Tuhan.                  |
| `prayer`      | Memohon kepada Tuhan dan janji-Nya untuk didengar.                   |
| `provision`   | Tuhan menyediakan apa yang kita butuhkan.                            |
| `salvation`   | Penebusan, kasih karunia, dan kehidupan baru di dalam Kristus.       |
| `strength`    | Tuhan memberikan kekuatan dan ketahanan.                             |
| `wisdom`      | Hikmat ilahi dan petunjuk praktis untuk kehidupan.                   |

Hari raya memiliki kategori tersendiri. Pada hari raya, ayat harian adalah salah satu ayat hari raya tersebut, dan ayat-ayat tersebut tidak digunakan pada hari-hari lain. Hari raya biasanya berlangsung satu hari; Hari Raya Setelah Minggu Paskah berlangsung selama tiga hari setelah Minggu Paskah, sehingga mencantumkan ketiga tanggal tersebut. Setiap kategori hari raya memiliki angka `holiday` di samping tanggalnya: hari raya yang tanggalnya sama setiap tahun memiliki angka `month` dan `day` , dan hari raya yang tanggalnya berubah setiap tahun (karena bergantung pada Minggu Paskah atau Advent) mencantumkan angka `dates` dalam kalender Gregorian, yang telah dihitung sebelumnya untuk tahun 2026 hingga 2125.

| PENGENAL                   | Hari libur                  | Tanggal                           |
| -------------------------- | --------------------------- | --------------------------------- |
| `epiphany`                 | Epifani                     | 6 Januari                         |
| `ash-wednesday`            | Rabu Abu                    | 46 hari sebelum Minggu Paskah     |
| `palm-sunday`              | hari Minggu sebelum Paskah  | Hari Minggu sebelum Minggu Paskah |
| `maundy-thursday`          | Kamis Putih                 | Hari Kamis sebelum Minggu Paskah  |
| `good-friday`              | Jumat Agung                 | Hari Jumat sebelum Minggu Paskah  |
| `resurrection-sunday`      | Minggu Paskah               | Minggu Paskah                     |
| `post-resurrection-sunday` | Setelah Minggu Paskah       | Tiga hari setelah Minggu Paskah   |
| `ascension-day`            | Hari Kenaikan               | 39 hari setelah Minggu Paskah     |
| `pentecost`                | Pantekosta                  | 49 hari setelah Minggu Paskah     |
| `all-hallows-eve`          | Malam Semua Orang Kudus     | 31 Oktober                        |
| `all-saints-day`           | Hari Raya Semua Orang Kudus | 1 November                        |
| `advent-sunday`            | Minggu Pertama Adven        | Minggu keempat sebelum Natal      |
| `christmas-eve`            | malam Natal                 | 24 Desember                       |
| `christmas`                | Natal                       | 25 Desember                       |

Dataset ini hanya berisi referensi, bukan teks ayat, sehingga dapat digunakan dengan setiap terjemahan. Nomor ayat menggunakan penomoran standar bahasa Inggris (sama seperti BSB). Data dapat dibaca dengan tiga cara:

-   [`/api/d/verse-of-the-day/verses.json`](#list-verses-in-a-dataset) Mencantumkan setiap ayat dalam dataset beserta kategorinya, dan hari raya beserta tanggalnya, dalam satu file.
-   [`/api/d/verse-of-the-day/categories/{category}.json`](#get-a-category-from-a-dataset) Daftar ini mencantumkan setiap ayat dalam suatu kategori. Ini adalah cara termudah untuk memilih ayat harian dari satu kategori.
-   [`/api/d/verse-of-the-day/{book}/{chapter}.json`](#get-a-chapter-from-a-dataset) mencantumkan kandidat dalam sebuah bab, beserta kategorinya. Hanya bab yang memuat kandidat yang tersedia; gunakan tautan bab buku atau `/api/d/verse-of-the-day/books.json` untuk menemukannya.

Kumpulan data yang berisi kategori ayat mencakup `listOfVersesApiLink` , `listOfCategoriesApiLink` , dan `totalNumberOfCategories` dalam entri mereka di `/api/available_datasets.json` .

### Memilih Ayat untuk Hari Ini

API ini terdiri dari file statis, jadi API ini tidak memilih ayat untuk Anda. Sebagai gantinya, ada konvensi untuk memilih satu ayat, sehingga setiap aplikasi yang mengikutinya menampilkan ayat yang sama pada hari yang sama. Aplikasi bebas memilih ayat yang berbeda; konvensi tersebut hanya memberi mereka ayat default yang sama.

Konvensi ini memilih dari ayat-ayat dan hari raya di `/api/d/verse-of-the-day/verses.json` Pada hari raya, ia memilih salah satu ayat hari raya tersebut, menelusurinya satu tahun demi satu tahun, sehingga suatu hari raya memiliki ayat yang berbeda setiap tahun hingga semua ayatnya telah digunakan. Pada hari-hari lain, setiap tahun mendapatkan pengacakan ayat-ayat yang digunakan pada tahun tersebut (diurutkan berdasarkan hash dari referensi setiap ayat, tahun, dan seed opsional), dan ayat hari itu adalah ayat pada hari tanggal tersebut dalam pengacakan tersebut. Dataset ini memiliki lebih dari 366 ayat untuk setiap hari yang digunakan setiap tahun, sehingga sebuah ayat tidak pernah berulang dalam satu tahun kalender, urutannya berubah setiap tahun, dan tanggal yang sama selalu memberikan ayat yang sama. Ayat-ayat baru ditambahkan (dengan `addedIn` ) dan ayat-ayat lama dihapus (dengan `removedIn` ) hanya dari tahun yang belum dimulai, sehingga ayat hari itu untuk tanggal lampau tidak pernah berubah.

Halaman [Konvensi Ayat Hari Ini](./verse-of-the-day-convention.md) menjelaskan algoritma langkah demi langkah, dengan pseudocode dan nilai uji, sehingga Anda dapat mengimplementasikannya dalam bahasa apa pun.

Untuk menggunakan urutan Anda sendiri, pilih seed Anda sendiri (misalnya, nama aplikasi Anda): ini memberikan pengacakan yang berbeda dengan jaminan yang sama. Anda juga dapat memilih dari ayat-ayat dalam satu kategori, tetapi setiap kategori memiliki ayat yang lebih sedikit daripada jumlah hari dalam setahun, sehingga ayat-ayatnya akan berulang lebih cepat.

SDK mengikuti konvensi berikut:

```ts:no-line-numbers title="verse-of-the-day.js"
import { FreeUseBibleApi } from 'free-use-bible-api';

const api = new FreeUseBibleApi();

// Tanggal dalam format YYYY-MM-DD, atau Tanggal (tanggal kalender lokal digunakan). Secara default menggunakan hari ini.
const ref = await api.getVerseOfTheDay('2026-01-01');

// Dapatkan teks ayat tersebut dari terjemahan.
const chapter = await api.getTranslationBookChapter('BSB', ref.book, ref.chapter);
const verses = chapter.chapter.content.filter(
    (c) =>
        c.type === 'verse' &&
        c.number >= ref.verse &&
        c.number <= (ref.endVerse ?? ref.verse)
);
console.log(ref, verses);
```

-   `getVerseOfTheDay(date?, { seed?, category?, dataset? }?)` mengunduh daftar ayat dan memilih dari daftar tersebut. `pickVerseOfTheDay(verses, date?, { seed?, category? }?)` memilih dari daftar yang sudah Anda miliki.
-   Kotlin SDK memiliki `getVerseOfTheDay(date?, seed?, category?)` dan `pickVerseOfTheDay(verses, date?, seed?, category?)` , yang menerima tanggal sebagai string `YYYY-MM-DD` .
-   Swift SDK memiliki `getVerseOfTheDay(date:seed:category:)` dan `pickVerseOfTheDay(_:date:seed:category:holidays:)` , yang menerima tanggal sebagai string `YYYY-MM-DD` atau `Date` (tanggal kalender dalam zona waktu saat ini digunakan).
-   [Server MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) memiliki `getVerseOfTheDay` alat yang menampilkan ayat harian beserta teksnya.
-   Paket `@helloao/tools` memiliki daftar yang sama dan fungsi `getVerseOfTheDay(date?, { seed?, category? }?)` di `@helloao/tools/generation/verse-of-the-day.js` .

### Lisensi

Daftar ini disusun oleh AO Lab dan dirilis di bawah [Lisensi MIT](https://github.com/HelloAOLab/bible-api/blob/main/LICENSE) . Teks ayat berasal dari terjemahan mana pun yang Anda ambil.

## Daftar Ayat dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/verses.json`

Mengambil setiap ayat (atau bagian pendek) dalam sebuah dataset, beserta kategori yang dimiliki masing-masing ayat, dalam urutan kanonik. Hanya tersedia untuk dataset yang ayat-ayatnya memiliki kategori, seperti `verse-of-the-day` .

-   `dataset` adalah ID dari dataset (misalnya `verse-of-the-day` ).

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="dataset-verses.ts"
export interface DatasetVerses {
    /**
     * Informasi dataset untuk ayat-ayat tersebut.
     */
    dataset: Dataset;

    /**
     * Setiap ayat (atau bagian pendek) dalam dataset, beserta kategorinya, dalam urutan kanonik.
     */
    verses: DatasetCategorizedVerse[];

    /**
     * Hari raya yang memiliki ayat-ayat suci tersendiri, beserta tanggalnya.
     * Dihilangkan jika dataset tidak memiliki hari libur.
     */
    holidays?: DatasetVersesHoliday[];
}

export interface DatasetVersesHoliday extends DatasetCategoryHoliday {
    /**
     * ID kategori hari libur tersebut. Contoh: "Natal".
     */
    id: string;

    /**
     * Nama hari raya dalam bahasa Inggris. Contoh: "Christmas".
     */
    name: string;
}

export interface DatasetCategoryHoliday {
    /**
     * Bulan (1 untuk Januari) dan hari libur yang jatuh pada tanggal yang sama setiap tahun.
     * Dihilangkan untuk hari libur yang tanggalnya berubah setiap tahun.
     */
    month?: number;
    day?: number;

    /**
     * Tanggal (YYYY-MM-DD, kalender Gregorian) dari hari libur yang tanggalnya berubah setiap tahun, secara berurutan.
     * Tanggal-tanggal tersebut telah dihitung sebelumnya untuk rentang tahun tertentu (saat ini 2026 hingga 2125), dan hari libur hanya dirayakan pada tanggal-tanggal yang tercantum.
     * Dihilangkan untuk hari libur yang jatuh pada tanggal yang sama setiap tahun.
     */
    dates?: string[];
}

export interface DatasetCategorizedVerse {
    /**
     * ID buku tersebut. Contoh: "PRO".
     */
    book: string;

    /**
     * Nomor bab.
     */
    chapter: number;

    /**
     * Nomor ayat.
     * Jika `endVerse` ada, maka ini adalah ayat tempat bagian tersebut dimulai.
     */
    verse: number;

    /**
     * Ayat yang menjadi penutup bagian tersebut.
     * Dihilangkan jika entri tersebut hanya berupa satu ayat.
     */
    endVerse?: number;

    /**
     * ID kategori tempat ayat tersebut berada, diurutkan dari yang paling relevan terlebih dahulu.
     */
    categories: string[];

    /**
     * Tahun pertama ayat tersebut dapat menjadi ayat harian.
     * Dihilangkan jika ayat tersebut selalu ada dalam daftar.
     */
    addedIn?: number;

    /**
     * Tahun pertama di mana ayat tersebut tidak lagi bisa menjadi ayat harian.
     * Ayat-ayat yang dihapus tetap ada dalam dataset sehingga ayat-ayat dari tahun-tahun sebelumnya masih dapat dipilih.
     * Dihilangkan jika ayat tersebut belum dihapus dari daftar.
     */
    removedIn?: number;
}
```

### Contoh

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

## Daftar Kategori dalam Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/categories.json`

Mendapatkan daftar kategori ayat yang tersedia untuk suatu dataset.

-   `dataset` adalah ID dari dataset (misalnya `verse-of-the-day` ).

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="dataset-categories.ts"
export interface DatasetCategories {
    /**
     * Informasi dataset untuk setiap kategori.
     */
    dataset: Dataset;

    /**
     * Daftar kategori ayat yang tersedia untuk dataset.
     */
    categories: DatasetCategorySummary[];
}

export interface DatasetCategorySummary {
    /**
     * ID kategori. Contoh: "harapan".
     */
    id: string;

    /**
     * Nama kategori dalam bahasa Inggris. Contoh: "Harapan".
     */
    name: string;

    /**
     * Deskripsi tentang isi ayat-ayat dalam kategori tersebut.
     */
    description: string;

    /**
     * Jumlah ayat (atau bagian pendek) yang termasuk dalam kategori tersebut.
     */
    numberOfVerses: number;

    /**
     * Tanggal liburan yang terkait dengan kategori tersebut (lihat DatasetCategoryHoliday di atas).
     * Dihilangkan untuk kategori yang bukan untuk hari libur.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Tautan API untuk kategori tersebut.
     */
    apiLink: string;
}
```

### Contoh

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

## Mengambil Kategori dari Kumpulan Data

`GET https://bible.helloao.org/api/d/{dataset}/categories/{category}.json`

Mendapatkan satu kategori ayat, dengan setiap ayat yang termasuk di dalamnya.

-   `dataset` adalah ID dari dataset (misalnya `verse-of-the-day` ).
-   `category` adalah ID kategori (misalnya `hope` ).

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="dataset-category.ts"
export interface DatasetCategoryResponse {
    /**
     * Informasi dataset untuk kategori tersebut.
     */
    dataset: Dataset;

    /**
     * Kategori tersebut, beserta ayat-ayat yang termasuk di dalamnya.
     */
    category: DatasetCategory;

    /**
     * Tautan API untuk kategori ini.
     */
    thisCategoryApiLink: string;
}

export interface DatasetCategory {
    /**
     * ID kategori. Contoh: "harapan".
     */
    id: string;

    /**
     * Nama kategori dalam bahasa Inggris. Contoh: "Harapan".
     */
    name: string;

    /**
     * Deskripsi tentang isi ayat-ayat dalam kategori tersebut.
     */
    description: string;

    /**
     * Tanggal hari raya yang menjadi kategori tersebut (lihat DatasetCategoryHoliday di "Daftar Ayat dalam Kumpulan Data").
     * Pada tanggal-tanggal tersebut, ayat harian adalah salah satu ayat dari kategori tersebut, dan ayat-ayat tersebut tidak digunakan pada hari-hari lainnya.
     * Dihilangkan untuk kategori yang bukan untuk hari libur.
     */
    holiday?: DatasetCategoryHoliday;

    /**
     * Ayat-ayat (atau bagian pendek) yang termasuk dalam kategori tersebut, dalam urutan kanonik.
     * Termasuk ayat-ayat yang telah dihapus dari daftar (lihat `removedIn` ).
     */
    verses: DatasetCategoryVerse[];
}

export interface DatasetCategoryVerse {
    /**
     * ID buku tersebut. Contoh: "JER".
     */
    book: string;

    /**
     * Nomor bab.
     */
    chapter: number;

    /**
     * Nomor ayat.
     * Jika `endVerse` ada, maka ini adalah ayat tempat bagian tersebut dimulai.
     */
    verse: number;

    /**
     * Ayat yang menjadi penutup bagian tersebut.
     * Dihilangkan jika referensinya hanya satu ayat.
     */
    endVerse?: number;

    /**
     * Tahun pertama ayat tersebut dapat menjadi ayat harian.
     * Dihilangkan jika ayat tersebut selalu ada dalam daftar.
     */
    addedIn?: number;

    /**
     * Tahun pertama di mana ayat tersebut tidak lagi bisa menjadi ayat harian.
     * Ayat-ayat yang dihapus tetap ada dalam dataset sehingga ayat-ayat dari tahun-tahun sebelumnya masih dapat dipilih.
     * Dihilangkan jika ayat tersebut belum dihapus dari daftar.
     */
    removedIn?: number;
}
```

### Contoh

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
