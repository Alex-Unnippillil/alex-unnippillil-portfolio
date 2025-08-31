import express from 'express';
import { recordHit, getHitRate } from '../../metrics/cacheCounters';

const router = express.Router();

router.get('/cache-debug', (req: any, res: any) => {
  const start = process.hrtime();
  const cacheControl = res.get('Cache-Control') || req.headers['cache-control'] || '';
  const cdnStatus = req.headers['x-cache'] || req.headers['cdn-cache-status'] || 'MISS';
  const etag = res.get('ETag') || req.headers['if-none-match'] || '';

  const path = (req.query.path as string) || req.path;
  const isHit = typeof cdnStatus === 'string' && cdnStatus.toUpperCase().includes('HIT');
  recordHit(path, isHit);
  const hitRate = getHitRate(path);

  const diff = process.hrtime(start);
  const responseTime = diff[0] * 1000 + diff[1] / 1e6;

  res.json({
    cacheControl,
    cdnStatus,
    etag,
    responseTime,
    hitRate,
  });
});

export default router;
