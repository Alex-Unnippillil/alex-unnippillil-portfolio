import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Application,
  Request,
  Response,
} from 'express';

const ALLOWED_ORIGINS = (process.env.EMBED_ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

function originAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  if (ALLOWED_ORIGINS.length === 0) {
    return true;
  }

  return ALLOWED_ORIGINS.includes(origin);
}

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.get('/embed/:view', (req: Request, res: Response) => {
      const origin = req.get('origin');

      if (!originAllowed(origin)) {
        res.status(403).send('Forbidden');
        return;
      }

      const { view } = req.params;
      const snippet = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div id="app" data-view="${view}"></div><script src="/static/main.js"></script></body></html>`;

      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      res.setHeader('Content-Security-Policy', `frame-ancestors ${ALLOWED_ORIGINS.join(' ') || "'self'"}`);
      res.send(snippet);
    });

    app.get('/oembed', (req: Request, res: Response) => {
      const origin = req.get('origin');

      if (!originAllowed(origin)) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      const view = (req.query.view as string) || 'index';
      const host = `${req.protocol}://${req.get('host')}`;
      const embedUrl = `${host}/embed/${view}`;
      const html = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;

      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      res.setHeader('Content-Security-Policy', `frame-ancestors ${ALLOWED_ORIGINS.join(' ') || "'self'"}`);
      res.json({
        version: '1.0',
        type: 'rich',
        title: req.query.title || 'GPortfolio Embed',
        thumbnail_url: req.query.thumbnail || `${host}/public/thumbnail.png`,
        html,
      });
    });
  }
}
