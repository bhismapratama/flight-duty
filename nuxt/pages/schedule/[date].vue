<script setup lang="ts">
import { CalendarClock } from '@lucide/vue';

definePageMeta({
  validate: route => isIsoDate(route.params.date),
});

const route = useRoute();
const date = computed(() => String(route.params.date));
const backTo = computed(() => ({
  path: '/schedule',
  query: { month: formatYearMonth(yearMonthOf(date.value)) },
}));

useHead({ title: () => `${formatDate(date.value)} · Schedule` });
</script>

<template>
  <div class="schedule-detail">
    <PageHeader title="Duty Detail" :subtitle="formatLongDate(date)" :back="backTo" />
    <div class="body">
      <ComingSoon
        :icon="CalendarClock"
        title="Detail page coming soon"
        description="Flight-by-flight details for this day will be available in a future release."
      >
        <NuxtLink :to="backTo" class="link">Back to calendar</NuxtLink>
      </ComingSoon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.schedule-detail {
  .body {
    padding: 0 $space-4;
  }

  .link {
    margin-top: $space-4;
    font-weight: 700;
    color: $color-red;
  }
}
</style>
