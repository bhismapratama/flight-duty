<script setup lang="ts">
import { CircleAlert, RefreshCw } from '@lucide/vue';

withDefaults(defineProps<{ message?: string | null; compact?: boolean }>(), {
  message: null,
  compact: false,
});

defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="error-state" :class="{ 'is-compact': compact }" role="alert">
    <CircleAlert class="icon" :size="compact ? 18 : 28" aria-hidden="true" />
    <p class="message">{{ message ?? 'Something went wrong. Please try again.' }}</p>
    <button type="button" class="retry" @click="$emit('retry')">
      <RefreshCw :size="14" aria-hidden="true" />
      Retry
    </button>
  </div>
</template>

<style scoped lang="scss">
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  padding: $space-6 $space-4;
  text-align: center;
  color: $color-text-secondary;

  .icon {
    color: $color-danger;
  }

  .message {
    font-size: 0.875rem;
  }

  .retry {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 $space-4;
    border-radius: $radius-pill;
    background: $color-muted;
    color: $color-navy;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &.is-compact {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: $space-3;
    text-align: left;
  }
}
</style>
