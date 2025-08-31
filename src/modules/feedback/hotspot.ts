export interface HotspotMetric {
  x: number;
  y: number;
  count: number;
}

const storageKey = 'feedback-hotspots';
let timer: number | null = null;
let lastX = 0;
let lastY = 0;

function load(): HotspotMetric[] {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : [];
}

function save(metrics: HotspotMetric[]): void {
  localStorage.setItem(storageKey, JSON.stringify(metrics));
}

function record(x: number, y: number): void {
  const metrics = load();
  const item = metrics.find((m) => m.x === x && m.y === y);
  if (item) {
    item.count += 1;
  } else {
    metrics.push({ x, y, count: 1 });
  }
  save(metrics);
}

export function startHotspotTracking(): void {
  document.addEventListener('mousemove', (e) => {
    lastX = Math.round(e.clientX);
    lastY = Math.round(e.clientY);
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      record(lastX, lastY);
    }, 3000);
  });

  document.addEventListener('click', () => {
    if (timer) {
      window.clearTimeout(timer);
    }
  });
}

export function loadHotspots(): HotspotMetric[] {
  return load();
}
