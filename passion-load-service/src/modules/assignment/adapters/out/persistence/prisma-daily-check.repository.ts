import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma/prisma.service';
import { AssignmentType } from '@common/types/enums';
import type {
  DailyCheckRepositoryPort,
  UpsertDailyCheckInput,
  DailyCheckFilter,
  DailyCheck,
} from '../../../ports/assignment.repository.port';
import {
  toDomainAssignment,
  toPrismaAssignmentDate,
  toPrismaAssignmentType,
} from './assignment.mapper';

@Injectable()
export class PrismaDailyCheckRepository implements DailyCheckRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<DailyCheck | null> {
    const row = await this.prisma.dailyAssignment.findUnique({ where: { id } });
    return row ? (toDomainAssignment(row) as DailyCheck) : null;
  }

  async listDailyChecks(filter: DailyCheckFilter): Promise<DailyCheck[]> {
    const where: Prisma.DailyAssignmentWhereInput = {
      organizationId: filter.orgId,
      assignmentType: toPrismaAssignmentType(AssignmentType.DAILY_CHECK), // 항상 DAILY_CHECK 고정
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.date
        ? { assignmentDate: toPrismaAssignmentDate(filter.date) }
        : {}),
    };

    const rows = await this.prisma.dailyAssignment.findMany({
      where,
      orderBy: [{ assignmentDate: 'asc' }, { createdAt: 'asc' }],
    });

    return rows.map((row) => toDomainAssignment(row) as DailyCheck);
  }

  async upsertDailyCheck(input: UpsertDailyCheckInput): Promise<DailyCheck> {
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
              id: input.id,
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

    return toDomainAssignment(row) as DailyCheck;
  }
}
