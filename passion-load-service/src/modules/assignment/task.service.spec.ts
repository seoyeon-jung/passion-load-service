import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  SESSION_REPOSITORY,
  TASK_REPOSITORY,
} from '@modules/persistence.tokens';
import { AssignmentType } from '@common/types/enums';
import { TaskService } from '@modules/assignment/task.service';

describe('TaskService (UseCase unit)', () => {
  const assignmentRepo = {
    createTask: jest.fn(),
    findById: jest.fn(),
    listTasks: jest.fn(),
    updateTask: jest.fn(),
  };

  const sessionRepo = {
    findById: jest.fn(),
  };

  let service: TaskService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TASK_REPOSITORY, useValue: assignmentRepo },
        { provide: SESSION_REPOSITORY, useValue: sessionRepo },
      ],
    }).compile();

    service = moduleRef.get(TaskService);
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

  it('listTasks: type=TASK로 list 호출', async () => {
    assignmentRepo.listTasks.mockResolvedValue([]);

    await service.listTasks('org1', { studentId: 'stu1' } as any);

    expect(assignmentRepo.listTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        orgId: 'org1',
        studentId: 'stu1',
      })
    );
  });
});
