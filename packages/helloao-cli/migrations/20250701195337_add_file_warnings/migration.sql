-- CreateTable
CREATE TABLE "InputFileWarning" (
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    PRIMARY KEY ("name", "type", "message")
);
