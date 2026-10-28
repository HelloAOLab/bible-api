// swift-tools-version:5.9

// The Swift SDK for the Free Use Bible API.
//
// This package is developed in packages/free-use-bible-api-swift of https://github.com/HelloAOLab/bible-api
// and is published to https://github.com/HelloAOLab/bible-api-swift, which is what Swift Package Manager users add.

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
        .target(name: "FreeUseBibleAPI"),
        .testTarget(
            name: "FreeUseBibleAPITests",
            dependencies: ["FreeUseBibleAPI"],
            resources: [.copy("Fixtures")]
        ),
    ]
)
