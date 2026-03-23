import type {
  DailyAssignment as PrismaDailyAssignment,
  AssignmentType as PrismaAssignmentType,
} from '@prisma/client';

import { fromYyyyMmDd, toYyyyMmDd } from '@common/types/date';
import type {
  DailyAssignment,
  Task,
  DailyCheck,
} from '../../../ports/assignment.repository.port';

export const toPrismaAssignmentType = (
  t: 'TASK' | 'DAILY_CHECK'
): PrismaAssignmentType => t as unknown as PrismaAssignmentType;

export const toPrismaAssignmentDate = (yyyyMmDd: string): Date =>
  fromYyyyMmDd(yyyyMmDd);

export const toDomainAssignment = (
  row: PrismaDailyAssignment
): DailyAssignment => {
  const base = {
    id: row.id,
    orgId: row.organizationId,
    sessionId: row.sessionId,
    studentId: row.studentId,
    assignmentDate: toYyyyMmDd(row.assignmentDate),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (row.assignmentType === 'DAILY_CHECK') {
    return {
      ...base,
      assignmentType: 'DAILY_CHECK',
      checked: row.checked,
      contactMade: row.contactMade,
      checkMemo: row.checkMemo ?? null,
    } satisfies DailyCheck;
  }

  return {
    ...base,
    assignmentType: 'TASK',
    title: row.title ?? null,
    body: row.body ?? null,
    dueAt: row.dueAt ?? null,
    status: row.status,
    incompletionReason: row.incompletionReason ?? null,
    subject: row.subject ?? null,
    categoryType: row.categoryType ?? null,
    difficulty: row.difficulty ?? null,
    estimatedMinutes: row.estimatedMinutes ?? null,
  } satisfies Task;
};
