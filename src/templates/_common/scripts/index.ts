(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  const PREFETCH_ATTR = 'data-prefetch';
  const HYDRATE_ATTR = 'data-hydrate-on-idle';
  const TELEMETRY_KEY = 'prefetch-telemetry';
  const prefetched = new Set<string>();
  const telemetry = JSON.parse(localStorage.getItem(TELEMETRY_KEY) ?? '{"hits":0,"requests":0}');

  const saveTelemetry = (): void => {
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(telemetry));
  };

  const recordHit = (): void => {
    telemetry.hits += 1;
    saveTelemetry();
  };

  const recordRequest = (): void => {
    telemetry.requests += 1;
    saveTelemetry();
  };

  const requestIdle = (cb: () => void): void => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(cb);
    } else {
      setTimeout(cb, 0);
    }
  };

  function prefetchPredictedRoutes(): void {
    const { connection } = navigator as any;
    if (connection && (connection.saveData || /2g/.test(connection.effectiveType))) {
      return;
    }

    const hitRate = telemetry.requests > 0 ? telemetry.hits / telemetry.requests : 1;
    if (hitRate < 0.3) {
      return;
    }

    const links = document.querySelectorAll<HTMLAnchorElement>(`a[${PREFETCH_ATTR}]`);
    links.forEach((link) => {
      const { href } = link;
      if (!prefetched.has(href)) {
        prefetched.add(href);
        fetch(href, { mode: 'no-cors' }).finally(recordRequest);
      }
    });
  }

  function hydrateNonCriticalWidgets(): void {
    const widgets = document.querySelectorAll<HTMLElement>(`[${HYDRATE_ATTR}]`);
    widgets.forEach((widget) => {
      requestIdle(() => {
        widget.classList.add('hydrated');
      });
    });
  }

  requestIdle(prefetchPredictedRoutes);
  hydrateNonCriticalWidgets();

  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement).closest('a');
    if (anchor && prefetched.has(anchor.href)) {
      recordHit();
    }
  });
})();
