import { stats as cacheStats } from '../../../utils/kvCache';
import { limiterStatus } from '../../../middleware/rateLimit';

export default function handler(req: any, res: any): void {
  if (req.headers?.['x-admin'] !== '1') {
    if (typeof res.status === 'function') {
      res.status(403).send?.('Forbidden');
    } else {
      res.statusCode = 403;
      res.end?.('Forbidden');
    }
    return;
  }

  const body = {
    cache: cacheStats(),
    rateLimit: limiterStatus(),
  };

  if (typeof res.json === 'function') {
    res.status?.(200).json(body);
  } else {
    res.statusCode = 200;
    res.setHeader?.('Content-Type', 'application/json');
    res.end?.(JSON.stringify(body));
  }
}
