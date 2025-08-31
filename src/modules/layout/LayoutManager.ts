import { injectable } from 'inversify';

export type LayoutPreset =
  | 'left-half'
  | 'right-half'
  | 'top-half'
  | 'bottom-half'
  | 'third-left'
  | 'third-center'
  | 'third-right'
  | 'quad-top-left'
  | 'quad-top-right'
  | 'quad-bottom-left'
  | 'quad-bottom-right';

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Simple window layout manager that supports basic presets and keyboard
 * nudging/snap behaviour. The manager stores layout per device using
 * localStorage. It is aimed at small draggable widgets inside the portfolio
 * project and does not try to manage real OS windows.
 */
@injectable()
export default class LayoutManager {
  public grid = 20; // px

  protected presets: Record<LayoutPreset, IRect>;
  protected gridOverlay?: HTMLDivElement;

  constructor(private element: HTMLElement, private deviceId = 'default') {
    this.presets = this.createPresets();
    this.restore();
    this.bindEvents();
  }

  /** Create layout presets relative to current viewport size */
  protected createPresets(): Record<LayoutPreset, IRect> {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      'left-half': { x: 0, y: 0, width: w / 2, height: h },
      'right-half': { x: w / 2, y: 0, width: w / 2, height: h },
      'top-half': { x: 0, y: 0, width: w, height: h / 2 },
      'bottom-half': { x: 0, y: h / 2, width: w, height: h / 2 },
      'third-left': { x: 0, y: 0, width: w / 3, height: h },
      'third-center': { x: w / 3, y: 0, width: w / 3, height: h },
      'third-right': { x: (2 * w) / 3, y: 0, width: w / 3, height: h },
      'quad-top-left': { x: 0, y: 0, width: w / 2, height: h / 2 },
      'quad-top-right': { x: w / 2, y: 0, width: w / 2, height: h / 2 },
      'quad-bottom-left': { x: 0, y: h / 2, width: w / 2, height: h / 2 },
      'quad-bottom-right': { x: w / 2, y: h / 2, width: w / 2, height: h / 2 },
    };
  }

  /** Apply a preset to the managed element */
  public applyPreset(preset: LayoutPreset): void {
    const rect = this.presets[preset];
    if (!rect) return;
    this.setRect(rect);
    this.save(rect);
  }

  /** Move element by a delta */
  public nudge(dx: number, dy: number): void {
    const rect = this.getRect();
    rect.x += dx;
    rect.y += dy;
    this.setRect(rect);
    this.save(rect);
  }

  /** Snap element to grid */
  public snapToGrid(): void {
    const rect = this.getRect();
    rect.x = Math.round(rect.x / this.grid) * this.grid;
    rect.y = Math.round(rect.y / this.grid) * this.grid;
    rect.width = Math.round(rect.width / this.grid) * this.grid;
    rect.height = Math.round(rect.height / this.grid) * this.grid;
    this.setRect(rect);
    this.save(rect);
  }

  /** Attach basic keyboard listeners for nudging/snap and grid hint toggle */
  protected bindEvents(): void {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.nudge(0, -this.grid);
          break;
        case 'ArrowDown':
          this.nudge(0, this.grid);
          break;
        case 'ArrowLeft':
          this.nudge(-this.grid, 0);
          break;
        case 'ArrowRight':
          this.nudge(this.grid, 0);
          break;
        case 'Enter':
          this.snapToGrid();
          break;
        case 'g':
        case 'G':
          this.toggleGridHints();
          break;
        default:
          break;
      }
    });
  }

  protected toggleGridHints(): void {
    if (!this.gridOverlay) {
      this.gridOverlay = document.createElement('div');
      this.gridOverlay.style.position = 'fixed';
      this.gridOverlay.style.top = '0';
      this.gridOverlay.style.left = '0';
      this.gridOverlay.style.width = '100%';
      this.gridOverlay.style.height = '100%';
      this.gridOverlay.style.pointerEvents = 'none';
      this.gridOverlay.style.backgroundSize = `${this.grid}px ${this.grid}px`;
      this.gridOverlay.style.backgroundImage =
        'linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), ' +
        'linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)';
      this.gridOverlay.style.zIndex = '9999';
      document.body.appendChild(this.gridOverlay);
    }

    const current = this.gridOverlay.style.display;
    this.gridOverlay.style.display = current === 'none' || current === '' ? 'block' : 'none';
  }

  protected setRect(rect: IRect): void {
    this.element.style.position = 'absolute';
    this.element.style.left = `${rect.x}px`;
    this.element.style.top = `${rect.y}px`;
    this.element.style.width = `${rect.width}px`;
    this.element.style.height = `${rect.height}px`;
  }

  protected getRect(): IRect {
    return {
      x: parseInt(this.element.style.left || '0', 10),
      y: parseInt(this.element.style.top || '0', 10),
      width: parseInt(this.element.style.width || `${this.element.offsetWidth}`, 10),
      height: parseInt(this.element.style.height || `${this.element.offsetHeight}`, 10),
    };
  }

  protected storageKey(): string {
    return `layout:${this.deviceId}`;
  }

  protected save(rect: IRect): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(rect));
  }

  protected restore(): void {
    const raw = localStorage.getItem(this.storageKey());
    if (raw) {
      try {
        const rect = JSON.parse(raw) as IRect;
        this.setRect(rect);
      } catch {
        // ignore corrupted data
      }
    }
  }
}
