import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ASSIGNMENT_REPOSITORY,
  SUBMISSION_REPOSITORY,
} from '@modules/persistence.tokens';
import { AssignmentType } from '@common/types/enums';
import { SubmissionService } from './submissions.service';

describe('SubmissionService (UseCase unit)', () => {
  const submissionRepo = {
    upsert: jest.fn(),
    list: jest.fn(),
  };

  const assignmentRepo = {
    findById: jest.fn(),
  };

  let service: SubmissionService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubmissionService,
        { provide: SUBMISSION_REPOSITORY, useValue: submissionRepo },
        { provide: ASSIGNMENT_REPOSITORY, useValue: assignmentRepo },
      ],
    }).compile();

    service = moduleRef.get(SubmissionService);
  });

  it('upsert: assignment가 없거나 org 다르면 404', async () => {
    assignmentRepo.findById.mockResolvedValue(null);

    await expect(
      service.upsert('org1', {
        assignmentId: 'a1',
        studentId: 'stu1',
        status: 'SUBMITTED' as any,
      })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('upsert: TASK가 아닌 assignment면 400', async () => {
    assignmentRepo.findById.mockResolvedValue({
      id: 'a1',
      orgId: 'org1',
      assignmentType: AssignmentType.DAILY_CHECK,
    });

    await expect(
      service.upsert('org1', {
        assignmentId: 'a1',
        studentId: 'stu1',
        status: 'SUBMITTED' as any,
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('upsert: 정상 호출 시 submissions.upsert 실행', async () => {
    assignmentRepo.findById.mockResolvedValue({
      id: 'a1',
      orgId: 'org1',
      assignmentType: AssignmentType.TASK,
    });
    submissionRepo.upsert.mockResolvedValue({ id: 's1' });

    await service.upsert('org1', {
      assignmentId: 'a1',
      studentId: 'stu1',
      status: 'SUBMITTED' as any,
    });

    expect(submissionRepo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: 'org1',
        assignmentId: 'a1',
        studentId: 'stu1',
      })
    );
  });

  it('list: 필터 없으면 400', async () => {
    await expect(service.list('org1', {} as any)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('list: 필터 있으면 submissions.list 호출', async () => {
    submissionRepo.list.mockResolvedValue([]);

    await service.list('org1', { assignmentId: 'a1' } as any);

    expect(submissionRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: 'org1',
        assignmentId: 'a1',
      })
    );
  });
});
