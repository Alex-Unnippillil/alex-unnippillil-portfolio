export interface VisibleRangeOptions {
  scrollTop: number;
  containerHeight: number;
  thumbHeight: number;
  buffer: number;
  imagesLength: number;
  perRow: number;
}

export function calculateVisibleRange(
  options: VisibleRangeOptions,
): { start: number; end: number } {
  const {
    scrollTop, containerHeight, thumbHeight, buffer, imagesLength, perRow,
  } = options;
  const totalRows = Math.ceil(imagesLength / perRow);
  const startRow = Math.max(0, Math.floor(scrollTop / thumbHeight) - buffer);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / thumbHeight) + buffer,
  );
  return { start: startRow * perRow, end: endRow * perRow };
}

export interface VirtualizedGridOptions {
  container: HTMLElement;
  images: string[];
  thumbWidth: number;
  thumbHeight: number;
  buffer?: number;
  onOpen?: (index: number) => void;
}

export default class VirtualizedGrid {
  private options: Required<VirtualizedGridOptions>;

  private visibleStart = 0;

  private visibleEnd = 0;

  private perRow: number;

  constructor(options: VirtualizedGridOptions) {
    this.options = {
      buffer: 1,
      ...options,
    } as Required<VirtualizedGridOptions>;

    this.perRow = Math.max(
      1,
      Math.floor(
        this.options.container.clientWidth / this.options.thumbWidth,
      ),
    );
    this.attachEvents();
    this.render();
  }

  private attachEvents(): void {
    this.options.container.addEventListener('scroll', () => this.render());
    this.options.container.addEventListener(
      'keydown',
      (e) => this.onKeyDown(e as KeyboardEvent),
    );
  }

  private onKeyDown(e: KeyboardEvent): void {
    const { activeElement } = document;
    if (!(activeElement instanceof HTMLElement) || !activeElement.dataset.index) return;
    const index = Number(activeElement.dataset.index);
    let next = index;
    switch (e.key) {
      case 'ArrowRight':
        next = Math.min(index + 1, this.options.images.length - 1);
        break;
      case 'ArrowLeft':
        next = Math.max(index - 1, 0);
        break;
      case 'ArrowDown':
        next = Math.min(index + this.perRow, this.options.images.length - 1);
        break;
      case 'ArrowUp':
        next = Math.max(index - this.perRow, 0);
        break;
      case 'Enter':
        this.options.onOpen?.(index);
        return;
      default:
        return;
    }
    const el = this.options.container.querySelector<HTMLElement>(
      `[data-index="${next}"]`,
    );
    el?.focus();
  }

  private getVisibleRange(): { start: number; end: number } {
    return calculateVisibleRange({
      scrollTop: this.options.container.scrollTop,
      containerHeight: this.options.container.clientHeight,
      thumbHeight: this.options.thumbHeight,
      buffer: this.options.buffer,
      imagesLength: this.options.images.length,
      perRow: this.perRow,
    });
  }

  public render(): void {
    const { images, container, thumbHeight } = this.options;
    const range = this.getVisibleRange();
    if (range.start === this.visibleStart && range.end === this.visibleEnd) return;
    this.visibleStart = range.start;
    this.visibleEnd = range.end;
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.height = `${
      Math.ceil(images.length / this.perRow) * thumbHeight
    }px`;
    const fragment = document.createDocumentFragment();
    for (let i = range.start; i < range.end && i < images.length; i += 1) {
      const img = document.createElement('img');
      img.src = images[i];
      img.dataset.index = String(i);
      img.tabIndex = 0;
      img.style.position = 'absolute';
      const row = Math.floor(i / this.perRow);
      const col = i % this.perRow;
      img.style.top = `${row * thumbHeight}px`;
      img.style.left = `${col * this.options.thumbWidth}px`;
      img.width = this.options.thumbWidth;
      img.height = thumbHeight;
      fragment.appendChild(img);
    }
    container.appendChild(fragment);
  }
}
