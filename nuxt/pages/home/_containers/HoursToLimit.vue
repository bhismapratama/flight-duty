<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue';
import { RANGE_OPTIONS } from '~/constants/ranges';
import LimitCard from '../_components/LimitCard.vue';
import RollingSumChart from '../_components/RollingSumChart.vue';
import { useFlightSummary } from '../_composables/useFlightSummary';

const { range, summary, status, errorMessage, refresh } = useFlightSummary();

const isRefreshing = computed(() => status.value === 'pending' && Boolean(summary.value));

const limitNotice = computed(() => {
  const chart = summary.value?.chart;
  const firstOver = chart?.points.find(point => point.isOverLimit);
  if (!chart || !firstOver) {
    return null;
  }
  const date = formatShortDate(firstOver.date);
  return firstOver.isFuture
    ? `Projected to exceed the ${chart.limit} h limit from ${date}.`
    : `Above the ${chart.limit} h limit on ${date}.`;
});
</script>

<template>
  <section class="hours-to-limit" aria-labelledby="hours-to-limit-title">
    <header class="header">
      <h2 id="hours-to-limit-title" class="title">Hours to Limit</h2>
      <p v-if="summary" class="meta">As of {{ formatDate(summary.today) }}</p>
    </header>

    <ErrorState v-if="!summary && status === 'error'" :message="errorMessage" @retry="refresh()" />

    <template v-else>
      <div class="cards">
        <template v-if="summary">
          <LimitCard v-for="card in summary.cards" :key="card.key" :card="card" />
        </template>
        <template v-else>
          <BaseSkeleton v-for="index in 4" :key="index" height="128px" radius="16px" />
        </template>
      </div>

      <BaseCard class="chart">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Rolling flight hours</h3>
            <p class="chart-subtitle">
              {{ summary ? `Sum of the last ${summary.chart.windowDays} days` : 'Loading…' }}
            </p>
          </div>
        </div>

        <SegmentedControl v-model="range" :options="RANGE_OPTIONS" label="Rolling sum range" />

        <RollingSumChart v-if="summary" :chart="summary.chart" :loading="isRefreshing" />
        <BaseSkeleton v-else height="252px" radius="12px" />

        <p v-if="limitNotice" class="notice" role="status">
          <TriangleAlert :size="16" aria-hidden="true" />
          {{ limitNotice }}
        </p>

        <ErrorState
          v-if="summary && status === 'error'"
          compact
          :message="errorMessage"
          @retry="refresh()"
        />
      </BaseCard>
    </template>
  </section>
</template>

<style scoped lang="scss">
.hours-to-limit {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: $space-2;
  }

  .title {
    @include section-title;
  }

  .meta {
    font-size: 0.75rem;
    color: $color-text-secondary;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-3;
  }

  .chart {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  .chart-title {
    font-size: 0.95rem;
    font-weight: 700;
  }

  .chart-subtitle {
    font-size: 0.75rem;
    color: $color-text-secondary;
  }

  .notice {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    border-radius: $radius-md;
    background: rgba($color-danger, 0.08);
    color: $color-danger;
    font-size: 0.8rem;
    font-weight: 600;
  }
}
</style>
