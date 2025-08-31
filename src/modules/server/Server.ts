import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import cacheDebugRoute from '../../server/routes/cache-debug';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(cacheDebugRoute);
  }
}
