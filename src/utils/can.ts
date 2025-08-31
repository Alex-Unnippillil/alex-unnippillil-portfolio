export interface CapabilityDefinition {
  endpoint: string;
  element: string;
  fallbackElement?: string;
}

export const CAPABILITY_MAP: Record<string, CapabilityDefinition> = {
  EDIT_PROFILE: {
    endpoint: '/api/profile',
    element: 'button[data-action="edit-profile"]',
    fallbackElement: 'span[data-action="edit-profile"]',
  },
  DELETE_REPOSITORY: {
    endpoint: '/api/repos/:id',
    element: 'button[data-action="delete-repo"]',
    fallbackElement: 'span[data-action="delete-repo"]',
  },
};

export interface CanResult {
  allowed: boolean;
  element: string;
  endpoint?: string;
}

export default function can(
  userCapabilities: string[],
  flag: keyof typeof CAPABILITY_MAP,
): CanResult {
  const definition = CAPABILITY_MAP[flag];
  const allowed = userCapabilities.includes(flag);
  return {
    allowed,
    element: allowed ? definition.element : definition.fallbackElement || definition.element,
    endpoint: allowed ? definition.endpoint : undefined,
  };
}
