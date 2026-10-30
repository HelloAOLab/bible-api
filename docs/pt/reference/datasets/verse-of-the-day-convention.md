# Convenção do Versículo do Dia

Esta página especifica como escolher o versículo do dia a partir do [conjunto de dados `verse-of-the-day`](./README.md#verse-of-the-day) , para que você possa implementá-lo em qualquer idioma e obter o mesmo versículo que todas as outras implementações.

A API é composta por arquivos estáticos, portanto, ela não escolhe um versículo para você. A convenção é um padrão compartilhado: os aplicativos que a seguem exibem o mesmo versículo no mesmo dia. Os aplicativos têm a liberdade de escolher versículos diferentes, e a [semente](#seeds) fornece uma maneira fácil de fazer isso, mantendo as mesmas garantias.

## Garantias

-   **Determinístico.** A mesma data (e semente) sempre produz o mesmo verso, em qualquer dispositivo e em qualquer implementação.
-   **Não há repetições dentro de um mesmo ano.** Cada ano tem sua própria ordem aleatória dos versículos, e os dias do ano percorrem essa ordem. O conjunto de dados sempre contém pelo menos 366 versículos para cada dia em uso, portanto, um versículo nunca aparece duas vezes no mesmo ano civil.
-   **Feriados.** Em um feriado cristão (como o Natal ou o Domingo da Ressurreição), o versículo do dia é um dos versículos do feriado. Um feriado utiliza seus versículos um a cada ano, portanto, tem um versículo diferente a cada ano até que todos os seus versículos tenham sido usados. Um feriado que dura vários dias (como os três dias após o Domingo da Ressurreição) tem um versículo diferente em cada dia. Os versículos do feriado não são usados ​​em outros dias.
-   **Uma nova ordem a cada ano.** A ordem não se repete depois que todos os versos forem usados. Como cada ano é embaralhado separadamente, o mesmo verso pode ocasionalmente aparecer em 31 de dezembro e novamente em 1º de janeiro (aproximadamente 1 em 650 Anos Novos).
-   **Histórico estável.** O conjunto de dados apenas adiciona ou remove versículos de um ano que ainda não começou (veja [`addedIn` e `removedIn`](#step-2-keep-the-verses-that-are-in-use) ), portanto, o versículo do dia para uma data que já ocorreu nunca muda.
-   **Independente da ordem da lista.** A posição de cada versículo na ordem do ano é determinada por sua própria referência, portanto, a ordem da lista não importa.

## Entradas

| Entrada    | Descrição                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versículos | O `verses` elemento de [`/api/d/verse-of-the-day/verses.json`](./README.md#list-verses-in-a-dataset) Cada verso tem `book` , `chapter` , `verse` e `categories` , e pode ter `endVerse` , `addedIn` e `removedIn` .                                                                                                 |
| Data       | Uma data do calendário (ano, mês e dia). Para "hoje", use a data local do usuário, não a data em UTC.                                                                                                                                                                                                               |
| Semente    | Opcional. Uma sequência de caracteres que seleciona uma ordem diferente. O padrão é uma sequência vazia, que exibe o versículo padrão do dia.                                                                                                                                                                       |
| Feriados   | O array `holidays` do mesmo arquivo. Cada feriado tem o `id` da sua categoria e um `month` e um `day` (feriado na mesma data todos os anos) ou uma lista de `dates` ( `YYYY-MM-DD` , nessa ordem) para um feriado cuja data muda a cada ano. Um feriado pode listar várias datas no mesmo ano se durar vários dias. |
| Categoria  | Opcional. Selecione apenas os versículos que possuem esta categoria em seu `categories` , em qualquer dia.                                                                                                                                                                                                          |

## Algoritmo

### Passo 1: Encontre o ano e o dia do ano.

Considere o ano, o mês e o dia da semana, e o dia do ano correspondente, contando a partir do 0: 1º de janeiro é o dia 0, 31 de dezembro é o dia 364 (ou o dia 365 em um ano bissexto).

As datas seguem o calendário gregoriano proleptico: um ano é bissexto se for divisível por 4, exceto para anos divisíveis por 100 que não sejam divisíveis por 400 (2000 foi um ano bissexto, 1900 não foi).

### Passo 2: Mantenha os versículos que estão em uso.

Conservar os versículos que estão em uso durante o ano:

-   `addedIn` está ausente (ou nulo), ou `addedIn <= year` , e
-   `removedIn` significa ausente (ou nulo), ou `year < removedIn` .

### Passo 3: Escolha os versículos que deseja selecionar.

Escolha os versículos, um prefixo de tecla para a etapa 4 e uma posição para a etapa 7:

1. **Foi atribuída uma categoria.** Mantenha em uso os versículos que `categories` contenham. O prefixo é `{seed}|{year}` e a posição é o dia do ano.
2. **Nenhuma categoria foi fornecida e a data é um feriado.** A data é um feriado se um feriado em `holidays` tiver os valores `month` e `day` da data, ou listar a data em seu `dates` (escrito como `YYYY-MM-DD` , com um ano de quatro dígitos). Se mais de um feriado corresponder, use o primeiro da lista (o conjunto de dados nunca tem dois feriados na mesma data). Mantenha em uso os versos cujo valor `categories` contenha o `id` do feriado. Se houver algum, o prefixo é `{seed}|{id}` (por exemplo, `|christmas` ) e a posição é `year × k + i` , onde `k` é o número de dias em que o feriado é observado no ano (1 para um feriado com valores `month` e `day` ; caso contrário, o número de seus `dates` no ano da data) e `i` é o número desses dias que vêm antes da data. Para um feriado que é observado em um dia por ano, a posição é apenas o ano. Se não houver nenhum, continue com 3.
3. **Caso contrário,** mantenha em uso os versos cujo `categories` não contém o `id` de nenhum feriado em `holidays` O prefixo é `{seed}|{year}` e a posição é o dia do ano.

`seed` é a semente (a string vazia por padrão) e `year` é o ano da etapa 1 em decimal sem zeros à esquerda (por exemplo, `2026` , `1` ).

Se não houver mais versículos, não há versículo do dia.

Os feriados cujas datas mudam a cada ano listam apenas as datas que foram pré-calculadas (atualmente de 2026 a 2125), portanto, em outros anos, são dias comuns. Não calcule as datas você mesmo.

### Passo 4: Elabore a chave de cada versículo

Para cada verso restante, construa esta sequência:

```
{prefix}|{book} {chapter}:{verse}
```

-   `prefix` é o prefixo da etapa 3.
-   `book` é o `book` do versículo exatamente como aparece no conjunto de dados (um ID de livro USFM em maiúsculas, como `JHN` ou `1JN` ).
-   `chapter` e `verse` são números decimais sem zeros à esquerda.
-   `endVerse` não faz parte da chave. Uma passagem é identificada pelo seu primeiro versículo.

Por exemplo, a chave para João 3:16 em um dia comum de 2026 com a semente padrão é `|2026|JHN 3:16` , e a chave para Lucas 2:7 no Natal é `|christmas|LUK 2:7` .

### Etapa 5: Calcule o hash de cada chave.

Calcule o hash dos bytes UTF-8 da chave com o hash [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) de 32 bits e, em seguida, misture o resultado com o finalizador [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash#Algorithm) `fmix32` Todas as operações aritméticas são realizadas com inteiros sem sinal de 32 bits, portanto, as multiplicações são calculadas módulo 2³² e os deslocamentos à direita são lógicos (inserem zeros).

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

O resultado é a chave de classificação do verso, um número de 0 a 4.294.967.295.

### Passo 6: Ordene os versículos

Ordene os versículos pela sua chave de classificação, do menor para o menor, comparando as chaves como números sem sinal.

Se dois versículos tiverem a mesma chave de classificação (o que é muito raro), coloque primeiro aquele cuja sequência de chave da etapa 4 aparece primeiro na ordem ordinal (código de caractere). Todas as sequências de chave começam com o mesmo prefixo, portanto, elas diferem apenas na referência ASCII que as segue.

### Passo 7: Escolha o versículo

O versículo do dia é o versículo na posição `p mod n` da lista ordenada (contando a partir de 0), onde `p` é a posição da etapa 3 (o dia do ano, ou `year × k + i` em um feriado) e `n` é o número de versículos na lista ordenada. O resultado de `mod` nunca é negativo (para um ano negativo, adicione `n` até que deixe de ser negativo).

Em dias normais, o conjunto de dados completo tem pelo menos 366 versículos, então `day mod n` é simplesmente `day` O `mod` importa quando você escolhe de uma categoria ou de uma lista própria com menos versículos do que o número de dias no ano, caso em que os versículos se repetem ao longo do ano. Em um feriado, a posição percorre os versículos do feriado um ano (e, para um feriado que dura vários dias, um dia) de cada vez.

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

Para cada data comum do ano, utiliza-se a mesma lista ordenada; portanto, se você escolher versículos para várias datas, faça a ordenação uma vez por ano e reutilize-a.

## Sementes

A semente altera a chave de cada versículo, resultando em uma ordem completamente diferente, mas com as mesmas garantias (sem repetições dentro de um ano, uma nova ordem a cada ano, histórico estável). Use uma semente personalizada, como o nome do seu aplicativo, se desejar que ele tenha seu próprio versículo do dia em vez do versículo compartilhado. Deixe o campo em branco para exibir o mesmo versículo que todos os outros.

## Erros comuns

-   **Números inteiros com sinal.** Em linguagens que não possuem inteiros de 32 bits sem sinal (Java, Kotlin, JavaScript), realize as operações aritméticas com inteiros de 32 bits com sinal e utilize um deslocamento lógico à direita ( `>>>` ), convertendo o resultado para um valor sem sinal (por exemplo, `hash.toLong() and 0xFFFFFFFF` ou `hash >>> 0` em JavaScript) antes da comparação. Em JavaScript, utilize `Math.imul` para as multiplicações; `*` resulta em perda de precisão.
-   **O hash é feito com caracteres em vez de bytes.** O hash é calculado com os bytes UTF-8 da chave, não com suas unidades de código UTF-16 ou pontos de código Unicode. Isso só é relevante para sementes com caracteres não ASCII, mas essas são permitidas.
-   **Usando UTC para "hoje".** O versículo do dia muda à meia-noite local do usuário. Usar a data em UTC mostra o versículo do dia anterior ou seguinte para parte do dia na maioria dos fusos horários.
-   **Contando os dias do ano a partir de 1,** 1º de janeiro é o dia 0.
-   **Cálculo das datas dos feriados.** Use o valor `dates` listado no conjunto de dados. Diferentes igrejas e calendários calculam a Páscoa de maneiras diferentes, e o conjunto de dados lista apenas as datas que já foram pré-calculadas.
-   **Excluindo os feriados.** Sem o `holidays` , os versículos referentes aos feriados são tratados como versículos comuns, o que também altera os versículos de cada dia comum.
-   **Excluindo os versículos removidos.** Os versículos com ano `removedIn` ainda estão no conjunto de dados porque os anos anteriores são necessários. Filtre-os na etapa 2; não os exclua ao baixar a lista.

## Vetores de teste

Utilize esses valores para verificar uma implementação.

### Hashes

| Chave (como uma string JSON) | Chave de classificação | Hex          |
| ---------------------------- | ---------------------- | ------------ |
| `""`                         | 2872998923             | `0xab3e7c0b` |
| `"a"`                        | 444641715              | `0x1a80b1b3` |
| `"\|2026\|JHN 3:16"`         | 1930190452             | `0x730c5e74` |
| `"my-app\|2026\|PSA 23:1"`   | 2020168843             | `0x7869548b` |
| `"é\|1\|GEN 1:1"`            | 3677064616             | `0xdb2b8da8` |

### Dias do Ano

| Data       | Ano  | Dia do ano |
| ---------- | ---- | ---------- |
| 2026-01-01 | 2026 | 0          |
| 2026-12-31 | 2026 | 364        |
| 2028-02-29 | 2028 | 59         |
| 2028-12-31 | 2028 | 365        |
| 1900-12-31 | 1900 | 364        |
| 2000-12-31 | 2000 | 365        |
| 0001-03-01 | 1    | 59         |
| 9999-12-31 | 9999 | 364        |

### Escolhas de uma pequena lista

Essas listas utilizam dezesseis versículos, oito dos quais são para feriados:

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

E estes feriados (a véspera de Natal não tem versículos, portanto é um dia comum):

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

Para 01/01/2026 com a semente padrão, os quatro versículos de feriados e 1 João 4:19 (que ainda não está em uso) são omitidos, restando assim sete versículos. Ordenados por suas chaves de classificação, eles são:

| Posição | Chave               | Chave de classificação |
| ------- | ------------------- | ---------------------- |
| 0       | `\|2026\|PSA 23:1`  | 638659039              |
| 1       | `\|2026\|ROM 8:28`  | 1462075190             |
| 2       | `\|2026\|PRO 3:5`   | 1643805236             |
| 3       | `\|2026\|JHN 3:16`  | 1930190452             |
| 4       | `\|2026\|PHP 4:13`  | 2076082788             |
| 5       | `\|2026\|GEN 1:1`   | 2439817197             |
| 6       | `\|2026\|ISA 40:31` | 3044461366             |

1º de janeiro é o dia 0, então o versículo do dia é Salmo 23:1. 15 de março é o dia 73, e 73 mod 7 = 3, então é João 3:16.

No Natal, apenas os versículos natalinos que estão em uso permanecem. Em 2027, há três, ordenados por suas chaves de classificação:

| Posição | Chave                   | Chave de classificação |
| ------- | ----------------------- | ---------------------- |
| 0       | `\|christmas\|LUK 2:10` | 1698480150             |
| 1       | `\|christmas\|MAT 1:23` | 2563849700             |
| 2       | `\|christmas\|LUK 2:7`  | 3160581874             |

2027 mod 3 = 2, então o versículo do dia no Natal de 2027 é Lucas 2:7. Em 2026, Mateus 1:23 ainda não está em uso, então há apenas dois, e 2026 mod 2 = 0 dá Lucas 2:10-11.

O feriado após o Domingo da Ressurreição dura três dias. Seus quatro versículos, ordenados por suas respectivas chaves de classificação, são:

| Posição | Chave                                   | Chave de classificação |
| ------- | --------------------------------------- | ---------------------- |
| 0       | `\|post-resurrection-sunday\|1TH 4:14`  | 80824114               |
| 1       | `\|post-resurrection-sunday\|ROM 6:9`   | 665551464              |
| 2       | `\|post-resurrection-sunday\|1CO 15:20` | 820536316              |
| 3       | `\|post-resurrection-sunday\|ACT 2:24`  | 3132510482             |

Em 2026, a celebração ocorre em três dias, portanto `k` = 3, e as posições de 6, 7 e 8 de abril são 2026 × 3 + 0 = 6078, 6079 e 6080. 6078 mod 4 = 2, 6079 mod 4 = 3 e 6080 mod 4 = 0 resultam em 1 Coríntios 15:20, Atos 2:24 e 1 Tessalonicenses 4:14. Em 2027, as posições continuam a partir de 6081, então o próximo versículo é Romanos 6:9.

| Data       | Semente  | Categoria   | Versículo do dia                |
| ---------- | -------- | ----------- | ------------------------------- |
| 2026-01-01 |          |             | PSA 23:1                        |
| 2026-01-02 |          |             | ROM 8:28                        |
| 2026-03-15 |          |             | João 3:16                       |
| 2026-12-31 |          |             | PSA 23:1                        |
| 2027-01-01 |          |             | João 3:16                       |
| 2027-06-30 |          |             | PRO 3:5-6                       |
| 2028-02-29 |          |             | PRO 3:5-6                       |
| 2028-12-31 |          |             | PSA 23:1                        |
| 1969-12-31 |          |             | PRO 3:5-6                       |
| 0001-01-01 |          |             | ISA 40:31                       |
| 2026-01-01 | `my-app` |             | ISA 40:31                       |
| 2027-01-01 | `my-app` |             | PHP 4:13                        |
| 2026-01-01 |          | `hope`      | ROM 8:28                        |
| 2027-01-01 |          | `hope`      | ISA 40:31                       |
| 2027-01-01 |          | `joy`       | Versículo do dia não encontrado |
| 2026-12-25 |          |             | Lucas 2:10-11                   |
| 2027-12-25 |          |             | LUC 2:7                         |
| 2028-12-25 |          |             | Lucas 2:10-11                   |
| 2029-12-25 |          |             | MAT 1:23                        |
| 2026-12-25 | `my-app` |             | Lucas 2:10-11                   |
| 2026-04-05 |          |             | MAT 28:6                        |
| 2027-03-28 |          |             | MAT 28:6                        |
| 2028-04-16 |          |             | PSA 23:1                        |
| 2026-12-24 |          |             | PSA 23:1                        |
| 2026-07-01 |          | `christmas` | LUC 2:7                         |
| 2026-04-06 |          |             | 1CO 15:20                       |
| 2026-04-07 |          |             | ATOS 2:24                       |
| 2026-04-08 |          |             | 1º 4:14                         |
| 2026-04-09 |          |             | PSA 23:1                        |
| 2027-03-29 |          |             | ROM 6:9                         |
| 2027-03-30 |          |             | 1CO 15:20                       |
| 2027-03-31 |          |             | ATOS 2:24                       |

16 de abril de 2028 é o Domingo da Ressurreição, mas não está no `dates` desta lista, portanto é um dia comum.

### Seleções do conjunto de dados

O conjunto de dados nunca altera os versículos de um ano que já começou, portanto, esses 2026 versículos do dia permanecem os mesmos:

| Data       | Feriado                        | Versículo do dia   |
| ---------- | ------------------------------ | ------------------ |
| 2026-01-01 |                                | PSA 32:1           |
| 2026-04-03 | Sexta-feira Santa              | LUC 23:33          |
| 2026-04-05 | Domingo da Ressurreição        | MAT 28:9           |
| 2026-04-06 | Após o Domingo da Ressurreição | Apocalipse 1:17-18 |
| 2026-06-15 |                                | EST 4:14           |
| 2026-10-28 |                                | PSA 136:1          |
| 2026-10-31 | Véspera de Todos os Santos     | Efésios 5:8        |
| 2026-11-29 | Primeiro domingo do Advento    | MAL 3:1            |
| 2026-12-24 | Noite de Natal                 | MAT 1:21           |
| 2026-12-25 | Natal                          | ISA 9:6            |
| 2026-12-31 |                                | EzK 36:26          |

## Implementações

Essas implementações seguem a convenção, e seus testes verificam os valores desta página:

-   JavaScript/TypeScript: `pickVerseOfTheDay()` e `FreeUseBibleApi.getVerseOfTheDay()` no pacote [`free-use-bible-api`](../../sdks/javascript.md) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api/verseOfTheDay.ts) ).
-   Kotlin: `pickVerseOfTheDay()` e `FreeUseBibleApi.getVerseOfTheDay()` no [SDK do Kotlin](../../sdks/kotlin.md) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-kotlin/src/main/kotlin/org/helloao/freeusebibleapi/VerseOfTheDay.kt) ).
-   Swift: `pickVerseOfTheDay(_:date:seed:category:holidays:)` e `FreeUseBibleAPI.getVerseOfTheDay(date:seed:category:dataset:endpoint:)` no [SDK Swift](../../sdks/swift.md) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI/VerseOfTheDay.swift) ).
-   A `getVerseOfTheDay` ferramenta do [servidor MCP](https://github.com/HelloAOLab/bible-api/tree/main/packages/seed-bible-mcp) ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/seed-bible-mcp/src/verse-of-the-day.ts) ).
-   `getVerseOfTheDay()` em `@helloao/tools` ( [fonte](https://github.com/HelloAOLab/bible-api/blob/main/packages/helloao-tools/generation/verse-of-the-day.ts) ), que usa a lista que está integrada ao pacote.
