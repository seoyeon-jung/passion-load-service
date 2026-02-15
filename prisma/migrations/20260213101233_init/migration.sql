-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PLANNED', 'ACTIVE', 'DONE');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('TASK', 'DAILY_CHECK');

-- CreateEnum
CREATE TYPE "DailyAssignmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'DONE', 'HOLD');

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "teacher_id" TEXT,
    "title" TEXT NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_assignments" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "session_id" UUID,
    "student_id" TEXT NOT NULL,
    "assignment_date" DATE NOT NULL,
    "assignment_type" "AssignmentType" NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "due_at" TIMESTAMP(3),
    "status" "DailyAssignmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "incompletion_reason" TEXT,
    "subject" TEXT,
    "category_type" TEXT,
    "difficulty" TEXT,
    "estimated_minutes" INTEGER,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "contact_made" BOOLEAN NOT NULL DEFAULT false,
    "check_memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "student_id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "reason" TEXT,
    "schedule_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "student_id" TEXT NOT NULL,
    "assignment_id" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_by" TEXT,
    "from_date" DATE NOT NULL,
    "to_date" DATE NOT NULL,
    "target_student_id" TEXT,
    "url" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_organization_id_idx" ON "sessions"("organization_id");

-- CreateIndex
CREATE INDEX "sessions_organization_id_session_date_idx" ON "sessions"("organization_id", "session_date");

-- CreateIndex
CREATE INDEX "sessions_session_date_idx" ON "sessions"("session_date");

-- CreateIndex
CREATE INDEX "daily_assignments_organization_id_idx" ON "daily_assignments"("organization_id");

-- CreateIndex
CREATE INDEX "daily_assignments_organization_id_assignment_date_idx" ON "daily_assignments"("organization_id", "assignment_date");

-- CreateIndex
CREATE INDEX "daily_assignments_session_id_idx" ON "daily_assignments"("session_id");

-- CreateIndex
CREATE INDEX "daily_assignments_student_id_assignment_date_idx" ON "daily_assignments"("student_id", "assignment_date");

-- CreateIndex
CREATE INDEX "daily_assignments_assignment_type_assignment_date_idx" ON "daily_assignments"("assignment_type", "assignment_date");

-- CreateIndex
CREATE INDEX "daily_assignments_organization_id_student_id_assignment_dat_idx" ON "daily_assignments"("organization_id", "student_id", "assignment_date");

-- CreateIndex
CREATE INDEX "assignment_submissions_organization_id_idx" ON "assignment_submissions"("organization_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_organization_id_assignment_id_idx" ON "assignment_submissions"("organization_id", "assignment_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_student_id_idx" ON "assignment_submissions"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_assignment_id_student_id_key" ON "assignment_submissions"("assignment_id", "student_id");

-- CreateIndex
CREATE INDEX "feedbacks_organization_id_idx" ON "feedbacks"("organization_id");

-- CreateIndex
CREATE INDEX "feedbacks_organization_id_student_id_idx" ON "feedbacks"("organization_id", "student_id");

-- CreateIndex
CREATE INDEX "feedbacks_student_id_idx" ON "feedbacks"("student_id");

-- CreateIndex
CREATE INDEX "feedbacks_assignment_id_idx" ON "feedbacks"("assignment_id");

-- CreateIndex
CREATE INDEX "reports_organization_id_idx" ON "reports"("organization_id");

-- CreateIndex
CREATE INDEX "reports_organization_id_from_date_to_date_idx" ON "reports"("organization_id", "from_date", "to_date");

-- CreateIndex
CREATE INDEX "reports_from_date_to_date_idx" ON "reports"("from_date", "to_date");

-- CreateIndex
CREATE INDEX "reports_target_student_id_idx" ON "reports"("target_student_id");

-- CreateIndex
CREATE INDEX "reports_organization_id_target_student_id_idx" ON "reports"("organization_id", "target_student_id");

-- AddForeignKey
ALTER TABLE "daily_assignments" ADD CONSTRAINT "daily_assignments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "daily_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "daily_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
