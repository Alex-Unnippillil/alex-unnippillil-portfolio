export interface ColorPair {
  name: string;
  foreground: string;
  background: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return { r, g, b };
}

function componentToHex(c: number): string {
  const hex = Math.round(Math.min(Math.max(c, 0), 255)).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex({ r, g, b }: RGB): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function luminance({ r, g, b }: RGB): number {
  const srgb = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = luminance(hexToRgb(foreground));
  const l2 = luminance(hexToRgb(background));
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

export function meetsAA(foreground: string, background: string, large = false): boolean {
  const ratio = contrastRatio(foreground, background);
  return ratio >= (large ? 3 : 4.5);
}

function adjustChannel(channel: number, amount: number): number {
  return Math.min(255, Math.max(0, channel + amount));
}

function adjustColor(rgb: RGB, amount: number): RGB {
  return {
    r: adjustChannel(rgb.r, amount),
    g: adjustChannel(rgb.g, amount),
    b: adjustChannel(rgb.b, amount),
  };
}

export function autoAdjust(foreground: string, background: string, large = false): string {
  let fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const target = large ? 3 : 4.5;
  let ratio = contrastRatio(rgbToHex(fg), background);
  let attempts = 0;
  while (ratio < target && attempts < 100) {
    const fgLum = luminance(fg);
    const bgLum = luminance(bg);
    const amount = fgLum > bgLum ? 10 : -10;
    fg = adjustColor(fg, amount);
    ratio = contrastRatio(rgbToHex(fg), background);
    attempts += 1;
  }
  return rgbToHex(fg);
}

export function validatePairs(pairs: ColorPair[], large = false): boolean {
  return pairs.every((p) => meetsAA(p.foreground, p.background, large));
}
