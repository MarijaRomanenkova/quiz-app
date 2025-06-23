-- AlterTable
ALTER TABLE "User" ADD COLUMN     "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareDevices" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studyPaceId" INTEGER NOT NULL DEFAULT 1;
