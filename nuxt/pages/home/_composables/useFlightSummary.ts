import { DEFAULT_RANGE } from '~/constants/ranges';
import type { FlightHoursSummary, SummaryRange } from '~/types/entities/flight-hours';

export function useFlightSummary() {
  const api = useApi();
  const range = ref<SummaryRange>(DEFAULT_RANGE);

  const { data, status, error, refresh } = useAsyncData(
    'flight-hours-summary',
    () => api<FlightHoursSummary>('/flight-hours/summary', { query: { range: range.value } }),
    { watch: [range] },
  );

  const errorMessage = computed(() => (error.value ? getErrorMessage(error.value) : null));

  return { range, summary: data, status, errorMessage, refresh };
}
