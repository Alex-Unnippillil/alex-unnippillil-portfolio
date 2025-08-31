/**
 * @jest-environment jsdom
 */
import PrivacyMode from '../../src/modules/core/PrivacyMode';

describe('PrivacyMode', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="panel" data-sensitive>Secret</div><span id="name" data-mask>John</span>';
  });

  it('masks personal data when enabled', () => {
    const pm = new PrivacyMode();
    pm.enable();
    expect(pm.isActive()).toBe(true);
    expect(document.getElementById('name')?.textContent).toBe('***');
    pm.destroy();
  });

  it('requires pin to disable when configured', () => {
    const pm = new PrivacyMode({ pin: '1234' }, () => '0000');
    pm.enable();
    pm.disable();
    expect(pm.isActive()).toBe(true);
    const pm2 = new PrivacyMode({ pin: '1234' }, () => '1234');
    pm2.enable();
    pm2.disable();
    expect(pm2.isActive()).toBe(false);
    pm.destroy();
    pm2.destroy();
  });

  it('auto activates after blur timeout', () => {
    jest.useFakeTimers();
    const pm = new PrivacyMode({ timeout: 100 });
    window.dispatchEvent(new Event('blur'));
    jest.advanceTimersByTime(100);
    expect(pm.isActive()).toBe(true);
    pm.destroy();
    jest.useRealTimers();
  });

  it('toggles with keyboard shortcut', () => {
    const pm = new PrivacyMode();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', ctrlKey: true }));
    expect(pm.isActive()).toBe(true);
    pm.destroy();
  });
});
