import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { AssignmentsController } from './adapters/in/assignments.controller';
import { AssignmentService } from './assignments.service';

@Module({
  imports: [PersistenceModule],
  controllers: [AssignmentsController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
