# Komentar

Endpoint untuk menelusuri tafsir Alkitab, menampilkan daftar kitab dan profilnya, serta mengambil konten bab dan profil.

## Komentar yang Tersedia

`GET https://bible.helloao.org/api/available_commentaries.json`

Mendapatkan daftar tafsir Alkitab yang tersedia di API.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentaries.js"
fetch(`https://bible.helloao.org/api/available_commentaries.json`)
    .then(request => request.json())
    .then(availableCommentaries => {
        console.log('The API has the following commentaries:', availableCommentaries);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/available_commentaries.json
```

:::

### Struktur

```typescript:no-line-numbers title="available-commentaries.ts"
export interface AvailableCommentaries {
    /**
     * Daftar komentar.
     */
    commentaries: Commentary[];
}

export interface Commentary {
    /**
     * ID komentar tersebut.
     */
    id: string;

    /**
     * Nama komentar tersebut.
     */
    name: string;

    /**
     * Situs web untuk komentar tersebut.
     */
    website: string;

    /**
     * URL tempat lisensi untuk komentar tersebut dapat ditemukan.
     */
    licenseUrl: string;

    /**
     * Nama bahasa Inggris untuk komentar tersebut.
     */
    englishName: string;

    /**
     * Tag bahasa ISO 639 3 huruf yang menjadi bahasa utama terjemahan tersebut.
     */
    language: string;

    /**
     * Arah penulisan bahasa tersebut.
     * "ltr" menunjukkan bahwa teks ditulis dari sisi kiri halaman ke kanan.
     * "rtl" menunjukkan bahwa teks ditulis dari sisi kanan halaman ke kiri.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * Tautan API untuk daftar buku yang tersedia untuk terjemahan ini.
     */
    listOfBooksApiLink: string;

    /**
     * Daftar format yang tersedia.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * Jumlah buku yang terdapat dalam ulasan ini.
     *
     * Komentar lengkap harus memiliki jumlah buku yang sama dengan Alkitab (66).
     */
    numberOfBooks: number;

    /**
     * Jumlah total bab yang terdapat dalam terjemahan ini.
     *
     * Komentar lengkap harus memiliki jumlah bab yang sama dengan Alkitab (1.189).
     */
    totalNumberOfChapters: number;

    /**
     * Jumlah total ayat yang terdapat dalam tafsir ini.
     *
     * Tafsir lengkap seharusnya memiliki jumlah ayat yang sama dengan Alkitab (sekitar 31.102 - beberapa tafsir mengecualikan ayat-ayat berdasarkan kemungkinan keberadaannya dalam teks sumber asli).
     */
    totalNumberOfVerses: number;

    /**
     * Mendapatkan nama bahasa yang digunakan dalam komentar tersebut.
     * Nilai null atau tidak terdefinisi jika nama bahasanya tidak diketahui.
     */
    languageName?: string;

    /**
     * Mendapatkan nama bahasa tersebut dalam bahasa Inggris.
     * Null atau undefined jika bahasa tersebut tidak memiliki nama dalam bahasa Inggris.
     */
    languageEnglishName?: string;
}
```

### Contoh

```json:no-line-numbers title="/api/available_commentaries.json"
{
    "commentaries": [
        {
            "id": "adam-clarke",
            "name": "Adam Clarke Bible Commentary",
            "website": "https://en.wikipedia.org/wiki/Adam_Clarke",
            "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
            "englishName": "Adam Clarke Bible Commentary",
            "language": "eng",
            "textDirection": "rtl",
            "availableFormats": [
                "json"
            ],
            "listOfBooksApiLink": "/api/c/adam-clarke/books.json",
            "numberOfBooks": 57,
            "totalNumberOfChapters": 854,
            "totalNumberOfVerses": 13318,
            "languageName": "English",
            "languageEnglishName": "English"
        }
    ]
}
```

## Daftar Buku dalam Sebuah Komentar

`GET https://bible.helloao.org/api/c/{commentary}/books.json`

Mendapatkan daftar buku yang tersedia untuk komentar yang diberikan.

-   `commentary` adalah ID komentar (misalnya `adam-clarke` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-books.js"
const commentary = 'adam-clarke';

// Dapatkan daftar buku untuk komentar Adam Clarke.
fetch(`https://bible.helloao.org/api/c/${commentary}/books.json`)
    .then(request => request.json())
    .then(books => {
        console.log('The adam-clarke commentary has the following books:', books);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/books.json
```

:::

### Struktur

```typescript:no-line-numbers title="commentary-books.ts"
export interface CommentaryBooks {
    /**
     * Informasi komentar untuk buku-buku tersebut.
     */
    commentary: Commentary;

    /**
     * Daftar buku yang tersedia untuk dikomentari.
     */
    books: CommentaryBook[];
}

interface CommentaryBook {
    /**
     * ID buku tersebut.
     * Sesuai dengan ID buku yang bersangkutan dalam Alkitab (Kejadian, Keluaran, dll.).
     */
    id: string;

    /**
     * Nama yang diberikan dalam komentar untuk buku tersebut.
     */
    name: string;

    /**
     * Nama umum untuk buku tersebut.
     */
    commonName: string;

    /**
     * Pendahuluan komentar untuk buku tersebut.
     * Dihilangkan jika komentar tersebut tidak memiliki pengantar untuk buku tersebut.
     */
    introduction?: string;

    /**
     * Urutan kitab dalam Alkitab.
     */
    order: number;

    /**
     * Nomor bab pertama dalam buku tersebut.
     *
     * Bernilai null jika buku komentar tidak memiliki bab.
     */
    firstChapterNumber: number | null;

    /**
     * Tautan ke bab pertama buku tersebut.
     *
     * Bernilai null jika buku komentar tidak memiliki bab.
     */
    firstChapterApiLink: string | null;

    /**
     * Nomor bab terakhir dalam buku tersebut.
     *
     * Bernilai null jika buku komentar tidak memiliki bab.
     */
    lastChapterNumber: number | null;

    /**
     * Tautan ke bab terakhir buku tersebut.
     *
     * Bernilai null jika buku komentar tidak memiliki bab.
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
}
```

### Contoh

```json:no-line-numbers title="/api/c/adam-clarke/books.json"
{
    "commentary": {
        "id": "adam-clarke",
        "name": "Adam Clarke Bible Commentary",
        "website": "https://en.wikipedia.org/wiki/Adam_Clarke",
        "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
        "englishName": "Adam Clarke Bible Commentary",
        "language": "eng",
        "textDirection": "rtl",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/adam-clarke/books.json",
        "numberOfBooks": 57,
        "totalNumberOfChapters": 854,
        "totalNumberOfVerses": 13318,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "books": [
        {
            "id": "GEN",
            "commentaryId": "adam-clarke",
            "name": "Genesis",
            "commonName": "Genesis",
            "introduction": "Preface to the Book of Genesis, Every believer in Divine revelation finds himself amply justified in taking for granted that the Pentateuch is the work of Moses. For more than 3000 years this has been the invariable opinion of those who were best qualified to form a correct judgment on this subject. The Jewish Church, from its most remote antiquity, has ascribed the work to no other hand; and the Christian Church, from its foundation, has attributed it to the Jewish lawgiver alone. The most respectable heathens have concurred in this testimony, and Jesus Christ and his apostles have completed the evidence, and have put the question beyond the possibility of being doubted by those who profess to believe the Divine authenticity of the New Testament. As to those who, in opposition to all these proofs, obstinately persist in their unbelief, they are worthy of little regard, as argument is lost on their unprincipled prejudices, and demonstration on their minds, because ever willfully closed against the light. When they have proved that Moses is not the author of this work, the advocates of Divine revelation will reconsider the grounds of their faith. That there are a few things in the Pentateuch which seem to have been added by a later hand there can be little doubt; among these some have reckoned, perhaps without reason, the following passage, Gen 12:6 : \"And the Canaanite was then in the land\"; but see the note on Gen 12:6. Num 21:14, \"In the book of the wars of the Lord,\" was probably a marginal note, which in process of time got into the text; see the note on Num 21:14. To these may be added DeuteronomyDeu 1:1-5; Deu 2:12; and the eight concluding verses of the last chapter, in which we have an account of the death of Moses. These last words could not have been added by Moses himself, but are very probably the work of Ezra, by whom, according to uninterrupted tradition among the Jews, the various books which constitute the canon of the Old Testament were collected and arranged, and such expository notes added as were essential to connect the different parts; but as he acted under Divine inspiration, the additions may be considered of equal authority with the text. A few other places might be added, but they are of little importance, and are mentioned in the notes. The book of Genesis, Γενεσις, has its name from the title it bears in the Septuagint, βιβλος Γενεσεως, (Gen 2:4), which signifies the book of the Generation; but it is called in Hebrew בראשית Bereshith, \"In the beginning,\" from its initial word. It is the most ancient history in the world; and, from the great variety of its singular details and most interesting accounts, is as far superior in its value and importance to all others, as it is in its antiquity. This book contains an account of the creation of the world, and its first inhabitants; the original innocence and fall of man; the rise of religion; the invention of arts; the general corruption and degeneracy of mankind; the universal deluge; the repeopling and division of the earth; the origin of nations and kingdoms; and a particular history of the patriarchs from Adam down to the death of Joseph; including a space, at the lowest computation, of 2369 years. It may be asked how a detail so circumstantial and minute could have been preserved when there was no writing of any kind, and when the earth, whose history is here given, had already existed more than 2000 years. To this inquiry a very satisfactory answer may be given. There are only three ways in which these important records could have been preserved and brought down to the time of Moses: viz., writing, tradition, and Divine revelation. In the antediluvian world, when the life of man was so protracted, there was comparatively little need for writing of any kind, and perhaps no alphabetical writing then existed. Tradition answered every purpose to which writing in any kind of characters could be subservient; and the necessity of erecting monuments to perpetuate public events could scarcely have suggested itself, as during those times there could be little danger apprehended of any important fact becoming obsolete, as its history had to pass through very few hands, and all these friends and relatives in the most proper sense of the terms; for they lived in an insulated state under a patriarchal government. Thus it was easy for Moses to be satisfied of the truth of all he relates in the book of Genesis, as the accounts came to him through the medium of very few persons. From Adam to Noah there was but one man necessary to the correct transmission of the history of this period of 1656 years. Now this history was, without doubt, perfectly known to Methuselah, who lived to see them both. In like manner Shem connected Noah and Abraham, having lived to converse with both; as Isaac did with Abraham and Joseph, from whom these things might be easily conveyed to Moses by Amram, who was contemporary with Joseph. Supposing, then, all the curious facts recorded in the book of Genesis had no other authority than the tradition already referred to, they would stand upon a foundation of credibility superior to any that the most reputable of the ancient Greek and Latin historians can boast. Yet to preclude all possibility of mistake, the unerring Spirit of God directed Moses in the selection of his facts and the ascertaining of his dates. Indeed, the narrative is so simple, so much like truth, so consistent everywhere with itself, so correct in its dates, so impartial in its biography, so accurate in its philosophical details, so pure in its morality, and so benevolent in its design, as amply to demonstrate that it never could have had an earthly origin. In this case, also, Moses constructed every thing according to the pattern which God showed him in the mount.",
            "order": 1,
            "numberOfChapters": 50,
            "firstChapterNumber": 1,
            "firstChapterApiLink": "/api/c/adam-clarke/GEN/1.json",
            "lastChapterNumber": 50,
            "lastChapterApiLink": "/api/c/adam-clarke/GEN/50.json",
            "totalNumberOfVerses": 877
        }
    ]
}
```

## Dapatkan Satu Bab dari Sebuah Komentar

`GET https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.json`

Mengambil isi dari satu bab dalam buku dan komentar yang diberikan.

-   `commentary` adalah ID komentar (misalnya `adam-clarke` ).
-   `book` adalah ID buku (misalnya `GEN` untuk Kitab Kejadian).
-   `chapter` adalah nomor bab numerik (misalnya `1` untuk bab pertama).

Versi sederhana dari endpoint ini tersedia di `https://bible.helloao.org/api/c/{commentary}/{book}/{chapter}.simple.json` Cara kerjanya sama seperti [endpoint bab sederhana untuk terjemahan](../translations/simplified.md#get-a-simplified-chapter-from-a-translation) : isi setiap ayat adalah satu string tunggal, dan bab tersebut mempertahankan `introduction` opsionalnya. Setiap bab komentar reguler menyertakan `simpleChapterApiLink` yang menunjuk ke bab tersebut.

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-chapter.js"
const commentary = 'adam-clarke';
const book = 'GEN';
const chapter = 1;

// Dapatkan Kejadian 1 dari komentar Adam Clarke.
fetch(`https://bible.helloao.org/api/c/${commentary}/${book}/${chapter}.json`)
    .then(request => request.json())
    .then(chapter => {
        console.log('Genesis 1 (adam-clarke):', chapter);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/adam-clarke/GEN/1.json
```

:::

### Struktur

```typescript:no-line-numbers title="commentary-chapter.ts"
export interface CommentaryBookChapter {
    /**
     * Informasi komentar untuk bab buku tersebut.
     */
    commentary: Commentary;

    /**
     * Informasi buku untuk bab buku tersebut.
     */
    book: CommentaryBook;

    /**
     * Tautan ke bab ini.
     */
    thisChapterLink: string;

    /**
     * Tautan ke bab selanjutnya.
     * Bernilai null jika ini adalah bab terakhir dalam ulasan.
     */
    nextChapterApiLink: string | null;

    /**
     * Tautan ke bab sebelumnya.
     * Bernilai null jika ini adalah bab pertama dalam ulasan.
     */
    previousChapterApiLink: string | null;

    /**
     * Jumlah ayat yang terdapat dalam bab tersebut.
     */
    numberOfVerses: number;

    /**
     * Informasi untuk bab ini.
     */
    chapter: CommentaryChapterData;
}

interface CommentaryChapterData {
    /**
     * Nomor bab.
     */
    number: number;

    /**
     * Pendahuluan yang diberikan oleh komentar pada bab tersebut.
     * Tidak semua ulasan menyediakan pengantar untuk suatu bab.
     */
    introduction?: string;

    /**
     * Isi bab tersebut.
     * Ini adalah tipe yang sama dari endpoint "Dapatkan Bab dari Terjemahan".
     */
    content: ChapterVerse[];
}
```

### Contoh

```json:no-line-numbers title="/api/c/adam-clarke/GEN/1.json"
{
    "commentary": {
        "id": "adam-clarke",
        "name": "Adam Clarke Bible Commentary",
        "website": "https://en.wikipedia.org/wiki/Adam_Clarke",
        "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
        "englishName": "Adam Clarke Bible Commentary",
        "language": "eng",
        "textDirection": "rtl",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/adam-clarke/books.json",
        "numberOfBooks": 57,
        "totalNumberOfChapters": 854,
        "totalNumberOfVerses": 13318,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "book": {
        "id": "GEN",
        "commentaryId": "adam-clarke",
        "name": "Genesis",
        "commonName": "Genesis",
        "introduction": "Preface to the Book of Genesis, Every believer in Divine revelation finds himself amply justified in taking for granted that the Pentateuch is the work of Moses. For more than 3000 years this has been the invariable opinion of those who were best qualified to form a correct judgment on this subject. The Jewish Church, from its most remote antiquity, has ascribed the work to no other hand; and the Christian Church, from its foundation, has attributed it to the Jewish lawgiver alone. The most respectable heathens have concurred in this testimony, and Jesus Christ and his apostles have completed the evidence, and have put the question beyond the possibility of being doubted by those who profess to believe the Divine authenticity of the New Testament. As to those who, in opposition to all these proofs, obstinately persist in their unbelief, they are worthy of little regard, as argument is lost on their unprincipled prejudices, and demonstration on their minds, because ever willfully closed against the light. When they have proved that Moses is not the author of this work, the advocates of Divine revelation will reconsider the grounds of their faith. That there are a few things in the Pentateuch which seem to have been added by a later hand there can be little doubt; among these some have reckoned, perhaps without reason, the following passage, Gen 12:6 : \"And the Canaanite was then in the land\"; but see the note on Gen 12:6. Num 21:14, \"In the book of the wars of the Lord,\" was probably a marginal note, which in process of time got into the text; see the note on Num 21:14. To these may be added DeuteronomyDeu 1:1-5; Deu 2:12; and the eight concluding verses of the last chapter, in which we have an account of the death of Moses. These last words could not have been added by Moses himself, but are very probably the work of Ezra, by whom, according to uninterrupted tradition among the Jews, the various books which constitute the canon of the Old Testament were collected and arranged, and such expository notes added as were essential to connect the different parts; but as he acted under Divine inspiration, the additions may be considered of equal authority with the text. A few other places might be added, but they are of little importance, and are mentioned in the notes. The book of Genesis, Γενεσις, has its name from the title it bears in the Septuagint, βιβλος Γενεσεως, (Gen 2:4), which signifies the book of the Generation; but it is called in Hebrew בראשית Bereshith, \"In the beginning,\" from its initial word. It is the most ancient history in the world; and, from the great variety of its singular details and most interesting accounts, is as far superior in its value and importance to all others, as it is in its antiquity. This book contains an account of the creation of the world, and its first inhabitants; the original innocence and fall of man; the rise of religion; the invention of arts; the general corruption and degeneracy of mankind; the universal deluge; the repeopling and division of the earth; the origin of nations and kingdoms; and a particular history of the patriarchs from Adam down to the death of Joseph; including a space, at the lowest computation, of 2369 years. It may be asked how a detail so circumstantial and minute could have been preserved when there was no writing of any kind, and when the earth, whose history is here given, had already existed more than 2000 years. To this inquiry a very satisfactory answer may be given. There are only three ways in which these important records could have been preserved and brought down to the time of Moses: viz., writing, tradition, and Divine revelation. In the antediluvian world, when the life of man was so protracted, there was comparatively little need for writing of any kind, and perhaps no alphabetical writing then existed. Tradition answered every purpose to which writing in any kind of characters could be subservient; and the necessity of erecting monuments to perpetuate public events could scarcely have suggested itself, as during those times there could be little danger apprehended of any important fact becoming obsolete, as its history had to pass through very few hands, and all these friends and relatives in the most proper sense of the terms; for they lived in an insulated state under a patriarchal government. Thus it was easy for Moses to be satisfied of the truth of all he relates in the book of Genesis, as the accounts came to him through the medium of very few persons. From Adam to Noah there was but one man necessary to the correct transmission of the history of this period of 1656 years. Now this history was, without doubt, perfectly known to Methuselah, who lived to see them both. In like manner Shem connected Noah and Abraham, having lived to converse with both; as Isaac did with Abraham and Joseph, from whom these things might be easily conveyed to Moses by Amram, who was contemporary with Joseph. Supposing, then, all the curious facts recorded in the book of Genesis had no other authority than the tradition already referred to, they would stand upon a foundation of credibility superior to any that the most reputable of the ancient Greek and Latin historians can boast. Yet to preclude all possibility of mistake, the unerring Spirit of God directed Moses in the selection of his facts and the ascertaining of his dates. Indeed, the narrative is so simple, so much like truth, so consistent everywhere with itself, so correct in its dates, so impartial in its biography, so accurate in its philosophical details, so pure in its morality, and so benevolent in its design, as amply to demonstrate that it never could have had an earthly origin. In this case, also, Moses constructed every thing according to the pattern which God showed him in the mount.",
        "order": 1,
        "numberOfChapters": 50,
        "firstChapterNumber": 1,
        "firstChapterApiLink": "/api/c/adam-clarke/GEN/1.json",
        "lastChapterNumber": 50,
        "lastChapterApiLink": "/api/c/adam-clarke/GEN/50.json",
        "totalNumberOfVerses": 877
    },
    "chapter": {
        "number": 1,
        "content": [
            {
                "type": "verse",
                "number": 1,
                "content": [
                    "God in the beginning created the heavens and the earth - בראשית ברא אלהים את השמים ואת הארץ Bereshith bara Elohim eth hashshamayim veeth haarets; God in the beginning created the heavens and the earth.\nMany attempts have been made to define the term God: as to the word itself, it is pure Anglo-Saxon, and among our ancestors signified, not only the Divine Being, now commonly designated by the word, but also good; as in their apprehensions it appeared that God and good were correlative terms; and when they thought or spoke of him, they were doubtless led from the word itself to consider him as The Good Being, a fountain of infinite benevolence and beneficence towards his creatures.\nA general definition of this great First Cause, as far as human words dare attempt one, may be thus given: The eternal, independent, and self-existent Being: the Being whose purposes and actions spring from himself, without foreign motive or influence: he who is absolute in dominion; the most pure, the most simple, and most spiritual of all essences; infinitely benevolent, beneficent, true, and holy: the cause of all being, the upholder of all things; infinitely happy, because infinitely perfect; and eternally self-sufficient, needing nothing that he has made: illimitable in his immensity, inconceivable in his mode of existence, and indescribable in his essence; known fully only to himself, because an infinite mind can be fully apprehended only by itself. In a word, a Being who, from his infinite wisdom, cannot err or be deceived; and who, from his infinite goodness, can do nothing but what is eternally just, right, and kind. Reader, such is the God of the Bible; but how widely different from the God of most human creeds and apprehensions!\nThe original word אלהים Elohim, God, is certainly the plural form of אל El, or אלה Eloah, and has long been supposed, by the most eminently learned and pious men, to imply a plurality of Persons in the Divine nature. As this plurality appears in so many parts of the sacred writings to be confined to three Persons, hence the doctrine of the Trinity, which has formed a part of the creed of all those who have been deemed sound in the faith, from the earliest ages of Christianity. Nor are the Christians singular in receiving this doctrine, and in deriving it from the first words of Divine revelation. An eminent Jewish rabbi, Simeon ben Joachi, in his comment on the sixth section of Leviticus, has these remarkable words: \"Come and see the mystery of the word Elohim; there are three degrees, and each degree by itself alone, and yet notwithstanding they are all one, and joined together in one, and are not divided from each other.\" See Ainsworth. He must be strangely prejudiced indeed who cannot see that the doctrine of a Trinity, and of a Trinity in unity, is expressed in the above words. The verb ברא bara, he created, being joined in the singular number with this plural noun, has been considered as pointing out, and not obscurely, the unity of the Divine Persons in this work of creation. In the ever-blessed Trinity, from the infinite and indivisible unity of the persons, there can be but one will, one purpose, and one infinite and uncontrollable energy.\n\"Let those who have any doubt whether אלהים Elohim, when meaning the true God, Jehovah, be plural or not, consult the following passages, where they will find it joined with adjectives, verbs, and pronouns plural.\n\"Gen 1:26 Gen 3:22 Gen 11:7 Gen 20:13 Gen 31:7, Gen 31:53 Gen 35:7. \"Deu 4:7 Deu 5:23; Jos 24:19 Sa1 4:8; Sa2 7:23; \"Psa 58:6; Isa 6:8; Jer 10:10, Jer 23:36. \"See also Pro 9:10, Pro 30:3; Psa 149:2; Ecc 5:7, Ecc 12:1; Job 5:1; Isa 6:3, Isa 54:5, Isa 62:5; Hos 11:12, or Hos 12:1; Mal 1:6; Dan 5:18, Dan 5:20, and Dan 7:18, Dan 7:22.\" - Parkhurst.\nAs the word Elohim is the term by which the Divine Being is most generally expressed in the Old Testament, it may be necessary to consider it here more at large. It is a maxim that admits of no controversy, that every noun in the Hebrew language is derived from a verb, which is usually termed the radix or root, from which, not only the noun, but all the different flections of the verb, spring. This radix is the third person singular of the preterite or past tense. The ideal meaning of this root expresses some essential property of the thing which it designates, or of which it is an appellative. The root in Hebrew, and in its sister language, the Arabic, generally consists of three letters, and every word must be traced to its root in order to ascertain its genuine meaning, for there alone is this meaning to be found. In Hebrew and Arabic this is essentially necessary, and no man can safely criticise on any word in either of these languages who does not carefully attend to this point.\nI mention the Arabic with the Hebrew for two reasons.\n1. Because the two languages evidently spring from the same source, and have very nearly the same mode of construction.\n2. Because the deficient roots in the Hebrew Bible are to be sought for in the Arabic language. The reason of this must be obvious, when it is considered that the whole of the Hebrew language is lost except what is in the Bible, and even a part of this book is written in Chaldee.\nNow, as the English Bible does not contain the whole of the English language, so the Hebrew Bible does not contain the whole of the Hebrew. If a man meet with an English word which he cannot find in an ample concordance or dictionary to the Bible, he must of course seek for that word in a general English dictionary. In like manner, if a particular form of a Hebrew word occur that cannot be traced to a root in the Hebrew Bible, because the word does not occur in the third person singular of the past tense in the Bible, it is expedient, it is perfectly lawful, and often indispensably necessary, to seek the deficient root in the Arabic. For as the Arabic is still a living language, and perhaps the most copious in the universe, it may well be expected to furnish those terms which are deficient in the Hebrew Bible. And the reasonableness of this is founded on another maxim, viz., that either the Arabic was derived from the Hebrew, or the Hebrew from the Arabic. I shall not enter into this controversy; there are great names on both sides, and the decision of the question in either way will have the same effect on my argument. For if the Arabic were derived from the Hebrew, it must have been when the Hebrew was a living and complete language, because such is the Arabic now; and therefore all its essential roots we may reasonably expect to find there: but if, as Sir William Jones supposed, the Hebrew were derived from the Arabic, the same expectation is justified, the deficient roots in Hebrew may be sought for in the mother tongue. If, for example, we meet with a term in our ancient English language the meaning of which we find difficult to ascertain, common sense teaches us that we should seek for it in the Anglo-Saxon, from which our language springs; and, if necessary, go up to the Teutonic, from which the Anglo-Saxon was derived. No person disputes the legitimacy of this measure, and we find it in constant practice. I make these observations at the very threshold of my work, because the necessity of acting on this principle (seeking deficient Hebrew roots in the Arabic) may often occur, and I wish to speak once for all on the subject.\nThe first sentence in the Scripture shows the propriety of having recourse to this principle. We have seen that the word אלהים Elohim is plural; we have traced our term God to its source, and have seen its signification; and also a general definition of the thing or being included under this term, has been tremblingly attempted. We should now trace the original to its root, but this root does not appear in the Hebrew Bible. Were the Hebrew a complete language, a pious reason might be given for this omission, viz., \"As God is without beginning and without cause, as his being is infinite and underived, the Hebrew language consults strict propriety in giving no root whence his name can be deduced.\" Mr. Parkhurst, to whose pious and learned labors in Hebrew literature most Biblical students are indebted, thinks he has found the root in אלה alah, he swore, bound himself by oath; and hence he calls the ever-blessed Trinity אלהים Elohim, as being bound by a conditional oath to redeem man, etc., etc. Most pious minds will revolt from such a definition, and will be glad with me to find both the noun and the root preserved in Arabic. Allah is the common name for God in the Arabic tongue, and often the emphatic is used. Now both these words are derived from the root alaha, he worshipped, adored, was struck with astonishment, fear, or terror; and hence, he adored with sacred horror and veneration, cum sacro horrore ac veneratione coluit, adoravit - Wilmet. Hence ilahon, fear, veneration, and also the object of religious fear, the Deity, the supreme God, the tremendous Being. This is not a new idea; God was considered in the same light among the ancient Hebrews; and hence Jacob swears by the fear of his father Isaac, Gen 31:53. To complete the definition, Golius renders alaha, juvit, liberavit, et tutatus fuit, \"he succoured, liberated, kept in safety, or defended.\" Thus from the ideal meaning of this most expressive root, we acquire the most correct notion of the Divine nature; for we learn that God is the sole object of adoration; that the perfections of his nature are such as must astonish all those who piously contemplate them, and fill with horror all who would dare to give his glory to another, or break his commandments; that consequently he should be worshipped with reverence and religious fear; and that every sincere worshipper may expect from him help in all his weaknesses, trials, difficulties, temptations, etc.,; freedom from the power, guilt, nature, and consequences of sin; and to be supported, defended, and saved to the uttermost, and to the end.\nHere then is one proof, among multitudes which shall be adduced in the course of this work, of the importance, utility, and necessity of tracing up these sacred words to their sources; and a proof also, that subjects which are supposed to be out of the reach of the common people may, with a little difficulty, be brought on a level with the most ordinary capacity.\nIn the beginning - Before the creative acts mentioned in this chapter all was Eternity. Time signifies duration measured by the revolutions of the heavenly bodies: but prior to the creation of these bodies there could be no measurement of duration, and consequently no time; therefore in the beginning must necessarily mean the commencement of time which followed, or rather was produced by, God's creative acts, as an effect follows or is produced by a cause.\nCreated - Caused existence where previously to this moment there was no being. The rabbins, who are legitimate judges in a case of verbal criticism on their own language, are unanimous in asserting that the word ברא bara expresses the commencement of the existence of a thing, or egression from nonentity to entity. It does not in its primary meaning denote the preserving or new forming things that had previously existed, as some imagine, but creation in the proper sense of the term, though it has some other acceptations in other places. The supposition that God formed all things out of a pre-existing, eternal nature, is certainly absurd, for if there had been an eternal nature besides an eternal God, there must have been two self-existing, independent, and eternal beings, which is a most palpable contradiction.\nאת השמים eth hashshamayim. The word את eth, which is generally considered as a particle, simply denoting that the word following is in the accusative or oblique case, is often understood by the rabbins in a much more extensive sense. \"The particle את,\" says Aben Ezra, \"signifies the substance of the thing.\" The like definition is given by Kimchi in his Book of Roots. \"This particle,\" says Mr. Ainsworth, \"having the first and last letters of the Hebrew alphabet in it, is supposed to comprise the sum and substance of all things.\" \"The particle את eth (says Buxtorf, Talmudic Lexicon, sub voce) with the cabalists is often mystically put for the beginning and the end, as α alpha and ω omega are in the Apocalypse.\" On this ground these words should be translated, \"God in the beginning created the substance of the heavens and the substance of the earth,\" i.e. the prima materia, or first elements, out of which the heavens and the earth were successively formed. The Syriac translator understood the word in this sense, and to express this meaning has used the word yoth, which has this signification, and is very properly translated in Walton's Polyglot, Esse, caeli et Esse terrae, \"the being or substance of the heaven, and the being or substance of the earth.\" St. Ephraim Syrus, in his comment on this place, uses the same Syriac word, and appears to understand it precisely in the same way. Though the Hebrew words are certainly no more than the notation of a case in most places, yet understood here in the sense above, they argue a wonderful philosophic accuracy in the statement of Moses, which brings before us, not a finished heaven and earth, as every other translation appears to do, though afterwards the process of their formation is given in detail, but merely the materials out of which God built the whole system in the six following days.\nThe heaven and the earth - As the word שמים shamayim is plural, we may rest assured that it means more than the atmosphere, to express which some have endeavored to restrict its meaning. Nor does it appear that the atmosphere is particularly intended here, as this is spoken of, Gen 1:6, under the term firmament. The word heavens must therefore comprehend the whole solar system, as it is very likely the whole of this was created in these six days; for unless the earth had been the center of a system, the reverse of which is sufficiently demonstrated, it would be unphilosophic to suppose it was created independently of the other parts of the system, as on this supposition we must have recourse to the almighty power of God to suspend the influence of the earth's gravitating power till the fourth day, when the sun was placed in the center, round which the earth began then to revolve. But as the design of the inspired penman was to relate what especially belonged to our world and its inhabitants, therefore he passes by the rest of the planetary system, leaving it simply included in the plural word heavens. In the word earth every thing relative to the terraqueaerial globe is included, that is, all that belongs to the solid and fluid parts of our world with its surrounding atmosphere. As therefore I suppose the whole solar system was created at this time, I think it perfectly in place to give here a general view of all the planets, with every thing curious and important hitherto known relative to their revolutions and principal affections.\nObservations On The Preceding Tables\n(Editor's Note: These tables were omitted due to outdated information)\nIn Table I. the quantity or the periodic and sidereal revolutions of the planets is expressed in common years, each containing 365 days; as, e.g., the tropical revolution of Jupiter is, by the table, 11 years, 315 days, 14 hours, 39 minutes, 2 seconds; i.e., the exact number of days is equal to 11 years multiplied by 365, and the extra 315 days added to the product, which make In all 4330 days. The sidereal and periodic times are also set down to the nearest second of time, from numbers used in the construction of the tables in the third edition of M. de la Lande's Astronomy. The columns containing the mean distance of the planets from the sun in English miles, and their greatest and least distance from the earth, are such as result from the best observations of the two last transits of Venus, which gave the solar parallax to be equal to 8 three-fifth seconds of a degree; and consequently the earth's diameter, as seen from the sun, must be the double of 8 three-fifth seconds, or 17 one-fifth seconds. From this last quantity, compared with the apparent diameters of the planets, as seen at a distance equal to that of the earth at her main distance from the sun, the diameters of the planets in English miles, as contained in the seventh column, have been carefully computed. In the column entitled \"Proportion of bulk, the earth being 1,\" the whole numbers express the number of times the other planet contains more cubic miles, etc., than the earth; and if the number of cubic miles in the earth be given, the number of cubic miles in any planet may be readily found by multiplying the cubic miles contained in the earth by the number in the column, and the product will be the quantity required.\nThis is a small but accurate sketch of the vast solar system; to describe it fully, even in all its known revolutions and connections, in all its astonishing energy and influence, in its wonderful plan, structure, operations, and results, would require more volumes than can be devoted to the commentary itself.\nAs so little can be said here on a subject so vast, it may appear to some improper to introduce it at all; but to any observation of this kind I must be permitted to reply, that I should deem it unpardonable not to give a general view of the solar system in the very place where its creation is first introduced. If these works be stupendous and magnificent, what must He be who formed, guides, and supports them all by the word of his power! Reader, stand in awe of this God, and sin not. Make him thy friend through the Son of his love; and, when these heavens and this earth are no more, thy soul shall exist in consummate and unutterable felicity.\nSee the remarks on the sun, moon, and stars, after Gen 1:16. See Clarke's note on Gen 1:16."
                ]
            }
        ]
    }
}
```

## Cantumkan Profil dalam Komentar

`GET https://bible.helloao.org/api/c/{commentary}/profiles.json`

Mendapatkan daftar profil yang tersedia untuk komentar yang diberikan.

Profil adalah gambaran umum tentang orang atau kelompok orang.

Saat ini, hanya `tyndale` yang memiliki profil.

-   `commentary` adalah ID komentar (misalnya `tyndale` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profiles.js"
const commentary = 'tyndale';

// Dapatkan daftar profil untuk komentar Tyndale.
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles.json`)
    .then(request => request.json())
    .then(profiles => {
        console.log('The tyndale commentary has the following profiles:', profiles);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles.json
```

:::

### Struktur

```typescript:no-line-numbers title="commentary-profiles.ts"
export interface CommentaryProfiles {
    /**
     * Informasi komentar untuk buku-buku tersebut.
     */
    commentary: Commentary;

    /**
     * Daftar profil yang tersedia untuk dikomentari.
     */
    profiles: CommentaryProfile[];
}

interface VerseRef {
    /**
     * ID buku yang dirujuk.
     */
    book: string;

    /**
     * Bab yang dirujuk.
     */
    chapter: number;

    /**
     * Ayat yang dirujuk.
     */
    verse: number;

    /**
     * Bab yang menjadi bagian akhir referensi tersebut.
     * Jika dihilangkan, maka referensi tersebut tidak mencakup beberapa bab.
     */
    endChapter?: number;

    /**
     * Ayat yang menjadi akhir dari referensi tersebut.
     * Jika dihilangkan, maka referensi tersebut tidak mencakup beberapa ayat.
     */
    endVerse?: number;
}

interface CommentaryProfile {
    /**
     * ID profil.
     */
    id: string;

    /**
     * Subjek profil tersebut.
     */
    subject: string;

    /**
     * Referensi Alkitab yang terkait dengan profil tersebut.
     */
    reference: VerseRef | null;

    /**
     * Tautan ke profil ini.
     */
    thisProfileLink: string;

    /**
     * Tautan ke bab yang dirujuk profil ini dalam komentar.
     */
    referenceChapterLink: string | null;
}
```

### Contoh

```json:no-line-numbers title="/api/c/tyndale/profiles.json"
{
    "commentary": {
        "id": "tyndale",
        "name": "Tyndale Open Study Notes",
        "website": "https://tyndaleopenresources.com/",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "licenseNotes": "Changes were made to the content to change the format to JSON to make it compatible with the Free Use Bible API. No changes were made to the content contained in the XML formatting.",
        "englishName": "Tyndale Open Study Notes",
        "language": "eng",
        "textDirection": "rtl",
        "sha256": "62fa003ca326f8ab22a04accb2a49d2b5865ce2cecd74284228e1be08edd5e10",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/tyndale/books.json",
        "listOfProfilesApiLink": "/api/c/tyndale/profiles.json",
        "numberOfBooks": 69,
        "totalNumberOfChapters": 1243,
        "totalNumberOfVerses": 15757,
        "totalNumberOfProfiles": 125,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "profiles": [
        {
            "id": "aaron",
            "reference": {
                "book": "EXO",
                "chapter": 4,
                "verse": 14,
                "endVerse": 16
            },
            "subject": "Aaron",
            "thisProfileLink": "/api/c/tyndale/profiles/aaron.json",
            "referenceChapterLink": "/api/c/tyndale/EXO/4.json"
        },
        {
            "id": "abiathar",
            "reference": {
                "book": "1SA",
                "chapter": 22,
                "verse": 20,
                "endVerse": 23
            },
            "subject": "Abiathar",
            "thisProfileLink": "/api/c/tyndale/profiles/abiathar.json",
            "referenceChapterLink": "/api/c/tyndale/1SA/22.json"
        },
    ]
}
```

## Dapatkan Profil Anda di Bagian Komentar

`GET https://bible.helloao.org/api/c/{commentary}/profiles/{profile}.json`

Mendapatkan profil dari sebuah komentar.

-   `commentary` adalah ID komentar (misalnya `tyndale` ).
-   `profile` ID profil (misalnya `aaron` ).

### Contoh Kode

::: code-tabs#lang

@tab JavaScript

```ts:no-line-numbers title="fetch-commentary-profile.js"
const commentary = 'tyndale';
const profile = 'aaron';

// Dapatkan profil Aaron dari komentar Tyndale.
fetch(`https://bible.helloao.org/api/c/${commentary}/profiles/${profile}.json`)
    .then(request => request.json())
    .then(profile => {
        console.log('The Aaron tyndale commentary profile:', profile);
    });
```

@tab cURL

```bash:no-line-numbers
curl https://bible.helloao.org/api/c/tyndale/profiles/aaron.json
```

:::

### Struktur

```typescript:no-line-numbers title="commentary-profile-content.ts"
export interface CommentaryProfileContent {
    /**
     * Informasi komentar untuk profil tersebut.
     */
    commentary: Commentary;

    /**
     * Informasi tentang profil tersebut.
     */
    profile: CommentaryProfile;

    /**
     * Isi profil.
     */
    content: string[];
}
```

### Contoh

```json:no-line-numbers title="/api/c/tyndale/profiles/aaron.json"
{
    "commentary": {
        "id": "tyndale",
        "name": "Tyndale Open Study Notes",
        "website": "https://tyndaleopenresources.com/",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "licenseNotes": "Changes were made to the content to change the format to JSON to make it compatible with the Free Use Bible API. No changes were made to the content contained in the XML formatting.",
        "englishName": "Tyndale Open Study Notes",
        "language": "eng",
        "textDirection": "rtl",
        "sha256": "62fa003ca326f8ab22a04accb2a49d2b5865ce2cecd74284228e1be08edd5e10",
        "availableFormats": [
            "json"
        ],
        "listOfBooksApiLink": "/api/c/tyndale/books.json",
        "listOfProfilesApiLink": "/api/c/tyndale/profiles.json",
        "numberOfBooks": 69,
        "totalNumberOfChapters": 1243,
        "totalNumberOfVerses": 15757,
        "totalNumberOfProfiles": 125,
        "languageName": "English",
        "languageEnglishName": "English"
    },
    "profile": {
        "id": "aaron",
        "reference": {
            "book": "EXO",
            "chapter": 4,
            "verse": 14,
            "endVerse": 16
        },
        "subject": "Aaron",
        "thisProfileLink": "/api/c/tyndale/profiles/aaron.json",
        "referenceChapterLink": "/api/c/tyndale/EXO/4.json"
    },
    "content": [
        "Aaron\n\nMoses’ older brother, Aaron (see Exod 6:20; 7:7), played a crucial role in founding Israel and its institutions, particularly the priesthood. He first appears after Moses’ calling at the burning bush (Exod 3:1–4:17). Moses was reluctant to accept his divine commission, claiming that he was unfit to lead the Israelites out of Egypt because his words tended to “get tangled” (Exod 4:10). Despite God’s assurances, Moses continued to object until God appointed Aaron to be Moses’ mouthpiece. Thereafter, Aaron was often at Moses’ side, speaking to the Israelite leaders and demanding that Pharaoh let the Israelites leave Egypt (Exod 5:1-5).\n\nDuring the Israelites’ wilderness wanderings, God appointed Aaron and his sons to be set apart and dedicated as priests (Exod 28:1-5; 29:1-46; Lev 8:1-36). Thus, Aaron became Israel’s first high priest. Aaron’s role as high priest was especially prominent on the annual Day of Atonement, the only day when the high priest entered the Most Holy Place to purify it from the effects of Israel’s sins (Lev 16). Before the high priest could do so, however, he had to offer a sacrifice to atone for his own sins.\n\nAaron was an imperfect leader. While Moses was on Mount Sinai receiving the law from God, Aaron helped the people make an idol (Exod 32). When Moses returned, Aaron gave poor excuses and blamed the people. This event resulted in the death of three thousand Israelites, as well as a plague.\n\nAaron and his sister, Miriam, once wrongly challenged Moses’ authority, resulting in a temporary state of leprosy for Miriam (Num 12). Later, when other Levites challenged Aaron’s authority, God affirmed Aaron’s role by making his staff bud with almond blossoms (Num 17). However, because Moses and Aaron challenged God’s authority (Num 20:1-13), they both died in the wilderness without entering the Promised Land (Num 20:22-29).\n\nJesus has become the Great High Priest, far surpassing Aaron’s priestly authority and effectiveness (see Heb 7–10).\n\nPassages for Further Study\n\nExod 4:14-17, 27-31; 6:20-27; 7:1-2; 28:1-5; 32:1-25; Num 12:1-12; 20:1-13, 22-29; Acts 7:39-41"
    ]
}
```
