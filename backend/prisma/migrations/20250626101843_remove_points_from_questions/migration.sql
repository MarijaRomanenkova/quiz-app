/*
  Warnings:

  - You are about to drop the column `points` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `pushNotifications` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "points";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pushNotifications";
