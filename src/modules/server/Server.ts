import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';

export default class Server {
  private validatePreviewToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const token = req.query.preview as string;
    const validToken = process.env.PREVIEW_TOKEN;

    if (!validToken || token !== validToken) {
      res.status(401).send('Invalid preview token');
      return;
    }

    next();
  }

  private applyPreviewHeaders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    res.set('X-Robots-Tag', 'noindex');

    const originalSend = res.send.bind(res);
    res.send = (body: any): Response => {
      let html = body;
      if (typeof html === 'string' && html.includes('<body')) {
        const banner = '<div style="position:fixed;top:0;left:0;width:100%;background:#ffc;color:#000;text-align:center;padding:5px;z-index:9999;">Preview mode - do not share</div>';
        html = html.replace('<body', `<body>${banner}`);
      }
      return originalSend(html);
    };

    next();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.use(
      '/draft',
      this.validatePreviewToken.bind(this),
      this.applyPreviewHeaders.bind(this),
    );

    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
