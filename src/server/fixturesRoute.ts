import { Application } from 'express';
import path from 'path';

/**
 * Registers routes used to seed and reset fixtures.
 * Routes are only available when NODE_ENV is not production.
 */
export default function fixturesRoute(app: Application): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const seedsPath = path.resolve(process.cwd(), 'tests/fixtures/seeds');

  app.post('/__fixtures__/load', async (_req, res) => {
    const { seed } = require(seedsPath);
    await seed();
    res.json({ status: 'ok' });
  });

  app.post('/__fixtures__/reset', async (_req, res) => {
    const { reset } = require(seedsPath);
    await reset();
    res.json({ status: 'ok' });
  });
}
