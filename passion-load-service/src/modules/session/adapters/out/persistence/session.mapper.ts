import type {
  Session as PrismaSession,
  SessionStatus as PrismaSessionStatus,
} from '@prisma/client';
import { SessionStatus } from '@common/types/enums';
import { fromYyyyMmDd, toYyyyMmDd } from '@common/types/date';
import { Session } from '../../../domain/session.model';

export const toDomainSessionStatus = (s: PrismaSessionStatus): SessionStatus =>
  s as unknown as SessionStatus;
export const toPrismaSessionStatus = (s: SessionStatus): PrismaSessionStatus =>
  s as unknown as PrismaSessionStatus;

export const toDomainSession = (row: PrismaSession): Session => ({
  id: row.id,
  orgId: row.organizationId,
  title: row.title,
  date: toYyyyMmDd(row.sessionDate),
  status: toDomainSessionStatus(row.status),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const toPrismaSessionDate = (yyyyMmDd: string): Date =>
  fromYyyyMmDd(yyyyMmDd);
