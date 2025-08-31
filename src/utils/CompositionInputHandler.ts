export type Validator = (value: string) => string;

export function bindCompositionInput(
  input: HTMLInputElement,
  validator: Validator,
): void {
  let isComposing = false;

  const runValidation = (): void => {
    const { selectionStart, selectionEnd } = input;
    const newValue = validator(input.value);
    if (input.value !== newValue) {
      input.value = newValue;
      if (selectionStart !== null && selectionEnd !== null) {
        input.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  };

  input.addEventListener('compositionstart', () => {
    isComposing = true;
  });

  input.addEventListener('compositionupdate', () => {
    // ignore updates during composition
  });

  input.addEventListener('compositionend', () => {
    isComposing = false;
  });

  input.addEventListener('input', () => {
    if (!isComposing) {
      runValidation();
    }
  });
}
