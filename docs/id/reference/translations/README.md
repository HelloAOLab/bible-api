# Terjemahan, Buku, & Bab

Endpoint untuk menelusuri terjemahan, menampilkan daftar buku, dan mengambil konten bab.

Konten bab, unduhan terjemahan lengkap, dan anotasi tingkat kata masing-masing tersedia dalam dua format:

-   [**Format standar**](./standard.md) - format asli yang terstruktur. Isi ayat adalah daftar bagian-bagian (teks biasa, teks berformat, referensi catatan kaki, dll.) yang Anda susun sendiri.
-   [**Format sederhana**](./simplified.md) - format yang diratakan di mana isi setiap bait berupa satu untaian tunggal, dengan catatan kaki, puisi, dan penanda lainnya dinyatakan sebagai offset ke dalam untaian tersebut.

Gunakan format mana pun yang paling sesuai dengan cara Anda berencana untuk menampilkan atau memproses teks tersebut.

## Terjemahan yang Tersedia

`GET https://bible.helloao.org/api/available_translations.json`

Mendapatkan daftar terjemahan yang tersedia di API.

### Contoh Kode

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

### Struktur

```typescript:no-line-numbers title="available-translations.ts"
export interface AvailableTranslations {
    /**
     * Daftar terjemahan.
     */
    translations: Translation[];
}

interface Translation {
    /**
     * ID terjemahan.
     */
    id: string;

    /**
     * Nama terjemahannya.
     * Ini biasanya adalah nama terjemahan dalam bahasa terjemahan tersebut.
     */
    name: string;

    /**
     * Nama terjemahan dalam bahasa Inggris.
     */
    englishName: string;

    /**
     * Situs web untuk penerjemahan.
     */
    website: string;

    /**
     * URL tempat lisensi terjemahan dapat ditemukan.
     */
    licenseUrl: string;

    /**
     * Catatan tambahan API untuk lisensi.
     * Null atau undefined jika tidak ada catatan.
     */
    licenseNotes?: string | null;

    /**
     * Pemberitahuan yang harus ditampilkan saat menampilkan konten dari terjemahan.
     * Null atau undefined jika terjemahan tidak memiliki pemberitahuan.
     */
    licenseNotice?: string | null;

    /**
     * Persyaratan lisensi terstruktur yang terdeteksi untuk penerjemahan.
     * Nilai null atau tidak terdefinisi jika istilah-istilah tersebut tidak dapat ditentukan.
     * Dalam hal ini, periksa halaman di licenseUrl untuk mengetahui persyaratannya.
     */
    license?: License | null;

    /**
     * Nama singkat untuk terjemahan tersebut.
     */
    shortName: string;

    /**
     * Tag bahasa ISO 639 3 huruf yang menjadi bahasa utama terjemahan tersebut.
     */
    language: string;

    /**
     * Mendapatkan nama bahasa yang digunakan dalam terjemahan tersebut.
     * Nilai null atau tidak terdefinisi jika nama bahasanya tidak diketahui.
     */
    languageName?: string;

    /**
     * Mendapatkan nama bahasa tersebut dalam bahasa Inggris.
     * Null atau undefined jika bahasa tersebut tidak memiliki nama dalam bahasa Inggris.
     */
    languageEnglishName?: string;

    /**
     * Arah penulisan bahasa tersebut.
     * "ltr" menunjukkan bahwa teks ditulis dari sisi kiri halaman ke kanan.
     * "rtl" menunjukkan bahwa teks ditulis dari sisi kanan halaman ke kiri.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Daftar format yang tersedia.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Tautan API untuk daftar buku yang tersedia untuk terjemahan ini.
     */
    listOfBooksApiLink: string;

    /**
     * Jumlah buku yang terdapat dalam terjemahan ini.
     *
     * Terjemahan lengkap harus memiliki jumlah buku yang sama dengan Alkitab (66).
     */
    numberOfBooks: number;

    /**
     * Jumlah total bab yang terdapat dalam terjemahan ini.
     *
     * Terjemahan lengkap harus memiliki jumlah bab yang sama dengan Alkitab (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * Jumlah total ayat yang terdapat dalam terjemahan ini.
     *
     * Terjemahan lengkap seharusnya memiliki jumlah ayat yang sama dengan Alkitab (sekitar 31.102 - beberapa terjemahan mengecualikan ayat berdasarkan kemungkinan keberadaannya dalam teks sumber asli).
     */
    totalNumberOfVerses: number;

    /**
     * Jumlah total kitab apokrif yang terdapat dalam terjemahan ini.
     * Dihilangkan jika terjemahan tidak menyertakan apokrifa.
     */
    numberOfApocryphalBooks?: number;

    /**
     * Jumlah total bab apokrif yang terdapat dalam terjemahan ini.
     * Dihilangkan jika terjemahan tidak menyertakan apokrifa.
     */
    totalNumberOfApocryphalChapters?: number;

    /**
     * jumlah total ayat apokrif yang terdapat dalam terjemahan ini.
     * Dihilangkan jika terjemahan tidak menyertakan apokrifa.
     */
    totalNumberOfApocryphalVerses?: number;
}

/**
 * Menentukan ketentuan lisensi terstruktur yang terdeteksi untuk suatu terjemahan.
 */
interface License {
    /**
     * Apakah atribusi ke sumber asli diperlukan saat menggunakan terjemahan tersebut.
     */
    attribution: 'required' | 'not-required';

    /**
     * Apakah penggunaan terjemahan untuk tujuan komersial diperbolehkan.
     */
    commercialUse: 'allowed' | 'not-allowed';

    /**
     * Apakah pembuatan dan pendistribusian karya turunan dari terjemahan tersebut diperbolehkan.
     */
    derivatives: 'allowed' | 'not-allowed';

    /**
     * Apakah karya turunan harus didistribusikan di bawah lisensi yang sama (yaitu persyaratan "berbagi serupa").
     */
    copyleft: boolean;

    /**
     * Apakah terjemahan tersebut telah diserahkan ke domain publik.
     */
    publicDomain: boolean;
}
```

