/*
  Warnings:

  - Added the required column `json` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "apiLink" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "previousChapterTranslationId" TEXT,
    "previousChapterBookId" TEXT,
    "previousChapterNumber" INTEGER,

    PRIMARY KEY ("translationId", "bookId", "number"),
    CONSTRAINT "Chapter_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_previousChapterTranslationId_previousChapterBookId_previousChapterNumber_fkey" FOREIGN KEY ("previousChapterTranslationId", "previousChapterBookId", "previousChapterNumber") REFERENCES "Chapter" ("translationId", "bookId", "number") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("apiLink", "bookId", "number", "previousChapterBookId", "previousChapterNumber", "previousChapterTranslationId", "translationId") SELECT "apiLink", "bookId", "number", "previousChapterBookId", "previousChapterNumber", "previousChapterTranslationId", "translationId" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_previousChapterTranslationId_previousChapterBookId_previousChapterNumber_key" ON "Chapter"("previousChapterTranslationId", "previousChapterBookId", "previousChapterNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
