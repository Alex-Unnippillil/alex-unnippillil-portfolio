export type DropFlow = (files: File[]) => void;

export interface GlobalDropHandlerOptions {
  flows: Record<string, DropFlow>;
  /** Called when file type is not supported */
  invalid?: (files: File[], reason: string) => void;
  /** CSS selector for drop targets */
  dropTargetSelector?: string;
  /** CSS class applied to drop targets on drag */
  highlightClass?: string;
}

/**
 * GlobalDropHandler listens for drag/drop events on the whole document
 * and routes dropped files to proper flows based on their mime type.
 */
export default class GlobalDropHandler {
  private invalid: (files: File[], reason: string) => void;

  private selector: string;

  private highlightClass: string;

  constructor(private options: GlobalDropHandlerOptions) {
    this.invalid = options.invalid || ((files, reason) => console.error(reason, files));
    this.selector = options.dropTargetSelector || '[data-drop-target]';
    this.highlightClass = options.highlightClass || 'drop-target--active';

    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    document.addEventListener('dragover', this.handleDragOver);
    document.addEventListener('dragleave', this.handleDragLeave);
    document.addEventListener('drop', this.handleDrop);
  }

  /** Remove listeners */
  destroy(): void {
    document.removeEventListener('dragover', this.handleDragOver);
    document.removeEventListener('dragleave', this.handleDragLeave);
    document.removeEventListener('drop', this.handleDrop);
  }

  private highlight(enable: boolean): void {
    const targets = document.querySelectorAll<HTMLElement>(this.selector);
    targets.forEach((el) => {
      el.classList.toggle(this.highlightClass, enable);
    });
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault();
    this.highlight(true);
  }

  private handleDragLeave(e: DragEvent): void {
    if (e.target === document || (e.target as HTMLElement).parentElement === null) {
      this.highlight(false);
    }
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault();
    this.highlight(false);

    const files = Array.from(e.dataTransfer?.files || []);
    files.forEach((file) => {
      const flow = this.resolveFlow(file);
      if (flow) {
        flow([file]);
      } else {
        this.invalid([file], `Unsupported file type: ${file.type}`);
      }
    });
  }

  private resolveFlow(file: File): DropFlow | undefined {
    const entries = Object.entries(this.options.flows);
    for (const [type, flow] of entries) {
      if (file.type.startsWith(type)) {
        return flow;
      }
    }
    return undefined;
  }
}

