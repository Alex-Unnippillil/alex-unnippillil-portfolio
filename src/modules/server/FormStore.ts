import { Request, Response } from 'express';

export interface Diff {
  [key: string]: { current: any; incoming: any };
}

export function calculateDiff(current: any, incoming: any): Diff {
  const diff: Diff = {};
  const keys = new Set([...Object.keys(current || {}), ...Object.keys(incoming || {})]);
  keys.forEach((key) => {
    const cur = current ? current[key] : undefined;
    const inc = incoming ? incoming[key] : undefined;
    if (JSON.stringify(cur) !== JSON.stringify(inc)) {
      diff[key] = { current: cur, incoming: inc };
    }
  });
  return diff;
}

export default class FormStore {
  private data: any = {};

  private version = 0;

  submit(req: Request, res: Response): void {
    const incomingVersion = req.headers['if-match']
      ? Number(req.headers['if-match'])
      : Number((req.body && req.body.version) || 0);
    const incomingData = req.body && req.body.data ? req.body.data : {};

    if (incomingVersion !== this.version) {
      res.status(409).json({
        message: 'Version conflict',
        version: this.version,
        diff: calculateDiff(this.data, incomingData),
        current: this.data,
      });
      return;
    }

    this.version += 1;
    this.data = incomingData;
    res.json({ version: this.version });
  }
}
