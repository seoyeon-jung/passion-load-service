import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { AssignmentsController } from './adapters/in/assignments.controller';
import { DailyChecksController } from './adapters/in/daily-checks.controller';
import { TaskService } from './task.service';
import { DailyCheckService } from './daily-check.service';
import { ASSIGNMENT_USE_CASE } from '@modules/persistence.tokens';

@Module({
  imports: [PersistenceModule],
  controllers: [AssignmentsController, DailyChecksController],
  providers: [
    TaskService,
    DailyCheckService,
    { provide: ASSIGNMENT_USE_CASE, useClass: TaskService },
  ],
  exports: [ASSIGNMENT_USE_CASE],
})
export class AssignmentModule {}
