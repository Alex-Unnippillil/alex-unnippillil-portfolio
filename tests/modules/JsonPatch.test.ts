import express from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import Server from '../../src/modules/server/Server';
import { generatePatch, Operation } from '../../src/utils/jsonPatch';

describe('JSON Patch integration', () => {
  test('generate minimal patch', () => {
    const original: Record<string, number> = {};
    for (let i = 0; i < 20; i += 1) {
      original[`k${i}`] = i;
    }
    const updated = { ...original, k0: 99 };
    const patch = generatePatch(original, updated);

    expect(patch).toEqual([{ op: 'replace', path: '/k0', value: 99 }]);
    expect(JSON.stringify(patch).length).toBeLessThan(JSON.stringify(updated).length);
  });

  test('server applies patches and detects conflicts', async () => {
    const app = express();
    const server = new Server();
    // @ts-ignore
    server.run(app, {} as any, {} as any);
    const httpServer = app.listen();
    const { port } = httpServer.address() as AddressInfo;

    const send = (ops: Operation[]): Promise<{ status: number; body: any }> => new Promise((resolve, reject) => {
      const req = http.request({
        method: 'PATCH',
        port,
        path: '/api/data',
        headers: { 'Content-Type': 'application/json' },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode || 0, body: data ? JSON.parse(data) : undefined });
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify(ops));
      req.end();
    });

    const ok = await send([{ op: 'add', path: '/count', value: 1 }]);
    expect(ok).toEqual({ status: 200, body: { count: 1 } });

    const conflict = await send([{ op: 'replace', path: '/missing', value: 1 }]);
    expect(conflict.status).toBe(409);
    expect(conflict.body.message).toMatch(/Conflict/);

    httpServer.close();
  });
});
