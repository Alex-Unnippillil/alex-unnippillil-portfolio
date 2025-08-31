import createCacheKey from '../../src/utils/cacheKey';

describe('createCacheKey', () => {
  it('creates stable keys including session info', () => {
    const key1 = createCacheKey('/test', { b: '2', a: '1' }, 'session');
    const key2 = createCacheKey('/test', { a: '1', b: '2' }, 'session');
    const key3 = createCacheKey('/test', { a: '1', b: '2' }, 'other');

    expect(key1).toBe('/test|a=1&b=2|session');
    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
  });
});
