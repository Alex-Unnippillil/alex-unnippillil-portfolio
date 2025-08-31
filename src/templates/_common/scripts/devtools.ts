import { onCLS, onFID, onLCP, onTTFB, Metric } from 'web-vitals';

export function initDevtools(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get('devtools') !== '1') {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'devtools-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.zIndex = '10000';
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.color = '#fff';
  overlay.style.padding = '8px';
  overlay.style.fontFamily = 'monospace';
  overlay.style.maxWidth = '300px';
  overlay.style.maxHeight = '100vh';
  overlay.style.overflow = 'auto';

  const toggles = document.createElement('div');
  overlay.appendChild(toggles);

  function createToggle(id: string, label: string, element: HTMLElement): void {
    const wrapper = document.createElement('label');
    wrapper.style.display = 'block';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `devtools-toggle-${id}`;
    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(` ${label}`));
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        document.body.appendChild(element);
      } else {
        element.remove();
      }
    });
    toggles.appendChild(wrapper);
  }

  const gridOverlay = document.createElement('div');
  gridOverlay.style.position = 'fixed';
  gridOverlay.style.inset = '0';
  gridOverlay.style.pointerEvents = 'none';
  gridOverlay.style.zIndex = '9998';
  gridOverlay.style.backgroundImage = 'linear-gradient(to right, rgba(0,0,0,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.2) 1px, transparent 1px)';
  gridOverlay.style.backgroundSize = '20px 20px';

  const rhythmOverlay = document.createElement('div');
  rhythmOverlay.style.position = 'fixed';
  rhythmOverlay.style.inset = '0';
  rhythmOverlay.style.pointerEvents = 'none';
  rhythmOverlay.style.zIndex = '9997';
  rhythmOverlay.style.backgroundImage = 'repeating-linear-gradient(to bottom, rgba(255,0,0,0.3), rgba(255,0,0,0.3) 8px, transparent 8px, transparent 16px)';

  const contrastOverlay = document.createElement('div');
  contrastOverlay.style.position = 'fixed';
  contrastOverlay.style.inset = '0';
  contrastOverlay.style.pointerEvents = 'none';
  contrastOverlay.style.zIndex = '9996';
  contrastOverlay.style.background = '#fff';
  contrastOverlay.style.mixBlendMode = 'difference';

  createToggle('grid', 'Grid Lines', gridOverlay);
  createToggle('rhythm', 'Spacing Rhythm', rhythmOverlay);
  createToggle('contrast', 'Color Contrast', contrastOverlay);

  const reportPre = document.createElement('pre');
  reportPre.id = 'devtools-report';
  reportPre.style.whiteSpace = 'pre-wrap';
  reportPre.style.marginTop = '8px';
  overlay.appendChild(reportPre);

  reportPre.addEventListener('click', () => {
    const text = reportPre.textContent || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  });

  document.body.appendChild(overlay);

  // Layout shift boxes
  const shiftOverlay = document.createElement('div');
  shiftOverlay.style.position = 'fixed';
  shiftOverlay.style.inset = '0';
  shiftOverlay.style.pointerEvents = 'none';
  shiftOverlay.style.zIndex = '10001';
  document.body.appendChild(shiftOverlay);

  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (entry.hadRecentInput) continue;
      for (const source of entry.sources || []) {
        const rect = source.node && source.node.getBoundingClientRect();
        if (!rect) continue;
        const box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.left = `${rect.x}px`;
        box.style.top = `${rect.y}px`;
        box.style.width = `${rect.width}px`;
        box.style.height = `${rect.height}px`;
        box.style.border = '2px dashed red';
        box.style.background = 'rgba(255,0,0,0.3)';
        box.style.pointerEvents = 'none';
        shiftOverlay.appendChild(box);
        setTimeout(() => box.remove(), 1000);
      }
    }
  });
  try {
    po.observe({ type: 'layout-shift', buffered: true } as any);
  } catch (e) {
    // ignore
  }

  // Focus order
  function showFocusOrder(): void {
    const container = document.createElement('div');
    container.id = 'devtools-focus-order';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10002';
    document.body.appendChild(container);

    const elements = Array.from(document.querySelectorAll<HTMLElement>('a, button, input, textarea, select, [tabindex]'));
    let index = 1;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const label = document.createElement('div');
      label.textContent = String(index++);
      label.style.position = 'absolute';
      label.style.left = `${rect.left + window.scrollX}px`;
      label.style.top = `${rect.top + window.scrollY}px`;
      label.style.background = 'blue';
      label.style.color = '#fff';
      label.style.fontSize = '10px';
      label.style.padding = '2px 3px';
      label.style.pointerEvents = 'none';
      container.appendChild(label);
    });
  }
  showFocusOrder();

  // Hydration warnings
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args.some((a) => typeof a === 'string' && a.toLowerCase().includes('hydration'))) {
      const warning = document.createElement('div');
      warning.textContent = `Hydration warning: ${args.join(' ')}`;
      warning.style.color = 'yellow';
      overlay.appendChild(warning);
    }
    originalError(...args);
  };

  // Report
  const report: any = {
    buildId: document.querySelector<HTMLMetaElement>('meta[name="build-id"]')?.content || 'dev',
    route: window.location.pathname,
    timings: {},
    webVitals: {},
  };

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    report.timings = {
      domContentLoaded: navigation.domContentLoadedEventEnd,
      load: navigation.loadEventEnd,
    };
  }

  function updateReport(): void {
    reportPre.textContent = JSON.stringify(report, null, 2);
  }

  function storeMetric(metric: Metric): void {
    report.webVitals[metric.name] = metric.value;
    updateReport();
  }

  onCLS(storeMetric);
  onFID(storeMetric);
  onLCP(storeMetric);
  onTTFB(storeMetric);

  updateReport();
}
