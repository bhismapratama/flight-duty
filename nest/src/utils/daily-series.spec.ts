import { DailySeries } from './daily-series.js';
import { addDays, diffInDays, eachDay, isIsoDate } from './date.js';

describe('date utils', () => {
  it('accepts only real YYYY-MM-DD dates', () => {
    expect(isIsoDate('2026-05-15')).toBe(true);
    expect(isIsoDate('2024-02-29')).toBe(true);
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('2026-5-15')).toBe(false);
    expect(isIsoDate('abc')).toBe(false);
    expect(isIsoDate(20260515)).toBe(false);
  });

  it('does calendar math across month and year boundaries', () => {
    expect(addDays('2026-05-15', -7)).toBe('2026-05-08');
    expect(addDays('2024-12-31', 1)).toBe('2025-01-01');
    expect(diffInDays('2026-05-15', '2026-05-01')).toBe(-14);
    expect(eachDay('2026-02-27', '2026-03-02')).toEqual([
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
      '2026-03-02',
    ]);
  });
});

describe('DailySeries', () => {
  const series = new DailySeries([
    { date: '2026-01-01', hours: 1.1 },
    { date: '2026-01-02', hours: 2.2 },
    { date: '2026-01-04', hours: 3.3 },
    { date: '2026-01-05', hours: 0.1 },
    { date: '2026-01-05', hours: 0.2 },
  ]);

  it('exposes the covered range', () => {
    expect(series.firstDate).toBe('2026-01-01');
    expect(series.lastDate).toBe('2026-01-05');
  });

  it('treats missing days and days outside the data as 0', () => {
    expect(series.hoursOn('2026-01-03')).toBe(0);
    expect(series.hoursOn('2025-12-31')).toBe(0);
    expect(series.hoursOn('2026-02-01')).toBe(0);
  });

  it('adds entries on the same date without float drift', () => {
    expect(series.hoursOn('2026-01-05')).toBe(0.3);
  });

  it('sums a window ending on a date, inclusive', () => {
    expect(series.rollingSum('2026-01-04', 3)).toEqual({
      value: 5.5,
      isPartialWindow: false,
    });
  });

  it('flags a window that starts before the data', () => {
    expect(series.rollingSum('2026-01-02', 7)).toEqual({
      value: 3.3,
      isPartialWindow: true,
    });
  });

  it('flags a window that ends after the data', () => {
    expect(series.rollingSum('2026-01-06', 2)).toEqual({
      value: 0.3,
      isPartialWindow: true,
    });
  });

  it('returns 0 for a window entirely outside the data', () => {
    expect(series.sumBetween('2027-01-01', '2027-01-31')).toBe(0);
    expect(series.sumBetween('2020-01-01', '2020-01-31')).toBe(0);
  });

  it('rejects an empty dataset', () => {
    expect(() => new DailySeries([])).toThrow();
  });
});
