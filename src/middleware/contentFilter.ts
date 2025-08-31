import type { Request, Response, NextFunction } from 'express';

// Simple profanity list for demonstration purposes
const PROFANITY_LIST = ['damn', 'hell', 'shit'];

const URL_REGEX = /https?:\/\/[^\s]+/i;

export default function contentFilter(req: Request, res: Response, next: NextFunction): void {
  const text = typeof req.body?.text === 'string' ? req.body.text : undefined;

  if (text) {
    if (PROFANITY_LIST.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(text))) {
      res.status(400).json({ error: 'Profanity is not allowed' });
      return;
    }

    if (URL_REGEX.test(text)) {
      res.status(400).json({ error: 'Links are not allowed' });
      return;
    }
  }

  next();
}
