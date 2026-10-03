<script setup lang="ts">
import type { DailyHours } from '~/types/entities/flight-hours';

const props = defineProps<{ entry: DailyHours; maxHours: number; isToday: boolean }>();

const width = computed(
  () => `${props.maxHours > 0 ? (props.entry.hours / props.maxHours) * 100 : 0}%`,
);
</script>

<template>
  <li class="flight-log-item" :class="{ 'is-planned': entry.isFuture, 'is-today': isToday }">
    <div class="date">
      <span class="day">{{ dayOfMonth(entry.date) }}</span>
      <span class="weekday">{{ formatWeekday(entry.date) }}</span>
    </div>
    <div class="body">
      <p class="status">
        {{ entry.isFuture ? 'Planned' : 'Flown' }}
        <span v-if="isToday" class="today">Today</span>
      </p>
      <span class="track" aria-hidden="true">
        <span class="bar" :style="{ width }" />
      </span>
    </div>
    <p class="hours">{{ formatHours(entry.hours) }}<span class="unit">h</span></p>
  </li>
</template>

<style scoped lang="scss">
.flight-log-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 0;

  & + & {
    border-top: 1px solid $color-border;
  }

  .date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: $radius-md;
    background: $color-bg;
  }

  .day {
    font-size: 1rem;
    line-height: 1.1;
    @include numeric;
  }

  .weekday {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $color-text-secondary;
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .status {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: 0.8125rem;
    font-weight: 700;
  }

  .today {
    padding: 1px 7px;
    border-radius: $radius-pill;
    background: $color-navy;
    color: $color-surface;
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .track {
    display: block;
    height: 4px;
    border-radius: $radius-pill;
    background: $color-muted;
    overflow: hidden;
  }

  .bar {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: $color-chart;
  }

  .hours {
    flex-shrink: 0;
    min-width: 52px;
    text-align: right;
    font-size: 1.0625rem;
    @include numeric;
  }

  .unit {
    margin-left: 2px;
    font-size: 0.75rem;
    font-weight: 700;
    color: $color-text-secondary;
  }

  &.is-planned .status {
    color: $color-text-secondary;
  }

  &.is-planned .bar {
    background: repeating-linear-gradient(90deg, $color-chart 0 6px, transparent 6px 9px);
  }

  &.is-planned .hours {
    color: $color-text-secondary;
  }

  &.is-today .date {
    background: $color-navy;
    color: $color-surface;
  }

  &.is-today .weekday {
    color: rgba($color-surface, 0.75);
  }
}
</style>
