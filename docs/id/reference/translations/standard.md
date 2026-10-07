# Format Standar

Format standar untuk bab, unduhan terjemahan lengkap, dan anotasi tingkat kata. Lihat [Terjemahan, Buku, & Bab](./README.md) untuk titik akhir daftar terjemahan dan buku, atau [format yang disederhanakan](./simplified.md) untuk representasi alternatif dari konten yang sama ini.

## Dapatkan Satu Bab dari Terjemahan

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.json`

Mengambil isi dari satu bab dalam buku dan terjemahan tertentu.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian - Anda dapat menemukan daftar ID buku [di sini](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` adalah nomor bab (misalnya `1` untuk bab pertama).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Dapatkan Kejadian 1 dari terjemahan BSB.
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

### Struktur

```typescript:no-line-numbers title="chapter.ts"
export interface TranslationBookChapter {
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
     * Berikut tautan ke berbagai versi audio untuk bab ini.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Berikut tautan ke pengaturan waktu audio untuk berbagai versi audio bab ini.
     * Setiap tautan mengarah ke file pengaturan waktu audio untuk pembaca tersebut - lihat "Dapatkan Pengaturan Waktu Audio untuk Sebuah Bab" di bawah.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsLinks;

    /**
     * Tautan ke bab selanjutnya.
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
     * Tautan ke bab sebelumnya.
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
     * Tautan ke anotasi tingkat kata untuk bab tersebut.
     * Dihilangkan jika bab tersebut tidak memiliki anotasi tingkat kata.
     */
    thisChapterWordsLink?: string;

    /**
     * Berikut tautan ke anotasi tingkat kata untuk bab berikutnya.
     * Dihilangkan jika ini adalah bab terakhir dalam terjemahan, atau jika bab berikutnya tidak memiliki anotasi tingkat kata.
     */
    nextChapterWordsLink?: string;

    /**
     * Tautan ke anotasi tingkat kata untuk bab sebelumnya.
     * Dihilangkan jika ini adalah bab pertama dalam terjemahan, atau jika bab sebelumnya tidak memiliki anotasi tingkat kata.
     */
    previousChapterWordsLink?: string;

    /**
     * Jumlah ayat yang terdapat dalam bab tersebut.
     */
    numberOfVerses: number;

    /**
     * Berikut tautan ke versi ringkas bab ini.
     * Dihilangkan jika bab yang disederhanakan tidak tersedia.
     */
    simpleChapterApiLink?: string;

    /**
     * Informasi untuk bab ini.
     */
    chapter: ChapterData;
}

interface ChapterData {
    /**
     * Nomor bab.
     */
    number: number;

    /**
     * Isi bab tersebut.
     */
    content: ChapterContent[];

    /**
     * Daftar catatan kaki untuk bab tersebut.
     */
    footnotes: ChapterFootnote[];
}

/**
 * Tipe gabungan yang mewakili satu bagian konten bab.
 * Salah satu isi bab dapat berupa hal-hal berikut:
 * - Sebuah judul.
 * - Pemutusan baris.
 * - Sebuah ayat.
 * - Subjudul Bahasa Ibrani.
 */
type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * Judul dalam sebuah bab.
 */
interface ChapterHeading {
    /**
     * Menunjukkan bahwa konten tersebut merupakan sebuah judul.
     */
    type: 'heading';

    /**
     * Isi untuk judul.
     * Jika terdapat beberapa string dalam array, string tersebut harus digabungkan dengan spasi.
     */
    content: string[];
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
 * Subjudul Ibrani dalam sebuah bab.
 * Ini sering digunakan sebagai konten informatif yang muncul dalam manuskrip asli.
 * Sebagai contoh, Mazmur 49 memiliki subjudul Ibrani "Kepada pemimpin paduan suara. Mazmur dari keturunan Korah."
 */
interface ChapterHebrewSubtitle {
    /**
     * Menunjukkan bahwa konten tersebut merupakan Subjudul Ibrani.
     */
    type: 'hebrew_subtitle';

    /**
     * Daftar isi yang terdapat dalam subjudul.
     * Setiap elemen dalam daftar dapat berupa string, teks yang diformat, atau referensi catatan kaki.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * Sebuah ayat dalam sebuah pasal.
 */
interface ChapterVerse {
    /**
     * Menunjukkan bahwa isinya adalah sebuah ayat.
     */
    type: 'verse';

    /**
     * Nomor ayat tersebut.
     */
    number: number;

    /**
     * Daftar isi ayat tersebut.
     * Setiap elemen dalam daftar dapat berupa string, teks yang diformat, atau referensi catatan kaki.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Teks yang diformat. Yaitu, teks yang diformat dengan cara tertentu.
 */
interface FormattedText {
    /**
     * Teks yang telah diformat.
     */
    text: string;

    /**
     * Apakah teks tersebut merupakan sebuah puisi.
     * Angka tersebut menunjukkan tingkat indentasi.
     *
     * Umum ditemukan dalam Kitab Mazmur.
     */
    poem?: number;

    /**
     * Apakah teks tersebut mewakili perkataan Yesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Mendefinisikan antarmuka yang mewakili judul yang tertanam dalam sebuah ayat.
 */
interface InlineHeading {
    /**
     * Teks judul.
     */
    heading: string;
}

/**
 * Mendefinisikan antarmuka yang mewakili jeda baris yang tertanam dalam sebuah ayat.
 */
interface InlineLineBreak {
    lineBreak: true;
}


/**
 * Referensi catatan kaki dalam sebuah ayat atau subjudul Ibrani.
 */
interface VerseFootnoteReference {
    /**
     * ID dari uang kertas tersebut.
     */
    noteId: number;
}

/**
 * Informasi tentang catatan kaki.
 */
interface ChapterFootnote {
    /**
     * ID dari catatan yang dirujuk.
     */
    noteId: number;

    /**
     * Teks catatan kaki.
     */
    text: string;

    /**
     * Referensi ayat untuk catatan kaki.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * Penelepon yang harus digunakan untuk catatan kaki.
     * Untuk catatan kaki, "penanda" adalah karakter yang digunakan dalam teks untuk merujuk ke catatan kaki.
     *
     * Misalnya, dalam teks:
     * Halo (a) Dunia
     *
     * ---- (a) Ini adalah catatan kaki.
     *
     * "(a)" adalah pemanggil.
     *
     * Jika "+", maka pemanggil harus dibuat secara otomatis.
     * Jika null, maka pemanggil harus kosong.
     * Jika berupa string, maka pemanggilnya harus berupa string tersebut.
     */
    caller: '+' | string | null;
}

/**
 * Tautan audio untuk sebuah bab buku.
 */
interface TranslationBookChapterAudioLinks {
    /**
     * Teks bacaan untuk bab tersebut dan tautan URL ke file audio.
     */
    [reader: string]: string;
}

/**
 * Tautan pengaturan waktu audio untuk sebuah bab buku.
 */
interface TranslationBookChapterAudioTimingsLinks {
    /**
     * Informasi pembaca untuk bab tersebut dan tautan API ke file pengaturan waktu audio untuk pembaca tersebut.
     */
    [reader: string]: string;
}
```

