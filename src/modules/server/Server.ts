import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import rateLimiter from '../../middleware/rateLimiter';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use('/api', rateLimiter);
    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
