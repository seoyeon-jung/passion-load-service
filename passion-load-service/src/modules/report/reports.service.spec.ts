import { Test } from '@nestjs/testing';
import { REPORT_REPOSITORY } from '@modules/persistence.tokens';
import { ReportsService } from './reports.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReportsService (UseCase unit)', () => {
  const repo = {
    create: jest.fn(),
    findById: jest.fn(),
    list: jest.fn(),
    saveResult: jest.fn(),
    markSent: jest.fn(),
  };

  let service: ReportsService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: REPORT_REPOSITORY, useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(ReportsService);
  });

  it('create: fromAt > toAt 이면 실패', async () => {
    await expect(
      service.create('org1', {
        studentId: 'student_001',
        fromAt: '2026-03-10T00:00:00.000Z',
        toAt: '2026-03-01T00:00:00.000Z',
        summary: 'x',
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('get: 다른 org 리포트면 NotFound', async () => {
    repo.findById.mockResolvedValue({ id: 'r1', orgId: 'other' });

    await expect(service.get('org1', 'r1')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('list: 필터 없이 호출하면 실패', async () => {
    await expect(service.list('org1', {} as any)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('saveResult: resultUrl/fileId 둘 다 없으면 실패', async () => {
    repo.findById.mockResolvedValue({
      id: 'r1',
      orgId: 'org1',
      status: 'REQUESTED',
    });

    await expect(
      service.saveResult('org1', 'r1', {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('send: GENERATED 아니면 실패', async () => {
    repo.findById.mockResolvedValue({
      id: 'r1',
      orgId: 'org1',
      status: 'REQUESTED',
    });

    await expect(service.send('org1', 'r1')).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('정상 흐름: saveResult -> send', async () => {
    repo.findById.mockResolvedValue({
      id: 'r1',
      orgId: 'org1',
      status: 'GENERATED',
    });
    repo.markSent.mockResolvedValue({ id: 'r1', status: 'SENT' });

    const res = await service.send('org1', 'r1');

    expect(repo.markSent).toHaveBeenCalled();
    expect(res.status).toBe('SENT');
  });
});
