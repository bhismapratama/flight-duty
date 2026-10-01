<script setup lang="ts">
import type { LimitCard, LimitStatus } from '~/types/entities/flight-hours';

const props = defineProps<{ card: LimitCard }>();

const TONES: Record<LimitStatus, 'success' | 'warning' | 'danger'> = {
  safe: 'success',
  warning: 'warning',
  exceeded: 'danger',
};

const WINDOW_LABELS: Record<number, string> = {
  1: 'Today',
  7: 'Last 7 days',
  30: 'Last 30 days',
  365: 'Last 365 days',
};

const tone = computed(() => TONES[props.card.status]);
const windowLabel = computed(
  () => WINDOW_LABELS[props.card.windowDays] ?? `Last ${props.card.windowDays} days`,
);
const remainingLabel = computed(() =>
  props.card.status === 'exceeded'
    ? `${formatHours(props.card.hours - props.card.limit)} h over`
    : `${formatHours(props.card.remaining)} h left`,
);
</script>

<template>
  <article class="limit-card" :class="`is-${tone}`">
    <header class="header">
      <h3 class="title">{{ card.label }}</h3>
      <span class="percentage">{{ Math.round(card.percentage) }}%</span>
    </header>
    <p class="value">
      <span class="hours">{{ formatHours(card.hours) }}</span>
      <span class="limit">/ {{ card.limit.toLocaleString('en-US') }} h</span>
    </p>
    <ProgressBar :value="card.percentage" :tone="tone" :label="`${card.label} limit used`" />
    <footer class="footer">
      <span>{{ windowLabel }}</span>
      <span class="remaining">{{ remainingLabel }}</span>
    </footer>
  </article>
</template>

<style scoped lang="scss">
@use 'sass:color';

$tones: (
  success: $color-success,
  warning: $color-warning,
  danger: $color-danger,
);

.limit-card {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-4;
  @include card;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 0.8rem;
    font-weight: 700;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .percentage {
    font-size: 0.75rem;
    font-weight: 800;
  }

  .value {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: $space-1;
  }

  .hours {
    font-size: clamp(1.3rem, 6vw, 1.6rem);
    line-height: 1.1;
    @include numeric;
  }

  .limit {
    white-space: nowrap;
    font-size: 0.8rem;
    font-weight: 600;
    color: $color-text-secondary;
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: $space-1;
    font-size: 0.7rem;
    color: $color-text-secondary;
  }

  .remaining {
    font-weight: 700;
  }

  @each $name, $color in $tones {
    &.is-#{$name} .percentage,
    &.is-#{$name} .remaining {
      color: color.adjust($color, $lightness: -10%);
    }
  }
}
</style>
