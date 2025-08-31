import LocalStorageCache from '../../src/utils/LocalStorageCache';

class MemoryStorage {
  private store: { [key: string]: string } = {};

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('LocalStorageCache', () => {
  beforeEach(() => {
    (global as any).localStorage = new MemoryStorage() as any;
  });

  it('saves version with data', () => {
    const cache = new LocalStorageCache('t', 1, { a: 1 });
    cache.save({ a: 2 });

    const raw = (global as any).localStorage.getItem('t');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toStrictEqual({ v: 1, data: { a: 2 } });
  });

  it('migrates data to new version', () => {
    (global as any).localStorage.setItem('t', JSON.stringify({ v: 1, data: { a: 1 } }));
    const cache = new LocalStorageCache('t', 2, { a: 0 }, {
      1: (data: any) => ({ ...data, b: 2 }),
    });

    const data = cache.load();

    expect(data).toStrictEqual({ a: 1, b: 2 });
    const stored = JSON.parse((global as any).localStorage.getItem('t') as string);
    expect(stored.v).toBe(2);
  });

  it('resets and logs on migration failure', () => {
    const logger = {
      error: jest.fn(),
      log: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as any;

    (global as any).localStorage.setItem('t', JSON.stringify({ v: 1, data: { a: 1 } }));
    const cache = new LocalStorageCache('t', 2, { a: 0 }, {
      1: () => { throw new Error('fail'); },
    }, logger);

    const data = cache.load();

    expect(data).toStrictEqual({ a: 0 });
    expect((global as any).localStorage.getItem('t')).toBeNull();
    expect(logger.error).toHaveBeenCalled();
  });
});

