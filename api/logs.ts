import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'data', 'maintenance-log.json');

export default function handler(_req: any, res: any) {
  try {
    const data = fs.readFileSync(logFile, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  } catch {
    res.statusCode = 500;
    res.json({ error: 'log not found' });
  }
}

