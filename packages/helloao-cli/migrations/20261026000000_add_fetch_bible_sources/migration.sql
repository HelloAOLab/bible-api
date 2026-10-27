-- CreateTable
CREATE TABLE "FetchBibleSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "translationId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "englishName" TEXT,
    "abbreviation" TEXT,
    "textDirection" TEXT NOT NULL,
    "year" INTEGER,
    "ebibleId" TEXT,
    "sourceService" TEXT,
    "sourceFormat" TEXT NOT NULL,
    "sourceUpdated" TEXT,
    "sourceRevision" INTEGER,
    "attribution" TEXT,
    "attributionUrl" TEXT,
    "downloadDate" DATETIME,
    "downloadPath" TEXT,
    "sha256" TEXT
);
