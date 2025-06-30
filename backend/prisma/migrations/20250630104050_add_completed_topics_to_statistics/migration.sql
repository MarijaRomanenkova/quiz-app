/*
  Warnings:

  - You are about to drop the `CompletedTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompletedTopic" DROP CONSTRAINT "CompletedTopic_topicId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedTopic" DROP CONSTRAINT "CompletedTopic_userId_fkey";

-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "completedTopics" JSONB;

-- DropTable
DROP TABLE "CompletedTopic";
