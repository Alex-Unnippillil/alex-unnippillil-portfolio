/**
 * @jest-environment jsdom
 */
import { bindCompositionInput } from '../../src/utils/CompositionInputHandler';

describe('bindCompositionInput', () => {
  it('defers validation until compositionend', () => {
    const input = document.createElement('input');
    const validator = jest.fn((v: string) => v);
    bindCompositionInput(input, validator);

    input.value = '';
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    input.value = 'あ';
    input.dispatchEvent(new InputEvent('input'));
    expect(validator).not.toHaveBeenCalled();

    input.dispatchEvent(new CompositionEvent('compositionend'));
    input.dispatchEvent(new InputEvent('input'));
    expect(validator).toHaveBeenCalledTimes(1);
  });

  it('accepts IME characters without caret jumps', () => {
    const input = document.createElement('input');
    const validator = jest.fn((v: string) => v.replace(/\d/g, ''));
    bindCompositionInput(input, validator);

    input.value = '';
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    input.value = 'あ';
    input.setSelectionRange(1, 1);
    input.dispatchEvent(new InputEvent('input'));

    input.dispatchEvent(new CompositionEvent('compositionend'));
    input.dispatchEvent(new InputEvent('input'));

    expect(input.value).toBe('あ');
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
    expect(validator).toHaveBeenCalledTimes(1);
  });
});
