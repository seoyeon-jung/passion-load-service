import { PrismaService } from '@common/prisma/prisma.service';
import {
  CreateReportInput,
  ListReportsQuery,
  MarkReportSentInput,
  ReportRepositoryPort,
  SaveReportResultInput,
} from '@modules/report/ports/report.repository.port';
import { Injectable, NotFoundException } from '@nestjs/common';
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
        sessionId: input.sessionId,
        fromAt: input.fromAt,
        toAt: input.toAt,
        summary: input.summary,
        analysis: input.analysis as any,
        status: 'REQUESTED',
      },
    });
    return toDomainReport(row);
  }

  async findById(id: string) {
    const row = await this.prisma.report.findUnique({ where: { id } });
    return row ? toDomainReport(row) : null;
  }

  async list(query: ListReportsQuery) {
    const overlap =
      query.fromAt || query.toAt
        ? {
            AND: [
              ...(query.toAt ? [{ fromAt: { lte: query.toAt } }] : []),
              ...(query.fromAt ? [{ toAt: { gte: query.fromAt } }] : []),
            ],
          }
        : undefined;

    const rows = await this.prisma.report.findMany({
      where: {
        organizationId: query.orgId,
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.sessionId ? { sessionId: query.sessionId } : {}),
        ...(query.status ? { status: query.status as any } : {}),
        ...(overlap ?? {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(toDomainReport);
  }

  async saveResult(input: SaveReportResultInput) {
    const updated = await this.prisma.report.updateMany({
      where: { id: input.id, organizationId: input.orgId },
      data: {
        resultUrl: input.resultUrl ?? undefined,
        fileId: input.fileId ?? undefined,
        status: 'GENERATED',
      },
    });

    if (updated.count === 0) throw new NotFoundException('report not found');

    const row = await this.prisma.report.findUnique({
      where: { id: input.id },
    });
    return toDomainReport(row!);
  }

  async markSent(input: MarkReportSentInput) {
    const updated = await this.prisma.report.updateMany({
      where: { id: input.id, organizationId: input.orgId },
      data: {
        status: 'SENT',
        sentAt: input.sentAt,
      },
    });

    if (updated.count === 0) throw new NotFoundException('report not found');

    const row = await this.prisma.report.findUnique({
      where: { id: input.id },
    });
    return toDomainReport(row!);
  }
}
