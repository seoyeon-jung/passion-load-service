import {
  ASSIGNMENT_USE_CASE,
  SUBMISSION_REPOSITORY,
} from '@modules/persistence.tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { SubmissionRepositoryPort } from './ports/submission.repository.port';
import {
  ListSubmissionQueryDto,
  UpsertSubmissionDto,
} from './adapters/in/submissions.dto';
import type { AssignmentUseCase } from '@modules/assignment/ports/assignment.use-case';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissions: SubmissionRepositoryPort,
    @Inject(ASSIGNMENT_USE_CASE)
    private readonly assignmentUseCase: AssignmentUseCase
  ) {}

  async upsert(orgId: string, dto: UpsertSubmissionDto) {
    await this.assignmentUseCase.validateAssignment(orgId, dto.assignmentId);

    return this.submissions.upsert({
      orgId,
      assignmentId: dto.assignmentId,
      studentId: dto.studentId,
      status: dto.status,
      reason: dto.reason ?? null,
      scheduleNote: dto.scheduleNote ?? null,
    });
  }

  async list(orgId: string, query: ListSubmissionQueryDto) {
    if (!query.assignmentId && !query.studentId && !query.date) {
      throw new BadRequestException(
        'at least one filter is required: assignmentId, studentId, or date'
      );
    }

    return this.submissions.list({
      orgId,
      assignmentId: query.assignmentId,
      studentId: query.studentId,
      date: query.date,
    });
  }
}
