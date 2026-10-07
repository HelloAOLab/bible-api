-- CreateTable
CREATE TABLE "DatasetEntity" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "sha256" TEXT,

    PRIMARY KEY ("datasetId", "type", "id"),
    CONSTRAINT "DatasetEntity_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
