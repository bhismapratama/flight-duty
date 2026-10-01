<script setup lang="ts">
import ScheduleCalendar from './_containers/ScheduleCalendar.vue';
import { useCalendarMonth } from './_composables/useCalendarMonth';
import { useSchedules } from './_composables/useSchedules';

useHead({ title: 'Schedule · Susi Air Pilot' });

const { current, today, profileError, retryProfile, previous, next } = useCalendarMonth();
const { schedule, status, errorMessage, isCurrentMonth, refresh } = useSchedules(current);

const loading = computed(() => status.value === 'pending' || !isCurrentMonth.value);
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
      <BaseSkeleton v-else height="420px" radius="16px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.schedule-page {
  .body {
    padding: 0 $space-4;
  }
}
</style>
