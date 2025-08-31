const BASE = 4;

export const generateSpacingScale = (steps: number = 128): Record<number, string> => {
  const scale: Record<number, string> = {};
  for (let i = 0; i <= steps; i += 1) {
    scale[i] = `${i * BASE}px`;
  }
  return scale;
};

export const applySpacing = (
  root: HTMLElement = document.documentElement,
  steps: number = 128,
): Record<number, string> => {
  const scale = generateSpacingScale(steps);
  Object.entries(scale).forEach(([key, value]) => {
    root.style.setProperty(`--space-${key}`, value);
  });
  return scale;
};

export const spacing = generateSpacingScale();

export default spacing;
