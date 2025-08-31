(() => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
})();

(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    return;
  }

  const supportsViewTransitions = 'startViewTransition' in document;

  const navigate = (url: string): void => {
    window.location.href = url;
  };

  const handleLinkClick = (event: MouseEvent): void => {
    const anchor = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;

    if (
      !anchor
      || anchor.target
      || anchor.hasAttribute('download')
      || anchor.getAttribute('href')?.startsWith('#')
      || anchor.origin !== window.location.origin
    ) {
      return;
    }

    event.preventDefault();

    if (supportsViewTransitions) {
      (document as any).startViewTransition(() => navigate(anchor.href));
    } else {
      const root = document.documentElement;
      root.classList.remove('fade-in');
      root.addEventListener('transitionend', () => navigate(anchor.href), { once: true });
    }
  };

  if (supportsViewTransitions) {
    document.addEventListener('click', handleLinkClick);
  } else {
    const root = document.documentElement;
    root.classList.add('fade-transition');

    window.addEventListener('DOMContentLoaded', () => {
      root.classList.add('fade-in');
    });

    document.addEventListener('click', handleLinkClick);
  }
})();
