/** @jest-environment jsdom */
import TextareaUtils from '../../src/utils/TextareaUtils';

describe('TextareaUtils', () => {
  test('autoSize adjusts height under max', () => {
    const ta = document.createElement('textarea');
    Object.defineProperty(ta, 'scrollHeight', { get: () => 50 });
    document.body.appendChild(ta);
    TextareaUtils.autoSize(ta, 100);
    expect(ta.style.height).toBe('50px');
    expect(ta.style.overflowY).toBe('hidden');
  });

  test('autoSize limits height over max', () => {
    const ta = document.createElement('textarea');
    Object.defineProperty(ta, 'scrollHeight', { get: () => 500 });
    document.body.appendChild(ta);
    TextareaUtils.autoSize(ta, 100);
    expect(ta.style.height).toBe('100px');
    expect(ta.style.overflowY).toBe('auto');
  });
});
