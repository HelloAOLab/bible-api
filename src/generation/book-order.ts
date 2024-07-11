
/**
 * Defines a map that maps the book ID to the numerical order of the book.
 */
export const bookOrderMap = new Map([
    ["GEN", 1]
    , ["EXO", 2]
    , ["LEV", 3]
    , ["NUM", 4]
    , ["DEU", 5]
    , ["JOS", 6]
    , ["JDG", 7]
    , ["RUT", 8]
    , ["1SA", 9]
    , ["2SA", 10]
    , ["1KI", 11]
    , ["2KI", 12]
    , ["1CH", 13]
    , ["2CH", 14]
    , ["EZR", 15]
    , ["NEH", 16]
    , ["EST", 17]
    , ["JOB", 18]
    , ["PSA", 19]
    , ["PRO", 20]
    , ["ECC", 21]
    , ["SNG", 22]
    , ["ISA", 23]
    , ["JER", 24]
    , ["LAM", 25]
    , ["EZK", 26]
    , ["DAN", 27]
    , ["HOS", 28]
    , ["JOL", 29]
    , ["AMO", 30]
    , ["OBA", 31]
    , ["JON", 32]
    , ["MIC", 33]
    , ["NAM", 34]
    , ["HAB", 35]
    , ["ZEP", 36]
    , ["HAG", 37]
    , ["ZEC", 38]
    , ["MAL", 39]
    , ["MAT", 40]
    , ["MRK", 41]
    , ["LUK", 42]
    , ["JHN", 43]
    , ["ACT", 44]
    , ["ROM", 45]
    , ["1CO", 46]
    , ["2CO", 47]
    , ["GAL", 48]
    , ["EPH", 49]
    , ["PHP", 50]
    , ["COL", 51]
    , ["1TH", 52]
    , ["2TH", 53]
    , ["1TI", 54]
    , ["2TI", 55]
    , ["TIT", 56]
    , ["PHM", 57]
    , ["HEB", 58]
    , ["JAS", 59]
    , ["1PE", 60]
    , ["2PE", 61]
    , ["1JN", 62]
    , ["2JN", 63]
    , ["3JN", 64]
    , ["JUD", 65]
    , ["REV", 66]
]);

/**
 * Defines a map that maps the book ID to the number of chapters the book has.
 */
export const bookChapterCountMap = new Map([
    [
        "GEN",
        50
    ],
    [
        "EXO",
        40
    ],
    [
        "LEV",
        27
    ],
    [
        "NUM",
        36
    ],
    [
        "DEU",
        34
    ],
    [
        "JOS",
        24
    ],
    [
        "JDG",
        21
    ],
    [
        "RUT",
        4
    ],
    [
        "1SA",
        31
    ],
    [
        "2SA",
        24
    ],
    [
        "1KI",
        22
    ],
    [
        "2KI",
        25
    ],
    [
        "1CH",
        29
    ],
    [
        "2CH",
        36
    ],
    [
        "EZR",
        10
    ],
    [
        "NEH",
        13
    ],
    [
        "EST",
        10
    ],
    [
        "JOB",
        42
    ],
    [
        "PSA",
        150
    ],
    [
        "PRO",
        31
    ],
    [
        "ECC",
        12
    ],
    [
        "SNG",
        8
    ],
    [
        "ISA",
        66
    ],
    [
        "JER",
        52
    ],
    [
        "LAM",
        5
    ],
    [
        "EZK",
        48
    ],
    [
        "DAN",
        12
    ],
    [
        "HOS",
        14
    ],
    [
        "JOL",
        3
    ],
    [
        "AMO",
        9
    ],
    [
        "OBA",
        1
    ],
    [
        "JON",
        4
    ],
    [
        "MIC",
        7
    ],
    [
        "NAM",
        3
    ],
    [
        "HAB",
        3
    ],
    [
        "ZEP",
        3
    ],
    [
        "HAG",
        2
    ],
    [
        "ZEC",
        14
    ],
    [
        "MAL",
        4
    ],
    [
        "MAT",
        28
    ],
    [
        "MRK",
        16
    ],
    [
        "LUK",
        24
    ],
    [
        "JHN",
        21
    ],
    [
        "ACT",
        28
    ],
    [
        "ROM",
        16
    ],
    [
        "1CO",
        16
    ],
    [
        "2CO",
        13
    ],
    [
        "GAL",
        6
    ],
    [
        "EPH",
        6
    ],
    [
        "PHP",
        4
    ],
    [
        "COL",
        4
    ],
    [
        "1TH",
        5
    ],
    [
        "2TH",
        3
    ],
    [
        "1TI",
        6
    ],
    [
        "2TI",
        4
    ],
    [
        "TIT",
        3
    ],
    [
        "PHM",
        1
    ],
    [
        "HEB",
        13
    ],
    [
        "JAS",
        5
    ],
    [
        "1PE",
        5
    ],
    [
        "2PE",
        3
    ],
    [
        "1JN",
        5
    ],
    [
        "2JN",
        1
    ],
    [
        "3JN",
        1
    ],
    [
        "JUD",
        1
    ],
    [
        "REV",
        22
    ]
]);

