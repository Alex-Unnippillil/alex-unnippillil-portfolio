export interface ButtonProps {
  label: string;
}

/**
 * Creates a basic button element.
 * Ensures an accessible name via the label prop.
 */
export default function Button({ label }: ButtonProps): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  return btn;
}
