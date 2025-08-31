import { stringify as csvStringify } from './csv';

export default class UserDataExporter {
  export(data: Record<string, any>, format: 'json' | 'csv', version: string): string {
    const payload = { version, data };
    if (format === 'csv') {
      const headers = ['schemaVersion', ...Object.keys(data)];
      const row = [version, ...headers.slice(1).map((k) => data[k])];
      return csvStringify([headers, row]);
    }
    return JSON.stringify(payload, null, 2);
  }
}
