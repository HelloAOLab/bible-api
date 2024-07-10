/*
  Warnings:

  - You are about to drop the column `apiLink` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `previousChapterBookId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `previousChapterNumber` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `previousChapterTranslationId` on the `Chapter` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "json" TEXT NOT NULL,

    PRIMARY KEY ("translationId", "bookId", "number"),
    CONSTRAINT "Chapter_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("bookId", "json", "number", "translationId") SELECT "bookId", "json", "number", "translationId" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
