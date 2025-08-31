export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface AccessiblePair {
  background: string;
  foreground: string;
}

function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized.length === 3 ? sanitized.split('').map((c) => c + c).join('') : sanitized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function luminance({ r, g, b }: RGB): number {
  const a = [r, g, b].map((v) => {
    const channel = v / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrast(color1: string, color2: string): number {
  const L1 = luminance(hexToRgb(color1));
  const L2 = luminance(hexToRgb(color2));
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function generateAccessiblePair(background: string): AccessiblePair {
  const whiteContrast = contrast(background, '#ffffff');
  const blackContrast = contrast(background, '#000000');
  let foreground = whiteContrast >= blackContrast ? '#ffffff' : '#000000';

  if (contrast(background, foreground) < 4.5) {
    foreground = whiteContrast >= blackContrast ? '#ffffff' : '#000000';
  }

  return { background, foreground };
}

export default generateAccessiblePair;
