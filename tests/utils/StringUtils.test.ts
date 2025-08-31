import StringUtils from '../../src/utils/StringUtils';

describe('StringUtils', () => {
  describe('removeLastSymbolIfPresent', () => {
    it('url with last slash', () => {
      const url = StringUtils.rtrim('https://example.com/', '/');

      expect(url).toBe('https://example.com');
    });

    it('url with two last slashes', () => {
      const url = StringUtils.rtrim('https://example.com//', '/');

      expect(url).toBe('https://example.com/');
    });

    it('url without last slash', () => {
      const url = StringUtils.rtrim('https://example.com', '/');

      expect(url).toBe('https://example.com');
    });
  });

  describe('softHyphenate', () => {
    it('inserts soft hyphens into long tokens', () => {
      const input = 'abcdefghijK';
      const result = StringUtils.softHyphenate(input, 5);
      expect(result).toBe('abcde\u00ADfghij\u00ADK');
    });
  });
});
