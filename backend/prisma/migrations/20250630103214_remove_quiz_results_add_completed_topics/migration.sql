/*
  Warnings:

  - You are about to drop the `QuizResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WrongQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "WrongQuestion" DROP CONSTRAINT "WrongQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "WrongQuestion" DROP CONSTRAINT "WrongQuestion_userId_fkey";

-- DropTable
DROP TABLE "QuizResult";

-- DropTable
DROP TABLE "WrongQuestion";

-- CreateTable
CREATE TABLE "CompletedTopic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompletedTopic_userId_topicId_key" ON "CompletedTopic"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "CompletedTopic" ADD CONSTRAINT "CompletedTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedTopic" ADD CONSTRAINT "CompletedTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("topicId") ON DELETE RESTRICT ON UPDATE CASCADE;
