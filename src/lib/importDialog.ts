import { SnapshotState, WindowPosition, deserializeState } from './snapshot';

export interface PositionDiff {
  from: WindowPosition;
  to: WindowPosition;
}

export interface StateDiff {
  windowsAdded: string[];
  windowsRemoved: string[];
  windowPositionChanged: Record<string, PositionDiff>;
  appChanges: Record<string, { from: unknown; to: unknown }>;
}

export function validateToken(token: string): boolean {
  try {
    deserializeState(token);
    return true;
  } catch (e) {
    return false;
  }
}

export function previewStateDiff(current: SnapshotState, incoming: SnapshotState): StateDiff {
  const diff: StateDiff = {
    windowsAdded: [],
    windowsRemoved: [],
    windowPositionChanged: {},
    appChanges: {},
  };

  const currentWindows = new Map(current.windows.map((w) => [w.id, w]));
  const incomingWindows = new Map(incoming.windows.map((w) => [w.id, w]));

  incomingWindows.forEach((win, id) => {
    const existing = currentWindows.get(id);
    if (!existing) {
      diff.windowsAdded.push(id);
    } else if (existing.position.x !== win.position.x || existing.position.y !== win.position.y) {
      diff.windowPositionChanged[id] = {
        from: existing.position,
        to: win.position,
      };
    }
  });

  currentWindows.forEach((_, id) => {
    if (!incomingWindows.has(id)) {
      diff.windowsRemoved.push(id);
    }
  });

  const keys = new Set([...Object.keys(current.app), ...Object.keys(incoming.app)]);
  keys.forEach((key) => {
    const curVal = (current.app as any)[key];
    const incVal = (incoming.app as any)[key];
    if (JSON.stringify(curVal) !== JSON.stringify(incVal)) {
      diff.appChanges[key] = { from: curVal, to: incVal };
    }
  });

  return diff;
}

export function importSnapshot(token: string, current: SnapshotState): { state: SnapshotState; diff: StateDiff } {
  const incoming = deserializeState(token);
  const diff = previewStateDiff(current, incoming);
  return { state: incoming, diff };
}
