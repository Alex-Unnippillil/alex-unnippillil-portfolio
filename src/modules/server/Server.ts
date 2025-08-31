import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import fs from 'fs';
import path from 'path';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.get('/api/schema', (req, res) => {
      const schemaPath = path.resolve(process.cwd(), 'public/export/openapi.json');
      if (fs.existsSync(schemaPath)) {
        res.setHeader('Content-Type', 'application/json');
        res.send(fs.readFileSync(schemaPath, 'utf8'));
      } else {
        res.status(404).end();
      }
    });
  }
}
