-- CreateTable
CREATE TABLE "student_notes" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "student_id" TEXT NOT NULL,
    "note_date" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_notes_organization_id_idx" ON "student_notes"("organization_id");

-- CreateIndex
CREATE INDEX "student_notes_organization_id_student_id_idx" ON "student_notes"("organization_id", "student_id");

-- CreateIndex
CREATE INDEX "student_notes_student_id_note_date_idx" ON "student_notes"("student_id", "note_date");

-- CreateIndex
CREATE UNIQUE INDEX "student_notes_organization_id_student_id_note_date_key" ON "student_notes"("organization_id", "student_id", "note_date");
