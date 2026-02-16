import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma/prisma.service';
import { fromYyyyMmDd } from '@common/types/date';
import type {
  SubmissionRepositoryPort,
  UpsertSubmissionInput,
  SubmissionQuery,
} from '../../../ports/submission.repository.port';
import { toDomainSubmission } from './submission.mapper';

@Injectable()
export class PrismaSubmissionRepository implements SubmissionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(input: UpsertSubmissionInput) {
    const row = await this.prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
        },
      },
      create: {
        organizationId: input.orgId,
        assignmentId: input.assignmentId,
        studentId: input.studentId,
        status: input.status as unknown as any,
        reason: input.reason ?? null,
        scheduleNote: input.scheduleNote ?? null,
      },
      update: {
        status: input.status as unknown as any,
        reason: input.reason ?? undefined,
        scheduleNote: input.scheduleNote ?? undefined,
      },
    });

    return toDomainSubmission(row);
  }

  async findByAssignmentAndStudent(assignmentId: string, studentId: string) {
    const row = await this.prisma.assignmentSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } },
    });
    return row ? toDomainSubmission(row) : null;
  }

  async list(filter: SubmissionQuery) {
    // 제출은 assignmentSubmission 자체에는 date가 없어서,
    // date로 찾으려면 DailyAssignment와 join(relationship) 필요
    const where: Prisma.AssignmentSubmissionWhereInput = {
      organizationId: filter.orgId,
      ...(filter.assignmentId ? { assignmentId: filter.assignmentId } : {}),
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.date
        ? {
            assignment: {
              assignmentDate: fromYyyyMmDd(filter.date),
            },
          }
        : {}),
    };

    const rows = await this.prisma.assignmentSubmission.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
    });

    return rows.map(toDomainSubmission);
  }
}
