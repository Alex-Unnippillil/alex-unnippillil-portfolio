import Dock from '../../src/modules/apps/Dock';

describe('Dock', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();
  (global as any).localStorage = localStorageMock;

  it('installs and uninstalls apps', () => {
    const dock = new Dock();
    dock.install('Sample');
    expect(dock.getInstalled()).toContain('Sample');
    localStorage.setItem('app:Sample', 'state');
    localStorage.setItem('shortcut:Sample', '1');
    dock.uninstall('Sample');
    expect(dock.getInstalled()).not.toContain('Sample');
    expect(localStorage.getItem('app:Sample')).toBeNull();
    expect(localStorage.getItem('shortcut:Sample')).toBeNull();
  });
});
