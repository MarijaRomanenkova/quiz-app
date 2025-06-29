-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "dailyQuizTimes" JSONB,
ADD COLUMN     "totalQuizMinutes" INTEGER NOT NULL DEFAULT 0;
