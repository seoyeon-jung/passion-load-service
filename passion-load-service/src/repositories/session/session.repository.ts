import { Session } from '../../domain';

export interface SessionRepository {
  create(session: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  findByOrg(orgId: string): Promise<Session[]>;
  update(session: Session): Promise<Session>;
}