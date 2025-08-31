import { getNetworkInfo, NetworkInfo } from './networkInfo';

export interface TelemetryEvent {
  event: string;
  duration?: number;
  network: NetworkInfo;
  cause: 'network' | 'compute';
}

function determineCause(info: NetworkInfo): 'network' | 'compute' {
  if (info.saveData) {
    return 'network';
  }
  if (typeof info.downlink === 'number' && info.downlink < 1) {
    return 'network';
  }
  if (typeof info.rtt === 'number' && info.rtt > 300) {
    return 'network';
  }
  return 'compute';
}

export function logInteraction(event: string, duration?: number): TelemetryEvent {
  const network = getNetworkInfo();
  const cause = determineCause(network);
  const payload: TelemetryEvent = { event, duration, network, cause };
  // In a real application this would send the payload to a telemetry backend.
  // For now we simply log to the console.
  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[telemetry]', payload);
  }
  return payload;
}

export function logNetwork(event: string): TelemetryEvent {
  return logInteraction(event);
}
