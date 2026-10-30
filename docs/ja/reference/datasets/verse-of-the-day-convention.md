# 今日の聖句大会

このページでは、 [`verse-of-the-day`データセット](./README.md#verse-of-the-day)からその日の聖句を選択する方法を説明しています。これにより、どの言語で実装しても、他のすべての実装と同じ聖句を取得できます。

APIは静的ファイルで構成されているため、聖句を自動的に選択するわけではありません。共通のデフォルト設定が採用されており、これに従うアプリは同じ日に同じ聖句を表示します。アプリは自由に異なる聖句を選択でき、[シード値を](#seeds)使用することで、同じ保証を維持しながら簡単に選択できるようになります。

## 保証

-   **決定論的。**同じ日付（およびシード値）を使用すれば、どのデバイス、どの実装においても、常に同じ聖句が得られます。
-   **同じ年に同じ詩句が繰り返されることはありません。**各年ごとに詩句の順序がランダムに並べ替えられ、その年の日付がその順序に従って表示されます。データセットには、使用されているすべての日に対して少なくとも366の詩句が含まれているため、同じ詩句が同じ暦年に2回出現することはありません。
-   **祝日。**キリスト教の祝日（クリスマスや復活祭など）には、その日の聖句は祝日に定められた聖句の一つです。祝日は聖句を一年ごとに使い切るため、すべての聖句が使い切られるまで毎年異なる聖句が用いられます。数日間続く祝日（復活祭後の三日間など）では、毎日異なる聖句が用いられます。祝日の聖句は、他の日には使用されません。
-   **毎年順番が変わります。**一度すべての節が使われたら、同じ順番が繰り返されることはありません。毎年別々にシャッフルされるため、同じ節が12月31日と1月1日に再び現れることもあります（約650回に1回）。
-   **安定した履歴。**データセットは、まだ始まっていない年の聖句のみを追加または削除するため（ [`addedIn`と`removedIn`](#step-2-keep-the-verses-that-are-in-use)を参照）、既に過ぎ去った日付のその日の聖句は変更されません。
-   **リストの順序とは無関係です。**各節の年ごとの位置は、それぞれの参照箇所に基づいて決定されるため、リストの順序は関係ありません。

## 入力

| 入力     | 説明                                                                                                                                                                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 詩       | [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset)からの`verses`配列。各節`verse` `addedIn` `book` `chapter` `removedIn` `categories` `endVerse`ます。                                                                                       |
| 日付     | カレンダーの日付（年、月、日）。「今日」の場合は、UTCの日付ではなく、ユーザーのローカル日付を使用してください。                                                                                                                                                         |
| シード   | オプション。異なる順序を選択する文字列。デフォルトは空文字列で、その日の標準的な聖句が表示されます。                                                                                                                                                                    |
| 休日     | 同じファイルからの`holidays`の配列。各祝日には、そのカテゴリの`id` 、毎年同じ日付の祝日の場合は`month`と`day` 、毎年日付が変わる祝日の場合は`dates` （ `YYYY-MM-DD`は順番に）のリストがあります。祝日が数日間続く場合は、同じ年に複数の日付をリストすることができます。 |
| カテゴリ | 任意。任意の日付において、このカテゴリが`categories`に含まれる詩句のみを選択してください。                                                                                                                                                                              |

## アルゴリズム

### ステップ1：年と日付を調べる

日付の年、月、日と、その日付が1年の何日目にあたるかを、0日目から数えて求めます。1月1日は0日目、12月31日は364日目（うるう年の場合は365日目）です。

日付はグレゴリオ暦の先取り方式を使用します。4で割り切れる年は閏年ですが、100で割り切れる年であっても400で割り切れない年は閏年ではありません（2000年は閏年ですが、1900年は閏年ではありません）。

### ステップ2：使用されている聖句を保持する

その年に使用されている聖句はそのままにしておいてください。

-   `addedIn`は欠落 (または null) であり、 `addedIn <= year`は、
-   `removedIn`は欠落 (または null) または`year < removedIn`です。

### ステップ3：選ぶ聖句を選択する

ステップ4で使用する聖句、キーワードの接頭辞、およびステップ7で使用する位置を選択してください。

1. **カテゴリが指定されました。**その`categories`を含む、使用中の詩句を保持してください。接頭辞は`{seed}|{year}`で、位置は1年の日数です。
2. **カテゴリが指定されておらず、日付は祝日です。**日付が祝日であるのは、 `holidays`の祝日に日付の`month`と`day`含まれている場合、または`dates`に日付が記載されている場合 ( `YYYY-MM-DD`と表記され、4 桁の年が付きます)。一致する祝日が複数ある場合は、リストの最初のものを使用します (データセットには同じ日付に 2 つの祝日はありません)。5 `categories`祝日の`id`が含まれている使用中の詩句を保持します。ある場合は、接頭辞は`{seed}|{id}` (たとえば`|christmas` ) で、位置は`year × k + i`です。ここで、 `k`は祝日がその年に祝われる日数 ( `month`と`day`がある祝日の場合は 1、それ以外の場合は日付の年の`dates`の数) で、 `i`はそれらの日数のうち日付より前の日数です。1 年に 1 日だけ祝われる祝日の場合は、位置は単に年です。ない場合は、3 に進みます。
3. **それ以外の場合は、** `holidays`の祝日の`id`を含まない`categories`を使用する詩句を保持します。接頭辞は`{seed}|{year}`で、位置は年間の日数です。

`seed`はシード (デフォルトでは空の文字列) であり、 `year`ステップ 1 からの年を先頭のゼロなしで`1` `2026` 。

残りの詩句がなくなったら、その日の詩句はありません。

毎年日付が変わる祝日については、事前に計算された日付（現在は2026年から2125年まで）のみが記載されています。そのため、それ以外の年は通常の日となります。ご自身で日付を計算しないでください。

### ステップ4：各節のキーを構築する

残りの各節について、次の文字列を作成します。

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix`はステップ3で得られた接頭辞です。
-   `book`は、データセットに表示されているとおりの詩の`book`です ( `JHN`や`1JN`のような大文字の USFM ブック ID)。
-   `chapter`と`verse`は、先頭にゼロを付けない10進数です。
-   `endVerse`はキーの一部ではありません。一節はその最初の節によって識別されます。

例えば、デフォルトのシードを使用した2026年の普通の日のヨハネ3:16のキーは`|2026|JHN 3:16`であり、クリスマスのルカ2:7のキーは`|christmas|LUK 2:7`です。

### ステップ5：各キーをハッシュ化する

キーのUTF-8バイトを32ビット[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)ハッシュでハッシュ化し、その結果を[MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32`ファイナライザと混合します。すべての演算は符号なし32ビット整数で行われるため、乗算はラップアラウンド（2³²で剰余演算）し、右シフトは論理（ゼロシフト）となります。

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

その結果が、その節のソートキーとなる数値で、0から4,294,967,295までの値をとります。

### ステップ6：詩を分類する

詩をソートキーに基づいて、小さい順に並べ替えます。その際、キーは符号なし数値として比較します。

2つの詩句が同じソートキーを持つ場合（これは非常にまれですが）、手順4で求めたキー文字列が序数（文字コード）順で先に来る詩句を最初に配置します。キー文字列はすべて同じ接頭辞で始まるため、異なるのはそれに続くASCII参照のみです。

### ステップ7：聖句を選ぶ

その日の聖句は、ソートされたリストの`p mod n`番目の位置にある聖句です（0から数えます）。ここで、 `p`はステップ3で指定した位置（その年の日付、祝日の場合は`year × k + i` ）であり、 `n`ソートされたリストに含まれる聖句の数です。4という結果は決して負の値になりませ`mod` （負の年の場合は、負の値にならないまで`n`加算します）。

通常の日には、データセット全体に少なくとも 366 節が含まれているため、 `day mod n`は単に`day`なります。2 `mod` 、1 年の日数よりも少ない節を含むカテゴリまたは独自のリストから選択する場合に重要になります。この場合、節は 1 年内で繰り返されます。祝日の場合、位置は祝日の節を 1 年 (数日間続く祝日の場合は 1 日ごと) に処理します。

## 擬似コード

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

一年間の通常の日付はすべて同じソート済みリストを使用するため、複数の日付に対応する聖句を選択する場合は、年に一度ソートして再利用してください。

## 種子

シード値によって各節のキーが変わるため、同じ保証（1年以内に同じ節が繰り返されない、毎年新しい順序、安定した履歴）のもとで、毎回全く異なる順序が表示されます。アプリ独自の「今日の節」を表示したい場合は、アプリ名などの独自のシード値を使用してください。他のユーザーと同じ節を表示する場合は、シード値を空欄のままにしてください。

## よくある間違い

-   **符号付き整数。**符号なし32ビット整数を持たない言語（Java、Kotlin、JavaScript）では、符号付き32ビット整数に対して演算を行い、論理右シフト（ `>>>` ）を適用してから、比較する前に結果を符号なし値（JavaScriptでは`hash.toLong() and 0xFFFFFFFF` 、または`hash >>> 0`など）に変換してください。JavaScriptでは、乗算には`Math.imul`使用してください。4 `*`使用すると精度が失われます。
-   **バイトではなく文字をハッシュ化します。**キーのUTF-8バイトをハッシュ化し、UTF-16コードユニットやUnicodeコードポイントはハッシュ化しません。これは非ASCII文字を含むシードの場合にのみ重要ですが、非ASCII文字の使用は許可されています。
-   **「今日」にはUTCを使用します。**その日の聖句は、ユーザーの現地時間の午前0時に更新されます。UTCで日付を指定すると、ほとんどのタイムゾーンで、その日の一部について前日または翌日の聖句が表示されます。
-   **1日から数えて1年を数えると、** 1月1日は0日目です。
-   **祝日の日付を計算します。**データセットに記載されている「 `dates`を使用してください。教会や暦によってイースターの計算方法は異なり、このデータセットには事前に計算された日付のみが記載されています。
-   **祝日を除外します。0** `holidays`ない場合、祝日の節は通常の節として扱われ、通常の日の節もすべて変更されます。
-   **削除された節は除外します。**年が`removedIn`節は、それ以前の年に必要なため、データセットに残っています。ステップ2でフィルタリングしてください。リストをダウンロードする際には削除しないでください。

## テストベクトル

これらの値を使用して実装を確認してください。

### ハッシュ

| キー（JSON文字列形式）     | ソートキー | 16進数       |
| -------------------------- | ---------- | ------------ |
| `""`                       | 2872998923 | `0xab3e7c0b` |
| `"a"`                      | 444641715  | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`       | 1930190452 | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"` | 2020168843 | `0x7869548b` |
| `"é\|1\|GEN 1:1"`          | 3677064616 | `0xdb2b8da8` |

### 年間の日数

| 日付       | 年   | 年間の日 |
| ---------- | ---- | -------- |
| 2026-01-01 | 2026 | 0        |
| 2026-12-31 | 2026 | 364      |
| 2028-02-29 | 2028 | 59       |
| 2028-12-31 | 2028 | 365      |
| 1900-12-31 | 1900 | 364      |
| 2000-12-31 | 2000 | 365      |
| 0001-03-01 | 1    | 59       |
| 9999-12-31 | 9999 | 364      |

### 少数のリストからのおすすめ

これらは以下の16節のリストを使用しており、そのうち8節は祝日に関するものです。

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

そしてこれらの祝日（クリスマスイブには聖句がないので、普通の日です）：

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

2026年1月1日、デフォルトシードの場合、4つの祝日の聖句とヨハネの手紙一4章19節（まだ使用されていない）が除外され、7つの聖句が残ります。ソートキーでソートすると、次のようになります。

| 位置 | 鍵                  | ソートキー |
| ---- | ------------------- | ---------- |
| 0    | `\|2026\|PSA 23:1`  | 638659039  |
| 1    | `\|2026\|ROM 8:28`  | 1462075190 |
| 2    | `\|2026\|PRO 3:5`   | 1643805236 |
| 3    | `\|2026\|JHN 3:16`  | 1930190452 |
| 4    | `\|2026\|PHP 4:13`  | 2076082788 |
| 5    | `\|2026\|GEN 1:1`   | 2439817197 |
| 6    | `\|2026\|ISA 40:31` | 3044461366 |

1月1日は0日目なので、その日の聖句は詩篇23篇1節です。3月15日は73日目で、73を7で割ると3になるので、ヨハネによる福音書3章16節です。

クリスマスには、現在使用されているクリスマスの詩のみが残ります。2027年には3つあり、ソートキーで並べ替えられています。

| 位置 | 鍵                      | ソートキー |
| ---- | ----------------------- | ---------- |
| 0    | `\|christmas\|LUK 2:10` | 1698480150 |
| 1    | `\|christmas\|MAT 1:23` | 2563849700 |
| 2    | `\|christmas\|LUK 2:7`  | 3160581874 |

2027 mod 3 = 2 なので、2027年のクリスマスの聖句はルカによる福音書2章7節です。2026年にはマタイによる福音書1章23節はまだ使われていないので、聖句は2つしかなく、2026 mod 2 = 0 なのでルカによる福音書2章10-11節になります。

復活祭の翌日の祝日は3日間続く。その祝日の4つの節は、並べ替えキーに従って並べると以下のようになる。

| 位置 | 鍵                                      | ソートキー |
| ---- | --------------------------------------- | ---------- |
| 0    | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114   |
| 1    | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464  |
| 2    | `\|post-resurrection-sunday\|1CO 15:20` | 820536316  |
| 3    | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482 |

2026年は3日間観測されるため、 `k` = 3となり、4月6日、7日、8日の位置は2026 × 3 + 0 = 6078、6079、6080となります。6078 mod 4 = 2、6079 mod 4 = 3、6080 mod 4 = 0から、1コリント15:20、使徒2:24、1テサロニケ4:14が得られます。2027年は位置が6081から続くため、次の節はローマ6:9です。

| 日付       | シード   | カテゴリ    | 今日の聖句               |
| ---------- | -------- | ----------- | ------------------------ |
| 2026-01-01 |          |             | PSA 23:1                 |
| 2026-01-02 |          |             | ローマ8:28               |
| 2026-03-15 |          |             | ヨハネ3:16               |
| 2026-12-31 |          |             | PSA 23:1                 |
| 2027-01-01 |          |             | ヨハネ3:16               |
| 2027-06-30 |          |             | 箴言 3:5-6               |
| 2028-02-29 |          |             | 箴言 3:5-6               |
| 2028-12-31 |          |             | PSA 23:1                 |
| 1969-12-31 |          |             | 箴言 3:5-6               |
| 0001-01-01 |          |             | イザヤ書 40:31           |
| 2026-01-01 | `my-app` |             | イザヤ書 40:31           |
| 2027-01-01 | `my-app` |             | PHP 4:13                 |
| 2026-01-01 |          | `hope`      | ローマ8:28               |
| 2027-01-01 |          | `hope`      | イザヤ書 40:31           |
| 2027-01-01 |          | `joy`       | 今日の聖句はありません   |
| 2026-12-25 |          |             | ルカによる福音書 2:10-11 |
| 2027-12-25 |          |             | ルカによる福音書 2:7     |
| 2028-12-25 |          |             | ルカによる福音書 2:10-11 |
| 2029-12-25 |          |             | マタイ1:23               |
| 2026-12-25 | `my-app` |             | ルカによる福音書 2:10-11 |
| 2026-04-05 |          |             | マタイ28:6               |
| 2027-03-28 |          |             | マタイ28:6               |
| 2028-04-16 |          |             | PSA 23:1                 |
| 2026-12-24 |          |             | PSA 23:1                 |
| 2026-07-01 |          | `christmas` | ルカによる福音書 2:7     |
| 2026-04-06 |          |             | コリント第一 15:20       |
| 2026-04-07 |          |             | 使徒行伝 2:24            |
| 2026-04-08 |          |             | 1テサロニケ4:14          |
| 2026-04-09 |          |             | PSA 23:1                 |
| 2027-03-29 |          |             | ローマ6:9                |
| 2027-03-30 |          |             | コリント第一 15:20       |
| 2027-03-31 |          |             | 使徒行伝 2:24            |

2028年4月16日は復活祭ですが、このリストの`dates`には含まれていないため、普通の日です。

### データセットからの選択

このデータセットでは、既に始まっている年の聖句は決して変更されないため、2026年のその日の聖句は同じままです。

| 日付       | 休日           | 今日の聖句             |
| ---------- | -------------- | ---------------------- |
| 2026-01-01 |                | PSA 32:1               |
| 2026-04-03 | 聖金曜日       | ルカによる福音書 23:33 |
| 2026-04-05 | 復活祭         | マタイ28:9             |
| 2026-04-06 | 復活祭後       | 黙示録 1:17-18         |
| 2026-06-15 |                | 東部標準時 4:14        |
| 2026-10-28 |                | PSA 136:1              |
| 2026-10-31 | 万聖節前夜     | エペソ5:8              |
| 2026-11-29 | 待降節第一主日 | マラキ書 3:1           |
| 2026-12-24 | クリスマスイブ | マタイ1:21             |
| 2026-12-25 | クリスマス     | イザヤ書 9:6           |
| 2026-12-31 |                | エゼキエル書 36:26     |

## 実装

これらの実装は規約に従っており、テストではこのページに記載されている値をチェックします。

-   JavaScript/TypeScript: [`free-use-bible-api`](../../sdks/javascript.md)パッケージ内の`pickVerseOfTheDay()`と`FreeUseBibleApi.getVerseOfTheDay()` ([ソース](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts))。
-   Kotlin: [Kotlin SDK](../../sdks/kotlin.md)の`pickVerseOfTheDay()`と`FreeUseBibleApi.getVerseOfTheDay()` ([ソース](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt))。
-   Swift: [Swift SDK](../../sdks/swift.md)の`pickVerseOfTheDay(_:date:seed:category:holidays:)`と`FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` ([ソース](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift))。
-   [MCPサーバー](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp)の`getVerseOfTheDay`のツール（[ソース](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts)）。
-   `getVerseOfTheDay()` ([ソース](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts)) `@helloao/tools` 、パッケージに組み込まれているリストを使用します。
