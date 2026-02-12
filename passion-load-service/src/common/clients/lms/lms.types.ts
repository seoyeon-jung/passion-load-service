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

export type LmsListResponse<T> = {
  items: T[];
};
