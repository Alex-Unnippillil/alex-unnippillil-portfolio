import crypto from 'crypto';

export interface ClickLog {
  ts: number;
  ua: string;
  utm: Record<string, string>;
}

export interface ShortLink {
  id: string;
  owner: string;
  target: string;
  disabled: boolean;
  expiresAt?: number;
  clicks: ClickLog[];
}

const links: Record<string, ShortLink> = {};

export function createLink(owner: string, target: string, opts?: { disabled?: boolean; expiresAt?: number }): ShortLink {
  const id = crypto.randomBytes(4).toString('hex');
  const link: ShortLink = {
    id,
    owner,
    target,
    disabled: opts?.disabled ?? false,
    expiresAt: opts?.expiresAt,
    clicks: [],
  };
  links[id] = link;
  return link;
}

export function getLink(id: string): ShortLink | undefined {
  return links[id];
}

export function listLinks(): ShortLink[] {
  return Object.values(links);
}

export function logClick(link: ShortLink, log: ClickLog): void {
  link.clicks.push(log);
}
