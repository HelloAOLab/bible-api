# Tagesvers-Kongress

Diese Seite beschreibt, wie man den Vers des Tages aus dem [Datensatz `verse-of-the-day`](./README.md#verse-of-the-day) auswählt, sodass man ihn in jeder beliebigen Sprache implementieren kann und immer denselben Vers erhält wie bei jeder anderen Implementierung.

Die API besteht aus statischen Dateien und wählt daher keinen Bibelvers automatisch aus. Die Konvention ist ein gemeinsamer Standard: Apps, die dieser Konvention folgen, zeigen am selben Tag denselben Vers an. Apps können selbstverständlich auch einen anderen Vers wählen; der [vorgegebene Standard](#seeds) ermöglicht ihnen dies auf einfache Weise, ohne die Garantien zu beeinträchtigen.

## Garantien

-   **Deterministisch.** Dasselbe Datum (und derselbe Seed) ergibt immer denselben Vers, auf jedem Gerät und in jeder Implementierung.
-   **Keine Wiederholungen innerhalb eines Jahres.** Jedes Jahr hat seine eigene, zufällig angeordnete Reihenfolge der Verse, die den Tagen des Jahres folgt. Der Datensatz enthält stets mindestens 366 Verse für jeden gebräuchlichen Tag, sodass ein Vers niemals zweimal im selben Kalenderjahr vorkommt.
-   **Feiertage.** An christlichen Feiertagen (wie Weihnachten oder Ostersonntag) wird täglich ein bestimmter Vers des Feiertags gelesen. Die Verse eines Feiertags werden jedes Jahr wiederholt, sodass jedes Jahr ein anderer Vers verwendet wird, bis alle Verse aufgebraucht sind. Bei mehrtägigen Feiertagen (wie den drei Tagen nach Ostersonntag) wird an jedem Tag ein anderer Vers gelesen. An anderen Tagen werden keine Feiertagsverse verwendet.
-   Die **Reihenfolge ändert sich jedes Jahr.** Sie wird nicht wiederholt, sobald alle Verse verwendet wurden. Da die Reihenfolge jedes Jahr separat neu gemischt wird, kann es vorkommen, dass derselbe Vers sowohl am 31. Dezember als auch am 1. Januar erscheint (etwa in einem von 650 Neujahrsfesten).
-   **Stabile Historie.** Der Datensatz fügt nur Verse aus einem Jahr hinzu oder entfernt sie, das noch nicht begonnen hat (siehe [`addedIn` und `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), sodass sich der Tagesvers für ein bereits vergangenes Datum nie ändert.
-   **Unabhängig von der Reihenfolge in der Liste.** Die Position jedes Verses in der Jahresreihenfolge ergibt sich aus seinem jeweiligen Bezug, daher spielt die Reihenfolge der Liste keine Rolle.

## Eingaben

| Eingang   | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verse     | Das `verses` Array aus [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Jeder Vers hat ein `book` , `chapter` , `verse` und `categories` und kann `endVerse` , `addedIn` und `removedIn` haben.                                                                                                                                                                                           |
| Datum     | Ein Kalenderdatum (Jahr, Monat und Tag). Für „heute“ wird das lokale Datum des Benutzers verwendet, nicht das Datum in UTC.                                                                                                                                                                                                                                                                                            |
| Samen     | Optional. Eine Zeichenkette, die eine andere Reihenfolge auswählt. Standardmäßig wird eine leere Zeichenkette verwendet, die den Standardvers des Tages anzeigt.                                                                                                                                                                                                                                                       |
| Feiertage | Das `holidays` Array stammt aus derselben Datei. Jeder Feiertag enthält die `id` seiner Kategorie sowie entweder eine `month` und eine `day` (ein Feiertag, der jedes Jahr am selben Datum stattfindet) oder eine Liste mit `dates` ( `YYYY-MM-DD` , in der Reihenfolge) für einen Feiertag, dessen Datum sich jährlich ändert. Ein Feiertag kann mehrere Daten im selben Jahr enthalten, wenn er mehrere Tage dauert. |
| Kategorie | Optional. Wähle an jedem Tag nur Verse aus, die diese Kategorie in ihrer `categories` haben.                                                                                                                                                                                                                                                                                                                           |

## Algorithmus

### Schritt 1: Ermitteln Sie das Jahr und den Tag des Jahres

Man nehme das Jahr, den Monat und den Tag des Datums sowie den Tag des Jahres, beginnend bei 0: Der 1. Januar ist Tag 0, der 31. Dezember ist Tag 364 (bzw. Tag 365 in einem Schaltjahr).

Die Datumsangaben basieren auf dem proleptischen Gregorianischen Kalender: Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, außer bei Jahren, die durch 100 teilbar sind, aber nicht durch 400 (2000 ist ein Schaltjahr, 1900 nicht).

### Schritt 2: Behalte die verwendeten Verse bei.

Behalte die Verse bei, die im jeweiligen Jahr verwendet werden:

-   `addedIn` fehlt (oder ist null), oder `addedIn <= year` , und
-   `removedIn` fehlt (oder ist null), oder `year < removedIn` .

### Schritt 3: Wähle die Verse aus, aus denen du auswählen möchtest

Wählen Sie die Verse aus, aus denen Sie auswählen möchten, ein Schlüsselpräfix für Schritt 4 und eine Position für Schritt 7:

1. **Es wurde eine Kategorie vorgegeben.** Behalte die Verse in Gebrauch, deren `categories` diese Kategorie enthält. Das Präfix ist `{seed}|{year}` und die Position entspricht dem Tag des Jahres.
2. **Es wurde keine Kategorie angegeben, und das Datum ist ein Feiertag.** Ein Datum ist ein Feiertag, wenn ein Feiertag in Zeile `holidays` die Ziffern `month` und `day` des Datums enthält oder das Datum in Zeile `dates` (geschrieben als `YYYY-MM-DD` mit vierstelliger Jahreszahl) auflistet. Falls mehrere Feiertage übereinstimmen, wird der erste in der Liste verwendet (im Datensatz fallen nie zwei Feiertage auf dasselbe Datum). Es werden die Verse beibehalten, deren `categories` die Ziffer `id` des Feiertags enthält. Falls solche Verse vorhanden sind, ist das Präfix `{seed}|{id}` (z. B. `|christmas` ) und die Position `year × k + i` , wobei `k` die Anzahl der Tage im Jahr angibt, an denen der Feiertag begangen wird (1 für einen Feiertag mit den Ziffern `month` und `day` ; andernfalls die Anzahl der Tage `dates` im Jahr des Datums) und `i` die Anzahl der Tage vor dem Datum. Bei einem Feiertag, der nur einmal im Jahr begangen wird, ist die Position nur die Jahreszahl. Falls keine passenden Verse vorhanden sind, wird mit Zeile 3 fortgefahren.
3. **Andernfalls.** Behalten Sie die Verse bei, deren `categories` nicht die `id` eines Feiertags in `holidays` enthält. Das Präfix ist `{seed}|{year}` und die Position ist der Tag des Jahres.

`seed` ist der Startwert (standardmäßig eine leere Zeichenkette), und `year` ist das Jahr aus Schritt 1 in Dezimaldarstellung ohne führende Nullen (z. B. `2026` , `1` ).

Wenn keine Verse mehr übrig sind, gibt es keinen Tagesvers.

Bei Feiertagen, deren Datum sich jährlich ändert, werden nur die vorab berechneten Daten angezeigt (derzeit 2026 bis 2125). In anderen Jahren sind es gewöhnliche Tage. Bitte berechnen Sie die Daten nicht selbst.

### Schritt 4: Erstellen Sie den Schlüssel für jede Strophe.

Erstelle für jede verbleibende Strophe diese Zeichenkette:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` ist das Präfix aus Schritt 3.
-   `book` ist die Vers- `book` genau so, wie sie im Datensatz erscheint (eine USFM-Buch-ID in Großbuchstaben, z. B. `JHN` oder `1JN` ).
-   `chapter` und `verse` sind Dezimalzahlen ohne führende Nullen.
-   `endVerse` gehört nicht zum Schlüssel. Eine Textstelle wird durch ihren ersten Vers identifiziert.

Zum Beispiel ist der Schlüssel für Johannes 3,16 an einem normalen Tag im Jahr 2026 mit dem Standard-Seed `|2026|JHN 3:16` , und der Schlüssel für Lukas 2,7 an Weihnachten ist `|christmas|LUK 2:7` .

### Schritt 5: Hashe jeden Schlüssel

Die UTF-8-Bytes des Schlüssels werden mit dem 32-Bit-Hash-Algorithmus [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) gehasht. Anschließend wird das Ergebnis mit dem [MurmurHash3-2](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Finalizer kombiniert. Alle arithmetischen Operationen erfolgen mit vorzeichenlosen 32-Bit-Ganzzahlen, daher werden Multiplikationen modulo 2³² berechnet und Rechtsverschiebungen logisch ausgeführt (sie verschieben um Nullen).

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

Das Ergebnis ist der Sortierschlüssel des Verses, eine Zahl von 0 bis 4.294.967.295.

### Schritt 6: Sortiere die Verse

Ordne die Verse nach ihrem Sortierschlüssel, beginnend mit dem kleinsten, und vergleiche die Schlüssel als vorzeichenlose Zahlen.

Falls zwei Verse denselben Sortierschlüssel haben (was sehr selten vorkommt), wird derjenige Vers, dessen Schlüsselzeichenkette aus Schritt 4 in der Reihenfolge (Zeichencode) an erster Stelle steht, zuerst platziert. Die Schlüsselzeichenketten beginnen alle mit demselben Präfix und unterscheiden sich daher nur in der nachfolgenden ASCII-Referenz.

### Schritt 7: Wähle den Vers aus

Der Tagesvers ist der Vers an Position `p mod n` der sortierten Liste (beginnend bei 0), wobei `p` die Position aus Schritt 3 (der Tag des Jahres, oder `year × k + i` an einem Feiertag) und `n` die Anzahl der Verse in der sortierten Liste ist. Das Ergebnis von `mod` ist niemals negativ (bei einem negativen Jahr addiert man `n` , bis es positiv ist).

An normalen Tagen umfasst der vollständige Datensatz mindestens 366 Verse, daher entspricht `day mod n` einfach `day` Die `mod` ist relevant, wenn Sie aus einer Kategorie oder einer eigenen Liste mit weniger Versen als Tagen im Jahr auswählen; in diesem Fall wiederholen sich Verse innerhalb des Jahres. An Feiertagen werden die Verse des jeweiligen Jahres (bzw. bei mehrtägigen Feiertagen die Verse eines Tages) nacheinander durchgesehen.

## Pseudocode

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

Für jedes normale Datum im Jahr wird dieselbe sortierte Liste verwendet. Wenn Sie also Verse für viele Daten auswählen, sortieren Sie einmal pro Jahr und verwenden Sie diese Liste wieder.

## Samen

Der Startwert ändert die Legende jedes Verses und sorgt so für eine völlig andere Reihenfolge bei gleichen Garantien (keine Wiederholungen innerhalb eines Jahres, jährlich neue Reihenfolge, stabile Historie). Verwenden Sie einen eigenen Startwert, z. B. den Namen Ihrer App, wenn Ihre App einen eigenen Tagesvers anstelle des gemeinsamen anzeigen soll. Lassen Sie das Feld leer, um denselben Vers wie alle anderen anzuzeigen.

## Häufige Fehler

-   **Vorzeichenbehaftete Ganzzahlen.** In Sprachen ohne vorzeichenlose 32-Bit-Ganzzahlen (Java, Kotlin, JavaScript) werden die Berechnungen mit vorzeichenbehafteten 32-Bit-Ganzzahlen durchgeführt und anschließend eine logische Rechtsverschiebung ( `>>>` ) vorgenommen. Das Ergebnis wird dann in einen vorzeichenlosen Wert (z. B. `hash.toLong() and 0xFFFFFFFF` oder `hash >>> 0` in JavaScript) umgewandelt, bevor es verglichen wird. In JavaScript wird für Multiplikationen `Math.imul` verwendet; `*` führt zu Genauigkeitsverlust.
-   **Hashen von Zeichen statt Bytes.** Es werden die UTF-8-Bytes des Schlüssels gehasht, nicht seine UTF-16-Codeeinheiten oder Unicode-Codepunkte. Dies ist nur für Seeds mit Nicht-ASCII-Zeichen relevant, diese sind jedoch zulässig.
-   **Bei Verwendung von UTC für „heute“** ändert sich der Tagesvers um Mitternacht des Nutzers. Die Verwendung des Datums in UTC zeigt in den meisten Zeitzonen für einen Teil des Tages den Vers des vorherigen oder nächsten Tages an.
-   **Zählt man die Tage des Jahres ab dem 1.** Januar, so ist der 1. Januar Tag 0.
-   **Berechnung der Feiertage.** Verwenden Sie die im Datensatz angegebene `dates` Verschiedene Kirchen und Kalender berechnen Ostern unterschiedlich, und der Datensatz listet nur die von ihm vorab berechneten Daten auf.
-   **Die Feiertage werden dabei ausgelassen.** Ohne die `holidays` werden die Feiertagsverse wie gewöhnliche Verse behandelt, was auch den Vers jedes gewöhnlichen Tages verändert.
-   **Entfernte Verse werden nicht berücksichtigt.** Verse mit der Jahreszahl `removedIn` sind weiterhin im Datensatz enthalten, da sie für frühere Jahre benötigt werden. Filtern Sie diese in Schritt 2; löschen Sie sie nicht beim Herunterladen der Liste.

## Testvektoren

Verwenden Sie diese Werte, um eine Implementierung zu überprüfen.

### Hashes

| Schlüssel (als JSON-Zeichenfolge) | Sortierschlüssel | Verhexen     |
| --------------------------------- | ---------------- | ------------ |
| `""`                              | 2872998923       | `0xab3e7c0b` |
| `"a"`                             | 444641715        | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`              | 1930190452       | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`        | 2020168843       | `0x7869548b` |
| `"é\|1\|GEN 1:1"`                 | 3677064616       | `0xdb2b8da8` |

### Tage des Jahres

| Datum      | Jahr | Tag des Jahres |
| ---------- | ---- | -------------- |
| 2026-01-01 | 2026 | 0              |
| 2026-12-31 | 2026 | 364            |
| 2028-02-29 | 2028 | 59             |
| 2028-12-31 | 2028 | 365            |
| 1900-12-31 | 1900 | 364            |
| 2000-12-31 | 2000 | 365            |
| 0001-03-01 | 1    | 59             |
| 9999-12-31 | 9999 | 364            |

### Ausgewählte Artikel aus einer kleinen Liste

Diese verwenden diese Liste von sechzehn Versen, von denen acht für Feiertage bestimmt sind:

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

Und diese Feiertage (Heiligabend hat keine Verse, ist also ein gewöhnlicher Tag):

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

Für den 1. Januar 2026 mit dem Standard-Seed werden die vier Feiertagsverse und 1. Johannes 4,19 (der noch nicht verwendet wird) ausgelassen, sodass sieben Verse übrig bleiben. Sortiert nach ihren Sortierschlüsseln lauten diese:

| Position | Schlüssel           | Sortierschlüssel |
| -------- | ------------------- | ---------------- |
| 0        | `\|2026\|PSA 23:1`  | 638659039        |
| 1        | `\|2026\|ROM 8:28`  | 1462075190       |
| 2        | `\|2026\|PRO 3:5`   | 1643805236       |
| 3        | `\|2026\|JHN 3:16`  | 1930190452       |
| 4        | `\|2026\|PHP 4:13`  | 2076082788       |
| 5        | `\|2026\|GEN 1:1`   | 2439817197       |
| 6        | `\|2026\|ISA 40:31` | 3044461366       |

Der 1. Januar ist Tag 0, daher ist der Tagesvers Psalm 23,1. Der 15. März ist Tag 73, und 73 mod 7 = 3, also ist es Johannes 3,16.

An Weihnachten sind nur noch die gebräuchlichen Weihnachtsverse übrig. Im Jahr 2027 gibt es drei, sortiert nach ihren Sortierschlüsseln:

| Position | Schlüssel               | Sortierschlüssel |
| -------- | ----------------------- | ---------------- |
| 0        | `\|christmas\|LUK 2:10` | 1698480150       |
| 1        | `\|christmas\|MAT 1:23` | 2563849700       |
| 2        | `\|christmas\|LUK 2:7`  | 3160581874       |

2027 mod 3 = 2, daher ist der Tagesvers an Weihnachten 2027 Lukas 2,7. Im Jahr 2026 ist Matthäus 1,23 noch nicht in Gebrauch, daher gibt es nur zwei Verse, und 2026 mod 2 = 0 ergibt Lukas 2,10-11.

Der Feiertag nach Ostersonntag dauert drei Tage. Seine vier Verse, nach ihren Sortierschlüsseln geordnet, lauten:

| Position | Schlüssel                               | Sortierschlüssel |
| -------- | --------------------------------------- | ---------------- |
| 0        | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114         |
| 1        | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464        |
| 2        | `\|post-resurrection-sunday\|1CO 15:20` | 820536316        |
| 3        | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482       |

Im Jahr 2026 wird es an drei Tagen beobachtet, daher ist `k` = 3, und die Positionen des 6., 7. und 8. April sind 2026 × 3 + 0 = 6078, 6079 und 6080. 6078 mod 4 = 2, 6079 mod 4 = 3 und 6080 mod 4 = 0 ergeben 1. Korinther 15,20, Apostelgeschichte 2,24 und 1. Thessalonicher 4,14. Im Jahr 2027 werden die Positionen ab 6081 fortgesetzt, daher ist der nächste Vers Römer 6,9.

| Datum      | Samen    | Kategorie   | Tagesvers              |
| ---------- | -------- | ----------- | ---------------------- |
| 2026-01-01 |          |             | PSA 23:1               |
| 2026-01-02 |          |             | ROM 8:28               |
| 2026-03-15 |          |             | JHN 3:16               |
| 2026-12-31 |          |             | PSA 23:1               |
| 2027-01-01 |          |             | JHN 3:16               |
| 2027-06-30 |          |             | PRO 3:5-6              |
| 2028-02-29 |          |             | PRO 3:5-6              |
| 2028-12-31 |          |             | PSA 23:1               |
| 1969-12-31 |          |             | PRO 3:5-6              |
| 0001-01-01 |          |             | ISA 40:31              |
| 2026-01-01 | `my-app` |             | ISA 40:31              |
| 2027-01-01 | `my-app` |             | PHP 4:13               |
| 2026-01-01 |          | `hope`      | ROM 8:28               |
| 2027-01-01 |          | `hope`      | ISA 40:31              |
| 2027-01-01 |          | `joy`       | Kein Tagesvers         |
| 2026-12-25 |          |             | LUK 2:10-11            |
| 2027-12-25 |          |             | LUK 2:7                |
| 2028-12-25 |          |             | LUK 2:10-11            |
| 2029-12-25 |          |             | MAT 1:23               |
| 2026-12-25 | `my-app` |             | LUK 2:10-11            |
| 2026-04-05 |          |             | MAT 28:6               |
| 2027-03-28 |          |             | MAT 28:6               |
| 2028-04-16 |          |             | PSA 23:1               |
| 2026-12-24 |          |             | PSA 23:1               |
| 2026-07-01 |          | `christmas` | LUK 2:7                |
| 2026-04-06 |          |             | 1 Kor 15:20            |
| 2026-04-07 |          |             | Apostelgeschichte 2,24 |
| 2026-04-08 |          |             | 1. Thessalonicher 4:14 |
| 2026-04-09 |          |             | PSA 23:1               |
| 2027-03-29 |          |             | ROM 6:9                |
| 2027-03-30 |          |             | 1 Kor 15:20            |
| 2027-03-31 |          |             | Apostelgeschichte 2,24 |

Der 16. April 2028 ist Ostersonntag, aber er steht nicht in der Liste unter Punkt `dates` , also ist es ein gewöhnlicher Tag.

### Auswahlen aus dem Datensatz

Der Datensatz ändert niemals die Verse eines bereits begonnenen Jahres, daher bleiben diese Verse des Tages für 2026 unverändert:

| Datum      | Urlaub                | Tagesvers           |
| ---------- | --------------------- | ------------------- |
| 2026-01-01 |                       | PSA 32:1            |
| 2026-04-03 | Karfreitag            | LUK 23:33           |
| 2026-04-05 | Auferstehungssonntag  | MAT 28:9            |
| 2026-04-06 | Nach dem Ostersonntag | Offenbarung 1:17-18 |
| 2026-06-15 |                       | EST 4:14            |
| 2026-10-28 |                       | PSA 136:1           |
| 2026-10-31 | Allerheiligenabend    | EPH 5:8             |
| 2026-11-29 | Erster Adventssonntag | MAL 3:1             |
| 2026-12-24 | Heiligabend           | MAT 1:21            |
| 2026-12-25 | Weihnachten           | ISA 9:6             |
| 2026-12-31 |                       | EZK 36:26           |

## Implementierungen

Diese Implementierungen folgen der Konvention, und ihre Tests überprüfen die Werte auf dieser Seite:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` und `FreeUseBibleApi.getVerseOfTheDay()` im [`free-use-bible-api`](../../sdks/javascript.md) Paket ( [Quelle](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` und `FreeUseBibleApi.getVerseOfTheDay()` im [Kotlin SDK](../../sdks/kotlin.md) ( [Quelle](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` und `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` im [Swift SDK](../../sdks/swift.md) ( [Quelle](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   Das `getVerseOfTheDay` Tool des [MCP-Servers](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [Quelle](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` von `@helloao/tools` ( [Quelle](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), wobei die im Paket enthaltene Liste verwendet wird.
