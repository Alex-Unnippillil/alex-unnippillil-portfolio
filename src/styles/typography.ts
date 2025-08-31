export interface TypographyMap {
  [key: string]: string;
}

export const typography: TypographyMap = {
  h1: 'clamp(2.5rem, 5vw, 3rem)',
  h2: 'clamp(2rem, 4vw, 2.5rem)',
  h3: 'clamp(1.75rem, 3.5vw, 2rem)',
  h4: 'clamp(1.5rem, 3vw, 1.75rem)',
  h5: 'clamp(1.25rem, 2.5vw, 1.5rem)',
  h6: 'clamp(1rem, 2vw, 1.25rem)',
  body: 'clamp(1rem, 1.5vw, 1.125rem)',
};

export const applyTypography = (
  root: HTMLElement = document.documentElement,
): TypographyMap => {
  Object.entries(typography).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
  return typography;
};

export default typography;
