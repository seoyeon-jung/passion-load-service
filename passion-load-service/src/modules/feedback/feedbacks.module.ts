import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { FeedbacksController } from './adapters/in/feedbacks.controller';
import { FeedbacksService } from './feedback.service';
import { AssignmentModule } from '@modules/assignment/assignments.module';

@Module({
  imports: [PersistenceModule, AssignmentModule],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
