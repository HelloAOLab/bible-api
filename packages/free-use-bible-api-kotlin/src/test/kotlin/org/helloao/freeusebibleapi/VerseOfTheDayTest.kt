package org.helloao.freeusebibleapi

import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

class VerseOfTheDayTest {
    private val api = FreeUseBibleApi(httpClient = FixtureHttpClient())

    // 400 different verses: more than there are days in a year.
    private val verses = List(400) { i ->
        ApiDatasetCategorizedVerse(
            book = "PSA",
            chapter = i / 10 + 1,
            verse = i % 10 + 1,
            categories = listOf(if (i % 2 == 0) "hope" else "peace"),
        )
    }

    private fun ApiDatasetCategorizedVerse?.ref() = this?.let { "${it.book} ${it.chapter}:${it.verse}" }

    @Test
    fun `hashes keys the same way as the JavaScript client`() {
        assertEquals(2872998923L, hashVerseOfTheDayKey(""))
        assertEquals(444641715L, hashVerseOfTheDayKey("a"))
        assertEquals(3773609941L, hashVerseOfTheDayKey("|JHN 3:16"))
        assertEquals(3194902081L, hashVerseOfTheDayKey("my-app|PSA 23:1"))
        assertEquals(3708505705L, hashVerseOfTheDayKey("é|GEN 1:1"))
    }

    @Test
    fun `counts the days from 1970-01-01`() {
        assertEquals(0L, getDayNumber("1970-01-01"))
        assertEquals(-1L, getDayNumber("1969-12-31"))
        assertEquals(20753L, getDayNumber("2026-10-27"))
        assertEquals(349172L, getDayNumber("2926-01-01"))
        assertEquals(-719162L, getDayNumber("0001-01-01"))
        assertFailsWith<IllegalArgumentException> { getDayNumber("2926-1-1") }
        assertFailsWith<IllegalArgumentException> { getDayNumber("2926-02-29") }
        assertEquals(getDayNumber("2028-03-01") - 1, getDayNumber("2028-02-29"))
    }

    @Test
    fun `picks the same verses as the JavaScript client`() = runTest {
        // Computed with the JavaScript client's pickVerseOfTheDay() for the verses in the verses.json fixture.
        assertEquals("JHN 3:16", api.getVerseOfTheDay("2926-01-01").ref())
        assertEquals("PRO 3:5", api.getVerseOfTheDay("2926-01-02").ref())
        assertEquals("PRO 3:3", api.getVerseOfTheDay("1969-12-31").ref())
        assertEquals("JHN 3:17", api.getVerseOfTheDay("2026-10-27").ref())
        assertEquals("PRO 3:3", api.getVerseOfTheDay("2926-01-01", seed = "my-app").ref())
    }

    @Test
    fun `picks the same verses as the JavaScript client when verses are added and removed`() = runTest {
        // Computed with the JavaScript client's pickVerseOfTheDay() for the verses in the verses.json fixture,
        // with JHN 3:16 added in 2927 and PRO 3:3 removed in 2927.
        // Only the verses of the chapter 3 fixtures (not the Christmas verses).
        val changed = api.getDatasetVerses("verse-of-the-day").verses.filter { it.chapter == 3 }.map {
            when ("${it.book} ${it.chapter}:${it.verse}") {
                "JHN 3:16" -> it.copy(addedIn = 2927)
                "PRO 3:3" -> it.copy(removedIn = 2927)
                else -> it
            }
        }
        val expected = mapOf(
            "2926-01-01" to "PRO 3:5",
            "2926-01-02" to "PRO 3:3",
            "2926-01-03" to "PRO 3:27",
            "2926-01-04" to "JHN 3:17",
            "2927-01-01" to "JHN 3:17",
            "2927-01-02" to "PRO 3:27",
            "2927-01-03" to "PRO 3:5",
            "2927-01-04" to "JHN 3:16",
        )
        for ((date, ref) in expected) {
            assertEquals(ref, pickVerseOfTheDay(changed, date).ref(), date)
        }
    }

    @Test
    fun `only picks verses that are in use in the year`() {
        val verse = ApiDatasetCategorizedVerse(book = "JHN", chapter = 3, verse = 16, categories = emptyList(), addedIn = 2027, removedIn = 2030)
        assertEquals(listOf(false, true, true, true, false), (2026L..2030L).map { isVerseOfTheDayInUse(verse, it) })
    }

