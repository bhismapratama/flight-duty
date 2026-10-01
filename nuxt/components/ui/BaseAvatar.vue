<script setup lang="ts">
const props = withDefaults(defineProps<{ src?: string | null; name: string; size?: number }>(), {
  src: null,
  size: 48,
});

const failed = ref(false);

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join(''),
);

watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);
</script>

<template>
  <span class="base-avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <img v-if="src && !failed" :src="src" :alt="name" class="image" @error="failed = true" />
    <span v-else class="initials" role="img" :aria-label="name">{{ initials }}</span>
  </span>
</template>

<style scoped lang="scss">
.base-avatar {
  display: inline-flex;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid rgba($color-surface, 0.7);
  background: $color-red;

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    color: $color-surface;
    font-weight: 800;
  }
}
</style>
