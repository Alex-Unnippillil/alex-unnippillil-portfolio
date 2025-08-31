import { Request, Response, NextFunction } from 'express';

const API_VERSION = process.env.API_VERSION || '1.0';
const SCHEMA_VERSION = process.env.SCHEMA_VERSION || '1.0';

export default function versionMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-API-Version', API_VERSION);
  res.setHeader('X-Schema-Version', SCHEMA_VERSION);
  next();
}
