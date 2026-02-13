export type Feedback = {
  id: string;
  orgId: string;
  submissionId: string;
  teacherId: string;

  content: string;

  createdAt: Date;
};
