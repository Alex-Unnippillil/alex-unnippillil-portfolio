export interface PrivacyModeOptions {
  /** ms until privacy mode activates after window blur; 0 disables auto-activation */
  timeout?: number;
  /** optional pin required to deactivate */
  pin?: string;
  /** key used with ctrlKey to toggle privacy mode */
  toggleKey?: string;
  /** selector for sensitive panels to blur */
  sensitiveSelector?: string;
  /** selector for elements whose text should be masked */
  maskSelector?: string;
  /** replacement string when masking */
  maskWith?: string;
}

/**
 * Handles toggling of privacy mode which blurs/masks sensitive content.
 */
export default class PrivacyMode {
  private active = false;

  private readonly options: Required<PrivacyModeOptions>;

  private timer: number | null = null;

  private readonly promptFn: (message: string) => string | null;

  constructor(options: PrivacyModeOptions = {}, promptFn?: (msg: string) => string | null) {
    this.options = {
      timeout: options.timeout ?? 0,
      pin: options.pin ?? '',
      toggleKey: options.toggleKey ?? 'p',
      sensitiveSelector: options.sensitiveSelector ?? '[data-sensitive]',
      maskSelector: options.maskSelector ?? '[data-mask]',
      maskWith: options.maskWith ?? '***',
    };

    this.promptFn = promptFn || ((msg) => (typeof window !== 'undefined' && window.prompt ? window.prompt(msg) : null));

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleKeydown);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.handleBlur);
      window.addEventListener('focus', this.handleFocus);
    }
  }

  /** Destroy listeners */
  public destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.handleBlur);
      window.removeEventListener('focus', this.handleFocus);
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /** whether privacy mode is active */
  public isActive(): boolean {
    return this.active;
  }

  public enable(): void {
    if (this.active) return;
    this.active = true;
    if (typeof document !== 'undefined') {
      document.body.classList.add('privacy-mode');
      this.maskElements();
    }
  }

  public disable(): void {
    if (!this.active) return;
    if (this.options.pin) {
      const result = this.promptFn('Enter PIN to exit privacy mode');
      if (result !== this.options.pin) {
        return;
      }
    }
    this.active = false;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('privacy-mode');
      this.unmaskElements();
    }
  }

  public toggle(): void {
    if (this.active) {
      this.disable();
    } else {
      this.enable();
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key.toLowerCase() === this.options.toggleKey.toLowerCase() && e.ctrlKey) {
      this.toggle();
    }
  }

  private handleBlur(): void {
    if (this.options.timeout <= 0 || this.active) return;
    this.timer = window.setTimeout(() => {
      this.enable();
    }, this.options.timeout);
  }

  private handleFocus(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private maskElements(): void {
    const nodes = document.querySelectorAll(this.options.maskSelector);
    nodes.forEach((node) => {
      const el = node as HTMLElement;
      if (!el.dataset.originalText) {
        el.dataset.originalText = el.textContent || '';
      }
      el.textContent = this.options.maskWith;
    });
  }

  private unmaskElements(): void {
    const nodes = document.querySelectorAll(this.options.maskSelector);
    nodes.forEach((node) => {
      const el = node as HTMLElement;
      if (el.dataset.originalText !== undefined) {
        el.textContent = el.dataset.originalText;
      }
    });
  }
}

