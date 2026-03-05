import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ASSIGNMENT_REPOSITORY,
  SESSION_REPOSITORY,
} from '@modules/persistence.tokens';
import { AssignmentType } from '@common/types/enums';
import { AssignmentService } from '@modules/assignment/assignments.service';

describe('AssignmentService (UseCase unit)', () => {
  const assignmentRepo = {
    createTask: jest.fn(),
    findById: jest.fn(),
    list: jest.fn(),
    updateTask: jest.fn(),
    upsertDailyCheck: jest.fn(),
  };

  const sessionRepo = {
    findById: jest.fn(),
  };

  let service: AssignmentService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AssignmentService,
        { provide: ASSIGNMENT_REPOSITORY, useValue: assignmentRepo },
        { provide: SESSION_REPOSITORY, useValue: sessionRepo },
      ],
    }).compile();

    service = moduleRef.get(AssignmentService);
  });

  it('createTask: session이 없거나 org 다르면 404', async () => {
    sessionRepo.findById.mockResolvedValue(null);

    await expect(
      service.createTask('org1', {
        sessionId: 'sess1',
        studentId: 'stu1',
        assignmentDate: '2026-03-01',
        title: 't',
        body: 'b',
        dueDate: undefined,
        status: 'SCHEDULED' as any,
      })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getTask: TASK가 아니면 400', async () => {
    assignmentRepo.findById.mockResolvedValue({
      id: 'a1',
      orgId: 'org1',
      assignmentType: AssignmentType.DAILY_CHECK,
    });

    await expect(service.getTask('org1', 'a1')).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('getTask: 다른 org면 404', async () => {
    assignmentRepo.findById.mockResolvedValue({
      id: 'a1',
      orgId: 'org2',
      assignmentType: AssignmentType.TASK,
    });

    await expect(service.getTask('org1', 'a1')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('listDailyChecks: date/studentId 둘 다 없으면 400', async () => {
    await expect(
      service.listDailyChecks('org1', {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('listTasks: type=TASK로 list 호출', async () => {
    assignmentRepo.list.mockResolvedValue([]);

    await service.listTasks('org1', { studentId: 'stu1' } as any);

    expect(assignmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: 'org1',
        type: AssignmentType.TASK,
        studentId: 'stu1',
      })
    );
  });
});
