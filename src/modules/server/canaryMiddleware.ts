import { hasCanaryFromHeaders } from '../../utils/CanaryUtils';

export default function canaryMiddleware(req: any, _res: any, next: any): void {
  try {
    if (req && req.headers && hasCanaryFromHeaders(req.headers) && typeof req.url === 'string' && !req.url.startsWith('/canary')) {
      req.url = `/canary${req.url}`;
    }
  } catch (e) {
    // ignore parsing errors
  }
  if (typeof next === 'function') {
    next();
  }
}
