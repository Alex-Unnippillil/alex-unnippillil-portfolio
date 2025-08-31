import EmptyStateTracker from '../../src/services/analytics/EmptyStateTracker';

describe('EmptyStateTracker', () => {
  beforeEach(() => {
    EmptyStateTracker.reset();
  });

  it('captures duration between render and population', () => {
    const spy = jest.spyOn(Date, 'now');
    spy.mockReturnValueOnce(0); // render time
    EmptyStateTracker.emitRender('profile', 'no-data');
    spy.mockReturnValueOnce(1000); // population time
    const event = EmptyStateTracker.emitPopulation('profile');

    expect(event).toEqual({ reason: 'no-data', timestamp: 0, duration: 1000 });
    expect(EmptyStateTracker.durations()).toContainEqual(event as any);
    spy.mockRestore();
  });

  it('provides CTA for reason', () => {
    expect(EmptyStateTracker.ctaFor('error')).toBe('Retry');
  });
});
