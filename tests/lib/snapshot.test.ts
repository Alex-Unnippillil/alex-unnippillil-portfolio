import { serializeState, deserializeState, CURRENT_SNAPSHOT_VERSION, SnapshotState } from '../../src/lib/snapshot';
import { validateToken, previewStateDiff, importSnapshot } from '../../src/lib/importDialog';

describe('snapshot serialization', () => {
  it('round trip serialization', () => {
    const state = {
      windows: [{ id: 'w1', position: { x: 1, y: 2 } }],
      positions: { w1: { x: 1, y: 2 } },
      app: { foo: 'bar' },
    };

    const token = serializeState(state);
    const decoded = deserializeState(token);

    expect(decoded).toEqual({
      version: CURRENT_SNAPSHOT_VERSION,
      windows: state.windows,
      positions: state.positions,
      app: state.app,
    });
  });

  it('deserializes version 1 token', () => {
    const legacy = {
      version: 1,
      windows: [{ id: 'w1', position: { x: 5, y: 6 } }],
      app: { foo: 'bar' },
    };
    const legacyToken = Buffer.from(JSON.stringify(legacy), 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/u, '');

    const decoded = deserializeState(legacyToken);

    expect(decoded.windows.length).toBe(1);
    expect(decoded.positions).toEqual({ w1: { x: 5, y: 6 } });
    expect(decoded.app).toEqual({ foo: 'bar' });
    expect(decoded.version).toBe(CURRENT_SNAPSHOT_VERSION);
  });
});

describe('import dialog', () => {
  const baseState: SnapshotState = {
    version: CURRENT_SNAPSHOT_VERSION,
    windows: [{ id: 'a', position: { x: 0, y: 0 } }],
    positions: { a: { x: 0, y: 0 } },
    app: { foo: 'bar' },
  };

  it('validates token correctly', () => {
    const token = serializeState(baseState);
    expect(validateToken(token)).toBeTruthy();
    expect(validateToken('badtoken')).toBeFalsy();
  });

  it('previews diff', () => {
    const incoming: SnapshotState = {
      version: CURRENT_SNAPSHOT_VERSION,
      windows: [
        { id: 'a', position: { x: 1, y: 1 } },
        { id: 'b', position: { x: 0, y: 0 } },
      ],
      positions: { a: { x: 1, y: 1 }, b: { x: 0, y: 0 } },
      app: { foo: 'baz' },
    };

    const diff = previewStateDiff(baseState, incoming);

    expect(diff.windowsAdded).toEqual(['b']);
    expect(diff.windowsRemoved).toEqual([]);
    expect(diff.windowPositionChanged.a.from).toEqual({ x: 0, y: 0 });
    expect(diff.windowPositionChanged.a.to).toEqual({ x: 1, y: 1 });
    expect(diff.appChanges.foo.from).toBe('bar');
    expect(diff.appChanges.foo.to).toBe('baz');
  });

  it('importSnapshot returns incoming state and diff', () => {
    const incomingState = {
      windows: [{ id: 'a', position: { x: 2, y: 2 } }],
      positions: { a: { x: 2, y: 2 } },
      app: { foo: 'qux' },
    };
    const token = serializeState(incomingState);
    const result = importSnapshot(token, baseState);
    expect(result.state.app.foo).toBe('qux');
    expect(result.diff.windowPositionChanged.a.to).toEqual({ x: 2, y: 2 });
  });
});
