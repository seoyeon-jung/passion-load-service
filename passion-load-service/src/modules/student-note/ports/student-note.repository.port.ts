export type StudentNote = {
  id: string;
  orgId: string;
  studentId: string;
  noteDate: string; // yyyy-mm-dd
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertStudentNoteInput = {
  orgId: string;
  studentId: string;
  noteDate: string; // yyyy-mm-dd
  content: string;
};

export type StudentNoteFilter = {
  orgId: string;
  studentId?: string;
  date?: string; // yyyy-mm-dd
};

export interface StudentNoteRepositoryPort {
  upsert(input: UpsertStudentNoteInput): Promise<StudentNote>;
  list(filter: StudentNoteFilter): Promise<StudentNote[]>;
}
