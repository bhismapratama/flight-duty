<script setup lang="ts">
import type { FlightLogHighlights } from '../_composables/useFlightLog';

const props = defineProps<{ highlights: FlightLogHighlights }>();

const items = computed(() => {
  const { averagePerFlyingDay, busiestDay, restDays, longestStreak } = props.highlights;
  return [
    {
      label: 'Average',
      value: `${formatHours(averagePerFlyingDay)} h`,
      note: 'per flying day',
    },
    {
      label: 'Busiest day',
      value: busiestDay ? `${formatHours(busiestDay.hours)} h` : '–',
      note: busiestDay ? formatShortDate(busiestDay.date) : 'No flights',
    },
    {
      label: 'Rest days',
      value: String(restDays),
      note: 'without flying',
    },
    {
      label: 'Longest streak',
      value: pluralize(longestStreak, 'day'),
      note: 'flying in a row',
    },
  ];
});
</script>

<template>
  <section class="flight-log-highlights" aria-labelledby="flight-log-highlights-title">
    <h3 id="flight-log-highlights-title" class="title">Highlights</h3>
    <dl class="grid">
      <div v-for="item in items" :key="item.label" class="item">
        <dt>{{ item.label }}</dt>
        <dd>
          <span class="value">{{ item.value }}</span>
          <span class="note">{{ item.note }}</span>
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="scss">
.flight-log-highlights {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .title {
    @include eyebrow;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0;
  }

  .item {
    padding: $space-3 0;

    &:nth-child(odd) {
      padding-right: $space-3;
    }

    &:nth-child(even) {
      padding-left: $space-3;
      border-left: 1px solid $color-border;
    }

    &:nth-child(n + 3) {
      border-top: 1px solid $color-border;
    }

    &:nth-child(-n + 2) {
      padding-top: 0;
    }

    &:nth-child(n + 3) {
      padding-bottom: 0;
    }

    dt {
      font-size: 0.75rem;
      color: $color-text-secondary;
    }

    dd {
      display: flex;
      flex-direction: column;
      margin: 2px 0 0;
    }
  }

  .value {
    font-size: 1.125rem;
    @include numeric;
  }

  .note {
    font-size: 0.6875rem;
    color: $color-text-secondary;
  }
}
</style>
