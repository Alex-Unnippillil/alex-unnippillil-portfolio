import { bindCompositionInput } from '../../utils/CompositionInputHandler';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input').forEach((el) => {
    bindCompositionInput(el as HTMLInputElement, (value) => value);
  });
});
