import request from 'supertest';
import {
  bootstrapTestApp,
  closeApp,
  truncateAll,
  headersOrg1Teacher,
  headersOrg2Teacher,
  api,
} from './test-kit';

describe('Reports API (integration)', () => {
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

  it('생성 후 조회', async () => {
    const created = await request(app.getHttpServer())
      .post(api('/reports'))
      .set(headersOrg1Teacher)
      .send({
        studentId: 'student_001',
        fromAt: '2026-03-01T00:00:00.000Z',
        toAt: '2026-03-07T23:59:59.999Z',
        summary: 'week1',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(api(`/reports/${created.body.id}`))
      .set(headersOrg1Teacher)
      .expect(200);
  });

  it('기간 필터(fromAt/toAt)로 목록 조회', async () => {
    await request(app.getHttpServer())
      .post(api('/reports'))
      .set(headersOrg1Teacher)
      .send({
        studentId: 'student_001',
        fromAt: '2026-03-01T00:00:00.000Z',
        toAt: '2026-03-07T23:59:59.999Z',
        summary: 'week1',
      });

    await request(app.getHttpServer())
      .post(api('/reports'))
      .set(headersOrg1Teacher)
      .send({
        studentId: 'student_001',
        fromAt: '2026-03-08T00:00:00.000Z',
        toAt: '2026-03-14T23:59:59.999Z',
        summary: 'week2',
      });

    const list = await request(app.getHttpServer())
      .get(api('/reports'))
      .set(headersOrg1Teacher)
      .query({
        studentId: 'student_001',
        fromAt: '2026-03-01T00:00:00.000Z',
        toAt: '2026-03-07T23:59:59.999Z',
      })
      .expect(200);

    expect(list.body.length).toBe(1);
    expect(list.body[0].summary).toBe('week1');
  });

  it('조직 격리: 다른 org로 조회 시 404/빈 배열', async () => {
    const created = await request(app.getHttpServer())
      .post(api('/reports'))
      .set(headersOrg1Teacher)
      .send({
        studentId: 'student_001',
        fromAt: '2026-03-01T00:00:00.000Z',
        toAt: '2026-03-07T23:59:59.999Z',
        summary: 'week1',
      });

    await request(app.getHttpServer())
      .get(api(`/reports/${created.body.id}`))
      .set(headersOrg2Teacher)
      .expect(404);

    const list = await request(app.getHttpServer())
      .get(api('/reports'))
      .set(headersOrg2Teacher)
      .query({ studentId: 'student_001' })
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(0);
  });
});
