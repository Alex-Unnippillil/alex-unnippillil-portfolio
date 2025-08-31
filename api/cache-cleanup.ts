import { createHmac, timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'data', 'maintenance-log.json');

function verify(req: any): { ok: boolean; timestamp: string | null } {
  const signature = req.headers['x-cron-signature'] as string | undefined;
  const timestamp = req.headers['x-cron-timestamp'] as string | undefined;
  if (!signature || !timestamp) return { ok: false, timestamp: null };
  const hmac = createHmac('sha256', process.env.CRON_SECRET || '');
  hmac.update(timestamp);
  const expected = hmac.digest('hex');
  try {
    const ok = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    return { ok, timestamp };
  } catch {
    return { ok: false, timestamp: null };
  }
}

function readLog(): any {
  try {
    const data = fs.readFileSync(logFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeLog(log: any) {
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

export default async function handler(req: any, res: any) {
  const start = Date.now();
  const { ok, timestamp } = verify(req);
  if (!ok || !timestamp) {
    res.statusCode = 401;
    res.json({ error: 'Invalid signature' });
    return;
  }

  const log = readLog();
  if (log.cleanup && log.cleanup.lastRun === new Date(Number(timestamp)).toISOString()) {
    res.statusCode = 200;
    res.json({ skipped: true });
    return;
  }

  try {
    // TODO: implement actual cache cleanup logic
    const durationMs = Date.now() - start;
    log.cleanup = {
      lastRun: new Date(Number(timestamp)).toISOString(),
      durationMs,
      result: 'success',
    };
    writeLog(log);
    res.json({ ok: true, durationMs });
  } catch (e) {
    const durationMs = Date.now() - start;
    log.cleanup = {
      lastRun: new Date(Number(timestamp)).toISOString(),
      durationMs,
      result: 'error',
    };
    writeLog(log);
    res.statusCode = 500;
    res.json({ error: 'failed' });
  }
}

