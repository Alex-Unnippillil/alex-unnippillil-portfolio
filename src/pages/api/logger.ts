import { randomUUID } from 'crypto';

export type Handler = (req: any, res: any) => void | Promise<void>;

export function withLogging(handler: Handler): Handler {
  return async (req, res) => {
    const requestId = randomUUID();
    const start = Date.now();
    const originalEnd = res.end;

    res.setHeader('X-Request-Id', requestId);

    res.end = function endProxy(chunk: any, ...args: any[]): any {
      const latency = Date.now() - start;
      const size = chunk ? Buffer.byteLength(chunk) : 0;
      const log = {
        requestId,
        method: req.method,
        url: req.url,
        status: res.statusCode,
        latency,
        size,
      };
      console.log(JSON.stringify(log));
      return originalEnd.call(this, chunk, ...args);
    };

    return handler(req, res);
  };
}
