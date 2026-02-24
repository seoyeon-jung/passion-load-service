/*
  Warnings:

  - Added the required column `teacher_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN     "teacher_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "feedbacks_teacher_id_idx" ON "feedbacks"("teacher_id");
