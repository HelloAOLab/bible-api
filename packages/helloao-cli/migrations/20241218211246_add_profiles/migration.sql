-- CreateTable
CREATE TABLE "CommentaryProfile" (
    "id" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("commentaryId", "id"),
    CONSTRAINT "CommentaryProfile_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
