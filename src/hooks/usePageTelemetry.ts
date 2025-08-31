export interface PageTelemetry {
  title: string;
  section: string;
  breadcrumb: string[];
}

export type TelemetryEmitter = (data: PageTelemetry) => void;

/**
 * Register listeners for route changes and emit page telemetry.
 *
 * The provided `emitter` will be called with current page `title`, first
 * `section` of the path and an array `breadcrumb` on each navigation event.
 *
 * @param emitter - function handling telemetry payload
 * @returns cleanup function removing listeners
 */
export default function usePageTelemetry(emitter: TelemetryEmitter): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const buildPayload = (): PageTelemetry => {
    const { title } = document;
    const segments = window.location.pathname.split('/').filter(Boolean);
    const section = segments[0] || '';

    return {
      title,
      section,
      breadcrumb: segments,
    };
  };

  const handler = (): void => {
    emitter(buildPayload());
  };

  window.addEventListener('popstate', handler);
  window.addEventListener('hashchange', handler);

  // Emit once on registration
  handler();

  return () => {
    window.removeEventListener('popstate', handler);
    window.removeEventListener('hashchange', handler);
  };
}
