import type { FlightHoursRange } from '~/types/entities/flight-hours';
import { useSchedules } from './useSchedules';

export function useDutyDay(date: Ref<string>) {
  const api = useApi();
  const month = computed<YearMonth | null>(() => yearMonthOf(date.value));

  const schedules = useSchedules(month);

  const hours = useAsyncData(
    'duty-day-hours',
    () => api<FlightHoursRange>('/flight-hours', { query: { from: date.value, to: date.value } }),
    { watch: [date] },
  );

  const entry = computed(() =>
    schedules.isCurrentMonth.value
      ? (schedules.schedule.value?.items.find(item => item.duty_date === date.value) ?? null)
      : null,
  );

  const legend = computed(() =>
    entry.value
      ? (schedules.schedule.value?.legend.find(item => item.code === entry.value!.duty_type) ??
        null)
      : null,
  );

  const day = computed(() =>
    hours.data.value?.from === date.value ? (hours.data.value.days[0] ?? null) : null,
  );

  const ready = computed(() => schedules.isCurrentMonth.value && Boolean(day.value));

  const errorMessage = computed(
    () =>
      schedules.errorMessage.value ??
      (hours.error.value ? getErrorMessage(hours.error.value) : null),
  );

  function refresh(): void {
    schedules.refresh();
    hours.refresh();
  }

  return { entry, legend, day, ready, errorMessage, refresh };
}
