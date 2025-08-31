export const durations = {
  short: 0.2,
  medium: 0.4,
  long: 0.6,
} as const;

export const easings = {
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const fadeScale = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

export const transition = {
  duration: durations.medium,
  ease: easings.standard,
};
