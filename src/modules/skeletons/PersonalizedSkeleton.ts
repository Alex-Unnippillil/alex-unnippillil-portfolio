export default function createPersonalizedSkeleton(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'skeleton personalized-skeleton';
  return el;
}
