/*
  Warnings:

  - You are about to drop the column `created_by` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `from_date` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `target_student_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `to_date` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `reports` table. All the data in the column will be lost.
  - Added the required column `student_id` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reports_from_date_to_date_idx";

-- DropIndex
DROP INDEX "reports_organization_id_from_date_to_date_idx";

-- DropIndex
DROP INDEX "reports_organization_id_target_student_id_idx";

-- DropIndex
DROP INDEX "reports_target_student_id_idx";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "created_by",
DROP COLUMN "from_date",
DROP COLUMN "metadata",
DROP COLUMN "target_student_id",
DROP COLUMN "to_date",
DROP COLUMN "url",
ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "session_id" UUID,
ADD COLUMN     "student_id" UUID NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "reports_student_id_idx" ON "reports"("student_id");

-- CreateIndex
CREATE INDEX "reports_session_id_idx" ON "reports"("session_id");
