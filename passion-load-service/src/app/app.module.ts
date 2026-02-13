import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { OrgMiddleware } from '../common/middlewares/org.middleware';
import { PrismaModule } from '../common/prisma/prisma.module';
import { LmsDebugController } from '../lms-debug.controller';
import { LmsModule } from '../common/clients/lms/lms.module';

@Module({
  imports: [PrismaModule, LmsModule],
  controllers: [AppController, HealthController, LmsDebugController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrgMiddleware).forRoutes('*');
  }
}
