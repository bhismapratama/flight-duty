<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; radius?: string }>(), {
  width: '100%',
  height: '16px',
  radius: '8px',
});
</script>

<template>
  <span class="base-skeleton" :style="{ width, height, borderRadius: radius }" aria-hidden="true" />
</template>

<style scoped lang="scss">
.base-skeleton {
  position: relative;
  display: block;
  flex-shrink: 0;
  overflow: hidden;
  background: $color-skeleton;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba($color-surface, 0.65) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: base-skeleton-shimmer 1.4s ease-in-out infinite;
  }
}

@keyframes base-skeleton-shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
