# Umhlangano Wevesi Losuku

Leli khasi lichaza indlela yokukhetha ivesi losuku kusethi [yedatha `verse-of-the-day`](./README.md#verse-of-the-day) , ukuze ukwazi ukulisebenzisa kunoma yiluphi ulimi futhi uthole ivesi elifanayo njenganoma yikuphi okunye ukusetshenziswa.

I-API yenziwe ngamafayela angaguquki, ngakho ayikukhetheli ivesi. Le nqubo iyinto ezenzakalelayo eyabiwe: izinhlelo zokusebenza ezilandela yona zibonisa ivesi elifanayo ngosuku olufanayo. Izinhlelo zokusebenza zikhululekile ukukhetha ngendlela ehlukile, futhi [imbewu](#seeds) izinika indlela elula yokwenza lokho ngenkathi zigcina iziqinisekiso ezifanayo.

## Iziqinisekiso

-   **I-Deterministic.** Usuku olufanayo (nembewu) luhlala lunikeza ivesi elifanayo, kuwo wonke amadivayisi nakuwo wonke umsebenzi.
-   **Akukho ukuphindaphinda phakathi nonyaka.** Unyaka ngamunye une-oda lawo elihleliwe lamavesi, futhi izinsuku zonyaka ziyadlula kulo. Isethi yedatha ihlala inamavesi okungenani angu-366 ngosuku ngalunye olusetshenziswayo, ngakho ivesi aliveli kabili ngonyaka ofanayo wekhalenda.
-   **Amaholide.** Eholidini lobuKrestu (njengeKhisimusi noma iSonto Lokuvuka), ivesi losuku lingenye yamavesi eholidi. Iholidi lidlula amavesi alo unyaka ngamunye, ngakho-ke liba nevesi elihlukile njalo ngonyaka kuze kube yilapho wonke amavesi alo esesetshenzisiwe. Iholidi elihlala izinsuku eziningana (njengezinsuku ezintathu ngemva kweSonto Lokuvuka) linevesi elihlukile ngosuku ngalunye. Amavesi eholidi awasetshenziswa kwezinye izinsuku.
-   **Uhlelo olusha njalo ngonyaka.** Uhlelo aluphindwa uma ivesi ngalinye selisetshenzisiwe. Ngenxa yokuthi unyaka ngamunye uhlanganiswa ngokwehlukana, ivesi elifanayo lingavela ngezikhathi ezithile ngoDisemba 31 futhi liphinde livele ngoJanuwari 1 (cishe li-1 eminyakeni emisha engu-650).
-   **Umlando ozinzile.** Isethi yedatha ingeza noma isuse amavesi onyakeni ongakaqali (bheka [`addedIn` no `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), ngakho ivesi losuku losuku oselwenzekile alishintshi.
-   **Kungakhathaliseki ukuthi uhlu luhlelwe kanjani.** Indawo yevesi ngalinye odabeni lonyaka ivela ekubhekiseleni kwalo, ngakho-ke ukulandelana kohlu akunandaba.

## Okokufaka

| Okokufaka | Incazelo                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amavesi   | Uhlu `verses` oluvela ku [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) . Ivesi ngalinye lino- `book` , `chapter` , `verse` , no `categories` , futhi lingaba no- `endVerse` , `addedIn` , no `removedIn` .                                                                                                                    |
| Usuku     | Usuku lwekhalenda (unyaka, inyanga, nosuku). Ku-"namuhla", sebenzisa usuku lwendawo lomsebenzisi, hhayi usuku oluku-UTC.                                                                                                                                                                                                                                      |
| Imbewu    | Ongakukhetha. Intambo ekhetha i-oda elihlukile. Iya ngokuzenzakalelayo kuntambo engenalutho, enikeza ivesi elijwayelekile losuku.                                                                                                                                                                                                                             |
| Amaholide | I-array `holidays` evela kufayela elifanayo. Iholide ngalinye lino- `id` wesigaba salo, kanye no- `month` no `day` (iholide ngosuku olufanayo minyaka yonke) noma uhlu luka- `dates` ( `YYYY-MM-DD` , ngokulandelana) lweholide olunedethi eshintsha njalo ngonyaka. Iholide lingabhala izinsuku eziningana ngonyaka ofanayo uma lihlala izinsuku eziningana. |
| Isigaba   | Ongakukhetha. Khetha kuphela emavesini analesi sigaba ku- `categories` wawo, nganoma yiluphi usuku.                                                                                                                                                                                                                                                           |

## I-Algorithm

### Isinyathelo 1: Thola unyaka nosuku lonyaka

Thatha unyaka, inyanga, nosuku losuku, kanye nosuku lonyaka, ubale kusukela ku-0: uJanuwari 1 usuku 0, uDisemba 31 usuku 364 (noma usuku 365 ngonyaka oqavile).

Izinsuku zisebenzisa ikhalenda likaGregory elibizwa ngokuthi i-proleptic: unyaka unyaka oqaqekayo uma uhlukaniswa ngo-4, ngaphandle kweminyaka eqaqekayo ngo-100 engakwazi ukuhlukaniswa ngo-400 (u-2000 unyaka oqaqekayo, u-1900 awunjalo).

### Isinyathelo sesi-2: Gcina amavesi asetshenziswayo

Gcina amavesi asetshenziswayo onyakeni:

-   `addedIn` ulahlekile (noma awunalutho), noma `addedIn <= year` , kanye
-   `removedIn` akatholakali (noma awunalutho), noma `year < removedIn` .

### Isinyathelo 3: Khetha amavesi ongakhetha kuwo

Khetha amavesi ozowakhetha, isiqalisi sesihluthulelo sesinyathelo sesi-4, kanye nendawo yesinyathelo sesi-7:

1. **Kunikezwe isigaba.** Gcina amavesi esetshenziswa `categories` wawo equkethe wona. Isiqalo singu `{seed}|{year}` kanti isikhundla siwusuku lonyaka.
2. **Akukho sigaba esinikeziwe, futhi usuku luyiholide.** Usuku luyiholide uma iholide ku- `holidays` linosuku `month` no `day` , noma libala usuku ku `dates` (olubhalwe njengo- `YYYY-MM-DD` , nonyaka onezinombolo ezine). Uma amaholide angaphezu kwelilodwa ehambisana, sebenzisa elokuqala ohlwini (isethi yedatha ayikaze ibe namaholide amabili ngosuku olufanayo). Gcina amavesi asetshenziswayo `categories` wawo aqukethe u- `id` weholide. Uma ekhona, isiqalo singu `{seed}|{id}` (isibonelo `|christmas` ) kanti isikhundla singu `year × k + i` , lapho u `k` kuyinani lezinsuku iholide eligcinwa ngazo ngonyaka (1 ngeholide elino- `month` no `day` ; ngaphandle kwalokho inani lika- `dates` ngonyaka wosuku) kanye no `i` kuyinani lalezo zinsuku eziza ngaphambi kosuku. Ngeholide eligcinwa ngosuku olulodwa ngonyaka, isikhundla singunyaka nje. Uma zingekho, qhubeka no-3.
3. **Ngaphandle kwalokho.** Gcina amavesi asetshenziswayo `categories` wawo angenawo u `id` wanoma yiliphi iholide ku `holidays` . Isiqalo singu `{seed}|{year}` kanti isikhundla siwusuku lonyaka.

`seed` uyimbewu (intambo engenalutho ngokuzenzakalelayo), kanti `year` unyaka kusukela esinyathelweni 1 ku-decimal ngaphandle kwama-zero aholayo (isb. `2026` , `1` ).

Uma kungekho mavesi asele, akukho vesi losuku.

Amaholide anosuku olushintsha minyaka yonke abonisa kuphela izinsuku ezibaliwe kusengaphambili (njengamanje kusukela ngo-2026 kuya ku-2125), ngakho-ke kweminye iminyaka ziyizinsuku ezivamile. Ungazibali izinsuku wena.

### Isinyathelo 4: Yakha ukhiye wevesi ngalinye

Kulelo nalelo vesi elisele, yakha lolu chungechunge:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` yisiqalo esivela esinyathelweni sesi-3.
-   `book` uyivesi `book` njengoba livela kusethi yedatha (i-ID yencwadi ye-USFM enophawu olukhulu njengo- `JHN` noma `1JN` ).
-   `chapter` no `verse` kungamadesimali ngaphandle kwama-zero ahamba phambili.
-   `endVerse` akayona ingxenye yesihluthulelo. Indinyana ichazwa ngevesi layo lokuqala.

Isibonelo, isihluthulelo sikaJohane 3:16 ngosuku olujwayelekile ngo-2026 esinembewu ezenzakalelayo ngu- `|2026|JHN 3:16` , kanti isihluthulelo sikaLuka 2:7 ngoKhisimusi ngu `|christmas|LUK 2:7` .

### Isinyathelo 5: Hasha ukhiye ngamunye

Hasha ama-UTF-8 byte okhiye nge-32-bit [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash, bese uhlanganisa umphumela ne- [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` finalizer. Zonke izibalo ziku-unsigned 32-bit integers, ngakho-ke ukuphindaphinda kuyagoqana (kuthathwa i-modulo 2³²) kanti ukuguquguquka kwesokudla kunengqondo (kushintsha ngo-zero).

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

Umphumela uba ukhiye wokuhlunga wevesi, inombolo kusukela ku-0 kuya ku-4,294,967,295.

### Isinyathelo 6: Hlela amavesi

Hlela amavesi ngokhiye wawo wokuhlunga, omncane kuqala, uqhathanisa okhiye njengezinombolo ezingasayiniwe.

Uma amavesi amabili enenkinobho efanayo yokuhlunga (okuyinto engavamile kakhulu), beka leyo enentambo yesihluthulelo esinyathelweni sesi-4 eza kuqala ngokulandelana kwe-ordinal (ikhodi yezinhlamvu) kuqala. Izintambo zesihluthulelo zonke ziqala ngesiqalo esifanayo, ngakho-ke zihluka kuphela ku-reference ye-ASCII elandelayo.

### Isinyathelo 7: Khetha ivesi

Ivesi losuku yivesi elisendaweni engu `p mod n` ohlwini oluhleliwe (kubalwa kusukela ku-0), lapho `p` eyisikhundla esivela esinyathelweni sesi-3 (usuku lonyaka, noma `year × k + i` ngeholide) kanti `n` uyinani lamavesi ohlwini oluhleliwe. Umphumela ka- `mod` awukaze ube mubi (ngonyaka one-negative, engeza `n` kuze kube yilapho ungabi njalo).

Ngezinsuku ezijwayelekile, isethi yedatha ephelele inamavesi okungenani angu-366, ngakho-ke `day mod n` u- `day` kuphela. `mod` kubalulekile uma ukhetha esigabeni noma ohlwini lwakho olunamavesi ambalwa kunezinsuku ezikhona onyakeni, lapho amavesi ephinda khona phakathi nonyaka. Ngeholide, isikhundla sidlula amavesi eholide ngonyaka owodwa (futhi, ngeholide elihlala izinsuku eziningana, usuku olulodwa) ngesikhathi.

## Ikhodi Engelona Iqiniso

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

Usuku ngalunye olujwayelekile ngonyaka lusebenzisa uhlu olufanayo oluhleliwe, ngakho-ke uma ukhetha amavesi ezinsuku eziningi, hlela kanye ngonyaka bese ulusebenzisa kabusha.

## Imbewu

Imbewu ishintsha ukhiye wevesi ngalinye, ngakho-ke inikeza uhlelo oluhlukile ngokuphelele ngeziqinisekiso ezifanayo (akukho ukuphindaphinda phakathi nonyaka, i-oda elisha njalo ngonyaka, umlando ozinzile). Sebenzisa imbewu yakho, njengegama lohlelo lwakho lokusebenza, uma ufuna uhlelo lwakho lokusebenza lube nevesi lalo losuku esikhundleni salelo elabiwe. Lishiye lingenalutho ukuze libonise ivesi elifanayo nelabanye abantu.

## Amaphutha Avamile

-   **Izinombolo ezisayiniwe.** Ezilimini ezingenazo izinombolo ezisayiniwe ezingama-32-bit (i-Java, i-Kotlin, i-JavaScript), yenza izibalo kuzinombolo ezisayiniwe ezingama-32-bit bese usebenzisa i-logical right shift ( `>>>` ), bese uguqula umphumela ube yinani elingasayiniwe (isb. `hash.toLong() and 0xFFFFFFFF` , noma `hash >>> 0` ku-JavaScript) ngaphambi kokuqhathanisa. Ku-JavaScript, sebenzisa `Math.imul` ekuphindaphindeni; `*` ulahlekelwa ukunemba.
-   **Ukuhlela izinhlamvu esikhundleni sama-byte.** Hlanganisa ama-byte e-UTF-8 ekhiye, hhayi amayunithi awo ekhodi ye-UTF-16 noma amaphuzu ekhodi ye-Unicode. Lokhu kubalulekile kuphela ezinhlanyelweni ezinezinhlamvu ezingezona eze-ASCII, kodwa lezo zivunyelwe.
-   **Kusetshenziswa i-UTC esikhundleni se-"namuhla".** Ivesi losuku liyashintsha phakathi kwamabili endawo yomsebenzisi. Ukusebenzisa usuku ku-UTC kubonisa ivesi losuku lwangaphambilini noma olulandelayo engxenyeni yosuku ezindaweni eziningi zesikhathi.
-   **Ukubala usuku lonyaka kusukela mhla lu-1.** Umhla lu-1 kuJanuwari usuku 0.
-   **Ukubala izinsuku zamaholide.** Sebenzisa u- `dates` obhalwe kusethi yedatha. Amasonto namakhalenda ahlukene abala iPhasika ngendlela ehlukile, futhi isethi yedatha ibala kuphela izinsuku ebaliwe kusengaphambili.
-   **Uma singafaki amaholide.** Ngaphandle kwe- `holidays` , amavesi amaholide aphathwa njengamavesi avamile, okushintsha nevesi lansuku zonke elivamile.
-   **Ukushiya amavesi asusiwe.** Amavesi anonyaka ongu `removedIn` asesedatha ngoba iminyaka yangaphambilini ayawadinga. Hlunga ngesinyathelo sesi-2; ungawashiyi uma ulanda uhlu.

## Ama-Vector Okuhlola

Sebenzisa la manani ukuhlola ukusetshenziswa.

### Ama-Hashes

| Ukhiye (njengentambo ye-JSON) | Ukhiye wokuhlunga | I-Hex        |
| ----------------------------- | ----------------- | ------------ |
| `""`                          | 2872998923        | `0xab3e7c0b` |
| `"a"`                         | 444641715         | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`          | 1930190452        | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`    | 2020168843        | `0x7869548b` |
| `"é\|1\|GEN 1:1"`             | 3677064616        | `0xdb2b8da8` |

### Izinsuku Zonyaka

| Usuku      | Unyaka | Usuku lonyaka |
| ---------- | ------ | ------------- |
| 2026-01-01 | 2026   | 0             |
| 2026-12-31 | 2026   | 364           |
| 2028-02-29 | 2028   | 59            |
| 2028-12-31 | 2028   | 365           |
| 1900-12-31 | 1900   | 364           |
| 2000-12-31 | 2000   | 365           |
| 0001-03-01 | 1      | 59            |
| 9999-12-31 | 9999   | 364           |

### Ukukhetha Okuvela Ohlwini Oluncane

Laba basebenzisa lolu hlu lwamavesi ayishumi nesithupha, ayisishiyagalombili awo angewamaholide:

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

Futhi la maholide (uKhisimusi awunamavesi, ngakho-ke usuku olujwayelekile):

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

Ngo-2026-01-01 ngembewu ezenzakalelayo, amavesi amane eholide kanye neyoku-1 Johane 4:19 (engasasetshenziswa okwamanje) ashiywe ngaphandle, ngakho amavesi ayisikhombisa asele. Ahlelwe ngezihluthulelo zawo zokuhlunga, yilawa:

| Isikhundla | Ukhiye              | Ukhiye wokuhlunga |
| ---------- | ------------------- | ----------------- |
| 0          | `\|2026\|PSA 23:1`  | 638659039         |
| 1          | `\|2026\|ROM 8:28`  | 1462075190        |
| 2          | `\|2026\|PRO 3:5`   | 1643805236        |
| 3          | `\|2026\|JHN 3:16`  | 1930190452        |
| 4          | `\|2026\|PHP 4:13`  | 2076082788        |
| 5          | `\|2026\|GEN 1:1`   | 2439817197        |
| 6          | `\|2026\|ISA 40:31` | 3044461366        |

Umhla lu-1 kuJanuwari usuku 0, ngakho ivesi losuku yiHubo 23:1. Umhla lu-15 kuMashi usuku 73, kanti u-73 mod 7 = 3, ngakho-ke nguJohane 3:16.

NgoKhisimusi, kusala amavesi kaKhisimusi asetshenziswayo kuphela. Ngo-2027 kunezintathu, ezihlelwe ngezihluthulelo zazo zokuhlunga:

| Isikhundla | Ukhiye                  | Ukhiye wokuhlunga |
| ---------- | ----------------------- | ----------------- |
| 0          | `\|christmas\|LUK 2:10` | 1698480150        |
| 1          | `\|christmas\|MAT 1:23` | 2563849700        |
| 2          | `\|christmas\|LUK 2:7`  | 3160581874        |

I-2027 mod 3 = 2, ngakho ivesi losuku ngoKhisimusi ka-2027 linguLuka 2:7. Ngo-2026, uMathewu 1:23 akakasetshenziswa okwamanje, ngakho-ke zimbili kuphela, kanti i-2026 mod 2 = 0 inikeza uLuka 2:10-11.

Iholide ngemva kovuko ngeSonto lithatha izinsuku ezintathu. Amavesi alo amane, ahlelwe ngokwezihluthulelo zawo zokuhlunga, yilawa:

| Isikhundla | Ukhiye                                  | Ukhiye wokuhlunga |
| ---------- | --------------------------------------- | ----------------- |
| 0          | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114          |
| 1          | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464         |
| 2          | `\|post-resurrection-sunday\|1CO 15:20` | 820536316         |
| 3          | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482        |

Ngo-2026 kugcinwa ngezinsuku ezintathu, ngakho-ke `k` = 3, kanti izikhundla zika-Ephreli 6, 7, kanye no-8 ziyi-2026 × 3 + 0 = 6078, 6079, kanye no-6080. I-6078 mod 4 = 2, 6079 mod 4 = 3, kanye no-6080 mod 4 = 0 zinikeza eyoku-1 kwabaseKorinte 15:20, IzEnzo 2:24, kanye neyoku-1 kwabaseThesalonika 4:14. Ngo-2027 izikhundla ziyaqhubeka kusukela ku-6081, ngakho ivesi elilandelayo liyiRoma 6:9.

| Usuku      | Imbewu   | Isigaba     | Ivesi losuku           |
| ---------- | -------- | ----------- | ---------------------- |
| 2026-01-01 |          |             | I-PSA 23:1             |
| 2026-01-02 |          |             | KWABASEROMA 8:28       |
| 2026-03-15 |          |             | Johane 3:16            |
| 2026-12-31 |          |             | I-PSA 23:1             |
| 2027-01-01 |          |             | Johane 3:16            |
| 2027-06-30 |          |             | I-PRO 3:5-6            |
| 2028-02-29 |          |             | I-PRO 3:5-6            |
| 2028-12-31 |          |             | I-PSA 23:1             |
| 1969-12-31 |          |             | I-PRO 3:5-6            |
| 0001-01-01 |          |             | ISAYA 40:31            |
| 2026-01-01 | `my-app` |             | ISAYA 40:31            |
| 2027-01-01 | `my-app` |             | I-PHP 4:13             |
| 2026-01-01 |          | `hope`      | KWABASEROMA 8:28       |
| 2027-01-01 |          | `hope`      | ISAYA 40:31            |
| 2027-01-01 |          | `joy`       | Akukho vesi losuku     |
| 2026-12-25 |          |             | LUKA 2:10-11           |
| 2027-12-25 |          |             | LUKA 2:7               |
| 2028-12-25 |          |             | LUKA 2:10-11           |
| 2029-12-25 |          |             | Mathewu 1:23           |
| 2026-12-25 | `my-app` |             | LUKA 2:10-11           |
| 2026-04-05 |          |             | Mathewu 28:6           |
| 2027-03-28 |          |             | Mathewu 28:6           |
| 2028-04-16 |          |             | I-PSA 23:1             |
| 2026-12-24 |          |             | I-PSA 23:1             |
| 2026-07-01 |          | `christmas` | LUKA 2:7               |
| 2026-04-06 |          |             | 1 KWABASEKORINTE 15:20 |
| 2026-04-07 |          |             | IZENZO 2:24            |
| 2026-04-08 |          |             | 1TH 4:14               |
| 2026-04-09 |          |             | I-PSA 23:1             |
| 2027-03-29 |          |             | KWABASEROMA 6:9        |
| 2027-03-30 |          |             | 1 KWABASEKORINTE 15:20 |
| 2027-03-31 |          |             | IZENZO 2:24            |

2028-04-16 yiSonto Lovuko, kodwa alikho ohlwini lwalolu `dates` , ngakho-ke luwusuku olujwayelekile.

### Ukukhetha Okuvela Kusethi Yedatha

Isethi yedatha ayishintshi amavesi onyaka oqalile, ngakho la mavesi osuku angu-2026 ahlala efana:

| Usuku      | Iholide                              | Ivesi losuku      |
| ---------- | ------------------------------------ | ----------------- |
| 2026-01-01 |                                      | I-PSA 32:1        |
| 2026-04-03 | ULwesihlanu Oluhle                   | NGOKUKALUKA 23:33 |
| 2026-04-05 | ISonto Lokuvuka Kwabafileyo          | Mathewu 28:9      |
| 2026-04-06 | Ngemva Kokuvuka Kwabafileyo ngeSonto | ISAMBULO 1:17-18  |
| 2026-06-15 |                                      | EST 4:14          |
| 2026-10-28 |                                      | I-PSA 136:1       |
| 2026-10-31 | Ubusuku Bama-Hallows Bonke           | KWABASE-EF 5:8    |
| 2026-11-29 | ISonto Lokuqala Le-Advent            | UMALAKI 3:1       |
| 2026-12-24 | usuku ngaphambi kukakhisimusi        | Mathewu 1:21      |
| 2026-12-25 | UKhisimusi                           | ISAYA 9:6         |
| 2026-12-31 |                                      | U-EZK 36:26       |

## Ukuqaliswa

Lokhu kusetshenziswa kulandela umhlangano, futhi izivivinyo zabo zihlola amanani akuleli khasi:

-   I-JavaScript/TypeScript: `pickVerseOfTheDay()` kanye no `FreeUseBibleApi.getVerseOfTheDay()` kuphakheji [`free-use-bible-api`](../../sdks/javascript.md) ( [umthombo](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   I-Kotlin: `pickVerseOfTheDay()` kanye ne `FreeUseBibleApi.getVerseOfTheDay()` ku- [Kotlin SDK](../../sdks/kotlin.md) ( [umthombo](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   I-Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` kanye ne `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` ku- [Swift SDK](../../sdks/swift.md) ( [umthombo](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Ithuluzi le- `getVerseOfTheDay` leseva ye [-MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [umthombo](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` ku- `@helloao/tools` ( [umthombo](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), esebenzisa uhlu olwakhelwe ngaphakathi kwephakheji.
