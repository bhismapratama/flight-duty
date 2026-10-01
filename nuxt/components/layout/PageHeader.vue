<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue';
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  title: string;
  subtitle?: string;
  back?: RouteLocationRaw;
}>();
</script>

<template>
  <header class="page-header">
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
  background: rgba($color-bg, 0.92);
  backdrop-filter: blur(8px);
  @include safe-area-top;

  .inner {
    display: flex;
    align-items: center;
    gap: $space-2;
    min-height: 60px;
    padding: $space-2 $space-4;
  }

  .back {
    display: grid;
    place-items: center;
    width: $tap-target;
    height: $tap-target;
    margin-left: -$space-3;
    border-radius: 50%;
    color: $color-navy;
  }

  .titles {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .subtitle {
    font-size: 0.8rem;
    color: $color-text-secondary;
  }
}
</style>
