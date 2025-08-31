import crypto from 'crypto';
import { Request, Response } from 'express';

interface CacheEntry {
  etag: string;
  expires: number;
  payload: any;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 60 * 1000; // 1 minute

export function sendCached(key: string, req: Request, res: Response): boolean {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expires) {
    cache.delete(key);
    return false;
  }
  if (req.headers['if-none-match'] === entry.etag) {
    res.status(304).end();
    return true;
  }
  res.setHeader('ETag', entry.etag);
  res.json(entry.payload);
  return true;
}

export function storeCached(key: string, res: Response, payload: any, ttl = DEFAULT_TTL): void {
  const etag = crypto.createHash('sha1').update(JSON.stringify(payload)).digest('hex');
  cache.set(key, { etag, expires: Date.now() + ttl, payload });
  res.setHeader('ETag', etag);
  res.json(payload);
}
