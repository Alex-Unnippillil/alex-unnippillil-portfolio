const isMobile = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || /Mobi|Android/i.test(navigator.userAgent));

function feedbackEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return (window as any).__feedbackEnabled !== false;
}

function canVibrate(): boolean {
  return isMobile && typeof navigator !== 'undefined' && 'vibrate' in navigator && feedbackEnabled();
}

export function vibrateDrag(): void {
  if (canVibrate()) {
    navigator.vibrate(20);
  }
}

export function vibrateDrop(): void {
  if (canVibrate()) {
    navigator.vibrate([20, 30, 20]);
  }
}

export function vibrateSuccess(): void {
  if (canVibrate()) {
    navigator.vibrate([20, 40, 50]);
  }
}
