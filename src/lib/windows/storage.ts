export interface WindowBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

const KEY_PREFIX = 'gportfolio:popout:';

function getKey(type: string): string {
  return `${KEY_PREFIX}${type}`;
}

export function saveBounds(type: string, bounds: WindowBounds): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(getKey(type), JSON.stringify(bounds));
  } catch {
    // ignore storage errors
  }
}

export function loadBounds(type: string): WindowBounds | undefined {
  try {
    if (typeof localStorage === 'undefined') return undefined;
    const raw = localStorage.getItem(getKey(type));
    return raw ? JSON.parse(raw) as WindowBounds : undefined;
  } catch {
    return undefined;
  }
}
