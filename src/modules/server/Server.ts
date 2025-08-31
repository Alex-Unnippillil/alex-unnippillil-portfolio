import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express, { Application } from 'express';
import UserDataExporter from '../userData/Exporter';
import UserDataImporter from '../userData/Importer';

const demoUser: Record<string, any> = {
  login: 'demo',
  first_name: 'Demo',
  last_name: 'User',
};

const jobs: Record<string, { importer: UserDataImporter; progress: number; result?: any }> = {};

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(express.json());

    app.get('/api/users/export', (req, resp) => {
      const { format = 'json', version = 'v1' } = req.query as { format?: string; version?: string };
      const exporter = new UserDataExporter();
      const output = exporter.export(demoUser, (format as 'json' | 'csv'), version);
      if (format === 'csv') {
        resp.type('text/csv');
      } else {
        resp.type('application/json');
      }
      resp.send(output);
    });

    app.post('/api/users/import', (req, resp) => {
      const importer = new UserDataImporter();
      const { version, data } = req.body;
      if (!importer.validate({ version, data }, 'v1')) {
        resp.status(400).json({ error: 'Invalid schema version' });
        return;
      }
      const preview = importer.preview(demoUser, data);
      if (req.query.preview) {
        resp.json({ preview });
        return;
      }
      const jobId = Date.now().toString();
      jobs[jobId] = { importer, progress: 0 };
      importer.on('progress', (p) => { jobs[jobId].progress = p; });
      importer.process(demoUser, data).then((result) => { jobs[jobId].result = result; });
      resp.json({ jobId });
    });

    app.get('/api/users/import/:id/progress', (req, resp) => {
      const job = jobs[req.params.id];
      if (!job) {
        resp.status(404).end();
        return;
      }
      resp.json({ progress: job.progress, done: !!job.result, result: job.result || null });
      if (job.result) {
        delete jobs[req.params.id];
      }
    });
  }
}
