import type { AssignmentSubmission as PrismaSubmission } from '@prisma/client';
import { SubmissionStatus } from '@common/types/enums';
import type { AssignmentSubmission } from '../../../ports/submission.repository.port';

export const toDomainSubmission = (
  row: PrismaSubmission
): AssignmentSubmission => ({
  id: row.id,
  orgId: row.organizationId,
  assignmentId: row.assignmentId,
  studentId: row.studentId,

  status: row.status as unknown as SubmissionStatus,
  reason: row.reason ?? null,
  scheduleNote: row.scheduleNote ?? null,

  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
