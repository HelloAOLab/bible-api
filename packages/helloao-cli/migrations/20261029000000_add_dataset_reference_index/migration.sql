-- CreateIndex
CREATE INDEX "DatasetReference_datasetId_bookId_chapterNumber_verseNumber_idx" ON "DatasetReference"("datasetId", "bookId", "chapterNumber", "verseNumber");
