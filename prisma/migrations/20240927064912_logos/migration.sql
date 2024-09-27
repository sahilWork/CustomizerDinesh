-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "ColorSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "colorGroup" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DesignSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "designGroup" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "designs" TEXT,
    "colors" TEXT
);

-- CreateTable
CREATE TABLE "Logos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imagepath" TEXT,
    "filename" TEXT
);
