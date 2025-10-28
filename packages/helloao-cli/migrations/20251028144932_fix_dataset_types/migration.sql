/*
  Warnings:

  - You are about to drop the column `commonName` on the `DatasetBook` table. All the data in the column will be lost.
  - You are about to drop the column `introduction` on the `DatasetBook` table. All the data in the column will be lost.
  - You are about to drop the column `introductionSummary` on the `DatasetBook` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `DatasetBook` table. All the data in the column will be lost.
  - You are about to drop the column `sha256` on the `DatasetReference` table. All the data in the column will be lost.
  - Added the required column `referenceBookId` to the `DatasetReference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceChapter` to the `DatasetReference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceVerse` to the `DatasetReference` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DatasetBook" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("datasetId", "id"),
    CONSTRAINT "DatasetBook_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DatasetBook" ("datasetId", "id", "numberOfChapters", "order", "sha256") SELECT "datasetId", "id", "numberOfChapters", "order", "sha256" FROM "DatasetBook";
DROP TABLE "DatasetBook";
ALTER TABLE "new_DatasetBook" RENAME TO "DatasetBook";
CREATE TABLE "new_DatasetReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datasetId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "referenceBookId" TEXT NOT NULL,
    "referenceChapter" INTEGER NOT NULL,
    "referenceVerse" INTEGER NOT NULL,
    "endVerseNumber" INTEGER,
    "score" INTEGER,
    CONSTRAINT "DatasetReference_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetReference_datasetId_bookId_fkey" FOREIGN KEY ("datasetId", "bookId") REFERENCES "DatasetBook" ("datasetId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetReference_datasetId_bookId_chapterNumber_fkey" FOREIGN KEY ("datasetId", "bookId", "chapterNumber") REFERENCES "DatasetChapter" ("datasetId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DatasetReference_datasetId_bookId_chapterNumber_verseNumber_fkey" FOREIGN KEY ("datasetId", "bookId", "chapterNumber", "verseNumber") REFERENCES "DatasetChapterVerse" ("datasetId", "bookId", "chapterNumber", "number") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DatasetReference" ("bookId", "chapterNumber", "datasetId", "endVerseNumber", "id", "score", "verseNumber") SELECT "bookId", "chapterNumber", "datasetId", "endVerseNumber", "id", "score", "verseNumber" FROM "DatasetReference";
DROP TABLE "DatasetReference";
ALTER TABLE "new_DatasetReference" RENAME TO "DatasetReference";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
