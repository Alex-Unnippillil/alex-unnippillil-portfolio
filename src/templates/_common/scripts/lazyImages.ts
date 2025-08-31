interface QueueItem {
  img: HTMLImageElement;
  priority: number;
}

export class LazyImageLoader {
  private observer: IntersectionObserver;

  private queue: QueueItem[] = [];

  private processing = false;

  private paused = document.hidden;

  private cache = new Map<HTMLImageElement, number>();

  private currentSize = 0;

  // 50MB limit by default
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024;

  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersection, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    document.addEventListener('visibilitychange', () => {
      this.paused = document.hidden;
      if (!this.paused) {
        this.processQueue();
      }
    });
  }

  public observe(img: HTMLImageElement): void {
    this.observer.observe(img);
  }

  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const inViewport = entry.boundingClientRect.top >= 0
          && entry.boundingClientRect.bottom <= window.innerHeight;
        const priority = inViewport ? 1 : 2;
        this.enqueue(img, priority);
        this.observer.unobserve(img);
      }
    });
  };

  private enqueue(img: HTMLImageElement, priority: number): void {
    this.queue.push({ img, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.paused || this.processing) {
      return;
    }

    const item = this.queue.shift();
    if (!item) {
      return;
    }

    const { src } = item.img.dataset;
    if (!src) {
      this.processQueue();
      return;
    }

    this.processing = true;
    const image = new Image();
    image.onload = () => {
      item.img.src = src;
      const size = image.naturalWidth * image.naturalHeight * 4;
      this.addToCache(item.img, size);
      this.processing = false;
      this.processQueue();
    };
    image.onerror = () => {
      this.processing = false;
      this.processQueue();
    };
    image.src = src;
  }

  private addToCache(img: HTMLImageElement, size: number): void {
    this.cache.set(img, size);
    this.currentSize += size;

    while (this.currentSize > this.MAX_CACHE_SIZE) {
      const first = this.cache.entries().next();
      if (first.done) {
        break;
      }
      const [lruImg, lruSize] = first.value;
      this.cache.delete(lruImg);
      this.currentSize -= lruSize;
      lruImg.removeAttribute('src');
    }
  }
}

export function initLazyImages(selector = 'img[data-src]'): void {
  const loader = new LazyImageLoader();
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  images.forEach((img) => loader.observe(img));
}
