<script setup lang="ts">
withDefaults(defineProps<{ barWidth?: string }>(), { barWidth: '70%' });
</script>

<template>
  <div class="flight-log-item-skeleton" aria-hidden="true">
    <BaseSkeleton width="44px" height="44px" radius="12px" />
    <div class="body">
      <BaseSkeleton width="56px" height="11px" radius="4px" />
      <BaseSkeleton :width="barWidth" height="4px" radius="999px" />
    </div>
    <BaseSkeleton width="44px" height="16px" radius="4px" />
  </div>
</template>

<style scoped lang="scss">
.flight-log-item-skeleton {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 0;

  & + & {
    border-top: 1px solid $color-border;
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: $space-2;
    min-width: 0;
  }
}
</style>
