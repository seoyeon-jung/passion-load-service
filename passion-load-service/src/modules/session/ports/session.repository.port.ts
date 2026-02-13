import { SessionStatus } from "../../../common/types/enums";
import { Session } from "../session.model";

export type CreateSessionInput = {
  id: string;
  orgId: string;
  title: string;
  date: string;
  status?: SessionStatus
}

export type UpdateSessionInput = Partial<Pick<Session, 'title' | 'date' | 'status'>>;

export interface SessionRepositoryPort {
  create(input: CreateSessionInput): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  listByOrg(orgId: string): Promise<Session[]>;
  update(id: string, input: UpdateSessionInput): Promise<Session>;
}