import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { SubmissionController } from './adapters/in/submissions.controller';
import { SubmissionService } from './submissions.service';
import { AssignmentModule } from '@modules/assignment/assignments.module';

@Module({
  imports: [PersistenceModule, AssignmentModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
