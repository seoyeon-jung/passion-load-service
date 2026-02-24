import { PersistenceModule } from '@modules/persistence.module';
import { Module } from '@nestjs/common';
import { FeedbacksController } from './adapters/in/feedbacks.controller';
import { FeedbacksService } from './feedback.service';

@Module({
  imports: [PersistenceModule],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
