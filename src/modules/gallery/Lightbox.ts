export default class Lightbox {
  private images: string[];

  private index = 0;

  private overlay: HTMLElement;

  private img: HTMLImageElement;

  constructor(images: string[]) {
    this.images = images;
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox hidden';
    this.img = document.createElement('img');
    this.overlay.appendChild(this.img);
    document.body.appendChild(this.overlay);
    this.overlay.addEventListener('click', () => this.close());
    window.addEventListener('keydown', (e) => this.onKeyDown(e as KeyboardEvent));
    this.initPinchZoom();
  }

  public open(index: number): void {
    this.index = index;
    this.overlay.classList.remove('hidden');
    this.show();
    this.preload();
  }

  public close(): void {
    this.overlay.classList.add('hidden');
    this.img.style.transform = '';
  }

  private show(): void {
    this.img.src = this.images[this.index];
  }

  private preload(): void {
    [this.index - 1, this.index + 1].forEach((i) => {
      if (i >= 0 && i < this.images.length) {
        const image = new Image();
        image.src = this.images[i];
      }
    });
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (this.overlay.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight' && this.index < this.images.length - 1) {
      this.index += 1;
      this.show();
      this.preload();
    } else if (e.key === 'ArrowLeft' && this.index > 0) {
      this.index -= 1;
      this.show();
      this.preload();
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  private initPinchZoom(): void {
    let distance = 0;
    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = e.touches;
        const newDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (distance) {
          const scale = newDistance / distance;
          this.img.style.transform = `scale(${scale})`;
        }
        distance = newDistance;
      }
    };
    this.overlay.addEventListener('touchmove', onMove);
    this.overlay.addEventListener('touchend', () => { distance = 0; });
  }
}
