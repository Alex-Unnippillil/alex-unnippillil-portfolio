import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Application } from 'express';
import axios from 'axios';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    const cache = new Map<string, { expires: number; data: any }>();
    const limits = new Map<string, { count: number; time: number }>();

    app.get('/api/reverse-geocode', async (req, res) => {
      const { lat, lng } = req.query as { lat?: string; lng?: string };

      if (!lat || !lng) {
        res.status(400).json({ error: 'Missing coordinates' });
        return;
      }

      const ip = req.ip || 'unknown';
      const now = Date.now();
      const limit = limits.get(ip);

      if (limit && now - limit.time < 60_000 && limit.count >= 10) {
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }

      if (!limit || now - limit.time >= 60_000) {
        limits.set(ip, { count: 1, time: now });
      } else {
        limits.set(ip, { count: limit.count + 1, time: limit.time });
      }

      const key = `${lat},${lng}`;
      const cached = cache.get(key);
      if (cached && cached.expires > now) {
        res.json(cached.data);
        return;
      }

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'gportfolio/1.0',
          },
        });

        const result = { address: data.display_name };
        cache.set(key, { data: result, expires: now + 86_400_000 });
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: 'Failed to fetch address' });
      }
    });
  }
}
