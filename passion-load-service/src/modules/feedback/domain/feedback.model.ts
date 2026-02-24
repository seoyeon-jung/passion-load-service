export type Feedback = {
  id: string;
  orgId: string;
  studentId: string;
  teacherId: string;
  assignmentId: string | null;

  content: string;
  createdAt: Date;
  updatedAt: Date;
};
