import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import History, { HistoryService } from '../../services/history';

/**
 * Development server helpers.
 *
 * The server exposes a small API that can be used by the client during
 * development.  In particular we expose an `/undo` endpoint that rolls back
 * actions recorded in the {@link HistoryService}.  The endpoint accepts an
 * optional `steps` property in the request body describing how many operations
 * should be reverted (default is `1`).
 */
export default class Server {
  private history: HistoryService;

  constructor(history: HistoryService = History) {
    this.history = history;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });

    // Endpoint used by the client to undo previously executed operations.  The
    // operations themselves are recorded via the History service which stores
    // a stack of compensating callbacks.  When this endpoint is triggered we
    // simply pop the required number of callbacks and execute them.
    app.post('/undo', async (req: any, res: any) => {
      const steps = typeof req.body?.steps === 'number' ? req.body.steps : 1;

      await this.history.undo(steps);

      res.json({ success: true, remaining: this.history.length });
    });
  }
}

