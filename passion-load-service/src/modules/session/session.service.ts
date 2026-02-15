import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SESSION_REPOSITORY } from '../persistence.tokens';
import type { SessionRepositoryPort } from './ports/session.repository.port';
import { randomUUID } from 'crypto';
import { SessionStatus } from '../../common/types/enums';

const ALLOWED_NEXT: Record<SessionStatus, SessionStatus[]> = {
  [SessionStatus.PLANNED]: [SessionStatus.ACTIVE],
  [SessionStatus.ACTIVE]: [SessionStatus.DONE],
  [SessionStatus.DONE]: [],
};

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessions: SessionRepositoryPort
  ) {}

  async create(orgId: string, input: { title: string; date: string }) {
    return this.sessions.create({
      id: randomUUID(),
      orgId,
      title: input.title,
      date: input.date,
      status: SessionStatus.PLANNED,
    });
  }

  async get(orgId: string, id: string) {
    const session = await this.sessions.findById(id);

    if (!session || session.orgId !== orgId) {
      throw new NotFoundException('session not found');
    }

    return session;
  }

  async list(orgId: string) {
    return this.sessions.listByOrg(orgId);
  }

  async update(
    orgId: string,
    id: string,
    input: { title?: string; date?: string; status?: SessionStatus }
  ) {
    await this.get(orgId, id);
    return this.sessions.update(id, input);
  }

  async updateStatus(orgId: string, id: string, nextStatus: SessionStatus) {
    const current = await this.get(orgId, id);

    const allowed = ALLOWED_NEXT[current.status] ?? [];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `invalid status transition: ${current.status} -> ${nextStatus}`
      );
    }

    return this.sessions.update(id, { status: nextStatus });
  }
}
