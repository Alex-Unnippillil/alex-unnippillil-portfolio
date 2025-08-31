import TagCache from '../../src/utils/TagCache';

describe('TagCache', () => {
  it('stores and retrieves values', () => {
    const cache = new TagCache<number>();
    cache.set('a', 1, ['group1']);
    expect(cache.get('a')).toBe(1);
  });

  it('invalidates by tag', () => {
    const cache = new TagCache<number>();
    cache.set('a', 1, ['group1']);
    cache.set('b', 2, ['group1', 'group2']);

    cache.invalidateTags(['group1']);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
