import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SessionRepository } from './session.repository';
import { Session } from '../../domain';
import { toDomainSession, toPrismaSessionCreateData } from './session.mapper';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(session: Session): Promise<Session> {
    const row = await this.prisma.session.create({
        data: toPrismaSessionCreateData(session),
    });
    return toDomainSession(row);
  }

  async findById(id: string): Promise<Session | null> {
    const row = await this.prisma.session.findUnique({
        where: { id },
    });
    return row ? toDomainSession(row) : null;
  }

  async findByOrg(orgId: string): Promise<Session[]> {
    const rows = await this.prisma.session.findMany({
        where: { organizationId: orgId },
        orderBy: { sessionDate: 'desc' },
    });
    return rows.map(toDomainSession);
  }

  async update(session: Session): Promise<Session> {
    const row = await this.prisma.session.update({
      where: { id: session.id },
      data: toPrismaSessionCreateData(session),
    });
    return toDomainSession(row);
  }
}
