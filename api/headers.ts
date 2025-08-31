export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    'accept-encoding': req.headers['accept-encoding'] || null,
  });
}
