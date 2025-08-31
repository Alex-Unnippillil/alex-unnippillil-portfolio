import path from 'path';
import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    const isPreview = () => process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV !== 'production';

    app.use((req: Request, res: Response, next: NextFunction) => {
      const privateRoute = /^\/api\//.test(req.path) || /^\/private\//.test(req.path) || /^\/preview\//.test(req.path);

      if (isPreview() || privateRoute) {
        res.setHeader('X-Robots-Tag', 'noindex');
      }

      next();
    });

    app.get('/robots.txt', (req: Request, res: Response) => {
      const fileName = isPreview() ? 'robots.preview.txt' : 'robots.txt';

      res.sendFile(path.join(process.cwd(), 'public', fileName));
    });
  }
}
