export function useCalendarMonth() {
  const route = useRoute();
  const router = useRouter();
  const pilot = usePilotStore();

  onMounted(() => {
    pilot.fetchProfile();
  });

  const current = computed<YearMonth | null>(() => {
    const fromQuery = parseYearMonth(route.query.month);
    if (fromQuery) {
      return fromQuery;
    }
    return pilot.today ? yearMonthOf(pilot.today) : null;
  });

  function shift(delta: number): void {
    if (!current.value) {
      return;
    }
    router.replace({
      query: { ...route.query, month: formatYearMonth(addMonths(current.value, delta)) },
    });
  }

  return {
    current,
    today: computed(() => pilot.today),
    profileError: computed(() => (pilot.status === 'error' ? pilot.errorMessage : null)),
    retryProfile: () => pilot.fetchProfile(true),
    previous: () => shift(-1),
    next: () => shift(1),
  };
}
