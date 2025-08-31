import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import canaryMiddleware from './canaryMiddleware';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: any, server: WebpackDevServer, compiler: Compiler): void {
    app.use(canaryMiddleware);
    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
