-- CreateTable
CREATE TABLE "EBibleSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usfmZipUrl" TEXT,
    "usfmZipEtag" TEXT,
    "languageCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "redistributable" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "copyright" TEXT NOT NULL,
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
    "sha256" TEXT
);
