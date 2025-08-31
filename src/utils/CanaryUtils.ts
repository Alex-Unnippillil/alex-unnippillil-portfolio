export function hasCanaryFromHeaders(headers: Record<string, string | string[] | undefined>): boolean {
  const header = headers['x-canary'];
  if (typeof header === 'string' && header.toLowerCase() === 'true') {
    return true;
  }
  const cookie = headers['cookie'];
  if (typeof cookie === 'string') {
    return cookie.split(';').map((c) => c.trim()).some((c) => c === 'canary=true');
  }
  return false;
}

export function isCanaryClient(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.cookie.split(';').map((c) => c.trim()).includes('canary=true');
}

export function setCanaryCookie(enabled: boolean): void {
  const expires = enabled ? '' : 'expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  document.cookie = `canary=${enabled ? 'true' : ''};path=/;${expires}`;
}
