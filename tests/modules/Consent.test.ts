import Consent from '../../src/modules/privacy/consent';

describe('Consent module', () => {
  beforeEach(() => {
    (global as any).document = { cookie: '' };
    (global as any).navigator = {};
    (global as any).window = {};
  });

  it('detects consent via cookie', () => {
    (global as any).document.cookie = 'cookie_consent=1';
    expect(Consent.hasConsent()).toBe(true);
  });

  it('detects do not track', () => {
    (global as any).navigator.doNotTrack = '1';
    expect(Consent.isDoNotTrack()).toBe(true);
  });

  it('allows cookies only when consented and DNT disabled', () => {
    (global as any).document.cookie = 'cookie_consent=1';
    expect(Consent.canUseCookies()).toBe(true);
    (global as any).navigator.doNotTrack = '1';
    expect(Consent.canUseCookies()).toBe(false);
  });
});
