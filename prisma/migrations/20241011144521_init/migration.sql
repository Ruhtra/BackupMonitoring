-- CreateTable
CREATE TABLE "reg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dbName" TEXT NOT NULL,
    "statusBackup" TEXT NOT NULL,
    "statusSend" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);
