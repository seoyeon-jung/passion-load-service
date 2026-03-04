/*
  Warnings:

  - Added the required column `from_at` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_at` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('REQUESTED', 'GENERATED', 'SENT');

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "file_id" TEXT,
ADD COLUMN     "from_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "result_url" TEXT,
ADD COLUMN     "sent_at" TIMESTAMP(3),
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'REQUESTED',
ADD COLUMN     "to_at" TIMESTAMP(3) NOT NULL;
