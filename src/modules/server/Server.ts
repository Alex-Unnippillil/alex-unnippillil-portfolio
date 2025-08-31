import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import personalizedHandler from '../../pages/api/personalized';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.get('/api/personalized', personalizedHandler);
  }
}
