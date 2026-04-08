import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STUDENT_NOTE_REPOSITORY } from '@modules/persistence.tokens';
import type { StudentNoteRepositoryPort } from './ports/student-note.repository.port';
import type {
  UpsertStudentNoteDto,
  ListStudentNoteQueryDto,
} from './adapters/in/student-note.dto';

@Injectable()
export class StudentNoteService {
  constructor(
    @Inject(STUDENT_NOTE_REPOSITORY)
    private readonly studentNotes: StudentNoteRepositoryPort
  ) {}

  async upsert(orgId: string, dto: UpsertStudentNoteDto) {
    return this.studentNotes.upsert({
      orgId,
      studentId: dto.studentId,
      noteDate: dto.date,
      content: dto.content,
    });
  }

  async list(orgId: string, query: ListStudentNoteQueryDto) {
    if (!query.studentId && !query.date) {
      throw new BadRequestException(
        'at least one filter is required: studentId or date'
      );
    }

    return this.studentNotes.list({
      orgId,
      studentId: query.studentId,
      date: query.date,
    });
  }
}
