import 'reflect-metadata';
import http from 'http';
import express from 'express';
import kvCache from '../../src/lib/cache/kvCache';
import rateLimit from '../../src/middleware/rateLimit';
import cacheMetrics from '../../src/api/admin/cacheMetrics';

describe('rate limiter and cache', () => {
  it('speeds up cached requests and blocks abusive traffic', async () => {
    const app = express();
    app.use(rateLimit);

    app.get('/slow', async (req, res) => {
      const data = await kvCache.getOrSet('/slow', {}, async () => {
        await new Promise((r) => setTimeout(r, 50));
        return { ok: true };
      }, 1000);
      res.json(data);
    });

    app.get('/api/admin/cache-metrics', cacheMetrics);

    const server = app.listen(0);
    const { port } = server.address() as any;

    const request = (
      path: string,
      headers: Record<string, string> = {},
    ) => new Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }>((resolve) => {
      const opts = { port, path, headers };
      const req = http.get(opts, (resp) => {
        let body = '';
        resp.on('data', (d) => { body += d; });
        resp.on('end', () => resolve({ status: resp.statusCode || 0, headers: resp.headers, body }));
      });
      req.end();
    });

    const t1Start = Date.now();
    await request('/slow');
    const t1 = Date.now() - t1Start;

    const t2Start = Date.now();
    await request('/slow');
    const t2 = Date.now() - t2Start;

    expect(t2).toBeLessThan(t1);

    for (let i = 0; i < 3; i += 1) {
      await request('/slow');
    }
    const over = await request('/slow');
    expect(over.status).toBe(429);
    expect(over.headers['retry-after']).toBeDefined();

    const metricsResp = await request('/api/admin/cache-metrics', { session: 'admin' });
    const metrics = JSON.parse(metricsResp.body);
    expect(metrics.cache.hitRate).toBeGreaterThan(0);
    expect(metrics.limiter.limit).toBeDefined();

    server.close();
  });
});
