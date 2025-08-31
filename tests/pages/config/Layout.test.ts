/** @jest-environment jsdom */
import StringUtils from '../../../src/utils/StringUtils';

describe('config page layout', () => {
  test('soft hyphen prevents layout distortion', () => {
    const span = document.createElement('span');
    span.className = 'long-id';
    span.textContent = '123456789012345678901234567890';
    document.body.appendChild(span);
    span.textContent = StringUtils.softHyphenate(span.textContent || '', 5);
    expect(span.textContent).toContain('\u00AD');
  });
});
