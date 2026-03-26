import { Test } from '@nestjs/testing';
import {
  FEEDBACK_REPOSITORY,
  ASSIGNMENT_USE_CASE,
} from '@modules/persistence.tokens';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FeedbacksService } from './feedback.service';

describe('FeedbacksService (UseCase unit)', () => {
  const feedbackRepo = {
    create: jest.fn(),
    list: jest.fn(),
  };

  const assignmentUseCase = {
    validateAssignment: jest.fn(),
  };

  let service: FeedbacksService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        FeedbacksService,
        { provide: FEEDBACK_REPOSITORY, useValue: feedbackRepo },
        { provide: ASSIGNMENT_USE_CASE, useValue: assignmentUseCase },
      ],
    }).compile();

    service = moduleRef.get(FeedbacksService);
  });

  it('teacherId 없으면 실패', async () => {
    await expect(
      service.create('org1', undefined, { studentId: 's1', content: 'ok' })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('content 250자 초과면 실패', async () => {
    const long = 'a'.repeat(251);
    await expect(
      service.create('org1', 't1', { studentId: 's1', content: long })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('assignmentId가 다른 org의 데이터면 실패', async () => {
    assignmentUseCase.validateAssignment.mockRejectedValue(
      // 변경
      new NotFoundException('assignment not found')
    );

    await expect(
      service.create('org1', 't1', {
        studentId: 's1',
        content: 'ok',
        assignmentId: 'a1',
      })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('정상 생성', async () => {
    assignmentUseCase.validateAssignment.mockResolvedValue(undefined); // 변경
    feedbackRepo.create.mockResolvedValue({ id: 'f1' });

    const res = await service.create('org1', 't1', {
      studentId: 's1',
      assignmentId: 'a1',
      content: 'ok',
    });

    expect(feedbackRepo.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 'f1' });
  });
});
