<script setup lang="ts">
import { FileText } from '@lucide/vue';
import type { ExpiryStatus, PilotDocument } from '~/types/entities/document';

const props = defineProps<{ document: PilotDocument }>();

const TONES: Record<ExpiryStatus, 'success' | 'warning' | 'danger'> = {
  safe: 'success',
  soon: 'warning',
  expired: 'danger',
};

const badgeLabel = computed(() => {
  const days = props.document.daysRemaining;
  if (props.document.status === 'expired') {
    return days === 0 ? 'Expires today' : `Expired ${pluralize(Math.abs(days), 'day')} ago`;
  }
  if (props.document.status === 'soon') {
    return `${pluralize(days, 'day')} left`;
  }
  return 'Valid';
});
</script>

<template>
  <li class="document-item">
    <span class="icon" :class="`is-${TONES[document.status]}`" aria-hidden="true">
      <FileText :size="18" />
    </span>
    <div class="body">
      <p class="label">{{ document.label }}</p>
      <div class="meta">
        <p class="date">{{ formatDate(document.expiryDate) }}</p>
        <BaseBadge :tone="TONES[document.status]">{{ badgeLabel }}</BaseBadge>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
$tones: (
  success: $color-success,
  warning: $color-warning,
  danger: $color-danger,
);

.document-item {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-3 0;

  & + & {
    border-top: 1px solid $color-border;
  }

  .icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: $radius-md;

    @each $name, $color in $tones {
      &.is-#{$name} {
        color: $color;
        background: rgba($color, 0.12);
      }
    }
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .date {
    font-size: 0.75rem;
    color: $color-text-secondary;
  }
}
</style>
