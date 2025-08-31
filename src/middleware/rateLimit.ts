import { Request, Response, NextFunction } from 'express';
import kvCache from '../lib/cache/kvCache';

interface Bucket {
  tokens: number;
  last: number;
}

class RateLimiter {
  private active = new Set<string>();

  constructor(private limit = 5, private windowMs = 60 * 1000) {}

  consume(key: string): { allowed: boolean; retryAfter?: number; tokensLeft?: number } {
    const now = Date.now();
    let bucket = kvCache.get<Bucket>('rl', { key });
    if (!bucket) {
      bucket = { tokens: this.limit, last: now };
    } else {
      const elapsed = now - bucket.last;
      const refill = Math.floor((elapsed / this.windowMs) * this.limit);
      if (refill > 0) {
        bucket.tokens = Math.min(this.limit, bucket.tokens + refill);
        bucket.last = now;
      }
    }

    this.active.add(key);

    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      kvCache.set('rl', { key }, bucket, this.windowMs);
      return { allowed: true, tokensLeft: bucket.tokens };
    }
    const retryAfter = this.windowMs - (now - bucket.last);
    kvCache.set('rl', { key }, bucket, this.windowMs);
    return { allowed: false, retryAfter };
  }

  status(): { limit: number; windowMs: number; active: number } {
    return { limit: this.limit, windowMs: this.windowMs, active: this.active.size };
  }
}

export const rateLimiter = new RateLimiter();

export default function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const session = (req.headers['session'] as string) || '';
  const key = `${req.ip}:${session}`;
  const result = rateLimiter.consume(key);
  if (result.allowed) {
    return next();
  }
  res.set('Retry-After', Math.ceil((result.retryAfter || 0) / 1000).toString());
  res.status(429).send('Too Many Requests');
}
