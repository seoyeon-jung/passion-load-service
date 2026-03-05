import request from 'supertest';
import {
  bootstrapTestApp,
  closeApp,
  truncateAll,
  headersOrg1Teacher,
  headersOrg2Teacher,
  api,
} from './test-kit';

describe('Assignments API (integration)', () => {
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

  it('TASK 생성 후 조회', async () => {
    const s = await request(app.getHttpServer())
      .post(api('/sessions'))
      .set(headersOrg1Teacher)
      .send({ title: 'S1', date: '2026-03-01' })
      .expect(201);

    const sessionId = s.body.id;

    const created = await request(app.getHttpServer())
      .post(api('/assignments'))
      .set(headersOrg1Teacher)
      .send({
        assignmentType: 'TASK',
        studentId: 'student_001',
        assignmentDate: '2026-03-01',
        sessionId,
        title: 'task1',
        body: 'body',
      })
      .expect(201);

    const id = created.body.id;

    await request(app.getHttpServer())
      .get(api(`/assignments/${id}`))
      .set(headersOrg1Teacher)
      .expect(200);
  });

  it('DAILY_CHECK upsert 후 목록 조회(필터)', async () => {
    await request(app.getHttpServer())
      .post(api('/daily-checks'))
      .set(headersOrg1Teacher)
      .send({
        studentId: 'student_001',
        date: '2026-03-01',
        checked: true,
        contactMade: false,
        checkMemo: 'memo',
      })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get(api('/daily-checks'))
      .set(headersOrg1Teacher)
      .query({ studentId: 'student_001' })
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });

  it('다른 org로 TASK 조회 시 404', async () => {
    const s = await request(app.getHttpServer())
      .post(api('/sessions'))
      .set(headersOrg1Teacher)
      .send({ title: 'S1', date: '2026-03-01' })
      .expect(201);

    const created = await request(app.getHttpServer())
      .post(api('/assignments'))
      .set(headersOrg1Teacher)
      .send({
        assignmentType: 'TASK',
        studentId: 'student_001',
        assignmentDate: '2026-03-01',
        sessionId: s.body.id,
        title: 'task1',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(api(`/assignments/${created.body.id}`))
      .set(headersOrg2Teacher)
      .expect(404);
  });
});
