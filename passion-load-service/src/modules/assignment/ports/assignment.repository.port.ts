import { DailyAssignmentStatus } from '@prisma/client';
import { AssignmentType } from '../../../common/types/enums';

export type DailyAssignment = {
  id: string;
  orgId: string;
  sessionId: string | null; // TASK: sessionId, DAILY_CHECK: null
  studentId: string;

  assignmentDate: string; // yyyy-mm-dd
  assignmentType: AssignmentType;

  // TASK
  title: string | null;
  body: string | null;
  dueAt: Date | null;
  status: string;
  incompletionReason: string | null;

  // 선택 필드
  subject: string | null;
  categoryType: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;

  // DAILY_CHECK
  checked: boolean;
  contactMade: boolean;
  checkMemo: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskInput = {
  id: string;
  orgId: string;
  sessionId: string;
  studentId: string;
  assignmentDate: string; // yyyy-mm-dd

  title?: string | null;
  body?: string | null;
  dueAt?: Date | null;

  status?: DailyAssignmentStatus;
  incompletionReason?: string | null;

  // 선택 필드
  subject?: string | null;
  categoryType?: string | null;
  difficulty?: string | null;
  estimatedMinutes?: number | null;
};

export type UpdateTaskInput = Partial<{
  title: string | null;
  body: string | null;
  dueAt: Date | null;
  status: string;
  incompletionReason: string | null;

  subject: string | null;
  categoryType: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
}>;

export type UpsertDailyCheckInput = {
  id: string;
  orgId: string;
  studentId: string;
  assignmentDate: string; // yyyy-mm-dd
  checked: boolean;
  contactMade: boolean;
  checkMemo?: string | null;
};

export interface AssignmentRepositoryPort {
  createTask(input: CreateTaskInput): Promise<DailyAssignment>;
  updateTask(id: string, input: UpdateTaskInput): Promise<DailyAssignment>;
  findById(id: string): Promise<DailyAssignment | null>;

  list(filter: {
    orgId: string;
    studentId?: string;
    sessionId?: string;
    date?: string; // yyyy-mm-dd
    type?: AssignmentType;
  }): Promise<DailyAssignment[]>;

  upsertDailyCheck(input: UpsertDailyCheckInput): Promise<DailyAssignment>;
}
