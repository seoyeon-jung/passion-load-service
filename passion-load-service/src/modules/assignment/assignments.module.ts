import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { AssignmentsController } from './adapters/in/assignments.controller';
import { AssignmentService } from './assignments.service';
import { DailyChecksController } from './adapters/in/daily-checks.controller';

@Module({
  imports: [PersistenceModule],
  controllers: [AssignmentsController, DailyChecksController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
