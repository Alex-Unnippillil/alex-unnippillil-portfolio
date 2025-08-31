import LayoutRecovery from '../../src/utils/layoutRecovery';
import { defaultWindowLayout } from '../../src/state/windowLayout';

class LocalStorageMock {
  private store: { [key: string]: string } = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

beforeEach(() => {
  (global as any).localStorage = new LocalStorageMock();
});

describe('LayoutRecovery', () => {
  it('saves backups of last two layouts', () => {
    LayoutRecovery.save({ version: 1, panes: { first: { x: 0, y: 0, width: 10, height: 10 } } });
    LayoutRecovery.save({ version: 1, panes: { second: { x: 1, y: 1, width: 20, height: 20 } } });
    LayoutRecovery.save({ version: 1, panes: { third: { x: 2, y: 2, width: 30, height: 30 } } });
    expect(localStorage.getItem('windowLayout:backup1')).not.toBeNull();
    expect(localStorage.getItem('windowLayout:backup2')).not.toBeNull();
  });

  it('recovers from corruption or resets to default', () => {
    LayoutRecovery.save({ version: 1, panes: { test: { x: 0, y: 0, width: 10, height: 10 } } });
    const corrupted = JSON.parse(localStorage.getItem('windowLayout')!);
    corrupted.checksum = 'corrupted';
    localStorage.setItem('windowLayout', JSON.stringify(corrupted));

    const layout = LayoutRecovery.load();
    expect(layout).toEqual(defaultWindowLayout);
  });
});
