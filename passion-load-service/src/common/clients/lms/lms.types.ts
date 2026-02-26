export type LmsTeacher = {
  id: string;
  name: string;
  email?: string;
};

export type LmsStudent = {
  id: string;
  name: string;
  email?: string;
};

export type LmsQuestion = {
  id: string;
  studentId: string;
  content: string;
  createdAt: string;
};

export type LmsListResponse<T> = {
  items: T[];
};
