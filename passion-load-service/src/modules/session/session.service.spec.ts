import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SessionService } from './session.service';
import { SESSION_REPOSITORY } from '../persistence.tokens';
import { SessionStatus } from '@common/types/enums';

describe('SessionService (UseCase unit)', () => {
  const sessionsRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    listByOrg: jest.fn(),
    update: jest.fn(),
  };

  let service: SessionService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: SESSION_REPOSITORY, useValue: sessionsRepo },
      ],
    }).compile();

    service = moduleRef.get(SessionService);
  });

  it('create: PLANNED 상태로 생성', async () => {
    sessionsRepo.create.mockResolvedValue({ ok: true });

    await service.create('org1', { title: 't', date: '2026-03-01' });

    expect(sessionsRepo.create).toHaveBeenCalledTimes(1);
    const arg = sessionsRepo.create.mock.calls[0][0];
    expect(arg.orgId).toBe('org1');
    expect(arg.title).toBe('t');
    expect(arg.date).toBe('2026-03-01');
    expect(arg.status).toBe(SessionStatus.PLANNED);
    expect(typeof arg.id).toBe('string');
  });

  it('get: 다른 org 데이터면 404', async () => {
    sessionsRepo.findById.mockResolvedValue({
      id: 's1',
      orgId: 'org2',
      title: 't',
      date: '2026-03-01',
      status: SessionStatus.PLANNED,
    });

    await expect(service.get('org1', 's1')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('updateStatus: 허용 전이(PLANNED -> ACTIVE) 성공', async () => {
    sessionsRepo.findById.mockResolvedValue({
      id: 's1',
      orgId: 'org1',
      title: 't',
      date: '2026-03-01',
      status: SessionStatus.PLANNED,
    });
    sessionsRepo.update.mockResolvedValue({ id: 's1', status: 'ACTIVE' });

    await service.updateStatus('org1', 's1', SessionStatus.ACTIVE);

    expect(sessionsRepo.update).toHaveBeenCalledWith('s1', {
      status: SessionStatus.ACTIVE,
    });
  });

  it('updateStatus: 잘못된 전이(PLANNED -> DONE)면 400', async () => {
    sessionsRepo.findById.mockResolvedValue({
      id: 's1',
      orgId: 'org1',
      title: 't',
      date: '2026-03-01',
      status: SessionStatus.PLANNED,
    });

    await expect(
      service.updateStatus('org1', 's1', SessionStatus.DONE)
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
