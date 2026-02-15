import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence.module';
import { SessionsController } from './adapters/in/sessions.controller';
import { SessionService } from './session.service';

@Module({
  imports: [PersistenceModule],
  controllers: [SessionsController],
  providers: [SessionService],
})
export class SessionsModule {}
