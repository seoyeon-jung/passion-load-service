// Mock LmsClient (추후 삭제 예정)

import { LmsClient } from "./lms.client";
import { LmsQuestion, LmsStudent, LmsTeacher } from "./lms.types";

export class LmsMockAdapter implements LmsClient {
  async getTeachersByOrganization(orgId: string): Promise<LmsTeacher[]> {
    return [{ id: 'teacher_001', name: 'Mock Teacher', email: 'teacher@example.com' }];
  }

  async getStudentsByOrganization(orgId: string): Promise<LmsStudent[]> {
    return [
      { id: 'student_123', name: 'Mock Student A', email: 'a@example.com' },
      { id: 'student_456', name: 'Mock Student B', email: 'b@example.com' },
    ];
  }

  async getQuestionsByOrganization(orgId: string): Promise<LmsQuestion[]> {
    return [
      {
        id: 'q1',
        studentId: 'student_123',
        content: '상담 요청합니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: 'q2',
        studentId: 'student_123',
        content: '추가 질문이 있어요.',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}