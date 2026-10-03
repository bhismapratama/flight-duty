import type { MonthSchedule } from '~/types/entities/schedule';

export function useSchedules(
  current: Ref<YearMonth | null>,
  options: { prefetchAdjacent?: boolean } = {},
) {
  const api = useApi();
  const cache = useResponseCache();

  const keyOf = (month: YearMonth) => `schedules:${formatYearMonth(month)}`;

  const fetchMonth = (month: YearMonth) =>
    api<MonthSchedule>('/schedules', { query: { year: month.year, month: month.month } });

  const { status, error, refresh } = useAsyncData(
    'schedules',
    () =>
      current.value
        ? cache.store(keyOf(current.value), () => fetchMonth(current.value!))
        : Promise.resolve(null),
    { watch: [current] },
  );

  const schedule = computed(() =>
    current.value ? (cache.read<MonthSchedule>(keyOf(current.value)) ?? null) : null,
  );

  const errorMessage = computed(() => (error.value ? getErrorMessage(error.value) : null));

  const isCurrentMonth = computed(() => Boolean(schedule.value));

  if (options.prefetchAdjacent) {
    watch(status, value => {
      if (value === 'success' && current.value) {
        for (const month of [addMonths(current.value, -1), addMonths(current.value, 1)]) {
          cache.prefetch(keyOf(month), () => fetchMonth(month));
        }
      }
    });
  }

  return { schedule, status, errorMessage, isCurrentMonth, refresh };
}
