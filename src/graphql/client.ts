import { operations } from './operations';

/**
 * Execute a persisted GraphQL operation by hash.
 * The full query string is never sent over the network.
 */
export async function fetchGraphQL<T = any>(hash: string, variables?: Record<string, unknown>, endpoint = '/graphql'): Promise<T> {
  if (!(hash in operations)) {
    throw new Error('Unknown operation hash');
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json();
}
