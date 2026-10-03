<script setup lang="ts">
import CalendarSkeleton from './_components/CalendarSkeleton.vue';
import ScheduleCalendar from './_containers/ScheduleCalendar.vue';
import { useSchedules } from './_composables/useSchedules';

useHead({ title: 'Schedule · Susi Air Pilot' });

const { current, today, profileError, retryProfile, previous, next } = useMonthQuery();
const { schedule, errorMessage, isCurrentMonth, refresh } = useSchedules(current, {
  prefetchAdjacent: true,
});

const loading = computed(() => !isCurrentMonth.value);
</script>

<template>
  <div class="schedule-page">
    <PageHeader title="Schedule" :subtitle="today ? `Today · ${formatDate(today)}` : undefined" />

    <div class="body">
      <ScheduleCalendar
        v-if="current"
        :month="current"
        :today="today"
        :schedule="isCurrentMonth ? schedule : null"
        :loading="loading && !errorMessage"
        :error-message="errorMessage"
        @previous="previous"
        @next="next"
        @retry="refresh()"
      />
      <BaseCard v-else-if="profileError">
        <ErrorState :message="profileError" @retry="retryProfile" />
      </BaseCard>
      <CalendarSkeleton v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
.schedule-page {
  .body {
    padding: 0 $space-4;
    @include page-width;
  }

  @media (min-width: 768px) {
    .body {
      padding-inline: 0;
    }
  }
}
</style>
