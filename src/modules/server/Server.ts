import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import { di } from '../../di';
import { TYPES } from '../../types';
import HeadManager from '../head/HeadManager';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.get('/preview/head', (req, resp) => {
      const headManager = di.get<HeadManager>(TYPES.HeadManager);
      resp.setHeader('Content-Type', 'text/html');
      resp.send(headManager.render());
    });
  }
}
