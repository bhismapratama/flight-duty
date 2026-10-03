<script setup lang="ts">
import FlightLogListSkeleton from './_components/FlightLogListSkeleton.vue';
import FlightLogSummarySkeleton from './_components/FlightLogSummarySkeleton.vue';
import FlightLog from './_containers/FlightLog.vue';
import { useFlightLog } from './_composables/useFlightLog';

useHead({ title: 'Logbook · Susi Air Pilot' });

const { current, profileError, retryProfile, previous, next } = useMonthQuery();
const { log, entries, totals, maxHours, highlights, errorMessage, isCurrentMonth, refresh } =
  useFlightLog(current);

const loading = computed(() => !isCurrentMonth.value);
</script>

<template>
  <div class="logbook-page">
    <PageHeader title="Logbook" subtitle="Daily flight hours" wide />

    <div class="body">
      <FlightLog
        v-if="current"
        :month="current"
        :log="log ?? null"
        :entries="entries"
        :totals="totals"
        :highlights="highlights"
        :max-hours="maxHours"
        :loading="loading && !errorMessage"
        :error-message="errorMessage"
        @previous="previous"
        @next="next"
        @retry="refresh()"
      />
      <BaseCard v-else-if="profileError">
        <ErrorState :message="profileError" @retry="retryProfile" />
      </BaseCard>
      <div v-else class="loading" aria-busy="true">
        <BaseCard><FlightLogSummarySkeleton /></BaseCard>
        <BaseCard><FlightLogListSkeleton /></BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logbook-page {
  .body {
    padding: 0 $space-4;
    @include page-width;
  }

  .loading {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  @media (min-width: 768px) {
    .body {
      padding-inline: 0;
    }
  }

  @media (min-width: 1024px) {
    .body {
      max-width: $app-max-width;
    }
  }
}
</style>
