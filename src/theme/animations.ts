export const durations = {
  short: 100,
  medium: 200,
  long: 500,
};

export const easings = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
};

export const applyAnimationVariables = (reduceMotion = false): void => {
  const root = document.documentElement;
  Object.entries(durations).forEach(([name, value]) => {
    const duration = reduceMotion ? 0 : value;
    root.style.setProperty(`--animation-duration-${name}`, `${duration}ms`);
  });
  Object.entries(easings).forEach(([name, value]) => {
    root.style.setProperty(`--animation-easing-${name}`, value);
  });
};

export default { durations, easings, applyAnimationVariables };
