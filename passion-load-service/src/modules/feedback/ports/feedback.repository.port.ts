import { Feedback } from "../feedback.model";

export type CreateFeedbackInput = {
  id: string;
  orgId: string;
  studentId: string;
  assignmentId?: string | null;
  content: string;
};

export type FeedbackQuery = {
  orgId: string;
  studentId?: string;
  assignmentId?: string;
};

export interface FeedbackRepositoryPort {
  create(input: CreateFeedbackInput): Promise<Feedback>;
  list(filter: FeedbackQuery): Promise<Feedback[]>;
}