import type { Report } from "../../../domain/report.model";
import type { Report as PrismaReport } from "@prisma/client";

export const toDomainReport = (row: PrismaReport): Report => ({
    id: row.id,
    orgId: row.organizationId,
    studentId: row.studentId,
    sessionId: row.sessionId ?? undefined,
    
    summary: row.summary ?? undefined,
    analysis: (row.analysis as unknown) ?? undefined,
    
    createdAt: row.createdAt,
})