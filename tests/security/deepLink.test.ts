import deepLinkGuard from '../../src/utils/deepLinkGuard';

describe('deepLinkGuard', () => {
  it('parses valid link', () => {
    const res = deepLinkGuard('https://example.com/?foo=bar');
    expect(res).toEqual({ foo: 'bar' });
  });

  it('rejects malformed link', () => {
    // missing scheme and bad characters
    expect(deepLinkGuard('http://exa mple.com?foo=bar')).toBeNull();
  });

  it('rejects oversized link', () => {
    const big = 'https://example.com/?data=' + 'a'.repeat(5000);
    expect(deepLinkGuard(big)).toBeNull();
  });
});
