import { saveFocus, restoreFocus } from './focus';

export interface MenuAction {
  label: string;
  handler: () => void;
}

const globalActions: MenuAction[] = [];

export function registerMenuAction(action: MenuAction) {
  globalActions.push(action);
}

export function clearMenuActions() {
  globalActions.length = 0;
}

export default class Menu {
  private opener: HTMLElement;
  private actions: MenuAction[];
  private menuEl: HTMLUListElement;
  private longPressTimer: number | null = null;

  constructor(opener: HTMLElement, actions: MenuAction[] = []) {
    this.opener = opener;
    this.actions = actions;
    this.menuEl = document.createElement('ul');
    this.menuEl.tabIndex = -1;

    opener.addEventListener('contextmenu', this.onContextMenu);
    opener.addEventListener('keydown', this.onKeyDown);
    opener.addEventListener('touchstart', this.onTouchStart);
    opener.addEventListener('touchend', this.onTouchEnd);
  }

  private render() {
    this.menuEl.innerHTML = '';
    const acts = [...globalActions, ...this.actions];
    acts.forEach((action) => {
      const li = document.createElement('li');
      li.textContent = action.label;
      li.addEventListener('click', () => {
        action.handler();
        this.close();
      });
      this.menuEl.appendChild(li);
    });
  }

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    this.open();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      this.open();
    }
  };

  private onTouchStart = () => {
    this.longPressTimer = window.setTimeout(() => {
      this.open();
    }, 500);
  };

  private onTouchEnd = () => {
    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  };

  open() {
    this.render();
    saveFocus(this.opener);
    document.body.appendChild(this.menuEl);
    this.menuEl.focus();
  }

  close() {
    if (this.menuEl.parentElement) {
      this.menuEl.parentElement.removeChild(this.menuEl);
      restoreFocus();
    }
  }
}
