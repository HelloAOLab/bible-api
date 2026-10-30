# Konvensi Ayat Hari Ini

Halaman ini menjelaskan cara memilih ayat harian dari [`verse-of-the-day` dataset](./README.md#verse-of-the-day) , sehingga Anda dapat mengimplementasikannya dalam bahasa apa pun dan mendapatkan ayat yang sama seperti implementasi lainnya.

API ini terdiri dari file statis, jadi API ini tidak memilih ayat untuk Anda. Konvensinya adalah pengaturan default bersama: aplikasi yang mengikutinya akan menampilkan ayat yang sama pada hari yang sama. Aplikasi bebas untuk memilih ayat yang berbeda, dan [seed](#seeds) memberikan cara mudah bagi mereka untuk melakukannya sambil tetap mempertahankan jaminan yang sama.

## Jaminan

-   **Deterministik.** Tanggal (dan seed) yang sama selalu memberikan ayat yang sama, di setiap perangkat dan di setiap implementasi.
-   **Tidak ada pengulangan dalam satu tahun.** Setiap tahun memiliki urutan ayat yang diacak sendiri, dan hari-hari dalam setahun berjalan melaluinya. Kumpulan data selalu memiliki setidaknya 366 ayat untuk setiap hari yang digunakan, sehingga sebuah ayat tidak pernah muncul dua kali dalam tahun kalender yang sama.
-   **Hari Raya.** Pada hari raya Kristen (seperti Natal atau Minggu Paskah), ayat harian adalah salah satu ayat hari raya tersebut. Suatu hari raya menggunakan ayat-ayat yang sama setiap tahunnya, sehingga setiap tahunnya memiliki ayat yang berbeda hingga semua ayatnya digunakan. Hari raya yang berlangsung beberapa hari (seperti tiga hari setelah Minggu Paskah) memiliki ayat yang berbeda setiap harinya. Ayat-ayat hari raya tidak digunakan pada hari-hari lainnya.
-   **Susunan ayat baru setiap tahun.** Susunan tersebut tidak diulang setelah semua ayat digunakan. Karena setiap tahun diacak secara terpisah, ayat yang sama kadang-kadang dapat muncul pada tanggal 31 Desember dan lagi pada tanggal 1 Januari (sekitar 1 dari 650 Tahun Baru).
-   **Riwayat yang stabil.** Dataset hanya menambahkan atau menghapus ayat dari tahun yang belum dimulai (lihat [`addedIn` dan `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), sehingga ayat harian untuk tanggal yang sudah terjadi tidak pernah berubah.
-   **Tidak bergantung pada urutan dalam daftar.** Posisi setiap ayat dalam urutan tahunan berasal dari referensinya masing-masing, sehingga urutan dalam daftar tidak menjadi masalah.

## Masukan

| Masukan   | Keterangan                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ayat-ayat | Susunan `verses` dari [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Setiap ayat memiliki `book` , `chapter` , `verse` , dan `categories` , dan dapat memiliki `endVerse` , `addedIn` , dan `removedIn` .                                                                                                                                                                    |
| Tanggal   | Tanggal kalender (tahun, bulan, dan hari). Untuk "hari ini", gunakan tanggal lokal pengguna, bukan tanggal dalam UTC.                                                                                                                                                                                                                                                                                       |
| Benih     | Opsional. Sebuah string yang memilih urutan berbeda. Secara default berupa string kosong, yang memberikan ayat harian standar.                                                                                                                                                                                                                                                                              |
| Liburan   | Array `holidays` dari file yang sama. Setiap hari libur memiliki angka `id` dari kategorinya, dan angka `month` dan `day` (hari libur pada tanggal yang sama setiap tahun) atau daftar `dates` ( `YYYY-MM-DD` , secara berurutan) untuk hari libur yang tanggalnya berubah setiap tahun. Sebuah hari libur dapat mencantumkan beberapa tanggal dalam tahun yang sama jika berlangsung selama beberapa hari. |
| Kategori  | Opsional. Pilih hanya dari ayat-ayat yang memiliki kategori ini di bagian `categories` nya, pada hari apa pun.                                                                                                                                                                                                                                                                                              |

## Algoritma

### Langkah 1: Cari tahun dan tanggalnya

Ambil tahun, bulan, dan tanggal dari tanggal tersebut, dan hari dalam tahun dari tanggal tersebut, dihitung dari 0: 1 Januari adalah hari ke-0, 31 Desember adalah hari ke-364 (atau hari ke-365 pada tahun kabisat).

Tanggal menggunakan kalender Gregorian proleptik: suatu tahun adalah tahun kabisat jika habis dibagi 4, kecuali tahun-tahun yang habis dibagi 100 tetapi tidak habis dibagi 400 (2000 adalah tahun kabisat, 1900 bukan).

### Langkah 2: Simpan ayat-ayat yang sedang digunakan

Pertahankan ayat-ayat yang digunakan pada tahun tersebut:

-   `addedIn` hilang (atau null), atau `addedIn <= year` , dan
-   `removedIn` hilang (atau null), atau `year < removedIn` .

### Langkah 3: Pilih ayat-ayat yang ingin dipilih

Pilih ayat-ayat yang akan dipilih, awalan kunci untuk langkah 4, dan posisi untuk langkah 7:

1. **Sebuah kategori telah diberikan.** Pertahankan ayat-ayat yang digunakan yang `categories` nya mengandung kategori tersebut. Awalan (prefix) adalah `{seed}|{year}` dan posisinya adalah hari dalam setahun.
2. **Tidak ada kategori yang diberikan, dan tanggal tersebut adalah hari libur.** Tanggal tersebut adalah hari libur jika hari libur di `holidays` memiliki `month` dan `day` dari tanggal tersebut, atau mencantumkan tanggal di `dates` -nya (ditulis sebagai `YYYY-MM-DD` , dengan tahun empat digit). Jika lebih dari satu hari libur cocok, gunakan yang pertama dalam daftar (dataset tidak pernah memiliki dua hari libur pada tanggal yang sama). Pertahankan ayat-ayat yang digunakan yang `categories` nya berisi `id` dari hari libur tersebut. Jika ada, awalan adalah `{seed}|{id}` (misalnya `|christmas` ) dan posisinya adalah `year × k + i` , di mana `k` adalah jumlah hari hari libur tersebut dirayakan dalam setahun (1 untuk hari libur dengan `month` dan `day` ; jika tidak, jumlah `dates` -nya dalam tahun tanggal tersebut) dan `i` adalah jumlah hari yang mendahului tanggal tersebut. Untuk hari libur yang dirayakan satu hari dalam setahun, posisinya hanya tahun. Jika tidak ada, lanjutkan dengan 3.
3. **Jika tidak.** Pertahankan ayat-ayat yang digunakan yang `categories` nya tidak mengandung angka `id` dari hari libur apa pun di `holidays` Awalan adalah `{seed}|{year}` dan posisinya adalah hari dalam setahun.

`seed` adalah seed (string kosong secara default), dan `year` adalah tahun dari langkah 1 dalam bentuk desimal tanpa angka nol di depan (misalnya `2026` , `1` ).

Jika tidak ada ayat yang tersisa, maka tidak ada ayat untuk hari itu.

Hari libur yang tanggalnya berubah setiap tahun hanya mencantumkan tanggal yang telah dihitung sebelumnya (saat ini 2026 hingga 2125), jadi di tahun-tahun lain hari libur tersebut adalah hari biasa. Jangan menghitung tanggalnya sendiri.

### Langkah 4: Buat kunci untuk setiap ayat

Untuk setiap bait yang tersisa, susunlah rangkaian ini:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` adalah awalan dari langkah 3.
-   `book` adalah ayat `book` persis seperti yang muncul dalam dataset (ID buku USFM huruf besar seperti `JHN` atau `1JN` ).
-   `chapter` dan `verse` adalah bilangan desimal tanpa angka nol di depannya.
-   `endVerse` bukan bagian dari kunci. Sebuah bagian diidentifikasi berdasarkan ayat pertamanya.

Sebagai contoh, kunci untuk Yohanes 3:16 pada hari biasa di tahun 2026 dengan seed default adalah `|2026|JHN 3:16` , dan kunci untuk Lukas 2:7 pada hari Natal adalah `|christmas|LUK 2:7` .

### Langkah 5: Hash setiap kunci

Hash byte UTF-8 dari kunci dengan hash [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) 32-bit, lalu campurkan hasilnya dengan finalizer [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Semua aritmatika dilakukan pada bilangan bulat 32-bit tanpa tanda, sehingga perkalian berputar (diambil modulo 2³²) dan pergeseran ke kanan bersifat logis (menggeser nol).

```
hash = 0x811C9DC5
for each byte b in UTF-8(key):
    hash = hash XOR b
    hash = (hash * 0x01000193) mod 2^32

hash = hash XOR (hash >> 16)
hash = (hash * 0x85EBCA6B) mod 2^32
hash = hash XOR (hash >> 13)
hash = (hash * 0xC2B2AE35) mod 2^32
hash = hash XOR (hash >> 16)
```

Hasilnya adalah kunci pengurutan ayat tersebut, yaitu angka dari 0 hingga 4.294.967.295.

### Langkah 6: Urutkan ayat-ayat tersebut

Urutkan ayat-ayat berdasarkan kunci pengurutannya, dari yang terkecil terlebih dahulu, dengan membandingkan kunci-kunci tersebut sebagai bilangan tak bertanda.

Jika dua ayat memiliki kunci pengurutan yang sama (yang sangat jarang terjadi), letakkan ayat yang string kuncinya dari langkah 4 berada di urutan pertama dalam urutan ordinal (kode karakter). Semua string kunci dimulai dengan awalan yang sama, sehingga perbedaannya hanya terletak pada referensi ASCII yang mengikutinya.

### Langkah 7: Pilih ayatnya

Ayat hari ini adalah ayat pada posisi `p mod n` dalam daftar yang diurutkan (dihitung dari 0), di mana `p` adalah posisi dari langkah 3 (hari dalam setahun, atau `year × k + i` pada hari libur) dan `n` adalah jumlah ayat dalam daftar yang diurutkan. Hasil dari `mod` tidak pernah negatif (untuk tahun negatif, tambahkan `n` sampai tidak negatif).

Pada hari-hari biasa, kumpulan data lengkap memiliki setidaknya 366 ayat, jadi `day mod n` hanyalah `day` Angka `mod` menjadi penting ketika Anda memilih dari kategori atau daftar Anda sendiri dengan jumlah ayat yang lebih sedikit daripada jumlah hari dalam setahun, dalam hal ini ayat-ayat tersebut berulang dalam setahun. Pada hari raya, posisi tersebut menelusuri ayat-ayat hari raya tersebut satu tahun (dan, untuk hari raya yang berlangsung beberapa hari, satu hari) pada satu waktu.

## Kode semu

```
function verseOfTheDay(verses, holidays, date, seed = "", category = null):
    year = date.year
    day = dayOfYear(date)                 // 0 for January 1st
    inUse = [v for v in verses
             if (v.addedIn == null or v.addedIn <= year)
             and (v.removedIn == null or year < v.removedIn)]

    if category != null:
        return pick([v for v in inUse if category in v.categories], seed + "|" + year, day)

    holiday = first h in holidays where (h.month == date.month and h.day == date.day)
                                     or (h.dates contains format(date, "YYYY-MM-DD"))
    if holiday != null:
        holidayVerses = [v for v in inUse if holiday.id in v.categories]
        if holidayVerses is not empty:
            if holiday.dates == null:
                position = year
            else:
                datesInYear = [d for d in holiday.dates if d starts with year + "-"]
                position = year * length(datesInYear) + count of d in datesInYear where d < date
            return pick(holidayVerses, seed + "|" + holiday.id, position)

    holidayIds = [h.id for h in holidays]
    return pick([v for v in inUse if no category of v is in holidayIds], seed + "|" + year, day)

function pick(candidates, prefix, position):
    if candidates is empty: return null
    keyed = [(hash(key), key, v) for v in candidates
             where key = prefix + "|" + v.book + " " + v.chapter + ":" + v.verse]
    sort keyed by (hash, key)             // hash as an unsigned number, key in ordinal order
    return keyed[position mod length(keyed)].verse    // a mod that is never negative
```

Setiap tanggal biasa dalam setahun menggunakan daftar yang sama yang sudah diurutkan, jadi jika Anda memilih ayat untuk banyak tanggal, urutkan sekali per tahun dan gunakan kembali.

## Biji-bijian

Seed mengubah kunci setiap ayat, sehingga memberikan urutan yang sepenuhnya berbeda dengan jaminan yang sama (tidak ada pengulangan dalam setahun, urutan baru setiap tahun, riwayat stabil). Gunakan seed Anda sendiri, seperti nama aplikasi Anda, jika Anda ingin aplikasi Anda memiliki ayat harian sendiri alih-alih yang dibagikan. Biarkan kosong untuk menampilkan ayat yang sama seperti yang lain.

## Kesalahan Umum

-   **Bilangan bulat bertanda.** Dalam bahasa pemrograman tanpa bilangan bulat 32-bit tak bertanda (Java, Kotlin, JavaScript), lakukan aritmatika pada bilangan bulat 32-bit bertanda dan gunakan pergeseran kanan logis ( `>>>` ), kemudian konversikan hasilnya ke nilai tak bertanda (misalnya `hash.toLong() and 0xFFFFFFFF` , atau `hash >>> 0` di JavaScript) sebelum membandingkan. Di JavaScript, gunakan `Math.imul` untuk perkalian; `*` mengurangi presisi.
-   **Hashing karakter, bukan byte.** Hash byte UTF-8 dari kunci, bukan unit kode UTF-16 atau titik kode Unicode-nya. Ini hanya penting untuk seed dengan karakter non-ASCII, tetapi itu diperbolehkan.
-   **Menggunakan UTC untuk "hari ini".** Ayat hari ini berubah pada tengah malam waktu setempat pengguna. Menggunakan tanggal dalam UTC menampilkan ayat hari sebelumnya atau hari berikutnya untuk sebagian hari di sebagian besar zona waktu.
-   **Menghitung hari dalam setahun dari 1.** 1 Januari adalah hari ke-0.
-   **Menghitung tanggal hari raya.** Gunakan angka `dates` yang tercantum dalam dataset. Gereja dan kalender yang berbeda menghitung Paskah secara berbeda, dan dataset hanya mencantumkan tanggal yang telah dihitung sebelumnya.
-   **Menghilangkan hari libur.** Tanpa angka `holidays` , ayat-ayat hari libur diperlakukan sebagai ayat biasa, yang juga mengubah ayat setiap hari biasa.
-   **Dengan menghilangkan ayat-ayat yang telah dihapus.** Ayat-ayat dengan tahun `removedIn` masih ada dalam dataset karena tahun-tahun sebelumnya membutuhkannya. Saring ayat-ayat tersebut dengan langkah 2; jangan hapus saat Anda mengunduh daftarnya.

## Vektor Uji

Gunakan nilai-nilai ini untuk memeriksa implementasi.

### Hash

| Kunci (sebagai string JSON) | Kunci pengurutan | Heksagon     |
| --------------------------- | ---------------- | ------------ |
| `""`                        | 2872998923       | `0xab3e7c0b` |
| `"a"`                       | 444641715        | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`        | 1930190452       | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`  | 2020168843       | `0x7869548b` |
| `"é\|1\|GEN 1:1"`           | 3677064616       | `0xdb2b8da8` |

### Hari-hari dalam Setahun

| Tanggal    | Tahun | Hari dalam setahun |
| ---------- | ----- | ------------------ |
| 2026-01-01 | 2026  | 0                  |
| 2026-12-31 | 2026  | 364                |
| 2028-02-29 | 2028  | 59                 |
| 2028-12-31 | 2028  | 365                |
| 1900-12-31 | 1900  | 364                |
| 2000-12-31 | 2000  | 365                |
| 0001-03-01 | 1     | 59                 |
| 9999-12-31 | 9999  | 364                |

### Pilihan dari Daftar Kecil

Ini menggunakan daftar enam belas ayat ini, delapan di antaranya untuk hari raya:

```json
[
    { "book": "GEN", "chapter": 1, "verse": 1, "categories": ["praise"] },
    {
        "book": "PSA",
        "chapter": 23,
        "verse": 1,
        "categories": ["comfort", "provision"]
    },
    {
        "book": "PRO",
        "chapter": 3,
        "verse": 5,
        "endVerse": 6,
        "categories": ["faith", "guidance"]
    },
    {
        "book": "ISA",
        "chapter": 40,
        "verse": 31,
        "categories": ["strength", "hope"]
    },
    {
        "book": "JHN",
        "chapter": 3,
        "verse": 16,
        "categories": ["love", "salvation"]
    },
    {
        "book": "ROM",
        "chapter": 8,
        "verse": 28,
        "categories": ["hope"],
        "removedIn": 2027
    },
    { "book": "PHP", "chapter": 4, "verse": 13, "categories": ["strength"] },
    {
        "book": "1JN",
        "chapter": 4,
        "verse": 19,
        "categories": ["love"],
        "addedIn": 2027
    },
    { "book": "LUK", "chapter": 2, "verse": 7, "categories": ["christmas"] },
    {
        "book": "LUK",
        "chapter": 2,
        "verse": 10,
        "endVerse": 11,
        "categories": ["christmas"]
    },
    {
        "book": "MAT",
        "chapter": 1,
        "verse": 23,
        "categories": ["christmas"],
        "addedIn": 2027
    },
    {
        "book": "MAT",
        "chapter": 28,
        "verse": 6,
        "categories": ["resurrection-sunday"]
    },
    {
        "book": "ACT",
        "chapter": 2,
        "verse": 24,
        "categories": ["post-resurrection-sunday"]
    },
    {
        "book": "ROM",
        "chapter": 6,
        "verse": 9,
        "categories": ["post-resurrection-sunday"]
    },
    {
        "book": "1CO",
        "chapter": 15,
        "verse": 20,
        "categories": ["post-resurrection-sunday"]
    },
    {
        "book": "1TH",
        "chapter": 4,
        "verse": 14,
        "categories": ["post-resurrection-sunday"]
    }
]
```

Dan hari-hari libur ini (Malam Natal tidak memiliki ayat khusus, jadi itu adalah hari biasa):

```json
[
    { "id": "christmas-eve", "month": 12, "day": 24 },
    { "id": "christmas", "month": 12, "day": 25 },
    { "id": "resurrection-sunday", "dates": ["2026-04-05", "2027-03-28"] },
    {
        "id": "post-resurrection-sunday",
        "dates": [
            "2026-04-06",
            "2026-04-07",
            "2026-04-08",
            "2027-03-29",
            "2027-03-30",
            "2027-03-31"
        ]
    }
]
```

Untuk tanggal 2026-01-01 dengan seed default, empat ayat hari raya dan 1 Yohanes 4:19 (yang belum digunakan) dihilangkan, sehingga tersisa tujuh ayat. Diurutkan berdasarkan kunci pengurutannya, ayat-ayat tersebut adalah:

| Posisi | Kunci               | Kunci pengurutan |
| ------ | ------------------- | ---------------- |
| 0      | `\|2026\|PSA 23:1`  | 638659039        |
| 1      | `\|2026\|ROM 8:28`  | 1462075190       |
| 2      | `\|2026\|PRO 3:5`   | 1643805236       |
| 3      | `\|2026\|JHN 3:16`  | 1930190452       |
| 4      | `\|2026\|PHP 4:13`  | 2076082788       |
| 5      | `\|2026\|GEN 1:1`   | 2439817197       |
| 6      | `\|2026\|ISA 40:31` | 3044461366       |

Tanggal 1 Januari adalah hari ke-0, jadi ayat hari itu adalah Mazmur 23:1. Tanggal 15 Maret adalah hari ke-73, dan 73 mod 7 = 3, jadi ayatnya adalah Yohanes 3:16.

Pada hari Natal, hanya ayat-ayat Natal yang masih digunakan yang tersisa. Pada tahun 2027 ada tiga, diurutkan berdasarkan kata kunci pengurutannya:

| Posisi | Kunci                   | Kunci pengurutan |
| ------ | ----------------------- | ---------------- |
| 0      | `\|christmas\|LUK 2:10` | 1698480150       |
| 1      | `\|christmas\|MAT 1:23` | 2563849700       |
| 2      | `\|christmas\|LUK 2:7`  | 3160581874       |

2027 mod 3 = 2, jadi ayat harian pada Natal 2027 adalah Lukas 2:7. Pada tahun 2026, Matius 1:23 belum digunakan, jadi hanya ada dua ayat, dan 2026 mod 2 = 0 menghasilkan Lukas 2:10-11.

Hari raya setelah Minggu Paskah berlangsung selama tiga hari. Keempat ayatnya, diurutkan berdasarkan kata kuncinya, adalah:

| Posisi | Kunci                                   | Kunci pengurutan |
| ------ | --------------------------------------- | ---------------- |
| 0      | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114         |
| 1      | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464        |
| 2      | `\|post-resurrection-sunday\|1CO 15:20` | 820536316        |
| 3      | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482       |

Pada tahun 2026, perayaan ini berlangsung selama tiga hari, sehingga `k` = 3, dan posisi tanggal 6, 7, dan 8 April adalah 2026 × 3 + 0 = 6078, 6079, dan 6080. 6078 mod 4 = 2, 6079 mod 4 = 3, dan 6080 mod 4 = 0 menghasilkan 1 Korintus 15:20, Kisah Para Rasul 2:24, dan 1 Tesalonika 4:14. Pada tahun 2027, posisi berlanjut dari 6081, sehingga ayat berikutnya adalah Roma 6:9.

| Tanggal    | Benih    | Kategori    | Ayat hari ini           |
| ---------- | -------- | ----------- | ----------------------- |
| 2026-01-01 |          |             | Mazmur 23:1             |
| 2026-01-02 |          |             | Roma 8:28               |
| 2026-03-15 |          |             | Yohanes 3:16            |
| 2026-12-31 |          |             | Mazmur 23:1             |
| 2027-01-01 |          |             | Yohanes 3:16            |
| 2027-06-30 |          |             | PRO 3:5-6               |
| 2028-02-29 |          |             | PRO 3:5-6               |
| 2028-12-31 |          |             | Mazmur 23:1             |
| 1969-12-31 |          |             | PRO 3:5-6               |
| 0001-01-01 |          |             | ISA 40:31               |
| 2026-01-01 | `my-app` |             | ISA 40:31               |
| 2027-01-01 | `my-app` |             | PHP 4:13                |
| 2026-01-01 |          | `hope`      | Roma 8:28               |
| 2027-01-01 |          | `hope`      | ISA 40:31               |
| 2027-01-01 |          | `joy`       | Tidak ada ayat hari ini |
| 2026-12-25 |          |             | Lukas 2:10-11           |
| 2027-12-25 |          |             | LUKAS 2:7               |
| 2028-12-25 |          |             | Lukas 2:10-11           |
| 2029-12-25 |          |             | MATIUS 1:23             |
| 2026-12-25 | `my-app` |             | Lukas 2:10-11           |
| 2026-04-05 |          |             | Matius 28:6             |
| 2027-03-28 |          |             | Matius 28:6             |
| 2028-04-16 |          |             | Mazmur 23:1             |
| 2026-12-24 |          |             | Mazmur 23:1             |
| 2026-07-01 |          | `christmas` | LUKAS 2:7               |
| 2026-04-06 |          |             | 1 Korintus 15:20        |
| 2026-04-07 |          |             | Kisah Para Rasul 2:24   |
| 2026-04-08 |          |             | 1 Tesalonika 4:14       |
| 2026-04-09 |          |             | Mazmur 23:1             |
| 2027-03-29 |          |             | ROM 6:9                 |
| 2027-03-30 |          |             | 1 Korintus 15:20        |
| 2027-03-31 |          |             | Kisah Para Rasul 2:24   |

16 April 2028 adalah Minggu Paskah, tetapi tidak `dates` dalam daftar ini, jadi ini adalah hari biasa.

### Pilihan dari Kumpulan Data

Dataset ini tidak pernah mengubah ayat-ayat untuk tahun yang telah dimulai, jadi ayat-ayat harian untuk tahun 2026 ini tetap sama:

| Tanggal    | Hari libur              | Ayat hari ini   |
| ---------- | ----------------------- | --------------- |
| 2026-01-01 |                         | Mazmur 32:1     |
| 2026-04-03 | Jumat Agung             | Lukas 23:33     |
| 2026-04-05 | Minggu Paskah           | MATIUS 28:9     |
| 2026-04-06 | Setelah Minggu Paskah   | Wahyu 1:17-18   |
| 2026-06-15 |                         | EST 4:14        |
| 2026-10-28 |                         | Mazmur 136:1    |
| 2026-10-31 | Malam Semua Orang Kudus | Efesus 5:8      |
| 2026-11-29 | Minggu Pertama Adven    | MAL 3:1         |
| 2026-12-24 | malam Natal             | MATIUS 1:21     |
| 2026-12-25 | Natal                   | Yesaya 9:6      |
| 2026-12-31 |                         | Yehezkiel 36:26 |

## Implementasi

Implementasi-implementasi ini mengikuti konvensi yang ada, dan pengujiannya memeriksa nilai-nilai yang tercantum di halaman ini:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` dan `FreeUseBibleApi.getVerseOfTheDay()` dalam paket [`free-use-bible-api`](../../sdks/javascript.md) ( [sumber](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` dan `FreeUseBibleApi.getVerseOfTheDay()` dalam [Kotlin SDK](../../sdks/kotlin.md) ( [sumber](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` dan `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` dalam [Swift SDK](../../sdks/swift.md) ( [sumber](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Alat `getVerseOfTheDay` dari [server MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [sumber](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` dari `@helloao/tools` ( [sumber](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), yang menggunakan daftar yang sudah ada di dalam paket.
