import Markdown from '../../src/utils/Markdown';

describe('Markdown pipeline', () => {
  test('produces heading slugs', async () => {
    const html = await Markdown.render('# Hello World');
    expect(html).toContain('<h1 id="hello-world">Hello World</h1>');
  });

  test('rewrites external links', async () => {
    const html = await Markdown.render('[Example](https://example.com)');
    expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener">Example</a>');
  });

  test('highlights code blocks with shiki', async () => {
    const html = await Markdown.render('```js\nconsole.log("hi")\n```');
    expect(html).toMatch(/<pre class="shiki/);
    expect(html).toMatch(/span style="color:/);
  });

  test('sanitizes dangerous content', async () => {
    const input = '<script>alert(1)</script>\n```html\n<img src=x onerror=alert(1)>\n```';
    const html = await Markdown.render(input);
    expect(html).not.toContain('<script>');
    expect(html).not.toMatch(/<img[^>]+onerror=/);
  });
});
