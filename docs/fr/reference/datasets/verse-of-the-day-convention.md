# Convention du verset du jour

Cette page explique comment choisir le verset du jour à partir du [jeu de données `verse-of-the-day`](./README.md#verse-of-the-day) , afin que vous puissiez l'implémenter dans n'importe quelle langue et obtenir le même verset que pour toutes les autres implémentations.

L'API est composée de fichiers statiques ; elle ne choisit donc pas de verset pour vous. La convention est une valeur par défaut partagée : les applications qui la suivent affichent le même verset le même jour. Les applications sont libres de choisir un verset différent, et la [valeur initiale](#seeds) leur offre un moyen simple de le faire tout en conservant les mêmes garanties.

## Garanties

-   **Déterministe.** La même date (et la même graine) donne toujours le même verset, sur tous les appareils et dans toutes les implémentations.
-   **Aucun verset ne se répète au cours d'une même année.** Chaque année possède son propre ordre aléatoire de versets, et les jours de l'année s'y succèdent. L'ensemble de données contient toujours au moins 366 versets par jour, de sorte qu'un verset n'apparaît jamais deux fois dans la même année civile.
-   **Fêtes.** Lors d'une fête chrétienne (comme Noël ou le dimanche de Pâques), le verset du jour est l'un des versets liturgiques propres à cette fête. Chaque fête utilise ses versets liturgiques un par un, de sorte qu'un verset différent est récité chaque année jusqu'à ce que tous les versets aient été utilisés. Une fête qui dure plusieurs jours (comme les trois jours suivant le dimanche de Pâques) a un verset différent chaque jour. Les versets liturgiques des fêtes ne sont pas utilisés les autres jours.
-   **Un nouvel ordre chaque année.** L'ordre n'est pas répété une fois que tous les versets ont été utilisés. Comme chaque année est mélangée séparément, le même verset peut parfois apparaître le 31 décembre et le 1er janvier (environ une fois sur 650).
-   **Historique stable.** L'ensemble de données n'ajoute ou ne supprime que les versets d'une année qui n'a pas encore commencé (voir [`addedIn` et `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), de sorte que le verset du jour pour une date déjà passée ne change jamais.
-   **Indépendamment de l'ordre de la liste.** La place de chaque verset dans l'ordre annuel provient de sa propre référence ; l'ordre de la liste n'a donc aucune importance.

## Entrées

| Saisir    | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versets   | Le tableau `verses` de [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Chaque verset a un `book` , `chapter` , `verse` et `categories` , et peut avoir `endVerse` , `addedIn` et `removedIn` .                                                                                                                                                                                                           |
| Date      | Une date calendaire (année, mois et jour). Pour « aujourd'hui », utilisez la date locale de l'utilisateur et non la date en UTC.                                                                                                                                                                                                                                                                                                       |
| Graine    | Facultatif. Une chaîne de caractères permettant de sélectionner un ordre différent. Par défaut, une chaîne vide est utilisée, ce qui correspond au verset du jour standard.                                                                                                                                                                                                                                                            |
| Vacances  | Le tableau `holidays` provient du même fichier. Chaque jour férié est identifié par le `id` correspondant à sa catégorie, et soit par un `month` et `day` (pour un jour férié ayant lieu à la même date chaque année), soit par une liste de `dates` ( `YYYY-MM-DD` , dans l'ordre) pour un jour férié dont la date change chaque année. Un jour férié peut avoir plusieurs dates au cours de la même année s'il dure plusieurs jours. |
| Catégorie | Facultatif. Choisissez uniquement parmi les versets qui comportent cette catégorie dans leur `categories` , quel que soit le jour.                                                                                                                                                                                                                                                                                                     |

## Algorithme

### Étape 1 : Trouvez l'année et le jour de l'année

Prenez l'année, le mois et le jour de la date, et le jour de l'année correspondant à cette date, en comptant à partir de 0 : le 1er janvier est le jour 0, le 31 décembre est le jour 364 (ou le jour 365 en année bissextile).

Les dates utilisent le calendrier grégorien proleptique : une année est bissextile si elle est divisible par 4, sauf pour les années divisibles par 100 qui ne sont pas divisibles par 400 (2000 est une année bissextile, 1900 ne l'est pas).

### Étape 2 : Conservez les versets qui sont utilisés

Conservez les versets utilisés durant l'année :

-   `addedIn` est manquant (ou nul), ou `addedIn <= year` , et
-   `removedIn` est manquant (ou nul), ou `year < removedIn` .

### Étape 3 : Choisissez les versets à sélectionner.

Choisissez les versets à sélectionner, un préfixe clé pour l'étape 4 et une position pour l'étape 7 :

1. **Une catégorie a été définie.** Conservez les versets en usage dont le `categories` la contient. Le préfixe est `{seed}|{year}` et la position correspond au jour de l'année.
2. **Aucune catégorie n'a été précisée et la date est un jour férié.** Une date est considérée comme fériée si un jour férié figurant à l'indice `holidays` correspond à la date (indice `month` et `day` ), ou si la date figure à l'indice `dates` (noté `YYYY-MM-DD` , suivi d'une année à quatre chiffres). Si plusieurs jours fériés correspondent, le premier de la liste est retenu (l'ensemble de données ne contient jamais deux jours fériés à la même date). Conservez les versets dont `categories` contient l'indice `id` du jour férié. Le cas échéant, le préfixe est `{seed}|{id}` (par exemple `|christmas` ) et la position est `year × k + i` , où `k` représente le nombre de jours où le jour férié est observé dans l'année (1 pour un jour férié dont les indices `month` et `day` sont présents ; sinon, le numéro de son indice `dates` dans l'année) et `i` le nombre de jours précédant la date. Pour un jour férié observé une seule fois par an, la position correspond simplement à l'année. Si aucun autre jour férié ne correspond, poursuivez avec l'indice 3.
3. **Sinon,** conservez les versets en usage dont `categories` ne contient pas le `id` d'une fête de l' `holidays` Le préfixe est `{seed}|{year}` et la position est le jour de l'année.

`seed` est la graine (la chaîne vide par défaut), et `year` est l'année de l'étape 1 en décimal sans zéros non significatifs (par exemple `2026` , `1` ).

S'il ne reste plus de versets, il n'y a pas de verset du jour.

Pour les jours fériés dont la date change chaque année, seules les dates précalculées (actuellement de 2026 à 2125) sont affichées ; les autres années, ce sont des jours ordinaires. Ne calculez pas les dates vous-même.

### Étape 4 : Élaborer la clé de chaque verset

Pour chaque verset restant, construisez cette chaîne :

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` est le préfixe de l'étape 3.
-   `book` correspond exactement au `book` du verset tel qu'il apparaît dans l'ensemble de données (un identifiant de livre USFM en majuscules tel que `JHN` ou `1JN` ).
-   `chapter` et `verse` sont en décimal sans zéros non significatifs.
-   Le chiffre `endVerse` ne fait pas partie de la légende. Un passage est identifié par son premier verset.

Par exemple, la clé de Jean 3:16 un jour ordinaire de 2026 avec la graine par défaut est `|2026|JHN 3:16` , et la clé de Luc 2:7 à Noël est `|christmas|LUK 2:7` .

### Étape 5 : Hacher chaque clé

Hachez les octets UTF-8 de la clé avec le hachage [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) 32 bits, puis mélangez le résultat avec le finaliseur [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Toutes les opérations arithmétiques portent sur des entiers non signés 32 bits ; les multiplications sont donc modulo 2³² et les décalages à droite sont logiques (ils ajoutent des zéros).

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

Le résultat est la clé de tri du verset, un nombre compris entre 0 et 4 294 967 295.

### Étape 6 : Trier les versets

Triez les versets selon leur clé de tri, de la plus petite à la plus grande, en comparant les clés comme des nombres non signés.

Si deux versets ont la même clé de tri (ce qui est très rare), placez en premier celui dont la clé de l'étape 4 apparaît en premier dans l'ordre ordinal (code de caractère). Les clés commencent toutes par le même préfixe ; elles ne diffèrent donc que par la référence ASCII qui suit.

### Étape 7 : Choisissez le verset

Le verset du jour est celui qui se trouve à la position `p mod n` dans la liste triée (en comptant à partir de 0), où `p` correspond à la position à l'étape 3 (le jour de l'année, ou `year × k + i` un jour férié) et `n` au nombre de versets dans la liste triée. Le résultat de `mod` n'est jamais négatif (pour une année négative, ajoutez `n` jusqu'à ce qu'il ne le soit plus).

En temps normal, l'ensemble de données complet comporte au moins 366 versets ; `day mod n` est donc simplement égal `day` Le `mod` intervient lorsque vous sélectionnez un verset dans une catégorie ou une liste personnalisée contenant moins de versets que de jours dans l'année, car certains versets se répètent au cours de l'année. Lors d'un jour férié, la position parcourt les versets de l'année (et, pour un jour férié de plusieurs jours, un jour à la fois).

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

Chaque date ordinaire de l'année utilise la même liste triée ; par conséquent, si vous choisissez des versets pour plusieurs dates, triez-les une fois par an et réutilisez-les.

## Graines

La graine modifie la tonalité de chaque verset, offrant ainsi un ordre totalement différent tout en conservant les mêmes garanties (pas de répétitions au cours d'une même année, un nouvel ordre chaque année, un historique stable). Utilisez votre propre graine, par exemple le nom de votre application, si vous souhaitez que celle-ci propose son propre verset du jour. Laissez ce champ vide pour afficher le même verset que tous les autres utilisateurs.

## Erreurs courantes

-   **Entiers signés.** Dans les langages ne prenant pas en charge les entiers non signés 32 bits (Java, Kotlin, JavaScript), effectuez les calculs sur des entiers signés 32 bits et appliquez un décalage logique à droite ( `>>>` ), puis convertissez le résultat en une valeur non signée (par exemple `hash.toLong() and 0xFFFFFFFF` ou `hash >>> 0` en JavaScript) avant la comparaison. En JavaScript, utilisez `Math.imul` pour les multiplications ; `*` entraîne une perte de précision.
-   **Hachage des caractères plutôt que des octets.** Hachez les octets UTF-8 de la clé, et non ses unités de code UTF-16 ou ses points de code Unicode. Ceci n'a d'importance que pour les clés contenant des caractères non ASCII, mais celles-ci sont autorisées.
-   **L'heure UTC est utilisée pour « aujourd'hui ».** Le verset du jour change à minuit, heure locale de l'utilisateur. L'affichage de la date en UTC permet de consulter le verset de la veille ou du lendemain pendant une partie de la journée dans la plupart des fuseaux horaires.
-   **En comptant les jours de l'année à partir du 1er janvier,** le 1er janvier est le jour 0.
-   **Calcul des dates des fêtes.** Utilisez la valeur `dates` indiquée dans l'ensemble de données. Les dates de Pâques étant calculées différemment selon les églises et les calendriers, l'ensemble de données ne mentionne que les dates précalculées.
-   **Hormis les jours fériés,** sans le `holidays` , les versets relatifs aux fêtes sont traités comme des versets ordinaires, ce qui modifie également les versets de chaque jour ordinaire.
-   **Les versets supprimés sont exclus.** Les versets dont l'année est `removedIn` sont conservés dans l'ensemble de données car ils sont nécessaires pour les années antérieures. Filtrez-les à l'étape 2 ; ne les supprimez pas lors du téléchargement de la liste.

## Vecteurs de test

Utilisez ces valeurs pour vérifier une implémentation.

### Hachages

| Clé (sous forme de chaîne JSON) | Clé de tri | Hex          |
| ------------------------------- | ---------- | ------------ |
| `""`                            | 2872998923 | `0xab3e7c0b` |
| `"a"`                           | 444641715  | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`            | 1930190452 | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`      | 2020168843 | `0x7869548b` |
| `"é\|1\|GEN 1:1"`               | 3677064616 | `0xdb2b8da8` |

### Jours de l'année

| Date       | Année | Jour de l'année |
| ---------- | ----- | --------------- |
| 2026-01-01 | 2026  | 0               |
| 2026-12-31 | 2026  | 364             |
| 2028-02-29 | 2028  | 59              |
| 2028-12-31 | 2028  | 365             |
| 1900-12-31 | 1900  | 364             |
| 2000-12-31 | 2000  | 365             |
| 0001-03-01 | 1     | 59              |
| 9999-12-31 | 9999  | 364             |

### Sélection d'une petite liste

Ces textes utilisent cette liste de seize versets, dont huit concernent des fêtes :

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

Et ces jours fériés (la veille de Noël n'a pas de versets, c'est donc un jour ordinaire) :

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

Pour le 1er janvier 2026 avec la graine par défaut, les quatre versets relatifs aux fêtes et 1 Jean 4:19 (qui n'est pas encore utilisé) sont omis, il reste donc sept versets. Triés selon leurs clés de tri, ils sont :

| Position | Clé                 | Clé de tri |
| -------- | ------------------- | ---------- |
| 0        | `\|2026\|PSA 23:1`  | 638659039  |
| 1        | `\|2026\|ROM 8:28`  | 1462075190 |
| 2        | `\|2026\|PRO 3:5`   | 1643805236 |
| 3        | `\|2026\|JHN 3:16`  | 1930190452 |
| 4        | `\|2026\|PHP 4:13`  | 2076082788 |
| 5        | `\|2026\|GEN 1:1`   | 2439817197 |
| 6        | `\|2026\|ISA 40:31` | 3044461366 |

Le 1er janvier est le jour 0, donc le verset du jour est le Psaume 23:1. Le 15 mars est le jour 73, et 73 mod 7 = 3, donc c'est Jean 3:16.

À Noël, seuls les versets de Noël en usage sont conservés. En 2027, il y en a trois, classés selon leurs clés de tri :

| Position | Clé                     | Clé de tri |
| -------- | ----------------------- | ---------- |
| 0        | `\|christmas\|LUK 2:10` | 1698480150 |
| 1        | `\|christmas\|MAT 1:23` | 2563849700 |
| 2        | `\|christmas\|LUK 2:7`  | 3160581874 |

2027 mod 3 = 2, donc le verset du jour à Noël 2027 est Luc 2:7. En 2026, Matthieu 1:23 n'est pas encore utilisé, il n'y en a donc que deux, et 2026 mod 2 = 0 donne Luc 2:10-11.

La fête suivant le dimanche de Pâques dure trois jours. Ses quatre versets, classés selon leurs clés de tri, sont :

| Position | Clé                                     | Clé de tri |
| -------- | --------------------------------------- | ---------- |
| 0        | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114   |
| 1        | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464  |
| 2        | `\|post-resurrection-sunday\|1CO 15:20` | 820536316  |
| 3        | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482 |

En 2026, cette fête est célébrée sur trois jours, donc `k` = 3. Les positions des 6, 7 et 8 avril sont alors 2026 × 3 + 0 = 6078, 6079 et 6080. 6078 modulo 4 = 2, 6079 modulo 4 = 3 et 6080 modulo 4 = 0, ce qui correspond aux versets suivants : 1 Corinthiens 15:20, Actes 2:24 et 1 Thessaloniciens 4:14. En 2027, les positions reprennent à partir de 6081, le verset suivant est donc Romains 6:9.

| Date       | Graine   | Catégorie   | Verset du jour        |
| ---------- | -------- | ----------- | --------------------- |
| 2026-01-01 |          |             | PSA 23:1              |
| 2026-01-02 |          |             | ROM 8:28              |
| 2026-03-15 |          |             | Jean 3:16             |
| 2026-12-31 |          |             | PSA 23:1              |
| 2027-01-01 |          |             | Jean 3:16             |
| 2027-06-30 |          |             | PRO 3:5-6             |
| 2028-02-29 |          |             | PRO 3:5-6             |
| 2028-12-31 |          |             | PSA 23:1              |
| 1969-12-31 |          |             | PRO 3:5-6             |
| 0001-01-01 |          |             | Ésaïe 40:31           |
| 2026-01-01 | `my-app` |             | Ésaïe 40:31           |
| 2027-01-01 | `my-app` |             | PHP 4:13              |
| 2026-01-01 |          | `hope`      | ROM 8:28              |
| 2027-01-01 |          | `hope`      | Ésaïe 40:31           |
| 2027-01-01 |          | `joy`       | Pas de verset du jour |
| 2026-12-25 |          |             | Luc 2:10-11           |
| 2027-12-25 |          |             | Luc 2:7               |
| 2028-12-25 |          |             | Luc 2:10-11           |
| 2029-12-25 |          |             | Matthieu 1:23         |
| 2026-12-25 | `my-app` |             | Luc 2:10-11           |
| 2026-04-05 |          |             | Matthieu 28:6         |
| 2027-03-28 |          |             | Matthieu 28:6         |
| 2028-04-16 |          |             | PSA 23:1              |
| 2026-12-24 |          |             | PSA 23:1              |
| 2026-07-01 |          | `christmas` | Luc 2:7               |
| 2026-04-06 |          |             | 1CO 15:20             |
| 2026-04-07 |          |             | Actes 2:24            |
| 2026-04-08 |          |             | 1 TH 4:14             |
| 2026-04-09 |          |             | PSA 23:1              |
| 2027-03-29 |          |             | ROM 6:9               |
| 2027-03-30 |          |             | 1CO 15:20             |
| 2027-03-31 |          |             | Actes 2:24            |

Le 16 avril 2028 est le dimanche de Pâques, mais il ne figure pas dans `dates` de cette liste, c'est donc un jour ordinaire.

### Sélections issues de l'ensemble de données

Les versets du jour de l'année en cours restent inchangés pour l'ensemble des données ; ils ne seront donc jamais modifiés pour l'année 2026.

| Date       | Vacances                    | Verset du jour     |
| ---------- | --------------------------- | ------------------ |
| 2026-01-01 |                             | PSA 32:1           |
| 2026-04-03 | Vendredi Saint              | Luc 23:33          |
| 2026-04-05 | Dimanche de la Résurrection | Matthieu 28:9      |
| 2026-04-06 | Après le dimanche de Pâques | Apocalypse 1:17-18 |
| 2026-06-15 |                             | EST 4:14           |
| 2026-10-28 |                             | PSA 136:1          |
| 2026-10-31 | La veille de la Toussaint   | Éphésiens 5:8      |
| 2026-11-29 | Premier dimanche de l'Avent | MAL 3:1            |
| 2026-12-24 | la veille de Noël           | Matthieu 1:21      |
| 2026-12-25 | Noël                        | Ésaïe 9:6          |
| 2026-12-31 |                             | Ézéchiel 36:26     |

## Mises en œuvre

Ces implémentations respectent la convention, et leurs tests vérifient les valeurs de cette page :

-   JavaScript/TypeScript : `pickVerseOfTheDay()` et `FreeUseBibleApi.getVerseOfTheDay()` dans le package [`free-use-bible-api`](../../sdks/javascript.md) ( [source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin : `pickVerseOfTheDay()` et `FreeUseBibleApi.getVerseOfTheDay()` dans le [SDK Kotlin](../../sdks/kotlin.md) ( [source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift : `pickVerseOfTheDay(_:date:seed:category:holidays:)` et `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` dans le [SDK Swift](../../sdks/swift.md) ( [source](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   L'outil `getVerseOfTheDay` du [serveur MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [source](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` sur `@helloao/tools` ( [source](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), qui utilise la liste intégrée au package.
