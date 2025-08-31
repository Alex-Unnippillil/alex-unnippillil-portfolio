import './index.scss';

export default function createDefaultSkeleton(): HTMLElement {
  const skeleton = document.createElement('div');
  skeleton.className = 'default-skeleton';
  const repos = Array.from({ length: 6 }, () => '<div class="repo skeleton"></div>').join('');
  skeleton.innerHTML = `
    <header class="default-skeleton__header">
      <div class="avatar skeleton"></div>
      <div class="name skeleton"></div>
      <div class="position skeleton"></div>
    </header>
    <main class="default-skeleton__repositories">
      ${repos}
    </main>
  `;
  return skeleton;
}
