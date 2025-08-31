import EventEmitter from '../../src/modules/events/EventEmitter';
import IDashboard from '../../src/modules/events/interfaces/IDashboard';
import IEvent from '../../src/modules/events/interfaces/IEvent';

class MockDashboard implements IDashboard {
  public events: IEvent[] = [];

  send(event: IEvent): void {
    this.events.push(event);
  }
}

describe('EventEmitter', () => {
  it('redacts free-text fields', () => {
    const dashboard = new MockDashboard();
    const emitter = new EventEmitter(dashboard);
    const event: IEvent = {
      event: 'test',
      version: '1.0.0',
      owner: 'team',
      timestamp: new Date().toISOString(),
      properties: { message: 'secret' },
    };

    emitter.emit(event);

    expect(dashboard.events).toHaveLength(1);
    expect(dashboard.events[0].properties?.message).toBe('[REDACTED]');
  });

  it('blocks invalid events', () => {
    const dashboard = new MockDashboard();
    const emitter = new EventEmitter(dashboard);
    const invalid: any = {
      event: 'test',
      owner: 'team',
      timestamp: new Date().toISOString(),
    };

    const result = emitter.emit(invalid);

    expect(result).toBe(false);
    expect(dashboard.events).toHaveLength(0);
  });
});
