import sessionStore from '../../../services/sessionStore';

function parseCookies(req: any): Record<string, string> {
  const header = req.headers.cookie || '';
  return Object.fromEntries(header.split(';').map((c: string) => {
    const [k, v] = c.trim().split('=');
    return [k, decodeURIComponent(v)];
  }).filter((arr) => arr[0]));
}

export default function handler(req: any, res: any) {
  const cookies = parseCookies(req);
  const sessionId = cookies.session;
  if (!sessionId) {
    res.statusCode = 401;
    res.json({ error: 'No session' });
    return;
  }

  if (req.method === 'POST') {
    const { revoke } = req.body || {};
    if (revoke) {
      sessionStore.revokeSession(sessionId);
      res.setHeader('Set-Cookie', [
        'session=; Path=/; Max-Age=0',
        'refresh=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0',
      ]);
      res.statusCode = 200;
      res.json({ revoked: true });
      return;
    }
    try {
      const refresh = sessionStore.rotateRefresh(sessionId);
      res.setHeader('Set-Cookie', `refresh=${refresh}; HttpOnly; Path=/; SameSite=Strict`);
      res.statusCode = 200;
      res.json({ ok: true });
    } catch (e) {
      res.statusCode = 400;
      res.json({ error: 'Invalid session' });
    }
    return;
  }

  res.statusCode = 405;
  res.end();
}
