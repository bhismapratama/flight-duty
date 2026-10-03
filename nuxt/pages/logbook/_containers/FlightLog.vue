<script setup lang="ts">
import { PlaneLanding } from '@lucide/vue';
import type { DailyHours, FlightHoursRange } from '~/types/entities/flight-hours';
import FlightLogCompactBar from '../_components/FlightLogCompactBar.vue';
import FlightLogHighlights from '../_components/FlightLogHighlights.vue';
import FlightLogItem from '../_components/FlightLogItem.vue';
import FlightLogListSkeleton from '../_components/FlightLogListSkeleton.vue';
import FlightLogSummary from '../_components/FlightLogSummary.vue';
import FlightLogSummarySkeleton from '../_components/FlightLogSummarySkeleton.vue';
import MonthActivity from '../_components/MonthActivity.vue';
import { useCompactBar } from '../_composables/useCompactBar';
import type {
  FlightLogHighlights as Highlights,
  FlightLogTotals,
} from '../_composables/useFlightLog';

const props = defineProps<{
  month: YearMonth;
  log: FlightHoursRange | null;
  entries: DailyHours[];
  totals: FlightLogTotals;
  highlights: Highlights;
  maxHours: number;
  loading: boolean;
  errorMessage: string | null;
}>();

defineEmits<{ previous: []; next: []; retry: [] }>();

const asideRef = useTemplateRef<HTMLElement>('aside');
const { visible: compactVisible, offset: compactOffset } = useCompactBar(asideRef);

const activitySummary = computed(
  () =>
    `${formatMonth(props.month)}: ${pluralize(props.totals.flyingDays, 'flying day')}, ${formatHours(props.log?.totalHours ?? 0)} hours in total`,
);
</script>

<template>
  <div class="flight-log">
    <div ref="aside" class="aside">
      <BaseCard class="card">
        <MonthSwitcher
          :label="formatMonth(month)"
          @previous="$emit('previous')"
          @next="$emit('next')"
        />

        <ErrorState v-if="errorMessage" compact :message="errorMessage" @retry="$emit('retry')" />

        <div
          v-else-if="log"
          class="content"
          :class="{ 'is-loading': loading }"
          :aria-busy="loading"
        >
          <FlightLogSummary :total-hours="log.totalHours" :totals="totals" />
        </div>

        <FlightLogSummarySkeleton v-else />
      </BaseCard>

      <template v-if="log && entries.length && !errorMessage">
        <BaseCard :class="{ 'extra is-loading': loading }">
          <MonthActivity
            :days="log.days"
            :today="log.today"
            :max-hours="maxHours"
            :summary="activitySummary"
          />
        </BaseCard>
        <BaseCard :class="{ 'extra is-loading': loading }">
          <FlightLogHighlights :highlights="highlights" />
        </BaseCard>
      </template>
    </div>

    <section v-if="!errorMessage" class="days" aria-labelledby="flight-log-days-title">
      <FlightLogCompactBar
        :label="formatMonth(month)"
        :total-hours="log ? log.totalHours : null"
        :visible="compactVisible"
        :offset="compactOffset"
        @previous="$emit('previous')"
        @next="$emit('next')"
      />
      <h2 id="flight-log-days-title" class="title">Flight days</h2>

      <BaseCard>
        <ul v-if="log && entries.length" class="list" :class="{ 'is-loading': loading }">
          <FlightLogItem
            v-for="entry in entries"
            :key="entry.date"
            :entry="entry"
            :max-hours="maxHours"
            :is-today="entry.date === log.today"
          />
        </ul>

        <EmptyState
          v-else-if="log"
          :icon="PlaneLanding"
          title="No flight hours"
          description="No flights are logged or planned for this month."
        />

        <FlightLogListSkeleton v-else />
      </BaseCard>
    </section>
  </div>
</template>

<style scoped lang="scss">
.flight-log {
  display: flex;
  flex-direction: column;
  gap: $space-6;

  .card {
    display: flex;
    flex-direction: column;
    gap: $space-5;
  }

  .aside {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  .content,
  .extra,
  .list {
    transition: opacity $transition-fast;

    &.is-loading {
      opacity: 0.45;
    }
  }

  .days {
    display: flex;
    flex-direction: column;
    gap: $space-3;

    > .flight-log-compact-bar {
      margin-bottom: -$space-3;
    }
  }

  .title {
    @include section-title;
  }

  .list {
    margin: -$space-1 0;
  }

  @media (min-width: 768px) {
    .card {
      padding: $space-6;
    }
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: minmax(300px, 380px) minmax(0, 1fr);
    align-items: start;
  }

  @media (min-width: 1024px) and (min-height: 780px) {
    .aside {
      position: sticky;
      top: calc(80px + #{safe-inset(top)});
    }
  }
}
</style>
