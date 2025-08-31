export function withDelayedSkeleton<T>(
  loader: () => Promise<T>,
  skeleton: HTMLElement,
  delay = 200,
): Promise<T> {
  const container = document.body;
  const timer: number = window.setTimeout(() => {
    container.appendChild(skeleton);
  }, delay);

  return loader().finally(() => {
    clearTimeout(timer);
    if (skeleton.parentNode) {
      skeleton.parentNode.removeChild(skeleton);
    }
  });
}
