import { LmsModule } from '@common/clients/lms/lms.module';
import { Module } from '@nestjs/common';
import { CounselingStatusController } from './adapters/in/counseling-status.controller';
import { CounselingService } from './counseling.service';

@Module({
  imports: [LmsModule],
  controllers: [CounselingStatusController],
  providers: [CounselingService],
})
export class CounselingModule {}
