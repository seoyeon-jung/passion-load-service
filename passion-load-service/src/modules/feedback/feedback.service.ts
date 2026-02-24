import {
  ASSIGNMENT_REPOSITORY,
  FEEDBACK_REPOSITORY,
} from '@modules/persistence.tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FeedbackRepositoryPort } from './ports/feedback.repository.port';
import type { AssignmentRepositoryPort } from '@modules/assignment/ports/assignment.repository.port';
import {
  CreateFeedbackDto,
  ListFeedbackQueryDto,
} from './adapters/in/feedback.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class FeedbacksService {
  constructor(
    @Inject(FEEDBACK_REPOSITORY)
    private readonly feedbackRepo: FeedbackRepositoryPort,
    @Inject(ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: AssignmentRepositoryPort
  ) {}

  async create(
    orgId: string,
    teacherId: string | undefined,
    dto: CreateFeedbackDto
  ) {
    if (!teacherId) throw new BadRequestException('teacherId is required');

    if (dto.content.length > 250)
      throw new BadRequestException('content must be <= 250 length');

    if (dto.assignmentId) {
      const a = await this.assignmentRepo.findById(dto.assignmentId);
      if (!a || a.orgId !== orgId)
        throw new NotFoundException('assignment not found');
    }

    return this.feedbackRepo.create({
      id: randomUUID(),
      orgId,
      studentId: dto.studentId,
      teacherId,
      assignmentId: dto.assignmentId ?? null,
      content: dto.content,
    });
  }

  async list(orgId: string, query: ListFeedbackQueryDto) {
    if (!query.studentId && !query.assignmentId) {
      throw new BadRequestException(
        'at least one filter is required: studentId or assignmentId'
      );
    }

    return this.feedbackRepo.list({
      orgId,
      studentId: query.studentId,
      assignmentId: query.assignmentId,
    });
  }
}