### Contoh

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

## Dapatkan Pengaturan Waktu Audio untuk Suatu Bab

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json`

Mendapatkan waktu audio per ayat untuk satu bab, untuk narasi satu pembaca — yaitu, waktu (dalam detik, relatif terhadap awal file audio pembaca tersebut) di mana setiap ayat dimulai. Klien dapat menggunakan ini untuk menyoroti ayat yang sedang dibaca saat audio diputar.

Hanya beberapa terjemahan dan pembaca yang memiliki pengaturan waktu audio. Bab yang memilikinya untuk seorang pembaca terhubung ke file ini dengan entri di `thisChapterAudioTimings` , yang dikunci oleh ID pembaca tersebut; ketika seorang pembaca bukan kunci dalam peta tersebut, file ini tidak ada untuk pembaca dan bab tersebut.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian - Anda dapat menemukan daftar ID buku [di sini](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` adalah nomor bab (misalnya `1` untuk bab pertama).
-   `reader` adalah ID pembaca yang narasinya diatur waktunya (misalnya `hays` ) - pembaca yang tersedia untuk suatu bab adalah kunci dari `thisChapterAudioLinks` .

Akhir sebuah ayat adalah awal dari ayat berikutnya (atau, untuk ayat terakhir, akhir dari file audio), sehingga klien tidak memerlukan apa pun selain daftar waktu mulai yang terurut untuk membuat rentang penyorotan untuk seluruh bab.

