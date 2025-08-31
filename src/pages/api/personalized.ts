import { Request, Response } from 'express';

export const revalidate = 60;

export default function handler(req: Request, res: Response): void {
  res.setHeader(
    'Cache-Control',
    `public, max-age=0, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 5}`,
  );
  res.json({ message: 'Hello from personalized endpoint' });
}
