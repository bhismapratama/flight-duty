<script setup lang="ts">
const BAR_HEIGHTS = [34, 34, 38, 28, 36, 50, 56, 58, 64, 70, 82, 86, 88, 84, 76];
</script>

<template>
  <div class="chart-skeleton" aria-hidden="true">
    <div class="plot">
      <BaseSkeleton
        v-for="(height, index) in BAR_HEIGHTS"
        :key="index"
        class="bar"
        :height="`${height}%`"
        radius="6px 6px 2px 2px"
        :style="{ animationDelay: `${index * 60}ms` }"
      />
    </div>
    <div class="legend">
      <BaseSkeleton v-for="index in 3" :key="index" width="64px" height="10px" radius="4px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  .plot {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 220px;
    padding: 0 0 $space-2 $space-6;
    border-bottom: 1px solid $color-border;
  }

  .bar {
    flex: 1;
    transform-origin: bottom;
    animation: chart-skeleton-wave 1.6s ease-in-out infinite;
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: $space-4;
  }
}

@keyframes chart-skeleton-wave {
  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.82);
  }
}
</style>
