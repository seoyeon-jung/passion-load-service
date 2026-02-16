import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { SubmissionController } from './adapters/in/submissions.controller';
import { SubmissionService } from './submissions.service';

@Module({
  imports: [PersistenceModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
