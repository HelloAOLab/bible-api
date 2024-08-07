-- AlterTable
ALTER TABLE "Book" ADD COLUMN "sha256" TEXT;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN "sha256" TEXT;

-- AlterTable
ALTER TABLE "ChapterFootnote" ADD COLUMN "sha256" TEXT;

-- AlterTable
ALTER TABLE "ChapterVerse" ADD COLUMN "sha256" TEXT;

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN "sha256" TEXT;

-- CreateTable
CREATE TABLE "InputFile" (
    "translationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "sizeInBytes" INTEGER NOT NULL,

    PRIMARY KEY ("translationId", "name")
);