    // The test values from the Verse of the Day Convention page (docs/reference/datasets/verse-of-the-day-convention.md).
    @Test
    fun `matches the test values on the convention page`() {
        assertEquals(1930190452L, hashVerseOfTheDayKey("|2026|JHN 3:16"))
        assertEquals(2020168843L, hashVerseOfTheDayKey("my-app|2026|PSA 23:1"))
        assertEquals(3677064616L, hashVerseOfTheDayKey("é|1|GEN 1:1"))

        assertEquals(2026L to 0, getYearAndDayOfYear("2026-01-01"))
        assertEquals(2028L to 59, getYearAndDayOfYear("2028-02-29"))
        assertEquals(2000L to 365, getYearAndDayOfYear("2000-12-31"))
        assertEquals(1900L to 364, getYearAndDayOfYear("1900-12-31"))
        assertEquals(1L to 59, getYearAndDayOfYear("0001-03-01"))

        fun v(book: String, chapter: Int, verse: Int, vararg categories: String, endVerse: Int? = null, addedIn: Int? = null, removedIn: Int? = null) =
            ApiDatasetCategorizedVerse(book, chapter, verse, endVerse, categories.toList(), addedIn, removedIn)
        val list = listOf(
            v("GEN", 1, 1, "praise"),
            v("PSA", 23, 1, "comfort", "provision"),
            v("PRO", 3, 5, "faith", "guidance", endVerse = 6),
            v("ISA", 40, 31, "strength", "hope"),
            v("JHN", 3, 16, "love", "salvation"),
            v("ROM", 8, 28, "hope", removedIn = 2027),
            v("PHP", 4, 13, "strength"),
            v("1JN", 4, 19, "love", addedIn = 2027),
            v("LUK", 2, 7, "christmas"),
            v("LUK", 2, 10, "christmas", endVerse = 11),
            v("MAT", 1, 23, "christmas", addedIn = 2027),
            v("MAT", 28, 6, "resurrection-sunday"),
        )
        val holidays = listOf(
            ApiDatasetVersesHoliday(id = "christmas-eve", name = "Christmas Eve", month = 12, day = 24),
            ApiDatasetVersesHoliday(id = "christmas", name = "Christmas", month = 12, day = 25),
            ApiDatasetVersesHoliday(id = "resurrection-sunday", name = "Resurrection Sunday", dates = listOf("2026-04-05", "2027-03-28")),
        )
        val expected = listOf(
            Triple("2026-01-01", "", null) to "PSA 23:1",
            Triple("2026-01-02", "", null) to "ROM 8:28",
            Triple("2026-03-15", "", null) to "JHN 3:16",
            Triple("2026-12-31", "", null) to "PSA 23:1",
            Triple("2027-01-01", "", null) to "JHN 3:16",
            Triple("2027-06-30", "", null) to "PRO 3:5",
            Triple("2028-02-29", "", null) to "PRO 3:5",
            Triple("2028-12-31", "", null) to "PSA 23:1",
            Triple("1969-12-31", "", null) to "PRO 3:5",
            Triple("0001-01-01", "", null) to "ISA 40:31",
            Triple("2026-01-01", "my-app", null) to "ISA 40:31",
            Triple("2027-01-01", "my-app", null) to "PHP 4:13",
            Triple("2026-01-01", "", "hope") to "ROM 8:28",
            Triple("2027-01-01", "", "hope") to "ISA 40:31",
            Triple("2027-01-01", "", "joy") to null,
            Triple("2026-12-25", "", null) to "LUK 2:10",
            Triple("2027-12-25", "", null) to "LUK 2:7",
            Triple("2028-12-25", "", null) to "LUK 2:10",
            Triple("2029-12-25", "", null) to "MAT 1:23",
            Triple("2026-12-25", "my-app", null) to "LUK 2:10",
            Triple("2026-04-05", "", null) to "MAT 28:6",
            Triple("2027-03-28", "", null) to "MAT 28:6",
            Triple("2028-04-16", "", null) to "PSA 23:1",
            Triple("2026-12-24", "", null) to "PSA 23:1",
            Triple("2026-07-01", "", "christmas") to "LUK 2:7",
        )
        for ((input, ref) in expected) {
            val (date, seed, category) = input
            assertEquals(ref, pickVerseOfTheDay(list, date, seed, category, holidays).ref(), input.toString())
        }
    }

