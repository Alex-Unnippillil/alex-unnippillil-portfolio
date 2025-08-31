import express from 'express';
import axios from 'axios';
import operations from '../graphql/operations.json';
import { sendCached, storeCached } from '../graphql/cache';

export default function registerGraphQL(app: express.Application): void {
  app.post('/graphql', async (req, res) => {
    const { hash, variables } = req.body || {};
    if (typeof hash !== 'string' || !(hash in operations)) {
      res.status(400).json({ error: 'Unknown operation hash' });
      return;
    }

    const cacheKey = `${hash}:${JSON.stringify(variables || {})}`;
    if (sendCached(cacheKey, req, res)) {
      return;
    }

    try {
      const query = (operations as Record<string, string>)[hash];
      const response = await axios.post('https://api.github.com/graphql', {
        query,
        variables,
      });
      storeCached(cacheKey, res, response.data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
