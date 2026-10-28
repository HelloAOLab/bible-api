# Verse of the Day Convention

This page specifies how to pick the verse of the day from the [`verse-of-the-day` dataset](./README.md#verse-of-the-day), so that you can implement it in any language and get the same verse as every other implementation.

The API is made of static files, so it doesn't pick a verse for you. The convention is a shared default: apps that follow it show the same verse on the same day. Apps are free to pick differently, and the [seed](#seeds) gives them an easy way to do that while keeping the same guarantees.

## Guarantees

- **Deterministic.** The same date (and seed) always gives the same verse, on every device and in every implementation.
- **No repeats within a year.** Every year has its own shuffled order of the verses, and the year's days walk through it. The dataset always has at least 366 verses in use, so a verse never appears twice in the same calendar year.
- **A new order every year.** The order isn't repeated once every verse has been used. Because each year is shuffled separately, the same verse can occasionally appear on December 31st and again on January 1st (about 1 in 650 New Years).
- **Stable history.** The dataset only adds or removes verses from a year that hasn't started yet (see [`addedIn` and `removedIn`](#step-2-keep-the-verses-that-are-in-use)), so the verse of the day for a date that has already happened never changes.
- **Independent of list order.** Each verse's place in a year's order comes from its own reference, so the order of the list doesn't matter.

## Inputs

| Input    | Description                                                                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verses   | The `verses` array from [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset). Each verse has a `book`, `chapter`, `verse`, and `categories`, and can have `endVerse`, `addedIn`, and `removedIn`. |
| Date     | A calendar date (year, month, and day). For "today", use the user's local date, not the date in UTC.                                                                                                                       |
| Seed     | Optional. A string that selects a different order. Defaults to the empty string, which gives the standard verse of the day.                                                                                                |
| Category | Optional. Only pick from the verses that have this category in their `categories`.                                                                                                                                         |

## Algorithm

### Step 1: Find the year and the day of the year

Take the year of the date and the date's day of the year, counting from 0: January 1st is day 0, December 31st is day 364 (or day 365 in a leap year).

Dates use the proleptic Gregorian calendar: a year is a leap year if it is divisible by 4, except for years divisible by 100 that aren't divisible by 400 (2000 is a leap year, 1900 isn't).

### Step 2: Keep the verses that are in use

Keep the verses that are in use in the year:

- `addedIn` is missing (or null), or `addedIn <= year`, and
- `removedIn` is missing (or null), or `year < removedIn`.

If a category was given, also only keep the verses whose `categories` contain it.

If no verses are left, there is no verse of the day.

### Step 3: Build each verse's key

For each verse that is left, build this string:

```
{seed}|{year}|{book} {chapter}:{verse}
```

- `seed` is the seed (the empty string by default).
- `year` is the year from step 1, in decimal without leading zeros (e.g. `2026`, `1`).
- `book` is the verse's `book` exactly as it appears in the dataset (an uppercase USFM book ID such as `JHN` or `1JN`).
- `chapter` and `verse` are in decimal without leading zeros.
- `endVerse` isn't part of the key. A passage is identified by its first verse.

For example, the key for John 3:16 in 2026 with the default seed is `|2026|JHN 3:16`.

### Step 4: Hash each key

