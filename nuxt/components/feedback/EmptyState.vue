<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  title: string;
  description?: string;
  icon?: Component;
}>();
</script>

<template>
  <div class="empty-state">
    <span v-if="icon" class="icon" aria-hidden="true">
      <component :is="icon" :size="24" />
    </span>
    <p class="title">{{ title }}</p>
    <p v-if="description" class="description">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  padding: $space-6 $space-4;
  text-align: center;

  .icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    margin-bottom: $space-3;
    border-radius: $radius-lg;
    background: $color-muted;
    color: $color-navy;
  }

  .title {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .description {
    max-width: 300px;
    font-size: 0.875rem;
    line-height: 1.6;
    color: $color-text-secondary;
  }
}
</style>
