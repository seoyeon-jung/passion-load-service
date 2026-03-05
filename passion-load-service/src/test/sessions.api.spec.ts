import request from 'supertest';
import {
  bootstrapTestApp,
  closeApp,
  truncateAll,
  headersOrg1Teacher,
  headersOrg2Teacher,
  api,
} from './test-kit';

describe('Sessions API (integration)', () => {
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
      .post(api('/sessions'))
      .set(headersOrg1Teacher)
      .send({ title: 'S1', date: '2026-03-01' })
      .expect(201);

    const id = created.body.id;

    await request(app.getHttpServer())
      .get(api(`/sessions/${id}`))
      .set(headersOrg1Teacher)
      .expect(200);
  });

  it('수정 후 조회', async () => {
    const created = await request(app.getHttpServer())
      .post(api('/sessions'))
      .set(headersOrg1Teacher)
      .send({ title: 'S1', date: '2026-03-01' });

    const id = created.body.id;

    await request(app.getHttpServer())
      .patch(api(`/sessions/${id}`))
      .set(headersOrg1Teacher)
      .send({ title: 'S1-updated' })
      .expect(200);

    const got = await request(app.getHttpServer())
      .get(api(`/sessions/${id}`))
      .set(headersOrg1Teacher)
      .expect(200);

    expect(got.body.title).toBe('S1-updated');
  });

  it('다른 org로 조회 시 실패(404)', async () => {
    const created = await request(app.getHttpServer())
      .post(api('/sessions'))
      .set(headersOrg1Teacher)
      .send({ title: 'S1', date: '2026-03-01' });

    const id = created.body.id;

    await request(app.getHttpServer())
      .get(api(`/sessions/${id}`))
      .set(headersOrg2Teacher)
      .expect(404);
  });
});
