<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

defineProps<{ label: string; disabled?: boolean }>();

defineEmits<{ previous: []; next: [] }>();
</script>

<template>
  <div class="month-switcher">
    <button
      type="button"
      class="nav"
      aria-label="Previous month"
      :disabled="disabled"
      @click="$emit('previous')"
    >
      <ChevronLeft :size="20" aria-hidden="true" />
    </button>
    <h2 class="label" aria-live="polite">{{ label }}</h2>
    <button
      type="button"
      class="nav"
      aria-label="Next month"
      :disabled="disabled"
      @click="$emit('next')"
    >
      <ChevronRight :size="20" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.month-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;

  .label {
    font-size: 1.0625rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .nav {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid $color-border;
    border-radius: 50%;
    background: $color-surface;
    color: $color-navy;
    transition: border-color $transition-fast;

    &:hover:not(:disabled) {
      border-color: rgba($color-navy, 0.25);
    }

    &:disabled {
      opacity: 0.4;
    }
  }
}
</style>
