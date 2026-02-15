import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../common/prisma/prisma.service';
import type {
  FeedbackRepositoryPort,
  CreateFeedbackInput,
  FeedbackQuery,
} from '../../../ports/feedback.repository.port';
import { toDomainFeedback } from './feedback.mapper';

@Injectable()
export class PrismaFeedbackRepository implements FeedbackRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateFeedbackInput) {
    const row = await this.prisma.feedback.create({
      data: {
        id: input.id,
        organizationId: input.orgId,
        studentId: input.studentId,
        assignmentId: input.assignmentId ?? null,
        content: input.content,
      },
    });

    return toDomainFeedback(row);
  }

  async list(filter: FeedbackQuery) {
    const where: Prisma.FeedbackWhereInput = {
      organizationId: filter.orgId,
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.assignmentId ? { assignmentId: filter.assignmentId } : {}),
    };

    const rows = await this.prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map(toDomainFeedback);
  }
}
