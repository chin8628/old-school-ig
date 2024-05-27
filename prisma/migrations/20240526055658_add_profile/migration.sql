-- CreateTable
CREATE TABLE "profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "displayName" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_photo" (
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
    CONSTRAINT "photo_vibeSongId_fkey" FOREIGN KEY ("vibeSongId") REFERENCES "vibeSong" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "photo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_photo" ("createDate", "createdAt", "fNumber", "fileName", "focalLength", "id", "imageHeight", "imageWidth", "iso", "lensModel", "maker", "model", "shutterSpeed", "story", "vibeSongId") SELECT "createDate", "createdAt", "fNumber", "fileName", "focalLength", "id", "imageHeight", "imageWidth", "iso", "lensModel", "maker", "model", "shutterSpeed", "story", "vibeSongId" FROM "photo";
DROP TABLE "photo";
ALTER TABLE "new_photo" RENAME TO "photo";
PRAGMA foreign_key_check("photo");
PRAGMA foreign_keys=ON;
