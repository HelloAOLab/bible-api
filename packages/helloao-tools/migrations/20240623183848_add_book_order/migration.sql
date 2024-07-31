/*
  Warnings:

  - Added the required column `order` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,

    PRIMARY KEY ("translationId", "id"),
    CONSTRAINT "Book_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("commonName", "id", "name", "numberOfChapters", "title", "translationId") SELECT "commonName", "id", "name", "numberOfChapters", "title", "translationId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
