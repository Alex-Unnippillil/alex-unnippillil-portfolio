// Utility helpers for triggering lightweight haptic feedback on supported
// mobile devices using the Vibration API.

const canVibrate = typeof navigator !== 'undefined' && !!navigator.vibrate;

const vibration = (pattern: number | number[]): void => {
  if (canVibrate) {
    navigator.vibrate(pattern);
  }
};

const Haptics = {
  /** Triggered while an item is being dragged. */
  drag(): void {
    vibration(5);
  },

  /** Triggered when an item is dropped. */
  drop(): void {
    vibration([0, 15, 10, 15]);
  },

  /** Triggered on success confirmations. */
  success(): void {
    vibration([20, 20, 20]);
  },
};

export default Haptics;
