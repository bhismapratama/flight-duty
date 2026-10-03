<script setup lang="ts">
import { CalendarX } from '@lucide/vue';
import type { MonthSchedule, ScheduleEntry } from '~/types/entities/schedule';
import CalendarDay from '../_components/CalendarDay.vue';
import DutyLegend from '../_components/DutyLegend.vue';

const props = defineProps<{
  month: YearMonth;
  today: string | null;
  schedule: MonthSchedule | null;
  loading: boolean;
  errorMessage: string | null;
}>();

defineEmits<{ previous: []; next: []; retry: [] }>();

const cells = computed(() => buildMonthGrid(props.month));

const entriesByDate = computed(() => {
  const map = new Map<string, ScheduleEntry>();
  for (const entry of props.schedule?.items ?? []) {
    map.set(entry.duty_date, entry);
  }
  return map;
});

const isEmpty = computed(
  () => !props.loading && props.schedule && props.schedule.items.length === 0,
);
</script>

<template>
  <div class="schedule-calendar">
    <BaseCard class="card">
      <MonthSwitcher
        :label="formatMonth(month)"
        @previous="$emit('previous')"
        @next="$emit('next')"
      />

      <div class="grid-wrapper" :aria-busy="loading">
        <div class="weekdays" aria-hidden="true">
          <span v-for="label in WEEKDAY_LABELS" :key="label">{{ label }}</span>
        </div>
        <div class="grid" :class="{ 'is-loading': loading }">
          <template v-for="cell in cells" :key="cell.key">
            <CalendarDay
              v-if="cell.date && cell.day"
              :date="cell.date"
              :day="cell.day"
              :entry="entriesByDate.get(cell.date)"
              :is-today="cell.date === today"
            />
            <span v-else class="blank" aria-hidden="true" />
          </template>
        </div>
      </div>

      <ErrorState v-if="errorMessage" compact :message="errorMessage" @retry="$emit('retry')" />
      <EmptyState
        v-else-if="isEmpty"
        :icon="CalendarX"
        title="No duties this month"
        description="Nothing is rostered for this month yet."
      />
    </BaseCard>

    <BaseCard v-if="schedule?.legend.length">
      <DutyLegend :legend="schedule.legend" />
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.schedule-calendar {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .card {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    padding: $space-4 $space-3;
  }

  .weekdays,
  .grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 5px;
  }

  .weekdays {
    margin-bottom: $space-2;
    text-align: center;
    @include eyebrow;
    letter-spacing: 0.04em;
  }

  .grid.is-loading {
    pointer-events: none;

    :deep(.calendar-day) {
      background-color: $color-skeleton !important;
      color: transparent;
      animation: schedule-calendar-pulse 1.4s ease-in-out infinite;

      > * {
        visibility: hidden;
      }
    }

    @for $column from 1 through 7 {
      > :nth-child(7n + #{$column}) {
        animation-delay: ($column - 1) * 90ms;
      }
    }
  }

  @media (min-width: 400px) {
    .card {
      padding: $space-4;
    }

    .weekdays,
    .grid {
      gap: 6px;
    }
  }

  @media (min-width: 768px) {
    .card {
      gap: $space-5;
      padding: $space-6;
    }

    .weekdays,
    .grid {
      gap: $space-2;
    }
  }
}

@keyframes schedule-calendar-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
