export interface NetworkInfo {
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

function getConnection(): any | undefined {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  const nav = navigator as any;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

export function getNetworkInfo(): NetworkInfo {
  const connection = getConnection();
  if (!connection) {
    return {};
  }

  const { downlink, rtt, saveData } = connection;
  return { downlink, rtt, saveData };
}

export function onNetworkChange(callback: (info: NetworkInfo) => void): () => void {
  const connection = getConnection();
  if (!connection || !connection.addEventListener) {
    return () => {};
  }

  const handler = () => callback(getNetworkInfo());
  connection.addEventListener('change', handler);
  return () => connection.removeEventListener('change', handler);
}
