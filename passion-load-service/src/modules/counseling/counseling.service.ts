import type { LmsClient } from '@common/clients/lms/lms.client';
import { LMS_CLIENT } from '@common/clients/lms/lms.token';
import { Inject, Injectable } from '@nestjs/common';
import { CounselingStatusItemDto } from './adapters/in/counseling.dto';

@Injectable()
export class CounselingService {
  constructor(@Inject(LMS_CLIENT) private readonly lms: LmsClient) {}

  async getStatus(
    orgId: string,
    studentId?: string
  ): Promise<CounselingStatusItemDto[]> {
    const [students, questions] = await Promise.all([
      this.lms.getStudentsByOrganization(orgId),
      this.lms.getQuestionsByOrganization(orgId),
    ]);

    const targetStudents = studentId
      ? students.filter((s) => s.id === studentId)
      : students;

    const byStudent = new Map<string, typeof questions>();
    for (const q of questions) {
      const arr = byStudent.get(q.studentId) ?? [];
      arr.push(q);
      byStudent.set(q.studentId, arr);
    }

    return targetStudents.map((s) => {
      const qs = (byStudent.get(s.id) ?? []).slice().sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      const last = qs[0];

      return {
        studentId: s.id,
        name: s.name,
        email: s.email,

        questionsCount: qs.length,
        lastQuestionAt: last?.createdAt,
        lastQuestionContent: last?.content,
      };
    });
  }
}
