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
    width: 52px;
    height: 52px;
    margin-bottom: $space-2;
    border-radius: 50%;
    background: $color-muted;
    color: $color-navy;
  }

  .title {
    font-weight: 700;
  }

  .description {
    max-width: 280px;
    font-size: 0.875rem;
    color: $color-text-secondary;
  }
}
</style>
