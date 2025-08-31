import safeHtml from '../../src/utils/safeHtml';

describe('safeHtml', () => {
  it('removes script tags', () => {
    const html = '<p>hello</p><script>alert(1)</script>';
    expect(safeHtml(html)).toBe('<p>hello</p>');
  });

  it('removes img tags', () => {
    const html = '<p>hello</p><img src="x" onerror="alert(1)">';
    expect(safeHtml(html)).toBe('<p>hello</p>');
  });

  it('strips disallowed attributes', () => {
    const html = '<a href="https://example.com" onclick="alert(1)">link</a>';
    expect(safeHtml(html)).toBe('<a href="https://example.com">link</a>');
  });
});
