import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DailyCheckService } from '@modules/assignment/daily-check.service';
import { DAILY_CHECK_REPOSITORY } from '@modules/persistence.tokens';

describe('DailyCheckService (UseCase unit)', () => {
  const assignmentRepo = {
    list: jest.fn(),
    upsertDailyCheck: jest.fn(),
  };

  let service: DailyCheckService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        DailyCheckService,
        { provide: DAILY_CHECK_REPOSITORY, useValue: assignmentRepo },
        // SESSION_REPOSITORY 없음 — DailyCheckService는 불필요
      ],
    }).compile();

    service = moduleRef.get(DailyCheckService);
  });

  it('listDailyChecks: date/studentId 둘 다 없으면 400', async () => {
    await expect(
      service.listDailyChecks('org1', {} as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
