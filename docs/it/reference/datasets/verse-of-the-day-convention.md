# Convenzione del versetto del giorno

Questa pagina specifica come selezionare il versetto del giorno dal [dataset `verse-of-the-day`](./README.md#verse-of-the-day) , in modo da poterlo implementare in qualsiasi lingua e ottenere lo stesso versetto di ogni altra implementazione.

L'API è composta da file statici, quindi non sceglie un versetto per te. La convenzione è un valore predefinito condiviso: le app che la seguono mostrano lo stesso versetto nello stesso giorno. Le app sono libere di scegliere diversamente e il [seed](#seeds) offre loro un modo semplice per farlo mantenendo le stesse garanzie.

## Garanzie

-   **Deterministico.** La stessa data (e lo stesso seme) producono sempre lo stesso verso, su ogni dispositivo e in ogni implementazione.
-   **Nessuna ripetizione all'interno dell'anno.** Ogni anno ha il suo ordine casuale dei versetti e i giorni dell'anno seguono questo ordine. Il set di dati contiene sempre almeno 366 versetti per ogni giorno di utilizzo, quindi un versetto non compare mai due volte nello stesso anno solare.
-   **Festività.** Durante una festività cristiana (come Natale o la Domenica di Pasqua), il versetto del giorno è uno dei versetti della festività stessa. I versetti di una festività vengono utilizzati uno alla volta, quindi ogni anno ce n'è uno diverso finché non sono stati usati tutti. Una festività che dura più giorni (come i tre giorni dopo la Domenica di Pasqua) ha un versetto diverso ogni giorno. I versetti delle festività non vengono utilizzati negli altri giorni.
-   **Ogni anno l'ordine cambia.** L'ordine non si ripete una volta che tutti i versi sono stati utilizzati. Poiché ogni anno l'ordine viene mescolato separatamente, lo stesso verso può occasionalmente comparire il 31 dicembre e di nuovo il 1° gennaio (circa 1 volta su 650 Capodanni).
-   **Cronologia stabile.** Il dataset aggiunge o rimuove versetti solo da un anno che non è ancora iniziato (vedi [`addedIn` e `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), quindi il versetto del giorno per una data già trascorsa non cambia mai.
-   **Indipendentemente dall'ordine della lista.** La posizione di ciascun versetto nell'ordine di un anno deriva dal suo riferimento specifico, quindi l'ordine della lista non ha importanza.

## Input

| Ingresso  | Descrizione                                                                                                                                                                                                                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versetti  | L'array `verses` da [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Ogni verso ha un `book` , `chapter` , `verse` e `categories` e può avere `endVerse` , `addedIn` e `removedIn` .                                                                                                                                    |
| Data      | Una data del calendario (anno, mese e giorno). Per "oggi", utilizzare la data locale dell'utente, non la data in UTC.                                                                                                                                                                                                                                |
| Seme      | Opzionale. Una stringa che seleziona un ordine diverso. Il valore predefinito è la stringa vuota, che fornisce il versetto standard del giorno.                                                                                                                                                                                                      |
| Vacanze   | L'array `holidays` dallo stesso file. Ogni festività ha l' `id` della sua categoria e o un `month` e un `day` (una festività che cade nella stessa data ogni anno) oppure un elenco di `dates` ( `YYYY-MM-DD` , in ordine) per una festività la cui data cambia ogni anno. Una festività può elencare più date nello stesso anno se dura più giorni. |
| Categoria | Facoltativo. Scegli solo tra i versetti che hanno questa categoria nel loro `categories` , in qualsiasi giorno.                                                                                                                                                                                                                                      |

## Algoritmo

### Passaggio 1: Trova l'anno e il giorno dell'anno

Prendi l'anno, il mese e il giorno della data, e il giorno dell'anno corrispondente, contando da 0: il 1° gennaio è il giorno 0, il 31 dicembre è il giorno 364 (o il giorno 365 negli anni bisestili).

Le date utilizzano il calendario gregoriano prolettico: un anno è bisestile se è divisibile per 4, ad eccezione degli anni divisibili per 100 che non sono divisibili per 400 (il 2000 è bisestile, il 1900 no).

### Passaggio 2: Conserva i versetti che sono in uso

Conservate i versetti che sono in uso durante l'anno:

-   `addedIn` è mancante (o nullo), oppure `addedIn <= year` , e
-   `removedIn` è mancante (o nullo), oppure `year < removedIn` .

### Passaggio 3: Scegli i versetti da cui scegliere

Scegli i versetti da cui selezionare, un prefisso chiave per il passaggio 4 e una posizione per il passaggio 7:

1. **È stata assegnata una categoria.** Mantieni in uso i versi che la contengono `categories` . Il prefisso è `{seed}|{year}` e la posizione è il giorno dell'anno.
2. **Non è stata specificata alcuna categoria e la data è un giorno festivo.** La data è un giorno festivo se un giorno festivo in `holidays` ha la data `month` e `day` , oppure elenca la data nel suo `dates` (scritto come `YYYY-MM-DD` , con un anno a quattro cifre). Se più di un giorno festivo corrisponde, usa il primo nell'elenco (il dataset non ha mai due giorni festivi nella stessa data). Mantieni in uso i versi il cui `categories` contiene il `id` del giorno festivo. Se ce ne sono, il prefisso è `{seed}|{id}` (ad esempio `|christmas` ) e la posizione è `year × k + i` , dove `k` è il numero di giorni in cui il giorno festivo viene osservato nell'anno (1 per un giorno festivo con `month` e `day` ; altrimenti il ​​numero del suo `dates` nell'anno della data) e `i` è il numero di quei giorni che precedono la data. Per un giorno festivo che viene osservato in un solo giorno dell'anno, la posizione è solo l'anno. Se non ce ne sono, continua con 3.
3. **Altrimenti.** Mantieni in uso i versi il cui `categories` non contiene l' `id` di nessuna festività in `holidays` Il prefisso è `{seed}|{year}` e la posizione è il giorno dell'anno.

`seed` è il seme (la stringa vuota per impostazione predefinita) e `year` è l'anno del passo 1 in decimale senza zeri iniziali (ad esempio `2026` , `1` ).

Se non restano più versetti, non c'è un versetto del giorno.

Le festività la cui data cambia ogni anno riportano solo le date precalcolate (attualmente dal 2026 al 2125), quindi negli altri anni sono giorni festivi. Non calcolate le date da soli.

### Passaggio 4: Costruisci la chiave di ogni strofa

Per ogni verso rimanente, costruisci questa stringa:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` è il prefisso del passaggio 3.
-   `book` è il `book` del verso esattamente come appare nel dataset (un ID del libro USFM in maiuscolo come `JHN` o `1JN` ).
-   `chapter` e `verse` in decimale non hanno zeri iniziali.
-   `endVerse` non fa parte della chiave. Un brano è identificato dal suo primo verso.

Ad esempio, la chiave per Giovanni 3:16 in un giorno qualsiasi del 2026 con il seed predefinito è `|2026|JHN 3:16` , e la chiave per Luca 2:7 a Natale è `|christmas|LUK 2:7` .

### Passaggio 5: Calcola l'hash di ogni chiave

Esegui l'hashing dei byte UTF-8 della chiave con l'hash [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) a 32 bit, quindi combina il risultato con il finalizzatore [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Tutte le operazioni aritmetiche vengono eseguite su interi senza segno a 32 bit, quindi le moltiplicazioni sono a capo (vengono calcolate modulo 2³²) e gli shift a destra sono logici (inseriscono zeri).

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

Il risultato è la chiave di ordinamento del verso, un numero compreso tra 0 e 4.294.967.295.

### Passaggio 6: Ordina i versetti

Ordina i versi in base al loro codice di ordinamento, dal più piccolo al più grande, confrontando i codici come numeri senza segno.

Se due versi hanno la stessa chiave di ordinamento (il che è molto raro), metti per primo in ordine ordinale (codice carattere) quello la cui stringa chiave del passaggio 4 viene prima. Tutte le stringhe chiave iniziano con lo stesso prefisso, quindi differiscono solo nel riferimento ASCII che segue.

### Passaggio 7: Scegli il versetto

Il versetto del giorno è il versetto in posizione `p mod n` nell'elenco ordinato (contando da 0), dove `p` è la posizione del passaggio 3 (il giorno dell'anno, o `year × k + i` nei giorni festivi) e `n` è il numero di versetti nell'elenco ordinato. Il risultato di `mod` non è mai negativo (per un anno negativo, aggiungere `n` finché non lo è).

Nei giorni normali, l'intero set di dati contiene almeno 366 versi, quindi `day mod n` corrisponde semplicemente `day` Il `mod` è rilevante quando si sceglie da una categoria o da un elenco personalizzato con un numero di versi inferiore al numero di giorni dell'anno, nel qual caso i versi si ripetono all'interno dell'anno. Durante una festività, la posizione scorre i versi della festività un anno alla volta (e, per una festività che dura più giorni, un giorno alla volta).

## Pseudocodice

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

Per ogni data ordinaria dell'anno si utilizza lo stesso elenco ordinato, quindi se si scelgono versetti per molte date, è sufficiente ordinarli una volta all'anno e riutilizzarli.

## Semi

Il seed cambia la tonalità di ogni versetto, quindi fornisce un ordine completamente diverso con le stesse garanzie (nessuna ripetizione nell'arco di un anno, un nuovo ordine ogni anno, cronologia stabile). Usa un seed personalizzato, come il nome della tua app, se vuoi che la tua app abbia un versetto del giorno diverso da quello condiviso. Lascialo vuoto per mostrare lo stesso versetto di tutti gli altri.

## Errori comuni

-   **Numeri interi con segno.** Nei linguaggi senza numeri interi senza segno a 32 bit (Java, Kotlin, JavaScript), si eseguono le operazioni aritmetiche su numeri interi con segno a 32 bit e si utilizza uno spostamento logico a destra ( `>>>` ), quindi si converte il risultato in un valore senza segno (ad esempio `hash.toLong() and 0xFFFFFFFF` o `hash >>> 0` in JavaScript) prima del confronto. In JavaScript, si usa `Math.imul` per le moltiplicazioni; `*` comporta una perdita di precisione.
-   **Esegue l'hashing dei caratteri anziché dei byte.** Calcola l'hashing dei byte UTF-8 della chiave, non delle sue unità di codice UTF-16 o dei punti di codice Unicode. Questo è rilevante solo per i seed con caratteri non ASCII, che sono comunque consentiti.
-   **Utilizzo del fuso orario UTC per "oggi".** Il versetto del giorno cambia alla mezzanotte locale dell'utente. Utilizzando la data in UTC, viene visualizzato il versetto del giorno precedente o successivo per una parte della giornata nella maggior parte dei fusi orari.
-   **Contando i giorni dell'anno a partire da 1,** il 1° gennaio è il giorno 0.
-   **Calcolo delle date delle festività.** Utilizzare lo `dates` indicato nel dataset. Diverse chiese e calendari calcolano la Pasqua in modo diverso e il dataset elenca solo le date precalcolate.
-   **Escludendo le festività.** Senza lo `holidays` , i versetti delle festività vengono trattati come versetti ordinari, il che modifica anche il versetto di ogni giorno ordinario.
-   **Escludendo i versetti rimossi.** I versetti con l'anno `removedIn` sono ancora presenti nel dataset perché necessari per gli anni precedenti. Filtrali con il passaggio 2; non eliminarli quando scarichi l'elenco.

## Vettori di prova

Utilizza questi valori per verificare un'implementazione.

### hash

| Chiave (come stringa JSON) | Chiave di ordinamento | Esadecimale  |
| -------------------------- | --------------------- | ------------ |
| `""`                       | 2872998923            | `0xab3e7c0b` |
| `"a"`                      | 444641715             | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`       | 1930190452            | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"` | 2020168843            | `0x7869548b` |
| `"é\|1\|GEN 1:1"`          | 3677064616            | `0xdb2b8da8` |

### Giorni dell'anno

| Data       | Anno | Giorno dell'anno |
| ---------- | ---- | ---------------- |
| 2026-01-01 | 2026 | 0                |
| 2026-12-31 | 2026 | 364              |
| 2028-02-29 | 2028 | 59               |
| 2028-12-31 | 2028 | 365              |
| 1900-12-31 | 1900 | 364              |
| 2000-12-31 | 2000 | 365              |
| 0001-03-01 | 1    | 59               |
| 9999-12-31 | 9999 | 364              |

### Scelte da una piccola lista

Questi utilizzano questo elenco di sedici versi, otto dei quali sono dedicati alle festività:

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

E queste festività (la vigilia di Natale non ha versi, quindi è un giorno ordinario):

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

Per il 1° gennaio 2026 con il seed predefinito, i quattro versetti festivi e 1 Giovanni 4:19 (che non è ancora in uso) vengono esclusi, quindi rimangono sette versetti. Ordinati in base alle loro chiavi di ordinamento, sono:

| Posizione | Chiave              | Chiave di ordinamento |
| --------- | ------------------- | --------------------- |
| 0         | `\|2026\|PSA 23:1`  | 638659039             |
| 1         | `\|2026\|ROM 8:28`  | 1462075190            |
| 2         | `\|2026\|PRO 3:5`   | 1643805236            |
| 3         | `\|2026\|JHN 3:16`  | 1930190452            |
| 4         | `\|2026\|PHP 4:13`  | 2076082788            |
| 5         | `\|2026\|GEN 1:1`   | 2439817197            |
| 6         | `\|2026\|ISA 40:31` | 3044461366            |

Il 1° gennaio è il giorno 0, quindi il versetto del giorno è Salmo 23:1. Il 15 marzo è il giorno 73, e 73 modulo 7 = 3, quindi è Giovanni 3:16.

A Natale, rimangono solo i versi natalizi in uso. Nel 2027 ne sono rimasti tre, ordinati in base ai loro criteri di ordinamento:

| Posizione | Chiave                  | Chiave di ordinamento |
| --------- | ----------------------- | --------------------- |
| 0         | `\|christmas\|LUK 2:10` | 1698480150            |
| 1         | `\|christmas\|MAT 1:23` | 2563849700            |
| 2         | `\|christmas\|LUK 2:7`  | 3160581874            |

2027 mod 3 = 2, quindi il versetto del giorno a Natale 2027 è Luca 2:7. Nel 2026, Matteo 1:23 non è ancora in uso, quindi ce ne sono solo due, e 2026 mod 2 = 0 dà Luca 2:10-11.

La festività successiva alla Domenica di Pasqua dura tre giorni. I suoi quattro versetti, ordinati secondo le rispettive chiavi di ordinamento, sono:

| Posizione | Chiave                                  | Chiave di ordinamento |
| --------- | --------------------------------------- | --------------------- |
| 0         | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114              |
| 1         | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464             |
| 2         | `\|post-resurrection-sunday\|1CO 15:20` | 820536316             |
| 3         | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482            |

Nel 2026 viene osservato per tre giorni, quindi `k` = 3, e le posizioni del 6, 7 e 8 aprile sono 2026 × 3 + 0 = 6078, 6079 e 6080. 6078 mod 4 = 2, 6079 mod 4 = 3 e 6080 mod 4 = 0 danno 1 Corinzi 15:20, Atti 2:24 e 1 Tessalonicesi 4:14. Nel 2027 le posizioni continuano da 6081, quindi il versetto successivo è Romani 6:9.

| Data       | Seme     | Categoria   | Versetto del giorno     |
| ---------- | -------- | ----------- | ----------------------- |
| 2026-01-01 |          |             | Salmo 23:1              |
| 2026-01-02 |          |             | ROM 8:28                |
| 2026-03-15 |          |             | Giovanni 3:16           |
| 2026-12-31 |          |             | Salmo 23:1              |
| 2027-01-01 |          |             | Giovanni 3:16           |
| 2027-06-30 |          |             | PRO 3:5-6               |
| 2028-02-29 |          |             | PRO 3:5-6               |
| 2028-12-31 |          |             | Salmo 23:1              |
| 1969-12-31 |          |             | PRO 3:5-6               |
| 0001-01-01 |          |             | ISA 40:31               |
| 2026-01-01 | `my-app` |             | ISA 40:31               |
| 2027-01-01 | `my-app` |             | PHP 4:13                |
| 2026-01-01 |          | `hope`      | ROM 8:28                |
| 2027-01-01 |          | `hope`      | ISA 40:31               |
| 2027-01-01 |          | `joy`       | Nessun verso del giorno |
| 2026-12-25 |          |             | Luca 2:10-11            |
| 2027-12-25 |          |             | Luca 2:7                |
| 2028-12-25 |          |             | Luca 2:10-11            |
| 2029-12-25 |          |             | Matteo 1:23             |
| 2026-12-25 | `my-app` |             | Luca 2:10-11            |
| 2026-04-05 |          |             | Matteo 28:6             |
| 2027-03-28 |          |             | Matteo 28:6             |
| 2028-04-16 |          |             | Salmo 23:1              |
| 2026-12-24 |          |             | Salmo 23:1              |
| 2026-07-01 |          | `christmas` | Luca 2:7                |
| 2026-04-06 |          |             | 1 Corinzi 15:20         |
| 2026-04-07 |          |             | ATTO 2:24               |
| 2026-04-08 |          |             | 1 Tessalonicesi 4:14    |
| 2026-04-09 |          |             | Salmo 23:1              |
| 2027-03-29 |          |             | ROM 6:9                 |
| 2027-03-30 |          |             | 1 Corinzi 15:20         |
| 2027-03-31 |          |             | ATTO 2:24               |

Il 16 aprile 2028 è la domenica di Pasqua, ma non è presente nello `dates` di questo elenco, quindi è un giorno ordinario.

### Selezione dal set di dati

Il set di dati non modifica mai i versetti di un anno iniziato, quindi questi 2026 versetti del giorno rimangono invariati:

| Data       | Vacanza                          | Versetto del giorno |
| ---------- | -------------------------------- | ------------------- |
| 2026-01-01 |                                  | Salmo 32:1          |
| 2026-04-03 | Venerdì Santo                    | Luca 23:33          |
| 2026-04-05 | Domenica di Resurrezione         | Matteo 28:9         |
| 2026-04-06 | Dopo la Domenica di Risurrezione | Apocalisse 1:17-18  |
| 2026-06-15 |                                  | EST 4:14            |
| 2026-10-28 |                                  | PSA 136:1           |
| 2026-10-31 | Vigilia di Ognissanti            | Efesini 5:8         |
| 2026-11-29 | Prima domenica di Avvento        | MAL 3:1             |
| 2026-12-24 | Vigilia di Natale                | Matteo 1:21         |
| 2026-12-25 | Natale                           | ISA 9:6             |
| 2026-12-31 |                                  | Ezc 36:26           |

## Implementazioni

Queste implementazioni seguono la convenzione e i relativi test verificano i valori presenti in questa pagina:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` e `FreeUseBibleApi.getVerseOfTheDay()` nel pacchetto [`free-use-bible-api`](../../sdks/javascript.md) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` e `FreeUseBibleApi.getVerseOfTheDay()` [nell'SDK di Kotlin](../../sdks/kotlin.md) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` e `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` nell'SDK [Swift](../../sdks/swift.md) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Il `getVerseOfTheDay` strumento del [server MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` su `@helloao/tools` ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), che utilizza l'elenco integrato nel pacchetto.
