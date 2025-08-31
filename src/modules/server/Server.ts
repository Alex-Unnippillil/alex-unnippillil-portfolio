import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import rateLimit from '../../middleware/rateLimit';
import cacheMetrics from '../../api/admin/cacheMetrics';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(rateLimit);
    app.get('/api/admin/cache-metrics', cacheMetrics);
  }
}
