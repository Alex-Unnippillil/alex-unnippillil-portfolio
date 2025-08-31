/** @jest-environment jsdom */
import CopyUtils from '../../src/utils/CopyUtils';

describe('CopyUtils', () => {
  test('adds copy button and copies text', () => {
    const span = document.createElement('span');
    span.textContent = 'longid';
    span.setAttribute('data-copy-id', '');
    document.body.appendChild(span);

    const writeText = jest.fn();
    // @ts-ignore
    navigator.clipboard = { writeText };

    CopyUtils.attachCopyButtons();

    const btn = document.querySelector('button.copy-btn') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    btn.click();
    expect(writeText).toHaveBeenCalledWith('longid');
  });
});
