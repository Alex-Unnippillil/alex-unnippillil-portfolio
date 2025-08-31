export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>('.header');
  return header ? header.getBoundingClientRect().height : 0;
}

export function scrollToTarget(target: HTMLElement): void {
  const offset = getHeaderOffset();
  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function handleHash(hash: string): void {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  const target = document.getElementById(id);
  if (target) {
    scrollToTarget(target);
  }
}

export default function initAnchors(): void {
  // initial deep link
  if (window.location.hash) {
    handleHash(window.location.hash);
  }

  // offset for html
  document.documentElement.style.setProperty('--scroll-padding-top', `${getHeaderOffset()}px`);
  window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--scroll-padding-top', `${getHeaderOffset()}px`);
  });

  // intercept anchor clicks
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        handleHash(href);
        history.pushState(null, '', href);
      }
    });
  });

  // copy buttons for headings
  document.querySelectorAll<HTMLElement>('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]').forEach((heading) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hash-link';
    button.textContent = '#';
    button.addEventListener('click', () => {
      const url = `${location.origin}${location.pathname}#${heading.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      }
    });
    heading.appendChild(button);
  });
}
