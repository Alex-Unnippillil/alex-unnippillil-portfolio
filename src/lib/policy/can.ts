export interface User {
  id?: string;
  attributes?: Record<string, any>;
  capabilities?: Record<string, boolean>;
}

export interface Resource {
  ownerId?: string;
  attributes?: Record<string, any>;
  requiredAttributes?: Record<string, any>;
  capability?: string;
}

const capabilityFlags: Record<string, boolean> = {};

export function setCapabilityFlag(name: string, enabled: boolean): void {
  capabilityFlags[name] = enabled;
}

export function getCapabilityFlag(name: string): boolean | undefined {
  return capabilityFlags[name];
}

export function clearCapabilityFlags(): void {
  Object.keys(capabilityFlags).forEach((k) => delete capabilityFlags[k]);
}

export function can(
  user: User | null,
  action: string,
  resource?: Resource,
): boolean {
  const capability = resource?.capability || action;

  if (capability && capabilityFlags[capability] === false) {
    return false;
  }

  if (user?.capabilities && capability) {
    const userCap = user.capabilities[capability];
    if (userCap === false) {
      return false;
    }
  }

  if (resource?.ownerId && user?.id && resource.ownerId !== user.id) {
    return false;
  }

  if (resource?.requiredAttributes) {
    const attrs = user?.attributes || {};
    for (const [key, value] of Object.entries(resource.requiredAttributes)) {
      if (attrs[key] !== value) {
        return false;
      }
    }
  }

  return true;
}

export default can;
