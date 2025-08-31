import RequestQueue from '../../../utils/RequestQueue';
import RequestQueueIndicator from '../../../utils/RequestQueueIndicator';

const queue = new RequestQueue();

window.addEventListener('load', () => {
  RequestQueueIndicator.attach(queue);
});

// expose for other modules
(window as any).requestQueue = queue;
