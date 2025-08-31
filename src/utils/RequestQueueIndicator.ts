import RequestQueue from './RequestQueue';

export default class RequestQueueIndicator {
  public static attach(queue: RequestQueue): void {
    const indicator = document.createElement('div');
    indicator.id = 'request-queue-indicator';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.padding = '4px 8px';
    indicator.style.background = 'rgba(0,0,0,0.7)';
    indicator.style.color = '#fff';
    indicator.style.fontSize = '12px';
    indicator.style.display = 'none';
    document.body.appendChild(indicator);

    const update = () => {
      const queued = queue.getTotalQueued();
      if (queued > 0) {
        indicator.textContent = queue.hasPaused()
          ? `Requests paused (${queued})`
          : `Requests queued (${queued})`;
        indicator.style.display = 'block';
      } else {
        indicator.style.display = 'none';
      }
    };

    queue.onChange(() => update());
  }
}
