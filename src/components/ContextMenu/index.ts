import { get as getMenuActions } from '../../utils/contextMenuRegistry';

export interface IContextMenuAction {
  label: string;
  onSelect: (target: HTMLElement) => void;
}

export default class ContextMenu {
  protected container: HTMLUListElement;
  protected opener: HTMLElement | null = null;

  constructor() {
    this.container = document.createElement('ul');
    this.container.className = 'context-menu';
    this.container.setAttribute('role', 'menu');
    this.container.tabIndex = -1;
    this.container.hidden = true;
    document.body.appendChild(this.container);

    this.container.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('click', (e) => this.onDocumentClick(e));
  }

  public attach(element: HTMLElement, menuId: string): void {
    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.open(e.clientX, e.clientY, element, menuId);
    });

    element.addEventListener('keydown', (e) => {
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
        e.preventDefault();
        const rect = element.getBoundingClientRect();
        this.open(rect.left, rect.top, element, menuId);
      }
    });

    element.addEventListener('touchstart', (e) => this.onTouchStart(e, element, menuId));
  }

  protected onTouchStart(e: TouchEvent, element: HTMLElement, menuId: string): void {
    const touch = e.touches[0];
    const timer = setTimeout(() => {
      this.open(touch.clientX, touch.clientY, element, menuId);
    }, 500);

    const cancel = () => clearTimeout(timer);

    element.addEventListener('touchend', cancel, { once: true });
    element.addEventListener('touchmove', cancel, { once: true });
    element.addEventListener('touchcancel', cancel, { once: true });
  }

  protected open(x: number, y: number, opener: HTMLElement, menuId: string): void {
    this.close();

    const actions = getMenuActions(menuId);
    if (!actions.length) {
      return;
    }

    this.opener = opener;
    this.container.innerHTML = '';
    actions.forEach((action) => {
      const li = document.createElement('li');
      li.textContent = action.label;
      li.setAttribute('role', 'menuitem');
      li.tabIndex = -1;
      li.addEventListener('click', () => {
        action.onSelect(opener);
        this.close();
      });
      this.container.appendChild(li);
    });

    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
    this.container.hidden = false;

    setTimeout(() => {
      const first = this.container.firstElementChild as HTMLElement;
      if (first) {
        first.focus();
      }
    });
  }

  protected onKeyDown(e: KeyboardEvent): void {
    if (this.container.hidden) {
      return;
    }

    const items = Array.from(this.container.children) as HTMLElement[];
    const index = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(index + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        (document.activeElement as HTMLElement)?.click();
        break;
      default:
    }
  }

  protected onDocumentClick(e: MouseEvent): void {
    if (this.container.hidden) {
      return;
    }

    if (!this.container.contains(e.target as Node)) {
      this.close();
    }
  }

  public close(): void {
    if (this.container.hidden) {
      return;
    }

    this.container.hidden = true;

    if (this.opener) {
      this.opener.focus();
    }
    this.opener = null;
  }
}

export { ContextMenu };
