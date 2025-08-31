// Simple token bucket rate limiter backed by in-memory KV store

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

const CAPACITY = 60; // requests
const INTERVAL = 60_000; // 1 minute in ms

function getKey(req: any): string {
  const ip = (req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || '') as string;
  const session = (req.headers?.['x-session-id'] || '') as string;
  return `${ip}:${session}`;
}

export function rateLimit(req: any, res: any, limit = CAPACITY, interval = INTERVAL): boolean {
  const key = getKey(req);
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
  } else {
    const elapsed = now - bucket.lastRefill;
    if (elapsed > 0) {
      const refill = Math.floor(elapsed / interval);
      if (refill > 0) {
        bucket.tokens = Math.min(limit, bucket.tokens + refill * limit);
        bucket.lastRefill += refill * interval;
      }
    }
  }

  if (bucket.tokens <= 0) {
    const retryAfter = Math.ceil((bucket.lastRefill + interval - now) / 1000);
    if (res.setHeader) {
      res.setHeader('Retry-After', String(retryAfter));
    }
    if (typeof res.status === 'function') {
      res.status(429).send?.('Too Many Requests');
    } else {
      res.statusCode = 429;
      res.end?.('Too Many Requests');
    }
    buckets.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

export function limiterStatus() {
  return {
    buckets: Array.from(buckets.entries()).map(([key, value]) => ({ key, tokens: value.tokens, lastRefill: value.lastRefill })),
  };
}

export default rateLimit;
