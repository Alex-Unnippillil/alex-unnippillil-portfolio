import TimeSync from './TimeSync';

export function getCountdownRemaining(target: number): number {
  return Math.max(0, TimeSync.msUntil(target));
}

export function isTokenExpired(expiry: number): boolean {
  return TimeSync.isExpired(expiry);
}

