import { Request, Response } from 'express';
import kvCache from '../../lib/cache/kvCache';
import { rateLimiter } from '../../middleware/rateLimit';

export default function cacheMetrics(req: Request, res: Response): void {
  res.json({
    cache: kvCache.status(),
    limiter: rateLimiter.status(),
  });
}
