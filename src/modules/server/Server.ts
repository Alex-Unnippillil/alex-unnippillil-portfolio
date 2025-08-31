import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express, { Application, Request, Response } from 'express';
import FormStore from './FormStore';

export default class Server {
  private store = new FormStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(express.json());
    app.post('/api/form', (req: Request, res: Response) => {
      this.store.submit(req, res);
    });
  }
}
