/** @jest-environment jsdom */
import Checklist, { ChecklistTask } from '../../src/modules/checklist';

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number { return Object.keys(this.store).length; }
  clear(): void { this.store = {}; }
  getItem(key: string): string | null { return this.store[key] ?? null; }
  key(index: number): string | null { return Object.keys(this.store)[index] ?? null; }
  removeItem(key: string): void { delete this.store[key]; }
  setItem(key: string, value: string): void { this.store[key] = value; }
}

const tasks: ChecklistTask[] = [
  { id: 't1', title: 'Configure profile', page: '/config', selector: '#config' },
  { id: 't2', title: 'Update bio', page: '/bio', selector: '#bio' },
];

describe('Checklist module', () => {
  it('persists progress per role', () => {
    const storage = new MemoryStorage();
    let list = new Checklist('admin', tasks, storage);

    expect(list.shouldDisplay()).toBe(true);
    expect(list.getPendingTasks()).toHaveLength(2);

    list.markTaskComplete('t1');
    expect(list.isTaskComplete('t1')).toBe(true);

    list = new Checklist('admin', tasks, storage);
    expect(list.getPendingTasks()).toHaveLength(1);
  });

  it('hides after all tasks complete and celebration is dismissible', () => {
    const storage = new MemoryStorage();
    const list = new Checklist('user', tasks, storage);
    document.body.innerHTML = '<div id="config"></div><div id="bio"></div>';

    list.markTaskComplete('t1');
    list.markTaskComplete('t2');

    expect(list.shouldDisplay()).toBe(false);
    const banner = document.getElementById('checklist-celebration');
    expect(banner).not.toBeNull();
    banner?.querySelector('button')?.dispatchEvent(new Event('click'));
    expect(document.getElementById('checklist-celebration')).toBeNull();
  });

  it('highlights target control for a task', () => {
    const storage = new MemoryStorage();
    const list = new Checklist('user', tasks, storage);
    document.body.innerHTML = '<div id="config"></div><div id="bio"></div>';
    list.highlight('t1');
    const el = document.getElementById('config');
    expect(el?.classList.contains('checklist-highlight')).toBe(true);
  });
});
