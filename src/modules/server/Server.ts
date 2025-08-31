import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Application,
  Request,
  Response,
} from 'express';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    if (process.env.RUNTIME === 'nodejs') {
      app.get('/api/progress', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        res.write('retry: 3000\n\n');

        const sendHeartbeat = () => {
          res.write(`event: heartbeat\nid: ${Date.now()}\ndata: \n\n`);
        };

        const heartbeatInterval = setInterval(sendHeartbeat, 15000);
        sendHeartbeat();

        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 1;
          res.write(`id: ${progress}\ndata: ${progress}\n\n`);
          if (progress >= 100) {
            clearInterval(progressInterval);
            clearInterval(heartbeatInterval);
            res.end();
          }
        }, 1000);

        req.on('close', () => {
          clearInterval(progressInterval);
          clearInterval(heartbeatInterval);
        });
      });
    }
  }
}
