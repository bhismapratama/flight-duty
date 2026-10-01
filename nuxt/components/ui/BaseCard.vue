<script setup lang="ts">
withDefaults(defineProps<{ as?: string; padded?: boolean }>(), {
  as: 'div',
  padded: true,
});
</script>

<template>
  <component :is="as" class="base-card" :class="{ 'is-flush': !padded }">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.base-card {
  @include card;
  padding: $space-4;

  &.is-flush {
    padding: 0;
  }
}
</style>
