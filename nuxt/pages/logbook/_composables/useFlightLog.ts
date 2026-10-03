import type { DailyHours, FlightHoursRange } from '~/types/entities/flight-hours';

export interface FlightLogTotals {
  flown: number;
  planned: number;
  flyingDays: number;
}

export interface FlightLogHighlights {
  averagePerFlyingDay: number;
  busiestDay: DailyHours | null;
  restDays: number;
  longestStreak: number;
}

export function useFlightLog(current: Ref<YearMonth | null>) {
  const api = useApi();

  const { data, status, error, refresh } = useAsyncData(
    'flight-log',
    () => {
      if (!current.value) {
        return Promise.resolve(null);
      }
      const { from, to } = monthBounds(current.value);
      return api<FlightHoursRange>('/flight-hours', { query: { from, to } });
    },
    { watch: [current] },
  );

  const errorMessage = computed(() => (error.value ? getErrorMessage(error.value) : null));

  const isCurrentMonth = computed(
    () =>
      Boolean(data.value && current.value) && data.value!.from === monthBounds(current.value!).from,
  );

  const entries = computed(() => (data.value?.days ?? []).filter(day => day.hours > 0));

  const totals = computed<FlightLogTotals>(() =>
    entries.value.reduce(
      (sum, day) => ({
        flown: day.isFuture ? sum.flown : sum.flown + day.hours,
        planned: day.isFuture ? sum.planned + day.hours : sum.planned,
        flyingDays: sum.flyingDays + 1,
      }),
      { flown: 0, planned: 0, flyingDays: 0 },
    ),
  );

  const maxHours = computed(() => Math.max(0, ...entries.value.map(day => day.hours)));

  const highlights = computed<FlightLogHighlights>(() => {
    let busiestDay: DailyHours | null = null;
    let streak = 0;
    let longestStreak = 0;
    let restDays = 0;
    for (const day of data.value?.days ?? []) {
      if (day.hours > 0) {
        streak += 1;
        longestStreak = Math.max(longestStreak, streak);
        if (!busiestDay || day.hours > busiestDay.hours) {
          busiestDay = day;
        }
      } else {
        streak = 0;
        restDays += 1;
      }
    }
    const flyingDays = totals.value.flyingDays;
    return {
      averagePerFlyingDay: flyingDays > 0 ? (data.value?.totalHours ?? 0) / flyingDays : 0,
      busiestDay,
      restDays,
      longestStreak,
    };
  });

  return {
    log: data,
    entries,
    totals,
    maxHours,
    highlights,
    status,
    errorMessage,
    isCurrentMonth,
    refresh,
  };
}
