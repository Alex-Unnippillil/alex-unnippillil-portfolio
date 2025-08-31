export interface HeaderProps {
  text: string;
}

export const Header = ({ text }: HeaderProps): string =>
  `<h1>${text}</h1>`;
