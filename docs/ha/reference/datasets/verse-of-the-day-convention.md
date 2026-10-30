# Yarjejeniyar Aya ta Rana

Wannan shafin yana ƙayyade yadda za a zaɓi ayar rana daga cikin [bayanai `verse-of-the-day`](./README.md#verse-of-the-day) , ta yadda za ku iya aiwatar da ita a kowace harshe kuma ku sami aya iri ɗaya kamar kowace aiwatarwa.

An yi API ɗin ne da fayiloli marasa motsi, don haka ba ya zaɓar muku aya. Tsarin tsari ne na gama gari: manhajojin da ke biye da shi suna nuna aya ɗaya a rana ɗaya. Manhajoji suna da 'yancin zaɓar ta daban, kuma [iri](#seeds) yana ba su hanya mai sauƙi ta yin hakan yayin da suke riƙe da garanti iri ɗaya.

## Garanti

-   **Mai ƙaddara.** Kwanan wata ɗaya (da iri) koyaushe yana ba da aya ɗaya, akan kowace na'ura da kuma a kowace aiwatarwa.
-   **Ba a maimaitawa cikin shekara guda.** Kowace shekara tana da nata tsarin ayoyin da aka canza, kuma kwanakin shekara suna tafiya a cikinta. Bayanan bayanai koyaushe suna da aƙalla ayoyi 366 ga kowace rana da ake amfani da su, don haka aya ba ta taɓa bayyana sau biyu a cikin shekarar kalanda ɗaya ba.
-   **Hutu.** A lokacin hutun Kiristoci (kamar Kirsimeti ko Lahadin Tashin Kiyama), ayar ranar tana ɗaya daga cikin ayoyin hutun. Hutu yana ratsa ayoyinsa shekara ɗaya bayan ɗaya, don haka yana da ayar daban kowace shekara har sai an yi amfani da dukkan ayoyinsa. Hutu wanda ya ɗauki kwanaki da yawa (kamar kwanaki uku bayan Lahadin Tashin Kiyama) yana da ayar daban a kowace rana. Ba a amfani da ayoyin hutu a wasu kwanaki.
-   **Sabon tsari kowace shekara.** Ba a maimaita tsari bayan an yi amfani da kowace aya. Domin kowace shekara ana haɗa ta daban, wannan aya na iya bayyana lokaci-lokaci a ranar 31 ga Disamba kuma a sake bayyana a ranar 1 ga Janairu (kimanin 1 cikin Sabuwar Shekara 650).
-   **Tarihi mai dorewa.** Bayanan tattara bayanai suna ƙara ko cire ayoyi ne kawai daga shekarar da ba ta fara ba tukuna (duba [`addedIn` da `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), don haka ayar ranar da ta riga ta faru ba ta taɓa canzawa ba.
-   **Ba tare da la'akari da tsarin jeri ba.** Matsayin kowace aya a cikin tsari na shekara ya fito ne daga nasa bayanin, don haka tsarin jeri ba shi da mahimmanci.

## Shigarwa

| Shigarwa     | Bayani                                                                                                                                                                                                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aya          | Jerin `verses` daga [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Kowace aya tana da `book` , `chapter` , `verse` , da `categories` , kuma tana iya samun `endVerse` , `addedIn` , da `removedIn` .                                                                                        |
| Kwanan wata  | Ranar kalanda (shekara, wata, da rana). Don "yau", yi amfani da ranar gida ta mai amfani, ba ranar a cikin UTC ba.                                                                                                                                                                                                         |
| Iri          | Zabi. Zane mai zaɓi daban. Yana kama da zaren da babu komai a ciki, wanda ke ba da ayar yau.                                                                                                                                                                                                                               |
| Ranakun Hutu | Jerin `holidays` daga fayil ɗin ɗaya. Kowace hutu tana da `id` na rukuninta, ko dai `month` da `day` (hutu a rana ɗaya kowace shekara) ko jerin `dates` ( `YYYY-MM-DD` , a jere) don hutu wanda ranarsa ke canzawa kowace shekara. Hutu zai iya lissafa ranaku da yawa a cikin shekara ɗaya idan ya ɗauki kwanaki da yawa. |
| Nau'i        | Zabi. Sai kawai zaɓi daga cikin ayoyin da ke da wannan rukuni a cikin `categories` , a kowace rana.                                                                                                                                                                                                                        |

## Tsarin aiki

### Mataki na 1: Nemo shekara da ranar shekara

Ɗauki shekara, wata, da ranar kwanan wata, da kuma ranar shekara, kana ƙidaya daga 0: 1 ga Janairu rana ce ta 0, 31 ga Disamba rana ce ta 364 (ko rana ce ta 365 a cikin shekarar tsalle).

Kwanaki suna amfani da kalandar Gregorian mai hana haihuwa: shekara shekara ce ta tsalle idan an raba ta da 4, sai dai shekarun da za a raba ta da 100 waɗanda ba za a iya raba su da 400 ba (2000 shekara ce ta tsalle, 1900 ba haka ba ne).

### Mataki na 2: Kiyaye ayoyin da ake amfani da su

A kiyaye ayoyin da ake amfani da su a shekara:

-   `addedIn` ya ɓace (ko babu komai), ko `addedIn <= year` , kuma
-   `removedIn` ya ɓace (ko kuma babu komai), ko kuma `year < removedIn` .

### Mataki na 3: Zaɓi ayoyin da za a zaɓa daga ciki

Zaɓi ayoyin da za a zaɓa daga ciki, maɓalli na gaba don mataki na 4, da kuma matsayi don mataki na 7:

1. **An ba da rukuni.** A ci gaba da amfani da ayoyin da `categories` ke ɗauke da su. Karin bayani shine `{seed}|{year}` kuma matsayin shine ranar shekara.
2. **Ba a bayar da wani rukuni ba, kuma ranar hutu ce.** Ranar hutu ce idan hutu a cikin `holidays` yana da ranar `month` da `day` , ko kuma ya lissafa ranar a cikin `dates` ɗinsa (an rubuta shi azaman `YYYY-MM-DD` , tare da shekara mai lambobi huɗu). Idan hutu ya yi daidai da fiye da ɗaya, yi amfani da na farko a cikin jerin (bayanan ba ya taɓa samun hutu biyu a rana ɗaya). A yi amfani da ayoyin da `categories` ke ɗauke da `id` na hutun. Idan akwai, prefix ɗin shine `{seed}|{id}` (misali `|christmas` ) kuma matsayin shine `year × k + i` , inda `k` shine adadin kwanakin da aka lura da hutun a shekara (1 don hutu tare da `month` da `day` ; in ba haka ba adadin `dates` ɗinsa a cikin shekarar kwanan wata) kuma `i` shine adadin waɗancan kwanakin da suka zo kafin ranar. Ga hutun da ake lura da shi a rana ɗaya a shekara, matsayin shine kawai shekara. Idan babu, ci gaba da 3.
3. **In ba haka ba.** A yi amfani da ayoyin da `categories` ba su ƙunshi `id` na kowace hutu a cikin `holidays` ba. Karin bayani shine `{seed}|{year}` kuma matsayin shine ranar shekara.

`seed` ita ce iri (zaren da babu komai a cikin tsari), kuma `year` ita ce shekara daga mataki na 1 a cikin adadi mai lamba ba tare da sifili masu jagora ba (misali `2026` , `1` ).

Idan babu ayoyi da suka rage, babu aya ta ranar.

Hutun da ranarsu ke canzawa kowace shekara suna lissafa ranakun da aka riga aka ƙididdige su (a halin yanzu daga 2026 zuwa 2125), don haka a wasu shekarun ranakun ne na yau da kullun. Kada ku ƙididdige ranakun da kanku.

### Mataki na 4: Gina mabuɗin kowace aya

Ga kowace baiti da ta rage, gina wannan zaren:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` shine prefix daga mataki na 3.
-   `book` shine aya ta `book` daidai da yadda ta bayyana a cikin bayanan (babban ID na littafin USFM kamar `JHN` ko `1JN` ).
-   `chapter` da `verse` suna cikin adadi na goma sha ɗaya ba tare da sifili masu jagora ba.
-   `endVerse` ba wani ɓangare ne na mabuɗin ba. Ana gane nassi ta hanyar ayar farko.

Misali, mabuɗin Yahaya 3:16 a rana ta yau da kullun a 2026 tare da iri na asali shine `|2026|JHN 3:16` , kuma mabuɗin Luka 2:7 a ranar Kirsimeti shine `|christmas|LUK 2:7` .

### Mataki na 5: Haɗa kowane maɓalli

A haɗa baiti UTF-8 na maɓallin tare da hash ɗin [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) mai bit 32, sannan a haɗa sakamakon tare da mai kammala [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Duk lissafi yana kan lambobi 32-bit marasa sa hannu, don haka ninkawa suna naɗewa (ana ɗaukar su modulo 2³²) kuma canjin dama yana da ma'ana (suna canzawa zuwa sifili).

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

Sakamakon shine mabuɗin rarraba ayar, lamba daga 0 zuwa 4,294,967,295.

### Mataki na 6: Tsara ayoyin

A rarraba ayoyin ta hanyar maɓallan rarrabuwarsu, mafi ƙanƙanta da farko, a kwatanta maɓallan a matsayin lambobi marasa sa hannu.

Idan ayoyi biyu suna da maɓalli iri ɗaya (wanda ba kasafai ake samunsa ba), sai a sanya wanda maɓalli daga mataki na 4 ya fara a tsarin tsari na tsari (lambar harafi). Duk maɓalli suna farawa da prefix ɗaya, don haka sun bambanta ne kawai a cikin bayanin ASCII da ke biye.

### Mataki na 7: Zaɓi ayar

Ayar rana ita ce ayar da ke matsayi `p mod n` a cikin jerin da aka tsara (ana ƙirgawa daga 0), inda `p` shine matsayi daga mataki na 3 (ranar shekara, ko `year × k + i` a ranar hutu) kuma `n` shine adadin ayoyi a cikin jerin da aka tsara. Sakamakon `mod` ba ya taɓa zama mara kyau (ga shekara mara kyau, ƙara `n` har sai bai yi ba).

A ranakun yau da kullun, cikakken bayanan yana da aƙalla ayoyi 366, don haka `day mod n` shine `day` kawai. Abubuwa `mod` suna da mahimmanci lokacin da ka zaɓi daga rukuni ko jerin naka mai ayoyi ƙasa da na kwanaki a shekara, wanda a wannan yanayin ayoyi suna maimaitawa a cikin shekara. A lokacin hutu, matsayin yana tafiya cikin ayoyin hutun shekara guda (kuma, don hutun da ya ɗauki kwanaki da yawa, rana ɗaya) a lokaci guda.

## Lambar ƙarya

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

Kowace rana ta yau da kullun a cikin shekara tana amfani da jerin da aka tsara iri ɗaya, don haka idan ka zaɓi baitoci don ranaku da yawa, ka tsara sau ɗaya a shekara ka sake amfani da shi.

## Tsaba

Iri yana canza mabuɗin kowace aya, don haka yana ba da tsari daban-daban tare da garanti iri ɗaya (ba a maimaita shi cikin shekara guda, sabon tsari kowace shekara, tarihin da ya tabbata). Yi amfani da iri naka, kamar sunan app ɗinka, idan kana son app ɗinka ya sami nasa aya ta rana maimakon wanda aka raba. Bar shi babu komai don nuna aya iri ɗaya da kowa.

## Kurakuran da Aka Fi Sani

-   **Adadi mai hannu.** A cikin harsunan da ba su da lambobi 32-bit marasa hannu (Java, Kotlin, JavaScript), yi lissafi akan lambobi 32-bit da aka sanya hannu kuma yi amfani da canjin dama mai ma'ana ( `>>>` ), sannan a mayar da sakamakon zuwa ƙimar da ba a sanya hannu ba (misali `hash.toLong() and 0xFFFFFFFF` , ko `hash >>> 0` a cikin JavaScript) kafin a kwatanta. A cikin JavaScript, yi amfani da `Math.imul` don ninkawa; `*` ya rasa daidaito.
-   **Haɗa haruffa maimakon bytes.** Haɗa bytes na UTF-8 na maɓalli, ba raka'o'in lambar UTF-16 ko maki na lambar Unicode ba. Wannan yana da mahimmanci ne kawai ga iri masu haruffan da ba na ASCII ba, amma an yarda da su.
-   **Amfani da UTC don "yau".** Ayar rana tana canzawa a tsakar dare na mai amfani. Amfani da ranar a cikin UTC yana nuna ayar da ta gabata ko ta gobe don wani ɓangare na rana a mafi yawan yankunan lokaci.
-   **Ana ƙirga ranar shekara daga 1.** 1 ga Janairu rana ce ta 0.
-   **Lissafin ranakun hutu.** Yi amfani da `dates` da aka jera a cikin bayanan. Coci-coci da kalanda daban-daban suna lissafin Ista daban-daban, kuma bayanan suna lissafa ranakun da aka riga aka lissafa su ne kawai.
-   **Idan ba a bar bukukuwa ba.** Ba tare da `holidays` ba, ana ɗaukar ayoyin hutu a matsayin ayoyi na yau da kullun, wanda hakan ke canza ayar kowace rana ta yau da kullun.
-   **Barin ayoyin da aka cire.** Ayoyi masu shekara `removedIn` har yanzu suna cikin bayanan saboda shekarun baya suna buƙatar su. Tace su da mataki na 2; kar a sauke su lokacin da ka sauke jerin.

## Gwajin Vectors

Yi amfani da waɗannan dabi'u don duba aiwatarwa.

### Hashes

| Maɓalli (a matsayin igiyar JSON) | Maɓallin tsarawa | Hex          |
| -------------------------------- | ---------------- | ------------ |
| `""`                             | 2872998923       | `0xab3e7c0b` |
| `"a"`                            | 444641715        | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`             | 1930190452       | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`       | 2020168843       | `0x7869548b` |
| `"é\|1\|GEN 1:1"`                | 3677064616       | `0xdb2b8da8` |

### Kwanakin Shekara

| Kwanan wata | Shekara | Ranar shekara |
| ----------- | ------- | ------------- |
| 2026-01-01  | 2026    | 0             |
| 2026-12-31  | 2026    | 364           |
| 2028-02-29  | 2028    | 59            |
| 2028-12-31  | 2028    | 365           |
| 1900-12-31  | 1900    | 364           |
| 2000-12-31  | 2000    | 365           |
| 0001-03-01  | 1       | 59            |
| 9999-12-31  | 9999    | 364           |

### Zaɓuɓɓuka Daga Ƙaramin Jeri

Waɗannan suna amfani da wannan jerin ayoyi goma sha shida, takwas daga cikinsu na hutu ne:

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

Kuma waɗannan bukukuwan (Hauwa'u Kirsimeti ba ta da ayoyi, don haka rana ce ta yau da kullun):

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

Ga 2026-01-01 da iri na asali, an bar ayoyin hutu guda huɗu da 1 Yahaya 4:19 (waɗanda ba a amfani da su tukuna) ba, don haka an bar ayoyi bakwai. An tsara su ta hanyar maɓallan rarrabuwarsu, sune:

| Matsayi | Maɓalli             | Maɓallin tsarawa |
| ------- | ------------------- | ---------------- |
| 0       | `\|2026\|PSA 23:1`  | 638659039        |
| 1       | `\|2026\|ROM 8:28`  | 1462075190       |
| 2       | `\|2026\|PRO 3:5`   | 1643805236       |
| 3       | `\|2026\|JHN 3:16`  | 1930190452       |
| 4       | `\|2026\|PHP 4:13`  | 2076082788       |
| 5       | `\|2026\|GEN 1:1`   | 2439817197       |
| 6       | `\|2026\|ISA 40:31` | 3044461366       |

Ranar 1 ga Janairu rana ce ta 0, don haka ayar ranar ita ce Zabura 23:1. Ranar 15 ga Maris rana ce ta 73, kuma 73 mod 7 = 3, don haka Yahaya 3:16 ne.

A lokacin Kirsimeti, ayoyin Kirsimeti da ake amfani da su ne kawai suka rage. A shekarar 2027 akwai guda uku, an tsara su ta hanyar maɓallan tsara su:

| Matsayi | Maɓalli                 | Maɓallin tsarawa |
| ------- | ----------------------- | ---------------- |
| 0       | `\|christmas\|LUK 2:10` | 1698480150       |
| 1       | `\|christmas\|MAT 1:23` | 2563849700       |
| 2       | `\|christmas\|LUK 2:7`  | 3160581874       |

2027 mod 3 = 2, don haka ayar ranar a Kirsimeti 2027 ita ce Luka 2:7. A cikin 2026, Matiyu 1:23 ba a amfani da ita tukuna, don haka akwai biyu kawai, kuma 2026 mod 2 = 0 ya ba Luka 2:10-11.

Hutun bayan Lahadin Tashin Kiyama yana ɗaukar kwana uku. Ayoyi huɗu nasa, waɗanda aka tsara bisa ga maɓallan su, sune:

| Matsayi | Maɓalli                                 | Maɓallin tsarawa |
| ------- | --------------------------------------- | ---------------- |
| 0       | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114         |
| 1       | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464        |
| 2       | `\|post-resurrection-sunday\|1CO 15:20` | 820536316        |
| 3       | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482       |

A shekara ta 2026 ana lura da shi a kwana uku, don haka `k` = 3, kuma matsayin Afrilu 6, 7, da 8 sune 2026 × 3 + 0 = 6078, 6079, da 6080. 6078 mod 4 = 2, 6079 mod 4 = 3, da 6080 mod 4 = 0 ya ba 1 Korintiyawa 15:20, Ayukan Manzanni 2:24, da 1 Tasalonikawa 4:14. A shekara ta 2027, matsayin ya ci gaba daga 6081, don haka ayar da ke gaba ita ce Romawa 6:9.

| Kwanan wata | Iri      | Nau'i       | Aya ta ranar               |
| ----------- | -------- | ----------- | -------------------------- |
| 2026-01-01  |          |             | ZAB 23:1                   |
| 2026-01-02  |          |             | ROM 8:28                   |
| 2026-03-15  |          |             | YAH 3:16                   |
| 2026-12-31  |          |             | ZAB 23:1                   |
| 2027-01-01  |          |             | YAH 3:16                   |
| 2027-06-30  |          |             | PRO 3:5-6                  |
| 2028-02-29  |          |             | PRO 3:5-6                  |
| 2028-12-31  |          |             | ZAB 23:1                   |
| 1969-12-31  |          |             | PRO 3:5-6                  |
| 0001-01-01  |          |             | ISAH 40:31                 |
| 2026-01-01  | `my-app` |             | ISAH 40:31                 |
| 2027-01-01  | `my-app` |             | PHP 4:13                   |
| 2026-01-01  |          | `hope`      | ROM 8:28                   |
| 2027-01-01  |          | `hope`      | ISAH 40:31                 |
| 2027-01-01  |          | `joy`       | Babu wata rana ta musamman |
| 2026-12-25  |          |             | LUK 2:10-11                |
| 2027-12-25  |          |             | LUK 2:7                    |
| 2028-12-25  |          |             | LUK 2:10-11                |
| 2029-12-25  |          |             | MAT 1:23                   |
| 2026-12-25  | `my-app` |             | LUK 2:10-11                |
| 2026-04-05  |          |             | MAT 28:6                   |
| 2027-03-28  |          |             | MAT 28:6                   |
| 2028-04-16  |          |             | ZAB 23:1                   |
| 2026-12-24  |          |             | ZAB 23:1                   |
| 2026-07-01  |          | `christmas` | LUK 2:7                    |
| 2026-04-06  |          |             | 1KO 15:20                  |
| 2026-04-07  |          |             | AYUKAN 2:24                |
| 2026-04-08  |          |             | 1TH 4:14                   |
| 2026-04-09  |          |             | ZAB 23:1                   |
| 2027-03-29  |          |             | ROM 6:9                    |
| 2027-03-30  |          |             | 1KO 15:20                  |
| 2027-03-31  |          |             | AYUKAN 2:24                |

2028-04-16 ranar tashin matattu ce, amma ba ta cikin jerin `dates` ba, don haka rana ce ta yau da kullun.

### Zaɓuɓɓuka Daga Tsarin Bayanai

Bayanan da aka tattara ba sa canza ayoyin shekarar da ta fara, don haka waɗannan ayoyin 2026 na yau suna nan iri ɗaya:

| Kwanan wata | Hutu                         | Aya ta ranar     |
| ----------- | ---------------------------- | ---------------- |
| 2026-01-01  |                              | ZAB 32:1         |
| 2026-04-03  | Barka da Juma'a              | LUK 23:33        |
| 2026-04-05  | Lahadin Tashin Matattu       | MAT 28:9         |
| 2026-04-06  | Lahadi Bayan Tashin Alƙiyama | RU'YA TA 1:17-18 |
| 2026-06-15  |                              | EST 4:14         |
| 2026-10-28  |                              | Zabura 136:1     |
| 2026-10-31  | Duk Hallows' Eve             | AFI 5:8          |
| 2026-11-29  | Lahadi ta Farko ta Advent    | MAL 3:1          |
| 2026-12-24  | Hauwa'ar Kirsimeti           | MAT 1:21         |
| 2026-12-25  | Kirsimeti                    | ISA 9:6          |
| 2026-12-31  |                              | EZK 36:26        |

## Aiwatarwa

Waɗannan aiwatarwa suna bin ƙa'idar, kuma gwaje-gwajensu suna tabbatar da ƙimar da ke cikin wannan shafin:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` da `FreeUseBibleApi.getVerseOfTheDay()` a cikin fakitin [`free-use-bible-api`](../../sdks/javascript.md) ( [tushe](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` da `FreeUseBibleApi.getVerseOfTheDay()` a cikin [Kotlin SDK](../../sdks/kotlin.md) ( [source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` da `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` a cikin [Swift SDK](../../sdks/swift.md) ( [tushe](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Kayan aiki na `getVerseOfTheDay` na [uwar garken MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [tushe](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` cikin `@helloao/tools` ( [tushe](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), wanda ke amfani da jerin da aka gina a cikin kunshin.
