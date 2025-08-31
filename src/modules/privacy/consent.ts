export default class Consent {
  static hasConsent(cookieName = 'cookie_consent'): boolean {
    if (typeof document === 'undefined') {
      return false;
    }
    return document.cookie.split(';').map((c) => c.trim()).some((c) => c === `${cookieName}=1`);
  }

  static isDoNotTrack(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    const dnt = (navigator as any).doNotTrack
      || (navigator as any).msDoNotTrack
      || (typeof window !== 'undefined' && (window as any).doNotTrack);
    return dnt === '1' || dnt === 'yes';
  }

  static canUseCookies(): boolean {
    return this.hasConsent() && !this.isDoNotTrack();
  }
}
