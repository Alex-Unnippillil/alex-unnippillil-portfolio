export interface ShortcutOptions {
  description?: string;
  scope?: string; // if set, shortcut is active only when this scope is focused
}

export interface ShortcutInfo extends ShortcutOptions {
  keys: string[]; // sequence of chords, each chord is normalized string
  handler: () => void;
}

// Normalize chord string such as 'Ctrl+K' or 'Shift+Alt+P'
function normalizeChordString(chord: string): string {
  const parts = chord.split('+').map(p => p.trim().toLowerCase());
  const modifiers: string[] = [];
  const keys: string[] = [];

  parts.forEach(p => {
    if (['ctrl', 'shift', 'alt', 'meta'].includes(p)) {
      modifiers.push(p);
    } else if (p) {
      keys.push(p);
    }
  });

  modifiers.sort();
  keys.sort();
  return [...modifiers, ...keys].join('+');
}

function parseShortcut(def: string): string[] {
  return def.trim().split(' ').map(normalizeChordString);
}

function chordFromEvent(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('ctrl');
  if (e.metaKey) parts.push('meta');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  const key = e.key.toLowerCase();
  parts.push(key);
  return parts.sort().join('+');
}

function sequenceMatch(buffer: string[], seq: string[]): boolean {
  if (buffer.length < seq.length) return false;
  for (let i = 0; i < seq.length; i += 1) {
    if (buffer[buffer.length - seq.length + i] !== seq[i]) {
      return false;
    }
  }
  return true;
}

export class ShortcutManager {
  private shortcuts: ShortcutInfo[] = [];

  private buffer: string[] = [];

  private timer?: number;

  private currentScope?: string;

  constructor(private timeout = 1000) {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  register(definition: string, handler: () => void, options: ShortcutOptions = {}): () => void {
    const shortcut: ShortcutInfo = {
      keys: parseShortcut(definition),
      handler,
      ...options,
    };
    this.shortcuts.push(shortcut);
    return () => {
      this.shortcuts = this.shortcuts.filter(s => s !== shortcut);
    };
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    const chord = chordFromEvent(e);
    this.buffer.push(chord);

    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.buffer = [];
    }, this.timeout);

    const scope = this.currentScope;
    const matches = this.shortcuts.filter(s => {
      if (s.scope && s.scope !== scope) return false;
      return sequenceMatch(this.buffer, s.keys);
    });

    matches.forEach(m => m.handler());
    if (matches.length > 0) {
      this.buffer = [];
    }
  };

  setScope(scope: string): void {
    this.currentScope = scope;
  }

  clearScope(): void {
    this.currentScope = undefined;
  }

  getShortcuts(): ShortcutInfo[] {
    return [...this.shortcuts];
  }
}

const shortcutManager = new ShortcutManager();
export default shortcutManager;
