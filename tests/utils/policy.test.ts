import { can } from '../../src/utils/policy';

describe('policy.can', () => {
  const user = { id: 'u1', capabilities: ['read:repo'] };

  it('allows admin', () => {
    expect(can({ role: 'admin' }, 'delete', 'repo')).toBeTruthy();
  });

  it('allows capability match', () => {
    expect(can(user, 'read', 'repo')).toBeTruthy();
  });

  it('allows owner', () => {
    expect(can({ id: 'u1' }, 'edit', { type: 'repo', ownerId: 'u1' })).toBeTruthy();
  });

  it('allows public read', () => {
    expect(can(null, 'read', { type: 'repo', public: true })).toBeTruthy();
  });

  it('denies when no rule matches', () => {
    expect(can(user, 'delete', 'repo')).toBeFalsy();
  });
});

