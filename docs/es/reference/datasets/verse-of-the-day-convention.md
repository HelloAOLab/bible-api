# Convención del Versículo del Día

Esta página especifica cómo elegir el versículo del día del [conjunto de datos `verse-of-the-day`](./README.md#verse-of-the-day) , para que puedas implementarlo en cualquier idioma y obtener el mismo versículo que cualquier otra implementación.

La API se compone de archivos estáticos, por lo que no selecciona un versículo por ti. La convención es una configuración predeterminada compartida: las aplicaciones que la siguen muestran el mismo versículo el mismo día. Las aplicaciones pueden elegir versículos diferentes, y la [semilla](#seeds) les facilita hacerlo manteniendo las mismas garantías.

## Garantías

-   **Determinista.** La misma fecha (y semilla) siempre produce el mismo verso, en cualquier dispositivo y en cualquier implementación.
-   **No hay versículos repetidos dentro del mismo año.** Cada año tiene su propio orden aleatorio de los versículos, y los días del año lo siguen. El conjunto de datos siempre contiene al menos 366 versículos por cada día en uso, por lo que un versículo nunca aparece dos veces en el mismo año calendario.
-   **Días festivos.** En un día festivo cristiano (como Navidad o Domingo de Resurrección), el versículo del día es uno de los versículos propios de la festividad. Cada año se utilizan los versículos de un día festivo a la vez, por lo que cada año se usa uno diferente hasta completar el conjunto. En un día festivo que dura varios días (como los tres días posteriores al Domingo de Resurrección), cada día se utiliza un versículo diferente. Los versículos festivos no se usan en otros días.
-   **Un orden diferente cada año.** El orden no se repite una vez que se han utilizado todos los versos. Dado que cada año se baraja por separado, el mismo verso puede aparecer ocasionalmente el 31 de diciembre y de nuevo el 1 de enero (aproximadamente 1 de cada 650 años nuevos).
-   **Historial estable.** El conjunto de datos solo agrega o elimina versículos de un año que aún no ha comenzado (ver [`addedIn` y `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), por lo que el versículo del día para una fecha que ya ha ocurrido nunca cambia.
-   **Es independiente del orden de la lista.** La posición de cada versículo en el orden anual proviene de su propia referencia, por lo que el orden de la lista no importa.

## Entradas

| Aporte     | Descripción                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versos     | La matriz `verses` de [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Cada verso tiene un `book` , `chapter` , `verse` y `categories` , y puede tener `endVerse` , `addedIn` y `removedIn` .                                                                                                                             |
| Fecha      | Una fecha del calendario (año, mes y día). Para "hoy", utilice la fecha local del usuario, no la fecha en UTC.                                                                                                                                                                                                                                         |
| Semilla    | Opcional. Una cadena que selecciona un orden diferente. Por defecto, se utiliza una cadena vacía, que proporciona el versículo estándar del día.                                                                                                                                                                                                       |
| Vacaciones | El array `holidays` del mismo archivo. Cada día festivo tiene el `id` de su categoría, y un `month` y `day` (un día festivo que se celebra en la misma fecha cada año) o una lista de `dates` ( `YYYY-MM-DD` , en orden) para un día festivo cuya fecha cambia cada año. Un día festivo puede tener varias fechas en el mismo año si dura varios días. |
| Categoría  | Opcional. Elija solo los versículos que tengan esta categoría en su `categories` , en cualquier día.                                                                                                                                                                                                                                                   |

## Algoritmo

### Paso 1: Encuentra el año y el día del año.

Toma el año, el mes y el día de la fecha, y el día del año correspondiente, contando desde 0: el 1 de enero es el día 0, el 31 de diciembre es el día 364 (o el día 365 en un año bisiesto).

Las fechas utilizan el calendario gregoriano proleptico: un año es bisiesto si es divisible por 4, excepto los años divisibles por 100 que no son divisibles por 400 (2000 es bisiesto, 1900 no lo es).

### Paso 2: Conserva los versículos que se utilizan

Conserva los versículos que se utilizan durante el año:

-   `addedIn` significa que falta (o es nulo), o `addedIn <= year` y
-   `removedIn` significa que falta (o es nulo), o `year < removedIn` .

### Paso 3: Elige los versículos que deseas seleccionar.

Elige los versículos que deseas seleccionar, un prefijo clave para el paso 4 y una posición para el paso 7:

1. **Se asignó una categoría.** Conservar los versículos en uso cuyo `categories` la contenga. El prefijo es `{seed}|{year}` y la posición es el día del año.
2. **No se dio ninguna categoría, y la fecha es un día festivo.** La fecha es un día festivo si un día festivo en `holidays` tiene el `month` y `day` de la fecha, o enumera la fecha en su `dates` (escrito como `YYYY-MM-DD` , con un año de cuatro dígitos). Si más de un día festivo coincide, use el primero en la lista (el conjunto de datos nunca tiene dos días festivos en la misma fecha). Mantenga los versos en uso cuyo `categories` contiene el `id` del día festivo. Si hay alguno, el prefijo es `{seed}|{id}` (por ejemplo `|christmas` ) y la posición es `year × k + i` , donde `k` es el número de días en que se observa el día festivo en el año (1 para un día festivo con un `month` y `day` ; de lo contrario, el número de su `dates` en el año de la fecha) y `i` es el número de esos días que vienen antes de la fecha. Para un día festivo que se observa en un día al año, la posición es solo el año. Si no hay ninguno, continúe con 3.
3. **De lo contrario,** mantén en uso los versículos cuyo `categories` no contiene el `id` de ninguna festividad en `holidays` El prefijo es `{seed}|{year}` y la posición es el día del año.

`seed` es la semilla (la cadena vacía por defecto) y `year` es el año desde el paso 1 en decimal sin ceros iniciales (por ejemplo `2026` , `1` ).

Si no quedan versículos, no hay versículo del día.

Los días festivos cuya fecha cambia cada año solo muestran las fechas precalculadas (actualmente de 2026 a 2125), por lo que en otros años son días normales. No calcule las fechas usted mismo.

### Paso 4: Construye la clave de cada verso.

Para cada verso restante, construye esta cadena:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` es el prefijo del paso 3.
-   `book` es el verso `book` exactamente como aparece en el conjunto de datos (un ID de libro USFM en mayúsculas como `JHN` o `1JN` ).
-   `chapter` y `verse` están en decimal sin ceros iniciales.
-   `endVerse` no forma parte de la clave. Un pasaje se identifica por su primer verso.

Por ejemplo, la clave para Juan 3:16 en un día normal de 2026 con la semilla predeterminada es `|2026|JHN 3:16` , y la clave para Lucas 2:7 en Navidad es `|christmas|LUK 2:7` .

### Paso 5: Calcular el hash de cada clave.

Aplica la función hash [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) de 32 bits a los bytes UTF-8 de la clave y, a continuación, combina el resultado con el finalizador [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Todas las operaciones aritméticas se realizan con enteros sin signo de 32 bits, por lo que las multiplicaciones se desbordan (se toman módulo 2³²) y los desplazamientos a la derecha son lógicos (se desplazan en ceros).

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

El resultado es la clave de clasificación del verso, un número del 0 al 4.294.967.295.

### Paso 6: Clasifica los versículos

Ordena los versículos según su clave de ordenación, del más pequeño al más grande, comparando las claves como números sin signo.

Si dos versos tienen la misma clave de ordenación (lo cual es muy raro), coloque primero aquel cuya cadena de clave del paso 4 aparezca primero en orden ordinal (código de carácter). Todas las cadenas de clave comienzan con el mismo prefijo, por lo que solo difieren en la referencia ASCII que sigue.

### Paso 7: Elige el versículo

El versículo del día es el versículo que se encuentra en la posición `p mod n` de la lista ordenada (contando desde 0), donde `p` es la posición del paso 3 (el día del año, o `year × k + i` en un día festivo) y `n` es el número de versículos en la lista ordenada. El resultado de `mod` nunca es negativo (para un año negativo, se suma `n` hasta que deje de serlo).

En días normales, el conjunto de datos completo tiene al menos 366 versículos, por lo que `day mod n` es simplemente `day` El `mod` importa cuando se elige de una categoría o una lista propia con menos versículos que días tiene el año, en cuyo caso los versículos se repiten dentro del año. En un día festivo, la posición recorre los versículos del día festivo año por año (y, para un día festivo que dura varios días, día por día).

## Pseudocódigo

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

Cada fecha ordinaria del año utiliza la misma lista ordenada, así que si eliges versículos para muchas fechas, ordénalos una vez al año y reutilízalo.

## Semillas

La semilla cambia la clave de cada versículo, lo que genera un orden completamente diferente con las mismas garantías (sin repeticiones en un año, un orden nuevo cada año, historial estable). Si quieres que tu aplicación tenga su propio versículo del día en lugar del compartido, usa una semilla propia, como el nombre de tu app. Déjala en blanco para mostrar el mismo versículo que todos los demás.

## Errores comunes

-   **Enteros con signo.** En lenguajes que no admiten enteros de 32 bits sin signo (Java, Kotlin, JavaScript), realice las operaciones aritméticas con enteros de 32 bits con signo y aplique un desplazamiento lógico a la derecha ( `>>>` ), luego convierta el resultado a un valor sin signo (por ejemplo, `hash.toLong() and 0xFFFFFFFF` o `hash >>> 0` en JavaScript) antes de comparar. En JavaScript, utilice `Math.imul` para las multiplicaciones; `*` provoca pérdida de precisión.
-   **Se calcula el hash de caracteres en lugar de bytes.** Se calcula el hash de los bytes UTF-8 de la clave, no de sus unidades de código UTF-16 ni de sus puntos de código Unicode. Esto solo es relevante para semillas con caracteres no ASCII, pero estos están permitidos.
-   **Se utiliza UTC para indicar "hoy".** El versículo del día cambia a la medianoche local del usuario. Al usar la fecha en UTC, se muestra el versículo del día anterior o siguiente durante parte del día en la mayoría de las zonas horarias.
-   **Contando los días del año desde el 1.** El 1 de enero es el día 0.
-   **Cálculo de fechas festivas.** Utilice el valor `dates` que aparece en el conjunto de datos. Las distintas iglesias y calendarios calculan la Pascua de forma diferente, y el conjunto de datos solo incluye las fechas que ya ha calculado.
-   **Sin incluir los días festivos.** Sin el `holidays` , los versículos festivos se tratan como versículos ordinarios, lo que también cambia el versículo de cada día ordinario.
-   **Se excluyen los versículos eliminados.** Los versículos con año `removedIn` permanecen en el conjunto de datos porque los años anteriores los necesitan. Fíltrelos con el paso 2; no los elimine al descargar la lista.

## Vectores de prueba

Utilice estos valores para comprobar una implementación.

### Hashes

| Clave (como una cadena JSON) | Clave de ordenación | Maleficio    |
| ---------------------------- | ------------------- | ------------ |
| `""`                         | 2872998923          | `0xab3e7c0b` |
| `"a"`                        | 444641715           | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`         | 1930190452          | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`   | 2020168843          | `0x7869548b` |
| `"é\|1\|GEN 1:1"`            | 3677064616          | `0xdb2b8da8` |

### Días del año

| Fecha      | Año  | Día del año |
| ---------- | ---- | ----------- |
| 2026-01-01 | 2026 | 0           |
| 2026-12-31 | 2026 | 364         |
| 2028-02-29 | 2028 | 59          |
| 2028-12-31 | 2028 | 365         |
| 1900-12-31 | 1900 | 364         |
| 2000-12-31 | 2000 | 365         |
| 0001-03-01 | 1    | 59          |
| 9999-12-31 | 9999 | 364         |

### Selecciones de una lista pequeña

Estos utilizan esta lista de dieciséis versículos, ocho de los cuales son para días festivos:

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

Y estas fiestas (la Nochebuena no tiene versículos, así que es un día normal):

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

Para el 1 de enero de 2026 con la semilla predeterminada, se omiten los cuatro versículos festivos y 1 Juan 4:19 (que aún no está en uso), por lo que quedan siete versículos. Ordenados por sus claves de ordenación, son:

| Posición | Llave               | Clave de ordenación |
| -------- | ------------------- | ------------------- |
| 0        | `\|2026\|PSA 23:1`  | 638659039           |
| 1        | `\|2026\|ROM 8:28`  | 1462075190          |
| 2        | `\|2026\|PRO 3:5`   | 1643805236          |
| 3        | `\|2026\|JHN 3:16`  | 1930190452          |
| 4        | `\|2026\|PHP 4:13`  | 2076082788          |
| 5        | `\|2026\|GEN 1:1`   | 2439817197          |
| 6        | `\|2026\|ISA 40:31` | 3044461366          |

El 1 de enero es el día 0, por lo que el versículo del día es Salmo 23:1. El 15 de marzo es el día 73, y 73 mod 7 = 3, por lo que es Juan 3:16.

En Navidad, solo se conservan los versículos navideños que están en uso. En 2027 hay tres, ordenados según sus claves de ordenación:

| Posición | Llave                   | Clave de ordenación |
| -------- | ----------------------- | ------------------- |
| 0        | `\|christmas\|LUK 2:10` | 1698480150          |
| 1        | `\|christmas\|MAT 1:23` | 2563849700          |
| 2        | `\|christmas\|LUK 2:7`  | 3160581874          |

2027 mod 3 = 2, por lo que el versículo del día en la Navidad de 2027 es Lucas 2:7. En 2026, Mateo 1:23 todavía no está en uso, por lo que solo hay dos, y 2026 mod 2 = 0 da Lucas 2:10-11.

La festividad posterior al Domingo de Resurrección dura tres días. Sus cuatro versículos, ordenados según sus claves de clasificación, son:

| Posición | Llave                                   | Clave de ordenación |
| -------- | --------------------------------------- | ------------------- |
| 0        | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114            |
| 1        | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464           |
| 2        | `\|post-resurrection-sunday\|1CO 15:20` | 820536316           |
| 3        | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482          |

En 2026 se observa en tres días, por lo que `k` = 3, y las posiciones del 6, 7 y 8 de abril son 2026 × 3 + 0 = 6078, 6079 y 6080. 6078 mod 4 = 2, 6079 mod 4 = 3 y 6080 mod 4 = 0 dan 1 Corintios 15:20, Hechos 2:24 y 1 Tesalonicenses 4:14. En 2027 las posiciones continúan desde 6081, por lo que el siguiente versículo es Romanos 6:9.

| Fecha      | Semilla  | Categoría   | Versículo del día        |
| ---------- | -------- | ----------- | ------------------------ |
| 2026-01-01 |          |             | PSA 23:1                 |
| 2026-01-02 |          |             | Romanos 8:28             |
| 2026-03-15 |          |             | Juan 3:16                |
| 2026-12-31 |          |             | PSA 23:1                 |
| 2027-01-01 |          |             | Juan 3:16                |
| 2027-06-30 |          |             | PROFESORES 3:5-6         |
| 2028-02-29 |          |             | PROFESORES 3:5-6         |
| 2028-12-31 |          |             | PSA 23:1                 |
| 1969-12-31 |          |             | PROFESORES 3:5-6         |
| 0001-01-01 |          |             | ISA 40:31                |
| 2026-01-01 | `my-app` |             | ISA 40:31                |
| 2027-01-01 | `my-app` |             | PHP 4:13                 |
| 2026-01-01 |          | `hope`      | Romanos 8:28             |
| 2027-01-01 |          | `hope`      | ISA 40:31                |
| 2027-01-01 |          | `joy`       | No hay versículo del día |
| 2026-12-25 |          |             | Lucas 2:10-11            |
| 2027-12-25 |          |             | Lucas 2:7                |
| 2028-12-25 |          |             | Lucas 2:10-11            |
| 2029-12-25 |          |             | Mateo 1:23               |
| 2026-12-25 | `my-app` |             | Lucas 2:10-11            |
| 2026-04-05 |          |             | Mateo 28:6               |
| 2027-03-28 |          |             | Mateo 28:6               |
| 2028-04-16 |          |             | PSA 23:1                 |
| 2026-12-24 |          |             | PSA 23:1                 |
| 2026-07-01 |          | `christmas` | Lucas 2:7                |
| 2026-04-06 |          |             | 1 Corintios 15:20        |
| 2026-04-07 |          |             | Hechos 2:24              |
| 2026-04-08 |          |             | 1 Tesalonicenses 4:14    |
| 2026-04-09 |          |             | PSA 23:1                 |
| 2027-03-29 |          |             | Romanos 6:9              |
| 2027-03-30 |          |             | 1 Corintios 15:20        |
| 2027-03-31 |          |             | Hechos 2:24              |

El 16 de abril de 2028 es Domingo de Resurrección, pero no está en `dates` de esta lista, por lo que es un día normal.

### Selecciones del conjunto de datos

El conjunto de datos nunca cambia los versículos de un año que ha comenzado, por lo que estos versículos del día de 2026 permanecen iguales:

| Fecha      | Día festivo                         | Versículo del día   |
| ---------- | ----------------------------------- | ------------------- |
| 2026-01-01 |                                     | PSA 32:1            |
| 2026-04-03 | Viernes Santo                       | LUCAS 23:33         |
| 2026-04-05 | Domingo de Resurrección             | Mateo 28:9          |
| 2026-04-06 | Después del Domingo de Resurrección | Apocalipsis 1:17-18 |
| 2026-06-15 |                                     | EST 4:14            |
| 2026-10-28 |                                     | PSA 136:1           |
| 2026-10-31 | Noche de Todos los Santos           | Efesios 5:8         |
| 2026-11-29 | Primer domingo de Adviento          | MAL 3:1             |
| 2026-12-24 | Nochebuena                          | Mateo 1:21          |
| 2026-12-25 | Navidad                             | ISA 9:6             |
| 2026-12-31 |                                     | EZK 36:26           |

## Implementaciones

Estas implementaciones siguen la convención y sus pruebas verifican los valores de esta página:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` y `FreeUseBibleApi.getVerseOfTheDay()` en el paquete [`free-use-bible-api`](../../sdks/javascript.md) ( [fuente](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` y `FreeUseBibleApi.getVerseOfTheDay()` en el [SDK de Kotlin](../../sdks/kotlin.md) ( [fuente](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` y `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` en el [SDK de Swift](../../sdks/swift.md) ( [fuente](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   La herramienta `getVerseOfTheDay` del [servidor MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [fuente](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` de `@helloao/tools` ( [fuente](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), que utiliza la lista que está integrada en el paquete.
