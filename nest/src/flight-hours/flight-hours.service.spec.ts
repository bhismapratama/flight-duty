import { BadRequestException } from '@nestjs/common';

import { DataService } from '@infra';

import { FlightHoursService } from './flight-hours.service.js';

describe('FlightHoursService', () => {
  const service = new FlightHoursService(new DataService(), {
    port: 4000,
    host: '0.0.0.0',
    baseUrl: 'http://localhost:4000',
    today: '2026-05-15',
    corsOrigins: true,
  });

  describe('getSummary', () => {
    it('computes the four limit cards on today', () => {
      const { cards } = service.getSummary('1w');

      expect(cards.map(card => [card.key, card.hours, card.limit])).toEqual([
        ['daily', 6.4, 8],
        ['weekly', 25.2, 40],
        ['monthly', 87.2, 100],
        ['annual', 1013.8, 1050],
      ]);
      expect(cards[0]).toMatchObject({ remaining: 1.6, percentage: 80, status: 'warning' });
      expect(cards[1].status).toBe('safe');
    });

    it('centres 15 points on today', () => {
      const { chart } = service.getSummary('1w');

      expect(chart.points).toHaveLength(15);
      expect(chart.points[0].date).toBe('2026-05-08');
      expect(chart.points[7]).toMatchObject({ date: '2026-05-15', isToday: true, isFuture: false });
      expect(chart.points[14]).toMatchObject({ date: '2026-05-22', isFuture: true });
    });

    it('returns the 1w rolling series with planned hours after today', () => {
      const { chart } = service.getSummary('1w');

      expect(chart.points.map(point => point.value)).toEqual([
        15, 15, 16.6, 12.6, 16.3, 22.2, 24, 25.2, 31.4, 36.4, 42.8, 44, 44.7, 42.7, 36.3,
      ]);
    });

    it('flags values above the red line without clipping the axis', () => {
      const { chart } = service.getSummary('1w');
      const over = chart.points.filter(point => point.isOverLimit).map(point => point.date);

      expect(over).toEqual(['2026-05-18', '2026-05-19', '2026-05-20', '2026-05-21']);
      expect(chart.yAxisMax).toBe(45);
    });

    it.each([
      ['1w', 7, 40, 45],
      ['1m', 30, 100, 125],
      ['3m', 90, 300, 325],
      ['6m', 180, 600, 625],
      ['1y', 365, 1050, 1200],
    ] as const)('uses the brief bounds for %s', (range, windowDays, limit, max) => {
      expect(service.getSummary(range).chart).toMatchObject({ windowDays, limit, max });
    });

    it('marks the 1m value on 2026-05-08 as over the limit', () => {
      const first = service.getSummary('1m').chart.points[0];

      expect(first).toMatchObject({ date: '2026-05-08', value: 102.2, isOverLimit: true });
    });
  });

  describe('getDailyHours', () => {
    it('returns every day in the range, with 0 outside the data', () => {
      const result = service.getDailyHours('2024-12-25', '2024-12-28');

      expect(result.days.map(day => day.hours)).toEqual([0, 0, 5.7, 0]);
      expect(result.totalHours).toBe(5.7);
    });

    it('rejects a reversed range', () => {
      expect(() => service.getDailyHours('2026-05-10', '2026-05-01')).toThrow(BadRequestException);
    });

    it('rejects a range longer than one year', () => {
      expect(() => service.getDailyHours('2025-01-01', '2026-01-02')).toThrow(BadRequestException);
    });
  });
});
