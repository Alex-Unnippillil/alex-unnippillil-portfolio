import { Request, Response, NextFunction } from 'express';

type Bucket = {
  tokens: number;
  last: number;
};

export class TokenBucket {
  private buckets = new Map<string, Bucket>();

  constructor(private tokensPerInterval: number, private interval: number) {}

  consume(key: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key) || { tokens: this.tokensPerInterval, last: now };
    const elapsed = now - bucket.last;
    const refill = (elapsed / this.interval) * this.tokensPerInterval;
    bucket.tokens = Math.min(this.tokensPerInterval, bucket.tokens + refill);
    bucket.last = now;

    if (bucket.tokens < 1) {
      this.buckets.set(key, bucket);
      return false;
    }

    bucket.tokens -= 1;
    this.buckets.set(key, bucket);
    return true;
  }
}

export const rateLimit = (bucket: TokenBucket) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const key = req.ip;
  if (!bucket.consume(key)) {
    res.status(429).send('Too Many Requests');
    return;
  }
  next();
};
