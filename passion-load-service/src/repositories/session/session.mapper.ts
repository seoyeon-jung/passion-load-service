import type { Session as DomainSession } from '../../domain/session';
import type { Session as PrismaSession } from '@prisma/client';

export const toDomainSession = (row: PrismaSession): DomainSession => ({
    id: row.id,
    orgId: row.organizationId,
    title: row.title,
    date: row.sessionDate.toISOString().slice(0, 10),
    status: row.status as any,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
});

export const toPrismaSessionCreateData = (s: DomainSession) => ({
    id: s.id,
    organizationId: s.orgId,
    title: s.title,
    sessionDate: new Date(s.date),
    status: s.status as any,
})