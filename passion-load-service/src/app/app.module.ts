import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { OrgMiddleware } from '@common/middlewares/org.middleware';
import { UserContextMiddleware } from '@common/middlewares/user-context.middleware';
import { LmsDebugController } from '../lms-debug.controller';
import { LmsModule } from '@common/clients/lms/lms.module';
import { PersistenceModule } from '@modules/persistence.module';
import { DebugController } from '@modules/debug.controller';
import { SessionsModule } from '@modules/session/sessions.module';
import { PrismaModule } from '@common/prisma/prisma.module';
import { AssignmentModule } from '@modules/assignment/assignments.module';
import { SubmissionModule } from '@modules/submission/submisson.module';

@Module({
  imports: [
    PrismaModule,
    LmsModule,
    PersistenceModule,
    SessionsModule,
    AssignmentModule,
    SubmissionModule,
  ],
  controllers: [
    AppController,
    HealthController,
    LmsDebugController,
    DebugController,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrgMiddleware, UserContextMiddleware).forRoutes('*');
  }
}
