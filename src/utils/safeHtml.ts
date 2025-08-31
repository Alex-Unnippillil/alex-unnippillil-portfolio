/* eslint-disable @typescript-eslint/no-var-requires */
const { JSDOM } = require('jsdom');
/* eslint-enable @typescript-eslint/no-var-requires */

const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'br',
  'code',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'ul',
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
};

function clean(node: Element): void {
  const children = Array.from(node.children);
  for (const child of children) {
    const tag = child.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      child.remove();
      continue;
    }

    const allowedAttr = ALLOWED_ATTRIBUTES[tag] ?? new Set();
    for (const attr of Array.from(child.attributes)) {
      if (!allowedAttr.has(attr.name)) {
        child.removeAttribute(attr.name);
      }
    }

    if (tag === 'a' && child.hasAttribute('href')) {
      const href = child.getAttribute('href') || '';
      if (!/^(https?:|mailto:)/i.test(href)) {
        child.removeAttribute('href');
      }
    }

    clean(child);
  }
}

export default function safeHtml(dirty: string): string {
  const dom = new JSDOM(`<body>${dirty}</body>`);
  const { document } = dom.window;
  const body = document.body;
  clean(body);
  return body.innerHTML;
}
