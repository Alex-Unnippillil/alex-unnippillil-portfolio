import can, { setCapabilityFlag, clearCapabilityFlags } from '../../src/lib/policy/can';
import secureRoute from '../../src/server/routes/secure';
import { hideIfCant, disableIfCant, filterCommandActions } from '../../src/components/permissions';

describe('capability flag integration', () => {
  afterEach(() => {
    clearCapabilityFlags();
  });

  const user = { id: '1', attributes: { role: 'admin' } };
  const resource = { ownerId: '1', capability: 'edit' };

  test('toggling capability flag affects can, routes, and UI', () => {
    setCapabilityFlag('edit', true);
    expect(can(user, 'edit', resource)).toBe(true);

    const handler = jest.fn();
    const req: any = { user };
    const res: any = {};
    secureRoute('edit', resource, handler)(req, res);
    expect(handler).toHaveBeenCalled();

    expect(hideIfCant(user, 'edit', resource, 'element')).toBe('element');
    expect(disableIfCant(user, 'edit', resource, { disabled: false })).toEqual({ disabled: false });

    setCapabilityFlag('edit', false);
    expect(can(user, 'edit', resource)).toBe(false);

    const deniedHandler = jest.fn();
    const deniedReq: any = { user };
    const deniedRes: any = { statusCode: 200, end: jest.fn() };
    const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    secureRoute('edit', resource, deniedHandler)(deniedReq, deniedRes);
    expect(deniedHandler).not.toHaveBeenCalled();
    expect(deniedRes.statusCode).toBe(403);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();

    expect(hideIfCant(user, 'edit', resource, 'element')).toBeNull();
    expect(disableIfCant(user, 'edit', resource, { disabled: false })).toEqual({ disabled: true });
    const actions = [
      { action: 'edit', resource, id: 1 },
      { action: 'view', resource: { ownerId: '1' }, id: 2 },
    ];
    expect(filterCommandActions(user, actions)).toEqual([
      { action: 'view', resource: { ownerId: '1' }, id: 2 },
    ]);
  });
});
