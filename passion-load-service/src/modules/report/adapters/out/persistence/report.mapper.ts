import type { Report } from '../../../domain/report.model';
import type { Report as PrismaReport } from '@prisma/client';

export const toDomainReport = (row: PrismaReport): Report => ({
  id: row.id,
  orgId: row.organizationId,
  studentId: row.studentId,
  sessionId: row.sessionId ?? undefined,

  fromAt: row.fromAt,
  toAt: row.toAt,

  resultUrl: row.resultUrl ?? undefined,
  fileId: row.fileId ?? undefined,

  status: row.status as any,
  sentAt: row.sentAt ?? undefined,

  summary: row.summary,
  analysis: (row.analysis as unknown) ?? undefined,

  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
