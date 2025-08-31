import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import crypto from 'crypto';
import { di } from '../../di';
import { TYPES } from '../../types';
import IApplication from '../../interfaces/IApplication';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    const application: IApplication = di.get(TYPES.Application);

    app.use((req, res, next) => {
      const nonce = crypto.randomBytes(16).toString('base64');
      application.cspNonce = nonce;

      res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);

      const features = application.config.global.features;
      if (features.sharedArrayBuffer || features.wasm) {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      }

      next();
    });

    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
