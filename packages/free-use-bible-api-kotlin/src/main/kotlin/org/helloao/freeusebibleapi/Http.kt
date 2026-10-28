package org.helloao.freeusebibleapi

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runInterruptible
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URI

/**
 * The response to an HTTP request made by a [FreeUseBibleApiHttpClient].
 */
public class FreeUseBibleApiHttpResponse(
    /**
     * The HTTP status code of the response.
     */
    public val statusCode: Int,

    /**
     * The HTTP status message of the response. (e.g. "Not Found")
     */
    public val statusMessage: String,

    /**
     * The body of the response.
     */
    public val body: String,
)

/**
 * Defines an interface for an object that can make HTTP GET requests for the [FreeUseBibleApi].
 *
 * The default implementation ([UrlConnectionHttpClient]) uses [HttpURLConnection] so that it works on both the JVM and Android without extra dependencies.
 * Implement this interface to use a different HTTP library (like OkHttp or Ktor).
 */
public fun interface FreeUseBibleApiHttpClient {
    /**
     * Makes a GET request to the given URL.
     * @param url The URL to request.
     */
    public suspend fun get(url: String): FreeUseBibleApiHttpResponse
}

/**
 * A [FreeUseBibleApiHttpClient] that uses [HttpURLConnection] to make requests.
 */
public class UrlConnectionHttpClient(
    /**
     * The connect timeout in milliseconds. 0 means no timeout.
     */
    private val connectTimeoutMillis: Int = 30_000,

    /**
     * The read timeout in milliseconds. 0 means no timeout.
     */
    private val readTimeoutMillis: Int = 60_000,
) : FreeUseBibleApiHttpClient {
    override suspend fun get(url: String): FreeUseBibleApiHttpResponse = runInterruptible(Dispatchers.IO) {
        val connection = URI(url).toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "GET"
            connection.connectTimeout = connectTimeoutMillis
            connection.readTimeout = readTimeoutMillis
            connection.setRequestProperty("Accept", "application/json")

            val statusCode = connection.responseCode
            val stream = if (statusCode in 200..299) connection.inputStream else connection.errorStream
            val body = stream?.use { it.readBytes().toString(Charsets.UTF_8) } ?: ""
            FreeUseBibleApiHttpResponse(statusCode, connection.responseMessage ?: "", body)
        } finally {
            connection.disconnect()
        }
    }
}

/**
 * The exception that is thrown when a request to the Free Use Bible API returns a non-2xx status code.
 */
public class FreeUseBibleApiException(
    /**
     * The URL that was requested.
     */
    public val url: String,

    /**
     * The HTTP status code of the response.
     */
    public val statusCode: Int,

    /**
     * The HTTP status message of the response.
     */
    public val statusMessage: String,
) : IOException("Failed request to $url. Status: $statusCode $statusMessage")
