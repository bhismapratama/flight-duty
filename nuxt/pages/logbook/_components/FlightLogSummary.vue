<script setup lang="ts">
import type { FlightLogTotals } from '../_composables/useFlightLog';

defineProps<{ totalHours: number; totals: FlightLogTotals }>();
</script>

<template>
  <div class="flight-log-summary">
    <div class="total">
      <p class="label">Total this month</p>
      <p class="value">{{ formatHours(totalHours) }}<span class="unit">h</span></p>
    </div>
    <dl class="stats">
      <div class="stat">
        <dt>Flown</dt>
        <dd>{{ formatHours(totals.flown) }} h</dd>
      </div>
      <div class="stat">
        <dt>Planned</dt>
        <dd>{{ formatHours(totals.planned) }} h</dd>
      </div>
      <div class="stat">
        <dt>Flying days</dt>
        <dd>{{ totals.flyingDays }}</dd>
      </div>
    </dl>
  </div>
</template>

<style scoped lang="scss">
.flight-log-summary {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  .label {
    @include eyebrow;
  }

  .value {
    margin-top: $space-1;
    font-size: 2rem;
    line-height: 1.1;
    @include numeric;
  }

  .unit {
    margin-left: 3px;
    font-size: 0.9375rem;
    font-weight: 700;
    color: $color-text-secondary;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0;
    border-top: 1px solid $color-border;
  }

  .stat {
    padding: $space-3 $space-3 0;

    &:first-child {
      padding-left: 0;
    }

    & + .stat {
      border-left: 1px solid $color-border;
    }

    dt {
      font-size: 0.75rem;
      color: $color-text-secondary;
    }

    dd {
      margin: 2px 0 0;
      font-size: 1rem;
      @include numeric;
    }
  }
}
</style>
