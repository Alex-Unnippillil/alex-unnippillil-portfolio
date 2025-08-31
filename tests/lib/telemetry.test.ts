/**
 * @jest-environment jsdom
 */
import { logInteraction } from '../../src/lib/telemetry';

describe('telemetry', () => {
  it('flags network as cause when connection is slow', () => {
    Object.defineProperty(navigator, 'connection', {
      value: { downlink: 0.5, rtt: 500, saveData: false },
      configurable: true,
    });

    const event = logInteraction('slow');
    expect(event.cause).toBe('network');
  });

  it('flags compute as cause when connection is fast', () => {
    Object.defineProperty(navigator, 'connection', {
      value: { downlink: 10, rtt: 50, saveData: false },
      configurable: true,
    });

    const event = logInteraction('fast');
    expect(event.cause).toBe('compute');
  });
});
