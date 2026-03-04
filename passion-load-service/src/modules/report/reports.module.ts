import { Module } from '@nestjs/common';
import { ReportsController } from './adapters/in/reports.controller';
import { ReportsService } from './reports.service';
import { PersistenceModule } from '@modules/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
