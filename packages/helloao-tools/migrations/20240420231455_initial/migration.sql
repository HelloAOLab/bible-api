-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "shortName" TEXT,
    "englishName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "textDirection" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "title" TEXT,
    "numberOfChapters" INTEGER NOT NULL,

    PRIMARY KEY ("translationId", "id"),
    CONSTRAINT "Book_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "apiLink" TEXT NOT NULL,

    PRIMARY KEY ("translationId", "bookId", "number"),
    CONSTRAINT "Chapter_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    PRIMARY KEY ("translationId", "bookId", "chapterNumber", "number"),
    CONSTRAINT "ChapterVerse_translationId_bookId_chapterNumber_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber") REFERENCES "Chapter" ("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterVerse_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterVerse_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChapterFootnote" (
    "id" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "verseNumber" INTEGER,

    PRIMARY KEY ("translationId", "bookId", "chapterNumber", "id"),
    CONSTRAINT "ChapterFootnote_translationId_bookId_chapterNumber_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber") REFERENCES "Chapter" ("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterFootnote_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterFootnote_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterFootnote_translationId_bookId_chapterNumber_verseNumber_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber", "verseNumber") REFERENCES "ChapterVerse" ("translationId", "bookId", "chapterNumber", "number") ON DELETE RESTRICT ON UPDATE CASCADE
);
