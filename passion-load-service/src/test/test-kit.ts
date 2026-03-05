import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { PrismaService } from '@common/prisma/prisma.service';

export const API_PREFIX = '/api/v1/passion-load';

export function api(path: string) {
  return `${API_PREFIX}${path}`;
}

export const headersOrg1Teacher = {
  'x-organization-id': '11111111-1111-1111-1111-111111111111',
  'x-user-role': 'TEACHER',
  'x-user-id': '22222222-2222-2222-2222-222222222222',
};

export const headersOrg2Teacher = {
  'x-organization-id': '99999999-9999-9999-9999-999999999999',
  'x-user-role': 'TEACHER',
  'x-user-id': '22222222-2222-2222-2222-222222222222',
};

export async function bootstrapTestApp() {
  // 상담(counseling-status)도 통합 테스트에 포함이면 LMS mock을 켜는 게 안전
  process.env.LMS_MOCK = 'true';
  process.env.NODE_ENV = 'test';

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  await app.init();

  const server: any = app.getHttpServer();
  const router = server?._events?.request?._router;

  if (router?.stack) {
    const routes = router.stack
      .filter((l: any) => l.route)
      .map((l: any) => {
        const methods = Object.keys(l.route.methods).join(',').toUpperCase();
        return `${methods} ${l.route.path}`;
      });
    console.log('[ROUTES]', routes);
  }

  const prisma = app.get(PrismaService);
  return { app, prisma };
}

export async function truncateAll(prisma: PrismaService) {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "assignment_submissions",
      "feedbacks",
      "reports",
      "daily_assignments",
      "sessions"
    RESTART IDENTITY CASCADE;
  `);
}

export async function closeApp(app: INestApplication) {
  await app.close();
}
