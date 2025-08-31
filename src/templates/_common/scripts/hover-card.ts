const HOVER_DELAY = 80;

export function initHoverCards(): void {
  const triggers = document.querySelectorAll<HTMLElement>('[data-hover-card]');
  triggers.forEach((trigger) => {
    const selector = trigger.dataset.hoverCard;
    if (!selector) {
      return;
    }

    const card = document.querySelector<HTMLElement>(selector);
    if (!card) {
      return;
    }

    let timeoutId: number;

    const show = () => {
      timeoutId = window.setTimeout(() => {
        const rect = trigger.getBoundingClientRect();
        card.style.left = `${rect.left + window.scrollX}px`;
        card.style.top = `${rect.bottom + window.scrollY}px`;
        card.classList.add('hover-card--visible');
      }, HOVER_DELAY);
    };

    const hide = () => {
      clearTimeout(timeoutId);
      card.classList.remove('hover-card--visible');
    };

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);

    // Touch support for mobile devices
    trigger.addEventListener('touchstart', show, { passive: true });
    trigger.addEventListener('touchend', hide);
    trigger.addEventListener('touchcancel', hide);
  });
}
