<script setup lang="ts">
import type { DailyHours } from '~/types/entities/flight-hours';

const props = defineProps<{
  days: DailyHours[];
  today: string;
  maxHours: number;
  summary: string;
}>();

const AXIS_DAYS = [1, 8, 15, 22, 29];

const bars = computed(() =>
  props.days.map(day => ({
    date: day.date,
    day: dayOfMonth(day.date),
    height:
      day.hours > 0 && props.maxHours > 0
        ? `${Math.max((day.hours / props.maxHours) * 100, 8)}%`
        : undefined,
    title: `${formatShortDate(day.date)} · ${formatHours(day.hours)} h`,
    isToday: day.date === props.today,
    isPlanned: day.isFuture && day.hours > 0,
    isRest: day.hours === 0,
  })),
);
</script>

<template>
  <section class="month-activity" aria-labelledby="month-activity-title">
    <header class="header">
      <h3 id="month-activity-title" class="title">Month activity</h3>
      <ul class="legend" aria-hidden="true">
        <li><span class="key" />Flown</li>
        <li><span class="key is-planned" />Planned</li>
      </ul>
    </header>

    <div class="chart" role="img" :aria-label="summary">
      <span
        v-for="bar in bars"
        :key="bar.date"
        class="bar"
        :class="{
          'is-today': bar.isToday,
          'is-planned': bar.isPlanned,
          'is-rest': bar.isRest,
        }"
        :style="bar.height ? { height: bar.height } : undefined"
        :title="bar.title"
      />
    </div>

    <div class="axis" aria-hidden="true">
      <span v-for="bar in bars" :key="bar.date">{{
        AXIS_DAYS.includes(bar.day) ? bar.day : ''
      }}</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.month-activity {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
  }

  .title {
    @include eyebrow;
  }

  .legend {
    display: flex;
    gap: $space-3;
    font-size: 0.6875rem;
    color: $color-text-secondary;

    li {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
  }

  .key {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: $color-chart;

    &.is-planned {
      background: rgba($color-chart, 0.35);
      outline: 1px dashed $color-chart;
      outline-offset: -1px;
    }
  }

  .chart,
  .axis {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 3px;
  }

  .chart {
    align-items: end;
    height: 88px;
    padding-bottom: 1px;
    border-bottom: 1px solid $color-border;
  }

  .bar {
    height: 3px;
    border-radius: 3px 3px 1px 1px;
    background: $color-chart;
    transition: height 300ms ease;

    &.is-planned {
      background: repeating-linear-gradient(
        180deg,
        $color-chart 0 3px,
        rgba($color-chart, 0.35) 3px 6px
      );
    }

    &.is-rest {
      background: $color-muted;
    }

    &.is-today {
      background: $color-navy;
    }
  }

  .axis {
    font-size: 0.625rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: center;
    color: $color-text-secondary;

    span {
      overflow: visible;
      white-space: nowrap;
    }
  }
}
</style>
