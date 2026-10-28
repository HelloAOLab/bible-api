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
        val changed = api.getDatasetVerses("verse-of-the-day").verses.map {
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
