import { ASSIGNMENT_REPOSITORY } from '@modules/persistence.tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AssignmentRepositoryPort } from './ports/assignment.repository.port';
import { randomUUID } from 'crypto';
import { AssignmentType } from '@common/types/enums';
import {
  ListDailyChecksQueryDto,
  UpsertDailyCheckDto,
} from './adapters/in/daily-checks.dto';

@Injectable()
export class DailyCheckService {
  constructor(
    @Inject(ASSIGNMENT_REPOSITORY)
    private readonly assignments: AssignmentRepositoryPort
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

    return this.assignments.list({
      orgId,
      type: AssignmentType.DAILY_CHECK,
      date: query.date,
      studentId: query.studentId,
    });
  }
}
