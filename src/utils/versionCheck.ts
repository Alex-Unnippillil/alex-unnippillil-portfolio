import { parseVersion } from '../features/versionFlags';

export interface VersionInfo {
  api: string;
  schema: string;
}

export default class VersionCheck {
  static isOutdated(server: VersionInfo, client: VersionInfo): boolean {
    return server.api !== client.api || server.schema !== client.schema;
  }

  static ensure(server: VersionInfo, client: VersionInfo): void {
    if (VersionCheck.isOutdated(server, client)) {
      if (typeof window !== 'undefined' && window.confirm('A new version is available. Reload?')) {
        window.location.reload();
      }
    }
  }

  static ensureFromHeaders(headers: Record<string, string>, client: VersionInfo): void {
    const server = parseVersion(headers);
    if (server.api && server.schema) {
      VersionCheck.ensure(server as VersionInfo, client);
    }
  }
}
