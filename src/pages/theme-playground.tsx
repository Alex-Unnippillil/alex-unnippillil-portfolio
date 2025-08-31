import { applyTheme, tokens, Theme, TokenName } from '../styles/tokens';

// start with light theme
let current: Theme = 'light';
applyTheme(current);

const root = document.createElement('div');
document.body.appendChild(root);

const toggle = document.createElement('button');
toggle.textContent = 'Toggle theme';

toggle.addEventListener('click', () => {
  current = current === 'light' ? 'dark' : 'light';
  applyTheme(current);
  render();
});

const list = document.createElement('div');
root.appendChild(toggle);
root.appendChild(list);

function render() {
  list.innerHTML = '';
  const set = tokens[current];
  (Object.keys(set) as TokenName[]).forEach((name) => {
    const value = set[name];
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.marginBottom = '8px';

    const swatch = document.createElement('span');
    swatch.style.width = '40px';
    swatch.style.height = '20px';
    swatch.style.marginRight = '8px';
    swatch.style.background = value;
    swatch.style.border = `1px solid ${set.border}`;

    const label = document.createElement('code');
    label.textContent = `${name}: ${value}`;

    item.appendChild(swatch);
    item.appendChild(label);
    list.appendChild(item);
  });
}

render();
