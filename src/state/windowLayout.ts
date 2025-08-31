export interface PanePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowLayout {
  version: number;
  panes: { [key: string]: PanePosition };
  checksum: string;
}

function computeChecksum(layout: Omit<WindowLayout, 'checksum'>): string {
  const json = JSON.stringify(layout);
  let hash = 0;
  for (let i = 0; i < json.length; i += 1) {
    const chr = json.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}

export function withChecksum(layout: Omit<WindowLayout, 'checksum'>): WindowLayout {
  return { ...layout, checksum: computeChecksum(layout) };
}

export function isValidLayout(layout: WindowLayout): boolean {
  const { checksum, ...rest } = layout;
  return checksum === computeChecksum(rest as Omit<WindowLayout, 'checksum'>);
}

export const defaultWindowLayout: WindowLayout = withChecksum({
  version: 1,
  panes: {},
});

export { computeChecksum };
