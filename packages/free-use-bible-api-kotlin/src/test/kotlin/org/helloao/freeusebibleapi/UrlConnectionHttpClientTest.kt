package org.helloao.freeusebibleapi

import com.sun.net.httpserver.HttpServer
import kotlinx.coroutines.test.runTest
import java.net.InetSocketAddress
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class UrlConnectionHttpClientTest {
    private lateinit var server: HttpServer
    private lateinit var endpoint: String

    @BeforeTest
    fun start() {
        server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
        server.createContext("/") { exchange ->
            val resource = UrlConnectionHttpClientTest::class.java.getResource(exchange.requestURI.path)
            val body = resource?.readBytes() ?: "Not Found".toByteArray()
            exchange.responseHeaders.add("Content-Type", "application/json; charset=utf-8")
            exchange.sendResponseHeaders(if (resource != null) 200 else 404, body.size.toLong())
            exchange.responseBody.use { it.write(body) }
        }
        server.start()
        endpoint = "http://127.0.0.1:${server.address.port}/"
    }

    @AfterTest
    fun stop() {
        server.stop(0)
    }

    @Test
    fun `makes requests over HTTP`() = runTest {
        val api = FreeUseBibleApi(endpoint = endpoint)

        val chapter = api.getDatasetBookChapter("bsb-interlinear", "GEN", 1)
        val words = (chapter as ApiDatasetBookChapter).chapter.content.first() as DatasetChapterVerseWords
        assertEquals("בְּרֵאשִׁ֖ית", words.words.first().text)
    }

    @Test
    fun `throws for error responses`() = runTest {
        val api = FreeUseBibleApi(endpoint = endpoint)

        val error = assertFailsWith<FreeUseBibleApiException> { api.getTranslationBooks("missing") }
        assertEquals(404, error.statusCode)
        assertEquals("${endpoint}api/missing/books.json", error.url)
    }
}