Berkas ini sama terlepas dari apakah diakses dari titik akhir bab reguler atau [yang disederhanakan](./simplified.md#get-a-simplified-chapter-from-a-translation) - hanya ada satu set pengaturan waktu per terjemahan, buku, bab, dan pembaca.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-audio-timings.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;
const reader = 'hays';

// Dapatkan pengaturan waktu audio untuk Kejadian 1 (BSB), seperti yang dibacakan oleh "hays"
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

### Struktur

```typescript:no-line-numbers title="chapter-audio-timings.ts"
/**
 * Menentukan pengaturan waktu audio untuk satu bab buku, untuk satu pembaca.
 * Dipetakan ke endpoint /api/{translation}/{book}/{chapter}.{reader}.audioTimings.json.
 */
export interface TranslationBookChapterAudioTimings {
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
     * ID pembaca yang digunakan untuk pengukuran waktu ini.
     */
    reader: string;

    /**
     * Berikut tautan ke file audio yang berisi pengaturan waktu ini.
     */
    audioLink: string;

    /**
     * Berikut tautan ke informasi untuk bab ini.
     */
    thisChapterLink: string;

    /**
     * Berikut tautan ke informasi untuk bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterLink: string | null;

    /**
     * Tautan ke informasi untuk bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterLink: string | null;

    /**
     * Berikut tautan ke file pengaturan waktu audio ini.
     */
    thisChapterAudioTimingsLink: string;

    /**
     * Berikut tautan ke jadwal untuk bab berikutnya, untuk pembaca yang sama.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterAudioTimingsLink: string | null;

    /**
     * Berikut tautan ke jadwal untuk bab sebelumnya, untuk pembaca yang sama.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterAudioTimingsLink: string | null;

    /**
     * Waktu dalam detik saat setiap bait dimulai, secara berurutan.
     * Angka pertama (indeks 0) adalah waktu dalam rekaman saat bait pertama dimulai.
     */
    verses: number[];
}
```

### Contoh

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

`verses[0]` adalah waktu mulai ayat 1, `verses[1]` adalah waktu mulai ayat 2, dan seterusnya - jadi dalam contoh ini, ayat 2 dari Kejadian 1 (BSB, seperti yang dibaca oleh "hays") dimulai 4,32 detik ke dalam `audioLink` .

## Dapatkan Kata-kata dari Sebuah Bab

`GET https://bible.helloao.org/api/{translation}/{book}/{chapter}.words.json`

Mendapatkan anotasi tingkat kata (nomor Strong dan data sumber terkait) untuk satu bab.

Hanya beberapa terjemahan yang menyertakan anotasi tingkat kata. Bab yang memilikinya akan terhubung ke file ini dengan `thisChapterWordsLink` ; jika properti tersebut tidak ada, file ini tidak ada untuk bab tersebut.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian - Anda dapat menemukan daftar ID buku [di sini](https://ubsicap.github.io/usfm/identification/books.html) ).
-   `chapter` adalah nomor bab (misalnya `1` untuk bab pertama).

Setiap anotasi terikat pada rentang karakter dalam satu item dari larik `content` suatu ayat: `contentIndex` adalah indeks item tersebut, dan `start` adalah offset karakter ke `end` teks item tersebut. `end` bersifat eksklusif, sehingga `text.slice(start, end)` adalah kata yang diberi anotasi.

Dengan mengaitkan ke item konten (bukan ke ayat secara keseluruhan), offset tetap akurat untuk ayat-ayat yang kontennya terbagi menjadi beberapa item, seperti baris puisi, kata-kata Yesus, dan referensi catatan kaki.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-chapter-words.js"
const translation = 'BSB';
const book = 'GEN';
const chapter = 1;

// Dapatkan kata-kata untuk Kejadian 1 dari terjemahan BSB.
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

### Struktur

```typescript:no-line-numbers title="chapter-words.ts"
export interface TranslationBookChapterWords {
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
     * Berikut tautan ke informasi untuk bab ini.
     */
    thisChapterLink: string;

    /**
     * Berikut tautan ke informasi untuk bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan.
     */
    nextChapterLink: string | null;

    /**
     * Tautan ke informasi untuk bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan.
     */
    previousChapterLink: string | null;

    /**
     * Tautan ke berkas kata-kata ini.
     */
    thisChapterWordsLink: string;

    /**
     * Tautan ke kata-kata untuk bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam terjemahan, atau jika bab berikutnya tidak memiliki anotasi tingkat kata.
     */
    nextChapterWordsLink: string | null;

    /**
     * Tautan ke kata-kata untuk bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam terjemahan, atau jika bab sebelumnya tidak memiliki anotasi tingkat kata.
     */
    previousChapterWordsLink: string | null;

    /**
     * Kata-kata yang diberi keterangan untuk setiap ayat dalam bab tersebut, diurutkan berdasarkan nomor ayat.
     * Setiap daftar disusun sesuai urutan kemunculan kata-kata dalam ayat tersebut.
     */
    verses: {
        [verseNumber: string]: ChapterWord[];
    };
}

interface ChapterWord {
    /**
     * Indeks item dalam larik konten ayat yang berlaku untuk anotasi tersebut.
     */
    contentIndex: number;

    /**
     * Indeks karakter pertama dari kata yang diberi anotasi dalam teks item konten.
     */
    start: number;

    /**
     * Indeks setelah karakter terakhir dari kata yang diberi anotasi dalam teks item konten.
     * Artinya, text.slice(start, end) adalah kata yang diberi anotasi.
     */
    end: number;

    /**
     * Nomor Strong untuk kata tersebut.
     * Dihilangkan jika terjemahan hanya memberikan anotasi lain untuk kata tersebut.
     */
    strongs?: string[];

    /**
     * Bentuk kata dalam kamus (kutipan).
     * Dihilangkan jika terjemahan tidak menyediakannya.
     */
    lemma?: string;

    /**
     * Kode penguraian morfologi untuk kata tersebut.
     * Dihilangkan jika terjemahan tidak menyediakannya.
     */
    morph?: string;

    /**
     * Penunjuk ke kata dalam teks sumber, dalam format <sourceName> : <location> .
     * Dihilangkan jika terjemahan tidak menyediakannya.
     */
    srcloc?: string;

    /**
     * Kemunculan kata sumber yang mana dari kata ini. Berbasis 1.
     * Dihilangkan jika terjemahan tidak menyediakannya.
     */
    occurrence?: number;

    /**
     * Jumlah total kemunculan kata sumber.
     * Dihilangkan jika terjemahan tidak menyediakannya.
     */
    occurrences?: number;
}
```

### Contoh

Diberikan sebuah bab yang ayat pertamanya hanya memiliki satu pokok bahasan:

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

Berkas kata tersebut memberi anotasi pada karakter item tersebut:

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

Artinya, `"In the beginning...".slice(0, 2)` adalah `"In"` , yang oleh sumber tersebut diberi label `G1722` .

## Dapatkan terjemahan lengkapnya

`GET https://bible.helloao.org/api/{translation}/complete.json`

Mendapatkan isi dari keseluruhan terjemahan.

-   `translation` adalah ID terjemahan (misalnya `BSB` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-translation-complete.js"
const translation = 'BSB';

// Dapatkan Kejadian 1 dari terjemahan BSB.
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

### Struktur

```typescript:no-line-numbers title="complete.ts"
/**
 * Menentukan data unduhan terjemahan lengkap.
 * Dipetakan ke endpoint /api/:translationId/complete.json.
 */
export interface TranslationComplete {
    /**
     * Metadata terjemahan.
     */
    translation: Translation;

    /**
     * Daftar lengkap buku beserta semua babnya.
     */
    books: TranslationCompleteBook[];
}

/**
 * Unduh buku terjemahan lengkapnya.
 */
export interface TranslationCompleteBook {
    /**
     * ID buku tersebut.
     */
    id: string;

    /**
     * Judul buku berdasarkan terjemahan.
     */
    name: string;

    /**
     * Nama umum untuk buku tersebut.
     */
    commonName: string;

    /**
     * Judul buku tersebut.
     */
    title: string | null;

    /**
     * Urutan buku tersebut.
     */
    order: number;

    /**
     * Jumlah bab dalam buku tersebut.
     */
    numberOfChapters: number;

    /**
     * Jumlah total ayat dalam buku tersebut.
     */
    totalNumberOfVerses: number;

    /**
     * Apakah buku itu apokrif.
     */
    isApocryphal?: boolean;

    /**
     * Daftar lengkap bab beserta seluruh isinya.
     */
    chapters: TranslationCompleteChapter[];
}

/**
 * Sebuah bab dalam unduhan terjemahan lengkap.
 */
export interface TranslationCompleteChapter {
    /**
     * Jumlah ayat yang terdapat dalam bab tersebut.
     */
    numberOfVerses: number;

    /**
     * Berikut tautan ke berbagai versi audio untuk bab ini.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * Waktu mulai audio (per ayat, dalam detik) untuk berbagai versi audio dari bab tersebut.
     *
     * Tidak seperti `thisChapterAudioTimings` pada titik akhir bab individual (yang mengarah ke "Dapatkan Pengaturan Waktu Audio untuk Sebuah Bab" di bawah), ini berisi pengaturan waktu itu sendiri - karena tujuan dari unduhan terjemahan lengkap adalah untuk memiliki semuanya dalam satu file.
     */
    thisChapterAudioTimings: TranslationBookChapterAudioTimingsMap;

    /**
     * Tautan ke anotasi tingkat kata untuk bab tersebut.
     * Dihilangkan jika bab tersebut tidak memiliki anotasi tingkat kata.
     */
    thisChapterWordsLink?: string;

    /**
     * Informasi untuk bab ini.
     */
    chapter: ChapterData;
}

/**
 * Pengaturan waktu audio untuk sebuah bab buku, disematkan langsung dan bukan berupa tautan.
 * Memetakan ID pembaca ke daftar waktu (dalam detik) dimulainya setiap ayat, sesuai urutan ayat.
 */
interface TranslationBookChapterAudioTimingsMap {
    [reader: string]: number[];
}
```

### Contoh

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
