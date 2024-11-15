-- CreateTable
CREATE TABLE "Commentary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "textDirection" TEXT NOT NULL,
    "sha256" TEXT
);

-- CreateTable
CREATE TABLE "CommentaryBook" (
    "id" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "introduction" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("commentaryId", "id"),
    CONSTRAINT "CommentaryBook_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentaryChapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "introduction" TEXT,
    "json" TEXT NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("commentaryId", "bookId", "number"),
    CONSTRAINT "CommentaryChapter_commentaryId_bookId_fkey" FOREIGN KEY ("commentaryId", "bookId") REFERENCES "CommentaryBook" ("commentaryId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentaryChapter_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentaryChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("commentaryId", "bookId", "chapterNumber", "number"),
    CONSTRAINT "CommentaryChapterVerse_commentaryId_bookId_chapterNumber_fkey" FOREIGN KEY ("commentaryId", "bookId", "chapterNumber") REFERENCES "CommentaryChapter" ("commentaryId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentaryChapterVerse_commentaryId_bookId_fkey" FOREIGN KEY ("commentaryId", "bookId") REFERENCES "CommentaryBook" ("commentaryId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentaryChapterVerse_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
