-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "licenseNotes" TEXT,
    "englishName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "textDirection" TEXT NOT NULL,
    "sha256" TEXT
);

-- CreateTable
CREATE TABLE "DatasetBook" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "introduction" TEXT,
    "introductionSummary" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("datasetId", "id"),
    CONSTRAINT "DatasetBook_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatasetChapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("datasetId", "bookId", "number"),
    CONSTRAINT "DatasetChapter_datasetId_bookId_fkey" FOREIGN KEY ("datasetId", "bookId") REFERENCES "DatasetBook" ("datasetId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetChapter_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatasetChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("datasetId", "bookId", "chapterNumber", "number"),
    CONSTRAINT "DatasetChapterVerse_datasetId_bookId_chapterNumber_fkey" FOREIGN KEY ("datasetId", "bookId", "chapterNumber") REFERENCES "DatasetChapter" ("datasetId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetChapterVerse_datasetId_bookId_fkey" FOREIGN KEY ("datasetId", "bookId") REFERENCES "DatasetBook" ("datasetId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetChapterVerse_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatasetReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datasetId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "endVerseNumber" INTEGER,
    "score" INTEGER,
    "sha256" TEXT,
    CONSTRAINT "DatasetReference_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetReference_datasetId_bookId_fkey" FOREIGN KEY ("datasetId", "bookId") REFERENCES "DatasetBook" ("datasetId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetReference_datasetId_bookId_chapterNumber_fkey" FOREIGN KEY ("datasetId", "bookId", "chapterNumber") REFERENCES "DatasetChapter" ("datasetId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetReference_datasetId_bookId_chapterNumber_verseNumber_fkey" FOREIGN KEY ("datasetId", "bookId", "chapterNumber", "verseNumber") REFERENCES "DatasetChapterVerse" ("datasetId", "bookId", "chapterNumber", "number") ON DELETE RESTRICT ON UPDATE CASCADE
);
