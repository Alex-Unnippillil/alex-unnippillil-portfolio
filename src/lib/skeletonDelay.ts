export default function skeletonDelay(show: () => void, delay = 200): () => void {
  const timer = window.setTimeout(show, delay);
  return () => window.clearTimeout(timer);
}
