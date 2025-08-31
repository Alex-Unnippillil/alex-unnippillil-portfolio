import { getTenantConfig, createTenantStorage } from '../../src/utils/tenant';

describe('tenant utilities', () => {
  it('returns default tenant for unknown hostname', () => {
    const cfg = getTenantConfig('unknown');
    expect(cfg.logo).toBe('/assets/logo.png');
  });

  it('isolates storage by hostname', () => {
    const backing: Record<string, string> = {};
    const fakeStorage = {
      getItem: (k: string) => backing[k] || null,
      setItem: (k: string, v: string) => { backing[k] = v; },
      removeItem: (k: string) => { delete backing[k]; },
    } as Storage;

    const a = createTenantStorage('a.com', fakeStorage);
    const b = createTenantStorage('b.com', fakeStorage);

    a.setItem('token', '1');
    b.setItem('token', '2');

    expect(backing['a.com:token']).toBe('1');
    expect(backing['b.com:token']).toBe('2');
    expect(a.getItem('token')).toBe('1');
    expect(b.getItem('token')).toBe('2');
  });
});
