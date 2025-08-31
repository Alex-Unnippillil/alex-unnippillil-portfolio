import operations from './operations.json';

interface FetchOptions {
  variables?: Record<string, any>;
}

export default async function fetchGraphQL(hash: string, options: FetchOptions = {}): Promise<any> {
  if (!(hash in operations)) {
    throw new Error('Unknown operation hash');
  }
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash, variables: options.variables }),
  });
  return response.json();
}
