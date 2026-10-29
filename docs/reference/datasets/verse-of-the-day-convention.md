# Verse of the Day Convention

This page specifies how to pick the verse of the day from the [`verse-of-the-day` dataset](./README.md#verse-of-the-day), so that you can implement it in any language and get the same verse as every other implementation.

The API is made of static files, so it doesn't pick a verse for you. The convention is a shared default: apps that follow it show the same verse on the same day. Apps are free to pick differently, and the [seed](#seeds) gives them an easy way to do that while keeping the same guarantees.

## Guarantees

- **Deterministic.** The same date (and seed) always gives the same verse, on every device and in every implementation.
- **No repeats within a year.** Every year has its own shuffled order of the verses, and the year's days walk through it. The dataset always has at least 366 verses for every day in use, so a verse never appears twice in the same calendar year.
- **Holidays.** On a Christian holiday (such as Christmas or Resurrection Sunday), the verse of the day is one of the holiday's verses. A holiday goes through its verses one year at a time, so it has a different verse every year until all of its verses have been used. A holiday that lasts several days (like the three days after Resurrection Sunday) has a different verse on each day. Holiday verses aren't used on other days.
- **A new order every year.** The order isn't repeated once every verse has been used. Because each year is shuffled separately, the same verse can occasionally appear on December 31st and again on January 1st (about 1 in 650 New Years).
- **Stable history.** The dataset only adds or removes verses from a year that hasn't started yet (see [`addedIn` and `removedIn`](#step-2-keep-the-verses-that-are-in-use)), so the verse of the day for a date that has already happened never changes.
- **Independent of list order.** Each verse's place in a year's order comes from its own reference, so the order of the list doesn't matter.

## Inputs

| Input    | Description                                                                                                                                                                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verses   | The `verses` array from [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset). Each verse has a `book`, `chapter`, `verse`, and `categories`, and can have `endVerse`, `addedIn`, and `removedIn`.                                                                                                        |
| Date     | A calendar date (year, month, and day). For "today", use the user's local date, not the date in UTC.                                                                                                                                                                                                                              |
| Seed     | Optional. A string that selects a different order. Defaults to the empty string, which gives the standard verse of the day.                                                                                                                                                                                                       |
| Holidays | The `holidays` array from the same file. Each holiday has the `id` of its category, and either a `month` and `day` (a holiday on the same date every year) or a list of `dates` (`YYYY-MM-DD`, in order) for a holiday whose date changes every year. A holiday can list several dates in the same year if it lasts several days. |
| Category | Optional. Only pick from the verses that have this category in their `categories`, on any day.                                                                                                                                                                                                                                    |

## Algorithm

### Step 1: Find the year and the day of the year

Take the year, month, and day of the date, and the date's day of the year, counting from 0: January 1st is day 0, December 31st is day 364 (or day 365 in a leap year).

Dates use the proleptic Gregorian calendar: a year is a leap year if it is divisible by 4, except for years divisible by 100 that aren't divisible by 400 (2000 is a leap year, 1900 isn't).

### Step 2: Keep the verses that are in use

Keep the verses that are in use in the year:

- `addedIn` is missing (or null), or `addedIn <= year`, and
- `removedIn` is missing (or null), or `year < removedIn`.

### Step 3: Choose the verses to pick from

Choose the verses to pick from, a key prefix for step 4, and a position for step 7:

