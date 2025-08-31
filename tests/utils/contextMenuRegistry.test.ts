import { register, get } from '../../src/utils/contextMenuRegistry';

describe('contextMenuRegistry', () => {
  it('registers and retrieves actions', () => {
    const action = { label: 'test', onSelect: () => {} };
    register('menu', action);

    const actions = get('menu');

    expect(actions).toHaveLength(1);
    expect(actions[0]).toBe(action);
  });
});
