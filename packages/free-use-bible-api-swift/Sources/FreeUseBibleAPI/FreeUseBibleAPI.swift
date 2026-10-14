import Foundation

/// A client for interacting with the [Free Use Bible API](https://bible.helloao.org/).
///
/// This API provides access to a large collection of Bible translations, commentaries, and datasets that are free to use.
///
/// ```swift
/// let api = FreeUseBibleAPI()
/// let chapter = try await api.getTranslationBookChapter(translation: "BSB", book: .GEN, chapter: 1)
/// print(api.getChapterVerseText(chapter))
/// ```
public final class FreeUseBibleAPI: Sendable {
    /// The endpoint that is used by default: `https://bible.helloao.org/`.
    public static let defaultEndpoint = URL(string: "https://bible.helloao.org/")!

    /// The API endpoint that requests are made to.
    public let endpoint: URL

    /// Whether responses are cached in memory.
    public let useCache: Bool

    private let transport: any FreeUseBibleAPITransport
    private let cache = ResponseCache()

    /// Creates a new client.
    /// - Parameters:
    ///   - endpoint: The API endpoint to use for the requests. Defaults to `https://bible.helloao.org/`.
    ///   - useCache: Whether to cache responses in memory. Defaults to `true`.
    ///   - transport: The transport that performs the HTTP requests. Defaults to a `URLSessionTransport` that uses `URLSession.shared`.
    public init(
        endpoint: URL = FreeUseBibleAPI.defaultEndpoint,
        useCache: Bool = true,
        transport: (any FreeUseBibleAPITransport)? = nil
    ) {
        self.endpoint = endpoint
        self.useCache = useCache
        self.transport = transport ?? URLSessionTransport()
    }

    /// Gets and decodes the JSON at the given path.
    ///
    /// Paths are resolved relative to the endpoint, so both relative paths (`api/BSB/books.json`) and the
    /// absolute paths that the API uses for links (`/api/BSB/GEN/1.json`) work. Full URLs are used as they are.
    /// - Parameters:
    ///   - path: The path or URL to get.
    ///   - endpoint: The API endpoint to use for the request. If not provided, the endpoint of the client is used.
    ///   - useCache: Whether the response may be cached. Responses are only cached when the client also has caching enabled.
    public func getJSON<T: Decodable>(_ path: String, endpoint: URL? = nil, useCache: Bool = true) async throws -> T {
        let url = try buildURL(path, endpoint: endpoint)
        let data: Data
        if self.useCache && useCache {
            data = try await cache.data(for: url) { [transport] in
                try await Self.load(url, transport: transport)
            }
        } else {
            data = try await Self.load(url, transport: transport)
        }

        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch let error as DecodingError {
            throw FreeUseBibleAPIError.decodingFailed(url: url, underlyingError: error)
        }
    }

    private static func load(_ url: URL, transport: any FreeUseBibleAPITransport) async throws -> Data {
        let (data, response) = try await transport.data(from: url)
        guard (200..<300).contains(response.statusCode) else {
            throw FreeUseBibleAPIError.requestFailed(url: url, statusCode: response.statusCode)
        }
        return data
    }

    private func buildURL(_ path: String, endpoint: URL?) throws -> URL {
        let lowercased = path.lowercased()
        if lowercased.hasPrefix("http://") || lowercased.hasPrefix("https://") {
            guard let url = URL(string: path) else {
                throw FreeUseBibleAPIError.invalidURL(path)
            }
            return url
        }

        guard let url = URL(string: path, relativeTo: endpoint ?? self.endpoint) else {
            throw FreeUseBibleAPIError.invalidURL(path)
        }
        return url.absoluteURL
    }
}

/// An error that occurred while making a request to the Free Use Bible API.
public enum FreeUseBibleAPIError: Error, Sendable, CustomStringConvertible {
    /// The request URL could not be created from the given path.
    case invalidURL(String)

    /// The API responded with a non-2xx status code.
    ///
    /// A 404 status code usually means that one of the values in the path is invalid. For example, the translation, commentary, dataset, book, or chapter.
    case requestFailed(url: URL, statusCode: Int)

    /// The response could not be decoded.
    case decodingFailed(url: URL, underlyingError: DecodingError)

    public var description: String {
        switch self {
        case .invalidURL(let path):
            return "Invalid URL: \(path)"
        case .requestFailed(let url, let statusCode):
            return "Failed request to \(url.absoluteString). Status: \(statusCode)"
        case .decodingFailed(let url, let underlyingError):
            return "Failed to decode the response from \(url.absoluteString): \(underlyingError)"
        }
    }
}

extension FreeUseBibleAPIError: LocalizedError {
    public var errorDescription: String? {
        description
    }
}

/// Caches the responses for each URL, sharing in-flight requests for the same URL.
private actor ResponseCache {
    private var tasks: [URL: Task<Data, Error>] = [:]

    func data(for url: URL, load: @escaping @Sendable () async throws -> Data) async throws -> Data {
        if let existing = tasks[url] {
            return try await existing.value
        }

        let task = Task { try await load() }
        tasks[url] = task
        do {
            return try await task.value
        } catch {
            // Don't cache failures, so that the request can be retried.
            if tasks[url] == task {
                tasks[url] = nil
            }
            throw error
        }
    }
}

private let pathComponentAllowedCharacters = CharacterSet(
    charactersIn: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()"
)

/// Percent-encodes a value for use as a single path component, like JavaScript's `encodeURIComponent()`.
func encodePathComponent(_ value: String) -> String {
    value.addingPercentEncoding(withAllowedCharacters: pathComponentAllowedCharacters) ?? value
}
