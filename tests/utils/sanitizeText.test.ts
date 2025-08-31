import SanitizeText from '../../src/utils/sanitizeText';

describe('SanitizeText', () => {
  it('replaces profanity with asterisks', () => {
    const result = SanitizeText.sanitize('hello shit world');
    expect(result).toBe('hello **** world');
  });

  it('removes urls not in allow list', () => {
    const result = SanitizeText.sanitize('visit http://malicious.com now');
    expect(result).toBe('visit  now');
  });

  it('keeps allowed urls', () => {
    const text = 'check https://github.com/repo';
    const result = SanitizeText.sanitize(text);
    expect(result).toBe(text);
  });
});
