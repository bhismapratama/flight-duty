<script setup lang="ts">
import { Check } from '@lucide/vue';
import type { DutyLegend } from '~/types/entities/schedule';

defineProps<{ legend: DutyLegend[] }>();
</script>

<template>
  <section class="duty-legend" aria-labelledby="duty-legend-title">
    <h3 id="duty-legend-title" class="title">Legend</h3>
    <ul class="list">
      <li v-for="item in legend" :key="item.code" class="item">
        <span class="swatch" :style="{ backgroundColor: item.color }" aria-hidden="true" />
        <span class="code">{{ item.code }}</span>
        <span class="label">{{ item.label }}</span>
      </li>
    </ul>
    <ul class="status">
      <li class="item">
        <span class="chip is-done" aria-hidden="true">
          <Check :size="10" :stroke-width="3.5" />
        </span>
        <span class="label">All duties logged</span>
      </li>
      <li class="item">
        <span class="chip" aria-hidden="true">2</span>
        <span class="label">Duties left to log</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.duty-legend {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .title {
    font-size: 0.8rem;
    font-weight: 700;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-2 $space-3;
  }

  .status {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2 $space-4;
    padding-top: $space-3;
    border-top: 1px solid $color-border;
  }

  .item {
    display: flex;
    align-items: center;
    gap: $space-2;
    min-width: 0;
    font-size: 0.78rem;
  }

  .swatch {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    border-radius: 4px;
  }

  .code {
    font-weight: 800;
    font-size: 0.75rem;
  }

  .label {
    line-height: 1.25;
    color: $color-text-secondary;
  }

  .chip {
    display: grid;
    place-items: center;
    min-width: 16px;
    height: 16px;
    border-radius: $radius-pill;
    background: $color-navy;
    color: $color-surface;
    font-size: 0.6rem;
    font-weight: 800;

    &.is-done {
      background: $color-success;
    }
  }
}
</style>
