export interface ChecklistTask {
  id: string;
  title: string;
  page: string;
  /** CSS selector of target control */
  selector: string;
}

/**
 * Simple onboarding checklist that persists progress in Storage.
 * Tasks can be tied to a user role and linked to pages.
 */
export default class Checklist {
  private readonly tasks: ChecklistTask[];

  private readonly role: string;

  private readonly storage: Storage;

  private readonly baseKey: string;

  constructor(role: string, tasks: ChecklistTask[], storage: Storage = window.localStorage) {
    this.role = role;
    this.tasks = tasks;
    this.storage = storage;
    this.baseKey = `checklist-${this.role}`;
  }

  private readProgress(): Set<string> {
    const raw = this.storage.getItem(this.baseKey);
    if (!raw) return new Set();
    try {
      const parsed: string[] = JSON.parse(raw);
      return new Set(parsed);
    } catch (e) {
      return new Set();
    }
  }

  private writeProgress(progress: Set<string>): void {
    this.storage.setItem(this.baseKey, JSON.stringify(Array.from(progress)));
  }

  isTaskComplete(id: string): boolean {
    return this.readProgress().has(id);
  }

  markTaskComplete(id: string): void {
    const progress = this.readProgress();
    progress.add(id);
    this.writeProgress(progress);

    if (this.allTasksCompleted()) {
      this.storage.setItem(`${this.baseKey}-hidden`, 'true');
      this.celebrate();
    }
  }

  getPendingTasks(): ChecklistTask[] {
    const progress = this.readProgress();
    return this.tasks.filter((t) => !progress.has(t.id));
  }

  allTasksCompleted(): boolean {
    return this.getPendingTasks().length === 0;
  }

  /** Returns whether checklist should be shown to the user */
  shouldDisplay(): boolean {
    return !this.storage.getItem(`${this.baseKey}-hidden`);
  }

  /** Highlights the target control for a task */
  highlight(taskId: string): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const el = document.querySelector(task.selector) as HTMLElement | null;
    if (!el) return;
    el.classList.add('checklist-highlight');
    el.style.outline = '2px solid #ff9800';
  }

  /** Displays a dismissible celebration banner */
  celebrate(): void {
    const existing = document.getElementById('checklist-celebration');
    if (existing) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'checklist-celebration';
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '1rem';
    wrapper.style.right = '1rem';
    wrapper.style.background = '#4caf50';
    wrapper.style.color = '#fff';
    wrapper.style.padding = '1rem';
    wrapper.style.borderRadius = '4px';
    wrapper.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

    const msg = document.createElement('span');
    msg.textContent = 'All tasks complete!';
    wrapper.appendChild(msg);

    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.style.marginLeft = '0.5rem';
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => wrapper.remove());
    wrapper.appendChild(btn);

    document.body.appendChild(wrapper);
  }
}
