import { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

interface Entry {
  etag: string;
  data: unknown;
  expires: number;
}

const CACHE = new Map<string, Entry>();
const TTL = 60 * 1000; // 1 minute

export const NOT_MODIFIED = Symbol('not-modified');

export function get(key: string, req: IncomingMessage, res: ServerResponse): unknown {
  const entry = CACHE.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    CACHE.delete(key);
    return undefined;
  }
  if (req.headers['if-none-match'] === entry.etag) {
    res.statusCode = 304;
    res.end();
    return NOT_MODIFIED;
  }
  res.setHeader('ETag', entry.etag);
  return entry.data;
}

export function set(key: string, data: unknown, res: ServerResponse): void {
  const body = JSON.stringify(data);
  const etag = crypto.createHash('sha1').update(body).digest('hex');
  CACHE.set(key, { etag, data, expires: Date.now() + TTL });
  res.setHeader('ETag', etag);
}
