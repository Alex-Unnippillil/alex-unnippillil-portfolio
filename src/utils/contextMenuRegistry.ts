export interface IContextMenuAction {
  label: string;
  onSelect: (target: HTMLElement) => void;
}

const registry: { [id: string]: IContextMenuAction[] } = {};

export function register(id: string, action: IContextMenuAction): void {
  if (!registry[id]) {
    registry[id] = [];
  }
  registry[id].push(action);
}

export function unregister(id: string, action: IContextMenuAction): void {
  if (!registry[id]) {
    return;
  }
  registry[id] = registry[id].filter((a) => a !== action);
  if (!registry[id].length) {
    delete registry[id];
  }
}

export function get(id: string): IContextMenuAction[] {
  return registry[id] ? [...registry[id]] : [];
}

export default {
  register,
  unregister,
  get,
};
