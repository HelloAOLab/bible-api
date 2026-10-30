# 每日经文大会

本页详细说明了如何从[`verse-of-the-day`数据](./README.md#verse-of-the-day)集中选择每日经文，以便您可以使用任何语言实现它，并获得与其他所有实现相同的经文。

该 API 由静态文件构成，因此不会自动选择经文。其默认约定是共享的：遵循此约定的应用会在同一天显示相同的经文。应用可以自由选择不同的经文，而[种子文件](#seeds)为它们提供了一种简便的方法，同时又能保持相同的保证。

## 保证

-   **确定性。**相同的日期（和种子）在任何设备和任何实现方式下，总是会生成相同的经文。
-   **一年内不会重复出现。**每年的经文顺序都是随机排列的，一年中的每一天都会依次经过这些经文。数据集中每天至少包含366节经文，因此同一节经文不会在同一年内出现两次。
-   **节日。**在基督教节日（例如圣诞节或复活节）中，每日经文是该节日的经文之一。节日的经文每年轮换使用，因此每年使用的经文都不同，直到所有经文都用完为止。持续数天的节日（例如复活节后的三天）每天都使用不同的经文。节日经文在其他日子里不使用。
-   **每年顺序都不同。**每首诗句用完后，顺序就不会重复。由于每年的顺序都是单独打乱的，所以偶尔会出现同一首诗句在12月31日和1月1日再次出现的情况（大约每650个新年中会出现一次）。
-   **稳定的历史记录。**该数据集只会添加或删除尚未开始的年份的经文（参见[`addedIn`和`removedIn`](#step-2-keep-the-verses-that-are-in-use) ），因此已发生日期的每日经文永远不会改变。
-   **与列表顺序无关。**每节经文在年份顺序中的位置都取决于它自身的出处，因此列表顺序并不重要。

## 输入

| 输入 | 描述                                                                                                                                                                                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 诗句 | `verses`数组来自[`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset)每节`chapter` `book` `verse` `categories`并且可以有`endVerse`和`addedIn` `removedIn`                                       |
| 日期 | 日历日期（年、月、日）。对于“今天”，请使用用户本地日期，而不是 UTC 日期。                                                                                                                                               |
| 种子 | 可选。用于选择不同顺序的字符串。默认为空字符串，即显示每日经文的标准顺序。                                                                                                                                              |
| 假期 | 同一文件中的`holidays`数组。每个节日都包含其类别的`id` ，以及`month`和`day` （每年同一天的节日）或`dates` （按顺序为`YYYY-MM-DD` ）个元素，表示日期每年都不同的节日。如果一个节日持续数天，则同一年内可以列出多个日期。 |
| 类别 | 可选。仅从任何一天中，在其`categories`中包含此类别的经文中选择。                                                                                                                                                        |

## 算法

### 第一步：找出年份和日期

取日期的年、月、日，以及该日期在一年中的第几天，从 0 开始计数：1 月 1 日是第 0 天，12 月 31 日是第 364 天（闰年为第 365 天）。

日期采用公历：如果一年能被 4 整除，则该年为闰年；但能被 100 整除但不能被 400 整除的年份除外（2000 年是闰年，1900 年不是）。

### 第二步：保留正在使用的经文

保留当年使用的经文：

-   `addedIn`缺失（或为空），或`addedIn <= year` ，且
-   缺少`removedIn` （或空值），或`year < removedIn` 。

### 步骤三：选择要挑选的经文

选择要挑选的诗句、步骤 4 的关键前缀以及步骤 7 的位置：

1. **已指定类别。**保留包含该`categories`的经文。前缀为`{seed}|{year}` ，位置为一年中的日期。
2. **未指定类别，且日期为节假日。**如果日期的`month`和`day`项与`holidays`项中的节假日匹配，或者`dates` （记为`YYYY-MM-DD` ，年份为四位数）包含该日期，则该日期为节假日。如果匹配多个节假日，则使用列表中的第一个（数据集中不会出现两个日期相同的节假日）。保留`categories`包含该节假日第`id`的诗句。如果存在这样的诗句，则前缀为`{seed}|{id}` （例如`|christmas` ），位置为`year × k + i` ，其中`k`表示该节假日在该年中的天数（如果节假日的第`month`项和`day`项都与第 1 项匹配，则为 1；否则为该节假日在该日期所在年份的`dates`的天数），第`i`表示该节假日在该日期之前的天数。对于每年只在一天中的节假日，位置即为年份。如果没有这样的诗句，则继续使用第 3 项。
3. **否则，**保留那些`categories`不包含`holidays`中任何节日的`id`的经文。前缀为`{seed}|{year}` ，位置为一年中的日期。

`seed`是种子（默认为空字符串）， `year`是步骤 1 中的年份`1` `2026` 。

如果没有经文剩余，就没有每日经文。

每年日期都会变化的节假日仅列出预先计算好的日期（目前为 2026 年至 2125 年），其他年份则为普通日期。请勿自行计算日期。

### 第四步：构建每节诗的调号

对于剩下的每一节诗，构建以下字符串：

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix`是步骤 3 中的前缀。
-   `book`是诗句中的`book` ，与数据集中显示的完全一致（大写的 USFM 书籍 ID，例如`JHN`或`1JN` ）。
-   `chapter`和`verse`是十进制数，没有前导零。
-   `endVerse`不是关键信息的一部分。段落以其第一节诗句为准。

例如，2026 年普通的一天，使用默认种子，约翰福音 3:16 的密钥是`|2026|JHN 3:16` ，圣诞节路加福音 2:7 的密钥是`|christmas|LUK 2:7` 。

### 步骤 5：对每个键进行哈希处理

使用 32 位[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)哈希算法对密钥的 UTF-8 字节进行哈希处理，然后将结果与[MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32`最终器混合。所有算术运算均基于无符号 32 位整数，因此乘法运算会循环（对 2³² 取模），右移运算是逻辑右移（移入零）。

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

结果就是这首诗的排序键，一个介于 0 到 4,294,967,295 之间的数字。

### 第六步：对诗句进行排序

将诗句按排序键排序，从小到大，比较排序键（作为无符号数）。

如果两节诗的排序键相同（这种情况非常罕见），则将步骤 4 中排序键字符串在序号（字符代码）上排在前面的诗节放在前面。所有排序键字符串都以相同的前缀开头，因此它们仅在后面的 ASCII 码上有所不同。

### 第七步：选择经文

每日经文是排序列表中位置`p mod n`经文（从 0 开始计数），其中`p`是步骤 3 中的位置（一年中的日期，或节假日为`year × k + i` ）， `n`是排序列表中的经文数量`mod`的结果永远不会是负数（如果年份为负数，则加`n`直到结果不为负数）。

平常情况下，完整数据集至少包含 366 节经文，因此`day mod n`就相当于`day`只有当您从某个类别或自定义列表中选择经文时，如果经文数量少于一年中的天数，则`mod`才显得重要，因为在这种情况下，经文会在一年内重复出现。在节假日，位置会逐年（如果是持续数天的节假日，则逐日）遍历该节假日的经文。

## 伪代码

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

一年中的每个普通日期都使用同一个排序列表，因此如果您为多个日期选择经文，请每年排序一次并重复使用。

## 种子

种子会改变每节经文的索引，因此会生成完全不同的顺序，但保证不变（一年内不重复，每年顺序都不同，历史记录稳定）。如果您希望自己的应用拥有专属的每日经文，而不是共享的经文，请使用您自己的种子，例如您的应用名称。留空则显示与其他用户相同的经文。

## 常见错误

-   **有符号整数。**在不支持无符号 32 位整数的语言（例如 Java、Kotlin 和 JavaScript）中，应先对有符号 32 位整数进行运算，然后使用逻辑右移（ `>>>` ），再将结果转换为无符号值（例如`hash.toLong() and 0xFFFFFFFF` ，或在 JavaScript 中使用`hash >>> 0` ），最后进行比较。在 JavaScript 中，乘法运算使用`Math.imul` ，使用`*`会损失精度。
-   **对字符而非字节进行哈希处理。**对密钥的 UTF-8 字节进行哈希处理，而不是对其 UTF-16 代码单元或 Unicode 代码点进行哈希处理。这仅对包含非 ASCII 字符的种子有影响，但这些种子是允许的。
-   **“今天”使用UTC时间。**每日经文会在用户所在时区的午夜更新。在大多数时区，使用UTC日期会显示前一天或后一天的部分经文。
-   **从1开始计算一年中的日期。** 1月1日是第0天。
-   **计算节假日日期。**请使用数据集中列出的`dates`不同的教堂和历法对复活节的计算方式不同，而数据集仅列出了预先计算好的日期。
-   不**计节假日。去掉**数字`holidays`后，节假日的诗句将被视为普通诗句，这也会导致每个普通日子的诗句发生变化。
-   **已移除的经文将被排除。**年份为`removedIn`经文仍保留在数据集中，因为较早年份的经文需要它们。请在步骤 2 中筛选这些经文；下载列表时不要删除它们。

## 测试向量

使用这些值来检查实现情况。

### 哈希

| 键（JSON 字符串格式）      | 排序键     | 十六进制     |
| -------------------------- | ---------- | ------------ |
| `""`                       | 2872998923 | `0xab3e7c0b` |
| `"a"`                      | 444641715  | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`       | 1930190452 | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"` | 2020168843 | `0x7869548b` |
| `"é\|1\|GEN 1:1"`          | 3677064616 | `0xdb2b8da8` |

### 一年中的日子

| 日期       | 年   | 一年中的某一天 |
| ---------- | ---- | -------------- |
| 2026-01-01 | 2026 | 0              |
| 2026-12-31 | 2026 | 364            |
| 2028-02-29 | 2028 | 59             |
| 2028-12-31 | 2028 | 365            |
| 1900-12-31 | 1900 | 364            |
| 2000-12-31 | 2000 | 365            |
| 0001-03-01 | 1    | 59             |
| 9999-12-31 | 9999 | 364            |

### 精选清单

这些诗歌使用了以下十六首诗句，其中八首是为节日而作：

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

而这些节日（平安夜没有诗句，所以它只是一个普通的日子）：

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

对于使用默认种子生成的 2026-01-01 日期，四节节日经文和约翰一书 4:19（尚未启用）被排除在外，因此剩下七节经文。按排序键排序后，它们分别是：

| 位置 | 钥匙                | 排序键     |
| ---- | ------------------- | ---------- |
| 0    | `\|2026\|PSA 23:1`  | 638659039  |
| 1    | `\|2026\|ROM 8:28`  | 1462075190 |
| 2    | `\|2026\|PRO 3:5`   | 1643805236 |
| 3    | `\|2026\|JHN 3:16`  | 1930190452 |
| 4    | `\|2026\|PHP 4:13`  | 2076082788 |
| 5    | `\|2026\|GEN 1:1`   | 2439817197 |
| 6    | `\|2026\|ISA 40:31` | 3044461366 |

1 月 1 日是第 0 天，所以当天的经文是诗篇 23:1。3 月 15 日是第 73 天，73 mod 7 = 3，所以当天的经文是约翰福音 3:16。

到了圣诞节，只剩下那些仍在使用的圣诞颂歌。2027年，共有三首圣诞颂歌，按排序键排序如下：

| 位置 | 钥匙                    | 排序键     |
| ---- | ----------------------- | ---------- |
| 0    | `\|christmas\|LUK 2:10` | 1698480150 |
| 1    | `\|christmas\|MAT 1:23` | 2563849700 |
| 2    | `\|christmas\|LUK 2:7`  | 3160581874 |

2027 mod 3 = 2，所以 2027 年圣诞节的每日经文是路加福音 2:7。2026 年，马太福音 1:23 还没有被使用，所以只有两个经文，2026 mod 2 = 0，得出路加福音 2:10-11。

复活节后的假期持续三天。它的四节经文，按排序键排列如下：

| 位置 | 钥匙                                    | 排序键     |
| ---- | --------------------------------------- | ---------- |
| 0    | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114   |
| 1    | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464  |
| 2    | `\|post-resurrection-sunday\|1CO 15:20` | 820536316  |
| 3    | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482 |

2026年，该现象出现三天，因此`k` =3，4月6日、7日和8日的位置分别为2026×3+0=6078、6079和6080。6078 mod 4=2，6079 mod 4=3，6080 mod 4=0，分别对应《哥林多前书》15:20、《使徒行传》2:24和《帖撒罗尼迦前书》4:14。2027年，位置从6081开始，因此下一节经文是《罗马书》6:9。

| 日期       | 种子     | 类别        | 每日经文         |
| ---------- | -------- | ----------- | ---------------- |
| 2026-01-01 |          |             | 诗篇 23:1        |
| 2026-01-02 |          |             | 罗马书 8:28      |
| 2026-03-15 |          |             | 约翰福音 3:16    |
| 2026-12-31 |          |             | 诗篇 23:1        |
| 2027-01-01 |          |             | 约翰福音 3:16    |
| 2027-06-30 |          |             | 箴言 3:5-6       |
| 2028-02-29 |          |             | 箴言 3:5-6       |
| 2028-12-31 |          |             | 诗篇 23:1        |
| 1969-12-31 |          |             | 箴言 3:5-6       |
| 0001-01-01 |          |             | ISA 40:31        |
| 2026-01-01 | `my-app` |             | ISA 40:31        |
| 2027-01-01 | `my-app` |             | PHP 4:13         |
| 2026-01-01 |          | `hope`      | 罗马书 8:28      |
| 2027-01-01 |          | `hope`      | ISA 40:31        |
| 2027-01-01 |          | `joy`       | 今日无经文       |
| 2026-12-25 |          |             | 路加福音 2:10-11 |
| 2027-12-25 |          |             | 路加福音 2:7     |
| 2028-12-25 |          |             | 路加福音 2:10-11 |
| 2029-12-25 |          |             | 马太福音 1:23    |
| 2026-12-25 | `my-app` |             | 路加福音 2:10-11 |
| 2026-04-05 |          |             | 马太福音 28:6    |
| 2027-03-28 |          |             | 马太福音 28:6    |
| 2028-04-16 |          |             | 诗篇 23:1        |
| 2026-12-24 |          |             | 诗篇 23:1        |
| 2026-07-01 |          | `christmas` | 路加福音 2:7     |
| 2026-04-06 |          |             | 哥林多前书 15:20 |
| 2026-04-07 |          |             | 使徒行传 2:24    |
| 2026-04-08 |          |             | 路加福音 4:14    |
| 2026-04-09 |          |             | 诗篇 23:1        |
| 2027-03-29 |          |             | 罗马书 6:9       |
| 2027-03-30 |          |             | 哥林多前书 15:20 |
| 2027-03-31 |          |             | 使徒行传 2:24    |

2028-04-16 是复活节星期日，但它不在这个列表的`dates`中，所以这是一个普通的日子。

### 从数据集中挑选

该数据集从不更改已开始年份的经文，因此 2026 年的每日经文保持不变：

| 日期       | 假期           | 每日经文          |
| ---------- | -------------- | ----------------- |
| 2026-01-01 |                | 诗篇 32:1         |
| 2026-04-03 | 耶稣受难日     | 路加福音 23:33    |
| 2026-04-05 | 复活节         | 马太福音 28:9     |
| 2026-04-06 | 复活节后       | 启示录 1:17-18    |
| 2026-06-15 |                | 美国东部时间 4:14 |
| 2026-10-28 |                | PSA 136:1         |
| 2026-10-31 | 万圣节前夜     | 以弗所书 5:8      |
| 2026-11-29 | 将临期第一主日 | MAL 3:1           |
| 2026-12-24 | 圣诞节前夕     | 马太福音 1:21     |
| 2026-12-25 | 圣诞节         | 以赛亚书 9:6      |
| 2026-12-31 |                | 以西结书 36:26    |

## 实施方案

这些实现遵循约定，它们的测试会检查此页面上的值：

-   JavaScript/TypeScript： [`free-use-bible-api`](../../sdks/javascript.md)包中的`pickVerseOfTheDay()`和`FreeUseBibleApi.getVerseOfTheDay()` （[来源](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts)）。
-   Kotlin： [Kotlin SDK](../../sdks/kotlin.md)中的`pickVerseOfTheDay()`和`FreeUseBibleApi.getVerseOfTheDay()` （[来源](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt)）。
-   Swift： [Swift SDK](../../sdks/swift.md)中的`pickVerseOfTheDay(_:date:seed:category:holidays:)`和`FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` （[来源](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift)）。
-   [MCP 服务器](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp)的`getVerseOfTheDay`工具（[来源](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts)）。
-   `getVerseOfTheDay()` （ `@helloao/tools` ），它使用[软件包](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts)内置的列表。
