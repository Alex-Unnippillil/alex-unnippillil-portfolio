import express from 'express';
import http from 'http';
import Server from '../../src/modules/server/Server';
import { HistoryService } from '../../src/services/history';

describe('Server undo endpoint', () => {
  it('calls history.undo when /undo endpoint hit', async () => {
    const app = express();
    app.use(express.json());

    const history = new HistoryService();
    const fn = jest.fn();
    history.record(fn);

    const server = new Server(history);
    server.run(app, {} as any, {} as any);

    const result = await new Promise<{ status: number; body: any }>((resolve) => {
      const srv = http.createServer(app);
      srv.listen(() => {
        const { port } = srv.address() as any;
        const req = http.request(
          {
            method: 'POST',
            port,
            path: '/undo',
            headers: { 'Content-Type': 'application/json' },
          },
          (res) => {
            let data = '';
            res.on('data', (c) => { data += c; });
            res.on('end', () => {
              resolve({ status: res.statusCode || 0, body: JSON.parse(data || '{}') });
              srv.close();
            });
          },
        );
        req.end('{}');
      });
    });

    expect(result.status).toBe(200);
    expect(fn).toHaveBeenCalled();
  });
});

