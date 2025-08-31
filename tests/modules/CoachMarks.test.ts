import CoachMarks, { CoachMark } from '../../src/modules/coachmarks/CoachMarks';
import MemoryStorage from '../../src/utils/MemoryStorage';

describe('CoachMarks module', () => {
  const criteriaTrue = () => true;

  it('shows coach mark based on discovery criteria and frequency cap', () => {
    const storage = new MemoryStorage();
    const marks = new CoachMarks(storage);
    const mark: CoachMark = { id: 'a', criteria: criteriaTrue, frequencyCap: 2 };

    expect(marks.shouldShow(mark)).toBe(true);
    marks.markShown('a');
    expect(marks.shouldShow(mark)).toBe(true);
    marks.markShown('a');
    expect(marks.shouldShow(mark)).toBe(false);
  });

  it('persists "don\'t show again" across instances', () => {
    const storage = new MemoryStorage();
    const mark: CoachMark = { id: 'a', criteria: criteriaTrue, frequencyCap: 5 };
    const first = new CoachMarks(storage);
    first.dontShowAgain('a');
    expect(first.shouldShow(mark)).toBe(false);

    const second = new CoachMarks(storage);
    expect(second.shouldShow(mark)).toBe(false);
  });

  it('tracks analytics for impressions, clicks and dismissals', () => {
    const storage = new MemoryStorage();
    const marks = new CoachMarks(storage);

    marks.markShown('a');
    marks.trackClick('a');
    marks.trackDismiss('a');

    expect(marks.getAnalytics('a')).toStrictEqual({
      impressions: 1,
      clicks: 1,
      dismissals: 1,
    });
  });

  it('removes low-performing hints based on CTR threshold', () => {
    const storage = new MemoryStorage();
    const marks = new CoachMarks(storage);
    const hints: CoachMark[] = [
      { id: 'a', criteria: criteriaTrue, frequencyCap: 5 },
      { id: 'b', criteria: criteriaTrue, frequencyCap: 5 },
    ];

    marks.markShown('a');
    marks.trackClick('a');

    marks.markShown('b');

    const filtered = marks.removeLowPerforming(hints, 0.5);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('a');
  });
});
