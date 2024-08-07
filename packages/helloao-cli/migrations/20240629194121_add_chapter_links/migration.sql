/*
  Warnings:

  - Added the required column `contentJson` to the `ChapterVerse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "apiLink" TEXT NOT NULL,
    "previousChapterTranslationId" TEXT,
    "previousChapterBookId" TEXT,
    "previousChapterNumber" INTEGER,

    PRIMARY KEY ("translationId", "bookId", "number"),
    CONSTRAINT "Chapter_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_previousChapterTranslationId_previousChapterBookId_previousChapterNumber_fkey" FOREIGN KEY ("previousChapterTranslationId", "previousChapterBookId", "previousChapterNumber") REFERENCES "Chapter" ("translationId", "bookId", "number") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("apiLink", "bookId", "number", "translationId") SELECT "apiLink", "bookId", "number", "translationId" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_previousChapterTranslationId_previousChapterBookId_previousChapterNumber_key" ON "Chapter"("previousChapterTranslationId", "previousChapterBookId", "previousChapterNumber");
CREATE TABLE "new_ChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,

    PRIMARY KEY ("translationId", "bookId", "chapterNumber", "number"),
    CONSTRAINT "ChapterVerse_translationId_bookId_chapterNumber_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber") REFERENCES "Chapter" ("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterVerse_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterVerse_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChapterVerse" ("bookId", "chapterNumber", "number", "text", "translationId") SELECT "bookId", "chapterNumber", "number", "text", "translationId" FROM "ChapterVerse";
DROP TABLE "ChapterVerse";
ALTER TABLE "new_ChapterVerse" RENAME TO "ChapterVerse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
