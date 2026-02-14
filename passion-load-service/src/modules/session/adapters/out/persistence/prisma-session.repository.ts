import { Injectable } from '@nestjs/common';
import {
  CreateSessionInput,
  SessionRepositoryPort,
  UpdateSessionInput,
} from '../../../ports/session.repository.port';
import { PrismaService } from '../../../../../common/prisma/prisma.service';
import {
  toDomainSession,
  toPrismaSessionDate,
  toPrismaSessionStatus,
} from './session.mapper';

@Injectable()
export class PrismaSessionRepository implements SessionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateSessionInput) {
    const row = await this.prisma.session.create({
      data: {
        id: input.id,
        organizationId: input.orgId,
        title: input.title,
        sessionDate: toPrismaSessionDate(input.date),
        status: input.status ? toPrismaSessionStatus(input.status) : undefined,
      },
    });
    return toDomainSession(row);
  }

  async findById(id: string) {
    const row = await this.prisma.session.findUnique({
      where: { id },
    });
    return row ? toDomainSession(row) : null;
  }

  async listByOrg(orgId: string) {
    const rows = await this.prisma.session.findMany({
      where: { organizationId: orgId },
      orderBy: { sessionDate: 'asc' },
    });
    return rows.map(toDomainSession);
  }

  async update(id: string, input: UpdateSessionInput) {
    const row = await this.prisma.session.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
        sessionDate: input.date ? toPrismaSessionDate(input.date) : undefined,
        status: input.status ? toPrismaSessionStatus(input.status) : undefined,
      },
    });
    return toDomainSession(row);
  }
}
