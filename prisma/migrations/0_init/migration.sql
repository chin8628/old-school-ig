-- CreateTable
CREATE TABLE "photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "shutterSpeed" TEXT,
    "fNumber" TEXT,
    "maker" TEXT,
    "model" TEXT,
    "lensModel" TEXT,
    "createDate" DATETIME,
    "imageHeight" TEXT,
    "imageWidth" TEXT,
    "iso" TEXT,
    "focalLength" TEXT,
    "story" TEXT,
    "vibeSongId" INTEGER,
    CONSTRAINT "photo_vibeSongId_fkey" FOREIGN KEY ("vibeSongId") REFERENCES "vibeSong" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "vibeSong" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeId" TEXT,
    "startTime" INTEGER,
    "endTime" INTEGER
);

