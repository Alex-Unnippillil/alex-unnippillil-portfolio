/**
 * @jest-environment jsdom
 */
import { getFlag, getABVariant, recordExperiment, getExperimentResults, clearExperimentResults } from '../../src/utils/flags';

describe('flags', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = `${c.replace(/^ +/, '').split('=')[0]}=;expires=${new Date(0).toUTCString()};path=/`;
    });
    clearExperimentResults();
    window.history.replaceState({}, '', '/');
  });

  it('reads flag from query params and stores cookie', () => {
    window.history.replaceState({}, '', '/?foo=bar');
    const value = getFlag('foo');
    expect(value).toBe('bar');
    expect(document.cookie).toContain('foo=bar');
  });

  it('assigns A/B variant in signed cookie', () => {
    getABVariant('test');
    const match = document.cookie.match(/ab_test=([^;]+)/);
    expect(match).not.toBeNull();
    const original = match![1];
    // tamper with cookie
    document.cookie = `ab_test=${original.split('.')[0]}.tampered`;
    getABVariant('test');
    const updated = document.cookie.match(/ab_test=([^;]+)/)![1];
    expect(updated).not.toBe(`${original.split('.')[0]}.tampered`);
  });

  it('records experiment results', () => {
    recordExperiment('exp', 'A');
    const results = getExperimentResults();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('exp');
  });
});
