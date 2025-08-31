import { injectable } from 'inversify';
import StorageLike from '../../utils/StorageLike';
import MemoryStorage from '../../utils/MemoryStorage';

export interface CoachMark {
  id: string;
  criteria: () => boolean;
  frequencyCap: number;
}

export interface CoachMarkAnalytics {
  impressions: number;
  clicks: number;
  dismissals: number;
}

@injectable()
export default class CoachMarks {
  private storage: StorageLike;

  private analyticsCache: Record<string, CoachMarkAnalytics> = {};

  constructor(storage: StorageLike = new MemoryStorage()) {
    this.storage = storage;
  }

  private analyticsKey(id: string): string {
    return `coachmarks:analytics:${id}`;
  }

  private dontShowKey(id: string): string {
    return `coachmarks:dont:${id}`;
  }

  private loadAnalytics(id: string): CoachMarkAnalytics {
    if (!this.analyticsCache[id]) {
      const stored = this.storage.getItem(this.analyticsKey(id));
      this.analyticsCache[id] = stored ? JSON.parse(stored) : {
        impressions: 0,
        clicks: 0,
        dismissals: 0,
      };
    }

    return this.analyticsCache[id];
  }

  private saveAnalytics(id: string): void {
    this.storage.setItem(this.analyticsKey(id), JSON.stringify(this.loadAnalytics(id)));
  }

  public shouldShow(mark: CoachMark): boolean {
    if (!mark.criteria()) {
      return false;
    }

    if (this.storage.getItem(this.dontShowKey(mark.id))) {
      return false;
    }

    const { impressions } = this.loadAnalytics(mark.id);
    return impressions < mark.frequencyCap;
  }

  public markShown(id: string): void {
    const data = this.loadAnalytics(id);
    data.impressions += 1;
    this.saveAnalytics(id);
  }

  public trackClick(id: string): void {
    const data = this.loadAnalytics(id);
    data.clicks += 1;
    this.saveAnalytics(id);
  }

  public trackDismiss(id: string): void {
    const data = this.loadAnalytics(id);
    data.dismissals += 1;
    this.saveAnalytics(id);
  }

  public dontShowAgain(id: string): void {
    this.storage.setItem(this.dontShowKey(id), '1');
  }

  public getAnalytics(id: string): CoachMarkAnalytics {
    return this.loadAnalytics(id);
  }

  public removeLowPerforming(marks: CoachMark[], threshold: number): CoachMark[] {
    return marks.filter((mark) => {
      const data = this.loadAnalytics(mark.id);
      if (data.impressions === 0) {
        return true;
      }
      const ctr = data.clicks / data.impressions;
      return ctr >= threshold;
    });
  }
}
