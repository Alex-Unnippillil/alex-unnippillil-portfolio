import type { Command } from './types';

const registry: Record<string, Command> = {};
let loaded = false;

const RECENTS_KEY = 'commands.recent';
let memoryRecents: string[] = [];

function getStorage(): Storage | undefined {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch (e) {
    // ignore
  }
  return undefined;
}

function readRecents(): string[] {
  const storage = getStorage();
  if (storage) {
    const data = storage.getItem(RECENTS_KEY);
    if (!data) return [];
    try {
      const arr = JSON.parse(data);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  return [...memoryRecents];
}

function saveRecents(list: string[]): void {
  const storage = getStorage();
  if (storage) {
    storage.setItem(RECENTS_KEY, JSON.stringify(list));
  } else {
    memoryRecents = [...list];
  }
}

function touchRecent(id: string): void {
  const recent = readRecents().filter((r) => r !== id);
  recent.unshift(id);
  saveRecents(recent);
}

async function loadCommands(): Promise<void> {
  if (loaded) return;
  loaded = true;

  const modules: any[] = [];

  // webpack require.context
  if (typeof require !== 'undefined' && (require as any).context) {
    const context = (require as any).context('../../apps', true, /commands\.ts$/);
    context.keys().forEach((key: string) => {
      modules.push(context(key));
    });
  } else {
    const fs = await import('fs');
    const path = await import('path');
    const appsDir = path.join(__dirname, '../../apps');
    if (fs.existsSync(appsDir)) {
      fs.readdirSync(appsDir).forEach((name) => {
        const cmdFile = path.join(appsDir, name, 'commands.ts');
        if (fs.existsSync(cmdFile)) {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          modules.push(require(cmdFile));
        }
      });
    }
  }

  modules.forEach((mod) => {
    const list: Command[] = mod.default || mod.commands || [];
    list.forEach((cmd) => {
      if (!registry[cmd.id]) {
        registry[cmd.id] = cmd;
      }
    });
  });
}

export async function getCommands(): Promise<Command[]> {
  await loadCommands();
  const cmds = Object.values(registry);
  const recent = readRecents();
  cmds.sort((a, b) => {
    const ia = recent.indexOf(a.id);
    const ib = recent.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return cmds;
}

export async function runCommand(id: string): Promise<void> {
  await loadCommands();
  const cmd = registry[id];
  if (!cmd) {
    throw new Error(`Command ${id} not found`);
  }
  touchRecent(id);
  await cmd.run();
}

export default {
  getCommands,
  runCommand,
};
