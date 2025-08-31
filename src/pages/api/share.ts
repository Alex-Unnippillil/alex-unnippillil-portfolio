import type { IncomingMessage, ServerResponse } from 'http';

interface ShareRequest extends IncomingMessage {
  body?: any;
  query?: any;
}

export default async function handler(req: ShareRequest, res: ServerResponse): Promise<void> {
  const data = (req.body || req.query) || {};
  const { title, text, url } = data;
  const nav: any = (globalThis as any).navigator;

  if (nav && typeof nav.share === 'function') {
    try {
      await nav.share({ title, text, url });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
  } else {
    res.statusCode = 501;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Web Share API not supported' }));
  }
}
