import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { STUDENT_NOTE_REPOSITORY } from '@modules/persistence.tokens';
import { StudentNoteService } from './student-note.service';

describe('StudentNoteService (UseCase unit)', () => {
  const studentNoteRepo = {
    upsert: jest.fn(),
    list: jest.fn(),
  };

  let service: StudentNoteService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        StudentNoteService,
        { provide: STUDENT_NOTE_REPOSITORY, useValue: studentNoteRepo },
      ],
    }).compile();

    service = moduleRef.get(StudentNoteService);
  });

  it('upsert: 정상 저장', async () => {
    studentNoteRepo.upsert.mockResolvedValue({ id: 'n1' });

    const res = await service.upsert('org1', {
      studentId: 'stu1',
      date: '2026-05-27',
      content: '오늘 공부 잘했어요.',
    });

    expect(studentNoteRepo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: 'org1',
        studentId: 'stu1',
        noteDate: '2026-05-27',
        content: '오늘 공부 잘했어요.',
      })
    );
    expect(res).toEqual({ id: 'n1' });
  });

  it('list: 필터 없으면 400', async () => {
    await expect(service.list('org1', {} as any)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('list: studentId 필터로 조회', async () => {
    studentNoteRepo.list.mockResolvedValue([]);

    await service.list('org1', { studentId: 'stu1' });

    expect(studentNoteRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: 'org1',
        studentId: 'stu1',
      })
    );
  });
});
