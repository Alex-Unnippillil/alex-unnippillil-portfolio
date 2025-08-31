import express, { Application } from 'express';
import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { applyPatch, Operation } from '../../utils/jsonPatch';

export default class Server {
  private data: any = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(express.json());

    app.get('/api/data', (req, res) => {
      res.json(this.data);
    });

    app.patch('/api/data', (req, res) => {
      const operations: Operation[] = req.body;
      try {
        this.data = applyPatch(this.data, operations);
        res.json(this.data);
      } catch (err) {
        res.status(409).json({ message: (err as Error).message });
      }
    });
  }
}
