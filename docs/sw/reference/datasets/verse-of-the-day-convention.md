# Mkutano wa Mstari wa Siku

Ukurasa huu unabainisha jinsi ya kuchagua mstari wa siku kutoka kwa [seti `verse-of-the-day` ya data](./README.md#verse-of-the-day) , ili uweze kuutekeleza katika lugha yoyote na kupata mstari sawa na utekelezaji mwingine wowote.

API imetengenezwa kwa faili tuli, kwa hivyo haikuchagulii mstari. Utaratibu huu ni chaguo-msingi linaloshirikiwa: programu zinazoufuata zinaonyesha mstari huo huo siku hiyo hiyo. Programu ni huru kuchagua tofauti, na [mbegu](#seeds) huwapa njia rahisi ya kufanya hivyo huku wakiweka dhamana zile zile.

## Dhamana

-   **Kinachoamua.** Tarehe ile ile (na mbegu) hutoa mstari ule ule, kwenye kila kifaa na katika kila utekelezaji.
-   **Hakuna marudio ndani ya mwaka mmoja.** Kila mwaka una mpangilio wake wa mistari uliochanganywa, na siku za mwaka hupitia. Seti ya data huwa na angalau mistari 366 kwa kila siku inayotumika, kwa hivyo mstari hauonekani mara mbili katika mwaka mmoja wa kalenda.
-   **Sikukuu.** Katika sikukuu ya Kikristo (kama vile Krismasi au Jumapili ya Ufufuo), mstari wa siku ni mojawapo ya mistari ya sikukuu. Sikukuu hupitia mistari yake mwaka mmoja baada ya mwingine, kwa hivyo huwa na mstari tofauti kila mwaka hadi mistari yake yote itumike. Sikukuu inayodumu kwa siku kadhaa (kama siku tatu baada ya Jumapili ya Ufufuo) huwa na mstari tofauti kila siku. Mistari ya sikukuu haitumiki siku zingine.
-   **Mpangilio mpya kila mwaka.** Mpangilio haurudiwi mara tu kila mstari unapotumika. Kwa sababu kila mwaka huchanganywa kando, mstari huo huo unaweza kuonekana mara kwa mara tarehe 31 Desemba na tena tarehe 1 Januari (karibu 1 katika Mwaka Mpya 650).
-   **Historia thabiti.** Seti ya data huongeza au kuondoa mistari kutoka mwaka ambao haujaanza bado (tazama [`addedIn` na `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), kwa hivyo mstari wa siku kwa tarehe ambayo tayari imetokea haubadiliki kamwe.
-   **Bila kujali mpangilio wa orodha.** Nafasi ya kila mstari katika mpangilio wa mwaka hutokana na marejeleo yake, kwa hivyo mpangilio wa orodha haujalishi.

## Ingizo

| Ingizo    | Maelezo                                                                                                                                                                                                                                                                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mistari   | Safu `verses` kutoka [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Kila mstari una `book` , `chapter` , `verse` , na `categories` , na unaweza kuwa na `endVerse` , `addedIn` , na `removedIn` .                                                                                                                       |
| Tarehe    | Tarehe ya kalenda (mwaka, mwezi, na siku). Kwa "leo", tumia tarehe ya mtumiaji ya ndani, si tarehe iliyo katika UTC.                                                                                                                                                                                                                                   |
| Mbegu     | Hiari. Mfuatano unaochagua mpangilio tofauti. Hutumika kama mfuatano mbadala wa mfuatano mtupu, ambao hutoa mstari wa kawaida wa siku.                                                                                                                                                                                                                 |
| Sikukuu   | Safu ya `holidays` kutoka kwa faili moja. Kila likizo ina `id` ya kategoria yake, na ama `month` na `day` (likizo katika tarehe sawa kila mwaka) au orodha ya `dates` ( `YYYY-MM-DD` , kwa mpangilio) kwa likizo ambayo tarehe yake hubadilika kila mwaka. Likizo inaweza kuorodhesha tarehe kadhaa katika mwaka huo huo ikiwa hudumu kwa siku kadhaa. |
| Kategoria | Hiari. Chagua tu kutoka kwa mistari iliyo na kategoria hii katika `categories` yao, siku yoyote.                                                                                                                                                                                                                                                       |

## Algorithimu

### Hatua ya 1: Tafuta mwaka na siku ya mwaka

Chukua mwaka, mwezi, na siku ya tarehe, na siku ya tarehe ya mwaka, ukihesabu kuanzia 0: Januari 1 ni siku ya 0, Desemba 31 ni siku ya 364 (au siku ya 365 katika mwaka mrefu).

Tarehe hutumia kalenda ya Gregorian ya proleptic: mwaka ni mwaka wa kurukaruka ikiwa unaweza kugawanywa kwa 4, isipokuwa miaka inayoweza kugawanywa kwa 100 ambayo haiwezi kugawanywa kwa 400 (2000 ni mwaka wa kurukaruka, 1900 sio).

### Hatua ya 2: Weka mistari inayotumika

Weka mistari inayotumika katika mwaka:

-   `addedIn` haipo (au null), au `addedIn <= year` , na
-   `removedIn` haipo (au null), au `year < removedIn` .

### Hatua ya 3: Chagua mistari ya kuchagua

Chagua mistari ya kuchagua, kiambishi awali cha ufunguo kwa hatua ya 4, na nafasi kwa hatua ya 7:

1. **Kategoria ilitolewa.** Endelea kutumia mistari ambayo `categories` yake ina hiyo. Kiambishi awali ni `{seed}|{year}` na nafasi ni siku ya mwaka.
2. **Hakuna kategoria iliyotolewa, na tarehe ni likizo.** Tarehe ni likizo ikiwa likizo katika `holidays` ina tarehe `month` na `day` , au inaorodhesha tarehe katika `dates` yake (imeandikwa kama `YYYY-MM-DD` , ikiwa na mwaka wa tarakimu nne). Ikiwa likizo zaidi ya moja zinalingana, tumia ya kwanza kwenye orodha (seti ya data haijawahi kuwa na likizo mbili katika tarehe moja). Weka mistari inayotumika ambayo `categories` ina `id` ya likizo. Ikiwa zipo, kiambishi awali ni `{seed}|{id}` (kwa mfano `|christmas` ) na nafasi ni `year × k + i` , ambapo `k` ni idadi ya siku ambazo likizo huzingatiwa katika mwaka (1 kwa likizo yenye `month` na `day` ; vinginevyo idadi ya `dates` yake katika mwaka wa tarehe) na `i` ni idadi ya siku hizo zinazokuja kabla ya tarehe. Kwa likizo inayozingatiwa siku moja kwa mwaka, nafasi ni mwaka tu. Ikiwa hazipo, endelea na 3.
3. **Vinginevyo.** Endelea kutumia mistari ambayo `categories` haina `id` ya likizo yoyote katika `holidays` Kiambishi awali ni `{seed}|{year}` na nafasi ni siku ya mwaka.

`seed` ni mbegu (kamba tupu kwa chaguo-msingi), na `year` ni mwaka kutoka hatua ya 1 katika desimali bila sufuri zinazoongoza (km `2026` , `1` ).

Kama hakuna mistari iliyobaki, hakuna mstari wa siku.

Sikukuu ambazo tarehe zake hubadilika kila mwaka huorodhesha tarehe ambazo zimehesabiwa mapema (kwa sasa ni 2026 hadi 2125), kwa hivyo katika miaka mingine ni siku za kawaida. Usihesabu tarehe mwenyewe.

### Hatua ya 4: Jenga ufunguo wa kila mstari

Kwa kila mstari uliobaki, tengeneza mfuatano huu:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` ni kiambishi awali kutoka hatua ya 3.
-   `book` ni mstari wa `book` kama vile unavyoonekana kwenye seti ya data (kitambulisho cha kitabu cha USFM chenye herufi kubwa kama vile `JHN` au `1JN` ).
-   `chapter` na `verse` ziko katika desimali bila sufuri zinazoongoza.
-   `endVerse` si sehemu ya ufunguo. Kifungu kinatambuliwa na mstari wake wa kwanza.

Kwa mfano, ufunguo wa Yohana 3:16 katika siku ya kawaida mwaka wa 2026 wenye mbegu chaguo-msingi ni `|2026|JHN 3:16` , na ufunguo wa Luka 2:7 wakati wa Krismasi ni `|christmas|LUK 2:7` .

### Hatua ya 5: Weka alama kwenye kila ufunguo

Weka baiti za UTF-8 za ufunguo kwa kutumia hashi [ya FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) ya biti 32, kisha changanya matokeo na kimaliziaji cha [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Hesabu zote ziko kwenye nambari kamili za biti 32 ambazo hazijasainiwa, kwa hivyo kuzidisha huzunguka (huchukuliwa moduli 2³²) na mabadiliko ya kulia ni ya kimantiki (hubadilika katika sufuri).

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

Matokeo yake ni ufunguo wa kupanga wa mstari, nambari kuanzia 0 hadi 4,294,967,295.

### Hatua ya 6: Panga mistari

Panga mistari kwa kutumia ufunguo wao wa kupanga, mdogo zaidi kwanza, ukilinganisha funguo kama nambari ambazo hazijasainiwa.

Ikiwa mistari miwili ina ufunguo sawa wa kupanga (ambao ni nadra sana), weka ule ambao mfuatano wa ufunguo kutoka hatua ya 4 unatangulia katika mpangilio wa ordinal (msimbo wa herufi) kwanza. Mifuatano ya ufunguo huanza na kiambishi awali kimoja, kwa hivyo hutofautiana tu katika marejeleo ya ASCII yanayofuata.

### Hatua ya 7: Chagua mstari

Mstari wa siku ni mstari ulio katika nafasi `p mod n` katika orodha iliyopangwa (kuhesabu kutoka 0), ambapo `p` ni nafasi kutoka hatua ya 3 (siku ya mwaka, au `year × k + i` kwenye likizo) na `n` ni idadi ya mistari katika orodha iliyopangwa. Matokeo ya `mod` hayawi hasi kamwe (kwa mwaka hasi, ongeza `n` hadi isiwe).

Katika siku za kawaida, seti kamili ya data ina angalau mistari 366, kwa hivyo `day mod n` ni `day` tu. `mod` ni muhimu unapochagua kutoka kwa kategoria au orodha yako mwenyewe yenye mistari michache kuliko siku zilizopo katika mwaka, ambapo mistari hurudiwa ndani ya mwaka. Katika likizo, nafasi hiyo hupitia mistari ya likizo mwaka mmoja (na, kwa likizo inayodumu kwa siku kadhaa, siku moja) kwa wakati mmoja.

## Msimbo bandia

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

Kila tarehe ya kawaida katika mwaka hutumia orodha ile ile iliyopangwa, kwa hivyo ukichagua mistari kwa tarehe nyingi, panga mara moja kwa mwaka na uitumie tena.

## Mbegu

Mbegu hubadilisha ufunguo wa kila mstari, kwa hivyo hutoa mpangilio tofauti kabisa wenye dhamana sawa (hakuna marudio ndani ya mwaka mmoja, mpangilio mpya kila mwaka, historia thabiti). Tumia mbegu yako mwenyewe, kama vile jina la programu yako, ikiwa unataka programu yako iwe na mstari wake wa siku badala ya ule ulioshirikiwa. Iache tupu ili kuonyesha mstari sawa na kila mtu mwingine.

## Makosa ya Kawaida

-   **Nambari kamili zilizosainiwa.** Katika lugha zisizo na nambari kamili za biti 32 ambazo hazijasainiwa (Java, Kotlin, JavaScript), fanya hesabu kwenye nambari kamili za biti 32 zilizosainiwa na utumie mabadiliko ya kulia ya kimantiki ( `>>>` ), kisha ubadilishe matokeo kuwa thamani isiyosainiwa (km `hash.toLong() and 0xFFFFFFFF` , au `hash >>> 0` katika JavaScript) kabla ya kulinganisha. Katika JavaScript, tumia `Math.imul` kwa kuzidisha; `*` hupoteza usahihi.
-   **Kuweka herufi hashi badala ya baiti.** Weka baiti za UTF-8 kwenye ufunguo, si vitengo vyake vya msimbo vya UTF-16 au pointi za msimbo wa Unicode. Hii ni muhimu tu kwa mbegu zenye herufi zisizo za ASCII, lakini hizo zinaruhusiwa.
-   **Kutumia UTC kwa "leo".** Mstari wa siku hubadilika saa sita usiku wa mtumiaji. Kutumia tarehe katika UTC kunaonyesha mstari wa siku iliyopita au inayofuata kwa sehemu ya siku katika maeneo mengi ya saa.
-   **Kuhesabu siku ya mwaka kuanzia tarehe 1.** Januari 1 ni siku 0.
-   **Kuhesabu tarehe za likizo.** Tumia `dates` iliyoorodheshwa kwenye seti ya data. Makanisa na kalenda tofauti huhesabu Pasaka tofauti, na seti ya data huorodhesha tu tarehe ambazo imezihesabu mapema.
-   **Tukiacha likizo.** Bila `holidays` , mistari ya likizo huchukuliwa kama mistari ya kawaida, ambayo hubadilisha pia mstari wa kila siku wa kawaida.
-   **Kuacha mistari iliyoondolewa.** Mistari yenye mwaka `removedIn` bado iko kwenye seti ya data kwa sababu miaka ya awali inazihitaji. Zichuje kwa hatua ya 2; usiziache unapopakua orodha.

## Vekta za Majaribio

Tumia thamani hizi kuangalia utekelezaji.

### Hashes

| Ufunguo (kama mfuatano wa JSON) | Kitufe cha kupanga | Heksa        |
| ------------------------------- | ------------------ | ------------ |
| `""`                            | 2872998923         | `0xab3e7c0b` |
| `"a"`                           | 444641715          | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`            | 1930190452         | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`      | 2020168843         | `0x7869548b` |
| `"é\|1\|GEN 1:1"`               | 3677064616         | `0xdb2b8da8` |

### Siku za Mwaka

| Tarehe     | Mwaka | Siku ya mwaka |
| ---------- | ----- | ------------- |
| 2026-01-01 | 2026  | 0             |
| 2026-12-31 | 2026  | 364           |
| 2028-02-29 | 2028  | 59            |
| 2028-12-31 | 2028  | 365           |
| 1900-12-31 | 1900  | 364           |
| 2000-12-31 | 2000  | 365           |
| 0001-03-01 | 1     | 59            |
| 9999-12-31 | 9999  | 364           |

### Chaguo Kutoka kwenye Orodha Ndogo

Hizi hutumia orodha hii ya mistari kumi na sita, nane kati yake ni za sikukuu:

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

Na sikukuu hizi (Mkesha wa Krismasi hauna mistari, kwa hivyo ni siku ya kawaida):

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

Kwa 2026-01-01 na mbegu chaguo-msingi, mistari minne ya sikukuu na 1 Yohana 4:19 (ambayo bado haitumiki) imeachwa, kwa hivyo mistari saba imeachwa. Zikipangwa kwa funguo zao za kupanga, ni:

| Nafasi | Ufunguo             | Kitufe cha kupanga |
| ------ | ------------------- | ------------------ |
| 0      | `\|2026\|PSA 23:1`  | 638659039          |
| 1      | `\|2026\|ROM 8:28`  | 1462075190         |
| 2      | `\|2026\|PRO 3:5`   | 1643805236         |
| 3      | `\|2026\|JHN 3:16`  | 1930190452         |
| 4      | `\|2026\|PHP 4:13`  | 2076082788         |
| 5      | `\|2026\|GEN 1:1`   | 2439817197         |
| 6      | `\|2026\|ISA 40:31` | 3044461366         |

Januari 1 ni siku ya 0, kwa hivyo mstari wa siku ni Zaburi 23:1. Machi 15 ni siku ya 73, na 73 mod 7 = 3, kwa hivyo ni Yohana 3:16.

Siku ya Krismasi, ni mistari ya Krismasi pekee inayotumika ndiyo iliyobaki. Mnamo 2027 kuna mitatu, iliyopangwa kwa funguo zao za kupanga:

| Nafasi | Ufunguo                 | Kitufe cha kupanga |
| ------ | ----------------------- | ------------------ |
| 0      | `\|christmas\|LUK 2:10` | 1698480150         |
| 1      | `\|christmas\|MAT 1:23` | 2563849700         |
| 2      | `\|christmas\|LUK 2:7`  | 3160581874         |

2027 mod 3 = 2, kwa hivyo mstari wa siku ya Krismasi 2027 ni Luka 2:7. Mnamo 2026, Mathayo 1:23 bado haitumiki, kwa hivyo kuna mbili tu, na 2026 mod 2 = 0 inatoa Luka 2:10-11.

Likizo baada ya Jumapili ya Ufufuo huchukua siku tatu. Aya zake nne, zilizopangwa kwa funguo zao za mpangilio, ni:

| Nafasi | Ufunguo                                 | Kitufe cha kupanga |
| ------ | --------------------------------------- | ------------------ |
| 0      | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114           |
| 1      | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464          |
| 2      | `\|post-resurrection-sunday\|1CO 15:20` | 820536316          |
| 3      | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482         |

Mnamo 2026 inazingatiwa kwa siku tatu, kwa hivyo `k` = 3, na nafasi za Aprili 6, 7, na 8 ni 2026 × 3 + 0 = 6078, 6079, na 6080. 6078 mod 4 = 2, 6079 mod 4 = 3, na 6080 mod 4 = 0 toa 1 Wakorintho 15:20, Matendo 2:24, na 1 Wathesalonike 4:14. Mnamo 2027 nafasi zinaendelea kutoka 6081, kwa hivyo mstari unaofuata ni Warumi 6:9.

| Tarehe     | Mbegu    | Kategoria   | Mstari wa siku        |
| ---------- | -------- | ----------- | --------------------- |
| 2026-01-01 |          |             | PSA 23:1              |
| 2026-01-02 |          |             | Warumi 8:28           |
| 2026-03-15 |          |             | JN 3:16               |
| 2026-12-31 |          |             | PSA 23:1              |
| 2027-01-01 |          |             | JN 3:16               |
| 2027-06-30 |          |             | PRO 3:5-6             |
| 2028-02-29 |          |             | PRO 3:5-6             |
| 2028-12-31 |          |             | PSA 23:1              |
| 1969-12-31 |          |             | PRO 3:5-6             |
| 0001-01-01 |          |             | ISAYA 40:31           |
| 2026-01-01 | `my-app` |             | ISAYA 40:31           |
| 2027-01-01 | `my-app` |             | PHP 4:13              |
| 2026-01-01 |          | `hope`      | Warumi 8:28           |
| 2027-01-01 |          | `hope`      | ISAYA 40:31           |
| 2027-01-01 |          | `joy`       | Hakuna mstari wa siku |
| 2026-12-25 |          |             | LUKA 2:10-11          |
| 2027-12-25 |          |             | Luka 2:7              |
| 2028-12-25 |          |             | LUKA 2:10-11          |
| 2029-12-25 |          |             | Mathayo 1:23          |
| 2026-12-25 | `my-app` |             | LUKA 2:10-11          |
| 2026-04-05 |          |             | Mathayo 28:6          |
| 2027-03-28 |          |             | Mathayo 28:6          |
| 2028-04-16 |          |             | PSA 23:1              |
| 2026-12-24 |          |             | PSA 23:1              |
| 2026-07-01 |          | `christmas` | Luka 2:7              |
| 2026-04-06 |          |             | 1KORINTHO 15:20       |
| 2026-04-07 |          |             | Matendo 2:24          |
| 2026-04-08 |          |             | 1TH 4:14              |
| 2026-04-09 |          |             | PSA 23:1              |
| 2027-03-29 |          |             | Warumi 6:9            |
| 2027-03-30 |          |             | 1KORINTHO 15:20       |
| 2027-03-31 |          |             | Matendo 2:24          |

2028-04-16 ni Jumapili ya Ufufuo, lakini haiko kwenye orodha hii `dates` , kwa hivyo ni siku ya kawaida.

### Chaguo Kutoka kwa Seti ya Data

Seti ya data haibadilishi mistari ya mwaka ulioanza, kwa hivyo mistari hii ya siku 2026 inabaki vile vile:

| Tarehe     | Likizo                        | Mstari wa siku |
| ---------- | ----------------------------- | -------------- |
| 2026-01-01 |                               | PSA 32:1       |
| 2026-04-03 | Ijumaa Kuu                    | LUKA 23:33     |
| 2026-04-05 | Jumapili ya Ufufuo            | Mathayo 28:9   |
| 2026-04-06 | Baada ya Ufufuo Jumapili      | UFUNUO 1:17-18 |
| 2026-06-15 |                               | EST 4:14       |
| 2026-10-28 |                               | PSA 136:1      |
| 2026-10-31 | Hawa ya Watakatifu Wote       | Waefeso 5:8    |
| 2026-11-29 | Jumapili ya Kwanza ya Majilio | MALAKI 3:1     |
| 2026-12-24 | Mkesha wa Krismasi            | Mathayo 1:21   |
| 2026-12-25 | Krismasi                      | ISAYA 9:6      |
| 2026-12-31 |                               | EZEKI 36:26    |

## Utekelezaji

Utekelezaji huu unafuata kanuni, na majaribio yao huangalia thamani kwenye ukurasa huu:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` na `FreeUseBibleApi.getVerseOfTheDay()` katika kifurushi cha [`free-use-bible-api`](../../sdks/javascript.md) ( [chanzo](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` na `FreeUseBibleApi.getVerseOfTheDay()` katika [Kotlin SDK](../../sdks/kotlin.md) ( [chanzo](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` na `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` katika [Swift SDK](../../sdks/swift.md) ( [chanzo](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Zana `getVerseOfTheDay` ya [seva ya MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [chanzo](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` kati ya `@helloao/tools` ( [chanzo](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), ambayo hutumia orodha iliyojengwa ndani ya kifurushi.