/**
 * Defines a map that maps the book ID to the "common" enligsh name for the book.
 */
const englishBookMap = new Map([
    ["GEN", { "commonName": "Genesis" }]
    , ["EXO", { "commonName": "Exodus" }]
    , ["LEV", { "commonName": "Leviticus" }]
    , ["NUM", { "commonName": "Numbers" }]
    , ["DEU", { "commonName": "Deuteronomy" }]
    , ["JOS", { "commonName": "Joshua" }]
    , ["JDG", { "commonName": "Judges" }]
    , ["RUT", { "commonName": "Ruth" }]
    , ["1SA", { "commonName": "1 Samuel" }]
    , ["2SA", { "commonName": "2 Samuel" }]
    , ["1KI", { "commonName": "1 Kings" }]
    , ["2KI", { "commonName": "2 Kings" }]
    , ["1CH", { "commonName": "1 Chronicles" }]
    , ["2CH", { "commonName": "2 Chronicles" }]
    , ["EZR", { "commonName": "Ezra" }]
    , ["NEH", { "commonName": "Nehemiah" }]
    , ["EST", { "commonName": "Esther" }]
    , ["JOB", { "commonName": "Job" }]
    , ["PSA", { "commonName": "Psalms" }]
    , ["PRO", { "commonName": "Proverbs" }]
    , ["ECC", { "commonName": "Ecclesiastes" }]
    , ["SNG", { "commonName": "Song of Songs" }]
    , ["ISA", { "commonName": "Isaiah" }]
    , ["JER", { "commonName": "Jeremiah" }]
    , ["LAM", { "commonName": "Lamentations" }]
    , ["EZK", { "commonName": "Ezekiel" }]
    , ["DAN", { "commonName": "Daniel" }]
    , ["HOS", { "commonName": "Hosea" }]
    , ["JOL", { "commonName": "Joel" }]
    , ["AMO", { "commonName": "Amos" }]
    , ["OBA", { "commonName": "Obadiah" }]
    , ["JON", { "commonName": "Jonah" }]
    , ["MIC", { "commonName": "Micah" }]
    , ["NAM", { "commonName": "Nahum" }]
    , ["HAB", { "commonName": "Habakkuk" }]
    , ["ZEP", { "commonName": "Zephaniah" }]
    , ["HAG", { "commonName": "Haggai" }]
    , ["ZEC", { "commonName": "Zechariah" }]
    , ["MAL", { "commonName": "Malachi" }]
    , ["MAT", { "commonName": "Matthew" }]
    , ["MRK", { "commonName": "Mark" }]
    , ["LUK", { "commonName": "Luke" }]
    , ["JHN", { "commonName": "John" }]
    , ["ACT", { "commonName": "Acts" }]
    , ["ROM", { "commonName": "Romans" }]
    , ["1CO", { "commonName": "1 Corinthians" }]
    , ["2CO", { "commonName": "2 Corinthians" }]
    , ["GAL", { "commonName": "Galatians" }]
    , ["EPH", { "commonName": "Ephesians" }]
    , ["PHP", { "commonName": "Philippians" }]
    , ["COL", { "commonName": "Colossians" }]
    , ["1TH", { "commonName": "1 Thessalonians" }]
    , ["2TH", { "commonName": "2 Thessalonians" }]
    , ["1TI", { "commonName": "1 Timothy" }]
    , ["2TI", { "commonName": "2 Timothy" }]
    , ["TIT", { "commonName": "Titus" }]
    , ["PHM", { "commonName": "Philemon" }]
    , ["HEB", { "commonName": "Hebrews" }]
    , ["JAS", { "commonName": "James" }]
    , ["1PE", { "commonName": "1 Peter" }]
    , ["2PE", { "commonName": "2 Peter" }]
    , ["1JN", { "commonName": "1 John" }]
    , ["2JN", { "commonName": "2 John" }]
    , ["3JN", { "commonName": "3 John" }]
    , ["JUD", { "commonName": "Jude" }]
    , ["REV", { "commonName": "Revelation" }]
]);

/**
 * Defines a map that maps the book ID to the "common" arabic name for the book.
 */