1. **A category was given.** Keep the verses in use whose `categories` contain it. The prefix is `{seed}|{year}` and the position is the day of the year.
2. **No category was given, and the date is a holiday.** The date is a holiday if a holiday in `holidays` has the date's `month` and `day`, or lists the date in its `dates` (written as `YYYY-MM-DD`, with a four-digit year). If more than one holiday matches, use the first one in the list (the dataset never has two holidays on the same date). Keep the verses in use whose `categories` contain the holiday's `id`. If there are any, the prefix is `{seed}|{id}` (for example `|christmas`) and the position is `year × k + i`, where `k` is the number of days the holiday is observed in the year (1 for a holiday with a `month` and `day`; otherwise the number of its `dates` in the date's year) and `i` is the number of those days that come before the date. For a holiday that is observed on one day a year, the position is just the year. If there aren't any, continue with 3.
3. **Otherwise.** Keep the verses in use whose `categories` don't contain the `id` of any holiday in `holidays`. The prefix is `{seed}|{year}` and the position is the day of the year.

`seed` is the seed (the empty string by default), and `year` is the year from step 1 in decimal without leading zeros (e.g. `2026`, `1`).

If no verses are left, there is no verse of the day.

Holidays whose date changes every year only list the dates that have been precomputed (currently 2026 to 2125), so in other years they are ordinary days. Don't calculate the dates yourself.

### Step 4: Build each verse's key

For each verse that is left, build this string:

```
{prefix}|{book} {chapter}:{verse}
```

- `prefix` is the prefix from step 3.
- `book` is the verse's `book` exactly as it appears in the dataset (an uppercase USFM book ID such as `JHN` or `1JN`).
- `chapter` and `verse` are in decimal without leading zeros.
- `endVerse` isn't part of the key. A passage is identified by its first verse.

For example, the key for John 3:16 on an ordinary day in 2026 with the default seed is `|2026|JHN 3:16`, and the key for Luke 2:7 on Christmas is `|christmas|LUK 2:7`.

### Step 5: Hash each key

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

### Step 6: Sort the verses

Sort the verses by their sort key, smallest first, comparing the keys as unsigned numbers.

If two verses have the same sort key (which is very rare), put the one whose key string from step 4 comes first in ordinal (character code) order first. The key strings all start with the same prefix, so they only differ in the ASCII reference that follows.

### Step 7: Pick the verse

The verse of the day is the verse at position `p mod n` in the sorted list (counting from 0), where `p` is the position from step 3 (the day of the year, or `year × k + i` on a holiday) and `n` is the number of verses in the sorted list. The result of `mod` is never negative (for a negative year, add `n` until it isn't).

On ordinary days, the full dataset has at least 366 verses, so `day mod n` is just `day`. The `mod` matters when you pick from a category or a list of your own with fewer verses than there are days in the year, in which case verses repeat within the year. On a holiday, the position goes through the holiday's verses one year (and, for a holiday that lasts several days, one day) at a time.

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

Every ordinary date in a year uses the same sorted list, so if you pick verses for many dates, sort once per year and reuse it.

## Seeds

The seed changes every verse's key, so it gives a completely different order with the same guarantees (no repeats within a year, a new order every year, stable history). Use a seed of your own, such as the name of your app, if you want your app to have its own verse of the day instead of the shared one. Leave it empty to show the same verse as everyone else.

## Common Mistakes

- **Signed integers.** In languages without unsigned 32-bit integers (Java, Kotlin, JavaScript), do the arithmetic on signed 32-bit integers and use a logical right shift (`>>>`), then convert the result to an unsigned value (e.g. `hash.toLong() and 0xFFFFFFFF`, or `hash >>> 0` in JavaScript) before comparing. In JavaScript, use `Math.imul` for the multiplications; `*` loses precision.
- **Hashing characters instead of bytes.** Hash the UTF-8 bytes of the key, not its UTF-16 code units or Unicode code points. This only matters for seeds with non-ASCII characters, but those are allowed.
- **Using UTC for "today".** The verse of the day changes at the user's local midnight. Using the date in UTC shows the previous or next day's verse for part of the day in most time zones.
- **Counting the day of the year from 1.** January 1st is day 0.
- **Calculating holiday dates.** Use the `dates` listed in the dataset. Different churches and calendars calculate Easter differently, and the dataset only lists the dates it has precomputed.
- **Leaving out the holidays.** Without the `holidays`, the holiday verses are treated as ordinary verses, which changes every ordinary day's verse too.
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

These use this list of sixteen verses, eight of which are for holidays:

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

And these holidays (Christmas Eve has no verses, so it is an ordinary day):

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

For 2026-01-01 with the default seed, the four holiday verses and 1 John 4:19 (which isn't in use yet) are left out, so seven verses are left. Sorted by their sort keys, they are:

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

On Christmas, only the Christmas verses that are in use are left. In 2027 there are three, sorted by their sort keys:

| Position | Key                     | Sort key   |
| -------- | ----------------------- | ---------- |
| 0        | `\|christmas\|LUK 2:10` | 1698480150 |
| 1        | `\|christmas\|MAT 1:23` | 2563849700 |
| 2        | `\|christmas\|LUK 2:7`  | 3160581874 |

2027 mod 3 = 2, so the verse of the day on Christmas 2027 is Luke 2:7. In 2026, Matthew 1:23 isn't in use yet, so there are only two, and 2026 mod 2 = 0 gives Luke 2:10-11.

The holiday after Resurrection Sunday lasts three days. Its four verses, sorted by their sort keys, are:

| Position | Key                                     | Sort key   |
| -------- | --------------------------------------- | ---------- |
| 0        | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114   |
| 1        | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464  |
| 2        | `\|post-resurrection-sunday\|1CO 15:20` | 820536316  |
| 3        | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482 |

In 2026 it is observed on three days, so `k` = 3, and the positions of April 6th, 7th, and 8th are 2026 × 3 + 0 = 6078, 6079, and 6080. 6078 mod 4 = 2, 6079 mod 4 = 3, and 6080 mod 4 = 0 give 1 Corinthians 15:20, Acts 2:24, and 1 Thessalonians 4:14. In 2027 the positions continue from 6081, so the next verse is Romans 6:9.

| Date       | Seed     | Category    | Verse of the day    |
| ---------- | -------- | ----------- | ------------------- |
| 2026-01-01 |          |             | PSA 23:1            |
| 2026-01-02 |          |             | ROM 8:28            |
| 2026-03-15 |          |             | JHN 3:16            |
| 2026-12-31 |          |             | PSA 23:1            |
| 2027-01-01 |          |             | JHN 3:16            |
| 2027-06-30 |          |             | PRO 3:5-6           |
| 2028-02-29 |          |             | PRO 3:5-6           |
| 2028-12-31 |          |             | PSA 23:1            |
| 1969-12-31 |          |             | PRO 3:5-6           |
| 0001-01-01 |          |             | ISA 40:31           |
| 2026-01-01 | `my-app` |             | ISA 40:31           |
| 2027-01-01 | `my-app` |             | PHP 4:13            |
| 2026-01-01 |          | `hope`      | ROM 8:28            |
| 2027-01-01 |          | `hope`      | ISA 40:31           |
| 2027-01-01 |          | `joy`       | No verse of the day |
| 2026-12-25 |          |             | LUK 2:10-11         |
| 2027-12-25 |          |             | LUK 2:7             |
| 2028-12-25 |          |             | LUK 2:10-11         |
| 2029-12-25 |          |             | MAT 1:23            |
| 2026-12-25 | `my-app` |             | LUK 2:10-11         |
| 2026-04-05 |          |             | MAT 28:6            |
| 2027-03-28 |          |             | MAT 28:6            |
| 2028-04-16 |          |             | PSA 23:1            |
| 2026-12-24 |          |             | PSA 23:1            |
| 2026-07-01 |          | `christmas` | LUK 2:7             |
| 2026-04-06 |          |             | 1CO 15:20           |
| 2026-04-07 |          |             | ACT 2:24            |
| 2026-04-08 |          |             | 1TH 4:14            |
| 2026-04-09 |          |             | PSA 23:1            |
| 2027-03-29 |          |             | ROM 6:9             |
| 2027-03-30 |          |             | 1CO 15:20           |
| 2027-03-31 |          |             | ACT 2:24            |

2028-04-16 is Resurrection Sunday, but it isn't in this list's `dates`, so it is an ordinary day.

### Picks From the Dataset

The dataset never changes the verses of a year that has started, so these 2026 verses of the day stay the same:

| Date       | Holiday                   | Verse of the day |
| ---------- | ------------------------- | ---------------- |
| 2026-01-01 |                           | PSA 32:1         |
| 2026-04-03 | Good Friday               | LUK 23:33        |
| 2026-04-05 | Resurrection Sunday       | MAT 28:9         |
| 2026-04-06 | After Resurrection Sunday | REV 1:17-18      |
| 2026-06-15 |                           | EST 4:14         |
| 2026-10-28 |                           | PSA 136:1        |
| 2026-10-31 | All Hallows' Eve          | EPH 5:8          |
| 2026-11-29 | First Sunday of Advent    | MAL 3:1          |
| 2026-12-24 | Christmas Eve             | MAT 1:21         |
| 2026-12-25 | Christmas                 | ISA 9:6          |
| 2026-12-31 |                           | EZK 36:26        |

## Implementations

These implementations follow the convention, and their tests check the values on this page:

- JavaScript/TypeScript: `pickVerseOfTheDay()` and `FreeUseBibleApi.getVerseOfTheDay()` in the [`free-use-bible-api`](../../sdks/javascript.md) package ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts)).
- Kotlin: `pickVerseOfTheDay()` and `FreeUseBibleApi.getVerseOfTheDay()` in the [Kotlin SDK](../../sdks/kotlin.md) ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt)).
- Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` and `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` in the [Swift SDK](../../sdks/swift.md) ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift)).
- The `getVerseOfTheDay` tool of the [MCP server](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts)).
- `getVerseOfTheDay()` in `@helloao/tools` ([source](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts)), which uses the list that is built into the package.
