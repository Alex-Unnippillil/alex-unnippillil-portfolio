export default function ConfigSkeleton(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'skeleton-config';

  const title = document.createElement('div');
  title.className = 'skeleton skeleton-title';
  root.appendChild(title);

  for (let i = 0; i < 3; i += 1) {
    const line = document.createElement('div');
    line.className = 'skeleton skeleton-line';
    root.appendChild(line);
  }

  return root;
}
