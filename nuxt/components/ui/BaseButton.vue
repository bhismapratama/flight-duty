<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost';
    type?: 'button' | 'submit';
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
  },
);
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[`is-${variant}`, { 'is-block': block }]"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading" class="spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  min-height: 48px;
  padding: 0 $space-6;
  border-radius: $radius-pill;
  font-weight: 700;
  font-size: 0.95rem;
  transition:
    background-color $transition-fast,
    opacity $transition-fast,
    transform $transition-fast;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.is-block {
    width: 100%;
  }

  &.is-primary {
    background: $color-red;
    color: $color-surface;

    &:hover:not(:disabled) {
      background: $color-red-hover;
    }
  }

  &.is-secondary {
    background: $color-surface;
    color: $color-navy;
    border: 1px solid $color-border;

    &:hover:not(:disabled) {
      background: $color-muted;
    }
  }

  &.is-ghost {
    color: $color-navy;
    min-height: $tap-target;
    padding: 0 $space-3;

    &:hover:not(:disabled) {
      background: $color-muted;
    }
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: base-button-spin 0.7s linear infinite;
  }
}

@keyframes base-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
