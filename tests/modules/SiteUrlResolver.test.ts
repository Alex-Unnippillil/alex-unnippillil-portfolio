import SiteUrlResolver from '../../src/modules/core/SiteUrlResolver';

describe('SiteUrlResolver', () => {
  it('With last slash', () => {
    const siteUrlResolver = new SiteUrlResolver({
      domain: 'example.com',
      path: '/',
      protocol: 'https',
    }, 'en_US');

    expect(siteUrlResolver.resolve()).toBe('https://example.com/en');
  });

  it('Without last slash', () => {
    const siteUrlResolver = new SiteUrlResolver({
      domain: 'example.com',
      path: '/path',
      protocol: 'https',
    }, 'en_US');

    expect(siteUrlResolver.resolve()).toBe('https://example.com/en/path');
  });
});
