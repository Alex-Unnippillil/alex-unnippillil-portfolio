import sanitize, { validateUrl } from '../../src/utils/sanitize';

describe('sanitize', () => {
  it('removes disallowed tags', () => {
    const input = '<p>Hello</p><script>alert(1)</script>';
    const output = sanitize(input);
    expect(output).toBe('<p>Hello</p>');
  });

  it('rewrites external links', () => {
    const input = '<a href="https://example.com">Example</a>';
    const output = sanitize(input);
    expect(output).toBe('<a href="https://example.com/" rel="noopener noreferrer" target="_blank">Example</a>');
  });

  it('blocks disallowed domains', () => {
    const input = '<a href="https://bad.com">Bad</a>';
    const output = sanitize(input, { blocklist: ['bad.com'] });
    expect(output).toBe('<span>Bad</span>');
  });

  it('validates url with blocklist', () => {
    expect(validateUrl('https://ok.com', ['bad.com'])).toBe('https://ok.com/');
    expect(validateUrl('https://bad.com', ['bad.com'])).toBeNull();
    expect(validateUrl('javascript:alert(1)')).toBeNull();
  });
});
