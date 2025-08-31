export type Density = 'compact' | 'cozy' | 'comfortable';

const STORAGE_KEY = 'density';

const MULTIPLIER: Record<Density, number> = {
  compact: 0.75,
  cozy: 1,
  comfortable: 1.25,
};

export const getDensity = (): Density => {
  const value = localStorage.getItem(STORAGE_KEY) as Density | null;
  if (value && Object.keys(MULTIPLIER).includes(value)) {
    return value;
  }
  return 'cozy';
};

export const applyDensity = (
  density: Density,
  root: HTMLElement = document.documentElement,
): void => {
  const element = root;
  element.dataset.density = density;
  element.style.setProperty('--density', String(MULTIPLIER[density]));
};

export const setDensity = (
  density: Density,
  root: HTMLElement = document.documentElement,
): void => {
  localStorage.setItem(STORAGE_KEY, density);
  applyDensity(density, root);
};

export const initDensity = (root: HTMLElement = document.documentElement): void => {
  applyDensity(getDensity(), root);
};

export const cycleDensity = (root: HTMLElement = document.documentElement): void => {
  const order: Density[] = ['compact', 'cozy', 'comfortable'];
  const current = getDensity();
  const next = order[(order.indexOf(current) + 1) % order.length];
  setDensity(next, root);
};
