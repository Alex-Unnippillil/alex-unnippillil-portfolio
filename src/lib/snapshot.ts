export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowState {
  id: string;
  position: WindowPosition;
}

export interface SnapshotState {
  version: number;
  windows: WindowState[];
  positions: Record<string, WindowPosition>;
  app: Record<string, unknown>;
}

export const CURRENT_SNAPSHOT_VERSION = 2;

function toBase64Url(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}

function fromBase64Url(str: string): string {
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
  return Buffer.from(padded, 'base64').toString('utf8');
}

export interface SerializableState {
  windows: WindowState[];
  positions: Record<string, WindowPosition>;
  app: Record<string, unknown>;
}

export function serializeState(state: SerializableState): string {
  const payload: SnapshotState = {
    version: CURRENT_SNAPSHOT_VERSION,
    windows: state.windows,
    positions: state.positions,
    app: state.app,
  };

  return toBase64Url(JSON.stringify(payload));
}

export function deserializeState(token: string): SnapshotState {
  let raw: any;

  try {
    raw = JSON.parse(fromBase64Url(token));
  } catch (e) {
    throw new Error('Invalid snapshot token');
  }

  const version: number = typeof raw.version === 'number' ? raw.version : 1;

  if (version === 1) {
    const winArray: WindowState[] = Array.isArray(raw.windows) ? raw.windows : [];
    const positions: Record<string, WindowPosition> = {};
    winArray.forEach((w) => {
      if (w && typeof w.id === 'string' && w.position) {
        positions[w.id] = w.position;
      }
    });

    return {
      version: CURRENT_SNAPSHOT_VERSION,
      windows: winArray,
      positions,
      app: raw.app ?? {},
    };
  }

  if (version === 2 || version === CURRENT_SNAPSHOT_VERSION) {
    return {
      version: CURRENT_SNAPSHOT_VERSION,
      windows: Array.isArray(raw.windows) ? raw.windows : [],
      positions: raw.positions ?? {},
      app: raw.app ?? {},
    };
  }

  throw new Error(`Unsupported snapshot version: ${version}`);
}
