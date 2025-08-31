/* eslint-disable import/first */

describe('commands registry', () => {
  const createStorage = () => {
    const store: Record<string, string> = {};
    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
      key: (index: number) => Object.keys(store)[index] || null,
      get length() {
        return Object.keys(store).length;
      },
    } as unknown as Storage;
  };

  beforeEach(() => {
    jest.resetModules();
    (global as any).localStorage = createStorage();
  });

  it('auto-registers commands from apps', async () => {
    const { getCommands } = await import('../../src/commands');
    const cmds = await getCommands();
    const ids = cmds.map((c) => c.id).sort();
    expect(ids).toStrictEqual(['alpha', 'beta']);
  });

  it('recent actions float to the top', async () => {
    const { getCommands, runCommand } = await import('../../src/commands');

    await runCommand('alpha');
    let cmds = await getCommands();
    expect(cmds[0].id).toBe('alpha');

    await runCommand('beta');
    cmds = await getCommands();
    expect(cmds[0].id).toBe('beta');
  });
});
