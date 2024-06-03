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
    "userId" INTEGER,
    "profileId" INTEGER,
    CONSTRAINT "Photo_vibeSongId_fkey" FOREIGN KEY ("vibeSongId") REFERENCES "VibeSong" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
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
    "shortBio" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicUserId_key" ON "User"("publicUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
