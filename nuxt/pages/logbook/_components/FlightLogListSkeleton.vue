<script setup lang="ts">
import FlightLogItemSkeleton from './FlightLogItemSkeleton.vue';

const BAR_WIDTHS = ['72%', '48%', '86%', '60%', '78%'];
</script>

<template>
  <div class="flight-log-list-skeleton" aria-hidden="true">
    <FlightLogItemSkeleton v-for="width in BAR_WIDTHS" :key="width" :bar-width="width" />
  </div>
</template>

<style scoped lang="scss">
.flight-log-list-skeleton {
  margin: -$space-1 0;
}
</style>
