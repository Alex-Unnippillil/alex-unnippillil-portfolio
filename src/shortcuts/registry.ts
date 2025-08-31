import { Layout, metaKey } from '../utils/metaKey';

export interface Shortcut {
  description: string;
  keys: string[];
}

export const registry: Record<string, Shortcut> = {
  openHelp: {
    description: 'Open shortcut help',
    keys: ['Meta', '/'],
  },
};

const normalizeKey = (key: string, layout: Layout): string => {
  switch (key.toLowerCase()) {
    case 'meta':
      return metaKey(layout);
    case 'alt':
      return layout === 'mac' ? 'Option' : 'Alt';
    case 'shift':
      return 'Shift';
    case 'ctrl':
      return 'Ctrl';
    default:
      return key;
  }
};

export const formatShortcut = (id: string, layout: Layout): string => (
  registry[id]
    ? registry[id].keys.map((k) => normalizeKey(k, layout)).join('+')
    : ''
);
