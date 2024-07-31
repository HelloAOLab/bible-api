-- CreateTable
CREATE TABLE "ChapterAudioUrl" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "reader" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    PRIMARY KEY ("translationId", "bookId", "number", "reader"),
    CONSTRAINT "ChapterAudioUrl_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book" ("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterAudioUrl_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChapterAudioUrl_translationId_bookId_number_fkey" FOREIGN KEY ("translationId", "bookId", "number") REFERENCES "Chapter" ("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE
);
