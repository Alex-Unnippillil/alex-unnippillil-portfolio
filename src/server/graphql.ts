import { IncomingMessage, ServerResponse } from 'http';
import { operations } from '../graphql/operations';
import * as cache from '../graphql/cache';

const WHITELIST = new Set(Object.keys(operations));

function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export default async function graphqlHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end();
    return;
  }

  const body = await readBody(req).catch(() => undefined);
  const { hash, variables } = body || {};

  if (!hash || !WHITELIST.has(hash)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Unknown query hash' }));
    return;
  }

  const query = (operations as Record<string, string>)[hash];
  const cacheKey = hash + ':' + JSON.stringify(variables || {});
  const cached = cache.get(cacheKey, req, res);
  if (cached) {
    if (cached === cache.NOT_MODIFIED) {
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cached));
    return;
  }

  // Placeholder: In a real application this would execute the query against a GraphQL service.
  const result = { data: null, query };

  cache.set(cacheKey, result, res);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}
