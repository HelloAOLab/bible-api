-- CreateTable
CREATE TABLE "SyncSource" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statHash" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "processorVersion" TEXT NOT NULL,
    "itemsJson" TEXT NOT NULL,
    "importedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SyncUpload" (
    "destination" TEXT NOT NULL,
    "itemKind" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "generatorVersion" TEXT NOT NULL,
    "paths" BLOB NOT NULL,
    "mergedJson" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL,

    PRIMARY KEY ("destination", "itemKind", "itemId")
);

-- CreateTable
CREATE TABLE "SyncPendingDelete" (
    "destination" TEXT NOT NULL,
    "itemKind" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    PRIMARY KEY ("destination", "path")
);

-- CreateTable
CREATE TABLE "SyncDestination" (
    "destination" TEXT NOT NULL PRIMARY KEY,
    "mergedSha256" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL
);
