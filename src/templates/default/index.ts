import '../_common/scripts';

function initDeferredWidgets(): void {
  const target = document.getElementById('github-more');
  if (!target) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        import('./widgets/github-more').then(({ default: init }) => init());
        obs.disconnect();
      }
    });
  });

  observer.observe(target);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDeferredWidgets);
} else {
  initDeferredWidgets();
}
