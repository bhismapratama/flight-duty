<script setup lang="ts">
import { Check } from '@lucide/vue';
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
    :to="`/schedule/${date}`"
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
.calendar-day {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 5px 2px 4px;
  aspect-ratio: 1 / 1.08;
  min-height: $tap-target;
  border-radius: $radius-md;
  color: $color-text;
  transition: transform $transition-fast;

  &:active {
    transform: scale(0.95);
  }

  .number {
    align-self: flex-start;
    padding-left: 4px;
    font-size: 0.85rem;
    font-weight: 700;
    line-height: 1;
  }

  &:not(&.is-duty) {
    justify-content: center;
  }

  &:not(&.is-duty) .number {
    align-self: center;
    padding-left: 0;
  }

  .base {
    max-width: 100%;
    overflow: hidden;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.04em;
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
    font-size: 0.6rem;
    font-weight: 800;
    box-shadow: 0 1px 2px rgba($color-navy, 0.2);

    &.is-done {
      background: $color-surface;
      color: $color-success;
    }
  }

  &.is-today {
    box-shadow:
      0 0 0 2px $color-bg,
      0 0 0 4px $color-red;
  }

  &.is-today:not(&.is-duty) .number {
    color: $color-red;
  }
}
</style>
