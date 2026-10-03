<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue';
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  title: string;
  subtitle?: string;
  back?: RouteLocationRaw;
  wide?: boolean;
}>();
</script>

<template>
  <header class="page-header" :class="{ 'is-wide': wide }">
    <div class="inner">
      <NuxtLink v-if="back" :to="back" class="back" aria-label="Back">
        <ChevronLeft :size="22" aria-hidden="true" />
      </NuxtLink>
      <div class="titles">
        <h1 class="title">{{ title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: $space-2;
  background: rgba($color-bg, 0.9);
  backdrop-filter: blur(12px);
  @include safe-area-top;

  .inner {
    display: flex;
    align-items: center;
    gap: $space-3;
    min-height: 64px;
    padding: $space-3 $space-4;
    @include page-width;
  }

  .back {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border: 1px solid $color-border;
    border-radius: 50%;
    background: $color-surface;
    color: $color-navy;
  }

  .titles {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .back + .titles .title {
    font-size: 1.125rem;
  }

  .subtitle {
    margin-top: 2px;
    font-size: 0.8125rem;
    color: $color-text-secondary;
  }

  @media (min-width: 768px) {
    .inner {
      padding-inline: 0;
    }
  }

  @media (min-width: 1024px) {
    &.is-wide .inner {
      max-width: $app-max-width;
    }
  }
}
</style>
