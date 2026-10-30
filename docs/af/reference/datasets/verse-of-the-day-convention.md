# Vers van die Dag Konvensie

Hierdie bladsy spesifiseer hoe om die vers van die dag uit die [`verse-of-the-day` datastel](./README.md#verse-of-the-day) te kies, sodat jy dit in enige taal kan implementeer en dieselfde vers as elke ander implementering kan kry.

Die API is gemaak van statiese lêers, so dit kies nie 'n vers vir jou nie. Die konvensie is 'n gedeelde standaard: programme wat dit volg, wys dieselfde vers op dieselfde dag. Programme is vry om anders te kies, en die [saad](#seeds) gee hulle 'n maklike manier om dit te doen terwyl dieselfde waarborge behoue ​​bly.

## Waarborge

-   **Deterministies.** Dieselfde datum (en saad) gee altyd dieselfde vers, op elke toestel en in elke implementering.
-   **Geen herhalings binne 'n jaar nie.** Elke jaar het sy eie geskommelde volgorde van die verse, en die jaar se dae loop daardeur. Die datastel het altyd ten minste 366 verse vir elke dag in gebruik, so 'n vers verskyn nooit twee keer in dieselfde kalenderjaar nie.
-   **Vakansiedae.** Op 'n Christelike vakansiedag (soos Kersfees of Opstandingsondag), is die vers van die dag een van die vakansiedag se verse. 'n Vakansiedag gaan jaar op jaar deur sy verse, so dit het elke jaar 'n ander vers totdat al sy verse gebruik is. 'n Vakansiedag wat 'n paar dae duur (soos die drie dae na Opstandingsondag) het 'n ander vers op elke dag. Vakansiedagverse word nie op ander dae gebruik nie.
-   **'n Nuwe volgorde elke jaar.** Die volgorde word nie herhaal sodra elke vers gebruik is nie. Omdat elke jaar afsonderlik geskommel word, kan dieselfde vers soms op 31 Desember en weer op 1 Januarie verskyn (ongeveer 1 in 650 Nuwejaars).
-   **Stabiele geskiedenis.** Die datastel voeg slegs verse by of verwyder dit van 'n jaar wat nog nie begin het nie (sien [`addedIn` en `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), dus verander die vers van die dag vir 'n datum wat reeds plaasgevind het nooit.
-   **Onafhanklik van lysvolgorde.** Elke vers se plek in 'n jaar se volgorde kom van sy eie verwysing, dus maak die volgorde van die lys nie saak nie.

## Insette

| Invoer      | Beskrywing                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verse       | Die `verses` skikking van [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Elke vers het 'n `book` , `chapter` , `verse` en `categories` , en kan `endVerse` , `addedIn` en `removedIn` hê.                                                                                                                                            |
| Datum       | 'n Kalenderdatum (jaar, maand en dag). Vir "vandag", gebruik die gebruiker se plaaslike datum, nie die datum in UTC nie.                                                                                                                                                                                                                                            |
| Saad        | Opsioneel. 'n String wat 'n ander volgorde kies. Standaard word die leë string gebruik, wat die standaardvers van die dag gee.                                                                                                                                                                                                                                      |
| Vakansiedae | Die `holidays` skikking van dieselfde lêer. Elke vakansiedag het die `id` van sy kategorie, en óf 'n `month` en `day` (’n vakansiedag op dieselfde datum elke jaar) óf 'n lys van `dates` ( `YYYY-MM-DD` , in volgorde) vir 'n vakansiedag waarvan die datum elke jaar verander. 'n Vakansiedag kan verskeie datums in dieselfde jaar lys as dit verskeie dae duur. |
| Kategorie   | Opsioneel. Kies slegs uit die verse wat hierdie kategorie in hul `categories` het, op enige dag.                                                                                                                                                                                                                                                                    |

## Algoritme

### Stap 1: Vind die jaar en die dag van die jaar

Neem die jaar, maand en dag van die datum, en die datum se dag van die jaar, tel vanaf 0: 1 Januarie is dag 0, 31 Desember is dag 364 (of dag 365 in 'n skrikkeljaar).

Datums gebruik die proleptiese Gregoriaanse kalender: 'n jaar is 'n skrikkeljaar as dit deelbaar is deur 4, behalwe vir jare deelbaar deur 100 wat nie deelbaar is deur 400 nie (2000 is 'n skrikkeljaar, 1900 is nie).

### Stap 2: Behou die verse wat in gebruik is

Behou die verse wat in die jaar gebruik word:

-   `addedIn` ontbreek (of nul), of `addedIn <= year` , en
-   `removedIn` ontbreek (of nul), of `year < removedIn` .

### Stap 3: Kies die verse om van te kies

Kies die verse om van te kies, 'n sleutelvoorvoegsel vir stap 4, en 'n posisie vir stap 7:

1. **'n Kategorie is gegee.** Hou die verse in gebruik waarvan die `categories` dit bevat. Die voorvoegsel is `{seed}|{year}` en die posisie is die dag van die jaar.
2. **Geen kategorie is gegee nie, en die datum is 'n vakansiedag.** Die datum is 'n vakansiedag as 'n vakansiedag in `holidays` die datums `month` en `day` het, of die datum in sy `dates` lys (geskryf as `YYYY-MM-DD` , met 'n viersyferjaar). Indien meer as een vakansiedag ooreenstem, gebruik die eerste een in die lys (die datastel het nooit twee vakansiedae op dieselfde datum nie). Hou die verse in gebruik waarvan die `categories` die vakansiedag se `id` bevat. Indien daar enige is, is die voorvoegsel `{seed}|{id}` (byvoorbeeld `|christmas` ) en die posisie is `year × k + i` , waar `k` die aantal dae is wat die vakansiedag in die jaar gevier word (1 vir 'n vakansiedag met 'n `month` en `day` ; andersins die aantal van sy `dates` in die datum se jaar) en `i` die aantal dae is wat voor die datum kom. Vir 'n vakansiedag wat op een dag per jaar gevier word, is die posisie net die jaar. Indien daar nie enige is nie, gaan voort met 3.
3. **Andersins.** Hou die verse in gebruik waarvan die `categories` nie die `id` van enige vakansiedag in `holidays` bevat nie. Die voorvoegsel is `{seed}|{year}` en die posisie is die dag van die jaar.

`seed` is die saad (die leë string by verstek), en `year` is die jaar vanaf stap 1 in desimaal sonder voorlopernulle (bv. `2026` , `1` ).

As geen verse oorbly nie, is daar geen vers van die dag nie.

Vakansiedae waarvan die datum elke jaar verander, lys slegs die datums wat vooraf bereken is (tans 2026 tot 2125), dus in ander jare is dit gewone dae. Moenie die datums self bereken nie.

### Stap 4: Bou elke vers se sleutel

Vir elke vers wat oorbly, bou hierdie string:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` is die voorvoegsel van stap 3.
-   `book` is die vers se `book` presies soos dit in die datastel verskyn (’n hoofletter USFM boek-ID soos `JHN` of `1JN` ).
-   `chapter` en `verse` is in desimale getal sonder voorlopernulle.
-   `endVerse` is nie deel van die toonsoort nie. 'n Passasie word geïdentifiseer deur sy eerste vers.

Byvoorbeeld, die sleutel vir Johannes 3:16 op 'n gewone dag in 2026 met die standaardsaad is `|2026|JHN 3:16` , en die sleutel vir Lukas 2:7 op Kersfees is `|christmas|LUK 2:7` .

### Stap 5: Hash elke sleutel

Hash die UTF-8 grepe van die sleutel met die 32-bis [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash, meng dan die resultaat met die [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` finaliseerder. Alle rekenkunde is op ongetekende 32-bis heelgetalle, dus draai vermenigvuldigings om (hulle word modulo 2³² geneem) en regs skuif is logies (hulle skuif in nulle).

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

Die resultaat is die vers se sorteersleutel, 'n getal van 0 tot 4 294 967 295.

### Stap 6: Sorteer die verse

Sorteer die verse volgens hul sorteersleutel, die kleinste eerste, en vergelyk die sleutels as ongetekende getalle.

Indien twee verse dieselfde sorteersleutel het (wat baie skaars is), plaas die een waarvan die sleutelstring van stap 4 eerste in ordinale (karakterkode) volgorde kom. Die sleutelstringe begin almal met dieselfde voorvoegsel, dus verskil hulle slegs in die ASCII-verwysing wat volg.

### Stap 7: Kies die vers

Die vers van die dag is die vers by posisie `p mod n` in die gesorteerde lys (tel vanaf 0), waar `p` die posisie van stap 3 is (die dag van die jaar, of `year × k + i` op 'n vakansiedag) en `n` die aantal verse in die gesorteerde lys is. Die resultaat van `mod` is nooit negatief nie (vir 'n negatiewe jaar, tel `n` by totdat dit nie meer is nie).

Op gewone dae het die volledige datastel ten minste 366 verse, so `day mod n` is net `day` Die `mod` maak saak wanneer jy uit 'n kategorie of 'n lys van jou eie kies met minder verse as wat daar dae in die jaar is, in welke geval verse binne die jaar herhaal word. Op 'n vakansiedag gaan die posisie deur die vakansiedag se verse een jaar (en, vir 'n vakansiedag wat 'n paar dae duur, een dag) op 'n slag.

## Pseudokode

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

Elke gewone datum in 'n jaar gebruik dieselfde gesorteerde lys, so as jy verse vir baie datums kies, sorteer dit een keer per jaar en hergebruik dit.

## Saad

Die saad verander elke vers se toonsoort, so dit gee 'n heeltemal ander volgorde met dieselfde waarborge (geen herhalings binne 'n jaar nie, 'n nuwe volgorde elke jaar, stabiele geskiedenis). Gebruik jou eie saad, soos die naam van jou toepassing, as jy wil hê jou toepassing moet sy eie vers van die dag hê in plaas van die gedeelde een. Los dit leeg om dieselfde vers as almal anders te wys.

## Algemene foute

-   **Getekende heelgetalle.** In tale sonder ongetekende 32-bis heelgetalle (Java, Kotlin, JavaScript), doen die rekenkunde op getekende 32-bis heelgetalle en gebruik 'n logiese regs skuif ( `>>>` ), skakel dan die resultaat om na 'n ongetekende waarde (bv. `hash.toLong() and 0xFFFFFFFF` of `hash >>> 0` in JavaScript) voordat jy vergelyk. In JavaScript, gebruik `Math.imul` vir die vermenigvuldigings; `*` verloor presisie.
-   **Hash karakters in plaas van grepe.** Hash die UTF-8 grepe van die sleutel, nie die UTF-16 kode-eenhede of Unicode kodepunte nie. Dit maak slegs saak vir sade met nie-ASCII karakters, maar dié word toegelaat.
-   **Gebruik UTC vir "vandag".** Die vers van die dag verander teen die gebruiker se plaaslike middernag. Deur die datum in UTC te gebruik, word die vorige of volgende dag se vers vir 'n deel van die dag in die meeste tydsones getoon.
-   **As ons die dag van die jaar vanaf 1 tel,** is 1 Januarie dag 0.
-   **Berekening van vakansiedatums.** Gebruik die `dates` wat in die datastel gelys word. Verskillende kerke en kalenders bereken Paasfees verskillend, en die datastel lys slegs die datums wat dit vooraf bereken het.
-   **Laat die vakansiedae weg.** Sonder die `holidays` word die vakansieverse as gewone verse behandel, wat ook elke gewone dag se vers verander.
-   **Verwyderde verse word weggelaat.** Verse met 'n `removedIn` jaar is steeds in die datastel omdat vorige jare hulle benodig. Filtreer hulle met stap 2; moenie hulle laat vaar wanneer jy die lys aflaai nie.

## Toetsvektore

Gebruik hierdie waardes om 'n implementering te kontroleer.

### Hashes

| Sleutel (as 'n JSON-string) | Sorteersleutel | Heksagonaal  |
| --------------------------- | -------------- | ------------ |
| `""`                        | 2872998923     | `0xab3e7c0b` |
| `"a"`                       | 444641715      | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`        | 1930190452     | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`  | 2020168843     | `0x7869548b` |
| `"é\|1\|GEN 1:1"`           | 3677064616     | `0xdb2b8da8` |

### Dae van die Jaar

| Datum      | Jaar | Dag van die jaar |
| ---------- | ---- | ---------------- |
| 2026-01-01 | 2026 | 0                |
| 2026-12-31 | 2026 | 364              |
| 2028-02-29 | 2028 | 59               |
| 2028-12-31 | 2028 | 365              |
| 1900-12-31 | 1900 | 364              |
| 2000-12-31 | 2000 | 365              |
| 0001-03-01 | 1    | 59               |
| 9999-12-31 | 9999 | 364              |

### Keuses uit 'n klein lys

Hierdie gebruik hierdie lys van sestien verse, waarvan agt vir vakansiedae is:

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

En hierdie vakansiedae (Kersaand het geen verse nie, so dit is 'n gewone dag):

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

Vir 2026-01-01 met die standaardsaad, word die vier vakansieverse en 1 Johannes 4:19 (wat nog nie in gebruik is nie) weggelaat, dus bly sewe verse oor. Gesorteer volgens hul sorteersleutels, is hulle:

| Posisie | Sleutel             | Sorteersleutel |
| ------- | ------------------- | -------------- |
| 0       | `\|2026\|PSA 23:1`  | 638659039      |
| 1       | `\|2026\|ROM 8:28`  | 1462075190     |
| 2       | `\|2026\|PRO 3:5`   | 1643805236     |
| 3       | `\|2026\|JHN 3:16`  | 1930190452     |
| 4       | `\|2026\|PHP 4:13`  | 2076082788     |
| 5       | `\|2026\|GEN 1:1`   | 2439817197     |
| 6       | `\|2026\|ISA 40:31` | 3044461366     |

1 Januarie is dag 0, so die vers van die dag is Psalm 23:1. 15 Maart is dag 73, en 73 mod 7 = 3, so dit is Johannes 3:16.

Met Kersfees is slegs die Kersverse wat in gebruik is, oor. In 2027 is daar drie, gesorteer volgens hul sorteersleutels:

| Posisie | Sleutel                 | Sorteersleutel |
| ------- | ----------------------- | -------------- |
| 0       | `\|christmas\|LUK 2:10` | 1698480150     |
| 1       | `\|christmas\|MAT 1:23` | 2563849700     |
| 2       | `\|christmas\|LUK 2:7`  | 3160581874     |

2027 mod 3 = 2, so die vers van die dag op Kersfees 2027 is Lukas 2:7. In 2026 is Matteus 1:23 nog nie in gebruik nie, so daar is slegs twee, en 2026 mod 2 = 0 gee Lukas 2:10-11.

Die vakansiedag na Opstandingsondag duur drie dae. Die vier verse, gesorteer volgens hul sorteersleutels, is:

| Posisie | Sleutel                                 | Sorteersleutel |
| ------- | --------------------------------------- | -------------- |
| 0       | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114       |
| 1       | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464      |
| 2       | `\|post-resurrection-sunday\|1CO 15:20` | 820536316      |
| 3       | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482     |

In 2026 word dit op drie dae waargeneem, dus `k` = 3, en die posisies van 6, 7 en 8 April is 2026 × 3 + 0 = 6078, 6079 en 6080. 6078 mod 4 = 2, 6079 mod 4 = 3 en 6080 mod 4 = 0 gee 1 Korintiërs 15:20, Handelinge 2:24 en 1 Tessalonisense 4:14. In 2027 gaan die posisies voort vanaf 6081, dus is die volgende vers Romeine 6:9.

| Datum      | Saad     | Kategorie   | Vers van die dag          |
| ---------- | -------- | ----------- | ------------------------- |
| 2026-01-01 |          |             | PSA 23:1                  |
| 2026-01-02 |          |             | ROMEINE 8:28              |
| 2026-03-15 |          |             | JOHANNES 3:16             |
| 2026-12-31 |          |             | PSA 23:1                  |
| 2027-01-01 |          |             | JOHANNES 3:16             |
| 2027-06-30 |          |             | SPREUKE 3:5-6             |
| 2028-02-29 |          |             | SPREUKE 3:5-6             |
| 2028-12-31 |          |             | PSA 23:1                  |
| 1969-12-31 |          |             | SPREUKE 3:5-6             |
| 0001-01-01 |          |             | JESAJA 40:31              |
| 2026-01-01 | `my-app` |             | JESAJA 40:31              |
| 2027-01-01 | `my-app` |             | PHP 4:13                  |
| 2026-01-01 |          | `hope`      | ROMEINE 8:28              |
| 2027-01-01 |          | `hope`      | JESAJA 40:31              |
| 2027-01-01 |          | `joy`       | Geen vers van die dag nie |
| 2026-12-25 |          |             | LUKAS 2:10-11             |
| 2027-12-25 |          |             | LUKAS 2:7                 |
| 2028-12-25 |          |             | LUKAS 2:10-11             |
| 2029-12-25 |          |             | MATTEUS 1:23              |
| 2026-12-25 | `my-app` |             | LUKAS 2:10-11             |
| 2026-04-05 |          |             | MATTEUS 28:6              |
| 2027-03-28 |          |             | MATTEUS 28:6              |
| 2028-04-16 |          |             | PSA 23:1                  |
| 2026-12-24 |          |             | PSA 23:1                  |
| 2026-07-01 |          | `christmas` | LUKAS 2:7                 |
| 2026-04-06 |          |             | 1 Korintiërs 15:20        |
| 2026-04-07 |          |             | HANDELING 2:24            |
| 2026-04-08 |          |             | 1 TH 4:14                 |
| 2026-04-09 |          |             | PSA 23:1                  |
| 2027-03-29 |          |             | ROMEINE 6:9               |
| 2027-03-30 |          |             | 1 Korintiërs 15:20        |
| 2027-03-31 |          |             | HANDELING 2:24            |

2028-04-16 is Opstandingsondag, maar dit is nie in hierdie lys se `dates` nie, so dit is 'n gewone dag.

### Keuses uit die datastel

Die datastel verander nooit die verse van 'n jaar wat begin het nie, so hierdie 2026 verse van die dag bly dieselfde:

| Datum      | Vakansie                 | Vers van die dag |
| ---------- | ------------------------ | ---------------- |
| 2026-01-01 |                          | PSA 32:1         |
| 2026-04-03 | Goeie Vrydag             | LUKAS 23:33      |
| 2026-04-05 | Opstandingsondag         | MATTEUS 28:9     |
| 2026-04-06 | Na die Opstanding Sondag | OPENB 1:17-18    |
| 2026-06-15 |                          | EST 4:14         |
| 2026-10-28 |                          | PSA 136:1        |
| 2026-10-31 | Allerheiligeaand         | EFESIËRS 5:8     |
| 2026-11-29 | Eerste Sondag van Advent | MAL 3:1          |
| 2026-12-24 | Kersaand                 | MATTEUS 1:21     |
| 2026-12-25 | Kersfees                 | JESAJA 9:6       |
| 2026-12-31 |                          | ESEGIËL 36:26    |

## Implementerings

Hierdie implementerings volg die konvensie, en hul toetse kontroleer die waardes op hierdie bladsy:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` en `FreeUseBibleApi.getVerseOfTheDay()` in die [`free-use-bible-api`](../../sdks/javascript.md) pakket ( [bronkode](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` en `FreeUseBibleApi.getVerseOfTheDay()` in die [Kotlin SDK](../../sdks/kotlin.md) ( [bron](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` en `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` in die [Swift SDK](../../sdks/swift.md) ( [bron](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Die `getVerseOfTheDay` instrument van die [MCP-bediener](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [bron](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` in `@helloao/tools` ( [bron](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), wat die lys gebruik wat in die pakket ingebou is.
