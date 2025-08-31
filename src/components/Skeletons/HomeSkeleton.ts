export default function HomeSkeleton(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'skeleton-home';

  const avatar = document.createElement('div');
  avatar.className = 'skeleton skeleton-avatar';
  root.appendChild(avatar);

  const title = document.createElement('div');
  title.className = 'skeleton skeleton-title';
  root.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.className = 'skeleton skeleton-subtitle';
  root.appendChild(subtitle);

  for (let i = 0; i < 3; i += 1) {
    const repo = document.createElement('div');
    repo.className = 'skeleton skeleton-repository';
    root.appendChild(repo);
  }

  return root;
}
