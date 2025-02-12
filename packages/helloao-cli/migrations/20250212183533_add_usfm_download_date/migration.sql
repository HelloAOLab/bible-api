/*
  Warnings:

  - Added the required column `FCBHID` to the `EBibleSource` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EBibleSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usfmZipUrl" TEXT,
    "usfmZipEtag" TEXT,
    "languageCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "redistributable" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "copyright" TEXT NOT NULL,
    "FCBHID" TEXT NOT NULL,
    "updateDate" DATETIME NOT NULL,
    "sourceDate" DATETIME NOT NULL,
    "oldTestamentBooks" INTEGER NOT NULL,
    "oldTestamentChapters" INTEGER NOT NULL,
    "oldTestamentVerses" INTEGER NOT NULL,
    "newTestamentBooks" INTEGER NOT NULL,
    "newTestamentChapters" INTEGER NOT NULL,
    "newTestamentVerses" INTEGER NOT NULL,
    "apocryphaBooks" INTEGER NOT NULL,
    "apocryphaChapters" INTEGER NOT NULL,
    "apocryphaVerses" INTEGER NOT NULL,
    "translationId" TEXT NOT NULL,
    "usfmDownloadDate" DATETIME,
    "sha256" TEXT
);
INSERT INTO "new_EBibleSource" ("apocryphaBooks", "apocryphaChapters", "apocryphaVerses", "copyright", "description", "id", "languageCode", "newTestamentBooks", "newTestamentChapters", "newTestamentVerses", "oldTestamentBooks", "oldTestamentChapters", "oldTestamentVerses", "redistributable", "sha256", "sourceDate", "title", "translationId", "updateDate", "usfmZipEtag", "usfmZipUrl") SELECT "apocryphaBooks", "apocryphaChapters", "apocryphaVerses", "copyright", "description", "id", "languageCode", "newTestamentBooks", "newTestamentChapters", "newTestamentVerses", "oldTestamentBooks", "oldTestamentChapters", "oldTestamentVerses", "redistributable", "sha256", "sourceDate", "title", "translationId", "updateDate", "usfmZipEtag", "usfmZipUrl" FROM "EBibleSource";
DROP TABLE "EBibleSource";
ALTER TABLE "new_EBibleSource" RENAME TO "EBibleSource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
