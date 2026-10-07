# Format Sederhana

Format yang disederhanakan untuk bab, unduhan terjemahan lengkap, dan anotasi tingkat kata. Lihat [Terjemahan, Buku, & Bab](./README.md) untuk titik akhir daftar terjemahan dan buku, atau [format standar](./standard.md) untuk representasi terstruktur asli dari konten yang sama ini.

## Dapatkan Bab yang Disederhanakan dari Terjemahan

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`

Mengambil isi satu bab dari buku dan terjemahan tertentu, menggunakan format yang disederhanakan.

Dalam format yang disederhanakan, isi setiap ayat berupa satu string tunggal, bukan daftar konten yang diformat. Ini berarti Anda tidak perlu membuat teks ayat sendiri, yang bisa jadi rumit untuk dilakukan dengan benar - terutama dalam hal spasi. Apa pun yang tidak dapat direpresentasikan oleh string biasa - catatan kaki, Firman Yesus, puisi, dan judul yang muncul di tengah ayat - disimpan sebagai offset ke dalam string tersebut, sehingga tidak ada yang hilang.

Gunakan endpoint ini jika Anda menginginkan teks sebuah bab. Gunakan [endpoint bab biasa](./standard.md#get-a-chapter-from-a-translation) jika Anda ingin menampilkan bab tersebut dengan format aslinya.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian - Anda dapat menemukan daftar ID buku [di sini](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` adalah nomor bab (misalnya `1` untuk bab pertama).

