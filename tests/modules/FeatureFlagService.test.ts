import { FeatureFlagService } from '../../src/modules/featureFlags';

describe('FeatureFlagService', () => {
  it('uses channel defaults', () => {
    const preview = new FeatureFlagService('preview');
    const prod = new FeatureFlagService('production');
    expect(preview.isEnabled('sample')).toBe(true);
    expect(prod.isEnabled('sample')).toBe(false);
  });

  it('stores values per channel', () => {
    const storage: Storage = {
      data: {} as Record<string, string>,
      getItem(key: string) { return (this.data as any)[key] ?? null; },
      setItem(key: string, value: string) { (this.data as any)[key] = value; },
      removeItem() {},
      clear() {},
      key() { return null; },
      length: 0,
    } as any;
    const preview = new FeatureFlagService('preview', storage);
    preview.toggle('sample');
    expect(storage.getItem('feature:preview:sample')).not.toBeNull();
    expect(storage.getItem('feature:production:sample')).toBeNull();
  });

  it('requires two confirmations for dangerous production toggles', () => {
    const prod = new FeatureFlagService('production');
    const calls: string[] = [];
    const confirmFn = (msg: string) => {
      calls.push(msg);
      return true;
    };
    prod.toggle('sample', confirmFn);
    expect(calls.length).toBe(2);
  });
});
