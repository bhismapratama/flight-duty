export const FLIGHT_HOURS_EXAMPLE = {
  from: '2026-05-14',
  to: '2026-05-15',
  today: '2026-05-15',
  totalHours: 13.1,
  days: [
    { date: '2026-05-14', hours: 6.7, isFuture: false },
    { date: '2026-05-15', hours: 6.4, isFuture: false },
  ],
};

export const FLIGHT_HOURS_SUMMARY_EXAMPLE = {
  today: '2026-05-15',
  range: '1w',
  cards: [
    {
      key: 'daily',
      label: 'Daily',
      windowDays: 1,
      hours: 6.4,
      limit: 8,
      remaining: 1.6,
      percentage: 80,
      status: 'warning',
    },
    {
      key: 'weekly',
      label: 'Weekly',
      windowDays: 7,
      hours: 25.2,
      limit: 40,
      remaining: 14.8,
      percentage: 63,
      status: 'safe',
    },
  ],
  chart: {
    windowDays: 7,
    limit: 40,
    max: 45,
    yAxisMax: 45,
    points: [
      {
        date: '2026-05-15',
        value: 25.2,
        isToday: true,
        isFuture: false,
        isPartialWindow: false,
        isOverLimit: false,
      },
      {
        date: '2026-05-18',
        value: 42.8,
        isToday: false,
        isFuture: true,
        isPartialWindow: false,
        isOverLimit: true,
      },
    ],
  },
};