    @Test
    fun `picks holiday verses on holidays like the JavaScript client`() = runTest {
        // Computed with the JavaScript client's pickVerseOfTheDay() for the verses and holidays in the verses.json fixture,
        // which has the Christmas verses but no verses for Christmas Eve or Resurrection Sunday.
        assertEquals("ISA 9:6", api.getVerseOfTheDay("2026-12-25").ref())
        assertEquals("LUK 2:20", api.getVerseOfTheDay("2027-12-25").ref())
        assertEquals("LUK 2:10", api.getVerseOfTheDay("2028-12-25").ref())
        assertEquals("PRO 3:3", api.getVerseOfTheDay("2026-12-24").ref())
        assertEquals("JHN 3:17", api.getVerseOfTheDay("2026-04-05").ref())
        assertEquals("PRO 3:3", api.getVerseOfTheDay("2026-12-25", category = "love").ref())
    }

    @Test
    fun `does not repeat a verse within a calendar year`() {
        for (seed in listOf("", "my-app")) {
            for (year in listOf(2924, 2925, 2100, 2400)) {
                val start = getDayNumber("$year-01-01")
                val days = (getDayNumber("${year + 1}-01-01") - start).toInt()
                val picks = (0 until days).map { i -> pickVerseOfTheDay(verses, isoDate(start + i), seed).ref() }
                assertEquals(days, picks.toSet().size, "$year")
            }
        }
    }

    @Test
    fun `uses a different order every year`() {
        val first = getDayNumber("2925-01-01")
        val second = getDayNumber("2926-01-01")
        val sameDay = (0 until 365).count { i ->
            pickVerseOfTheDay(verses, isoDate(first + i)) == pickVerseOfTheDay(verses, isoDate(second + i))
        }
        assertTrue(sameDay < 10)
    }

    @Test
    fun `gets the year and day of the year`() {
        assertEquals(2926L to 0, getYearAndDayOfYear("2926-01-01"))
        assertEquals(2028L to 365, getYearAndDayOfYear("2028-12-31"))
        assertEquals(1969L to 364, getYearAndDayOfYear("1969-12-31"))
    }

    @Test
    fun `uses a different order for a different seed and ignores the order of the list`() {
        val start = getDayNumber("2926-01-01")
        val days = (0 until 30).map { isoDate(start + it) }
        assertNotEquals(
            days.map { pickVerseOfTheDay(verses, it).ref() },
            days.map { pickVerseOfTheDay(verses, it, seed = "my-app").ref() },
        )
        assertEquals(
            days.map { pickVerseOfTheDay(verses, it).ref() },
            days.map { pickVerseOfTheDay(verses.reversed(), it).ref() },
        )
    }

    @Test
    fun `only picks verses from the given category`() {
        val start = getDayNumber("2926-01-01")
        for (i in 0 until 30) {
            assertTrue("hope" in pickVerseOfTheDay(verses, isoDate(start + i), category = "hope")!!.categories)
        }
        assertNull(pickVerseOfTheDay(verses, "2926-01-01", category = "joy"))
        assertNull(pickVerseOfTheDay(emptyList(), "2926-01-01"))
    }

    @Test
    fun `defaults to today`() {
        assertEquals(pickVerseOfTheDay(verses, todayIsoDate()), pickVerseOfTheDay(verses))
    }

    // Converts a day number back to a YYYY-MM-DD string (civil from days).
    private fun isoDate(dayNumber: Long): String {
        val z = dayNumber + 719468
        val era = Math.floorDiv(z, 146097L)
        val doe = z - era * 146097
        val yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365
        val doy = doe - (365 * yoe + yoe / 4 - yoe / 100)
        val mp = (5 * doy + 2) / 153
        val d = doy - (153 * mp + 2) / 5 + 1
        val m = if (mp < 10) mp + 3 else mp - 9
        val y = yoe + era * 400 + (if (m <= 2) 1 else 0)
        return String.format("%04d-%02d-%02d", y, m, d)
    }
}
