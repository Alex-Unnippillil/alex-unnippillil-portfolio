import sessionStore from '../../../services/sessionStore';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { email } = req.body || {};
    if (!email) {
      res.statusCode = 400;
      res.json({ error: 'Email required' });
      return;
    }
    const token = sessionStore.generateMagicToken(email);
    // In real implementation send email here
    console.log(`Magic link for ${email}: /api/auth/magic-link?token=${token}`);
    res.statusCode = 200;
    res.json({ ok: true });
    return;
  }

  if (req.method === 'GET') {
    const { token } = req.query || {};
    try {
      const sessionId = sessionStore.consumeMagicToken(String(token), req.headers['user-agent'] || '');
      res.setHeader('Set-Cookie', `session=${sessionId}; HttpOnly; Path=/; Max-Age=3600`);
      res.statusCode = 200;
      res.json({ ok: true });
    } catch (e) {
      res.statusCode = 400;
      res.json({ error: 'Invalid or expired token' });
    }
    return;
  }

  res.statusCode = 405;
  res.end();
}
