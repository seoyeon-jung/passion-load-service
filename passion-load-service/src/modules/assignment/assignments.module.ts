import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { AssignmentsController } from './adapters/in/assignments.controller';
import { DailyChecksController } from './adapters/in/daily-checks.controller';
import { TaskService } from './task.service';

@Module({
  imports: [PersistenceModule],
  controllers: [AssignmentsController, DailyChecksController],
  providers: [TaskService, DailyChecksController],
})
export class AssignmentModule {}
