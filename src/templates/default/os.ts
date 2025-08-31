// OS-style app grid, command palette, and deep link handling
// Implements arrow-key navigation, Enter to open apps, Esc to close

interface AppConfig {
  id: string;
  title: string;
  content: string;
}

const apps: AppConfig[] = [
  { id: 'about', title: 'About', content: '<p>About app content</p>' },
  { id: 'projects', title: 'Projects', content: '<p>Projects app content</p>' },
  { id: 'contact', title: 'Contact', content: '<p>Contact app content</p>' },
];

// create app grid
const grid = document.createElement('div');
grid.id = 'app-grid';
grid.className = 'app-grid';

apps.forEach((app) => {
  const icon = document.createElement('div');
  icon.className = 'app-icon';
  icon.textContent = app.title;
  icon.setAttribute('data-app', app.id);
  icon.tabIndex = 0;
  grid.appendChild(icon);
});

const main = document.querySelector('main');
if (main) {
  main.insertBefore(grid, main.firstChild);
} else {
  document.body.appendChild(grid);
}

const icons = Array.from(grid.querySelectorAll<HTMLElement>('.app-icon'));
let selectedIndex = 0;
let cols = 1;

// app window
const appWindow = document.createElement('div');
appWindow.id = 'app-window';
appWindow.className = 'app-window';
document.body.appendChild(appWindow);

function updateCols() {
  const style = window.getComputedStyle(grid);
  cols = style.getPropertyValue('grid-template-columns').split(' ').length;
}

function updateSelection() {
  icons.forEach((icon, i) => icon.classList.toggle('selected', i === selectedIndex));
}

function openApp(app: AppConfig) {
  appWindow.innerHTML = `<div class="app-window__content"><h2>${app.title}</h2>${app.content}</div>`;
  appWindow.classList.add('active');
  const url = new URL(window.location.href);
  url.searchParams.set('app', app.id);
  window.history.replaceState(null, '', url.toString());
}

function closeApp() {
  appWindow.classList.remove('active');
  const url = new URL(window.location.href);
  url.searchParams.delete('app');
  window.history.replaceState(null, '', url.toString());
}

icons.forEach((icon, i) => {
  icon.addEventListener('click', () => {
    selectedIndex = i;
    updateSelection();
    openApp(apps[i]);
  });
});

// command palette
interface PaletteItem {
  id: string;
  title: string;
  action: () => void;
}

const paletteItems: PaletteItem[] = [
  ...apps.map((app) => ({ id: app.id, title: app.title, action: () => openApp(app) })),
];

const palette = document.createElement('div');
palette.id = 'command-palette';
palette.className = 'command-palette hidden';
palette.innerHTML = `
  <div class="command-palette__inner">
    <input type="text" class="command-input" />
    <ul class="command-results"></ul>
  </div>
`;

document.body.appendChild(palette);
const paletteInput = palette.querySelector<HTMLInputElement>('.command-input')!;
const paletteResults = palette.querySelector<HTMLUListElement>('.command-results')!;
let paletteSelected = 0;
let paletteOpen = false;

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti += 1) {
    if (t[ti] === q[qi]) {
      qi += 1;
    }
  }
  return qi === q.length;
}

function renderPaletteResults(q: string) {
  const results = paletteItems.filter((item) => fuzzyMatch(q, item.title));
  paletteResults.innerHTML = results
    .map((r, i) => `<li class="${i === paletteSelected ? 'selected' : ''}" data-id="${r.id}">${r.title}</li>`)
    .join('');
}

function openPalette() {
  const start = performance.now();
  palette.classList.remove('hidden');
  paletteOpen = true;
  paletteSelected = 0;
  paletteInput.value = '';
  renderPaletteResults('');
  paletteInput.focus();
  const duration = performance.now() - start;
  if (duration > 50) {
    // eslint-disable-next-line no-console
    console.warn(`Command palette opened in ${duration.toFixed(2)}ms`);
  }
}

function closePalette() {
  palette.classList.add('hidden');
  paletteOpen = false;
}

paletteInput.addEventListener('input', () => {
  paletteSelected = 0;
  renderPaletteResults(paletteInput.value);
});

palette.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    paletteSelected = Math.min(paletteSelected + 1, paletteResults.children.length - 1);
    renderPaletteResults(paletteInput.value);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    paletteSelected = Math.max(paletteSelected - 1, 0);
    renderPaletteResults(paletteInput.value);
  } else if (e.key === 'Enter') {
    const id = (paletteResults.children[paletteSelected] as HTMLElement)?.dataset.id;
    const item = paletteItems.find((i) => i.id === id);
    if (item) {
      item.action();
    }
    closePalette();
  } else if (e.key === 'Escape') {
    closePalette();
  }
});

// global key handlers
function handleGridKeys(e: KeyboardEvent) {
  if (paletteOpen || appWindow.classList.contains('active')) {
    return;
  }
  if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
    e.preventDefault();
  }
  switch (e.key) {
    case 'ArrowRight':
      selectedIndex = (selectedIndex + 1) % icons.length;
      break;
    case 'ArrowLeft':
      selectedIndex = (selectedIndex - 1 + icons.length) % icons.length;
      break;
    case 'ArrowDown':
      selectedIndex = Math.min(selectedIndex + cols, icons.length - 1);
      break;
    case 'ArrowUp':
      selectedIndex = Math.max(selectedIndex - cols, 0);
      break;
    case 'Enter':
      openApp(apps[selectedIndex]);
      break;
    default:
      break;
  }
  updateSelection();
}

document.addEventListener('keydown', handleGridKeys);
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (!paletteOpen) {
      openPalette();
    }
  } else if (e.key === 'Escape' && appWindow.classList.contains('active')) {
    closeApp();
  }
});

// deep link handling
window.addEventListener('DOMContentLoaded', () => {
  updateCols();
  updateSelection();
  const url = new URL(window.location.href);
  const appId = url.searchParams.get('app');
  const app = apps.find((a) => a.id === appId);
  if (app) {
    openApp(app);
  }
});

window.addEventListener('resize', updateCols);
export {};
