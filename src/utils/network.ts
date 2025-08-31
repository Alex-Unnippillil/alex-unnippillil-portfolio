export interface NetworkInformationMetrics {
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

function getConnection(): any {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  return (navigator as any).connection
    || (navigator as any).mozConnection
    || (navigator as any).webkitConnection;
}

export function getNetworkInformation(): NetworkInformationMetrics {
  const connection = getConnection();

  if (!connection) {
    return { downlink: undefined, rtt: undefined, saveData: undefined };
  }

  const { downlink, rtt, saveData } = connection;
  return { downlink, rtt, saveData };
}

export function onNetworkInformationChange(cb: (info: NetworkInformationMetrics) => void): void {
  const connection = getConnection();
  if (!connection) {
    return;
  }

  const handler = (): void => {
    cb(getNetworkInformation());
  };

  connection.addEventListener('change', handler);
}

export function sendNetworkTelemetry(
  event: string,
  duration: number,
  info: NetworkInformationMetrics,
): void {
  const body = JSON.stringify({ event, duration, ...info });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/telemetry', body);
    return;
  }

  try {
    fetch('/telemetry', {
      method: 'POST',
      body,
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    // ignore telemetry errors
  }
}
