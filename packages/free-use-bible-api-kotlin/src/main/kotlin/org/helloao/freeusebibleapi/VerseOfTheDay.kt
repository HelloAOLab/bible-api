package org.helloao.freeusebibleapi

import java.util.Calendar

/**
 * Picks the verse of the day for the given date from the given list of verses.
 *
 * The pick follows a fixed convention, so every implementation (including the JavaScript/TypeScript client's
 * `pickVerseOfTheDay()`) picks the same verse on the same day:
 *
 * 1. Each verse gets a sort key: the 32-bit FNV-1a hash of the UTF-8 bytes of `"{seed}|{book} {chapter}:{verse}"`
 *    (e.g. `"|JHN 3:16"`), passed through the MurmurHash3 `fmix32` finalizer.
 * 2. The verses are sorted by their key (as an unsigned number), then by the key's string if two keys are equal.
 * 3. The verse at position `day mod n` is picked, where `day` is the number of days from 1970-01-01 to the date
 *    and `n` is the number of verses.
 *
 * Every verse appears once in every `n` consecutive days, so with 366 or more verses a verse never repeats within a year.
 *
 * @param verses The verses to pick from. For example, the `verses` from `/api/d/verse-of-the-day/verses.json`.
 * @param date The date to pick the verse for, as a `YYYY-MM-DD` string. Defaults to today (in the default time zone).
 * @param seed The seed that the order of the verses is derived from. Different seeds give different (but equally valid) orders.
 * @param category Only pick from the verses in this category. Categories have fewer verses than there are days in a year, so their verses repeat sooner.
 * @return The verse of the day, or null if there are no verses to pick from.
 */
public fun pickVerseOfTheDay(
    verses: List<ApiDatasetCategorizedVerse>,
    date: String = todayIsoDate(),
    seed: String = "",
    category: String? = null,
): ApiDatasetCategorizedVerse? {
    val candidates = if (category != null) verses.filter { category in it.categories } else verses
    if (candidates.isEmpty()) {
        return null
    }
    val sorted = candidates
        .map { verse ->
            val key = "$seed|${verse.book} ${verse.chapter}:${verse.verse}"
            Triple(verse, key, hashVerseOfTheDayKey(key))
        }
        .sortedWith(compareBy<Triple<ApiDatasetCategorizedVerse, String, Long>> { it.third }.thenBy { it.second })
    val index = Math.floorMod(getDayNumber(date), sorted.size.toLong())
    return sorted[index.toInt()].first
}

/**
 * Gets the number of days from 1970-01-01 to the given date.
 * @param date The date, as a `YYYY-MM-DD` string.
 */
public fun getDayNumber(date: String): Long {
    val match = Regex("^(-?\\d{4,})-(\\d{2})-(\\d{2})$").matchEntire(date)
        ?: throw IllegalArgumentException("Invalid date \"$date\". Use the YYYY-MM-DD format.")
    val year = match.groupValues[1].toLong()
    val month = match.groupValues[2].toInt()
    val day = match.groupValues[3].toInt()
    require(month in 1..12 && day in 1..daysInMonth(year, month)) { "Invalid date \"$date\"." }

    // Days from civil (proleptic Gregorian calendar), from https://howardhinnant.github.io/date_algorithms.html
    val y = if (month <= 2) year - 1 else year
    val era = Math.floorDiv(y, 400L)
    val yearOfEra = y - era * 400
    val dayOfYear = (153 * ((month + 9) % 12) + 2) / 5 + day - 1
    val dayOfEra = yearOfEra * 365 + yearOfEra / 4 - yearOfEra / 100 + dayOfYear
    return era * 146097 + dayOfEra - 719468
}

/**
 * Gets the sort key of the given string: its 32-bit FNV-1a hash (of the UTF-8 bytes),
 * passed through the MurmurHash3 fmix32 finalizer. Returns an unsigned 32-bit number.
 */
public fun hashVerseOfTheDayKey(key: String): Long {
    var hash = 0x811c9dc5.toInt()
    for (byte in key.toByteArray(Charsets.UTF_8)) {
        hash = hash xor (byte.toInt() and 0xff)
        hash *= 0x01000193
    }
    hash = hash xor (hash ushr 16)
    hash *= 0x85ebca6b.toInt()
    hash = hash xor (hash ushr 13)
    hash *= 0xc2b2ae35.toInt()
    hash = hash xor (hash ushr 16)
    return hash.toLong() and 0xffffffffL
}

/**
 * Gets today's date in the default time zone, as a `YYYY-MM-DD` string.
 */
public fun todayIsoDate(): String {
    val now = Calendar.getInstance()
    return String.format(
        "%04d-%02d-%02d",
        now.get(Calendar.YEAR),
        now.get(Calendar.MONTH) + 1,
        now.get(Calendar.DAY_OF_MONTH),
    )
}

private fun daysInMonth(year: Long, month: Int): Int = when (month) {
    2 -> if (year % 4 == 0L && (year % 100 != 0L || year % 400 == 0L)) 29 else 28
    4, 6, 9, 11 -> 30
    else -> 31
}
