export type Feedback = {
  id: string;
  orgId: string;
  studentId: string;
  assignmentId: string | null;

  content: string;
  createdAt: Date;
};