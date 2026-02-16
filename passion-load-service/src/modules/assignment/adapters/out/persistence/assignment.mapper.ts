import type {
  DailyAssignment as PrismaDailyAssignment,
  AssignmentType as PrismaAssignmentType,
} from '@prisma/client';

import { AssignmentType } from '@common/types/enums';
import { fromYyyyMmDd, toYyyyMmDd } from '@common/types/date';
import type { DailyAssignment } from '../../../ports/assignment.repository.port';

export const toPrismaAssignmentType = (
  t: AssignmentType
): PrismaAssignmentType => t as unknown as PrismaAssignmentType;

export const toDomainAssignmentType = (
  t: PrismaAssignmentType
): AssignmentType => t as unknown as AssignmentType;

export const toPrismaAssignmentDate = (yyyyMmDd: string): Date =>
  fromYyyyMmDd(yyyyMmDd);

export const toDomainAssignment = (
  row: PrismaDailyAssignment
): DailyAssignment => ({
  id: row.id,
  orgId: row.organizationId,
  sessionId: row.sessionId,
  studentId: row.studentId,

  assignmentDate: toYyyyMmDd(row.assignmentDate),
  assignmentType: toDomainAssignmentType(row.assignmentType),

  title: row.title ?? null,
  body: row.body ?? null,
  dueAt: row.dueAt ?? null,
  status: row.status as unknown as DailyAssignment['status'],
  incompletionReason: row.incompletionReason ?? null,

  subject: row.subject ?? null,
  categoryType: row.categoryType ?? null,
  difficulty: row.difficulty ?? null,
  estimatedMinutes: row.estimatedMinutes ?? null,

  checked: row.checked,
  contactMade: row.contactMade,
  checkMemo: row.checkMemo ?? null,

  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
