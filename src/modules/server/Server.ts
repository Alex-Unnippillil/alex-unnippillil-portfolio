import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import crypto from 'crypto';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.get('/api/time', (req, resp) => {
      const serverTime = Date.now();
      const clientTime = Number(req.headers['x-client-time']);
      const skew = Number.isFinite(clientTime) ? serverTime - clientTime : 0;
      const maxSkew = 5 * 60 * 1000; // 5 minutes
      const signature = crypto
        .createHmac('sha256', process.env.TIME_SECRET || 'gportfolio')
        .update(serverTime.toString())
        .digest('hex');
      resp.json({ serverTime, skew, maxSkew, signature });
    });
  }
}
