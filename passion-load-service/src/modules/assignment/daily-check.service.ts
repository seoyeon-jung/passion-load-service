import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ListDailyChecksQueryDto,
  UpsertDailyCheckDto,
} from './adapters/in/daily-checks.dto';
import { DAILY_CHECK_REPOSITORY } from '@modules/persistence.tokens';
import type { DailyCheckRepositoryPort } from './ports/assignment.repository.port';

@Injectable()
export class DailyCheckService {
  constructor(
    @Inject(DAILY_CHECK_REPOSITORY)
    private readonly assignments: DailyCheckRepositoryPort
  ) {}

  async upsertDailyCheck(orgId: string, dto: UpsertDailyCheckDto) {
    return this.assignments.upsertDailyCheck({
      id: randomUUID(),
      orgId,
      studentId: dto.studentId,
      assignmentDate: dto.date,
      checked: dto.checked,
      contactMade: dto.contactMade,
      checkMemo: dto.checkMemo ?? null,
    });
  }

  async listDailyChecks(orgId: string, query: ListDailyChecksQueryDto) {
    if (!query.date && !query.studentId) {
      throw new BadRequestException(
        'at least one filter is required: date or studentId'
      );
    }

    return this.assignments.listDailyChecks({
      orgId,
      date: query.date,
      studentId: query.studentId,
    });
  }
}
