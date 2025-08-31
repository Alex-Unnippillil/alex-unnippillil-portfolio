import HtmlSanitizer from '../../src/utils/htmlSanitizer';

describe('htmlSanitizer', () => {
  it('strips style and script tags', () => {
    const input = '<div>text<style>.a{}</style><script>alert(1)</script></div>';
    const { sanitizedHtml, strippedElements } = HtmlSanitizer.sanitize(input);

    expect(sanitizedHtml).toBe('<div>text</div>');
    expect(strippedElements).toEqual(['style', 'script']);
  });
});
