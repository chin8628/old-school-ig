/*
  Warnings:

  - You are about to drop the `photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vibeSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "photo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "profile";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "vibeSong";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Photo" (
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
    "profileId" INTEGER,
    CONSTRAINT "Photo_vibeSongId_fkey" FOREIGN KEY ("vibeSongId") REFERENCES "VibeSong" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Photo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VibeSong" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeId" TEXT,
    "startTime" INTEGER,
    "endTime" INTEGER
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "displayName" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL
);
