import can from '../../lib/policy/can';

export type Handler = (req: any, res: any) => any;

export function secureRoute(action: string, resource: any, handler: Handler): Handler {
  return (req: any, res: any) => {
    const user = req?.user || null;
    if (can(user, action, resource)) {
      return handler(req, res);
    }
    // Log denied decision
    console.warn(`Access denied for action "${action}"`);
    if (res) {
      res.statusCode = 403;
      if (typeof res.end === 'function') {
        res.end();
      }
    }
    return undefined;
  };
}

export default secureRoute;
