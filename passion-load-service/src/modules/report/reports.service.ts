import { REPORT_REPOSITORY } from '@modules/persistence.tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ReportRepositoryPort } from './ports/report.repository.port';
import {
  CreateReportDto,
  ListReportsQueryDto,
  SaveReportResultDto,
} from './adapters/in/reports.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepo: ReportRepositoryPort
  ) {}

  async create(orgId: string, dto: CreateReportDto) {
    const fromAt = new Date(dto.fromAt);
    const toAt = new Date(dto.toAt);

    if (Number.isNaN(fromAt.getTime()) || Number.isNaN(toAt.getTime())) {
      throw new BadRequestException('invalid fromAt/toAt');
    }
    if (fromAt.getTime() > toAt.getTime()) {
      throw new BadRequestException('fromAt must be <= toAt');
    }

    return this.reportRepo.create({
      id: randomUUID(),
      orgId,
      studentId: dto.studentId,
      sessionId: dto.sessionId ?? null,
      fromAt,
      toAt,
      summary: dto.summary,
      analysis: dto.analysis ?? null,
    });
  }

  async get(orgId: string, id: string) {
    const r = await this.reportRepo.findById(id);
    if (!r || r.orgId !== orgId)
      throw new NotFoundException('report not found');

    return r;
  }

  async list(orgId: string, query: ListReportsQueryDto) {
    const hasAny =
      !!query.studentId ||
      !!query.sessionId ||
      !!query.from ||
      !!query.to ||
      !!query.status;

    if (!hasAny) {
      throw new BadRequestException(
        'at least one filter is required: studentId | sessionId | from | to | status'
      );
    }

    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    if (from && Number.isNaN(from.getTime()))
      throw new BadRequestException('invalid from');
    if (to && Number.isNaN(to.getTime()))
      throw new BadRequestException('invalid to');
    if (from && to && from.getTime() > to.getTime())
      throw new BadRequestException('from must be <= to');

    return this.reportRepo.list({
      orgId,
      studentId: query.studentId,
      sessionId: query.sessionId,
      from,
      to,
      status: query.status,
    });
  }

  async saveResult(orgId: string, id: string, dto: SaveReportResultDto) {
    if (!dto.resultUrl && !dto.fileId) {
      throw new BadRequestException('resultUrl or fileId is required');
    }

    // org 격리 체크
    await this.get(orgId, id);

    return this.reportRepo.saveResult({
      orgId,
      id,
      resultUrl: dto.resultUrl ?? null,
      fileId: dto.fileId ?? null,
    });
  }

  async send(orgId: string, id: string) {
    const r = await this.get(orgId, id);

    if (r.status !== 'GENERATED' && r.status !== 'SENT') {
      throw new BadRequestException('report must be GENERATED before send');
    }

    // TODO: notification 연동 훅
    return this.reportRepo.markSent({
      orgId,
      id,
      sentAt: new Date(),
    });
  }
}
