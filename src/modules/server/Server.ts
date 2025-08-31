import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import type { Application } from 'express';
import contentFilter from '../../middleware/contentFilter';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    // Apply content filter middleware to all requests before routes
    app.use(contentFilter);

    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
