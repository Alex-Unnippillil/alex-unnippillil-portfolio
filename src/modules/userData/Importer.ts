import { EventEmitter } from 'events';

export interface ImportPreview {
  added: Record<string, any>;
  updated: Record<string, { from: any; to: any }>;
}

export default class UserDataImporter extends EventEmitter {
  validate(input: { version: string; data: Record<string, any> }, expectedVersion: string): boolean {
    return input.version === expectedVersion;
  }

  preview(existing: Record<string, any>, incoming: Record<string, any>): ImportPreview {
    const added: Record<string, any> = {};
    const updated: Record<string, { from: any; to: any }> = {};
    Object.keys(incoming).forEach((key) => {
      if (!(key in existing)) {
        added[key] = incoming[key];
      } else if (existing[key] !== incoming[key]) {
        updated[key] = { from: existing[key], to: incoming[key] };
      }
    });
    return { added, updated };
  }

  async process(existing: Record<string, any>, incoming: Record<string, any>): Promise<Record<string, any>> {
    const keys = Object.keys(incoming);
    const result = { ...existing };
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      result[key] = incoming[key];
      this.emit('progress', Math.round(((i + 1) / keys.length) * 100));
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return result;
  }
}
