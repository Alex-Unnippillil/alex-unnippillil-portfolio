export interface PolicyUser {
  id?: string;
  role?: string;
  capabilities?: string[];
  [key: string]: any;
}

export interface PolicyResource {
  type?: string;
  ownerId?: string;
  public?: boolean;
  [key: string]: any;
}

/**
 * Simple attribute based access control helper using capability flags.
 *
 * @param user current user object
 * @param action action attempting to perform (e.g. 'read', 'edit')
 * @param resource resource type or object
 */
export function can(
  user: PolicyUser | null | undefined,
  action: string,
  resource?: PolicyResource | string,
): boolean {
  if (!user) {
    return action === 'read' && typeof resource !== 'string' && (resource as PolicyResource)?.public === true;
  }

  // administrators bypass checks
  if (user.role === 'admin') {
    return true;
  }

  const resType = typeof resource === 'string' ? resource : resource?.type || '';
  const capability = `${action}:${resType}`;

  // capability flags like "edit:post" or "read:repo"
  if (user.capabilities?.includes(capability)) {
    return true;
  }

  // owner can always access their own resource
  if (
    typeof resource !== 'string'
    && resource?.ownerId !== undefined
    && user.id !== undefined
    && resource.ownerId === user.id
  ) {
    return true;
  }

  // public resources are readable by anyone
  if (action === 'read' && typeof resource !== 'string' && resource?.public) {
    return true;
  }

  return false;
}

/**
 * Wrap an API route handler with policy enforcement.
 * Logs denied decisions for audit purposes.
 */
export function withPolicy(
  action: string,
  getResource?: (req: any) => PolicyResource | string,
) {
  return (handler: any) => (req: any, res: any, ...rest: any[]) => {
    const resource = getResource ? getResource(req) : undefined;
    if (!can(req.user, action, resource)) {
      const userId = req.user?.id || 'anonymous';
      const resType = typeof resource === 'string' ? resource : resource?.type || '';
      // eslint-disable-next-line no-console
      console.warn(`access denied: ${userId} cannot ${action} ${resType}`);
      if (res?.status && res?.json) {
        res.status(403).json({ error: 'forbidden' });
      }
      return undefined;
    }
    return handler(req, res, ...rest);
  };
}

export default { can, withPolicy };

