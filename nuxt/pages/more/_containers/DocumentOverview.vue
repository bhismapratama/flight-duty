<script setup lang="ts">
import type { ExpiryStatus } from '~/types/entities/document';

const { documents, status, errorMessage, refresh } = useDocuments();

const GROUPS: { status: ExpiryStatus; label: string }[] = [
  { status: 'expired', label: 'Expired' },
  { status: 'soon', label: 'Expiring soon' },
  { status: 'safe', label: 'Valid' },
];

const counts = computed(() =>
  GROUPS.map(group => ({
    ...group,
    count: documents.value?.items.filter(item => item.status === group.status).length ?? 0,
  })),
);
</script>

<template>
  <section class="document-overview" aria-labelledby="document-overview-title">
    <header class="header">
      <h2 id="document-overview-title" class="title">Documents</h2>
    </header>

    <BaseCard>
      <ErrorState v-if="status === 'error'" compact :message="errorMessage" @retry="refresh()" />

      <ul v-else-if="documents" class="stats">
        <li
          v-for="group in counts"
          :key="group.status"
          class="stat"
          :class="[`is-${group.status}`, { 'is-empty': group.count === 0 }]"
        >
          <span class="count">{{ group.count }}</span>
          <span class="label">{{ group.label }}</span>
        </li>
      </ul>

      <div v-else class="stats" aria-hidden="true">
        <div v-for="group in GROUPS" :key="group.status" class="stat">
          <BaseSkeleton width="22px" height="26px" radius="6px" />
          <BaseSkeleton width="70%" height="10px" radius="4px" />
        </div>
      </div>
    </BaseCard>
  </section>
</template>

<style scoped lang="scss">
@use 'sass:color';

$tones: (
  expired: $color-danger,
  soon: $color-warning,
  safe: $color-success,
);

.document-overview {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: $space-2;
  }

  .title {
    @include section-title;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 $space-3;

    &:first-child {
      padding-left: 0;
    }

    & + .stat {
      border-left: 1px solid $color-border;
    }

    @each $name, $color in $tones {
      &.is-#{$name} .count {
        color: color.adjust($color, $lightness: -12%);
      }
    }

    &.is-empty .count {
      color: $color-text-secondary;
    }
  }

  .count {
    font-size: 1.5rem;
    line-height: 1.2;
    @include numeric;
  }

  .label {
    font-size: 0.75rem;
    color: $color-text-secondary;
  }
}
</style>
