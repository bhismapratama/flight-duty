<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

defineProps<{ label: string; totalHours: number | null; visible: boolean; offset: number }>();

defineEmits<{ previous: []; next: [] }>();
</script>

<template>
  <div
    class="flight-log-compact-bar"
    :class="{ 'is-visible': visible }"
    :style="{ top: `${offset + 8}px` }"
    :inert="!visible"
  >
    <div class="inner">
      <button type="button" class="nav" aria-label="Previous month" @click="$emit('previous')">
        <ChevronLeft :size="18" aria-hidden="true" />
      </button>
      <p class="label">
        <span>{{ label }}</span>
        <template v-if="totalHours !== null">
          <span class="dot" aria-hidden="true" />
          <span class="total">{{ formatHours(totalHours) }} h</span>
        </template>
      </p>
      <button type="button" class="nav" aria-label="Next month" @click="$emit('next')">
        <ChevronRight :size="18" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flight-log-compact-bar {
  position: sticky;
  z-index: 9;
  height: 0;

  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
    height: 52px;
    padding: 0 6px;
    border: 1px solid $color-border;
    border-radius: $radius-pill;
    background: rgba($color-surface, 0.94);
    box-shadow: $shadow-float;
    backdrop-filter: blur(12px);
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    transition:
      opacity $transition-fast,
      transform $transition-fast;
  }

  &.is-visible .inner {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .nav {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: $color-navy;

    &:hover {
      background: $color-muted;
    }
  }

  .label {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: 0.9375rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: $color-text-secondary;
  }

  .total {
    @include numeric;
  }

  @media (min-width: 1024px) {
    display: none;
  }
}
</style>
