import type { StudentNote as PrismaStudentNote } from '@prisma/client';
import type { StudentNote } from '../../../ports/student-note.repository.port';
import { toYyyyMmDd, fromYyyyMmDd } from '@common/types/date';

export const toDomainStudentNote = (row: PrismaStudentNote): StudentNote => ({
  id: row.id,
  orgId: row.organizationId,
  studentId: row.studentId,
  noteDate: toYyyyMmDd(row.noteDate),
  content: row.content,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const toPrismaDate = (yyyyMmDd: string): Date => fromYyyyMmDd(yyyyMmDd);
