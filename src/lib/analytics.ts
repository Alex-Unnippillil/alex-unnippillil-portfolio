/*
 * Simple internal analytics tracker.
 * Counts page views and custom actions using a hashed session id.
 * Respects browser do not track preference and supports sampling.
 */

interface AnalyticsStore {
  pages: Record<string, number>;
  actions: Record<string, number>;
}

export default class AnalyticsTracker {
  private enabled: boolean;

  private sessionId: string | null = null;

  private store: AnalyticsStore;

  constructor() {
    const { sampleRate } = require('../../config/analytics.json');
    this.enabled = this.shouldTrack(Number(sampleRate));
    this.store = this.load();

    if (this.enabled) {
      this.sessionId = this.getSessionId();
    }
  }

  private shouldTrack(sampleRate: number): boolean {
    const dnt = (navigator as any).doNotTrack === '1'
      || (navigator as any).msDoNotTrack === '1'
      || (window as any).doNotTrack === '1';

    if (dnt) {
      return false;
    }

    return Math.random() < sampleRate;
  }

  private getSessionId(): string {
    const existing = sessionStorage.getItem('analyticsSession');
    if (existing) {
      return existing;
    }

    const raw = `${Date.now()}-${Math.random()}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i += 1) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const id = hash.toString(16);
    sessionStorage.setItem('analyticsSession', id);
    return id;
  }

  private load(): AnalyticsStore {
    try {
      const json = localStorage.getItem('analytics');
      if (json) {
        return JSON.parse(json);
      }
    } catch (_) {
      // ignore
    }
    return { pages: {}, actions: {} };
  }

  private save(): void {
    if (!this.enabled) {
      return;
    }
    try {
      localStorage.setItem('analytics', JSON.stringify(this.store));
    } catch (_) {
      // ignore write errors
    }
  }

  trackPage(route: string): void {
    if (!this.enabled) {
      return;
    }
    this.store.pages[route] = (this.store.pages[route] || 0) + 1;
    this.save();
  }

  trackAction(action: string): void {
    if (!this.enabled) {
      return;
    }
    this.store.actions[action] = (this.store.actions[action] || 0) + 1;
    this.save();
  }

  summary(): AnalyticsStore {
    return { ...this.store };
  }
}
