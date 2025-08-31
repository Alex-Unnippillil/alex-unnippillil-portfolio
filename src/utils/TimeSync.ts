export default class TimeSync {
  static skew = 0;

  static maxSkew = 5 * 60 * 1000;

  static warningId = 'time-skew-warning';

  static async sync(): Promise<void> {
    try {
      const res = await fetch('/api/time', {
        headers: {
          'x-client-time': Date.now().toString(),
        },
      });
      const data = await res.json();
      if (typeof data.skew === 'number') {
        TimeSync.skew = data.skew;
      }
      if (typeof data.maxSkew === 'number') {
        TimeSync.maxSkew = data.maxSkew;
      }
    } catch (e) {
      // ignore errors
    }
  }

  static now(): number {
    return Date.now() + TimeSync.skew;
  }

  static msUntil(timestamp: number): number {
    return timestamp - TimeSync.now();
  }

  static isExpired(timestamp: number): boolean {
    return TimeSync.now() >= timestamp;
  }

  static warnIfSkewed(): void {
    if (Math.abs(TimeSync.skew) > TimeSync.maxSkew) {
      if (!document.getElementById(TimeSync.warningId)) {
        const el = document.createElement('div');
        el.id = TimeSync.warningId;
        el.textContent =
          'Your device time differs from the server. Some features may not work correctly.';
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.right = '0';
        el.style.background = '#ffdd57';
        el.style.color = '#000';
        el.style.padding = '10px';
        el.style.textAlign = 'center';
        el.style.zIndex = '9999';
        document.body.appendChild(el);
      }
    }
  }
}

