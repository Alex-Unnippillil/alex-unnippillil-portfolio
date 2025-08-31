// @ts-ignore No type definitions needed for tests
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');
(global as any).window = window;
(global as any).document = window.document;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ClipboardUtils = require('../../src/utils/ClipboardUtils').default;

describe('ClipboardUtils', () => {
  describe('sanitizeHtml', () => {
    it('removes script tags', () => {
      const dirty = '<div><script>alert(1)</script><b>Hi</b></div>';
      expect(ClipboardUtils.sanitizeHtml(dirty)).toBe('<div><b>Hi</b></div>');
    });

    it('strips event handlers', () => {
      const dirty = '<img src="x" onerror="alert(1)" />';
      expect(ClipboardUtils.sanitizeHtml(dirty)).toBe('<img src="x">');
    });
  });
});
