interface SelectionState {
  lastIndex: number | null;
  selected: Set<HTMLElement>;
}

const state: SelectionState = {
  lastIndex: null,
  selected: new Set(),
};

function updateBatchActions(): void {
  const batch = document.querySelector('.batch-actions') as HTMLElement | null;
  if (!batch) {
    return;
  }
  batch.style.display = state.selected.size > 1 ? 'block' : 'none';
}

function selectItem(item: HTMLElement): void {
  if (!state.selected.has(item)) {
    item.classList.add('selected');
    state.selected.add(item);
  }
}

function deselectItem(item: HTMLElement): void {
  if (state.selected.has(item)) {
    item.classList.remove('selected');
    state.selected.delete(item);
  }
}

function clearSelection(): void {
  state.selected.forEach((i) => i.classList.remove('selected'));
  state.selected.clear();
  state.lastIndex = null;
  updateBatchActions();
}

function selectRange(items: HTMLElement[], start: number, end: number): void {
  const [s, e] = start < end ? [start, end] : [end, start];
  for (let i = s; i <= e; i += 1) {
    selectItem(items[i]);
  }
}

function handleClick(e: MouseEvent): void {
  const container = e.currentTarget as HTMLElement;
  const target = (e.target as HTMLElement).closest('.repository') as HTMLElement | null;
  if (!target) {
    return;
  }
  const items = Array.from(container.querySelectorAll('.repository')) as HTMLElement[];
  const index = items.indexOf(target);
  if (e.shiftKey && state.lastIndex !== null) {
    selectRange(items, state.lastIndex, index);
  } else if (state.selected.has(target)) {
    deselectItem(target);
    state.lastIndex = null;
  } else {
    selectItem(target);
    state.lastIndex = index;
  }
  updateBatchActions();
  if (!e.ctrlKey && !e.metaKey) {
    e.preventDefault();
  }
}

function handleKeydown(e: KeyboardEvent): void {
  const container = document.querySelector('.repositories');
  if (!container) {
    return;
  }
  const items = Array.from(container.querySelectorAll('.repository')) as HTMLElement[];
  const active = document.activeElement as HTMLElement;
  const index = items.indexOf(active);
  if (e.key === 'a' && e.ctrlKey) {
    items.forEach(selectItem);
    updateBatchActions();
    e.preventDefault();
    return;
  }
  if (e.key === 'Escape') {
    clearSelection();
    e.preventDefault();
    return;
  }
  if (index === -1) {
    return;
  }
  let next = index;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    next = Math.min(items.length - 1, index + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    next = Math.max(0, index - 1);
  }
  if (next !== index) {
    items[next].focus();
    if (e.shiftKey && state.lastIndex !== null) {
      clearSelection();
      selectRange(items, state.lastIndex, next);
    } else if (e.shiftKey) {
      selectRange(items, index, next);
      state.lastIndex = index;
    } else {
      state.lastIndex = next;
    }
    updateBatchActions();
    e.preventDefault();
  }
}

function initDrag(container: HTMLElement): void {
  let startX = 0;
  let startY = 0;
  let box: HTMLDivElement | null = null;
  function onMouseMove(ev: MouseEvent): void {
    if (!box) {
      return;
    }
    const x = Math.min(ev.pageX, startX);
    const y = Math.min(ev.pageY, startY);
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.width = `${Math.abs(ev.pageX - startX)}px`;
    box.style.height = `${Math.abs(ev.pageY - startY)}px`;
  }
  function onMouseUp(): void {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (!box) {
      return;
    }
    const rect = box.getBoundingClientRect();
    box.remove();
    box = null;
    const items = Array.from(container.querySelectorAll('.repository')) as HTMLElement[];
    clearSelection();
    items.forEach((item, i) => {
      const r = item.getBoundingClientRect();
      if (
        r.left < rect.right
        && r.right > rect.left
        && r.top < rect.bottom
        && r.bottom > rect.top
      ) {
        selectItem(item);
        state.lastIndex = i;
      }
    });
    updateBatchActions();
  }
  container.addEventListener('mousedown', (ev: MouseEvent) => {
    if (ev.button !== 0) {
      return;
    }
    if ((ev.target as HTMLElement).closest('.repository')) {
      return;
    }
    startX = ev.pageX;
    startY = ev.pageY;
    box = document.createElement('div');
    box.className = 'selection-box';
    box.style.left = `${startX}px`;
    box.style.top = `${startY}px`;
    document.body.appendChild(box);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    ev.preventDefault();
  });
}

export default function enableRepositorySelection(): void {
  const container = document.querySelector('.repositories') as HTMLElement | null;
  if (!container) {
    return;
  }
  container.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  initDrag(container);
}

document.addEventListener('DOMContentLoaded', () => {
  enableRepositorySelection();
});
