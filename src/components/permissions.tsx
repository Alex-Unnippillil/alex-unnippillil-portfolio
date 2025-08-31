import can from '../lib/policy/can';

export function hideIfCant<T>(user: any, action: string, resource: any, element: T): T | null {
  return can(user, action, resource) ? element : null;
}

export function disableIfCant<T extends { disabled?: boolean }>(
  user: any,
  action: string,
  resource: any,
  element: T,
): T {
  if (can(user, action, resource)) {
    return element;
  }
  return { ...element, disabled: true };
}

export interface CommandAction {
  action: string;
  resource?: any;
  [key: string]: any;
}

export function filterCommandActions(user: any, actions: CommandAction[]): CommandAction[] {
  return actions.filter((a) => can(user, a.action, a.resource));
}
