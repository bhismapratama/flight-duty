import type { MonthSchedule } from '~/types/entities/schedule';

export function useSchedules(current: Ref<YearMonth | null>) {
  const api = useApi();

  const { data, status, error, refresh } = useAsyncData(
    'schedules',
    () =>
      current.value
        ? api<MonthSchedule>('/schedules', {
            query: { year: current.value.year, month: current.value.month },
          })
        : Promise.resolve(null),
    { watch: [current] },
  );

  const errorMessage = computed(() => (error.value ? getErrorMessage(error.value) : null));

  const isCurrentMonth = computed(
    () =>
      Boolean(data.value && current.value) &&
      data.value!.year === current.value!.year &&
      data.value!.month === current.value!.month,
  );

  return { schedule: data, status, errorMessage, isCurrentMonth, refresh };
}
