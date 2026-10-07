# Kumpulan data

Titik akhir untuk menelusuri kumpulan data Alkitab tambahan - seperti referensi silang dan entitas Alkitab (orang, tempat, peristiwa, dan kelompok orang) - dan mengambil kitab, isi bab, dan entitasnya.

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
     */
    totalNumberOfReferences: number;

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

Untuk kumpulan data referensi silang (seperti `open-cross-ref` ), bab tersebut berisi daftar referensi silang untuk setiap ayat. Untuk kumpulan data entitas (seperti `theographic` ), bab tersebut berisi orang, tempat, dan peristiwa yang muncul dalam bab tersebut - lihat [Mendapatkan Entitas dalam Suatu Bab](#get-the-entities-in-a-chapter) .

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

interface DatasetVerse {
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
