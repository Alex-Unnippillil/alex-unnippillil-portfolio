export interface ButtonProps {
  label: string;
}

export const Button = ({ label }: ButtonProps): string =>
  `<button>${label}</button>`;
