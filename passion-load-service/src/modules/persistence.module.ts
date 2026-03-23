import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/prisma/prisma.module';

import { PrismaSessionRepository } from './session/adapters/out/persistence/prisma-session.repository';
import { PrismaSubmissionRepository } from './submission/adapters/out/persistence/prisma-submission.repository';
import { PrismaFeedbackRepository } from './feedback/adapters/out/persistence/prisma-feedback.repository';
import { PrismaReportRepository } from './report/adapters/out/persistence/prisma-report.repository';

import {
  SESSION_REPOSITORY,
  TASK_REPOSITORY,
  DAILY_CHECK_REPOSITORY,
  SUBMISSION_REPOSITORY,
  FEEDBACK_REPOSITORY,
  REPORT_REPOSITORY,
} from './persistence.tokens';
import { PrismaTaskRepository } from './assignment/adapters/out/persistence/prisma-task.repository';
import { PrismaDailyCheckRepository } from './assignment/adapters/out/persistence/prisma-daily-check.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: SESSION_REPOSITORY, useClass: PrismaSessionRepository },
    { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository },
    { provide: DAILY_CHECK_REPOSITORY, useClass: PrismaDailyCheckRepository },
    { provide: SUBMISSION_REPOSITORY, useClass: PrismaSubmissionRepository },
    { provide: FEEDBACK_REPOSITORY, useClass: PrismaFeedbackRepository },
    { provide: REPORT_REPOSITORY, useClass: PrismaReportRepository },
  ],
  exports: [
    SESSION_REPOSITORY,
    TASK_REPOSITORY,
    DAILY_CHECK_REPOSITORY,
    SUBMISSION_REPOSITORY,
    FEEDBACK_REPOSITORY,
    REPORT_REPOSITORY,
  ],
})
export class PersistenceModule {}