Hash the UTF-8 bytes of the key with the 32-bit [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash, then mix the result with the [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` finalizer. All arithmetic is on unsigned 32-bit integers, so multiplications wrap around (they are taken modulo 2³²) and right shifts are logical (they shift in zeros).

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

The result is the verse's sort key, a number from 0 to 4,294,967,295.

### Step 5: Sort the verses

Sort the verses by their sort key, smallest first, comparing the keys as unsigned numbers.

If two verses have the same sort key (which is very rare), put the one whose key string from step 3 comes first in ordinal (character code) order first. The key strings of a year all start with the same seed and year, so they only differ in the ASCII reference that follows.

### Step 6: Pick the verse

The verse of the day is the verse at position `day mod n` in the sorted list (counting from 0), where `day` is the day of the year from step 1 and `n` is the number of verses in the sorted list.

With the full dataset, `n` is at least 366, so `day mod n` is just `day`. The `mod` only matters when you pick from a category or a list of your own with fewer verses than there are days in the year, in which case verses repeat within the year.

## Pseudocode

```
function verseOfTheDay(verses, date, seed = "", category = null):
    year = date.year
    day = dayOfYear(date)                 // 0 for January 1st

    candidates = []
    for verse in verses:
        if verse.addedIn != null and verse.addedIn > year: continue
        if verse.removedIn != null and year >= verse.removedIn: continue
        if category != null and category not in verse.categories: continue
        key = seed + "|" + year + "|" + verse.book + " " + verse.chapter + ":" + verse.verse
        candidates.append((hash(key), key, verse))

    if candidates is empty: return null

    sort candidates by (hash, key)        // hash as an unsigned number, key in ordinal order
    return candidates[day mod length(candidates)].verse
```

Every date in a year uses the same sorted list, so if you pick verses for many dates, sort once per year and reuse it.

## Seeds

The seed changes every verse's key, so it gives a completely different order with the same guarantees (no repeats within a year, a new order every year, stable history). Use a seed of your own, such as the name of your app, if you want your app to have its own verse of the day instead of the shared one. Leave it empty to show the same verse as everyone else.

## Common Mistakes

- **Signed integers.** In languages without unsigned 32-bit integers (Java, Kotlin, JavaScript), do the arithmetic on signed 32-bit integers and use a logical right shift (`>>>`), then convert the result to an unsigned value (e.g. `hash.toLong() and 0xFFFFFFFF`, or `hash >>> 0` in JavaScript) before comparing. In JavaScript, use `Math.imul` for the multiplications; `*` loses precision.
- **Hashing characters instead of bytes.** Hash the UTF-8 bytes of the key, not its UTF-16 code units or Unicode code points. This only matters for seeds with non-ASCII characters, but those are allowed.
- **Using UTC for "today".** The verse of the day changes at the user's local midnight. Using the date in UTC shows the previous or next day's verse for part of the day in most time zones.
- **Counting the day of the year from 1.** January 1st is day 0.
- **Leaving out removed verses.** Verses with a `removedIn` year are still in the dataset because earlier years need them. Filter them with step 2; don't drop them when you download the list.

## Test Vectors

Use these values to check an implementation.

### Hashes

| Key (as a JSON string)     | Sort key   | Hex          |
| -------------------------- | ---------- | ------------ |
| `""`                       | 2872998923 | `0xab3e7c0b` |
| `"a"`                      | 444641715  | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`       | 1930190452 | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"` | 2020168843 | `0x7869548b` |
| `"é\|1\|GEN 1:1"`          | 3677064616 | `0xdb2b8da8` |

### Days of the Year

| Date       | Year | Day of the year |
| ---------- | ---- | --------------- |
| 2026-01-01 | 2026 | 0               |
| 2026-12-31 | 2026 | 364             |
| 2028-02-29 | 2028 | 59              |
| 2028-12-31 | 2028 | 365             |
| 1900-12-31 | 1900 | 364             |
| 2000-12-31 | 2000 | 365             |
| 0001-03-01 | 1    | 59              |
| 9999-12-31 | 9999 | 364             |

### Picks From a Small List

These use this list of eight verses:

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
    }
]
```

For 2026-01-01 with the default seed, 1 John 4:19 isn't in use yet, so seven verses are left. Sorted by their sort keys, they are:

| Position | Key                 | Sort key   |
| -------- | ------------------- | ---------- |
| 0        | `\|2026\|PSA 23:1`  | 638659039  |
| 1        | `\|2026\|ROM 8:28`  | 1462075190 |
| 2        | `\|2026\|PRO 3:5`   | 1643805236 |
| 3        | `\|2026\|JHN 3:16`  | 1930190452 |
| 4        | `\|2026\|PHP 4:13`  | 2076082788 |
| 5        | `\|2026\|GEN 1:1`   | 2439817197 |
| 6        | `\|2026\|ISA 40:31` | 3044461366 |

January 1st is day 0, so the verse of the day is Psalm 23:1. March 15th is day 73, and 73 mod 7 = 3, so it is John 3:16.

| Date       | Seed     | Category | Verse of the day    |
| ---------- | -------- | -------- | ------------------- |
| 2026-01-01 |          |          | PSA 23:1            |
| 2026-01-02 |          |          | ROM 8:28            |
| 2026-03-15 |          |          | JHN 3:16            |
| 2026-12-31 |          |          | PSA 23:1            |
| 2027-01-01 |          |          | JHN 3:16            |
| 2027-06-30 |          |          | PRO 3:5-6           |
| 2028-02-29 |          |          | PRO 3:5-6           |
| 2028-12-31 |          |          | PSA 23:1            |
| 1969-12-31 |          |          | PRO 3:5-6           |
| 0001-01-01 |          |          | ISA 40:31           |
| 2026-01-01 | `my-app` |          | ISA 40:31           |
| 2027-01-01 | `my-app` |          | PHP 4:13            |
| 2026-01-01 |          | `hope`   | ROM 8:28            |
| 2027-01-01 |          | `hope`   | ISA 40:31           |
| 2027-01-01 |          | `joy`    | No verse of the day |

### Picks From the Dataset

The dataset never changes the verses of a year that has started, so these 2026 verses of the day stay the same:

| Date       | Verse of the day |
| ---------- | ---------------- |
| 2026-01-01 | PSA 32:1         |
| 2026-06-15 | PHP 3:13-14      |
| 2026-10-28 | PSA 86:11        |
| 2026-12-25 | REV 1:8          |
| 2026-12-31 | PSA 90:2         |

## Implementations

These implementations follow the convention, and their tests check the values on this page:

- JavaScript/TypeScript: `pickVerseOfTheDay()` and `FreeUseBibleApi.getVerseOfTheDay()` in the [`free-use-bible-api`](../../sdks/javascript.md) package ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts)).
- Kotlin: `pickVerseOfTheDay()` and `FreeUseBibleApi.getVerseOfTheDay()` in the [Kotlin SDK](../../sdks/kotlin.md) ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt)).
- The `getVerseOfTheDay` tool of the [MCP server](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts)).
- `getVerseOfTheDay()` in `@helloao/tools` ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts)), which uses the list that is built into the package.