Bab-bab yang memiliki anotasi tingkat kata ditautkan ke bab tersebut dengan `thisChapterWordsLink` , yang mengarah ke [anotasi yang disederhanakan](#get-the-words-of-a-chapter-in-the-simplified-format) - yaitu anotasi yang offset-nya sesuai dengan teks dalam file ini.

Bab yang memiliki pengaturan waktu audio per pembaca ditautkan ke bab tersebut dengan `thisChapterAudioTimings` , yang mengarah ke [titik akhir pengaturan waktu audio](./standard.md#get-the-audio-timings-for-a-chapter) - file yang sama dengan yang ditautkan oleh titik akhir bab biasa, karena pengaturan waktu tidak bergantung pada format bab.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Dapatkan teks Kejadian 1 dari terjemahan BSB.
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

Semua offset dalam format yang disederhanakan - `offset` , `start` , dan `end` - adalah indeks ke dalam `text` dari ayat yang memuatnya. Offset tersebut diukur dalam satuan kode UTF-16, yang juga digunakan oleh JavaScript `String.prototype.length` dan `String.prototype.slice()` .

`start` bersifat inklusif dan `end` bersifat eksklusif, jadi `text.slice(start, end)` mengembalikan tepat rentang teks yang ditandai. Offset catatan kaki adalah posisi pemanggil catatan kaki, jadi `text.slice(0, offset)` adalah teks yang mendahuluinya.

### Struktur

```typescript:no-line-numbers title="simple-chapter.ts"
export interface SimpleTranslationBookChapter {
    /**
     * Informasi terjemahan untuk bab buku tersebut.
     */
    translation: Translation;

    /**
     * Informasi buku untuk bab buku tersebut.
     */
    book: TranslationBook;

    /**
     * Tautan ke bab saat ini.
     */
    thisChapterLink: string;

    /**
     * Tautan ke versi reguler (bukan versi sederhana) dari bab ini.
     */
    fullChapterApiLink: string;

    /**
     * Berikut tautan ke berbagai versi audio untuk bab ini.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Berikut tautan ke pengaturan waktu audio untuk berbagai versi audio bab ini.
     * Lihat "Mendapatkan Pengaturan Waktu Audio untuk Suatu Bab" di dokumen format standar - file pengaturan waktu akan sama terlepas dari format bab mana yang ditautkan kepadanya.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Tautan ke bab berikutnya, dalam format yang disederhanakan.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterApiLink: string | null;

    /**
     * Berikut tautan ke berbagai versi audio untuk bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Berikut tautan ke pengaturan waktu audio untuk berbagai versi audio untuk bab berikutnya.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Tautan ke bab sebelumnya, dalam format yang disederhanakan.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterApiLink: string | null;

    /**
     * Berikut tautan ke berbagai versi audio untuk bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterAudioLinks: TranslationBookChapterAudioLinks | null;

    /**
     * Berikut tautan ke pengaturan waktu audio untuk berbagai versi audio dari bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterAudioTimings: TranslationBookChapterAudioTimingsLinks | null;

    /**
     * Jumlah ayat yang terdapat dalam bab tersebut.
     */
    numberOfVerses: number;

    /**
     * Informasi untuk bab ini.
     */
    chapter: SimpleChapterData;
}

interface SimpleChapterData {
    /**
     * Nomor bab.
     */
    number: number;

    /**
     * Isi bab tersebut.
     */
    content: SimpleChapterContent[];

    /**
     * Daftar catatan kaki yang tidak dapat dikaitkan dengan sebuah ayat.
     * Catatan kaki yang berkaitan dengan suatu ayat disertakan pada ayat itu sendiri, sehingga daftar ini biasanya kosong.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Tipe gabungan yang mewakili satu bagian konten dalam bab yang disederhanakan.
 */
type SimpleChapterContent = SimpleChapterHeading | ChapterLineBreak | SimpleChapterVerse | SimpleChapterHebrewSubtitle;

/**
 * Judul dalam sebuah bab.
 */
interface SimpleChapterHeading {
    /**
     * Menunjukkan bahwa konten tersebut merupakan sebuah judul.
     */
    type: 'heading';

    /**
     * Teks judul.
     */
    text: string;
}

/**
 * Jeda baris dalam sebuah bab.
 */
interface ChapterLineBreak {
    /**
     * Menunjukkan bahwa konten tersebut merupakan jeda baris.
     */
    type: 'line_break';
}

/**
 * Sebuah ayat dalam sebuah pasal.
 */
interface SimpleChapterVerse {
    /**
     * Menunjukkan bahwa isinya adalah sebuah ayat.
     */
    type: 'verse';

    /**
     * Nomor ayat tersebut.
     */
    number: number;

    /**
     * Teks ayat tersebut.
     * Baris-baris puisi dan jeda baris dipisahkan oleh karakter baris baru (\n).
     */
    text: string;

    /**
     * Catatan kaki yang terdapat dalam ayat tersebut.
     */
    footnotes: SimpleVerseFootnote[];

    /**
     * Judul-judul yang muncul di tengah ayat.
     * Dihilangkan jika ayat tersebut tidak mengandung judul sebaris.
     */
    headings?: SimpleInlineHeading[];

    /**
     * Rentang bagian teks ayat yang mewakili Firman Yesus.
     * Dihilangkan jika ayat tersebut tidak memuatnya.
     */
    wordsOfJesus?: SimpleTextRange[];

    /**
     * Rentang teks syair yang mewakili baris-baris puisi.
     * Dihilangkan jika ayat tersebut tidak memuatnya.
     */
    poem?: SimplePoemRange[];
}

/**
 * Subjudul Ibrani dalam sebuah bab.
 * Hal ini seringkali disertakan sebagai konten informatif yang muncul dalam manuskrip asli.
 * Sebagai contoh, Mazmur 49 memiliki subjudul Ibrani "Kepada pemimpin paduan suara. Mazmur dari keturunan Korah."
 */
interface SimpleChapterHebrewSubtitle extends Omit<SimpleChapterVerse, 'type' | 'number'> {
    /**
     * Menunjukkan bahwa konten tersebut merupakan Subjudul Ibrani.
     */
    type: 'hebrew_subtitle';
}

/**
 * Catatan kaki dalam sebuah bait.
 */
interface SimpleVerseFootnote {
    /**
     * ID dari uang kertas tersebut.
     */
    noteId: number;

    /**
     * Indeks dalam teks ayat tempat catatan kaki harus disisipkan.
     */
    offset: number;

    /**
     * Teks catatan kaki.
     */
    text: string;

    /**
     * Penelepon yang harus digunakan untuk catatan kaki.
     * Jika "+", maka pemanggil harus dibuat secara otomatis.
     * Jika null, maka pemanggil harus kosong.
     * Jika berupa string, maka pemanggilnya harus berupa string tersebut.
     */
    caller: '+' | string | null;
}

/**
 * Judul yang disisipkan di dalam sebuah ayat.
 */
interface SimpleInlineHeading {
    /**
     * Indeks dalam teks ayat tempat judul tersebut muncul.
     */
    offset: number;

    /**
     * Teks judul.
     */
    text: string;
}

/**
 * Rentang teks di dalam sebuah ayat.
 */
interface SimpleTextRange {
    /**
     * Indeks karakter pertama dari rentang tersebut.
     */
    start: number;

    /**
     * Indeks setelah karakter terakhir dari rentang tersebut.
     */
    end: number;
}

/**
 * Sejumlah teks di dalam sebuah bait yang mewakili satu baris puisi.
 */
interface SimplePoemRange extends SimpleTextRange {
    /**
     * Tingkat indentasi yang seharusnya digunakan untuk menampilkan baris puisi.
     */
    level: number;
}
```

### Contoh

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

Puisi dan Firman Yesus dipertahankan sebagai rentang di atas teks ayat. Misalnya, `Matthew 5:3` dalam terjemahan `engwebp` terlihat seperti ini:

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

## Dapatkan Ringkasan Kata-kata dalam Satu Bab dalam Format yang Disederhanakan

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.simple.json`

Mendapatkan anotasi tingkat kata untuk satu bab, dengan offset-nya dipetakan ulang ke teks setiap [ayat yang disederhanakan](#get-a-simplified-chapter-from-a-translation) .

Offset dalam [anotasi reguler](./standard.md#get-the-words-of-a-chapter) terikat pada item dari array `content` suatu ayat, yang digantikan oleh format yang disederhanakan dengan satu string tunggal - sehingga tidak dapat digunakan dengannya. Gunakan file ini sebagai gantinya saat Anda mengerjakan bab-bab yang disederhanakan.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian - Anda dapat menemukan daftar ID buku [di sini](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` adalah nomor bab (misalnya `1` untuk bab pertama).

Entri-entri ini tidak memiliki `contentIndex` `start` dan `end` adalah offset ke angka `text` dari ayat tersebut, persis seperti offset catatan kaki, puisi, dan Firman Yesus dalam bab-bab yang disederhanakan, sehingga `text.slice(start, end)` adalah kata yang diberi anotasi.

Sama seperti anotasi biasa, hanya beberapa terjemahan yang memilikinya. Bab yang disederhanakan yang memilikinya akan terhubung ke file ini dengan `thisChapterWordsLink` ; jika properti tersebut tidak ada, file ini tidak ada untuk bab tersebut.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-simple-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Dapatkan teks Kejadian 1 dan kata-kata yang diberi catatan di dalamnya.
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

### Struktur

Strukturnya sesuai dengan [anotasi reguler](./standard.md#get-the-words-of-a-chapter) , kecuali bahwa tautan mengarah ke file yang disederhanakan dan entri tidak memiliki `contentIndex` .

```typescript:no-line-numbers title="simple-words.ts"
export interface SimpleTranslationBookChapterWords {
    /**
     * ID terjemahan.
     */
    translationId: string;

    /**
     * ID buku tersebut.
     */
    bookId: string;

    /**
     * Nomor bab.
     */
    chapterNumber: number;

    /**
     * Berikut tautan ke bab yang disederhanakan yang menjadi acuan anotasi ini.
     */
    thisChapterLink: string;

    /**
     * Tautan ke bab selanjutnya yang disederhanakan.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterLink: string | null;

    /**
     * Tautan ke bab sebelumnya yang telah disederhanakan.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterLink: string | null;

    /**
     * Tautan ke anotasi ini.
     */
    thisChapterWordsLink: string;

    /**
     * Berikut tautan ke anotasi untuk bab berikutnya.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan, atau jika bab berikutnya tidak memiliki anotasi tingkat kata.
     */
    nextChapterWordsLink: string | null;

    /**
     * Tautan ke anotasi untuk bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan, atau jika bab sebelumnya tidak memiliki anotasi tingkat kata.
     */
    previousChapterWordsLink: string | null;

    /**
     * Kata-kata yang diberi keterangan untuk setiap ayat dalam bab tersebut, diurutkan berdasarkan nomor ayat.
     * Setiap daftar disusun sesuai urutan kemunculan kata-kata dalam ayat tersebut.
     */
    verses: {
        [verseNumber: string]: SimpleChapterWord[];
    };
}

/**
 * Anotasi tingkat kata dalam bab yang disederhanakan.
 */
export interface SimpleChapterWord {
    /**
     * Indeks karakter pertama dari kata yang diberi anotasi dalam teks ayat.
     */
    start: number;

    /**
     * Indeks setelah karakter terakhir dari kata yang diberi anotasi dalam teks ayat.
     */
    end: number;

    /**
     * Nomor Strong untuk kata tersebut.
     */
    strongs?: string[];

    /**
     * Lemma (bentuk kamus) dari kata tersebut dalam bahasa sumber.
     */
    lemma?: string;

    /**
     * Morfologi kata dalam bahasa sumber.
     */
    morph?: string;

    /**
     * Lokasi kata tersebut dalam teks sumber.
     */
    srcloc?: string;

    /**
     * Kemunculan kata yang mana dalam ayat ini?
     */
    occurrence?: number;

    /**
     * Jumlah kemunculan kata tersebut dalam ayat.
     */
    occurrences?: number;
}
```

### Contoh

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

Ayat 1 dari pasal itu memiliki teks `"In the beginning was the Word, and the Word was with God, and the Word was God."` , jadi `text.slice(7, 16)` adalah `"beginning"` .

## Dapatkan terjemahan lengkap dalam format yang disederhanakan.

`GET https://bible.helloao.org/api/{translation}/complete.simple.json`

Mengambil isi keseluruhan terjemahan, menggunakan format yang disederhanakan. Ini adalah [format bab yang disederhanakan](#get-a-simplified-chapter-from-a-translation) yang diterapkan pada [unduhan terjemahan lengkap](./standard.md#get-an-entire-translation) : satu file yang berisi seluruh terjemahan, di mana isi setiap ayat berupa satu string tunggal.

Gunakan opsi ini jika Anda menginginkan teks terjemahan lengkap tanpa perlu mengajukan permintaan per bab dan tanpa harus menyusun teks sendiri.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).

Berkas ini dihasilkan bersamaan dengan `complete.json` , jadi terjemahan tersebut bisa memiliki keduanya atau tidak sama sekali. Objek `translation` di kedua berkas berisi `completeTranslationApiLink` dan `simpleCompleteTranslationApiLink` , sehingga Anda dapat berpindah antara kedua format tersebut.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete-simple.js"
const translation = 'BSB';

// Dapatkan teks terjemahan BSB lengkapnya.
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

### Struktur

Strukturnya sama dengan [unduhan terjemahan lengkap biasa](./standard.md#get-an-entire-translation) , kecuali setiap bab menggunakan format yang disederhanakan.

```typescript:no-line-numbers title="complete-simple.ts"
/**
 * Menentukan data unduhan terjemahan lengkap, menggunakan format bab yang disederhanakan.
 * Dipetakan ke endpoint /api/:translationId/complete.simple.json.
 */
export interface SimpleTranslationComplete {
    /**
     * Metadata terjemahan.
     */
    translation: Translation;

    /**
     * Daftar lengkap buku beserta semua babnya.
     */
    books: SimpleTranslationCompleteBook[];
}

/**
 * Unduh buku terjemahan lengkap, menggunakan format bab yang disederhanakan.
 */
export interface SimpleTranslationCompleteBook extends Omit<TranslationCompleteBook, 'chapters'> {
    /**
     * Daftar lengkap bab beserta seluruh isinya.
     */
    chapters: SimpleTranslationCompleteChapter[];
}

/**
 * Sebuah bab dalam unduhan terjemahan lengkap, menggunakan format bab yang disederhanakan.
 */
export interface SimpleTranslationCompleteChapter {
    /**
     * Jumlah ayat yang terdapat dalam bab tersebut.
     */
    numberOfVerses: number;

    /**
     * Berikut tautan ke berbagai versi audio untuk bab ini.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Waktu mulai audio (per ayat, dalam detik) untuk bab tersebut.
     *
     * Perlu dicatat bahwa file terjemahan lengkap berisi pengaturan waktu itu sendiri (lihat TranslationBookChapterAudioTimingsMap di dokumen format standar), tidak seperti titik akhir bab individual yang berisi tautan ke pengaturan waktu tersebut.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Tautan ke anotasi tingkat kata untuk bab tersebut, menggunakan format yang disederhanakan. Dihilangkan jika bab tersebut tidak memiliki anotasi tingkat kata.
     */
    thisChapterWordsLink?: string;

    /**
     * Informasi yang disederhanakan untuk bab ini.
     */
    chapter: SimpleChapterData;
}
```

### Contoh

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