const arabicBookMap = new Map([
    ["GEN", { "commonName": "التَّكوين" }]
    , ["EXO", { "commonName": "الخُرُوج" }]
    , ["LEV", { "commonName": "اللّاويِّين" }]
    , ["NUM", { "commonName": "العَدَد" }]
    , ["DEU", { "commonName": "التَّثْنِيَة" }]
    , ["JOS", { "commonName": "يَشُوع" }]
    , ["JDG", { "commonName": "القُضاة" }]
    , ["RUT", { "commonName": "راعُوث" }]
    , ["1SA", { "commonName": "صَمُوئيلَ الأوَّلُ" }]
    , ["2SA", { "commonName": "صموئيلَ الثّانِي" }]
    , ["1KI", { "commonName": "المُلُوكِ الأوَّلُ" }]
    , ["2KI", { "commonName": "المُلُوكِ الثّانِي" }]
    , ["1CH", { "commonName": "أخبارِ الأيّامِ الأوّلُ" }]
    , ["2CH", { "commonName": " أخبارِ الأيّامِ الثّانِي" }]
    , ["EZR", { "commonName": "عَزْرا" }]
    , ["NEH", { "commonName": "نَحَمْيا" }]
    , ["EST", { "commonName": "أسْتِير" }]
    , ["JOB", { "commonName": "أيُّوب" }]
    , ["PSA", { "commonName": "المَزامِير" }]
    , ["PRO", { "commonName": "الأمثال" }]
    , ["ECC", { "commonName": "الجامِعَة" }]
    , ["SNG", { "commonName": "نَشِيدِ الأنشاد" }]
    , ["ISA", { "commonName": "إشَعْياء" }]
    , ["JER", { "commonName": "إرْمِيا" }]
    , ["LAM", { "commonName": "ﻣﺮﺍﺛﻲ ﺇﺭﻣﻴﺎ" }]
    , ["EZK", { "commonName": "حِزْقِيال" }]
    , ["DAN", { "commonName": "دانيال" }]
    , ["HOS", { "commonName": "هُوشَع" }]
    , ["JOL", { "commonName": "يُوئيل" }]
    , ["AMO", { "commonName": "عامُوس" }]
    , ["OBA", { "commonName": "عُوبَدْيا" }]
    , ["JON", { "commonName": "ﻳﻮﻧﺎﻥ" }]
    , ["MIC", { "commonName": "ميخا" }]
    , ["NAM", { "commonName": "ناحُوم" }]
    , ["HAB", { "commonName": "حَبَقُّوق" }]
    , ["ZEP", { "commonName": "صَفَنْيا" }]
    , ["HAG", { "commonName": "حَجَّي" }]
    , ["ZEC", { "commonName": "زَكَريّا" }]
    , ["MAL", { "commonName": "مَلاخِي" }]
    , ["MAT", { "commonName": "ﻣﺘﻰ" }]
    , ["MRK", { "commonName": "مَرْقُس" }]
    , ["LUK", { "commonName": "لُوقا" }]
    , ["JHN", { "commonName": "يُوحَنّا" }]
    , ["ACT", { "commonName": "اعمال الرسل" }]
    , ["ROM", { "commonName": "ﺭﻭﻣﻴﺔ" }]
    , ["1CO", { "commonName": "ﻛﻮﺭﻧﺜﻮﺱ ﺍﻻﻭﻝ" }]
    , ["2CO", { "commonName": "ﻛﻮﺭﻧﺜﻮﺱ ﺍﻟﺜﺎﻧﻴﺔ" }]
    , ["GAL", { "commonName": "غَلاطِيَّة" }]
    , ["EPH", { "commonName": "أفَسُس" }]
    , ["PHP", { "commonName": "فِيلِبِّي" }]
    , ["COL", { "commonName": "كُولُوسِي" }]
    , ["1TH", { "commonName": "الرِّسالَةُ الأُولَى إلَى تَسالُونِيكِي" }]
    , ["2TH", { "commonName": "الرِّسالَةُ الثّانيَةُ إلَى تَسالُونِيكِي" }]
    , ["1TI", { "commonName": "الرِّسالَةُ الأُولَى إلَى تِيمُوثاوُس" }]
    , ["2TI", { "commonName": "الرِّسالَةُ الثّانيَةُ إلَى تِيمُوثاوُس" }]
    , ["TIT", { "commonName": "تِيطُس" }]
    , ["PHM", { "commonName": "فِلِيْمُون" }]
    , ["HEB", { "commonName": "العِبرانِيّين" }]
    , ["JAS", { "commonName": "يَعقُوب" }]
    , ["1PE", { "commonName": "رسالَةُ بُطرُسَ الأُولَى" }]
    , ["2PE", { "commonName": "رسالَةُ بُطرُسَ الثّانيَة" }]
    , ["1JN", { "commonName": "رسالَةُ يُوحَنّا الأُولَى" }]
    , ["2JN", { "commonName": "رسالَةُ يُوحَنّا الثّانيَة" }]
    , ["3JN", { "commonName": "رسالَةُ يُوحَنّا الثّالثَة" }]
    , ["JUD", { "commonName": "يَهُوذا" }]
    , ["REV", { "commonName": "رُؤيا يُوحَنّا" }]
]);

/**
 * Defines a map that maps a locale ID to a book name map.
 */
export const bookIdMap = new Map([
    ['en', englishBookMap],
    ['en-US', englishBookMap],
    ['eng', englishBookMap],
    ['arb', arabicBookMap]
]);