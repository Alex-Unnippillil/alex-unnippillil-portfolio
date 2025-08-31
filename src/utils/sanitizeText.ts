import { URL } from 'url';

const PROFANE_WORDS = ['damn', 'hell', 'shit', 'fuck'];
export const ALLOWED_DOMAINS = [
  'github.com',
  'twitter.com',
  'linkedin.com',
  'medium.com',
];

export default class SanitizeText {
  static stripProfanity(text: string): string {
    if (!text) {
      return '';
    }
    const regex = new RegExp(`\\b(${PROFANE_WORDS.join('|')})\\b`, 'gi');
    return text.replace(regex, '****');
  }

  static stripUnsafeUrls(text: string): string {
    if (!text) {
      return '';
    }
    return text.replace(/https?:[^\s]+/gi, (url) => {
      try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        if (ALLOWED_DOMAINS.includes(hostname)) {
          return url;
        }
      } catch (e) {
        // ignore
      }
      return '';
    });
  }

  static sanitize(text: string): string {
    const noProfanity = SanitizeText.stripProfanity(text);
    return SanitizeText.stripUnsafeUrls(noProfanity);
  }

  static isUrlAllowed(url: string): boolean {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, '');
      return ALLOWED_DOMAINS.includes(hostname);
    } catch (e) {
      return false;
    }
  }
}