### Lisensi

Setiap terjemahan diterbitkan di bawah lisensinya masing-masing, jadi periksa ketentuan terjemahan sebelum Anda menggunakannya.

-   `licenseUrl` selalu menyertakan tautan ke ketentuan lisensi lengkap.
-   `licenseNotice` , jika ada, adalah pemberitahuan hak cipta atau atribusi yang akan ditampilkan di samping konten terjemahan.
-   `licenseNotes` berisi catatan yang ditambahkan oleh API, seperti perubahan yang dilakukan pada teks sumber.
-   `license` , jika ada, akan meringkas istilah-istilah tersebut dalam bentuk yang dapat diperiksa oleh kode Anda. Misalnya, Anda dapat memfilter daftar tersebut hingga terjemahan yang mengizinkan penggunaan komersial:

```ts:no-line-numbers title="commercial-translations.js"
fetch(`https://bible.helloao.org/api/available_translations.json`)
    .then(request => request.json())
    .then(({ translations }) => {
        const commercial = translations.filter(
            t => t.license?.commercialUse === 'allowed'
        );
        console.log('Translations that allow commercial use:', commercial);
    });
```

`license` hanya diatur jika istilah tersebut dapat dideteksi secara otomatis. Terjemahan tanpa angka tersebut mungkin masih memungkinkan Anda untuk menggunakannya, jadi bacalah halaman di `licenseUrl` untuk informasi lebih lanjut.

### Contoh

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

## Daftar Buku Terjemahan

`GET https://bible.helloao.org/api/{translation}/books.json`

Mendapatkan daftar buku yang tersedia untuk terjemahan yang diberikan.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-books.js"
const translation = 'BSB';

// Dapatkan daftar buku untuk terjemahan BSB.
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

### Struktur

```typescript:no-line-numbers title="books.ts"
export interface TranslationBooks {
    /**
     * Informasi terjemahan untuk buku-buku tersebut.
     */
    translation: Translation;

    /**
     * Daftar buku yang tersedia untuk diterjemahkan.
     */
    books: TranslationBook[];
}

interface TranslationBook {
    /**
     * ID buku tersebut.
     */
    id: string;

    /**
     * Nama yang diberikan oleh terjemahan untuk buku tersebut.
     */
    name: string;

    /**
     * Nama umum untuk buku tersebut.
     */
    commonName: string;

    /**
     * Nama pendek (singkatan) yang diberikan terjemahan untuk buku tersebut.
     * Jika tidak tersedia, berarti terjemahan tersebut tidak menyertakannya.
     */
    shortName?: string;

    /**
     * Judul buku tersebut.
     * Ini biasanya merupakan versi judul buku yang lebih deskriptif.
     * Jika tidak tersedia, berarti terjemahan tersebut tidak menyertakannya.
     */
    title: string | null;

    /**
     * Urutan numerik buku dalam terjemahan.
     */
    order: number;

    /**
     * Jumlah bab yang terdapat dalam buku tersebut.
     */
    numberOfChapters: number;

    /**
     * Nomor bab pertama dalam buku tersebut.
     */
    firstChapterNumber: number;

    /**
     * Tautan ke bab pertama buku tersebut.
     */
    firstChapterApiLink: string;

    /**
     * Nomor bab terakhir dalam buku tersebut.
     */
    lastChapterNumber: number;

    /**
     * Tautan ke bab terakhir buku tersebut.
     */
    lastChapterApiLink: string;

    /**
     * Jumlah ayat yang terdapat dalam buku tersebut.
     */
    totalNumberOfVerses: number;

    /**
     * Apakah buku tersebut merupakan buku apokrif.
     * Dihilangkan jika terjemahannya sudah baku.
     */
    isApocryphal?: boolean;
}
```

### Contoh

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
            "shortName": "Gen",
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
