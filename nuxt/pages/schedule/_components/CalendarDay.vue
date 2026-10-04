<script setup lang="ts">
import { Check } from '@lucide/vue';
import { ROUTES } from '~/constants/routes';
import type { ScheduleEntry } from '~/types/entities/schedule';

const props = defineProps<{
  date: string;
  day: number;
  entry?: ScheduleEntry;
  isToday: boolean;
}>();

const style = computed(() =>
  props.entry
    ? { backgroundColor: props.entry.base_color, color: readableTextOn(props.entry.base_color) }
    : undefined,
);

const ariaLabel = computed(() => {
  const parts = [formatLongDate(props.date)];
  if (props.isToday) {
    parts.push('today');
  }
  if (props.entry) {
    parts.push(`${props.entry.duty_type} at ${props.entry.base_name}`);
    parts.push(
      props.entry.is_complete
        ? 'all duties logged'
        : `${pluralize(props.entry.remaining, 'duty', 'duties')} left to log`,
    );
  }
  return parts.join(', ');
});
</script>

<template>
  <NuxtLink
    :to="`${ROUTES.schedule}/${date}`"
    class="calendar-day"
    :class="{ 'is-duty': entry, 'is-today': isToday }"
    :style="style"
    :aria-label="ariaLabel"
  >
    <span class="number">{{ day }}</span>
    <template v-if="entry">
      <span v-if="entry.is_complete" class="indicator is-done" aria-hidden="true">
        <Check :size="10" :stroke-width="3.5" />
      </span>
      <span v-else class="indicator" aria-hidden="true">{{ entry.remaining }}</span>
      <span class="base">{{ entry.base_name }}</span>
    </template>
  </NuxtLink>
</template>

<style scoped lang="scss">
@use 'sass:color';

.calendar-day {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  min-height: 52px;
  padding: 6px 5px 5px;
  border-radius: 10px;
  color: $color-text;
  transition: transform $transition-fast;

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    z-index: 1;
    outline-offset: 2px;
  }

  .number {
    font-size: 0.8125rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &:not(&.is-duty) {
    align-items: center;
    justify-content: center;
    background: $color-bg;
  }

  &:not(&.is-duty) .number {
    font-weight: 600;
    color: $color-text-secondary;
  }

  .base {
    overflow: hidden;
    font-size: 0.5625rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1;
    text-overflow: clip;
    white-space: nowrap;
    opacity: 0.9;
  }

  .indicator {
    position: absolute;
    top: 4px;
    right: 4px;
    display: grid;
    place-items: center;
    min-width: 15px;
    height: 15px;
    padding: 0 3px;
    border-radius: $radius-pill;
    background: $color-surface;
    color: $color-navy;
    font-size: 0.5625rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;

    &.is-done {
      color: color.adjust($color-success, $lightness: -12%);
    }
  }

  &.is-today {
    box-shadow:
      0 0 0 2px $color-surface,
      0 0 0 4px $color-navy;
  }

  &.is-today:not(&.is-duty) .number {
    color: $color-navy;
    font-weight: 800;
  }

  @media (min-width: 400px) {
    min-height: 58px;
    padding: 7px 6px 6px;

    .number {
      font-size: 0.875rem;
    }
  }

  @media (min-width: 768px) {
    min-height: 76px;
    padding: 10px;
    border-radius: $radius-md;

    .number {
      font-size: 1rem;
    }

    .base {
      font-size: 0.6875rem;
    }

    .indicator {
      top: 8px;
      right: 8px;
      min-width: 18px;
      height: 18px;
      font-size: 0.625rem;
    }
  }
}
</style>
