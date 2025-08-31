export type TokenName = 'surface' | 'overlay' | 'border' | 'muted' | 'brand';

export type Theme = 'light' | 'dark';

export interface TokenSet {
  surface: string;
  overlay: string;
  border: string;
  muted: string;
  brand: string;
}

export const tokens: Record<Theme, TokenSet> = {
  light: {
    surface: '#ffffff',
    overlay: '#f8f9fa',
    border: '#e2e8f0',
    muted: '#6b7280',
    brand: '#047857',
  },
  dark: {
    surface: '#232931',
    overlay: '#2f343d',
    border: '#4b5563',
    muted: '#9ca3af',
    brand: '#4ecca3',
  },
};

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16) / 255;
  const g = parseInt(value.substring(2, 4), 16) / 255;
  const b = parseInt(value.substring(4, 6), 16) / 255;

  const [rr, gg, bb] = [r, g, b].map((v) => (
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  ));

  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

function contrast(a: string, b: string): number {
  let la = luminance(a);
  let lb = luminance(b);
  if (la < lb) {
    [la, lb] = [lb, la];
  }
  return (la + 0.05) / (lb + 0.05);
}

function validateContrast(set: TokenSet): void {
  const pairs: [TokenName, TokenName][] = [
    ['surface', 'brand'],
    ['surface', 'muted'],
    ['overlay', 'brand'],
    ['overlay', 'muted'],
  ];

  pairs.forEach(([bg, fg]) => {
    const ratio = contrast(set[bg], set[fg]);
    if (ratio < 4.5) {
      // eslint-disable-next-line no-console
      console.warn(`Low contrast between ${bg} and ${fg}: ${ratio.toFixed(2)}`);
    }
  });
}

export function applyTheme(theme: Theme): void {
  const set = tokens[theme];
  const root = document.documentElement;
  (Object.keys(set) as TokenName[]).forEach((key) => {
    root.style.setProperty(`--${key}`, set[key]);
  });
  validateContrast(set);
}
