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
  display: block;
  background: linear-gradient(90deg, $color-muted 0%, $color-muted-light 50%, $color-muted 100%);
  background-size: 200% 100%;
  animation: base-skeleton-shimmer 1.2s ease-in-out infinite;
}

@keyframes base-skeleton-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
