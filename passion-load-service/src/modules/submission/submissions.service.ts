import {
  ASSIGNMENT_REPOSITORY,
  SUBMISSION_REPOSITORY,
} from '@modules/persistence.tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SubmissionRepositoryPort } from './ports/submission.repository.port';
import type { AssignmentRepositoryPort } from '@modules/assignment/ports/assignment.repository.port';
import {
  ListSubmissionQueryDto,
  UpsertSubmissionDto,
} from './adapters/in/submissions.dto';
import { AssignmentType } from '@common/types/enums';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissions: SubmissionRepositoryPort,
    @Inject(ASSIGNMENT_REPOSITORY)
    private readonly assignments: AssignmentRepositoryPort
  ) {}

  async upsert(orgId: string, dto: UpsertSubmissionDto) {
    const a = await this.assignments.findById(dto.assignmentId);
    if (!a || a.orgId !== orgId)
      throw new NotFoundException('assignment not found');

    if (a.assignmentType !== AssignmentType.TASK) {
      throw new BadRequestException(
        'submission is allowed only for TASK assignments'
      );
    }

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
