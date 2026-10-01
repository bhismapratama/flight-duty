<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

defineProps<{ label: string; disabled?: boolean }>();

defineEmits<{ previous: []; next: [] }>();
</script>

<template>
  <div class="calendar-header">
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
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;

  .label {
    font-size: 1rem;
    font-weight: 800;
  }

  .nav {
    display: grid;
    place-items: center;
    width: $tap-target;
    height: $tap-target;
    border-radius: 50%;
    background: $color-muted;
    color: $color-navy;
    transition: background-color $transition-fast;

    &:hover:not(:disabled) {
      background: $color-border;
    }

    &:disabled {
      opacity: 0.4;
    }
  }
}
</style>
