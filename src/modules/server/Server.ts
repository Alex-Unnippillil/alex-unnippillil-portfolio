import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';
import crypto from 'crypto';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const nonce = crypto.randomBytes(16).toString('base64');
      res.locals.nonce = nonce;
      res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'`,
      );
      next();
    });

    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
