import request from 'supertest';
import {
  bootstrapTestApp,
  closeApp,
  truncateAll,
  headersOrg1Teacher,
  api,
} from './test-kit';

describe('Submissions API (integration)', () => {
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

  it('생성(upsert) 후 목록 조회(assignmentId 필터)', async () => {
    const s = await request(app.getHttpServer())
      .post(api('/sessions'))
      .set(headersOrg1Teacher)
      .send({ title: 'S1', date: '2026-03-01' });

    const a = await request(app.getHttpServer())
      .post(api('/assignments'))
      .set(headersOrg1Teacher)
      .send({
        assignmentType: 'TASK',
        studentId: 'student_001',
        assignmentDate: '2026-03-01',
        sessionId: s.body.id,
        title: 'task1',
      });

    const assignmentId = a.body.id;

    await request(app.getHttpServer())
      .post(api('/submissions'))
      .set(headersOrg1Teacher)
      .send({
        assignmentId,
        studentId: 'student_001',
        status: 'DONE',
      })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get(api('/submissions'))
      .set(headersOrg1Teacher)
      .query({ assignmentId })
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });
});
