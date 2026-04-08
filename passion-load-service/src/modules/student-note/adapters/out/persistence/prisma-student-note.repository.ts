import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type {
  StudentNoteRepositoryPort,
  UpsertStudentNoteInput,
  StudentNoteFilter,
  StudentNote,
} from '../../../ports/student-note.repository.port';
import { toDomainStudentNote, toPrismaDate } from './student-note.mapper';

@Injectable()
export class PrismaStudentNoteRepository implements StudentNoteRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(input: UpsertStudentNoteInput): Promise<StudentNote> {
    const noteDate = toPrismaDate(input.noteDate);

    const row = await this.prisma.studentNote.upsert({
      where: {
        organizationId_studentId_noteDate: {
          organizationId: input.orgId,
          studentId: input.studentId,
          noteDate,
        },
      },
      create: {
        organizationId: input.orgId,
        studentId: input.studentId,
        noteDate,
        content: input.content,
      },
      update: {
        content: input.content,
      },
    });

    return toDomainStudentNote(row);
  }

  async list(filter: StudentNoteFilter): Promise<StudentNote[]> {
    const where: Prisma.StudentNoteWhereInput = {
      organizationId: filter.orgId,
      ...(filter.studentId ? { studentId: filter.studentId } : {}),
      ...(filter.date ? { noteDate: toPrismaDate(filter.date) } : {}),
    };

    const rows = await this.prisma.studentNote.findMany({
      where,
      orderBy: [{ noteDate: 'desc' }],
    });

    return rows.map(toDomainStudentNote);
  }
}
