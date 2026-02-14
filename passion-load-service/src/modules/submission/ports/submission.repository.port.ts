import { SubmissionStatus } from '../../../common/types/enums';

export type AssignmentSubmission = {
  id: string;
  orgId: string;
  assignmentId: string;
  studentId: string;

  status: SubmissionStatus;
  reason: string | null;
  scheduleNote: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type UpsertSubmissionInput = {
  orgId: string;
  assignmentId: string;
  studentId: string;

  status: SubmissionStatus;
  reason?: string | null;
  scheduleNote?: string | null;
};

export type SubmissionQuery = {
  orgId: string;
  assignmentId?: string;
  studentId?: string;
  date?: string; // yyyy-mm-dd
};

export interface SubmissionRepositoryPort {
  upsert(input: UpsertSubmissionInput): Promise<AssignmentSubmission>;
  findByAssignmentAndStudent(
    assignmentId: string,
    studentId: string
  ): Promise<AssignmentSubmission | null>;
  list(filter: SubmissionQuery): Promise<AssignmentSubmission[]>;
}
