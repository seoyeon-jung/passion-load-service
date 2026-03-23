import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma/prisma.service';
import { AssignmentType } from '@common/types/enums';
import type {
  CreateTaskInput,
  UpdateTaskInput,
  Task,
  TaskRepositoryPort,
  TaskFilter,
} from '../../../ports/assignment.repository.port';
import {
  toDomainAssignment,
  toPrismaAssignmentDate,
  toPrismaAssignmentType,
} from './assignment.mapper';

@Injectable()
export class PrismaTaskRepository implements TaskRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    const row = await this.prisma.dailyAssignment.create({
      data: {
        id: input.id,
        organizationId: input.orgId,
        sessionId: input.sessionId ?? null,
        studentId: input.studentId,

        assignmentDate: toPrismaAssignmentDate(input.assignmentDate),
        assignmentType: toPrismaAssignmentType(AssignmentType.TASK),

        title: input.title ?? null,
        body: input.body ?? null,
        dueAt: input.dueAt ?? null,

        status: input.status ?? undefined,
        incompletionReason: input.incompletionReason ?? null,

        subject: input.subject ?? null,
        categoryType: input.categoryType ?? null,
        difficulty: input.difficulty ?? null,
        estimatedMinutes: input.estimatedMinutes ?? null,

        checked: false,
        contactMade: false,
        checkMemo: null,
      },
    });

    return toDomainAssignment(row) as Task;
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const row = await this.prisma.dailyAssignment.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
        body: input.body ?? undefined,
        dueAt: input.dueAt ?? undefined,
        status: input.status ?? undefined,
        incompletionReason: input.incompletionReason ?? undefined,

        subject: input.subject ?? undefined,
        categoryType: input.categoryType ?? undefined,
        difficulty: input.difficulty ?? undefined,
        estimatedMinutes: input.estimatedMinutes ?? undefined,
      },
    });

    return toDomainAssignment(row) as Task;
  }

  async findById(id: string): Promise<Task | null> {
    const row = await this.prisma.dailyAssignment.findUnique({ where: { id } });
    return row ? (toDomainAssignment(row) as Task) : null;
  }

  async listTasks(filter: TaskFilter): Promise<Task[]> {
    const where: Prisma.DailyAssignmentWhereInput = {
      organizationId: filter.orgId,
      assignmentType: toPrismaAssignmentType(AssignmentType.TASK), // 항상 TASK 고정
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.sessionId ? { sessionId: filter.sessionId } : {}),
      ...(filter.date
        ? { assignmentDate: toPrismaAssignmentDate(filter.date) }
        : {}),
    };

    const rows = await this.prisma.dailyAssignment.findMany({
      where,
      orderBy: [{ assignmentDate: 'asc' }, { createdAt: 'asc' }],
    });

    return rows.map((row) => toDomainAssignment(row) as Task);
  }
}
