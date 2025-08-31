import { Request, Response, NextFunction } from 'express';

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const CAPACITY = 60;
const REFILL_INTERVAL_MS = 60_000;
const RATE = CAPACITY / REFILL_INTERVAL_MS;

const buckets = new Map<string, Bucket>();

export default function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const ip = (req.headers['x-real-ip'] as string) || req.ip;
  const now = Date.now();

  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { tokens: CAPACITY, lastRefill: now };
    buckets.set(ip, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * RATE);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    res.status(429).send('Too Many Requests');
    return;
  }

  bucket.tokens -= 1;
  next();
}
