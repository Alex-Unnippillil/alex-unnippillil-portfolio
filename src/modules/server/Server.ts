import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';

interface IBucket {
  tokens: number;
  last: number;
}

interface ILimitEvent {
  ip: string;
  session: string;
  path: string;
  at: number;
}

const BUCKET_CAPACITY = 10;
const REFILL_RATE_PER_SEC = 1;
const MAX_LOG = 100;

const buckets: Record<string, IBucket> = {};
const limitLog: ILimitEvent[] = [];

function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (!name) return;
    list[name] = decodeURIComponent(rest.join('='));
  });
  return list;
}

function getSessionId(req: Request): string {
  const headerId = req.headers['x-session-id'] || req.headers['session-id'];
  if (typeof headerId === 'string') return headerId;
  if (Array.isArray(headerId)) return headerId[0];
  const cookies = parseCookies(req.headers.cookie);
  return cookies['session-id'] || 'anonymous';
}

function getIdentifier(req: Request) {
  const { ip } = req;
  const session = getSessionId(req);
  return {
    key: `${ip}:${session}`,
    ip,
    session,
  };
}

function tokenBucketLimiter(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const { key, ip, session } = getIdentifier(req);
  const bucket = buckets[key] || { tokens: BUCKET_CAPACITY, last: now };
  const elapsed = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(
    BUCKET_CAPACITY,
    bucket.tokens + elapsed * REFILL_RATE_PER_SEC,
  );
  bucket.last = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets[key] = bucket;
    next();
    return;
  }

  const retryAfter = Math.ceil((1 - bucket.tokens) / REFILL_RATE_PER_SEC);
  res.setHeader('Retry-After', `${retryAfter}`);
  res.status(429).json({
    error: 'Too many requests',
    retryAfter,
    message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
  });
  limitLog.push({
    ip,
    session,
    path: req.originalUrl,
    at: now,
  });
  if (limitLog.length > MAX_LOG) limitLog.shift();
}

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    const sensitivePaths = ['/api/sh/build'];

    sensitivePaths.forEach((path) => {
      app.use(path, tokenBucketLimiter);
    });

    app.get('/api/admin/limits', (req: Request, res: Response) => {
      res.json({ events: limitLog });
    });

    // app.get('/api/sh/build', async (req: any, resp: any) => {
    //   const response = await build();
    //   resp.json(response);
    // });
  }
}
