/*
  Warnings:

  - Added the required column `topicOrder` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Topic" ADD COLUMN "topicOrder" INTEGER;

-- Update existing topics with logical order
-- Grammar topics (A1.1)
UPDATE "Topic" SET "topicOrder" = 1 WHERE "topicId" = 'articles';
UPDATE "Topic" SET "topicOrder" = 2 WHERE "topicId" = 'present-tense';
UPDATE "Topic" SET "topicOrder" = 3 WHERE "topicId" = 'past-tense';

-- Reading topics (A1.1)
UPDATE "Topic" SET "topicOrder" = 1 WHERE "topicId" = 'short-stories';
UPDATE "Topic" SET "topicOrder" = 2 WHERE "topicId" = 'news-articles';
UPDATE "Topic" SET "topicOrder" = 3 WHERE "topicId" = 'dialogues';

-- Listening topics (A1.1)
UPDATE "Topic" SET "topicOrder" = 1 WHERE "topicId" = 'basic-listening';
UPDATE "Topic" SET "topicOrder" = 2 WHERE "topicId" = 'news-reports';
UPDATE "Topic" SET "topicOrder" = 3 WHERE "topicId" = 'songs';

-- Words topics (A1.1)
UPDATE "Topic" SET "topicOrder" = 1 WHERE "topicId" = 'basics';
UPDATE "Topic" SET "topicOrder" = 2 WHERE "topicId" = 'fruit-veggies';
UPDATE "Topic" SET "topicOrder" = 3 WHERE "topicId" = 'family-friends';
UPDATE "Topic" SET "topicOrder" = 4 WHERE "topicId" = 'fashion';
UPDATE "Topic" SET "topicOrder" = 5 WHERE "topicId" = 'travel';

-- Make topicOrder NOT NULL after setting values
ALTER TABLE "Topic" ALTER COLUMN "topicOrder" SET NOT NULL;
