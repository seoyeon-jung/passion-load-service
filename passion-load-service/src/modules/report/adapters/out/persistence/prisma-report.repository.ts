import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma/prisma.service';
import type {
  ReportRepositoryPort,
  CreateReportInput,
  ReportQuery,
} from '../../../ports/report.repository.port';
import { toDomainReport } from './report.mapper';

@Injectable()
export class PrismaReportRepository implements ReportRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateReportInput) {
    const row = await this.prisma.report.create({
      data: {
        id: input.id,
        organizationId: input.orgId,
        studentId: input.studentId,
        sessionId: input.sessionId ?? null,
        summary: input.summary,
        analysis: (input.analysis as any) ?? null,
      },
    });

    return toDomainReport(row);
  }

  async findById(id: string) {
    const row = await this.prisma.report.findUnique({ where: { id } });
    return row ? toDomainReport(row) : null;
  }

  async list(filter: ReportQuery) {
    const where: Prisma.ReportWhereInput = {
      organizationId: filter.orgId,
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.sessionId ? { sessionId: filter.sessionId } : {}),
    };

    const rows = await this.prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(toDomainReport);
  }
}
