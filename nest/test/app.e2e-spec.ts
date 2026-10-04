import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('Susi Air API (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'johndoe', password: 'susiairtest' })
      .expect(200);

    token = login.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  const authed = (path: string) =>
    request(app.getHttpServer()).get(path).set('Authorization', `Bearer ${token}`);

  describe('POST /auth/login', () => {
    it('returns a bearer token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'johndoe', password: 'susiairtest' })
        .expect(200);

      expect(response.body).toMatchObject({
        statusCode: 200,
        data: { tokenType: 'Bearer', accessToken: expect.any(String) },
      });
    });

    it('compares the password exactly, without trimming it', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: ' johndoe ', password: ' susiairtest ' })
        .expect(401);
    });

    it('rejects bad credentials with 401 and the error shape', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'johndoe', password: 'wrong' })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid username or password',
        path: '/auth/login',
        timestamp: expect.any(String),
      });
    });

    it('validates the body', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'johndoe' })
        .expect(400);

      expect(response.body.message).toBe('password is required');
    });
  });

  describe('auth guard', () => {
    it.each(['/pilot/me', '/documents', '/flight-hours/summary', '/schedules?year=2026&month=5'])(
      'rejects %s without a token',
      async path => {
        const response = await request(app.getHttpServer()).get(path).expect(401);

        expect(response.body.message).toBe('Missing access token');
      },
    );

    it('rejects a forged token', async () => {
      await request(app.getHttpServer())
        .get('/pilot/me')
        .set('Authorization', 'Bearer not.a.token')
        .expect(401);
    });
  });

  it('GET /pilot/me returns the profile', async () => {
    const response = await authed('/pilot/me').expect(200);

    expect(response.body.data).toMatchObject({
      name: 'John Doe',
      totalFlightHours: 1385.4,
      plannedFlightHours: 59.1,
      plannedUntil: '2026-05-31',
      avatarUrl: expect.stringContaining('/static/avatar.jpeg'),
      today: '2026-05-15',
    });
  });

  it('GET /flight-hours/summary defaults to 1w', async () => {
    const response = await authed('/flight-hours/summary').expect(200);

    expect(response.body.data).toMatchObject({
      range: '1w',
      today: '2026-05-15',
      chart: { limit: 40, max: 45 },
    });
  });

  it('GET /flight-hours/summary rejects an unknown range', async () => {
    const response = await authed('/flight-hours/summary?range=2w').expect(400);

    expect(response.body.message).toBe('range must be one of: 1w, 1m, 3m, 6m, 1y');
  });

  it('GET /flight-hours validates the dates', async () => {
    const response = await authed('/flight-hours?from=2026-02-30&to=2026-03-01').expect(400);

    expect(response.body.message).toBe('from must be a valid date in YYYY-MM-DD format');
  });

  it('GET /documents returns statuses from the API', async () => {
    const response = await authed('/documents').expect(200);
    const statuses = response.body.data.items.map((item: { status: string }) => item.status);

    expect(new Set(statuses)).toEqual(new Set(['expired', 'soon', 'safe']));
  });

  describe('GET /schedules', () => {
    it('returns one month with the legend', async () => {
      const response = await authed('/schedules?year=2026&month=5').expect(200);
      const { items, legend } = response.body.data;

      expect(legend.length).toBeGreaterThan(0);
      expect(
        items.every((item: { duty_date: string }) => item.duty_date.startsWith('2026-05')),
      ).toBe(true);
    });

    it('returns an empty list for a month without data', async () => {
      const response = await authed('/schedules?year=2026&month=7').expect(200);

      expect(response.body.data.items).toEqual([]);
    });

    it('rejects month 13', async () => {
      const response = await authed('/schedules?year=2026&month=13').expect(400);

      expect(response.body.message).toBe('month must be between 1 and 12');
    });
  });

  it('unknown routes use the same error shape', async () => {
    const response = await authed('/nope').expect(404);

    expect(response.body).toMatchObject({ statusCode: 404, error: 'Not Found' });
  });
  it('sends security headers', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('rate limits login attempts per client', async () => {
    const attempt = () =>
      request(app.getHttpServer())
        .post('/auth/login')
        .set('CF-Connecting-IP', '203.0.113.7')
        .send({ username: 'johndoe', password: 'wrong' });

    for (let index = 0; index < 10; index++) {
      await attempt().expect(401);
    }

    const blocked = await attempt().expect(429);
    expect(blocked.body).toMatchObject({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Too many requests, please try again later',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .set('CF-Connecting-IP', '198.51.100.9')
      .send({ username: 'johndoe', password: 'susiairtest' })
      .expect(200);
  });
});
