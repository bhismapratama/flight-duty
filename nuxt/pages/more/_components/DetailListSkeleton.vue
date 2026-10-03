<script setup lang="ts">
defineProps<{ rows: number }>();
</script>

<template>
  <div class="detail-list-skeleton" aria-hidden="true">
    <div v-for="index in rows" :key="index" class="row">
      <BaseSkeleton :width="`${28 + ((index * 13) % 18)}%`" height="11px" radius="4px" />
      <BaseSkeleton :width="`${18 + ((index * 7) % 12)}%`" height="11px" radius="4px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-list-skeleton {
  margin: -$space-1 0;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: 15px 0;

    & + .row {
      border-top: 1px solid $color-border;
    }
  }
}
</style>
