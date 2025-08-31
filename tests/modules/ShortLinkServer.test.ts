import express from 'express';
import request from 'supertest';
import Server from '../../src/modules/server/Server';

describe('ShortLink server', () => {
  function createApp() {
    const app = express();
    new Server().run(app as any, {} as any, {} as any);
    return app;
  }

  it('creates link, redirects and logs click with utm', async () => {
    const app = createApp();
    const createRes = await request(app)
      .post('/api/links')
      .send({ owner: 'me', target: 'https://example.com/page' });
    const id = createRes.body.id as string;
    expect(id).toBeTruthy();

    const redirectRes = await request(app)
      .get(`/l/${id}?utm_source=test`)
      .redirects(0);
    expect(redirectRes.status).toBe(302);
    expect(redirectRes.headers.location).toBe('https://example.com/page?utm_source=test');

    const listRes = await request(app).get('/api/links');
    const link = listRes.body.find((l: any) => l.id === id);
    expect(link.clicks.length).toBe(1);
    expect(link.clicks[0].utm.utm_source).toBe('test');
  });

  it('respects disabled and expiry', async () => {
    const app = createApp();
    const disabledRes = await request(app)
      .post('/api/links')
      .send({ owner: 'a', target: 'https://example.com', disabled: true });
    const disabledId = disabledRes.body.id as string;
    const disabledRedirect = await request(app)
      .get(`/l/${disabledId}`)
      .redirects(0);
    expect(disabledRedirect.status).toBe(404);

    const expiredRes = await request(app)
      .post('/api/links')
      .send({ owner: 'b', target: 'https://example.com', expiresAt: Date.now() - 1000 });
    const expiredId = expiredRes.body.id as string;
    const expiredRedirect = await request(app)
      .get(`/l/${expiredId}`)
      .redirects(0);
    expect(expiredRedirect.status).toBe(404);
  });
});
