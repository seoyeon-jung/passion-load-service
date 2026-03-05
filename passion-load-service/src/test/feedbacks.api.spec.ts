import request from 'supertest';
import {
  bootstrapTestApp,
  closeApp,
  truncateAll,
  headersOrg1Teacher,
  api,
} from './test-kit';

describe('Feedbacks API (integration)', () => {
  let app: any;
  let prisma: any;

  beforeAll(async () => {
    ({ app, prisma } = await bootstrapTestApp());
  });

  beforeEach(async () => {
    await truncateAll(prisma);
  });

  afterAll(async () => {
    await closeApp(app);
  });

  it('250자 초과면 400', async () => {
    const long = 'a'.repeat(251);

    await request(app.getHttpServer())
      .post(api('/feedback'))
      .set(headersOrg1Teacher)
      .send({ studentId: 'student_001', content: long })
      .expect(400);
  });

  it('생성 후 목록 조회(studentId 필터)', async () => {
    await request(app.getHttpServer())
      .post(api('/feedback'))
      .set(headersOrg1Teacher)
      .send({ studentId: 'student_001', content: 'ok' })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get(api('/feedback'))
      .set(headersOrg1Teacher)
      .query({ studentId: 'student_001' })
      .expect(200);

    expect(list.body.length).toBe(1);
  });
});
