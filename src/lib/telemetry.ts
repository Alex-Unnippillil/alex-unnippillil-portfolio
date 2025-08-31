import { Capabilities } from './capabilities';

const TELEMETRY_ENDPOINT = '/telemetry';

export default class Telemetry {
  static sendCapabilities(capabilities: Capabilities): void {
    try {
      const payload = JSON.stringify({ capabilities });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(TELEMETRY_ENDPOINT, payload);
        return;
      }

      fetch(TELEMETRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // ignore errors
      });
    } catch (e) {
      // ignore errors
    }
  }
}
