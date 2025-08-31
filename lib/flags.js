export function getFlag(name, cookieHeader = '') {
  const envValue = process.env[name];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }

  const cookies = cookieHeader
    .split(';')
    .map((c) => c.trim().split('='))
    .reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
  const cookieValue = cookies[name];
  return cookieValue === 'true' || cookieValue === '1';
}

export function getFlags(req) {
  const cookieHeader =
    typeof req?.headers?.get === 'function'
      ? req.headers.get('cookie') || ''
      : '';
  return {
    get: (name) => getFlag(name, cookieHeader),
  };
}

export default { getFlag, getFlags };
