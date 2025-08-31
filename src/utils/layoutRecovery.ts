import { WindowLayout, withChecksum, isValidLayout, defaultWindowLayout } from '../state/windowLayout';

const LAYOUT_KEY = 'windowLayout';
const BACKUP_KEYS = ['windowLayout:backup1', 'windowLayout:backup2'];

function readLayout(key: string): WindowLayout | null {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as WindowLayout;
  } catch (e) {
    return null;
  }
}

function writeLayout(key: string, layout: WindowLayout): void {
  localStorage.setItem(key, JSON.stringify(layout));
}

export default class LayoutRecovery {
  static save(layout: Omit<WindowLayout, 'checksum'>): void {
    const current = localStorage.getItem(LAYOUT_KEY);
    if (current) {
      localStorage.setItem(BACKUP_KEYS[1], localStorage.getItem(BACKUP_KEYS[0]) || '');
      localStorage.setItem(BACKUP_KEYS[0], current);
    }
    const layoutWithChecksum = withChecksum(layout);
    writeLayout(LAYOUT_KEY, layoutWithChecksum);
  }

  static load(): WindowLayout {
    const layout = readLayout(LAYOUT_KEY);
    if (layout && isValidLayout(layout)) {
      return layout;
    }

    for (const key of BACKUP_KEYS) {
      const backup = readLayout(key);
      if (backup && isValidLayout(backup)) {
        writeLayout(LAYOUT_KEY, backup);
        return backup;
      }
    }

    writeLayout(LAYOUT_KEY, defaultWindowLayout);
    return defaultWindowLayout;
  }
}
