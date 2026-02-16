import {
  ASSIGNMENT_REPOSITORY,
  SESSION_REPOSITORY,
} from '@modules/persistence.tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AssignmentRepositoryPort,
  CreateTaskInput,
  UpdateTaskInput,
} from './ports/assignment.repository.port';
import type { SessionRepositoryPort } from '@modules/session/ports/session.repository.port';
import {
  CreateTaskAssignmentDto,
  ListTaskAssignmentsQueryDto,
  UpdateTaskAssignmentDto,
} from './adapters/in/assignments.dto';
import { randomUUID } from 'crypto';
import { fromYyyyMmDd } from '@common/types/date';
import { AssignmentType } from '@common/types/enums';

@Injectable()
export class AssignmentService {
  constructor(
    @Inject(ASSIGNMENT_REPOSITORY)
    private readonly assignments: AssignmentRepositoryPort,
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort
  ) {}

  async createTask(orgId: string, dto: CreateTaskAssignmentDto) {
    const session = await this.sessions.findById(dto.sessionId);
    if (!session || session.orgId !== orgId)
      throw new NotFoundException('session not found');

    const input: CreateTaskInput = {
      id: randomUUID(),
      orgId,
      sessionId: dto.sessionId,
      studentId: dto.studentId,
      assignmentDate: dto.assignmentDate,

      title: dto.title,
      body: dto.body,
      dueAt: dto.dueDate ? fromYyyyMmDd(dto.dueDate) : null,

      status: dto.status,
      incompletionReason: dto.incompletionReason ?? null,

      subject: dto.subject ?? null,
      categoryType: dto.categoryType ?? null,
      difficulty: dto.difficulty ?? null,
      estimatedMinutes: dto.estimatedMinutes ?? null,
    };

    return this.assignments.createTask(input);
  }

  async getTask(orgId: string, id: string) {
    const found = await this.assignments.findById(id);
    if (!found || found.orgId !== orgId)
      throw new NotFoundException('assignment not found');

    if (found.assignmentType !== AssignmentType.TASK) {
      throw new BadRequestException('not a TASK assignment');
    }
    return found;
  }

  async listTasks(orgId: string, query: ListTaskAssignmentsQueryDto) {
    return this.assignments.list({
      orgId,
      type: AssignmentType.TASK,
      studentId: query.studentId,
      sessionId: query.sessionId,
      date: query.date,
    });
  }

  async updateTask(orgId: string, id: string, dto: UpdateTaskAssignmentDto) {
    await this.getTask(orgId, id);

    const input: UpdateTaskInput = {
      title: dto.title ?? undefined,
      body: dto.body ?? undefined,

      // dueDate가 null이면 dueAt을 null로 세팅(마감 삭제)
      ...(dto.dueDate === null ? { dueAt: null } : {}),
      ...(typeof dto.dueDate === 'string'
        ? { dueAt: fromYyyyMmDd(dto.dueDate) }
        : {}),

      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.incompletionReason !== undefined
        ? { incompletionReason: dto.incompletionReason }
        : {}),

      ...(dto.subject !== undefined ? { subject: dto.subject } : {}),
      ...(dto.categoryType !== undefined
        ? { categoryType: dto.categoryType }
        : {}),
      ...(dto.difficulty !== undefined ? { difficulty: dto.difficulty } : {}),
      ...(dto.estimatedMinutes !== undefined
        ? { estimatedMinutes: dto.estimatedMinutes }
        : {}),
    };

    return this.assignments.updateTask(id, input);
  }
}
