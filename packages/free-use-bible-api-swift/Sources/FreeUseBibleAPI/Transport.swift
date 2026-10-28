import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

/// Performs the HTTP requests for a `FreeUseBibleAPI` client.
///
/// Implement this to customize how requests are made, for example to add logging,
/// to use a different HTTP library, or to return canned responses in tests.
public protocol FreeUseBibleAPITransport: Sendable {
    /// Performs a GET request for the given URL.
    /// - Parameter url: The URL to request.
    /// - Returns: The body and the HTTP response.
    func data(from url: URL) async throws -> (Data, HTTPURLResponse)
}

/// A transport that makes requests with `URLSession`.
public struct URLSessionTransport: FreeUseBibleAPITransport, @unchecked Sendable {
    /// The session that requests are made with.
    public let session: URLSession

    /// Creates a new transport.
    /// - Parameter session: The session to make requests with. Defaults to `URLSession.shared`.
    public init(session: URLSession = .shared) {
        self.session = session
    }

    public func data(from url: URL) async throws -> (Data, HTTPURLResponse) {
        let (data, response) = try await load(url)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }
        return (data, httpResponse)
    }

    private func load(_ url: URL) async throws -> (Data, URLResponse) {
        #if canImport(Darwin)
        if #available(macOS 12, iOS 15, tvOS 15, watchOS 8, *) {
            return try await session.data(from: url)
        }
        #endif

        return try await withCheckedThrowingContinuation { continuation in
            let task = session.dataTask(with: url) { data, response, error in
                if let error {
                    continuation.resume(throwing: error)
                } else if let data, let response {
                    continuation.resume(returning: (data, response))
                } else {
                    continuation.resume(throwing: URLError(.badServerResponse))
                }
            }
            task.resume()
        }
    }
}
