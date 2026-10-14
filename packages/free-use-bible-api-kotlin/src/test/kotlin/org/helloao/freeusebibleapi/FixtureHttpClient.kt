package org.helloao.freeusebibleapi

import java.net.URI
import java.util.Collections

/**
 * Reads a file from the test resources.
 */
fun readResource(path: String): String =
    FixtureHttpClient::class.java.getResource("/$path")?.readText()
        ?: throw IllegalArgumentException("Missing test resource: $path")

/**
 * A [FreeUseBibleApiHttpClient] that serves the API files from the test resources, regardless of the host that is requested.
 */
class FixtureHttpClient : FreeUseBibleApiHttpClient {
    /**
     * The URLs that have been requested, in order.
     */
    val requests: MutableList<String> = Collections.synchronizedList(mutableListOf())

    /**
     * The number of upcoming requests that should fail with a 500 error.
     */
    @Volatile
    var failures: Int = 0

    override suspend fun get(url: String): FreeUseBibleApiHttpResponse {
        requests.add(url)
        if (failures > 0) {
            failures -= 1
            return FreeUseBibleApiHttpResponse(500, "Internal Server Error", "")
        }

        val path = URI(url).path.removePrefix("/")
        val resource = FixtureHttpClient::class.java.getResource("/$path")
            ?: return FreeUseBibleApiHttpResponse(404, "Not Found", "")
        return FreeUseBibleApiHttpResponse(200, "OK", resource.readText())
    }
}
