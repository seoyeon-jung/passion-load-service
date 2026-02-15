import type { Feedback as PrismaFeedback } from '@prisma/client';
import { Feedback } from '../../../domain/feedback.model';

export const toDomainFeedback = (row: PrismaFeedback): Feedback => ({
  id: row.id,
  orgId: row.organizationId,
  studentId: row.studentId,
  assignmentId: row.assignmentId ?? null,
  content: row.content,
  createdAt: row.createdAt,
});
