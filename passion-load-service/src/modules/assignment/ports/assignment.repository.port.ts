import { DailyAssignmentStatus } from '@prisma/client';

type BaseAssignment = {
  id: string;
  orgId: string;
  sessionId: string | null;
  studentId: string;
  assignmentDate: string; // yyyy-mm-dd
  createdAt: Date;
  updatedAt: Date;
};

export type Task = BaseAssignment & {
  assignmentType: 'TASK';
  title: string | null;
  body: string | null;
  dueAt: Date | null;
  status: DailyAssignmentStatus;
  incompletionReason: string | null;
  subject: string | null;
  categoryType: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
};

export type DailyCheck = BaseAssignment & {
  assignmentType: 'DAILY_CHECK';
  checked: boolean;
  contactMade: boolean;
  checkMemo: string | null;
};

export type DailyAssignment = Task | DailyCheck;

export type CreateTaskInput = {
  id: string;
  orgId: string;
  sessionId: string;
  studentId: string;
  assignmentDate: string;
  title?: string | null;
  body?: string | null;
  dueAt?: Date | null;
  status?: DailyAssignmentStatus;
  incompletionReason?: string | null;
  subject?: string | null;
  categoryType?: string | null;
  difficulty?: string | null;
  estimatedMinutes?: number | null;
};

export type UpdateTaskInput = Partial<{
  title: string | null;
  body: string | null;
  dueAt: Date | null;
  status: DailyAssignmentStatus;
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
  assignmentDate: string;
  checked: boolean;
  contactMade: boolean;
  checkMemo?: string | null;
};

export interface AssignmentRepositoryPort {
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(id: string, input: UpdateTaskInput): Promise<Task>;
  findById(id: string): Promise<DailyAssignment | null>;

  list(filter: {
    orgId: string;
    studentId?: string;
    sessionId?: string;
    date?: string;
    type?: 'TASK' | 'DAILY_CHECK';
  }): Promise<DailyAssignment[]>;

  upsertDailyCheck(input: UpsertDailyCheckInput): Promise<DailyCheck>;
}
