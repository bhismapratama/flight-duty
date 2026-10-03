<script setup lang="ts">
export interface DetailItem {
  label: string;
  value: string;
}

defineProps<{ items: DetailItem[] }>();
</script>

<template>
  <dl class="detail-list">
    <div v-for="item in items" :key="item.label" class="row">
      <dt class="label">{{ item.label }}</dt>
      <dd class="value">{{ item.value }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.detail-list {
  margin: -$space-1 0;

  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-3 0;

    & + .row {
      border-top: 1px solid $color-border;
    }
  }

  .label {
    font-size: 0.875rem;
    color: $color-text-secondary;
  }

  .value {
    margin: 0;
    min-width: 0;
    text-align: right;
    font-size: 0.875rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
}
</style>
