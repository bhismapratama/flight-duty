<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'success' | 'warning' | 'danger' | 'neutral' }>(), {
  tone: 'neutral',
});
</script>

<template>
  <span class="base-badge" :class="`is-${tone}`">
    <span class="dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped lang="scss">
@use 'sass:color';

$tones: (
  success: $color-success,
  warning: $color-warning,
  danger: $color-danger,
  neutral: $color-text-secondary,
);

.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: $radius-pill;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  @each $name, $color in $tones {
    &.is-#{$name} {
      color: color.adjust($color, $lightness: -14%);
      background: rgba($color, 0.14);
    }
  }
}
</style>
