import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../common/prisma/prisma.service';
import { AssignmentType } from '../../../../../common/types/enums';
import type {
  AssignmentRepositoryPort,
  CreateTaskInput,
  UpdateTaskInput,
  UpsertDailyCheckInput,
} from '../../../ports/assignment.repository.port';
import {
  toDomainAssignment,
  toPrismaAssignmentDate,
  toPrismaAssignmentType,
} from './assignment.mapper';

@Injectable()
export class PrismaAssignmentRepository implements AssignmentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(input: CreateTaskInput) {
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

    return toDomainAssignment(row);
  }

  async updateTask(id: string, input: UpdateTaskInput) {
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

    return toDomainAssignment(row);
  }

  async findById(id: string) {
    const row = await this.prisma.dailyAssignment.findUnique({ where: { id } });
    return row ? toDomainAssignment(row) : null;
  }

  async list(filter: {
    orgId: string;
    studentId?: string;
    sessionId?: string;
    date?: string;
    type?: AssignmentType;
  }) {
    const where: Prisma.DailyAssignmentWhereInput = {
      organizationId: filter.orgId,
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.sessionId ? { sessionId: filter.sessionId } : {}),
      ...(filter.date
        ? { assignmentDate: toPrismaAssignmentDate(filter.date) }
        : {}),
      ...(filter.type
        ? { assignmentType: toPrismaAssignmentType(filter.type) }
        : {}),
    };

    const rows = await this.prisma.dailyAssignment.findMany({
      where,
      orderBy: [{ assignmentDate: 'asc' }, { createdAt: 'asc' }],
    });

    return rows.map(toDomainAssignment);
  }

  async upsertDailyCheck(input: UpsertDailyCheckInput) {
    const assignmentDate = toPrismaAssignmentDate(input.assignmentDate);

    const row = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const existing = await tx.dailyAssignment.findFirst({
          where: {
            organizationId: input.orgId,
            studentId: input.studentId,
            assignmentType: toPrismaAssignmentType(AssignmentType.DAILY_CHECK),
            assignmentDate,
          },
        });

        if (!existing) {
          return tx.dailyAssignment.create({
            data: {
              organizationId: input.orgId,
              sessionId: null,
              studentId: input.studentId,

              assignmentDate,
              assignmentType: toPrismaAssignmentType(
                AssignmentType.DAILY_CHECK
              ),

              checked: input.checked,
              contactMade: input.contactMade,
              checkMemo: input.checkMemo ?? null,

              // TASK 필드들은 null로
              title: null,
              body: null,
              dueAt: null,
              incompletionReason: null,
            },
          });
        }

        return tx.dailyAssignment.update({
          where: { id: existing.id },
          data: {
            checked: input.checked,
            contactMade: input.contactMade,
            checkMemo: input.checkMemo ?? null,
          },
        });
      }
    );

    return toDomainAssignment(row);
  }
}
