import './index.scss';

export default function createConfigSkeleton(): HTMLElement {
  const skeleton = document.createElement('section');
  skeleton.className = 'config-skeleton';
  skeleton.innerHTML = `
    <div class="skeleton-block">
      <div class="skeleton-label skeleton"></div>
      <div class="skeleton-input skeleton"></div>
      <div class="skeleton-desc skeleton"></div>
    </div>
    <div class="skeleton-block">
      <div class="skeleton-label skeleton"></div>
      <div class="skeleton-input skeleton"></div>
      <div class="skeleton-desc skeleton"></div>
    </div>
  `;
  return skeleton;
}
