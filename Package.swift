// swift-tools-version:5.9

// The Swift SDK for the Free Use Bible API. The sources live in packages/free-use-bible-api-swift,
// but the manifest has to be at the root of the repository for Swift Package Manager to find it.

import PackageDescription

let package = Package(
    name: "FreeUseBibleAPI",
    platforms: [
        .macOS(.v10_15),
        .iOS(.v13),
        .tvOS(.v13),
        .watchOS(.v6),
        .visionOS(.v1),
    ],
    products: [
        .library(name: "FreeUseBibleAPI", targets: ["FreeUseBibleAPI"]),
    ],
    targets: [
        .target(
            name: "FreeUseBibleAPI",
            path: "packages/free-use-bible-api-swift/Sources/FreeUseBibleAPI"
        ),
        .testTarget(
            name: "FreeUseBibleAPITests",
            dependencies: ["FreeUseBibleAPI"],
            path: "packages/free-use-bible-api-swift/Tests/FreeUseBibleAPITests",
            resources: [.copy("Fixtures")]
        ),
    ]
)
